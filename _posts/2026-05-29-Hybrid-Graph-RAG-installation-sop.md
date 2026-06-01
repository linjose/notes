---
layout: post
title: 本地端 Hybrid Graph RAG 安裝 SOP（Ubuntu 26.04）
date: 2026-05-29
reading_time: 20 min read
tags: [AI]
excerpt: 
---

以下整理為適用於 Ubuntu 26.04 的《Local Hybrid Graph RAG 安裝與建置 SOP》，已將原始內容工程化、命令化，並補充實際部署時容易踩坑的 Linux / CUDA / Python 環境問題。

## 適用環境

| 項目        | 建議配置                  |
| --------- | --------------------- |
| OS        | Ubuntu 26.04 LTS      |
| CPU       | Intel i5-12400 以上     |
| RAM       | 32GB                  |
| GPU       | NVIDIA RTX 4060 8GB   |
| SSD       | NVMe SSD              |
| Python    | Python 3.12           |
| CUDA      | CUDA 12.x             |
| Runtime   | Ollama                |
| LLM       | Qwen2.5-7B / Qwen3-8B |
| Embedding | BAAI/bge-m3           |
| Vector DB | ChromaDB              |
| Framework | LlamaIndex            |
| UI        | Open WebUI            |

---

# 1. Ubuntu 基礎初始化

## 1.1 更新系統

```bash
sudo apt update
sudo apt upgrade -y
sudo reboot
```

---

## 1.2 安裝必要工具

```bash
sudo apt install -y \
git curl wget vim htop unzip \
build-essential software-properties-common \
python3 python3-pip python3-venv \
postgresql postgresql-contrib
```

---

# 2. NVIDIA Driver + CUDA 安裝

## 2.1 確認 GPU

```bash
lspci | grep -i nvidia
```

---

## 2.2 安裝 Driver

Ubuntu 26.04 通常可直接使用：

```bash
sudo ubuntu-drivers autoinstall
```

重新開機：

```bash
sudo reboot
```

---

## 2.3 驗證 GPU

```bash
nvidia-smi
```

正常應看到：

* RTX 4060
* Driver Version
* CUDA Version

---

# 3. 安裝 Ollama

## 3.1 安裝

使用官方腳本：

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

---

## 3.2 啟動服務

```bash
sudo systemctl enable ollama
sudo systemctl start ollama
```

檢查：

```bash
systemctl status ollama
```

---

## 3.3 拉取模型

推薦：

```bash
ollama pull qwen2.5:7b
```

或：

```bash
ollama pull qwen3:8b
```

---

## 3.4 測試推論

```bash
ollama run qwen2.5:7b
```

輸入：

```text
你好，請介紹 Graph RAG
```

---

# 4. Python 虛擬環境

## 4.1 建立專案目錄

```bash
mkdir ~/graph-rag
cd ~/graph-rag
```

---

## 4.2 建立 venv

```bash
python3 -m venv venv
```

啟用：

```bash
source venv/bin/activate
```

---

## 4.3 更新 pip

```bash
pip install --upgrade pip wheel setuptools
```

---

# 5. 安裝 Graph RAG Python 套件

## 5.1 安裝核心框架

```bash
pip install \
llama-index \
llama-index-llms-ollama \
llama-index-embeddings-huggingface \
llama-index-vector-stores-chroma \
chromadb \
networkx \
pymupdf \
sentence-transformers \
transformers \
accelerate
```

---

## 5.2 安裝 PostgreSQL Driver

```bash
pip install psycopg2-binary
```

---

## 5.3 安裝 Apache AGE 支援

後期 Phase 5 使用：

```bash
pip install apache-age-python
```

---

# 6. 安裝 Open WebUI

## 6.1 Docker 安裝

```bash
curl -fsSL https://get.docker.com | sh
```

加入權限：

```bash
sudo usermod -aG docker $USER
```

重新登入 Shell。

---

## 6.2 啟動 Open WebUI

```bash
docker run -d \
--name open-webui \
-p 3000:8080 \
-v open-webui:/app/backend/data \
--restart always \
ghcr.io/open-webui/open-webui:main
```

---

## 6.3 開啟 WebUI

瀏覽器：

```text
http://localhost:3000
```

---

# 7. Embedding 模型設定（bge-m3）

## 7.1 Python 測試

建立：

```bash
vim test_embedding.py
```

內容：

```python
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-m3"
)

embedding = embed_model.get_text_embedding(
    "Graph RAG 是什麼？"
)

print(len(embedding))
```

執行：

```bash
python test_embedding.py
```

---

# 8. ChromaDB 初始化

## 8.1 建立測試資料庫

```python
import chromadb

client = chromadb.PersistentClient(path="./chroma_db")

collection = client.get_or_create_collection("documents")

collection.add(
    documents=["Graph RAG 結合向量搜尋與知識圖譜"],
    ids=["doc1"]
)

print(collection.count())
```

---

# 9. LlamaIndex + Ollama 整合

## 9.1 建立測試

```bash
vim test_rag.py
```

