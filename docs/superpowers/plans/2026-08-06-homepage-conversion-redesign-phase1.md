# Homepage Conversion Redesign Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `tasamngoclinh.com`'s homepage into a conversion-focused funnel (dual-CTA hero → premium products → trust signals) and ship an admin-built seasonal Combo/Gift Sets feature, per `docs/superpowers/specs/2026-08-06-homepage-conversion-redesign-phase1-design.md`.

**Architecture:** React 19 + TypeScript + Vite SPA (`ta_production/project`), Tailwind v4 (`@theme` in `src/index.css`), Supabase Postgres (project `xcwirgrlnibnjmseglee`, "Vkd web Project") for anything persistent, React Router for admin routes under `/gate-vkd-control-2026`. Existing pattern for admin-editable public content: a table with `active`/`published` boolean, RLS policy pair (`admin full access <table>` on `authenticated` role via `is_admin()`, `public read <condition> <table>` on `public` role), a read function in `src/lib/siteContentApi.ts`, write functions in `src/admin/adminApi.ts`. Follow this pattern exactly for new tables — do not invent a different persistence approach.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS v4, react-router-dom 7, @supabase/supabase-js, lucide-react icons.

## Global Constraints

- Never write literal supplier names ("VKD", "TRIMICO", "Triet Minh", "Vo Kim Duong") into any customer-facing text, label, alt text, or i18n string. "TA" is the only customer-facing brand name. SKU codes (`VKD-0xx`) and kebab-case technical IDs are exempt. (Source: `brand-ta-guard` skill.)
- Do not fabricate ratings, review counts, testimonials, press mentions, or statistics. Only display data that is real and currently available; gate anything not-yet-real behind an explicit off-by-default toggle.
- Run `npm run check:brand`, `npx tsc -b`, and `npm run build` before every commit that touches `src/`.
- Admin pages must be usable at 320–375px viewport width (phone) — this is an explicit requirement from Joe, not a nice-to-have.
- Do not touch PayOS/checkout logic (`Checkout.tsx`, `api/create-payos-payment.ts`, `api/payos-webhook.ts`) — out of scope, currently working, high risk to break.
- Every Supabase migration must be applied via the Supabase MCP `apply_migration` tool against project id `xcwirgrlnibnjmseglee` (there are no local `.sql` migration files in this repo — schema changes are not currently version-controlled locally, only in the live project).
- Working directory for all commands: `D:\TA page\site\ta_production\project` (also reachable as `D:/TA page/site/ta_production/project` from Bash).

---

## Task 1: Verify and commit already-completed session work

Earlier this session, four changes were already made and manually verified (`tsc -b` + `npm run build` clean) but never committed on their own — they're sitting in the working tree mixed with unrelated pre-existing uncommitted changes from other work. Commit only these four, nothing else.

**Files:**
- Modify (already done, just verify + commit): `index.html`, `src/index.css`, `src/components/Heritage.tsx`, `vite.config.ts`, `src/admin/pages/CatalogExportPage.tsx`

