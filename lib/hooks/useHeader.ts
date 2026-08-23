'use client';

import { useEffect, useState } from 'react';
import { SiteHeader } from '../types/siteConfig';

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export function useHeader() {
  const [header, setHeader] = useState<SiteHeader | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const response = await fetch(
          `${STRAPI_BASE}/api/site-headers?filters[isActive][$eq]=true`,
          { next: { revalidate: 3600 } }
        );
        if (!response.ok) throw new Error('Failed to fetch header');
        const data = await response.json();
        setHeader(data.data?.[0] || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchHeader();
  }, []);

  return { header, loading, error };
}
