import { useState, useEffect } from 'react';

interface Product {
  sku: string;
  name: string;
  slug: string;
  price?: number;
  description?: string;
  image?: string;
  category?: string;
  hidden?: boolean;
}

export default function ProductsManagePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    sku: '',
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'Sâm Ngọc Linh'
  });
  const [editingSku, setEditingSku] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/products-seo.json')
      .then(r => r.json())
      .then(setProducts)
      .catch(err => setMessage('❌ Load products failed: ' + err.message));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async () => {
    if (!form.sku || !form.name) {
      setMessage('⚠️ SKU and Name required');
      return;
    }

    setLoading(true);
    try {
      let newProducts = [...products];

      if (editingSku) {
        newProducts = newProducts.map(p =>
          p.sku === editingSku
            ? { ...p, ...form, price: form.price ? parseFloat(form.price) : undefined }
            : p
        );
      } else {
        const exists = products.find(p => p.sku === form.sku);
        if (exists) {
          setMessage('⚠️ SKU already exists');
          setLoading(false);
          return;
        }
        newProducts.push({
          sku: form.sku,
          name: form.name,
          slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          price: form.price ? parseFloat(form.price) : undefined,
          description: form.description,
          image: form.image,
          category: form.category
        });
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducts)
      });

      if (!res.ok) throw new Error(await res.text());

      setProducts(newProducts);
      setForm({ sku: '', name: '', price: '', description: '', image: '', category: 'Sâm Ngọc Linh' });
      setEditingSku(null);
      setMessage('✅ ' + (editingSku ? 'Updated' : 'Added') + ' successfully');
    } catch (err) {
      setMessage('❌ Error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      sku: product.sku,
      name: product.name,
      price: product.price?.toString() || '',
      description: product.description || '',
      image: product.image || '',
      category: product.category || 'Sâm Ngọc Linh'
    });
    setEditingSku(product.sku);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (sku: string) => {
    if (!confirm(`Delete ${sku}?`)) return;

    setLoading(true);
    try {
      const newProducts = products.filter(p => p.sku !== sku);
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducts)
      });

      if (!res.ok) throw new Error(await res.text());

      setProducts(newProducts);
      setMessage('✅ Deleted');
    } catch (err) {
      setMessage('❌ Error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHidden = async (sku: string) => {
    const product = products.find(p => p.sku === sku);
    if (!product) return;

    const newProducts = products.map(p =>
      p.sku === sku ? { ...p, hidden: !p.hidden } : p
    );

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducts)
      });

      if (!res.ok) throw new Error(await res.text());

      setProducts(newProducts);
      setMessage('✅ Updated visibility');
    } catch (err) {
      setMessage('❌ Error: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleMoveCategory = async (sku: string, newCategory: string) => {
    const newProducts = products.map(p =>
      p.sku === sku ? { ...p, category: newCategory } : p
    );

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducts)
      });

      if (!res.ok) throw new Error(await res.text());

      setProducts(newProducts);
      setMessage(`✅ Moved ${sku} to ${newCategory}`);
    } catch (err) {
      setMessage('❌ Error: ' + (err instanceof Error ? err.message : String(err)));
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
            {editingSku ? `✏️ Sửa: ${editingSku}` : '➕ Thêm Sản Phẩm'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                placeholder="VKD-001"
                value={form.sku}
                onChange={handleInputChange}
                disabled={!!editingSku}
                className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
              <input
                type="text"
                name="name"
                placeholder="Sâm Ngọc Linh..."
                value={form.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Giá (VND)</label>
              <input
                type="number"
                name="price"
                placeholder="500000"
                value={form.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL Hình</label>
              <input
                type="text"
                name="image"
                placeholder="https://..."
                value={form.image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                name="description"
                placeholder="Nhập mô tả sản phẩm..."
                value={form.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option>Sâm Ngọc Linh</option>
                <option>Sâm Nguyên Bản</option>
                <option>Sâm Xấy Khô</option>
                <option>Sâm Khác</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddOrUpdate}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg disabled:opacity-50 text-sm"
              >
                {loading ? '⏳...' : editingSku ? '💾 Cập Nhật' : '➕ Thêm'}
              </button>
              {editingSku && (
                <button
                  onClick={() => {
                    setEditingSku(null);
                    setForm({
                      sku: '',
                      name: '',
                      price: '',
                      description: '',
                      image: '',
                      category: 'Sâm Ngọc Linh'
                    });
                  }}
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
            {products.map(product => (
              <div
                key={product.sku}
                className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ${
                  product.hidden ? 'opacity-50 bg-gray-100' : 'bg-white'
                }`}
              >
                {product.image && (
                  <div className="h-32 bg-gray-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-3 space-y-2">
                  <div className="text-xs font-medium text-gray-500">{product.sku}</div>
                  <div className="font-semibold text-sm line-clamp-2">{product.name}</div>
                  {product.price && (
                    <div className="text-sm text-green-600 font-medium">
                      {product.price.toLocaleString()}₫
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 rounded text-xs"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleToggleHidden(product.sku)}
                        className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-medium py-1 rounded text-xs"
                      >
                        {product.hidden ? '👁️' : '🚫'}
                      </button>
                      <button
                        onClick={() => handleDelete(product.sku)}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1 rounded text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                    <select
                      value={product.category || 'Sâm Ngọc Linh'}
                      onChange={(e) => handleMoveCategory(product.sku, e.target.value)}
                      className="w-full px-2 py-1 border border-purple-300 rounded text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 cursor-pointer"
                    >
                      <option value="Sâm Ngọc Linh">📍 Sâm Ngọc Linh</option>
                      <option value="Sâm Nguyên Bản">📍 Sâm Nguyên Bản</option>
                      <option value="Sâm Xấy Khô">📍 Sâm Xấy Khô</option>
                      <option value="Sâm Khác">📍 Sâm Khác</option>
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
