---
layout: post
title: 開始使用這個 Medium 風格 Jekyll 主題
date: 2025-09-12
reading_time: 3 min read
tags: [Announcement, Guide]
excerpt: 一個可在 GitHub Pages 上運行的 Medium 風格 Jekyll 主題。
---

這個主題延續了單檔版本的版面，改寫為 **Jekyll** 架構，支援 Markdown 文章、站內搜尋（無外掛）、暗色模式，並且完全相容 GitHub Pages 的安全建置流程。

## 如何新增文章？
建立一個檔案於 `_posts/`，檔名格式為：`YYYY-MM-DD-your-slug.md`。檔案最前面加上 YAML Front Matter：

```yaml
---
layout: post
title: My Post
date: 2025-09-01
tags: [Life]
reading_time: 5 min read
excerpt: 摘要說明...
---
```

接著使用 Markdown 撰寫內容即可。