# Todo — TA site (cập nhật 2026-08-24, dọn lại cho đúng thực tế)

Quy tắc từ giờ: KHÔNG đánh dấu [x] khi chỉ dựa vào lời subagent báo — chỉ tick
sau khi PHIÊN CHÍNH tự chạy `npx tsc --noEmit` + `npm run build` và xác nhận
sạch. Việc giao Qwen/Ox: xem [feedback_use_qwen_ox_not_claude_subagents]
trong memory — brief nằm ở cuối file này, phiên chính phải tự kiểm tra kết
quả trước khi tick, không để mục nào "chạy song song" mà không ai theo dõi.

## ĐÃ XONG, ĐÃ VERIFY BUILD + PUSH LÊN MAIN (không phải chỉ nêu đề mục)
- [x] Site_languages + site_text_overrides + heritage location/date (Supabase
      + adminApi + admin pages Ngôn Ngữ/Header&Footer) — commit 7fd66f0
- [x] Carousel vuốt Vườn Sâm Nguyên Sinh + tọa độ Trà Linh cho 10 ảnh — commit 7fd66f0
- [x] About Us có ảnh thật + tọa độ — commit 7fd66f0
- [x] Nav admin tràn màn hình (thêm scroll ngang) — commit b170932
- [x] Trang Sản phẩm & Kho nối Supabase thật thay vì API 404 âm thầm — commit b170932
- [x] Video Thực Địa carousel + admin, Certifications carousel, gộp MXH/Liên hệ
      vào Header&Footer — commit 763e5b7
- [x] Component `SwipeCarousel.tsx` dùng chung + chuẩn hoá vào DESIGN_SYSTEM.md
      mục 7 (carousel bắt buộc cho mọi danh sách nhiều item)

## XONG — verify thật bởi phiên chính (build sạch + xem DOM qua dev server, không chỉ tin subagent)
- [x] Gộp menu Nghiên Cứu + Blog thành "Blog & Nghiên Cứu" — xác nhận trên DOM live
- [x] Blog listing thêm carousel "Bài Viết Nổi Bật" (8 slide) + giữ phân trang số 56 bài — xác nhận
- [x] Certifications.tsx → SwipeCarousel + CarouselImage fit=contain (7 slide, hết cắt mất ảnh) — xác nhận
- [x] VideoGallery.tsx → SwipeCarousel chung (4 video Facebook thật) + ProductDetail
      "Sản phẩm liên quan" → carousel — xác nhận
- [x] Commit + push 07f037c (763e5b7..07f037c)

## CHƯA LÀM — sẽ giao Qwen/Ox khi có việc mới (KHÔNG viết brief rồi bỏ đó nữa)
- [ ] Joe tự kiểm tra dòng site_text_overrides key=footer.followUs value="Liên hệ"
      (nghi test data cũ dán nhầm link Facebook, xem lại trong admin Header&Footer)
- [ ] 7 SKU TN thiếu ảnh (TN-002,003,004,006,007,008,009) — site NCC Trường Nhân
      đã đổi catalog, không gán ảnh an toàn được. Đề xuất: ẩn 7 SKU này qua
      trang Sản phẩm & Kho (đã sửa xong nút ẩn/hiện) cho tới khi có ảnh thật

## Checkpoint cuối (chỉ tick khi phiên chính tự chạy, không suy từ báo cáo subagent)
- [ ] npm run build sạch — chạy lại LẦN CUỐI sau khi cả 4 việc trên xong
- [ ] git commit + push (chỉ khi Joe yêu cầu)
- [ ] Test tay trên trình duyệt: carousel vuốt được, nav admin đủ mục, ẩn/hiện
      sản phẩm lưu được thật

## Phase 8 — 2026-08-24 giao Qwen (KHÔNG dùng Claude subagent nữa)

### ✅ "10 repo nâng cấp site" — Claude tự làm 2026-08-24 (Qwen 4 ngày chưa chạy)
Không ai chạy phiên Qwen cho task này từ 20/8 → Claude tự research qua
WebSearch (verify thật, không bịa sao) thay vì đợi tiếp. Kết quả đầy đủ ở
`docs/WEB_UPGRADE_10_REPOS.md` — ưu tiên #1 là `keen-slider` thay
embla-carousel (đã xác nhận không có báo lỗi React 19 như embla). Xem brief
cụ thể để Qwen/Ox CODE (không phải research nữa) ở Phase 9 bên dưới.

### Phiên Ox — cài skill category 2-3 còn thiếu (đã verify tên thật ở đâu chưa rõ)
```
Task: Verify qua web search xem các repo sau có tồn tại thật không, lấy đúng
URL GitHub: "ui-ux-pro-max", "gstack", "ponytail", "learn-claude-code",
"claude-plugins", "claude-mem", "codegraph", "multica", "claude-code-router",
"system-prompts-ai", "caveman", "best-practice", "codex-plugin-cc",
"claude-hud". Với repo nào xác minh thật, dùng lệnh
`npx --yes skills add <url>` để cài vào .claude/skills/ của project
(D:\TA page\site\ta_production\project). Với repo không xác minh được, ghi
rõ "không tìm thấy nguồn thật" - không đoán URL.
```

## Phase 9 — 2026-08-24 giao Qwen/Ox (web upgrade + KOC/livestream, CODE thật)

Nguồn đầy đủ: `docs/WEB_UPGRADE_10_REPOS.md` và `docs/KOC_LIVESTREAM_10_REPOS.md`
(2 file mới, tách biệt web frontend vs KOC/livestream theo yêu cầu Joe).

