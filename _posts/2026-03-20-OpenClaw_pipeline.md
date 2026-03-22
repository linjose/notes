---
layout: post
title: OpenClaw 自動化流程
date: 2026-03-20
reading_time: 20 min read
tags: [AI, openclaw]
excerpt: 
---

**模型選型 + pipeline 設計 + 自動化生成流程**。
整理一個在 Ubuntu 24.04 上實用、穩定、可擴展的架構。

---

# 🧠 一、整體架構概念（建議分層）

系統可以拆成 5 個模組：

```
[OpenClaw / Orchestrator]
        ↓
[LLM（文字生成）]
        ↓
[Story Pipeline（分級 + 單字控制）]
        ↓
[Image Generator（插圖）]
        ↓
[排版輸出（PDF / EPUB / 網頁）]
```

---

# ⚙️ 二、核心組件建議

## 1️⃣ Orchestrator（控制流程）

你說的 openclaw（應該是類似 agent / workflow 工具）建議角色：

* 任務拆解（生成故事 → 抽單字 → 生成圖片 → 排版）
* 批次生產（一次 100 本）
* 版本控制（level 1–5）

👉 建議搭配：

* Python + FastAPI（當 backend）
* 或 LangChain / LlamaIndex 做流程串接

---

## 2️⃣ LLM（文字生成核心）

### ✅ 推薦方案（RTX 4060 8GB）

#### 選項 A（最穩定）

* Ollama
* 模型：

  * Qwen2.5 7B (Q4_K_M)
  * Mistral 7B (量化版)

👉 優點：

* 安裝簡單
* GPU 支援好
* API 好串

---

#### 選項 B（更進階控制）

* vLLM（但 4060 VRAM 可能偏緊）
* 或 llama.cpp + GGUF

---

### 💡 建議結論

👉 **用 Ollama + Qwen 7B 量化版是最穩解**

---

## 3️⃣ Story Pipeline（關鍵設計🔥）

這是成敗關鍵，不是模型本身。

### 你要控制三件事：

### ✳️ (1) 分級（Level）

例如：

| Level | CEFR  | 特徵          |
| ----- | ----- | ----------- |
| L1    | A1    | 單字 300內、句子短 |
| L2    | A1-A2 | 簡單句         |
| L3    | A2    | 小故事         |
| L4    | B1    | 有情節         |
| L5    | B2    | 完整敘事        |

---

### ✳️ (2) 單字控制（超重要）

👉 方法：

* 建立 vocabulary list（每個 level 一份）
* prompt 強制限制

**Prompt 範例：**

```
Use only words from this vocabulary list:
[cat, dog, run, happy...]

Write a short story for children (Level 1).
Max sentence length: 6 words.
```

---

### ✳️ (3) 輸出格式（方便後處理）

讓 LLM output JSON：

```json
{
  "title": "...",
  "story": "...",
  "vocabulary": ["cat", "run"],
  "sentences": [
    {"text": "...", "image_prompt": "..."}
  ]
}
```

👉 這樣才能自動化

---

## 4️⃣ 圖像生成（插圖）

### ✅ 本地方案（推薦）

* Stable Diffusion
* WebUI: AUTOMATIC1111 或 ComfyUI

---

### ⚙️ RTX 4060 建議：

* SD 1.5 或 SDXL（需調整）
* 使用：

  * low VRAM mode
  * xformers

---

### 🎨 風格建議（很重要）

固定 prompt：

```
children book illustration, watercolor style, soft colors, simple, cute
```

---

## 5️⃣ 排版輸出

### 📘 書本生成：

#### 工具：

* HTML + CSS → PDF（用 WeasyPrint）
* 或：

  * LaTeX（品質最高）
  * EPUB（用 ebooklib）

---

### 📦 最終輸出：

* PDF（可印）
* EPUB（電子書）
* Web（互動學習）

---

# 🚀 三、完整流程（實戰 pipeline）

```
1. OpenClaw 發任務
2. LLM 生成故事(JSON)
3. Parser 拆句
4. 每句 → image prompt
5. Stable Diffusion 生圖
6. 合併成頁面
7. 輸出 PDF
```

---

# 🖥️ 四、Ubuntu 24.04 環境配置

## 🔧 基礎安裝

