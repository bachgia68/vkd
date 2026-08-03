# Hợp Nhất Catalog Sản Phẩm (Data + UI) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thay 2 nguồn dữ liệu (`vkdProducts.ts`/`trimicoProducts.ts`) + 2 trang catalog/detail + 2 route bằng 1 catalog "TA" duy nhất, điều hướng theo Dạng Sản Phẩm (7 mục), giữ AI Advisor theo Nhu Cầu/Đối Tượng như hiện có.

**Architecture:** Thêm tầng `src/data/products.ts` là nguồn vận hành (UI khách hàng đọc từ đây), sinh ra từ 2 file gốc qua script migrate một lần. 2 file gốc KHÔNG bị xoá — giữ làm tham chiếu backend đối chiếu giao hàng. Gộp 2 cặp component catalog/detail thành 1 cặp dùng chung, lọc theo `productType`.

**Tech Stack:** React 19 + TypeScript + Vite. Repo này KHÔNG có test runner (không vitest/jest trong `package.json`) — verify bằng `npm run build` (tsc + vite build), `npm run check:brand` (brand-ta-guard), và assertion script Node thuần chạy trực tiếp bằng `node` cho phần logic thuần dữ liệu (giống cách `scripts/*.js` hiện có trong repo hoạt động).

## Global Constraints

- KHÔNG hiển thị tên NCC (VKD/TRIMICO/Triết Minh) trong bất kỳ text/alt/label nào khách hàng thấy — chạy `npm run check:brand` trước khi coi mỗi task xong (xem `.claude/skills/brand-ta-guard/SKILL.md`).
- `vkdProducts.ts` và `trimicoProducts.ts` KHÔNG bị xoá ở plan này.
- `displayOnly18Plus` giữ nguyên đúng per-SKU như dữ liệu gốc — không suy luận lại theo nhóm.
- AI Advisor (`ProductAdvisor.tsx`) giữ nguyên trục `healthGoal`/`audiences` — không đổi sang `productType`.
- Spec đầy đủ: `docs/superpowers/specs/2026-08-02-unified-product-catalog-design.md`.

---

### Task 1: Định nghĩa taxonomy `productType` + type `Product` hợp nhất

**Files:**
- Create: `src/data/productTypes.ts`
- Test: `scripts/__check__/test-product-types.mjs` (assertion script, xoá sau khi verify — không phải file vĩnh viễn)

**Interfaces:**
- Produces: `ProductTypeId` (union 7 giá trị), `productTypes: ProductTypeMeta[]`, dùng bởi Task 2 (migration), Task 4 (ProductCatalog), Task 5 (ProductDetail), Task 6 (Header).

- [ ] **Step 1: Viết file taxonomy**

```ts
// src/data/productTypes.ts
export type ProductTypeId =
  | 'sam-cu-tuoi-kho'
  | 'sam-ngam-mat-ong'
  | 'tra-nuoc-uong-sam'
  | 'ruou-sam'
  | 'nam-lim-duoc-lieu'
  | 'my-pham-sam'
  | 'set-qua-tang';

export interface ProductTypeMeta {
  id: ProductTypeId;
  labelVi: string;
  labelEn: string;
  desc: string;
}

export const productTypes: ProductTypeMeta[] = [
  { id: 'sam-cu-tuoi-kho', labelVi: 'Sâm Củ Tươi & Sâm Khô', labelEn: 'Fresh & Dried Ginseng Root', desc: 'Sâm Ngọc Linh nguyên củ, lát khô, lá, hoa sâm' },
  { id: 'sam-ngam-mat-ong', labelVi: 'Sâm Ngâm Mật Ong', labelEn: 'Honey-Steeped Ginseng', desc: 'Sâm ngâm mật ong rừng nguyên chất' },
  { id: 'tra-nuoc-uong-sam', labelVi: 'Trà & Nước Uống Sâm', labelEn: 'Ginseng Tea & Drinks', desc: 'Trà túi lọc, nước uống, tinh chất PanaxX' },
  { id: 'ruou-sam', labelVi: 'Rượu Sâm', labelEn: 'Ginseng Wine', desc: 'Rượu sâm Ngọc Linh, rượu dược liệu cao cấp' },
  { id: 'nam-lim-duoc-lieu', labelVi: 'Nấm Lim Xanh & Dược Liệu', labelEn: 'Green Lim Mushroom & Herbs', desc: 'Nấm Lim Xanh, mật ong rừng, dược liệu quý' },
  { id: 'my-pham-sam', labelVi: 'Mỹ Phẩm Sâm', labelEn: 'Ginseng Cosmetics', desc: 'Collagen sâm, kem dưỡng, serum Pn’s Choice' },
  { id: 'set-qua-tang', labelVi: 'Set Quà Tặng', labelEn: 'Gift Sets', desc: 'Set quà sức khỏe cao cấp cho dịp lễ, Tết' },
];

export function getProductTypeMeta(id: ProductTypeId): ProductTypeMeta {
  const meta = productTypes.find((t) => t.id === id);
  if (!meta) throw new Error(`Unknown productType: ${id}`);
  return meta;
}
```

- [ ] **Step 2: Viết assertion script kiểm tra taxonomy hợp lệ**

```js
// scripts/__check__/test-product-types.mjs
import { productTypes } from '../../src/data/productTypes.ts';

const ids = productTypes.map((t) => t.id);
const unique = new Set(ids);
if (unique.size !== ids.length) {
  console.error('FAIL: duplicate productType id', ids);
  process.exit(1);
}
if (productTypes.length !== 7) {
  console.error(`FAIL: expected 7 productTypes, got ${productTypes.length}`);
  process.exit(1);
}
for (const t of productTypes) {
  if (!t.labelVi || !t.labelEn || !t.desc) {
    console.error('FAIL: missing label/desc on', t.id);
    process.exit(1);
  }
}
console.log('PASS: 7 unique productTypes, all labels present');
```

