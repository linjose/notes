---
layout: post
title: 2026 Google I/O Developer Keynote
date: 2026-06-22
reading_time: 30 min read
tags: [AI]
excerpt: 
---

http://www.youtube.com/watch?v=aqmpZocmR8o

這部影片是 Google I/O '26 的 **Developer Keynote（開發者主題演講）** [[00:09](http://www.youtube.com/watch?v=aqmpZocmR8o&t=9)]，核心主題圍繞在 AI 模型的演進，以及如何從「AI 輔助（Assist）」邁向以「AI 代理（Agents）」為核心的全新開發生態系 [[01:15](http://www.youtube.com/watch?v=aqmpZocmR8o&t=75)]。

以下是演講的重點摘要：

### 1. 核心模型與開發平台更新

* **Gemma 4 開源模型**：Google 推出採用 Apache 2 授權的開源模型 Gemma 4，專為高級推理與代理工作流設計，體積小到可在手機上離線運行 [[00:32](http://www.youtube.com/watch?v=aqmpZocmR8o&t=32)], [[00:59](http://www.youtube.com/watch?v=aqmpZocmR8o&t=59)]。
* **Google Anti-gravity 平台**：這是 Google 核心的 AI 代理開發平台，支援在 Google 基礎設施、Android 或 Web 上進行構建 [[01:24](http://www.youtube.com/watch?v=aqmpZocmR8o&t=84)]。演講中也推出了獨立的桌面應用程式 **Anti-gravity 2.0**（支援多代理同時協作、動態子代理與定時任務）以及 **Anti-gravity CLI** 命令列工具 [[15:04](http://www.youtube.com/watch?v=aqmpZocmR8o&t=904)], [[15:50](http://www.youtube.com/watch?v=aqmpZocmR8o&t=950)], [[19:38](http://www.youtube.com/watch?v=aqmpZocmR8o&t=1178)]。
* **Gemini API 託管代理（Managed Agents）**：開發者只需一通 API 呼叫即可建立 AI 代理，且每個代理都內建一個由 Google 託管的獨立安全 Linux 沙盒環境 [[03:24](http://www.youtube.com/watch?v=aqmpZocmR8o&t=204)], [[03:53](http://www.youtube.com/watch?v=aqmpZocmR8o&t=233)]。

### 2. Google AI Studio 應用部署優化

* **多平台一鍵部署**：展示如何透過 Markdown 檔案定義 AI 技能（例如製作一個自動爬取 HackerNews 並混合音樂的 AI 電台）[[06:17](http://www.youtube.com/watch?v=aqmpZocmR8o&t=377)]。在 AI Studio 中，開發者可以幾鍵之內將 Web App 部署至 Cloud Run [[09:52](http://www.youtube.com/watch?v=aqmpZocmR8o&t=592)]、直接在瀏覽器模擬器中構建 Kotlin Android App [[11:38](http://www.youtube.com/watch?v=aqmpZocmR8o&t=698)]，甚至直接發佈到 Google Play 測試軌道 [[12:32](http://www.youtube.com/watch?v=aqmpZocmR8o&t=752)]。
* **生態系整合**：AI Studio 宣布正式支援 Google Workspace（包含 Docs、Gmail、Calendar 等整合）[[10:40](http://www.youtube.com/watch?v=aqmpZocmR8o&t=640)]。

### 3. Android 開發革新

* **Android CLI 與知識庫**：Anti-gravity 內建 Android CLI [[27:51](http://www.youtube.com/watch?v=aqmpZocmR8o&t=1671)]，並提供「Android 知識庫」與「Android 技能」，讓 AI 代理在處理最新的 Jetpack Compose 遷移、Edge-to-Edge 等任務時，不僅能自動操作 Android Studio，還能減少 70% 的 Token 使用量並提升 3 倍速度 [[28:41](http://www.youtube.com/watch?v=aqmpZocmR8o&t=1721)], [[29:18](http://www.youtube.com/watch?v=aqmpZocmR8o&t=1758)]。
* **裝置端 AI 與性能優化**：展示利用裝置端模型 Gemini Nano 4 在飛航模式下運行離線 AI 旅遊摘要 [[27:24](http://www.youtube.com/watch?v=aqmpZocmR8o&t=1644)], [[33:01](http://www.youtube.com/watch?v=aqmpZocmR8o&t=1981)]。AI 也能自動透過 R8 分析器優化 App 代碼與縮減體積 [[34:43](http://www.youtube.com/watch?v=aqmpZocmR8o&t=2083)]。
* **iOS 至 Android 遷移助手**：預告即將於今年晚些時候推出遷移助手（Migration Assistant），能自動分析 iOS 的 Xcode Storyboard 並將其轉換為符合 Android 最佳實踐的 Native Kotlin 代碼 [[37:37](http://www.youtube.com/watch?v=aqmpZocmR8o&t=2257)], [[39:53](http://www.youtube.com/watch?v=aqmpZocmR8o&t=2393)]。

### 4. Web 平台與 Chrome 代理生態

* **Modern Web Guidance**：推出一整套專家驗證的 Web 技能指南，確保 AI 代理在編寫網頁時使用的是最新且符合 Baseline 標準的 Web API [[43:54](http://www.youtube.com/watch?v=aqmpZocmR8o&t=2634)]。
* **WebMCP 標準與 Chrome 整合**：推出 WebMCP 瀏覽器標準提案，讓網頁功能可以精準、可靠地開放給瀏覽器 AI 代理執行 [[46:04](http://www.youtube.com/watch?v=aqmpZocmR8o&t=2764)]。Chrome 149 將啟動實驗性 WebMCP 的 Origin Trial 測試 [[50:25](http://www.youtube.com/watch?v=aqmpZocmR8o&t=3025)]。
* **Chrome DevTools for Agents**：為 AI 代理量身打造的開發者工具，讓代理能像真人一樣「看見」網頁運行狀況。DevTools 中的 Lighthouse 還新增了 AI 瀏覽審查類別（Agentic browsing category），並讓 AI 能自己讀取錯誤報告並嘗試修復代碼 [[51:18](http://www.youtube.com/watch?v=aqmpZocmR8o&t=3078)], [[52:23](http://www.youtube.com/watch?v=aqmpZocmR8o&t=3143)]。
* **HTML in Canvas API**：一項全新技術，允許開發者將真實的 DOM 元素直接渲染並整合至 Canvas 環境中，兼顧複雜的視覺特效與網頁的無障礙與搜尋功能 [[54:31](http://www.youtube.com/watch?v=aqmpZocmR8o&t=3271)]。

### 5. 激勵計畫與福利

* 宣布舉辦全球 **Build with Gemini X-PRIZE 黑客松**，總獎金高達 200 萬美元 [[57:15](http://www.youtube.com/watch?v=aqmpZocmR8o&t=3435)]。
* 為所有 Google AI Ultra 訂閱用戶（每月 100 美元方案）發放 100 美元的獎勵金，可直接在 Anti-gravity 應用程式中領取 [[57:48](http://www.youtube.com/watch?v=aqmpZocmR8o&t=3468)], [[58:03](http://www.youtube.com/watch?v=aqmpZocmR8o&t=3483)]。