**Interfaces:**
- Produces: working favicon fix, saponin marquee section in `Heritage.tsx`, stable admin Excel/PDF export (consumed visually by later tasks — Task 6 repositions `Heritage.tsx`'s output further down the page but does not change its internals).

- [ ] **Step 1: Confirm the four files still contain the intended changes**

Run: `cd "D:/TA page/site/ta_production/project" && git diff --stat index.html src/index.css src/components/Heritage.tsx vite.config.ts src/admin/pages/CatalogExportPage.tsx`
Expected: all five paths listed with non-zero changes. If any is empty, stop and investigate before continuing — do not proceed on a false assumption.

- [ ] **Step 2: Type-check and build**

Run: `npx tsc -b && npm run build`
Expected: exits 0, no errors. (The `prebuild` brand guard script also runs automatically and must pass.)

- [ ] **Step 3: Stage and commit only these five files**

```bash
cd "D:/TA page/site/ta_production/project"
git add index.html src/index.css src/components/Heritage.tsx vite.config.ts src/admin/pages/CatalogExportPage.tsx
git status --short
```
Expected `git status --short` output: exactly 5 lines, all starting with `M `, matching the five paths above — no other files. If any other file appears staged, run `git restore --staged <that file>` before committing.

```bash
git commit -m "$(cat <<'EOF'
fix: TA favicon, saponin marquee, and admin export dev-cache bug

- index.html: replace placeholder favicon.svg with the real TA logo
- Heritage.tsx + index.css: replace the static saponin banner with a
  horizontal auto-scrolling product marquee
- vite.config.ts: pre-bundle exceljs/file-saver/jspdf/qrcode so the
  admin Excel/PDF export stops failing with a stale dev dep-cache error
- CatalogExportPage.tsx: professional cover-page + QR + 2-column grid
  PDF catalog export

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Fix "VKD Group" leaking into customer-facing product descriptions

**Files:**
- Modify: `src/data/vkdProducts.ts:163`
- Modify: `src/data/vkdProductTranslations.ts:107,371,635,899`
- Modify: `scripts/check-no-supplier-names.js`

**Interfaces:**
- Produces: `npm run check:brand` now also fails on future `src/data/*.ts` leaks in customer-facing fields.

- [ ] **Step 1: Fix the Vietnamese description**

In `src/data/vkdProducts.ts`, line 163, change:
```
description: 'Trà túi lọc từ lát Sâm Ngọc Linh sấy khô — sản phẩm thuộc hành trình gần 10 năm nghiên cứu và phát triển của VKD Group với sứ mệnh "mang Sâm Ngọc Linh đến với mọi nhà".',
```
to:
```
description: 'Trà túi lọc từ lát Sâm Ngọc Linh sấy khô — sản phẩm thuộc hành trình gần 10 năm nghiên cứu và phát triển của TA với sứ mệnh "mang Sâm Ngọc Linh đến với mọi nhà".',
```

- [ ] **Step 2: Fix the English, Chinese, French, and Arabic descriptions**

In `src/data/vkdProductTranslations.ts`:

Line 107 (English), change:
```
description: 'Tea bags made from dried sliced Ngoc Linh ginseng — a product of VKD Group\'s nearly decade-long research and development journey, on a mission to bring Ngoc Linh ginseng to every home.',
```
to:
```
description: 'Tea bags made from dried sliced Ngoc Linh ginseng — a product of TA\'s nearly decade-long research and development journey, on a mission to bring Ngoc Linh ginseng to every home.',
```

Line 371 (Chinese), change:
```
description: '以玉琳参干燥切片制成的袋泡茶——凝聚VKD Group近十年研发心血,致力于"让玉琳参走进千家万户"。',
```
to:
```
description: '以玉琳参干燥切片制成的袋泡茶——凝聚TA近十年研发心血,致力于"让玉琳参走进千家万户"。',
```

Line 635 (French), change:
```
description: 'Thé en sachets élaboré à partir de tranches de ginseng Ngoc Linh séchées — fruit de près de 10 ans de recherche et développement chez VKD Group, avec pour mission d\'« apporter le ginseng Ngoc Linh dans tous les foyers ».',
```
to:
```
description: 'Thé en sachets élaboré à partir de tranches de ginseng Ngoc Linh séchées — fruit de près de 10 ans de recherche et développement chez TA, avec pour mission d\'« apporter le ginseng Ngoc Linh dans tous les foyers ».',
```

Line 899 (Arabic), change:
```
description: 'شاي أكياس مصنوع من شرائح جينسنغ نوك لين المجففة — ثمرة رحلة بحث وتطوير امتدت قرابة عشر سنوات لدى VKD Group، انطلاقًا من رسالتها في «إيصال جينسنغ نوك لين إلى كل بيت».',
```
to:
```
description: 'شاي أكياس مصنوع من شرائح جينسنغ نوك لين المجففة — ثمرة رحلة بحث وتطوير امتدت قرابة عشر سنوات لدى TA، انطلاقًا من رسالتها في «إيصال جينسنغ نوك لين إلى كل بيت».',
```

- [ ] **Step 2: Read the current guard script**

Run: `cat "D:/TA page/site/ta_production/project/scripts/check-no-supplier-names.js"`

Note its current scan globs and banned-word list before editing — the next step must extend it, not replace its existing behavior for `src/components`/`src/pages`/`index.html`/`src/i18n/translations.ts`.

- [ ] **Step 3: Extend the script to scan customer-facing fields in `src/data/*.ts`**

Add a second scan pass to `scripts/check-no-supplier-names.js` that:
- Globs `src/data/*.ts`
- For each file, matches string literal values assigned to these keys only: `description`, `name`, `ingredients`, `usage`, `warnings`, `targetUsers` (use a regex like `/(?:description|name|ingredients|usage|warnings|targetUsers):\s*'((?:[^'\\]|\\.)*)'/g` per line, or the file's existing string-matching approach if it already uses one — match the existing script's style rather than introducing a new one)
- Runs the same banned-keyword check (`VKD`, `TRIMICO`, `Triet Minh`, `Vo Kim Duong` — whatever list the script already uses) against only the captured value, not the whole line, so `sku: 'VKD-001'` and `productId: 'VKD-010'` are never flagged
- Reports violations in the same format/exit-code convention the script already uses for its other scans, so `npm run build`'s `prebuild` step still fails correctly on a real violation

- [ ] **Step 4: Run the guard and confirm it's clean**

Run: `cd "D:/TA page/site/ta_production/project" && npm run check:brand`
Expected: `✅ Brand Guard: không tìm thấy tên NCC nào...` — zero violations, including from the newly-scanned `src/data/*.ts` files.

- [ ] **Step 5: Type-check and build**

Run: `npx tsc -b && npm run build`
Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/data/vkdProducts.ts src/data/vkdProductTranslations.ts scripts/check-no-supplier-names.js
git commit -m "$(cat <<'EOF'
fix: replace VKD Group with TA in customer-facing product descriptions

Five product descriptions (vi/en/zh/fr/ar) named the supplier "VKD
Group" directly in text customers read on the product detail page —
a brand-house violation the existing guard script couldn't catch
because it only scans src/components, src/pages, index.html, and
i18n labels, not src/data/*.ts description fields. Extends the guard
to close that gap going forward.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Hero — dual-path CTA, remove redundant trust badges, add saponin stat

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/i18n/translations.ts` (hero `cta`/`ctaSecondary` strings, all 5 languages)

**Interfaces:**
- Consumes: `t.heritage.saponinCount` / `t.heritage.saponinTypes` (already exist in `translations.ts`, e.g. `'52+'` / `'Loại Saponin'`).
- Produces: no new exports; `Hero` remains a default export with the same `HeroProps` shape.

- [ ] **Step 1: Update hero `cta` and `ctaSecondary` copy in all 5 languages**

In `src/i18n/translations.ts`, Vietnamese block (around line 158-159), change:
```
      cta: 'Xem Sản Phẩm Tuyển Chọn',
      ctaSecondary: 'Đặt Lịch Thăm Vườn',
```
to:
```
      cta: 'Mua Ngay',
      ctaSecondary: 'Tư Vấn Zalo & Quà Tặng Doanh Nghiệp',
```

English block (around line 299-300), change:
```
      cta: 'View Curated Products',
      ctaSecondary: 'Book a Garden Visit',
```
to:
```
      cta: 'Shop Now',
      ctaSecondary: 'Zalo Consultation & Corporate Gifting',
```

Chinese block (around line 440-441), change:
```
      cta: '查看精选产品',
      ctaSecondary: '预约参观园地',
```
to:
```
      cta: '立即购买',
      ctaSecondary: 'Zalo咨询与企业礼品定制',
```

French block (around line 581-582), change:
```
      cta: 'Voir les Produits Sélectionnés',
      ctaSecondary: 'Réserver une Visite du Jardin',
```
to:
```
      cta: 'Acheter Maintenant',
      ctaSecondary: 'Conseil Zalo & Cadeaux d\'Entreprise',
```

Arabic block (around line 722-723), change:
```
      cta: 'عرض المنتجات المختارة',
      ctaSecondary: 'احجز زيارة للحديقة',
```
to:
```
      cta: 'تسوق الآن',
      ctaSecondary: 'استشارة عبر Zalo وهدايا الشركات',
```

- [ ] **Step 2: Change the primary CTA to scroll to the Products section instead of navigating away**

In `src/components/Hero.tsx`, replace the CTAs block:
```tsx
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
          <a href="#catalog" onClick={(e) => { e.preventDefault(); onNavigate?.('catalog'); }} className="btn-gold group">
            {t.hero.cta}
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
          </a>
          <a
            href="https://zalo.me/0984999309"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
          >
            {t.hero.ctaSecondary}
          </a>
        </div>
```
with:
```tsx
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
          <a
            href="#products"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-gold group"
          >
            {t.hero.cta}
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
          </a>
          <a
            href="https://zalo.me/0984999309"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
          >
            {t.hero.ctaSecondary}
          </a>
        </div>
```

(`id="products"` already exists on `Products.tsx`'s `<section>` — no change needed there.)

- [ ] **Step 3: Replace the 3 redundant cert badges with the 52+ saponin stat**

The `Certifications` component (real scanned certs) now appears lower on the page (Task 6) — the 3 duplicate text badges in the hero add clutter without adding information. Replace them with the single strongest claim.

Replace:
```tsx
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-in-up animation-delay-400">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Shield className="w-4 h-4 text-forest-300" />
            <span className="text-xs font-medium">cGMP Certified</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Award className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-medium">ISO 9001/22000</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Leaf className="w-4 h-4 text-forest-300" />
            <span className="text-xs font-medium">HACCP</span>
          </div>
        </div>
```
with:
```tsx
        {/* Saponin claim */}
        <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-10 animate-fade-in-up animation-delay-400">
          <span className="font-display text-3xl text-gold-400">{t.heritage.saponinCount}</span>
          <span className="text-sm text-white/80 text-left leading-snug">{t.heritage.saponinTypes}</span>
        </div>
```

- [ ] **Step 4: Remove the now-unused `Shield`/`Award` icon imports**

`Shield` and `Award` are no longer used in this file after Step 3; `Leaf` is still used (badge icon + floating graphics comment context — check before removing). Change:
```tsx
import { ArrowRight, Shield, Award, Leaf } from 'lucide-react';
```
to:
```tsx
import { ArrowRight, Leaf } from 'lucide-react';
```

- [ ] **Step 5: Type-check and build**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b && npm run build`
Expected: exits 0. (`tsc` will catch it immediately if `Shield`/`Award` are still referenced anywhere in the file.)

- [ ] **Step 6: Manual check in the Browser pane**

`preview_start` the dev server (or attach to the one already running at `localhost:5173`), navigate to `/`, and confirm: hero shows one saponin stat badge (not 3 cert badges), "Mua Ngay" button scrolls smoothly to the Products section instead of navigating away, "Tư Vấn Zalo & Quà Tặng Doanh Nghiệp" button still opens the Zalo link. Check at 375px and 1440px widths.

- [ ] **Step 7: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/components/Hero.tsx src/i18n/translations.ts
git commit -m "$(cat <<'EOF'
feat: dual-path hero CTAs and saponin stat, drop redundant cert badges

Primary CTA now scrolls to the Products section instead of navigating
away (keeps the shopper in the funnel); secondary CTA's label now
matches what it actually does (Zalo consultation), replacing a stale
"Book a Garden Visit" label pointing at a Zalo link. Swaps the 3 text
cert badges (now redundant with the real Certifications section
further down the page) for the single strongest claim: 52+/MR2
saponin count.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Products — premium card treatment

**Files:**
- Modify: `src/components/Products.tsx`

**Interfaces:**
- Produces: no new exports; same `ProductsProps` shape (`{ lang, onNavigate }`).

- [ ] **Step 1: Change grid from 4 columns to 3 on desktop**

In `src/components/Products.tsx`, change:
```tsx
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
```
to:
```tsx
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
```

