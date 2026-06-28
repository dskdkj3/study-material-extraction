# PDF Extraction Runbook

This runbook turns one scanned PDF into clean study-material Markdown and generated previews. It is written to support both one-off runs and later batch processing.

## Scope

The default goal is to preserve effective content:

- problems;
- source explanations, when present;
- required figures, tables, plots, and formula layout;
- independent reference answers, when requested;
- guided step-by-step solutions for formal material sets, including selected alternate-method walkthroughs when useful;
- alternate-method discovery records, when reference answers are authored;
- rejected but reusable method records, when a candidate is worth preserving but not suitable for the reference answer;
- flexible teaching notes for transfer, extension, and method comparison, when useful;
- source variants such as A/B volume differences, alternate printed versions, or source-provided variant problems;
- documented corrections to source typos or wrong source answers, when found.

The default goal excludes watermarks, page numbers, advertisements, empty answer boxes, personal-information fields, warning banners, and platform contact text.

## Workspace

Use one run workspace per source file:

```text
/srv/xsy-agent-share/pdf-extraction/<run-slug>/
  source.md
  questions.md
  answers.md
  guided-solutions.md
  alternate-method-discovery.md
  rejected-methods.md
  teaching.md
  variants.md
  corrections.md
  manifest.json
  pages/
  content-crops/
  ocr/
  assets/
  preview/
```

Use a batch manifest at the parent directory:

```text
/srv/xsy-agent-share/pdf-extraction/batch-manifest.json
```

Do not put PDFs, page renders, OCR dumps, generated previews, or crops into this repository.

## Automation Boundary

The current automation target is agent-driven repeatability, not a one-click machine pipeline.

Expected use:

1. A human opens an Agent session.
2. The Agent follows this runbook and repository standards.
3. The Agent writes manifests, Markdown drafts, previews, and review notes into the run workspace.
4. The human reviews the explicit review points.
5. The Agent incorporates review decisions and advances the run stage.

It is acceptable for cropping, OCR lane choice, uncertainty review, answer authoring, and preview inspection to remain interactive. Do not treat missing end-to-end CLI automation as a workflow failure.

## Stage Machine

Use these fixed run stages:

| Stage | Meaning | Next normal step |
| --- | --- | --- |
| `discovered` | Source PDF is registered | Render pages |
| `rendered` | Pages are rendered to images | Crop content blocks |
| `cropped` | Content blocks are cropped and indexed | Run OCR / vision lanes |
| `ocr_draft` | OCR or vision drafts exist | Human/agent review |
| `review_ready` | Review sheet exists with uncertainties | Write canonical Markdown |
| `markdown_draft` | Canonical Markdown such as `source.md`, `questions.md`, `answers.md`, or `guided-solutions.md` exists | Build preview |
| `preview_built` | Preview artifacts exist and are logged | Accept or revise |
| `accepted` | Current extraction is accepted for use | Archive or batch next |

Use `blocked` for missing decisions or materials. Use `failed` for execution failures. Do not use batch `stage` as a substitute for per-problem review status.

## Procedure

1. Register the PDF in `batch-manifest.json` and create `<run-slug>/manifest.json`.
2. Validate manifest shape whenever a manifest is created or materially changed:

   ```sh
   node scripts/validate-manifests.mjs /srv/xsy-agent-share/pdf-extraction/batch-manifest.json /srv/xsy-agent-share/pdf-extraction/<run-slug>
   ```

3. Inspect the PDF:

   ```sh
   pdfinfo source.pdf
   pdftotext -f 1 -l 2 -layout source.pdf -
   pdfimages -list source.pdf
   ```

4. Render pages at a stable DPI:

   ```sh
   pdftoppm -png -r 220 source.pdf pages/page
   ```

