import { products, type CartCompatibleProduct } from './products';
import type { ComboSet } from '../lib/siteContentApi';

const VND_PER_USD = 25000;

/** Resolves a combo's component_skus to their full Product records, for
 * display ("gồm: ...") — dropping any SKU that no longer exists in the
 * catalog rather than throwing, since the catalog can change after a combo
 * was assembled. */
export function resolveComboComponents(combo: ComboSet) {
  const bySku = new Map(products.map((p) => [p.sku, p]));
  return combo.component_skus.map((sku) => bySku.get(sku)).filter((p): p is NonNullable<typeof p> => Boolean(p));
}

/** Poster image shown for a combo: the admin-uploaded poster if there is
 * one, otherwise the first component product's own photo — a real product
 * shot reads far better than the generic TA logo placeholder. Works for
 * combos created before this fallback existed too, since it's resolved at
 * display time rather than baked in at creation. */
export function getComboPosterImage(combo: Pick<ComboSet, 'poster_image_url' | 'component_skus'>): string {
  if (combo.poster_image_url) return combo.poster_image_url;
  const bySku = new Map(products.map((p) => [p.sku, p]));
  const first = combo.component_skus.map((sku) => bySku.get(sku)).find((p) => p);
  return first?.image ?? '/assets/images/TA_logo_clean.png';
}

/** Sum of the catalog price of each selected SKU — the admin's starting
 * suggestion for a combo's price, which they can still lower to make the
 * combo actually cheaper than buying the items separately. SKUs with no
 * catalog price (price: null) are skipped, not treated as free. */
export function getComboSuggestedPrice(skus: string[]): number {
  const bySku = new Map(products.map((p) => [p.sku, p]));
  return skus.reduce((sum, sku) => sum + (bySku.get(sku)?.price ?? 0), 0);
}

/** Default "Gồm: ..." description auto-filled from the selected SKUs —
 * name and price of each component product, so the customer sees the real
 * value bundled in the combo, not just a bare product list. */
export function getComboAutoDescription(skus: string[]): string {
  const bySku = new Map(products.map((p) => [p.sku, p]));
  const parts = skus.map((sku) => {
    const p = bySku.get(sku);
    if (!p) return sku;
    return p.price != null ? `${p.name} (${p.price.toLocaleString('vi-VN')}đ)` : p.name;
  });
  return `Gồm: ${parts.join(', ')}`;
}

/** Converts a combo into the same shape the cart/checkout already consumes
 * for regular products — a combo is one cart line at its own fixed price,
 * it does NOT decompose into its component SKUs as separate cart lines. */
export function comboToCartProduct(combo: ComboSet): CartCompatibleProduct {
  const priceUSD = Math.round((combo.price_vnd / VND_PER_USD) * 100) / 100;
  return {
    id: `combo-${combo.slug}`,
    name: combo.name_vi,
    nameVi: combo.name_vi,
    category: 'set-qua-tang',
    healthGoal: 'immunity',
    audiences: ['family'],
    priceUSD,
    priceVND: combo.price_vnd,
    priceJPY: Math.round(priceUSD * 150),
    priceCNY: Math.round(priceUSD * 7.2 * 100) / 100,
    priceEUR: Math.round(priceUSD * 0.93 * 100) / 100,
    activeIngredient: '',
    description: combo.description_vi,
    descriptionVi: combo.description_vi,
    image: getComboPosterImage(combo),
    badge: combo.theme,
    rating: 0,
    reviews: 0,
  };
}
