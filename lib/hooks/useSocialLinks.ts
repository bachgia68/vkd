'use client';

import { useEffect, useState } from 'react';
import { SocialLink } from '../types/siteConfig';

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export function useSocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(
          `${STRAPI_BASE}/api/social-links?filters[isActive][$eq]=true&sort=displayOrder:asc`,
          { next: { revalidate: 3600 } }
        );
        if (!response.ok) throw new Error('Failed to fetch social links');
        const data = await response.json();
        setLinks(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  return { links, loading, error };
}
