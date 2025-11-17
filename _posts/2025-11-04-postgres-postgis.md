---
layout: post
title: PostgreSQL & PostGIS
date: 2025-11-04
reading_time: 10 min read
tags: [PostgreSQL,PostGIS]
excerpt: 
---


PostgreSQL 是一個功能強大的物件關聯式資料庫系統，PostGIS 則是為 PostgreSQL 擴充地理空間資料處理能力的套件。安裝 PostGIS 需先有 PostgreSQL，接著在目標資料庫中執行 SQL 指令 CREATE EXTENSION postgis; 即可啟用 PostGIS 的空間功能。

### 搭建流程
 1. 安裝 PostgreSQL。
 2. 建立資料庫並連線。
 3. 執行 CREATE EXTENSION postgis; 來裝載 PostGIS。

PostGIS 使得 PostgreSQL 可以儲存地理空間資料型態，並提供空間索引與多種空間運算函數（如交集、合併等）。

### 介面與串接方式
  - 透過 PostgreSQL 的指令列工具 psql 或圖形化管理工具如 pgAdmin 與 TablePlus 進行資料庫操作與管理。
  - 桌面 GIS 軟體，如 QGIS，可直接連線 PostGIS，視覺化編輯與分析空間資料。
  - 網頁應用可在後端使用語言如 Python、Node.js 撰寫連接 PostgreSQL 的程式，查詢 PostGIS 空間資料後轉成 GeoJSON 等格式，由前端以地圖套件 Leaflet 或 OpenLayers 顯示。

PostGIS 允許在 PostgreSQL 資料庫中做空間資料處理和分析，並可用多種方式串接和應用，從指令列、圖形工具到各類程式語言後端及地理資訊系統工具都支援。


### 常見的 PostGIS 空間資料類型與範例查詢

PostGIS 常見的空間資料類型包括：
  - POINT：表示單一空間點，如 "POINT(116.4074 39.9042)" 表示北京的一個點。
  - LINESTRING：表示線型，如道路或河流。
  - POLYGON：表示多邊形，如行政區域範圍。
  - MULTIPOINT、MULTILINESTRING、MULTIPOLYGON：分別是多個點、線或多邊形的集合。
  - GEOMETRYCOLLECTION：混合多種空間資料類型的集合。

常用範例查詢語法：
  - 計算多邊形面積：
```
SELECT ST_Area(geom) FROM table_name WHERE id = 1;
```
  - 查找距離指定點一定範圍內的點：
```
SELECT * FROM animal_locations
WHERE ST_DWithin(geom, ST_GeomFromText('POINT(120.9 22.5)', 4326), 1000);
```
  - 空間交集查詢（找出位於特定多邊形內的線條）：
```
SELECT r.*
FROM roads r, municipalities m
WHERE ST_Contains(m.geom, r.geom) AND m.name = 'CityName';
```

PostGIS 使用 SRID（空間參考系統ID）來指定座標系，並支援多種空間函數進行分析與篩選，像是 ST_Distance, ST_Intersects, ST_Contains 等，大幅提升空間資料操作的靈活度與效率
