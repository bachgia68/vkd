import { useEffect } from 'react';

// Injects a page-specific <script type="application/ld+json"> into <head> so
// Google's rich snippets reflect the real page (real product price/name, real
// article) instead of the one static block index.html used to carry for every
// route. Removed on unmount so navigating away doesn't leave stale schema for
// the next page.
export function useJsonLd(data: object | null) {
  useEffect(() => {
    if (!data) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
}
