# 開源軟體人才培育機制

## 一、培育目標

開源軟體人才培育的核心，不應僅停留在 Git、GitHub、程式語言或開源工具操作等基礎技能，而應以培養能夠實際參與國際開源專案、持續貢獻程式碼與技術成果，並逐步取得社群信任與角色認可的人才為目標。

整體培育目標可分為四個層次：

1. **具備開源參與能力**
   熟悉 Git、Issue、Pull Request、Code Review、CI/CD、測試、文件與開源授權等基本開發流程。

2. **具備實際貢獻能力**
   能理解既有大型開源專案架構，完成環境建置、問題分析、Bug 修正、測試與功能開發。

3. **具備國際協作能力**
   能透過 Issue、Mailing List、Slack、Discord、GitHub Discussion、Community Meeting 等方式與國際開發者協作。

4. **具備長期社群發展能力**
   由一般使用者逐步發展為 Contributor、Reviewer、Committer，甚至 Maintainer，形成持續投入國際開源社群的人才梯隊。

整體人才發展路徑可設定為：

**User → Learner → Contributor → Regular Contributor → Reviewer → Committer → Maintainer**

---

# 二、培育基本原則

## （一）以真實開源專案為學習場域

培育過程應直接選擇正在持續開發、具有成熟治理制度與國際社群的開源專案，不另外設計與實務脫節的模擬題目。

例如可依領域建立不同培育 Track：

| 領域                    | 可選擇之開源專案                       |
| --------------------- | ------------------------------ |
| AI Infrastructure     | vLLM、SGLang、Ray、KubeRay        |
| Cloud Native          | Kubernetes、CNCF Projects       |
| Data Engineering      | Kafka、Airflow、DataFusion       |
| Database              | PostgreSQL                     |
| Distributed Storage   | Apache Ozone                   |
| AI / Data Platform    | Apache Software Foundation相關專案 |
| System Infrastructure | Linux、LLVM、OpenTelemetry等      |

每位 Mentee 原則上應選定一個主要專案長期投入，避免同時參與過多專案而無法建立技術深度及社群關係。

---

## （二）以專案實作取代傳統授課

課程僅作為前期基礎能力補強，不應成為人才培育的主要形式。

整體投入時間建議：

* 基礎課程：20%
* 開源專案實作：50%
* Mentor 指導與 Code Review：20%
* 社群參與與成果分享：10%

培育成果應以實際參與國際開源專案的紀錄作為主要依據，而非課程時數或測驗成績。

---

## （三）採師徒制培育

每個培育 Track 應配置具實際開源經驗的 Mentor。

Mentor 的角色並非一般授課講師，而是：

* 協助選擇適合的開源專案
* 協助理解專案架構
* 協助建立開發環境
* 協助選擇適合的 Issue
* 協助第一次 Pull Request
* 協助進行 Code Review
* 協助與國際 Maintainer 溝通
* 引導參與 Community Meeting
* 協助建立長期貢獻方向

建議配置比例為：

**1 位 Lead Mentor + 2～3 位 Mentor + 5～10 位 Mentee**

每位 Mentor 不宜同時指導過多 Mentee，以維持實際技術指導品質。

---

# 三、人才培育流程

整體培育可規劃為七個階段。

## 第一階段：Select－人才與專案媒合

期間：約 1～2 週。

主要工作包括：

* 評估程式設計能力
* 評估英文技術閱讀能力
* 評估 Git / Linux 基礎
* 了解技術興趣
* 了解職涯發展方向
* 選擇適合的開源專案
* 指派 Mentor

選才時不宜僅以程式能力評估，亦應觀察：

* 自主學習能力
* 問題拆解能力
* 溝通能力
* 持續投入意願
* 面對失敗與修改要求的耐受度

開源開發大量依賴非同步協作，因此自律性及溝通能力往往與程式能力同樣重要。

---

# 第二階段：Learn－開源基礎能力

期間：約 2～4 週。

主要培育內容包括：

### 開發工具

* Git
* GitHub / GitLab
* Branch
* Commit
* Pull Request
* Merge
* Rebase
* Conflict Resolution

### 開源協作

* Issue
* Pull Request
* Code Review
* CONTRIBUTING.md
* CODE_OF_CONDUCT.md
* Release Note
* Changelog

### 軟體工程

* Unit Test
* Integration Test
* CI/CD
* Coding Style
* Static Analysis
* Documentation

### 開源治理

* Open Source License
* Contributor License Agreement
* Developer Certificate of Origin
* Maintainer制度
* Contributor Ladder

完成此階段後，應能理解一個成熟開源專案的基本開發與治理流程。

