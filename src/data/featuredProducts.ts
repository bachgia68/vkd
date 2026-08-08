import type { Product } from './products';
import { productTypes } from './productTypes';

/**
 * Picks real, badge-backed products for cross-sell carousels (homepage,
 * blog posts). Never fabricates a "featured" flag — only products that
 * already carry a real `badge` in the catalog qualify. Spreads picks across
 * product types first so the carousel isn't dominated by one category, then
 * fills remaining slots with any other badged product.
 */
export function getFeaturedProducts(products: Product[], max = 12): Product[] {
  const badged = products.filter((p) => !!p.badge && !p.displayOnly18Plus);

  const picked: Product[] = [];
  const pickedSkus = new Set<string>();

  for (const type of productTypes) {
    const match = badged.find((p) => p.productType === type.id && !pickedSkus.has(p.sku));
    if (match) {
      picked.push(match);
      pickedSkus.add(match.sku);
    }
    if (picked.length >= max) break;
  }

  if (picked.length < max) {
    for (const p of badged) {
      if (picked.length >= max) break;
      if (!pickedSkus.has(p.sku)) {
        picked.push(p);
        pickedSkus.add(p.sku);
      }
    }
  }

  return picked;
}
