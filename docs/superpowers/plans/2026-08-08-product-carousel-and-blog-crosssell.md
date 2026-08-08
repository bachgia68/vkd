# Product Carousel + Blog Cross-sell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage Products section's slow staggered fade-in grid with a Shopee/KGC-style horizontal swipe carousel showing real featured products, and reuse the same carousel to cross-sell products inside blog posts.

**Architecture:** One pure selection function (`getFeaturedProducts`) picks real, badge-backed products from the existing catalog; one shared presentational component (`ProductCarousel`) renders them as a native CSS scroll-snap horizontal strip with optional desktop arrow buttons. `Products.tsx` and `BlogPostDetail.tsx` both consume these two pieces — no new backend, no new dependency.

**Tech Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 (native `snap-x`/`snap-mandatory`/`snap-start` utilities, no new npm package).

## Global Constraints

- No new npm dependencies (no carousel/swiper library) — CSS scroll-snap only.
- No new Supabase table/column, no CMS change — reuse existing `src/data/products.ts` + `useLiveProducts()`.
- Never fabricate product data (badges, reviews, "bestseller" labels) — only use the `badge` field already present in `products.ts`.
- Empty result (0 featured products) must render nothing (`return null`), never an empty placeholder frame.
- This repo has no test runner configured (no vitest/jest) — verify pure-function logic with a throwaway `tsx` script (run, confirm, delete — do not commit it), and verify UI in the real browser preview, matching existing project convention (see `HANDOFF_NEXT_SESSION.md` §-3).
- Before every commit: `npm run check:brand && npx tsc -b && npm run build` must all pass (per `deploy-vkd-site` skill).
- Windows path gotcha: this repo's absolute path contains a Vietnamese character sequence with ambiguous Unicode normalization. Prefer relative paths from the already-`cd`'d working directory for Bash/git commands; avoid retyping the absolute path with diacritics.

---

### Task 1: `getFeaturedProducts()` selection helper

**Files:**
- Create: `src/data/featuredProducts.ts`

**Interfaces:**
- Consumes: `Product` type and `productTypes` array from `src/data/products.ts` and `src/data/productTypes.ts` (both already exist — `Product.badge?: string`, `Product.productType: ProductTypeId`).
- Produces: `getFeaturedProducts(products: Product[], max?: number): Product[]` — used by Task 3 (`Products.tsx`) and Task 4 (`BlogPostDetail.tsx`).

- [ ] **Step 1: Write the implementation**

```ts
// src/data/featuredProducts.ts
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
  const badged = products.filter((p) => !!p.badge);

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
```

- [ ] **Step 2: Verify with a throwaway script (do not commit)**

Create `scripts/tmp-verify-featured-products.ts`:

```ts
import { products } from '../src/data/products';
import { getFeaturedProducts } from '../src/data/featuredProducts';

const result = getFeaturedProducts(products);
console.log('count:', result.length);
console.log('skus:', result.map((p) => p.sku));
console.log('unique productTypes covered:', new Set(result.map((p) => p.productType)).size);
console.log('all have badge:', result.every((p) => !!p.badge));

const empty = getFeaturedProducts([]);
console.log('empty input -> length 0:', empty.length === 0);
```

Run:
```bash
npx tsx scripts/tmp-verify-featured-products.ts
```