**Cập nhật 2026-09-03 — Claude tự chạy cả 3 việc (Qwen/Ox 10 ngày chưa chạy,
Joe yêu cầu Claude thực thi trực tiếp trong phiên này):**
- ✅ keen-slider test — xong, xem chi tiết ngay dưới mục này
- ✅ ffmpeg shuffle script — code đã có sẵn trên disk từ trước (chưa rõ ai viết),
  Claude chạy thử với video synthetic 30s, output đúng 30.1s, không lỗi
- ✅ overlay HTML — code đã có sẵn trên disk từ trước (đủ đồng hồ/ticker/đếm
  suất theo đúng brief), chưa mở test trực tiếp trong trình duyệt session này

### Phiên Qwen — test keen-slider thay embla-carousel (NHÁNH RIÊNG, không đụng main)

**✅ MERGED vào main 2026-09-03 (commit `22ef3b2`, fast-forward, branch
`test/keen-slider-swipe-carousel` đã xoá):** Verify trước khi merge:
`npx tsc --noEmit` sạch, `npm run dev` không có lỗi console/"Invalid hook
call" nào, slide width tính đúng theo `w-[NNpx]` breakpoint (không bị
keen-slider's `.keen-slider__slide{width:100%}` đè — phải viết CSS override
tay vì Tailwind JIT không thấy được className dựng runtime). Kéo/vuốt thật đã
verify bằng Chrome thật của Joe (claude-in-chrome) — kéo chuột trên carousel
"Bài Viết Nổi Bật" ở `/blog`, thẻ chuyển đúng + dot pagination nhảy sang dot
2. Sau merge: `npx tsc --noEmit` + `npm run build` lại trên main — cả 2 sạch.
CHƯA push lên remote — Joe tự push khi sẵn sàng.
```
Task: Trên 1 nhánh git riêng (KHÔNG đụng main/site đang chạy), cài
`npm i keen-slider` vào D:\TA page\site\ta_production\project, viết 1 bản
test nhỏ thay thế duy nhất `SwipeCarousel.tsx` bằng keen-slider, chạy
`npm run dev` xác nhận: (1) không lỗi "Invalid hook call" như embla-carousel
từng bị, (2) vuốt/swipe hoạt động mobile + desktop, (3) `npx tsc --noEmit`
sạch. Nếu ổn: để nguyên trên nhánh, báo lại cho phiên Claude review trước khi
merge. Nếu lỗi: ghi rõ lỗi gì, KHÔNG cố sửa bằng cách bỏ qua lỗi, rollback
sạch (`git checkout -- .`) và báo lại.
```

### Phiên Qwen — script ffmpeg shuffle playlist cho livestream loop Mai
```
Task: Viết 1 script (Node.js .cjs hoặc Python, chọn cái nào khớp code có sẵn
trong D:\TA page\site\ta_studio\backend\app.py) nhận vào 1 video 30 phút,
cắt thành 6 block ~5 phút bằng ffmpeg, mỗi lần chạy xáo ngẫu nhiên thứ tự 6
block rồi ghép lại thành 1 file mới + xuất kèm 1 playlist .json liệt kê thứ
tự đã dùng. Mục đích: tránh loop y hệt 1 file mãi mãi (đọc bí kíp #1 trong
`docs/kol-sam-ngoc-linh/37-obs-loop-livestream-mai-plan.md` để hiểu lý do).
Test bằng 1 video mẫu bất kỳ, xác nhận file xuất ra phát được không giật ở
điểm nối. KHÔNG cần tích hợp OBS/n8n ở bước này — chỉ cần script chạy độc
lập đúng, phiên sau sẽ nối vào automation.
```

### Phiên Ox — overlay HTML đồng hồ + ticker cho OBS Browser Source
```
Task: Viết 1 file HTML/CSS/JS thuần (không framework, không build step) làm
OBS Browser Source overlay cho livestream Mai, gồm:
1. Đồng hồ hiện giờ thật (setInterval, cập nhật mỗi giây, format HH:mm)
2. Ticker chạy ngang hiển thị danh sách câu hỏi (đọc từ 1 file JSON riêng,
   để trống mảng mẫu — dữ liệu thật Joe sẽ điền sau)
3. Đếm ngược "còn X suất giá sốc" đọc số từ 1 file JSON riêng, giảm dần
   không cần logic phức tạp — chỉ đọc giá trị tĩnh từ file, phiên sau nối
   n8n để tự cập nhật
Đặt tại D:\TA page\site\ta_studio\overlay\index.html (tạo thư mục nếu chưa
có). Nền trong suốt (để chồng lên video OBS), test bằng cách mở trực tiếp
file trong trình duyệt trước, không cần OBS thật để test bước này.
```

## Phase 10 — Blog Nâng Cấp + Homepage/Subpage CMS (2026-08-25 giao Qwen/Ox)

**Mục đích:** Deep research KGC blog structure, nâng cấp blog của TA (URL params pagination + admin controls), xây dựng full-page CMS cho homepage + subpages qua Supabase (không cần Strapi).

**Tổng quát:** 6 task riêng biệt, có thể chia cho Qwen (tasks 1-3) + Ox (tasks 4-6), hoặc tuần tự nếu prefer. Mỗi task một file/feature độc lập, không đụng tay nhau.

---

### Phiên Qwen — Task 1: Fix blog pagination URL params (shareable links)

```
Mục đích: Blog page tại /blog?page=2 phải lưu được trang hiện tại khi refresh

File: D:\TA page\site\ta_production\project\src\components\Blog.tsx (lines 179-201)

Hiện tại: Pagination state chỉ dùng React state (setPage), mất khi refresh.
Cần: Đọc ?page=N từ URL, sync với state, fallback trang 1 nếu không có param.

Chi tiết:
1. Import useSearchParams hoặc useLocation (React Router v6) để đọc query string
2. Modify useEffect: nếu URL có ?page=2, set state tương ứng
3. Khi user click pagination button, update URL: 
   - Dùng window.location.history.replaceState() hoặc navigate(`/blog?page=${p}`)
4. Test: 
   - /blog → trang 1 ✓
   - Click "2" → URL thành /blog?page=2 ✓
   - Refresh trên /blog?page=2 → còn ở trang 2 ✓
5. Không cần thay đổi logic pagination khác, chỉ link state ↔ URL

Nếu lỗi: ghi rõ lỗi nào, KHÔNG cố fix bằng cách bỏ qua, báo lại cho Claude review.
```

