# Ubuntu 26.04 使用 Cloudflare Tunnel 建立對外 Server 設定教學

**適用環境：** Ubuntu 26.04、4G/LTE Router、CGNAT、Web Server / API Server
**文件版本：** 2026-09
**Cloudflare 設定方式：** Remotely-managed Tunnel

---

# 1. 目的

本文件說明如何讓位於 4G/LTE Router 後方的 Ubuntu Server，透過 **Cloudflare Tunnel** 對 Internet 提供網站或 API 服務。

此架構不需要：

* 固定 Public IP
* 電信商提供 Public IPv4
* Router Port Forwarding
* Router DMZ
* 開放 TCP 80 / 443 inbound

因此即使 4G/LTE 電信網路採用 CGNAT，也可以建立公開網站。

Cloudflare Tunnel 的運作方式是由 Ubuntu 上的 `cloudflared` 主動向 Cloudflare 建立 outbound connection，因此 Internet 使用者不會直接連到 LTE Router 或 Ubuntu 的 Public IP。Cloudflare 官方要求 Server 可主動連到 Cloudflare，主要 Tunnel 流量使用 TCP/UDP 7844。

---

# 2. 系統架構

假設環境如下：

```text
Internet 使用者
      │
      │ https://server.example.com
      ▼
┌──────────────────────┐
│      Cloudflare      │
│ DNS / HTTPS / WAF    │
└──────────┬───────────┘
           │
           │ Cloudflare Tunnel
           │ outbound connection
           │
           ▼
┌──────────────────────┐
│    4G / LTE Router   │
│                      │
│ CGNAT 可以           │
│ 不需 Port Forwarding │
└──────────┬───────────┘
           │ LAN
           │
           ▼
┌────────────────────────────┐
│ Ubuntu Server 26.04        │
│                            │
│ cloudflared                │
│      │                     │
│      └── localhost:8080    │
│               │            │
│          Web / API         │
└────────────────────────────┘
```

本文件以以下設定為範例：

```text
網域：
example.com

公開網址：
https://server.example.com

Ubuntu Server：
192.168.8.10

Web Server：
http://127.0.0.1:8080
```

實際安裝時請將 `example.com` 與 Port `8080` 改成實際環境。

---

# 3. 前置條件

需要準備：

1. Cloudflare 帳號
2. 一個網域，例如 `example.com`
3. 該網域已加入 Cloudflare
4. Ubuntu Server 可以正常連 Internet
5. Ubuntu 上已有欲發布的 Web / API 服務

Cloudflare 官方要求，若要透過 Public Hostname 正式發布應用程式，網域必須由 Cloudflare 管理。

例如：

```text
example.com
```

已經加入 Cloudflare DNS 管理後，可以建立：

```text
server.example.com
api.example.com
grafana.example.com
app.example.com
```

---

# 4. 確認 Ubuntu 網路

首先確認 Ubuntu Server 可以正常連 Internet。

```bash
ip addr
```

確認 Default Route：

```bash
ip route
```

測試 Internet：

```bash
ping -c 4 1.1.1.1
```

再測試 DNS：

```bash
ping -c 4 cloudflare.com
```

亦可確認目前對外 IP：

```bash
curl -4 https://ifconfig.me
```

即使此 IP 是 4G 電信商 CGNAT 後方的共享 IP，也不影響 Cloudflare Tunnel。

---

# 5. 確認 Web Server 正常運作

Cloudflare Tunnel 設定之前，應先確認應用程式本身可正常使用。

例如服務使用：

```text
127.0.0.1:8080
```

執行：

```bash
curl http://127.0.0.1:8080
```

若回傳 HTML 或 API Response，即表示服務正常。

亦可確認目前有哪些 TCP Port 正在 Listen：

```bash
sudo ss -lntp
```

例如：

```text
LISTEN 0 511 127.0.0.1:8080
```

代表服務正在：

```text
http://127.0.0.1:8080
```

等待連線。

---

# 6. 安裝 cloudflared

## 6.1 安裝 Cloudflare Repository Signing Key

執行：

```bash
sudo mkdir -p --mode=0755 /usr/share/keyrings
```

下載 Cloudflare repository signing key：

```bash
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg \
  | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
```

---

## 6.2 加入 Cloudflare APT Repository

```bash
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" \
  | sudo tee /etc/apt/sources.list.d/cloudflared.list
```

---

## 6.3 安裝 cloudflared