- [ ] **Step 3: Chạy assertion (dùng `tsx` qua `npx` vì file nguồn là `.ts`)**

Run: `npx tsx scripts/__check__/test-product-types.mjs`
Expected: `PASS: 7 unique productTypes, all labels present`

(Nếu `tsx` chưa cài, chạy `npm install -D tsx` trước — chỉ cần cho bước kiểm tra này, không phải dependency runtime.)

- [ ] **Step 4: Xoá script kiểm tra tạm, verify build**

```bash
rm scripts/__check__/test-product-types.mjs
```

Run: `npm run build`
Expected: build thành công, không lỗi TypeScript.

- [ ] **Step 5: Commit**

```bash
git add src/data/productTypes.ts
git commit -m "feat: add unified productType taxonomy (7 categories)"
```

---

### Task 2: Script migrate 93 SKU sang `products.ts` hợp nhất

**Files:**
- Create: `src/data/products.ts` (kết quả migrate — tệp dữ liệu tĩnh, KHÔNG phải re-run mỗi build)
- Create: `scripts/migrate-to-unified-products.mjs` (chạy 1 lần để sinh `products.ts`, giữ lại trong repo để tái sinh nếu 2 file gốc đổi)

**Interfaces:**
- Consumes: `VKDProduct`/`vkdProducts` từ `src/data/vkdProducts.ts`; `TrimicoProduct`/`trimicoProducts` từ `src/data/trimicoProducts.ts`; `ProductTypeId` từ Task 1.
- Produces: `Product` interface, `products: Product[]` (93 phần tử), `getProductsByType(id: ProductTypeId): Product[]`, `toCartProduct(p: Product): CartCompatibleProduct` — dùng bởi Task 4, 5.

- [ ] **Step 1: Viết script migrate với phân loại `productType` theo từ khoá + bảng ngoại lệ tay**