### Phiên Qwen — Task 2: Add blog admin page + author/featured fields

```
Mục đích: Trang admin để quản lý blog posts (published/draft), set featured posts, quản lý author

Supabase migration TRƯỚC (task 2a — chạy trước, không cần code):
  ALTER TABLE blog_posts ADD COLUMN author TEXT DEFAULT 'TA';
  ALTER TABLE blog_posts ADD COLUMN featured BOOLEAN DEFAULT false;
  ALTER TABLE blog_posts ADD COLUMN pinned BOOLEAN DEFAULT false;

Files cần tạo/sửa:
1. src/admin/pages/BlogPage.tsx — CREATE NEW (copy pattern từ CmsPage.tsx hoặc TrustProofPage.tsx)
   - Table view (Title | Date | Author | Featured? | Pinned? | Published | Action buttons)
   - Fetch: fetchAllBlogPostsForAdmin() từ siteContentApi.ts
   - Edit form: modal để chỉnh title, excerpt, author, featured (checkbox), pinned (checkbox)
   - Save: dùng adminApi.ts updateBlogPost() (CREATE NEW hàm này)
   - Delete button nếu chưa publish
   
2. src/lib/siteContentApi.ts — Update fetchAllBlogPostsForAdmin()
   - Thêm fields: author, featured, pinned vào SELECT clause (line 109)

3. src/admin/adminApi.ts — CREATE NEW hàm updateBlogPost()
   ```typescript
   export async function updateBlogPost(id: string, updates: {
     author?: string;
     featured?: boolean;
     pinned?: boolean;
     published?: boolean;
   }) {
     const { error } = await supabase
       .from('blog_posts')
       .update(updates)
       .eq('id', id);
     if (error) throw new Error(error.message);
   }
   ```

4. src/admin/AdminApp.tsx — thêm route mới vào router:
   - Import BlogPage
   - Thêm route: <Route path="/blog" element={<BlogPage />} />

5. src/admin/AdminLayout.tsx — thêm nav item cho Blog:
   - Sidebar menu: "Blog" link tới /gate-vkd-control-2026/blog

Test:
- Admin vào /gate-vkd-control-2026/blog → thấy danh sách 56 bài ✓
- Edit 1 bài: change author → "Nguyễn Văn A", tick featured ✓
- Refresh admin page → author + featured checkbox vẫn lưu ✓
- Frontend: blog carousel "Bài Viết Nổi Bật" (lines 204-253) hiện featured posts ✓
- npx tsc --noEmit sạch ✓

Nếu lỗi TypeScript: ghi rõ dòng nào, không bỏ qua --noEmit errors.
```

### Phiên Qwen — Task 3: Create Supabase page_sections table + RLS policy

```
Mục đích: Tạo table Supabase để lưu content blocks cho homepage/subpages

Chi tiết:
1. Mở Supabase dashboard (project "tasamngoclinh.com")
2. SQL Editor → tạo table:

CREATE TABLE page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,  -- 'home', 'about', 'heritage', 'b2b', etc.
  block_type text NOT NULL,  -- 'hero', 'text', 'image', 'carousel', 'testimonial'
  sort_order int NOT NULL DEFAULT 0,
  title_vi text,
  content_vi text,
  image_url text,
  cta_text text,
  cta_url text,
  visible boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(page_key, sort_order)
);

CREATE INDEX idx_page_sections_page_key ON page_sections(page_key, sort_order);

3. RLS Policy:
   a. Enable RLS on page_sections
   b. CREATE POLICY "Public can read visible sections"
      ON page_sections FOR SELECT
      USING (visible = true);
   
   c. CREATE POLICY "Admins can manage sections"
      ON page_sections FOR ALL
      USING (
        auth.uid() IN (
          SELECT user_id FROM admin_users WHERE role = 'admin'
        )
      );

4. Insert test data (tuỳ chọn, để trống ok):
   INSERT INTO page_sections (page_key, block_type, sort_order, title_vi, content_vi, visible)
   VALUES ('home', 'hero', 0, 'Hero Title', 'Hero subtitle...', true);

Test:
- Table visible trong Supabase Dashboard ✓
- Row-Level Security: enable ✓
- Query từ siteContentApi.ts thành công (task 4 sẽ test)

Nếu lỗi SQL: ghi rõ lỗi, KHÔNG cố sửa bằng cách bỏ qua, báo lại.
```

### Phiên Ox — Task 4: Update siteContentApi.ts + adminApi.ts với page_sections functions

```
Mục đích: Tạo API functions để fetch/update page sections từ Supabase

Files:
1. src/lib/siteContentApi.ts — ADD thêm 2 functions:

export interface PageSection {
  id: string;
  page_key: string;
  block_type: string;
  sort_order: number;
  title_vi: string;
  content_vi: string;
  image_url: string | null;
  cta_text: string | null;
  cta_url: string | null;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export async function fetchPageSections(pageKey: string): Promise<PageSection[]> {
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_key', pageKey)
    .eq('visible', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

2. src/admin/adminApi.ts — ADD 4 functions:

export async function fetchPageSectionsForAdmin(pageKey: string): Promise<PageSection[]> {
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_key', pageKey)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updatePageSection(id: string, updates: Partial<PageSection>) {
  const { error } = await supabase
    .from('page_sections')
    .update(updates)
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deletePageSection(id: string) {
  const { error } = await supabase
    .from('page_sections')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function reorderPageSections(sections: { id: string; sort_order: number }[]) {
  for (const section of sections) {
    const { error } = await supabase
      .from('page_sections')
      .update({ sort_order: section.sort_order })
      .eq('id', section.id);
    if (error) throw new Error(error.message);
  }
}

Test:
- npx tsc --noEmit sạch ✓
- fetchPageSections('home') return array (có thể empty) ✓
- TypeScript types tự động infer từ PageSection interface ✓

Nếu lỗi: ghi rõ TypeScript error line number, không bỏ qua.
```

