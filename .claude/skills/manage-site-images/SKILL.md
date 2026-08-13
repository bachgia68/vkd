---
name: manage-site-images
description: Use whenever Joe asks to fix/thay/sửa/rà soát ảnh trên site (ảnh thiếu, ảnh trùng, ảnh xấu, khối trang trí không có ảnh thật), hoặc khi cần chuẩn bị ảnh để đăng fanpage/mạng xã hội. Quy trình chuẩn lặp lại — không tự nghĩ cách mới mỗi lần.
---

# Sửa ảnh site TA — quy trình chuẩn (đúc kết 2026-08-10)

Đây là quy trình đã dùng thật để sửa gallery Vườn Sâm Nguyên Sinh, vá ảnh
blog thiếu/trùng, và thay khối trang trí vô nghĩa bằng ảnh thật (khối MR2
trong Heritage). Dùng lại đúng quy trình này, không bịa cách mới.

## 1. Rà soát — tìm lỗi thật bằng dữ liệu, không đoán

Luôn kiểm tra qua Supabase (`execute_sql`, project `xcwirgrlnibnjmseglee`)
trước khi kết luận "ảnh có vấn đề":

```sql
-- Ảnh bìa blog bị thiếu
select id, title, featured_image_url from blog_posts where published=true and featured_image_url is null;

-- Ảnh bìa blog bị trùng (nhiều bài dùng chung 1 ảnh)
select featured_image_url, count(*), array_agg(title)
from blog_posts where published=true group by featured_image_url having count(*) > 1;

-- Ảnh gallery đang ẩn/hiện thế nào
select id, alt_vi, visible, sort_order from heritage_gallery_images order by sort_order;
```

Với khối trang trí trên trang khách hàng (không phải ảnh CMS quản lý): grep
component đó tìm `gradient-to-br`, `blur-[`, hoặc bất kỳ khối màu phẳng nào
đang đứng một mình không có ảnh — đây là dấu hiệu "khối rỗng cần ảnh thật"
(xem quy tắc "CẤM gradient trang trí" trong `docs/DESIGN_SYSTEM.md` mục 1).

## 2. Nguồn ảnh — CHỈ dùng ảnh thật, không bịa

- Kho ảnh thật sẵn có: `public/assets/images/` — trước khi tải ảnh mới, LUÔN
  xem hết thư mục này trước, rất nhiều ảnh Joe đã cung cấp còn chưa được
  dùng ở đâu (đặt tên `heritage-*`, `cusam*`, `vuon sam*`, `nature-forest*`...).
- Không bao giờ dùng ảnh Unsplash/stock/AI-generate làm ảnh "thật" của vườn
  sâm/sản phẩm TA — 2 bài blog cũ từng dùng ảnh Unsplash tạm, đã bị flag là
  vấn đề cần thay khi có ảnh thật.
- Nếu không có ảnh thật phù hợp trong kho: hỏi Joe upload ảnh mới, không tự
  tạo ảnh giả trông giống thật.

## 3. Gán ảnh — theo đúng pattern admin-quản-lý-được

Với nội dung có bảng riêng (heritage_gallery_images, trust_proof_items,
combo_sets, blog_posts): update qua `adminApi.ts` hoặc SQL trực tiếp
(`execute_sql`), gán `alt_vi`/`featured_image_alt` mô tả đúng nội dung ảnh.

Với khối trang trí cứng trong component (như Heritage MR2 trước đây):
```tsx
<img src="/assets/images/<ten-file>.jpg" alt="" aria-hidden="true"
     className="absolute inset-0 w-full h-full object-cover" />
<div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 to-forest-950/50" />
```
— ảnh thật làm nền + 1 lớp gradient MỘT CHIỀU chỉ để chữ đọc được (không
phải gradient trang trí 2 chiều bị cấm).

## 4. Chuẩn bị ảnh để đăng fanpage/mạng xã hội

Khi Joe cần ảnh để đăng Facebook/TikTok/Zalo OA (qua pipeline n8n hoặc đăng
tay), lấy đúng ảnh thật đã dùng trên site (không tạo ảnh riêng cho mạng xã
hội) trừ khi kích thước không phù hợp:
- Facebook feed/link preview: tỷ lệ ngang ~1.91:1 (1200×630) hoặc vuông 1:1.
- TikTok/Story: dọc 9:16.
- Nếu cần crop/resize, dùng script Python theo mẫu
  `scripts/generate_premium_product_bg.py` (đã có sẵn kỹ thuật xử lý nền/crop
  cho ảnh sản phẩm) làm điểm khởi đầu thay vì viết lại từ đầu.
- Không thêm watermark/logo TA đè lên trừ khi Joe yêu cầu rõ (đã có tiền lệ
  ở 12/90 ảnh sản phẩm carousel, xem git log "add TA logo watermark").

## 5. Sau khi sửa — verify + deploy

Theo đúng skill `deploy-vkd-site`: build → xem `npm run dev` → commit file cụ
thể → chỉ push khi được yêu cầu rõ. Nếu chỉ sửa dữ liệu Supabase (không sửa
code), không cần build/deploy — thay đổi hiện ngay trên site vì trang đọc dữ
liệu trực tiếp từ DB.

## 6. Kênh báo kết quả nếu Zalo không kết nối được

Zalo OA/số `0984999309` hiện chưa có kết nối API tự động (xem
[[project_n8n_vkd_pipeline_status]] — Zalo OA chưa verify, chưa mở khoá đăng
bài tự động). Nếu cần báo kết quả (đăng ảnh xong, sửa xong, lỗi gì) mà không
gửi được qua Zalo, báo qua **Telegram** thay thế — đây là kênh fallback
Joe đã chọn, không cần hỏi lại mỗi lần.
