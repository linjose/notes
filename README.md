# Medium 風格 Jekyll 主題（GitHub Pages 相容）

這是一個無外掛、Medium 風格的 Jekyll Blog 範本，適用於 GitHub Pages。

## 快速開始
1. 將整個資料夾上傳到你的 GitHub repo（使用者頁面：`username.github.io` 或專案頁面）。
2. 在 repo 的 **Settings → Pages** 中啟用 Pages（Source 選擇 `GitHub Actions` 或 `Deploy from a branch` 的 `main`/`gh-pages`）。
3. 若是專案頁面，請在 `_config.yml` 設定：
   - `url: https://username.github.io`
   - `baseurl: /your-repo-name`
4. Commit 後，稍待片刻即可於指定網址看到網站。

## 新增文章
在 `_posts/` 建立 `YYYY-MM-DD-your-slug.md`，於 Front Matter 填入：

```yaml
---
layout: post
title: 我的文章
date: 2025-09-01
tags: [Life]
reading_time: 5 min read
excerpt: 這是摘要。
---
```

## 搜尋
此主題使用 `search.json` + 前端 JS 進行客製搜尋，不需要 Jekyll 外掛。

## 自訂
- 標題、作者、描述：修改 `_config.yml`
- 樣式：編輯 `assets/css/style.css`
- 導覽：可在 `_includes/header.html` 自行加連結
- Favicon：在 `_includes/head.html` 替換為你的圖示

## 授權
MIT