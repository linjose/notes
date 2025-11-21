---
layout: post
title: YOLOv8 and YOLO on mobile
date: 2025-11-22
reading_time: 10 min read
tags: [AI,YOLO]
excerpt: 
---

## 1. 環境需求

* Python 3.8 以上
* 建議使用虛擬環境（venv 或 conda）
* GPU（可選）：NVIDIA CUDA 11+（如需加速訓練）

---

## 2. 安裝步驟

### 2.1 建立虛擬環境（可選）

```bash
python -m venv yolovenv
source yolovenv/bin/activate   # macOS / Linux
yolovenv\Scripts\activate      # Windows
```

### 2.2 安裝 YOLOv8

YOLOv8 官方套件為 **ultralytics**

```bash
pip install ultralytics
```

### 2.3 測試是否安裝成功

```bash
yolo
```

若出現指令清單表示成功。

---

## 3. 基本使用方式

### 3.1 物件偵測（推論）

對影像檔案進行偵測：

```bash
yolo detect predict model=yolov8n.pt source=your_image.jpg
```

* `model=yolov8n.pt`：使用官方 Nano 模型
* `source=`：可放檔案、資料夾、影片或攝影機 (0)

#### 範例（偵測影片）

```bash
yolo detect predict model=yolov8s.pt source=video.mp4
```

---

## 4. 訓練自己的資料集

### 4.1 資料集格式 (YOLO format)

資料夾結構：

```
datasets/
  mydata/
    images/
      train/
      val/
    labels/
      train/
      val/
```

### 4.2 建立資料集設定檔（data.yaml）

```yaml
path: datasets/mydata
train: images/train
val: images/val

names:
  0: cat
  1: dog
```

### 4.3 開始訓練

```bash
yolo detect train model=yolov8n.pt data=data.yaml epochs=50 imgsz=640
```

常用參數：

* `epochs=50`：訓練迭代次數
* `imgsz=640`：影像尺寸
* `batch=16`：批次大小

---

## 5. 模型導出（Export）

YOLOv8 可輸出成多種格式：

```bash
yolo export model=runs/detect/train/weights/best.pt format=onnx
```

可支援格式：

* onnx
* openvino
* tflite
* coreml
* engine (TensorRT)

---

## 6. 在 Python 中呼叫 YOLOv8

```python
from ultralytics import YOLO

model = YOLO("yolov8n.pt")
results = model("image.jpg")

# 取得偵測結果
for r in results:
    print(r.boxes)
```

---

## 7. 常見指令總整理

| 功能 | 指令                                                    |
| -- | ----------------------------------------------------- |
| 推論 | `yolo detect predict model=yolov8n.pt source=img.jpg` |
| 訓練 | `yolo detect train model=yolov8n.pt data=data.yaml`   |
| 評估 | `yolo detect val model=best.pt data=data.yaml`        |
| 匯出 | `yolo export model=best.pt format=onnx`               |


