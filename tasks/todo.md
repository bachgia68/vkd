# Todo — Ảnh sản phẩm + PM tool (2026-08-24)

## Phiên Qwen (giao ngay, độc lập)
- [ ] Task A: đọc `scripts/qwen-tn-remaining-images.md`, crawl 8 ảnh TN,
      xuất `scripts/tn-remaining-images.json`
- [ ] Task A2: viết `scripts/merge-tn-remaining-images.js` (merge JSON vào
      `src/data/products.ts` theo đúng SKU)

## Phiên Ox (giao ngay, độc lập, có thể chạy song song với Qwen)
- [ ] Task B: rà soát ảnh sản phẩm nền xấu, thử `generate_premium_product_bg.py`,
      xuất danh sách trước/sau (không ghi đè)
- [ ] Task C: rà soát ảnh blog thiếu/trùng bằng SQL, xuất danh sách

## Phiên chính (sau khi Qwen/Ox xong, cần Joe duyệt)
- [ ] Chạy `node scripts/merge-tn-remaining-images.js` → `npm run build` →
      `vercel deploy --prod`
- [ ] Duyệt danh sách ảnh Task B, áp dụng ảnh được chọn
- [ ] Duyệt danh sách Task C, gán ảnh thật có sẵn cho bài thiếu

## Checkpoint
- [ ] 12/12 sản phẩm TN có ảnh thật trên site
- [ ] Không có ảnh AI-generate/stock lọt vào `products.ts` hay Supabase
