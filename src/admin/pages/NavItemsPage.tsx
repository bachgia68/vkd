import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus, Eye, EyeOff, Save, Pencil } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { fetchAllNavItems, updateNavItem, createNavItem, deleteNavItem, reorderNavItems } from '../adminApi';
import type { NavItem } from '../../lib/siteContentApi';

export default function NavItemsPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editHref, setEditHref] = useState('');
  const [adding, setAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newHref, setNewHref] = useState('');

  const load = () => {
    setLoading(true);
    fetchAllNavItems()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : 'Lỗi'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const move = async (idx: number, dir: -1 | 1) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);
    try { await reorderNavItems(next.map((i) => i.id)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Lỗi'); load(); }
  };

  const toggleVisible = async (item: NavItem) => {
    setSaving(item.id);
    try {
      await updateNavItem(item.id, { visible: !item.visible });
      setItems(items.map((i) => i.id === item.id ? { ...i, visible: !item.visible } : i));
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi'); }
    finally { setSaving(null); }
  };

  const startEdit = (item: NavItem) => {
    setEditId(item.id);
    setEditLabel(item.label_vi);
    setEditHref(item.href);
  };

  const saveEdit = async () => {
    if (!editId) return;
    setSaving(editId);
    try {
      await updateNavItem(editId, { label_vi: editLabel, href: editHref });
      setItems(items.map((i) => i.id === editId ? { ...i, label_vi: editLabel, href: editHref } : i));
      setEditId(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi lưu'); }
    finally { setSaving(null); }
  };

  const del = async (id: string) => {
    if (!confirm('Xóa menu item này?')) return;
    setSaving(id);
    try {
      await deleteNavItem(id);
      setItems(items.filter((i) => i.id !== id));
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi xóa'); }
    finally { setSaving(null); }
  };

  const addItem = async () => {
    if (!newKey || !newLabel || !newHref) { setError('Cần điền đủ key, label, href'); return; }
    try {
      await createNavItem({ key: newKey, label_vi: newLabel, href: newHref, sort_order: items.length });
      setAdding(false); setNewKey(''); setNewLabel(''); setNewHref('');
      load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi thêm'); }
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Quản Lý Menu Header</h1>
          <p className="text-forest-500 text-sm mt-0.5">Thêm / sửa / ẩn / xóa / sắp xếp menu điều hướng</p>
        </div>
        <Button onClick={() => setAdding(true)} className="bg-forest-600 hover:bg-forest-700 text-white text-sm">
          <Plus className="w-4 h-4 mr-1.5" /> Thêm item
        </Button>
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
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className={`rounded-xl border px-4 py-3 ${saving === item.id ? 'opacity-50 pointer-events-none' : ''} ${item.visible ? 'border-forest-200 bg-white' : 'border-dashed border-gray-200 bg-gray-50'}`}>
              {editId === item.id ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-forest-600 mb-0.5">Label (VI)</label>
                      <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                        className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-forest-600 mb-0.5">Href / route</label>
                      <input type="text" value={editHref} onChange={(e) => setEditHref(e.target.value)}
                        className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setEditId(null)} className="text-xs h-8">Hủy</Button>
                    <Button onClick={saveEdit} className="bg-forest-600 hover:bg-forest-700 text-white text-xs h-8">
                      <Save className="w-3 h-3 mr-1" /> Lưu
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-0.5 text-forest-400 hover:text-forest-700 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="p-0.5 text-forest-400 hover:text-forest-700 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                  </div>
                  <span className="text-xs text-forest-400 font-mono w-24 truncate">{item.key}</span>
                  <span className="font-medium text-forest-900 flex-1">{item.label_vi}</span>
                  <span className="text-xs text-forest-400 font-mono truncate max-w-[120px]">{item.href}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => toggleVisible(item)} className={`p-1.5 rounded hover:bg-forest-100 ${item.visible ? 'text-forest-600' : 'text-gray-400'}`}>
                      {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => startEdit(item)} className="p-1.5 text-forest-400 hover:text-forest-700 hover:bg-forest-100 rounded"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => del(item.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {adding && (
            <div className="rounded-xl border-2 border-dashed border-gold-400 bg-gold-50/30 p-4 space-y-3">
              <h3 className="font-semibold text-forest-800 text-sm">Thêm menu item mới</h3>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-forest-600 mb-0.5">Key (unique)</label>
                  <input type="text" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="vd: research"
                    className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                </div>
                <div>
                  <label className="block text-xs text-forest-600 mb-0.5">Label hiển thị</label>
                  <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="vd: Nghiên Cứu"
                    className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                </div>
                <div>
                  <label className="block text-xs text-forest-600 mb-0.5">Href / route</label>
                  <input type="text" value={newHref} onChange={(e) => setNewHref(e.target.value)} placeholder="vd: research"
                    className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setAdding(false)} className="text-sm">Hủy</Button>
                <Button onClick={addItem} className="bg-gold-500 hover:bg-gold-600 text-forest-900 text-sm">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Thêm
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
