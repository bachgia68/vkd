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
    image: combo.poster_image_url ?? '/assets/images/TA_logo_clean.png',
    badge: combo.theme,
    rating: 0,
    reviews: 0,
  };
}
