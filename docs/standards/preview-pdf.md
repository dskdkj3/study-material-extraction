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
- No browser headers, footers, local file paths, or timestamps.
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

The current robust path for Markdown with LaTeX math is:

1. Generate preview Markdown with:

   ```sh
   node scripts/build-preview-markdown.mjs /srv/xsy-agent-share/pdf-extraction/<run-slug>
   ```

2. Generate HTML with Pandoc and MathJax:

   ```sh
   pandoc preview/answers-preview.md \
     --standalone \
     --from markdown+tex_math_dollars+tex_math_single_backslash \
     --to html5 \
     --mathjax=https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml-full.js \
     --css=print.css \
     --metadata title= \
     --metadata pagetitle="多解法参考答案" \
     -o preview/answers-preview.html
   ```

   Use the same command shape for `guided-solutions-preview.md`, `teaching-preview.md`, `questions-preview.md`, and `corrections-preview.md`, changing the input file, output file, and `pagetitle`.

3. Print with a headless Chromium-family browser:

   ```sh
   chromium \
     --headless \
     --disable-gpu \
     --no-sandbox \
     --allow-file-access-from-files \
     --run-all-compositor-stages-before-draw \
     --virtual-time-budget=60000 \
     --no-pdf-header-footer \
     --print-to-pdf=preview/answers-preview.pdf \
     "file://$(pwd)/preview/answers-preview.html"
   ```

On `x1c9`, Brave is an already-available Chromium-family browser and has been verified for this workflow. If `chromium` is not on `PATH`, locate Brave with:

```sh
nix eval --raw nixpkgs#brave.outPath
```

Then use `<brave-out-path>/bin/brave` with the same headless print flags above. Headless Brave may print DBus or authorization warnings on stderr in the Agent environment; if the PDF is written and visual checks pass, treat those warnings as renderer noise and record them as a caveat rather than a failure.

TeX-based rendering is acceptable when the required CJK/LaTeX stack is already available. Do not pull a huge TeX closure merely to check a draft if the HTML+MathJax route works.

## Validation

For every generated PDF:

- run `pdfinfo` and record page count;
- visually inspect the first page and any likely overflow page;
- for long answer/guided PDFs, visually inspect the last page and confirm it contains the expected final problem, not an early problem with later content only present in the text layer;
- check that math is rendered, not printed as raw LaTeX;
- check that visible titles use the reader-facing exam title, not an internal run slug, old filename shorthand, or a title containing `草稿`;
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