Expected: `count` between 1 and 12 (there are 19 badged SKUs in the catalog, so expect 12), `all have badge: true`, `empty input -> length 0: true`, no duplicate SKUs in the `skus` list, `unique productTypes covered` up to 7 (one of the 7 types may have zero badged products — that's fine, not a bug).

- [ ] **Step 3: Delete the throwaway script**

```bash
rm scripts/tmp-verify-featured-products.ts
```

- [ ] **Step 4: Typecheck and commit**

```bash
npx tsc -b
git add src/data/featuredProducts.ts
git commit -m "feat: add getFeaturedProducts helper for carousel cross-sell"
```

---

### Task 2: `ProductCarousel` shared component

**Files:**
- Create: `src/components/ProductCarousel.tsx`

**Interfaces:**
- Consumes: `Product` type (`src/data/products.ts`), `Language` type (`src/i18n/translations.ts`). Reads `product.sku`, `.slug`, `.name`, `.image`, `.price`, `.badge`.
- Produces: `export default function ProductCarousel({ products, lang, onNavigate }: ProductCarouselProps)` — consumed by Task 3 and Task 4. `onNavigate` signature matches the existing app-wide convention: `(page: string, slug?: string) => void`.

- [ ] **Step 1: Write the component**

```tsx
// src/components/ProductCarousel.tsx
import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../data/products';
import type { Language } from '../i18n/translations';

interface ProductCarouselProps {
  products: Product[];
  lang: Language;
  onNavigate?: (page: string, slug?: string) => void;
}

const VND_PER_USD = 25000;

function formatPrice(price: number | null, lang: Language): string {
  if (price === null) return lang === 'vi' ? 'Liên hệ' : 'Contact us';
  if (lang === 'vi') return price.toLocaleString('vi-VN') + '₫';
  const usd = Math.round((price / VND_PER_USD) * 100) / 100;
  return `$${usd.toFixed(2)}`;
}

export default function ProductCarousel({ products, lang, onNavigate }: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
  }, [updateArrows, products]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-carousel-card]') as HTMLElement | null;
    const amount = (card?.offsetWidth ?? 280) + 24;
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <div className="relative group/carousel">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label={lang === 'vi' ? 'Xem sản phẩm trước' : 'Previous products'}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-11 h-11 rounded-full bg-white shadow-elegant-lg items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 text-forest-900" />
        </button>
      )}

      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.sku}
            data-carousel-card
            className="product-card group cursor-pointer flex-shrink-0 w-64 md:w-72 snap-start"
            onClick={() => onNavigate?.('product-detail', product.slug)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onNavigate?.('product-detail', product.slug);
            }}
          >
            <div className="relative aspect-ginseng overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                loading="lazy"
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gold-400 text-forest-900">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-display text-lg font-semibold text-forest-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <div className="text-base font-display font-bold text-forest-900">
                {formatPrice(product.price, lang)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label={lang === 'vi' ? 'Xem thêm sản phẩm' : 'More products'}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-11 h-11 rounded-full bg-white shadow-elegant-lg items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5 text-forest-900" />
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc -b
```

Expected: no errors. If `shadow-elegant-lg` or `.product-card`/`.aspect-ginseng` classes are reported unused/missing, check `src/index.css` — they already exist there (confirmed present at the time this plan was written); this step only needs to catch a TypeScript error, not a missing CSS class (Tailwind won't error on that).

- [ ] **Step 3: Commit**

```bash
git add src/components/ProductCarousel.tsx
git commit -m "feat: add ProductCarousel shared horizontal swipe component"
```

---

### Task 3: Wire `ProductCarousel` into homepage `Products.tsx`

**Files:**
- Modify: `src/components/Products.tsx` (full rewrite of the body — the file is currently 177 lines built around the old 4-category grid; the new version is much shorter)

**Interfaces:**
- Consumes: `ProductCarousel` (Task 2), `getFeaturedProducts` (Task 1), `useLiveProducts` (`src/hooks/useLiveProducts.ts`, existing), `products as staticProducts` from `src/data/products.ts` (existing export).
- Produces: same `export default function Products({ lang, onNavigate }: ProductsProps)` signature as before — no change to how `App.tsx` calls it (`<Products lang={lang} onNavigate={onNavigate} />` at `App.tsx:155` stays untouched).

- [ ] **Step 1: Replace the file contents**

```tsx
// src/components/Products.tsx
import { ArrowRight } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { products as staticProducts } from '../data/products';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { getFeaturedProducts } from '../data/featuredProducts';
import ProductCarousel from './ProductCarousel';

interface ProductsProps {
  lang: Language;
  onNavigate?: (page: string) => void;
}

export default function Products({ lang, onNavigate }: ProductsProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';
  const liveProducts = useLiveProducts(staticProducts);
  const featured = getFeaturedProducts(liveProducts);

  return (
    <section id="products" className="section-padding bg-cream-100" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-100 rounded-full mb-6">
            <span className="w-2 h-2 bg-gold-400 rounded-full" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold-700">
              {t.products.label}
            </span>
          </div>

          <h2 className="font-display text-display-sm md:text-display-md text-forest-900 mb-6">
            {t.products.title}
          </h2>
          <p className="text-forest-600 text-lg leading-relaxed">
            {t.products.subtitle}
          </p>
        </div>

        <div className="mb-12">
          <ProductCarousel products={featured} lang={lang} onNavigate={onNavigate} />
        </div>

        <div className="text-center">
          <a
            href="#catalog"
            onClick={(e) => { e.preventDefault(); onNavigate?.('catalog'); }}
            className="btn-secondary inline-flex"
          >
            {t.products.viewAll}
            <ArrowRight className={`w-4 h-4 ml-2 ${isRTL ? 'rotate-180' : ''}`} />
          </a>
        </div>
      </div>
    </section>
  );
}
```

Note: `onNavigate` here is typed `(page: string) => void` in `ProductsProps` (matching the pre-existing prop type used by `App.tsx`), but `ProductCarousel` expects `(page: string, slug?: string) => void`. TypeScript's structural typing allows passing a `(page: string) => void` value where `(page: string, slug?: string) => void` is expected only if the extra parameter is optional — it is (`slug?`), so this is fine. `App.tsx`'s actual `navigate` function accepts `(page: string, slug?: string)`, so runtime behavior is correct regardless.

- [ ] **Step 2: Typecheck and build**

```bash
npx tsc -b && npm run build
```

Expected: both succeed with no errors.

- [ ] **Step 3: Manual verify in browser preview**

Start the dev server and open the homepage:
```bash
npm run dev
```
Then in the Browser pane, navigate to the local dev URL, scroll to the "Sản phẩm" section, and confirm:
- Product cards appear immediately (no fade-in delay/stagger).
- Dragging/swiping the row scrolls it horizontally.
- Hovering the row on a desktop-width viewport reveals left/right arrow buttons; clicking them scrolls by one card width.
- Clicking a card navigates to that product's detail page (URL/page changes to the product, not the catalog).
- Resize to a mobile width (e.g. 375px) and confirm no arrow buttons render, only touch/swipe scrolling.

- [ ] **Step 4: Commit**

```bash
git add src/components/Products.tsx
git commit -m "feat: replace homepage Products grid with swipeable ProductCarousel"
```

---

### Task 4: Cross-sell carousel in `BlogPostDetail.tsx`

**Files:**
- Modify: `src/components/BlogPostDetail.tsx`

**Interfaces:**
- Consumes: `ProductCarousel` (Task 2), `getFeaturedProducts` (Task 1), `useLiveProducts` (existing), `products as staticProducts` (existing).
- Produces: no change to the existing `export default function BlogPostDetail({ postId, lang, onNavigate }: BlogPostDetailProps)` signature.

- [ ] **Step 1: Add imports**

At the top of `src/components/BlogPostDetail.tsx`, after the existing imports (currently ending at line 4: `import { fetchBlogPost, type BlogPost } from '../lib/siteContentApi';`), add:

```tsx
import { products as staticProducts } from '../data/products';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { getFeaturedProducts } from '../data/featuredProducts';
import ProductCarousel from './ProductCarousel';
```

- [ ] **Step 2: Compute featured products inside the component**

Inside `export default function BlogPostDetail({ postId, lang, onNavigate }: BlogPostDetailProps) {`, right after the existing `const [post, setPost] = useState<BlogPost | null | undefined>(undefined);` line, add:

```tsx
  const liveProducts = useLiveProducts(staticProducts);
  const featured = getFeaturedProducts(liveProducts);
  const featuredTitle = lang === 'vi' ? 'Sản Phẩm Nổi Bật' : 'Featured Products';
```

- [ ] **Step 3: Render the carousel after the article**

Find this block near the end of the component (currently the last content before the closing tags):

```tsx
            <p className="text-xs text-forest-400 mb-2">{formatDate(post.created_at)}</p>
            <h1 className="font-display text-display-sm md:text-display-md text-forest-900 mb-8">
              {post.title}
            </h1>

            <div>{renderMarkdown(post.body)}</div>
          </article>
        )}
      </div>
    </section>
  );
}
```

Replace it with:

```tsx
            <p className="text-xs text-forest-400 mb-2">{formatDate(post.created_at)}</p>
            <h1 className="font-display text-display-sm md:text-display-md text-forest-900 mb-8">
              {post.title}
            </h1>

            <div>{renderMarkdown(post.body)}</div>
          </article>
        )}

        {post && featured.length > 0 && (
          <div className="mt-16 pt-12 border-t border-forest-100">
            <h2 className="font-display text-xl font-semibold text-forest-900 mb-6">
              {featuredTitle}
            </h2>
            <ProductCarousel products={featured} lang={lang} onNavigate={onNavigate} />
          </div>
        )}
      </div>
    </section>
  );
}
```

Note: this container is `max-w-3xl` (see the outer `<div className="container-wide max-w-3xl">`), narrower than the homepage's `container-wide`. The carousel still works (it scrolls internally within whatever width it's given) — this is expected and not a bug; do not widen the whole article column to fit more cards, that would hurt article readability.

- [ ] **Step 4: Typecheck and build**

```bash
npx tsc -b && npm run build
```

Expected: both succeed with no errors.

- [ ] **Step 5: Manual verify in browser preview**

With the dev server running, navigate to the real published post:
`/blog/44379659-9839-45c4-a543-cb283a46338a`
Confirm:
- Below the article body, a "Sản Phẩm Nổi Bật" heading and horizontal product carousel appear.
- Swiping/scrolling the carousel works inside the narrower article column.
- Clicking a card navigates to that product's detail page.

- [ ] **Step 6: Commit**

```bash
git add src/components/BlogPostDetail.tsx
git commit -m "feat: cross-sell featured products carousel in blog post detail"
```

---

### Task 5: Full-repo verification and brand guard

**Files:** none (verification only)

**Interfaces:** none

- [ ] **Step 1: Run the full pre-deploy check**

```bash
npm run check:brand && npx tsc -b && npm run build
```

Expected: all three succeed. `check:brand` in particular must pass — it scans for leaked supplier names (see `brand-ta-guard` skill); this task didn't introduce any supplier-facing text, but the full guard must still run clean before shipping.

- [ ] **Step 2: Confirm no stray files**

```bash
git status --short
```

Expected: clean (no untracked `scripts/tmp-verify-featured-products.ts` left over from Task 1, no other unexpected files).

- [ ] **Step 3: Push**

Follow the `deploy-vkd-site` skill's push + Vercel deployment verification steps (check deployment status is `READY` and `tasamngoclinh.com` alias points to the new deployment) before considering this plan done.