```bash
sudo apt update
```

```bash
sudo apt install cloudflared
```

確認版本：

```bash
cloudflared --version
```

Cloudflare 官方目前仍提供 Debian / Ubuntu APT repository 作為 `cloudflared` 的正式安裝方式。

---

# 7. 在 Cloudflare 建立 Tunnel

登入 Cloudflare Dashboard。

進入：

```text
Networking
   ↓
Tunnels
   ↓
Create Tunnel
```

Cloudflare 官方目前的 Dashboard 建立流程即位於：

```text
Networking → Tunnels
```

---

## 7.1 建立 Tunnel 名稱

例如輸入：

```text
ubuntu-lte-server
```

名稱主要供管理辨識使用。

建議採：

```text
production-web
office-server
lab-server
ubuntu-lte-server
hospital-demo-server
```

等容易辨識的名稱。

按：

```text
Create Tunnel
```

---

# 8. 將 Ubuntu Server 加入 Tunnel

建立 Tunnel 後，Cloudflare 會出現：

```text
Setup Environment
```

選擇：

```text
Operating System：Debian
Architecture：64-bit
```

Cloudflare 會產生一條包含 Tunnel Token 的指令。

形式大致如下：

```bash
sudo cloudflared service install <TUNNEL_TOKEN>
```

例如：

```bash
sudo cloudflared service install eyJhIjoiXXXXXXXXXXXX...
```

**請直接使用 Cloudflare Dashboard 產生的實際指令，不要自行製造 Token。**

Cloudflare 官方目前正式使用：

```bash
sudo cloudflared service install <TUNNEL_TOKEN>
```

將 remotely-managed tunnel 安裝成 Linux system service。

---

# 9. Tunnel Token 安全注意事項

`TUNNEL_TOKEN` 應視為機密資訊。

不得：

```text
上傳 GitHub
放進公開 Wiki
貼在公開文件
放入 Dockerfile
放入網站 JavaScript
寄到公開 Mailing List
```

Cloudflare 明確指出，持有 Tunnel Token 的人即可啟動該 Tunnel connector，因此應將 Token 視為憑證管理。若 Token 洩漏，應立即 Rotate Token。

---

# 10. 確認 cloudflared Service

安裝完成後：

```bash
sudo systemctl status cloudflared
```

正常情況應顯示：

```text
Active: active (running)
```

可確認是否設定為開機自動啟動：

```bash
sudo systemctl is-enabled cloudflared
```

預期：

```text
enabled
```

若需重新啟動：

```bash
sudo systemctl restart cloudflared
```

查看即時 Log：

```bash
sudo journalctl -u cloudflared -f
```

---

# 11. 確認 Cloudflare Tunnel 狀態

回到：

```text
Cloudflare Dashboard

Networking
→ Tunnels
```

正常情況 Tunnel 應顯示：

```text
Healthy
```

Cloudflare 官方亦以 `Healthy` 作為 connector 已成功連接的狀態。

架構此時已經形成：

```text
Cloudflare
     ▲
     │
     │ persistent outbound tunnel
     │
cloudflared
     │
Ubuntu
```

但是目前還沒有指定哪個網址要連到哪一個 Server Port。

---

# 12. 建立 Public Hostname

點選：

```text
Networking
→ Tunnels
→ ubuntu-lte-server
```

進入：

```text
Routes
→ Add route
```

選擇：

```text
Published application
```

Cloudflare 目前將 Public Hostname 與 Local Service 的對應稱為 Published Application route。

---

# 13. 設定網域名稱

假設希望建立：

```text
https://server.example.com
```

設定：

```text
Hostname

Subdomain：
server

Domain：
example.com
```

最後形成：

```text
server.example.com
```

---

# 14. 設定 Service URL

假設 Ubuntu 上的 Web Server 是：

```text
http://127.0.0.1:8080
```

設定：

```text
Service URL：

http://localhost:8080
```

或：

```text
http://127.0.0.1:8080
```

然後選擇：

```text
Add route
```

Cloudflare 官方支援直接將 hostname 對應至同一台主機，例如：

```text
app.example.com
        ↓
http://localhost:8080
```

若服務在另一台 LAN Server，也可以設定 LAN IP，例如：

```text
http://192.168.8.20:8080
```

---

# 15. HTTPS 如何處理

如果 Ubuntu 上的 Web Server 為：

```text
http://localhost:8080
```

並不表示 Internet 使用者只能使用 HTTP。

