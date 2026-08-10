# TA Website — Chuẩn Thiết Kế & Nội Dung (bắt buộc, không tự ý lệch)

Tài liệu này là **nguồn chuẩn duy nhất**. Mọi phiên làm việc (Claude hay người)
thêm tính năng/nội dung mới trên site này phải theo đúng các quy tắc dưới đây
— không tạo pattern riêng, không "tiện tay" style khác đi. Lệch chuẩn là lý do
site này từng bị chê "lộn xộn" dù đổi bao nhiêu repo cũng vậy.

## 1. Token thiết kế (đã khoá trong `tailwind.config.js` — không thêm màu/font mới)

- **Màu**: `forest` (xanh rừng đậm, nền/chữ chính, `forest-900` = `#0B2F1D`),
  `gold` (điểm nhấn, `gold-400` = `#D4AF37`), `cream` (nền sáng), `earth` (phụ).
  Không dùng màu hex rời ngoài palette này trong component mới.
- **Font**: `font-display` = Playfair Display (tiêu đề), mặc định (`font-sans`)
  = Inter (nội dung). Không thêm font thứ 3.
- **Bo góc/đổ bóng**: card dùng `rounded-xl`/`rounded-2xl` + `shadow-elegant`
  (nhẹ) hoặc `shadow-elegant-lg` (nổi bật) — không tự chế shadow mới.
- **Layout**: `container-wide` cho chiều rộng trang, `section-padding` cho
  khoảng cách giữa các section trên trang chủ.

## 2. Nội dung admin-quản-lý được (ảnh, testimonial, combo, bài viết...)

Mọi loại nội dung mà admin cần bật/tắt/xoá/thêm phải theo đúng 1 pattern —
xem `trust_proof_items` / `heritage_gallery_images` / `combo_sets` làm mẫu:

1. **Bảng Supabase**: có cột `visible` hoặc `published` (boolean), `sort_order`
   (int), `created_at`/`updated_at`. RLS bắt buộc 2 policy: admin full access
   (`is_admin()`), public read chỉ khi `visible/published = true`.
2. **Ảnh riêng cho loại nội dung đó**: bucket Storage tên `<ten-loai>-images`
   (vd. `heritage-images`, `trust-proof-images`), public=true, 3 policy admin
   insert/update/delete gated bởi `is_admin()`.
3. **`src/admin/adminApi.ts`**: 5 hàm đặt tên đúng khuôn —
   `fetchAll<Ten>()`, `create<Ten>()`, `update<Ten>()`, `delete<Ten>()`,
   `upload<Ten>Image()`. Không đặt tên khác đi.
4. **`src/lib/siteContentApi.ts`**: 1 hàm public-read `fetch<Ten>()` chỉ lấy
   `visible/published = true`, dùng ở trang khách hàng.
5. **Trang admin riêng** (`src/admin/pages/<Ten>Page.tsx`): copy layout của
   `HeritageGalleryPage.tsx` hoặc `TrustProofPage.tsx` (form thêm mới ở trên,
   list ảnh/thẻ có nút ẩn-hiện + xoá ở dưới, toast báo kết quả).
6. Đăng ký route trong `AdminApp.tsx` + 1 dòng trong `NAV` của
   `AdminLayout.tsx`.

## 3. Section trên trang khách hàng — bắt buộc qua `site_sections`

Không được thêm section mới vào `App.tsx` mà hiện luôn (hardcode). Mọi
section (kể cả section đã "chắc chắn xong") phải:
1. Có 1 dòng trong bảng `site_sections` (`key`, `label_vi`, `nav_group`,
   `path`, `visible`, `sort_order`).
2. Được gate trong `App.tsx` bằng `visibleSections.has('<key>')`.

Nhờ vậy trang **Quản lý Trang** trong admin luôn là nơi duy nhất bật/tắt
được mọi mục trên site — không có mục nào "vô hình" với admin.

## 4. Bài viết Blog — chuẩn cấu trúc bắt buộc trước khi Đăng công khai

`BlogPostDetail.tsx` có sẵn parser markdown (H2/H3, bullet, bảng, blockquote,
mục lục tự động) — bài viết PHẢI theo cú pháp này, không viết văn xuôi liền
mạch không heading:

- Ít nhất **2 heading `## `** để mục lục (TOC) tự hiện ra.
- `featured_image_url` **bắt buộc có** trước khi bấm "Đăng công khai" trong
  CMS — không xuất bản bài thiếu ảnh bìa.
- `featured_image_alt` mô tả đúng nội dung ảnh (SEO + accessibility).

## 5. Deploy — xem skill `deploy-vkd-site`

Build → xem thử trên `npm run dev` → `git add` từng file cụ thể (không
`git add -A`) → commit rõ lý do → chỉ `push` khi được yêu cầu rõ ràng.
Vercel project `ta` tự deploy khi có commit mới trên `main`.

## 6. Trước khi thêm bất cứ thứ gì mới

Đọc mục 1–5 ở trên trước. Nếu loại nội dung/section mới không khớp pattern
nào ở đây, hỏi lại thay vì tự sáng tạo cách làm riêng — mỗi cách làm riêng là
một chỗ sẽ "lệch chuẩn" lần sau.