```js
// scripts/migrate-to-unified-products.mjs
// Chạy 1 lần: node scripts/migrate-to-unified-products.mjs
// Đọc vkdProducts.ts + trimicoProducts.ts (parse bằng regex đơn giản trên mảng
// literal — KHÔNG cần TS compiler vì cấu trúc là object literal thuần), phân
// loại productType theo từ khoá trong `name`/`slug`, xuất src/data/products.ts.
//
// Sau khi chạy, BẮT BUỘC review tay danh sách sinh ra đối chiếu bảng mapping ở
// docs/superpowers/specs/2026-08-02-unified-product-catalog-design.md mục 3 —
// từ khoá không bắt được 100% các trường hợp biên (VD tên sản phẩm không rõ
// ràng), review tay 93 dòng là khả thi.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

// Ngoại lệ tay: slug -> productType, dùng khi từ khoá không đủ để phân loại đúng.
// Điền thêm khi review Step 4 phát hiện sai.
const MANUAL_OVERRIDES = {
  // VD: 'mot-slug-dac-biet': 'set-qua-tang',
};

function classify(name, slug, fallbackHint) {
  if (MANUAL_OVERRIDES[slug]) return MANUAL_OVERRIDES[slug];
  const n = (name + ' ' + slug).toLowerCase();
  if (/mật ong|mat-ong|mat ong/.test(n) && /(ngâm|ngam|hũ|hu-gom|hu gom)/.test(n)) return 'sam-ngam-mat-ong';
  if (/rượu|ruou/.test(n)) return 'ruou-sam';
  if (/nấm lim|nam-lim|nam lim/.test(n)) return 'nam-lim-duoc-lieu';
  if (/mật ong rừng|mat-ong-rung|mat ong rung/.test(n) && !/sâm|sam/.test(n)) return 'nam-lim-duoc-lieu';
  if (/kem|serum|toner|cleanser|mặt nạ|mat-na|sữa rửa|sua-rua/.test(n)) return 'my-pham-sam';
  if (/trà|tra-|nước sâm|nuoc-sam|panaxx|tinh chất|tinh-chat|cao sâm|cao-sam|kẹo|keo-|bánh|banh-|thạch|thach-/.test(n)) return 'tra-nuoc-uong-sam';
  if (/set quà|set-qua|combo.*qua|qua-tang/.test(n)) return 'set-qua-tang';
  if (/củ|cu-|lát|lat-|lá sâm|la-sam|hoa sâm|hoa-sam|thái lát|thai-lat/.test(n)) return 'sam-cu-tuoi-kho';
  return fallbackHint;
}

// fallback theo category cũ khi từ khoá không khớp gì
const VKD_FALLBACK = {
  ginseng: 'sam-cu-tuoi-kho',
  supplements: 'tra-nuoc-uong-sam',
  tea_wine: 'tra-nuoc-uong-sam',
  cosmetics: 'my-pham-sam',
};
const TRIMICO_FALLBACK = {
  'sam-ngoc-linh': 'sam-cu-tuoi-kho',
  'nam-lim-xanh': 'nam-lim-duoc-lieu',
  ruou: 'ruou-sam',
  khac: 'nam-lim-duoc-lieu',
  'qua-tang': 'set-qua-tang',
};

function extractArrayLiteral(source, exportName) {
  const marker = `export const ${exportName}`;
  const start = source.indexOf(marker);
  if (start === -1) throw new Error(`Không tìm thấy export ${exportName}`);
  const arrStart = source.indexOf('[', start);
  let depth = 0;
  let i = arrStart;
  for (; i < source.length; i++) {
    if (source[i] === '[') depth++;
    if (source[i] === ']') {
      depth--;
      if (depth === 0) break;
    }
  }
  const literal = source.slice(arrStart, i + 1);
  // eslint-disable-next-line no-new-func
  return new Function(`return ${literal}`)();
}

const vkdSrc = fs.readFileSync(path.join(root, 'src/data/vkdProducts.ts'), 'utf-8');
const trimicoSrc = fs.readFileSync(path.join(root, 'src/data/trimicoProducts.ts'), 'utf-8');

const vkdProducts = extractArrayLiteral(vkdSrc, 'vkdProducts');
const trimicoProducts = extractArrayLiteral(trimicoSrc, 'trimicoProducts');

const healthGoalByVkdCategory = { ginseng: 'immunity', supplements: 'energy', tea_wine: 'stress', cosmetics: 'youth' };
const audiencesByVkdCategory = {
  ginseng: ['men', 'women', 'seniors', 'executives'],
  supplements: ['men', 'women', 'seniors'],
  tea_wine: ['men', 'executives'],
  cosmetics: ['women'],
};
const familySafeSlugs = new Set(['banh-sam-ngoc-linh-panaxx-cookie', 'tra-sam-ngoc-linh']);

const unified = [];

for (const p of vkdProducts) {
  const productType = classify(p.name, p.slug, VKD_FALLBACK[p.category]);
  unified.push({
    sku: p.sku,
    supplierId: 'vkd',
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.image,
    productType,
    healthGoal: healthGoalByVkdCategory[p.category],
    audiences: familySafeSlugs.has(p.slug)
      ? [...audiencesByVkdCategory[p.category], 'family']
      : audiencesByVkdCategory[p.category],
    familySafe: familySafeSlugs.has(p.slug),
    giftEligible: productType === 'set-qua-tang',
    badge: p.badge ?? undefined,
    activeIngredient: p.activeIngredient,
    description: p.description,
    ingredients: p.ingredients,
    volume: p.volume,
    warnings: p.warnings,
    sourceUrl: p.sourceUrl,
  });
}

for (const p of trimicoProducts) {
  const productType = classify(p.name, p.slug, TRIMICO_FALLBACK[p.category]);
  unified.push({
    sku: p.sku,
    supplierId: 'trimico',
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.image,
    productType,
    healthGoal: p.healthGoal,
    audiences: p.audiences,
    familySafe: p.familySafe,
    displayOnly18Plus: p.displayOnly18Plus,
    giftEligible: productType === 'set-qua-tang',
    badge: p.badge ?? undefined,
    description: p.description,
    ingredients: p.ingredients,
    volume: p.volume,
    warnings: p.warnings,
    targetUsers: p.targetUsers,
    sourceUrl: p.sourceUrl,
  });
}

const header = `// Sinh tự động bởi scripts/migrate-to-unified-products.mjs từ vkdProducts.ts +
// trimicoProducts.ts — nguồn dữ liệu VẬN HÀNH (UI khách hàng đọc từ đây).
// 2 file gốc KHÔNG bị xoá, dùng cho admin đối chiếu giao hàng theo NCC.
// Nếu sửa productType/giftEligible thủ công sau khi sinh, sửa TRỰC TIẾP trong
// file này (không chạy lại script trừ khi 2 file gốc có SKU mới).

import type { HealthGoal, TargetAudience } from './mockData';
import type { ProductTypeId } from './productTypes';

export type SupplierId = 'vkd' | 'trimico';

export interface Product {
  sku: string;
  supplierId: SupplierId;
  slug: string;
  name: string;
  price: number | null;
  image: string;
  productType: ProductTypeId;
  healthGoal: HealthGoal;
  audiences: TargetAudience[];
  familySafe: boolean;
  displayOnly18Plus?: boolean;
  giftEligible?: boolean;
  badge?: string;
  activeIngredient?: string;
  description: string;
  ingredients?: string;
  usage?: string;
  targetUsers?: string;
  warnings?: string;
  volume?: string;
  sourceUrl: string;
}

export const products: Product[] = ${JSON.stringify(unified, null, 2)};
`;

fs.writeFileSync(path.join(root, 'src/data/products.ts'), header, 'utf-8');
console.log(`Đã sinh src/data/products.ts với ${unified.length} sản phẩm.`);
const byType = {};
for (const p of unified) byType[p.productType] = (byType[p.productType] ?? 0) + 1;
console.log('Phân bố theo productType:', byType);
```

- [ ] **Step 2: Chạy migrate**

Run: `node scripts/migrate-to-unified-products.mjs`
Expected: in ra `Đã sinh src/data/products.ts với 93 sản phẩm.` + bảng phân bố theo `productType`.

- [ ] **Step 3: Review tay danh sách sinh ra**

Mở `src/data/products.ts`, đối chiếu từng nhóm `productType` với bảng mapping ở
spec mục 3. Với SKU bị phân loại sai (VD từ khoá không bắt được), thêm slug đó
vào `MANUAL_OVERRIDES` trong script, chạy lại Step 2. Lặp tới khi review tay
thấy hợp lý (không cần 100% hoàn hảo ngay — sai lệch nhỏ sửa được sau qua
việc sửa trực tiếp trong `products.ts`, vì file này không tự sinh lại mỗi build).

- [ ] **Step 4: Thêm hàm tiện ích đọc theo `productType` + convert cart**

