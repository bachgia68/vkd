import { useState, useEffect } from 'react';
import { fetchAllBlogPostsForAdmin, fetchBlogCategories } from '../../lib/siteContentApi';
import { updateBlogPostMeta } from '../adminApi';
import type { BlogPost, BlogCategory } from '../../lib/siteContentApi';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchAllBlogPostsForAdmin(),
      fetchBlogCategories(),
    ]).then(([p, c]) => { setPosts(p); setCategories(c); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (post: BlogPost, field: 'featured' | 'pinned' | 'published', value: boolean) => {
    setSaving(post.id);
    try {
      await updateBlogPostMeta(post.id, { [field]: value });
      setPosts(posts.map((p) => p.id === post.id ? { ...p, [field]: value } : p));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu');
    } finally {
      setSaving(null);
    }
  };

  const handleCategory = async (post: BlogPost, category_id: string) => {
    const val = category_id === '' ? null : category_id;
    if (val === (post.category_id ?? null)) return;
    setSaving(post.id);
    try {
      await updateBlogPostMeta(post.id, { category_id: val });
      setPosts(posts.map((p) => p.id === post.id ? { ...p, category_id: val } : p));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu');
    } finally {
      setSaving(null);
    }
  };

  const handleAuthor = async (post: BlogPost, author: string) => {
    if (author === (post.author ?? 'TA')) return;
    setSaving(post.id);
    try {
      await updateBlogPostMeta(post.id, { author });
      setPosts(posts.map((p) => p.id === post.id ? { ...p, author } : p));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu');
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-forest-600">Đang tải...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-forest-900 mb-1">Quản Lý Blog</h1>
      <p className="text-forest-500 text-sm mb-6">{posts.length} bài viết</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Đóng</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-forest-200">
        <table className="w-full text-sm">
          <thead className="bg-forest-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-forest-700 min-w-[200px]">Tiêu đề</th>
              <th className="px-4 py-3 text-left font-semibold text-forest-700">Danh mục</th>
              <th className="px-4 py-3 text-left font-semibold text-forest-700">Tác giả</th>
              <th className="px-4 py-3 text-center font-semibold text-forest-700">Nổi bật</th>
              <th className="px-4 py-3 text-center font-semibold text-forest-700">Ghim</th>
              <th className="px-4 py-3 text-center font-semibold text-forest-700">Trạng thái</th>
              <th className="px-4 py-3 text-left font-semibold text-forest-700">Ngày</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-100">
            {posts.map((post) => (
              <tr
                key={post.id}
                className={`hover:bg-forest-50 transition-colors ${saving === post.id ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-forest-900 line-clamp-2 block max-w-xs">
                    {post.title}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={post.category_id ?? ''}
                    onChange={(e) => handleCategory(post, e.target.value)}
                    className="w-40 px-2 py-1 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500 bg-white"
                  >
                    <option value="">-- Chưa phân loại --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name_vi}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    defaultValue={post.author ?? 'TA'}
                    onBlur={(e) => handleAuthor(post, e.target.value)}
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
                    post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {post.published ? 'Live' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-forest-500 whitespace-nowrap">
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
