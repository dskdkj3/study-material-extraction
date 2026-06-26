# Preview PDF Standard

PDF previews are generated artifacts for reading and review. They are not canonical content.

## Preview Types

Default previews:

- `questions-preview.pdf`: clean question-only edition.
- `answers-preview.pdf`: combined question plus multi-method reference-answer draft.
- `guided-solutions-preview.pdf`: combined question plus step-by-step guided solutions, including selected alternate-method walkthroughs when useful.
- `teaching-preview.pdf`: combined question plus transfer and extension notes, when `teaching.md` exists.
- `corrections-preview.pdf`: source-correction record, when `corrections.md` exists and a release/review artifact is useful.

Do not generate an answer PDF that contains only answers for human review by default. Readers need the question context.

Do not merge guided solutions or teaching explanations into `answers-preview.pdf`. Multi-method reference answers, guided solutions, and transfer notes optimize for different reading modes.

Do not merge source-correction records into `answers-preview.pdf` or `guided-solutions-preview.pdf` by default. Corrections support quality review and publication notes; they are not part of the ordinary study flow.

`teaching-preview.pdf` may be topic-based instead of problem-by-problem. If `teaching.md` uses numeric problem sections, combine those sections with their prompts. If it uses topical sections, include a compact reviewed-problem index first, then render the topical document.

## Heading Rules

Question-only preview:

```md
## 1. 求三重积分 $I=\iiint_\Omega ...$
```

Combined answer or guided-solution preview:

```md
## 1. 求三重积分 $I=\iiint_\Omega ...$

### 解法 A：球对称性
```

Avoid meaningless headings such as `1. 题目` or `1. 题目与答案` in rendered previews. The problem heading should carry the problem itself, or a concise problem summary when the full prompt is too long.

If a problem has multiple subquestions, use a concise problem summary in the heading when helpful, then render the complete subquestions as body text below it. Do not flatten `（1）...` and `（2）...` into one long heading.

For fill-in problems, headings must come from the original prompt: use the blank sentence or a literal prompt fragment. Do not invent topic labels such as `写出曲面投影区域`, `求 q(x)`, or `求幂级数收敛域`.

The source `questions.md` may use a meaningful second-level heading such as `## 11. 参数反常积分：一致收敛与积分计算` for this purpose. Plain headings such as `## 11. 题目` are ignored by the preview builder.

If there is only one answer method, omit `解法 A` and use a descriptive method heading:

```md
### 按区域直接积分
```

## Title Rules

Use a reader-facing title, preferably from `display_title` in `questions.md` frontmatter. The title should include the exam date slug when it is known or reasonably inferred, for example:

```yaml
display_title: "2024-06 高等数学一（II）期末真题"
```

Do not put `草稿` in the PDF title or first-level heading. Draft or review status belongs in frontmatter, the material README, `manifest.json`, or a short status note, not in the visible title.

## Typography

Default goals:

- A4 page.
- Margins around `16-22mm`.
- Chinese serif body font and sans-serif headings.
- MathJax or equivalent high-quality math rendering.
- Display formulas for long formulas.
- No browser default headers, footers, local file paths, or timestamps.
- Use the CSS header/footer from `scripts/print.css`: short low-contrast course header, centered `第 n / m 页` footer, no dates or filesystem paths.
- Subtle semantic color only: use color to separate problem prompts, notes, and table headers; do not make the page feel like a slide deck.
- Avoid repeated labels such as `答案` under every problem when the surrounding preview already establishes that it is a solution document.

## Design References

Use these references as guidance, not as rigid templates:

- MDN `@page`: printed pages need explicit page size, margins, and print-specific layout rules.
- WCAG contrast guidance: accent colors must not reduce text readability.
- Butterick's Practical Typography: line spacing and hierarchy should serve reading, not decoration.
- The Linux.do typography terminology post: useful vocabulary for discussing typography with agents, especially type classification, spacing, hierarchy, and density.

For this workflow, prefer a restrained handout style: serif body text, sans-serif headings, thin rules, a single accent color, and light note blocks. Avoid decorative cards, heavy backgrounds, or dense color systems in math-heavy PDFs.

## Recommended Current Renderer

The house style is the 2024-06 release style: Pandoc HTML + MathJax + headless Brave/Chromium using `scripts/print.css`.

1. Generate preview Markdown with:

   ```sh
   node scripts/build-preview-markdown.mjs /srv/xsy-agent-share/pdf-extraction/<run-slug>
   ```

2. Render HTML and PDF with the repository script:

   ```sh
   nix shell nixpkgs#chromium -c node scripts/render-preview-pdf.mjs /srv/xsy-agent-share/pdf-extraction/<run-slug>
   ```

   If Brave/Chromium is already on `PATH`, the `nix shell` wrapper is optional. To force a specific browser, set `PREVIEW_BROWSER=/path/to/brave` or `PREVIEW_BROWSER=/path/to/chromium`.

