# Handoff — TA Sâm Ngọc Linh Website

Ngày: 2026-08-07 (cập nhật lần 3, cuối phiên). Phiên trước dừng ở đây — đọc
file này trước khi làm gì tiếp.

## -1. Verify cuối phiên — ĐÃ XÁC NHẬN

- **Live site `tasamngoclinh.com` đã lên bản mới nhất** — verify trực tiếp
  (cả Joe tự kiểm tra và tôi mở lại site): hero hiện "52+ Loại Saponin",
  card trang chủ hiện "Nước Giải Khát" (không còn "Nước Tăng Lực") — đúng 2
  thay đổi mới nhất đã push. Vercel auto-deploy hoạt động bình thường, mọi
  commit trong phiên này đã lên production, không có commit local nào treo.
- **Bug nghiêm trọng vừa fix**: nút "Nhắn tin qua Messenger" trong chatbot
  (`ChatWidget.tsx`, node `human` → "Gặp nhân viên tư vấn") trỏ về
  `m.me/tapdoanyduocsamngoclinhvn` — **fanpage VKD Group cũ**, mọi tin nhắn
  khách gửi qua nút này bị lạc vào inbox công ty khác. Đã sửa thành
  `m.me/61592621322828` (page "Vườn Sâm Ngọc Linh nhà Khánh" — trang thật
  của TA). Đã verify bằng cách bấm thật qua UI (chat → Gặp nhân viên tư vấn
  → xác nhận href đúng), đã build sạch, đã push
  (`fix: chatbot Messenger link pointed to old VKD fanpage, not TA's`).
  Đã kiểm tra `social_links` (Supabase, Footer đọc từ đây) — không có entry
  Facebook nào khác cần sửa, chỉ có Zalo/WhatsApp.
- Giá 3 sản phẩm Tổ Yến (525k/225k/500k) — Joe đã xác nhận đúng, không cần
  sửa gì thêm.

## 0. Cập nhật trước đó trong phiên — ĐÃ XONG

- **NCC thứ 3 samk5.vn đã onboard xong** (Joe xác nhận là NCC mới, ẩn tên
  giống TRIMICO). Đã thêm 6 sản phẩm thật vào `src/data/products.ts` (SK5-001
  → SK5-006): Nước Uống Dưỡng Da Collagen Noliko (20k), Nước Tăng Lực Dâu Tây
  Đỏ (252k), Chanh Khoáng (252k), Tổ Yến 100ml-5 Hủ (525k), Tổ Yến Kids
  (225k), Collagen Tổ Yến Noliko+ (500k). File backend riêng
  `src/data/samk5Products.ts` (giống pattern `trimicoProducts.ts`). Ảnh thật
  đã tải về `public/products/samk5/`. `scripts/check-no-supplier-names.js`
  đã thêm pattern chặn "K5"/"samk5"/"Xơ Đăng" — guard tự động fail nếu lộ.
  **Lưu ý giá chưa chắc chắn 100%**: 2 sản phẩm Tổ Yến có giá KHÁC NHAU giữa
  trang danh mục và trang chi tiết trên chính samk5.vn (site gốc không nhất
  quán) — đã dùng giá trang danh mục, note rõ trong `samk5Products.ts`, Joe
  nên xác nhận lại.
- **Đổi tên "Nước Tăng Lực" → "Nước Giải Khát"** trên card trang chủ (5
  ngôn ngữ) theo đúng yêu cầu, ảnh card cũng đổi sang ảnh sản phẩm thật.
- **Phát hiện gap kiến trúc quan trọng**: trang admin
  `/gate-vkd-control-2026/products` ("Sản phẩm & Kho") đọc dữ liệu từ MỘT
  BẢNG SUPABASE MOCK RIÊNG (`fetchProducts()` trong `adminApi.ts`), HOÀN
  TOÀN KHÔNG liên quan tới `src/data/products.ts` (file catalog thật mà
  khách hàng nhìn thấy). Đây là lý do trang admin đó mãi chỉ hiện "31 sản
  phẩm cũ" dù tôi vừa thêm 6 sản phẩm mới vào catalog thật — 6 sản phẩm mới
  **CÓ hiển thị đúng trên site khách hàng** (đã verify), nhưng **KHÔNG hiện
  trong trang quản lý kho admin**. Đồng bộ 2 nguồn dữ liệu này là việc LỚN,
  chưa làm — xem mục 2 bên dưới.

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
- **Sub-project E (mới phát hiện) — Đồng bộ admin "Sản phẩm & Kho" với
  catalog thật**: `src/admin/pages/ProductsPage.tsx` đọc từ bảng Supabase
  mock riêng (`fetchProducts()`/`fetchProductCategories()` trong
  `adminApi.ts`) — HOÀN TOÀN tách biệt khỏi `src/data/products.ts` (catalog
  thật khách hàng thấy, hiện 90 sản phẩm). Nghĩa là bất kỳ sản phẩm nào
  thêm vào `products.ts` (như 6 sản phẩm samk5 vừa thêm) sẽ KHÔNG hiện
  trong trang quản trị kho, và ngược lại sửa/ẩn sản phẩm trong trang quản
  trị kho KHÔNG ảnh hưởng gì tới catalog thật khách hàng thấy. Đây là gap
  kiến trúc có sẵn từ trước (không phải lỗi tôi gây ra), nhưng giờ đã rõ
  ràng gây nhầm lẫn thật cho Joe. Cần 1 spec riêng trước khi động vào —
  không sửa vội vì đụng tới cả luồng quản lý kho/tồn kho admin đang dùng.

## 3. Việc MỚI Joe vừa giao cuối phiên — CHƯA làm gì cả, chỉ ghi lại

### 3a. Thêm sản phẩm mới từ samk5.vn — ĐÃ XONG, xem §0

(Mục này ban đầu ghi lại yêu cầu chưa làm; đã hoàn thành cuối phiên — chi
tiết đầy đủ ở mục 0 đầu file. Còn lại: đồng bộ admin "Sản phẩm & Kho" xem
mục 2 bên dưới, và Joe cần xác nhận lại giá 2 sản phẩm Tổ Yến bị lệch giữa
trang danh mục/chi tiết trên samk5.vn.)

**Còn NCC khác chưa thêm** — nếu Joe có thêm sản phẩm từ NCC mới khác sau
này, lặp lại đúng quy trình đã dùng cho samk5: (1) hỏi Joe xác nhận đây có
phải NCC mới không, (2) nếu có → thêm pattern cấm tên NCC đó vào
`BANNED_PATTERNS` trong `scripts/check-no-supplier-names.js`, (3) tạo file
`<tenNCC>Products.ts` theo pattern `samk5Products.ts`/`trimicoProducts.ts`,
(4) thêm entry tương ứng thủ công vào `src/data/products.ts` (không cần
chạy `migrate-to-unified-products.mjs` — script đó chỉ đọc `vkdProducts.ts`
+ `trimicoProducts.ts`, KHÔNG tự động đọc file NCC thứ 3/4; thêm tay vào
`products.ts` là cách đã dùng và đúng), (5) tải ảnh thật về
`public/products/<tenNCC>/`, (6) `npm run check:brand && npx tsc -b && npm
run build` trước khi commit.

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
