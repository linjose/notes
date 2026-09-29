---
layout: post
title: MiniMind-O
date: 2026-09-29
reading_time: 20 min read
tags: [AI]
excerpt: 
---

## MiniMind-O
**MiniMind-O 定位為「超小型、端到端、語音原生（speech-native）的 Omni 多模態模型」**。
**是一個約 1 億參數規模的端到端 Omni 模型，透過 Thinker–Talker 雙路徑架構，將文字、語音與視覺理解整合進同一 Transformer 表示空間，並以 Mimi audio tokens 進行即時語音生成；它的核心價值不在於與大型商用模型競爭，而在於提供一個可以從零理解、訓練與修改 Omni AI 的完整開源實驗平台。** ([GitHub][1])


![Image](https://images.openai.com/static-rsc-4/voirifHOFVEDgnNvXCREddFPhEpNjcMVuSRyfLEvy_INX-Ii7I0nJ0yJYJTb3CcWgse9v6eZud7kDmbejm49c73gl1Iv2wSyZy8bA8Qw9sSj6nRLMqi5okRa291COMcjJ6gRaUbe_ZgcmFr7XZxv8WZ12uj2uXHm9cCFlUcLD8s1Cx-gFid4Wq9dgUD2XAwH?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/spASNVxX-3uyhqaEhDmJvhk5Izq0G80L819_i1d65N-jlkiZbJiNWtMOzd6EJEkgGabAr1c1tYZshXgN1KAsIplHasHEAyovcBMVjANp1Vt1sj06pL7kPKrCfkBxAKubzPNt2n9U9P5zUmeht5tVBokA5MwM9pgTAUv1xyo3_rHvqmVHQT0gZSZGmQ751iP1?purpose=fullsize)

**MiniMind-O** 是開源專案 MiniMind 系列的第三代模型，在 MiniMind（LLM）與 MiniMind-V（VLM）之後，進一步擴展到 **Omni-modal AI**。

其核心目標是：

> **在極小的模型規模下，從零實作一個能同時理解文字、語音與影像，並產生文字與即時語音輸出的完整 Omni 模型。**

目前主要發布兩個模型：

| 模型                  |          Backbone 規模 | 架構    |
| ------------------- | -------------------: | ----- |
| **minimind-3o**     |               約 115M | Dense |
| **minimind-3o-moe** | 約 312M，Active 約 115M | MoE   |

這個規模與一般數十億甚至數百億參數的多模態模型相比非常小，因此它的主要價值並不是追求最強的 benchmark，而是**把 Omni 模型的完整技術鏈路縮小到個人開發者可以理解、訓練與修改的程度**。([GitHub][1])

---

# 一、它和一般「語音 AI」最大的不同

傳統語音助手通常是：

```text
使用者說話
   ↓
ASR
語音 → 文字
   ↓
LLM
文字 → 文字
   ↓
TTS
文字 → 語音
   ↓
使用者聽到回答
```

例如：

```text
Microphone
    ↓
Speech Recognition
    ↓
LLM
    ↓
Text
    ↓
Speech Synthesis
```

這是一種 **Cascaded Architecture（級聯系統）**。

MiniMind-O 採取的方向則更接近：

```text
                ┌── Text Encoder ──┐
                │                  │
Speech → Encoder ─→                │
                │    THINKER       │
Image  → Encoder ─→  MiniMind      │
                │                  │
Text ───────────→                  │
                └───────┬──────────┘
                        │
                  Hidden States
                        ↓
                     TALKER
                        ↓
                Mimi Audio Codes
                        ↓
                  Audio Decoder
                        ↓
                  Streaming Speech
```

也就是說：

**語音不必先被完整轉換成文字，再交給 LLM。**

語音特徵可以直接進入 MiniMind 的 hidden space，Thinker 負責理解多模態資訊，而 Talker 再根據語意條件產生語音。([GitHub][1])

這也是 MiniMind-O 最值得研究的地方。

---

# 二、核心架構：Thinker + Talker

MiniMind-O 最重要的架構概念是 **Thinker–Talker Dual Path Architecture**。

### 1. Thinker

Thinker 是「理解與推理」部分。

它負責：

* 文字理解
* 語音理解
* 圖像理解
* 多模態融合
* 產生文字回答

其 backbone 是 MiniMind 的 Transformer language model。

語音與圖片並不是直接餵給 Transformer，而是：

```text
Speech
   ↓
SenseVoice-Small
   ↓
Audio Projector
   ↓
MiniMind Hidden Space
```

以及：

```text
Image
   ↓
SigLIP2
   ↓
Vision Projector
   ↓
MiniMind Hidden Space
```

如此便可以把不同 modality 映射到相同的語言模型表示空間中。([GitHub][1])

---

### 2. Talker

Talker 則負責：

> **把 Thinker 的語意表示轉換成真正的語音。**

這裡是一個非常重要的設計。

它不是：

```text
LLM → Text → TTS
```

而比較接近：

```text
Thinker Hidden Representation
              ↓
            Talker
              ↓
       Mimi Audio Codes
              ↓
       Audio Decoder
              ↓
         24 kHz Audio
```

Talker 使用 **MTP（Multi-Token Prediction）** 同時預測多層 Mimi audio codes，再由 Mimi codec 還原成音訊。([GitHub][1])

因此它可以支援 **streaming speech generation**。

---

# 三、為什麼使用 Mimi？

MiniMind-O 並不是直接讓 Transformer 預測 waveform。

因為如果直接生成：

```text
0.0012
0.0015
0.0021
...
```

這會產生非常龐大的序列。

因此它使用 **Mimi neural audio codec** 將聲音壓縮成離散 audio codes。

簡化來看：

```text
Speech waveform
       ↓
      Mimi
       ↓
 ┌─────────────┐
 │ Codebook 1  │
 │ Codebook 2  │
 │ Codebook 3  │
 │     ...     │
 │ Codebook 8  │
 └─────────────┘
       ↓
 Audio Tokens
```

MiniMind-O 使用 **8 層 codebook、12.5 Hz、24 kHz audio** 的設計。Talker 的工作就是預測這些 audio tokens，再交給 Mimi decoder 還原聲音。([GitHub][1])

這其實是把：

> **「語音生成」轉換成「生成 audio tokens」問題。**

從 Transformer 的角度看，這與 LLM 生成文字 token 的思想非常接近。

---

# 四、它其實是一個「多模態 Token Transformer」

如果從更底層的模型觀點來看，我會把 MiniMind-O 理解成：

> **以 Transformer 為核心，將 Text、Speech、Vision 不同模態轉換到共同 representation space，再以 token-level sequence modeling 方式進行多模態理解與語音生成。**

因此可以把它概念化成：

```text
                 ┌──────── Text Tokens
                 │
                 ├──────── Audio Features
Input Modalities ┤
                 └──────── Image Features
                         ↓
                 ┌─────────────────┐
                 │     MiniMind    │
                 │   Transformer   │
                 └────────┬────────┘
                          │
                    Semantic State
                          │
                          ↓
                 ┌─────────────────┐
                 │      Talker     │
                 │      + MTP      │
                 └────────┬────────┘
                          │
                     Audio Codes
                          ↓
                       Mimi
                          ↓
                   Streaming Audio
```

因此，它不是「三個模型拼在一起」那麼簡單，而是嘗試建立一個**統一的多模態序列建模架構**。

---

# 五、它還支援「看」

Vision 部分使用：

**SigLIP2**

流程為：

```text
Image
  ↓
SigLIP2 Vision Encoder
  ↓
2-layer MLP Projector
  ↓
MiniMind Hidden Space
  ↓
Thinker
```

因此使用者可以提供：

* 文字
* 語音
* 圖片

而 Thinker 可以在同一個模型架構中進行融合與理解。([GitHub][1])

所以 MiniMind-O 的「O」可以理解為 **Omni**：

> **Text + Audio + Vision → Understanding → Text + Speech**

---

# 六、它真正有意思的地方：即時語音互動

MiniMind-O 不只是「圖片＋語音＋文字」。

它還特別處理了 **real-time interaction**。

例如：

```text
User:
「請問台北今天……」

        ↓

AI 開始理解

        ↓

AI：
「台北今天……」

        ↓

User 突然插話

「等一下，我是問明天！」

        ↓

Barge-in
        ↓
停止目前語音
        ↓
重新理解
```

這就是所謂 **barge-in / interruption**。

搭配 VAD（Voice Activity Detection），模型可以做到：

* 即時語音輸出
* 使用者打斷
* 重新理解
* 近似雙工互動

官方也將此列為 MiniMind-O 的主要能力之一。([GitHub][1])

---

# 七、它甚至可以做 Voice Cloning

MiniMind-O 的另一個有趣能力是 **in-context voice cloning**。

概念是：

```text
Reference Voice
       ↓
Speaker / Audio Encoder
       ↓
Voice Condition
       ↓
Talker
       ↓
相同語意
但以指定聲音輸出
```

也就是說，不需要重新 fine-tune 整個模型，只要改變 inference 時的 voice conditioning，就可以控制輸出音色。([GitHub][2])

---

# 八、MiniMind-O 的定位其實很特別

如果把目前常見的模型按照定位粗略區分：

| 類型             | 代表方向                  | 主要目的                  |
| -------------- | --------------------- | --------------------- |
| 大型 LLM         | GPT、Qwen 等            | 高品質語言推理               |
| 大型 VLM         | Qwen-VL 等             | Vision + Language     |
| 大型 Omni        | GPT-4o、Qwen3-Omni 等   | 高品質全模態互動              |
| Speech-native  | Moshi、部分 Voice Models | 即時語音互動                |
| **MiniMind-O** | **115M / 312M**       | **從零理解 Omni 模型完整技術鏈** |

所以我不會把 MiniMind-O 定義成：

> 「一個小型版 GPT-4o」

這樣會誤解它。

更準確的定位是：

> **一個教育、研究與實驗導向的超小型 Omni foundation model implementation。**

它的價值在於：

**把原本只有大型 AI Lab 才容易操作的 Omni model architecture，縮小到研究者可以閱讀 source code、自己訓練、自己修改的程度。**

官方甚至提供 mini dataset，可以在單張 RTX 3090 上約 2 小時跑完整的 SFT pipeline。([GitHub][1])

---

# 九、對你來說，它特別值得研究的原因

以你之前在研究的 **OpenClaw + Local AI + Whisper/Piper/VTube + Qwen/Ollama** 架構來看，MiniMind-O 有一個很重要的啟發：

你原本比較容易採用：

```text
Mic
 ↓
Whisper
 ↓
Qwen / Ollama
 ↓
Piper
 ↓
Avatar
```

這是一個典型的 **Agentic Cascaded Architecture**。

而 MiniMind-O 則代表另一條路：

```text
                 ┌── Image
                 │
Mic ─────────────┤
                 │
Text ────────────┤
                 ↓
            Omni Model
                 ↓
        ┌────────┴────────┐
        ↓                 ↓
      Text             Speech
        ↓                 ↓
     Agent              Audio
```

也就是從：

**「多個專業模型串接」**

逐步走向：

**「一個模型內部統一處理多模態 interaction」**。

這對你如果想研究 **本地端 AI Agent + 語音 + 視覺 + 即時互動**，其實非常有研究價值。

另外，MiniMind-O 採 **Apache-2.0** 授權，完整程式碼、模型權重及訓練資料都有公開，對研究與自行修改也相當友善。([GitHub][1])



[1]: https://github.com/jingyaogong/minimind-o?utm_source=chatgpt.com "GitHub - jingyaogong/minimind-o: 🎙️ A 0.1B Omni model trained from scratch, capable of listening, speaking, and seeing! · GitHub"
[2]: https://github.com/jingyaogong/minimind-o/blob/master/README_en.md?utm_source=chatgpt.com "minimind-o/README_en.md at master · jingyaogong/minimind-o · GitHub"