外部仍然使用：

```text
https://server.example.com
```

流程為：

```text
Browser

HTTPS
  │
  ▼
Cloudflare
  │
  │ Cloudflare Tunnel
  ▼
cloudflared

HTTP localhost
  │
  ▼
Web Server :8080
```

因此若 `cloudflared` 與 Web Server 在同一台 Ubuntu 上，通常可以直接：

```text
Service URL：
http://localhost:8080
```

不需要為 localhost 額外申請 TLS Certificate。

---

# 16. DNS 設定

使用 Dashboard 建立 Published Application route 時，Cloudflare 會建立對應的 Tunnel DNS 設定。

其概念為：

```text
server.example.com

CNAME

<TUNNEL-ID>.cfargotunnel.com
```

Cloudflare 官方說明，透過 Dashboard 建立 Public Hostname 時會自動建立指向 Tunnel 的 DNS record。

因此一般不需要另外手動新增 A Record：

```text
server.example.com → LTE Public IP
```

也**不應該**將 4G Router 的 IP 當作此服務的 A Record。

---

# 17. 外部測試

設定完成後：

```bash
curl https://server.example.com
```

或直接使用 Browser：

```text
https://server.example.com
```

建議另外使用：

```text
手機 5G
其他公司網路
家用光纖
```

等不在該 LTE Router LAN 裡的網路進行測試。

若可以正常開啟，即代表：

```text
Internet
→ Cloudflare
→ Tunnel
→ LTE
→ Ubuntu
→ Web Server
```

整條路徑正常。

---

# 18. Router 不需要設定 Port Forwarding

使用 Cloudflare Tunnel 後，4G Router **不需要**：

```text
TCP 80 Forwarding
TCP 443 Forwarding
DMZ
UPnP
Public IP
固定 IP
```

原因是連線方向為：

```text
Ubuntu
   │
   │ Outbound
   ▼
Cloudflare
```

而不是：

```text
Internet
   │
   │ Inbound
   ▼
LTE Router
```

這也是 Cloudflare Tunnel 特別適合 4G、5G、CGNAT 環境的主要原因。

---

# 19. Ubuntu Firewall 建議

如果只透過 Cloudflare Tunnel 提供 Web Service，Ubuntu 不需要對 Internet 開放：

```text
80
443
8080
```

可使用 UFW：

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

如果仍需要從區網 SSH 管理，例如 LAN 為：

```text
192.168.8.0/24
```

可只允許 LAN：

```bash
sudo ufw allow from 192.168.8.0/24 to any port 22 proto tcp
```

啟用：

```bash
sudo ufw enable
```

確認：

```bash
sudo ufw status verbose
```

形成：

```text
Inbound：

Internet → 22     ✗
Internet → 80     ✗
Internet → 443    ✗
Internet → 8080   ✗

LAN → SSH 22      ✓

Outbound：

Ubuntu → Cloudflare ✓
```

這會比直接將 Server Port Forward 到 Internet 安全許多。

---

# 20. 特殊 Firewall 環境

一般 Ubuntu：

```bash
sudo ufw default allow outgoing
```

即可正常建立 Cloudflare Tunnel。

如果公司 Firewall 特別限制 outbound traffic，必須允許：

```text
TCP 7844
UDP 7844
```

由 Ubuntu 向 Cloudflare outbound。

Cloudflare 官方目前說明，Tunnel 主要使用：

```text
UDP 7844 → QUIC
TCP 7844 → HTTP/2
```

因此限制型 Firewall 應允許 TCP 與 UDP 7844 outbound。

不需要允許：

```text
Internet → Server TCP 7844
```

因為 7844 是 **outbound connection**。

---

# 21. 建議讓 Web Server 只 Listen localhost

如果 Web Application 與 `cloudflared` 在同一台 Ubuntu，建議應用程式 Listen：

```text
127.0.0.1
```

而不是：

```text
0.0.0.0
```

例如：

```text
127.0.0.1:8080
```

這樣 LAN 裡其他電腦也不能直接存取 8080。

架構會成為：

```text
Internet
   │
   ▼
Cloudflare
   │
   ▼
cloudflared
   │
   ▼
127.0.0.1:8080
   │
   ▼
Application
```

此方式可進一步減少服務直接暴露的範圍。

---

# 22. 一個 Tunnel 可以發布多個服務

不需要每一個網站都建立一個 Tunnel。

例如同一個 Tunnel：

