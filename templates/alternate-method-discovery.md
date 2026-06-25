---
title: ""
course: ""
term: ""
source_pdf: ""
run_slug: ""
stage: "markdown_draft"
status: "draft"
answer_reference: "answers.md"
kind: "alternate_method_discovery"
---

# {{ title }}不同解法挖掘记录

> 状态：draft。每个候选解法都只是候选，不是权威。只有复核常数、符号、端点、方向和定理条件后，才可以加入 `answers.md`。
>
> 默认每题最多 10 轮。若某轮采纳了新解法，更新 `answers.md` 后继续下一轮；若某轮没有可采纳候选，则该题提前停止。
>
> 默认一题一个独立 critic/subagent 上下文；只提供该题题干、该题已采纳解法、本轮轮次和该题已知纠错 caveat。题目数量超过并发上限时分批运行。
>
> 采纳标准：候选解法必须和已有解法实质不同；只要不显著超纲、短时间可掌握、且不明显劣于现有解法，就可以收进参考答案。纯代数改写、明显更绕且没有迁移价值的路线不收录。
>
> 对于数学上可行但明显超纲、短时间不易掌握、或只适合作为作者审稿证据的候选，除本表记录外，另写入 `rejected-methods.md`。

| 题号 | 轮次 | critic 上下文 | 本轮前已有解法 | 候选不同解法 | 复核要点 | 处理决定 | 停止理由 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1/10 | isolated-per-problem |  |  |  |  |  |