Thêm vào cuối `src/data/products.ts` (sau khối `export const products`):

```ts
export function getProductsByType(id: ProductTypeId): Product[] {
  return products.filter((p) => p.productType === id);
}

const VND_PER_USD = 25000;

export interface CartCompatibleProduct {
  id: string;
  name: string;
  nameVi: string;
  category: string;
  healthGoal: HealthGoal;
  audiences: TargetAudience[];
  priceUSD: number;
  priceVND: number;
  priceJPY: number;
  priceCNY: number;
  priceEUR: number;
  activeIngredient: string;
  description: string;
  descriptionVi: string;
  image: string;
  badge: string;
  rating: number;
  reviews: number;
  familySafe?: boolean;
}

export function toCartProduct(p: Product): CartCompatibleProduct {
  const price = p.price ?? 0;
  const priceUSD = Math.round((price / VND_PER_USD) * 100) / 100;
  return {
    id: p.sku,
    name: p.name,
    nameVi: p.name,
    category: p.productType,
    healthGoal: p.healthGoal,
    audiences: p.audiences,
    priceUSD,
    priceVND: price,
    priceJPY: Math.round(priceUSD * 150),
    priceCNY: Math.round(priceUSD * 7.2 * 100) / 100,
    priceEUR: Math.round(priceUSD * 0.93 * 100) / 100,
    activeIngredient: p.activeIngredient ?? '',
    description: p.description,
    descriptionVi: p.description,
    image: p.image,
    badge: p.badge ?? '',
    rating: 0,
    reviews: 0,
    familySafe: p.familySafe,
  };
}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: build thành công. Nếu lỗi type (VD field thiếu do 1 trong 2 nguồn không có `usage`/`targetUsers`), sửa interface `Product` cho field đó thành optional — đã optional sẵn ở Step 1, nên lỗi khả năng là do dữ liệu `undefined` bị `JSON.stringify` bỏ qua (bình thường, không phải lỗi).

- [ ] **Step 6: Commit**

```bash
git add scripts/migrate-to-unified-products.mjs src/data/products.ts
git commit -m "feat: migrate vkdProducts + trimicoProducts into unified products.ts (93 SKU)"
```

---

### Task 3: Cập nhật `ProductAdvisor.tsx` đọc từ `products.ts`

**Files:**
- Modify: `src/components/ProductAdvisor.tsx`

**Interfaces:**
- Consumes: `products`, `toCartProduct` từ `src/data/products.ts` (Task 2) thay cho `vkdProducts`/`trimicoProducts`.

- [ ] **Step 1: Thay import nguồn dữ liệu**

Tìm trong `src/components/ProductAdvisor.tsx`:

```ts
import { vkdProducts, toCartProduct } from '../data/vkdProducts';
import { trimicoProducts, toTrimicoCartProduct } from '../data/trimicoProducts';
```

Thay bằng:

```ts
import { products, toCartProduct } from '../data/products';
```

- [ ] **Step 2: Cập nhật mọi chỗ dùng `vkdProducts`/`trimicoProducts`/`toTrimicoCartProduct` trong file**

Đọc toàn bộ `ProductAdvisor.tsx`, thay các đoạn duyệt/gộp 2 mảng (VD
`[...vkdProducts, ...trimicoProducts]` hoặc gọi riêng từng mảng) bằng biến
`products` duy nhất; thay `toTrimicoCartProduct(p)` bằng `toCartProduct(p)`
(đã hợp nhất 1 hàm ở Task 2 Step 4). Giữ nguyên toàn bộ logic lọc theo
`healthGoal`/`audiences`/`familySafe`/`displayOnly18Plus` — không đổi.

- [ ] **Step 3: Cập nhật `onNavigate` cho route chi tiết sản phẩm**

Tìm dòng (đã thấy ở phiên trước):

```ts
onNavigate(match.id.startsWith('TRM-') ? 'trimico-catalog' : 'catalog');
```

Thay bằng (route hợp nhất, xem Task 6):

```ts
onNavigate('catalog');
```

- [ ] **Step 4: Verify build + chạy brand guard**

Run: `npm run build && npm run check:brand`
Expected: build thành công, guard báo `✅ Brand Guard: không tìm thấy tên NCC nào...`.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProductAdvisor.tsx
git commit -m "refactor: ProductAdvisor reads from unified products.ts"
```

---

### Task 4: Gộp `VKDProductCatalog.tsx` + `TrimicoProductCatalog.tsx` → `ProductCatalog.tsx`

**Files:**
- Create: `src/components/ProductCatalog.tsx` (dựa trên `VKDProductCatalog.tsx`, đổi trục lọc)
- Delete (ở Task 8, không xoá ở task này — giữ song song để so sánh cho tới khi route đổi xong): giữ nguyên `VKDProductCatalog.tsx`/`TrimicoProductCatalog.tsx` tạm thời

**Interfaces:**
- Consumes: `products`, `getProductsByType`, `toCartProduct` từ `src/data/products.ts` (Task 2); `productTypes`, `getProductTypeMeta` từ `src/data/productTypes.ts` (Task 1).
- Produces: `export default function ProductCatalog({ lang, onNavigate }: { lang: Language; onNavigate: (page: string, slug?: string) => void })` — dùng bởi Task 7 (App.tsx).

- [ ] **Step 1: Tạo file mới bằng cách copy `VKDProductCatalog.tsx` sang `ProductCatalog.tsx`**

```bash
cp "src/components/VKDProductCatalog.tsx" "src/components/ProductCatalog.tsx"
```

