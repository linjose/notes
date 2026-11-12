---
layout: post
title: Playwright
date: 2026-11-11
reading_time: 20 min read
tags: [Automatic]
excerpt: 
---

Playwright 是由微軟（Microsoft）開源的現代化網頁自動化與端到端測試框架，其 Python 語言版本（`playwright-python`）廣泛應用於自動化測試與動態網頁爬蟲領域。

---

## 一、 Playwright 核心簡介

Playwright 的設計旨在克服傳統自動化工具（如 Selenium）的效能瓶頸與穩定性問題，其核心優勢與架構特點如下：

### 1. 核心優勢

* **跨瀏覽器與跨平台**：單一 API 即可控制 Chromium（Chrome, Edge）、Firefox 與 WebKit（Safari），並支援 Linux、macOS 與 Windows。
* **自動等待機制（Auto-wait）**：在執行點擊或輸入操作前，Playwright 會自動確認目標元素是否可見、啟用且已穩定，大幅減少測試不穩定（Flaky tests）的情況。
* **原生支援同步與非同步**：同時提供 Sync API 與 Async API（搭配 Python `asyncio`），滿足高併發爬蟲與一般自動化腳本的需求。
* **強大的內建工具**：包含腳本錄製工具（Codegen）、檢視器（Inspector）與追蹤器（Trace Viewer）。

### 2. 核心架構

Playwright 採用三層架構模型：

* **Browser**：單一瀏覽器實例（如 Chromium 處理程序）。
* **Browser Context**：瀏覽器情境（相當於獨立無痕視窗），具備獨立的 Cookie、Session 與 LocalStorage，耗用資源極低且可在同一測試中隔離多個使用者狀態。
* **Page**：Context 下的單一頁面標籤頁，用於實際進行 DOM 操作與網路請求監聽。

---

## 二、 環境安裝與建置

安裝 Playwright 需要 Python 3.8 或以上版本，執行步驟如下：

### 1. 安裝 Python 套件

開啟終端機（Terminal）或命令提示字元，安裝 Playwright 套件：

```bash
pip install playwright

```

### 2. 下載瀏覽器核心

執行安裝指令以自動下載 Playwright 所需的 Chromium、Firefox 與 WebKit 瀏覽器執行檔：

```bash
playwright install

```

*如僅需要特定瀏覽器（如 Chromium），可指定參數：*

```bash
playwright install chromium

```

### 3. （可選）安裝 Pytest 測試外掛

若需將 Playwright 用於自動化單元/端對端測試，建議安裝 official Pytest 外掛：

```bash
pip install pytest-playwright

```

---

## 三、 示範案例

### 案例 1：同步模式（Sync API）—— 自動開啟網頁並截圖

此範例展示如何使用同步 API 開啟瀏覽器、載入目標網頁並儲存高解析度螢幕截圖。

```python
from playwright.sync_api import sync_playwright

def run_sync_demo():
    # 啟動 Playwright 上下文
    with sync_playwright() as p:
        # 啟動 Chromium 瀏覽器（headless=False 代表顯示瀏覽器畫面）
        browser = p.chromium.launch(headless=False)
        
        # 建立獨立的 Context 與 Page
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()
        
        # 前往目標網站
        page.goto("https://example.com")
        
        # 取得網頁標題並列印
        print(f"網頁標題：{page.title()}")
        
        # 截圖並儲存
        page.screenshot(path="example_screenshot.png")
        
        # 關閉瀏覽器
        browser.close()

if __name__ == "__main__":
    run_sync_demo()

```

---

### 案例 2：非同步模式（Async API）—— 動態資料擷取與 API 監聽

在處理需要等待網路請求或批量爬蟲時，採用非同步模式能提高執行效率。以下程式碼示範如何監聽並擷取網頁發出的 JSON 請求回應：

```python
import asyncio
from playwright.async_api import async_playwright

async def handle_response(response):
    # 攔截包含特定 API 路徑的回應
    if "api" in response.url and response.status == 200:
        try:
            json_data = await response.json()
            print(f"成功攔截 API 回應：{response.url}")
            print(f"回應內容摘要：{str(json_data)[:100]}...")
        except Exception:
            pass

async def run_async_demo():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # 綁定網路回應監聽事件
        page.on("response", handle_response)
        
        # 造訪頁面並等待網路請求完成
        await page.goto("https://quotes.toscrape.com/scroll", wait_until="networkidle")
        
        # 定位首個引言元素並取得純文字
        quote_element = page.locator(".quote").first
        quote_text = await quote_element.text_content()
        print(f"\n擷取到的內容：\n{quote_text.strip()}")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_async_demo())

```

---

### 案例 3：自動程式碼生成工具（Codegen）

Playwright 提供互動式錄製功能，使用者可以在瀏覽器上手動操作，系統將自動產生對應的 Python 程式碼。

在終端機輸入下列指令：

```bash
playwright codegen https://example.com

```

執行後將彈出瀏覽器視窗與 Inspector 控制台，你在網頁上的任何點擊、輸入與跳轉行為均會即時轉化為結構化的 Python 腳本，大幅降低寫作測試腳本門檻。

---

您是否需要我進一步針對「驗證碼處理/繞過自動化偵測」或「搭配 Pytest 進行測試框架架設」提供具體說明？