### Phiên Ox — Task 5: Create PageBuilderPage.tsx admin page

```
Mục đích: Admin page để edit homepage/subpage content blocks (drag-reorder, edit text/images)

File: src/admin/pages/PageBuilderPage.tsx — CREATE NEW

Features:
1. Dropdown: chọn page (home, about, heritage, b2b, etc.) → fetch sections
2. Grid/List view: hiện danh sách sections (sort_order từ nhỏ tới lớn)
3. Drag-reorder: drag section để thay đổi thứ tự → update sort_order tới Supabase
4. Edit modal per section:
   - title_vi (text input)
   - block_type (select: hero, text, image, carousel, testimonial)
   - content_vi (textarea)
   - image_url (text input, hoặc prep cho image uploader bước sau)
   - cta_text (text input)
   - cta_url (text input)
   - visible toggle (checkbox)
   - Save button → updatePageSection()
5. Delete button → deletePageSection()
6. Add section button → form để tạo block mới

UI pattern: copy từ existing admin pages (CmsPage.tsx hoặc TrustProofPage.tsx) để style match

Test:
- Admin vào /gate-vkd-control-2026/page-builder → dropdown default "home" ✓
- Fetch homepage sections (empty hoặc test data từ task 3) ✓
- Drag section 1 ↔ section 2 → sort_order update Supabase ✓
- Edit section: change title → Save → reload → title cập nhật ✓
- npx tsc --noEmit sạch ✓

Nếu drag-reorder quá phức tạp: đơn giản hoá bằng ↑↓ buttons thay drag, hoặc skip trong MVP.
```

### Phiên Ox — Task 6: Create Sharp image resize API endpoint + admin uploader UI

```
Mục đích: Upload ảnh → auto-resize thành multiple sizes (Hero 1920x1080, Card 600x400, Thumb 300x200) + WebP

Files:
1. package.json — ADD dependency:
   npm install sharp

2. src/server/imageResize.cjs — CREATE NEW (hoặc .js tuỳ setup Vite):
   
   const sharp = require('sharp');
   const fs = require('fs');
   const path = require('path');
   
   async function resizeImage(inputBuffer, filename) {
     const timestamp = Date.now();
     const basename = path.parse(filename).name;
     const sizes = [
       { name: 'hero', width: 1920, height: 1080, fit: 'cover' },
       { name: 'card', width: 600, height: 400, fit: 'cover' },
       { name: 'thumb', width: 300, height: 200, fit: 'cover' },
     ];
     
     const results = {};
     for (const size of sizes) {
       const output = await sharp(inputBuffer)
         .resize(size.width, size.height, { fit: size.fit })
         .webp({ quality: 80 })
         .toBuffer();
       results[size.name] = {
         data: output,
         filename: `${basename}-${size.name}-${timestamp}.webp`,
       };
     }
     return results;
   }
   
   module.exports = { resizeImage };

3. src/admin/pages/PageBuilderPage.tsx — UPDATE (task 5 page):
   - Add image input + uploader button trong section edit modal
   - ON file upload:
     a. Read file → FormData → POST /api/upload-image (endpoint todo)
     b. Get back URLs (hero, card, thumb) → update image_url field
     c. Show thumbnail preview
   - Use JS fetch API để upload

4. API endpoint (nếu dùng Vite/standalone, skip vì Vite không có server API route):
   ALT: Tạm thời để image_url là text input (admin paste URL), image resize là manual step sau
   (Sharp là optional tuỳ Joe muốn hay không)

Test:
- npm install sharp thành công ✓
- Sharp functions compile (không cần run, chỉ compile check) ✓
- Admin uploader UI visible trong PageBuilderPage ✓
- (Optional: test upload nếu có API endpoint, else skip)

Note: Sharp là Node-only, không chạy browser. Nếu muốn client-side resize, cần thư viện khác (browser-sharp không tồn tại).
```

---

### Phiên Qwen — Task 7: Trang admin "Nội Dung Trang Chủ" (sửa text Heritage pillars)