5. Crop effective-content blocks into `content-crops/` and record page/bbox metadata in `manifest.json`.
6. Run OCR and vision lanes according to the approved lane policy. Store lane outputs under `ocr/`.
7. Create `ocr-review.md` or an equivalent review sheet listing uncertainties and cross-lane differences.
8. Write canonical Markdown:

   - `source.md`: source problems plus source explanations;
   - `questions.md`: reviewed question-only edition;
   - `answers.md`: independent reference answers, often with multiple useful methods, if requested;
   - `guided-solutions.md`: step-by-step detailed solutions; this is the default formal detailed product once answers are stable, and should include selected alternate-method walkthroughs when useful;
   - `alternate-method-discovery.md`: alternate-method rounds, candidates, verification notes, adoption decisions, and stop reasons, if answers are authored;
   - `rejected-methods.md`: reusable but rejected methods, such as clearly out-of-scope routes or methods that are too hard to learn quickly;
   - `teaching.md`: transfer, extension, method comparison, and problem-family notes, if useful;
   - `variants.md`: source-provided variants such as A/B volume differences, with variant question text and answers or solutions when available;
   - `corrections.md`: confirmed or candidate corrections to source typos, wrong source answers, and source-solution defects.

9. When the source contains A/B volume differences, alternate printed versions, or other source-provided variants, first identify the primary public problem set. Keep that primary set in `questions.md` and `answers.md`. Preserve non-primary variants in `variants.md` with both the variant question text and its answer or solution when available. Do not silently drop variants, do not mix variant questions into the primary problem set, and do not record a normal A/B variant as a correction.

10. After the independent `answers.md` draft, run the alternate-method discovery rounds defined in [Answer Authoring Standard](../standards/answer-authoring.md). The default cap is ten rounds per problem: when a useful method is accepted, update `answers.md` and try another round; when a round finds no useful candidate, stop early for that problem. Prefer one isolated critic/subagent context per problem, batched by the active concurrency limit. Record each round in `alternate-method-discovery.md`, including per-problem context boundary, candidates, verification, adoption decisions, and stop reasons. Add only verified, useful methods to `answers.md`.

   If a rejected candidate is still worth remembering, also add it to `rejected-methods.md`. This is for routes that are mathematically coherent and genuinely different, but not suitable for the reference answer because they are significantly out of scope, hard to learn quickly, too error-prone, or mainly useful as author-side review evidence.

11. During reference checking, update `corrections.md` whenever the source explanation has a material typo or wrong mathematical claim. Keep the original transcription in `source.md`; do not silently rewrite source errors away.

12. Generate or update `guided-solutions.md` after reference answers and alternate-method decisions are stable enough to explain step by step. This is a default output for a formal material set, not an optional experiment. It always expands one recommended path per problem, and every method accepted into `answers.md` should be considered for selected alternate-method expansion. Methods not expanded should have a short reason when the omission may surprise readers.

    Before drafting or revising a guided solution, extract any learner feedback into reusable writing rules, not only local fixes. If the reviewer says a theorem "has not been taught", the guided solution must introduce the theorem's purpose, eligibility conditions, and direction or boundary conventions before applying it. If the reviewer says a computation trick is unclear, the solution must teach the trick as a local mini-recipe before using its result. If the reviewer challenges a remembered fact or shortcut, either derive it in place or explicitly present it only after the derivation as an optional shortcut. Keep this extraction in the relevant standard or review note when it changes future authoring behavior.

    Guided explanations should be learner-facing but not chatty. Do not use self-narration such as "this looks scary"; instead state what object the problem gives, what decision must be made, and what condition controls that decision. Do not force a fixed heading template when natural exposition is clearer, but do make theorem eligibility, orientation, endpoint, sign, and high-error computation rules visible before they are used.

    The Agent owns this guided-solution expansion pass by default. For each method accepted into `answers.md`, record one decision in `guided-solutions.md` or `manifest.json`:

    - `mainline_expanded`: the method is the main walkthrough.
    - `alternate_expanded`: the method is expanded as a selected alternate walkthrough.
    - `reference_only`: the method remains concise in `answers.md`; record why it is not expanded when useful.

    Prefer expanding alternates that are short, safer, easier to master quickly, or give a transferable idea. Keep routine variants, long overkill routes, and methods with little learning gain as `reference_only`.

13. Generate or update `teaching.md` when there is useful transfer value: related problem families, method comparison, short prerequisite refreshers, common traps, or variants. Do not force a teaching note for every problem.

    For public material, run divergent read-only review before finalizing `teaching.md`. Prefer a small set of independent perspectives instead of one context that already knows the current draft:

    - a topic mapper that groups problems into reusable families;
    - a beginner-confusion critic that removes notes which are too obvious, too mechanical, or duplicated from `guided-solutions.md`;
    - a method-transfer reviewer that checks accepted/rejected alternate methods for teachable ideas.

    The main Agent should edit the final file after these passes. Do not concatenate subagent output directly. If the review materially changes the teaching layer, record the accepted, rejected, and moved ideas in `teaching-review.md`.