The script renders every existing `*-preview.md` file under `preview/`, writes matching HTML files, and prints PDFs with these Chrome-family flags:

```text
--headless
--disable-gpu
--disable-dev-shm-usage
--no-sandbox
--run-all-compositor-stages-before-draw
--virtual-time-budget=60000
--no-pdf-header-footer
```

`--no-pdf-header-footer` disables Chromium's default print furniture only. The release style still expects the CSS `@page` header/footer/page numbers defined in `scripts/print.css`.

Headless Brave/Chromium may print DBus or authorization warnings on stderr in the Agent environment; if the PDF is written and visual checks pass, treat those warnings as renderer noise and record them as a caveat rather than a failure.

Record the renderer as `pandoc_html_mathjax_plus_chromium_headless` or `pandoc_html_mathjax_plus_brave_headless` in `manifest.json`. Release/review PDFs should have Chrome/Skia provenance in `pdfinfo`, matching the 2024-06 style.

### LaTeX Fallback

If headless Brave/Chromium stalls or cannot print in the current Agent environment, Pandoc + `xelatex` may be used only as a temporary diagnostic fallback. It does not match the 2024-06 release style and must not be used as the final public/review PDF unless that mismatch is explicitly accepted and recorded.

First normalize preview Markdown for Pandoc's LaTeX reader:

```sh
node scripts/build-pdf-markdown.mjs /srv/xsy-agent-share/pdf-extraction/<run-slug>
```

Then render each PDF from `preview/pdf-md/`:

```sh
pandoc preview/pdf-md/answers-preview.md \
  --from markdown+tex_math_dollars+tex_math_single_backslash \
  --pdf-engine=xelatex \
  -V documentclass=ctexart \
  -V classoption=11pt \
  -V papersize=a4 \
  -V geometry:margin=20mm \
  -V pagestyle=plain \
  -V colorlinks=false \
  --metadata title= \
  -o preview/answers-preview.pdf
```

Use the same command shape for the other preview files. Record the renderer as `pandoc + xelatex/ctexart fallback` in `manifest.json`, and mark the preview as style-nonconforming until it is rebuilt with the Chrome/Skia renderer.

The normalization step is needed because preview Markdown may contain display math or option labels in a shape that browser Markdown tolerates but Pandoc LaTeX parses differently. It removes blank lines inside `$$ ... $$` blocks and renders bare `A.` / `B.` / `C.` / `D.` option labels as ordinary text, not ordered-list markers.

TeX-based rendering is acceptable for quick local diagnosis when the required CJK/LaTeX stack is already available. Do not publish or hand off those PDFs as matching the house style.

## Validation

For every generated PDF:

- run `pdfinfo` and record page count;
- visually inspect the first page and any likely overflow page;
- for long answer/guided PDFs, visually inspect the last page and confirm it contains the expected final problem, not an early problem with later content only present in the text layer;
- check that math is rendered, not printed as raw LaTeX;
- check that visible titles use the reader-facing exam title, not an internal run slug, old filename shorthand, or a title containing `草稿`;
- check that CSS header/footer/page numbers are visible and subtle, and that no browser-default path/date/header leaked in;
- check that `pdfinfo` shows a Chrome/Skia renderer for release/review PDFs;
- check that multi-part questions keep their line breaks, or use a concise summary heading with the original subquestions below it;
- run a metadata audit before public release, for example `mat2 --show *.pdf`;
- do not blindly publish `mat2 --inplace` output for PDFs: it may remove useful text layers or search/copy behavior. If any metadata cleaning tool is used, re-check page counts, visible screenshots, `pdftotext` output, and hashes before replacing release assets;
- update `manifest.json` with preview path, pages, sha256, renderer, and caveats.

## Metadata Audit

The default release gate is audit-first:

```sh
nix shell nixpkgs#mat2 -c mat2 --show *.pdf
pdfinfo file.pdf
pdftotext -f 1 -l 1 file.pdf -
```

Acceptable metadata includes generic PDF format information and renderer provenance when retaining search/copy text is more valuable than aggressive anonymisation. Unacceptable metadata includes local absolute paths, usernames, source checkout paths, private URLs, tokens, comments, hidden attachments, JavaScript, or timestamps that are not intended to be public.

If cleanup is required, prefer the least destructive tool and prove the cleaned PDF still has:

- the same expected page count;
- visible math and CJK text in screenshots;
- usable text extraction for at least first page and a late page;
- no new metadata leak in `mat2 --show` / `pdfinfo`;
- updated `SHA256SUMS.txt` and manifest hashes.
