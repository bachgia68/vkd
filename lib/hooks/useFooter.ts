'use client';

import { useEffect, useState } from 'react';
import { SiteFooter } from '../types/siteConfig';

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export function useFooter() {
  const [footer, setFooter] = useState<SiteFooter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch(
          `${STRAPI_BASE}/api/site-footers?filters[isActive][$eq]=true`,
          { next: { revalidate: 3600 } }
        );
        if (!response.ok) throw new Error('Failed to fetch footer');
        const data = await response.json();
        setFooter(data.data?.[0] || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  return { footer, loading, error };
}
