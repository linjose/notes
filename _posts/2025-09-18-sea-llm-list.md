---
layout: post
title: 東南亞語言模型
date: 2025-09-19
reading_time: 5 min read
tags: [LLM]
excerpt: 東南亞語言模型資料
---

整理huggingface上的印尼文和越南文語言模型。
越南文的語言模型比想像中多，最大有18B，6-8B有18個。
是否好用還需要再測測看。

這邊的實驗主要是為了針對東南亞來台工作人士，
能夠提供方便的語言模型，讓他們在台灣的生活更友善。


## 印尼文模型
  - https://huggingface.co/models?sort=downloads&search=indonesia
### 3B
  - shiningdota/Llama-3.2-3B_Instruct_Indonesian
### 5B
  - adityagofi/Translate-Jawa-Indonesia-Aya-Expanse-8B
  - devhem/llama-3.1-8b-indonesian
### 7B
  - psetialana/cendol_llama_7b_chat-informal_indonesia
  - TCleo/SriRatuTani-Indonesia-7B
  - megaaziib/Miacaroni-7B-Indonesia
### 8B
  - adrieljleo/indonesia-function-call-lora-v2
  - evoreign/GRPO-vllm-Meta-Llama-3.1-8B-Instruct-indonesian-legal-finetune
  - adrieljleo/indonesia-function-call-lora-v2-merged
  - evoreign/vllm-Meta-Llama-3.1-8B-Instruct-indonesian-legal-finetune
### 12B
  - evoreign/vllm-gemma-3-12b-Instruct-indonesian-legal-finetune



## 越南文模型
  - https://huggingface.co/models?pipeline_tag=text-generation&sort=modified&search=Vietnamese
### 7B
  - phamff/vietnamese-legal-7b-v1
  - Key1111/mistral-7b-vietnamese-finetuned
  - bkai-foundation-models/vietnamese-llama2-7b-40GB
  - bkai-foundation-models/vietnamese-llama2-7b-120GB
  - hiepdaoquang704/vietnamese-VBD-llama2-finetune
  - hiepdaoquang704/finetune-vietnameseLLamma2
  - 1TuanPham/Instruct-vietnamese-llama2-7b-bkai
  - TheBloke/Llama-2-7B-vietnamese-20k-GGUF
  - AIPROENGINEER/Chatbot_VietNamese_Law
  - tensorblock/ngoan_Llama-2-7b-vietnamese-20k-GGUF
  - Key1111/vinallama-vietnamese-merged

### 8B
  - Key1111/qwen2.5-7b-vietnamese-enhanced
  - Key1111/qwen2.5-7b-vietnamese-merged
  - hieuducle/llama-3.1-8b-vietnamese-qa-merge-model
  - hieuducle/llama-3.1-8b-vietnamese-qa
  - dinhhung1508/llama3-8b-summary-vietnamese-article-gguf-v1


