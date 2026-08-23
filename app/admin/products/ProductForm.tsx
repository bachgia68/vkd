'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductImage } from '@/lib/types/siteConfig';

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface ProductFormProps {
  productId?: string;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!productId);
  const [submitting, setSubmitting] = useState(false);
  const [token] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('strapi-token') || '';
    }
    return '';
  });

  const [formData, setFormData] = useState<Partial<Product>>({
    sku: '',
    name: { vi: '', en: '', fr: '', zh: '' },
    description: { vi: '', en: '', fr: '', zh: '' },
    shortDescription: { vi: '', en: '', fr: '', zh: '' },
    price: 0,
    salePrice: undefined,
    images: [],
    stock: 0,
    isActive: true,
    featured: false,
    category: '',
    tags: [],
    seoTitle: { vi: '', en: '', fr: '', zh: '' },
    seoDescription: { vi: '', en: '', fr: '', zh: '' },
  });

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`${STRAPI_BASE}/api/products/${productId}`);
          if (!response.ok) throw new Error('Failed to fetch product');
          const data = await response.json();
          setFormData(data.data);
        } catch (err) {
          alert('Error loading product');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (['price', 'salePrice', 'stock'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMultilingualChange = (field: string, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...((prev as any)[field] || {}),
        [lang]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('Not authenticated');
      return;
    }

    setSubmitting(true);
    try {
      const method = productId ? 'PUT' : 'POST';
      const url = productId ? `${STRAPI_BASE}/api/products/${productId}` : `${STRAPI_BASE}/api/products`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: formData }),
      });
      if (!response.ok) throw new Error('Failed to save product');
      router.push('/admin/products');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
      <h1 className="text-2xl font-bold mb-6">{productId ? 'Edit Product' : 'Create Product'}</h1>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku || ''}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-4 text-gray-900">Product Name (Multilingual)</h2>
        <div className="grid grid-cols-2 gap-4">
          {['vi', 'en', 'fr', 'zh'].map(lang => (
            <div key={lang}>
              <label className="block text-sm text-gray-600 mb-1">{lang.toUpperCase()}</label>
              <input
                type="text"
                value={(formData.name as any)?.[lang] || ''}
                onChange={(e) => handleMultilingualChange('name', lang, e.target.value)}
                required={lang === 'vi'}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-4 text-gray-900">Description (Multilingual)</h2>
        <div className="grid grid-cols-1 gap-4">
          {['vi', 'en', 'fr', 'zh'].map(lang => (
            <div key={lang}>
              <label className="block text-sm text-gray-600 mb-1">{lang.toUpperCase()}</label>
              <textarea
                value={(formData.description as any)?.[lang] || ''}
                onChange={(e) => handleMultilingualChange('description', lang, e.target.value)}
                required={lang === 'vi'}
                rows={3}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (₫)</label>
          <input
            type="number"
            name="price"
            value={formData.price || 0}
            onChange={handleInputChange}
            required
            min="0"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price (₫)</label>
          <input
            type="number"
            name="salePrice"
            value={formData.salePrice || ''}
            onChange={handleInputChange}
            min="0"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock || 0}
            onChange={handleInputChange}
            required
            min="0"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive ?? true}
            onChange={handleInputChange}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured ?? false}
            onChange={handleInputChange}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">Featured</span>
        </label>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}
