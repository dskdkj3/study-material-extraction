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
- Explain why a method is legal before using it when a condition matters. Do not write the formula first and explain the condition later. Examples: `高斯公式` must first say it applies to closed surfaces; `格林公式` must first say it converts between a region integral and a positively oriented boundary integral; Fourier coefficient formulas must first say what the coefficients are for.
- Treat a reader question like "为什么能这么用" or "这里没学过" as evidence of a missing local prerequisite in `guided-solutions.md`, not as a one-off chat answer. Add the missing rule, condition, direction convention, or method recipe to the solution itself.
- When introducing an error-prone shortcut or computation trick, teach the trick before using it. For example, do not merely say "列表分部积分可得"; show the table, the derivative/integral columns, the `+,-,+` sign pattern, and the endpoint substitution when the goal is to reduce mistakes.
- Keep routine arithmetic visible when dropping it would hide a sign, constant, endpoint, orientation, or convergence judgment.
- Avoid unexplained "known averages" or memory-only facts for first-pass guided solutions. If using a fact such as `\int_0^{2\pi}\sin^2\theta\,d\theta=\pi`, show a short derivation with `\sin^2\theta=(1-\cos2\theta)/2` unless the file has already established that fact nearby.
- Add a short "怎么检查" note when the result is easy to get wrong.
- Do not repeat a whole prerequisite course. Link the step to the exact idea needed here.
- Use reader-facing prose, not self-narration. Avoid lines such as "这题一眼看起来很吓人"; say what kind of object the problem gives and what the next decision is.
- Do not make the prose mechanically follow the same headings for every problem. The pattern below is a starting shape, not a template that overrides natural explanation flow.
- Do not expand an alternate method merely because it exists in `answers.md`. If the alternate introduces substantial new prerequisites with little payoff for the target learner, keep it in `answers.md` as `reference_only` and mention it only briefly, if at all. A guided solution should preserve the best learning path, not maximize method count.

When revising after learner feedback, extract the underlying rule. For example:

- "格林公式都没讲就开始用" means theorem purpose, orientation, and matching condition must appear before the boundary integral.
- "列表分部积分法又没讲" means the computational method must be taught as a local mini-recipe before its result is used.
- "高斯公式适用于闭曲面这个不显眼" means theorem eligibility should be a prominent decision point, not buried inside a paragraph.
- "平均值是 `1/2` 看不懂" means replace a memory shortcut with a derivation or mark it as an optional shortcut after the derivation.
- "这个备用解法没必要讲" means the alternate likely belongs in `answers.md`, not the guided solution, unless it is clearly safer, shorter, or more transferable for the target learner.

For formal guided-solution sets, especially when the target reader is beginner-level, run a beginner-learner critic pass before finalizing. This may be a subagent or an isolated review context, but it must behave as a learner who knows only the explicitly stated local prerequisites. The critic should flag:

- theorem, formula, or method use before its purpose and eligibility conditions are stated;
- computation shortcuts used before the recipe is taught;
- direction, endpoint, sign, boundary, or orientation conventions that are implicit;
- memory-only facts, average-value claims, or "obvious" identities that need a local derivation;
- prose that sounds like author self-talk rather than learner-facing explanation.

The critic should not rewrite the solution. It should return actionable gaps and the missing local prerequisite. The main author then revises `guided-solutions.md` and, when the gap reveals a reusable authoring rule, updates this standard, the runbook, or a review note.

## Per-Problem Pattern

Use this default structure only when it helps readability, omitting sections when they would be empty and merging them when natural prose is clearer:

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

### 可选：备用解法去向

只有当读者会自然困惑“为什么参考答案里有这个方法，详解版却不讲”时才写。否则把 `reference_only` 原因记录在方法决策记录或 manifest/review note 中，不要在读者 PDF 里每题机械列一段。
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

When a method is `reference_only`, record the reason briefly when the omission may surprise readers. Typical reasons are: same core idea as the mainline method, too much algebra for little learning gain, useful as a check but not as a learning route, or better handled in `teaching.md` as a comparison note. Prefer keeping routine `reference_only` bookkeeping out of the reader-facing guided PDF.

If a method is rejected because it is too advanced, too long, too fragile, or outside the target course's short-term learnability, record it in `rejected-methods.md` instead of deleting the reasoning trail.

## Preview

When `guided-solutions.md` exists, generate:

- `preview/guided-solutions-preview.md`
- `preview/guided-solutions-preview.pdf`

The preview must combine reviewed questions with guided solutions so the PDF is readable without flipping between files.
