---
layout: post
title: 士大夫大型語言模型建置指南
date: 2026-05-29
reading_time: 20 min read
tags: [AI]
excerpt: （Implementation Guide v0.1）
---

# 1. 專案目標

建立一個具備以下特徵的中文大型語言模型：

### 思想特徵

* 中華文化導向
* 民國知識份子風格
* 重視禮義廉恥
* 強調責任與修身
* 具備歷史與文化脈絡

### 語言特徵

* 現代白話文為主
* 適度引用經史典籍
* 避免網路流行語
* 採用溫和理性表達
* 保持論理性與層次感

### 技術特徵

* 本地部署
* 可持續微調
* 可結合 Graph RAG
* 支援長期知識擴充

---

# 2. 系統架構

```text
                ┌─────────────┐
                │ User Query  │
                └──────┬──────┘
                       │
                       ▼
          ┌────────────────────────┐
          │ Republic Scholar Prompt│
          └──────────┬─────────────┘
                     │
                     ▼
           ┌──────────────────┐
           │  Qwen3-8B-LoRA   │
           └────────┬─────────┘
                    │
         ┌──────────┴───────────┐
         ▼                      ▼
   Vector Search         Graph Search
   pgvector              Apache AGE

         ▼                      ▼
          └──────────┬──────────┘
                     ▼
              Context Builder
                     ▼
              Final Response
```

---

# 3. 硬體環境

## 開發環境

CPU

Intel i5-12400

Memory

32GB RAM

GPU

RTX 4060 8GB

Storage

512GB SSD以上

---

# 4. 作業系統

Ubuntu 26.04 LTS

更新系統：

```bash
sudo apt update
sudo apt upgrade -y
```

---

# 5. Python環境

安裝：

```bash
sudo apt install python3.12
sudo apt install python3-pip
sudo apt install python3-venv
```

建立虛擬環境：

```bash
mkdir republic-scholar
cd republic-scholar

python3 -m venv venv

source venv/bin/activate
```

---

# 6. 安裝AI套件

```bash
pip install torch
pip install transformers
pip install accelerate
pip install datasets
pip install peft
pip install trl
pip install bitsandbytes
pip install sentence-transformers
pip install vllm
```

驗證GPU：

```python
import torch

print(torch.cuda.is_available())
```

結果應為：

```python
True
```

---

# 7. 建立專案目錄

```text
republic-scholar/

├── corpus/
│
├── datasets/
│
├── embeddings/
│
├── lora/
│
├── prompts/
│
├── benchmark/
│
├── graph/
│
├── scripts/
│
└── models/
```

---

# 8. 語料庫建置

## 第一批語料

建立：

```text
corpus/raw/
```

收錄：

論語
孟子
大學
中庸
禮記

曾國藩家書

梁啟超文集

胡適文集

錢穆文集

唐君毅文集

---

# 9. 語料格式統一

建立：

```json
{
  "title":"論語",
  "author":"孔子",
  "era":"先秦",
  "category":"經典",
  "content":"..."
}
```

儲存：

```text
corpus/clean/
```

---

# 10. Chunk切割

每段：

```text
500~800字
```

範例：

```json
{
  "chunk_id":"lunyu_001",
  "source":"論語",
  "content":"..."
}
```

輸出：

```text
corpus/chunks/
```

---

# 11. 向量資料庫

安裝 PostgreSQL：

```bash
sudo apt install postgresql
```

建立資料庫：

```sql
CREATE DATABASE scholar;
```

---

安裝 pgvector：

```sql
CREATE EXTENSION vector;
```

建立表格：

```sql
CREATE TABLE documents
(
    id SERIAL PRIMARY KEY,

    title TEXT,

    source TEXT,

    content TEXT,

    embedding VECTOR(1024)
);
```

---

# 12. 建立Embedding

模型：

BGE-M3

或

Qwen Embedding

程式：

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "BAAI/bge-m3"
)

embedding = model.encode(text)
```

寫入 PostgreSQL。

---

# 13. 建立 System Prompt

檔案：

```text
prompts/republic_scholar.txt
```

內容：

你是一位受民國教育薰陶之士君子。

回答原則：

1. 重視禮義廉恥。
2. 重視理性與責任。
3. 採用現代白話文。
4. 必要時引用經史典故。
5. 保持克制與尊重。
6. 以修身與公共利益為優先。

語言風格：

* 溫雅
* 審慎
* 條理清晰
* 不使用網路流行語

---

# 14. 建立SFT資料集

格式：

```json
{
  "messages":[
    {
      "role":"user",
      "content":"如何面對失敗？"
    },
    {
      "role":"assistant",
      "content":"人生遭遇挫折..."
    }
  ]
}
```

---

資料來源

人工撰寫

GPT輔助生成

Qwen輔助生成

專家校正

---

資料量

第一版：

```text
5000筆
```

---

# 15. LoRA訓練

基礎模型

Qwen3-8B-Instruct

---

設定：

```yaml
lora_r: 64

lora_alpha: 128

lora_dropout: 0.05

learning_rate: 2e-5

epochs: 3

batch_size: 1

gradient_accumulation_steps: 16
```

---

啟動訓練：

```bash
python train_sft.py
```

輸出：

```text
models/qwen-scholar-v1
```

---

# 16. DPO資料集

格式：

```json
{
  "prompt":"主管責備我",

  "chosen":"先理解問題本身...",

  "rejected":"立刻反擊..."
}
```

---

建立：

```text
3000~5000筆
```

---

主題：

職場

家庭

教育

金錢

責任

國家

歷史

修身

---

# 17. DPO訓練

執行：

```bash
python train_dpo.py
```

輸出：

```text
models/qwen-scholar-v2
```

---

# 18. Apache AGE知識圖譜

安裝：

```bash
sudo apt install apache-age
```

建立節點：

Person

Book

Concept

School

Event

---

範例：

```cypher
CREATE
(:Person {name:'胡適'})

CREATE
(:Concept {name:'自由主義'})

CREATE
(:Person {name:'胡適'})
-[:BELIEVE]->
(:Concept {name:'自由主義'})
```

---

# 19. Graph RAG

查詢：

```cypher
MATCH
(p:Person)-[:BELIEVE]->(c:Concept)

RETURN p,c
```

輸出：

```json
{
 "person":"胡適",
 "concept":"自由主義"
}
```

作為 Context 注入模型。

---

# 20. Benchmark測試集

建立：

```text
benchmark/
```

分類：

職場

家庭

倫理

歷史

教育

修身

公共事務

---

題數：

```text
1000題
```

---

# 21. 評測指標

建立五項評分：

Courtesy

Morality

Responsibility

Prudence

Elegance

---

每項：

```text
1~5分
```

---

# 22. Web UI

推薦：

Open WebUI

安裝：

```bash
docker run -d \
-p 3000:8080 \
ghcr.io/open-webui/open-webui:main
```

---

模型掛載：

```text
Qwen-Scholar-v2
```

---

# 23. 第一版成果

輸出：

Republic Scholar v0.1

組成：

Qwen3-8B

*

LoRA Persona

*

民國語料庫

*

PostgreSQL

*

pgvector

*

System Prompt

---

# 24. 第二版發展方向

Republic Scholar v0.2

增加：

Graph RAG

思想流派比較

人物知識圖譜

人格評測系統

---

# 25. 預期時程

第一個可用版本：

4~8週

第一版LoRA：

8~12週

Graph RAG整合：

12~16週

完整Beta版本：

6個月

```
```


