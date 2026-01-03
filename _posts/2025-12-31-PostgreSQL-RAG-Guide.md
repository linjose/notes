---
layout: post
title: 用 PostgreSQL 搭建 RAG 
date: 2025-12-31
reading_time: 25 min read
tags: [PostgreSQL, RAG]
excerpt: 
---

這份指南將帶領你從基礎架構搭建到進階效能優化，利用 PostgreSQL 與 `pgvector` 打造高效能的檢索增強生成（RAG）系統。

---

## 一、 環境準備

使用 Docker 快速啟動支援向量運算的 PostgreSQL 鏡像：

```bash
docker run -d \
  --name postgres-rag \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -p 5432:5432 \
  pgvector/pgvector:pg16

```

---

## 二、 資料庫架構設計

啟用 `pgvector` 擴充功能並建立儲存結構。

```sql
-- 1. 啟用向量擴充功能
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. 建立文檔儲存表
CREATE TABLE documents (
    id serial PRIMARY KEY,
    content text,           -- 原始文本
    metadata jsonb,         -- 元數據（如來源、頁碼）
    embedding vector(1536)  -- 向量維度 (依模型而定，如 OpenAI 為 1536)
);

-- 3. 建立 HNSW 索引以加速檢索
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

```

---

## 三、 RAG 工作流程

1. **數據導入 (Ingestion)**：將長文檔切分為 Chunks，通過 Embedding 模型轉為向量並存入 DB。
2. **檢索 (Retrieval)**：將用戶問題向量化，在 DB 中進行相似度搜尋。
3. **生成 (Generation)**：將檢索結果作為 Context 送給 LLM 生成答案。

### SQL 檢索範例

```sql
SELECT content, 1 - (embedding <=> '[0.12, -0.05, ...]') AS similarity
FROM documents
ORDER BY embedding <=> '[0.12, -0.05, ...]' 
LIMIT 5;

```

---

## 四、 Python 實作 (使用 LangChain)

```python
from langchain_community.vectorstores import PGVector
from langchain_openai import OpenAIEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter

# 1. 連接配置
CONNECTION_STRING = "postgresql+psycopg2://postgres:mysecretpassword@localhost:5432/postgres"

# 2. 處理文檔
loader = TextLoader("data.txt")
docs = CharacterTextSplitter(chunk_size=1000).split_documents(loader.load())

# 3. 向量化並存儲
db = PGVector.from_documents(
    embedding=OpenAIEmbeddings(),
    documents=docs,
    connection_string=CONNECTION_STRING,
    collection_name="knowledge_base"
)

# 4. 相似度搜尋
results = db.similarity_search("如何優化資料庫？", k=3)

```

---

## 五、 進階優化議題

當數據量增長時，需關注以下優化方向：

### 1. 索引演算法選擇

* **HNSW**：檢索速度快、準確率高，但耗費內存（RAM）。
* **IVFFlat**：內存佔用低、建立快，但查詢性能隨數據量增加而下降。

### 2. 混合檢索 (Hybrid Search)

結合 **語義搜尋 (Vector)** 與 **全文檢索 (Full-Text Search)**，解決關鍵字匹配不足的問題。利用 PostgreSQL 的 `tsvector` 與 RRF 演算法合併排名。

### 3. 檢索策略升級

* **父子文檔檢索 (Parent-Document Retrieval)**：用小 Chunk 檢索，回傳大段落給 LLM，兼顧精確度與上下文。
* **自查詢 (Self-Querying)**：利用 LLM 提取問題中的過濾條件（如時間、分類），實現 `WHERE` 子句預過濾。

### 4. 向量量化 (Quantization)

使用 `pgvector` 的向量壓縮技術（如 Scalar Quantization），將浮點數壓縮為整數，可減少高達 75% 的存儲空間並大幅提升檢索速度。



---

若將 RAG 的**索引（Index）**與**內容（Content）**全部整合在 PostgreSQL 是一個非常明智的選擇，這種做法被稱為 **「單體式向量資料庫」（Monolithic Vector Database）**。

在這種架構下，建議採用以下**「三層結構」**的搭配方式，以確保系統在擴展時仍能保持高效能：

---

