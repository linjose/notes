---
layout: post
title: Mobile WebML
date: 2026-01-29
reading_time: 5 min read
tags: [AI]
excerpt: 
---


開發一個在 iPhone 上透過瀏覽器（Safari）運行的影像辨識 Web App，目前的技術路徑已經非常成熟。
這類應用通常被稱為 **Web ML (Web Machine Learning)** 或 **PWA (Progressive Web App)**。

以下是開發的關鍵步驟與架構建議：

---

## 1. 選擇技術棧 (Technology Stack)

在網頁端做影像辨識，你主要有兩個主流選擇：

* **TensorFlow.js (推薦)：** Google 開發，支援 WebGL 加速，有極其豐富的預訓練模型（物體偵測、姿勢偵測、臉部辨識）。
* **MediaPipe (進階)：** 同樣由 Google 提供，針對行動裝置優化極佳，適合即時性要求極高的場景（如手勢追蹤）。

## 2. 獲取相機權限與串流

在 iOS 的 Safari 中，你必須透過 `getUserMedia` API 來獲取攝像頭畫面。

* **關鍵點：** iPhone 要求必須在 **HTTPS** 環境下才能調用相機。
* **代碼邏輯：**
1. 建立一個 `<video>` 標籤（隱藏或顯示）。
2. 使用 `navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })` 獲取後置鏡頭。
3. 將串流設定給 `video.srcObject`。



## 3. 準備辨識模型 (The AI Model)

你可以根據需求選擇：

* **使用現成模型：** 直接加載 TensorFlow.js 提供的 `mobilenet` (一般物體辨識) 或 `coco-ssd` (物件偵測)。
* **自定義模型：** 如果你要辨識特定的東西（例如自家的產品），可以使用 **Teachable Machine** 訓練後匯出成 `tfjs` 格式。

---

## 4. 實作流程架構

### 核心開發步驟表

| 步驟 | 說明 | 工具/技術 |
| --- | --- | --- |
| **Step 1: 建立環境** | 設置 HTTPS 伺服器 (開發時可用 localhost) | Node.js / Python |
| **Step 2: 接入相機** | 編寫 JS 啟動 iPhone 鏡頭並處理鏡頭轉向 | WebRTC / HTML5 |
| **Step 3: 加載模型** | 從伺服器下載辨識權限並載入內存 | TensorFlow.js |
| **Step 4: 循環偵測** | 寫一個 `requestAnimationFrame` 循環，不斷抓取 video 幀進行分析 | JavaScript |
| **Step 5: 結果呈現** | 在畫面上用 Canvas 畫出框框或顯示文字標籤 | HTML5 Canvas |

---

## 5. iPhone 專屬優化 (必讀)

iPhone 的瀏覽器環境有一些特殊限制，開發時務必注意：

* **Inline Playback:** 在 `<video>` 標籤必須加入 `playsinline` 屬性，否則 iPhone 會強制全螢幕播放，導致辨識中斷。
* **WebGL 加速:** 確保 TensorFlow.js 使用 `webgl` 渲染器，這能調用 iPhone 強大的 GPU，速度比 CPU 快 10 倍以上。
* **PWA 化:** 編寫 `manifest.json` 並註冊 `Service Worker`，讓用戶可以「加入主畫面」。這樣 App 看起來就像原生應用，且能全螢幕執行。
