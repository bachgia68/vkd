# Qwen Phase 10 Tasks 1-3: Blog Pagination + Admin + Supabase Table

**Context**: TA site blog upgrade. Bạn sẽ làm 3 tasks độc lập (có thể song song hoặc tuần tự).

**Repo**: D:\TA page\site\ta_production\project (npm run dev để test)

---

## Task 1: Fix Blog Pagination URL Params (Shareable Links)

**Purpose**: Blog page `/blog?page=2` phải lưu được trang hiện tại khi refresh browser.

**File modify**: `src/components/Blog.tsx` (lines 179-201)

**Current problem**: Pagination state chỉ dùng React state (setPage), URL không đổi, page reset khi refresh.

**Solution**:
1. Import `useSearchParams` từ React Router (hoặc `useLocation` nếu dùng `window.location`)
   ```typescript
   import { useSearchParams } from 'react-router-dom';
   ```

2. Inside `export default function Blog()`, extract page từ URL:
   ```typescript
   const [searchParams, setSearchParams] = useSearchParams();
   const initialPage = parseInt(searchParams.get('page') || '1', 10);
   const [page, setPage] = useState(initialPage);
   ```

3. Khi user click pagination button (lines 268-297), update URL:
   ```typescript
   onClick={() => {
     setPage(p);
     setSearchParams({ page: String(p) });
     window.scrollTo({ top: 0, behavior: 'smooth' });
   }}
   ```

**Test criteria**:
- Navigate `/blog` → page 1 ✓
- Click button "2" → URL thành `/blog?page=2` ✓
- Refresh trên `/blog?page=2` → vẫn ở trang 2 (không reset trang 1) ✓
- Back button browser hoạt động ✓

**Error handling**: Nếu lỗi "useSearchParams not found", check React Router version (cần v6+). Nếu lỗi khác, ghi rõ error message + line number, KHÔNG cố fix bằng cách bỏ qua.

---

## Task 2: Blog Admin Page + Author/Featured Fields

**Purpose**: Trang admin để quản lý blog posts, set featured posts, edit author.

**Step 2a: Supabase Migration** (RUN FIRST, không cần code)
```sql
ALTER TABLE blog_posts ADD COLUMN author TEXT DEFAULT 'TA';
ALTER TABLE blog_posts ADD COLUMN featured BOOLEAN DEFAULT false;
ALTER TABLE blog_posts ADD COLUMN pinned BOOLEAN DEFAULT false;
```
→ Chạy trên Supabase SQL Editor, xong → continue task 2b

**Step 2b: Files modify/create**:

**File 1**: `src/lib/siteContentApi.ts` (line 109)
- Thêm 3 columns vào SELECT:
```typescript
export async function fetchAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, body, featured_image_url, featured_image_alt, created_at, published, captions, author, featured, pinned') // ADD: author, featured, pinned
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
```

**File 2**: `src/admin/adminApi.ts` (ADD NEW function at end)
```typescript
export async function updateBlogPost(
  id: string,
  updates: {
    author?: string;
    featured?: boolean;
    pinned?: boolean;
    published?: boolean;
  }
) {
  const { error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id);
  if (error) throw new Error(error.message);
}
```

**File 3**: `src/admin/pages/BlogPage.tsx` (CREATE NEW)
- Copy pattern từ `SiteSectionsPage.tsx` hoặc `TrustProofPage.tsx` để match style
- Render table: Title | Date | Author | Featured? | Pinned? | Published | Actions
- Fetch: `fetchAllBlogPostsForAdmin()` từ siteContentApi
- Edit modal: form với fields (author text, featured checkbox, pinned checkbox, published checkbox)
- Save button → gọi `updateBlogPost()`
- Delete button (chỉ nếu draft, nếu published thì disable)

**File 4**: `src/admin/AdminApp.tsx`
- Import `BlogPage` từ `./pages/BlogPage`
- Thêm route:
```typescript
<Route path="/blog" element={<BlogPage />} />
```

**File 5**: `src/admin/AdminLayout.tsx`
- Thêm nav item (sidebar menu):
```typescript
{
  label: 'Blog',
  path: '/gate-vkd-control-2026/blog',
  icon: BookOpen, // hoặc icon nào match
}
```

**Test criteria**:
- Admin vào `/gate-vkd-control-2026/blog` → thấy 56 bài viết trong table ✓
- Edit 1 bài: change author → "Nguyễn Văn A", tick featured → Save ✓
- Refresh admin page → author + featured checkbox vẫn lưu ✓
- Frontend homepage: carousel "Bài Viết Nổi Bật" (Blog.tsx lines 204-253) hiện featured posts từ Supabase ✓
- `npx tsc --noEmit` sạch, KHÔNG có TypeScript errors ✓

**Error handling**: Nếu TypeScript error, ghi rõ dòng nào + message, không bỏ qua `--noEmit`.

---

## Task 3: Create Supabase page_sections Table + RLS

**Purpose**: Tạo table Supabase để lưu content blocks cho homepage, about, heritage, v.v.

**Steps**:

1. Mở Supabase dashboard (project "tasamngoclinh.com")

2. SQL Editor → Run query:
```sql
CREATE TABLE page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  block_type text NOT NULL,
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
```

3. Enable RLS (Row-Level Security):
   - Table `page_sections` → RLS ON

4. Create policies:

**Policy 1 - Public Read**:
```sql
CREATE POLICY "Public can read visible sections"
ON page_sections FOR SELECT
USING (visible = true);
```

**Policy 2 - Admin Full Access**:
```sql
CREATE POLICY "Admins can manage sections"
ON page_sections FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users WHERE role = 'admin'
  )
);
```

**Test criteria**:
- Table `page_sections` visible trong Supabase Dashboard ✓
- RLS enabled ✓
- Can SELECT visible=true rows (test từ siteContentApi.ts task 4) ✓
- Admin can INSERT/UPDATE/DELETE (test từ admin page task 5) ✓

**Error handling**: Nếu SQL error, ghi rõ error message từ Supabase, không cố sửa bằng cách bỏ qua.

---

## Summary

Qwen sẽ làm **3 tasks hoàn toàn độc lập**:
- Task 1: React component + routing
- Task 2: React admin UI + TypeScript
- Task 3: Supabase DDL + RLS

**Báo lại khi xong**:
- Commit message cho mỗi task (nếu riêng biệt) hoặc 1 commit chứa cả 3
- `npx tsc --noEmit` output (phải sạch, không warning)
- Test results từ mỗi task

---

## Quick Checklist (Qwen)
- [ ] Task 1: URL pagination `?page=2` works + deep link + refresh ok
- [ ] Task 2: Blog admin page render, edit author/featured, Supabase update ok
- [ ] Task 3: page_sections table created, RLS policies enabled
- [ ] `npx tsc --noEmit` passes (zero errors)
- [ ] All 3 tasks ready to merge (no conflicting files)
