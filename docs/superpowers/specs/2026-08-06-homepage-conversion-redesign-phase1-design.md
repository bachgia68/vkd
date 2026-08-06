# Homepage Conversion Redesign — Phase 1

**Date:** 2026-08-06
**Status:** Approved by Joe, pending implementation plan

## Problem

The homepage currently strings together 11 sections (Hero, Stats, ProductAdvisor,
About, Heritage, Products, OmniChannel, Traceability, B2B, Certifications, Blog)
with no funnel logic. Joe's words: "mãi không bán được sản phẩm nào" — the page
does not convert. Joe asked for a KGC-caliber (Korea Ginseng Corporation /
JungKwanJang) upgrade, referencing `jungkwanjang.us` directly. Four confirmed
pain points (Joe, multi-select):

1. Hero isn't premium/persuasive in the first few seconds.
2. Too many sections — visitors scroll past before reaching a way to buy.
3. No trust/social-proof section (reviews, press, real customers).
4. Product presentation doesn't feel "world's most expensive ginseng" premium.

Joe confirmed a dual customer track must coexist: low/mid-price processed goods
(tea, cookies, drinks) should be buyable online now; high-value goods (fresh
root, spirits, corporate gifting) route to Zalo/hotline consultation. This is
now the organizing principle for the whole page, not just the hero.

## Non-goals (Phase 1)

- Do not rebuild About, Heritage (beyond what's already shipped: the saponin
  marquee), Traceability, Certifications, Blog, or OmniChannel visually. They
  stay reachable via nav/other pages, just not on the homepage flow. Phase 2
  revisits them once more real photography/content exists.
- Do not fabricate testimonials, press mentions, or review counts. The Trust &
  Proof section ships as an **admin-authored, publish-gated** block — hidden on
  the public site until Joe adds real content and flips it on.
- Do not touch checkout/PayOS/cart logic — out of scope, higher risk, currently
  working.

## Design

### 1. Section order (homepage only)

Current:
`Hero → Stats → ProductAdvisor → About → Heritage → Products → OmniChannel → Traceability → B2B → Certifications → Blog`

New:
`Hero (dual CTA) → Products (upgraded cards) → Stats (saponin marquee, already shipped) → Elite rewards teaser (new) → ProductAdvisor → Trust & Proof (new, hidden by default) → B2B (absorbs OmniChannel's contact/channel info) → Footer`

Implementation note: `About`, `Heritage`'s pillar grid/gallery (the marquee banner
stays), `Traceability`, `Certifications`, `Blog` are removed from the `home`
render branch in `App.tsx` but their components/routes are untouched — still
reachable from nav and direct links. `OmniChannel`'s unique content (contact
channels) gets folded into `B2B` rather than kept as a separate full section;
if that turns out to lose something load-bearing, we surface it during
implementation rather than assume.

### 2. Hero — dual-path

One brand message, two CTAs, matching the "cả hai" (both) funnel Joe confirmed:

