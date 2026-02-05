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

# 少樣本學習

若是要在 3-5 張影像內完成訓練並達到可用的品管精度，需透過 **「少樣本學習」(Few-Shot Learning)** 或 **「遷移學習」(Transfer Learning)**。

在 Web 端（iPhone）實作這個需求，最快且最有效的做法是使用 **「特徵向量比對」(Feature Extraction + K-NN)**。

---

## 1. 核心邏輯：把 AI 當成「指紋辨識」

不要讓 AI 去「理解」什麼是瑕疵，而是讓 AI 提取影像的「特徵點」。

1. **提取特徵：** 使用預訓練好的強大模型（如 MobileNet），去掉最後的分類層，只拿它對影像的描述（一串數字，即 Feature Vector）。
2. **存入範本：** 你拍 3 張良品的照片，瀏覽器會記住這 3 組數字。
3. **即時比對：** 產線檢測時，計算當前影像與這 3 組數字的「歐幾里得距離」。如果距離太遠，就判定為「錯誤/不良品」。

---

## 2. 快速開發步驟

### 第一步：選擇工具

使用 **TensorFlow.js** 配合 **KNN Classifier** 插件。這是專門為「快速訓練」設計的。

### 第二步：建立訓練介面 (Web UI)

設計一個簡單的網頁，按鈕包含：

* **[按鈕：存入良品範本]**：點擊後抓取當前畫面，提取特徵並儲存。
* **[閾值拉桿 (Threshold)]**：用來調整「多不像才算錯誤」。

### 第三步：數據訓練實作

你不需要上傳到雲端，直接在 iPhone 的瀏覽器記憶體裡完成：

```javascript
// 1. 加載模型 (特徵提取器)
const net = await mobilenet.load();
const classifier = knnClassifier.create();

// 2. 快速訓練 (按一下存一張，3-5張即可)
async function addExample(classId) {
  const img = tf.browser.fromPixels(videoElement);
  const activation = net.infer(img, true); // 提取特徵 (不分類)
  classifier.addExample(activation, classId); // 存入分類 (0:良品)
  img.dispose();
}

// 3. 即時品管監控
async function predict() {
  if (classifier.getNumClasses() > 0) {
    const img = tf.browser.fromPixels(videoElement);
    const activation = net.infer(img, true);
    const result = await classifier.predictClass(activation);
    
    // 如果信心值太低，或距離太遠，觸發警告
    if (result.confidences[0] < 0.85) { 
        console.log("警告：檢測到異常！");
    }
  }
}

```

---

## 3. 提高 3-5 張照片成功率的關鍵技巧

由於樣本極少，為了防止 iPhone 誤判，建議在硬體環境上做以下限制：

1. **環境對齊 (Alignment Guide)**：
在網頁畫面上畫一個 **「透明框」**。要求品檢員必須把產品對齊這個框框才能按下訓練。這能大幅減少位移帶來的雜訊。
2. **負樣本 (Negative Samples) 的重要性**：
雖然你只想抓「良品」，但建議至少拍 1-2 張 **「空台」**（產線上什麼都沒放）的照片作為 Class B。這能防止 AI 把空台誤認成良品。
3. **色彩直方圖輔助**：
公分等級的品管（如零件顏色不對、漏裝黑墊片），可以加上簡單的顏色佔比分析。

---

## 4. 這種做法的優缺點

| 優點 | 缺點 |
| --- | --- |
| **極速部署**：不需要後台伺服器，手機開了即測。 | **環境敏感**：如果光線變了，可能需要重新點擊 3 張訓練。 |
| **隱私安全**：所有照片都在手機內處理，不傳上雲端。 | **無深度解釋**：它只能告訴你「不像」，不能告訴你「哪裡壞」。 |
