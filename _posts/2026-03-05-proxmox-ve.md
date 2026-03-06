---
layout: post
title: Proxmox VE 9.0 installation
date: 2026-03-05
reading_time: 12 min read
tags: [AI]
excerpt: 
---
### 嵌套虛擬化 (Nested Hypervisor) — 在 Ubuntu 24.04 中安裝 Proxmox VE 9.0

嵌套虛擬化是一種虛擬化設置，即在一個虛擬機器監控器（Hypervisor）內部運行另一個虛擬機器監控器。簡單來說，就是「虛擬化中的虛擬化」。

通常，像 KVM、VMware ESXi 或 Proxmox VE 這樣的 Hypervisor 是直接運行在物理硬件上的。但在嵌套虛擬化中，你可以將一個 Hypervisor（例如 Proxmox VE）安裝在另一個（例如 Ubuntu 上的 KVM）之中。

這種分層設置對於測試、學習和開發環境特別有用，因為在這些環境中為每個 Hypervisor 配備專用物理硬件並不實際。

**為什麼嵌套虛擬化是測試 Proxmox 的絕佳選擇：**

* **安全實驗**：你可以嘗試 Proxmox 的功能、更新或集群（Clustering），而不會影響你的生產服務器。
* **學習內部原理**：非常適合培訓、實驗練習或證照考取練習。
* **模擬複雜環境**：在你的主工作站上即可構建多節點集群，或測試備份與遷移工作流。
* **節省硬體成本**：在現有系統（甚至是高效能筆電）中運行整個 Proxmox 環境，無需額外服務器。

---

### 第 1 步：準備安裝了 KVM 的 Ubuntu 24.04

#### 1.1 檢查 CPU 虛擬化支持

在你的 Ubuntu 主機上運行：

```bash
egrep -c '(vmx|svm)' /proc/cpuinfo

```

如果結果為 1 或更多，則表示你的 CPU 支持硬件虛擬化。

#### 1.2 安裝 KVM 及虛擬化工具

```bash
sudo apt update
sudo apt install -y qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils virt-manager

```

檢查 `libvirtd` 是否處於活動狀態：

```bash
sudo systemctl status libvirtd

```

你應該會看到它正在運行（active）。

---

### 第 2 步：啟用嵌套虛擬化 (Nested Virtualization)

為了讓你虛擬化的 Proxmox VM 本身能夠託管虛擬機，必須啟用嵌套功能。

#### 2.1 檢查是否已啟用

Ubuntu 的內核通常默認啟用嵌套。你可以檢查：

* **Intel CPU:** `cat /sys/module/kvm_intel/parameters/nested`
* **AMD CPU:** `cat /sys/module/kvm_amd/parameters/nested`

如果返回 `Y` 或 `1`，則表示嵌套功能已激活。

#### 2.2 手動啟用（如果未激活）

如果未啟用，請按以下步驟操作：

1. **解除模塊加載：**
```bash
sudo modprobe -r kvm_intel # Intel 用戶
sudo modprobe -r kvm_amd   # AMD 用戶

```


2. **重新加載並啟用嵌套：**
```bash
sudo modprobe kvm_intel nested=1 # Intel
sudo modprobe kvm_amd nested=1   # AMD

```


3. **使其永久生效：**
```bash
echo "options kvm_intel nested=1" | sudo tee /etc/modprobe.d/kvm-intel.conf
# 或 AMD:
echo "options kvm_amd nested=1" | sudo tee /etc/modprobe.d/kvm-amd.conf

```



---

### 第 3 步：下載 Proxmox VE 9.0 ISO

從 Proxmox 官方網站獲取 ISO 鏡像。
*(註：目前 Proxmox 穩定版為 8.x，若 9.0 已發佈請使用相應連結)*
例如：

```bash
wget https://enterprise.proxmox.com/iso/proxmox-ve_9.0-1.iso

```

---

### 第 4 步：使用 Virt-Manager 創建 Proxmox 虛擬機

1. 啟動 **Virt-Manager**：`virt-manager`
2. 點擊 **"新建虛擬機"** → 選擇 **"本地安裝介質 (ISO)"** → 選擇你的 Proxmox 9.0 ISO。
3. **分配資源（建議最小值）：**
* **CPU：** 4 核
* **RAM：** 8 GB（或更多）
* **硬碟：** 64 GB 或更多


4. 在開始安裝前，點擊 **"在安裝前自定義配置" (Customize before install)**：
* 在 **CPU 設置**下，勾選 **"複製主機 CPU 配置" (Copy host CPU configuration)** 或使用 **host-passthrough**，以便將虛擬化指令集傳遞給 VM。
* 確保 **vmx/svm** 標誌已暴露。
* **網絡：** 如果希望 Proxmox 在區域網中可訪問，請選擇 **橋接模式 (Bridged)**；若僅需隔離測試，請選 **NAT**。



---

### 第 5 步：在 VM 中安裝 Proxmox VE 9.0

當虛擬機從 ISO 啟動後：

1. 選擇 **Install Proxmox VE (Graphical Installer)**。
2. 接受授權條款。
3. 選擇目標硬碟。
4. 設置 Root 密碼和電子郵件地址。
5. 配置網絡設置（建議使用**靜態 IP**）。
6. 完成安裝並重啟虛擬機。

---

### 第 6 步：訪問 Proxmox Web UI

重啟後，在瀏覽器輸入：
`https://<proxmox-vm-ip>:8006`

登錄憑據：

* **用戶名：** root
* **密碼：** 你設置的密碼
* **領域 (Realm)：** Linux PAM Standard Authentication

---

### 第 7 步：性能與配置優化建議

1. **固定內存：** 禁用內存氣球驅動 (Memory Ballooning)，以避免嵌套環境中出現不可預見的內存偏移。
2. **CPU 模式：** 務必確保 CPU 模式為 `host-passthrough`，以提供完整的指令集支持。
3. **VirtIO 驅動：** 在 Proxmox 內部，磁碟和網路請優先使用 VirtIO 驅動以提升性能。

---

### 總結與注意事項

* **開銷 (Overhead)：** 嵌套虛擬化會帶來性能損耗，速度無法與物理機安裝相比。
* **功能限制：** 某些功能（如實時遷移、快照）在嵌套模式下可能無法完美運行。
* **保持更新：** 務必保持 Ubuntu 主機和 Proxmox VM 的更新，以獲取最新的 Bug 修復和嵌套性能改進。