14. Generate preview Markdown:

   ```sh
   node scripts/build-preview-markdown.mjs /srv/xsy-agent-share/pdf-extraction/<run-slug>
   ```

15. Generate PDF previews using [Preview PDF Standard](../standards/preview-pdf.md). The default release/review renderer is Pandoc HTML + MathJax + headless Brave/Chromium, matching the 2024-06 published style:

   ```sh
   nix shell nixpkgs#chromium -c node scripts/render-preview-pdf.mjs /srv/xsy-agent-share/pdf-extraction/<run-slug>
   ```

   Record the actual renderer in `manifest.json`. Pandoc + `xelatex` is only a temporary diagnostic fallback; do not hand off fallback PDFs as style-matching review/release artifacts unless the mismatch is explicitly accepted and recorded.

16. Spot-check rendered pages visually and update `manifest.json` with preview paths, page counts, hashes, and caveats. Check the output against [Design Standard](../../DESIGN.md): Chrome/Skia output, page shape, heading hierarchy, option spacing, CSS header/footer/page numbers, absence of browser default path/date headers, and any wide formulas or tables. Confirm the question-only PDF renders each problem as `n. <actual prompt>` rather than `n. <topic summary>` followed by a repeated prompt. For fill-in problems, confirm headings come from the original blank sentence or full prompt, not invented topic labels.
17. Re-run manifest validation.
18. Mark the run `accepted` only after the intended content surface has been reviewed. A good preview does not imply mathematical correctness.

## Distribution Handoff

After a run is accepted, prepare a separate public distribution repository according to [Distribution Repository Standard](../standards/distribution-repository.md).

Recommended handoff:

1. Choose a public material path such as `materials/gaoshu1-ii/2024-06-final/`.
2. Copy only reader-facing Markdown, using Chinese public filenames:
   - `questions.md` -> `01-仅题目.md`
   - `answers.md` -> `02-多解法参考答案.md`
   - `guided-solutions.md` -> `03-详解.md`
   - `teaching.md` -> `04-拓展讲解.md`, if useful
   - `variants.md` -> `05-A-B卷差异.md`, if source variants exist
   - `corrections.md` -> `06-纠错清单.md`, if useful
   - a public-safe `manifest.json`
3. Use actual exam month in public naming. If the source says `2023-2024 学年第 2 学期`, the public exam month is normally in 2024, not 2023; state the month assumption in the material README.
4. Remove local absolute paths such as `/srv/xsy-agent-share/...`.
5. Keep raw PDF, crop images, page renders, OCR lane dumps, and temporary logs out of the distribution repository by default.
6. Attach generated PDFs to a GitHub Release with ASCII-safe asset filenames. GitHub can rewrite non-ASCII asset names and create duplicate filename collisions; keep Chinese document names in README/release notes.
7. Optionally provide a convenience ZIP containing the published PDFs and `SHA256SUMS.txt`. Treat the ZIP as a convenience package, not the canonical record; keep each PDF listed separately in README and `manifest.json`. If the ZIP filename carries a human-facing attribution or label, make sure it is only a filename label and does not replace the material metadata.
8. After the release is published, update the material README and `manifest.json` from `pending_upload` to `published`, add the release page URL, add direct download URLs for every published asset, and re-check that no broken or local-only links remain.
9. Make the material README human-readable: tell readers what to open, where PDFs are, and what corrections are known.

## Run Completion Checklist

Before starting the next PDF, the current run should have an explicit answer for each item:

