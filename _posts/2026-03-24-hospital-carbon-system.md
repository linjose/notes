---
layout: post
title: hospital carbon system
date: 2026-03-24
reading_time: 15 min read
tags: [ESG, GHG]
excerpt: 
---

醫院的碳排特性（如：麻醉氣體、醫療廢棄物處理、24小時空調與設備用電）有別於一般企業，因此系統必須在符合 ISO 14064 標準的前提下，具備高度的彈性與查證追溯能力。

---

### 一、 核心功能模組設計 (符合 ISO 14064-1)

系統需涵蓋類別一到類別六（Scope 1, 2, 3）的完整盤查流程：

#### 1. 系統設定與邊界管理模組 (Organizational Boundaries)
* **組織架構設定：** 建立醫院層級、院區、各科室、護理站的樹狀結構。
* **盤查邊界設定：** 定義營運控制權，設定各科室涵蓋的排放源（如：鍋爐房、手術室的麻醉氣體、公務車/救護車）。
* **基準年設定：** 鎖定基準年數據，以便未來進行減碳成效對比。

#### 2. 活動數據收集與審核模組 (Activity Data)
* **數據錄入介面：** 提供手動輸入與批次匯入（Excel/CSV）功能。包含用電度數、天然氣/柴油用量、救護車油耗、冷媒填充量、以及醫療特有的 **N₂O (笑氣) 與 Desflurane (地氟醚)** 等麻醉氣體消耗量。
* **佐證文件上傳：** 每一筆數據皆須附上電費單、發票或採購單的電子檔（PDF/圖檔），確保符合 ISO 14064 的「可查證性」。
* **防呆與審核機制：** 設定異常值警告（如當月用電量突增 50%），並具備「輸入者填寫 ➔ 主管簽核」的兩段式確認流程。

#### 3. 排放係數庫管理模組 (Emission Factors) 
* **環境部係數內建：** 預設匯入台灣環境部最新公告的溫室氣體排放係數表（GWP 預設使用 IPCC AR6 或政府規定版本）。
* **自訂與供應商係數：** 允許新增特定醫療耗材、藥品或特定廢棄物處理商提供的碳足跡係數。
* **版本控制：** 係數會隨年份更新，系統必須能根據「活動數據發生的年份」自動對應「該年度適用的排放係數」。

#### 4. 碳排計算引擎 (Calculation Engine) 
* **自動化計算：** 核心公式 `活動數據 (Activity Data) × 排放係數 (Emission Factor) × 溫暖化潛勢 (GWP) = CO₂e (二氧化碳當量)`。
* **多維度分析儀表板：** 提供圓餅圖與長條圖，分析各科室碳排占比、各類別（如電力 vs. 醫療氣體）碳排熱點。

#### 5. 環境部合規匯出與報告模組 (Reporting & Export)
* **一鍵匯出環境部格式：** 將運算結果直接對映並匯出成符合環境部規定的**《溫室氣體盤查清冊》**Excel 活頁簿格式。
* **盤查報告書生成：** 依據 ISO 14064-1 規範的章節，匯出包含盤查邊界、量化方法、不確定性評估的 Word/PDF 報告書草稿。

---

### 二、 匯出符合環境部要求之 Excel 檔設計要點

環境部的盤查清冊通常包含多個 Sheet，系統在匯出時，需將資料庫數據轉化為以下結構：
1.  **基本資料 (Sheet 1)：** 匯出醫院名稱、地址、管制編號、盤查邊界說明。
2.  **溫室氣體排放量彙整 (Sheet 2)：** 自動加總類別一（直接排放）、類別二（能源間接排放）的 CO₂、CH₄、N₂O、HFCs、PFCs、SF₆、NF₇ 各氣體當量。
3.  **活動數據與排放係數清單 (Sheet 3+)：** 將 `ActivityData` 表與 `EmissionFactors` 表的關聯結果展開，列出：排放源名稱、活動數據量、單位、使用的排放係數版本、計算出的排放量。此處必須精準呈現計算軌跡。

---

### 三、 核心資料綱要設計 (Data Schema)

這套關聯式資料庫結構適合用來設計底層架構，確保資料完整性與擴充性：

| 資料表名稱 (Table) | 說明 | 關鍵欄位 (Columns) |
| :--- | :--- | :--- |
| **`Organizations`** | 組織與科室層級 | `id`, `name`, `parent_id` (支援樹狀結構), `facility_type` |
| **`Emission_Sources`** | 盤查邊界內的排放源 | `id`, `name`, `category` (類別1~6), `gas_type` (CO2, CH4, N2O...), `dept_id` |
| **`Emission_Factors`** | 排放係數庫 | `id`, `factor_name`, `value`, `unit`, `gwp_value`, `source` (環境部/IPCC), `valid_year` |
| **`Activity_Data`** | 活動數據紀錄 | `id`, `source_id` (關聯排放源), `record_date` (年月), `amount` (數據量), `evidence_url` (佐證文件路徑), `status` (草稿/已審核) |
| **`Calculated_Emissions`**| 計算結果 (快取/紀錄) | `id`, `activity_id`, `factor_id`, `co2e_result` (最終當量), `calculated_at` (計算時間) |
| **`Audit_Logs`** | 系統稽核軌跡 | `id`, `user_id`, `action` (新增/修改/刪除), `target_table`, `timestamp` |

> **開發小提醒：** 醫療體系特有的「笑氣 (N₂O)」的 GWP 值極高（高達 200 多倍），且屬於直接排放（類別一）；而醫療廢棄物若採院外焚化，則屬於類別三或四。在初期規劃 `Emission_Sources` 表時，務必將這些醫療專屬情境定義清楚。


