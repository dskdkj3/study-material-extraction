#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const runDir = process.argv[2];
if (!runDir) {
  console.error("usage: node scripts/build-preview-markdown.mjs <run-dir>");
  process.exit(2);
}

function readText(file) {
  return fs.readFileSync(path.join(runDir, file), "utf8");
}

function stripFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) return { frontmatter: {}, body: markdown };
  const end = markdown.indexOf("\n---\n", 4);
  if (end === -1) return { frontmatter: {}, body: markdown };
  return {
    frontmatter: parseFrontmatter(markdown.slice(4, end)),
    body: markdown.slice(end + 5),
  };
}

function parseFrontmatter(text) {
  const result = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[match[1]] = value;
  }
  return result;
}

function sectionsByProblem(markdown) {
  const { body } = stripFrontmatter(markdown);
  const lines = body.split(/\r?\n/);
  const sections = new Map();
  let current = null;
  let buffer = [];

  function flush() {
    if (current !== null) sections.set(current, buffer.join("\n").trim());
  }

  for (const line of lines) {
    const match = line.match(/^##\s+(\d+)\.\s+/);
    if (match) {
      flush();
      current = Number(match[1]);
      buffer = [];
    } else if (current !== null) {
      buffer.push(line);
    }
  }
  flush();
  return sections;
}

function headingsByProblem(markdown) {
  const { body } = stripFrontmatter(markdown);
  const headings = new Map();

  for (const line of body.split(/\r?\n/)) {
    const match = line.match(/^##\s+(\d+)\.\s*(.*)$/);
    if (!match) continue;
    const heading = match[2].trim();
    if (heading && !["题目", "参考答案", "拓展讲解", "主线详解"].includes(heading)) {
      headings.set(Number(match[1]), heading);
    }
  }

  return headings;
}

function dropStatusBlockquotes(markdown) {
  const lines = markdown.split("\n");
  const out = [];
  let dropping = false;
  for (const line of lines) {
    if (line.startsWith("> 状态")) {
      dropping = true;
      continue;
    }
    if (dropping && line.startsWith(">")) continue;
    dropping = false;
    out.push(line);
  }
  return out.join("\n").trim();
}

function normalizeInlineProblemText(markdown) {
  return markdown
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => `$${math.trim()}$`)
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => `$${math.trim()}$`)
    .replace(/\\displaystyle\s*/g, "")
    .replace(/\\dfrac\b/g, "\\frac")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[。；;，,]\s*$/u, "");
}

function problemPrompt(markdown) {
  const lines = dropStatusBlockquotes(markdown)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  let firstLine = lines.shift() ?? "";
  if (/^求[：:]?$/u.test(firstLine) && lines.length > 0) {
    firstLine = `${firstLine} ${lines.shift()}`;
  }
  const heading = normalizeInlineProblemText(firstLine);
  const body = lines.map((line) => normalizeInlineProblemText(line)).filter(Boolean).join("\n\n");
  return { heading, body };
}

