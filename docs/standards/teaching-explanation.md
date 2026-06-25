# Teaching Explanation Standard

`teaching.md` is the flexible learning-extension surface. It is separate from both concise reference answers and guided step-by-step solutions.

## Goal

Teaching explanations help a learner transfer from one solved problem to nearby problems.

They may cover:

- related problem families;
- method choice and method comparison;
- prerequisite refreshers that are useful beyond the one problem;
- common traps and diagnosis rules;
- exam-time heuristics;
- variants that are not worth putting into the reference answer.

They do not need to repeat every step already present in `guided-solutions.md`.

The target reader may be learning the topic for the first time. The teaching layer should help that reader recognize the next similar problem, choose a workable method, and avoid meaningful traps. It should not pad the file with obvious arithmetic reminders.

## Relationship To Other Files

- `answers.md` answers the problem concisely.
- `guided-solutions.md` explains the problem step by step.
- `teaching.md` explains how to learn from the problem and transfer the idea.
- `rejected-methods.md` stores coherent but unsuitable candidate methods.
- `source.md` remains source transcription and is not authoritative.

If a note only helps the reader follow this exact solution, it usually belongs in `guided-solutions.md`. If it helps the reader recognize, adapt, or compare methods across similar problems, it belongs in `teaching.md`.

## Flexible Structure

Do not force every problem into the same section list. Use only the sections that are useful, and allow a problem to be absent when the guided solution already covers everything worth saying.

Prefer one of these shapes:

- selected problem notes, for a problem that has a genuinely transferable idea;
- grouped topic notes, when several problems teach the same family;
- method-comparison notes, when choosing between methods is the main learning value;
- trap notes, when the mistake is common and not obvious from the guided solution.

Avoid making every problem follow `相似题型与迁移方向` plus `常见坑与检查方式`. That pattern quickly becomes a template instead of a teaching layer.

Common section choices:

```md
## 1. 拓展讲解

### 这一类题怎么认

说明相似题型的识别信号。

### 方法怎么选

比较可用方法，说明为什么当前方法更稳或更短。

### 可以怎么变形

列出一两个相邻变式。

### 常见坑

说明容易错在哪里，以及怎么检查。
```

For trivial problems, `teaching.md` may omit the problem entirely or write a short note. Completeness is not measured by one note per problem; it is measured by whether the teaching layer adds transfer value.

Before finalizing public material, run at least two independent divergent review passes:

- a reader-value critic that removes notes which are too obvious, too mechanical, or duplicated from `guided-solutions.md`;
- a problem-family researcher that proposes nearby families, variants, and method-choice lessons.

Useful candidate labels:

- `family_recognition`: how to recognize the problem family;
- `method_choice`: how to choose between methods;
- `variant_transfer`: nearby variants worth practicing;
- `trap_diagnosis`: common wrong paths and checks;
- `minimal_prerequisite`: a prerequisite that helps beyond this exact problem.

For larger sets, a third pass may compare teaching notes against accepted and rejected alternate methods. Keep the resulting `teaching.md` selective; do not include every suggestion from the divergent passes.

Recommended review ownership:

- one critic reads as a near-beginner and marks anything that feels like filler, arithmetic trivia, or a copied checklist;
- one researcher groups problems by transferable families and proposes only the families worth teaching;
- one editor, when needed, rewrites the accepted notes into a compact reader-facing structure.

Keep a short note in the run workspace when divergent review materially changes `teaching.md`, for example `teaching-review.md`. The note should record which suggestions were accepted, rejected, or moved to `guided-solutions.md`.

## Rejection Rules

Reject or move a note out of `teaching.md` when it is mainly one of these:

- pure arithmetic or algebra that the guided solution already shows, such as only reminding that `\sqrt{2^2+1^2}=\sqrt5`;
- a restatement of the answer step with no transfer point;
- a theorem name with no condition, choice rule, or diagnostic value;
- an advanced method that is harder than the original course-level method and not quickly learnable;
- generic advice that could be pasted under every problem;
- a warning about a mistake that is not plausible for this problem family.

Low-value but locally helpful details may belong in `guided-solutions.md` if they help a beginner follow one step. Coherent but unsuitable advanced routes belong in `rejected-methods.md`.

## Granularity

- Prefer short, reusable explanations over long repetition of solution steps.
- Use Chinese theorem and method names first. Add common English names in parentheses only when helpful.
- Keep prerequisites local: explain only what a learner needs to understand this family of problems.
- Include method comparison only when the comparison changes a student's future choice.
- Include advanced methods only when they are learnable in a short time and do not distract from the course level.
- Drop elementary arithmetic reminders unless the arithmetic is a known source of conceptual mistakes.

## Problem Families

Useful families include, but are not limited to:

- region setup for multiple integrals;
- symmetry in multiple integrals;
- 傅里叶系数计算;
- 格林公式、高斯公式、斯托克斯公式的适用条件与方向判断;
- 一阶线性微分方程;
- 交错级数与绝对收敛;
- 反常积分敛散性;
- 比较估计与裂项估计.

Problem families are learning aids, not taxonomy for its own sake. Include them only when they help transfer the method.

## Preview

When `teaching.md` exists, generate:

- `preview/teaching-preview.md`
- `preview/teaching-preview.pdf`

The preview should combine reviewed questions with teaching notes, but it should only render problems that have teaching notes. Missing problem numbers mean this edition has no separate transfer note for those problems.
