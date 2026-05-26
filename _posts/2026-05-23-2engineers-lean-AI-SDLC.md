---
layout: post
title: 2-Engineers Lean AI SDLC
date: 2026-05-23
reading_time: 20 min read
tags: [AI]
excerpt: 
---

# 2-Engineers Lean AI SDLC

## 團隊編制與核心職責 (2.5 人編制)

| 團隊成員 | 角色定位 | 核心職責 |
| --- | --- | --- |
| **工程師 A** (開發) | **AI 開發引擎 (AI Developer)** | 1. 嚴格依賴規格進行 AI Prompt 撰寫與程式生成。<br>2. 確保提交的程式碼能通過基本的本地編譯與執行。 |
| **工程師 B** (測試)| **AI 守門與自動化 (AI QA & DevOps)** | 1. 把關資料庫架構與 API 規格。<br>2. 人工 Review AI 高風險產出（DB 語法、資安）。<br>3. **建置與維護 CI/CD Pipeline，將測試腳本自動化。** |
| **業務 / PM** (0.5 人) | **驗收負責人 (Acceptance Owner)** | 1. 提供商業邏輯邊界與驗收標準。<br>2. 進行最終的 User Story 驗收。 |

---

## 標準工作流 (Weekly Cycle)

### Phase 0: 規格先行 (Contract Definition) - *防禦 AI 幻覺的第一道防線*

**負責人：工程師 B + 業務**

1. **鎖定資料架構：** 利用深厚的資料庫架構經驗，優先開出精確的 Table、關聯與 Index (DBML/DDL)。這是整個系統最不可妥協的底層。
2. **制定 API 契約：** 定義 Request / Response JSON 格式。
3. **交接：** 工程師 B 將這份「不可竄改的規格合約」交給工程師 A。

### Phase 1: 框架內生成 (Constrained AI Generation)

**負責人：工程師 A**

1. **規格綁定：** 工程師 A 必須將 Phase 0 的 API 與 DB 規格餵給 AI 作為 System Prompt。
2. **產出程式碼：** 在規格邊界內快速生成功能邏輯。
3. **發起 PR (Pull Request)：** 完成開發後，將程式碼推上版控系統並發起合併請求。

### Phase 2: 審查與自動化封裝 (Review & CI/CD Automation)

**負責人：工程師 B**

這是工程師 B 發揮最大價值的階段，分為「人工審查」與「機制固化」兩步：

1. **高風險人工審查：**
* 檢查 AI 產出的 SQL 是否符合 Phase 0 定義的架構，且沒有 N+1 Query 或缺少 Transaction 的問題。
* 確認關鍵防禦（如 SQL Injection、權限控管）有確實寫出，而非 AI 假造的註解。


2. **用 AI 寫測試並掛載 CI/CD：**
* 工程師 B 利用 GenAI（餵入 Phase 0 的規格）快速生成 Postman/Bruno 測試腳本或基礎的安全掃描指令。
* **將這些測試腳本寫入 CI/CD Pipeline (例如 GitHub Actions / GitLab CI)。**
* 未來工程師 A 提交的任何 Code，都必須先通過這套 CI/CD 的自動化測試，才能進到人工 Review。



### Phase 3: 驗收與累積 (Merge & Assets)

**負責人：全體**

1. **綠燈合併：** CI/CD 亮綠燈，且工程師 B 確認無架構風險後，Merge 程式碼。
2. **資產沉澱：** 將本週成功的開發 Prompt 與測試 Prompt，存入團隊共用的 Prompt Repository。

---

## 🚦 這個架構下的管理槓桿

1. **讓測試工程師建立「自動化結界」：** 工程師 B 的心態會從「每天幫 AI 擦屁股」，轉變為「我正在建立一套連 AI 都無法作弊的 CI/CD 檢驗機制」。
2. **將架構控制權留在人類手上：** 無論 AI 寫 Code 有多快，核心的 DB 架構規劃與最終的部署防線，依然牢牢掌握在具備資料工程思維的守門員手中。

目前這位負責把關與自動化的測試工程師，在建置 CI/CD Pipeline 時，團隊是習慣使用 GitLab CI、GitHub Actions 還是其他的工具呢？
