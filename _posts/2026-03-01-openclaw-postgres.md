---
layout: post
title: OpenClaw + PostgreSQL
date: 2026-03-01
reading_time: 15 min read
tags: [AI]
excerpt: 
---

截至 2026 年初，**OpenClaw**（前身為 Clawdbot/Moltbot）作為目前最熱門的開源 AI Agent 框架之一，已經有數種成熟的 **PostgreSQL** 整合方案。

由於 OpenClaw 的設計理念是「讓 AI 真正執行任務」，它與 PostgreSQL 的結合主要分為 **「讓資料庫具備 AI 能力」** 以及 **「將資料庫作為 AI 的長期記憶層」** 兩個維度：

### 1. 核心整合方案：PostgreSQL 記憶後端 (Memory Backend)

OpenClaw 預設使用 SQLite 和 QMD 處理記憶，但針對大規模應用，社群已推出 **Native PostgreSQL + pgvector** 的整合方案：

* **用途**：將 Agent 的對話歷史、文件索引、學習到的「品味」存儲在 PostgreSQL 中。
* **優勢**：支援多實例共享記憶（Multi-instance）、利用 `pgvector` 進行高效的語義搜索（RAG），且比 SQLite 更適合在生產環境中進行備份與擴展。
* **配置方式**：在 `openclaw.json` 中將 `memory.backend` 設置為 `postgres`，並提供連接字串。

### 2. 資料庫互動方案：PostgreSQL MCP Server

OpenClaw 完整支援 **Model Context Protocol (MCP)**，這是目前與 PostgreSQL 整合最標準的方法：

* **方案**：使用 `postgres-mcp-server`。
* **能力**：Agent 可以自動讀取資料表結構（Schema）、執行 SQL 查詢、分析慢查詢（EXPLAIN ANALYZE）以及根據自然語言指令更新數據。
* **場景**：你可以直接在 WhatsApp 或 Telegram 對 OpenClaw 說：「幫我統計上週銷售額最高的產品，並存成報表。」Agent 會自動調用 MCP 工具操作 PostgreSQL。

---

### 3. 進階擴展方案：pgclaw (Database-Native AI)

這是一個專為 PostgreSQL 打造的開源擴展，將 OpenClaw 的能力直接注入資料庫：

* **特性**：在資料表中引入一個全新的資料類型 `claw`。
* **運作方式**：你可以將 AI Agent 當作資料庫的一個「欄位」。當你更新某行數據時，觸發器會啟動 OpenClaw 進行處理（例如自動摘要、情感分析或預測），並將結果寫回該行的其他欄位。

---

### 4. 實戰建議：如何選擇？

| 需求場景 | 推薦方案 |
| --- | --- |
| **持久化對話紀錄與記憶** | 使用 **Postgres Memory Manager** (內建或插件模式) |
| **讓 Agent 管理/查詢你的業務數據** | 部署 **PostgreSQL MCP Server** |
| **在資料表內實現自動化工作流** | 安裝 **pgclaw** 擴展 |
| **社群監控與語義過濾** | 搭配 **pgvector** 構建向量記憶庫 |

### 下一步操作

如果你已經安裝了 OpenClaw，想嘗試整合 PostgreSQL：

1. **確認環境**：確保你的 PostgreSQL 啟用了 `pgvector` 擴展（如果是要做記憶儲存）。
2. **安裝 MCP**：執行 `npm install -g @modelcontextprotocol/server-postgres` 並將其加入 OpenClaw 的 `config.json`。