```text
ubuntu-lte-server
```

可以設定：

```text
www.example.com
    ↓
http://localhost:80

api.example.com
    ↓
http://localhost:8080

grafana.example.com
    ↓
http://localhost:3000

ai.example.com
    ↓
http://localhost:8000
```

Cloudflare Tunnel 支援在一個 Tunnel 中建立多個 Published Applications。

因此比較建議：

```text
一台 Server / 一個網路環境
        ↓
一個 Tunnel
        ↓
多個 Hostname / Service
```

而不是每個 Application 建立一個 Tunnel。

---

# 23. Docker 環境範例

假設 Ubuntu Docker 中執行：

```bash
docker run -d \
  --name myapp \
  -p 127.0.0.1:8080:8080 \
  myapp
```

則 Cloudflare Tunnel：

```text
server.example.com
        ↓
http://localhost:8080
```

即可。

推薦：

```text
-p 127.0.0.1:8080:8080
```

而非：

```text
-p 8080:8080
```

因為前者只會將應用程式發布到 localhost。

---

# 24. Nginx 架構範例

較完整的正式 Server 可以採：

```text
Internet
   │
   ▼
Cloudflare
   │
   │ Tunnel
   ▼
cloudflared
   │
   ▼
Nginx
127.0.0.1:80
   │
   ├── /api
   │       ↓
   │    FastAPI :8000
   │
   ├── /app
   │       ↓
   │    Node :3000
   │
   └── /
           ↓
       Web Site
```

Cloudflare 設定：

```text
server.example.com
        ↓
http://localhost:80
```

由 Nginx 再負責 Reverse Proxy。

對具有多個 Web Service 的 Ubuntu Server，此架構較容易維護。

---

# 25. 常用維護指令

確認 cloudflared：

```bash
cloudflared --version
```

查看狀態：

```bash
sudo systemctl status cloudflared
```

啟動：

```bash
sudo systemctl start cloudflared
```

停止：

```bash
sudo systemctl stop cloudflared
```

重新啟動：

```bash
sudo systemctl restart cloudflared
```

開機自動啟動：

```bash
sudo systemctl enable cloudflared
```

即時 Log：

```bash
sudo journalctl -u cloudflared -f
```

最近 100 筆 Log：

```bash
sudo journalctl -u cloudflared -n 100
```

---

# 26. 更新 cloudflared

因為透過 APT Repository 安裝，可以定期執行：

```bash
sudo apt update
sudo apt upgrade
```

或只更新：

```bash
sudo apt install --only-upgrade cloudflared
```

更新完成後：

```bash
sudo systemctl restart cloudflared
```

---

# 27. 常見問題排除

## 問題一：Cloudflare 顯示 Tunnel Down / Disconnected

先檢查：

```bash
sudo systemctl status cloudflared
```

再看：

```bash
sudo journalctl -u cloudflared -n 100
```

確認 Ubuntu Internet：

```bash
ping cloudflare.com
```

若有嚴格 Firewall，確認 outbound TCP/UDP `7844` 未被封鎖。

---

## 問題二：網站顯示 502 Bad Gateway

通常代表：

```text
Browser
   ↓
Cloudflare        OK
   ↓
Tunnel            OK
   ↓
cloudflared       OK
   ↓
Application       ERROR
```

先執行：

```bash
curl http://127.0.0.1:8080
```

如果本機都連不到，問題並不在 Cloudflare，而是 Application。

再確認：

```bash
sudo ss -lntp
```

例如實際服務為：

```text
127.0.0.1:8000
```

但 Cloudflare 設定：

```text
localhost:8080
```

就會產生錯誤。

---

## 問題三：HTTP / HTTPS 設錯

如果 Application 實際為：

```text
http://localhost:8080
```

Cloudflare Service URL 就應設定：

```text
http://localhost:8080
```

不要設定：

```text
https://localhost:8080
```

外部網址仍然可以使用：

```text
https://server.example.com
```

---

## 問題四：HTTPS Origin Certificate Error

如果 Backend 本身使用 HTTPS：

```text
https://localhost:443
```

則需確保 Backend Certificate 與 Cloudflare Tunnel 的 TLS 設定正確。

若沒有特殊需求，而且：

```text
cloudflared
```

與：

```text
Web Server
```

在同一台主機，通常直接採：

```text
http://localhost
```

會較簡單。

不要為了解決錯誤就長期關閉 Certificate Verification。

---

