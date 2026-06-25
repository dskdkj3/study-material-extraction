# Distribution Repository Standard

A distribution repository is the public-facing home for cleaned study materials. It is separate from this workflow repository.

## Boundary

The workflow repository owns standards, templates, schemas, and scripts.

The distribution repository owns reader-facing products:

- reviewed questions;
- multi-method reference answers;
- guided solutions with a mainline walkthrough and selected alternate-method walkthroughs;
- teaching notes;
- correction notes;
- reader-facing README files;
- release assets such as generated PDFs.

Public materials should include the cleaned problem text needed by readers. Do not publish raw OCR dumps, page renders, crop directories, temporary logs, or source PDFs by default.

## Recommended Repository Name

Use a short reader-facing name, such as:

```text
exam-solution-notes
```

This name says the repository is for reader-facing exam solutions, not for OCR workflow artifacts. Avoid names that are too generic, such as `study-materials`, or names that sound like implementation detail, such as `study-material-extraction-output` or `ocr-artifacts`.

## Recommended Layout

```text
README.md
materials/
  <course-slug>/
    <yyyy-mm-exam-slug>/
      README.md
      01-仅题目.md
      02-多解法参考答案.md
      03-详解.md
      04-拓展讲解.md
      05-纠错清单.md
      manifest.json
```

Example:

```text
materials/
  gaoshu1-ii/
    2024-06-final/
```

Use actual exam month when known or reasonably inferable. `2024-06-final` is clearer for public readers than `23-24-term2-final`. If the source says `2023-2024 学年第 2 学期`, a final exam normally belongs to the 2024 summer exam season, so use `2024-06-final` or `2024-07-final` according to the best available evidence. If the exact month is uncertain, choose the best known month and state the assumption in the material README.

Reader-facing Markdown filenames should prefer Chinese names. Keep `manifest.json` as a stable machine-readable filename. The workflow workspace may still use English filenames such as `questions.md` and `guided-solutions.md`; translate names during distribution handoff.

## Root README

The root `README.md` is for people, not for the workflow.

It should quickly answer:

- What materials are here?
- Where should a reader start?
- Which files are question-only, multi-method reference answer, guided solution, and teaching extension?
- Where are the PDFs?
- How should errors be reported?

Keep the language direct. Avoid generic project slogans, vague promises, and long process explanations. Link to concrete material folders and releases.

## Per-Material README

Each material folder should include a `README.md` with:

- course and exam name;
- source/date naming assumption;
- file guide;
- PDF download links;
- known correction notes;
- status, such as `draft`, `reviewed`, or `published`.

Do not make readers inspect `manifest.json` to understand what to open.

## PDF And Release Assets

Markdown source should remain in the repository.

Generated PDFs should usually be attached to GitHub Releases instead of committed to Git. This keeps the repository lightweight while giving readers stable download links.

## Release Versioning

Use the release tag to carry the material version:

```text
<course-slug>-<yyyy-mm-exam-slug>-v<major>.<minor>
```

Example:

```text
gaoshu1-ii-2024-06-final-v1.0
```

Use `v1.0` for the first intended public release. Use `v0.x` only for internal trial releases, private preview packages, or throwaway validation uploads.

The version number is a publication package version, not a claim of mathematical certification. If answers or guided solutions are still drafts, keep that status visible in the material README and `manifest.json` even when the release tag is `v1.0`.

Recommended release assets:

- `2024-06-gaoshu1-ii-final-questions-v1.0.pdf`
- `2024-06-gaoshu1-ii-final-reference-solutions-v1.0.pdf`
- `2024-06-gaoshu1-ii-final-guided-solutions-v1.0.pdf`
- `2024-06-gaoshu1-ii-final-teaching-notes-v1.0.pdf`
- `2024-06-gaoshu1-ii-final-errata-v1.0.pdf`, when useful

Keep release asset filenames ASCII-safe for GitHub upload. Put Chinese document labels in the material README and release notes.

It is acceptable to commit small PDFs temporarily only when a material README explicitly says the repository is intentionally carrying those generated files. Do not let this become the default.

## GitHub Release Permission

If an Agent is expected to create or update GitHub Releases, grant the narrowest permission that can do that job.

Recommended shape:

- repository-scoped access only for `dskdkj3/exam-solution-notes`;
- fine-grained token or bot/collaborator identity, not the human's full account session;
- release/content write permission only as needed to create releases and upload assets;
- no organization-wide, all-repository, admin, or secret-management permission;
- rotate or revoke the token after release work if it is not meant to be long-lived.

The workflow should still work without this permission: if release upload fails, place assets and an upload instruction file under `/srv/xsy-agent-share/...`, mark `manifest.json` as `pending_upload`, and avoid publishing broken download links.

## Manifest

The public `manifest.json` may be a reduced copy of the run manifest. It should keep:

- schema version;
- course and exam slug;
- source notes;
- file statuses;
- preview/release asset paths;
- correction ids;
- generation date and renderer, when relevant.

It should not contain local absolute paths from `/srv/xsy-agent-share`, raw crop paths, private notes, or temporary OCR lane details unless those details are intentionally public.
