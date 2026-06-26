# Design Standard

This file defines the default visual style for generated study-material PDFs. It is intentionally practical: Markdown remains the source of truth, and PDF styling should be reproducible by the runbook.

The visual baseline is the already published `2024-06 高等数学一（II）期末真题` PDF set. New PDFs should match that set unless a deliberate collection-wide redesign is approved.

## Page Shape

- Use A4 paper for public PDFs.
- Primary renderer: Pandoc HTML + MathJax + headless Brave/Chromium.
- CSS: repository `scripts/print.css`.
- Expected PDF producer shape: Chrome/Skia, not LaTeX/xdvipdfmx.
- Do not add visible body headers, footers, or centered page numbers. The 2024-06 PDFs have clean A4 pages without LaTeX-style footer numbers.
- The first visible title should be the reader-facing exam title from `display_title`; it must not contain `草稿`, internal slugs, or source filenames.

Reference command shape:

```sh
node scripts/build-preview-markdown.mjs /srv/xsy-agent-share/pdf-extraction/<run-slug>
nix shell nixpkgs#chromium -c node scripts/render-preview-pdf.mjs /srv/xsy-agent-share/pdf-extraction/<run-slug>
```

LaTeX PDF output is only a temporary diagnostic fallback. It must not be used for public/review PDFs that are meant to match the house style.

## Heading Hierarchy

Generated combined previews should use this hierarchy:

```md
# 2025-06 高等数学一（II）期末真题（B卷）多解法参考答案

## 一、单项选择题

## 1. 累次积分可以写成
```

- Part headings such as `一、单项选择题` are level 2.
- Problem headings are also level 2 in combined previews. This intentionally matches the 2024-06 PDFs where every problem title uses the blue left-rule heading style.
- Problem headings must be faithful to the original prompt. Do not use invented type labels such as `小圆域二重积分极限` when the original prompt is simply a formula blank.
- Keep the complete original prompt in the body under the heading.

## Multiple-Choice Layout

- Keep option labels close to their formulas.
- For long formula options, prefer one option per paragraph:

  ```md
  A. $\displaystyle ...$

  B. $\displaystyle ...$
  ```

- Do not write each option as a bare label followed by a separate display equation unless the formula is too tall to fit inline. That layout creates excessive vertical whitespace in LaTeX PDFs.

## Solution Surfaces

- `answers.md`: concise reference answers. Include multiple methods only when the method is genuinely useful.
- `guided-solutions.md`: detailed walkthrough. Expand the recommended mainline and selected alternate methods.
- `teaching.md`: transfer and method-choice notes. Do not repeat every guided step.
- `variants.md`: A/B volume or source-variant content, separate from the main paper.
- `corrections.md`: source defects and publication notes.

## Tables And Lists

- Keep tables narrow enough for A4. If a table contains long formulas, prefer a list.
- Avoid nested lists containing display equations when a small subsection would read better.
- In correction notes, prefer subsection headings such as `来源写法` / `本版修正` over one large bullet list with embedded display equations.

## Validation

Before release:

- inspect the first page and the last page of long PDFs;
- inspect any page with a wide table or long multiple-choice options;
- run `pdfinfo` and confirm the renderer is Chrome/Skia for release PDFs;
- run `pdftotext` on at least one early page and one late page;
- run `mat2 --show` and record whether metadata was cleaned or only audited;
- ensure page counts and hashes in `manifest.json` match the final files.