```bash
sudo apt update
sudo apt install python3-pip git
```

---

## 🧠 GPU（NVIDIA）

```bash
sudo apt install nvidia-driver-550
```

確認：

```bash
nvidia-smi
```

---

## 🤖 Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

```bash
ollama run qwen2.5
```

---

## 🎨 Stable Diffusion

推薦：

* AUTOMATIC1111

```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
```

---

# 📊 五、效能預期（4060）

| 任務       | 表現         |
| -------- | ---------- |
| LLM 生成   | 很快（<5秒/故事） |
| 圖片生成     | 約 5–10 秒/張 |
| 一本書（10頁） | 約 2–3 分鐘   |

👉 批次 100 本 = 幾小時內可完成

---

# 🧩 六、進階優化（之後可以做）

### 🔥 1. 自動分級評估

用另一個 LLM 做：

* 難度檢查
* 單字超標修正

---

### 🔥 2. TTS（變有聲書）

* Coqui TTS
* Bark

---

### 🔥 3. 多語版本

* 中英對照
* 單字卡模式

---

### 🔥 4. 資料庫

* SQLite / PostgreSQL
* 存：

  * 故事
  * 單字
  * 圖片路徑

---

# ⚠️ 七、關鍵建議（很重要）

👉 不要一開始就追求「最大模型」

你的瓶頸會是：

* prompt 設計 ❗
* pipeline ❗
* 排版 ❗

不是模型大小

---

# ✅ 最推薦配置（簡化版）

```
GPU: RTX 4060
OS: Ubuntu 24.04

LLM:
  Ollama + Qwen2.5 7B (Q4)

Image:
  Stable Diffusion 1.5

Backend:
  Python + FastAPI

Pipeline:
  JSON → Image → HTML → PDF
```

# OpenClaw call AnythingLLM API

---

要讓 **OpenClaw** 呼叫 **AnythingLLM** 的 API，就是把 AnythingLLM 當成一個「後端推理服務」，在 OpenClaw 裡用 HTTP 請求去打它的 endpoint。

---

## 🧠 一、先確認 AnythingLLM API 已開啟

AnythingLLM 預設就有 API（通常在本機）

### 常見 API base URL：

```
http://localhost:3001/api/v1
```

### 你需要準備：

* API Key（在 AnythingLLM 設定頁）
* Workspace slug（例如：`my-workspace`）

---

## 🔌 二、AnythingLLM 最常用 API（聊天）

### 📌 Chat Endpoint：

```
POST /workspace/{workspaceSlug}/chat
```

### 📦 Request 範例：

```json
{
  "message": "幫我總結這段內容",
  "mode": "chat"
}
```

### 🔐 Header：

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

---

## ⚙️ 三、在 OpenClaw 裡怎麼接

OpenClaw 通常用「HTTP Node / API Node」來串接👇

### ✅ 基本設定

#### 1️⃣ 設定 URL

```
http://localhost:3001/api/v1/workspace/my-workspace/chat
```

#### 2️⃣ Method

```
POST
```

#### 3️⃣ Headers

```json
{
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json"
}
```

#### 4️⃣ Body

```json
{
  "message": "{{input}}",
  "mode": "chat"
}
```

👉 `{{input}}` 可以接 OpenClaw 前面節點的輸入

---

## 🔄 四、回傳資料格式（解析）

AnythingLLM 回來通常長這樣：

```json
{
  "textResponse": "這是模型回答..."
}
```

👉 在 OpenClaw 下一個節點取：

```
textResponse
```

---

## 🧩 五、進階玩法（很重要）

### ✅ 1. 使用 RAG（文件問答）

AnythingLLM workspace 本身就有 knowledge base
👉 只要用同一個 API 就會自動查文件

---

### ✅ 2. Streaming（如果 OpenClaw 支援）

AnythingLLM 支援 stream（需開啟）

---

### ✅ 3. 多輪對話

你可以自己在 OpenClaw 存 history：

```json
{
  "message": "上一題 + 新問題",
  "mode": "chat"
}
```

或用：

```
mode: "query"
```


## 🧪 六、先用 curl 測試

```bash
curl http://localhost:3001/api/v1/workspace/my-workspace/chat \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "你好",
    "mode": "chat"
  }'
```
