---
layout: post
title: AI 指令的 Token 計算
date: 2026-03-28
reading_time: 10 min read
tags: [AI]
excerpt: 
---


「幫我找出昨天的會議紀錄並整理重點」 這樣一個指令會使用多少Token? 
我們用實際 LLM（例如 OpenAI 的 GPT 類模型）常見的 token 計算方式拆解。
---

👉「幫我找出昨天的會議紀錄並整理重點」

* 中文：**約 15～30 tokens**
* 英文等效句：**約 10～20 tokens**

👉 但！實際成本通常遠高於這句話本身（因為還有 system prompt + context）

---

# 🔍 Step-by-step 拆解

## 1️⃣ 原始句子 token 拆解（中文）

句子：

> 幫我找出昨天的會議紀錄並整理重點

LLM 不是「一字一 token」，而是用 subword（像 BPE）

大致會切成：

| 片段 | token |
| -- | ----- |
| 幫我 | 1–2   |
| 找出 | 1     |
| 昨天 | 1     |
| 的  | 1     |
| 會議 | 1     |
| 紀錄 | 1     |
| 並  | 1     |
| 整理 | 1     |
| 重點 | 1     |

👉 粗估：**10～15 tokens**

---

## 2️⃣ 為什麼實際會變 100+ tokens？

因為 OpenClaw / Agent 不會只送這句話 👇

---

## 3️⃣ 完整 Prompt 組成（重點）

實際送進模型的內容大概是：

### 🧩 (A) System Prompt（超大）

例如：

* 你是一個 AI assistant
* 你可以使用以下工具：

  * file_search
  * summarize
  * email_send
* 請用 JSON 回傳

👉 通常：

* **100～1000 tokens**

---

### 🧩 (B) Tool 定義（更大）

例如：

```json
{
  "name": "search_file",
  "description": "...",
  "parameters": {...}
}
```

👉 很常：

* **200～1500 tokens**

---

### 🧩 (C) 使用者指令（你的那句話）

👉 **10～30 tokens**

---

### 🧩 (D) Memory / Context（如果有）

例如：

* 最近對話
* 檔案內容摘要

👉 **0～幾千 tokens（最大變數）**

---

# ⚖️ 總 token 粗估

| 部分            | tokens   |
| ------------- | -------- |
| 使用者一句話        | 10–30    |
| system prompt | 100–1000 |
| tools         | 200–1500 |
| context       | 0–3000+  |

---

## 👉 實務總量

👉 一次呼叫常見是：

**300 ～ 3000 tokens**

（你的那句話只佔 <5%）

---

# 🔥 關鍵 insight（很多人不知道）

👉 **你寫的 prompt 幾乎不是成本大頭**

真正吃 token 的是：

* tool schema
* system prompt
* memory

---

# 🧪 如果用 OpenClaw 會更高

因為像 **OpenClaw** 這類 Agent：

* 會多輪推理（chain-of-thought / planning）
* 會多次呼叫模型

👉 例如：

1. 理解任務（+500 tokens）
2. 決定找哪個檔案（+500）
3. 摘要（+1000）
4. 再整理（+500）

👉 最終可能：
**2000～10000 tokens / 一個任務**

---

# 🧾 一句話總結

👉 你的句子：**~20 tokens**
👉 實際成本：**幾百到幾千 tokens（因為 Agent 架構）**


只要說你現在怎麼用，我可以幫你直接優化 👍
