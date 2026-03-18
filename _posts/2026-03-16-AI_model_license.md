---
layout: post
title: licenses of AI models 
date: 2026-03-16
reading_time: 15 min read
tags: [AI, licenses]
excerpt: 
---


簡單說：**Hugging Face 上的模型本身沒有統一授權**，每個模型都有自己的 license，所以**商業使用限制差異很大**。目前主流模型大致可以分成幾類授權模式。

整理在 Hugging Face 上最常遇到的幾種情況👇

---

# 1️⃣ 完全可商用（最安全）

這類模型使用 **Apache-2.0 / MIT / BSD** 這類「寬鬆開源授權」。

**特徵：**

* 可以商用
* 可以修改 / fine-tune
* 可以重新分發
* 只要保留 license 和 attribution

**代表模型**

* Mistral 系列（如 Mixtral、Mistral-7B）
* Falcon
* Qwen
* Phi 系列
* 一些 BLOOM / BERT 系列

例如 Mistral 的開源模型就是 **Apache-2.0 license**，允許任何用途（包括商業）只需保留授權聲明。 ([help.mistral.ai][1])

👉 這類是 **最適合企業產品用的模型**

---

# 2️⃣ 可商用但有額外條件

這類模型有 **自訂 license**，允許商用但附帶限制。

最典型例子：

## Llama 系列

* Llama 2 / Llama 3 license
* 可以商用，但有條件

主要限制：

* **MAU > 7 億需要 Meta 商業授權**
* **不能用輸出訓練競爭的 foundation model**
* 某些軍事或監控用途禁止 ([SoftwareSeni][2])

所以：

| 使用方式        | 是否允許 |
| ----------- | ---- |
| SaaS 產品     | ✔    |
| App chatbot | ✔    |
| 再訓練另一個 LLM  | ❌    |

---

# 3️⃣ 有 Responsible AI / 使用限制

有些模型在 Apache / MIT 上加 **RAIL / usage policy**。

例如：

* Falcon (Apache + RAIL)
* 一些 Stable Diffusion
* 部分 research model

限制可能包括：

* 不得用於 **武器 / surveillance**
* 不得用於 **歧視 / harmful application**
* 需要 **human oversight**

這種 **法律可商用，但有倫理限制**。 ([Alibaba][3])

---

# 4️⃣ 研究用途 / 非商用

這類模型最容易踩雷。

常見情況：

* **research only**
* **non-commercial**
* **academic license**

例子：

* 一些 Google research model
* 部分 academic LLM
* 某些 Chinese research models
* early LLaMA / derivative

這些 **不能做商業產品**。

---

# 5️⃣ 派生模型的隱性限制（很多人忽略）

Hugging Face 很多模型是：

```
base model + finetune
```

例如：

```
Vicuna = LLaMA + finetune
```

即使 finetune repo 寫：

```
Apache 2.0
```

但如果 **base model 是 LLaMA**

👉 仍然要遵守 **LLaMA license**

所以很多 HF 模型其實 **繼承 base model 限制**。 ([truefoundry.com][4])

---

# 6️⃣ Hugging Face 本身沒有商業限制

要注意：

**HF 平台只是 hosting**

你用模型 **不用付 HF license fee**
但必須遵守 **模型作者的 license**。

---

# 🧭 商業使用最安全的模型（2025-2026常見）

如果你是做產品，一般推薦：

**最乾淨 license**

* Mistral / Mixtral (Apache 2)
* Qwen (Apache 2)
* Falcon (Apache 2)
* Phi (MIT)

**稍微有限制**

* Llama 3
* Gemma

**最好避免**

* research license
* non-commercial
* unclear license

---

💡 **實務建議（很多公司流程）**

商業部署前通常會做：

1️⃣ 檢查 model card 的

```
LICENSE
USE_POLICY
```

2️⃣ 檢查 **base model license**

3️⃣ 檢查 **training dataset license**

---

✅ **一句話總結**

> Hugging Face 上很多模型可以商用，但每個模型 license 不同，從「完全開源 Apache」到「限制用途」甚至「禁止商用」都有。

---


[1]: https://help.mistral.ai/en/articles/347393-under-which-license-are-mistral-s-open-models-available?utm_source=chatgpt.com "Under which license are Mistral’s open models available? | Mistral AI - Help Center"
[2]: https://www.softwareseni.com/llama-mistral-deepseek-and-qwen-licence-terms-compared-for-commercial-use/?utm_source=chatgpt.com "Llama Mistral DeepSeek and Qwen Licence Terms Compared for Commercial Use - SoftwareSeni"
[3]: https://www.alibaba.com/product-insights/how-to-safely-fine-tune-open-source-ai-models-without-leaking-private-data-or-violating-licenses.html?utm_source=chatgpt.com "How To Safely Fine-tune Open-source Ai Models Without Leaking Private Data Or Violating Licenses"
[4]: https://www.truefoundry.com/blog/all-about-license-for-llm-models?utm_source=chatgpt.com "Large Language Models for Commercial Use | TrueFoundry"
