# Answer Authoring Standard

This standard defines the default balance for reference answers, which may include multiple useful methods. Guided solutions and teaching-expanded notes are separate product surfaces.

## Reference Answer Goal

A reference answer should be:

- correct enough to check work;
- clear enough to follow without guessing missing transformations;
- concise enough not to become a lecture note;
- explicit about nontrivial theorem use, convergence criteria, orientation, sign, and endpoint handling.

## Granularity Rules

- Simple computation problems: include the setup and key calculation in roughly `3-6` lines.
- Medium problems: state why the method applies, then show the essential algebra or integral transformation.
- Proof or convergence problems: state all conditions needed by the theorem or criterion; do not expand every prerequisite definition unless it is the point of the problem.
- Formula derivations: include enough intermediate equations to audit signs, constants, and limits.
- Multi-step geometry/vector calculus: explicitly name orientation, boundary, added surface, or symmetry assumptions.
- Series and improper integrals: state endpoint behavior and absolute/conditional distinctions where relevant.

## Terminology

For first-year Chinese undergraduate materials, prefer Chinese theorem and method names in headings and first mentions. Add the common English or romanized name in parentheses when it helps recognition:

- `格林公式（Green 公式）`
- `高斯公式（Gauss 公式）`
- `斯托克斯公式（Stokes 公式）`
- `傅里叶级数（Fourier 级数）`
- `狄利克雷判别法（Dirichlet 判别法）`

After the first mention in the same problem, the concise Chinese name is enough. Do not use English-only theorem names when a standard Chinese name is expected by the target students.

## Alternate Methods

Include multiple methods only when they are materially useful:

- They use a genuinely different idea.
- One method is shorter while another is safer or more explanatory.
- A method is a common exam trick worth preserving.
- The alternate helps verify a sign, constant, or endpoint.
- The alternate is slightly more advanced but still learnable quickly and gives useful transfer to related problem types.

Do not include an alternate method merely because the algebra is rearranged. Also reject methods that are significantly out of scope, hard to learn quickly in the target course context, or clearly worse than the accepted methods without adding transfer value.

When multiple methods exist, label them `解法 A`, `解法 B`, etc. When only one method exists, use a descriptive title and omit `解法 A`.

## Alternate-Method Discovery Pass

After the first independent answer draft, run deliberate searches for materially different solutions for every problem. The default budget is at least one round and at most ten rounds per problem.

A round means a serious attempt to find a method that is materially different from the currently accepted answer set. If a round finds and verifies a useful method, add it to `answers.md`, update the known method set, and run another round unless the per-problem budget is exhausted. If a round finds no useful candidate, stop for that problem before the budget is exhausted.

Prefer one isolated critic context per problem. Give that context only the reviewed question, the currently accepted methods for that problem, the round number, and any known source-correction caveats for that problem. Do not give it the full answer set for unrelated problems unless the problem explicitly depends on an earlier result. This reduces cross-problem anchoring and makes the rejection or adoption record easier to audit.

When there are more problems than the available subagent/concurrent-model budget, run the isolated critic contexts in batches. Do not raise global agent concurrency merely to make one extraction run fit in a single wave; prefer a task-local override or batched execution after the workflow proves it needs more throughput.

When the problem type makes alternates especially plausible, prefer an independent critic/model pass if the active agent workflow supports it:

- geometry, vector calculus, and multiple integrals;
- series and improper integrals;
- differential equations with both standard-method and shortcut routes;
- problems where a source explanation suggests a different coherent idea.

Treat every proposed method as a candidate, not authority. The main answer author must still verify correctness, constants, signs, endpoint behavior, and theorem conditions.

Accept an alternate method when it is materially different and useful under the reference-answer goal. In particular, include it if it is not significantly out of scope, can be learned in a short time by the target student, and is not clearly worse than the accepted methods; being shorter, safer, more explanatory, a common exam trick, a useful independent check, or transferable to related problems are all positive reasons to include it. Stop the search when a round produces no useful candidate, when candidates are merely algebraic variants, significantly longer, or more error-prone than the existing answer, or when ten rounds have been completed. Do not keep iterating merely to manufacture more methods.

Record the rounds in `alternate-method-discovery.md`. For each problem, include the round number, critic context boundary, existing methods before that round, candidates considered, verification notes, adoption decision, and the stop reason. If a candidate is accepted, update `answers.md` and mention the teaching value in `teaching.md` when relevant.

When a candidate is coherent and genuinely different but should not enter `answers.md`, preserve it in `rejected-methods.md` if it has future value. Typical cases are methods that are clearly beyond the course, hard to learn quickly, too error-prone for the reference answer, or useful for explaining editorial choices later. Do not clutter `rejected-methods.md` with ordinary algebraic variants, invalid attempts, or candidates with no review value.

## Reference Answer vs Guided Solution

`answers.md` defaults to reference answers. It should not teach every prerequisite.

`guided-solutions.md` is the default detailed solution surface. Move material there when the reader needs:

- smaller reasoning steps;
- explanation of why a transformation is legal;
- visible routine algebra that would be too bulky in the reference answer;
- short local prerequisite refreshers;
- answer checks for sign, endpoint, orientation, convergence, or constants.

## Reference Answer vs Teaching Explanation

`teaching.md` may add:

- motivation for method selection;
- common mistakes;
- prerequisite refreshers;
- comparison of methods;
- exam-time heuristics;
- more narrative around theorem use.

Do not mix guided-solution or teaching-expanded material into reference answers unless the user explicitly asks for a combined product surface. Conversely, do not expand every accepted reference-answer method inside `guided-solutions.md` by default; consider every accepted method and expand alternates when they materially help learning.

## Source Reference Policy

Independent answers are written from reviewed `questions.md` without consulting `source.md` source explanations.

Reference checking is a later phase. If the user does not want to review source explanations but explicitly allows using them, treat `source.md` as an unreviewed reference:

- compare independent answers with source explanations;
- note conflicts and omissions;
- import useful alternate methods only when they are mathematically coherent;
- keep source explanations marked as source material, not authority;
- record that the source reference was used without full source-explanation review.

When reference checking reveals a likely source typo or wrong source answer, do not only mention it inside `answers.md`. Add or update a `corrections.md` item so the defect is reusable as a quality record for this edition. A correction should state the source claim, the corrected claim, the evidence, and whether a human has reviewed the source image.

Do not silently upgrade `source.md` from OCR draft to verified solution merely because it was useful during reference checking.