```
Mục đích: Joe tự sửa text 3 pillars Heritage, Hero badge, section labels từ admin mà không cần đụng code

Cách tiếp cận: Mở rộng site_text_overrides (đã có sẵn trong Supabase + adminApi.ts) thay vì page_sections phức tạp.
Infrastructure đã có: fetchAllTextOverrides() + upsertTextOverride() trong adminApi.ts — xem pattern HeaderFooterPage.tsx

File cần tạo: src/admin/pages/HomepageTextPage.tsx — CREATE NEW

Nội dung trang:
1. FIELDS array gồm các keys (dùng cùng pattern HeaderFooterPage.tsx):
   - heritage.pillar1.title (Tập Hợp Đặc Sản)
   - heritage.pillar1.desc
   - heritage.pillar2.title (Cam Kết Chất Lượng & Nguồn Gốc — hiện tại)
   - heritage.pillar2.desc
   - heritage.pillar3.title (52+ Loại Saponin)
   - heritage.pillar3.desc
   - heritage.section.label (Di Sản & Khoa Học)
   - heritage.section.title (Kết Tinh Giữa Tự Nhiên và Khoa Học)
   - heritage.section.subtitle
   - hero.badge (badge trên Hero)
   - hero.titleLine1
   - hero.titleLine2 (nếu có)

2. Mỗi field: text input (textarea cho desc), Save button → upsertTextOverride(key, value)
3. Hiện giá trị hiện tại từ site_text_overrides (nếu chưa có override, placeholder = giá trị từ translations.ts)

File cần sửa: src/admin/AdminApp.tsx
- Import HomepageTextPage
- Thêm route: <Route path="homepage-text" element={<HomepageTextPage />} />

File cần sửa: src/admin/AdminLayout.tsx
- Thêm vào NAV array: { to: '/gate-vkd-control-2026/homepage-text', label: 'Nội Dung Trang Chủ', icon: Type }
- Type icon đã import sẵn

File cần sửa: src/components/Heritage.tsx
- Thêm useEffect đọc site_text_overrides từ fetchAllTextOverrides() (import từ lib/siteContentApi.ts hoặc adminApi.ts)
- Nếu override key tồn tại: dùng override. Nếu không: fallback về translations[lang]
- Chỉ cần đọc keys 'vi' (heritage.pillar1.title, v.v.) cho ngôn ngữ tiếng Việt trước

Test:
- Admin vào /gate-vkd-control-2026/homepage-text → thấy 11 fields ✓
- Sửa heritage.pillar2.title → "Cam Kết Mới" → Save → reload admin → vẫn hiện "Cam Kết Mới" ✓
- Mở trang chủ site (npm run dev) → Heritage section pillar 2 hiện "Cam Kết Mới" ✓
- npx tsc --noEmit sạch ✓

Nếu lỗi: ghi rõ, không bỏ qua lỗi TypeScript.
```

---

### Checkpoint & Merge
- [ ] Tất cả 6 task chạy xong, các files KHÔNG conflict
- [ ] Claude review PR: `npx tsc --noEmit` sạch, `npm run build` sạch
- [ ] Test homepage fetch từ page_sections, blog pagination URL, admin pages hoạt động
- [ ] git commit + push khi Claude duyệt

## Phase 11 — 2026-09-05 giao Qwen/Ox: fix i18n gãy + onboard 4 NCC mới

**Bối cảnh:** Joe báo khi đổi ngôn ngữ EN trên site, tên/mô tả/"KEY ACTIVE
INGREDIENT" vẫn hiện tiếng Việt. Claude đã tự tra code (không đoán) —
nguyên nhân THẬT là 2 việc:
1. `ProductDetail.tsx` dòng ~413-420 render `product.activeIngredient` y
   nguyên bất kể `lang` — field này CHƯA CÓ biến thể EN/ZH/FR trong type
   `Product` (`src/data/products.ts` dòng 29), khác với `name`/`description`
   đã có `nameEn/Zh/Fr`, `descriptionEn/Zh/Fr` (dòng 38-40) và logic fallback
   đúng ở dòng 267-275 (`lang === 'en' ? product.nameEn || product.name`).
2. Ngay cả field có sẵn biến thể (`nameEn`, `descriptionEn`...) thì tuyệt đại
   đa số trong ~90 SKU ở `products.ts` KHÔNG có giá trị (chỉ verify thấy
   SKU `VKD-001` có `nameEn`/`descriptionEn`, xem dòng 74-75) → fallback về
   tiếng Việt là hành vi ĐÚNG theo code, không phải bug logic, mà là THIẾU
   DỮ LIỆU dịch. Không có field `nameZh` nào từng thấy trong file (chỉ có
   type định nghĩa, chưa từng gán).

### Phiên Qwen — Task A (ƯU TIÊN GẤP): thêm field activeIngredient đa ngôn ngữ + dịch toàn bộ field còn thiếu

```
Mục đích: Sửa dứt điểm lỗi "chọn EN/FR/ZH vẫn hiện tiếng Việt" cho MỌI sản
phẩm hiện có (không chỉ sản phẩm mới thêm ở Task B/C bên dưới).

File 1: D:\TA page\site\ta_production\project\src\data\products.ts
- Dòng 29, sau `activeIngredient?: string;` thêm:
  activeIngredientEn?: string; activeIngredientZh?: string; activeIngredientFr?: string;
- KHÔNG xoá field cũ, chỉ thêm optional field mới (không breaking).

File 2: D:\TA page\site\ta_production\project\src\components\ProductDetail.tsx
- Quanh dòng 413-420, nơi render {product.activeIngredient}: thêm cùng
  pattern fallback đã dùng cho name/description (dòng 267-275):
  const activeIngredientText =
    lang === 'en' ? (product.activeIngredientEn || product.activeIngredient) :
    lang === 'zh' ? (product.activeIngredientZh || product.activeIngredient) :
    lang === 'fr' ? (product.activeIngredientFr || product.activeIngredient) :
    product.activeIngredient;
  rồi render {activeIngredientText} thay vì {product.activeIngredient}.

File 3: kiểm tra script dịch có sẵn `scripts/translate_products.py` (nhắc
tới trong docs cũ) — nếu file này tồn tại và còn chạy được (Ollama
qwen2.5:7b-instruct local, xem cách gọi trong
memory/project_i18n_auto_translate_policy — Joe có thể chưa nhớ đúng path,
verify bằng `Test-Path` trước khi tin), SỬA/MỞ RỘNG script để:
  1. Đọc toàn bộ `products` array trong `products.ts`
  2. Với mỗi SKU: nếu thiếu `nameEn`/`descriptionEn`/`activeIngredientEn`
     (khi có activeIngredient) → gọi Ollama dịch sang EN, ZH, FR — dịch
     nguyên nghĩa, KHÔNG bịa thêm thông tin không có trong bản gốc tiếng Việt
  3. Ghi đè lại đúng object đó trong `products.ts` bằng cách generate lại
     toàn bộ mảng (hoặc regex thay từng field) — PHẢI giữ nguyên format/thứ
     tự field hiện có, không viết lại toàn file bằng tay
  4. Nếu KHÔNG tìm thấy script cũ, viết script mới `scripts/translate-all-products.mjs`
     (Node, để đồng bộ style với `migrate-to-unified-products.mjs` đã có)
     gọi `ollama run qwen2.5:7b-instruct` qua child_process cho từng field
     cần dịch.
- Áp dụng cho TOÀN BỘ ~90 SKU hiện có (VKD/TRM/SK5/TN) + các SKU mới ở
  Task B/C bên dưới nếu chạy Task này SAU khi Task B/C đã thêm SKU mới.

Test bắt buộc trước khi báo xong:
- `npx tsc --noEmit` sạch
- `npm run build` sạch
- Mở `npm run preview`, vào 1 trang sản phẩm bất kỳ, đổi ngôn ngữ sang EN
  → tên + mô tả + "Key Active Ingredient" value đổi sang tiếng Anh thật
  (không còn tiếng Việt). Lặp lại với ZH, FR.
- Random-check 5 SKU bất kỳ: bản dịch KHÔNG được bịa thêm claim y tế/khoa
  học không có trong bản gốc (đọc lại nguyên văn tiếng Việt để đối chiếu) —
  áp dụng đúng rule [feedback_no_fake_reports] trong memory Claude.

Nếu lỗi: ghi rõ dòng nào, KHÔNG bỏ qua lỗi TypeScript, báo lại cho Claude review.
```

