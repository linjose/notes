---
layout: post
title: 本地端混合圖形檢索增強生成系統 (Local Hybrid Graph RAG)
date: 2026-05-26
reading_time: 20 min read
tags: [AI]
excerpt: 
---

## 建置與敏捷實作標準作業程序 (SOP)

---

### 1. 目的與適用範圍

本標準作業程序（SOP）旨在指導技術團隊如何在**限定的本地端硬體資源**下，成功建置一套高度可行的「混合型圖形檢索增強生成系統（Local Hybrid Graph RAG）MVP」。

本文件摒棄傳統企業級大規模分布式圖形資料庫的繁瑣初始化配置，改採「漸進式技術堆疊疊加」策略。透過先通基礎向量檢索（Vector RAG），再逐步抽離實體（Entity）與關係（Relation）導入圖形結構的演進路線，確保系統在研發初期即具備可驗證性與高成功率。本程序適用於私有知識庫、在地 AI 助理、程式碼架構知識圖譜（Code Knowledge Graph）以及文件複雜推理系統等中小規模應用場景。

---

### 2. 硬體環境基準與模型配置

本系統之設計完全針對中階單機工作站進行最佳化。以下為實作基本硬體要求與推薦之開源模型參數配置：

| 硬體元件 | 基準配置要求 | 架構調優說明 |
| --- | --- | --- |
| **中央處理器 (CPU)** | Intel Core i5-12400 或同等以上 | 負責初期資料攝入（Ingestion）、文本切片與關聯式資料庫查核，效能充足。 |
| **隨機存取記憶體 (RAM)** | **32GB DDR4 / DDR5** | **關鍵要素**。用於承載記憶體內圖形運算（NetworkX）及大型上下文暫存。 |
| **圖形處理器 (GPU)** | **NVIDIA GeForce RTX 4060 (8GB VRAM)** | 專注於執行 7B 至 14B 之量化模型，確保本地推論速度。 |
| **儲存空間 (SSD)** | NVMe M.2 SSD (高速讀寫) | 圖形遍歷與索引比對極度依賴隨機 I/O 效能，嚴禁使用傳統機械硬碟。 |

#### 2.1 本地端大型語言模型 (Local LLM) 選擇指南

基於 **8GB 顯示記憶體（VRAM）** 之物理限制，模型層級可行性評估如下：

* **最推薦配置：** `Qwen2.5-7B-Instruct` 或 `Qwen3-8B`。此規格模型在中文文本理解、指令遵循（Instruction Following）及長文本上下文（Long Context）表現極佳，且能完美塞入 8GB VRAM。
* **量化規格：** 統一採用 `Q4_K_M`（4-bit 量化），在模型推理精度與記憶體佔用之間取得最佳平衡。
* **執行環境（Runtime）：** 優先推薦使用 `Ollama` 或 `llama.cpp` 進行輕量化管理；若有高效能多用戶並行需求，後續可考慮 `vLLM`。

> ⚠️ **邊界限制警告（RTX 4060 8GB）**
> 本硬體配置**嚴禁**於初期強行運行 70B 級別之大規模生產環境模型、混合專家模型（MoE）或無量化（FP16）之 14B 以上模型，否則將導致顯示記憶體溢出（OOM）或引發極度緩慢的 CPU 記憶體置換。

---

### 3. 系統整體架構藍圖 (Phase 1 MVP)

為降低架構複雜度，第一階段（Phase 1）核心任務為打通「純本地端向量 RAG 管道」，暫不引入圖形資料庫。

#### 核心資料流程序

```
原始文件輸入 (PDF / Markdown / Codebase)
       ↓
智慧文本切片 (Smart Chunking Strategy)
       ↓
向量嵌入生成 (Embedding via BAAI/bge-m3)
       ↓
向量資料庫儲存與檢索 (ChromaDB / pgvector)
       ↓
本地端大型語言模型生成 (Ollama / Qwen2.5-7B)

```

#### 核心技術元件選型

* **LLM Runtime:** `Ollama`（安裝與指令極簡化，資源佔用低，支援即時 API 呼叫）
* **Embedding:** `BAAI/bge-m3`（具備強大之雙語/多語言能力，語義檢索精準，模型體積精簡）
* **Vector DB:** `ChromaDB`（適合 Phase 1 快速驗證；中期無縫遷移至 PostgreSQL + pgvector）
* **Framework:** `LlamaIndex`（內建 `KnowledgeGraphIndex` 與 `PropertyGraphIndex`，對未來圖形擴充支援度最高）
* **User Interface:** `Open WebUI`（提供直覺的 Web 互動介面，便於前端測試與使用者體驗驗證）

---

### 4. 五週漸進式實作開發時程表

技術團隊必須嚴格執行週週期進度，在前一週指標未達成前，切勿提前跨入下一階段。

#### 【第 1 週】基礎建置：本地向量 RAG 系統驗證

* **執行步驟：**
1. 下載並安裝 Ollama 環境，執行指令拉取模型：`ollama run qwen2.5:7b`。
2. 配置 LlamaIndex 框架，設定 Embedding 模型為 `bge-m3`。
3. 導入測試文件（如專案說明 PDF、Codebase），進行文本切片（Chunking）並寫入 ChromaDB。


* **檢核點（Milestone）：** 系統能正確回答文件內的基本事實。例如輸入：「*本專案的主要架構是什麼？*」LLM 能依記檢索到的 Context 給出無幻覺的正確回答。

