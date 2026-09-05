

## 使用 Gradio 搭配 Hugging Face Spaces 部署一個免費的 AI Demo 應用

1. **建立全新的 Hugging Face Space:** 需先註冊並登入 Hugging Face 免費帳號.
1. 前往 [Hugging Face Spaces](https://huggingface.co/spaces) 頁面，點擊右上角的 **Create new Space**。
2. 填寫 Space 設定檔：
* **Space name**：為專案命名（例如 `sentiment-demo`）。
* **License**：選擇開源授權（例如 `mit`）。
* **Select the Space SDK**：選擇 **Gradio**。
* **Space hardware**：選擇免費的 **CPU basic**（2 vCPU, 16GB RAM）。
* **Visibility**：選擇 **Public**（所有人可存取）或 **Private**（私人）。


3. 點擊 **Create Space** 完成建立。


2. **建立依賴套件檔 requirements.txt:** 告知平台需要安裝哪些 Python 函式庫.
在頁面上的 **Files** 頁籤點擊 **Add file** -> **Create new file**，檔名輸入 `requirements.txt`，貼入以下專案所需的套件：

```text
transformers
torch

```

點擊頁面下方的 **Commit new file to main** 提交檔案。


3. **新增主程式 app.py:** 放置 Gradio 介面與 AI 模型推論邏輯.
再次點擊 **Add file** -> **Create new file**，檔名**必須**為 `app.py`（平台預設的執行入口）。貼入以下文字情緒分析 Demo 程式碼：

```python
import gradio as gr
from transformers import pipeline

# 載入輕量級情緒分析模型（DistilBERT）
classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

def predict_sentiment(text):
    if not text.strip():
        return "請輸入有效內容"
    results = classifier(text)
    label = results[0]['label']
    score = round(results[0]['score'], 4)
    return f"預測結果: {label} (信心度: {score})"

# 建立 Gradio 互動介面
demo = gr.Interface(
    fn=predict_sentiment,
    inputs=gr.Textbox(lines=3, placeholder="請輸入英文句子，例如: I love this machine learning model!"),
    outputs="text",
    title="😊/☹️ 英文文本情緒分析 Demo",
    description="本 App 部署於 Hugging Face Spaces，使用 DistilBERT 模型進行即時推論。"
)

# 啟動應用程式
if __name__ == "__main__":
    demo.launch()

```

點擊頁面下方的 **Commit new file to main** 提交檔案。


4. **等待自動構建與啟動:** 首次載入模型可能需要 1~2 分鐘.
1. 提交 `app.py` 後，頁面上方狀態會由 `Building` 轉為 `Running`。
2. 切換回 **App** 頁籤，即可直接在瀏覽器中操作並測試這支 AI Demo 應用！


---

### 💡 進階技巧與維護須知

* **嵌入其他網站**：點擊 Space 右上角選單中的 **Embed this Space**，可取得 HTML `<iframe />` 或 Web Component 語法，將此 AI Demo 直接嵌入你個人的部落格或網站。
* **使用 Git 本地開發**：可以使用 `git clone [https://huggingface.co/spaces/你的使用者名稱/你的專案名稱](https://huggingface.co/spaces/你的使用者名稱/你的專案名稱)` 將專案複製到本地編輯，完成後使用 `git push` 上傳更新。
* **金鑰與私密資訊防護**：若程式碼需要呼叫外部 API（如 OpenAI、Anthropic 存取金鑰），請勿硬寫在 `app.py`。可在 Space 設定頁面的 **Settings -> Secrets** 中新增環境變數，程式碼中再透過 `os.getenv("YOUR_API_KEY")` 讀取。
