# Qwen Task — Crawl Remaining TN Product Images

## URL
https://samngoclinhtruongnhan.vn/san-pham

## Products to Find (8 remaining)
```
TN-002: Sâm Ngọc Linh Khô
TN-003: Sâm Ngọc Linh Xấy
TN-004: Cao Sâm Ngọc Linh
TN-006: Sâm Ngọc Linh Ngâm Rượu
TN-007: Sâm Ngọc Linh Mật Ong
TN-008: Gây Sâm Ngọc Linh
TN-009: Sâm Ngọc Linh Hạt
TN-012: Sâm Ngọc Linh Bột
```

## Instructions
1. Visit https://samngoclinhtruongnhan.vn/san-pham
2. For each product above, find the matching product by name (or similar name)
3. Extract the direct image URL (not the _next/image proxy URL)
4. Output JSON format:
```json
{
  "sku": "TN-002",
  "name": "Sâm Ngọc Linh Khô",
  "image_url": "https://s3.samngoclinhtruongnhan.com/images/products/..."
}
```

## Output File
Save to: `scripts/tn-remaining-images.json`

## Note
- If exact product name not found, search for similar (e.g., "Khô" instead of full name)
- Use the S3 direct URL format from previous batch (samngoclinhtruongnhan.com/images/products/...)
- Skip if image truly not available on their site

---

## After Qwen completes:
Run script to merge into src/data/products.ts:
```bash
node scripts/merge-tn-remaining-images.js
npm run build
vercel deploy --prod
```
