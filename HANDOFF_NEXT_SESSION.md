# Handoff — TA Sâm Ngọc Linh Website

Ngày: 2026-08-09 (cập nhật lần 13). Phiên trước dừng ở đây — đọc file này
trước khi làm gì tiếp.

**Nếu Joe hỏi về "KOL"/tăng follow/tương tác fanpage-TikTok**: đó KHÔNG phải
việc trong repo web này — xem `D:\TA page\site\docs\kol-sam-ngoc-linh\00-HANDOFF.md`
mục 0 (phân biệt 2 dự án KOL khác nhau) và file 18 trong cùng thư mục (audit
số liệu thật + kế hoạch tăng trưởng, làm 2026-08-09).

## -12. Homepage product carousel + blog cross-sell (spec/plan/SDD) + 2 fix nhỏ
— ĐÃ XONG, LIVE. Đọc kỹ mục "Lưu ý quan trọng" cuối mục này trước khi làm gì
tiếp — có 1 phiên khác chạy song song trong CÙNG thư mục repo này.

Phiên này (brainstorming → spec → plan → subagent-driven-development đầy đủ,
worktree riêng, review từng task + review toàn nhánh) đã làm và merge vào
main:
- `src/data/featuredProducts.ts` (mới) — chọn tối đa 12 sản phẩm có `badge`
  thật, phủ đều 7 `productType`, loại hẳn sản phẩm `displayOnly18Plus` (phát
  hiện qua review toàn nhánh: thuật toán ban đầu suýt đưa 1 set quà 18+ lên
  carousel công khai không có nhãn cảnh báo — đã sửa trước khi merge).
- `src/components/ProductCarousel.tsx` (mới) — carousel vuốt ngang dùng
  chung cho trang chủ và cross-sell trong blog. **Lưu ý: phiên khác chạy
  song song ngay sau đó đã tiếp tục sửa file này** (bỏ `snap-mandatory` vì
  Joe chê "chạy từ từ", thêm kéo chuột thật cho desktop, ảnh nền
  ivory/gold cho 12 SKU) — xem mục -10 để biết chi tiết, không phải việc của
  phiên này.
- `src/components/Products.tsx` — bỏ hẳn grid 4 danh mục + hiệu ứng
  `IntersectionObserver`/fade-in-up so le cũ, thay bằng carousel trên.
