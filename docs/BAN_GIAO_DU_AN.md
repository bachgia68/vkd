# Bàn giao dự án — TA Sâm Ngọc Linh (tasamngoclinh.com)

Tài liệu tổng hợp 1 nơi duy nhất — đọc file này trước khi hỏi Claude phiên
mới, tiết kiệm thời gian dò lại từ đầu.

## 1. Bức tranh tổng thể

| | |
|---|---|
| Site live | `https://tasamngoclinh.com` |
| Code | GitHub `github.com/bachgia68/vkd`, nhánh `main` |
| Hosting | Vercel, project `ta`, team `bachgia68-1157s-projects` |
| Database | Supabase, project `xcwirgrlnibnjmseglee` ("Vkd web Project") |
| Deploy | Tự động — push lên `main` là Vercel build + lên live sau ~30-60s |
| Stack | Vite + React (SPA, không SSR) + TypeScript + Tailwind |

**Cách deploy** (chỉ cần biết nếu tự sửa code, không cần cho việc quản trị
nội dung hàng ngày — mục 2 dưới đây không cần deploy):
```bash
npm run build          # bắt lỗi type/build trước
git add <file cụ thể>  # KHÔNG git add -A
git commit -m "..."
git push origin main   # Vercel tự bắt commit, build, lên live
```
Kiểm tra deploy xong chưa: vào `https://vercel.com/bachgia68-1157s-projects/ta`
xem deployment mới nhất trạng thái `Ready`.

## 2. Việc tự làm được — không cần deploy

| Việc | Ở đâu | Chi tiết |
|---|---|---|
| Ẩn/hiện/sửa giá 1 sản phẩm | Admin `/gate-vkd-control-2026/products` hoặc Supabase trực tiếp | Xem `docs/QUAN_TRI_SAN_PHAM_THU_CONG.md` |
| Sửa text trang chủ (tiêu đề, mô tả từng khối) | Admin `/gate-vkd-control-2026/homepage-text` | Chỉ sửa được bản tiếng Việt |
| Thêm nút CTA cho 1 khối trang chủ (Hero/About/Heritage/Products/Showrooms/Certifications/B2B) | Admin `/gate-vkd-control-2026/page-builder` | Điền "Tiêu đề/Nội dung/CTA Text/CTA URL", bấm Lưu |
| Quản lý combo/set quà tặng | Admin `/gate-vkd-control-2026/combos` | Tạo/sửa/ẩn/xoá combo, chọn SP thành phần |
| Quản lý bài blog + danh mục blog (kể cả bản dịch EN/ZH/FR) | Admin `/gate-vkd-control-2026/blog-admin` + `/blog-categories` | |
| Quản lý ảnh chứng nhận (cGMP/HACCP/ISO...) | Admin `/gate-vkd-control-2026/certifications-gallery` | |
| Xem đăng ký nhận cẩm nang (email/Zalo) | Admin `/gate-vkd-control-2026/leads` | |

Đăng nhập admin bằng tài khoản Supabase Auth đã tạo sẵn (role `admin` trong
`app_metadata`) — hiện có `bachgia68@gmail.com` và `mcmpro6688@gmail.com`.

## 3. Việc phải nhờ Claude/dev (cần sửa code + deploy)

- Thêm sản phẩm mới hẳn vào catalog (`src/data/products.ts`).
- Dịch nội dung sang ngôn ngữ mới hoặc dịch phần còn thiếu (xem mục 5).
- Sửa layout/giao diện, thêm tính năng mới.
- Đổi cấu trúc database (thêm cột, bảng mới) — cần migration qua Supabase MCP.

## 4. Kiến trúc dữ liệu cốt lõi (hiểu cái này tránh hỏi lại nhiều lần)

- **`src/data/products.ts`** — nguồn "catalog" tĩnh, KHÁCH HÀNG đọc trực
  tiếp từ đây (tên/mô tả/ảnh/giá gốc, ~151 SKU đang live + ~11 SKU ẩn sẵn).
  Sửa file này cần build + deploy.
- **Supabase bảng `products`** — lớp "override" runtime: `active`
  (ẩn/hiện), giá ghi đè, tồn kho, ảnh ghi đè. Sửa ở đây **không cần deploy**,
  hiện ngay trên site. Đây là bảng admin dùng ở trang "Sản phẩm & Kho".
- **`src/data/vkdProducts.ts` / `trimicoProducts.ts` / ...** — file "tham
  chiếu nội bộ" theo từng nhà cung cấp, KHÔNG phải nguồn site đọc — chỉ để
  đối chiếu khi cần biết SP nào của NCC nào. Đừng sửa nhầm file này tưởng sẽ
  lên site.
- **Supabase bảng `combo_sets`, `blog_categories`, `blog_posts`,
  `page_sections`, `certification_images`, `site_text_overrides`,
  `product_menu_items`** — nội dung admin quản lý qua các trang tương ứng
  ở mục 2, tương tự cơ chế override ở trên.
- **Branded House**: mọi thứ khách thấy đều là thương hiệu "TA" — tên nhà
  cung cấp gốc (VKD, Trimico, samk5...) không bao giờ được lộ ra UI khách
  hàng. Có script tự động chặn (`npm run check:brand`), chạy trước mỗi lần
  build — nếu build fail vì lỗi này, tìm đúng chỗ đang lộ tên NCC và sửa,
  đừng tắt check.

