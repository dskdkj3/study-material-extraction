# Content Format Standard

## Canonical Format

Use `Markdown + LaTeX` as the canonical editable format.

- Markdown owns headings, problem order, lists, prose, and visual-asset references.
- LaTeX owns mathematical notation, display equations, matrices, cases, integrals, limits, and series.
- PDF, HTML, and `.tex` are generated views, not content truth.

## Frontmatter

Each canonical Markdown file starts with YAML frontmatter:

```md
---
title: "23 高数一（II）真题期末"
display_title: "2024-06 高等数学一（II）期末真题"
course: "高等数学一（II）"
term: "2023-2024 学年第 2 学期"
source_pdf: "/srv/xsy-agent-share/23高数一（II）真题期末_all_pages.pdf"
run_slug: "23-gaoshu1-ii-final"
stage: "markdown_draft"
status: "draft"
---
```

Frontmatter is metadata. It must not contain problem or answer body content. Use `display_title` for reader-facing PDF and distribution titles when the source filename or internal title is abbreviated, ambiguous, or still contains draft wording.

## Files

Use these canonical editable files:

- `source.md`: faithful source transcription, including source explanations when present;
- `questions.md`: question-only edition, normally derived from reviewed problems;
- `answers.md`: independent reference answers, often with multiple useful methods, written separately from source explanations;
- `guided-solutions.md`: default step-by-step solutions for readers who need more explanation than `answers.md`, including selected alternate-method walkthroughs when useful;
- `alternate-method-discovery.md`: per-problem record of alternate-method rounds, candidates, verification, adoption decisions, and stop reasons;
- `teaching.md`: flexible transfer and extension notes, written separately from both reference answers and guided solutions;
- `variants.md`: optional source-variant record for A/B volumes, alternate printed versions, or source-provided variant problems that should be preserved without mixing into the main public problem set;
- `corrections.md`: source-correction log for confirmed or candidate source typos, wrong answers, and source-solution defects.

Do not duplicate the same body content across these files by hand when a generated preview can combine them.

Normal A/B volume differences are source variants, not source defects. Preserve them in `variants.md` with answers or solutions when available; use `corrections.md` only for typos, wrong answers, or internally inconsistent source claims.

## Public Filenames

The extraction workspace may keep stable English filenames because scripts and standards depend on them. Public distribution repositories should prefer Chinese reader-facing filenames for Markdown files.

For GitHub Release PDF assets, use ASCII-safe filenames. GitHub may rewrite release asset filenames that contain special or non-alphanumeric characters; Chinese PDF filenames can collapse into the same sanitized filename and fail upload with a duplicate-attachment error. Put the Chinese title and document purpose in README/release notes instead of relying on the asset filename.

Recommended public Markdown filenames:

- `01-仅题目.md`
- `02-多解法参考答案.md`
- `03-详解.md`
- `04-拓展讲解.md`
- `05-A-B卷差异.md`, when source variants exist
- `06-纠错清单.md`
- `manifest.json`

Recommended GitHub Release PDF asset filenames:

- `2024-06-gaoshu1-ii-final-questions-v1.0.pdf`
- `2024-06-gaoshu1-ii-final-reference-solutions-v1.0.pdf`
- `2024-06-gaoshu1-ii-final-guided-solutions-v1.0.pdf`
- `2024-06-gaoshu1-ii-final-teaching-notes-v1.0.pdf`
- `2024-06-gaoshu1-ii-final-errata-v1.0.pdf`

Keep machine-oriented files such as `manifest.json` in stable ASCII names.

## Source Markdown Pattern

```md
## 1. 题目

> 状态：reviewed；source_pages: [1]

求 $\iint_D y\,dx\,dy$，其中 $D$ 由 $y=0$ 以及 $y=\sin x$ 所围。

### 来源解析

> 状态：needs_review

这里记录原 PDF 的解析，不默认正确。
```

## Question Markdown Pattern

```md
## 1. 题目

> 状态：reviewed；source_pages: [1]

求 $\iint_D y\,dx\,dy$，其中 $D$ 由 $y=0$ 以及 $y=\sin x$ 所围。
```

## Answer Markdown Pattern

```md
## 1. 参考答案

### 按区域直接积分

\[
\iint_D y\,dx\,dy
=\int_0^\pi\int_0^{\sin x} y\,dy\,dx
=\frac{\pi}{4}.
\]
```

If a problem has multiple materially different methods, use `解法 A` / `解法 B` headings:

```md
### 解法 A：球坐标

...

### 解法 B：截面法

...
```

If there is only one method, do not write `解法 A`; use a descriptive method title.

## Guided Solution Markdown Pattern

```md
## 1. 主线详解

### 先看题目要什么

用普通语言解释题目对象、条件和目标。

### 关键想法

说明为什么选择这个方法。

### 分步计算

逐步展开求解。

### 回看关键条件

说明符号、范围、端点、方向、收敛或量纲等检查点。

### 选讲解法：方法标题

当备用解法值得学习时，展开关键想法和关键步骤。

### 可选：备用解法去向

只有当读者会疑惑时，说明哪些参考答案解法不在详解版展开以及原因。不要每题机械添加。
```

Guided solutions are the default detailed product. They must expand the recommended reference-answer path at a finer step size, and should expand alternate methods from `answers.md` when those methods materially help learning. They do not need to expand every alternate method.

## Teaching Markdown Pattern

```md
# 2024-06 高等数学一（II）期末真题拓展讲解

## 专题一：多元积分先看区域、对称性和降维

对应题目：第 1、2、6 题。

说明这组题共同训练的识别信号、方法选择和迁移方式。

## 专题二：曲线/曲面积分的三问法

对应题目：第 4、5 题。

说明相邻题型、常用定理和判断顺序。
```

Teaching explanations should not mechanically repeat every guided-solution step. They may be topic-based or problem-based, but they should stay selective and focus on transfer value.

## Correction Markdown Pattern

```md
## q003-c001

> 状态：confirmed；类别：source_wrong_answer；题号：3；source_pages: [2]

### 来源原文

记录 `source.md` 中保留的原始说法。

### 本版修正

记录 `answers.md` 采用的修正结论。

### 依据

说明为什么可判定为来源笔误、错解或排版错误。

### 对外说明

用一两句话说明本版纠正了什么，便于后续发布或宣传时引用。
```

If the source image is not yet reviewed, keep the status as `candidate` or `needs_source_review`. Confirmed corrections require either direct source-image review, mathematical contradiction with reviewed statements, or both.

## Visual Assets

Use local source crops for figures and tables:

```md
![q003-figure-1](assets/q003-figure-1.png)
```

Record the asset path, source page, bbox, and redraw status in `manifest.json`. Redraw only when the figure affects readability or solution quality.
