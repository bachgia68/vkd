# Blog Category Infrastructure (KGC-style Ginseng 101 / Press Room) — Design

Ngày: 2026-08-09
Trạng thái: Quyết định tự động theo uỷ quyền của Joe, xem
`2026-08-09-loyalty-admin-config-design.md` §0 cho bối cảnh uỷ quyền chung.

## 0. Bối cảnh

Từ nghiên cứu crawl KGC (`docs/reports/2026-08-07-premium-positioning-brand-guidelines.md`
§7.7): KGC tách Learn thành 2 luồng — Ginseng 101 (giáo dục) và Press Room
(tin tức/PR). TA hiện có 3 bài thật, tất cả đều thuộc dạng giáo dục, chưa có
bài tin tức/PR nào. Joe chọn xây hạ tầng category ngay (không chờ có bài tin
tức) để khi có bài mới chỉ cần gán category, không cần sửa code thêm.

Tác giả: **không cần cột DB mới** — `BlogPostDetail.tsx` đã hard-code
"Đội Ngũ Nghiên Cứu TA" làm tên tác giả chung (quyết định có chủ đích từ
trước, không bịa tên bác sĩ/chuyên gia cụ thể). Giữ nguyên.

Phân trang: **không làm trong spec này** — chỉ 3 bài thật, phân trang chưa có
tác dụng, thêm vào giờ là xây cho tương lai chưa xảy ra (YAGNI). Ghi nhận làm
sau khi có ≥10 bài.

## 1. Schema

```sql
alter table public.blog_posts
  add column category text not null default 'ginseng101'
    check (category in ('ginseng101', 'press_room'));

update public.blog_posts set category = 'ginseng101'; -- 3 bài hiện có, tất cả giáo dục
```

Dùng `check` constraint thay vì bảng category riêng — chỉ 2 giá trị cố định
theo đúng 2 luồng Joe muốn, không cần bảng lookup cho 2 hằng số.

## 2. Frontend

### 2.1 `src/lib/siteContentApi.ts`
- `BlogPost` interface: thêm `category: 'ginseng101' | 'press_room'`.
- `fetchBlogPosts()`: thêm `category` vào `select`, thêm tham số tuỳ chọn
  `fetchBlogPosts(category?: 'ginseng101' | 'press_room')` để lọc — dùng
  `.eq('category', category)` nếu có truyền, không đổi hành vi khi không
  truyền (mặc định lấy tất cả, giữ nguyên các nơi gọi cũ không cần sửa).

### 2.2 `Blog.tsx` (trang danh sách)
- Thêm 2 tab lọc phía trên grid: "Kiến Thức" (ginseng101) / "Tin Tức" (press_room)
  — mặc định chọn tab có bài (thực tế bây giờ luôn là "Kiến Thức" vì Press
  Room đang trống).
- Nếu 1 tab không có bài nào: vẫn hiện tab (không ẩn), hiện trạng thái rỗng
  rõ ràng ("Chưa có bài viết nào ở mục này") thay vì tự ẩn tab — Joe cần thấy
  cấu trúc 2 luồng tồn tại ngay cả khi trống, để biết hạ tầng đã sẵn sàng chờ
  bài mới.
- Badge category nhỏ trên mỗi thẻ bài (góc trên ảnh, giống style badge sản
  phẩm `ProductCarousel.tsx` đã có — tái dùng class, không tạo style mới).

### 2.3 `BlogPostDetail.tsx`
- Hiện badge category cạnh ngày đăng trong hero banner (đã có sẵn vị trí
  meta row: tác giả · ngày · thời gian đọc — thêm category vào cùng hàng).

### 2.4 Admin CMS (`src/admin/pages/CmsPage.tsx`)
- Thêm dropdown chọn category (Kiến Thức / Tin Tức) trong form tạo bài mới
  và modal sửa bài đã có sẵn — mặc định "Kiến Thức" khớp giá trị DB default.
- `adminApi.ts`: `publishPost`/`updateBlogPost` — thêm tham số `category`
  vào payload insert/update.

## 3. Testing

- `npx tsc -b && npm run build && npm run check:brand`.
- Verify qua Supabase MCP: `select category, count(*) from blog_posts group
  by category` sau migration — kỳ vọng đúng 3 dòng `ginseng101`, 0 dòng
  `press_room`.
- Verify UI thật: trang Blog hiện 2 tab, tab Tin Tức hiện trạng thái rỗng,
  tab Kiến Thức hiện đủ 3 bài với badge đúng.

## 4. Non-goals

- Không thêm phân trang (xem §0).
- Không thêm cột tác giả riêng (giữ hard-code "Đội Ngũ Nghiên Cứu TA").
- Không tự viết bài Press Room mẫu để lấp đầy tab trống (không bịa nội dung).
