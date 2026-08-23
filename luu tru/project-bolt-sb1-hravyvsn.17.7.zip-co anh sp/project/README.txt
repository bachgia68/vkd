# VKD Products Database Package

## Contents

```
vkd-products-database.zip
├── products.json      # 43 products, structured JSON (ready for API/Supabase import)
├── products.csv        # Same data in CSV (Excel / Google Sheets / pgAdmin import)
├── products.sql        # PostgreSQL DDL + INSERT statements (run in Supabase SQL Editor)
├── README.txt          # This file
└── images/             # 43 product images downloaded from samngoclinhvkdgroup.com
    ├── 01-sam-ngoc-linh-thai-lat-ngam-mat-ong.png
    ├── 02-cao-sam-ngoc-linh-mat-ong.png
    └── ... (43 files total)
```

## Product Count by Category

| Category ID | Label | Count |
|---|---|---|
| ginseng | Sâm Củ Tươi & Sâm Khô | 1 |
| supplements | Thực Phẩm Bảo Vệ Sức Khỏe | 9 |
| tea_wine | Trà & Đồ Uống Sâm | 18 |
| cosmetics | Mỹ Phẩm & Làm Đẹp | 15 |
| **Total** | | **43** |

## Import Instructions

### Option A: Supabase SQL Editor (recommended)

1. Go to Supabase Dashboard → SQL Editor
2. Open a new query tab
3. Copy entire contents of `products.sql` and paste
4. Click Run — creates tables + inserts all 43 products

### Option B: Import JSON via API

```javascript
import { createClient } from '@supabase/supabase-js';
import products from './products.json';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const { error } = await supabase
  .from('vkd_products')
  .upsert(products.map(({ id, ...p }) => p), { onConflict: 'sku' });
```

### Option C: Import CSV via pgAdmin

1. Open pgAdmin → Tools → Import
2. Select products.csv
3. Target table: vkd_products (create first using products.sql DDL section)

## Image Storage

Images are in the `images/` folder, named: `{id}-{slug}.{ext}`

To upload to Supabase Storage:
```javascript
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

for (const product of products) {
  const file = fs.readFileSync('./images/' + product.image_local.replace('images/', ''));
  await supabase.storage
    .from('product-images')
    .upload(product.image_local, file, { contentType: 'image/png' });
}
```

## Data Fields

| Field | Type | Description |
|---|---|---|
| id | int | Sequential ID (1-43) |
| sku | text | Unique SKU (VKD-001 to VKD-043) |
| slug | text | URL-safe slug |
| name | text | Product name (Vietnamese) |
| name_ascii | text | ASCII-only name (no diacritics) |
| price_vnd | int | Price in VND (null = "Liên hệ") |
| price_usd | numeric | Approximate USD price (rate: 25,500 VND/USD) |
| currency | text | Always "VND" |
| category_id | text | ginseng / supplements / tea_wine / cosmetics |
| active_ingredient | text | Key active ingredient (e.g., MR2) |
| badge | text | Badge label (null if none) |
| image_url | text | Original remote image URL |
| image_local | text | Local image path in zip |
| detail_url | text | Official product page URL |
| source | text | samngoclinhvkdgroup.com |
| scraped_at | date | 2026-07-17 |

---
Generated: 2026-07-17
Source: https://samngoclinhvkdgroup.com/san-pham/
