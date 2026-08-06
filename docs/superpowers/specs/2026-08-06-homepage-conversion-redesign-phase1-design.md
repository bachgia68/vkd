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
`Hero (dual CTA) → Products (upgraded cards + "Combo tháng này") → Stats (saponin marquee, already shipped) → Elite rewards teaser (new) → ProductAdvisor → Uy tín & Chứng nhận (real certs, always visible + new gated proof block) → B2B (absorbs OmniChannel's contact/channel info) → Footer`

Implementation note: `About`, `Heritage`'s pillar grid/gallery (the marquee banner
stays), `Traceability`, `Blog` are removed from the `home` render branch in
`App.tsx` but their components/routes are untouched — still reachable from
nav and direct links. `Certifications` stays on the homepage (moved lower,
see §5 — it is real content, not cut). `OmniChannel`'s unique content
(contact channels) gets folded into `B2B` rather than kept as a separate full
section; if that turns out to lose something load-bearing, we surface it
during implementation rather than assume.

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

### 5. Uy tín & Chứng nhận — real certs stay visible, new proof stays gated

Two distinct things, do not conflate:

- **`Certifications` component (existing, real, ships as-is)**: 7 real scanned
  certificate images (cGMP, HACCP CODEX 2020, ISO 9001:2015, ISO 22000:2018,
  3× Sâm Ngọc Linh certification) at `/certifications/*.jpg`, already coded
  with a lightbox. This is real evidence available today — it **stays
  visible to every visitor**, just moves to the new lower position in the
  section order (§1), it is never hidden or gated. (Corrects the original
  Phase 1 draft, which grouped this with the hidden-until-published block —
  that was wrong; only the *new* testimonial/press content needs a gate, not
  content that already exists and is true today.)
- **New admin-authored block, appended below/alongside Certifications**:
  testimonials, press mentions, trade-show photos (`gian-hang.jpg`,
  `dai-bieu.jpg` once Joe confirms captions) — this is the part with no real
  content yet. New admin page where Joe pastes items, stored the same way
  other admin mock/editable data is stored today (no real DB yet — see
  `manage-admin-mockdata`). A **publish toggle**, default OFF. Renders only
  when toggle is ON **and** at least one item exists; otherwise doesn't
  render at all — no empty skeleton shown to real visitors.

### 6. Combo / Gift Sets (new, folded into Phase 1 per Joe)

Joe already runs seasonal gift-combo promotions off-platform (reference:
designer-made posters in `D:\TA page\site\combo SP\` — e.g. "COMBO 3: SUM
VẦY" for Vu Lan month, 2 hộp bánh + 2 gói kẹo + 1 hộp trà + 1 chai rượu 10
năm, fixed price 1.430k). None of this exists on-site today; the `giftSets`
nav item (`catalog?type=set-qua-tang`) already exists in `Header.tsx` but has
no products behind it — dead link today.

- **Data model**: a combo is a single purchasable item with a fixed price,
  assembled by admin from existing SKUs — not new inventory, not a new
  checkout path. `ComboSet { id, slug, name, theme, monthTags: number[],
  componentSkus: string[], price, posterImage, description, active }`.
  Reuses the existing cart/checkout as one line item — the "assembled from
  SKUs" part is bookkeeping/display only (shows "gồm: ..." on the product
  card), it does not decompose into separate cart lines. This keeps checkout
  risk at zero, per the Phase 1 non-goal of not touching PayOS/cart logic.
- **Admin builder**: new page, tick existing products (same checkbox-list UX
  already shipped in `CatalogExportPage.tsx` — reuse the pattern, not
  reinvent it), set name/theme/month/price, upload a poster image (the
  existing designer images in `combo SP/` are usable directly), Active
  toggle. **Must be usable from a phone** — mobile-first layout per
  `frontend-ui-engineering`, tested at 320/375px, not just desktop.
- **Admin access**: `bachgia68@gmail.com` logging in from multiple devices is
  already supported by the existing architecture — `AdminAuthContext.tsx`
  uses real Supabase Auth sessions, which are per-device/per-browser by
  design; there is no code-level single-session restriction to remove. No
  code change needed here. (If multi-device login is *not* actually working
  for Joe today, that's a Supabase project/account configuration question —
  outside what a code change can fix — flag it back to Joe rather than
  guessing at a fix.)
- **Customer-facing placement**:
  - `Set Quà Tặng` catalog page (nav already exists): lists all active
    combos, grouped by theme/month, current month's combos surfaced first.
  - Homepage: small "Combo tháng này" block showing active combos for the
    current month (reuses the Products section's premium card treatment,
    §3) — sits within the Products area of the new section order, not as a
    separate full section.
- **Marketing copy**: once the admin builder ships and Joe has entered the
  real combos, draft short, punchy multi-channel captions (FB/Zalo/TikTok)
  for the existing designed posters (`combo1.jfif`, `combo2.jfif`,
  `combo3.jfif`, `thang7.jfif`) as a deliverable Joe reviews and posts
  himself — posting to social channels on Joe's behalf requires his explicit
  go-ahead each time and isn't something this build does automatically.

### 7. Brand compliance fix (found during this work, folded in)

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
  appear where backed by real data, real certification images always visible,
  new testimonial/press block absent when toggle is off, Elite teaser links
  to `/loyalty`.
- Combo builder: create/edit/deactivate a combo from the admin page at
  320/375px (phone-width) without horizontal scroll or unusable controls;
  confirm an active combo appears on both `Set Quà Tặng` and the homepage
  "Combo tháng này" block, adds to cart as one line item at the combo price,
  and a deactivated/expired-month combo disappears from both.
- Confirm nothing under `About`/`Heritage` gallery/`Traceability`/`Blog`
  becomes unreachable — nav links still resolve.

## Open questions for Phase 2 (not blocking Phase 1)

- Full visual rebuild of About, Heritage pillars, Traceability, B2B, Blog
  once Joe has more real photography.
- Whether OmniChannel's content folded into B2B needs its own home again once
  real channel/partner data exists.
- Whether combos should ever decompose into per-SKU inventory deduction
  (currently out of scope — combo assembly is bookkeeping/display only).
