#!/usr/bin/env node
/**
 * Brand Guard: chặn tên Nhà Cung Cấp (VKD, TRIMICO, Triết Minh...) lộ ra
 * bất kỳ file UI nào (components/pages/i18n). Chạy trước mỗi build.
 *
 * Chỉ quét những nơi khách hàng nhìn thấy — KHÔNG quét src/data (nơi cần
 * giữ tên NCC thật để backend/admin phân loại đơn hàng, vận đơn, tồn kho).
 *
 * Chạy: node scripts/check-no-supplier-names.js
 * Thêm vào CI/pre-build: "prebuild": "node scripts/check-no-supplier-names.js"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

// Thư mục quét: chỉ UI khách hàng nhìn thấy (storefront). KHÔNG quét src/data hay
// src/admin — đó là backend/admin nội bộ, được PHÉP biết tên NCC thật để phân loại
// đơn hàng, kho, vận đơn (đúng kiến trúc Branded House: frontend = TA, backend = đa NCC).
const SCAN_DIRS = ['src/components', 'src/pages', 'index.html'];

// File i18n: quét nhưng chỉ dòng là NHÃN HIỂN THỊ thật (value sau dấu ':'), bỏ qua
// tên field/key kỹ thuật như "trimico: string;" hay "trimico:" (key) khi value không phải NCC.
const I18N_FILES = ['src/i18n/translations.ts'];

// src/data/products.ts là data khách hàng nhìn thấy (catalog/detail đọc trực tiếp từ
// đây) — KHÔNG giống vkdProducts.ts/trimicoProducts.ts (backend/reference-only). Quét
// dòng-theo-dòng, nhưng loại trừ các field định danh nội bộ (sku/supplierId/sourceUrl)
// vốn hợp lệ chứa "VKD"/"trimico" như identifier, không phải text hiển thị.
const PRODUCTS_DATA_FILES = ['src/data/products.ts'];

// Chuỗi cấm xuất hiện trong UI-facing text (case-insensitive), trừ khi trong EXCEPTIONS.
const BANNED_PATTERNS = [
  /\bVKD\b/i,
  /\bTRIMICO\b/i,
  /Tri[eế]t\s*Minh/i,
  /V[oõ]\s*Kim\s*Đư[oờ]ng/i,
  /T[aậ]p\s*Đo[aà]n\s*Y\s*Dư[oợ]c\s*S[aâ]m\s*Ng[oọ]c\s*Linh/i,
];

// Dòng chứa các chuỗi này được phép (dùng cho comment giải thích rule, tên biến kỹ thuật, v.v.)
const EXCEPTION_MARKERS = ['supplier-guard-allow', 'NCC:'];

const SKIP_DIR_NAMES = new Set(['node_modules', 'dist', '.git']);

function walk(p, out) {
  const stat = fs.statSync(p);
  if (stat.isDirectory()) {
    if (SKIP_DIR_NAMES.has(path.basename(p))) return;
    for (const entry of fs.readdirSync(p)) walk(path.join(p, entry), out);
  } else if (/\.(tsx?|jsx?|html)$/.test(p)) {
    out.push(p);
  }
}

let files = [];
for (const rel of SCAN_DIRS) {
  const full = path.join(root, rel);
  if (fs.existsSync(full)) walk(full, files);
}

// route/slug identifiers như 'trimico-catalog', id="trimico-catalog",
// 'thach-sam-ngoc-linh-trimico' không phải text hiển thị cho khách — bỏ qua khi
// từ khóa nằm sát dấu gạch ngang (kebab-case), không phải trong câu văn.
const IDENTIFIER_ADJACENT = /[a-zA-Z0-9]-(vkd|trimico)\b|\b(vkd|trimico)-[a-zA-Z0-9]/i;
// DOM anchor ids (id="trimico") và khai báo type (trimico: string;) không phải text hiển thị.
const NON_DISPLAY = /\bid=["']\w*(vkd|trimico)\w*["']/i;
const TYPE_DECLARATION = /:\s*string;\s*$/;
// JSON key trong products.ts giữ tên NCC làm định danh nội bộ hợp lệ (không hiển thị
// cho khách dưới dạng TEXT — chỉ là identifier/URL/đường dẫn asset nội bộ):
// "sku": "VKD-001", "supplierId": "vkd", "sourceUrl": "https://...trimico.vn/...",
// "image": "/products/trimico/01-....png" (đường dẫn asset, không phải text hiển thị).
// "slug" cũng là identifier nội bộ (dùng cho routing/URL, không phải text hiển thị) —
// cùng nhóm với sku/supplierId. LƯU Ý: một số giá trị slug hiện chứa "trimico" literal
// (vd "tra-sam-ngoc-linh-trimico") — bản thân các slug này có thể cần dọn lại khi làm
// routing trang chi tiết sản phẩm sau này; việc đó nằm ngoài phạm vi guard này.
const PRODUCTS_JSON_ID_FIELD = /^\s*"(sku|supplierId|sourceUrl|image|slug)"\s*:/;
// Khai báo type nội bộ (vd: export type SupplierId = 'vkd' | 'trimico';) không phải
// text hiển thị cho khách — cần thiết để code phân loại NCC ở tầng data.
const SUPPLIER_TYPE_ALIAS = /^\s*export\s+type\s+SupplierId\s*=/;

const allFiles = [
  ...files,
  ...I18N_FILES.map((f) => path.join(root, f)).filter(fs.existsSync),
  ...PRODUCTS_DATA_FILES.map((f) => path.join(root, f)).filter(fs.existsSync),
];

const productsDataFullPaths = new Set(
  PRODUCTS_DATA_FILES.map((f) => path.join(root, f)).filter(fs.existsSync)
);

const violations = [];
for (const file of allFiles) {
  const isProductsDataFile = productsDataFullPaths.has(file);
  const lines = fs.readFileSync(file, 'utf-8').split('\n');
  lines.forEach((line, i) => {
    if (EXCEPTION_MARKERS.some((m) => line.includes(m))) return;
    // IDENTIFIER_ADJACENT bảo vệ route/slug identifier trong code (vd:
    // onNavigate('trimico-catalog')) — hợp lệ áp dụng toàn dòng cho file
    // component/i18n. Nhưng trong products.ts, một field hiển thị (name/description/
    // badge...) có thể vô tình chứa "trimico"/"vkd" sát dấu gạch ngang trong câu văn
    // (vd tương lai: "name": "TRIMICO-MITRI Tea") — nếu miễn trừ toàn dòng ở đây thì
    // lộ tên NCC sẽ lọt qua guard. Nên với products.ts, chỉ cho IDENTIFIER_ADJACENT
    // miễn trừ khi dòng đó CŨNG là field định danh nội bộ đã biết (sku/supplierId/
    // sourceUrl/image/slug) — không áp dụng cho các field text hiển thị khác.
    if (IDENTIFIER_ADJACENT.test(line)) {
      if (!isProductsDataFile) return;
      if (PRODUCTS_JSON_ID_FIELD.test(line)) return;
    }
    if (NON_DISPLAY.test(line)) return;
    if (TYPE_DECLARATION.test(line)) return;
    if (PRODUCTS_JSON_ID_FIELD.test(line)) return;
    if (SUPPLIER_TYPE_ALIAS.test(line)) return;
    for (const pattern of BANNED_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({ file: path.relative(root, file), lineNo: i + 1, text: line.trim(), pattern: pattern.source });
        break;
      }
    }
  });
}

if (violations.length) {
  console.error(`\n❌ Brand Guard: phát hiện ${violations.length} chỗ lộ tên NCC trong UI:\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.lineNo}\n    ${v.text}\n`);
  }
  console.error('→ Xóa/thay tên NCC bằng "TA" trước khi build.');
  console.error('  Nếu là dòng hợp lệ (VD: comment kỹ thuật), thêm "supplier-guard-allow" vào cuối dòng.\n');
  process.exit(1);
} else {
  console.log(`✅ Brand Guard: không tìm thấy tên NCC nào trong ${allFiles.length} file UI đã quét.`);
}
