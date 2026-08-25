import { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  fetchProducts,
  fetchProductCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  type DbProduct,
  type ProductCategory,
} from '../adminApi';

// Validate form.* (chuoi tho tu input) truoc khi ep kieu/goi API — trước day
// chi kiem tra sku/name_vi khong rong, gia chi bat buoc khi tao moi, khong
// chan duoc SKU co khoang trang, gia am/qua lon, hay ky tu la trong SKU.
const productFormSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, 'SKU là bắt buộc')
    .regex(/^[A-Za-z0-9-]+$/, 'SKU chỉ gồm chữ, số và dấu gạch ngang'),
  name_vi: z.string().trim().min(2, 'Tên sản phẩm tối thiểu 2 ký tự').max(200, 'Tên sản phẩm quá dài'),
  price_vnd: z
    .string()
    .trim()
    .refine((v) => v === '' || (Number(v) > 0 && Number(v) < 1_000_000_000), {
      message: 'Giá phải lớn hơn 0 và nhỏ hơn 1 tỷ đ',
    }),
  category_id: z.string(),
  image_url: z
    .string()
    .trim()
    .refine((v) => v === '' || /^https?:\/\//.test(v), { message: 'URL ảnh phải bắt đầu bằng http(s)://' }),
});

type ProductFormErrors = Partial<Record<keyof typeof productFormSchema.shape, string>>;

