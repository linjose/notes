---
layout: post
title: AI 相關技術整理
date: 2026-05-14
reading_time: 15 min read
tags: [AI]
excerpt: 
---


如果先排除硬體（GPU、資料中心、晶片）這一層，真正要把 AI 技術做起來，核心其實是「軟體、資料、系統、產品化能力」的整套堆疊。現在全球強的 AI 公司，不只是模型強，而是把下面這些能力串成完整生態。

我可以把它拆成 10 個必備技術層：

---

# 1. 機器學習／深度學習核心

這是 AI 的基礎數學與模型能力。

關鍵技術：

* 神經網路（Neural Networks）
* Transformer
* CNN / RNN
* Attention 機制
* 強化學習（RL）
* 自監督學習（Self-supervised Learning）
* 多模態學習（Multimodal）

現在的大語言模型核心就是：

Attention(Q,K,V)=\mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V

這個 Attention 幾乎是現代生成式 AI 的根基。

相關學科會包括：

* 線性代數
* 微積分
* 機率統計
* 最佳化（Optimization）

---

# 2. 大規模資料工程（Data Engineering）

AI 強不強，很大部分取決於資料系統。

必備能力：

* 資料清洗
* ETL pipeline
* Data Lake
* 向量資料庫
* 即時串流資料
* 標註系統
* 分散式資料處理

常見技術：

* Apache Spark
* Kafka
* Airflow
* Hadoop
* Delta Lake

現在很多 AI 團隊其實「資料工程師比模型工程師更多」。

因為：

> Garbage In, Garbage Out.

---

# 3. 模型訓練框架

沒有框架，AI 很難快速迭代。

主流技術：

* PyTorch
* TensorFlow
* JAX

現在研究界幾乎被 PyTorch 統治。

JAX 在大型模型與高效訓練很強。

---

# 4. 分散式訓練系統

模型一大，就不是單機能跑。

核心技術：

* Data Parallelism
* Model Parallelism
* Pipeline Parallelism
* Gradient Checkpointing
* ZeRO Optimization

相關工具：

* DeepSpeed
* Megatron-LM
* Ray
* Horovod

這塊其實是 OpenAI、Google、Anthropic 的真正護城河之一。

因為：

> 「讓模型能訓練」比「想到模型架構」還困難。

---

# 5. 模型壓縮與推論優化

AI 不只要會訓練，還要能部署。

關鍵技術：

* Quantization
* Pruning
* Distillation
* KV Cache
* TensorRT
* ONNX
* vLLM

現在很多 AI 公司真正競爭點：

不是模型「最強」，

而是：

* 延遲最低
* 成本最低
* TPS 最高

---

# 6. 向量搜尋與 RAG

現在企業 AI 幾乎都離不開：

RAG（Retrieval-Augmented Generation）

核心概念：

* Embedding
* 向量搜尋
* 語意檢索
* Hybrid Search
* Chunking
* Re-ranking

Embedding 本質上是：

\mathrm{similarity}(x,y)=\frac{x\cdot y}{|x||y|}

也就是向量空間中的語意距離。

常見技術：

* FAISS
* Milvus
* Weaviate
* pgvector

---

# 7. AI Agent 系統

這是 2025–2026 最熱門的方向之一。

核心能力：

* Tool Calling
* Planning
* Memory
* Workflow Orchestration
* Multi-Agent Systems
* Computer Use

相關框架：

* LangChain
* LangGraph
* AutoGen
* CrewAI

現在很多「AI 公司」其實是在做：

> LLM + Agent + Workflow Automation

而不是只做模型。

---

# 8. MLOps / AI Infrastructure

AI 要進企業，一定需要工程化。

必備：

* 模型版本管理
* 實驗追蹤
* CI/CD
* Feature Store
* Model Registry
* Monitoring
* Drift Detection

工具：

* MLflow
* Kubeflow
* Weights & Biases
* BentoML

