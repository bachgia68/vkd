import { useEffect, useState } from 'react';
import { fetchProductOverrides, type ProductOverride } from '../lib/siteContentApi';
import type { Product } from '../data/products';

// Module-level cache: every component on a page (catalog, detail, advisor,
// chat widget, autoship) calls this hook independently — fetch the override
// list from Supabase once per page load, not once per component.
let overridesPromise: Promise<ProductOverride[]> | null = null;
function getOverrides(): Promise<ProductOverride[]> {
  if (!overridesPromise) {
    overridesPromise = fetchProductOverrides().catch((err) => {
      overridesPromise = null; // allow retry on next mount instead of caching a failure forever
      throw err;
    });
  }
  return overridesPromise;
}

// Merges the static catalog (source of truth for content: name, description,
// images, taxonomy) with live price/stock/visibility overrides admins set in
// "Sản phẩm & Kho". A SKU admins mark inactive is dropped from the list a SKU
// with a different price in Supabase shows that price instead. SKUs with no
// matching override row (not yet tracked in Supabase) pass through unchanged.
// Fails open: if the override fetch errors (offline, RLS misconfig), returns
// the static list untouched rather than breaking the storefront.
export function useLiveProducts(staticProducts: Product[]): Product[] {
  const [merged, setMerged] = useState(staticProducts);

  useEffect(() => {
    let cancelled = false;
    getOverrides()
      .then((overrides) => {
        if (cancelled) return;
        const bySku = new Map(overrides.map((o) => [o.sku, o]));
        const next = staticProducts
          .filter((p) => bySku.get(p.sku)?.active !== false)
          .map((p) => {
            const o = bySku.get(p.sku);
            return o && o.price_vnd !== null ? { ...p, price: Number(o.price_vnd) } : p;
          });
        setMerged(next);
      })
      .catch(() => {
        if (!cancelled) setMerged(staticProducts);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return merged;
}
