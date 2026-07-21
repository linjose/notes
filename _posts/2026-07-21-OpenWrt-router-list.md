以下整理的是 **目前 OpenWrt 24.x 系列支援的台灣三大品牌 ASUS、D-Link、Zyxel 路由器**。
由於 OpenWrt 的支援名單會持續增加，以下以**一般消費者較常見**、且目前仍具有實際使用價值（避免列入 Flash/RAM 過小的古董機）的機型為主。
完整名單可在 OpenWrt Table of Hardware 查詢。[OpenWrt Table of Hardware](https://toh.openwrt.org/?utm_source=chatgpt.com) ([OpenWrt][1])

---

# ASUS

ASUS 是台灣品牌，但因為大量採用 **Broadcom** 晶片，因此歷年支援度其實沒有 TP-Link、Linksys 好。

| 型號         | WiFi   | SoC             | OpenWrt | 備註               |
| ---------- | ------ | --------------- | ------- | ---------------- |
| RT-AX59U   | WiFi 6 | MediaTek MT7986 | ✅ 完整支援  | 推薦               |
| TUF-AX4200 | WiFi 6 | MediaTek MT7986 | ✅ 完整支援  | 非常推薦             |
| TUF-AX6000 | WiFi 6 | MediaTek MT7986 | ✅ 完整支援  | 高階推薦             |
| RT-AX53U   | WiFi 6 | MediaTek        | ✅       | 入門 AX            |
| RT-AX54    | WiFi 6 | MediaTek        | ✅       | 與 RT-AX1800S 同平台 |
| RT-AX1800S | WiFi 6 | MediaTek        | ✅       | CP值高             |
| RT-AC65P   | WiFi 5 | MediaTek        | ✅       | 老牌穩定             |
| RT-AC85P   | WiFi 5 | MediaTek        | ✅       |                  |
| RT-ACRH17  | WiFi 5 | Qualcomm        | ✅       |                  |
| RT-N16     | WiFi 4 | Broadcom        | 部分支援    | 已老舊              |

### 不建議刷 OpenWrt

例如：

* RT-AC68U
* RT-AC86U
* RT-AX88U
* GT-AX 系列

原因都是 **Broadcom WiFi Driver** 限制，通常 WiFi 功能不完整或不支援。([OpenWrt][1])

---

# D-Link

D-Link 是 OpenWrt 支援最完整的台灣品牌之一。

| 型號          | WiFi            | OpenWrt |
| ----------- | --------------- | ------- |
| DIR-860L A1 | AC1200          | ✅       |
| DIR-2640 A1 | AC2600          | ✅       |
| DIR-2660 A1 | AC2600          | ✅       |
| DIR-1960 A1 | AC1900          | ✅       |
| DIR-2150 A1 | AC2100          | ✅       |
| DIR-853 A3  | AC1300          | ✅       |
| DIR-878 A1  | AC1900          | ✅       |
| DIR-882 A1  | AC2600          | ✅       |
| DAP-X1860   | WiFi 6 Extender | ✅       |
| DAP-2610    | AP              | ✅       |

較舊但仍可找到：

* DIR-615
* DIR-825
* DIR-842
* DIR-859

很多都是 OpenWrt 的經典機種。([OpenWrt 硬體表][2])

---

# Zyxel

Zyxel 近幾年反而成為 OpenWrt 最熱門品牌之一。

| 型號          | WiFi    | OpenWrt |
| ----------- | ------- | ------- |
| EX5601-T0   | WiFi 6  | ✅       |
| EX5700      | WiFi 6E | ✅       |
| T-56        | WiFi 6  | ✅       |
| NBG6817     | AC2600  | ✅       |
| NBG6617     | AC1750  | ✅       |
| NBG6616     | AC1200  | ✅       |
| NBG6815     | AC2200  | ✅       |
| WSM20       | Mesh    | ✅       |
| Multy M1    | Mesh    | ✅       |
| GS1900-8    | Switch  | ✅       |
| GS1900-8HP  | Switch  | ✅       |
| GS1900-10HP | Switch  | ✅       |
| GS1900-24EP | Switch  | ✅       |

其中：

* T-56
* EX5601-T0
* EX5700

目前都是 OpenWrt 社群相當熱門的機器。([OpenWrt 郵件列表][3])

---

# 推薦程度

| 推薦等級  | 型號              |
| ----- | --------------- |
| ⭐⭐⭐⭐⭐ | ASUS TUF-AX6000 |
| ⭐⭐⭐⭐⭐ | ASUS TUF-AX4200 |
| ⭐⭐⭐⭐⭐ | ASUS RT-AX59U   |
| ⭐⭐⭐⭐⭐ | Zyxel T-56      |
| ⭐⭐⭐⭐⭐ | Zyxel EX5601-T0 |
| ⭐⭐⭐⭐  | ASUS RT-AX1800S |
| ⭐⭐⭐⭐  | D-Link DIR-878  |
| ⭐⭐⭐⭐  | D-Link DIR-882  |
| ⭐⭐⭐⭐  | Zyxel WSM20     |
| ⭐⭐⭐   | D-Link DIR-860L |

---

## 三個品牌比較

| 品牌         | 支援數量  | 推薦程度                 | 說明                                  |
| ---------- | ----- | -------------------- | ----------------------------------- |
| **Zyxel**  | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐                | 近年支援最完整，MediaTek 平台表現優異。            |
| **D-Link** | ⭐⭐⭐⭐  | ⭐⭐⭐⭐                 | 歷史支援機種非常多，涵蓋 AC 世代。                 |
| **ASUS**   | ⭐⭐⭐   | ⭐⭐⭐⭐⭐（限 MediaTek 機型） | Broadcom 機型限制較多，但 MediaTek 新機表現非常好。 |

## 如果是 2026 年想新買一台刷 OpenWrt 

可優先考慮：

1. ASUS TUF-AX6000
2. ASUS TUF-AX4200
3. ASUS RT-AX59U
4. Zyxel EX5601-T0
5. Zyxel T-56

這些機型都有 **MediaTek Filogic** 平台、充足的 Flash/RAM，對 OpenWrt 24.x 的支援成熟，且仍持續獲得社群維護與更新。([OpenWrt 郵件列表][3])

[1]: https://openwrt.org/supported_devices?utm_source=chatgpt.com "[OpenWrt Wiki] Supported devices"
[2]: https://toh.openwrt.org/?utm_source=chatgpt.com "OpenWrt Table of Hardware"
[3]: https://lists.openwrt.org/pipermail/openwrt-announce/2025-April/000068.html?utm_source=chatgpt.com "OpenWrt 24.10.1 - Service Release"
