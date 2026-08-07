# Handoff — TA Sâm Ngọc Linh Website

Ngày: 2026-08-07. Phiên trước dừng ở đây — đọc file này trước khi làm gì tiếp.

## 1. Trạng thái hiện tại

Repo: `bachgia68/vkd`, nhánh `main`, mọi commit trong phiên trước **đã push**
lên `origin/main` (không có commit local nào bị treo). `git status --short`
sạch (chỉ `.claude/worktrees/` untracked, không liên quan).

Site live: `tasamngoclinh.com` (Vercel, auto-deploy từ `main`). Vì mọi commit
đã push, site live nên đã có bản mới nhất — kiểm tra lại khi bắt đầu phiên
mới để chắc chắn Vercel build không lỗi (xem `deploy-vkd-site` skill).

**Đã hoàn thành trong phiên trước (theo thứ tự):**
1. Phase 1 homepage conversion redesign — xem
   `docs/superpowers/plans/2026-08-06-homepage-conversion-redesign-phase1.md`
   (12/12 task xong): Hero dual-CTA, Products 3-cột premium, TA Elite Club
   teaser, Trust & Proof (admin-gated), thứ tự trang chủ mới, Combo/Gift Sets
   đầy đủ (DB + admin builder + hiển thị customer).
2. Fix bug thật: nút Back trình duyệt từng thoát hẳn site — đã sync với
   History API.
3. Nghiên cứu sâu jungkwanjang.us (6 trang, đo màu DOM thật) —
   `docs/reports/2026-08-07-premium-positioning-brand-guidelines.md`.
4. Sub-project A (IA/navigation restructure) — xem
   `docs/superpowers/specs/2026-08-07-site-ia-restructure-design.md` +
   `docs/superpowers/plans/2026-08-07-site-ia-restructure.md` (8/8 task xong):
   - Mega-menu "Sản phẩm" 3 cột: Loại sản phẩm / **Đặc Sản Việt Nam** (mới,
     xem §3 bên dưới) / Theo mục tiêu sức khỏe.
   - Bảng `site_sections` (Supabase) — bật/tắt 4 trang mồ côi (Về TA, Blog,
     Kênh Phân Phối, Showroom) từ trang admin **"Quản lý Trang"**
     (`/gate-vkd-control-2026/site-sections`). Mặc định TẤT CẢ đang **ẨN**.
5. Bug thật phát hiện khi Joe tự test: combo tạo với giá `0` từng lên live
   miễn phí — đã fix (validation + DB constraint `price_vnd > 0`).
   Combo "combo1" giá 1.234đ Joe tự tạo lúc test — **đã xoá**, `combo_sets`
   hiện đang trống (0 row).
6. Combo giờ bắt buộc có mô tả (auto-fill "Gồm: <tên SP>" nếu để trống) —
   khớp yêu cầu "combo cần có mô tả như sản phẩm khác".
7. Fix dead link: 4 card danh mục trên trang chủ ("Nước Tăng Lực" v.v.)
   từng không bấm được (`cursor-pointer` nhưng không có `onClick`) — đã nối
   vào catalog filter thật.
8. Fix dead link: Footer "Quick Links" (`href="#about"` không có onClick) —
   đã nối vào điều hướng thật.

## 2. Việc CHƯA làm (đã brainstorm nhưng chưa code) — Sub-project B/C/D

Xem `docs/superpowers/specs/2026-08-07-site-ia-restructure-design.md`,
mục "Sub-project B/C/D" — mỗi cái cần 1 spec/plan riêng trước khi code:

- **Sub-project B — Trang pháp lý thật**: TA chưa có `/policies/*` (Privacy,
  Terms, Shipping, Refund) — hiện Footer chỉ có text tĩnh không link (đã
  sửa từ `href="#"` giả sang text tĩnh, KHÔNG phải trang thật). JKJ có đầy
  đủ. Ưu tiên cao vì PayOS đang thanh toán thật mà chưa có chính sách nào.
- **Sub-project C — Combo auto-fill nâng cao** (Joe yêu cầu, CHƯA làm):
  - Giá combo tự động = tổng giá các sản phẩm thành phần lấy từ hệ thống
    (hiện tại admin tự gõ tay giá combo — Task này làm nó tự tính tổng, admin
    có thể sửa lại nếu muốn giảm giá combo so với mua lẻ).
  - Ảnh đại diện combo tự lấy ảnh sản phẩm đầu tiên trong combo nếu admin
    chưa upload ảnh poster riêng (hiện đang fallback về logo TA — cần đổi
    sang lấy `products.find(sku).image`).
  - Mô tả ngắn từng sản phẩm trong combo lấy từ hệ thống (câu hỏi mở: hiển
    thị full mô tả từng SP hay chỉ tên? cần hỏi Joe khi làm task này).
- **Sub-project D — Products section động/hấp dẫn hơn kiểu KGC**: Joe chê
  "phần sản phẩm chạy từ từ không hấp dẫn". Hiện tại chỉ có hover-reveal.
  Cần xem code `src/components/Products.tsx` + tham khảo lại
  `docs/reports/2026-08-07-premium-positioning-brand-guidelines.md` trước
  khi đề xuất animation cụ thể.

## 3. Việc MỚI Joe vừa giao cuối phiên — CHƯA làm gì cả, chỉ ghi lại

### 3a. Thêm sản phẩm mới từ samk5.vn

