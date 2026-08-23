# Implementation Plan: TA Site Redesign — UI + Payment Integration

## Overview

Redesign tasamngoclinh.com with luxury KGC styling (gold/cream/navy) using Vespi template as base. Implement hero carousel + product grid showcase, integrate multi-currency payments (Stripe/PayPal/Payos), and add bilingual product translations (VI/EN). Target: luxury ginseng e-commerce site, not "TA club".

## Architecture Decisions

1. **Base template:** Vespi (Next.js 14 + Tailwind + Stripe setup already included)
   - Why: Luxury fashion e-commerce, exactly fits KGC aesthetic, payment integration ready
   - Speedup: 50% time saved vs building from scratch

2. **Design-to-code:** Figma mockups (hero, gallery, checkout) → React components
   - Why: Visual approval before code, faster iteration
   - Risk: Figma mockup delays design phase 1-2 days

3. **Payments:** Stripe (primary) + PayPal (fallback) + Payos API (existing, keep)
   - Why: Multiple currency support, free tier available, no new contracts needed
   - Cost: Free tier covers initial volume

4. **i18n:** next-intl with Strapi CMS translations
   - Why: URL-based routing (/vi/, /en/), SEO-friendly, already configured
   - Risk: Needs Strapi translation schema update

5. **Colors:** Tailwind config override (gold #D4AF37, cream #F5F1E8, navy #1a1a1a)
   - Why: KGC luxury brand consistency, already in codebase

---

## Dependency Graph

```
Vespi Template (base)
    ↓
Tailwind theme config (KGC colors)
    ↓
Component library (shadcn/ui + custom)
    ↓
├── Hero carousel section
├── Product gallery component
└── Product detail page
    ↓
├── i18n routing setup
│   ↓
│   └── Strapi translation schema
│       ↓
│       └── Batch translate products
│
└── Checkout flow
    ↓
    Stripe SDK setup
        ↓
        PayPal SDK setup
            ↓
            Payos API integration
                ↓
                Checkout form + payment selection
```

**Implementation order (bottom-up):**
1. Foundation: Vespi + Tailwind theme
2. Components: Hero, gallery, detail page
3. i18n: Routing + translations
4. Payments: Stripe → PayPal → Payos

---

## Task List

### Phase 1: Foundation & Design

#### Task 1: Setup Vespi template + KGC colors
**Description:** Clone Vespi repository, install dependencies, override Tailwind colors with KGC palette (gold/cream/navy).

**Acceptance criteria:**
- [ ] Vespi cloned and dependencies installed
- [ ] Tailwind config updated: gold/cream/navy colors verified
- [ ] `npm run dev` starts without errors
- [ ] Homepage renders with KGC color palette

**Verification:**
- [ ] `npm run dev` → browser shows homepage
- [ ] Color picker shows #D4AF37 (gold) in use
- [ ] No build warnings

**Dependencies:** None

**Files likely touched:**
- `tailwind.config.ts`
- `package.json`

**Estimated scope:** Small (1-2 files)

---

#### Task 2: Figma mockups (hero + gallery + checkout)
**Description:** Design 3 key screens in Figma: (a) hero carousel with best-seller/seasonal rotation, (b) featured product grid (3-col), (c) checkout flow (payment selection).

**Acceptance criteria:**
- [ ] Hero carousel mockup: 1 large featured product + dots navigation
- [ ] Gallery grid: 3 columns, zoom modal on click, responsive
- [ ] Checkout flow: product summary → payment method select → form
- [ ] All screens use KGC colors + luxury typography
- [ ] User approves all 3 mockups

**Verification:**
- [ ] Figma link shared with user
- [ ] User comment: "Approved" on each mockup
- [ ] Components ready for handoff to code

**Dependencies:** Task 1 (colors defined)

**Files likely touched:**
- Figma file (external)

**Estimated scope:** Medium (design only, no code)

---

### Checkpoint: Design Phase Complete
- [ ] Vespi template running locally
- [ ] Figma mockups approved by user
- [ ] KGC colors verified in production
- [ ] Ready to code

---

### Phase 2: Components & Pages

#### Task 3: Implement hero carousel (Carousel + Framer Motion)
**Description:** Build hero carousel component: featured product image + name/price + navigation dots + smooth transitions (Framer Motion).

**Acceptance criteria:**
- [ ] Carousel rotates every 8 seconds (best-seller → seasonal)
- [ ] Dots show active slide + clickable
- [ ] Left/right arrow buttons work
- [ ] Framer Motion animations smooth (no jank)
- [ ] Responsive: hero scales on mobile

**Verification:**
- [ ] `npm run dev` → hero carousel rotates on homepage
- [ ] Click dots → slides change
- [ ] Click arrows → slides change
- [ ] Lighthouse: no animation janks (CLS <0.1)

**Dependencies:** Task 2 (design approved)

**Files likely touched:**
- `components/HeroCarousel.tsx`
- `lib/carousel.ts` (utils)

**Estimated scope:** Small (1-2 files, ~150 lines)

---

#### Task 4: Implement product gallery (Grid + Modal)
**Description:** Build featured products gallery: 3-column grid, product cards with hover effects, zoom modal (full image) on click.

**Acceptance criteria:**
- [ ] Gallery displays 6 featured products from Strapi
- [ ] 3-column layout on desktop, responsive on tablet/mobile
- [ ] Hover: image scales, price highlights
- [ ] Click image: zoom modal appears with Framer Motion fade-in
- [ ] Modal navigation: prev/next products via arrows
- [ ] Close button + click-outside closes modal

**Verification:**
- [ ] `npm run dev` → products grid visible
- [ ] Hover product → zoom effect works
- [ ] Click zoom → modal opens smoothly
- [ ] Modal prev/next work
- [ ] Mobile responsive (1 column)

**Dependencies:** Task 3 (carousel pattern), Task 1 (colors)

**Files likely touched:**
- `components/ProductGallery.tsx`
- `lib/strapi.ts` (fetch products)

**Estimated scope:** Small (1-2 files, ~200 lines)

---

#### Task 5: Product detail page
**Description:** Build single product page: full image, name/price/description, "Add to cart" button, related products carousel.

**Acceptance criteria:**
- [ ] Dynamic route: `/products/[slug]` fetches from Strapi
- [ ] Image gallery (main + thumbnails)
- [ ] Price + description + specs displayed
- [ ] "Add to cart" button functional (adds to cart state)
- [ ] Related products carousel at bottom

**Verification:**
- [ ] Navigate to `/products/sam-ngoc-linh-20` → page loads
- [ ] Image, price, description visible
- [ ] Click "Add to cart" → item added (check cart)
- [ ] Related products appear at bottom

**Dependencies:** Task 4 (gallery pattern), Task 1 (styling)

**Files likely touched:**
- `pages/products/[slug].tsx`
- `lib/strapi.ts` (fetch single product)

**Estimated scope:** Medium (1-2 files, ~250 lines)

---

### Checkpoint: Core Components Done
- [ ] Hero carousel working + rotating
- [ ] Product gallery + modal functional
- [ ] Product detail page live
- [ ] Cart integration basic
- [ ] Manual test all flows

---

### Phase 3: i18n & Translations

#### Task 6: Setup next-intl routing (VI/EN)
**Description:** Configure next-intl: routing middleware, locale detection, switcher component.

**Acceptance criteria:**
- [ ] Routes work: `/vi/products`, `/en/products`
- [ ] Browser language detection auto-selects locale
- [ ] Locale switcher (VI/EN toggle) in header
- [ ] URLs clean (no `?lang=` params)

**Verification:**
- [ ] Navigate `/vi/products` → page in Vietnamese
- [ ] Navigate `/en/products` → page in English
- [ ] Toggle switcher → URL + content changes
- [ ] Reload preserves locale

**Dependencies:** Task 1 (Next.js config)

**Files likely touched:**
- `next.config.js` (i18n plugin)
- `i18n.config.ts` (locale setup)
- `middleware.ts` (routing)
- `components/LocaleSwitch.tsx`

**Estimated scope:** Medium (3-4 files)

---

#### Task 7: Strapi i18n schema + batch translate products
**Description:** Add `locale` field to Strapi products collection. Extract product names/descriptions from Strapi, batch translate VI ↔ EN using DeepL API, import back.

**Acceptance criteria:**
- [ ] Strapi products collection has `locale` field (vi/en enum)
- [ ] 20+ products translated and stored in Strapi
- [ ] Verify: `/vi/products` shows Vietnamese names
- [ ] Verify: `/en/products` shows English names

**Verification:**
- [ ] Strapi admin: products table shows `locale` column with values
- [ ] API: `GET /api/products?locale=vi` returns VI products
- [ ] Browser: product titles in correct language by locale

**Dependencies:** Task 6 (routing ready)

**Files likely touched:**
- Strapi schema update (admin UI)
- `scripts/translate-products.js` (batch translate)

**Estimated scope:** Medium (1 script, Strapi schema)

---

### Checkpoint: i18n Complete
- [ ] Routing works (vi/en)
- [ ] Products translated (20+)
- [ ] Switcher functional
- [ ] Ready for payment integration

---

### Phase 4: Payments

#### Task 8: Setup Stripe integration
**Description:** Install Stripe SDK, configure keys, create payment intent endpoint, build payment form component.

**Acceptance criteria:**
- [ ] Stripe API keys configured (.env)
- [ ] Checkout page has Stripe card element
- [ ] "Pay now" button creates payment intent
- [ ] Stripe payment modal opens
- [ ] Test payment succeeds (Stripe test cards)

**Verification:**
- [ ] Navigate to checkout
- [ ] Enter Stripe test card (4242 4242 4242 4242)
- [ ] Click "Pay" → payment processes
- [ ] Stripe dashboard shows test transaction

**Dependencies:** Task 5 (cart + checkout page)

**Files likely touched:**
- `api/payment/create-intent.ts` (Stripe endpoint)
- `components/StripeCheckout.tsx` (payment form)
- `.env` (Stripe keys)

**Estimated scope:** Medium (2-3 files)

---

#### Task 9: Setup PayPal integration
**Description:** Add PayPal SDK, configure client ID, integrate into checkout flow as secondary payment method.

**Acceptance criteria:**
- [ ] Checkout has payment method selector (Stripe/PayPal/Payos)
- [ ] Selecting PayPal shows PayPal buttons
- [ ] PayPal authorization flow works
- [ ] Test payment succeeds (PayPal sandbox)

**Verification:**
- [ ] Checkout: radio button for PayPal visible
- [ ] Click PayPal → PayPal buttons appear
- [ ] Click "Pay with PayPal" → PayPal window opens
- [ ] Complete test payment → order created

**Dependencies:** Task 8 (payment flow established)

**Files likely touched:**
- `components/PayPalCheckout.tsx` (PayPal buttons)
- `api/payment/paypal-webhook.ts` (webhook)

**Estimated scope:** Small (1-2 files)

---

#### Task 10: Integrate Payos (existing payment provider)
**Description:** Connect Payos API (Vietnam domestic payments). Add as payment method option in checkout.

**Acceptance criteria:**
- [ ] Checkout payment selector includes Payos option
- [ ] Payos payment link generated on order submit
- [ ] Customer redirected to Payos payment page
- [ ] Webhook listener confirms payment

**Verification:**
- [ ] Checkout: Payos option visible
- [ ] Select Payos → payment page loads
- [ ] Complete test payment → order status updates
- [ ] Webhook fires correctly

**Dependencies:** Task 8 (payment infrastructure)

**Files likely touched:**
- `components/PayosCheckout.tsx` (Payos integration)
- `api/payment/payos-webhook.ts` (webhook)

**Estimated scope:** Small (1-2 files)

---

### Checkpoint: Payments Complete
- [ ] All 3 payment methods working
- [ ] Test payments processed
- [ ] Order confirmation page shows
- [ ] Ready for launch

---

### Phase 5: Polish & QA

#### Task 11: Responsive design + mobile testing
**Description:** Test all pages on mobile (320px), tablet (768px), desktop (1280px). Fix layout issues.

**Acceptance criteria:**
- [ ] All pages responsive (mobile-first)
- [ ] No horizontal scroll
- [ ] Touch targets ≥48px
- [ ] Images scale properly
- [ ] Forms work on mobile keyboard

**Verification:**
- [ ] Use DevTools: set mobile (375x812)
- [ ] Test homepage → hero, gallery, footer visible
- [ ] Test product page → all content accessible
- [ ] Test checkout → form fills easily on mobile
- [ ] Lighthouse mobile score ≥80

**Dependencies:** Tasks 3-10 (all pages)

**Files likely touched:**
- Various component responsive fixes

**Estimated scope:** Medium (multiple files)

---

#### Task 12: Performance optimization (images, caching)
**Description:** Optimize images (WebP format, lazy loading), add caching headers, verify Lighthouse metrics.

**Acceptance criteria:**
- [ ] All product images converted to WebP
- [ ] Images lazy-load on scroll
- [ ] LCP <2.5s (core web vital)
- [ ] CLS <0.1 (no layout shift)
- [ ] FID <100ms (fast interaction)

**Verification:**
- [ ] Lighthouse: Performance score ≥85
- [ ] DevTools Network: images load lazy
- [ ] PageSpeed Insights green metrics

**Dependencies:** Tasks 3-5 (image components)

**Files likely touched:**
- Image optimization scripts
- Component performance tweaks

**Estimated scope:** Medium (multiple files)

---

#### Task 13: Testing + bug fixes
**Description:** Manual end-to-end testing: hero rotation, gallery zoom, product detail, checkout all 3 payment methods, i18n switching. Log + fix bugs.

**Acceptance criteria:**
- [ ] Hero carousel rotates smoothly
- [ ] Gallery: hover + zoom + modal work
- [ ] Product detail: all info displays, add to cart works
- [ ] Checkout: all 3 payment methods tested
- [ ] i18n: VI/EN switcher works on all pages
- [ ] No console errors

**Verification:**
- [ ] Full manual test checklist completed
- [ ] No critical bugs logged
- [ ] All payment methods tested with real flows
- [ ] Sign-off: ready for production

**Dependencies:** All tasks 1-12

**Files likely touched:**
- Bug fixes across codebase

**Estimated scope:** Medium (varies per bugs found)

---

### Checkpoint: Launch Ready
- [ ] All features working
- [ ] Mobile responsive ✓
- [ ] Performance optimized ✓
- [ ] Payments tested ✓
- [ ] i18n complete ✓
- [ ] Bug-free ✓
- [ ] **READY FOR PRODUCTION**

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Vespi template outdated | Medium | Use latest branch, test compatibility early |
| Payment provider auth delays | High | Test Stripe/PayPal first, Payos is backup |
| Figma design approval delays | Medium | Use mockups as guidance, iterate with user feedback |
| i18n routing issues | Medium | Test routing early (Task 6), common next-intl patterns |
| Mobile responsiveness rework | Medium | Test mobile from Task 3 onward, not end |
| Performance (images too large) | Medium | Optimize images Task 12, lazy-load from start |

---

## Open Questions

- Should Payos be primary or secondary payment method?
- Any VN-specific tax/compliance requirements for checkout?
- Product reviews/ratings needed for product detail page?

---

## Timeline

**Week 1 (Aug 21-27):** Foundation + Design (Tasks 1-2)  
**Week 2 (Aug 28-Sep 3):** Components (Tasks 3-7)  
**Week 3 (Sep 4-10):** Payments + Polish (Tasks 8-13)  
**Target launch:** Sep 10, 2026

---

## Success Criteria

✅ Hero carousel working (best-seller + seasonal rotation)  
✅ Product gallery with zoom modal  
✅ Bilingual (VI/EN) with switcher  
✅ All 3 payment methods tested  
✅ Mobile responsive + Lighthouse >85  
✅ No critical bugs
