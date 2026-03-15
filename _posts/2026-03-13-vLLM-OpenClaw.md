---
layout: post
title: vLLM & openclaw
date: 2026-03-13
reading_time: 15 min read
tags: [AI, openclaw]
excerpt: 
---


下面是一套 **方案 C：Host 提供 LLM Server，VM 跑 OpenClaw Agent** 的完整架構與安裝流程。
環境假設：

* Host：**Ubuntu 24.04**
* GPU：**NVIDIA GeForce RTX 4060**
* LLM：**Qwen**
* 推理引擎：**vLLM**
* 虛擬化：**KVM**
* Agent：**OpenClaw**

---

# 一、整體架構（推薦 AI Lab 架構）

```text
Host (Ubuntu 24.04)
│
├─ RTX 4060 GPU
│
├─ Qwen Inference Server (vLLM)
│     http://HOST:8000
│
└─ KVM Hypervisor
     │
     └─ VM (Ubuntu)
          └─ OpenClaw Agent
               │
               └─ API → Host LLM Server
```

優點：

* GPU **只由 Host 管理**
* 多 VM 可共享 LLM
* VM 可隨時重建
* 適合 AI agent sandbox

---

# 二、Host 安裝 NVIDIA Driver

更新系統：

```bash
sudo apt update
sudo apt upgrade -y
```

安裝 driver：

```bash
sudo apt install -y nvidia-driver-550
```

重開機：

```bash
sudo reboot
```

確認 GPU：

```bash
nvidia-smi
```

看到 **RTX 4060** 就成功。

---

# 三、Host 安裝 Python AI 環境

安裝 Python：

```bash
sudo apt install -y python3 python3-venv python3-pip git
```

建立 AI 環境：

```bash
python3 -m venv ~/ai-env
source ~/ai-env/bin/activate
```

升級 pip：

```bash
pip install --upgrade pip
```

---

# 四、安裝 GPU 版 PyTorch

```bash
pip install torch torchvision torchaudio \
--index-url https://download.pytorch.org/whl/cu121
```

測試 GPU：

```bash
python - <<EOF
import torch
print(torch.cuda.is_available())
print(torch.cuda.get_device_name(0))
EOF
```

---

# 五、安裝 vLLM

```bash
pip install vllm
```

---

# 六、啟動 Qwen Server

RTX 4060（8GB）推薦模型：

```
Qwen/Qwen2.5-7B-Instruct
```

啟動：

```bash
python -m vllm.entrypoints.openai.api_server \
--model Qwen/Qwen2.5-7B-Instruct \
--gpu-memory-utilization 0.9 \
--max-model-len 8192 \
--host 0.0.0.0 \
--port 8000
```

Server 會變成：

```
http://HOST_IP:8000/v1
```

---

# 七、測試 LLM Server

Host 測試：

```bash
curl http://localhost:8000/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{
"model": "Qwen/Qwen2.5-7B-Instruct",
"messages":[{"role":"user","content":"Hello"}]
}'
```

同時看 GPU：

```bash
watch -n1 nvidia-smi
```

---

# 八、Host 安裝 KVM

安裝虛擬化工具：

```bash
sudo apt install -y qemu-kvm libvirt-daemon-system virt-manager ovmf
```

加入 libvirt 群組：

```bash
sudo usermod -aG libvirt $USER
```

重新登入。

啟動管理工具：

```bash
virt-manager
```

---

# 九、建立 OpenClaw VM

建議 VM 配置：

| 資源   | 建議           |
| ---- | ------------ |
| CPU  | 6–8 cores    |
| RAM  | 16GB         |
| Disk | 60GB         |
| OS   | Ubuntu 24.04 |

VM **不需要 GPU passthrough**（GPU 在 Host）。

---

# 十、VM 裡安裝 OpenClaw

VM 開機後：

```bash
sudo apt update
sudo apt install -y git python3 python3-pip python3-venv
```

建立環境：

```bash
python3 -m venv openclaw-env
source openclaw-env/bin/activate
```

下載：

```bash
git clone https://github.com/OpenClawAI/OpenClaw.git
cd OpenClaw
```

安裝：

```bash
pip install -r requirements.txt
```

---

# 十一、讓 OpenClaw 使用 Host 的 Qwen

先找 Host IP：

```bash
ip a
```

通常是：

```
192.168.122.1
```

VM 設定：

```bash
export OPENAI_BASE_URL=http://192.168.122.1:8000/v1
export OPENAI_API_KEY=dummy
```

測試：

```bash
curl $OPENAI_BASE_URL/models
```

---

# 十二、啟動 OpenClaw

```bash
python main.py
```

流程：

```
OpenClaw → API → Host vLLM → RTX 4060 → 回傳結果
```

---

# 十三、性能預期（4060）

Qwen2.5-7B：

| 指標       | 數值          |
| -------- | ----------- |
| token 速度 | 45–70 tok/s |
| 延遲       | ~50ms       |
| VRAM     | ~7GB        |

---

# 十四、進階優化（建議）

### 1. systemd 自動啟動 LLM

建立 service：

```bash
sudo nano /etc/systemd/system/qwen.service
```

內容：

```ini
[Unit]
Description=Qwen vLLM Server

[Service]
User=YOURUSER
ExecStart=/home/YOURUSER/ai-env/bin/python -m vllm.entrypoints.openai.api_server --model Qwen/Qwen2.5-7B-Instruct --gpu-memory-utilization 0.9 --host 0.0.0.0

[Install]
WantedBy=multi-user.target
```

啟用：

```bash
sudo systemctl enable qwen
sudo systemctl start qwen
```

---

### 2. AI Lab 常見擴充

Host 還可以加：

| 系統                   | 功能     |
| -------------------- | ------ |
| **Ollama**           | 本地模型管理 |
| **Milvus**           | RAG    |
| **Stable Diffusion** | 影像生成   |

VM：

* OpenClaw agent
* coding agent
* browser automation

---

# 十五、未來可升級

你的架構可以直接升級成：

```
Home AI Server
│
├─ Qwen inference
├─ Vector DB
├─ RAG
├─ Image AI
│
└─ KVM
    ├─ OpenClaw agent
    ├─ Auto coding agent
    └─ Web automation agent
```
