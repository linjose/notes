 **如何讓 Agent 在大型分散式系統中，以更低延遲取得資料、呼叫工具及管理記憶體**。
 
 許多研究開始把焦點放在 HPC（高效能運算）、RDMA、DPU、CXL、GPU Networking 等領域。

以下是幾個值得關注的方向。

---

# 1. Remote memcpy / GPU Direct Memory（非常熱門）

過去 Agent 的流程通常是：

```
Storage
   │
CPU memcpy
   │
Host Memory
   │
CPU memcpy
   │
GPU
```

現在開始變成

```
Remote Memory
      │
RDMA
      │
GPU Memory
```

也就是

```
GPU ←──── RDMA ──── GPU
```

完全不用 CPU。

代表技術包括：

* NVIDIA GPUDirect RDMA
* GPUDirect Storage
* NVLink Switch
* NVSwitch
* NVLS

甚至：

```
Remote GPU Memory
      │
RDMA
      │
Local GPU
```

Agent 可以直接取得遠端 GPU cache。

---

# 2. Remote memcpy 不只是 memcpy

真正的新研究是

**Remote Memory Offloading**

例如：

```
Agent A

需要：

100GB Vector Cache

↓

不用搬資料

↓

直接 remote page fault

↓

GPU直接存取
```

這和 Linux 的

```
NUMA
```

概念有點像，

但延伸到：

> GPU NUMA

甚至：

```
GPU Pool
```

---

# 3. CXL Memory Pool

今年很多人開始討論：

```
CXL 3.0
```

以前：

```
CPU
  |
DDR
```

現在：

```
CPU
  |
CXL Switch
 |      |
RAM    RAM
 |      |
GPU    FPGA
```

未來 Agent 可以：

```
Allocate 300GB RAM

不用知道在哪台機器
```

Memory 變成：

```
Network Resource
```

而不是：

```
Local Resource
```

---

# 4. KV Cache Sharing（超重要）

Transformer 最大瓶頸：

```
KV Cache
```

以前：

每個 Agent 都：

```
重新算

Prompt

↓

Attention

↓

KV Cache
```

現在很多論文開始：

```
Agent A

↓

共享

↓

Agent B
```

例如：

```
Shared KV Cache

Agent A
Agent B
Agent C
```

這可以省下：

40~80%

Inference。

很多公司都在研究。

---

# 5. Prefix Cache

例如：

大家都在問：

```
公司內部文件

+
公司 SOP
+
產品資料
```

前面都一樣。

以前：

每次重新 tokenize。

現在：

```
Prefix Cache

↓

直接 reuse
```

OpenAI、Anthropic、Google 都有類似概念。

---

# 6. Speculative Decoding

不是新概念，

但今年成熟很多。

例如：

```
Small Model

先猜

↓

Large Model

驗證
```

如果猜對：

不用重新算。

速度：

快很多。

很多 Agent 都開始：

```
Planner

↓

Small LLM

↓

Executor

↓

Large LLM
```

---

# 7. Disaggregated Serving（今年超熱門）

以前：

```
GPU

Inference

+

KV Cache

+

Scheduler
```

全部放一起。

現在：

拆開。

例如：

```
GPU #1

Inference

GPU #2

KV Cache

CPU

Scheduler

DPU

Networking
```

例如：

vLLM、

SGLang、

Ray Serve

都開始往這方向。

---

# 8. GPU Direct Storage

Agent 要查：

```
100GB PDF
```

以前：

```
SSD

↓

CPU

↓

RAM

↓

GPU
```

現在：

```
SSD

↓

GPU
```

CPU 幾乎不用碰。

---

# 9. RDMA for Vector DB

例如：

```
Milvus

Qdrant

Weaviate
```

開始有人研究：

```
GPU

↓

RDMA

↓

Vector DB
```

不用：

```
TCP/IP
```

Latency 可以少很多。

---

# 10. DPU / SmartNIC

例如：

NVIDIA BlueField

AMD Pensando

Intel IPU

開始負責：

```
Authentication

Compression

Encryption

Routing

RPC
```

Agent 不需要自己做。

---

# 11. Memory Semantic Cache

很多論文開始研究：

不是：

```
cache bytes
```

而是：

```
cache meaning
```

例如：

Agent A 查：

```
PostgreSQL 安裝方法
```

Agent B 查：

```
How to install PostgreSQL
```

直接：

```
Semantic Hit
```

不用重新 RAG。

---

# 12. Agent Runtime OS

今年另一個方向：

不是研究模型，

而是研究：

```
Agent OS
```

例如：

```
Scheduler

Memory

Permission

Checkpoint

Context

Retry

Recovery
```

很像：

```
Kubernetes

for AI
```

---

## 未來兩年（2026–2028）最值得關注的五項底層技術

| 技術                                      | 為什麼重要                       | 成熟度   |
| --------------------------------------- | --------------------------- | ----- |
| **Remote Memory / RDMA**                | 讓 Agent 直接存取遠端記憶體，降低資料搬移成本  | ⭐⭐⭐⭐☆ |
| **Disaggregated KV Cache**              | 多 Agent 共用推論狀態，大幅提升 GPU 利用率 | ⭐⭐⭐⭐☆ |
| **CXL Memory Pooling**                  | 將記憶體資源化，突破單機 RAM 限制         | ⭐⭐⭐☆☆ |
| **GPU Direct Storage / GPUDirect RDMA** | 減少 CPU 介入，加速資料流向 GPU        | ⭐⭐⭐⭐⭐ |
| **Agent Runtime（排程、權限、Checkpoint）**     | 將 AI Agent 視為可治理、可調度的「工作負載」 | ⭐⭐⭐⭐☆ |

