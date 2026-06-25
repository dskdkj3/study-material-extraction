#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const runDir = process.argv[2];
if (!runDir) {
  console.error("usage: node scripts/build-pdf-markdown.mjs <run-dir>");
  process.exit(2);
}

const previewDir = path.join(runDir, "preview");
const outDir = path.join(previewDir, "pdf-md");
fs.mkdirSync(outDir, { recursive: true });

function normalizeForPandocLatex(markdown) {
  const lines = markdown.split(/\r?\n/);
  const out = [];
  let inDisplayMath = false;

  for (let line of lines) {
    if (line.trim() === "$$") {
      if (!inDisplayMath) {
        while (out.length > 0 && out[out.length - 1].trim() === "") out.pop();
        out.push("");
        out.push("$$");
        inDisplayMath = true;
      } else {
        while (out.length > 0 && out[out.length - 1].trim() === "") out.pop();
        out.push("$$");
        out.push("");
        inDisplayMath = false;
      }
      continue;
    }

    if (inDisplayMath && line.trim() === "") continue;

    // Pandoc treats a bare "A." / "B." as an ordered-list marker. In exam
    // options these are labels, so render them as ordinary emphasized text.
    if (!inDisplayMath && /^[A-D]\.$/.test(line.trim())) {
      line = `**${line.trim()}**`;
    }

    out.push(line);
  }

  return out.join("\n").replace(/\n{4,}/g, "\n\n\n");
}

for (const file of fs.readdirSync(previewDir).filter((name) => name.endsWith("-preview.md")).sort()) {
  const input = path.join(previewDir, file);
  const output = path.join(outDir, file);
  fs.writeFileSync(output, normalizeForPandocLatex(fs.readFileSync(input, "utf8")));
  console.log(output);
}
