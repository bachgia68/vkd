# Qwen Task 2: Blog Admin Page + Author/Featured Fields

**Context**: TA site, React + TypeScript + Supabase. Task 1 (URL pagination) đã xong.

**Repo**: D:\TA page\site\ta_production\project

---

## Step 1: Supabase Migration (PHẢI LÀM THỦ CÔNG)

Chạy SQL này trên Supabase SQL Editor (tasamngoclinh.com project):

```sql
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'TA';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT false;
```

→ Chạy xong, tiếp bước 2.

---

## Step 2: Sửa src/lib/siteContentApi.ts

**File**: `src/lib/siteContentApi.ts`

Tìm dòng 109 (hàm `fetchAllBlogPostsForAdmin`). Hiện tại SELECT có:
```
'id, slug, title, excerpt, body, featured_image_url, featured_image_alt, created_at, published, captions'
```

Thay thành:
```typescript
    .select('id, slug, title, excerpt, body, featured_image_url, featured_image_alt, created_at, published, captions, author, featured, pinned')
```

Thêm 3 field `author, featured, pinned` vào cuối SELECT string.

Cũng thêm vào interface `BlogPost` (khoảng line 80):
```typescript
  author?: string | null;
  featured?: boolean | null;
  pinned?: boolean | null;
```

---

## Step 3: Thêm hàm vào src/admin/adminApi.ts

**File**: `src/admin/adminApi.ts`

Thêm hàm này vào cuối file:

```typescript
export async function updateBlogPost(
  id: string,
  updates: {
    author?: string;
    featured?: boolean;
    pinned?: boolean;
    published?: boolean;
    title?: string;
    excerpt?: string;
  }
): Promise<void> {
  const { error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id);
  if (error) throw new Error(error.message);
}
```

---

## Step 4: Tạo src/admin/pages/BlogAdminPage.tsx

**Tạo file mới**: `src/admin/pages/BlogAdminPage.tsx`

Nội dung đầy đủ:

```typescript
import { useState, useEffect } from 'react';
import { fetchAllBlogPostsForAdmin } from '../../lib/siteContentApi';
import { updateBlogPost } from '../adminApi';
import type { BlogPost } from '../../lib/siteContentApi';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllBlogPostsForAdmin()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (post: BlogPost, field: 'featured' | 'pinned' | 'published', value: boolean) => {
    setSaving(post.id);
    try {
      await updateBlogPost(post.id, { [field]: value });
      setPosts(posts.map((p) => p.id === post.id ? { ...p, [field]: value } : p));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  };

  const handleAuthor = async (post: BlogPost, author: string) => {
    setSaving(post.id);
    try {
      await updateBlogPost(post.id, { author });
      setPosts(posts.map((p) => p.id === post.id ? { ...p, author } : p));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-forest-900 mb-2">Quản Lý Blog</h1>
      <p className="text-forest-500 text-sm mb-6">{posts.length} bài viết</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-forest-200">
        <table className="w-full text-sm">
          <thead className="bg-forest-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-forest-700">Tiêu đề</th>
              <th className="px-4 py-3 text-left font-semibold text-forest-700">Tác giả</th>
              <th className="px-4 py-3 text-center font-semibold text-forest-700">Nổi bật</th>
              <th className="px-4 py-3 text-center font-semibold text-forest-700">Ghim</th>
              <th className="px-4 py-3 text-center font-semibold text-forest-700">Publish</th>
              <th className="px-4 py-3 text-left font-semibold text-forest-700">Ngày</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-100">
            {posts.map((post) => (
              <tr key={post.id} className={`hover:bg-forest-50 transition-colors ${saving === post.id ? 'opacity-60' : ''}`}>
                <td className="px-4 py-3">
                  <span className="font-medium text-forest-900 line-clamp-2 max-w-xs block">
                    {post.title}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    defaultValue={post.author ?? 'TA'}
                    onBlur={(e) => {
                      if (e.target.value !== (post.author ?? 'TA')) {
                        handleAuthor(post, e.target.value);
                      }
                    }}
                    className="w-28 px-2 py-1 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={post.featured ?? false}
                    onChange={(e) => handleToggle(post, 'featured', e.target.checked)}
                    className="w-4 h-4 accent-forest-600 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={post.pinned ?? false}
                    onChange={(e) => handleToggle(post, 'pinned', e.target.checked)}
                    className="w-4 h-4 accent-forest-600 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    post.published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {post.published ? 'Live' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-forest-500">
                  {new Date(post.created_at).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## Step 5: Đăng ký route trong src/admin/AdminApp.tsx

**File**: `src/admin/AdminApp.tsx`

Tìm import cuối cùng trong block imports, thêm:
```typescript
import BlogAdminPage from './pages/BlogAdminPage';
```

Tìm route `header-footer`, thêm route mới ngay sau:
```typescript
<Route path="blog-admin" element={<BlogAdminPage />} />
```

---

## Step 6: Thêm nav item trong src/admin/AdminLayout.tsx

**File**: `src/admin/AdminLayout.tsx`

Tìm nav items array (mảng chứa các { label, path, icon }). Thêm item mới (sau "Ngôn Ngữ" hoặc gần nhóm content):
```typescript
{ label: 'Blog Admin', path: '/gate-vkd-control-2026/blog-admin', icon: BookOpen },
```

Nếu `BookOpen` chưa import từ `lucide-react`, thêm vào import.

---

## Verify

Chạy:
```bash
npx tsc --noEmit
```

Phải ra 0 errors (chỉ có 1 warning baseUrl là ok, không phải error).

Commit khi xong:
```bash
git add src/lib/siteContentApi.ts src/admin/adminApi.ts src/admin/pages/BlogAdminPage.tsx src/admin/AdminApp.tsx src/admin/AdminLayout.tsx
git commit -m "feat: blog admin page — author/featured/pinned/published controls"
```

---

## Checklist
- [ ] SQL migration chạy trên Supabase ✓
- [ ] siteContentApi.ts: BlogPost interface + fetchAllBlogPostsForAdmin có author/featured/pinned ✓
- [ ] adminApi.ts: hàm updateBlogPost ✓
- [ ] BlogAdminPage.tsx tạo mới ✓
- [ ] AdminApp.tsx: route blog-admin ✓
- [ ] AdminLayout.tsx: nav item Blog Admin ✓
- [ ] npx tsc --noEmit: 0 errors ✓
- [ ] git commit done ✓
