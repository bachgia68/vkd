import { useEffect, useState } from 'react';
import { Plus, Pencil, EyeOff, Eye, Trash2, Leaf, Package, ShieldCheck, Check, X } from 'lucide-react';
import { fmt } from '../adminMockData';
import {
  fetchProducts,
  fetchProductCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  type DbProduct,
  type ProductCategory,
} from '../adminApi';

type ProductStatus = 'active' | 'hidden' | 'out_of_stock';

function statusOf(p: DbProduct): ProductStatus {
  if (!p.active) return 'hidden';
  if (p.stock_qty <= 0) return 'out_of_stock';
  return 'active';
}

function iconOf(categoryName: string | undefined): 'leaf' | 'box' | 'shield' {
  const n = (categoryName ?? '').toLowerCase();
  if (n.includes('sâm') || n.includes('nước')) return 'leaf';
  if (n.includes('bổ sung') || n.includes('tpcn')) return 'shield';
  return 'box';
}

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
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ name: string; price: string }>({ name: '', price: '' });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([fetchProducts(), fetchProductCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
        setLoadError(null);
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const categoryName = (id: number | null) => categories.find((c) => c.id === id)?.name_vi ?? '—';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const startEdit = (p: DbProduct) => {
    setEditingId(p.id);
    setEditDraft({ name: p.name_vi, price: String(p.price_vnd ?? 0) });
  };

  const saveEdit = async (id: string) => {
    try {
      await updateProduct(id, { name_vi: editDraft.name, price_vnd: Number(editDraft.price) || 0 });
      setEditingId(null);
      showToast('Đã cập nhật sản phẩm');
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật');
    }
  };

  const toggleVisibility = async (p: DbProduct) => {
    if (statusOf(p) === 'out_of_stock') return;
    try {
      await updateProduct(p.id, { active: !p.active });
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await deleteProduct(deleteTarget);
    if (error) {
      showToast('Không thể xoá — sản phẩm đã có đơn hàng/lô hàng liên kết. Hãy ẩn thay vì xoá.');
    } else {
      showToast('Đã xoá sản phẩm');
      load();
    }
    setDeleteTarget(null);
  };

  if (loading) return <p className="text-sm text-forest-500">Đang tải dữ liệu sản phẩm…</p>;
  if (loadError) return <p className="text-sm text-red-600">Lỗi tải dữ liệu: {loadError}</p>;

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
              const status = statusOf(p);
              const cat = categoryName(p.category_id);
              const Icon = ICONS[iconOf(cat)];
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
                      <span className="font-medium text-forest-900">{p.name_vi}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-forest-400">{p.sku}</td>
                  <td className="px-4 py-3 text-forest-600">{cat}</td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <input
                        value={editDraft.price}
                        onChange={(e) => setEditDraft((d) => ({ ...d, price: e.target.value }))}
                        className="w-32 border border-gold-400 rounded-lg px-2 py-1.5 text-sm text-right font-mono"
                      />
                    ) : (
                      <span className="font-mono tabular-nums">{fmt(p.price_vnd ?? 0)}đ</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${STATUS_TONE[status]}`}>
                      {STATUS_LABEL[status]}
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
                            onClick={() => toggleVisibility(p)}
                            disabled={status === 'out_of_stock'}
                            className="p-1.5 rounded-lg hover:bg-forest-50 text-forest-600 disabled:opacity-30"
                            title="Ẩn/Hiện"
                          >
                            {status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onCreate={async (input) => {
            try {
              await createProduct(input);
              setShowAddModal(false);
              showToast('Đã thêm sản phẩm mới');
              load();
            } catch (e) {
              showToast(e instanceof Error ? e.message : 'Lỗi thêm sản phẩm');
            }
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
              Sản phẩm <b>{products.find((p) => p.id === deleteTarget)?.name_vi}</b> sẽ bị xoá khỏi danh mục. Hành động
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
  categories,
  onClose,
  onCreate,
}: {
  categories: ProductCategory[];
  onClose: () => void;
  onCreate: (p: { sku: string; name_vi: string; category_id: number | null; price_vnd: number }) => void;
}) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(categories[0]?.id ?? null);

  const canSubmit = name.trim() && sku.trim() && Number(price) > 0;

  return (
    <div className="fixed inset-0 bg-forest-950/50 z-50 flex items-center justify-center p-5" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="font-display text-lg text-forest-900 mb-4">Thêm sản phẩm mới</h3>

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
            value={categoryId ?? ''}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
            className="w-full border border-forest-100 rounded-lg px-3 py-2.5 text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_vi}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-forest-100 text-sm text-forest-700">
            Huỷ
          </button>
          <button
            disabled={!canSubmit}
            onClick={() => onCreate({ sku, name_vi: name, category_id: categoryId, price_vnd: Number(price) })}
            className="btn-gold text-xs disabled:opacity-40 disabled:pointer-events-none"
          >
            Lưu sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
