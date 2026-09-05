// Chèn 55 sản phẩm thật đã cào (2026-09-05) từ tasks/phase11_scraped_products.json
// vào src/data/products.ts. Chạy 1 lần, không idempotent — nếu cần chạy lại
// phải revert products.ts trước (git checkout).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const jsonPath = path.join(root, 'tasks', 'phase11_scraped_products.json');
const productsPath = path.join(root, 'src', 'data', 'products.ts');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

function slugify(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const ALCOHOL_TYPES = new Set(['ruou-sam']);

// Branded House: khách hàng chỉ thấy thương hiệu "TA" — xoá tên NCC khỏi mọi
// field hiển thị (name/description/ingredients/usage/warnings). sourceUrl/image
// vẫn giữ nguyên domain thật (identifier nội bộ, được phép qua supplier-guard-allow).
const BRAND_LEAK_PATTERNS = [
  /\bSamtramy\b/gi,
  /\bTumorong\b/gi,
  /\bTum[ơo]r[ôo]ng\b/gi,
  /\bAtuagin\b/gi,
  /\bKhánh\s*Thành\b/gi,
  /\bKhanh\s*Thanh\b/gi,
];

function stripBrand(text) {
  if (!text) return text;
  let out = text;
  for (const p of BRAND_LEAK_PATTERNS) out = out.replace(p, '').trim();
  return out
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;)])/g, '$1')
    .replace(/\(\s*\)/g, '')
    .replace(/^[-–\s]+|[-–\s]+$/g, '')
    .trim();
}

function buildEntry(supplierId, prefix, seq, item) {
  const sku = `${prefix}-${String(seq).padStart(3, '0')}`;
  const isAlcohol = ALCOHOL_TYPES.has(item.suggested_productType) || item.displayOnly18Plus;
  const isYen = /yến/i.test(item.name_vi);
  const entry = {
    sku,
    supplierId,
    category: isYen ? 'to-yen' : 'sam-ngoc-linh',
    slug: slugify(stripBrand(item.name_vi)) + '-' + prefix.toLowerCase() + seq,
    name: stripBrand(item.name_vi),
    price: item.price_vnd ?? null,
    image: item.image_url,
    productType: item.suggested_productType,
    healthGoal: 'immunity',
    audiences: isAlcohol ? ['men', 'executives'] : ['family'],
    familySafe: !isAlcohol,
  };
  if (item.hidden_reason) entry.hidden = true;
  if (item.displayOnly18Plus) entry.displayOnly18Plus = true;
  if (item.ingredients_vi) entry.ingredients = stripBrand(item.ingredients_vi);
  if (item.usage_vi) entry.usage = stripBrand(item.usage_vi);
  if (item.warnings_vi) entry.warnings = stripBrand(item.warnings_vi);
  entry.description = stripBrand(item.description_vi);
  entry.sourceUrl = item.source_url;
  return entry;
}

const groups = [
  ['samtramy', 'STM', data.samtramy],
  ['tumorong', 'TMR', data.tumorong],
  ['tumorongshop', 'TMS', data.tumorongshop],
  ['khanhthanh', 'KT', data.khanhthanh],
];

const newEntries = [];
for (const [supplierId, prefix, items] of groups) {
  items.forEach((item, i) => newEntries.push(buildEntry(supplierId, prefix, i + 1, item)));
}

console.log(`Tổng ${newEntries.length} SKU mới sẽ thêm.`);

const src = fs.readFileSync(productsPath, 'utf8');
const closeMarker = '\r\n];\r\n\r\n// Loc san pham hidden=true';
const insertBeforeIdx = src.indexOf(closeMarker);
if (insertBeforeIdx === -1) {
  console.error('Không tìm thấy điểm chèn trong products.ts — kiểm tra lại thủ công.');
  process.exit(1);
}

const serialized = newEntries
  .map((e, i) => '  ' + JSON.stringify(e) + (i < newEntries.length - 1 ? ',' : '') + ' // supplier-guard-allow')
  .join('\r\n');

const before = src.slice(0, insertBeforeIdx);
const after = src.slice(insertBeforeIdx + 2); // bỏ '\r\n' đầu closeMarker, tự thêm lại
const updated = before + ',\r\n' + serialized + '\r\n' + after;

fs.writeFileSync(productsPath, updated, 'utf8');
console.log('Đã ghi vào', productsPath);
