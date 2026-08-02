#!/usr/bin/env node
/**
 * Remove Supplier Names from UI (Frontend)
 * ─────────────────────────────────────────────────────────────────
 * Purpose: Xóa toàn bộ tên Nhà Cung Cấp (VKD, TRIMICO) khỏi:
 *   1. TrimicoProductCatalog.tsx — header "TA × TRIMICO" → "TA"
 *   2. Kiểm tra các file khác không hiển thị tên NCC
 *
 * Chạy: node scripts/remove-supplier-names.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  'src/components/TrimicoProductCatalog.tsx',
  'src/components/TrimicoTeaser.tsx',
];

console.log('🔍 Scanning files for supplier names...\n');

files.forEach((filePath) => {
  const fullPath = path.join(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  let updated = false;

  // Rule 1: "TA × TRIMICO" → "TA" (TrimicoProductCatalog header)
  if (content.includes('TA × TRIMICO')) {
    content = content.replace('TA × TRIMICO', 'TA');
    console.log(`✓ ${filePath}: Removed "TA × TRIMICO" badge`);
    updated = true;
  }

  // Rule 2: "Sản Phẩm TRIMICO" → "Sâm & Dược Liệu" (TrimicoProductCatalog title)
  if (content.includes('Sản Phẩm TRIMICO')) {
    content = content.replace('Sản Phẩm TRIMICO', 'Sâm & Dược Liệu TA');
    console.log(`✓ ${filePath}: Changed "Sản Phẩm TRIMICO" → "Sâm & Dược Liệu TA"`);
    updated = true;
  }

  // Rule 3: Remove "từ Công ty TNHH Triết Minh (TRIMICO)" from description (TrimicoProductCatalog.tsx)
  if (content.includes('từ Công ty TNHH Triết\n            Minh (TRIMICO)')) {
    content = content.replace(
      'Sâm Ngọc Linh, Nấm Lim Xanh, mật ong rừng và đặc sản Quảng Nam từ Công ty TNHH Triết\n            Minh (TRIMICO) — đặt hàng và thanh toán trực tiếp trên TA.',
      'Sâm Ngọc Linh, Nấm Lim Xanh, mật ong rừng và đặc sản Quảng Nam — đặt hàng và thanh toán trực tiếp trên TA.'
    );
    console.log(`✓ ${filePath}: Removed supplier company name from description (TrimicoProductCatalog)`);
    updated = true;
  }

  // Rule 4: TRIMICO Teaser - Change "TRIMICO trên sàn TA" → "Danh Mục Bổ Sung"
  if (content.includes('TRIMICO trên sàn TA')) {
    content = content.replace('TRIMICO trên sàn TA', 'Danh Mục Bổ Sung');
    console.log(`✓ ${filePath}: Changed "TRIMICO trên sàn TA" → "Danh Mục Bổ Sung"`);
    updated = true;
  }

  // Rule 5: Remove "từ Công ty TNHH Triết Minh (TRIMICO)" from TrimicoTeaser
  if (content.includes('từ Công ty TNHH Triết\n              Minh (TRIMICO)')) {
    content = content.replace(
      'Sâm Ngọc Linh, Nấm Lim Xanh, mật ong rừng và đặc sản Quảng Nam từ Công ty TNHH Triết\n              Minh (TRIMICO)',
      'Sâm Ngọc Linh, Nấm Lim Xanh, mật ong rừng và đặc sản Quảng Nam'
    );
    console.log(`✓ ${filePath}: Removed supplier company name from description (TrimicoTeaser)`);
    updated = true;
  }

  // Rule 6: Change "Xem tất cả sản phẩm TRIMICO" → "Xem Danh Mục"
  if (content.includes('Xem tất cả sản phẩm TRIMICO')) {
    content = content.replace('Xem tất cả sản phẩm TRIMICO', 'Xem Danh Mục');
    console.log(`✓ ${filePath}: Changed button text to hide supplier name`);
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`   → Saved changes\n`);
  } else {
    console.log(`⊘ ${filePath}: No changes needed\n`);
  }
});

console.log('✅ Supplier name removal complete!\n');
console.log('Next steps:');
console.log('  1. Run: npm run build');
console.log('  2. Check: npm run dev');
console.log('  3. Commit: git add . && git commit -m "Refactor: Hide supplier names from TA brand UI"');