---

## 9.2 測試程式

```python
from llama_index.llms.ollama import Ollama
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

documents = SimpleDirectoryReader("./docs").load_data()

embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-m3"
)

llm = Ollama(
    model="qwen2.5:7b",
    request_timeout=120
)

index = VectorStoreIndex.from_documents(
    documents,
    embed_model=embed_model
)

query_engine = index.as_query_engine(llm=llm)

response = query_engine.query(
    "本專案的主要架構是什麼？"
)

print(response)
```

---

# 10. 文件目錄結構

建議：

```text
graph-rag/
├── docs/
├── chroma_db/
├── extracted_entities/
├── graph_data/
├── prompts/
├── scripts/
├── venv/
└── logs/
```

---

# 11. 第 2 週：Entity / Relation Extraction

## 11.1 Prompt 原則

強制 JSON Output：

```text
你是一個知識圖譜抽取器。

只允許輸出 JSON。

不要解釋。
不要 Markdown。
不要自然語言。
```

---

## 11.2 Entity Schema

```json
{
  "entity": "PostgreSQL",
  "type": "Database"
}
```

---

## 11.3 Relation Schema

```json
{
  "source": "Project Titan",
  "target": "PostgreSQL",
  "relation": "USES"
}
```

---

# 12. 第 3 週：NetworkX Graph

## 12.1 安裝

已包含：

```bash
pip install networkx
```

---

## 12.2 測試 Graph

```python
import networkx as nx

G = nx.Graph()

G.add_edge(
    "Project Titan",
    "PostgreSQL",
    relation="USES"
)

print(G.nodes())
print(G.edges(data=True))
```

---

# 13. PostgreSQL + pgvector（第 5 週）

---

## 13.1 安裝 pgvector

```bash
sudo apt install postgresql-16-pgvector
```

若 Ubuntu Repo 無：

```bash
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install
```

---

## 13.2 建立資料庫

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE graphrag;
```

---

## 13.3 啟用 Extension

```sql
\c graphrag

CREATE EXTENSION vector;
```

---

# 14. Apache AGE 安裝

## 14.1 安裝編譯依賴

```bash
sudo apt install -y \
postgresql-server-dev-16 \
flex bison
```

---

## 14.2 編譯 AGE

```bash
cd ~

git clone https://github.com/apache/age.git

cd age

make PG_CONFIG=/usr/lib/postgresql/16/bin/pg_config

sudo make install
```

---

## 14.3 啟用 AGE

```bash
sudo -u postgres psql graphrag
```

```sql
LOAD 'age';

SET search_path = ag_catalog, "$user", public;

SELECT create_graph('knowledge_graph');
```

---

# 15. 建議 Chunking 策略

推薦：

| 文件類型     | Chunk 策略               |
| -------- | ---------------------- |
| Markdown | Header-based           |
| PDF      | Semantic Chunk         |
| Codebase | Function / Class-based |
| SOP 文件   | Section-based          |

---

# 16. RTX 4060 8GB 實戰最佳化

## Ollama VRAM 控制

避免 OOM：

```bash
export OLLAMA_NUM_PARALLEL=1
```

---

## Context 長度建議

| 模型         | 建議 Context |
| ---------- | ---------- |
| Qwen2.5-7B | 4K ~ 8K    |
| Qwen3-8B   | 8K         |

---

## 不建議

❌ 不要：

* 同時跑 Open WebUI + embedding batch + Ollama 大模型
* 開太大 chunk
* 使用 FP16 14B 模型
* 一開始就 Neo4j Cluster

---

# 17. 驗收測試（MVP Milestone）

系統至少需能回答：

```text
哪些模組依賴 PostgreSQL？
```

```text
哪些專案同時使用 Kubernetes？
```

```text
Titan 專案有哪些負責人？
```

並符合：

* 回答需引用 Context
* 不可憑空幻覺
* 找不到資料時需明確拒答

---

# 18. 建議後續演進方向

## Phase 2

加入：

* Reranker
* Hybrid Search
* BM25
* Context Compression

---

## Phase 3

加入：

* Apache AGE Cypher Query
* Property Graph
* Multi-hop Reasoning

---

## Phase 4

加入：

* Agentic RAG
* LangGraph
* Code Knowledge Graph
* Memory Graph

---

# 19. 最終推薦架構（成熟版）

```text
                +----------------+
                |   Open WebUI   |
                +--------+-------+
                         |
                         v
                +----------------+
                |   LlamaIndex   |
                +--------+-------+
                         |
        +----------------+----------------+
        |                                 |
        v                                 v
+---------------+              +------------------+
|   Vector RAG  |              |   Graph RAG      |
| Chroma/Vector |              | Apache AGE       |
+---------------+              +------------------+
        |                                 |
        +----------------+----------------+
                         |
                         v
                +----------------+
                | PostgreSQL     |
                | + pgvector     |
                | + Apache AGE   |
                +----------------+
                         |
                         v
                +----------------+
                | Ollama/Qwen    |
                +----------------+
```
