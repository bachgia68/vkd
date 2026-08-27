import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, ChevronUp, ChevronDown, Eye, EyeOff, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  fetchAllBlogCategories, createBlogCategory, updateBlogCategory,
  deleteBlogCategory, reorderBlogCategories,
} from '../adminApi';
import type { BlogCategory } from '../../lib/siteContentApi';

export default function BlogCategoryPage() {
  const [cats, setCats] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const load = () => {
    setLoading(true);
    fetchAllBlogCategories()
      .then(setCats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const move = async (idx: number, dir: -1 | 1) => {
    const next = [...cats];
    const t = idx + dir;
    if (t < 0 || t >= next.length) return;
    [next[idx], next[t]] = [next[t], next[idx]];
    setCats(next);
    try { await reorderBlogCategories(next.map((c) => c.id)); }
    catch (e) { setError((e as Error).message); load(); }
  };

  const toggle = async (c: BlogCategory) => {
    setSaving(c.id);
    try {
      await updateBlogCategory(c.id, { visible: !c.visible });
      setCats(cats.map((x) => x.id === c.id ? { ...x, visible: !c.visible } : x));
    } catch (e) { setError((e as Error).message); }
    finally { setSaving(null); }
  };

  const startEdit = (c: BlogCategory) => { setEditId(c.id); setEditName(c.name_vi); setEditSlug(c.slug); };

  const saveEdit = async () => {
    if (!editId) return;
    setSaving(editId);
    try {
      await updateBlogCategory(editId, { name_vi: editName, slug: editSlug });
      setCats(cats.map((c) => c.id === editId ? { ...c, name_vi: editName, slug: editSlug } : c));
      setEditId(null);
    } catch (e) { setError((e as Error).message); }
    finally { setSaving(null); }
  };

  const del = async (id: string) => {
    if (!confirm('Xóa danh mục này? Bài viết sẽ mất gắn kết.')) return;
    try { await deleteBlogCategory(id); setCats(cats.filter((c) => c.id !== id)); }
    catch (e) { setError((e as Error).message); }
  };

  const add = async () => {
    if (!newName || !newSlug) { setError('Cần điền tên và slug'); return; }
    try {
      await createBlogCategory(newSlug, newName, cats.length);
      setAdding(false); setNewName(''); setNewSlug('');
      load();
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Danh Mục Blog</h1>
          <p className="text-sm text-forest-500 mt-0.5">Phân loại bài viết — bài viết bắt buộc gắn danh mục</p>
        </div>
        <Button onClick={() => setAdding(true)} className="bg-forest-600 hover:bg-forest-700 text-white text-sm">
          <Plus className="w-4 h-4 mr-1.5" /> Thêm danh mục
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between">
          <span>{error}</span><button onClick={() => setError(null)} className="underline">Đóng</button>
        </div>
      )}

      {loading ? <div className="text-forest-500 text-sm">Đang tải...</div> : (
        <div className="space-y-2">
          {cats.map((c, idx) => (
            <div key={c.id} className={`rounded-xl border px-4 py-3 ${saving === c.id ? 'opacity-50 pointer-events-none' : ''} ${c.visible ? 'border-forest-200 bg-white' : 'border-dashed border-gray-200 bg-gray-50'}`}>
              {editId === c.id ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-forest-600 mb-0.5">Tên danh mục</label>
                      <input value={editName} onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-forest-600 mb-0.5">Slug (URL)</label>
                      <input value={editSlug} onChange={(e) => setEditSlug(e.target.value)}
                        className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500 font-mono" />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setEditId(null)} className="text-xs h-8">Hủy</Button>
                    <Button onClick={saveEdit} className="bg-forest-600 hover:bg-forest-700 text-white text-xs h-8"><Save className="w-3 h-3 mr-1" />Lưu</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-0.5 text-forest-400 hover:text-forest-700 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => move(idx, 1)} disabled={idx === cats.length - 1} className="p-0.5 text-forest-400 hover:text-forest-700 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                  </div>
                  <span className="font-medium text-forest-900 flex-1">{c.name_vi}</span>
                  <span className="text-xs text-forest-400 font-mono">{c.slug}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggle(c)} className={`p-1.5 rounded hover:bg-forest-100 ${c.visible ? 'text-forest-600' : 'text-gray-400'}`}>
                      {c.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => startEdit(c)} className="p-1.5 text-forest-400 hover:text-forest-700 hover:bg-forest-100 rounded"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => del(c.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {adding && (
            <div className="rounded-xl border-2 border-dashed border-gold-400 bg-gold-50/30 p-4 space-y-3">
              <h3 className="font-semibold text-forest-800 text-sm">Thêm danh mục mới</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-forest-600 mb-0.5">Tên danh mục</label>
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="vd: Tin Tức TA"
                    className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                </div>
                <div>
                  <label className="block text-xs text-forest-600 mb-0.5">Slug (URL)</label>
                  <input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="vd: tin-tuc-ta"
                    className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm font-mono focus:outline-none focus:border-forest-500" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setAdding(false)}>Hủy</Button>
                <Button onClick={add} className="bg-gold-500 hover:bg-gold-600 text-forest-900 text-sm"><Plus className="w-3.5 h-3.5 mr-1" />Thêm</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
