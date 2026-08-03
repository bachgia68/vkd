# Tóm Tắt Phiên Làm Việc — 2026-08-03

## 1. Hợp nhất Catalog Sản Phẩm (VKD + TRIMICO → TA)
- Gộp 2 nguồn dữ liệu (43+50 SKU) thành `src/data/products.ts` (84 sản phẩm thật).
- Taxonomy mới "Dạng Sản Phẩm" — 7 mục thay 2 hệ phân loại cũ không khớp nhau.
- Gộp `VKDProductCatalog`/`TrimicoProductCatalog` → `ProductCatalog.tsx`, gộp 2 trang chi tiết → `ProductDetail.tsx`. Xoá 5 component cũ không dùng nữa.
- Header có mega-menu 7 mục + "Set Quà Tặng" tách riêng.
- Ô tìm kiếm có gợi ý "Đang Thịnh Hành"/"Sản Phẩm Phổ Biến".
- Thực hiện qua quy trình brainstorm → spec → plan → subagent-driven development (10 task, mỗi task có review riêng, review tổng cuối). Tìm và sửa nhiều lỗi thật trong quá trình review: rò rỉ tên NCC trong `products.ts`/`Certifications.tsx`, thiếu cờ `displayOnly18Plus` (SP rượu bị lộ nút mua trái phép), SKU nội bộ (`VKD-001`) hiện thẳng ra trang chi tiết khách hàng, chip tìm kiếm không ra kết quả.
- Đã **merge vào `main`** (local, chưa push lên `origin`).

## 2. Automation chặn rò rỉ tên NCC
- `scripts/check-no-supplier-names.js` — quét `src/components`, `src/pages`, `src/data/products.ts`, `index.html`, chạy tự động trước mỗi `npm run build` (qua `prebuild`).
- Lưu quy tắc vào skill dự án `.claude/skills/brand-ta-guard/SKILL.md`.

## 3. Nội dung thương hiệu mới (Founder Story)
- Slogan đổi: "Bảo Tồn Nguyên Bản – Tuyển Chọn Tinh Hoa" (bỏ hẳn "sàn giao dịch") — áp dụng Hero, `<title>`, toàn bộ meta SEO/structured data trong `index.html`.
- Hero: 2 CTA mới — "Xem Sản Phẩm Tuyển Chọn" (→ catalog) và "Đặt Lịch Thăm Vườn" (→ Zalo).
- Stats trang chủ: "3 Vùng Trồng" → "1.800m+ / Đỉnh Cao Nhất – Hội Tụ Linh Khí Ngọc Linh".
- About.tsx rút gọn còn 2 trụ cột (củ tươi nguyên bản / sản phẩm chế biến sâu tuyển chọn), chỉ còn 1 vùng (Trà Linh, Nam Trà My), thêm nút "Đọc Toàn Bộ Câu Chuyện".
- Trang mới `/about-story` (`FounderStory.tsx`) — toàn bộ câu chuyện founder Khánh, tuyên ngôn "Trồng một cây sâm mất 6-10 năm..." (đã sửa từ 5-7 năm).
- Research Hub: thêm ảnh thật cho 3 bài hướng dẫn (trước đây không có ảnh).
- Footer: địa chỉ đổi thành toạ độ vườn (15°12'N 108°18'E, Trà Linh, Nam Trà My, Quảng Nam), email đổi thành khanh@tasamngoclinh.com + duyenmoc08@gmail.com.
- Xoá `NewsFeed.tsx` + mảng `newsArticles` (code chết, không render ở đâu — chứa 5 bài tin thật về VKD Group, không đổi tên "VKD"→"TA" vì sẽ tạo lịch sử giả cho TA).
- Sửa hotline cũ "0235 3.555.999" (sản phẩm Set Quà rượu) → "0984 999 309".
- Sửa bug dropdown menu "Sản phẩm" tự đóng khi rê chuột xuống (khoảng hở `margin-top` giữa nút và menu không nằm trong vùng hover — đổi sang `padding-top`).
- Sửa lỗi thẻ vùng trồng đè lên chữ slogan trong ảnh About (đổi vị trí từ góc dưới-trái sang góc trên-phải).

## 4. Tính năng mới: Khách tự tạo Set Quà Tặng
- Trên trang Catalog: khách chọn nhiều sản phẩm (checkbox góc ảnh) → thanh nổi hiện số lượng + tổng giá → "Đóng Thành Set Quà Tặng" → thêm vào giỏ hàng như 1 sản phẩm duy nhất, tăng/giảm số lượng cả set bình thường qua giỏ hàng có sẵn.
- Chưa làm: **Admin tự tạo set quà cố định** (cần bảng dữ liệu Supabase + trang quản trị riêng) — để phiên sau theo yêu cầu.

## 5. Trạng thái chưa xong / cần anh xử lý
- **Ảnh vườn ươm Trà Linh** anh gửi trong chat: tôi không lấy được file thật từ chat — cần anh lưu file vào `public/assets/images/vuon-giong-tra-linh.jpg`, trang `/about-story` đã trỏ sẵn đường dẫn này.
- **Netlify** báo hết credit vận hành, deploy production bị tạm dừng → cần chuyển sang Vercel (xem hướng dẫn riêng bên dưới/trong chat).
- Admin tạo set quà cố định — chưa làm, cần phiên riêng.

## 6. Ghi chú kỹ thuật
- `vkdProducts.ts`/`trimicoProducts.ts` giữ nguyên làm dữ liệu tham chiếu backend, không xoá.
- Supabase project thật đang dùng: `xcwirgrlnibnjmseglee` ("Vkd web Project") — bảng `social_links`, `contact_phones`, `site_addresses` đã có Zalo/WhatsApp đúng số `0984999309` từ trước.