Joe muốn lấy sản phẩm tại
`https://samk5.vn/san-pham/to-yen-sam-ngoc-linh-100ml-5-huhop` ("Tổ Yến Sâm
Ngọc Linh 100ml x5 hũ") thêm vào catalog. **QUAN TRỌNG: `samk5.vn` KHÔNG
phải site chính thức của VKD** (`samngoclinhvkdgroup.com`) — skill
`update-vkd-products` hiện tại CHỈ viết vào `src/data/vkdProducts.ts` và
giả định nguồn là site VKD gốc. `samk5.vn` là nguồn MỚI, nhiều khả năng là
NCC khác (giống việc TRIMICO từng được thêm) — nghĩa là:

1. **Trước khi thêm**, xác nhận với Joe: `samk5.vn` là ai (VKD tự bán qua
   kênh này, hay 1 NCC/đối tác khác)? Nếu là NCC khác → áp dụng ĐÚNG quy
   tắc Branded House (`brand-ta-guard` skill) — không được lộ tên
   "samk5"/tên công ty đứng sau site đó ở bất kỳ đâu khách nhìn thấy.
2. `src/data/products.ts` (file catalog thật app đang đọc) được sinh tự
   động từ `vkdProducts.ts` + `trimicoProducts.ts` qua
   `scripts/migrate-to-unified-products.mjs` — KHÔNG sửa tay
   `products.ts` cho SKU mới trừ khi script đã chạy lại. Nếu `samk5.vn` là
   NCC thứ 3, cân nhắc có cần 1 file `<tenNCC>Products.ts` + hàm
   `toCartProduct` riêng (đúng pattern `trimicoProducts.ts` đã có) rồi thêm
   vào script migrate.
3. **Lệnh chuẩn để lấy dữ liệu** (áp dụng đúng quy trình `update-vkd-products`
   skill, chỉ đổi nguồn):
   ```
   WebFetch https://samk5.vn/san-pham/to-yen-sam-ngoc-linh-100ml-5-huhop
   để lấy NGUYÊN VĂN: tên, giá, thành phần, mô tả, hướng dẫn dùng, cảnh báo,
   xuất xứ, ảnh sản phẩm thật (không dùng ảnh stock). Không tự bịa
   rating/reviews (set 0). Xác nhận với Joe đây là NCC nào trước khi quyết
   định ghi vào file NCC có sẵn hay tạo file NCC mới. Tải ảnh thật về
   public/products/. Set category — "Tổ Yến Sâm Ngọc Linh" là sản phẩm kết
   hợp tổ yến (không phải sâm thuần) nên rất có thể nên xếp vào
   productType nam-lim-duoc-lieu (group: 'dac-san') thay vì các nhóm sâm
   thuần — đây chính là mục đầu tiên thật sự kiểm chứng thiết kế nhóm
   "dac-san" vừa xây ở Sub-project A. Sau khi sửa xong: npm run check:brand
   && npx tsc -b && npm run build, kiểm tra trên Browser pane, rồi mới
   commit + push.
   ```
4. Đừng vội thêm ngay — hỏi lại Joe câu hỏi (1) trước, vì trả lời sai ảnh
   hưởng tới việc có phải ẩn tên nguồn hay không.

### 3b. Câu hỏi Joe hỏi cuối phiên (đã trả lời trong chat, ghi lại để nhớ)

- **Blog ẩn thì bài viết đăng ở đâu?** → CMS (`/gate-vkd-control-2026/cms`)
  vẫn tạo bài vào `blog_posts` + đăng social bình thường, không phụ thuộc
  Blog ẩn/hiện. Nhưng caption đang trỏ `tasamngoclinh.com/bai-viet` — link
  chết khi Blog tắt. **Cần bật Blog trong "Quản lý Trang" ngay khi có bài
  đầu tiên.**
- **3 combo tháng 7 để đâu để hút khách?** → Đã có sẵn 2 chỗ (làm xong
  trong phiên trước): homepage "Combo Tháng Này" (ngay dưới Products) +
  trang "Set Quà Tặng". Chỉ cần Joe tạo combo trong admin với "Tháng áp
  dụng = Tháng 7", giá thật, ảnh thật (`combo SP/` đã có sẵn ảnh thiết kế:
  combo1.jfif, combo2.jfif, combo3.jfif, thang7.jfif), bấm Kích hoạt — không
  cần code thêm gì.

## 4. Việc vặt còn treo lại (mức độ thấp, không chặn)

- Component `Showrooms.tsx`, `OmniChannel.tsx`, `Blog.tsx`, `About.tsx` giữ
  nguyên giao diện cũ, CHƯA được làm đẹp lại theo phong cách Products đã
  làm (Phase 2 candidate, xem spec §Non-goals).
- Ingredient axis (trục điều hướng theo thành phần kiểu JKJ) — cố tình
  KHÔNG làm vì dữ liệu `activeIngredient`/`ingredients` là text tự do,
  không phải danh mục chuẩn. Xem lý do đầy đủ trong spec §2.
- Cơ chế "mốc đơn hàng thưởng điểm" kiểu JKJ (đơn thứ 3 tự thưởng) — câu
  hỏi mở, cần Joe xác nhận TA có đủ volume đơn lặp lại không.

## 5. Việc cần đọc trước khi làm bất cứ gì

1. Skill `vkd-web` (orientation) trước tiên.
2. `docs/superpowers/specs/2026-08-07-site-ia-restructure-design.md` +
   `docs/reports/2026-08-07-premium-positioning-brand-guidelines.md` nếu
   làm tiếp về thiết kế/cấu trúc.
3. File này (`HANDOFF_NEXT_SESSION.md`) — xoá/cập nhật phần đã xong khi bắt
   đầu phiên mới, đừng để nó lỗi thời.