---

# 第三階段：Build－建立專案理解能力

期間：約 2～4 週。

此階段不要求立即撰寫程式，而是要求完整理解開源專案。

每位 Mentee 至少完成：

1. Clone Repository
2. 建立本機開發環境
3. Build Project
4. 執行測試
5. 執行 Sample / Demo
6. 閱讀 Architecture Documentation
7. 閱讀 CONTRIBUTING.md
8. 找到主要 Maintainer
9. 找到 Community Meeting
10. 閱讀至少 3～5 個已 Merge 的 Pull Request

同時製作一份：

**Open Source Project Map**

內容包括：

* 專案目的
* 系統架構
* Repository Structure
* 核心模組
* Maintainer
* Release Cycle
* Issue分類
* Contribution流程
* Community Communication Channel

此階段的目的，是讓工程師先理解專案，再開始貢獻。

---

# 第四階段：First Contribution－第一次開源貢獻

期間：約 1～2 個月。

第一次貢獻不宜強制要求大型功能，可由較低風險任務開始，包括：

* Documentation
* Unit Test
* Test Coverage
* Example
* Bug Reproduction
* Small Bug Fix
* Good First Issue
* Development Tool
* Benchmark
* CI改善

標準流程為：

**Issue閱讀
→ 問題重現
→ 原因分析
→ 與社群討論
→ 實作修改
→ 測試
→ Mentor Review
→ Submit PR
→ Upstream Review
→ 修改
→ Merge**

第一次 Pull Request 的重要性不在於程式碼量，而在於完整經歷一次國際開源協作流程。

---

# 第五階段：Collaborate－國際社群協作

期間：約 1～2 個月。

完成第一次貢獻後，應逐步從單純「提交程式碼」轉向「參與社群」。

參與方式包括：

* 回覆 Issue
* 提供 Debug資訊
* 參與 GitHub Discussion
* 協助其他 Contributor
* Review其他 PR
* 參與 Community Meeting
* 參與 Mailing List
* 參與 Slack / Discord討論
* 提出技術建議

此階段應特別培養：

### 技術英文能力

不是一般英文會話，而是：

* Issue描述
* Technical Discussion
* PR Description
* Review Comment
* Proposal
* Design Discussion

### 非同步協作能力

包括：

* 清楚描述問題
* 提供重現方式
* 提供 Log
* 提供 Benchmark
* 說明設計考量
* 回應 Review意見
* 接受修改要求

---

# 第六階段：Own－建立技術責任領域

期間：約 2～6 個月。

若每次僅處理零散 Issue，很難形成長期社群角色，因此應逐步建立固定技術領域。

例如：

* Scheduler
* Storage
* Networking
* PostgreSQL Extension
* GPU Runtime
* Test Infrastructure
* Documentation
* Performance Benchmark
* Kubernetes Operator

Mentee 應逐步成為某個模組或議題的固定貢獻者。

此階段可開始：

* 主動提出 Issue
* 處理較大型 Bug
* 開發 Feature
* 撰寫 Proposal
* 建立 Benchmark
* Review他人 PR
* 協助新人

此時角色逐漸由：

**Task Receiver**

轉變為：

**Problem Owner**

---

# 第七階段：Upstream－持續貢獻與角色晉升

培育後期應逐步引導參與者達成正式社群角色。

可能發展路徑包括：

**Contributor
↓
Regular Contributor
↓
Reviewer
↓
Committer
↓
Maintainer**

不同專案名稱可能不同，但核心概念相同：

隨著持續貢獻、技術能力及社群信任增加，逐步取得更多專案責任。

最終人才培育成果應以：

**取得國際開源社群認可**

作為最高層次成果，而非單純完成多少次程式修改。

---

# 四、Mentor制度

Mentor制度是整個培育機制的核心。

每週建議安排三種活動。

## 1. Issue Planning

每週確認：

* 本週準備處理的 Issue
* 目前遇到的問題
* 是否需要與 upstream溝通
* 預計提交成果

時間約 30～60 分鐘。

---

## 2. Mentor Office Hour

提供固定時段協助處理：

* Build問題
* Architecture問題
* Debug問題
* Testing問題
* PR問題
* Upstream溝通問題

不需要另外安排大量課程。

---

## 3. Upstream Review

每週檢視：

* Issue
* Pull Request
* Review Comment
* 社群討論
* Merge狀況

協助判斷下一步行動。

---

# 五、成果分享制度

建議每月辦理一次：

## Open Source Demo Day

每位參與者說明：

