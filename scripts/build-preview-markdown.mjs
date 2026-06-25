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

function inlineProblemTitle(markdown) {
  return dropStatusBlockquotes(markdown)
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => `$${math.trim()}$`)
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => `$${math.trim()}$`)
    .replace(/\\displaystyle\s*/g, "")
    .replace(/\\dfrac\b/g, "\\frac")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[。；;，,]\s*$/u, "");
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
  const raw = frontmatter.title || frontmatter.course || path.basename(runDir);
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
    questionOut.push(`## ${n}. ${inlineProblemTitle(questions.get(n) ?? "")}`);
    questionOut.push("");
  }

  fs.writeFileSync(path.join(previewDir, "questions-preview.md"), questionOut.join("\n"));

  if (answersMd) {
    const sourceReferenceUsed = answerFrontmatter.source_reference_used === true || answerFrontmatter.source_reference_used === "true";
    const answerIntro = sourceReferenceUsed
      ? "> 先独立解题，随后参考未复核的 `source.md` 来源解析做 reference-check；`source.md` 不视为权威答案。"
      : "> 独立解题草稿；题干来自已复核的 `questions.md`，答案未参考 `source.md` 中的来源解析。";
    const answerOut = [
      "---",
      `title: "${title}多解法参考答案草稿"`,
      'kind: "answers_with_questions_preview"',
      'source_questions: "questions.md"',
      'source_answers: "answers.md"',
      `source_reference_used: ${sourceReferenceUsed}`,
      'status: "draft"',
      "---",
      "",
      `# ${title}多解法参考答案草稿`,
      "",
      answerIntro,
      "",
    ];

    for (const n of problemNumbers) {
      answerOut.push(`## ${n}. ${inlineProblemTitle(questions.get(n) ?? "")}`);
      answerOut.push("");
      answerOut.push(normalizeAnswerHeadings(answers.get(n) ?? "_暂无参考答案。_"));
      answerOut.push("");
    }

    fs.writeFileSync(path.join(previewDir, "answers-preview.md"), answerOut.join("\n").replace(/\n{3,}/g, "\n\n"));
  }

  if (guidedMd) {
    const guidedOut = [
      "---",
      `title: "${title}详解草稿"`,
      'kind: "guided_solutions_with_questions_preview"',
      'source_questions: "questions.md"',
      'source_guided_solutions: "guided-solutions.md"',
      'status: "draft"',
      "---",
      "",
      `# ${title}详解草稿`,
      "",
      "> 详解草稿；逐题展开一条推荐路径，并选讲值得学习的备用解法。题干来自已复核的 `questions.md`，完整多解法参考见 `answers.md`。",
      "",
    ];

    for (const n of problemNumbers) {
      guidedOut.push(`## ${n}. ${inlineProblemTitle(questions.get(n) ?? "")}`);
      guidedOut.push("");
      guidedOut.push(normalizeAnswerHeadings(guided.get(n) ?? "_暂无详解。_"));
      guidedOut.push("");
    }

    fs.writeFileSync(path.join(previewDir, "guided-solutions-preview.md"), guidedOut.join("\n").replace(/\n{3,}/g, "\n\n"));
  }

  writeCorrectionsPreview(previewDir, title, correctionsMd);

  if (teachingMd) {
    const teaching = sectionsByProblem(teachingMd);
    const teachingOut = [
      "---",
      `title: "${title}拓展讲解草稿"`,
      'kind: "teaching_with_questions_preview"',
      'source_questions: "questions.md"',
      'source_teaching: "teaching.md"',
      'status: "draft"',
      "---",
      "",
      `# ${title}拓展讲解草稿`,
      "",
      "> 拓展迁移草稿；题干来自已复核的 `questions.md`，不重复 `guided-solutions.md` 的每一步详解。",
      "",
    ];

    for (const n of problemNumbers) {
      teachingOut.push(`## ${n}. ${inlineProblemTitle(questions.get(n) ?? "")}`);
      teachingOut.push("");
      teachingOut.push(teaching.get(n) ?? "_暂无拓展讲解。_");
      teachingOut.push("");
    }

    fs.writeFileSync(path.join(previewDir, "teaching-preview.md"), teachingOut.join("\n").replace(/\n{3,}/g, "\n\n"));
  }
}

writePreviewFiles();
