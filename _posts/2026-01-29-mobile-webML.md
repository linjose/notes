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


---

# 示範案例#1-初階製造品管

針對**公分等級**的製造品管（例如外觀大裂痕、或正反面錯誤），必須**自定義訓練**。以下是針對簡易品管檢查的開發與數據訓練指南：

---

## 1. 數據採集：模擬產線環境

AI 的精準度取決於「訓練環境」與「實際生產環境」的一致性。

* **固定視角：** 產線檢查通常是固定的。訓練照片必須包含 iPhone 實際安裝在支架上的角度。
* **光源控制：** 影像辨識最怕陰影干擾。建議在 iPhone 鏡頭周圍加上環形燈，確保產品細節清晰。
* **樣本數量：** 對於簡易檢查，每個分類（良品/不良品）建議準備 **50–100 張** 不同光影、輕微位移的照片。

## 2. 訓練流程：從標註到模型匯出

既然是「簡易」開發，我建議使用 **Teachable Machine** 或 **Lobe.ai**，這能省去編寫深度學習代碼的時間。

### 訓練步驟表

| 階段 | 動作 | 工具建議 |
| --- | --- | --- |
| **分類定義** | 定義 `Class A: Pass` (良品), `Class B: Defect` (不良品), `Class C: Empty` (無產品) | Teachable Machine |
| **數據上傳** | 將手機拍攝的各種角度、不同光照下的照片分類上傳 | 瀏覽器 |
| **模型訓練** | 點擊 "Train"，系統會自動進行特徵提取 | Google Cloud 端 |
| **驗證測試** | 用沒看過的照片測試準確率。若誤判，則將該照片加入訓練集重新訓練 | 實時預覽介面 |
| **模型匯出** | 選擇匯出為 **TensorFlow.js (tfjs)** 格式 | .zip 檔 (含 json 與權重) |

---

## 3. Web App 開發實作

當你拿到 `model.json` 和權重檔後，將其部署到網頁伺服器。

### 核心代碼結構

在 iPhone 瀏覽器中，你需要建立一個處理循環：

```javascript
// 載入模型
const model = await tf.loadLayersModel('model_url/model.json');

// 進行品管檢查的函數
async function checkQuality() {
  const video = document.getElementById('webcam');
  // 抓取影像並調整成模型要求的尺寸 (通常是 224x224)
  const img = tf.browser.fromPixels(video).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
  
  // 進行預測
  const prediction = await model.predict(img).data();
  
  // 判斷結果 (假設 Index 1 是不良品)
  if (prediction[1] > 0.8) { 
    alert("檢測到缺陷！"); 
    // 此處可觸發 Webhook 通知後台
  }
  
  requestAnimationFrame(checkQuality);
}

```

---

## 4. 產線部署的關鍵優化

iPhone 在產線當辨識器時，會遇到以下實際問題：

* **過熱保護：** 持續開啟相機與運算 GPU 會導致 iPhone 過熱降頻。建議降低辨識頻率（例如每秒偵測 2 次，而非每秒 30 次）。
* **焦距鎖定：** 公分等級的檢查需要特寫，請在代碼中嘗試調用 `focusMode: "manual"`（如果瀏覽器支援）或手動在畫面點擊對焦，避免背景清晰、產品模糊。
* **通訊反饋：** 品管結果除了顯示在螢幕，通常需要與硬體連動。你可以透過 **Web Bluetooth API** 連接低功耗藍牙 (BLE) 模組（如 Arduino/ESP32），實現「發現不良品時自動停機」。

---

## 5. 進階：物件偵測 (Object Detection)

如果是要「圈出哪個零件裝錯」，需要改用 **VoTT (Video Object Tagging Tool)** 標註方框，並訓練 **YOLOv8** 或 **SSD** 模型。這類模型也可以轉換為 `tfjs` 格式在 iPhone 上運作。
