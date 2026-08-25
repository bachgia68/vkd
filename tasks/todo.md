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

### Phiên Qwen — test keen-slider thay embla-carousel (NHÁNH RIÊNG, không đụng main)
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

### Checkpoint & Merge
- [ ] Tất cả 6 task chạy xong, các files KHÔNG conflict
- [ ] Claude review PR: `npx tsc --noEmit` sạch, `npm run build` sạch
- [ ] Test homepage fetch từ page_sections, blog pagination URL, admin pages hoạt động
- [ ] git commit + push khi Claude duyệt