- effective content extracted, with watermarks and page furniture removed;
- `questions.md` reviewed against source images or an explicit review limitation recorded;
- `answers.md` authored independently and status marked honestly;
- alternate-method discovery completed or deliberately skipped with a reason;
- every accepted answer method considered for `guided-solutions.md` expansion;
- `guided-solutions.md` includes a main walkthrough and selected alternate walkthroughs or a clear reference-only list;
- `teaching.md` contains transfer, method comparison, or common-mistake notes rather than duplicating the full guided solution, and divergent review has removed low-value template filler;
- `teaching-review.md` exists when divergent review materially changed `teaching.md`;
- `variants.md` exists when source A/B volumes, alternate printed versions, or source-provided variant problems are detected; non-primary variants include answers or a recorded reason why no answer is available;
- `corrections.md` records confirmed or candidate source defects;
- `questions.md` frontmatter has a reader-facing `display_title`, preview headings preserve multi-subquestion layout, and visible PDF titles do not contain `草稿`;
- preview Markdown and PDF artifacts regenerated after content changes;
- generated PDFs have page counts, hashes, renderer notes, and spot-check status in `manifest.json`;
- release PDFs have passed metadata audit; if metadata was cleaned, text extraction and visual screenshots were revalidated after cleaning;
- public distribution copy has no local absolute paths, raw OCR/crop references, private notes, or broken release links;
- public Markdown filenames are Chinese-reader-facing; GitHub Release PDF asset filenames are ASCII-safe; machine files such as `manifest.json` remain stable;
- release assets are uploaded and public README/manifest contain live links, or `pending_upload` plus `/srv/xsy-agent-share/.../UPLOAD.md` exists;
- any optional ZIP bundle is clearly treated as a convenience package and has its own checksum if it will be published;
- final material status does not overclaim mathematical certification.

## OCR Lane Policy

The default lanes are:

| Lane | Role | Trust boundary |
| --- | --- | --- |
| `tesseract` | offline baseline and layout hint | Do not trust dense math formulas |
| `gpt-5.5` vision | formula/text draft from crops | Use cropped images with `detail: "original"`; still review manually |
| local/Hugging Face model | bake-off candidate | Use only after a sample comparison and explicit adoption |

Use bake-off samples before adopting a new lane. Score `text`, `math`, `layout`, `uncertainty`, and `noise` as `0/1/2`; assign lane roles instead of picking a single absolute winner.

## Review Rules

- Reviewed question text can feed `questions.md` and independent answers.
- Source explanations remain untrusted until separately checked.
- Formula-heavy content must be checked against source crops, not only OCR output.
- Every problem should keep source pages and crop references in `manifest.json`.
- Every preview artifact should be reproducible from Markdown plus scripts/templates.
- Guided solutions are not a substitute for reference answers: they are the detailed learning version of the answer surface, while `answers.md` may remain the broader multi-method reference.
- Teaching explanations are not a substitute for guided solutions: they are a separate transfer surface and may intentionally include prerequisite review, related problem families, method comparison, and common mistakes.

## Mathematical Assurance Boundary

If the human reviewer cannot audit mathematical correctness, do not mark answers or guided solutions as mathematically certified.

Use explicit statuses instead:

- `questions.md`: may be `reviewed` after source-image/text review.
- `answers.md`: use `agent_checked_draft`, `reference_checked_draft`, or `published_draft` until a qualified reviewer audits it.
- `guided-solutions.md`: use `agent_checked_draft` or `draft_with_unexpanded_reference_methods` until reviewed.
- `teaching.md`: use `split_transfer_draft` or `agent_checked_draft`.

Agent-side checks can raise confidence but do not equal human certification. A stronger Agent check should include independent recomputation, comparison with source/reference material as non-authoritative evidence, endpoint/sign/domain/convergence checks, and a consistency pass between `questions.md`, `answers.md`, `guided-solutions.md`, and `corrections.md`.

Public materials may still be released as drafts if the README and `manifest.json` state this clearly.

## Correction Log Policy

Use `corrections.md` for source-material defects that are useful to remember later:

- source answer typos;
- wrong source final results;
- wrong or missing endpoint, sign, constant, orientation, convergence, or domain conditions;
- source-solution steps that conflict with the problem statement or with the source's own derivation.

Do not use `corrections.md` for ordinary OCR uncertainty. OCR uncertainty belongs in `source.md` notes, crop notes, or `manifest.json` review notes until the source image is checked.

Each correction item should include:

- a stable correction id, such as `q003-c001`;
- problem number and source page/crop;
- defect category, status, and reviewer;
- the source claim as transcribed;
- the corrected claim used by `answers.md`;
- the evidence or theorem supporting the correction;
- a short publication note that can later explain how this edition improves on the source.

Record the same correction id in `manifest.json` under the problem and in the run-level `source_corrections` list. Keep the source transcription visible so the correction is auditable.