- Headline carries the single strongest claim: 52+/MR2 saponin superiority
  (already the site's best-supported fact per existing i18n content).
- Two CTA buttons, visually distinct (primary gold vs secondary outline):
  - "Mua ngay" → scrolls to/opens the Products section, pre-filtered to
    ready-to-ship goods (tea, cookies, drinks).
  - "Tư vấn Zalo / Quà tặng doanh nghiệp" → opens Zalo deep link (existing
    contact number), for fresh root / spirits / bulk gifting.
- No other content competes for attention in the hero — stat count and CTAs
  only, per the "not enough sections reach the CTA" complaint.

### 3. Products — premium card treatment

- Grid density: 4 → 3 columns on desktop (larger imagery, more breathing room).
- Card background shifts from flat white to a subtle cream/gold-tinted surface;
  gold hairline border appears on hover (matches existing `gold` design token,
  no new colors invented).
- Corner badge per product, driven by existing data fields (no new fake
  claims): origin badge for VKD-sourced fresh/processed root items, "Kiểm định
  Saponin" where `activeIngredient`/`ingredients` data supports it. No
  fabricated "bestseller" badges — only shown when real order data exists
  later.
- CTA button swaps by product type: catalog items with a real fixed price get
  "Thêm vào giỏ"; items already using "Liên hệ"/null price (per existing
  `money()` helper logic used in admin export) get "Chat Zalo" instead of a
  disabled/confusing Add to Cart.

### 4. Elite rewards teaser (new section, small)

Short banner styled like JungKwanJang's Family Reward module: tier name,
headline perk, single CTA. No new tier logic — the loyalty system (Standard /
VIP / VVIP Elite, cashback %, perks) already exists in
`src/data/mockData.ts` (`loyaltyTiers`) and `src/components/LoyaltyDashboard.tsx`
at the `/loyalty` route; it already uses "TA" branding correctly, not "VKD".
This section is purely a homepage entry point that was missing — "Tham gia
miễn phí" → navigates to `loyalty`.

### 5. Trust & Proof (new, hidden until Joe publishes)

- New admin page (or new tab in an existing admin page — decided during
  planning) where Joe pastes real proof items: testimonial text/photo, press
  mention with link, trade-show photo (the existing `gian-hang.jpg`,
  `dai-bieu.jpg` assets qualify once Joe confirms context/captions), real
  certification numbers.
  - Stored the same way other admin mock/editable data is stored today (no
    real DB yet — see `manage-admin-mockdata`); consistent with existing
    patterns, not a new persistence layer.
- A **publish toggle**, default OFF. The public homepage only renders the
  section when: toggle is ON **and** at least one item exists. Empty or
  toggled-off → section doesn't render at all (no placeholder skeleton shown
  to real visitors).

### 6. Brand compliance fix (found during this work, folded in)

`npm run check:brand` does not scan `src/data/*`. Two real, currently-shipping
leaks of literal "VKD Group" wording in customer-facing product description
text (not SKU codes, which are correctly exempt):

- `src/data/vkdProducts.ts:163` (Vietnamese description)
- `src/data/vkdProductTranslations.ts:107,371,635,899` (EN/ZH/FR/AR
  descriptions)

Per Joe's explicit instruction this session ("THAY VKD THÀNH TA TRONG TẤT CẢ
CÁC NƠI PUBLIC"): reword these five descriptions to reference "TA" instead of
"VKD Group", in-language, preserving meaning. SKU codes (`VKD-0xx`) and the
`newsArticles` historical-event block in `mockData.ts` (already correctly
commented as intentionally unrendered/unrenamed — real past events) are
correctly out of scope and stay as-is.

Extend `scripts/check-no-supplier-names.js` to also scan `src/data/*.ts`
string literals assigned to customer-facing fields (`description`, `name`,
`ingredients`, `usage`, `warnings`, `targetUsers`), while continuing to exempt
`sku`/`productId`/slug-like fields, so this class of leak fails CI going
forward instead of silently shipping.

## Testing

- `npm run check:brand` passes with the extended scan and zero literal "VKD"
  outside SKUs/exempted historical block.
- `npx tsc -b` and `npm run build` clean.
- Manual pass in the Browser pane at 320/768/1024/1440px: hero CTAs both
  functional (scroll-to-products, Zalo deep link), product card badges only
  appear where backed by real data, Trust & Proof section absent when toggle
  is off, Elite teaser links to `/loyalty`.
- Confirm nothing under `About`/`Heritage` gallery/`Traceability`/
  `Certifications`/`Blog` becomes unreachable — nav links still resolve.

## Open questions for Phase 2 (not blocking Phase 1)

- Full visual rebuild of About, Heritage pillars, Traceability, B2B,
  Certifications, Blog once Joe has more real photography.
- Whether OmniChannel's content folded into B2B needs its own home again once
  real channel/partner data exists.