### ĐÃ CÀO XONG 2026-09-05 — dữ liệu thật nằm ở tasks/phase11_scraped_products.json

Claude đã tự WebFetch từng trang chi tiết thật của cả 4 nguồn (Qwen/Ox không
tự truy cập internet được nên không cào lại) — 55 sản phẩm thật, mỗi entry
có name_vi/price_vnd/description_vi/ingredients_vi/usage_vi/warnings_vi/
image_url/source_url/suggested_productType, đọc file JSON đó làm nguồn DUY
NHẤT khi viết Task B bên dưới — KHÔNG tự bịa thêm field nào không có trong
file. Ảnh Joe tự nén theo chuẩn TA + tự up qua trang admin
`/gate-vkd-control-2026/products` sau khi Qwen thêm SKU (không cần tải ảnh
tự động trong Task B nữa — chỉ cần điền tạm `image_url` gốc từ JSON vào
`image` field, Joe sẽ thay bằng ảnh đã nén qua admin).

Vài điểm cần Qwen xử lý/hỏi lại trước khi chốt (đã ghi trong JSON):
- `hidden_reason`: set `hidden:true` cho SKU đó (VD Sâm Ngọc Linh Ngâm Mật
  Ong 1g Khánh Thành đang hết hàng, Rượu Sâm Ngọc Linh VIP 750ml/Rượu Cây
  1000ml Samtramy giá "Liên hệ" không có giá cố định).
- `price_alt_note`/`price_alt_source`: vài sản phẩm cùng 1 công ty Tumơrông
  bán trên 2 domain giá khác nhau — ĐÃ CHỌN 1 giá đại diện trong JSON, không
  cần tạo 2 SKU.
- `note` trên "Rượu Sâm Ngọc Linh Ngâm Lá 750ml (bản 2)" (khanhthanh): 2 SKU
  trùng tên hiển thị nhưng khác slug/giá/ảnh trên site gốc — verify lại 1
  lần trên site thật trước khi thêm cả 2, tránh trùng lặp giả.
- "Lá Sâm Ngọc Linh Tươi" (khanhthanh) có 2 biến thể giá (lá lớn/nhỏ) — JSON
  mới lấy 1 giá, thêm biến thể thứ 2 nếu Joe muốn đủ.

### Phiên Qwen/Ox — Task B: onboard 4 nhà cung cấp mới (dữ liệu THẬT trong phase11_scraped_products.json)

