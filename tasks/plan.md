# Kế hoạch: Ảnh sản phẩm chuyên nghiệp + PM tool (2026-08-24)

## Tổng quan
Sau sự cố domain (24/8), 5 việc đã sửa xong trong phiên chính (badge/logo, giá
rượu, submenu mobile, backup, hướng dẫn deploy). Còn lại 3 việc cần giao cho
Qwen/Ox chạy độc lập ở phiên khác + 1 đề xuất PM tool cho phiên chính.

## Ràng buộc bắt buộc (đọc trước khi giao việc)
`docs/DESIGN_SYSTEM.md` mục "Nguồn ảnh" + skill `manage-site-images`: **chỉ
dùng ảnh thật, KHÔNG Unsplash/stock/AI-generate**. Yêu cầu "làm ảnh chuyên
nghiệp" của Joe phải hiểu là XỬ LÝ ảnh thật đã có (crop/nền/màu), không phải
tạo ảnh giả bằng AI. Nếu Qwen/Ox đề xuất dùng Midjourney/DALL-E/Stable
Diffusion để tạo ảnh sản phẩm — DỪNG, hỏi lại Joe trước, vì trái rule đã khoá.

## Task List

### Task A: Crawl 8 ảnh TN còn thiếu (ĐÃ CÓ SẴN, chưa chạy)
Đã có sẵn brief tại `scripts/qwen-tn-remaining-images.md` — giao thẳng cho
Qwen, không cần viết lại.

- **Input:** `scripts/qwen-tn-remaining-images.md` (URL nguồn + 8 SKU thiếu ảnh)
- **Lệnh:** Qwen đọc file trên, crawl `https://samngoclinhtruongnhan.vn/san-pham`,
  xuất `scripts/tn-remaining-images.json`
- **Outcome mong đợi:** file JSON có đủ 8 SKU (TN-002,003,004,006,007,008,009,012)
  với `image_url` dạng S3 trực tiếp (không phải `_next/image` proxy)
- **Bước sau (phiên chính chạy):** `node scripts/merge-tn-remaining-images.js`
  (Qwen cần viết script merge này nếu chưa có) → `npm run build` → `vercel deploy --prod`

### Task B: Script xử lý ảnh sản phẩm chuyên nghiệp (nền/crop/màu)
- **Input:** `scripts/generate_premium_product_bg.py` (đã có, làm điểm khởi đầu)
  + toàn bộ ảnh thật trong `public/assets/images/`
- **Lệnh giao Ox:** Rà soát ảnh sản phẩm hiện có, ảnh nào nền xấu/thiếu đồng
  bộ (không phải ảnh trắng nền chuẩn e-commerce), dùng
  `generate_premium_product_bg.py` làm nền trắng/xám chuẩn, xuất ảnh mới cùng
  tên + hậu tố `-premium`, KHÔNG ghi đè ảnh gốc
- **Outcome mong đợi:** danh sách file trước/sau (path cũ → path mới) để Joe
  duyệt từng ảnh trước khi thay vào `products.ts`/Supabase — không tự động
  thay thế hàng loạt
- **Điều kiện dừng:** nếu ảnh gốc chất lượng quá thấp (mờ, thiếu góc), liệt
  kê ra danh sách "cần Joe chụp lại" thay vì tự tạo ảnh thay thế bằng AI

### Task C: Ảnh blog thiếu/trùng (đã có rule sẵn, giao Ox rà soát định kỳ)
- **Input:** skill `make-blog-images` + query SQL đã có trong
  `manage-site-images` (blog_posts featured_image_url NULL/trùng)
- **Lệnh giao Ox:** chạy 2 query rà soát, liệt kê bài thiếu ảnh bìa hoặc <2
  ảnh/bài
- **Outcome mong đợi:** bảng SKU/slug bài viết thiếu ảnh, kèm đề xuất ảnh
  thật có sẵn trong `public/assets/images/` phù hợp (không tự tạo ảnh mới)

## Checkpoint
- [ ] Task A xong → build + deploy, verify 8 sản phẩm TN có ảnh trên
      `tasamngoclinh.com/product/tn-00X`
- [ ] Task B: Joe duyệt danh sách ảnh trước/sau trước khi áp dụng
- [ ] Task C: chỉ báo cáo, không tự sửa DB

## Rủi ro
| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Qwen/Ox tự dùng AI tạo ảnh giả (trái rule) | Cao | Nhắc rõ trong prompt giao việc, review trước khi merge |
| Crawl TN bị chặn/robots.txt | Trung bình | Nếu lỗi, báo lại thay vì bỏ qua âm thầm |
