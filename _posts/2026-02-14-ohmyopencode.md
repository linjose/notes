**oh-my-opencode** 是一個用來增強 `opencode` 使用體驗的插件/設定集合（類似於 Oh My Zsh 對 zsh 的強化方式），主要目的是讓使用者在終端機中更方便地使用 `opencode` 指令。

以下是基本使用步驟與說明 👇

---

## 一、安裝 oh-my-opencode

通常會透過 Git 方式安裝（請先確認已安裝 `opencode`）：

```bash
git clone https://github.com/<repo>/oh-my-opencode.git ~/.oh-my-opencode
```

然後把它加入你的 shell 設定檔，例如：

### 如果你用 zsh：

編輯 `~/.zshrc`

```bash
source ~/.oh-my-opencode/oh-my-opencode.sh
```

### 如果你用 bash：

編輯 `~/.bashrc`

```bash
source ~/.oh-my-opencode/oh-my-opencode.sh
```

然後重新載入：

```bash
source ~/.zshrc
# 或
source ~/.bashrc
```

---

## 二、基本用法

安裝完成後，通常會新增一些簡化指令，例如：

| 指令    | 功能             |
| ----- | -------------- |
| `oc`  | 等同於 `opencode` |
| `ocr` | 重新載入           |
| `ocp` | 指定 profile     |
| `oco` | 開啟專案           |

實際指令可能會依版本不同而有差異，可以執行：

```bash
oc --help
```

或

```bash
opencode --help
```

查看所有可用參數。

---

## 三、常見使用場景

### 1️⃣ 直接對當前資料夾使用

```bash
oc
```

### 2️⃣ 指定模型

```bash
oc -m gpt-4
```

### 3️⃣ 帶 prompt 啟動

```bash
oc "幫我優化這段程式碼"
```

---

## 四、自訂設定

通常可以在：

```
~/.oh-my-opencode/config
```

或

```
~/.config/opencode/
```

修改預設模型、API key、快捷鍵等。

---

## 五、常見問題

### ❓ 指令找不到？

確認：

```bash
which opencode
```

如果沒顯示路徑，代表 `opencode` 本體還沒安裝。

---

如果你可以告訴我：

* 你的作業系統（macOS / Linux / Windows）
* 你用 bash 還是 zsh？
* 你現在遇到什麼錯誤？

我可以給你更精準的安裝與設定步驟 👌
