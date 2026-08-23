'use client';

import { useProductsMock } from '@/lib/hooks/useProductsMock';
import { useLanguage } from '@/lib/hooks/useLanguage';
import ProductCard from './ProductCard';

interface Props {
  featured?: boolean;
  category?: string;
  limit?: number;
}

export default function ProductGallery({ featured, category, limit = 12 }: Props) {
  const { products, loading } = useProductsMock({ featured, category, limit });

  if (loading) return <div className="text-center py-12 text-gray-500">Loading products...</div>;
  if (!products.length) return <div className="text-center py-12 text-gray-500">No products found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
