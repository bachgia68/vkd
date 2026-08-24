# Qwen Tasks — TN Images + K5 Crawl

## Task 1: Crawl TN Product Images
**URL:** https://samngoclinhtruongnhan.vn/san-pham

**Instructions:**
1. Visit URL and find products TN-001 to TN-012
2. For each product, get matching name and image URL
3. Return JSON format:
```json
{
  "sku": "TN-001",
  "image_url": "https://..."
}
```
4. Save output to `scripts/tn-images.json`

**Current TN Products (need images):**
- TN-001: Sâm Nguyên Bản Hàn Quốc
- TN-002: Sâm Nguyên Bản Mỹ
- TN-003: Cao Sâm Hàn Quốc
- TN-004: Cao Sâm Mỹ
- TN-005: Sâm Xấy Khô Hàn Quốc
- TN-006: Sâm Xấy Khô Mỹ
- TN-007: Trà Sâm Hàn Quốc
- TN-008: Trà Sâm Mỹ
- TN-009: Viên Sâm Hàn Quốc
- TN-010: Viên Sâm Mỹ
- TN-011: Bộ Quà Tặng Sâm Hàn Quốc
- TN-012: Bộ Quà Tặng Sâm Mỹ

---

## Task 2: Crawl K5 New Products
**URL:** https://samkontumk5.com/vi/san-pham

**Instructions:**
1. Visit URL and extract all products
2. **SKIP** products already in SK5-* series:
   - SK5-001 to SK5-006 are DRINKS (tra-nuoc-uong-sam) — already imported
3. For NEW products, return JSON:
```json
{
  "sku": "SK5-NNN",  // Continue from SK5-007
  "name": "Product name",
  "price": 500000,
  "image_url": "https://...",
  "category": "sam-ngoc-linh",
  "description": "Short desc"
}
```
4. Save output to `scripts/k5-new-products.json`

**Rules:**
- Assign SKU as SK5-007, SK5-008, etc. (continue sequence)
- Use category "sam-ngoc-linh" for all
- Skip drinks/beverages already done

---

## After Qwen outputs these files:
```bash
# Merge TN images into src/data/products.ts (TN-001 to TN-012)
# Merge K5 new products into src/data/products.ts (SK5-007+)
npm run build
vercel deploy --prod
```
