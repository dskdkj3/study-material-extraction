# Study Material Extraction

这个仓库只管一件事：把“从 PDF 提取学习材料”这套流程讲清楚、固定下来，让下次 Agent 可以照着跑，人工只需要在关键点复核。

它不是成品资料仓，也不存大文件。真正给读者看的题目、答案、详解 PDF，应当放到单独的公开分发仓。

## 你可能要找什么

- 要跑一份新 PDF：从 [PDF Extraction Runbook](docs/runbook/pdf-extraction.md) 开始。
- 要看每个 Markdown 文件该怎么写：看 [Content Format Standard](docs/standards/content-format.md)。
- 要写参考答案：看 [Answer Authoring Standard](docs/standards/answer-authoring.md)。
- 要写喂饭级详解：看 [Guided Solution Standard](docs/standards/guided-solutions.md)。
- 要写拓展、迁移、方法比较：看 [Teaching Explanation Standard](docs/standards/teaching-explanation.md)。
- 要生成可读 PDF：看 [Preview PDF Standard](docs/standards/preview-pdf.md)。
- 要把成品公开发布：看 [Distribution Repository Standard](docs/standards/distribution-repository.md)。

## 这个仓库管什么

- `source.md`、`questions.md`、`answers.md`、`guided-solutions.md`、`teaching.md`、`corrections.md` 的内容边界。
- OCR、人工复核、独立解题、参考答案、详解、拓展讲解之间的顺序。
- 每题最多 10 轮的不同解法挖掘记录。
- 不采纳但有参考价值的方法记录。
- 来源解析的笔误、错解和可宣传的纠错记录。
- `manifest.json` 和 `batch-manifest.json` 的结构。
- 预览 Markdown/PDF 的生成规则和轻量脚本。

## 这个仓库不管什么

- 不存原始 PDF、页图、裁剪图、OCR dump、生成的 PDF、zip 包。
- 不替代人工复核，也不声明 OCR 或来源解析天然正确。
- 不作为公开资料分发入口。公开资料另建分发仓，本仓只提供标准。
- 不负责 NixOS 配置或工具安装。

## 默认产物分层

- `questions.md`：只含复核后的题目，适合练习。
- `answers.md`：多解法参考答案，目标是方便对答案、查思路，并保留有价值的不同方法。
- `guided-solutions.md`：默认要产出的详解版，逐题展开一条推荐路径，并选讲值得学习的备用解法。
- `teaching.md`：拓展层，不强行逐题复述详解；它更适合讲相似题型、迁移方法、常见坑和方法比较。
- `corrections.md`：来源材料的纠错清单，保留“本版为什么比来源更可靠”的证据。

## 一次运行放哪里

运行产物放在共享工作区，例如：

```text
/srv/xsy-agent-share/pdf-extraction/
  batch-manifest.json
  <run-slug>/
    source.md
    questions.md
    answers.md
    guided-solutions.md
    alternate-method-discovery.md
    rejected-methods.md
    teaching.md
    corrections.md
    manifest.json
    pages/
    content-crops/
    ocr/
    assets/
    preview/
```

本仓的 `templates/` 提供起始文件。工作区里的 PDF、图片和预览文件可以很大，不要提交到这个仓库。

## 最短流程

1. 在 `/srv/xsy-agent-share/pdf-extraction/<run-slug>/` 建工作区。
2. 从 `templates/` 复制 `manifest.json`、`source.md`、`questions.md` 等起始文件。
3. OCR 和人工复核题目，写入 `source.md` 与 `questions.md`。
4. 先不看来源解析，独立写 `answers.md`。
5. 按每题最多 10 轮挖掘不同解法；采纳的并入 `answers.md`，不适合但有价值的写入 `rejected-methods.md`。
6. 写 `guided-solutions.md`，这是默认正式详解产物；逐题展开主线，并评估 `answers.md` 里的其它解法是否值得选讲。
7. 按需要写 `teaching.md`，用于拓展迁移，而不是重复详解。
8. 如果发现来源解析有笔误或错解，写入 `corrections.md`。
9. 校验 manifest：

```sh
node scripts/validate-manifests.mjs /srv/xsy-agent-share/pdf-extraction/batch-manifest.json /srv/xsy-agent-share/pdf-extraction/<run-slug>
```

10. 生成预览 Markdown：

```sh
node scripts/build-preview-markdown.mjs /srv/xsy-agent-share/pdf-extraction/<run-slug>
```

PDF 渲染走 Pandoc + MathJax + Brave/Chromium，具体命令见 [Preview PDF Standard](docs/standards/preview-pdf.md)。

## 公开分发

推荐另建一个公开分发仓，只放读者需要的东西：

```text
README.md
materials/
  gaoshu1-ii/
    2023-06-final/
      README.md
      questions.md
      answers.md
      guided-solutions.md
      teaching.md
      corrections.md
      manifest.json
```

Markdown 留在 Git 里，PDF 可以作为 GitHub Release assets 发布；README 负责把读者带到“题目版、多解法参考答案、详解版、拓展讲解”的下载或阅读入口。

命名优先使用实际考试月份，例如 `2023-06-final`。这比“23-24 学年第 2 学期”更适合检索和公开分发。