- `src/components/BlogPostDetail.tsx` — thêm khối cross-sell sản phẩm nổi
  bật dưới mỗi bài (dùng chung `getFeaturedProducts`/`ProductCarousel`,
  không tailor riêng theo bài — verify bằng crawl trực tiếp
  jungkwanjang.us/blogs/ginseng-101 + press-room thấy khối "Featured
  Products" của họ cũng giống hệt nhau giữa các bài).
- Spec: `docs/superpowers/specs/2026-08-08-product-carousel-and-blog-crosssell-design.md`.
  Plan: `docs/superpowers/plans/2026-08-08-product-carousel-and-blog-crosssell.md`.

**2 fix nhỏ thêm cuối phiên (Joe báo trực tiếp qua ảnh chụp site thật):**
- `BlogPostDetail.tsx` — `renderMarkdown()` trước đây chỉ nhận diện bullet
  (`*`/`-`), dòng đánh số kiểu `1. `/`2. ` bị rơi vào nhánh đoạn văn, mất
  hết xuống dòng, dính thành 1 đoạn dài. Đã thêm nhận diện danh sách có số
  thứ tự, render `<ol>` riêng — verify bằng script throwaway mô phỏng logic
  parser (bài thật hiện có chưa có danh sách số nào để test trực tiếp qua
  UI, nhưng logic đã trace tay + tsc sạch).
- `Heritage.tsx` — bỏ hẳn "running product strip" (marquee tự chạy vô hạn,
  nền xanh đen, 10 SKU) ở section "Di Sản" — đây là ảnh Joe chụp gửi tưởng
  nhầm là carousel mới chưa vuốt được, thực ra là 1 widget khác, có sẵn từ
  trước, trùng lặp với carousel "Sản Phẩm" ở đầu trang. Joe chọn phương án
  bỏ hẳn (thay vì sửa cho vuốt được) vì đã có carousel thật ở trên rồi, và
  trang chủ từng bị chê "quá nhiều section" (xem report brand guidelines).

**Đã audit lại việc Joe tưởng "SEO/blog Learn KGC chưa làm" — thực ra ĐÃ
LÀM RỒI, chỉ là ở phiên khác chạy song song, Joe có thể chưa biết:**
- SEO kỹ thuật: sitemap động, route `/product/<slug>` thật, meta/canonical/OG
  động per-page, JSON-LD Product/Article/BreadcrumbList thật — xem mục -11
  và bước 1 trong mục -10. **KHÔNG cần làm lại.**
- Blog redesign theo tham khảo KGC: Hero Banner, Mục Lục tự sinh, thời gian
  đọc, khung trích dẫn/số liệu nổi bật — xem "Bước 4" trong mục -10. Đây MỚI
  là bản đầu tiên (trang chi tiết 1 bài), **CHƯA đụng tới cấu trúc danh
  sách/điều hướng** — xem mục backlog thật bên dưới, đừng nhầm là đã xong
  hết.

**Backlog THẬT sự chưa làm (ưu tiên theo mức độ dễ/khó, không cái nào đụng
tới nếu không đọc lại report gốc trước):**
1. **Tách Blog thành nhiều luồng theo mẫu KGC** (Ginseng 101 giáo dục vs
   Press Room tin tức) + category tag + tác giả + phân trang — nghiên cứu
   đầy đủ đã có ở `docs/reports/2026-08-07-premium-positioning-brand-guidelines.md`
   §7.7 (crawl trực tiếp 2 trang blog KGC thật). Đọc lại trước khi làm — TA
   hiện chỉ có 3 bài thật (xem mục -9), có thể vẫn còn hơi sớm để tách luồng
   nếu chưa lên tới ~5-10 bài, cân nhắc hỏi Joe trước.
2. **78/90 SKU vẫn chưa có ảnh nền premium ivory/gold** (mới làm 12 SKU ở
   carousel trang chủ) — xem mục -10 "Bước 3", script
   `scripts/generate_premium_product_bg.py` tái dùng được.
3. **Gallery kéo-thả nhiều ảnh giữa bài viết trong admin CMS** — hiện chỉ
   sửa được 1 ảnh cover, chưa có chèn ảnh giữa bài (mục -10 "Bước 2").
4. **Infographic sắc ký đồ HPLC** — cần Joe cung cấp số liệu kiểm định thật
   trước, không được bịa.
5. **Google Search Console** — cần Joe tự verify DNS/HTML tag, không code
   được thay.
6. **`FAQPage` schema** — chỉ làm khi có nội dung hỏi-đáp thật trong blog.

**⚠️ Lưu ý quan trọng — phiên khác đang chạy song song CÙNG thư mục này:**
Trong lúc làm phiên này, phát hiện `git log` liên tục có thêm commit mới
không phải do phiên này tạo ra (SEO, redesign blog, drag-scroll carousel —
xem mục -10/-11), và `git status` luôn có sẵn 1 loạt file
`public/assets/images/*` bị xoá/đổi tên/thêm mới KHÔNG COMMIT (Joe tự sắp
xếp lại ảnh trang chủ, xem cuối mục -10). **Phiên này cố tình không đụng,
không commit, không discard thư mục ảnh đó** — y hệt cách phiên trước đã
làm. Nếu phiên sau thấy `git status` có nhiều ảnh lạ, đó là việc dở dang
của Joe, KHÔNG PHẢI lỗi, hỏi Joe trước khi động vào. Luôn `git pull` ngay
trước khi sửa file — repo này đang có nhiều phiên/agent làm việc gần như
đồng thời.

## -11. SEO nâng cao tiếp: JSON-LD thật thay cho block giả — ĐÃ XONG, LIVE

Joe yêu cầu "chuyên gia SEO, liên tục cải tiến" — tiếp tục audit, thấy
`index.html` có 1 block `Product` JSON-LD TĨNH, giả (tên "Ngoc Linh Ginseng
Root", giá cố định 320 USD) dùng chung cho MỌI trang — nghĩa là Google có
thể hiện sai tên/giá cho bất kỳ sản phẩm nào trong 90 SKU thật. Đã xoá, thay
bằng `src/hooks/useJsonLd.ts` (tự chèn/gỡ `<script type="application/ld+json">`
theo từng trang):
- `ProductDetail.tsx`: schema `Product` thật (tên, mô tả, ảnh, SKU, giá VND
  thật, giá `availability: InStock` — hợp lý vì site không track tồn kho
  hiển thị cho khách, sản phẩm nào cũng đặt được).
- `BlogPostDetail.tsx`: schema `Article` thật (tiêu đề, ảnh, ngày đăng,
  publisher).
- Đã verify trực tiếp trên site thật — mở đúng trang sản phẩm, JSON-LD trả
  về đúng tên "Sâm Ngọc Linh thái lát ngâm mật ong", giá 2.500.000đ thật.

**Cập nhật cùng phiên**: đã thêm luôn `BreadcrumbList` schema cho cả
`ProductDetail.tsx` và `BlogPostDetail.tsx` (Trang chủ › Sản phẩm/Blog › tên
trang) — verify trực tiếp trên site thật, JSON-LD trả về đủ 3 loại
(Organization, Product, BreadcrumbList) trên 1 trang sản phẩm.

**Hướng SEO/KOL tiếp theo nếu Joe muốn làm nữa** (chưa làm, ghi lại ý
tưởng):
- `FAQPage` schema nếu blog có mục hỏi-đáp thật (không bịa câu hỏi).
- Nội dung KOL/influencer: đây là việc khác hẳn (outreach, kịch bản review,
  không phải sửa code site) — nếu Joe muốn làm phần này, dùng skill
  `marketing-sam` (đã có sẵn, chuyên viết bài SEO + kịch bản video cho sâm
  VKD/TA) thay vì tiếp tục sửa trong repo site.
- Google Search Console chưa được xác nhận sở hữu domain (không thể tự làm
  qua code — cần Joe tự verify DNS/HTML tag), nên chưa có dữ liệu crawl/index
  thật để đo hiệu quả các thay đổi SEO đã làm.

## -10. Joe giao 4 nhiệm vụ lớn (audit SEO/UX/link, slider Shopee, redesign
blog theo KGC, admin edit + media) — CẢ 4/4 ĐÃ CÓ BẢN ĐẦU TIÊN LIVE, xem chi
tiết từng mục bên dưới cho phần còn thiếu/cần verify thêm

**Cập nhật cuối phiên (sau khi Joe phản hồi bực vì chưa thấy vuốt được +
nền vẫn trắng):**
- Carousel trước đó chỉ free-scroll được bằng TOUCH (bỏ snap-mandatory) —
  Joe test bằng chuột trên desktop nên không thấy gì đổi cả, vì mouse không
  tự kéo được `overflow-x-auto` mặc định. Đã thêm drag-to-scroll bằng con
  trỏ chuột thật (`pointerdown/move/up` trong `ProductCarousel.tsx`), phân
  biệt kéo vs bấm (>6px mới tính là kéo) để không bị navigate nhầm khi thả
  chuột ngay trên thẻ. Đã tự giả lập PointerEvent để verify `scrollLeft`
  đổi đúng.
- Nền sản phẩm: mở rộng từ 12 SKU (carousel trang chủ) ra **ĐỦ CẢ 90 SKU**
  trong catalog — `scripts/generate_premium_product_bg.py` giờ đọc toàn bộ
  ảnh tham chiếu trong `products.ts` (qua `scripts/_product_images.json`,
  file tạm, tự xoá sau khi chạy — cần tự sinh lại nếu muốn chạy lại script,
  xem docstring đầu file). Hạ ngưỡng nhận diện nền từ 225→205 vì phát hiện
  1 số ảnh gốc dùng phông nền xám nhạt (không phải trắng tuyệt đối), ngưỡng
  225 bỏ sót gần hết nền loại đó. Output giữ nguyên cấu trúc thư mục NCC
  (trimico/samk5/gốc) để tránh trùng tên file giữa các NCC.
- Bài học vận hành: sau 2 commit liền, Vercel KHÔNG tự bắt webhook từ GitHub
  (build không kích hoạt dù push thành công, `git log`/`origin/main` đều
  đúng) — đợi ~5 phút không thấy gì, phải tạo 1 commit rỗng
  (`git commit --allow-empty`) để ép webhook chạy lại, sau đó mới build bình
  thường (bao gồm luôn cả các commit bị kẹt trước đó vì cùng nằm trên
  `main`). Nếu gặp lại tình trạng "push xong mà `list_deployments`/
  `get_deployment` không thấy deployment mới sau vài phút", thử cách này
  trước khi nghi ngờ code sai.
- Đã verify trực tiếp trên `tasamngoclinh.com` cả 3 việc trên (drag-scroll
  qua PointerEvent giả lập, ảnh nền 90/90 không lỗi, blog hero/TOC/reading
  time hiển thị đúng qua click thật vào 1 bài).

Thứ tự Joe chọn: (1) audit ảnh/link + SEO kỹ thuật → (2) sửa bài trong admin
→ (3) slider Shopee → (4) tái cấu trúc blog theo KGC (jungkwanjang.us).

**Bước 3 (slider Shopee) — ĐÃ LÀM PHẦN CODE, push + verify trên site thật:**
- Joe phản hồi thêm 2 điểm cụ thể sau khi xem: (a) carousel "chạy từ từ" khó
  chịu — hoá ra là do `snap-x snap-mandatory` trên `ProductCarousel.tsx`
  khiến sau mỗi lần vuốt nó tự "trôi" và khớp về đúng 1 thẻ thay vì dừng
  ngay chỗ khách thả tay — đã bỏ hẳn snap, giờ là vuốt tự do đúng kiểu
  Shopee. (b) không cần số "đã bán"/rating — Joe xác nhận bỏ yêu cầu này
  (không có nguồn dữ liệu bán hàng thật, không bịa số).
- Ảnh sản phẩm trước đây nền trắng phẳng (ảnh chụp studio thật, nền trắng
  ĐÃ FLATTEN vào pixel, không phải alpha trong suốt) — viết
  `scripts/generate_premium_product_bg.py` (Python/Pillow+scipy): xoá nền
  trắng bằng flood-fill từ viền ảnh vào (chỉ vùng trắng NỐI VỚI viền mới bị
  xoá, nên chữ/nhãn trắng bên trong sản phẩm không bị ăn mất), rồi ghép lên
  gradient màu thương hiệu (Ivory → Ivory Dim → vignette ấm) + đổ bóng mềm
  dưới sản phẩm — thẩm mỹ theo hướng KGC. **Mới áp dụng cho 12 SKU đang hiện
  ở carousel trang chủ** (`public/products/premium-bg/`), CHƯA chạy cho hết
  90 SKU trong catalog đầy đủ (script tái dùng được, chỉ cần sửa mảng
  `IMAGES` trong script hoặc đổi sang đọc toàn bộ `products.ts`).
- **Việc CÒN LẠI trong bước 3** (Joe chưa nhắc lại nhưng nằm trong yêu cầu
  gốc "NHIỆM VỤ 2"): badge giảm giá (`discount_percent`) — vẫn chưa có, cần
  Joe xác nhận có muốn thêm giá gạch/giảm giá thật không trước khi làm (dễ
  hiểu lầm là khuyến mãi giả nếu không có coupon/giảm giá thật đứng sau).
  Chưa chạy premium-bg cho 78 SKU còn lại trong `ProductCatalog.tsx` (trang
  "Xem Tất Cả") — ảnh ở đó vẫn nền trắng cũ.
- Đã verify trên `tasamngoclinh.com`: 12 ảnh nền mới load đúng (không vỡ),
  build/tsc/`check:brand` sạch trước khi push.

**Bước 1 (audit SEO/link/ảnh) — ĐÃ XONG, push + verify trên site thật:**
- Sửa 4 bug nhỏ: ảnh Heritage bị xoá nhầm (khôi phục), QR Zalo trong catalog
  PDF sai số (`84984999309`→`0984999309`), nút "Tìm Hiểu Thêm" ở trang Về TA
  bấm vào bị bật về trang chủ thay vì cuộn tới Di Sản (thiếu onClick, đã sửa
  theo đúng pattern `handleFooterNav` của Footer — **CHƯA click-test lại
  được trên site thật qua browser tool phiên này, mới sửa theo code review**,
  nên test tay khi rảnh), JSON-LD dùng email/Zalo cũ sai domain.
- **Phát hiện + sửa lỗ hổng SEO lớn nhất trên site**: sitemap.xml trước đây
  chỉ có đúng URL "/", catalog/blog dùng client-state routing không có URL
  riêng → Google gần như không index được từng sản phẩm/bài viết. Đã thêm:
  - Route thật `/product/<slug>` (giống `/blog/<id>` có sẵn) — sửa trong
    `App.tsx` (hàm `matchPathname`/`navigate`).
  - `api/sitemap.ts` (Vercel serverless function) sinh sitemap động: liệt kê
    "/" + 90 URL sản phẩm + toàn bộ bài blog `published=true`. **Lưu ý quan
    trọng nếu sửa file này**: KHÔNG import trực tiếp từ `src/data/products.ts`
    — đã thử, Vercel build mỗi `/api/*.ts` thành bundle tách biệt và không
    resolve được import xuyên sang `src/`, sập 500 (`ERR_MODULE_NOT_FOUND`)
    ngay khi lên production (đã tự phát hiện qua `get_runtime_logs` và vá
    trong ~5 phút, nhưng là bài học: mọi thay đổi trong `api/*.ts` phải test
    kỹ hoặc tối thiểu hiểu rõ nó chạy tách biệt khỏi app). Cách đúng: sản
    phẩm đọc qua `public/product-slugs.json` (sinh lúc build bởi
    `scripts/generate-product-slugs.mjs`, đã thêm vào `prebuild` trong
    `package.json`, gitignored) — hàm serverless fetch file này qua HTTP,
    không import module.
  - `Blog.tsx` card và `ProductCarousel.tsx`/`ProductCatalog.tsx` card giờ là
    `<a href>` thật (trước là `<article onClick>`/`<div onClick>` — Google
    không bò được, không dùng Tab được) — vẫn giữ client-side nav qua
    `preventDefault()`.
  - Hook mới `src/hooks/useDocumentMeta.ts` — set `document.title`/meta
    description/canonical/OG động cho `/blog/<id>` và `/product/<slug>` (SPA
    không SSR nên trước đây mọi trang dùng chung title/meta trang chủ).
  - Đã verify trực tiếp trên `tasamngoclinh.com`: `/sitemap.xml` liệt kê đủ,
    `/product/<slug>` mở đúng + đổi title, `/blog/<id>` mở đúng qua click
    card thật + đổi title.
- **Việc audit CHƯA làm** (mới phát hiện, ghi lại để không mất): JSON-LD
  `Product` trong `index.html` chỉ có 1 SKU hardcode giá 320 USD, không khớp
  90 sản phẩm thật — có thể khiến Google hiện sai giá/tình trạng trong kết
  quả tìm kiếm. Cần sinh structured data Product động (tương tự cách vừa làm
  sitemap) hoặc bỏ hẳn nếu không dùng được đúng.
- **Ảnh trang chủ — CHƯA xử lý, đang chờ Joe**: trong lúc audit, phát hiện
  Joe đang tự sắp xếp lại `public/assets/images/` (xoá/đổi tên liên tục
  song song lúc tôi làm việc — `heritage-cay-sam.jpg`, `heritage-vuon-sam-2.webp`,
  `cay-sam-vkd.png`, `dai-bieu.jpg`, `hero-mountain1.jpg` đều bị xoá ở máy
  local, có các file tên lạ mới xuất hiện: `sam k5.jpg`, `cu sam dep.jpg`,
  `heritage-cay-sam - k dung anh nay k5.jpg`, `ruou.png`...). **Cố tình
  KHÔNG commit/đụng thư mục ảnh trong mọi commit của phiên này** để không
  đè lên việc Joe đang làm dở. Code hiện tại (đã push) vẫn trỏ đúng tên file
  gốc (`heritage-cay-sam.jpg` v.v. — đã khôi phục về đúng tên cũ 1 lần khi
  phát hiện bị xoá nhầm). Bảng link ảnh cố định (Joe có thể tự thay qua
  GitHub web UI, giữ nguyên tên file, Vercel tự deploy) đã gửi Joe trong
  chat, chưa lưu thành file — nên hỏi Joe muốn lưu vào đâu (docs/ hay ngay
  trong README admin) nếu cần tra lại.

**Bước 2 (sửa bài đã đăng trong admin CMS) — ĐÃ XONG, push, ĐANG đợi Vercel
build lúc dừng phiên — kiểm tra `git log -1` / Vercel dashboard xem deploy
`ccaac82` đã READY chưa, nếu build lỗi thì đọc `get_runtime_logs`/build logs
trước khi sửa tiếp:**
- `updateBlogPost()` mới trong `src/admin/adminApi.ts`.
- Modal sửa bài trong `CmsPage.tsx` (icon bút chì cạnh mỗi bài trong danh
  sách "Bài viết SEO công khai") — sửa tiêu đề/tóm tắt/nội dung/ảnh, có nút
  Lưu. Không cần cơ chế "xoá cache" riêng — trang chủ vốn đã fetch
  `blog_posts` mới mỗi lần tải trang (không có cache/ISR), nên sửa xong là
  lên site ngay lập tức.
- **CHƯA test tay bằng tài khoản admin thật** (phiên non-interactive không
  có sẵn cách đăng nhập `/gate-vkd-control-2026`) — chỉ build/tsc sạch. Phiên
  sau nếu có quyền đăng nhập admin, thử sửa 1 bài thật để xác nhận UX đúng
  trước khi báo Joe là xong hẳn.
- Kéo-thả ảnh trong bài (Joe có nhắc "Drag & Drop Gallery" trong yêu cầu gốc)
  — **CHƯA làm**, hiện chỉ thay được 1 ảnh cover, chưa có gallery nhiều ảnh
  chèn giữa bài. Nếu Joe cần, đây là việc tiếp theo trong đúng mục "quản lý
  media bài viết".

**Bước 3 (slider sản phẩm kiểu Shopee) — ĐÃ XONG phần vuốt/kéo + nền ảnh, xem
mục -10 đầu file để biết chi tiết drag-to-scroll + 90/90 ảnh.** Còn thiếu
đúng 1 phần: badge giảm giá, số "Đã bán", xếp hạng sao. **Dữ liệu này CHƯA
tồn tại** trong `src/data/products.ts` lẫn Supabase `products` — cần thêm
field (`sold_count`, `rating`, `discount_percent` hoặc tương đương) trước
khi hiển thị được, không được bịa số bán/rating giả. Joe đã xác nhận
"k cần có doanh số" ở phiên này nên phần này coi như đã bỏ khỏi scope, chỉ
làm lại nếu Joe chủ động yêu cầu về sau.

**Bước 4 (tái cấu trúc blog theo KGC) — ĐÃ CÓ BẢN ĐẦU TIÊN LIVE**, xem mục
-10 đầu file. Đã làm: Hero Banner (ảnh cover + gradient, tiêu đề đè lên),
meta row (tác giả "Đội Ngũ Nghiên Cứu TA" — cố tình không bịa tên bác sĩ/
chuyên gia cụ thể, xem lý do trong commit message), thời gian đọc tự tính,
excerpt hiện thành hook subtitle, Mục Lục tương tác tự sinh từ heading `##`
(smooth-scroll), cú pháp `> text` giờ render thành khung nổi bật (dùng được
cho cả Key Stat lẫn Social Proof tuỳ nội dung), bảng so sánh markdown vốn đã
hỗ trợ sẵn không cần thêm gì. Card danh sách Blog không có ảnh giờ có nền
gradient + tiêu đề lớn thay vì ô xám + icon.
**CHƯA làm** (cần dữ liệu/tài sản thật, không phải chỉ code layout):
Infographic sắc ký đồ HPLC (sẽ phải bịa số liệu nếu làm giờ — cần dữ liệu
kiểm định thật từ Joe trước). `docs/reports/2026-08-07-premium-positioning-brand-guidelines.md`
(nghiên cứu màu/thiết kế jungkwanjang.us từ phiên trước) vẫn còn giá trị
tham khảo nếu làm sâu thêm.

## -9. Track A tiếp tục: 3 bài thật đã live + webhook duyệt kênh CMS — ĐÃ XONG

Chi tiết đầy đủ nằm ở `D:\TA page\video-pipeline\HANDOFF_NEXT_SESSION.md`
mục -6 — đọc file đó. Tóm tắt nhanh: blog giờ có 3 bài thật (2 trục
Curation/Trust + 1 trục Ritual/Occasion mới), pipeline n8n ghi thẳng
Supabase `blog_posts` (không qua Strapi/copy tay nữa), và nút "Duyệt &
Đăng" trong `/gate-vkd-control-2026/channels`+CMS giờ có nơi nhận thật
(webhook n8n forward qua Telegram — chưa đăng thẳng lên TikTok/Zalo vì
chưa có OAuth/API credential cho 2 nền tảng đó).

**Cập nhật 2026-08-08**: Facebook giờ đăng THẬT tự động (không còn chỉ báo
Telegram để copy tay) — đã test end-to-end, bài lên fanpage thật qua Graph
API. Chi tiết đầy đủ (2 bug đã gặp, quy trình lấy long-lived token khi hết
hạn 2026-10-07) nằm ở
`D:\AI_Skills\ai-marketing-skills\outputs_Claude_mark_sam\references\HOAN_THIEN_KENH_PHAN_PHOI.md`
mục 1.

## -8. TA Elite Club thật sự "bật" (accrual + redeem + admin) — ĐÃ XONG, PUSHED

Bắt đầu từ yêu cầu "TA Elite Club đang bị ẩn, tái cấu trúc, đừng ẩn nữa, đặc
biệt trong admin" — điều tra ra phát hiện lớn hơn nhiều so với "chỉ là ẩn":

- **`accrue_loyalty_points()` đã tồn tại sẵn trong DB nhưng CHƯA BAO GIỜ được
  gọi** ở đâu trong luồng thanh toán thật (`mark_payos_order_paid()` trước
  đây chỉ đổi `status` đơn hàng). Không có cơ chế tự động enroll khách vào
  `elite_club_members`. Kết quả: `elite_club_members` và `loyalty_transactions`
  đều **0 dòng** trong production dù `LoyaltyDashboard`/`EliteTeaser` đã hiện
  đầy đủ trên site khách từ trước (không phải bị ẩn — đơn giản là chưa từng
  có dữ liệu thật để hiện).
- Migration `wire_loyalty_accrual_and_redemption` (đã apply qua Supabase MCP):
  sửa `mark_payos_order_paid()` để tự enroll khách (nếu chưa có) + gọi
  `accrue_loyalty_points()` mỗi khi đơn PayOS thanh toán thành công.
- **Thêm tính năng đổi điểm lấy giảm giá khi checkout** (theo yêu cầu Joe:
  giữ nguyên 3 hạng cashback % hiện có, KHÔNG đổi sang mô hình JKJ, chỉ thêm
  redeem). Tỷ lệ **1 điểm = 100đ**, giới hạn tối đa **30% giá trị đơn hàng**
  — 2 con số này là quyết định tự đưa ra khi Joe bảo "tự chạy, không cần
  hỏi", CHƯA được Joe xác nhận, có thể cần điều chỉnh. Điểm chỉ thực sự bị
  trừ lúc đơn hàng thanh toán thành công (trong `mark_payos_order_paid`),
  không trừ lúc tạo link thanh toán — huỷ/bỏ giữa chừng không mất điểm. UI ở
  `Checkout.tsx` (tra điểm khi rời ô email, thanh trượt chọn số điểm dùng).
- **Trang admin mới `/gate-vkd-control-2026/loyalty`** ("TA Elite Club" trong
  nav) — chỉ xem (read-only theo yêu cầu Joe để làm nhanh): danh sách hội
  viên, hạng CRM, điểm hiện có/trọn đời, ngày tham gia. Trước đây admin
  **không có trang này** — đây là gap admin thật sự Joe đang nói tới.
- **Chưa verify UI thật** (phiên non-interactive, không có đơn PayOS thật
  nào chạy qua để xác nhận accrual/redeem hoạt động đúng end-to-end) — phiên
  sau nên đặt 1 đơn test thật (số tiền nhỏ) và kiểm tra: đơn paid → có row
  mới trong `elite_club_members`/`loyalty_transactions` → trang admin Loyalty
  hiện đúng → nếu dùng redeem, điểm bị trừ đúng số.
- Tỷ lệ đổi điểm (100đ/điểm) và trần 30%/đơn là giả định hợp lý nhưng **cần
  Joe xác nhận** — dễ sửa (2 hằng số đầu `Checkout.tsx`:
  `REDEMPTION_VND_PER_POINT`, `MAX_REDEEM_RATIO`).
- Đồng thời sửa 3 lỗi SEO kỹ thuật phát hiện khi audit: `canonical`/`og:url`
  trong `index.html` từng trỏ sai domain (`samngoclinh-ta.vn` thay vì
  `tasamngoclinh.com`), thiếu hẳn `robots.txt` và `sitemap.xml` (đã thêm cả
  hai vào `public/`). Audit đầy đủ (bảng từ khoá, technical checklist) chỉ
  có trong chat phiên này, chưa lưu thành file riêng.

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
