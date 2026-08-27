import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus, Eye, EyeOff, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { fetchPageSectionsForAdmin, updatePageSection, deletePageSection, reorderPageSections, createPageSection } from '../adminApi';
import type { PageSection } from '../../lib/siteContentApi';

const PAGE_OPTIONS = [
  { key: 'home', label: 'Trang Chủ' },
  { key: 'about', label: 'Giới Thiệu' },
  { key: 'heritage', label: 'Vùng Trồng' },
  { key: 'products', label: 'Sản Phẩm' },
  { key: 'b2b', label: 'Hợp Tác B2B' },
  { key: 'contact', label: 'Liên Hệ' },
];

const BLOCK_TYPES = ['hero', 'text', 'image', 'image-text', 'cta', 'gallery', 'testimonial', 'faq'];

interface EditState {
  title_vi: string;
  content_vi: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  block_type: string;
}

export default function PageBuilderPage() {
  const [pageKey, setPageKey] = useState('home');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({ title_vi: '', content_vi: '', image_url: '', cta_text: '', cta_url: '', block_type: 'text' });
  const [adding, setAdding] = useState(false);
  const [newBlock, setNewBlock] = useState<EditState>({ title_vi: '', content_vi: '', image_url: '', cta_text: '', cta_url: '', block_type: 'text' });

  useEffect(() => {
    setLoading(true);
    setEditId(null);
    fetchPageSectionsForAdmin(pageKey)
      .then(setSections)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [pageKey]);

  const move = async (idx: number, dir: -1 | 1) => {
    const next = [...sections];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setSections(next);
    try {
      await reorderPageSections(next.map((s) => s.id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi sắp xếp');
    }
  };

  const toggleVisible = async (s: PageSection) => {
    setSaving(s.id);
    try {
      await updatePageSection(s.id, { visible: !s.visible });
      setSections(sections.map((sec) => sec.id === s.id ? { ...sec, visible: !sec.visible } : sec));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi');
    } finally {
      setSaving(null);
    }
  };

  const startEdit = (s: PageSection) => {
    setEditId(s.id);
    setEditState({ title_vi: s.title_vi ?? '', content_vi: s.content_vi ?? '', image_url: s.image_url ?? '', cta_text: s.cta_text ?? '', cta_url: s.cta_url ?? '', block_type: s.block_type });
  };

  const saveEdit = async () => {
    if (!editId) return;
    setSaving(editId);
    try {
      await updatePageSection(editId, editState);
      setSections(sections.map((s) => s.id === editId ? { ...s, ...editState } : s));
      setEditId(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu');
    } finally {
      setSaving(null);
    }
  };

  const del = async (id: string) => {
    if (!confirm('Xóa block này?')) return;
    setSaving(id);
    try {
      await deletePageSection(id);
      setSections(sections.filter((s) => s.id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi xóa');
    } finally {
      setSaving(null);
    }
  };

  const addSection = async () => {
    try {
      await createPageSection({ page_key: pageKey, sort_order: sections.length, ...newBlock });
      setAdding(false);
      const fresh = await fetchPageSectionsForAdmin(pageKey);
      setSections(fresh);
      setNewBlock({ title_vi: '', content_vi: '', image_url: '', cta_text: '', cta_url: '', block_type: 'text' });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi thêm');
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Page Builder</h1>
          <p className="text-forest-500 text-sm mt-0.5">Chỉnh sửa nội dung từng trang</p>
        </div>
        <select
          value={pageKey}
          onChange={(e) => setPageKey(e.target.value)}
          className="px-3 py-2 border border-forest-200 rounded-lg text-sm focus:outline-none focus:border-forest-500"
        >
          {PAGE_OPTIONS.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="underline">Đóng</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-forest-500">Đang tải...</div>
      ) : (
        <div className="space-y-3">
          {sections.length === 0 && (
            <div className="text-center py-10 text-forest-400 border-2 border-dashed border-forest-200 rounded-xl">
              Chưa có block nào cho trang này.
            </div>
          )}

          {sections.map((s, idx) => (
            <div key={s.id} className={`rounded-xl border ${saving === s.id ? 'opacity-50 pointer-events-none' : ''} ${s.visible ? 'border-forest-200 bg-white' : 'border-dashed border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-0.5 text-forest-400 hover:text-forest-700 disabled:opacity-30">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => move(idx, 1)} disabled={idx === sections.length - 1} className="p-0.5 text-forest-400 hover:text-forest-700 disabled:opacity-30">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2 py-0.5 bg-forest-100 text-forest-700 rounded text-xs font-mono">{s.block_type}</span>
                    <span className="font-medium text-forest-900 truncate">{s.title_vi || '(chưa có tiêu đề)'}</span>
                  </div>
                  {s.content_vi && <p className="text-xs text-forest-500 mt-0.5 line-clamp-1">{s.content_vi}</p>}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleVisible(s)} className={`p-1.5 rounded hover:bg-forest-100 ${s.visible ? 'text-forest-600' : 'text-gray-400'}`} title={s.visible ? 'Đang hiện — click để ẩn' : 'Đang ẩn — click để hiện'}>
                    {s.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => (editId === s.id ? setEditId(null) : startEdit(s))} className="px-3 py-1.5 text-xs bg-forest-600 text-white rounded hover:bg-forest-700">
                    {editId === s.id ? 'Đóng' : 'Sửa'}
                  </button>
                  <button onClick={() => del(s.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {editId === s.id && (
                <div className="border-t border-forest-100 px-4 py-4 space-y-3 bg-forest-50/50">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-forest-600 mb-1">Block type</label>
                      <select value={editState.block_type} onChange={(e) => setEditState({ ...editState, block_type: e.target.value })} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500">
                        {BLOCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-forest-600 mb-1">Tiêu đề (VI)</label>
                      <input type="text" value={editState.title_vi} onChange={(e) => setEditState({ ...editState, title_vi: e.target.value })} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-forest-600 mb-1">Nội dung (VI)</label>
                    <textarea value={editState.content_vi} onChange={(e) => setEditState({ ...editState, content_vi: e.target.value })} rows={3} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500 resize-y" />
                  </div>
                  <div>
                    <label className="block text-xs text-forest-600 mb-1">URL ảnh</label>
                    <input type="text" value={editState.image_url} onChange={(e) => setEditState({ ...editState, image_url: e.target.value })} placeholder="https://..." className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-forest-600 mb-1">CTA Text</label>
                      <input type="text" value={editState.cta_text} onChange={(e) => setEditState({ ...editState, cta_text: e.target.value })} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-forest-600 mb-1">CTA URL</label>
                      <input type="text" value={editState.cta_url} onChange={(e) => setEditState({ ...editState, cta_url: e.target.value })} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={saveEdit} disabled={saving === s.id} className="bg-forest-600 hover:bg-forest-700 text-white text-sm">
                      <Save className="w-3.5 h-3.5 mr-1.5" /> Lưu
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {adding && (
            <div className="rounded-xl border-2 border-dashed border-gold-400 bg-gold-50/30 p-4 space-y-3">
              <h3 className="font-semibold text-forest-800 text-sm">Thêm block mới</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-forest-600 mb-1">Block type</label>
                  <select value={newBlock.block_type} onChange={(e) => setNewBlock({ ...newBlock, block_type: e.target.value })} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500">
                    {BLOCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-forest-600 mb-1">Tiêu đề</label>
                  <input type="text" value={newBlock.title_vi} onChange={(e) => setNewBlock({ ...newBlock, title_vi: e.target.value })} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-forest-600 mb-1">Nội dung</label>
                <textarea value={newBlock.content_vi} onChange={(e) => setNewBlock({ ...newBlock, content_vi: e.target.value })} rows={2} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500 resize-y" />
              </div>
              <div>
                <label className="block text-xs text-forest-600 mb-1">URL ảnh</label>
                <input type="text" value={newBlock.image_url} onChange={(e) => setNewBlock({ ...newBlock, image_url: e.target.value })} placeholder="https://..." className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setAdding(false)} className="text-sm">Hủy</Button>
                <Button onClick={addSection} className="bg-gold-500 hover:bg-gold-600 text-forest-900 text-sm">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Thêm
                </Button>
              </div>
            </div>
          )}

          {!adding && (
            <button onClick={() => setAdding(true)} className="w-full py-3 border-2 border-dashed border-forest-200 rounded-xl text-forest-400 hover:border-forest-400 hover:text-forest-600 transition-colors flex items-center justify-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Thêm block
            </button>
          )}
        </div>
      )}
    </div>
  );
}
