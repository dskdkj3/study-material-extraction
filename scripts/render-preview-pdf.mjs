#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const runDir = process.argv[2];
if (!runDir) {
  console.error("usage: node scripts/render-preview-pdf.mjs <run-dir>");
  process.exit(2);
}

const previewDir = path.join(runDir, "preview");
if (!fs.existsSync(previewDir)) {
  console.error(`missing preview directory: ${previewDir}`);
  process.exit(2);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
fs.copyFileSync(path.join(scriptDir, "print.css"), path.join(previewDir, "print.css"));

const browser = process.env.PREVIEW_BROWSER || findBrowser();
if (!browser) {
  console.error(
    "missing browser: put chromium/brave on PATH, or run with `nix shell nixpkgs#chromium -c node scripts/render-preview-pdf.mjs <run-dir>`",
  );
  process.exit(2);
}

const virtualTimeBudget = process.env.PREVIEW_VIRTUAL_TIME_BUDGET_MS || "60000";
const renderTargets = [
  ["questions-preview.md", "questions-preview.html", "questions-preview.pdf", "仅题目"],
  ["answers-preview.md", "answers-preview.html", "answers-preview.pdf", "多解法参考答案"],
  ["guided-solutions-preview.md", "guided-solutions-preview.html", "guided-solutions-preview.pdf", "详解"],
  ["teaching-preview.md", "teaching-preview.html", "teaching-preview.pdf", "拓展讲解"],
  ["variants-preview.md", "variants-preview.html", "variants-preview.pdf", "A-B卷差异"],
  ["corrections-preview.md", "corrections-preview.html", "corrections-preview.pdf", "纠错清单"],
];

for (const [markdown, html, pdf, title] of renderTargets) {
  if (!fs.existsSync(path.join(previewDir, markdown))) continue;
  renderHtml(markdown, html, title);
  renderPdf(html, pdf);
  console.log(`rendered ${pdf}`);
}

function renderHtml(markdown, html, title) {
  run(
    "pandoc",
    [
      markdown,
      "--standalone",
      "--from",
      "markdown+tex_math_dollars+tex_math_single_backslash",
      "--to",
      "html5",
      "--mathjax=https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml-full.js",
      "--css",
      "print.css",
      "--metadata",
      "title=",
      "--metadata",
      `pagetitle=${title}`,
      "-o",
      html,
    ],
    `${path.basename(html, ".html")}.pandoc`,
  );
}

function renderPdf(html, pdf) {
  const htmlUrl = pathToFileURL(path.join(previewDir, html)).href;
  run(
    browser,
    [
      "--headless",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--run-all-compositor-stages-before-draw",
      `--virtual-time-budget=${virtualTimeBudget}`,
      "--no-pdf-header-footer",
      `--print-to-pdf=${path.join(previewDir, pdf)}`,
      htmlUrl,
    ],
    path.basename(pdf, ".pdf"),
  );
}

function run(command, args, logBase) {
  const result = spawnSync(command, args, {
    cwd: previewDir,
    encoding: "utf8",
    env: {
      ...process.env,
      DBUS_SESSION_BUS_ADDRESS: process.env.DBUS_SESSION_BUS_ADDRESS || "disabled:",
    },
  });

  fs.writeFileSync(path.join(previewDir, `${logBase}.stdout.log`), result.stdout || "");
  fs.writeFileSync(path.join(previewDir, `${logBase}.stderr.log`), result.stderr || "");

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}; see preview/${logBase}.stderr.log`);
  }
}

function findBrowser() {
  for (const candidate of ["brave", "brave-browser", "chromium", "chromium-browser", "google-chrome", "google-chrome-stable"]) {
    const result = spawnSync("sh", ["-c", `command -v ${candidate}`], { encoding: "utf8" });
    if (result.status === 0) return result.stdout.trim();
  }
  return "";
}
