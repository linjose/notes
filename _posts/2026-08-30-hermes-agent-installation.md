# Hermes Agent 安裝步驟

## 一、環境需求

Hermes Agent 支援 Linux、macOS、WSL2 及 Android Termux。Linux 環境安裝前主要需要確認：

```bash
git
curl
xz-utils
```

Ubuntu / Debian 可先執行：

```bash
sudo apt update
sudo apt install -y git curl xz-utils
```

確認 Git：

```bash
git --version
```

Hermes 的安裝程式會自動處理大部分其他相依套件，包括：

* uv
* Python 3.11
* Node.js
* ripgrep
* ffmpeg
* Python virtual environment

因此不需要另外手動安裝 Python 或 Node.js。([Hermes Agent][1])

---

## 二、安裝 Hermes Agent

建議使用一般 Linux 使用者帳號執行：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

官方目前推薦的 Linux / macOS / WSL2 CLI 安裝方式即為此一行指令。([Hermes Agent][1])

安裝程式會自動：

```text
下載 Hermes Agent
        ↓
建立 Hermes 執行環境
        ↓
安裝 Python / uv
        ↓
安裝 Node.js 等相依套件
        ↓
建立 Python virtual environment
        ↓
安裝 Hermes CLI
        ↓
建立 hermes 指令
        ↓
進入初始設定
```

一般使用者安裝後，主要目錄為：

```text
~/.hermes/
├── hermes-agent/        # Hermes Agent 程式
├── config.yaml          # 一般設定
├── .env                 # API Key / Token 等機密設定
├── sessions/            # Session 資料
└── ...

~/.local/bin/hermes      # hermes 指令
```

官方預設的 per-user 安裝位置為 `~/.hermes/hermes-agent/`，CLI launcher 則位於 `~/.local/bin/hermes`。([Hermes Agent][1])

---

## 三、重新載入 Shell

安裝完成後執行：

```bash
source ~/.bashrc
```

如果使用 zsh：

```bash
source ~/.zshrc
```

接著確認 Hermes 是否能被找到：

```bash
which hermes
```

正常情況通常會看到：

```text
/home/<username>/.local/bin/hermes
```

---

## 四、檢查 Hermes 安裝狀態

首先建議執行：

```bash
hermes doctor
```

Hermes 會檢查執行環境、相依套件及設定是否正常。

也可以查看版本：

```bash
hermes version
```

如果出現：

```text
hermes: command not found
```

先重新載入：

```bash
source ~/.bashrc
```

若仍無法找到，可確認：

```bash
echo $PATH
ls -l ~/.local/bin/hermes
```

必要時加入 PATH：

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

官方也建議使用 `hermes doctor` 作為安裝後主要診斷工具。([Hermes Agent][1])

---

## 五、設定 AI Model

Hermes Agent 本身不是 LLM，因此安裝完成後還需要指定一個 AI Model Provider。

執行：

```bash
hermes model
```

進入互動式設定。

也可以重新跑完整設定：

```bash
hermes setup
```

如果使用 Nous Portal，可執行：

```bash
hermes setup --portal
```

Hermes 目前支援許多 Provider，包括：

```text
Nous Portal
OpenAI / Codex
Anthropic
OpenRouter
Google Gemini
DeepSeek
Qwen
NVIDIA NIM
AWS Bedrock
Azure AI Foundry
GitHub Copilot
LM Studio
Ollama
vLLM
SGLang
Custom OpenAI-compatible Endpoint
...
```

對自行架設模型的環境，可以選擇：

```text
Custom Endpoint
```

因此也能將 Hermes Agent 接到：

```text
Ollama
vLLM
SGLang
LM Studio
其他 OpenAI-compatible API
```

Hermes 官方目前要求模型至少提供 **64K context window**；自行部署 Ollama、vLLM 或 SGLang 時需要特別確認 context length。([Hermes Agent][2])

---

## 六、第一次啟動

設定好模型後直接執行：

```bash
hermes
```

即可進入 Hermes Agent CLI。

如果希望使用新版 TUI：

```bash
hermes --tui
```

官方目前也將 TUI 列為推薦的 Terminal UI。([Hermes Agent][2])

可以先測試簡單問題，例如：

```text
Check the current directory and summarize the files.
```

或：

```text
Tell me the current system information.
```

確認 Hermes 可以：

```text
使用 Model
  ↓
理解問題
  ↓
呼叫 Terminal / File Tool
  ↓
回傳結果
```

之後再逐步開啟其他 Agent 能力。

---

## 七、Server 建議：不安裝 Browser

