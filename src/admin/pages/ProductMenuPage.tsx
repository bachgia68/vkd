import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Eye, EyeOff, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { fetchAllProductMenuItems, createProductMenuItem, updateProductMenuItem, deleteProductMenuItem } from '../adminApi';
import type { ProductMenuItem } from '../../lib/siteContentApi';

const SECTIONS: { key: string; label: string }[] = [
  { key: 'sam', label: 'Sản phẩm Sâm' },
  { key: 'dac_san', label: 'Đặc Sản Việt Nam' },
  { key: 'health', label: 'Theo Mục Tiêu' },
];

const emptyNew = (): Omit<ProductMenuItem, 'id'> => ({
  section: 'sam', slug: '', label_vi: '', label_en: '', href: '', sort_order: 0, visible: true,
});

export default function ProductMenuPage() {
  const [items, setItems] = useState<ProductMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ProductMenuItem>>({});
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState(emptyNew());

  const load = () => {
    setLoading(true);
    fetchAllProductMenuItems()
      .then(setItems)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggle = async (item: ProductMenuItem) => {
    setSaving(item.id);
    try {
      await updateProductMenuItem(item.id, { visible: !item.visible });
      setItems(items.map((i) => i.id === item.id ? { ...i, visible: !item.visible } : i));
    } catch (e) { setError((e as Error).message); }
    finally { setSaving(null); }
  };

  const startEdit = (item: ProductMenuItem) => {
    setEditId(item.id);
    setEditData({ label_vi: item.label_vi, label_en: item.label_en, href: item.href });
  };

  const saveEdit = async () => {
    if (!editId) return;
    setSaving(editId);
    try {
      await updateProductMenuItem(editId, editData);
      setItems(items.map((i) => i.id === editId ? { ...i, ...editData } : i));
      setEditId(null);
    } catch (e) { setError((e as Error).message); }
    finally { setSaving(null); }
  };

  const del = async (id: string) => {
    if (!confirm('Xóa item này?')) return;
    try { await deleteProductMenuItem(id); setItems(items.filter((i) => i.id !== id)); }
    catch (e) { setError((e as Error).message); }
  };

  const add = async () => {
    if (!newItem.slug || !newItem.label_vi || !newItem.href) { setError('Cần slug, label VI, href'); return; }
    try {
      await createProductMenuItem({ ...newItem, sort_order: items.filter((i) => i.section === newItem.section).length });
      setAdding(false); setNewItem(emptyNew()); load();
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Menu Sản Phẩm</h1>
          <p className="text-sm text-forest-500 mt-0.5">Thêm / sửa / ẩn / xóa items trong dropdown Sản Phẩm trên Header</p>
        </div>
        <Button onClick={() => setAdding(true)} className="bg-forest-600 hover:bg-forest-700 text-white text-sm">
          <Plus className="w-4 h-4 mr-1.5" /> Thêm item
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between">
          <span>{error}</span><button onClick={() => setError(null)} className="underline">Đóng</button>
        </div>
      )}

      {loading ? <div className="text-forest-500 text-sm">Đang tải...</div> : (
        <div className="space-y-6">
          {SECTIONS.map((sec) => {
            const sectionItems = items.filter((i) => i.section === sec.key);
            return (
              <div key={sec.key}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-forest-400 mb-2">{sec.label} ({sectionItems.length})</h2>
                <div className="space-y-2">
                  {sectionItems.map((item) => (
                    <div key={item.id} className={`rounded-xl border px-4 py-3 ${saving === item.id ? 'opacity-50 pointer-events-none' : ''} ${item.visible ? 'border-forest-200 bg-white' : 'border-dashed border-gray-200 bg-gray-50'}`}>
                      {editId === item.id ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-forest-600 mb-0.5">Label VI</label>
                              <input value={editData.label_vi ?? ''} onChange={(e) => setEditData((d) => ({ ...d, label_vi: e.target.value }))}
                                className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs text-forest-600 mb-0.5">Label EN</label>
                              <input value={editData.label_en ?? ''} onChange={(e) => setEditData((d) => ({ ...d, label_en: e.target.value }))}
                                className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs text-forest-600 mb-0.5">Href / route</label>
                              <input value={editData.href ?? ''} onChange={(e) => setEditData((d) => ({ ...d, href: e.target.value }))}
                                className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm font-mono focus:outline-none" />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setEditId(null)} className="text-xs h-8">Hủy</Button>
                            <Button onClick={saveEdit} className="bg-forest-600 hover:bg-forest-700 text-white text-xs h-8"><Save className="w-3 h-3 mr-1" />Lưu</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-forest-900 flex-1">{item.label_vi}</span>
                          <span className="text-xs text-forest-400 hidden md:block max-w-[160px] truncate font-mono">{item.href}</span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => toggle(item)} className={`p-1.5 rounded hover:bg-forest-100 ${item.visible ? 'text-forest-600' : 'text-gray-400'}`}>
                              {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button onClick={() => startEdit(item)} className="p-1.5 text-forest-400 hover:text-forest-700 hover:bg-forest-100 rounded"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => del(item.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {adding && (
            <div className="rounded-xl border-2 border-dashed border-gold-400 bg-gold-50/30 p-4 space-y-3">
              <h3 className="font-semibold text-forest-800 text-sm">Thêm menu item mới</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-forest-600 mb-0.5">Nhóm</label>
                  <select value={newItem.section} onChange={(e) => setNewItem((n) => ({ ...n, section: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm">
                    {SECTIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-forest-600 mb-0.5">Slug (unique)</label>
                  <input value={newItem.slug} onChange={(e) => setNewItem((n) => ({ ...n, slug: e.target.value }))} placeholder="vd: my-pham-cao-cap"
                    className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm font-mono focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-forest-600 mb-0.5">Label VI</label>
                  <input value={newItem.label_vi} onChange={(e) => setNewItem((n) => ({ ...n, label_vi: e.target.value }))} placeholder="vd: Mỹ Phẩm Cao Cấp"
                    className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-forest-600 mb-0.5">Label EN</label>
                  <input value={newItem.label_en} onChange={(e) => setNewItem((n) => ({ ...n, label_en: e.target.value }))} placeholder="vd: Premium Cosmetics"
                    className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-forest-600 mb-0.5">Href / route</label>
                  <input value={newItem.href} onChange={(e) => setNewItem((n) => ({ ...n, href: e.target.value }))} placeholder="vd: catalog?type=my-pham-cao-cap"
                    className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm font-mono focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setAdding(false); setNewItem(emptyNew()); }}>Hủy</Button>
                <Button onClick={add} className="bg-gold-500 hover:bg-gold-600 text-forest-900 text-sm"><Plus className="w-3.5 h-3.5 mr-1" />Thêm</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
