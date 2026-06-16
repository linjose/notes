---
layout: post
title: 分散式推論開源專案
date: 2026-06-09
reading_time: 10 min read
tags: [AI]
excerpt: 
---

### 1. Exo (`exo-explore/exo`)
* **Exo：** https://exolabs.net/
* **特點：** 這是目前最受矚目的去中心化 AI 推論專案。它不採用傳統的「主從架構（Master-Worker）」，而是透過 P2P 網路（基於 `zenoh` 協定）將所有裝置連在一起。它支持異質設備混合（例如：Mac、NVIDIA 顯卡、甚至是 Raspberry Pi 的 CPU 一起混跑）。
* **底層：** 原生支持 Apple 的 MLX，並透過 `tinygrad` 支援 NVIDIA CUDA 等架構。

### 2. Distributed Llama (`b4rtaz/distributed-llama`)
* **Distributed Llama：** https://github.com/b4rtaz/distributed-llama
* **特點：** 專門為了將家裡分散的舊電腦、舊設備（包括樹莓派、舊 PC）透過區域網路（Ethernet）串聯起來進行 LLM 推論。它利用張量並行（Tensor Parallelism）把模型拆分到各台機器的記憶體中。

### 3. GPUStack 與 llama-box

* **GPUStack：** https://github.com/gpustack/gpustack
* **llama-box：** https://github.com/gpustack/llama-box
* **特點：** 這是一個比較偏向企業或私有雲管理的開源專案。它可以把多台裝有不同 GPU 的 Worker 節點串成一個資源池，並支援跨節點的分散式推論（Distributed Inference across workers）。
