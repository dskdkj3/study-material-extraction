# Guided Solution Standard

`guided-solutions.md` is the default detailed solution product for a finished material set. It contains the mainline walkthrough plus selected alternate-method walkthroughs when those alternates help learning. It is separate from `answers.md` and `teaching.md`.

## Goal

A guided solution should let a learner follow the recommended solution path even when the reference answer is too compressed for them. It should also explain selected alternate methods when they are genuinely useful to learn, not merely listed in the reference answer.

It should:

- keep the original problem context visible through the preview generator;
- explain the next step before using it when the step is not obvious;
- show enough algebra, limits, substitutions, sign checks, and theorem conditions to audit the result;
- consider every accepted method in `answers.md` for guided expansion;
- include only the prerequisite knowledge needed for this problem;
- avoid turning every problem into a full textbook chapter.

## Relationship To Other Files

- `questions.md` provides reviewed problem prompts.
- `answers.md` provides concise reference answers and may include many useful methods.
- `guided-solutions.md` provides step-by-step mainline detailed solutions plus selected alternate-method walkthroughs, and should be generated for every formal material set.
- `teaching.md` provides transfer, extension, method comparison, and related problem-family discussion.
- `source.md` remains source transcription and is not authoritative.

If a reader asks "I cannot follow this method", the fix usually belongs in `guided-solutions.md`. If the reader asks "What other problems use this idea", the fix usually belongs in `teaching.md`.

`guided-solutions.md` is not required to be longer than `answers.md`. When `answers.md` stores many alternate methods, the reference-answer PDF may still be longer. The guided solution should make the primary route easy to follow, and should expand alternate routes when they materially improve learning.

## Granularity

Use a "fed but not bloated" level of detail:

- State what is known, what is required, and the first useful transformation.
- Name theorem and method choices in Chinese first, with common English names only as aids, such as `格林公式（Green 公式）`.
- Explain why a method is legal when a condition matters.
- Keep routine arithmetic visible when dropping it would hide a sign, constant, endpoint, orientation, or convergence judgment.
- Add a short "怎么检查" note when the result is easy to get wrong.
- Do not repeat a whole prerequisite course. Link the step to the exact idea needed here.

## Per-Problem Pattern

Use this default structure, omitting sections only when they would be empty:

```md
## 1. 主线详解

### 先看题目要什么

用普通语言说明题目对象、条件和目标。

### 关键想法

说明为什么选择这个方法。

### 分步计算

逐步展开求解。

### 回看关键条件

说明符号、范围、端点、方向、收敛或量纲等检查点。

### 选讲解法：方法标题

当备用解法值得学习时，按较短粒度展开关键想法和关键步骤。

### 本题未展开的参考解法

简要说明 `answers.md` 中哪些解法只保留为参考答案，以及为什么不在详解版展开。
```

For selected alternate methods, use descriptive method headings:

```md
### 方法一：按区域直接积分

...

### 方法二：利用对称性

...
```

Do not write `解法 A` when there is only one method. For selected alternates, prefer `选讲解法：...` with a Chinese descriptive title.

Do not add a mechanical final check section to every problem. Keep `回看关键条件` only when it names a real risk, such as orientation, endpoint inclusion, convergence uniformity, sign, constant factor, dimension, or theorem hypotheses. If the only possible note is "代回可验证" or another generic sentence, omit the section.

## Adoption Of Alternate Methods

When alternate-method discovery finds a method that is useful, not obviously beyond the course, and can be learned quickly, include it in `answers.md` if it belongs in the concise reference answer.

In `guided-solutions.md`, include an alternate method when it improves understanding, gives a meaningfully different route, is shorter or safer than the mainline path, or is likely to be the best method for a learner to master. Do not include every technically valid variant.

The Agent owns the first pass of this decision. The human reviewer may override it, but the runbook should not depend on the human selecting which alternate methods deserve guided expansion.

For every method accepted into `answers.md`, make one of these decisions:

- `mainline_expanded`: this is the main walkthrough.
- `alternate_expanded`: this is a selected alternate walkthrough.
- `reference_only`: keep it concise in `answers.md`; do not expand it in `guided-solutions.md`.

When a method is `reference_only`, record the reason briefly when the omission may surprise readers. Typical reasons are: same core idea as the mainline method, too much algebra for little learning gain, useful as a check but not as a learning route, or better handled in `teaching.md` as a comparison note.

If a method is rejected because it is too advanced, too long, too fragile, or outside the target course's short-term learnability, record it in `rejected-methods.md` instead of deleting the reasoning trail.

## Preview

When `guided-solutions.md` exists, generate:

- `preview/guided-solutions-preview.md`
- `preview/guided-solutions-preview.pdf`

The preview must combine reviewed questions with guided solutions so the PDF is readable without flipping between files.