如果只是要將 Hermes Agent 放在 Server 上執行 Terminal、File、Coding、Agent 等工作，不需要網頁瀏覽器自動化，可以省略 Chromium / Playwright：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-browser
```

這對大量節點或小型 Server 特別適合，可以減少：

```text
Chromium
Playwright
Browser dependencies
```

的安裝空間及額外相依套件。

官方明確提供 `--skip-browser` 給不需要 browser automation 的 headless/server 環境。([Hermes Agent][1])

---

## 八、推薦的 Server 安裝方式

若是一台專門執行 Hermes Agent 的 Linux Server，可以建立獨立帳號：

```bash
sudo adduser hermes
```

切換帳號：

```bash
sudo su - hermes
```

安裝基本套件：

```bash
sudo apt update
sudo apt install -y git curl xz-utils
```

再安裝 Hermes：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-browser
```

完成後：

```bash
source ~/.bashrc
hermes doctor
```

這樣 Hermes 執行的 Terminal 指令，就不會直接使用管理者帳號權限，安全性會比直接使用 root 好很多。

---

## 九、如果需要 Browser Automation

若 Hermes 需要操作 Chromium、Playwright 或 Browser Tool，則使用完整安裝：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

如果使用沒有 sudo 權限的 service account，可先由管理員安裝 Chromium 所需 Linux library：

```bash
sudo npx playwright install-deps chromium
```

再切換成 Hermes 使用者安裝 Hermes。([Hermes Agent][1])

---

## 十、設定 Gateway

如果未來要讓 Hermes Agent 長期執行，例如接：

```text
Telegram
Discord
Slack
WhatsApp
Signal
Email
Microsoft Teams
Home Assistant
```

可以執行：

```bash
hermes gateway setup
```

建議順序為：

```text
Hermes 安裝
   ↓
hermes doctor
   ↓
Model 設定
   ↓
CLI 對話成功
   ↓
Tool 測試成功
   ↓
Gateway
   ↓
Cron / Automation
```

不要一開始就設定 Gateway。先確定普通 CLI 對話和 Tool Calling 正常，再加入長期服務會比較容易除錯。([Hermes Agent][2])

---

## 十一、提高 Server 安全性

Hermes Agent 可以執行 Terminal 指令，因此若要提供多人、Agent Cluster 或長期服務使用，建議不要直接給主機完整權限。

Hermes 支援將 Terminal backend 設為 Docker：

```bash
hermes config set terminal.backend docker
```

或者透過 SSH 操作另一台隔離主機：

```bash
hermes config set terminal.backend ssh
```

比較推薦的架構：

```text
Hermes Agent
     │
     ├── LLM API
     │
     ├── File Tools
     │
     └── Docker Sandbox
             │
             └── Terminal Command
```

而不是：

```text
Hermes Agent
     │
     └── root shell
```

官方同樣建議需要安全隔離時使用 Docker 或 remote server terminal backend。([Hermes Agent][2])

---

## 十二、更新 Hermes Agent

日後更新直接執行：

```bash
hermes update
```

它會更新 Hermes 程式碼及相關 dependency。

如果更新後發現設定有新增項目：

```bash
hermes config check
```

再執行：

```bash
hermes config migrate
```

官方的 git installer 會自動辨識自己的安裝方式，`hermes update` 會依據安裝型態進行更新。([Hermes Agent][3])

---

## 十三、移除 Hermes Agent

一般卸載：

```bash
hermes uninstall
```

卸載時可以選擇保留：

```text
~/.hermes/
```

因此未來重新安裝時，可以繼續使用原本設定。

若確定連設定、session、credentials 等資料都不要：

```bash
hermes uninstall --full
```

官方建議正常情況使用 `hermes uninstall`，而不是直接手動刪除目錄。([Hermes Agent][3])

---

# Ubuntu Server 最精簡安裝流程

若只是要快速部署一台 Hermes Agent Server，實際上可以濃縮為：

```bash
# 1. 安裝基本工具
sudo apt update
sudo apt install -y git curl xz-utils

# 2. 安裝 Hermes Agent
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

# 3. 重新載入環境
source ~/.bashrc

# 4. 檢查
hermes doctor

# 5. 設定 AI Model
hermes model

# 6. 啟動
hermes --tui
```

如果是不需要 Browser 的 Cluster / Headless Server：

```bash
sudo apt update
sudo apt install -y git curl xz-utils

curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-browser

source ~/.bashrc

hermes doctor
hermes model
hermes
```

這會是比較適合大量 Linux 節點部署的版本。