- [ ] **Step 2: Give cards a warmer, premium surface**

The `.product-card` class in `src/index.css` (lines 278-283) currently sets `background-color: white`. Change it to a subtle cream tint with a gold hover border, matching the brand tokens already defined in `@theme` (no new colors):
```css
  .product-card {
    background-color: var(--color-cream-50);
    border: 1px solid var(--color-cream-200);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 2px 20px rgba(11, 47, 29, 0.06);
    transition: all 0.5s;
  }
  .product-card:hover {
    background-color: var(--color-cream-50);
    border-color: var(--color-gold-400);
    box-shadow: 0 10px 50px rgba(11, 47, 29, 0.12);
    transform: translateY(-4px);
  }
```
(Replaces the existing `.product-card` / `.product-card:hover` rules at `src/index.css:278-288` — same selectors, just the added `border`/`background-color` treatment.)

- [ ] **Step 3: Type-check and build**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b && npm run build`
Expected: exits 0.

- [ ] **Step 4: Manual check**

In the Browser pane at 1440px: confirm 3 columns (not 4) on the homepage Products section, cards have a visible cream background and a gold border appears on hover. At 375px: confirm cards still stack to 1 column without horizontal overflow.

- [ ] **Step 5: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/components/Products.tsx src/index.css
git commit -m "$(cat <<'EOF'
style: premium 3-column product cards with gold hover border

Reduces desktop grid from 4 to 3 columns for larger product imagery
and more breathing room, and gives cards a warm cream surface with a
gold hairline border on hover instead of a flat white background —
closer to the "world's most expensive ginseng" positioning than the
previous generic-shop-grid look.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: TA Elite rewards teaser (new homepage section)

**Files:**
- Create: `src/components/EliteTeaser.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `loyaltyTiers` from `src/data/mockData.ts` (already exists: `{ name, nameVi, minPoints, discount, color, perks, perksVi }[]`, 3 entries — Standard/VIP/VVIP Elite), `Language` type from `src/i18n/translations.ts`.
- Produces: `export default function EliteTeaser({ lang, onNavigate }: { lang: Language; onNavigate: (page: string) => void })`, rendered between `Stats` and `ProductAdvisor` in `App.tsx`.

- [ ] **Step 1: Write the component**

Create `src/components/EliteTeaser.tsx`:
```tsx
import { Crown, ArrowRight } from 'lucide-react';
import { loyaltyTiers } from '../data/mockData';
import type { Language } from '../i18n/translations';

interface EliteTeaserProps {
  lang: Language;
  onNavigate: (page: string) => void;
}

const COPY: Record<Language, { kicker: string; title: string; body: string; cta: string }> = {
  vi: {
    kicker: 'TA ELITE CLUB',
    title: 'Tích điểm mỗi đơn hàng, lên hạng nhận ưu đãi',
    body: `Từ ${loyaltyTiers[0].discount}% hoàn tiền hạng ${loyaltyTiers[0].nameVi} đến ${loyaltyTiers[loyaltyTiers.length - 1].discount}% hạng ${loyaltyTiers[loyaltyTiers.length - 1].nameVi} — cùng các đặc quyền riêng cho thành viên.`,
    cta: 'Tham gia miễn phí',
  },
  en: {
    kicker: 'TA ELITE CLUB',
    title: 'Earn on every order, unlock tier perks',
    body: `From ${loyaltyTiers[0].discount}% cashback at ${loyaltyTiers[0].name} to ${loyaltyTiers[loyaltyTiers.length - 1].discount}% at ${loyaltyTiers[loyaltyTiers.length - 1].name} — plus member-only perks.`,
    cta: 'Join for free',
  },
  zh: {
    kicker: 'TA尊享俱乐部',
    title: '每笔订单赚积分，升级解锁更多权益',
    body: `从 ${loyaltyTiers[0].name} 级 ${loyaltyTiers[0].discount}% 返现，到 ${loyaltyTiers[loyaltyTiers.length - 1].name} 级 ${loyaltyTiers[loyaltyTiers.length - 1].discount}% —— 还有会员专属权益。`,
    cta: '免费加入',
  },
  fr: {
    kicker: 'TA ELITE CLUB',
    title: 'Cumulez à chaque commande, débloquez des avantages',
    body: `De ${loyaltyTiers[0].discount}% de cashback au niveau ${loyaltyTiers[0].name} jusqu'à ${loyaltyTiers[loyaltyTiers.length - 1].discount}% au niveau ${loyaltyTiers[loyaltyTiers.length - 1].name} — plus des avantages réservés aux membres.`,
    cta: 'Adhérer gratuitement',
  },
  ar: {
    kicker: 'نادي TA للنخبة',
    title: 'اكسب نقاطًا مع كل طلب، وافتح مزايا أعلى',
    body: `من استرداد نقدي ${loyaltyTiers[0].discount}% في مستوى ${loyaltyTiers[0].name} إلى ${loyaltyTiers[loyaltyTiers.length - 1].discount}% في مستوى ${loyaltyTiers[loyaltyTiers.length - 1].name} — بالإضافة إلى مزايا حصرية للأعضاء.`,
    cta: 'انضم مجانًا',
  },
};