---

這份詳細的系統規格設計，可以直接作為具體的開發任務清單。明確的欄位對應與 API 格式，能在處理資料庫與產出報表邏輯時有明確依循，同時這份 JSON 格式也能直接進行排放係數 API 的開發與串接。這有助於在統籌時，有一個標準來檢視開發成果。

以下為針對「環境部 Excel 清冊」與「排放係數 API」的詳細設計：

---

### 一、 環境部 Excel 清冊的具體欄位對應邏輯 

環境部的《溫室氣體盤查清冊》有多個固定的活頁簿 (Sheets)。系統在設計匯出功能時，必須將 `Activity_Data` (活動數據)、`Emission_Factors` (排放係數) 與 `Calculated_Emissions` (計算結果) 進行 Join，並對應到特定的 Excel 欄位。

以最核心的**「直接排放 (類別一)」**與**「能源間接排放 (類別二)」**為例，資料對應邏輯如下：

| 環境部 Excel 規定欄位名稱 | 系統資料庫對應來源 / 運算邏輯 | 備註與醫療業範例 |
| :--- | :--- | :--- |
| **排放源名稱** | `Emission_Sources.name` | 例如：緊急發電機、手術室笑氣、公務車 |
| **排放源類別** | `Emission_Sources.category` | 固定填入：固定燃燒、移動燃燒、逸散排放等 |
| **活動數據 - 數值** | `Activity_Data.amount` | 系統需加總該排放源全年度的輸入數值 |
| **活動數據 - 單位** | 從前端表單或係數庫繼承的單位 | 例如：公升 (柴油)、度 (電力)、公斤 (醫療氣體) |
| **排放係數 - 數值** | `Emission_Factors.value` | 需對應到「活動數據發生當年度」的有效係數 |
| **排放係數 - 單位** | `Emission_Factors.unit` | 例如：kg CO2e/度 |
| **溫暖化潛勢 (GWP)** | `Emission_Factors.gwp_value` | 必須帶入 IPCC 公告值。**注意：醫療笑氣 (N₂O) GWP 為 273 (依 AR6)** |
| **特定溫室氣體當量** | `Calculated_Emissions.co2e_result` | 依氣體種類分別計算 (CO₂, CH₄, N₂O, HFCs 等) |
| **總二氧化碳當量 (公噸)** | (上述當量總和) / 1000 | 系統需自動將「公斤」換算為「公噸」填入報表 |
| **數據來源/佐證文件** | `Activity_Data.evidence_url` | 可在此欄位產出系統內的檔案超連結，方便第三方查證 |

**開發檢核點：** 匯出程式必須具備「群組加總 (Group By)」的能力，因為 Excel 清冊通常要求按「氣體種類」或「科室」進行小計。

---

### 二、 排放係數庫與計算 API 資料交換格式 (JSON)

這組 API 負責提供正確的係數供前端介面選用，以及讓後端進行碳排運算。建議採用 RESTful 風格，格式設計如下：

#### 1. 查詢排放係數清單 (GET `/api/v1/emission-factors`)
當系統需要列出符合條件的係數（例如：查詢 2024 年的電力係數，或搜尋特定醫療氣體）時，API 回傳的格式：

```json
{
  "status": "success",
  "message": "查詢成功",
  "data": [
    {
      "factor_id": "EF-ELEC-2023-01",
      "category": "類別二：能源間接排放",
      "name": "市電 (電力網)",
      "gas_type": "CO2e",
      "value": 0.495,
      "unit": "kg CO2e/度",
      "gwp_value": 1,
      "source": "經濟部能源署",
      "version_year": 2023,
      "is_active": true
    },
    {
      "factor_id": "EF-MED-N2O-01",
      "category": "類別一：直接排放 (逸散)",
      "name": "醫療用笑氣 (N2O)",
      "gas_type": "N2O",
      "value": 1.0,
      "unit": "kg/kg",
      "gwp_value": 273,
      "source": "IPCC AR6",
      "version_year": 2021,
      "is_active": true
    }
  ],
  "meta": {
    "total_count": 2,
    "page": 1,
    "limit": 50
  }
}
```

#### 2. 單筆碳排計算 API (POST `/api/v1/calculate-emissions`)
當使用者輸入一筆活動數據（例如：某月份用電 5000 度），呼叫此 API 將活動數據與係數結合，回傳精準的計算結果與公式軌跡，供資料庫儲存。

**Request Payload (傳入資料):**
```json
{
  "source_id": "SRC-DEPT-A-ELEC",
  "record_year": 2023,
  "activity_data": {
    "amount": 5000,
    "unit": "度"
  },
  "factor_id": "EF-ELEC-2023-01"
}
```

**Response Payload (回傳計算結果):**
```json
{
  "status": "success",
  "data": {
    "calculation_id": "CALC-987654321",
    "co2e_total_kg": 2475.0,
    "co2e_total_tonnes": 2.475,
    "audit_trail": {
      "formula": "Activity Amount * Factor Value * GWP",
      "calculation_detail": "5000 (度) * 0.495 (kg CO2e/度) * 1 (GWP)",
      "factor_used": "市電 (電力網) - 經濟部能源署 2023 版本"
    },
    "calculated_at": "2026-03-24T23:24:40Z"
  }
}
```

**架構優勢：** 在回傳結果中保留 `audit_trail` (計算軌跡)，這是符合 ISO 14064 第三方查證精神的關鍵設計。日後稽核員若對某筆數據有疑慮，系統能直接調出這段軌跡證明運算無誤。
