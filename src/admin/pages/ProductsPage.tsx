import { useState, useRef } from 'react';
import { Plus, Pencil, EyeOff, Eye, Trash2, Leaf, Package, ShieldCheck, Upload, Check, X } from 'lucide-react';
import { ADMIN_PRODUCTS, PRODUCT_CATEGORIES, fmt, type AdminProduct, type ProductStatus } from '../adminMockData';

const ICONS = { leaf: Leaf, box: Package, shield: ShieldCheck };

const STATUS_LABEL: Record<ProductStatus, string> = {
  active: 'Đang bán',
  hidden: 'Đã ẩn',
  out_of_stock: 'Hết hàng',
};
const STATUS_TONE: Record<ProductStatus, string> = {
  active: 'bg-forest-50 text-forest-700',
  hidden: 'bg-cream-200 text-cream-800',
  out_of_stock: 'bg-red-50 text-red-600',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(ADMIN_PRODUCTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ name: string; price: string }>({ name: '', price: '' });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const startEdit = (p: AdminProduct) => {
    setEditingId(p.id);
    setEditDraft({ name: p.name, price: String(p.price) });
  };

  const saveEdit = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: editDraft.name, price: Number(editDraft.price) || p.price } : p))
    );
    setEditingId(null);
    showToast('Đã cập nhật sản phẩm');
  };

  const toggleVisibility = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id || p.status === 'out_of_stock') return p;
        return { ...p, status: p.status === 'active' ? 'hidden' : 'active' };
      })
    );
  };

  const confirmDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget));
    setDeleteTarget(null);
    showToast('Đã xoá sản phẩm');
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-forest-500 mb-1">Vận hành / Sản phẩm &amp; Kho hàng</p>
        <h1 className="font-display text-3xl text-forest-900">Quản lý sản phẩm</h1>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-forest-500">{products.length} sản phẩm</p>
        <button onClick={() => setShowAddModal(true)} className="btn-primary text-xs">
          <Plus className="w-4 h-4" /> Thêm sản phẩm mới
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl border border-forest-100 shadow-elegant">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="bg-forest-900 text-cream-100 text-xs uppercase tracking-wide">
              <th className="text-left font-medium px-4 py-3">Ảnh</th>
              <th className="text-left font-medium px-4 py-3">Tên sản phẩm</th>
              <th className="text-left font-medium px-4 py-3">SKU</th>
              <th className="text-left font-medium px-4 py-3">Phân loại</th>
              <th className="text-right font-medium px-4 py-3">Giá bán lẻ</th>
              <th className="text-left font-medium px-4 py-3">Trạng thái</th>
              <th className="text-right font-medium px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const Icon = ICONS[p.icon];
              const isEditing = editingId === p.id;
              return (
                <tr key={p.id} className="border-t border-forest-50">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-lg bg-forest-900 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-gold-400" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={editDraft.name}
                        onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                        className="w-full border border-gold-400 rounded-lg px-2 py-1.5 text-sm"
                      />
                    ) : (
                      <span className="font-medium text-forest-900">{p.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-forest-400">{p.sku}</td>
                  <td className="px-4 py-3 text-forest-600">{p.category}</td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <input
                        value={editDraft.price}
                        onChange={(e) => setEditDraft((d) => ({ ...d, price: e.target.value }))}
                        className="w-32 border border-gold-400 rounded-lg px-2 py-1.5 text-sm text-right font-mono"
                      />
                    ) : (
                      <span className="font-mono tabular-nums">{fmt(p.price)}đ</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${STATUS_TONE[p.status]}`}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {isEditing ? (
                        <>
                          <button onClick={() => saveEdit(p.id)} className="p-1.5 rounded-lg hover:bg-forest-50 text-forest-700">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-cream-100 text-forest-400">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg hover:bg-forest-50 text-forest-600" title="Sửa">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleVisibility(p.id)}
                            disabled={p.status === 'out_of_stock'}
                            className="p-1.5 rounded-lg hover:bg-forest-50 text-forest-600 disabled:opacity-30"
                            title="Ẩn/Hiện"
                          >
                            {p.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                            title="Xoá"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onCreate={(p) => {
            setProducts((prev) => [{ ...p, id: `p${Date.now()}` }, ...prev]);
            setShowAddModal(false);
            showToast('Đã thêm sản phẩm mới');
          }}
        />
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 bg-forest-950/50 z-50 flex items-center justify-center p-5"
          onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-display text-lg text-forest-900">Xoá sản phẩm?</h3>
            <p className="text-sm text-forest-500 mt-2">
              Sản phẩm <b>{products.find((p) => p.id === deleteTarget)?.name}</b> sẽ bị xoá khỏi danh mục. Hành động
              này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg border border-forest-100 text-sm text-forest-700">
                Huỷ
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm">
                Xoá sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-forest-950 text-cream-50 px-5 py-3 rounded-xl text-sm shadow-elegant-lg z-50 border border-gold-400/30">
          {toast}
        </div>
      )}
    </div>
  );
}

function AddProductModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (p: Omit<AdminProduct, 'id'>) => void;
}) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
  };

  const canSubmit = name.trim() && sku.trim() && Number(price) > 0;

  return (
    <div className="fixed inset-0 bg-forest-950/50 z-50 flex items-center justify-center p-5" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="font-display text-lg text-forest-900 mb-4">Thêm sản phẩm mới</h3>

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full h-32 rounded-xl border-2 border-dashed border-forest-200 hover:border-gold-400 flex items-center justify-center overflow-hidden mb-4 transition-colors"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Xem trước" className="w-full h-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-1.5 text-forest-400 text-xs">
              <Upload className="w-5 h-5" /> Bấm để chọn ảnh sản phẩm
            </span>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên sản phẩm"
            className="w-full border border-forest-100 rounded-lg px-3 py-2.5 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Mã SKU"
              className="border border-forest-100 rounded-lg px-3 py-2.5 text-sm font-mono"
            />
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Giá bán lẻ (đ)"
              inputMode="numeric"
              className="border border-forest-100 rounded-lg px-3 py-2.5 text-sm font-mono"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-forest-100 rounded-lg px-3 py-2.5 text-sm"
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-forest-100 text-sm text-forest-700">
            Huỷ
          </button>
          <button
            disabled={!canSubmit}
            onClick={() =>
              onCreate({ name, sku, category, price: Number(price), status: 'active', icon: 'box' })
            }
            className="btn-gold text-xs disabled:opacity-40 disabled:pointer-events-none"
          >
            Lưu sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
