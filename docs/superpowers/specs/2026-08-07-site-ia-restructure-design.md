# Site-wide IA & Navigation Restructure — Design

**Date:** 2026-08-07
**Status:** Approved by Joe, pending implementation plan

## Problem

Two related structural gaps, surfaced from Joe's request to study jungkwanjang.us
(JKJ, Korea Ginseng Corporation) and "brainstorm the whole structure at once
instead of fixing it a few more times":

1. **Single navigation axis.** TA's catalog is only browsable by product type
   (Sâm Củ Tươi & Khô, Sâm Ngâm Mật Ong, Trà & Nước Uống...). JKJ browses by
   three parallel axes — Product Type, Ingredient, and Benefit/health goal.
   TA already computes a health-goal-like signal (`ProductAdvisor.tsx`'s quiz,
   backed by every product's real `healthGoal` field: `energy | stress |
   immunity | youth`) but it only surfaces as a one-off homepage quiz, never
   as a real navigable filter.
2. **Orphaned pages.** `About.tsx`, `OmniChannel.tsx`, `Blog.tsx`,
   `Showrooms.tsx` are fully built components with no route or nav entry
   pointing at them (a side effect of the 2026-08-06 homepage reorder, which
   correctly removed them from the homepage scroll but never gave them a
   real destination elsewhere). They are dead code today — not deleted, not
   reachable.

This document is a decomposition of a larger 4-part request (see Joe's
2026-08-07 message). This spec covers **Sub-project A only** — IA/navigation
restructure. Three sibling sub-projects are explicitly out of scope here and
tracked separately:

- **Sub-project B** — real legal pages (`/policies/*` equivalent: Privacy,
  Terms, Shipping, Refund). TA currently has zero; JKJ has a full set. Found
  during this research pass, not part of Joe's original ask, but flagged as
  higher real-world priority than cosmetic work since PayOS checkout is live
  without any of them.
- **Sub-project C** — combo auto-fill (price/description/image sourced from
  component products instead of manual entry).
- **Sub-project D** — Products section motion/feel polish, JKJ-inspired.

## Non-goals (this spec)

- **No visual redesign of any orphaned page's internals.** `About.tsx`,
  `Blog.tsx`, `OmniChannel.tsx`, `Showrooms.tsx` keep their existing
  JSX/styling exactly as-is. This spec only restores a real route + nav
  entry pointing at each. A full redesign to match the Products-section
  visual bar is a separate future spec (Phase 2 candidate — do not start it
  as part of this work).
- No change to any existing page's props/API surface.
- No new color palette or design tokens — reuses existing `gold-400` /
  `forest-900` tokens throughout, confirmed against the verified JKJ palette
  research (`docs/reports/2026-08-07-premium-positioning-brand-guidelines.md`
  §7.1): JKJ's `#de3741` red is their own brand mark, not to be copied: the
  design principle (one strong accent color against a cream/white base) is
  what transfers, and TA's gold already fills that role.
- No JKJ-style "order milestone" bonus-point mechanic (3rd order = auto
  bonus) — noted as a Phase 2 open question pending Joe confirming TA has
  enough repeat-order volume for it to matter.

## Design

### 1. `site_sections` table — admin-controlled page visibility

New Supabase table, following the exact admin-authored/public-gated pattern
already used for `trust_proof_items` and `combo_sets` (RLS: admin full
access via `is_admin()`, public read where `visible = true`):

```sql
create table public.site_sections (
  id uuid primary key default extensions.uuid_generate_v4(),
  key text not null unique,
  label_vi text not null,
  nav_group text not null default '',
  path text not null,
  visible boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Seed 4 rows, all `visible = false` by default (matches the "publish gate off
by default" rule used everywhere else in this codebase):

| key | label_vi | nav_group | path |
|---|---|---|---|
| `about` | Về TA | Giới thiệu | `about` |
| `blog` | Blog | (top-level) | `blog` |
| `omnichannel` | Kênh Phân Phối | (folds into B2B page, no separate nav entry) | `` (not a route — see below) |
| `showrooms` | Showroom | (top-level) | `showrooms` |

`omnichannel`'s `path` is left empty and unused by the app — it's not a
`currentPage` value, since §3 renders it inline inside the existing `home`
page rather than as its own route. The column exists for the other 3 rows
only; kept in the row for schema uniformity, not because it's read anywhere.

Read function `fetchVisibleSections()` in `siteContentApi.ts` (public,
`visible = true` only). Admin CRUD (`fetchAllSiteSections`,
`updateSiteSection` — toggle only, no create/delete needed since the 4 rows
are fixed seed data, not admin-authored content) in `adminApi.ts`. New admin
page `SiteSectionsPage.tsx`: a simple list of the 4 rows with a toggle per
row — same list/toggle UX already shipped in `TrustProofPage.tsx`, no new
UI pattern invented. Nav entry "Quản lý Trang" added to `AdminLayout.tsx`'s
`NAV` array.

Joe controls visibility himself from `/gate-vkd-control-2026/site-sections` —
no code change needed to turn a page on once it has real content.

### 2. Third product-type group: "Đặc Sản Việt Nam" (future-proofing)

Joe wants a designated, ready-to-use slot for future non-ginseng Vietnamese
specialty products (regional foods, other herbal goods) without another
structural rework when that day comes. `ProductTypeMeta`
(`src/data/productTypes.ts`) gets one new field: `group: 'sam' | 'dac-san'`.
6 of the 7 existing categories are `'sam'`; `nam-lim-duoc-lieu` (Nấm Lim
Xanh & Dược Liệu) — already conceptually a non-ginseng forest specialty —
is reclassified to `'dac-san'`, becoming the first real entry in that group
rather than an empty placeholder.

The "Sản phẩm" mega-menu (§2 below) renders a 3rd column, "Đặc Sản Việt
Nam", generated from `productTypes.filter(t => t.group === 'dac-san')` —
data-driven, not hardcoded. When Joe later adds a genuinely new specialty
category, adding one entry to `productTypes.ts` with `group: 'dac-san'`
is the entire change; `Header.tsx`/`ProductCatalog.tsx` need no edits.

**Homepage `Products.tsx`'s 4-card layout is explicitly NOT touched by
this** — it stays sâm-focused until the `dac-san` group has ≥2-3 real
products, at which point a 5th card or a dedicated section is a natural,
separate follow-up. Not built now: an empty/placeholder card for a
category with one product would look unfinished, not premium.

**Ingredient axis (JKJ's 3rd axis) — explicitly deferred, not built now.**
JKJ browses by Ingredient (Ginseng, Deer Antler, Collagen, Honey...)
because their catalog data is clean, curated ingredient tags. TA's
equivalent fields (`Product.activeIngredient`, `Product.ingredients`) are
free-text strings written per-product by whoever entered that product —
inconsistent, not a controlled vocabulary (e.g. "MR2 Saponin 52+" vs
"Chiết xuất sâm" vs blank). Auto-classifying 84 products into ingredient
groups from that text would mean guessing/misclassifying real products,
which is the same category of mistake as fabricating data — not
acceptable here. Building this properly needs either (a) an admin field to
tag each product with 1+ standardized ingredient values as products are
added/edited, or (b) Joe manually curating a mapping — both are real work
requiring Joe's input, not something to auto-build today. Logged as a
Phase 2 candidate; do not attempt automatic classification.

### 3. Second navigation axis: "Mục tiêu sức khỏe" (health goal)

Uses the existing `HealthGoal` type (`'energy' | 'stress' | 'immunity' |
'youth'`, `src/data/mockData.ts`) already present on every `Product` row —
no new data, just a new way to browse data that already exists.

- **Header.tsx**: "Sản phẩm" becomes a three-column mega-menu. Column 1:
  the 6 `group: 'sam'` product-type categories. Column 2: the
  `group: 'dac-san'` categories (§2 — just 1 entry today, grows over time).
  Column 3: 4 health-goal entries (Tăng lực / Giảm stress / Tăng miễn dịch /
  Trẻ hoá), each navigating to `catalog?goal=<value>` instead of
  `catalog?type=<value>`.
- **ProductCatalog.tsx**: add a second filter group "MỤC TIÊU SỨC KHỎE" in
  the sidebar, parallel to the existing "NHÓM DANH MỤC" product-type filter.
  Reads a new `goal` query param the same way `type` is read today
  (`new URLSearchParams(queryString).get('goal')`), filters `products` by
  `p.healthGoal === activeGoal`. The two filter axes are independent —
  selecting a health goal does not clear an active product-type filter, and
  vice versa (both narrow the same `filtered` list via `&&`).

### 4. Reconnecting orphaned pages — placement per page

Each orphaned page gets the destination that fits its content, not a single
dumping-ground menu item:

- **`About.tsx`** → folds into the existing "Giới thiệu" header dropdown,
  alongside "Câu chuyện người sáng lập" (`about-story` / `FounderStory.tsx`,
  already live). New `currentPage === 'about'` branch in `App.tsx` renders
  `About.tsx` standalone. Dropdown entry only appears when `site_sections`
  row `about.visible = true`.
- **`Blog.tsx`** → new top-level nav item "Blog", placed next to "Nghiên
  Cứu" (same content register — long-form informational content). New
  `currentPage === 'blog'` branch. Gated on `blog.visible`.
- **`OmniChannel.tsx`** → per the original Phase 1 spec's own note ("content
  chưa chắc load-bearing riêng"), folds into the existing B2B page instead
  of getting its own nav entry — rendered as an additional block within
  `currentPage === 'home'`'s B2B section when `omnichannel.visible = true`.
  No new route.
- **`Showrooms.tsx`** → new top-level nav item "Showroom", placed next to
  "Truy xuất" (both are "kênh thực tế xem hàng thật" in the same conceptual
  group). New `currentPage === 'showrooms'` branch. Gated on
  `showrooms.visible`.

### 5. Data flow

`App.tsx` fetches `fetchVisibleSections()` once on mount into
`visibleSections: Set<string>` state (keyed by `site_sections.key`). The 3
new route branches (`about`, `blog`, `showrooms`) each check
`visibleSections.has('<key>')` before rendering — if a section is toggled
off, its route falls through to nothing rendering (same as any other
`currentPage` value with no matching branch today; not a 404, just blank
`<main>`, matching existing behavior for unmapped page values). `Header.tsx`
receives `visibleSections` as a prop and filters the 3 new nav entries
before rendering — old nav items are untouched, no risk of regressing
existing navigation.

## Testing

- `npm run check:brand`, `npx tsc -b`, `npm run build` all clean.
- Supabase: `site_sections` table + RLS policies verified via `execute_sql`
  (2 policies: admin full access, public read where visible=true), 4 rows
  seeded, all `visible = false`.
- Manual: with all 4 sections OFF (seed state), confirm none of their nav
  entries appear and their routes render nothing (no crash). Toggle each ON
  from `/gate-vkd-control-2026/site-sections` one at a time, confirm its nav
  entry appears and its route renders the existing component correctly.
  Toggle back OFF, confirm it disappears again.
- Manual: catalog filtering — select a health-goal filter, confirm only
  matching products show; combine with a product-type filter, confirm both
  narrow together (AND, not OR); clear both, confirm full catalog returns.
- Full nav sweep at 375px and 1440px (repeat of the Phase 1 sweep) since
  `Header.tsx`'s mega-menu structure changes.

## Open questions for later (not blocking this spec)

- Visual redesign of About/Blog/Showrooms to match the Products-section bar
  (Phase 2, separate spec).
- JKJ-style order-milestone bonus points (needs Joe's confirmation TA has
  enough repeat-order volume).
- B2B page's cost/process breakdown per partnership type (needs real
  numbers from Joe, not fabricated).
- Sub-project B (legal pages), C (combo auto-fill), D (Products motion) —
  each gets its own spec after this one ships.
