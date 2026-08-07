# Handoff — TA Sâm Ngọc Linh Website

Ngày: 2026-08-07 (cập nhật lần 8). Phiên trước dừng ở đây — đọc file này
trước khi làm gì tiếp.

## -7. Track A — bài viết thật đầu tiên — ĐÃ XONG, LIVE, đọc được trọn vẹn

Chi tiết đầy đủ (n8n prompt fix, lỗi bịa sản phẩm, cách sửa) nằm ở
`D:\TA page\video-pipeline\HANDOFF_NEXT_SESSION.md` mục -1 — đọc file đó
trước. Tóm tắt phần đụng tới repo site này:

- Bài thật đã `INSERT` vào Supabase `blog_posts` (id
  `44379659-9839-45c4-a543-cb283a46338a`, `published=true`) — KHÔNG qua
  Strapi (Strapi hoàn toàn tách biệt khỏi site, xem file trên).
- **Thêm trang đọc bài chi tiết** (trước đây không có): route mới
  `blog-post` trong `App.tsx` (dùng lại state `selectedSlug` sẵn có, giờ
  chứa `post.id`), component mới `src/components/BlogPostDetail.tsx` —
  parser markdown tự viết (không thêm thư viện) chỉ hỗ trợ đúng tập cú pháp
  cố định mà prompt Gemini luôn sinh ra (H2 `##`, H3 `###`, bullet `* `/`- `,
  bold `**...**`, đoạn văn). `fetchBlogPost(id)` mới trong
  `siteContentApi.ts`. `Blog.tsx` card giờ có `onClick` thật thay vì nút
  "Đọc tiếp" trang trí vô dụng như trước.
- `site_sections.visible = true` cho `key='blog'` — mục Blog giờ hiện trong
  menu chính, đã verify bằng cách bấm qua UI thật (menu → Blog → card → Đọc
  tiếp → đọc trọn bài, layout đúng, không lỗi).
- **Route theo id — ĐÃ XONG cùng ngày**: `/blog/<id>` giờ mở thẳng đúng bài
  khi tải trang mới (không cần đi qua danh sách Blog trước), verify bằng
  `navigate` thẳng vào URL đó trên site thật. Link bài mẫu:
  `https://tasamngoclinh.com/blog/44379659-9839-45c4-a543-cb283a46338a`.
  Cách làm: effect khởi tạo trong `App.tsx` parse `window.location.pathname`
  khớp `/blog/([^/]+)/?` → set `currentPage='blog-post'` +
  `selectedSlug=<id>` trước khi làm gì khác; `navigate()` cập nhật
  `pathname` thành `/blog/<id>` khi vào trang này, reset về `/` khi rời đi.
  Mọi trang khác trong app vẫn dùng state nội bộ như trước, không đổi.
- Ảnh cover: chưa có, `featured_image_url` đang NULL. Nếu Joe muốn thêm,
  phải `UPDATE blog_posts SET featured_image_url = '...' WHERE id =
  '44379659-9839-45c4-a543-cb283a46338a'` qua Supabase — **KHÔNG** phải
  upload qua Strapi admin (không có tác dụng, xem lý do ở file trên).
- Caption đăng fanpage đã soạn sẵn 3 kênh (Facebook/TikTok/Zalo) tại
  `D:\AI_Skills\ai-marketing-skills\outputs_Claude_mark_sam\drafts\
  captions_2026-08-07.md` — Joe tự đăng tay, chưa đăng đâu cả.

## -6. Combo Tháng Này thật + Lịch 14 combo dịp lễ — ĐÃ XONG, LIVE (1/15)

