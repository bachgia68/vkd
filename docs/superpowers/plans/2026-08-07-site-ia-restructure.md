# Site-wide IA & Navigation Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `dac-san` product-type group (future home for non-ginseng Vietnamese specialties) and a health-goal navigation axis, and reconnect 4 orphaned pages (About, Blog, OmniChannel, Showrooms) behind an admin-controlled visibility toggle, per `docs/superpowers/specs/2026-08-07-site-ia-restructure-design.md`.

**Architecture:** React 19 + TypeScript + Vite SPA (`ta_production/project`). New Supabase table `site_sections` follows the exact admin-authored/public-gated pattern already used by `trust_proof_items`/`combo_sets` (RLS: admin full access + public read where `visible = true`). No test framework exists in this repo (`package.json` has no test script) — verification is `npx tsc -b && npm run build` plus manual checks in the Browser pane, matching every prior task in this codebase.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS v4, react-router-dom 7, @supabase/supabase-js, lucide-react icons.

## Global Constraints

- Never write literal supplier names into any customer-facing text — run `npm run check:brand` before every commit that touches `src/`.
- Do not fabricate ratings, reviews, or content. `site_sections` rows default `visible = false` — nothing here auto-publishes.
- Run `npx tsc -b` and `npm run build` before every commit that touches `src/`.
- Do not touch PayOS/checkout logic.
- Every Supabase migration goes through the Supabase MCP `apply_migration` tool against project id `xcwirgrlnibnjmseglee`.
- Working directory for all commands: `D:\TA page\site\ta_production\project` (also `D:/TA page/site/ta_production/project` from Bash).
- No visual redesign of `About.tsx`, `Blog.tsx`, `OmniChannel.tsx`, `Showrooms.tsx` internals in this plan — only routing/nav changes.
- No ingredient-based navigation axis in this plan (deferred per spec — TA's ingredient data is free text, not a controlled vocabulary).

---

## Task 1: `dac-san` product group on `productTypes.ts`

**Files:**
- Modify: `src/data/productTypes.ts`

**Interfaces:**
- Produces: `ProductTypeMeta.group: 'sam' | 'dac-san'` (new required field on every entry), consumed by Task 6 (Header mega-menu column) and Task 7 (catalog sidebar, unchanged behavior — just reads the new field, doesn't need to branch on it).

- [ ] **Step 1: Add the `group` field to the type and every entry**

Replace the full contents of `src/data/productTypes.ts` with:

```ts
export type ProductTypeId =
  | 'sam-cu-tuoi-kho'
  | 'sam-ngam-mat-ong'
  | 'tra-nuoc-uong-sam'
  | 'ruou-sam'
  | 'nam-lim-duoc-lieu'
  | 'my-pham-sam'
  | 'set-qua-tang';

export type ProductTypeGroup = 'sam' | 'dac-san';

export interface ProductTypeMeta {
  id: ProductTypeId;
  labelVi: string;
  labelEn: string;
  desc: string;
  group: ProductTypeGroup;
}

export const productTypes: ProductTypeMeta[] = [
  { id: 'sam-cu-tuoi-kho', labelVi: 'Sâm Củ Tươi & Sâm Khô', labelEn: 'Fresh & Dried Ginseng Root', desc: 'Sâm Ngọc Linh nguyên củ, lát khô, lá, hoa sâm', group: 'sam' },
  { id: 'sam-ngam-mat-ong', labelVi: 'Sâm Ngâm Mật Ong', labelEn: 'Honey-Steeped Ginseng', desc: 'Sâm ngâm mật ong rừng nguyên chất', group: 'sam' },
  { id: 'tra-nuoc-uong-sam', labelVi: 'Trà & Nước Uống Sâm', labelEn: 'Ginseng Tea & Drinks', desc: 'Trà túi lọc, nước uống, tinh chất PanaxX', group: 'sam' },
  { id: 'ruou-sam', labelVi: 'Rượu Sâm', labelEn: 'Ginseng Wine', desc: 'Rượu sâm Ngọc Linh, rượu dược liệu cao cấp', group: 'sam' },
  { id: 'nam-lim-duoc-lieu', labelVi: 'Nấm Lim Xanh & Dược Liệu', labelEn: 'Green Lim Mushroom & Herbs', desc: 'Nấm Lim Xanh, mật ong rừng, dược liệu quý', group: 'dac-san' },
  { id: 'my-pham-sam', labelVi: 'Mỹ Phẩm Sâm', labelEn: 'Ginseng Cosmetics', desc: 'Collagen sâm, kem dưỡng, serum Pn\'s Choice', group: 'sam' },
  { id: 'set-qua-tang', labelVi: 'Set Quà Tặng', labelEn: 'Gift Sets', desc: 'Set quà sức khỏe cao cấp cho dịp lễ, Tết', group: 'sam' },
];

export function getProductTypeMeta(id: ProductTypeId): ProductTypeMeta {
  const meta = productTypes.find((t) => t.id === id);
  if (!meta) throw new Error(`Unknown productType: ${id}`);
  return meta;
}
```

(Only change from the original: added `ProductTypeGroup` type, `group` field on the interface, and a `group` value on each of the 7 entries — `nam-lim-duoc-lieu` is the only one set to `'dac-san'`.)

- [ ] **Step 2: Type-check**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b`
Expected: exits 0. (If any other file constructs a `ProductTypeMeta` literal without `group`, this step catches it — none should exist outside this file.)

- [ ] **Step 3: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/data/productTypes.ts
git commit -m "$(cat <<'EOF'
feat: add group field to product types, reclassify Nấm Lim as dac-san

Future non-ginseng Vietnamese specialty products need a designated
home in the nav without another structural rework. Adds
group: 'sam' | 'dac-san' to ProductTypeMeta; nam-lim-duoc-lieu becomes
the first real dac-san entry instead of an empty placeholder category.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: `site_sections` table and public read function

**Files:**
- Create migration: `site_sections` table (via `apply_migration`)
- Modify: `src/lib/siteContentApi.ts`

**Interfaces:**
- Produces: `export interface SiteSection { id: string; key: string; label_vi: string; nav_group: string; path: string; sort_order: number }` and `fetchVisibleSections(): Promise<SiteSection[]>` (public, `visible = true` only) in `siteContentApi.ts` — consumed by Task 5 (`App.tsx`) and Task 6 (`Header.tsx`).

- [ ] **Step 1: Apply the migration**

Use Supabase MCP `apply_migration`, `project_id: "xcwirgrlnibnjmseglee"`, `name: "create_site_sections"`:
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

alter table public.site_sections enable row level security;

create policy "admin full access site_sections"
  on public.site_sections for all
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "public read visible site_sections"
  on public.site_sections for select
  to public
  using (visible = true);

insert into public.site_sections (key, label_vi, nav_group, path, sort_order) values
  ('about', 'Về TA', 'Giới thiệu', 'about', 0),
  ('blog', 'Blog', '', 'blog', 1),
  ('omnichannel', 'Kênh Phân Phối', '', '', 2),
  ('showrooms', 'Showroom', '', 'showrooms', 3);
```

- [ ] **Step 2: Verify**

Via Supabase MCP `execute_sql`, same project:
```sql
select key, label_vi, path, visible, sort_order from site_sections order by sort_order;
```
Expected: 4 rows, all `visible = false`, matching the table above.

```sql
select policyname, cmd, roles::text from pg_policies where tablename = 'site_sections';
```
Expected: 2 rows — `admin full access site_sections` (ALL, `{authenticated}`), `public read visible site_sections` (SELECT, `{public}`).

- [ ] **Step 3: Add the public read function**

In `src/lib/siteContentApi.ts`, add after `fetchActiveComboSets` (or any existing fetch function — exact position doesn't matter, follow the file's existing style of one export per concern):
```ts
export interface SiteSection {
  id: string;
  key: string;
  label_vi: string;
  nav_group: string;
  path: string;
  sort_order: number;
}

export async function fetchVisibleSections(): Promise<SiteSection[]> {
  const { data, error } = await supabase
    .from('site_sections')
    .select('id, key, label_vi, nav_group, path, sort_order')
    .eq('visible', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}
```

- [ ] **Step 4: Type-check and build**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b && npm run build`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/lib/siteContentApi.ts
git commit -m "$(cat <<'EOF'
feat: site_sections table and public read function

New table gates 4 orphaned pages (About, Blog, OmniChannel, Showrooms)
behind admin-controlled visibility, same RLS pattern as
trust_proof_items/combo_sets. Seeded with all 4 rows set to
visible=false — nothing becomes reachable until Joe turns it on from
the admin panel (Task 3).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Admin CRUD, `SiteSectionsPage.tsx`, wire route + nav

**Files:**
- Modify: `src/admin/adminApi.ts`
- Create: `src/admin/pages/SiteSectionsPage.tsx`
- Modify: `src/admin/AdminApp.tsx`, `src/admin/AdminLayout.tsx`

**Interfaces:**
- Consumes: `SiteSection` type from `siteContentApi.ts` (Task 2).
- Produces: `fetchAllSiteSections(): Promise<SiteSection[] & { visible: boolean }[]>`, `updateSiteSectionVisibility(id: string, visible: boolean): Promise<void>` in `adminApi.ts` — no create/delete, the 4 rows are fixed seed data.

- [ ] **Step 1: Add admin functions**

In `src/admin/adminApi.ts`, add the import (find the existing `import type { ... } from '../lib/siteContentApi';` line and extend it) — change:
```ts
import type { SiteAddress, ContactPhone, SocialLink, BlogPost, TrustProofItem, ComboSet } from '../lib/siteContentApi';
```
to:
```ts
import type { SiteAddress, ContactPhone, SocialLink, BlogPost, TrustProofItem, ComboSet, SiteSection } from '../lib/siteContentApi';
```
and the matching `export type` line — change:
```ts
export type { SiteAddress, ContactPhone, SocialLink, BlogPost, TrustProofItem, ComboSet };
```
to:
```ts
export type { SiteAddress, ContactPhone, SocialLink, BlogPost, TrustProofItem, ComboSet, SiteSection };
```

Then add, near the other admin CRUD blocks (after the Combo/Gift Sets section):
```ts
// ---------- Site Sections (admin-controlled visibility for orphaned pages) ----------

export async function fetchAllSiteSections(): Promise<(SiteSection & { visible: boolean })[]> {
  return throwIfError(
    await supabase
      .from('site_sections')
      .select('id, key, label_vi, nav_group, path, sort_order, visible')
      .order('sort_order')
  );
}

export async function updateSiteSectionVisibility(id: string, visible: boolean) {
  const { error } = await supabase.from('site_sections').update({ visible, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
}
```

- [ ] **Step 2: Build the admin page**

Create `src/admin/pages/SiteSectionsPage.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { fetchAllSiteSections, updateSiteSectionVisibility, type SiteSection } from '../adminApi';

type Row = SiteSection & { visible: boolean };

export default function SiteSectionsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchAllSiteSections()
      .then(setRows)
      .catch((e) => showToast(e instanceof Error ? e.message : 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggle = async (row: Row) => {
    try {
      await updateSiteSectionVisibility(row.id, !row.visible);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl md:text-2xl font-display text-forest-900 mb-1">Quản lý Trang</h1>
      <p className="text-sm text-forest-500 mb-6">
        Các trang đã build sẵn nhưng chưa có nội dung thật — bật "Hiện" khi
        sẵn sàng, trang sẽ xuất hiện ngay trong menu điều hướng tương ứng,
        không cần sửa code.
      </p>

      {toast && <div className="mb-4 px-4 py-2 rounded-lg bg-forest-900 text-white text-sm">{toast}</div>}

      {loading ? (
        <p className="text-sm text-forest-500">Đang tải…</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="bg-white border border-cream-200 rounded-xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-forest-900">{row.label_vi}</p>
                <p className="text-xs text-forest-500">key: {row.key}{row.nav_group ? ` · nhóm nav: ${row.nav_group}` : ''}</p>
              </div>
              <button
                onClick={() => toggle(row)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium ${
                  row.visible ? 'bg-forest-100 text-forest-800' : 'bg-gold-400/15 text-gold-700'
                }`}
              >
                {row.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {row.visible ? 'Đang hiện' : 'Đang ẩn'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Wire the route and nav entry**

In `src/admin/AdminApp.tsx`, change:
```tsx
import TrustProofPage from './pages/TrustProofPage';
import CombosPage from './pages/CombosPage';
```
to:
```tsx
import TrustProofPage from './pages/TrustProofPage';
import CombosPage from './pages/CombosPage';
import SiteSectionsPage from './pages/SiteSectionsPage';
```
and add this route inside the existing `<Route path="/" element={<Gate />}>` block, alongside the other page routes (e.g. immediately after `<Route path="combos" element={<CombosPage />} />`):
```tsx
          <Route path="site-sections" element={<SiteSectionsPage />} />
```

In `src/admin/AdminLayout.tsx`, change:
```tsx
import { LayoutGrid, FileText, Users, Warehouse, LogOut, Leaf, Package, Handshake, Store, BarChart3, Settings, FileSpreadsheet, Share2, Quote, Gift, Menu, X } from 'lucide-react';
```
to:
```tsx
import { LayoutGrid, FileText, Users, Warehouse, LogOut, Leaf, Package, Handshake, Store, BarChart3, Settings, FileSpreadsheet, Share2, Quote, Gift, Menu, X, Eye } from 'lucide-react';
```
and add to the `NAV` array (after the `trust-proof` entry):
```tsx
  { to: '/gate-vkd-control-2026/site-sections', end: false, label: 'Quản lý Trang', icon: Eye },
```

- [ ] **Step 4: Type-check and build**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b && npm run build`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/admin/adminApi.ts src/admin/pages/SiteSectionsPage.tsx src/admin/AdminApp.tsx src/admin/AdminLayout.tsx
git commit -m "$(cat <<'EOF'
feat: admin page to toggle visibility of the 4 orphaned pages

"Quản lý Trang" lists About/Blog/OmniChannel/Showrooms with a single
Hiện/Ẩn toggle each — Joe controls this himself, no code change needed
to turn a page on once it has real content. Wired but not yet
consumed by the public site (Task 5 makes App.tsx/Header.tsx read it).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Nav translations for Blog and Showrooms

**Files:**
- Modify: `src/i18n/translations.ts`

**Interfaces:**
- Produces: `t.nav.blog: string`, `t.nav.showrooms: string` in all 5 languages — consumed by Task 6 (`Header.tsx`).

- [ ] **Step 1: Extend the `nav` interface**

Find (near the top of the file):
```ts
  nav: {
    home: string;
    about: string;
    products: string;
    giftSets: string;
    research: string;
    traceability: string;
    b2b: string;
    autoship: string;
    contact: string;
  };
```
Change to:
```ts
  nav: {
    home: string;
    about: string;
    products: string;
    giftSets: string;
    research: string;
    traceability: string;
    b2b: string;
    autoship: string;
    contact: string;
    blog: string;
    showrooms: string;
  };
```

- [ ] **Step 2: Add the 2 keys to each of the 5 `nav:` blocks**

Vietnamese block, find:
```ts
    nav: {
      home: 'Trang chủ',
      about: 'Giới thiệu',
      products: 'Sản phẩm',
      giftSets: 'Set Quà Tặng',
      research: 'Nghiên Cứu',
      traceability: 'Truy xuất',
      b2b: 'Hợp tác',
      autoship: 'Mua Định Kỳ',
      contact: 'Liên hệ',
    },
```
Change to:
```ts
    nav: {
      home: 'Trang chủ',
      about: 'Giới thiệu',
      products: 'Sản phẩm',
      giftSets: 'Set Quà Tặng',
      research: 'Nghiên Cứu',
      traceability: 'Truy xuất',
      b2b: 'Hợp tác',
      autoship: 'Mua Định Kỳ',
      contact: 'Liên hệ',
      blog: 'Blog',
      showrooms: 'Showroom',
    },
```

English block, find:
```ts
    nav: {
      home: 'Home',
      about: 'About',
      products: 'Products',
      giftSets: 'Gift Sets',
      research: 'Research',
      traceability: 'Traceability',
      b2b: 'Partners',
      autoship: 'Subscribe',
      contact: 'Contact',
    },
```
Change to:
```ts
    nav: {
      home: 'Home',
      about: 'About',
      products: 'Products',
      giftSets: 'Gift Sets',
      research: 'Research',
      traceability: 'Traceability',
      b2b: 'Partners',
      autoship: 'Subscribe',
      contact: 'Contact',
      blog: 'Blog',
      showrooms: 'Showrooms',
    },
```

Chinese block, find:
```ts
    nav: {
      home: '首页',
      about: '关于我们',
      products: '产品',
      giftSets: '礼品套装',
      research: '研究',
      traceability: '溯源',
      b2b: '合作',
      autoship: '订阅',
      contact: '联系我们',
    },
```
Change to:
```ts
    nav: {
      home: '首页',
      about: '关于我们',
      products: '产品',
      giftSets: '礼品套装',
      research: '研究',
      traceability: '溯源',
      b2b: '合作',
      autoship: '订阅',
      contact: '联系我们',
      blog: '博客',
      showrooms: '展厅',
    },
```

French block, find:
```ts
    nav: {
      home: 'Accueil',
      about: 'À Propos',
      products: 'Produits',
      giftSets: 'Coffrets Cadeaux',
      research: 'Recherche',
      traceability: 'Traçabilité',
      b2b: 'Partenariats',
      autoship: 'Abonnement',
      contact: 'Contact',
    },
```
Change to:
```ts
    nav: {
      home: 'Accueil',
      about: 'À Propos',
      products: 'Produits',
      giftSets: 'Coffrets Cadeaux',
      research: 'Recherche',
      traceability: 'Traçabilité',
      b2b: 'Partenariats',
      autoship: 'Abonnement',
      contact: 'Contact',
      blog: 'Blog',
      showrooms: 'Salles d\'exposition',
    },
```

Arabic block, find:
```ts
    nav: {
      home: 'الرئيسية',
      about: 'عنا',
      products: 'المنتجات',
      giftSets: 'أطقم الهدايا',
      research: 'البحث',
      traceability: 'التتبع',
      b2b: 'الشراكات',
      autoship: 'اشتراك',
      contact: 'اتصل بنا',
    },
```
Change to:
```ts
    nav: {
      home: 'الرئيسية',
      about: 'عنا',
      products: 'المنتجات',
      giftSets: 'أطقم الهدايا',
      research: 'البحث',
      traceability: 'التتبع',
      b2b: 'الشراكات',
      autoship: 'اشتراك',
      contact: 'اتصل بنا',
      blog: 'المدونة',
      showrooms: 'صالات العرض',
    },
```

- [ ] **Step 3: Type-check**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/i18n/translations.ts
git commit -m "$(cat <<'EOF'
feat: add nav.blog and nav.showrooms translations (5 languages)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: `App.tsx` — fetch visible sections, add routes, parse `goal` query param

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `fetchVisibleSections` (Task 2), `About`/`Blog`/`Showrooms`/`OmniChannel` components (existing, unchanged props).
- Produces: `visibleSections: Set<string>` state passed to `Header` as a new prop (consumed by Task 6); `initialGoal` prop passed to `ProductCatalog` (consumed by Task 7).

- [ ] **Step 1: Import the 4 orphaned components and the fetch function**

Add near the other component imports:
```tsx
import About from './components/About';
import Blog from './components/Blog';
import OmniChannel from './components/OmniChannel';
import Showrooms from './components/Showrooms';
```
Add to the existing `siteContentApi` usage — this file doesn't import from `siteContentApi.ts` directly today (it goes through `navigate`/props only), so add a new import line:
```tsx
import { fetchVisibleSections } from './lib/siteContentApi';
```

- [ ] **Step 2: Add `visibleSections` state and fetch it on mount**

After the existing `const [userEmail, _setUserEmail] = useState<string | undefined>(undefined);` line, add:
```tsx
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchVisibleSections()
      .then((rows) => setVisibleSections(new Set(rows.map((r) => r.key))))
      .catch(() => setVisibleSections(new Set()));
  }, []);
```

- [ ] **Step 3: Add `goal` query param parsing alongside the existing `type` parsing**

Find:
```tsx
  const [basePage, queryString] = currentPage.split('?');
  const catalogType = new URLSearchParams(queryString).get('type') ?? undefined;
```
Change to:
```tsx
  const [basePage, queryString] = currentPage.split('?');
  const catalogType = new URLSearchParams(queryString).get('type') ?? undefined;
  const catalogGoal = new URLSearchParams(queryString).get('goal') ?? undefined;
```

- [ ] **Step 4: Pass `visibleSections` to `Header` and `initialGoal` to `ProductCatalog`**

Find:
```tsx
        <Header
          lang={lang}
          onLangChange={setLang}
          onNavigate={navigate}
          currentPage={currentPage}
        />
```
Change to:
```tsx
        <Header
          lang={lang}
          onLangChange={setLang}
          onNavigate={navigate}
          currentPage={currentPage}
          visibleSections={visibleSections}
        />
```

Find:
```tsx
          {basePage === 'catalog' && (
            <ProductCatalog lang={lang} onNavigate={navigate} initialType={catalogType} />
          )}
```
Change to:
```tsx
          {basePage === 'catalog' && (
            <ProductCatalog lang={lang} onNavigate={navigate} initialType={catalogType} initialGoal={catalogGoal} />
          )}
```

- [ ] **Step 5: Add the 3 new standalone routes and gate OmniChannel inside `home`**

Find:
```tsx
          {currentPage === 'traceability' && (
            <Traceability lang={lang} />
          )}
```
Add immediately after it:
```tsx

          {currentPage === 'about' && visibleSections.has('about') && (
            <About lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'blog' && visibleSections.has('blog') && (
            <Blog />
          )}

          {currentPage === 'showrooms' && visibleSections.has('showrooms') && (
            <Showrooms lang={lang} />
          )}
```

Find the `home` branch's B2B line:
```tsx
              <Certifications lang={lang} />
              <TrustProof lang={lang} />
              <B2B lang={lang} />
            </>
          )}
```
Change to:
```tsx
              <Certifications lang={lang} />
              <TrustProof lang={lang} />
              <B2B lang={lang} />
              {visibleSections.has('omnichannel') && <OmniChannel lang={lang} onNavigate={navigate} />}
            </>
          )}
```

- [ ] **Step 6: Type-check and build**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b && npm run build`
Expected: fails at this point — `Header` doesn't accept a `visibleSections` prop yet (Task 6) and `ProductCatalog` doesn't accept `initialGoal` yet (Task 7). This is expected; do not attempt to fix `Header.tsx`/`ProductCatalog.tsx` from within this task. Confirm the *only* errors are exactly these two missing-prop errors (nothing else broken) — this proves Steps 1-5 are otherwise correct — then proceed to commit.

- [ ] **Step 7: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/App.tsx
git commit -m "$(cat <<'EOF'
feat: App.tsx fetches visible sections, adds about/blog/showrooms routes

Wires the read side of site_sections (Task 2/3) into the app: 3 new
standalone routes gated on visibility, OmniChannel rendered inline in
home when its row is visible. Expected to be non-building on its own
(Header.tsx/ProductCatalog.tsx prop types land in Tasks 6-7) — this is
an intentional intermediate commit, not a regression.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: `Header.tsx` — 3-column mega-menu, conditional nav entries

**Files:**
- Modify: `src/components/Header.tsx`

**Interfaces:**
- Consumes: `visibleSections: Set<string>` prop (Task 5), `healthGoalLabels` from `src/data/mockData.ts` (existing: `Record<HealthGoal, { en: string; vi: string; icon: string }>`), `ProductTypeMeta.group` (Task 1).
- Produces: `HeaderProps` gains `visibleSections: Set<string>` (required prop — `App.tsx` always passes it as of Task 5).

- [ ] **Step 1: Add imports**

Change:
```tsx
import { productTypes } from '../data/productTypes';
```
to:
```tsx
import { productTypes } from '../data/productTypes';
import { healthGoalLabels } from '../data/mockData';
import type { HealthGoal } from '../data/mockData';
```

- [ ] **Step 2: Extend `HeaderProps`**

Change:
```tsx
interface HeaderProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}
```
to:
```tsx
interface HeaderProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  visibleSections: Set<string>;
}
```

- [ ] **Step 3: Accept the new prop**

Change:
```tsx
export default function Header({ lang, onLangChange, onNavigate, currentPage }: HeaderProps) {
```
to:
```tsx
export default function Header({ lang, onLangChange, onNavigate, currentPage, visibleSections }: HeaderProps) {
```

- [ ] **Step 4: Build the conditional `navItems` list**

Change:
```tsx
  const navItems = [
    { key: 'home', href: 'home' },
    { key: 'about', href: 'about' },
    { key: 'products', href: 'catalog' }, // render dropdown riêng, xem desktop nav
    { key: 'giftSets', href: 'catalog?type=set-qua-tang' },
    { key: 'research', href: 'research' },
    { key: 'traceability', href: 'traceability' },
    { key: 'b2b', href: 'b2b' },
    { key: 'autoship', href: 'autoship' },
  ];
```
to:
```tsx
  const navItems = [
    { key: 'home', href: 'home' },
    { key: 'about', href: 'about' },
    { key: 'products', href: 'catalog' }, // render dropdown riêng, xem desktop nav
    { key: 'giftSets', href: 'catalog?type=set-qua-tang' },
    { key: 'research', href: 'research' },
    { key: 'traceability', href: 'traceability' },
    ...(visibleSections.has('showrooms') ? [{ key: 'showrooms', href: 'showrooms' }] : []),
    ...(visibleSections.has('blog') ? [{ key: 'blog', href: 'blog' }] : []),
    { key: 'b2b', href: 'b2b' },
    { key: 'autoship', href: 'autoship' },
  ];
```

(`about` stays unconditional in this array — it's already handled specially by `handleNav`, which redirects `'about'` to `about-story`. Step 6 below changes that redirect to a real dropdown instead.)

- [ ] **Step 5: Split product types by group and add health goals array**

After the `const navItems = [...]` block, add:
```tsx
  const samProductTypes = productTypes.filter((pt) => pt.group === 'sam' && pt.id !== 'set-qua-tang');
  const dacSanProductTypes = productTypes.filter((pt) => pt.group === 'dac-san');
  const healthGoals = Object.keys(healthGoalLabels) as HealthGoal[];
```

- [ ] **Step 6: Replace `handleNav`'s `about` branch and add `blog`/`showrooms`**

Change:
```tsx
  const handleNav = (href: string) => {
    if (href === 'about') {
      onNavigate('about-story');
    } else if (href === 'traceability') {
```
to:
```tsx
  const handleNav = (href: string) => {
    if (href === 'traceability') {
```

(Removing the special-case entirely — `'about'` and `'about-story'` are now two separate real destinations offered via the dropdown built in Step 8, not aliased to each other. `'blog'` and `'showrooms'` need no special case — they fall through to the existing `else { onNavigate(href); }` branch since their `href` already equals their `currentPage` value.)

- [ ] **Step 7: Fix the now-stale active-state comparison**

Change:
```tsx
                  className={`nav-link text-sm font-medium tracking-wide ${
                    currentPage === (item.href === 'about' ? 'about-story' : item.href)
                      ? 'text-gold-600'
```
to:
```tsx
                  className={`nav-link text-sm font-medium tracking-wide ${
                    (item.href === 'about' ? currentPage === 'about' || currentPage === 'about-story' : currentPage === item.href)
                      ? 'text-gold-600'
```

- [ ] **Step 8: Replace the `'about'` nav item's rendering with a dropdown, and expand the products mega-menu**

This is the largest single change in this task — replace the entire desktop nav `.map()` block. Find:
```tsx
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) =>
              item.key === 'products' ? (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => setIsProductMenuOpen(true)}
                  onMouseLeave={() => setIsProductMenuOpen(false)}
                >
                  <button
                    onClick={() => handleNav('catalog')}
                    className={`nav-link text-sm font-medium tracking-wide flex items-center gap-1 ${
                      currentPage === item.href
                        ? 'text-gold-600'
                        : useLightText
                        ? 'text-white/90 hover:text-white'
                        : 'text-forest-700 hover:text-forest-900'
                    }`}
                  >
                    {t.nav.products}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {isProductMenuOpen && (
                    <div className="absolute top-full left-0 pt-2 w-72 z-50">
                      <div className="bg-cream-50 rounded-2xl shadow-elegant-lg border border-cream-200 py-3">
                      {productTypes
                        .filter((pt) => pt.id !== 'set-qua-tang')
                        .map((pt) => (
                          <button
                            key={pt.id}
                            onClick={() => {
                              setIsProductMenuOpen(false);
                              onNavigate(`catalog?type=${pt.id}`);
                            }}
                            className="w-full text-left px-5 py-2.5 text-sm text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                          >
                            {lang === 'vi' ? pt.labelVi : pt.labelEn}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.href)}
                  className={`nav-link text-sm font-medium tracking-wide ${
                    (item.href === 'about' ? currentPage === 'about' || currentPage === 'about-story' : currentPage === item.href)
                      ? 'text-gold-600'
                      : useLightText
                      ? 'text-white/90 hover:text-white'
                      : 'text-forest-700 hover:text-forest-900'
                  }`}
                >
                  {t.nav[item.key as keyof typeof t.nav] || item.key}
                </button>
              )
            )}
          </div>
```

Replace with:
```tsx
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              if (item.key === 'products') {
                return (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => setIsProductMenuOpen(true)}
                    onMouseLeave={() => setIsProductMenuOpen(false)}
                  >
                    <button
                      onClick={() => handleNav('catalog')}
                      className={`nav-link text-sm font-medium tracking-wide flex items-center gap-1 ${
                        currentPage === item.href
                          ? 'text-gold-600'
                          : useLightText
                          ? 'text-white/90 hover:text-white'
                          : 'text-forest-700 hover:text-forest-900'
                      }`}
                    >
                      {t.nav.products}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {isProductMenuOpen && (
                      <div className="absolute top-full left-0 pt-2 w-[640px] z-50">
                        <div className="bg-cream-50 rounded-2xl shadow-elegant-lg border border-cream-200 py-5 px-2 grid grid-cols-3 gap-2">
                          <div>
                            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-forest-400">
                              {lang === 'vi' ? 'Theo loại sản phẩm' : 'By product type'}
                            </p>
                            {samProductTypes.map((pt) => (
                              <button
                                key={pt.id}
                                onClick={() => {
                                  setIsProductMenuOpen(false);
                                  onNavigate(`catalog?type=${pt.id}`);
                                }}
                                className="w-full text-left px-3 py-2 text-sm rounded-lg text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                              >
                                {lang === 'vi' ? pt.labelVi : pt.labelEn}
                              </button>
                            ))}
                          </div>
                          <div>
                            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-forest-400">
                              {lang === 'vi' ? 'Đặc Sản Việt Nam' : 'Vietnamese Specialties'}
                            </p>
                            {dacSanProductTypes.map((pt) => (
                              <button
                                key={pt.id}
                                onClick={() => {
                                  setIsProductMenuOpen(false);
                                  onNavigate(`catalog?type=${pt.id}`);
                                }}
                                className="w-full text-left px-3 py-2 text-sm rounded-lg text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                              >
                                {lang === 'vi' ? pt.labelVi : pt.labelEn}
                              </button>
                            ))}
                          </div>
                          <div>
                            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-forest-400">
                              {lang === 'vi' ? 'Theo mục tiêu' : 'By goal'}
                            </p>
                            {healthGoals.map((g) => (
                              <button
                                key={g}
                                onClick={() => {
                                  setIsProductMenuOpen(false);
                                  onNavigate(`catalog?goal=${g}`);
                                }}
                                className="w-full text-left px-3 py-2 text-sm rounded-lg text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                              >
                                {lang === 'vi' ? healthGoalLabels[g].vi : healthGoalLabels[g].en}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.key === 'about') {
                return (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => setIsAboutMenuOpen(true)}
                    onMouseLeave={() => setIsAboutMenuOpen(false)}
                  >
                    <button
                      className={`nav-link text-sm font-medium tracking-wide flex items-center gap-1 ${
                        currentPage === 'about' || currentPage === 'about-story'
                          ? 'text-gold-600'
                          : useLightText
                          ? 'text-white/90 hover:text-white'
                          : 'text-forest-700 hover:text-forest-900'
                      }`}
                    >
                      {t.nav.about}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {isAboutMenuOpen && (
                      <div className="absolute top-full left-0 pt-2 w-64 z-50">
                        <div className="bg-cream-50 rounded-2xl shadow-elegant-lg border border-cream-200 py-3">
                          <button
                            onClick={() => { setIsAboutMenuOpen(false); onNavigate('about-story'); }}
                            className="w-full text-left px-5 py-2.5 text-sm text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                          >
                            {lang === 'vi' ? 'Câu chuyện người sáng lập' : "Founder's Story"}
                          </button>
                          {visibleSections.has('about') && (
                            <button
                              onClick={() => { setIsAboutMenuOpen(false); onNavigate('about'); }}
                              className="w-full text-left px-5 py-2.5 text-sm text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                            >
                              {lang === 'vi' ? 'Về TA' : 'About TA'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.href)}
                  className={`nav-link text-sm font-medium tracking-wide ${
                    currentPage === item.href
                      ? 'text-gold-600'
                      : useLightText
                      ? 'text-white/90 hover:text-white'
                      : 'text-forest-700 hover:text-forest-900'
                  }`}
                >
                  {t.nav[item.key as keyof typeof t.nav] || item.key}
                </button>
              );
            })}
          </div>
```

- [ ] **Step 9: Add the `isAboutMenuOpen` state**

Change:
```tsx
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
```
to:
```tsx
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
```

- [ ] **Step 10: Update the mobile menu to include the About dropdown's 2 destinations and respect visibility**

Find:
```tsx
            <div className="container-wide py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.href)}
                  className="block w-full text-left px-4 py-3 text-forest-700 hover:bg-forest-50 hover:text-forest-900 rounded-lg transition-colors"
                >
                  {t.nav[item.key as keyof typeof t.nav] || item.key}
                </button>
              ))}
```
Change to:
```tsx
            <div className="container-wide py-4 space-y-2">
              {navItems.map((item) =>
                item.key === 'about' ? (
                  <div key={item.key} className="space-y-1">
                    <button
                      onClick={() => handleNav('about-story')}
                      className="block w-full text-left px-4 py-3 text-forest-700 hover:bg-forest-50 hover:text-forest-900 rounded-lg transition-colors"
                    >
                      {lang === 'vi' ? 'Câu chuyện người sáng lập' : "Founder's Story"}
                    </button>
                    {visibleSections.has('about') && (
                      <button
                        onClick={() => handleNav('about')}
                        className="block w-full text-left px-4 py-3 text-forest-700 hover:bg-forest-50 hover:text-forest-900 rounded-lg transition-colors"
                      >
                        {lang === 'vi' ? 'Về TA' : 'About TA'}
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    key={item.key}
                    onClick={() => handleNav(item.href)}
                    className="block w-full text-left px-4 py-3 text-forest-700 hover:bg-forest-50 hover:text-forest-900 rounded-lg transition-colors"
                  >
                    {t.nav[item.key as keyof typeof t.nav] || item.key}
                  </button>
                )
              )}
```

- [ ] **Step 11: Type-check**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b`
Expected: still fails — `ProductCatalog` doesn't accept `initialGoal` yet (Task 7). Confirm the *only* remaining error is that one (no `Header.tsx` errors).

- [ ] **Step 12: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/components/Header.tsx
git commit -m "$(cat <<'EOF'
feat: 3-column products mega-menu, About dropdown, conditional nav

"Sản phẩm" mega-menu gains 2 new columns (Đặc Sản Việt Nam sourced
from ProductTypeMeta.group, and health-goal browsing using the
existing healthGoalLabels data — no new content, just a new way to
browse it). "Giới thiệu" becomes a 2-item dropdown (Founder's Story +
About TA), the latter only shown when visibleSections has 'about'.
Blog/Showroom nav entries only render when their site_sections row is
visible. Still doesn't build standalone — ProductCatalog's initialGoal
prop lands in Task 7.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: `ProductCatalog.tsx` — health-goal filter group

**Files:**
- Modify: `src/components/ProductCatalog.tsx`

**Interfaces:**
- Consumes: `healthGoalLabels`, `HealthGoal` from `src/data/mockData.ts`.
- Produces: `ProductCatalogProps` gains `initialGoal?: string` (optional, matches `initialType`'s existing optionality).

- [ ] **Step 1: Add imports**

Find:
```tsx
import { products as staticProducts, toCartProduct, type Product } from '../data/products';
```
Add immediately after it:
```tsx
import { healthGoalLabels, type HealthGoal } from '../data/mockData';
```

- [ ] **Step 2: Extend props and add `activeGoal` state**

Find:
```tsx
export default function ProductCatalog({
  lang,
  onNavigate,
  initialType,
}: {
  lang: Language;
  onNavigate: (page: string, slug?: string) => void;
  initialType?: string;
}) {
```
Change to:
```tsx
export default function ProductCatalog({
  lang,
  onNavigate,
  initialType,
  initialGoal,
}: {
  lang: Language;
  onNavigate: (page: string, slug?: string) => void;
  initialType?: string;
  initialGoal?: string;
}) {
```

Find:
```tsx
  const [activeType, setActiveType] = useState<ProductTypeId | 'all'>(
    isValidProductType(initialType) ? initialType : 'all'
  );
```
Add immediately after that block (after the existing `useEffect` that re-syncs `activeType` from `initialType`, i.e. after the closing `}, [initialType]);`):
```tsx
  const isValidHealthGoal = (id?: string): id is HealthGoal =>
    !!id && Object.keys(healthGoalLabels).includes(id);

  const [activeGoal, setActiveGoal] = useState<HealthGoal | 'all'>(
    isValidHealthGoal(initialGoal) ? initialGoal : 'all'
  );

  useEffect(() => {
    setActiveGoal(isValidHealthGoal(initialGoal) ? initialGoal : 'all');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialGoal]);
```

- [ ] **Step 3: Filter by goal in the existing `filtered` `useMemo`**

Find:
```tsx
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (activeType !== 'all' && p.productType !== activeType) return false;
      if (query.trim() && !p.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });
```
Change to:
```tsx
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (activeType !== 'all' && p.productType !== activeType) return false;
      if (activeGoal !== 'all' && p.healthGoal !== activeGoal) return false;
      if (query.trim() && !p.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });
```
And update the dependency array on the same `useMemo` — find:
```tsx
  }, [activeType, query, sortBy]);
```
Change to:
```tsx
  }, [activeType, activeGoal, query, sortBy]);
```

- [ ] **Step 4: Add the sidebar filter group**

Find the closing of the existing "Category Hierarchy" sidebar block — locate:
```tsx
              {/* Authenticity note */}
              <div className="rounded-2xl bg-forest-900 p-5 text-cream-100 shadow-elegant">
```
Insert immediately before it:
```tsx
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-500 mb-4 px-1">
                  {lang === 'vi' ? 'Mục Tiêu Sức Khỏe' : 'Health Goal'}
                </h3>
                <ul className="space-y-1.5">
                  <li>
                    <CategoryButton
                      active={activeGoal === 'all'}
                      onClick={() => setActiveGoal('all')}
                      icon={null}
                      label={lang === 'vi' ? 'Tất cả mục tiêu' : 'All goals'}
                      count={products.length}
                    />
                  </li>
                  {(Object.keys(healthGoalLabels) as HealthGoal[]).map((g) => (
                    <li key={g}>
                      <CategoryButton
                        active={activeGoal === g}
                        onClick={() => setActiveGoal(g)}
                        icon={null}
                        label={lang === 'vi' ? healthGoalLabels[g].vi : healthGoalLabels[g].en}
                        count={products.filter((p) => p.healthGoal === g).length}
                      />
                    </li>
                  ))}
                </ul>
              </div>

```

- [ ] **Step 5: Type-check and build (full plan now complete — this must be a clean pass)**

Run: `cd "D:/TA page/site/ta_production/project" && npx tsc -b && npm run build`
Expected: exits 0. If this fails, check the Task 5/6 "expected failure" steps actually only had the errors this task's changes fix — do not proceed to Step 6 until this is clean.

- [ ] **Step 6: Commit**

```bash
cd "D:/TA page/site/ta_production/project"
git add src/components/ProductCatalog.tsx
git commit -m "$(cat <<'EOF'
feat: health-goal filter in catalog sidebar, completes IA restructure

Second, independent filter axis alongside the existing product-type
sidebar group — both narrow the same list via AND, not OR. Reads a
new goal query param the same way type already works. This is the
last task of the IA restructure plan; the app now builds clean after
Tasks 5-6's intentionally-broken intermediate commits.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Full regression pass, push

**Files:** none (verification only)

- [ ] **Step 1: Full build and brand guard**

Run: `cd "D:/TA page/site/ta_production/project" && npm run check:brand && npx tsc -b && npm run build`
Expected: all three pass with zero errors/violations.

- [ ] **Step 2: Manual click-through in the Browser pane, 1440px**

Start the dev server (`npm run dev` via Bash/PowerShell in background per the `vkd-web` skill's environment note, then `preview_start({url: "http://localhost:5173"})`).

- Hover "Sản phẩm" — confirm 3 columns render (Loại sản phẩm / Đặc Sản Việt Nam / Theo mục tiêu), click one health-goal entry, confirm catalog filters to only that goal's products.
- Hover "Giới thiệu" — confirm dropdown shows only "Câu chuyện người sáng lập" (About TA absent, since `site_sections.about.visible = false` by default). Click it, confirm it still opens `FounderStory`.
- Confirm "Blog" and "Showroom" do NOT appear anywhere in the header (both default `visible = false`).
- Log into `/gate-vkd-control-2026`, open "Quản lý Trang", toggle "Về TA" to Hiện. Reload the public site, confirm "Về TA" now appears in the Giới thiệu dropdown and navigates to a working page. Toggle it back off, confirm it disappears again. Repeat once for "Blog" (top-level nav entry appears/disappears) to confirm the mechanism generalizes, then leave all 4 back at OFF (the seed state) when done.

- [ ] **Step 3: Manual click-through at 375px**

Same sweep as Step 2 via the mobile hamburger menu — confirm the About/Blog/Showroom conditional rendering works identically in the mobile nav.

- [ ] **Step 4: Confirm no unintended files are staged**

Run: `git status --short`
Expected: only `.claude/worktrees/` (pre-existing, untracked, unrelated to this plan) or nothing at all.

- [ ] **Step 5: Push**

```bash
cd "D:/TA page/site/ta_production/project"
git push origin main
```

- [ ] **Step 6: Report to Joe**

Summarize in chat: the 3-column mega-menu and health-goal filter are live; About/Blog/Showroom pages are built and reachable but hidden by default — Joe turns each on himself from `/gate-vkd-control-2026/site-sections` when it has real content; the `dac-san` product group exists with 1 real entry (Nấm Lim Xanh) and future specialty products just need one line in `productTypes.ts` to slot into the mega-menu automatically.