這是很多 AI 新創最容易忽略，但最後最重要的一層。

---

# 9. AI 安全與對齊（Alignment）

模型越強，這塊越重要。

關鍵技術：

* RLHF
* Constitutional AI
* Safety Filtering
* Prompt Injection Defense
* Jailbreak Detection
* Hallucination Reduction

RLHF 的核心目標可寫成：

\max_{\pi} \mathbb{E}_{x\sim D, y\sim \pi(\cdot|x)}[r(x,y)]

也就是讓模型最大化「人類偏好」。

---

# 10. AI 產品化能力（最容易被低估）

很多團隊模型很強，但產品失敗。

真正重要的是：

* Prompt Engineering
* UX
* Human-in-the-loop
* 工作流設計
* 商業場景整合
* API 設計
* SaaS 架構

因為：

> AI 本身不等於產品。

---

# 如果從國家層級看，還需要什麼？

一個國家要真正發展 AI，除了硬體，還必須有：

## 人才

* 數學
* 演算法
* 分散式系統
* 資料工程
* 軟體工程

## 開源生態

例如：

* Hugging Face
* PyTorch Foundation

## 雲端平台

* API 生態
* GPU 調度
* 模型服務化

## 資料來源

尤其：

* 語言資料
* 在地化資料
* 專業知識資料

台灣其實在「中文繁體資料」和「半導體 AI 應用」有潛力。

---

# 最核心的結論

如果把 AI 想成一棟大樓：

* 演算法 = 結構
* 資料 = 原料
* 分散式系統 = 水電工程
* MLOps = 維運
* Agent = 自動化能力
* Product = 商業價值

而真正最稀缺的，通常不是模型本身，而是：

> 「把模型變成可靠產品」的整體工程能力。

