# 使用 PostgreSQL 搭建 RAG 系統全攻略

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

## 六、 總結

PostgreSQL 作為 RAG 底座的優勢在於 **「數據一體化」**。你可以在同一個資料庫中處理關係型數據、JSON 元數據與向量數據，無需維護額外的獨立向量資料庫。

---

**接下來您可以嘗試：**

* 需要我為您撰寫 **混合檢索 (Hybrid Search)** 的 SQL 具體實作嗎？
* 或是為您解釋如何針對 **百萬級數據** 調整 HNSW 的參數？