## 5. Trạng thái đa ngôn ngữ (tính đến 2026-09-07)

Site hỗ trợ hiển thị **vi / en / zh / fr / ar** (chọn ở góc phải header),
nhưng độ đầy đủ bản dịch khác nhau theo từng phần:

| Phần | vi | en | fr | zh | ar |
|---|---|---|---|---|---|
| Tên/mô tả/hoạt chất chính sản phẩm | ✅ | ✅ | ✅ | ✅ | ❌ |
| Badge sản phẩm (Quốc Bảo, OCOP...) | ✅ | ✅ | ✅ | ✅ | ❌ |
| Thành phần/hướng dẫn dùng/cảnh báo/dung tích | ✅ | ✅ | ✅ | ❌ | ❌ |
| Danh mục blog | ✅ | ✅ | ✅ | ✅ | ❌ |
| Menu sản phẩm (mega-menu + sidebar) | ✅ | ✅ | ✅ | ❌ (fallback EN) | ❌ |
| Text trang chủ (Nội Dung Trang Chủ, CTA Page Builder) | ✅ | ❌ (luôn hiện tiếng Việt) | ❌ | ❌ | ❌ |
| Micro-copy rải rác (nút "Đọc tiếp", "phút", nhãn UI nhỏ...) | ✅ | ⚠️ một phần | ⚠️ một phần | ❌ | ❌ |

`ar` (tiếng Ả Rập) gần như chưa được đầu tư dịch nội dung thật — chỉ có hạ
tầng kỹ thuật (RTL layout) sẵn sàng.

## 6. Việc lớn đã ghi nhận nhưng CHƯA làm (theo đúng quyết định hoãn)

- **`/en/`, `/fr/` URL riêng + hreflang chuẩn SEO** — hiện toàn site dùng 1
  URL cho mọi ngôn ngữ (chọn ngôn ngữ chỉ đổi state trình duyệt, không đổi
  URL/không có URL riêng cho Google index từng ngôn ngữ). `index.html` cố ý
  chưa khai hreflang cho en/fr/zh/ar (có comment giải thích rõ trong file)
  để tránh Google phạt duplicate-content khi làm nửa vời. Cần 1 phiên
  `/plan` riêng vì đụng vào kiến trúc router (`App.tsx` hiện tự chế bằng
  `pushState`, không dùng react-router thật cho routing nội bộ).
- **ChatWidget chỉ hỗ trợ vi/en** — chưa mở rộng zh/fr.
- **Messenger bot tự động đọc ref** — thiếu webhook + Meta App, chưa làm.
- **"Kênh phân phối" qua n8n công khai** — thiếu endpoint, chưa làm.
- **Page Builder generic** — hiện Page Builder chỉ chỉnh được title/content/
  ảnh/CTA cho các block ĐÃ CÓ SẴN trên trang chủ (Hero, About, Heritage,
  Products, Showrooms, Certifications, B2B), chưa phải kiến trúc "thêm block
  mới tự do" thật sự.

## 7. Nếu gặp bug, tra theo thứ tự này trước khi hỏi Claude

1. **Sản phẩm ẩn ở admin vẫn hiện trên site** → đọc
   `docs/QUAN_TRI_SAN_PHAM_THU_CONG.md` mục 3, tự tra Supabase trước.
2. **URL trang bị sai/mất khi bấm menu lọc danh mục** → đã có root cause +
   rule ghi trong code comment tại `navigate()` trong `src/App.tsx` — nếu
   lỗi tương tự tái diễn ở 1 trang khác, khả năng cao là chỗ đó cũng đang so
   sánh `currentPage === '...'` bằng strict equality mà không tách qua
   `.split('?')[0]` trước.
3. **Carousel (ảnh/chứng chỉ/video/sản phẩm) không vuốt được hoặc dot/nút
   next không phản ứng** → kiểm tra `src/components/ui/SwipeCarousel.tsx`
   có đang được nhúng ≥2 lần trên cùng 1 trang không — mỗi instance PHẢI có
   class CSS riêng (đã fix bằng `useId()`), nếu ai đó sau này refactor lại
   thành 1 class chung là bug tái phát y hệt 2026-09-07.
4. **Trang admin báo lỗi RLS ("row-level security policy")** khi thêm/sửa
   dữ liệu → kiểm tra CẢ HAI: (a) policy trên bảng dữ liệu, VÀ (b) nếu có
   upload ảnh, policy trên **Storage bucket** tương ứng (`storage.objects`)
   — 2 lớp policy riêng biệt, dễ sửa sót 1 trong 2 (đúng nguyên nhân lỗi
   RLS "thêm chứng nhận" 2026-09-07).

## 8. Liên hệ / quyền truy cập

- Supabase project: xin quyền truy cập `xcwirgrlnibnjmseglee` nếu chưa có.
- Vercel project: team `bachgia68-1157s-projects`, project `ta`.
- GitHub: `bachgia68/vkd`, nhánh `main` (không có branch protection, push
  thẳng — cẩn thận khi commit).
- Report kết quả công việc: Telegram bot `@tasamngoclinh_bot` (không dùng
  Zalo — Zalo OA chưa nối API).
