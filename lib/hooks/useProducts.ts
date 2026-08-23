'use client';

import { useEffect, useState, useCallback } from 'react';
import { Product } from '../types/siteConfig';

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface FetchOptions {
  featured?: boolean;
  category?: string;
  limit?: number;
  offset?: number;
}

export function useProducts(options?: FetchOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = `${STRAPI_BASE}/api/products?filters[isActive][$eq]=true`;
        if (options?.featured) query += '&filters[featured][$eq]=true';
        if (options?.category) query += `&filters[category][$eq]=${options.category}`;
        if (options?.limit) query += `&pagination[limit]=${options.limit}`;
        if (options?.offset) query += `&pagination[start]=${options.offset}`;
        query += '&sort=createdAt:desc';

        const response = await fetch(query);
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
  }, [options?.featured, options?.category, options?.limit, options?.offset]);

  return { products, loading, error };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${STRAPI_BASE}/api/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

export function useProductMutations(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(async (data: Partial<Product>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${STRAPI_BASE}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
      });
      if (!response.ok) throw new Error('Failed to create product');
      return await response.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${STRAPI_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return await response.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${STRAPI_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { createProduct, updateProduct, deleteProduct, loading, error };
}

export function useProductSearch(query: string) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${STRAPI_BASE}/api/products?filters[$or][0][name][vi][$containsi]=${encodeURIComponent(query)}&filters[$or][1][name][en][$containsi]=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setResults(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading, error };
}
