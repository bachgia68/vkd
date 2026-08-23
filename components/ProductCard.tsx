'use client';

import { Product } from '@/lib/types/siteConfig';
import { getText } from '@/lib/utils/translation';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const name = getText(product.name, 'vi');
  const desc = product.shortDescription ? getText(product.shortDescription, 'vi') : '';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative aspect-square bg-gray-200 overflow-hidden">
        {product.images?.[0]?.url && (
          <img
            src={product.images[0].url}
            alt={name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        )}
        {product.featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        {product.salePrice && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Sale
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">{name}</h3>
        {desc && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{desc}</p>}

        <div className="flex items-end justify-between mb-4">
          <div className="flex flex-col">
            {product.salePrice ? (
              <>
                <span className="line-through text-gray-400 text-sm">₫{product.price.toLocaleString()}</span>
                <span className="text-lg font-bold text-red-600">₫{product.salePrice.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">₫{product.price.toLocaleString()}</span>
            )}
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Stock: {product.stock}</div>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
