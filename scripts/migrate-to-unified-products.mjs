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
  // VKD: "cao sâm" test khớp regex tra-nuoc-uong-sam trước "củ" — đúng ý muốn
  // (cao/chiết xuất dạng cô đặc pha nước, không phải củ tươi/khô) nên không cần override.

  // VKD-028 "Men Kim Bôi" — men rượu (dùng để ủ/nấu rượu), category gốc
  // 'tea_wine' nhưng không khớp keyword nào của classify() nên rơi vào fallback
  // sai (tra-nuoc-uong-sam). Đây là phụ liệu làm rượu, không phải trà/nước
  // uống — ép về đúng nhóm rượu.
  'men-kim-boi': 'ruou-sam',

  // Trimico sam-ngoc-linh nhóm ngâm mật ong: chứa "hũ gốm"/"hộp gỗ" không khớp
  // regex mật-ong+ngâm mặc định (thiếu từ "ngâm"/"hũ" sát nghĩa) → ép tay cho chắc.
  'sam-ngoc-linh-ngam-mat-ong-trimico-90ml': 'sam-ngam-mat-ong',
  'sam-ngoc-linh-ngam-mat-ong-trimico-175ml': 'sam-ngam-mat-ong',
  'sam-ngoc-linh-ngam-mat-ong-trimico-lo-30ml': 'sam-ngam-mat-ong',
  'sam-ngoc-linh-ngam-mat-ong-hu-gom-300ml': 'sam-ngam-mat-ong',
  'sam-ngoc-linh-ngam-mat-ong-hu-gom-500ml': 'sam-ngam-mat-ong',
  'sam-ngoc-linh-ngam-mat-ong-500ml': 'sam-ngam-mat-ong',

  // Trimico "Sangoli Crackers" (bánh mầm gạo lứt sâm) — không phải trà/nước
  // uống nhưng gần nhất với nhóm "Trà & Nước Uống Sâm" (thực phẩm ăn nhẹ bổ
  // sung sâm dạng đóng gói, giống bánh/kẹo sâm bên VKD).
  'sangoli-crackers-banh-mam-gao-lut-sam-ngoc-linh': 'tra-nuoc-uong-sam',

  // Trimico "Thạch Sâm Ngọc Linh" — thạch ăn liền, xếp cùng nhóm trà/nước uống
  // sâm (đồ ăn nhẹ tiện lợi bổ sung sâm) theo mapping "kẹo/bánh/thạch" ở spec.
  'thach-sam-ngoc-linh-trimico': 'tra-nuoc-uong-sam',

  // Trimico "Hoa/Lá Sâm Ngọc Linh tươi/khô" — thuộc nhóm Sâm Củ Tươi & Sâm Khô
  // theo đúng mapping spec mục 3 ("phần củ/lá/hoa"); từ khoá "lá sâm"/"hoa sâm"
  // trong classify() đã bắt đúng, không cần override — giữ comment để review dễ đối chiếu.

  // Trimico "khac" — Ba Kích Tím / Hồng Đẳng Sâm / Tiêu Tiên Phước / Chuối Hột
  // Rừng / KaKun Khô không chứa từ khoá dược liệu/nấm lim rõ ràng → dùng
  // TRIMICO_FALLBACK theo category 'khac' -> 'nam-lim-duoc-lieu' (đã đúng theo
  // mapping spec "Trimico khac" gộp vào "Nấm Lim Xanh & Dược Liệu"), không cần override riêng.
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
  // Tìm dấu '=' đầu tiên sau marker rồi mới tìm '[' — tránh nhầm với dấu '['
  // trong type annotation kiểu `export const foo: Bar[] = [...]`.
  const eqIdx = source.indexOf('=', start);
  const arrStart = source.indexOf('[', eqIdx);
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
  // Các object literal dùng template string tham chiếu `IMG`/`SRC` khai báo ở
  // module scope phía trên (VD `image: \`${IMG}01-...\``) — trích các hằng số
  // string đơn giản đó ra để bơm vào scope khi eval, tránh ReferenceError.
  const constDefs = [...source.matchAll(/^const (\w+) = ('.*?'|".*?");/gm)];
  const constNames = constDefs.map(([, name]) => name);
  const constValues = constDefs.map(([, , value]) => new Function(`return ${value}`)());
  // eslint-disable-next-line no-new-func
  const fn = new Function(...constNames, `return ${literal}`);
  return fn(...constValues);
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
    usage: p.usage,
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
`;

fs.writeFileSync(path.join(root, 'src/data/products.ts'), header, 'utf-8');
console.log(`Đã sinh src/data/products.ts với ${unified.length} sản phẩm.`);
const byType = {};
for (const p of unified) byType[p.productType] = (byType[p.productType] ?? 0) + 1;
console.log('Phân bố theo productType:', byType);