1. 本月研究哪個問題
2. 完成哪些 Issue
3. 提交哪些 PR
4. Maintainer提出哪些意見
5. 哪些 PR 被 Merge
6. 哪些 PR 被 Reject
7. 遇到哪些技術問題
8. 下一步計畫

Demo Day 的重點不是展示成功，而是分享真實開源開發過程。

包括：

* PR被拒絕
* 技術方向被否決
* Maintainer要求重新設計

都可以視為重要學習成果。

---

# 六、培育經費設計

不建議以：

**每完成一個 PR支付獎金**

作為主要激勵方式。

容易造成：

* 大量小型 PR
* Documentation PR
* Typo PR
* 為數量拆分PR
* 缺乏長期技術投入

較適合採用：

## Open Source Fellowship

例如提供 6 個月支持。

內容可包括：

* Mentee Fellowship
* Mentor費用
* GPU / Cloud Resource
* Conference Grant
* 國際差旅
* Certification
* Developer Tool
* Demo Day
* Outstanding Contributor Award

補助依據應以：

**持續參與程度與技術成長**

而不是單純 PR數量。

---

# 七、績效指標設計

開源人才培育不宜只統計：

* 上課人數
* 課程時數
* PR數量

應建立分層 KPI。

| 層級 | 指標                        |
| -- | ------------------------- |
| L1 | 完成開源專案 Build              |
| L2 | 完成 Issue分析                |
| L3 | First PR Submitted        |
| L4 | First PR Merged           |
| L5 | 90-Day Active Contributor |
| L6 | Regular Contributor       |
| L7 | Reviewer / Committer      |
| L8 | Maintainer                |

亦可增加：

* Issue參與數
* PR Merge Rate
* Code Review次數
* Community Meeting參與次數
* Upstream Discussion次數
* Proposal數量
* Benchmark成果
* 國際技術文章
* Conference Speaker
* Maintainer推薦

其中最重要的指標之一應為：

## 90-Day Contributor Retention

亦即完成第一次貢獻後，90天後是否仍持續參與同一開源專案。

此指標比單純 PR數量更能反映培育品質。

---

# 八、人才漏斗設計

人才培育應接受自然淘汰。

例如第一期招募100人：

**100人報名
↓
60人完成基礎訓練
↓
40人完成Project Build
↓
30人提交First PR
↓
20人PR Merged
↓
10人持續90天
↓
5人Regular Contributor
↓
2～3人Reviewer / Committer Candidate**

開源人才培育的價值不在於大量產生一次性參與者，而在於從大量人才中逐步培養少數能夠長期進入國際社群的人才。

---

# 九、建議整體培育週期

建議一梯次至少規劃 **6個月**。

### 第1月

Select + Learn

### 第2月

Build + Project Understanding

### 第3月

First Contribution

### 第4月

Multiple Contributions + Community Participation

### 第5月

Ownership + Advanced Issue

### 第6月

Upstream Contribution + Demo Day

其中表現優秀者，可進入第二階段：

## Advanced Open Source Fellowship

再持續6～12個月，目標為：

* Regular Contributor
* Reviewer
* Committer Candidate
* Maintainer Candidate

形成兩階段培育：

**第一階段：培養 Contributor**

**第二階段：培養 Open Source Leader**

---

# 十、整體機制

完整的人才培育架構可整理為：

**人才招募
→ 能力評估
→ 專案媒合
→ Mentor配對
→ Learn
→ Build
→ First Issue
→ First PR
→ Upstream Review
→ Continuous Contribution
→ Module Ownership
→ Community Recognition
→ Reviewer / Committer / Maintainer**

外部則由五項支援機制共同支撐：

**Mentor**

提供技術與社群指導。

**Fellowship**

降低年輕工程師長期投入開源的機會成本。

**Community**

協助與國際 Maintainer及開發社群建立連結。

**Resource**

提供GPU、Cloud、測試環境及開發資源。

**Career**

協助將開源成果轉化為職涯機會。

---

# 十一、最終培育目標

整體制度最終不應以「培養多少人會使用開源軟體」作為主要成果，而應逐步建立：

## Taiwan Open Source Contributor Pipeline

形成：

**使用者
→ 學習者
→ Contributor
→ Regular Contributor
→ Reviewer
→ Committer
→ Maintainer**

的長期人才梯隊。

當國際開源專案中的核心模組開始出現持續來自臺灣的 Contributor、Reviewer、Committer與Maintainer，即代表人才培育機制真正產生影響。

因此，開源人才培育的本質不是「教會工程師開源軟體」，而是：

**協助工程師真正進入國際開源軟體的共同開發體系，並逐步成為其中具有責任、影響力與技術話語權的成員。**
