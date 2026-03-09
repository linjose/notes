---
layout: post
title: OpenClaw - TrackMan
date: 2026-03-07
reading_time: 15 min read
tags: [AI, baseball]
excerpt: 
---

使用 **OpenClaw** 基於 Python 的開源棒球數據抓取工具，如開發者為對接 Statcast/Savant 數據的工具。並將其轉換為 **TrackMan** 標準格式，核心在於「**欄位映射 (Mapping)**」與「**單位轉換**」。
---

## 核心流程架構

### 1. 環境準備與數據抓取

首先，確保你的 OpenClaw 環境能穩定抓取到原始數據（通常是 CSV 或 JSON 格式的 Statcast 數據）。

* **工具需求：** Python 3.x, Pandas (數據處理), Schedule/Cron (定期執行)。
* **抓取目標：** 設定抓取特定聯盟（如 MLB, CPBL）或特定日期的比賽數據。

### 2. 定義 TrackMan 標準映射表

TrackMan CSV 格式有固定的 Header（標題），你必須將 Statcast 的原始欄位對應過去。以下是常見關鍵欄位的對應：

| TrackMan 欄位名 (Target) | Statcast 原始欄位 (Source) | 處理說明 |
| --- | --- | --- |
| **PitchNo** | `pitch_number` | 投球編號 |
| **Date** | `game_date` | 日期格式需統一為 YYYY-MM-DD |
| **RelSpeed** | `release_speed` | 出手速度 (mph) |
| **SpinRate** | `release_spin_rate` | 轉速 (rpm) |
| **RelHeight** | `release_pos_z` | 出手高度 (ft) |
| **RelSide** | `release_pos_x` | 出手側向位置 (ft) |
| **Extension** | `release_extension` | 延伸距離 (ft) |
| **InducedVertBreak** | `pfx_z` * 12 | **關鍵：** 需從英呎換算為英吋 |
| **HorzBreak** | `pfx_x` * -12 | **關鍵：** 注意正負號定義與單位換算 |
| **PlateLocHeight** | `plate_z` | 進壘高度 (ft) |
| **PlateLocSide** | `plate_x` | 進壘側向位置 (ft) |

---

### 3. 自動化轉換腳本 (Python 範例)

你可以撰寫一個轉換器，在 OpenClaw 抓取完畢後自動執行：

```python
import pandas as pd
import numpy as np

def transform_to_trackman(df_raw):
    # 建立空的 TrackMan DataFrame
    tm_df = pd.DataFrame()

    # 基本資訊映射
    tm_df['PitchNo'] = df_raw['pitch_number']
    tm_df['Date'] = df_raw['game_date']
    tm_df['Pitcher'] = df_raw['player_name']
    
    # 物理數據轉換 (Statcast 為 ft, TrackMan Break 通常為 inch)
    tm_df['RelSpeed'] = df_raw['release_speed']
    tm_df['SpinRate'] = df_raw['release_spin_rate']
    
    # 垂直位移 (Induced Vertical Break)
    # 註：Statcast 的 pfx_z 是相對於沒有旋轉的位移量
    tm_df['InducedVertBreak'] = df_raw['pfx_z'] * 12 
    
    # 水平位移 (Horizontal Break)
    # 注意：TrackMan 與 Statcast 的正負號方向可能相反，需依需求調整
    tm_df['HorzBreak'] = df_raw['pfx_x'] * 12 
    
    # 進壘點
    tm_df['PlateLocHeight'] = df_raw['plate_z']
    tm_df['PlateLocSide'] = df_raw['plate_x']

    return tm_df

# 讀取 OpenClaw 抓取的數據
# df = pd.read_csv('claw_output.csv')
# tm_formatted = transform_to_trackman(df)
# tm_formatted.to_csv('trackman_upload_ready.csv', index=False)

```

---

### 4. 設定「定期」自動化整理

要實現定期整理，建議採用以下兩種方式之一：

* **方案 A：GitHub Actions (推薦)**
如果你將代碼存放在 GitHub，可以使用 `.github/workflows` 設定每天定時執行。它會自動啟動虛擬環境、執行 OpenClaw、轉換格式，最後將結果上傳至你的數據庫或 Repo。
* **方案 B：排程工具 (Local/Server)**
在 Linux 使用 `crontab` 或 Windows 使用「工作排程器」執行 Python 腳本。
> `0 9 * * * /usr/bin/python3 /path/to/your_script.py` (每天早上 9 點執行)



---

### 5. 注意事項

1. **數據校準：** Statcast 的數據是經由光學系統計算，TrackMan 是雷達系統，兩者在位移（Break）的計算基準點（如 40ft 或 50ft）可能略有不同。若要極致精準，需進行常數偏移校正。
2. **球種對照：** 將 `pitch_type` (FF, SL, CH...) 轉換為 TrackMan 慣用的 `TaggedPitchType`。
3. **錯誤排除：** 定期檢查是否有 `NaN` 值（例如測速失敗），在轉換腳本中加入 `df.dropna()` 或填充邏輯。
