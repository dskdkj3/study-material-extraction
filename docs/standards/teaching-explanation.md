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

## Relationship To Other Files

- `answers.md` answers the problem concisely.
- `guided-solutions.md` explains the problem step by step.
- `teaching.md` explains how to learn from the problem and transfer the idea.
- `rejected-methods.md` stores coherent but unsuitable candidate methods.
- `source.md` remains source transcription and is not authoritative.

If a note only helps the reader follow this exact solution, it usually belongs in `guided-solutions.md`. If it helps the reader recognize, adapt, or compare methods across similar problems, it belongs in `teaching.md`.

## Flexible Structure

Do not force every problem into the same section list. Use only the sections that are useful.

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

## Granularity

- Prefer short, reusable explanations over long repetition of solution steps.
- Use Chinese theorem and method names first. Add common English names in parentheses only when helpful.
- Keep prerequisites local: explain only what a learner needs to understand this family of problems.
- Include method comparison only when the comparison changes a student's future choice.
- Include advanced methods only when they are learnable in a short time and do not distract from the course level.

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

The preview should combine reviewed questions with teaching notes, but it may leave some problems without notes when no useful transfer point exists.