- [ ] **Step 2: Thay import dữ liệu**

Trong `src/components/ProductCatalog.tsx`, tìm:

```ts
import {
  vkdProducts,
  categories,
  formatVND,
  toCartProduct,
  getLocalizedProduct,
  getLocalizedCategory,
  type VKDProduct,
  type Category,
  type CategoryId,
} from '../data/vkdProducts';
```

Thay bằng:

```ts
import { products, toCartProduct, type Product } from '../data/products';
import { productTypes, type ProductTypeId, type ProductTypeMeta } from '../data/productTypes';

function formatVND(n: number | null): string {
  if (n === null) return 'Liên hệ';
  return n.toLocaleString('vi-VN') + '₫';
}
```

(Bỏ `getLocalizedProduct`/`getLocalizedCategory` — dữ liệu hợp nhất chỉ có 1
ngôn ngữ mô tả gốc tiếng Việt ở bản đầu, giống cách `trimicoProducts.ts` vốn
không có bản dịch riêng. Không phải regression — Trimico trước đó cũng chưa
dịch.)

- [ ] **Step 3: Thay icon map theo `productType`**

Tìm:

```ts
const categoryIcons: Record<CategoryId, typeof Leaf> = {
  ginseng: Leaf,
  supplements: FlaskConical,
  tea_wine: Wine,
  cosmetics: Sparkles,
};
```

Thay bằng (thêm import `Gift`, `Sprout` từ `lucide-react` ở đầu file):

```ts
const productTypeIcons: Record<ProductTypeId, typeof Leaf> = {
  'sam-cu-tuoi-kho': Leaf,
  'sam-ngam-mat-ong': Sprout,
  'tra-nuoc-uong-sam': FlaskConical,
  'ruou-sam': Wine,
  'nam-lim-duoc-lieu': Leaf,
  'my-pham-sam': Sparkles,
  'set-qua-tang': Gift,
};
```

- [ ] **Step 4: Thay state + logic lọc**

Tìm:

```ts
const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
```

Thay bằng:

```ts
const [activeType, setActiveType] = useState<ProductTypeId | 'all'>('all');
```

Tìm khối `filtered = useMemo(...)`:

```ts
const filtered = useMemo(() => {
  let list = localizedProducts.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (query.trim() && !p.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });
  ...
```

Thay bằng:

```ts
const filtered = useMemo(() => {
  let list = products.filter((p) => {
    if (activeType !== 'all' && p.productType !== activeType) return false;
    if (query.trim() && !p.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  if (sortBy === 'price-asc') {
    list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  } else if (sortBy === 'price-desc') {
    list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  }
  return list;
}, [activeType, query, sortBy]);

const countByType = (id: ProductTypeId) => products.filter((p) => p.productType === id).length;
```

Xoá 2 khối `localizedProducts`/`localizedCategories` (không còn cần —
đã bỏ localize ở Step 2), và xoá hàm `countByCategory` cũ.

- [ ] **Step 5: Thay sidebar danh mục dùng `productTypes`/`activeType` thay `categories`/`activeCategory`**

Trong JSX sidebar (khối render `localizedCategories.map(...)` hoặc
`categories.map(...)`), đổi:
- `categories.map((c) => ...)` → `productTypes.map((t) => ...)`
- `c.id` → `t.id`, `c.label` → `t.labelVi` (hoặc `t.labelEn` theo `lang`)
- `setActiveCategory(c.id)` → `setActiveType(t.id)`
- `categoryIcons[c.id]` → `productTypeIcons[t.id]`
- `countByCategory(c.id)` → `countByType(t.id)`

Toàn bộ className/layout giữ nguyên — chỉ đổi biến/nguồn dữ liệu, không đổi
cấu trúc HTML.

- [ ] **Step 6: Thay phần render giá trong grid sản phẩm**

Tìm chỗ render giá (dùng `formatVND(product.price)` — đã tương thích vì Step
2 định nghĩa lại `formatVND` nhận `number | null`). Nếu code cũ gọi
`toCartProduct(product)` trên `VKDProduct`, không đổi gì thêm vì `Product` mới
cũng có đủ field `toCartProduct` cần.

Với sản phẩm `price === null` (trước đây chỉ Trimico có, giờ có thể ở cả 2
nguồn), thêm điều kiện ẩn nút "Thêm giỏ hàng" và hiện "Liên hệ" — copy đúng
logic đã có sẵn trong `TrimicoProductCatalog.tsx` (tìm khối kiểm tra
`product.price == null` trong file đó và áp dụng tương tự vào
`ProductCatalog.tsx`).

- [ ] **Step 7: Đổi `id` section**

Tìm `id="vkd-catalog"` → đổi thành `id="catalog"`.

- [ ] **Step 8: Verify build**

Run: `npm run build`
Expected: build thành công (chưa route tới component này — verify bằng
type-check qua `tsc`, chưa cần chạy trên trình duyệt ở task này).

- [ ] **Step 9: Commit**

```bash
git add src/components/ProductCatalog.tsx
git commit -m "feat: add unified ProductCatalog component (productType-based)"
```

---

### Task 5: Gộp `VKDProductDetail.tsx` + `TrimicoProductDetail.tsx` → `ProductDetail.tsx`

**Files:**
- Create: `src/components/ProductDetail.tsx`

**Interfaces:**
- Consumes: `products`, `toCartProduct` từ `src/data/products.ts`.
- Produces: `export default function ProductDetail({ lang, slug, onNavigate }: { lang: Language; slug: string; onNavigate: (page: string, slug?: string) => void })` — dùng bởi Task 7.

