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
course: "高等数学一（II）"
term: "2023-2024 学年第 2 学期"
source_pdf: "/srv/xsy-agent-share/23高数一（II）真题期末_all_pages.pdf"
run_slug: "23-gaoshu1-ii-final"
stage: "markdown_draft"
status: "draft"
---
```

Frontmatter is metadata. It must not contain problem or answer body content.

## Files

Use these canonical editable files:

- `source.md`: faithful source transcription, including source explanations when present;
- `questions.md`: question-only edition, normally derived from reviewed problems;
- `answers.md`: independent reference answers, often with multiple useful methods, written separately from source explanations;
- `guided-solutions.md`: default step-by-step solutions for readers who need more explanation than `answers.md`, including selected alternate-method walkthroughs when useful;
- `alternate-method-discovery.md`: per-problem record of alternate-method rounds, candidates, verification, adoption decisions, and stop reasons;
- `teaching.md`: flexible transfer and extension notes, written separately from both reference answers and guided solutions;
- `corrections.md`: source-correction log for confirmed or candidate source typos, wrong answers, and source-solution defects.

Do not duplicate the same body content across these files by hand when a generated preview can combine them.

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

### 检查答案

说明符号、范围、端点、方向、收敛或量纲等检查点。

### 选讲解法：方法标题

当备用解法值得学习时，展开关键想法和关键步骤。

### 本题未展开的参考解法

说明 `answers.md` 中哪些解法只保留为参考，以及为什么不在详解版展开。
```

Guided solutions are the default detailed product. They must expand the recommended reference-answer path at a finer step size, and should expand alternate methods from `answers.md` when those methods materially help learning. They do not need to expand every alternate method.

## Teaching Markdown Pattern

```md
## 1. 拓展讲解

### 这一类题怎么认

说明相似题型的识别信号。

### 方法怎么选

比较可用方法，说明为什么当前方法更稳或更短。

### 相似题型

说明同一类问题还会怎样变形。

### 易错点

列出常见错误和检查方式。
```

Teaching explanations should not mechanically repeat every guided-solution step. They are optional per problem and should focus on transfer value.

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
