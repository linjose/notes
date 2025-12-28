---
layout: post
title: 量子電腦與 Qiskit 學習資源
date: 2025-12-18
reading_time: 10 min read
tags: [quantum computing, Qiskit]
excerpt: 
---

本文彙整量子電腦基礎知識與 Qiskit 開源框架的學習資料，適合初學者從理論到實作逐步進階。資源以中文為主，涵蓋線上課程、教科書、教程與 GitHub 專案。[[[1](https://hackmd.io/@sqcs/HkMm1lCiT)]][[4](https://clay-atlas.com/qiskit-study-note/)]

## 入門資源
- **Qiskit Textbook**：IBM 官方線上平台，從量子原理到演算法編程，實作導向，適合所有程度學習者（目前更新中）。[[1](https://hackmd.io/@sqcs/HkMm1lCiT)]
- **量子電腦線上微課程**（台大 QT）：涵蓋量子物理、邏輯閘、疊加態與 IBMQ 實作練習。[[5](https://qt.ntu.edu.tw/qoa/courses01/)]
- **做一台量子電腦回家吧**（高中自主學習）：介紹量子硬體差異，如超導、離子阱與瓶頸。[[7](https://www.ewant.org/admin/tool/mooccourse/mnetcourseinfo.php?hostid=11&id=15854)]

## Qiskit 教程與筆記
- **Clay 的 Qiskit 學習筆記**：從入門、量子電路、視覺化到基礎總結，包含 Jupyter Notebook 範例。[[4](https://clay-atlas.com/qiskit-study-note/)]
- **weikaiwei Qiskit Part2**：設計量子電路步驟（Build, Compile, Run, Analyze），附完整程式碼與 AerSimulator。[[2](https://weikaiwei.com/quantum-computing/ibm-qiskit-part2/)]
- **dr-data Qiskit_tutorial**（GitHub）：繁體中文版入門量子資訊科學，包含基本知識連結。[[6](https://github.com/dr-data/Qiskit_tutorial)]
- **Qiskit 實作學習筆記**：環境設定指南（Python 3.11+，pip 安裝）。[[8](https://hackmd.io/@Hartleyforall/HJ3tKGHu6)]

## 書籍與進階資料
- **量子電腦入門**：從高中數學解說閘型與退火型量子電腦，聚焦易辛機組合最佳化。[[3](https://www.books.com.tw/products/0011026858)]
- **自學資源與路線**（HackMD）：量子硬體入門，推薦量子力學教科書，從 NMR 延伸多種硬體。[[9](https://www.entangletech.tw/lesson/hardware-general-00)]

## 安裝與開始
1. 安裝 Qiskit：`pip install qiskit`（建議虛擬環境）。[[8](https://hackmd.io/@Hartleyforall/HJ3tKGHu6)]
2. 官方文件：quantum.ibm.com 註冊 IBM Quantum Experience 執行真實量子電路。[[4](https://clay-atlas.com/qiskit-study-note/)]
3. YouTube 教學：搜尋「Qiskit 基礎實作」觀看安裝與第一個電路影片。[[10](https://www.youtube.com/watch?v=w7ITKfgTn-8)]

---

## Qiskit 在不同領域的應用整理

**Qiskit** 作為一個開源的量子計算軟體開發套件（SDK），提供了電路設計、模擬、硬體執行以及特定領域應用的工具，協助開發者解決傳統電腦難以處理的問題。

以下根據來源說明這些領域的具體應用實例：


### 1. 密碼學與網路安全 (Cryptography and Cybersecurity)

- **量子金鑰分發（QKD）**  
  這是此領域最核心的應用之一。  
  Qiskit 被用來開發與模擬 QKD 協議，透過量子力學的特性（如不可複製原理）來確保通訊金鑰的安全性，防止資訊在傳輸過程中被竊聽。


### 2. 金融領域 (Finance)

- **投資組合優化（Portfolio Optimization）**  
  開發量子增強型演算法來優化資產配置。  
  此類應用通常採用**混合古典–量子工作流（Hybrid classical-quantum workflows）**，利用量子計算的高並行性，在複雜的市場數據中尋找風險最低且收益最高的投資組合方案。


### 3. 氣候科學與能源 (Climate Science and Energy)

- **氣候模擬（Climate Simulation）**  
  利用 Qiskit 模擬複雜的氣候系統。這些系統涉及大量變數與非線性交互，傳統電腦往往難以精準模擬。

- **能源效率計算**  
  研究如何提升能源轉換或儲存的效率，這對於應對全球氣候變化與能源轉型至關重要。

### 4. 圖像與訊號處理 (Image and Signal Processing)

- **加速任務處理**  
  量子演算法被用於提升圖像辨識、過濾或訊號解析的速度與精準度。  
  Qiskit 提供的量子電路與運算子（Operators）工具，讓研究者能探索如何將傳統圖像數據轉化為量子態進行加速處理。


### 補充：物理與材料科學應用

除了上述領域，Qiskit 也被用於解決**凝聚態物理（Condensed Matter Physics）**中的問題。  
透過 Qiskit 的擴展電路與 **Primitive 函數**（如 `Estimator`），研究者可以模擬物質在量子層級的行為。


### 應用開發的整體概念（類比說明）

這些應用的開發邏輯可以類比為**「模組化建築」**：

- Qiskit 提供  
  - 基礎的磚塊：**量子電路與運算子**  
  - 施工工具：**轉譯器與 Primitive 函數**
- 不同領域的專家（如密碼學家、金融分析師、氣候科學家）  
  就像不同類型的建築師，使用這些標準化的「量子磚塊」來搭建各自領域的特種建築。
- Qiskit 則負責確保這些建築能穩固地座落在**不同廠牌的量子硬體地基**之上。










