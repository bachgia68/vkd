#!/usr/bin/env node
/**
 * Design Guard: chặn gradient trang trí 2 tông cùng màu (vd.
 * `bg-gradient-to-br from-forest-900 to-forest-700`) lọt vào src/components —
 * pattern này bị cấm tuyệt đối trong docs/DESIGN_SYSTEM.md muc 1 (dấu hiệu
 * thiết kế AI hàng loạt, đã gỡ khỏi site 2026-08-10, tái phạm ở EliteTeaser
 * 2026-08-24 vì không có gì chặn tự động — đây là bản vá cho lỗ hổng đó).
 *
 * Cho phép: gradient overlay 1 chiều để chữ đọc được trên ảnh thật (vd.
 * `from-forest-950/95 to-forest-950/50` — có opacity, phủ lên ảnh) vẫn qua
 * được vì regex chỉ bắt gradient KHÔNG có opacity (`/` suffix) giữa 2 sắc
 * cùng tông — đúng định nghĩa "gradient trang trí suông" trong tài liệu.
 *
 * Chạy: node scripts/check-no-decorative-gradient.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

const SCAN_DIRS = ['src/components'];

// Bắt: bg-gradient-to-X from-<color>-<shade> (via-<cùng-color>-<shade>)? to-<cùng-color>-<shade>
// KHÔNG có opacity suffix "/nn" ở cả from và to — nếu có opacity nghĩa là overlay
// có chức năng (đọc chữ trên ảnh thật), được phép.
const DECORATIVE_GRADIENT_RE =
  /bg-gradient-to-\w+\s+from-(forest|gold|cream|earth)-\d{2,3}(?!\/)\b[^"'`]*?\bto-\1-\d{2,3}(?!\/)\b/g;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx|jsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

let violations = [];
for (const dir of SCAN_DIRS) {
  const absDir = path.join(root, dir);
  if (!fs.existsSync(absDir)) continue;
  for (const file of walk(absDir)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      const matches = line.match(DECORATIVE_GRADIENT_RE);
      if (matches) {
        violations.push({ file: path.relative(root, file), line: i + 1, match: matches[0] });
      }
    });
  }
}

if (violations.length > 0) {
  console.error('\n❌ Design Guard: tìm thấy gradient trang trí 2 tông cùng màu (cấm theo docs/DESIGN_SYSTEM.md mục 1):\n');
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  ${v.match}`);
  }
  console.error('\nSửa: dùng 1 màu phẳng (bg-forest-900) HOẶC ảnh thật + gradient overlay có opacity (from-forest-950/95 to-forest-950/50).\n');
  process.exit(1);
}

console.log(`✅ Design Guard: không tìm thấy gradient trang trí nào trong ${SCAN_DIRS.join(', ')}.`);
