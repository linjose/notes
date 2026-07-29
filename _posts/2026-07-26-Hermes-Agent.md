---
layout: post
title: Hermes Agent
date: 2026-07-26
reading_time: 10 min read
tags: [AI]
excerpt: 
---

如果最近在研究 **OpenClaw、Claude Code、OpenHands、AutoGen、LangGraph** 等 AI Agent，那 **Hermes Agent** 絕對是 2026 年最值得深入了解的專案之一。

它最大的特色只有一句話：

> **Hermes 不只是會完成任務，而是會從完成任務中學習，下一次做得更好。** ([GitHub][1])

---

# Hermes Agent 是什麼？

Hermes Agent 是 **Nous Research** 推出的 MIT License 開源 AI Agent。

官方定位：

> **The self-improving AI Agent**

也就是：

> **具有長期記憶、技能累積、自我改善能力的 AI Agent。**

GitHub：

* [Hermes Agent GitHub](https://github.com/NousResearch/hermes-agent?utm_source=chatgpt.com)
* 官方文件：[Hermes Agent Documentation](https://hermes-agent.nousresearch.com/docs?utm_source=chatgpt.com)

---

# Hermes 的設計理念

目前多數 Agent：

```
使用者
    │
Prompt
    │
LLM
    │
Tool
    │
完成任務
```

任務完成就結束。

下次：

全部重新開始。

---

Hermes 則多了一層：

```
使用者

↓

Agent

↓

完成任務

↓

Learning Loop

↓

Skill

↓

Memory

↓

下次直接使用
```

因此官方稱它是

> Agent that grows with you.

也就是：

> 會跟著使用者一起成長。

([GitHub][1])

---

# Hermes 最重要的六大特色

## 1. Self-Improving（自我學習）

Hermes 每完成一次任務，就會分析：

* 哪裡做得好？
* 哪裡浪費 Token？
* 哪個流程可以重複？

然後自動整理成：

```
Skill
```

例如：

今天叫它：

```
整理 ISO50001 專案
```

完成後會自動產生：

```
hospital_iso50001.md
```

下一次：

```
請整理另一家醫院
```

Hermes：

直接使用之前學會的方法。

不像 ChatGPT 必須重新 Prompt。

---

## 2. Procedural Memory（程序記憶）

目前很多 AI 都有 Memory。

例如：

ChatGPT：

記得：

> 你住哪裡

Claude：

記得：

> 你的偏好

Hermes 不只如此。

它記得：

> **事情是怎麼完成的。**

例如：

```
部署 Ubuntu

↓

安裝 Docker

↓

安裝 PostgreSQL

↓

安裝 Ollama

↓

測試
```

這整個流程都會保存。

官方稱：

Procedural Memory。

([GitHub][1])

---

## 3. Skills System（技能系統）

Hermes 最大特色。

Skill 類似：

```
Prompt++

```

不是一句 Prompt。

而是一整個工作流程。

例如：

```
寫 Proposal

↓

收集資料

↓

搜尋

↓

建立 Outline

↓

寫內容

↓

校稿

↓

完成
```

變成：

```
proposal.skill
```

之後：

任何專案：

直接使用。

---

Skill 可以：

* 分享
* 匯出
* 匯入
* 社群下載

官方甚至建立：

Skills Hub。

([GitHub][1])

---

# 4. 長期 Memory

Hermes 的 Memory 比一般 Agent 深很多。

包括：

* Conversations
* Skills
* User Profile
* Context Files
* Project Memory

例如：

它知道：

```
這是醫院專案

ISO14064 已完成

目前正在 ISO50001

之後還要 ESG
```

因此不用一直重新描述背景。

---

# 5. Tool System

Hermes 已內建大量工具。

例如：

* Shell
* Python
* Git
* Browser
* Files
* Search
* Email
* Calendar
* OCR
* PDF
* Image

以及：

MCP Server。

代表：

任何 MCP 都能接。

例如：

```
GitHub MCP

Slack MCP

Figma MCP

Jira MCP

Notion MCP

PostgreSQL MCP

Home Assistant
```

全部可直接整合。([GitHub][1])

---

# 6. Multi-Channel

Hermes 不一定只能 CLI。

可以：

```
Telegram

Discord

Slack

WhatsApp

Signal

Email

Desktop
```

例如：

放在 VPS。

手機 Telegram：

```
Hermes：

今天幫我整理 ISO50001
```

它就在 VPS 開始工作。

完成：

回傳結果。

([GitHub][1])

---

# Hermes 的架構

```
             User
               │
               ▼
        Hermes Agent
               │
     ┌─────────┼──────────┐
     │         │          │
 Memory     Skills     Context
     │         │          │
     └─────────┼──────────┘
               │
        Reasoning Loop
               │
     ┌─────────┼─────────┐
     │         │         │
 Browser   Terminal   Python
     │         │         │
     └─────────┼─────────┘
               │
          External APIs
```

---

# Learning Loop

Hermes 最大創新。

一般 Agent：

```
Task

↓

LLM

↓

Done
```

Hermes：

```
Task

↓

LLM

↓

Reflection

↓

Skill Generation

↓

Memory Update

↓

Knowledge Update

↓

Done
```

完成一次，

能力增加一次。

這就是官方一直強調：

Learning Loop。

([GitHub][1])

---

# 支援哪些模型？

Hermes 幾乎沒有綁模型。

可使用：

* OpenAI
* Anthropic
* Google Gemini
* OpenRouter
* Hugging Face
* GLM
* Kimi
* MiniMax
* NVIDIA NIM
* 本地 Ollama
* LM Studio
* llama.cpp
* 自架 OpenAI Compatible API

因此：

可以自由切換。

```
hermes model
```

即可更換 Provider。

([GitHub][1])

---

# 與 OpenClaw 的差異

| 比較            | Hermes Agent | OpenClaw    |
| ------------- | ------------ | ----------- |
| 核心定位          | 自我學習 Agent   | 通用 Agent 平台 |
| Memory        | ★★★★★        | ★★★★☆       |
| Learning Loop | ✅            | ❌           |
| Skills 自動生成   | ✅            | 部分          |
| 長期成長          | ★★★★★        | ★★★☆☆       |
| 上手速度          | 較慢           | 很快          |
| 生態成熟          | 快速成長         | 非常成熟        |
| MCP           | ✅            | ✅           |
| 多 Agent       | ✅            | ✅           |
| 適合            | 長期使用         | 快速部署        |

整體來說，Hermes 更偏向「長期陪伴型 AI」，而 OpenClaw 更偏向「快速建置、自動化工作流」。不少進階使用者會將 OpenClaw 負責流程編排，而 Hermes 負責執行與持續學習。([TechRadar][2])

---

# 適合哪些應用？

Hermes 特別適合需要長期累積知識的工作，例如：

* 醫院智慧助理（ISO 50001、ISO 14064、ESG 文件）
* 軟體開發（Git、PR、測試、重構）
* DevOps（部署、監控、排程）
* 研究助理（論文整理、文獻追蹤）
* 法律與合約分析
* 顧問知識庫
* 長期專案管理
* 個人數位分身（Personal AI）

---

# 如果與其他熱門 AI Agent Framework 比較

| Framework        | 定位                       | 是否會學習 | 多 Agent | MCP   | 適合對象                  |
| ---------------- | ------------------------ | ----- | ------- | ----- | --------------------- |
| OpenHands        | 軟體工程 Agent               | ❌     | 部分      | ✅     | 開發者                   |
| Claude Code      | AI Coding Agent          | ❌     | ❌       | 部分    | 程式設計                  |
| LangGraph        | Agent Workflow Framework | ❌     | ✅       | ✅     | 客製化開發                 |
| AutoGen          | Multi-Agent Framework    | ❌     | ✅       | 部分    | 研究與實驗                 |
| CrewAI           | 多角色協作                    | ❌     | ✅       | 部分    | 商業流程                  |
| OpenClaw         | 通用 AI Agent 平台           | 部分    | ✅       | ✅     | 快速部署                  |
| **Hermes Agent** | **自我學習 AI Agent**        | **✅** | **✅**   | **✅** | **長期知識工作、自我演進 Agent** |

---

# 小結

如果把 2026 年主流 AI Agent 做一個定位，可以簡化成：

* **Claude Code**：最強的程式設計助手。
* **OpenHands**：專注於軟體工程任務。
* **LangGraph / AutoGen / CrewAI**：適合自行開發 Agent 系統。
* **OpenClaw**：功能完整、部署快速、適合建立各種自動化代理。
* **Hermes Agent**：最強調「知識累積」與「自我演進」，希望 Agent 隨著使用時間越來越熟悉使用者的工作方式，而不是每次都重新開始。

[1]: https://github.com/NousResearch/hermes-agent?utm_source=chatgpt.com "GitHub - NousResearch/hermes-agent: The agent that grows with you · GitHub"
[2]: https://www.techradar.com/pro/how-to-automate-workflows-using-open-source-ai-agents?utm_source=chatgpt.com "How to automate workflows using open-source AI agents"