```
Mục đích: Thêm sản phẩm thật từ 4 site sau vào catalog TA, theo ĐÚNG pattern
Branded House đã dùng cho vkd/trimico/samk5/truongnhan (xem comment đầu
trimicoProducts.ts) — khách hàng chỉ thấy thương hiệu "TA", supplierId chỉ
để nội bộ đối chiếu giao hàng.

4 supplierId MỚI cần thêm vào type `SupplierId` (products.ts dòng 10):
  'samtramy' | 'tumorong' | 'tumorongshop' | 'khanhthanh'

Nguồn 1 — samtramy.com (SKU prefix "STM-"):
  Danh mục: https://samtramy.com/san-pham/ — 17 sản phẩm, 3 trang (?paged=2, ?paged=3)
  Đã khảo sát trang 1 (8/12 sản phẩm hiện, WebFetch trả về không đủ 12 —
  RECHECK lại số lượng thật khi cào, KHÔNG tin số cũ mù quáng): Bia Tươi Sâm
  Ngọc Linh lon 1L, Bia Tươi Sâm Ngọc Linh Két 6 chai, Dầu Thảo Dược Sâm Ngọc
  Linh, Thạch Sâm Ngọc Linh Collagen Samtramy, Rượu Whisky Sâm Ngọc Linh
  500ml, Samy - Rượu trái cây lên men, Set 6 Hũ Yến Sâm Ngọc Linh, Yến Sâm
  Ngọc Linh. CÀO NỐT trang 2-3 để đủ 17.

Nguồn 2 — tumorong.com.vn (SKU prefix "TMR-"):
  Danh mục: https://tumorong.com.vn/danh-muc-san-pham/thuc-pham-chuc-nang/
  — 13 sản phẩm (đã liệt kê đủ, không phân trang): Cà Phê Sâm Ngọc Linh, Dầu
  Gió Thượng Đảng Nhân Sâm, Dưỡng chất sâm Ngọc Linh mật ong, Rượu Đẳng Sâm
  Ngũ Vị Tử 500ml (chai vuông), Rượu Ngọc Linh Đẳng Sâm Ngũ Vị Tử (chai
  tròn), Rượu Sâm Ngọc Linh Atuagin Black 500ml, Rượu Sâm Ngọc Linh Atuagin
  Green 500ml, Rượu Sâm Ngọc Linh Tumorong Blue Label 500ml, Rượu Sâm Ngọc
  Linh Tumorong Gold Label 750ml, Sâm Ngọc Linh Ngâm Mật Ong, Thạch Collagen
  Sâm Ngọc Linh, Trà Ô Long Sâm Ngọc Linh, Trà Sâm Ngọc Linh Tumorong.

Nguồn 3 — shop.tumorong.com (WooCommerce, SKU prefix "TMS-"):
  Full catalog: https://shop.tumorong.com/shop (WebFetch trang này trước —
  homepage chỉ hiện 10/? sản phẩm, RECHECK số thật ở /shop). Đã thấy: Sâm
  Ngọc Linh Ngâm Mật Ong, Rượu ATUAGIN Black/500ml/Gold 750ml/Green 500ml,
  Rượu Sâm Ngọc Linh Dragon, Rượu Đẳng Sâm Ngũ Vị 500ml, Cà Phê Hòa Tan Sâm
  Ngọc Linh, Trà Ô Long Sâm Ngọc Linh, Trà Hòa Tan Sâm Ngọc Linh.
  LƯU Ý: sản phẩm trùng tên với Nguồn 2 (cùng công ty Tumorong, 2 site khác
  nhau) — so sánh kỹ trước khi thêm, KHÔNG tạo SKU trùng lặp cho cùng 1 sản
  phẩm vật lý (chỉ giữ 1 bản, ghi rõ sourceUrl là site nào giá đúng/mới hơn).

Nguồn 4 — samngoclinhkhanhthanh.com.vn (Shopify, SKU prefix "KT-"):
  Danh mục: https://samngoclinhkhanhthanh.com.vn/collections/all?page=1 và
  ?page=2 — 23 sản phẩm tổng, đã liệt kê 20 ở trang 1 (rượu ngâm lá/củ tươi,
  sâm ngâm mật ong, lá sâm khô/tươi, củ sâm tươi loại 1-4). CÀO NỐT trang 2
  (3 sản phẩm còn lại).
  CẢNH BÁO GIÁ: "Củ Sâm Ngọc Linh Tươi Loại 1" = 290,000,000đ/loại là giá
  thật trên site gốc (sâm nguyên củ cực hiếm, không phải lỗi nhập liệu) —
  giữ nguyên, không tự ý sửa/làm tròn.

Quy trình cho mỗi sản phẩm (dữ liệu ở bước 1 ĐÃ CÀO SẴN, không cần WebFetch lại):
1. Đọc `tasks/phase11_scraped_products.json` (đã cào 2026-09-05, nguyên văn
   từ trang gốc) — dùng field `description_vi`/`ingredients_vi`/`usage_vi`/
   `warnings_vi` làm nguồn, KHÔNG tự viết lại/bịa thêm công dụng.
2. ẢNH: Joe tự nén theo chuẩn TA + tự upload qua admin
   `/gate-vkd-control-2026/products` — Task B KHÔNG cần tải ảnh về
   `public/products/<supplier>/` nữa. Tạm thời gán thẳng `image_url` từ JSON
   vào field `image` của SKU mới (ảnh gốc trên site NCC, dùng tạm cho tới
   khi Joe thay qua admin) — KHÔNG cần tạo thư mục ảnh riêng cho 4 NCC này.
3. Map `category` (CategoryId: 'sam-ngoc-linh' | 'dac-san-vn' | 'to-yen' |
   'other') và `productType` (ProductTypeId trong productTypes.ts — 7 loại
   có sẵn: sam-cu-tuoi-kho, sam-ngam-mat-ong, tra-nuoc-uong-sam, ruou-sam,
   nam-lim-duoc-lieu, my-pham-sam, set-qua-tang). Ưu tiên map vào loại có
   sẵn (bia/rượu/whisky → ruou-sam; cà phê/trà → tra-nuoc-uong-sam; sâm
   ngâm mật ong → sam-ngam-mat-ong; lá/củ sâm tươi khô → sam-cu-tuoi-kho).
   CHỈ thêm ProductTypeId mới (vd. cho dầu thảo dược/dầu gió, thạch
   collagen dạng ăn được nếu không hợp my-pham-sam) nếu THẬT SỰ không loại
   nào hợp — báo rõ cho Claude lý do trước khi thêm field mới vào enum.
4. Điền `nameEn/Zh/Fr`, `descriptionEn/Zh/Fr`, `activeIngredientEn/Zh/Fr`
   (field mới từ Task A) ngay khi thêm SKU — KHÔNG để trống rồi tính sau
   (tránh lặp lại đúng lỗi Task A đang phải sửa).
5. Thêm entry vào `src/data/products.ts` bằng Edit (không viết lại toàn
   file). Tạo file backend riêng `<supplierId>Products.ts` (copy pattern
   `trimicoProducts.ts`) để đối chiếu nội bộ theo NCC — comment đầu file ghi
   rõ ngày cào + URL nguồn, và liệt kê SKU nào bị loại vì "hết hàng" trên
   site gốc tại thời điểm cào (nếu có).
6. Thêm pattern chặn brand leak vào `BANNED_PATTERNS`
   (`scripts/check-no-supplier-names.js` dòng ~50): `/Samtramy/i`,
   `/Tumorong/i`, `/Atuagin/i`, `/Khánh\s*Thành/i` — chạy
   `npm run check:brand` để xác nhận không rò tên NCC ra UI khách.

Test bắt buộc:
- `npm run check:brand && npx tsc -b && npm run build` sạch
- `npm run preview` mở trang danh mục sản phẩm, xác nhận SKU mới hiện đúng
  ảnh tạm (URL gốc từ JSON, sẽ được Joe thay bằng ảnh nén qua admin sau) +
  đúng category, không hiện tên NCC gốc ở bất kỳ đâu trên UI

Nếu 1 sản phẩm thiếu mô tả/giá thật trong JSON (site lỗi, hết hàng — đã ghi
`hidden_reason`): đặt `hidden: true`, KHÔNG tự chế mô tả/giá giả.
```

