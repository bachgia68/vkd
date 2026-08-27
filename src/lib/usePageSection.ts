import { useEffect, useState } from 'react';
import { fetchPageSections, type PageSection } from './siteContentApi';

export function usePageSection(pageKey: string, blockType: string): PageSection | null {
  const [section, setSection] = useState<PageSection | null>(null);

  useEffect(() => {
    fetchPageSections(pageKey)
      .then((rows) => {
        const match = rows.find((r) => r.block_type === blockType) ?? null;
        setSection(match);
      })
      .catch(() => setSection(null));
  }, [pageKey, blockType]);

  return section;
}
