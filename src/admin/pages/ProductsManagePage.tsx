import { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  fetchProducts,
  fetchProductCategories,
  createProduct,
  createProductCategory,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  type DbProduct,
  type ProductCategory,
} from '../adminApi';
import { slugify } from '../../lib/slugify';

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
  slug: z.string().trim(),
  compare_at_price_vnd: z
    .string()
    .trim()
    .refine((v) => v === '' || Number(v) > 0, { message: 'Giá niêm yết phải lớn hơn 0' }),
  description_short: z.string().trim().max(300, 'Mô tả ngắn tối đa 300 ký tự'),
  description_vi: z.string().trim(),
  cta_zalo_url: z.string().trim(),
  cta_shopee_url: z.string().trim(),
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
    slug: '',
    compare_at_price_vnd: '',
    description_short: '',
    description_vi: '',
    cta_zalo_url: '',
    cta_shopee_url: '',
  });
  const [gallery, setGallery] = useState<string[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ProductFormErrors>({});
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    setForm({
      sku: '', name_vi: '', price_vnd: '', category_id: '', image_url: '',
      slug: '', compare_at_price_vnd: '', description_short: '', description_vi: '',
      cta_zalo_url: '', cta_shopee_url: '',
    });
    setGallery([]);
    setEditingId(null);
    setFieldErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name as keyof ProductFormErrors] ? { ...prev, [name]: undefined } : prev));
  };

  const handlePickImage = async (file: File | null) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadProductImage(file);
      setForm((prev) => ({ ...prev, image_url: url }));
      setFieldErrors((prev) => ({ ...prev, image_url: undefined }));
    } catch (err) {
      setMessage('❌ Lỗi tải ảnh lên: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePickGalleryFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadProductImage(f)));
      setGallery((prev) => [...prev, ...urls]);
    } catch (err) {
      setMessage('❌ Lỗi tải ảnh gallery: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (url: string) => {
    setGallery((prev) => prev.filter((u) => u !== url));
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
      const compare_at_price_vnd = form.compare_at_price_vnd ? Number(form.compare_at_price_vnd) : null;
      const slug = form.slug.trim() || slugify(form.name_vi);
      const extraFields = {
        slug,
        compare_at_price_vnd,
        description_short: form.description_short.trim() || null,
        description_vi: form.description_vi.trim() || null,
        gallery_images: gallery,
        cta_zalo_url: form.cta_zalo_url.trim() || null,
        cta_shopee_url: form.cta_shopee_url.trim() || null,
      };

      if (editingId) {
        await updateProduct(editingId, {
          name_vi: form.name_vi,
          price_vnd,
          category_id,
          image_url: form.image_url || null,
          ...extraFields,
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
          slug,
        });
        await updateProduct(created.id, { image_url: form.image_url || null, ...extraFields });
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
      slug: product.slug ?? '',
      compare_at_price_vnd: product.compare_at_price_vnd?.toString() ?? '',
      description_short: product.description_short ?? '',
      description_vi: product.description_vi ?? '',
      cta_zalo_url: product.cta_zalo_url ?? '',
      cta_shopee_url: product.cta_shopee_url ?? '',
    });
    setGallery(product.gallery_images ?? []);
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

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    setAddingCategory(true);
    try {
      const created = await createProductCategory(slugify(name), name);
      setCategories((prev) => [...prev, created]);
      setForm((prev) => ({ ...prev, category_id: created.id.toString() }));
      setNewCategoryName('');
      setMessage('✅ Đã thêm danh mục mới');
    } catch (err) {
      setMessage('❌ Lỗi: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setAddingCategory(false);
    }
  };

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
              <label className="block text-sm font-medium mb-1">Giá niêm yết (VND) — để trống nếu không giảm giá</label>
              <input
                type="number"
                name="compare_at_price_vnd"
                placeholder="700000"
                value={form.compare_at_price_vnd}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${fieldErrors.compare_at_price_vnd ? 'border-red-400' : ''}`}
              />
              {fieldErrors.compare_at_price_vnd && <p className="text-xs text-red-600 mt-1">{fieldErrors.compare_at_price_vnd}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Slug (URL) — để trống để tự sinh từ tên</label>
              <input
                type="text"
                name="slug"
                placeholder="sam-ngoc-linh-tuoi"
                value={form.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
              <input
                type="text"
                name="description_short"
                placeholder="Hiện ở thẻ sản phẩm/danh sách"
                value={form.description_short}
                onChange={handleInputChange}
                maxLength={300}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${fieldErrors.description_short ? 'border-red-400' : ''}`}
              />
              {fieldErrors.description_short && <p className="text-xs text-red-600 mt-1">{fieldErrors.description_short}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mô tả chi tiết</label>
              <textarea
                name="description_vi"
                placeholder="Mô tả đầy đủ hiển thị ở trang chi tiết sản phẩm"
                value={form.description_vi}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Link CTA Zalo</label>
              <input
                type="text"
                name="cta_zalo_url"
                placeholder="https://zalo.me/..."
                value={form.cta_zalo_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Link CTA Shopee</label>
              <input
                type="text"
                name="cta_shopee_url"
                placeholder="https://shopee.vn/..."
                value={form.cta_shopee_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gallery ảnh (nhiều ảnh)</label>
              <label className="flex items-center gap-2 border border-dashed rounded-lg px-3 py-2.5 text-sm text-gray-500 cursor-pointer hover:border-purple-400 hover:text-gray-700">
                {uploadingGallery ? '⏳ Đang tải ảnh lên...' : '🖼️ Chọn nhiều ảnh (tự resize & nén WebP)'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={uploadingGallery}
                  onChange={(e) => handlePickGalleryFiles(e.target.files)}
                />
              </label>
              {gallery.length > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {gallery.map((url) => (
                    <div key={url} className="relative">
                      <img src={url} alt="" className="h-16 w-16 object-cover rounded-lg border" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(url)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] leading-4"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ảnh sản phẩm</label>
              <label className="flex items-center gap-2 border border-dashed rounded-lg px-3 py-2.5 text-sm text-gray-500 cursor-pointer hover:border-purple-400 hover:text-gray-700">
                {uploadingImage ? '⏳ Đang tải ảnh lên...' : '📷 Chọn ảnh (tự resize & nén WebP)'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage}
                  onChange={(e) => handlePickImage(e.target.files?.[0] ?? null)}
                />
              </label>
              {form.image_url && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={form.image_url} alt="Xem trước" className="h-16 w-16 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, image_url: '' }))}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Xoá ảnh
                  </button>
                </div>
              )}
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
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Tên danh mục mới..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                  className="flex-1 px-3 py-1.5 border rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={addingCategory || !newCategoryName.trim()}
                  className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium rounded-lg text-xs disabled:opacity-50"
                >
                  {addingCategory ? '⏳' : '➕ Thêm danh mục'}
                </button>
              </div>
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