### Phiên Qwen — Task B2: giá "Liên hệ" bấm được → Zalo (VI) / WhatsApp (EN/FR/ZH)

```
Mục đích: Sản phẩm giá cực cao hoặc "Liên hệ" (lá sâm, củ sâm nguyên cây,
sâm nguyên cây, vài SKU Samtramy giá "Liên hệ" — toàn bộ Task B ở trên đã
đánh dấu price_vnd: null cho các SKU này) hiện tại chỉ hiện chữ tĩnh "Liên
hệ"/"Contact us" (xem `formatPrice()` trong ProductCatalog.tsx dòng 32-37 và
ProductDetail.tsx dòng 180) — KHÔNG bấm được, khách không biết liên hệ đâu.
Yêu cầu: bấm vào chữ đó phải mở Zalo (tiếng Việt) hoặc WhatsApp (EN/FR/ZH),
số đã có sẵn dùng thống nhất toàn site: `https://zalo.me/0984999309` (VI) /
`https://wa.me/84984999309` (EN/FR/ZH) — xem FounderStory.tsx dòng 193-201
đã dùng đúng 2 URL này, COPY NGUYÊN, không tự bịa số khác.

File 1: src/components/ProductCatalog.tsx
- Thêm hàm helper ngay dưới `formatPrice` (dòng ~37):
  function contactUrl(lang: Language): string {
    return lang === 'vi' ? 'https://zalo.me/0984999309' : 'https://wa.me/84984999309';
  }
- Dòng 814, chỗ render `{formatPrice(product.price, lang)}`: nếu
  `product.price === null`, render thành `<a href={contactUrl(lang)}
  target="_blank" rel="noopener noreferrer" className="underline
  decoration-dotted hover:text-gold-600" onClick={(e) =>
  e.stopPropagation()}>{formatPrice(product.price, lang)}</a>` thay vì text
  thường (giữ nguyên style cũ khi price khác null). `onClick`
  `stopPropagation` bắt buộc vì cả card đang nằm trong `<a>`
  điều hướng sang trang chi tiết (xem dòng 733-739) — không chặn sẽ vừa mở
  Zalo/WhatsApp vừa điều hướng nhầm trang.

File 2: src/components/ProductDetail.tsx
- Thêm cùng hàm `contactUrl(lang)` ngay dưới `formatPrice` (dòng ~180).
- Dòng 374, `{formatPrice(product.price, lang)}` trong khối giá: bọc trong
  `<a>` giống trên khi `product.price === null` (không cần stopPropagation
  ở đây vì không nằm trong link cha nào).
- Dòng 394-399 (khối box "Liên hệ" màu xanh nhạt hiện khi price == null):
  bọc CẢ KHỐI trong `<a href={contactUrl(lang)} target="_blank"
  rel="noopener noreferrer">` để bấm vào đâu trong box cũng mở được Zalo/WhatsApp,
  thêm hover state nhẹ (vd. `hover:bg-forest-100 transition-colors`) để rõ là
  bấm được.

Test bắt buộc:
- `npx tsc --noEmit` sạch
- `npm run preview`: mở 1 sản phẩm giá null (vd. SKU "Củ Sâm Ngọc Linh Tươi
  Loại 1" sau khi Task B thêm xong) ở lang=vi → bấm vào "Liên hệ" phải mở
  tab mới `https://zalo.me/0984999309`. Đổi lang sang EN → chữ "Contact us"
  bấm phải mở `https://wa.me/84984999309`. Test cả trên card ở trang danh
  mục (không được vô tình điều hướng sang trang chi tiết khi bấm).

Nếu lỗi: ghi rõ dòng nào, không bỏ qua lỗi TypeScript.
```

### Phiên Ox — Task C: đồng bộ Supabase admin sau khi Task B xong

```
Mục đích: Sau khi Task B thêm xong SKU mới vào products.ts, đồng bộ sang
bảng Supabase `products` để trang admin "Sản phẩm & Kho" hiện đúng (xem quy
trình đầy đủ trong skill `update-vkd-products` mục "Dong bo Supabase admin"
— project_id, category_id mapping 6/7/8 đã ghi rõ ở đó, không lặp lại đây).
Sync CHỈ thêm/update SKU mới, KHÔNG đụng cột `active`/`stock_qty` của SKU
cũ đã có trong bảng.

Test: `select count(*) from products;` >= tổng SKU trong products.ts sau
Task B.
```

### Chứng nhận tumorong.com — Joe tự làm (2026-09-05, KHÔNG giao Qwen/Ox)

Joe xác nhận: phần giấy chứng nhận (nhãn hiệu #548804, mã vùng trồng, OCOP,
VIETKINGS của Tu Mơ Rông) Joe tự cào và tự up lên admin. Qwen/Ox KHÔNG động
vào Certifications.tsx hay mục chứng nhận trong brief này — chỉ tập trung
Task A (fix dịch) + Task B (cào sản phẩm) + Task C (sync Supabase) ở trên.