## 問題五：Tunnel 正常，但 DNS 找不到

測試：

```bash
nslookup server.example.com
```

或：

```bash
dig server.example.com
```

確認 Cloudflare Dashboard：

```text
Networking
→ Tunnels
→ Tunnel
→ Routes
```

是否真的已建立：

```text
server.example.com
        ↓
http://localhost:8080
```

---

# 28. Tunnel Token 洩漏處理

如果 Token 曾經：

```text
貼到 GitHub
貼到公開 Chat
寄出
外洩
被其他人取得
```

不要只刪除文字，應直接更換 Token。

Cloudflare Dashboard：

```text
Networking
→ Tunnels
→ 選擇 Tunnel
→ Rotate token
```

然後 Ubuntu：

```bash
sudo cloudflared service uninstall
```

再以新 Token：

```bash
sudo cloudflared service install <NEW_TOKEN>
```

Cloudflare 官方說明，Token rotate 後舊 Token 將無法建立新的 connector connection。

---

# 29. 建議正式環境設定

正式環境建議採：

```text
4G LTE Router
      │
      │ 不設定 Port Forwarding
      │
Ubuntu Server
      │
      ├── UFW deny incoming
      │
      ├── SSH 僅允許 LAN / VPN
      │
      ├── cloudflared
      │
      └── Application
             │
             └── 127.0.0.1 only
```

公開端：

```text
server.example.com
       │
       ▼
Cloudflare
       │
       │ HTTPS
       │ WAF
       │ DDoS protection
       │ Tunnel
       ▼
Ubuntu Server
```

---

# 30. 建議的完整設定範例

假設：

```text
Domain：
example.com

Public URL：
https://server.example.com

Ubuntu：
192.168.8.10

Application：
127.0.0.1:8080
```

最終設定為：

```text
Cloudflare Tunnel

Name:
ubuntu-lte-server

Published Application:

Hostname:
server.example.com

Service:
http://localhost:8080
```

Ubuntu：

```bash
sudo systemctl status cloudflared
```

應為：

```text
active (running)
```

Application：

```bash
curl http://127.0.0.1:8080
```

應正常回覆。

外部：

```bash
curl https://server.example.com
```

應正常回覆。

Router：

```text
Port Forwarding：無
DMZ：無
Public IP：不需要
Static IP：不需要
```

---

# 31. 完成後檢查清單

正式上線前依序確認：

* [ ] Domain 已由 Cloudflare 管理
* [ ] Ubuntu 可以連 Internet
* [ ] Local Application 可以正常使用
* [ ] `cloudflared` 已安裝
* [ ] Cloudflare Tunnel 已建立
* [ ] `cloudflared` systemd service 為 Running
* [ ] Cloudflare Tunnel 顯示 Healthy
* [ ] Published Application 已建立
* [ ] Hostname 設定正確
* [ ] Service URL 與 Application Port 一致
* [ ] 外部 HTTPS 可以正常開啟
* [ ] LTE Router 未開 Port Forwarding
* [ ] Ubuntu UFW 不對外開放 Application Port
* [ ] Tunnel Token 未存放於 GitHub 或公開文件
* [ ] SSH 不直接暴露於 Internet

完成以上項目後，Ubuntu Server 即可透過 4G/LTE 網路穩定提供對外 Web / API 服務。

---

# 32. 最終架構

```text
                Internet
                    │
                    │
          https://server.example.com
                    │
                    ▼
        ┌─────────────────────┐
        │     Cloudflare      │
        │                     │
        │ DNS / TLS / WAF     │
        │ DDoS Protection     │
        └──────────┬──────────┘
                   │
                   │ Cloudflare Tunnel
                   │ TCP/UDP 7844 outbound
                   │
        ┌──────────▼──────────┐
        │   4G / LTE Network  │
        │       CGNAT         │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │     LTE Router      │
        │                     │
        │ No Port Forwarding  │
        │ No DMZ              │
        └──────────┬──────────┘
                   │
             192.168.8.10
                   │
        ┌──────────▼──────────┐
        │   Ubuntu 26.04      │
        │                     │
        │   cloudflared       │
        │        │            │
        │        ▼            │
        │  localhost:8080     │
        │        │            │
        │        ▼            │
        │    Web / API        │
        └─────────────────────┘
```

此架構特別適用於 **4G/5G Router、行動式設備、展示場域、偏鄉據點、臨時 POC Server，以及無法取得固定 Public IP 的環境**。