function normalizeAnswerHeadings(markdown) {
  const methodCount = (markdown.match(/^###\s+解法\s+[A-Z]/gm) ?? []).length;
  let normalized = markdown;
  if (methodCount === 1) {
    normalized = normalized.replace(/^###\s+解法\s+A[：:]\s*/gm, "### ");
    normalized = normalized.replace(/^###\s+解法\s+A\s*$/gm, "");
  }
  return normalized;
}

function withoutTopLevelTitle(markdown) {
  const { body } = stripFrontmatter(markdown);
  return body.trimStart().replace(/^#\s+.*(?:\r?\n)+/, "").trim();
}

function writeCorrectionsPreview(previewDir, title, correctionsMd) {
  if (!correctionsMd) return;

  const correctionsOut = [
    "---",
    `title: "${title}来源纠错记录"`,
    'kind: "source_corrections_preview"',
    'source_corrections: "corrections.md"',
    'status: "draft"',
    "---",
    "",
    `# ${title}来源纠错记录`,
    "",
    "> 记录来源解析中的笔误、错解或排版错误；用于质量审阅和发布说明，不替代原始材料复核。",
    "",
    dropStatusBlockquotes(withoutTopLevelTitle(correctionsMd)),
    "",
  ];

  fs.writeFileSync(path.join(previewDir, "corrections-preview.md"), correctionsOut.join("\n").replace(/\n{3,}/g, "\n\n"));
}

function displayTitle(frontmatter) {
  const raw = frontmatter.display_title || frontmatter.publication_title || frontmatter.title || frontmatter.course || path.basename(runDir);
  return raw
    .replace(/\s+(questions|answers)\s+draft$/i, "")
    .replace(/\s+题目草稿$/u, "")
    .replace(/\s+答案草稿$/u, "")
    .replace(/\s+参考答案草稿$/u, "")
    .replace(/\s+多解法参考答案草稿$/u, "")
    .replace(/\s+详解草稿$/u, "")
    .replace(/\s+主线详解草稿$/u, "")
    .replace(/\s+教学讲解草稿$/u, "")
    .replace(/\s+拓展讲解草稿$/u, "")
    .trim();
}

function pushProblemHeading(out, n, markdown, questionHeadings, level = "##") {
  const customHeading = questionHeadings.get(n);
  const { heading, body } = problemPrompt(markdown);
  out.push(`${level} ${n}. ${customHeading || heading || "题目"}`);
  if (customHeading) {
    out.push("");
    out.push([heading, body].filter(Boolean).join("\n\n"));
  } else if (body) {
    out.push("");
    out.push(body);
  }
}

function pushProblemIndex(out, problemNumbers, questions, questionHeadings) {
  out.push("## 题目索引");
  out.push("");

  for (const n of problemNumbers) {
    pushProblemHeading(out, n, questions.get(n) ?? "", questionHeadings, "###");
    out.push("");
  }
}

function writePreviewFiles() {
  const questionsMd = readText("questions.md");
  const answersPath = path.join(runDir, "answers.md");
  const guidedPath = path.join(runDir, "guided-solutions.md");
  const teachingPath = path.join(runDir, "teaching.md");
  const correctionsPath = path.join(runDir, "corrections.md");
  const answersMd = fs.existsSync(answersPath) ? fs.readFileSync(answersPath, "utf8") : "";
  const guidedMd = fs.existsSync(guidedPath) ? fs.readFileSync(guidedPath, "utf8") : "";
  const teachingMd = fs.existsSync(teachingPath) ? fs.readFileSync(teachingPath, "utf8") : "";
  const correctionsMd = fs.existsSync(correctionsPath) ? fs.readFileSync(correctionsPath, "utf8") : "";
  const { frontmatter } = stripFrontmatter(questionsMd);
  const answerFrontmatter = answersMd ? stripFrontmatter(answersMd).frontmatter : {};
  const title = displayTitle(frontmatter);

  const questions = sectionsByProblem(questionsMd);
  const questionHeadings = headingsByProblem(questionsMd);
  const answers = answersMd ? sectionsByProblem(answersMd) : new Map();
  const guided = guidedMd ? sectionsByProblem(guidedMd) : new Map();
  const problemNumbers = [...questions.keys()].sort((a, b) => a - b);
  const previewDir = path.join(runDir, "preview");
  fs.mkdirSync(previewDir, { recursive: true });
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  fs.copyFileSync(path.join(scriptDir, "print.css"), path.join(previewDir, "print.css"));

  const questionOut = [
    "---",
    `title: "${title}（仅题目）"`,
    'kind: "questions_only_preview"',
    'source_questions: "questions.md"',
    'status: "reviewed"',
    "---",
    "",
    `# ${title}（仅题目）`,
    "",
  ];

  for (const n of problemNumbers) {
    pushProblemHeading(questionOut, n, questions.get(n) ?? "", questionHeadings);
    questionOut.push("");
  }

  fs.writeFileSync(path.join(previewDir, "questions-preview.md"), questionOut.join("\n"));

  if (answersMd) {
    const sourceReferenceUsed = answerFrontmatter.source_reference_used === true || answerFrontmatter.source_reference_used === "true";
    const answerIntro = sourceReferenceUsed
      ? "> 状态：Agent 独立解题后做过 reference-check；`source.md` 来源解析仅作参考，不视为权威答案。"
      : "> 状态：Agent 独立解题版；题干来自已复核的 `questions.md`，答案未参考 `source.md` 中的来源解析。";
    const answerOut = [
      "---",
      `title: "${title}多解法参考答案"`,
      'kind: "answers_with_questions_preview"',
      'source_questions: "questions.md"',
      'source_answers: "answers.md"',
      `source_reference_used: ${sourceReferenceUsed}`,
      'status: "agent_checked_draft"',
      "---",
      "",
      `# ${title}多解法参考答案`,
      "",
      answerIntro,
      "",
    ];

    for (const n of problemNumbers) {
      pushProblemHeading(answerOut, n, questions.get(n) ?? "", questionHeadings);
      answerOut.push("");
      answerOut.push(normalizeAnswerHeadings(answers.get(n) ?? "_暂无参考答案。_"));
      answerOut.push("");
    }

    fs.writeFileSync(path.join(previewDir, "answers-preview.md"), answerOut.join("\n").replace(/\n{3,}/g, "\n\n"));
  }

  if (guidedMd) {
    const guidedOut = [
      "---",
      `title: "${title}详解"`,
      'kind: "guided_solutions_with_questions_preview"',
      'source_questions: "questions.md"',
      'source_guided_solutions: "guided-solutions.md"',
      'status: "agent_checked_draft"',
      "---",
      "",
      `# ${title}详解`,
      "",
      "> 逐题展开一条推荐路径，并选讲值得学习的备用解法。题目文本已复核；完整多解法参考见同套资料的参考答案版。",
      "",
    ];

    for (const n of problemNumbers) {
      pushProblemHeading(guidedOut, n, questions.get(n) ?? "", questionHeadings);
      guidedOut.push("");
      guidedOut.push(normalizeAnswerHeadings(guided.get(n) ?? "_暂无详解。_"));
      guidedOut.push("");
    }

    fs.writeFileSync(path.join(previewDir, "guided-solutions-preview.md"), guidedOut.join("\n").replace(/\n{3,}/g, "\n\n"));
  }

  writeCorrectionsPreview(previewDir, title, correctionsMd);

  if (teachingMd) {
    const teaching = sectionsByProblem(teachingMd);
    const teachingHeadings = headingsByProblem(teachingMd);
    const teachingProblemNumbers = [...teaching.keys()].filter((n) => questions.has(n)).sort((a, b) => a - b);
    const teachingIntro =
      teachingProblemNumbers.length > 0
        ? "> 面向迁移、方法选择和常见误区的补充讲解；题目文本已复核，不重复详解版的每一步推导。未出现的题目表示本版暂不单独拓展。"
        : "> 面向迁移、方法选择和常见误区的专题讲解；题目文本已复核，不重复详解版的每一步推导。";
    const teachingOut = [
      "---",
      `title: "${title}拓展讲解"`,
      'kind: "teaching_with_questions_preview"',
      'source_questions: "questions.md"',
      'source_teaching: "teaching.md"',
      'status: "agent_checked_draft"',
      "---",
      "",
      `# ${title}拓展讲解`,
      "",
      teachingIntro,
      "",
    ];

    if (teachingProblemNumbers.length > 0) {
      for (const n of teachingProblemNumbers) {
        pushProblemHeading(teachingOut, n, questions.get(n) ?? "", teachingHeadings);
        teachingOut.push("");
        teachingOut.push(teaching.get(n));
        teachingOut.push("");
      }
    } else {
      pushProblemIndex(teachingOut, problemNumbers, questions, questionHeadings);
      teachingOut.push(dropStatusBlockquotes(withoutTopLevelTitle(teachingMd)));
      teachingOut.push("");
    }

    fs.writeFileSync(path.join(previewDir, "teaching-preview.md"), teachingOut.join("\n").replace(/\n{3,}/g, "\n\n"));
  }
}

writePreviewFiles();