## 1. 資料表結構設計：Metadata-First

不要只存 `content` 和 `embedding`。為了後續的過濾與管理，建議採用以下結構：

```sql
CREATE TABLE rag_docs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id text,           -- 用於區分不同客戶或專案 (Multi-tenancy)
    content text NOT NULL,        -- 存儲原始切片文本
    metadata jsonb,               -- 存儲來源、頁碼、標題、建立日期
    embedding vector(1536),       -- 向量數據
    fts_tokens tsvector           -- 全文檢索欄位 (優化必備)
);

```

---

## 2. 索引搭配策略：雙管齊下

這是優化的核心。PostgreSQL 的強大在於它可以同時對三種維度建立索引：

### A. 向量索引 (Vector Index)

* **建議選用 HNSW**：對於 RAG 場景，查詢速度（Latency）通常比建立索引的速度更重要。
* **配置建議**：
```sql
CREATE INDEX ON rag_docs 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

```



### B. 全文檢索索引 (Full-Text Search)

* **必要性**：向量搜尋有時會漏掉「特定專有名詞」或「產品型號」。
* **優化**：利用 GIN 索引加速關鍵字搜尋。
PostgreSQL 沒有內建 chinese text search config。
方案 A：zhparser
```sql
CREATE EXTENSION zhparser;
CREATE TEXT SEARCH CONFIGURATION chinese (PARSER = zhparser);
CREATE INDEX idx_fts ON rag_docs USING GIN (to_tsvector('chinese', content));
```
方案 B：jieba（第三方）
```sql
# 改天再補
```

### C. 過濾索引 (Filtering Index)

* 如果你的 RAG 經常需要過濾特定用戶或類別，務必對 `metadata` 的關鍵欄位建立索引，這能避免「先檢索向量、後過濾資料」導致的效能崩潰。

---

## 3. 查詢架構建議：混合檢索 (Hybrid Search)

在一個純 PostgreSQL 的環境中，最推薦的搭配是使用 **RRF (Reciprocal Rank Fusion)** 來合併向量搜尋與全文檢索的結果。

這種搭配方式能顯著提升 RAG 的準確度：

```sql
WITH vector_search AS (
    SELECT id, row_number() OVER (ORDER BY embedding <=> $1) as rank
    FROM rag_docs
    LIMIT 20
),
text_search AS (
    SELECT id, row_number() OVER (ORDER BY ts_rank_cd(fts_tokens, query) DESC) as rank
    FROM rag_docs
    WHERE fts_tokens @@ query
    LIMIT 20
)
SELECT r.content, r.metadata
FROM rag_docs r
JOIN (
    SELECT COALESCE(v.id, t.id) as id,
           (1.0 / (60 + v.rank) + 1.0 / (60 + t.rank)) as score
    FROM vector_search v
    FULL OUTER JOIN text_search t ON v.id = t.id
) combined ON r.id = combined.id
ORDER BY combined.score DESC;

```

---

## 4. 儲存優化建議

* **TOAST 策略**：PostgreSQL 會將長文本（Content）存放在 TOAST 表中。如果你的內容非常大，讀取速度會變慢。
* *優化方法*：將 `embedding` 與 `content` 放在同一個表，但如果頻繁更新 Embedding，建議將向量單獨拆到一個副表，減少主表的寫入放大。


* **記憶體管理**：
* **HNSW 索引必須盡可能常駐記憶體（RAM）**。如果你的伺服器記憶體小於向量索引的大小，查詢效能會出現斷崖式下跌。請確保 `shared_buffers` 足夠大。



---

## 5. 優缺點總結表

| 組件 | 搭配建議 | 目的 |
| --- | --- | --- |
| **向量運算** | `pgvector` (HNSW) | 處理語義相似度，回傳「意思相近」的內容 |
| **傳統搜尋** | `tsvector` + GIN 索引 | 處理精確匹配（型號、人名、代碼） |
| **元數據** | `jsonb` + GIN 索引 | 實現動態過濾（例如：只搜尋 2024 年的文檔） |
| **架構優勢** | 單一資料庫 ACID 保證 | 確保文檔刪除時，索引與向量同步刪除，不會有殘留 |


