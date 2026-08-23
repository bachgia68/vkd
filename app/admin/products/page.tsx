'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types/siteConfig';
import { getText } from '@/lib/utils/translation';

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [token] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('strapi-token') || '';
    }
    return '';
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${STRAPI_BASE}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!token) {
      alert('Not authenticated');
      return;
    }
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${STRAPI_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete');
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting product');
    }
  };

  const filteredProducts = products.filter(p =>
    getText(p.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center py-12">Loading products...</div>;
  if (error) return <div className="text-red-600 py-12">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/create"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          + New Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>{getText(product.name, 'vi')}</div>
                  {product.name.en && <div className="text-xs text-gray-500">{product.name.en}</div>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">₫{product.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}