- **`duong-nhan-sam-yen` ("Dưỡng Nhan Sâm Yến") — combo THẬT, `active=true`,
  đã lên `tasamngoclinh.com` (verify bằng `read_page` trực tiếp trên site,
  thấy đúng ảnh + giá).** Gồm Tổ Yến Sâm Ngọc Linh 100ml-5 Hủ (SK5-004) +
  Collagen Sâm Ngọc Linh Tổ Yến Noliko+ (SK5-006), giá 899.000đ (tổng lẻ
  1.025.000đ). **4 ảnh gốc ở `combo SP/` (combo1/2/3.jfif, thang7.jfif) bị
  BỎ HẲN** — hoá ra là ảnh "Combo Dâng Lễ Vu Lan" của một brand khác ("NGỌC
  LINH EST 1994" in ngay trên hộp, không phải logo góc dễ xoá), sản phẩm
  trong đó (PanaxX Cookie/HausnX Candy dạng bánh/kẹo/rượu sâm) hoàn toàn
  không có trong catalog thật — Joe đã xác nhận bỏ, làm combo mới từ SKU
  thật thay vào đó.
- Ảnh poster combo dựng bằng Python Pillow (không phải browser screenshot —
  sandbox chặn `file://` cross-directory), composite từ đúng ảnh sản phẩm
  thật trong `public/products/samk5/`, **font bắt buộc dùng Times New Roman**
  (`C:/Windows/Fonts/times.ttf`/`timesbd.ttf`) — Georgia thiếu glyph dấu
  tiếng Việt, chữ ra ô vuông (đã tự phát hiện + fix trong phiên, kiểm bằng
  `fontTools.ttLib.TTFont(...).getBestCmap()` trước khi chọn font). File lưu
  `public/products/combo/<slug>.png`, đã commit + push riêng (không đụng
  `src/components/Products.tsx` — file đó có diff dở dang **KHÔNG PHẢI CỦA
  PHIÊN NÀY**, xem cảnh báo ở cuối mục này).
- **14 combo dịp lễ Việt Nam khác đã tạo sẵn dạng NHÁP** (`active=false`)
  trong `combo_sets` — Tết Dương Lịch, Valentine, Ông Táo, Tết Nguyên Đán,
  Rằm Tháng Giêng, 8/3, Giỗ Tổ Hùng Vương, 30/4-1/5, Đoan Ngọ, Vu Lan, Trung
  Thu, 20/10, 20/11, Giáng Sinh — SKU thật, **giá = đúng tổng SKU thành
  phần, không tự giảm giá** (yêu cầu tường minh của Joe). **CHƯA có ảnh** —
  cần dựng ảnh (đúng quy trình Pillow ở trên) trước khi bấm "Kích hoạt".
  Bảng đầy đủ (slug/SKU/giá/ngày dương lịch 2026) + quy trình kích hoạt ở
  `D:\AI_Skills\ai-marketing-skills\outputs_Claude_mark_sam\references\seasonal_combo_calendar.md`
  — đọc file đó, không phải tóm tắt này, trước khi kích hoạt bất kỳ combo
  nào. Ngày âm→dương chỉ đúng cho năm 2026.
- **⚠️ Phát hiện giữa phiên, KHÔNG PHẢI VIỆC CỦA PHIÊN NÀY**: `git status`
  đầu phiên đã thấy `src/components/Products.tsx` có diff chưa commit (41
  dòng thêm/13 xoá) + `.claude/worktrees/` — có vẻ một phiên/worktree khác
  đang dở dang animation Products section. **Đã cố tình KHÔNG đụng, KHÔNG
  commit file đó** khi push ảnh combo. Phiên sau nếu thấy file này vẫn còn
  diff treo, hỏi Joe trước khi commit hay discard — có thể là việc dở dang
  của một agent khác.

## -5. Sub-project E (đồng bộ admin Sản phẩm & Kho) — ĐÃ XONG (đợt đầu)

- Đã chạy sync một chiều thật: từ `src/data/products.ts` (90 SKU) GHI vào
  bảng Supabase `products` (project `xcwirgrlnibnjmseglee`, "Vkd web
  Project") — `name_vi`/`category_id`/`price_vnd`/`image_url` cập nhật
  theo catalog thật, **`active`/`stock_qty` của các SKU đã có KHÔNG bị
  đụng tới** (verify trước khi chạy: toàn bộ 31 dòng cũ có `stock_qty=0`,
  nên không có dữ liệu tồn kho thật nào bị mất). Kết quả: 99 dòng (90 SKU
  thật + 9 SKU cũ định dạng khác không còn trong catalog, giữ nguyên
  không xoá), `active_count=93`. Đã verify bằng SELECT sau khi chạy.
- Mapping category (3 bucket admin thô `nuoc-sam`/`tpbs`/`mypham`, không
  khớp 1-1 với 7 `ProductTypeId` chi tiết trong `productTypes.ts`) — quyết
  định hợp lý khi thiếu category tương ứng, ghi rõ trong skill
  `update-vkd-products` (mục "Đồng bộ Supabase admin") để lần sau không
  phải đoán lại.
- **Đây KHÔNG phải đồng bộ 2 chiều tự động** — mỗi lần `products.ts` đổi
  (thêm NCC mới, sửa giá, v.v.) phải chạy lại sync tay theo đúng quy trình
  đã ghi trong skill `update-vkd-products`. Đã cập nhật skill đó để bước
  này thành 1 bước bắt buộc trong quy trình thêm/sửa sản phẩm, và
  frontmatter description để tự trigger khi cần.
- **Chưa làm** (ngoài phạm vi đợt này, để dành nếu Joe muốn sâu hơn): thật
  sự hợp nhất 2 mô hình dữ liệu (vd. admin sửa `active`/`stock_qty` phản
  ánh ngược lại lên site khách — hiện KHÔNG có, trang khách không đọc
  `stock_qty`/`active` từ Supabase `products` chút nào, chỉ admin panel tự
  dùng nội bộ). Nếu Joe muốn "hết hàng" trên site khách phản ánh đúng tồn
  kho admin nhập, đó là việc lớn hơn nhiều, cần spec riêng.

## -4. Sub-project D (Products section động hơn) — ĐÃ XONG, LIVE (code) —
CẦN VERIFY THỊ GIÁC PHIÊN SAU

- Thẻ sản phẩm trang chủ (`Products.tsx`) giờ fade/slide-in so le
  (120ms/thẻ) khi cuộn tới, dùng `IntersectionObserver` + animation
  `animate-fade-in-up` có sẵn trong `index.css` (đã dùng ở Hero/
  ProductDetail, không thêm thư viện animation mới, không xung đột với
  transition hover sẵn có của `.product-card`).
- Icon overlay + link "Xem tất cả" giờ phản ứng cả khi TAP trên mobile
  (`group-active`), không chỉ hover chuột — trước đây trên mobile không
  có gì hiện ra cả vì không có hover.
- Có fallback: nếu trình duyệt không hỗ trợ `IntersectionObserver`, thẻ
  hiện ngay lập tức, không bao giờ bị kẹt ẩn.
- **CHƯA verify được bằng mắt phiên này** — pane trình duyệt trong phiên
  non-interactive không compositing frame (`screenshot`/
  `IntersectionObserver` đều không hoạt động dù code đúng, xác nhận qua
  test thủ công tách biệt). Build/tsc sạch, logic đã soát kỹ (đặc biệt
  tránh xung đột `transition` shorthand giữa CSS gốc và Tailwind
  utilities). Phiên sau nên mở `tasamngoclinh.com`, cuộn tới phần "Sản
  phẩm" trên trang chủ, xác nhận hiệu ứng mượt trước khi coi là xong
  100%.

## -3. Sub-project C (combo auto-fill) — ĐÃ XONG, LIVE

- 3 helper mới trong `src/data/combos.ts`: `getComboSuggestedPrice` (tổng
  giá lẻ các SKU đã chọn), `getComboPosterImage` (poster đã upload, nếu
  không có thì dùng ảnh sản phẩm đầu tiên trong combo — áp dụng NGAY cho cả
  combo cũ vì tính ở thời điểm hiển thị, không cần migrate), `getComboAutoDescription`
  (auto-fill "Gồm: Tên (giá), ..." — Joe xác nhận muốn tên+giá, không phải
  chỉ tên hay danh sách card riêng).
- Admin `CombosPage.tsx`: giá tự auto-fill = tổng giá lẻ khi chọn SP, admin
  gõ tay thì tôn trọng giá đó (nút "Dùng giá này" để áp lại gợi ý); preview
  ảnh fallback hiện ngay trong form nếu chưa upload poster.
- Áp `getComboPosterImage` vào cả 3 nơi hiển thị combo: `ComboOfTheMonth.tsx`,
  `ProductCatalog.tsx` (ComboCard), và danh sách combo trong admin.
- Đã verify logic 3 helper bằng script `tsx` throwaway chạy trực tiếp trên
  dữ liệu sản phẩm thật (không verify được UI tương tác vì admin dùng
  Supabase auth thật, không có tài khoản demo để đăng nhập trong phiên
  non-interactive này) — build sạch, tsc sạch, đã push, deployment Vercel
  `dpl_GFB3mjEp819DBcptjMn5JTebQhp2` READY, alias `tasamngoclinh.com` đúng.
- **Chưa verify UI thật với tài khoản admin** — phiên sau nếu có quyền
  đăng nhập admin nên bấm thử tạo 1 combo để xác nhận UX (gợi ý giá, ảnh
  fallback, mô tả auto-fill) đúng như mong đợi trước khi Joe dùng thật.

## -2. Sub-project B (trang pháp lý thật) — ĐÃ XONG, LIVE

- 4 trang thật đã lên site: Chính Sách Bảo Mật, Điều Khoản Dịch Vụ, Chính
  Sách Vận Chuyển, Chính Sách Đổi Trả & Hoàn Tiền — route `policy-privacy`
  / `policy-terms` / `policy-shipping` / `policy-refund` trong `App.tsx`,
  nội dung ở `src/data/policyContent.ts`, hiển thị qua
  `src/components/PolicyPage.tsx`. Footer link thật thay cho text tĩnh.
- Sự thật nghiệp vụ dùng trong nội dung (Joe xác nhận 2026-08-07): đổi/trả
  7 ngày kể từ ngày nhận hàng, CHỈ khi lỗi sản xuất/vận chuyển; vận chuyển
  tự giao khu vực gần vùng trồng + đối tác vận chuyển cho tỉnh/thành khác.
- **Thông tin đăng ký kinh doanh (MST/GPKD) trong Điều Khoản Dịch Vụ đang
  để TRỐNG có ghi chú rõ** ("đang cập nhật") — Joe xác nhận chưa có, KHÔNG
  bịa số. Cần điền thật khi Joe có giấy phép chính thức (sửa mục "2. Thông
  tin đơn vị vận hành" trong `policyContent.ts`, cả bản vi và en).
- Chỉ có bản Việt + Anh đầy đủ; zh/fr/ar tạm dùng bản Anh (nội dung pháp lý
  cần độ chính xác cao, không dịch máy chưa kiểm chứng) — xem comment đầu
  file `policyContent.ts`.
- Đã verify qua browser preview (bấm link Footer → trang mở đúng nội dung
  → nút "Về trang chủ" quay lại đúng), build sạch, đã push + xác nhận
  deployment Vercel `dpl_AvBBfinNGMjsFveEpVuggaywTKUx` READY, alias
  `tasamngoclinh.com` đã trỏ đúng.

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
9. Combo Tháng Này thật + 14 combo dịp lễ nháp — xem mục -6 đầu file.
10. Track A — bài viết thật đầu tiên, trang đọc chi tiết Blog — xem mục -7
    đầu file.

## 2. Việc CHƯA làm (đã brainstorm nhưng chưa code) — Sub-project B/C/D

Xem `docs/superpowers/specs/2026-08-07-site-ia-restructure-design.md`,
mục "Sub-project B/C/D" — mỗi cái cần 1 spec/plan riêng trước khi code:

- **Sub-project B — ĐÃ XONG, xem mục -2 đầu file.**
- **Sub-project C — ĐÃ XONG, xem mục -3 đầu file.**
- **Sub-project D — ĐÃ XONG (code), cần verify thị giác, xem mục -4 đầu
  file.**
- **Sub-project E — ĐÃ XONG (đợt đầu, sync một chiều), xem mục -5 đầu
  file.**

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
- **3 combo tháng 7 để đâu để hút khách?** → ĐÃ XONG theo cách khác — xem
  mục -6 đầu file. 4 ảnh `combo SP/` (combo1/2/3.jfif, thang7.jfif) nhắc ở
  đây **đã bị bỏ hẳn**, hoá ra không phải sản phẩm/thương hiệu của TA. Thay
  vào đó: 1 combo thật đã lên site (`duong-nhan-sam-yen`) + 14 combo dịp lễ
  khác đã nháp sẵn trong `combo_sets`, chờ kích hoạt.

### 3c. Track A — bài viết thật đầu tiên lên Blog — ĐÃ XONG, xem mục -7

(Mục này ban đầu ghi lại yêu cầu chưa làm; đã hoàn thành cuối phiên sau —
chi tiết đầy đủ ở mục -7 đầu file và
`D:\TA page\video-pipeline\HANDOFF_NEXT_SESSION.md` mục -1. Việc còn treo
lại: route URL/slug riêng cho từng bài để chia sẻ link trực tiếp được, và
Joe cần tự đăng caption đã soạn sẵn lên fanpage.)

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