- [ ] **Step 1: Copy file nền từ `TrimicoProductDetail.tsx`**

TrimicoProductDetail đã xử lý sẵn cả 2 case khó (`displayOnly18Plus` +
`price === null`/"Liên hệ") mà `VKDProductDetail.tsx` không có — dùng nó làm
nền để không mất logic đó.

```bash
cp "src/components/TrimicoProductDetail.tsx" "src/components/ProductDetail.tsx"
```

- [ ] **Step 2: Thay import dữ liệu**

Tìm import từ `../data/trimicoProducts`, thay bằng:

```ts
import { products, toCartProduct, type Product } from '../data/products';
```

Thay mọi chỗ dùng kiểu `TrimicoProduct` → `Product`, và chỗ tìm sản phẩm theo
slug (`trimicoProducts.find(...)`) → `products.find((p) => p.slug === slug)`.

- [ ] **Step 3: Cập nhật các `onNavigate('trimico-catalog')` → `onNavigate('catalog')`**

Đã có 2 chỗ sửa nội dung text trong phiên trước (hotline, CTA cuối trang) —
giờ sửa thêm phần điều hướng route, tìm toàn bộ `onNavigate('trimico-catalog')`
trong file, thay bằng `onNavigate('catalog')`.

- [ ] **Step 4: Kiểm tra field không tồn tại ở sản phẩm gốc VKD**

`TrimicoProductDetail.tsx` gốc dùng field `usage`/`targetUsers` (Trimico có,
VKD không). Với `Product` hợp nhất các field này là optional — thêm fallback
khi render, VD:

```tsx
{product.usage && (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-forest-800 mb-2">Cách dùng</h3>
    <p className="text-sm text-forest-600">{product.usage}</p>
  </div>
)}
```

(bọc mọi block render field optional bằng điều kiện `{product.field && (...)}`
— rà toàn file tìm các field optional và áp dụng).

- [ ] **Step 5: Verify build + brand guard**

Run: `npm run build && npm run check:brand`
Expected: build thành công, guard sạch.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProductDetail.tsx
git commit -m "feat: add unified ProductDetail component"
```

---

### Task 6: Header mega-menu theo 7 `productType` + mục "Set Quà Tặng" riêng

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/i18n/translations.ts` (bỏ field `trimico` đã xoá ở phiên trước — không đổi gì thêm ở đây, chỉ xác nhận không cần field mới vì dùng `productTypes` labels trực tiếp)

**Interfaces:**
- Consumes: `productTypes` từ `src/data/productTypes.ts` (Task 1).

- [ ] **Step 1: Thêm state điều khiển dropdown**

Trong `src/components/Header.tsx`, sau dòng `const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);`, thêm:

```ts
const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
```

- [ ] **Step 2: Import `productTypes`**

Thêm ở đầu file:

```ts
import { productTypes } from '../data/productTypes';
```

- [ ] **Step 3: Sửa `navItems` — tách "Set Quà Tặng" thành mục riêng, "products" giữ nguyên nhưng render dropdown**

Tìm:

```ts
const navItems = [
  { key: 'home', href: 'home' },
  { key: 'about', href: 'about' },
  { key: 'products', href: 'catalog' },
  { key: 'research', href: 'research' },
  { key: 'traceability', href: 'traceability' },
  { key: 'b2b', href: 'b2b' },
  { key: 'autoship', href: 'autoship' },
];
```

Thay bằng:

```ts
const navItems = [
  { key: 'home', href: 'home' },
  { key: 'about', href: 'about' },
  { key: 'products', href: 'catalog' }, // render dropdown riêng, xem Step 4
  { key: 'giftSets', href: 'catalog?type=set-qua-tang' },
  { key: 'research', href: 'research' },
  { key: 'traceability', href: 'traceability' },
  { key: 'b2b', href: 'b2b' },
  { key: 'autoship', href: 'autoship' },
];
```

Thêm nhãn `giftSets` vào `translations.ts` cho cả 5 ngôn ngữ (theo đúng cấu
trúc `nav.products` hiện có — tìm `products: 'Sản phẩm',` trong mỗi khối ngôn
ngữ, thêm ngay dưới `giftSets: 'Set Quà Tặng',`, và tương ứng bản dịch cho
en/zh/fr/ar; interface `nav` ở đầu file cũng thêm `giftSets: string;`).

- [ ] **Step 4: Render dropdown cho mục "products" trong desktop nav**

Tìm khối render desktop nav (map qua `navItems`, khoảng dòng 80-95 theo file
gốc đã đọc). Với item có `key === 'products'`, bọc thêm dropdown:

```tsx
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
          useLightText ? 'text-cream-50' : 'text-forest-800'
        }`}
      >
        {t.nav.products}
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {isProductMenuOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-cream-50 rounded-2xl shadow-elegant-lg border border-cream-200 py-3 z-50">
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
      )}
    </div>
  ) : (
    <button
      key={item.key}
      onClick={() => handleNav(item.href)}
      className={`nav-link text-sm font-medium tracking-wide ${
        useLightText ? 'text-cream-50' : 'text-forest-800'
      }`}
    >
      {t.nav[item.key as keyof typeof t.nav] || item.key}
    </button>
  )
)}
```

(Đây thay thế đoạn render `navItems.map(...)` gốc — giữ nguyên className cho
nhánh `else`, chỉ thêm nhánh `if (item.key === 'products')`.)

- [ ] **Step 5: `onNavigate` cần đọc query string `?type=`**

`App.tsx` (Task 7) sẽ xử lý `page` dạng `catalog?type=xxx` — Header chỉ cần
truyền chuỗi này nguyên vẹn qua `onNavigate`, không parse ở Header.

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: build thành công.

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.tsx src/i18n/translations.ts
git commit -m "feat: header product dropdown (7 productType) + separate gift-sets nav item"
```