#### 【第 2 週】核心突破：實體與關係抽取 (Entity & Relation Extraction)

* **執行步驟：**
1. 撰寫 Prompt Engineering 範本，強迫 Qwen 模型對 Chunk 進行結構化資訊抽取。
2. 設計嚴格的 JSON Schema，要求模型輸出「實體定義」與「三元組關係」。


* **抽取資料標準結構範例：**
```json
// 實體抽取 JSON Schema 範例
{
  "entity": "Kubernetes",
  "type": "Technology"
}

```


```json
// 關係抽取 JSON Schema 範例
{
  "source": "Project Titan",
  "target": "Kubernetes",
  "relation": "USES"
}

```



#### 【第 3 週】記憶體內驗證：NetworkX 圖形遍歷實作

* **執行步驟：**
1. **嚴禁在此時安裝複雜資料庫**。將第 2 週抽取的 JSON 三元組直接寫入 Python 內建的 `NetworkX` 記憶體圖形對象中。
2. 利用 NetworkX 進行簡單的圖形遍歷（Graph Traversal）與鄰近節點檢索（Graph Expansion）。


* **檢核點：** 驗證將圖形關聯拓撲結構與向量檢索上下文合併後，檢索品質是否實質提升。

#### 【第 4 週】演算法優化：混合檢索融合 (Hybrid Retrieval Fusion)

* **執行步驟：**
1. 實作向量檢索（Vector Search）與圖形檢索（Graph Retrieval）的雙向融合演進。
2. 設計上下文壓縮（Context Compression）機制，防止圖形關聯展開時導致 Token 數量爆炸。
3. 調校 Prompt，使其能夠同時綜整「語義相似度資料」與「圖形拓撲關聯資料」。



#### 【第 5 週】落地工程化：Apache AGE 與 PostgreSQL 基礎設施整合

* **執行步驟：**
1. 在本地端部署 PostgreSQL，並啟用 `pgvector` 插件與 `Apache AGE` 圖形資料庫擴充功能。
2. 將架構由單機記憶體（NetworkX）正式搬移至關聯與圖形統一儲存體：
```text
PostgreSQL 數據中樞
 ├─ documents (原始文本段落)
 ├─ metadata (文件元數據)
 ├─ embeddings (pgvector 向量索引)
 └─ graph (Apache AGE 圖形拓撲)

```





---

### 5. 關鍵技術要點與品質控管 (Quality Control)

Graph RAG 專案的成敗 **90% 取決於資料清洗與精細工程**，而非資料庫硬體。必須嚴格控管以下五大技術指標：

1. **切片策略 (Chunking Strategy)：** 避免盲目按字數切片。應採取語義切片（Semantic Chunking）或基於 Markdown 標題層級的切片，確保單個 Chunk 內資訊的完整性。
2. **實體抽取品質 (Entity Extraction Quality)：** 這是系統的核心難點。必須反覆優化 Prompt，防止模型抽取抽到無意義的代名詞（例如將「此專案」視為實體），或產生過多破碎、無關聯的孤立節點。
3. **檢索融合 (Retrieval Fusion)：** 必須確保 Vector 與 Graph 兩路檢索結果的權重可動態調校。
* 當使用者詢問「什麼是...」：偏重 Vector 語義檢索。
* 當使用者詢問跨節點關係（如「哪些專案同時依賴 PostgreSQL 與 Kubernetes？」）：必須完全觸發 Graph 檢索。


4. **提示詞工程 (Prompt Engineering)：** 於 System Prompt 中加入嚴格限制，強制 LLM 僅能依據檢索到的混合上下文進行回答，不允許延伸本機幻覺，並在無法導出結論時主動回答「根據現有知識庫圖譜無法回答」。
5. **上下文防爆機制 (Context Compression)：** 圖形結構容易因為度（Degree）過高而引入大量相鄰節點。必須限制檢索展開步數（Max Depth $\le$ 2），並採用 Reranker 模型對上下文進行二次精簡與過濾。

---

### 6. 常見架構錯誤與防範反思 (Anti-Patterns)

本程序特別總結業界常見失敗案例，開發團隊應定時對照反思，嚴禁踩踏以下雷區：

| ❌ 錯誤的歪路 (盲目追求企業級) | ✅ 正確的捷徑 (單機 MVP 導向) |
| --- | --- |
| 一開始就架設大規模 Neo4j 集群、Kubernetes (K8s) 或分布式圖形基礎設施。 | 先用 **NetworkX 記憶體圖形**在 Python 內跑通，快速驗證「圖形結構對業務是否有實質價值」。 |
| 貪多騖遠，直接實作 LangGraph 多 Agent 群體協同（Agent Swarm）或複雜的記憶圖形結構。 | 專注做好**單一場景的「本地文件圖形助理」MVP**，理順 Chunk、Embedding 與 Prompt。 |
| 誤以為 Graph RAG 成功關鍵在於買高規 GPU 跑 70B 模型。 | 認知到難點在於**資料清洗、實體對齊（Entity Resolution）與 Prompt 抽取品質**。用 7B 模型搭好管線才是核心。 |

> 💡 **MVP 終端驗證場景示例**
> 當五週時程結束後，本系統應具備在本地端高效率回答下列跨維度複雜查詢的能力：
> * *「哪些模組實質依賴了 PostgreSQL 資料庫？」*
> * *「當前有哪些獨立專案同時使用了 Kubernetes 架構？」*
> * *「請列出參與 Titan 專案的所有人員及其核心負責範疇。」*
> 
>
