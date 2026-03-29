要把 Wikipedia 做成離線版本（mirror），其實有幾種常見方法，從「簡單下載閱讀」到「完整本地伺服器」都有。

---

# 🟢 最簡單：用現成離線包（推薦）

### 1️⃣ Kiwix

這是目前最主流的方法 👍

### ✔ 做法

1. 到 Kiwix 官網下載軟體（Windows / macOS / Linux / Android / iOS 都有）
2. 下載 Wikipedia 的 `.zim` 檔（已打包好的離線資料庫）

   * 有不同版本：

     * 全英文（超大，約 80–100GB+）
     * 精簡版（含圖片 / 不含圖片）
3. 用 Kiwix 開啟 `.zim` 檔即可離線瀏覽

### ✔ 優點

* 不用自己抓資料
* 有搜尋功能
* 跟 Wikipedia 幾乎一樣的體驗

### ❗缺點

* 檔案很大（要準備硬碟）

---

# 🟡 中階：自己抓 Wikipedia dump

如果你想「自己做 mirror」而不是用現成包：

### 2️⃣ 官方資料 dump

來自 Wikimedia Foundation

### ✔ 做法

1. 到 dump 網站下載：
   👉 [https://dumps.wikimedia.org/](https://dumps.wikimedia.org/)
2. 下載內容（通常是 XML）：

   * `pages-articles.xml.bz2`（文章）
3. 用工具轉換，例如：

   * WikiExtractor（抽純文字）
   * 或轉成資料庫格式

### ✔ 優點

* 完整、官方資料
* 可自訂用途（研究、AI、分析）

### ❗缺點

* 不能直接瀏覽（需要處理）
* 不包含完整前端（模板、CSS、JS）

---

# 🔴 進階：完整 mirror + 本地網站

如果你想在本地跑「像真的 Wikipedia 網站」：

### 3️⃣ 使用 MediaWiki

Wikipedia 本身就是用它

### ✔ 做法（概念）

1. 安裝：

   * MediaWiki
   * MySQL / MariaDB
2. 下載 Wikipedia dump
3. 匯入資料庫
4. 處理：

   * 模板
   * 圖片（需要另外抓）
   * 模組

### ✔ 優點

* 幾乎完整重現 Wikipedia
* 可做私有 wiki

### ❗缺點（很重要）

* 超級複雜 😅
* 圖片 + 模板很難完整同步
* 需要大量儲存（數百 GB）

---

# ⚖️ 方法比較

| 方法               | 難度   | 空間 | 是否完整 | 適合誰   |
| ---------------- | ---- | -- | ---- | ----- |
| Kiwix            | ⭐    | 中  | 高    | 一般使用者 |
| Dump             | ⭐⭐   | 中  | 原始資料 | 開發/研究 |
| MediaWiki Mirror | ⭐⭐⭐⭐ | 超大 | 非常高  | 工程師   |