export default function EliteTeaser({ lang, onNavigate }: EliteTeaserProps) {
  const c = COPY[lang];
  const isRTL = lang === 'ar';

  return (
    <section className="section-padding-sm bg-forest-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-forest-800 to-forest-900 border border-gold-400/20 rounded-3xl p-8 md:p-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold-400/15 flex items-center justify-center shrink-0">
              <Crown className="w-7 h-7 text-gold-400" />
            </div>
            <div>
              <span className="text-gold-400 text-xs font-semibold tracking-wider uppercase block mb-1">
                {c.kicker}
              </span>
              <h3 className="font-display text-xl md:text-2xl text-white mb-1">{c.title}</h3>
              <p className="text-white/70 text-sm max-w-xl">{c.body}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('loyalty')}
            className="btn-gold shrink-0 whitespace-nowrap"
          >
            {c.cta}
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire it into the homepage**

In `src/App.tsx`, add the import near the other component imports:
```tsx
import EliteTeaser from './components/EliteTeaser';
```
Then insert `<EliteTeaser lang={lang} onNavigate={navigate} />` between `<Stats lang={lang} />` and `<ProductAdvisor lang={lang} onNavigate={navigate} />` in the `home` render branch (final ordering happens in Task 7 — for this task, just confirm the component renders and the "Tham gia miễn phí" button navigates to `loyalty`).

- [ ] **Step 3: Type-check and build**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b && npm run build`
Expected: exits 0.

- [ ] **Step 4: Manual check**

In the Browser pane, confirm the new dark-green banner renders with the correct tier discount numbers pulled from `loyaltyTiers` (not hardcoded), and clicking "Tham gia miễn phí" navigates to the `/loyalty` page (`LoyaltyDashboard`).

- [ ] **Step 5: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/components/EliteTeaser.tsx src/App.tsx
git commit -m "$(cat <<'EOF'
feat: add TA Elite Club homepage teaser linking to /loyalty

The loyalty tier system (Standard/VIP/VVIP Elite, real cashback %,
perks) already existed at /loyalty but had no entry point from the
homepage — this was effectively a dead feature. Adds a compact banner
pulling live numbers from loyaltyTiers (no hardcoded duplicates) with
a single CTA into the existing dashboard.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Reposition Certifications, add gated Trust & Proof block

**Files:**
- Create migration: `trust_proof_items` table (via `apply_migration`)
- Create: `src/components/TrustProof.tsx`
- Modify: `src/lib/siteContentApi.ts`
- Modify: `src/admin/adminApi.ts`
- Create: `src/admin/pages/TrustProofPage.tsx`
- Modify: `src/admin/AdminApp.tsx`, `src/admin/AdminLayout.tsx`
- Modify: `src/App.tsx` (Task 7 does final ordering; this task just makes both pieces exist and work)

**Interfaces:**
- Produces: `fetchTrustProofItems(): Promise<TrustProofItem[]>` (public, only `published = true` rows) in `siteContentApi.ts`; `fetchAllTrustProofItems()`, `createTrustProofItem()`, `updateTrustProofItem()`, `deleteTrustProofItem()`, `uploadTrustProofImage()` in `adminApi.ts`; `export default function TrustProof({ lang }: { lang: Language })` — renders `null` when there are zero published items.

- [ ] **Step 1: Apply the Supabase migration**

Use the Supabase MCP `apply_migration` tool, `project_id: "xcwirgrlnibnjmseglee"`, `name: "create_trust_proof_items"`, with this SQL (mirrors the exact `blog_posts` pattern — `admin full access` + `public read published`):
```sql
create table public.trust_proof_items (
  id uuid primary key default extensions.uuid_generate_v4(),
  kind text not null check (kind = any (array['testimonial', 'press', 'photo'])),
  quote_text text not null default '',
  source_name text not null default '',
  source_url text,
  image_url text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.trust_proof_items enable row level security;

create policy "admin full access trust_proof_items"
  on public.trust_proof_items for all
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "public read published trust_proof_items"
  on public.trust_proof_items for select
  to public
  using (published = true);
```

- [ ] **Step 2: Verify the migration**

Run (via Supabase MCP `execute_sql`, same `project_id`):
```sql
select policyname, cmd, roles from pg_policies where tablename = 'trust_proof_items';
```
Expected: 2 rows — `admin full access trust_proof_items` (ALL, `{authenticated}`) and `public read published trust_proof_items` (SELECT, `{public}`).

- [ ] **Step 3: Create a public storage bucket for trust-proof images**

Use the Supabase MCP `execute_sql` tool against the same project (storage buckets are created via SQL against `storage.buckets`, same as how `blog-images`/`blog-videos` already exist — confirm their exact creation pattern first):
```sql
select id, name, public from storage.buckets where id in ('blog-images', 'trust-proof-images');
```
If `trust-proof-images` doesn't exist yet, create it the same way `blog-images` was created (check `storage.buckets` row for `blog-images` returned above for the exact `public`/size-limit/mime-type config to replicate), then add matching RLS policies on `storage.objects` for that bucket (admin-only insert, public select) — mirror whatever policy exists for `blog-images` object storage exactly, substituting the bucket id.

- [ ] **Step 4: Add the public read function**

In `src/lib/siteContentApi.ts`, add after `fetchBlogPosts`:
```ts
export interface TrustProofItem {
  id: string;
  kind: 'testimonial' | 'press' | 'photo';
  quote_text: string;
  source_name: string;
  source_url: string | null;
  image_url: string | null;
  sort_order: number;
}

export async function fetchTrustProofItems(): Promise<TrustProofItem[]> {
  const { data, error } = await supabase
    .from('trust_proof_items')
    .select('id, kind, quote_text, source_name, source_url, image_url, sort_order')
    .eq('published', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}
```

- [ ] **Step 5: Add the admin read/write functions**

In `src/admin/adminApi.ts`, add near the blog post functions (after `uploadBlogImage`):
```ts
export async function fetchAllTrustProofItems(): Promise<TrustProofItem[] & { published: boolean }[]> {
  return throwIfError(
    await supabase
      .from('trust_proof_items')
      .select('id, kind, quote_text, source_name, source_url, image_url, sort_order, published')
      .order('sort_order')
  );
}

export async function createTrustProofItem(input: {
  kind: TrustProofItem['kind'];
  quote_text: string;
  source_name: string;
  source_url?: string | null;
  image_url?: string | null;
}) {
  const res = await supabase
    .from('trust_proof_items')
    .insert({ ...input, published: false })
    .select('id, kind, quote_text, source_name, source_url, image_url, sort_order, published')
    .single();
  return throwIfError(res);
}

export async function updateTrustProofItem(
  id: string,
  patch: Partial<Pick<TrustProofItem, 'quote_text' | 'source_name' | 'source_url' | 'sort_order'> & { published: boolean }>
) {
  const { error } = await supabase.from('trust_proof_items').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteTrustProofItem(id: string) {
  const { error } = await supabase.from('trust_proof_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function uploadTrustProofImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('trust-proof-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('trust-proof-images').getPublicUrl(path);
  return data.publicUrl;
}
```
Also update the top of the file: `import type { SiteAddress, ContactPhone, SocialLink, BlogPost } from '../lib/siteContentApi';` becomes `import type { SiteAddress, ContactPhone, SocialLink, BlogPost, TrustProofItem } from '../lib/siteContentApi';`, and `export type { SiteAddress, ContactPhone, SocialLink, BlogPost };` becomes `export type { SiteAddress, ContactPhone, SocialLink, BlogPost, TrustProofItem };`.

- [ ] **Step 6: Build the public `TrustProof` component**

Create `src/components/TrustProof.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { Quote, Newspaper, Camera } from 'lucide-react';
import { fetchTrustProofItems, type TrustProofItem } from '../lib/siteContentApi';
import type { Language } from '../i18n/translations';

const KIND_ICON = { testimonial: Quote, press: Newspaper, photo: Camera } as const;

export default function TrustProof({ lang }: { lang: Language }) {
  const [items, setItems] = useState<TrustProofItem[]>([]);
  const isRTL = lang === 'ar';

  useEffect(() => {
    let cancelled = false;
    fetchTrustProofItems()
      .then((data) => { if (!cancelled) setItems(data); })
      .catch(() => { if (!cancelled) setItems([]); });
    return () => { cancelled = true; };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="section-padding-sm bg-cream-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => {
            const Icon = KIND_ICON[item.kind];
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-cream-200 p-6">
                {item.image_url && (
                  <img src={item.image_url} alt={item.source_name} className="w-full h-40 object-cover rounded-xl mb-4" loading="lazy" />
                )}
                <Icon className="w-5 h-5 text-gold-500 mb-3" />
                <p className="text-forest-800 text-sm leading-relaxed mb-3">{item.quote_text}</p>
                {item.source_url ? (
                  <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-forest-500 hover:text-gold-600 underline underline-offset-2">
                    {item.source_name}
                  </a>
                ) : (
                  <span className="text-xs text-forest-500">{item.source_name}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Build the admin page**

Create `src/admin/pages/TrustProofPage.tsx` following the exact list/form/toggle pattern already used in `src/admin/pages/CmsPage.tsx` (fetch on mount, local state list, inline edit form, save via the `adminApi.ts` functions from Step 5, a `published` checkbox per row, an image file input calling `uploadTrustProofImage` then storing the returned URL). Mobile-first: form fields stack in a single column below 768px (`grid-cols-1 md:grid-cols-2`), buttons are full-width below 480px (`w-full sm:w-auto`), no fixed pixel widths on inputs.

- [ ] **Step 8: Wire the admin route and nav entry**

In `src/admin/AdminApp.tsx`, add the import and route:
```tsx
import TrustProofPage from './pages/TrustProofPage';
```
```tsx
          <Route path="trust-proof" element={<TrustProofPage />} />
```
In `src/admin/AdminLayout.tsx`, add to the `NAV` array (after the `channels` entry):
```tsx
  { to: '/gate-vkd-control-2026/trust-proof', end: false, label: 'Uy tín & Bằng chứng', icon: Quote },
```
(Add `Quote` to the existing `lucide-react` import list at the top of the file.)

- [ ] **Step 9: Type-check and build**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b && npm run build`
Expected: exits 0.

- [ ] **Step 10: Manual check**

In the Browser pane: log into `/gate-vkd-control-2026`, go to the new "Uy tín & Bằng chứng" page at 375px width, create a test item, leave it unpublished, confirm it does NOT appear anywhere on the public homepage; publish it, reload the homepage, confirm it now appears; unpublish and confirm it disappears again. Delete the test item when done.

- [ ] **Step 11: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/components/TrustProof.tsx src/lib/siteContentApi.ts src/admin/adminApi.ts src/admin/pages/TrustProofPage.tsx src/admin/AdminApp.tsx src/admin/AdminLayout.tsx
git commit -m "$(cat <<'EOF'
feat: admin-authored Trust & Proof section, published-gated

New trust_proof_items table (testimonial/press/photo, RLS mirrors the
existing blog_posts pattern) with a mobile-first admin page to add
real content over time. The public component renders nothing at all
until at least one item is explicitly published — no empty skeleton
or fabricated content ships to visitors before Joe has real proof to
show. Existing real certification images (Certifications.tsx) are
untouched by this — they stay always-visible, per Task 7.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Reorder homepage sections

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `EliteTeaser` (Task 5), `TrustProof` (Task 6) — both already default-exported with `{ lang, onNavigate? }` / `{ lang }` props.

- [ ] **Step 1: Replace the `home` render branch**

In `src/App.tsx`, the current `home` branch is:
```tsx
          {currentPage === 'home' && (
            <>
              <Hero lang={lang} onNavigate={navigate} />
              <Stats lang={lang} />
              <ProductAdvisor lang={lang} onNavigate={navigate} />
              <About lang={lang} onNavigate={navigate} />
              <Heritage lang={lang} />
              <Products lang={lang} onNavigate={navigate} />
              <OmniChannel lang={lang} onNavigate={navigate} />
              <Traceability lang={lang} />
              <B2B lang={lang} />
              <Certifications lang={lang} />
              <Blog />
            </>
          )}
```
Replace it with:
```tsx
          {currentPage === 'home' && (
            <>
              <Hero lang={lang} onNavigate={navigate} />
              <Products lang={lang} onNavigate={navigate} />
              <Heritage lang={lang} />
              <EliteTeaser lang={lang} onNavigate={navigate} />
              <ProductAdvisor lang={lang} onNavigate={navigate} />
              <Certifications lang={lang} />
              <TrustProof lang={lang} />
              <B2B lang={lang} />
            </>
          )}
```

Note: `Stats.tsx` (the 4-stat strip: years/regions/products/countries) is folded out of the homepage here — it overlaps with the saponin stat now in the Hero (Task 3) and the Heritage marquee, and was one of the "too many sections" Joe flagged. `About`, `OmniChannel`, `Traceability`, `Blog` are also removed from `home` — they stay mounted at their existing standalone routes/anchors (`about-story` page, `#about`/`#traceability` anchors via `Header.tsx`'s `handleNav`, `Blog` has no other mount point currently, see Step 3 below) and are not deleted.

- [ ] **Step 2: Remove now-unused imports for components no longer rendered on `home`**

`Stats`, `About`, `OmniChannel`, `Traceability`, `Blog` are still imported in `App.tsx` — check whether each is used anywhere else in the file (e.g. `About` might still back the `#about` anchor via `Header.tsx`'s scroll — but that anchor was `document.getElementById('about')`, which only exists if `About` renders somewhere). Since `Header.tsx`'s `handleNav` still tries to scroll to `#about`, `#traceability`, `#b2b` on the `home` page, and this task removes `About`/`Traceability` from `home` entirely, **do not delete the imports yet** — instead:
- Keep `import Stats from './components/Stats';`, `import About from './components/About';`, `import OmniChannel from './components/OmniChannel';`, `import Traceability from './components/Traceability';`, `import Blog from './components/Blog';` as unused-for-now if TypeScript doesn't error (it won't — unused imports aren't a `tsc` error by default in this config; verify via Step 3).
- File a note in this task rather than silently break `Header.tsx`'s `#about`/`#traceability` scroll targets: those two anchor IDs no longer exist on the `home` page after this change. This is a real regression the plan must not paper over.

- [ ] **Step 3: Fix the now-broken `#about`/`#traceability` header nav links**

Run: `grep -n "about\|traceability" "D:/TA page/site/ta_production/project/src/components/Header.tsx"` to see the exact current nav item hrefs and `handleNav` scroll-target logic.

Update `Header.tsx`'s `navItems`/`handleNav` so `about` and `traceability` navigate to their full standalone pages/routes instead of scrolling to a homepage anchor that no longer exists: `about` should go to `onNavigate('about-story')` (the existing `FounderStory` page, already mounted at `currentPage === 'about-story'` in `App.tsx`) instead of scrolling to `#about` on `home`; `traceability` should go to a dedicated route the same way — check whether `App.tsx` already has a mounted route matching `currentPage === 'traceability'` showing the `Traceability` component standalone (it currently does not — only rendered inline on `home`). Add one:
```tsx
          {currentPage === 'traceability' && (
            <Traceability lang={lang} />
          )}
```
in `App.tsx` (near the other standalone-page branches like `research`), and change `Header.tsx`'s `handleNav` so `href === 'traceability'` calls `onNavigate('traceability')` directly instead of the scroll-then-navigate-home logic.

- [ ] **Step 4: Confirm `Blog` and `OmniChannel` are still reachable, or explicitly document that they are not (Phase 2 follow-up)**

Run: `grep -rn "Blog\b" "D:/TA page/site/ta_production/project/src/App.tsx" "D:/TA page/site/ta_production/project/src/components/Header.tsx"` and the same for `OmniChannel`. If neither has any other mount point or nav entry after this change, they are now fully unreachable dead code paths (not deleted, just orphaned) — this matches the design spec's Phase-2 open question about `OmniChannel`, but must be called out explicitly in the commit message rather than silently left ambiguous.

- [ ] **Step 5: Type-check and build**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b && npm run build`
Expected: exits 0.

- [ ] **Step 6: Manual check — full nav sweep**

In the Browser pane, click every item in the header nav (desktop and mobile menu) from the homepage and confirm each lands somewhere real (no blank scroll, no console error about a missing element). Scroll the full homepage top to bottom and confirm the new order matches Step 1 exactly.

- [ ] **Step 7: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/App.tsx src/components/Header.tsx
git commit -m "$(cat <<'EOF'
feat: reorder homepage for conversion funnel, fix broken anchor nav

New order: Hero -> Products -> Heritage (saponin marquee) -> TA Elite
teaser -> ProductAdvisor -> Certifications (real, always visible) ->
Trust & Proof (gated) -> B2B. Cuts Stats/About/OmniChannel/
Traceability/Blog from the homepage scroll — they were padding the
distance between the hero and the first way to buy. About and
Traceability get proper standalone routes instead of dangling
homepage anchors the header nav pointed at (a real bug this surfaced,
not just a cut). OmniChannel and Blog currently have no other mount
point after this change and are follow-up work, not silently lost.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Combo/Gift Sets — database schema

**Files:**
- Create migration: `combo_sets` table (via `apply_migration`)

**Interfaces:**
- Produces: `public.combo_sets` table — columns `id uuid`, `slug text unique`, `name_vi text`, `theme text`, `month_tags integer[]`, `component_skus text[]`, `price_vnd numeric`, `poster_image_url text`, `description_vi text`, `active boolean`, `sort_order integer`, `created_at`, `updated_at`. Consumed by Task 9's `siteContentApi.ts`/`adminApi.ts` functions.

- [ ] **Step 1: Apply the migration**

Use Supabase MCP `apply_migration`, `project_id: "xcwirgrlnibnjmseglee"`, `name: "create_combo_sets"`:
```sql
create table public.combo_sets (
  id uuid primary key default extensions.uuid_generate_v4(),
  slug text not null unique,
  name_vi text not null,
  theme text not null default '',
  month_tags integer[] not null default '{}',
  component_skus text[] not null default '{}',
  price_vnd numeric not null check (price_vnd >= 0),
  poster_image_url text,
  description_vi text not null default '',
  active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.combo_sets enable row level security;

create policy "admin full access combo_sets"
  on public.combo_sets for all
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "public read active combo_sets"
  on public.combo_sets for select
  to public
  using (active = true);
```

- [ ] **Step 2: Create a storage bucket for combo poster images**

Same approach as Task 6 Step 3 — check `blog-images`' bucket config via `select * from storage.buckets where id = 'blog-images'`, create `combo-images` matching it, add matching `storage.objects` RLS policies (admin insert, public select) scoped to the `combo-images` bucket id.

- [ ] **Step 3: Verify**

Run (Supabase MCP `execute_sql`, same project):
```sql
select column_name, data_type from information_schema.columns where table_name = 'combo_sets' order by ordinal_position;
```
Expected: 12 rows matching the columns in Step 1. Then:
```sql
select policyname, cmd, roles from pg_policies where tablename = 'combo_sets';
```
Expected: 2 rows, same shape as Task 6 Step 2.

No commit for this task — migrations aren't files in this repo (per Global Constraints); Task 9's commit references this schema.

---

## Task 9: Combo/Gift Sets — data layer

**Files:**
- Modify: `src/lib/siteContentApi.ts`
- Modify: `src/admin/adminApi.ts`
- Create: `src/data/combos.ts`

**Interfaces:**
- Consumes: `products` and `Product` type from `src/data/products.ts` (existing, `{ sku, name, price, image, ... }`), `CartCompatibleProduct` type (existing, from `src/data/products.ts`).
- Produces: `fetchActiveComboSets(): Promise<ComboSet[]>` (public), `fetchAllComboSets()`, `createComboSet()`, `updateComboSet()`, `deleteComboSet()`, `uploadComboImage()` (admin), and `comboToCartProduct(combo: ComboSet): CartCompatibleProduct` + `resolveComboComponents(combo: ComboSet): Product[]` in `src/data/combos.ts`.

- [ ] **Step 1: Add the public read function**

In `src/lib/siteContentApi.ts`, add:
```ts
export interface ComboSet {
  id: string;
  slug: string;
  name_vi: string;
  theme: string;
  month_tags: number[];
  component_skus: string[];
  price_vnd: number;
  poster_image_url: string | null;
  description_vi: string;
  sort_order: number;
}

export async function fetchActiveComboSets(): Promise<ComboSet[]> {
  const { data, error } = await supabase
    .from('combo_sets')
    .select('id, slug, name_vi, theme, month_tags, component_skus, price_vnd, poster_image_url, description_vi, sort_order')
    .eq('active', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}
```

- [ ] **Step 2: Add the admin CRUD functions**

In `src/admin/adminApi.ts`, update the top-of-file import/re-export lines to include `ComboSet` (same pattern as `TrustProofItem` in Task 6), then add:
```ts
export async function fetchAllComboSets(): Promise<(ComboSet & { active: boolean })[]> {
  return throwIfError(
    await supabase
      .from('combo_sets')
      .select('id, slug, name_vi, theme, month_tags, component_skus, price_vnd, poster_image_url, description_vi, sort_order, active')
      .order('sort_order')
  );
}

export async function createComboSet(input: {
  slug: string;
  name_vi: string;
  theme: string;
  month_tags: number[];
  component_skus: string[];
  price_vnd: number;
  poster_image_url?: string | null;
  description_vi: string;
}) {
  const res = await supabase
    .from('combo_sets')
    .insert({ ...input, active: false })
    .select('id, slug, name_vi, theme, month_tags, component_skus, price_vnd, poster_image_url, description_vi, sort_order, active')
    .single();
  return throwIfError(res);
}

export async function updateComboSet(
  id: string,
  patch: Partial<Pick<ComboSet, 'name_vi' | 'theme' | 'month_tags' | 'component_skus' | 'price_vnd' | 'poster_image_url' | 'description_vi' | 'sort_order'> & { active: boolean }>
) {
  const { error } = await supabase.from('combo_sets').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteComboSet(id: string) {
  const { error } = await supabase.from('combo_sets').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function uploadComboImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('combo-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('combo-images').getPublicUrl(path);
  return data.publicUrl;
}
```

- [ ] **Step 3: Write the cart adapter and component resolver**

Create `src/data/combos.ts`:
```ts
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
    healthGoal: 'general_wellness',
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
```

Before finalizing, run: `grep -n "HealthGoal\|TargetAudience" "D:/TA page/site/ta_production/project/src/data/mockData.ts"` to confirm `'general_wellness'` and `'family'` are valid literal members of those two union types (used elsewhere in the codebase already per `Heritage.tsx`'s earlier `products` import and `familySafeSlugs` in `vkdProducts.ts`) — if the exact literal names differ, use the real ones from that grep instead of guessing.

- [ ] **Step 4: Type-check and build**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b && npm run build`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/lib/siteContentApi.ts src/admin/adminApi.ts src/data/combos.ts
git commit -m "$(cat <<'EOF'
feat: Combo/Gift Sets data layer (Supabase table, cart adapter)

combo_sets table follows the same admin-authored/public-gated pattern
as trust_proof_items and blog_posts (RLS: admin full access, public
read where active=true). A combo is a single fixed-price cart line
item assembled by admin from existing SKUs for display purposes
("gồm: ...") — it does not decompose into per-SKU cart lines, keeping
checkout untouched per the Phase 1 non-goals.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Combo/Gift Sets — mobile-first admin builder

**Files:**
- Create: `src/admin/pages/CombosPage.tsx`
- Modify: `src/admin/AdminApp.tsx`, `src/admin/AdminLayout.tsx`

**Interfaces:**
- Consumes: `fetchAllComboSets`, `createComboSet`, `updateComboSet`, `deleteComboSet`, `uploadComboImage` from `src/admin/adminApi.ts` (Task 9); `products` from `src/data/products.ts` for the SKU checklist (same list `CatalogExportPage.tsx` already uses).

- [ ] **Step 1: Build the admin page**

Create `src/admin/pages/CombosPage.tsx` following the same structural pattern as `CatalogExportPage.tsx`'s product checklist (search box, checkbox list) combined with `CmsPage.tsx`'s create/edit form pattern. Key mobile-first requirements — verify each one explicitly in Step 3, not just "should work":
- Form container: `max-w-full` on mobile, no fixed `width`/`min-width` in px anywhere.
- Product checklist: same scrollable `max-h-80 overflow-y-auto` list pattern as `CatalogExportPage.tsx`, full-width rows.
- Month picker: 12 toggle chips in a `flex flex-wrap gap-2` row (not a `<select>` — faster to tap multiple months on a phone).
- Image upload: a single `<input type="file" accept="image/*" capture="environment">` — `capture="environment"` lets a phone open its camera directly, not just the file picker, since Joe is building these on his phone.
- All buttons `w-full sm:w-auto` so primary actions are full-width tap targets below the `sm` breakpoint.

```tsx
import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader, Upload, Search, CheckSquare } from 'lucide-react';
import {
  fetchAllComboSets,
  createComboSet,
  updateComboSet,
  deleteComboSet,
  uploadComboImage,
  type ComboSet,
} from '../adminApi';
import { products } from '../../data/products';

type EditableCombo = ComboSet & { active: boolean };

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function CombosPage() {
  const [combos, setCombos] = useState<EditableCombo[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');
  const [months, setMonths] = useState<Set<number>>(new Set());
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAllComboSets()
      .then(setCombos)
      .catch((e) => showToast(`Lỗi tải combo: ${e instanceof Error ? e.message : String(e)}`))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleMonth = (m: number) => {
    setMonths((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  };

  const toggleSku = (sku: string) => {
    setSelectedSkus((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku);
      else next.add(sku);
      return next;
    });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadComboImage(file);
      setImageUrl(url);
    } catch (e) {
      showToast(`Lỗi tải ảnh: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setTheme('');
    setMonths(new Set());
    setSelectedSkus(new Set());
    setPrice('');
    setDescription('');
    setImageUrl('');
  };

  const handleCreate = async () => {
    if (!name.trim() || selectedSkus.size === 0 || !price) {
      showToast('Cần nhập tên, chọn ít nhất 1 sản phẩm, và nhập giá.');
      return;
    }
    setSaving(true);
    try {
      await createComboSet({
        slug: `${slugify(name)}-${Date.now().toString(36)}`,
        name_vi: name.trim(),
        theme: theme.trim(),
        month_tags: Array.from(months),
        component_skus: Array.from(selectedSkus),
        price_vnd: Number(price),
        poster_image_url: imageUrl || null,
        description_vi: description.trim(),
      });
      showToast('Đã tạo combo — đang ở trạng thái nháp, bấm "Kích hoạt" để hiện lên site.');
      resetForm();
      load();
    } catch (e) {
      showToast(`Lỗi tạo combo: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (combo: EditableCombo) => {
    try {
      await updateComboSet(combo.id, { active: !combo.active });
      load();
    } catch (e) {
      showToast(`Lỗi cập nhật: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComboSet(id);
      load();
    } catch (e) {
      showToast(`Lỗi xoá: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const filteredProducts = products.filter(
    (p) => !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-forest-900">Combo & Set Quà Tặng</h1>
        <p className="text-sm text-forest-700/70 mt-1">
          Lắp combo từ sản phẩm có sẵn theo tháng/chủ đề. Combo mới tạo ở trạng thái nháp — bấm "Kích hoạt" để hiện trên trang chủ và trang Set Quà Tặng.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-cream-300 p-4 sm:p-6 space-y-4 max-w-full">
        <h2 className="font-medium text-forest-900">Tạo combo mới</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">Tên combo</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Combo 3 — Sum Vầy"
              className="w-full px-3 py-2.5 rounded-lg border border-cream-300 text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
          <div>
            <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">Chủ đề</label>
            <input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="VD: Vu Lan, Tết, Trung Thu"
              className="w-full px-3 py-2.5 rounded-lg border border-cream-300 text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">Tháng áp dụng</label>
          <div className="flex flex-wrap gap-2">
            {MONTHS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMonth(m)}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                  months.has(m) ? 'bg-forest-900 text-cream-50 border-forest-900' : 'bg-white text-forest-700 border-cream-300'
                }`}
              >
                Tháng {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">Ảnh poster</label>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="btn-secondary w-full sm:w-auto cursor-pointer">
              {uploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {imageUrl ? 'Đổi ảnh' : 'Tải ảnh lên'}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              />
            </label>
            {imageUrl && <img src={imageUrl} alt="" className="w-16 h-16 object-cover rounded-lg" />}
          </div>
        </div>

        <div>
          <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">
            Sản phẩm trong combo ({selectedSkus.size} đã chọn)
          </label>
          <div className="relative mb-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cream-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc SKU..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-cream-300 text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
          <div className="max-h-64 overflow-y-auto border border-cream-200 rounded-xl divide-y divide-cream-100">
            {filteredProducts.map((p) => (
              <label key={p.sku} className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-cream-50 cursor-pointer">
                <input type="checkbox" checked={selectedSkus.has(p.sku)} onChange={() => toggleSku(p.sku)} className="accent-gold-500 shrink-0" />
                <span className="text-forest-500/70 w-16 shrink-0 text-xs">{p.sku}</span>
                <span className="flex-1 text-forest-900">{p.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">Giá combo (VND)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="1430000"
              className="w-full px-3 py-2.5 rounded-lg border border-cream-300 text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
          <div>
            <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">Mô tả ngắn</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: 2 hộp bánh sâm + 2 gói kẹo sâm + 1 hộp trà + 1 chai rượu 10 năm"
              className="w-full px-3 py-2.5 rounded-lg border border-cream-300 text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <button onClick={handleCreate} disabled={saving} className="btn-gold w-full sm:w-auto disabled:opacity-50">
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Tạo combo
        </button>
      </section>

      <section className="bg-white rounded-2xl border border-cream-300 p-4 sm:p-6">
        <h2 className="font-medium text-forest-900 mb-4">Danh sách combo</h2>
        {loading ? (
          <p className="text-sm text-forest-700/60">Đang tải...</p>
        ) : combos.length === 0 ? (
          <p className="text-sm text-forest-700/60">Chưa có combo nào.</p>
        ) : (
          <div className="space-y-3">
            {combos.map((c) => (
              <div key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border border-cream-200">
                {c.poster_image_url && <img src={c.poster_image_url} alt="" className="w-14 h-14 object-cover rounded-lg shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-forest-900 truncate">{c.name_vi}</p>
                  <p className="text-xs text-forest-700/60">
                    {c.theme || '—'} · Tháng {c.month_tags.join(', ') || '—'} · {c.price_vnd.toLocaleString('vi-VN')}đ · {c.component_skus.length} SP
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(c)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 w-full sm:w-auto justify-center ${
                      c.active ? 'bg-forest-100 text-forest-800' : 'bg-gold-400/15 text-gold-700'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    {c.active ? 'Đang hiện' : 'Kích hoạt'}
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {toast && (
        <div className="fixed bottom-6 right-6 left-6 sm:left-auto bg-forest-900 text-cream-50 px-4 py-3 rounded-xl shadow-lg text-sm sm:max-w-sm">
          {toast}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire the route and nav entry**

In `src/admin/AdminApp.tsx`:
```tsx
import CombosPage from './pages/CombosPage';
```
```tsx
          <Route path="combos" element={<CombosPage />} />
```
In `src/admin/AdminLayout.tsx`, add to `NAV` (add `Gift` to the `lucide-react` import):
```tsx
  { to: '/gate-vkd-control-2026/combos', end: false, label: 'Combo & Quà Tặng', icon: Gift },
```

- [ ] **Step 3: Add a mobile navigation menu to `AdminLayout`**

`AdminLayout`'s nav (`NAV.map(...)`) is currently `hidden md:flex` — there is no mobile menu at all today, which would make every admin page including this new one undiscoverable on a phone (Joe's stated requirement). Add a hamburger toggle:

Replace the `<header>` block in `src/admin/AdminLayout.tsx`:
```tsx
      <header className="sticky top-0 z-40 bg-forest-950 text-cream-100">
        <div className="container-wide flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-gold-400" />
            <span className="font-display text-sm tracking-wide">TA — Control Portal</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-gold-400/15 text-gold-300' : 'text-cream-200/70 hover:bg-white/5 hover:text-cream-50'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-cream-300/70 hover:text-cream-50 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </div>
      </header>
```
with:
```tsx
      <header className="sticky top-0 z-40 bg-forest-950 text-cream-100">
        <div className="container-wide flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-gold-400" />
            <span className="font-display text-sm tracking-wide">TA — Control Portal</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-gold-400/15 text-gold-300' : 'text-cream-200/70 hover:bg-white/5 hover:text-cream-50'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <button
              onClick={logout}
              className="hidden md:flex items-center gap-2 text-sm text-cream-300/70 hover:text-cream-50 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Đăng xuất
            </button>
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="md:hidden p-2.5 rounded-lg text-cream-200 hover:bg-white/5"
              aria-label={mobileNavOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav className="md:hidden border-t border-white/10 bg-forest-950 px-4 py-3 space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-gold-400/15 text-gold-300' : 'text-cream-200/70 hover:bg-white/5 hover:text-cream-50'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 text-sm text-cream-300/70 px-3.5 py-3 rounded-lg hover:bg-white/5 mt-2 border-t border-white/10 pt-4"
            >
              <LogOut className="w-4 h-4" /> Đăng xuất
            </button>
          </nav>
        )}
      </header>
```

Add `useState` to the React import at the top of the file (currently `import { NavLink, Outlet } from 'react-router-dom';` has no React state import — add `import { useState } from 'react';` as a new line), add `mobileNavOpen` state (`const [mobileNavOpen, setMobileNavOpen] = useState(false);` near the existing `const { logout } = useAdminAuth();` line), and add `Menu`, `X` to the existing `lucide-react` import.

- [ ] **Step 4: Type-check and build**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b && npm run build`
Expected: exits 0.

- [ ] **Step 5: Manual check at 375px**

In the Browser pane at 375px width: log into `/gate-vkd-control-2026`, confirm the hamburger button appears (desktop nav hidden), tap it, confirm the mobile menu opens and "Combo & Quà Tặng" is in it, navigate to `/gate-vkd-control-2026/combos`, fill out the create-combo form entirely using only touch-sized targets (no horizontal scrolling required anywhere), select 2-3 products, pick a month, submit, confirm the new combo appears in the list below as a draft, tap "Kích hoạt", confirm it flips to "Đang hiện".

- [ ] **Step 6: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/admin/pages/CombosPage.tsx src/admin/AdminApp.tsx src/admin/AdminLayout.tsx
git commit -m "$(cat <<'EOF'
feat: mobile-first Combo & Gift Sets admin builder

Reuses the product-checklist pattern from CatalogExportPage.tsx and
the create/list pattern from CmsPage.tsx. New combos start as drafts
(active=false) and require an explicit "Kích hoạt" tap to go live —
never auto-publish. Also adds a mobile hamburger menu to AdminLayout,
which previously had zero navigation below the md breakpoint — every
admin page, not just this new one, was undiscoverable on a phone
before this change.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Combo/Gift Sets — customer-facing placement

**Files:**
- Create: `src/components/ComboOfTheMonth.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/ProductCatalog.tsx`

**Interfaces:**
- Consumes: `fetchActiveComboSets` (Task 9), `comboToCartProduct`/`resolveComboComponents` (Task 9), `useCart` (existing `src/context/CartContext.tsx`).

- [ ] **Step 1: Build the homepage "Combo tháng này" component**

Create `src/components/ComboOfTheMonth.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { fetchActiveComboSets, type ComboSet } from '../lib/siteContentApi';
import { comboToCartProduct } from '../data/combos';
import { useCart } from '../context/CartContext';
import type { Language } from '../i18n/translations';

function formatVND(n: number): string {
  return n.toLocaleString('vi-VN') + '₫';
}

export default function ComboOfTheMonth({ lang }: { lang: Language }) {
  const [combos, setCombos] = useState<ComboSet[]>([]);
  const { addToCart } = useCart();
  const isRTL = lang === 'ar';

  useEffect(() => {
    let cancelled = false;
    const currentMonth = new Date().getMonth() + 1;
    fetchActiveComboSets()
      .then((all) => {
        if (cancelled) return;
        const thisMonth = all.filter((c) => c.month_tags.length === 0 || c.month_tags.includes(currentMonth));
        setCombos(thisMonth.slice(0, 3));
      })
      .catch(() => { if (!cancelled) setCombos([]); });
    return () => { cancelled = true; };
  }, []);

  if (combos.length === 0) return null;

  return (
    <div className="mt-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <h3 className="font-display text-2xl text-forest-900 mb-6 text-center">Combo Tháng Này</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {combos.map((combo) => (
          <div key={combo.id} className="product-card">
            <div className="relative aspect-square overflow-hidden">
              <img src={combo.poster_image_url ?? '/assets/images/TA_logo_clean.png'} alt={combo.name_vi} className="w-full h-full object-cover" />
              {combo.theme && (
                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-gold-400 text-forest-900">
                  {combo.theme}
                </span>
              )}
            </div>
            <div className="p-6">
              <h4 className="font-display text-lg font-semibold text-forest-900 mb-2">{combo.name_vi}</h4>
              <p className="text-forest-500 text-sm line-clamp-2 mb-3">{combo.description_vi}</p>
              <p className="text-gold-600 font-semibold mb-4">{formatVND(combo.price_vnd)}</p>
              <button onClick={() => addToCart(comboToCartProduct(combo))} className="btn-gold w-full justify-center">
                <ShoppingBag className="w-4 h-4" />
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Insert it into the homepage Products section**

In `src/App.tsx`, the `home` branch from Task 7 has `<Products lang={lang} onNavigate={navigate} />` as its own line. Add the new component right after it:
```tsx
              <Products lang={lang} onNavigate={navigate} />
              <ComboOfTheMonth lang={lang} />
```
Add the import: `import ComboOfTheMonth from './components/ComboOfTheMonth';`

(It renders as its own `<div className="mt-12">` block directly below the Products section rather than inside `Products.tsx` itself — keeps `Products.tsx` focused on the static catalog grid per Task 4, and lets `ComboOfTheMonth` return `null` cleanly with zero effect on `Products.tsx`'s layout when there are no active combos this month.)

- [ ] **Step 3: Surface combos on the `Set Quà Tặng` catalog page**

Run: `grep -n "set-qua-tang\|productTypeIcons\|useLiveProducts" "D:/TA page/site/ta_production/project/src/components/ProductCatalog.tsx"` to find where the `set-qua-tang` type filter currently renders (it exists as a filter option today with zero real products behind it, per the design spec).

Add a fetch for active combos (`fetchActiveComboSets` from `siteContentApi.ts`) alongside the existing `useLiveProducts` call at the top of `ProductCatalog`'s component body, and when the active type filter is `set-qua-tang` (or no filter is active — combos should appear in the "all products" view too, tagged with their theme), render the combo cards using the same `comboToCartProduct` + `addToCart` pattern as `ComboOfTheMonth.tsx`, grouped by `theme` with the current-month group listed first (sort combos by whether `month_tags` includes `new Date().getMonth() + 1` before sorting by `sort_order`). Reuse `ProductCatalog.tsx`'s existing card markup/grid structure for visual consistency — do not introduce a second distinct card style on the same page.

- [ ] **Step 4: Type-check and build**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b && npm run build`
Expected: exits 0.

- [ ] **Step 5: Manual end-to-end check**

Using the test combo created in Task 10 Step 5 (or a fresh one, then delete it after): confirm it appears in the homepage "Combo Tháng Này" block only if its `month_tags` includes the current month (or is empty); confirm it appears on the `Set Quà Tặng` catalog page grouped under its theme; click "Thêm vào giỏ" on both surfaces and confirm the cart drawer opens with exactly one line item at the combo's fixed price (not the sum of its component SKUs' individual prices); confirm removing month_tags entirely (Task 10's admin page — edit to no months selected) makes it appear on the homepage regardless of current month, matching the "evergreen" case.

- [ ] **Step 6: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/components/ComboOfTheMonth.tsx src/App.tsx src/components/ProductCatalog.tsx
git commit -m "$(cat <<'EOF'
feat: surface active combos on homepage and Set Qua Tang catalog

Homepage shows up to 3 combos tagged for the current month (or
evergreen combos with no month tag) directly below the Products
section. The Set Qua Tang nav item, which has pointed at an empty
filter since it was added, now lists all active combos grouped by
theme with the current month's surfaced first. Both surfaces add the
combo to the cart as a single fixed-price line via the same
comboToCartProduct adapter — no separate checkout path.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Full regression pass and handoff

**Files:** none (verification only)

- [ ] **Step 1: Full build and brand guard**

Run: `cd "D:/TA page/site/ta_production/project" && npm run check:brand && npx tsc -b && npm run build`
Expected: all three pass with zero errors/violations.

- [ ] **Step 2: Full click-through in the Browser pane**

At 375px and 1440px: load `/`, scroll the entire homepage confirming the Task 7 order, click both hero CTAs, click through every header nav item, add a regular product to the cart from the Products section, add a combo to the cart from `ComboOfTheMonth`, open the cart drawer and confirm both line items show correct prices, visit `/gate-vkd-control-2026`, confirm the mobile hamburger menu (at 375px) reaches every admin page including the two new ones (Combo & Quà Tặng, Uy tín & Bằng chứng).

- [ ] **Step 3: Confirm no unintended files are staged anywhere**

Run: `git status --short`
Expected: working tree matches whatever pre-existing unrelated uncommitted changes existed before Task 1 started (from other, unrelated work sessions) — nothing from Tasks 1-11 should still be unstaged/uncommitted at this point. If anything from this plan's scope is still showing as modified, find and commit it before considering Phase 1 done.

- [ ] **Step 4: Report to Joe**

Summarize in chat (not a new doc): what shipped, the two admin pages he now has (Combo & Quà Tặng, Uy tín & Bằng chứng) and that both need his real content to actually appear on the public site (combos start as drafts, trust items start unpublished — nothing here auto-published itself), and that Phase 2 (About/Heritage-pillars/Traceability/B2B/Blog visual rebuild) is still open per the design doc.