---

### Task 7: Cập nhật `App.tsx` — 1 route catalog/detail, xoá route Trimico riêng

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `ProductCatalog` (Task 4), `ProductDetail` (Task 5).

- [ ] **Step 1: Xoá import 4 component cũ + `TrimicoTeaser`, thêm 2 component mới**

Tìm:

```ts
import VKDProductCatalog from './components/VKDProductCatalog';
import VKDProductDetail from './components/VKDProductDetail';
import TrimicoProductCatalog from './components/TrimicoProductCatalog';
import TrimicoProductDetail from './components/TrimicoProductDetail';
import TrimicoTeaser from './components/TrimicoTeaser';
```

Thay bằng:

```ts
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
```

- [ ] **Step 2: Sửa `Page` type — bỏ route Trimico riêng**

Tìm:

```ts
type Page =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'trimico-catalog'
  | 'trimico-product-detail'
  | 'research'
  | 'checkout'
  | 'order-success'
  | 'loyalty'
  | 'autoship'
  | 'trace';
```

Thay bằng:

```ts
type Page =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'research'
  | 'checkout'
  | 'order-success'
  | 'loyalty'
  | 'autoship'
  | 'trace';
```

- [ ] **Step 3: Xử lý `currentPage` dạng `catalog?type=xxx`**

`onNavigate` hiện set thẳng `currentPage` bằng chuỗi truyền vào (`setCurrentPage`
nhận `Page`, cần nới kiểu vì giờ có query string). Đổi khai báo state:

```ts
const [currentPage, setCurrentPage] = useState<string>('home');
```

Thêm hàm tách `type` ngay trước khối `return`:

```ts
const [basePage, queryString] = currentPage.split('?');
const catalogType = new URLSearchParams(queryString).get('type') ?? undefined;
```

- [ ] **Step 4: Sửa 2 khối render catalog**

Tìm:

```tsx
{currentPage === 'catalog' && (
  <VKDProductCatalog lang={lang} onNavigate={handleNavigate} />
)}
```

và khối `trimico-catalog` tương tự — xoá khối `trimico-catalog`, thay khối
`catalog` bằng:

```tsx
{basePage === 'catalog' && (
  <ProductCatalog lang={lang} onNavigate={handleNavigate} initialType={catalogType} />
)}
```

(Task 4 cần bổ sung prop `initialType?: string` vào `ProductCatalog` — quay
lại Task 4, thêm vào interface props và dùng làm giá trị khởi tạo cho
`activeType` thay vì hard-code `'all'`: `useState<ProductTypeId | 'all'>((initialType as ProductTypeId) ?? 'all')`.)

Tương tự sửa 2 khối `product-detail`/`trimico-product-detail` thành 1 khối
dùng `basePage === 'product-detail'` + `<ProductDetail ... />`.

- [ ] **Step 5: Cập nhật mọi `onNavigate('trimico-...')` còn sót trong `App.tsx`**

Grep toàn file tìm `trimico`, xoá/thay các route reference còn sót (nếu có ở
khối xử lý `payos_return` hoặc nơi khác).

- [ ] **Step 6: Xoá `<TrimicoTeaser />` khỏi trang chủ**

Tìm chỗ render `<TrimicoTeaser ... />` trong khối `home`, xoá dòng đó.

- [ ] **Step 7: Verify build + chạy dev server kiểm tra thủ công**

Run: `npm run build`
Expected: build thành công.

Sau đó mở dev server (`npm run dev` qua `preview_start`), điều hướng:
menu "Sản Phẩm" → chọn 1 mục trong dropdown → xác nhận trang catalog lọc đúng
`productType`; bấm "Set Quà Tặng" ở nav → xác nhận lọc đúng nhóm đó; bấm vào 1
sản phẩm → trang chi tiết mở đúng, nút giỏ hàng hoạt động.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx
git commit -m "feat: unify catalog/detail routing, remove Trimico-specific routes"
```

---

### Task 8: Dọn component cũ + xoá `TrimicoTeaser.tsx`

**Files:**
- Delete: `src/components/VKDProductCatalog.tsx`, `src/components/VKDProductDetail.tsx`, `src/components/TrimicoProductCatalog.tsx`, `src/components/TrimicoProductDetail.tsx`, `src/components/TrimicoTeaser.tsx`

- [ ] **Step 1: Xác nhận không còn import nào tới 5 file này**

Run: `grep -rn "VKDProductCatalog\|VKDProductDetail\|TrimicoProductCatalog\|TrimicoProductDetail\|TrimicoTeaser" src/`
Expected: không có kết quả nào ngoài chính 5 file sắp xoá.

- [ ] **Step 2: Xoá file**

```bash
rm src/components/VKDProductCatalog.tsx src/components/VKDProductDetail.tsx src/components/TrimicoProductCatalog.tsx src/components/TrimicoProductDetail.tsx src/components/TrimicoTeaser.tsx
```

- [ ] **Step 3: Verify build + brand guard**

Run: `npm run build && npm run check:brand`
Expected: build thành công, guard sạch.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove superseded VKD/Trimico-specific catalog components"
```

---

### Task 9: Ô tìm kiếm — gợi ý "Đang Thịnh Hành" / "Sản Phẩm Phổ Biến"

**Files:**
- Modify: `src/components/ProductCatalog.tsx`

