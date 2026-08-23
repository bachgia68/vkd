'use client';

import { useEffect, useState } from 'react';
import { Product } from '../types/siteConfig';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'SAM-001',
    name: {
      vi: 'Sâm Ngọc Linh Premium 6 tuổi',
      en: 'Premium Ngoc Linh Ginseng 6 years',
      fr: 'Ginseng Premium Ngoc Linh 6 ans',
      zh: '高丽参 6 年期',
    },
    description: {
      vi: 'Sâm Ngọc Linh tự nhiên, 100% từ rừng Ngọc Linh, chất lượng hàng đầu',
      en: 'Natural Ngoc Linh Ginseng, 100% from Ngoc Linh forest, premium quality',
      fr: 'Ginseng Ngoc Linh naturel, 100% de la forêt Ngoc Linh, qualité premium',
      zh: '天然高丽参，产自崇山峻岭，质量最佳',
    },
    shortDescription: {
      vi: 'Sâm tự nhiên 6 tuổi, chất lượng premium',
      en: 'Natural 6-year ginseng, premium quality',
      fr: 'Ginseng naturel 6 ans, qualité premium',
      zh: '天然 6 年期高丽参',
    },
    price: 500000,
    salePrice: 450000,
    images: [
      {
        id: 'img1',
        url: 'https://images.unsplash.com/photo-1584308666744-24d5f15714ae?w=500&h=500&fit=crop',
        alt: { vi: 'Sâm Ngọc Linh', en: 'Ginseng', fr: 'Ginseng', zh: '参' },
        displayOrder: 0,
      },
    ],
    category: 'ginseng',
    tags: ['natural', 'premium', 'organic'],
    stock: 25,
    isActive: true,
    featured: true,
    seoTitle: { vi: 'Sâm Ngọc Linh 6 tuổi', en: 'Ngoc Linh Ginseng', fr: 'Ginseng Ngoc Linh', zh: '高丽参' },
    seoDescription: { vi: 'Sâm Ngọc Linh chất lượng cao', en: 'High quality ginseng', fr: 'Ginseng de haute qualité', zh: '优质高丽参' },
  },
  {
    id: '2',
    sku: 'SAM-002',
    name: {
      vi: 'Sâm Ngọc Linh 3 tuổi',
      en: 'Ngoc Linh Ginseng 3 years',
      fr: 'Ginseng Ngoc Linh 3 ans',
      zh: '高丽参 3 年期',
    },
    description: {
      vi: 'Sâm Ngọc Linh 3 tuổi, giá cả hợp lý, hiệu quả tốt',
      en: 'Ngoc Linh Ginseng 3 years, reasonable price, good efficacy',
      fr: 'Ginseng Ngoc Linh 3 ans, prix raisonnable, bonne efficacité',
      zh: '高丽参 3 年期，价格合理，效果显著',
    },
    shortDescription: {
      vi: 'Sâm 3 tuổi, giá hợp lý',
      en: '3-year ginseng, affordable',
      fr: '3 ans de ginseng, abordable',
      zh: '3 年期参，价格实惠',
    },
    price: 250000,
    salePrice: 220000,
    images: [
      {
        id: 'img2',
        url: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd57ebc?w=500&h=500&fit=crop',
        alt: { vi: 'Sâm 3 tuổi', en: '3yr Ginseng', fr: '3 ans Ginseng', zh: '3年参' },
        displayOrder: 0,
      },
    ],
    category: 'ginseng',
    tags: ['natural', 'affordable'],
    stock: 50,
    isActive: true,
    featured: true,
    seoTitle: { vi: 'Sâm 3 tuổi giá tốt', en: 'Affordable ginseng', fr: 'Ginseng abordable', zh: '实惠参' },
    seoDescription: { vi: 'Sâm Ngọc Linh 3 tuổi chất lượng', en: 'Quality ginseng', fr: 'Ginseng de qualité', zh: '优质参' },
  },
  {
    id: '3',
    sku: 'SAM-003',
    name: {
      vi: 'Trà Sâm Ngọc Linh',
      en: 'Ngoc Linh Ginseng Tea',
      fr: 'Thé Ginseng Ngoc Linh',
      zh: '高丽参茶',
    },
    description: {
      vi: 'Trà từ sâm Ngọc Linh, thơm ngon, bổ dưỡng',
      en: 'Tea made from Ngoc Linh Ginseng, delicious and nutritious',
      fr: 'Thé fabriqué à partir de Ginseng Ngoc Linh, délicieux et nutritif',
      zh: '用高丽参制成的茶，美味又营养',
    },
    shortDescription: {
      vi: 'Trà sâm chất lượng cao',
      en: 'High quality ginseng tea',
      fr: 'Thé de ginseng de haute qualité',
      zh: '优质参茶',
    },
    price: 150000,
    images: [
      {
        id: 'img3',
        url: 'https://images.unsplash.com/photo-1597318972826-1701c9f70a49?w=500&h=500&fit=crop',
        alt: { vi: 'Trà sâm', en: 'Ginseng tea', fr: 'Thé sâm', zh: '参茶' },
        displayOrder: 0,
      },
    ],
    category: 'tea',
    tags: ['tea', 'natural', 'healthy'],
    stock: 100,
    isActive: true,
    featured: false,
    seoTitle: { vi: 'Trà sâm Ngọc Linh', en: 'Ginseng tea', fr: 'Thé sâm', zh: '参茶' },
    seoDescription: { vi: 'Trà sâm bổ dưỡng', en: 'Nutritious tea', fr: 'Thé nutritif', zh: '营养茶' },
  },
];

export function useProductsMock(options?: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      let filtered = MOCK_PRODUCTS;
      if (options?.featured) {
        filtered = filtered.filter(p => p.featured);
      }
      if (options?.category) {
        filtered = filtered.filter(p => p.category === options.category);
      }
      setProducts(filtered);
      setLoading(false);
    }, 500);
  }, [options?.featured, options?.category]);

  return { products, loading, error };
}
