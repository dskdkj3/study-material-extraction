# Study Material Extraction

This context names the project-specific concepts used to extract, review, answer, and preview study materials.

## Language

**Canonical Source**:
The editable source of truth for extracted study material. In this workflow it is `Markdown + LaTeX`; PDF, HTML, and `.tex` files are generated previews or delivery artifacts.
_Avoid_: final PDF, master copy, OCR result

**Effective Content**:
The educational material intentionally preserved from a source document. It excludes watermarks, page furniture, advertisements, blank answer areas, personal-information fields, and platform contact text.
_Avoid_: all visible text, raw OCR text

**Source Explanation**:
Explanation or solution text transcribed from the source document. It is source material, not proof of mathematical correctness.
_Avoid_: official answer, verified answer, correct solution

**Question-Only Edition**:
A derived view containing only reviewed problems, intended for practice or sharing without answers.
_Avoid_: blank exam, answerless copy

**Answer Candidate**:
A user-authored solution for a problem. A problem may have zero, one, or multiple candidates.
_Avoid_: source explanation, final truth

**Independent Answer Draft**:
An answer set written from reviewed questions without consulting source explanations. It establishes a clean baseline before reference comparison.
_Avoid_: source rewrite, copied answer

**Reference Answer**:
A balanced answer intended to be correct, readable, and concise enough for checking work. It includes necessary reasoning but does not expand every prerequisite as a lesson.
_Avoid_: terse key, teaching note, source explanation

**Guided Solution**:
A step-by-step solution intended to make the reasoning easy to follow for a learner who cannot yet bridge gaps between reference-answer steps. It is a default formal product, separate from the concise reference answer.
_Avoid_: teaching explanation, reference answer, answer key

**Teaching Explanation**:
A flexible pedagogical layer for transfer, related problem families, method comparison, prerequisite refreshers, and common mistakes. It does not need to repeat every guided-solution step for every problem.
_Avoid_: guided solution, reference answer, answer key

**Problem Family**:
A group of problems that share the same recognisable structure, method choice, or theorem pattern. Teaching explanations use problem families to help learners transfer one solved problem to similar future problems.
_Avoid_: topic tag, difficulty label

**Reference Check**:
A later comparison between independent answers and source explanations or other references. It looks for omissions, conflicts, and useful alternate methods without making the source explanation authoritative.
_Avoid_: initial solving, OCR review

**Problem Manifest**:
A machine-readable ledger for extraction status, source locations, OCR lanes, review status, preview artifacts, and answer candidate references. It does not store problem or answer body content.
_Avoid_: content source, answer database

**Extraction Run Workspace**:
A per-source workspace containing Markdown, manifests, crops, OCR outputs, visual assets, and generated previews.
_Avoid_: repository, canonical docs folder

**Distribution Repository**:
A public-facing repository that publishes cleaned study-material products for readers. It owns human-readable navigation, selected Markdown sources, and release assets such as generated PDFs; it does not own extraction standards or heavy OCR work artifacts.
_Avoid_: extraction workspace, standards repository, raw artifact dump

**Rendered Preview**:
A disposable generated artifact used to judge typography and readability. It must be regenerated from canonical Markdown when content changes.
_Avoid_: canonical PDF, edited PDF

**Release Asset**:
A downloadable generated file attached to a GitHub release, typically a PDF bundle or stable PDF edition. It is appropriate for reader-facing distribution when the Markdown source remains in the distribution repository.
_Avoid_: canonical source, OCR artifact, working preview

**Bake-Off**:
A short-lived comparison of OCR or vision candidates on representative samples. It assigns lane roles and does not validate content correctness.
_Avoid_: benchmark suite, final grading