- [ ] **Step 1: Thêm hằng số chip thịnh hành + state focus**

Ở đầu component, sau khai báo state hiện có, thêm:

```ts
const TRENDING_QUERIES = ['sâm ngâm mật ong', 'nước hồng sâm', 'quà tết', 'mỹ phẩm sâm', 'rượu sâm'];
const [isSearchFocused, setIsSearchFocused] = useState(false);
const popularProducts = useMemo(
  () => products.filter((p) => p.badge?.toLowerCase().includes('bán chạy')).slice(0, 4),
  []
);
```

- [ ] **Step 2: Thêm `onFocus`/`onBlur` vào input search hiện có**

Tìm ô input search (Step trước đã xác định ở dòng ~260 file gốc):

```tsx
<input
  type="text"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder={ui.searchPlaceholder}
  className="..."
/>
```

Thêm 2 prop:

```tsx
<input
  type="text"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onFocus={() => setIsSearchFocused(true)}
  onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
  placeholder={ui.searchPlaceholder}
  className="..."
/>
```

(`setTimeout` 150ms để click vào chip/gợi ý kịp đăng ký trước khi overlay ẩn.)

- [ ] **Step 3: Render overlay ngay sau khối `<div className="relative flex-1">...</div>` bọc ô search**

```tsx
{isSearchFocused && query.trim() === '' && (
  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-elegant-lg border border-cream-200 p-5 z-40">
    <p className="text-xs font-semibold uppercase tracking-wider text-forest-500 mb-3">
      Đang Thịnh Hành
    </p>
    <div className="flex flex-wrap gap-2 mb-5">
      {TRENDING_QUERIES.map((q) => (
        <button
          key={q}
          onMouseDown={() => setQuery(q)}
          className="px-3 py-1.5 rounded-full bg-cream-100 text-xs text-forest-700 hover:bg-gold-100 transition-colors"
        >
          {q}
        </button>
      ))}
    </div>
    {popularProducts.length > 0 && (
      <>
        <p className="text-xs font-semibold uppercase tracking-wider text-forest-500 mb-3">
          Sản Phẩm Phổ Biến
        </p>
        <div className="grid grid-cols-2 gap-3">
          {popularProducts.map((p) => (
            <button
              key={p.sku}
              onMouseDown={() => onNavigate('product-detail', p.slug)}
              className="flex items-center gap-2 text-left"
            >
              <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-xs text-forest-700 line-clamp-2">{p.name}</span>
            </button>
          ))}
        </div>
      </>
    )}
  </div>
)}
```

(Dùng `onMouseDown` thay `onClick` vì `onBlur` của input bắn trước `onClick`
— `onMouseDown` bắn trước `onBlur`, tránh việc overlay đóng trước khi bắt
được thao tác bấm.)

- [ ] **Step 4: Đảm bảo `<div className="relative flex-1">` không bị `overflow: hidden` cắt overlay**

Kiểm tra parent container (`className="flex flex-col md:flex-row gap-4 mb-10..."`)
không có `overflow-hidden` — nếu có, xoá vì sẽ cắt mất overlay dropdown.

- [ ] **Step 5: Verify trên trình duyệt**

Mở dev server, vào trang catalog, bấm vào ô search (chưa gõ gì) → xác nhận
overlay hiện đúng 2 khối. Gõ chữ → overlay biến mất, danh sách sản phẩm lọc
theo từ khoá như cũ.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProductCatalog.tsx
git commit -m "feat: trending/popular suggestions on catalog search focus"
```

---

## Self-Review Notes (đã chạy khi viết plan)

- **Spec coverage:** mục 1 (bối cảnh) → Task 2; mục 2/2b (data model, AI Advisor giữ trục) → Task 1-3; mục 3 (taxonomy mapping) → Task 1-2; mục 4 (routing/component) → Task 4-8; mục 5 (search gợi ý) → Task 9. Mục 3b (Set Quà Tặng 2 luồng, admin+customer) và mục 6 (Admin export module) **KHÔNG nằm trong plan này** — đây là 2 subsystem đủ độc lập (cần kiến trúc runtime-store riêng, cần `CartContext` mở rộng riêng) nên tách thành 2 plan kế tiếp, viết sau khi plan này chạy xong và `products.ts` đã tồn tại ổn định (2 plan sau phụ thuộc trực tiếp vào `products.ts`).
- **Placeholder scan:** không còn "TBD"/"tương tự Task N không kèm code" — Task 4/5 có vài chỗ mô tả "áp dụng tương tự" khi thao tác là tìm-thay lặp lại nhiều vị trí giống nhau trong cùng 1 file (không phải chỗ khác biệt cần code riêng) — chấp nhận được vì bước trước đó đã cho code mẫu đủ để nhận diện pattern.
- **Type consistency:** `Product`, `ProductTypeId`, `toCartProduct`, `getProductsByType` dùng nhất quán tên/chữ ký xuyên suốt Task 2-9.

## Sau plan này

Viết tiếp 2 plan riêng (không nằm trong phạm vi plan này):
1. **Set Quà Tặng — Admin tạo sẵn + Khách tự tạo** (spec mục 3b): cần
   `RuntimeProductsContext` chia sẻ giữa admin và storefront, `GiftSetsPage`
   trong admin, `CustomGiftSetCartItem` mở rộng `CartContext`.
2. **Admin Module Xuất Excel/Catalog** (spec mục 6): `CatalogExportPage` mới
   trong admin, đọc `products.ts` + 2 file gốc, xuất `.xlsx`/`.pdf` client-side.