export default function ProductsManagePage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [form, setForm] = useState({
    sku: '',
    name_vi: '',
    price_vnd: '',
    category_id: '',
    image_url: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ProductFormErrors>({});

  const load = () => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setMessage('❌ Load products failed: ' + (err instanceof Error ? err.message : String(err))));
    fetchProductCategories()
      .then(setCategories)
      .catch((err) => setMessage('❌ Load categories failed: ' + (err instanceof Error ? err.message : String(err))));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm({ sku: '', name_vi: '', price_vnd: '', category_id: '', image_url: '' });
    setEditingId(null);
    setFieldErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name as keyof ProductFormErrors] ? { ...prev, [name]: undefined } : prev));
  };

  const handleAddOrUpdate = async () => {
    const result = productFormSchema.safeParse(form);
    if (!result.success) {
      const errors: ProductFormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ProductFormErrors;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      setMessage('⚠️ Vui lòng sửa các lỗi trong biểu mẫu');
      return;
    }
    if (!editingId && !form.price_vnd) {
      setFieldErrors({ price_vnd: 'Giá là bắt buộc khi thêm sản phẩm mới' });
      setMessage('⚠️ Giá là bắt buộc khi thêm sản phẩm mới');
      return;
    }
    setFieldErrors({});

    setLoading(true);
    try {
      const category_id = form.category_id ? Number(form.category_id) : null;
      const price_vnd = form.price_vnd ? Number(form.price_vnd) : null;

      if (editingId) {
        await updateProduct(editingId, {
          name_vi: form.name_vi,
          price_vnd,
          category_id,
          image_url: form.image_url || null,
        });
        setMessage('✅ Đã cập nhật sản phẩm');
      } else {
        if (!price_vnd) {
          setMessage('⚠️ Giá là bắt buộc khi thêm sản phẩm mới');
          setLoading(false);
          return;
        }
        const created = await createProduct({
          sku: form.sku,
          name_vi: form.name_vi,
          category_id,
          price_vnd,
        });
        if (form.image_url) {
          await updateProduct(created.id, { image_url: form.image_url });
        }
        setMessage('✅ Đã thêm sản phẩm mới');
      }

      resetForm();
      load();
    } catch (err) {
      setMessage('❌ Lỗi: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: DbProduct) => {
    setForm({
      sku: product.sku,
      name_vi: product.name_vi,
      price_vnd: product.price_vnd?.toString() ?? '',
      category_id: product.category_id?.toString() ?? '',
      image_url: product.image_url ?? '',
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (product: DbProduct) => {
    if (!window.confirm(`Xoá sản phẩm ${product.sku}?`)) return;

    setLoading(true);
    try {
      const res = await deleteProduct(product.id);
      if (res.error) throw new Error(res.error);
      setMessage('✅ Đã xoá sản phẩm');
      load();
    } catch (err) {
      setMessage('❌ Lỗi: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (product: DbProduct) => {
    try {
      await updateProduct(product.id, { active: !product.active });
      setMessage('✅ Đã cập nhật trạng thái hiển thị');
      load();
    } catch (err) {
      setMessage('❌ Lỗi: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleMoveCategory = async (product: DbProduct, newCategoryId: string) => {
    try {
      await updateProduct(product.id, { category_id: newCategoryId ? Number(newCategoryId) : null });
      setMessage(`✅ Đã chuyển ${product.sku} sang danh mục khác`);
      load();
    } catch (err) {
      setMessage('❌ Lỗi: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const categoryName = (id: number | null) => categories.find((c) => c.id === id)?.name_vi ?? '—';

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📦 Quản Lý Sản Phẩm</h1>

      {message && (
        <div className="mb-6 p-4 bg-opacity-10 rounded-lg border border-opacity-30 text-sm font-medium">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? `✏️ Sửa: ${form.sku}` : '➕ Thêm Sản Phẩm'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                placeholder="TA-001"
                value={form.sku}
                onChange={handleInputChange}
                disabled={!!editingId}
                className={`w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-100 ${fieldErrors.sku ? 'border-red-400' : ''}`}
              />
              {fieldErrors.sku && <p className="text-xs text-red-600 mt-1">{fieldErrors.sku}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
              <input
                type="text"
                name="name_vi"
                placeholder="Sâm Ngọc Linh..."
                value={form.name_vi}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${fieldErrors.name_vi ? 'border-red-400' : ''}`}
              />
              {fieldErrors.name_vi && <p className="text-xs text-red-600 mt-1">{fieldErrors.name_vi}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Giá (VND)</label>
              <input
                type="number"
                name="price_vnd"
                placeholder="500000"
                value={form.price_vnd}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${fieldErrors.price_vnd ? 'border-red-400' : ''}`}
              />
              {fieldErrors.price_vnd && <p className="text-xs text-red-600 mt-1">{fieldErrors.price_vnd}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL ảnh sản phẩm</label>
              <input
                type="text"
                name="image_url"
                placeholder="https://..."
                value={form.image_url}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${fieldErrors.image_url ? 'border-red-400' : ''}`}
              />
              {fieldErrors.image_url && <p className="text-xs text-red-600 mt-1">{fieldErrors.image_url}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">— Chưa phân loại —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name_vi}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddOrUpdate}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg disabled:opacity-50 text-sm"
              >
                {loading ? '⏳...' : editingId ? '💾 Cập Nhật' : '➕ Thêm'}
              </button>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 rounded-lg text-sm"
                >
                  ✕ Huỷ
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Danh Sách ({products.length} sản phẩm)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ${
                  !product.active ? 'opacity-50 bg-gray-100' : 'bg-white'
                }`}
              >
                {product.image_url && (
                  <div className="h-32 bg-gray-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={product.image_url}
                      alt={product.name_vi}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-3 space-y-2">
                  <div className="text-xs font-medium text-gray-500">{product.sku}</div>
                  <div className="font-semibold text-sm line-clamp-2">{product.name_vi}</div>
                  {product.price_vnd != null && (
                    <div className="text-sm text-green-600 font-medium">
                      {product.price_vnd.toLocaleString()}₫
                    </div>
                  )}
                  <div className="text-xs text-gray-400">Tồn kho: {product.stock_qty}</div>
                  <div className="text-xs text-gray-400">Danh mục hiện tại: {categoryName(product.category_id)}</div>

                  <div className="space-y-2 pt-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 rounded text-xs"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleToggleActive(product)}
                        className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-medium py-1 rounded text-xs"
                      >
                        {!product.active ? '👁️' : '🚫'}
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1 rounded text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                    <select
                      value={product.category_id ?? ''}
                      onChange={(e) => handleMoveCategory(product, e.target.value)}
                      className="w-full px-2 py-1 border border-purple-300 rounded text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 cursor-pointer"
                    >
                      <option value="">📍 Chưa phân loại</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>📍 {c.name_vi}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