| 技術領域              | 核心內容                          | 代表公司 / 組織                                                                                                                                                                                                                                                                                                                                                   |
| ----------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 機器學習／深度學習         | Transformer、LLM、多模態、RL        | [OpenAI](https://openai.com?utm_source=chatgpt.com)、[Google DeepMind](https://deepmind.google?utm_source=chatgpt.com)、[Anthropic](https://www.anthropic.com?utm_source=chatgpt.com)、[Meta AI](https://ai.meta.com?utm_source=chatgpt.com)、[xAI](https://x.ai?utm_source=chatgpt.com)                                                                        |
| AI 研究與基礎模型        | Foundation Model、AGI 研究       | [Mistral AI](https://mistral.ai?utm_source=chatgpt.com)、[Cohere](https://cohere.com?utm_source=chatgpt.com)、[AI21 Labs](https://www.ai21.com?utm_source=chatgpt.com)、[Adept AI](https://www.adept.ai?utm_source=chatgpt.com)                                                                                                                                |
| 開源模型生態            | 開源 LLM、模型社群                   | [Hugging Face](https://huggingface.co?utm_source=chatgpt.com)、[Stability AI](https://stability.ai?utm_source=chatgpt.com)、[EleutherAI](https://www.eleuther.ai?utm_source=chatgpt.com)                                                                                                                                                                      |
| 深度學習框架            | 模型訓練框架                        | PyTorch、TensorFlow、JAX                                                                                                                                                                                                                                                                                                                                      |
| 分散式訓練             | 大規模模型訓練                       | [Microsoft Research](https://www.microsoft.com/en-us/research?utm_source=chatgpt.com)（DeepSpeed）、[NVIDIA AI](https://www.nvidia.com/en-us/ai-data-science?utm_source=chatgpt.com)（Megatron-LM）、[Anyscale](https://www.anyscale.com?utm_source=chatgpt.com)（Ray）                                                                                             |
| 資料工程              | ETL、Data Lake、串流處理            | [Databricks](https://www.databricks.com?utm_source=chatgpt.com)、[Confluent](https://www.confluent.io?utm_source=chatgpt.com)、[Snowflake](https://www.snowflake.com?utm_source=chatgpt.com)、[Cloudera](https://www.cloudera.com?utm_source=chatgpt.com)                                                                                                      |
| 向量資料庫 / RAG       | Embedding、語意搜尋                | [Pinecone](https://www.pinecone.io?utm_source=chatgpt.com)、[Weaviate](https://weaviate.io?utm_source=chatgpt.com)、[Zilliz](https://zilliz.com?utm_source=chatgpt.com)（Milvus）、[Chroma](https://www.trychroma.com?utm_source=chatgpt.com)                                                                                                                    |
| 推論優化              | Quantization、Inference Engine | [NVIDIA TensorRT](https://developer.nvidia.com/tensorrt?utm_source=chatgpt.com)、[vLLM Project](https://vllm.ai?utm_source=chatgpt.com)、[OctoAI](https://octo.ai?utm_source=chatgpt.com)、[Together AI](https://www.together.ai?utm_source=chatgpt.com)                                                                                                       |
| AI Agent          | Agent Workflow、自動化            | [LangChain](https://www.langchain.com?utm_source=chatgpt.com)、[CrewAI](https://www.crewai.com?utm_source=chatgpt.com)、[Microsoft AutoGen](https://microsoft.github.io/autogen?utm_source=chatgpt.com)、[Dust](https://dust.tt?utm_source=chatgpt.com)                                                                                                        |
| MLOps             | 模型部署與管理                       | [Weights & Biases](https://wandb.ai?utm_source=chatgpt.com)、[MLflow](https://mlflow.org?utm_source=chatgpt.com)、[Kubeflow](https://www.kubeflow.org?utm_source=chatgpt.com)、[BentoML](https://www.bentoml.com?utm_source=chatgpt.com)                                                                                                                       |
| AI 雲平台            | 模型 API、AI 雲端                  | [Microsoft Azure AI](https://azure.microsoft.com/en-us/products/ai-services?utm_source=chatgpt.com)、[Google Cloud AI](https://cloud.google.com/ai?utm_source=chatgpt.com)、[Amazon Web Services AI](https://aws.amazon.com/machine-learning?utm_source=chatgpt.com)、[Oracle Cloud AI](https://www.oracle.com/artificial-intelligence?utm_source=chatgpt.com) |
| AI 晶片軟體生態         | CUDA、AI SDK、生態系               | [NVIDIA CUDA](https://developer.nvidia.com/cuda-toolkit?utm_source=chatgpt.com)、[AMD ROCm](https://rocm.docs.amd.com?utm_source=chatgpt.com)、[Intel AI](https://www.intel.com/content/www/us/en/artificial-intelligence/overview.html?utm_source=chatgpt.com)                                                                                               |
| AI 搜尋             | AI Search、知識引擎                | [Perplexity AI](https://www.perplexity.ai?utm_source=chatgpt.com)、[You.com](https://you.com?utm_source=chatgpt.com)、[Glean](https://www.glean.com?utm_source=chatgpt.com)                                                                                                                                                                                   |
| AI Coding         | AI 程式助手                       | [GitHub Copilot](https://github.com/features/copilot?utm_source=chatgpt.com)、[Cursor](https://cursor.com?utm_source=chatgpt.com)、[Replit AI](https://replit.com/ai?utm_source=chatgpt.com)、[Codeium](https://codeium.com?utm_source=chatgpt.com)                                                                                                            |
| AI 安全 / Alignment | 安全對齊、RLHF                     | [Anthropic Safety Research](https://www.anthropic.com/research?utm_source=chatgpt.com)、[OpenAI Safety](https://openai.com/safety?utm_source=chatgpt.com)、[Center for AI Safety](https://www.safe.ai?utm_source=chatgpt.com)                                                                                                                                 |
| AI 機器人            | Robotics + AI                 | [Figure AI](https://www.figure.ai?utm_source=chatgpt.com)、[Boston Dynamics](https://bostondynamics.com?utm_source=chatgpt.com)、[Tesla Optimus](https://www.tesla.com/AI?utm_source=chatgpt.com)                                                                                                                                                             |
| AI 語音             | ASR、TTS、語音 Agent              | [ElevenLabs](https://elevenlabs.io?utm_source=chatgpt.com)、[Deepgram](https://deepgram.com?utm_source=chatgpt.com)、[AssemblyAI](https://www.assemblyai.com?utm_source=chatgpt.com)                                                                                                                                                                          |
| AI 影像生成           | Diffusion、影片生成                | [Runway](https://runwayml.com?utm_source=chatgpt.com)、[Midjourney](https://www.midjourney.com?utm_source=chatgpt.com)、[Pika Labs](https://pika.art?utm_source=chatgpt.com)、[Luma AI](https://lumalabs.ai?utm_source=chatgpt.com)                                                                                                                            |
| AI 智慧資料分析         | BI + AI                       | [Palantir](https://www.palantir.com?utm_source=chatgpt.com)、[Dataiku](https://www.dataiku.com?utm_source=chatgpt.com)、[C3 AI](https://c3.ai?utm_source=chatgpt.com)                                                                                                                                                                                         |
| AI 企業自動化          | Workflow Automation           | [UiPath](https://www.uipath.com?utm_source=chatgpt.com)、[Automation Anywhere](https://www.automationanywhere.com?utm_source=chatgpt.com)、[Zapier AI](https://zapier.com/ai?utm_source=chatgpt.com)                                                                                                                                                          |
| AI 在地語言 / 中文模型    | 中文 LLM、生態                     | [01.AI（零一萬物）](https://www.lingyiwanwu.com?utm_source=chatgpt.com)、[MiniMax](https://www.minimaxi.com?utm_source=chatgpt.com)、[智譜 AI（Zhipu AI）](https://www.zhipuai.cn?utm_source=chatgpt.com)、[阿里雲通義千問](https://tongyi.aliyun.com?utm_source=chatgpt.com)                                                                                                   |
| 台灣 AI 生態          | 本地 AI 應用 / 平台                 | [Appier](https://www.appier.com?utm_source=chatgpt.com)、[iKala](https://ikala.ai?utm_source=chatgpt.com)、[台達電子 AI Solutions](https://www.deltaww.com?utm_source=chatgpt.com)、[工研院 AI](https://www.itri.org.tw?utm_source=chatgpt.com)                                                                                                                       |

---

# 如果把 AI 產業鏈再濃縮

可以大致分成這 5 大勢力：

| 類型              | 代表公司                                                                                                                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 基礎模型霸主          | [OpenAI](https://openai.com?utm_source=chatgpt.com)、[Google DeepMind](https://deepmind.google?utm_source=chatgpt.com)、[Anthropic](https://www.anthropic.com?utm_source=chatgpt.com)                   |
| 開源生態            | [Meta AI](https://ai.meta.com?utm_source=chatgpt.com)、[Hugging Face](https://huggingface.co?utm_source=chatgpt.com)                                                                                   |
| AI Infra        | [NVIDIA](https://www.nvidia.com?utm_source=chatgpt.com)、[Databricks](https://www.databricks.com?utm_source=chatgpt.com)、[Snowflake](https://www.snowflake.com?utm_source=chatgpt.com)                 |
| Agent / Product | [LangChain](https://www.langchain.com?utm_source=chatgpt.com)、[Perplexity AI](https://www.perplexity.ai?utm_source=chatgpt.com)、[Cursor](https://cursor.com?utm_source=chatgpt.com)                   |
| 企業 AI           | [Microsoft](https://www.microsoft.com/ai?utm_source=chatgpt.com)、[Amazon Web Services](https://aws.amazon.com?utm_source=chatgpt.com)、[Google Cloud](https://cloud.google.com?utm_source=chatgpt.com) |

這張表其實已經接近現在全球 AI 產業版圖。
