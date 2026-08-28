'use client';

import { useState, useEffect, useCallback } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

type BlogPost = {
  id: string;
  title_vi: string;
  slug_vi: string;
  excerpt_vi: string;
  category: string;
  published: boolean;
  created_at: string;
  compliance_check: string;
};

type Category = 'all' | 'science' | 'lifestyle' | 'heritage' | 'kgc';

const PAGE_SIZE = 20;

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let url = `${SUPABASE_URL}/rest/v1/blog_posts?select=id,title_vi,slug_vi,excerpt_vi,category,published,created_at,compliance_check&order=created_at.desc&offset=${from}&limit=${PAGE_SIZE}`;
      if (category !== 'all') url += `&category=eq.${category}`;

      const countUrl = url.replace(`&offset=${from}&limit=${PAGE_SIZE}`, '&select=count');

      const [res, countRes] = await Promise.all([
        fetch(url, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Range': `${from}-${to}`, 'Range-Unit': 'items', 'Prefer': 'count=exact' } }),
        fetch(countUrl.replace('count=exact', '').replace('&select=count', ''), { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Prefer': 'count=exact', 'select': '*', Head: 'true' } as HeadersInit })
      ]);

      const contentRange = res.headers.get('content-range');
      if (contentRange) {
        const total = parseInt(contentRange.split('/')[1] || '0', 10);
        setTotal(total);
      }

      if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
      const data: BlogPost[] = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [category, page]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const togglePublished = async (post: BlogPost) => {
    setToggling(post.id);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${post.id}`, {
        method: 'PATCH',
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      if (!res.ok) throw new Error('Toggle failed');
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: !p.published } : p));
    } catch (err) {
      alert('Lỗi: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setToggling(null);
    }
  };

  const deleteDraft = async (post: BlogPost) => {
    if (post.published) return;
    if (!confirm(`Xóa draft "${post.title_vi}"?`)) return;
    setDeleting(post.id);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${post.id}`, {
        method: 'DELETE',
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setPosts(prev => prev.filter(p => p.id !== post.id));
      setTotal(t => t - 1);
    } catch (err) {
      alert('Lỗi: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setDeleting(null);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-400">Blog Admin</h1>
          <span className="text-gray-400 text-sm">{total} bài · trang {page + 1}/{totalPages || 1}</span>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {(['all', 'science', 'lifestyle', 'heritage', 'kgc'] as Category[]).map(c => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(0); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === c ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {c === 'all' ? 'Tất cả' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">Đang tải...</div>
        ) : (
          <>
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-left">
                    <th className="px-4 py-3 font-medium">Tiêu đề</th>
                    <th className="px-4 py-3 font-medium w-28">Category</th>
                    <th className="px-4 py-3 font-medium w-24">Status</th>
                    <th className="px-4 py-3 font-medium w-28">Compliance</th>
                    <th className="px-4 py-3 font-medium w-28">Ngày tạo</th>
                    <th className="px-4 py-3 font-medium w-36 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        Không có bài viết nào
                      </td>
                    </tr>
                  ) : posts.map(post => (
                    <tr key={post.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white line-clamp-1">{post.title_vi}</div>
                        <div className="text-gray-500 text-xs mt-0.5 line-clamp-1">{post.slug_vi}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => togglePublished(post)}
                          disabled={toggling === post.id}
                          className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                            post.published
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          }`}
                        >
                          {toggling === post.id ? '...' : post.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${
                          post.compliance_check === 'PASS' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {post.compliance_check?.substring(0, 20)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <a
                            href={`/blog/${post.slug_vi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded text-xs bg-blue-900/50 text-blue-300 hover:bg-blue-900 transition-colors"
                          >
                            Preview
                          </a>
                          {!post.published && (
                            <button
                              onClick={() => deleteDraft(post)}
                              disabled={deleting === post.id}
                              className="px-2 py-1 rounded text-xs bg-red-900/50 text-red-400 hover:bg-red-900 transition-colors disabled:opacity-50"
                            >
                              {deleting === post.id ? '...' : 'Xóa'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 text-sm"
                >
                  ← Trước
                </button>
                <span className="px-4 py-2 text-gray-400 text-sm">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 text-sm"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
