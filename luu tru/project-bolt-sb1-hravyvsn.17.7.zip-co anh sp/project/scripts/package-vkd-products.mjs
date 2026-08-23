/**
 * Package all 43 VKD products into a complete .zip for database upload.
 * - Downloads all product images from samngoclinhvkdgroup.com
 * - Generates products.json, products.csv, products.sql (PostgreSQL/Supabase)
 * - Creates a README with import instructions
 * - Zips everything into vkd-products-database.zip
 */

import { writeFileSync, mkdirSync, existsSync, createWriteStream, readdirSync, statSync } from 'fs';
import { join, basename, extname } from 'path';
import { createHash } from 'crypto';
import https from 'https';

const VKD_BASE_URL = 'https://samngoclinhvkdgroup.com/san-pham/';

const categories = [
  { id: 'ginseng', label: 'Sâm Củ Tươi & Sâm Khô', desc: 'Sâm Ngọc Linh chính gốc Tu Mơ Rông' },
  { id: 'supplements', label: 'Thực Phẩm Bảo Vệ Sức Khỏe', desc: 'Dịch chiết sâm, viên nang, nước uống sâm' },
  { id: 'tea_wine', label: 'Trà & Đồ Uống Sâm', desc: 'Trà sâm túi lọc, rượu sâm Ngọc Linh cao cấp' },
  { id: 'cosmetics', label: 'Mỹ Phẩm & Làm Đẹp', desc: 'Collagen sâm, kem dưỡng sâm' },
];

const products = [
  { name: 'Sâm Ngọc Linh thái lát ngâm mật ong', price: 2500000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/SNL-Thai-Lat.png', detailUrl: `${VKD_BASE_URL}sam-ngoc-linh-thai-lat-ngam-mat-ong/`, category: 'ginseng', activeIngredient: 'Majonoside R2 (MR2) — độc quyền Ngọc Linh', badge: 'Quốc Bảo' },
  { name: 'Cao Sâm Ngọc Linh Mật Ong', price: 2200000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-9.png', detailUrl: `${VKD_BASE_URL}cao-sam-ngoc-linh-mat-ong/`, category: 'supplements', activeIngredient: 'Cao đặc 70% + Saponin MR2', badge: 'Hàm lượng cao' },
  { name: 'Nước Cốt Sâm Ngọc Linh', price: 445000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-8.png', detailUrl: `${VKD_BASE_URL}nuoc-cot-sam-ngoc-linh/`, category: 'supplements', activeIngredient: 'Chiết xuất sâm 8–10 năm tuổi', badge: null },
  { name: 'Giải Độc Gan Panaxx Naturis', price: 440000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-7.png', detailUrl: `${VKD_BASE_URL}giai-doc-gan-panaxx-naturis/`, category: 'supplements', activeIngredient: 'MR2 + Cà gai leo + Khúng khéng', badge: 'Bảo vệ gan' },
  { name: 'NƯỚC SÂM NGỌC LINH PANAXX', price: null, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/sp1.png', detailUrl: `${VKD_BASE_URL}nuoc-sam-ngoc-linh-panaxx/`, category: 'supplements', activeIngredient: 'Chiết xuất sâm Ngọc Linh 0,05%', badge: null },
  { name: 'NƯỚC SÂM NGỌC LINH PANAXX – VỊ CHANH LEO', price: null, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/sp2.png', detailUrl: `${VKD_BASE_URL}nuoc-sam-ngoc-linh-panaxx-vi-chanh-leo/`, category: 'supplements', activeIngredient: 'Chiết xuất sâm Ngọc Linh + Caffeine', badge: null },
  { name: 'NƯỚC SÂM NGỌC LINH PANAXX – VỊ ỔI HỒNG', price: null, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/sp3.png', detailUrl: `${VKD_BASE_URL}nuoc-sam-ngoc-linh-panaxx-vi-oi-hong/`, category: 'supplements', activeIngredient: 'Chiết xuất sâm Ngọc Linh + Caffeine', badge: null },
  { name: 'Kẹo Sâm Ngọc Linh (PanaxX Candy)', price: 72000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/keo.png', detailUrl: `${VKD_BASE_URL}keo-sam-ngoc-linh-panaxx-candy/`, category: 'supplements', activeIngredient: 'Saponin sâm Ngọc Linh', badge: null },
  { name: 'Bánh Sâm Ngọc Linh (PanaxX Cookie)', price: 58000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/banh.png', detailUrl: `${VKD_BASE_URL}banh-sam-ngoc-linh-panaxx-cookie/`, category: 'supplements', activeIngredient: 'Chiết xuất sâm Ngọc Linh', badge: null },
  { name: 'Panaxx Super Drink 190ml (Bản Mới)', price: 15000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-6.png', detailUrl: `${VKD_BASE_URL}panaxx-super-drink-190ml-ban-moi/`, category: 'supplements', activeIngredient: 'MR2 + Vitamin B3/B6', badge: null },
  { name: 'Trà Sâm Ngọc Linh', price: 345000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/tra.png', detailUrl: `${VKD_BASE_URL}tra-sam-ngoc-linh/`, category: 'tea_wine', activeIngredient: 'Lát sâm Ngọc Linh sấy khô', badge: null },
  { name: 'Set 5 Lon Nước Tăng Lực (5 Vị)', price: 130000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-5.png', detailUrl: `${VKD_BASE_URL}set-5-lon-nuoc-tang-luc-5-vi/`, category: 'tea_wine', activeIngredient: 'Saponin MR2 + Taurine + Vitamin B', badge: 'Ngũ Hành' },
  { name: 'PanaxX – Bản Kim 325ml', price: 26000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/kim.png', detailUrl: `${VKD_BASE_URL}panaxx-ban-kim-325ml/`, category: 'tea_wine', activeIngredient: 'Sâm Ngọc Linh 0,05% — Hương Xoài', badge: null },
  { name: 'PanaxX – Bản Mộc 325ml', price: 26000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/moc.png', detailUrl: `${VKD_BASE_URL}panaxx-ban-moc-325ml/`, category: 'tea_wine', activeIngredient: 'Sâm Ngọc Linh 0,05% — Hương Dưa Gang', badge: null },
  { name: 'PanaxX – Bản Thuỷ 325ml', price: 26000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/thuy.png', detailUrl: `${VKD_BASE_URL}panaxx-ban-thuy-325ml/`, category: 'tea_wine', activeIngredient: 'Sâm Ngọc Linh 0,05% — Hương Chanh Dây', badge: null },
  { name: 'PanaxX – Bản Hoả 325ml', price: 26000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/hoa.png', detailUrl: `${VKD_BASE_URL}panaxx-ban-hoa-325ml/`, category: 'tea_wine', activeIngredient: 'Sâm Ngọc Linh 0,05% — Hương Ổi Hồng', badge: null },
  { name: 'Rượu Ngọc Đế -Thiên Hương 750ml', price: 1750000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/Ruoungocde2.png', detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-thien-huong-750ml/`, category: 'tea_wine', activeIngredient: 'Sâm Ngọc Linh ngâm ủ truyền thống', badge: 'Cao cấp' },
  { name: 'Rượu Ngọc Đế Sâm Ngọc Linh 12 năm – 500ml', price: 1118000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/ruou-sam-12-nam.png', detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-sam-ngoc-linh-12-nam-500ml/`, category: 'tea_wine', activeIngredient: 'Sâm 12 năm tuổi + Hồng Sâm + Tam Thất', badge: '12 năm' },
  { name: 'Rượu Ngọc Đế Sâm Ngọc Linh 10 năm – 500ml', price: 980000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/ruou-sam-10-nam.png', detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-sam-ngoc-linh-10-nam-500ml/`, category: 'tea_wine', activeIngredient: 'Sâm 10 năm tuổi — chưng cất châu Âu', badge: '10 năm' },
  { name: 'Rượu Ngọc Đế – Thăng Long (Chai cao) 500ml', price: 860000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/Ruoungocde3.png', detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-thang-long-chai-cao-500ml/`, category: 'tea_wine', activeIngredient: 'Sâm Ngọc Linh 8+ năm tuổi', badge: null },
  { name: 'Rượu Ngọc Đế – Thăng Long (Chai thấp) 500ml', price: 860000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/Ruoungocde1.png', detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-thang-long-chai-thap-500ml/`, category: 'tea_wine', activeIngredient: 'Sâm Ngọc Linh 8+ năm tuổi', badge: null },
  { name: 'Rượu Ngọc Đế Sâm Ngọc Linh Normal 500ml', price: 585000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/ruou-sam-normal.png', detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-sam-ngoc-linh-normal-500ml/`, category: 'tea_wine', activeIngredient: 'Sâm Ngọc Linh 8+ năm + Tam Thất + Câu Kỉ', badge: null },
  { name: 'Rượu Sâm Ngọc Linh Xê Đăng', price: 690000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-4.png', detailUrl: `${VKD_BASE_URL}ruou-sam-ngoc-linh-xe-dang/`, category: 'tea_wine', activeIngredient: 'Sâm Ngọc Linh + Dược liệu quý', badge: null },
  { name: 'Rượu Sâm Ngọc Linh 19.5 Độ', price: 370000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-2.png', detailUrl: `${VKD_BASE_URL}ruou-sam-ngoc-linh-19-5-do/`, category: 'tea_wine', activeIngredient: 'Sâm Ngọc Linh 8+ năm — 19.5°', badge: null },
  { name: 'Combo 2 Chai Rượu Sâm Ngọc Linh 19.5 Độ', price: 715000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-3.png', detailUrl: `${VKD_BASE_URL}combo-2-chai-ruou-sam-ngoc-linh-19-5-do/`, category: 'tea_wine', activeIngredient: 'Combo 2 chai — tiết kiệm', badge: 'Combo' },
  { name: 'Rượu Ngọc Đế Phổ Thông 300ml', price: 200000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-1.png', detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-pho-thong-300ml/`, category: 'tea_wine', activeIngredient: 'Sâm Ngọc Linh ngâm ủ', badge: null },
  { name: 'Rượu Kim Bôi', price: 72000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/Ruoungocde.png', detailUrl: `${VKD_BASE_URL}ruou-kim-boi/`, category: 'tea_wine', activeIngredient: 'Rượu gạo truyền thống + Sâm Ngọc Linh', badge: null },
  { name: 'Men Kim Bôi', price: 80000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-1-1.png', detailUrl: `${VKD_BASE_URL}men-kim-boi/`, category: 'tea_wine', activeIngredient: '36 vị thuốc bắc — men rượu truyền thống', badge: null },
  { name: 'Bộ Trẻ Hóa Combo (Big Size)', price: 8760000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-15.png', detailUrl: `${VKD_BASE_URL}bo-tre-hoa-combo-big-size/`, category: 'cosmetics', activeIngredient: 'Sâm Ngọc Linh + PCG (Tam Thất + Đông Trùng + Linh Chi)', badge: 'Combo Premium' },
  { name: 'Bộ phục hồi da', price: 3230000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham.png', detailUrl: `${VKD_BASE_URL}bo-phuc-hoi-da/`, category: 'cosmetics', activeIngredient: 'Chiết xuất sâm Ngọc Linh PN’s Choice', badge: null },
  { name: 'Nước Trẻ Hóa Da (Purely Refreshing)', price: 3470000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-13.png', detailUrl: `${VKD_BASE_URL}nuoc-tre-hoa-da-purely-refreshing/`, category: 'cosmetics', activeIngredient: 'Gold Water + Saponin cô đặc', badge: 'Nước thần' },
  { name: 'Bộ Trẻ Hóa Da Combo (Mini Size)', price: 1850000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-14.png', detailUrl: `${VKD_BASE_URL}bo-tre-hoa-da-combo-mini-size/`, category: 'cosmetics', activeIngredient: 'Combo 4 sản phẩm PN’s Choice', badge: null },
  { name: 'Kem Dưỡng Ban Đêm (Night Cream)', price: 1900000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-11.png', detailUrl: `${VKD_BASE_URL}kem-duong-ban-dem-night-cream/`, category: 'cosmetics', activeIngredient: 'Advanced Night Repair + Sâm Ngọc Linh', badge: null },
  { name: 'Serum Dưỡng Da (Serum)', price: 1780000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-12.png', detailUrl: `${VKD_BASE_URL}serum-duong-da-serum/`, category: 'cosmetics', activeIngredient: 'Power Rejuvenation Serum + Saponin', badge: null },
  { name: 'Kem Dưỡng Ban Ngày (Day Cream)', price: 1580000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-11.png', detailUrl: `${VKD_BASE_URL}kem-duong-ban-ngay-day-cream/`, category: 'cosmetics', activeIngredient: 'Advanced Day Repair + Sâm Ngọc Linh', badge: null },
  { name: 'Kem Mắt (Eyes Cream)', price: 1150000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-17.png', detailUrl: `${VKD_BASE_URL}kem-mat-eyes-cream/`, category: 'cosmetics', activeIngredient: 'Active Intensive Eye Cream + Sâm', badge: null },
  { name: 'Kem Dưỡng Ban Đêm (Night Cream) — Pn’s', price: 780000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-22.png', detailUrl: `${VKD_BASE_URL}kem-ban-dem-night-cream/`, category: 'cosmetics', activeIngredient: 'Micellar Repair Night — Saponin cô đặc', badge: null },
  { name: 'Kem Chống Nắng (Daily UV)', price: 850000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-10.png', detailUrl: `${VKD_BASE_URL}kem-chong-nang-daily-uv/`, category: 'cosmetics', activeIngredient: 'SPF 50 PA++++ + Sâm Ngọc Linh', badge: null },
  { name: 'Nước Dưỡng Da (Micellar Serum)', price: 850000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-18.png', detailUrl: `${VKD_BASE_URL}nuoc-duong-da-micellar-serum/`, category: 'cosmetics', activeIngredient: 'Micellar Repair Serum — Saponin', badge: null },
  { name: 'Kem Ban Ngày (Day Cream) — Pn’s', price: 580000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-21.png', detailUrl: `${VKD_BASE_URL}kem-ban-ngay-day-cream/`, category: 'cosmetics', activeIngredient: 'Micellar Repair Day + Sâm Ngọc Linh', badge: null },
  { name: 'Nước Cân Bằng (Micellar Toner)', price: 560000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-19.png', detailUrl: `${VKD_BASE_URL}nuoc-can-bang-micellar-toner/`, category: 'cosmetics', activeIngredient: 'Micellar Repair Toner — Saponin', badge: null },
  { name: 'Sữa Rửa Mặt (Micellar Cleaner)', price: 450000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-20.png', detailUrl: `${VKD_BASE_URL}sua-rua-mat-micellar-cleaner/`, category: 'cosmetics', activeIngredient: 'Micellar Repair Cleaner + Sâm', badge: null },
  { name: 'Mặt Nạ Dưỡng Da (Face Mask) 5 Miếng', price: 250000, image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/my-pham-16.png', detailUrl: `${VKD_BASE_URL}mat-na-duong-da-face-mask-5-mieng/`, category: 'cosmetics', activeIngredient: 'Rejuvenating Face Mask + Sâm Ngọc Linh', badge: null },
];

// ── Helpers ──

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const file = createWriteStream(destPath);
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        downloadImage(res.headers.location, destPath).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        console.warn(`  WARN: ${url} → HTTP ${res.statusCode}`);
        file.close();
        resolve(false);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    });
    req.on('error', (err) => {
      console.warn(`  ERROR: ${url} → ${err.message}`);
      file.close();
      resolve(false);
    });
    req.setTimeout(15000, () => {
      req.destroy();
      file.close();
      resolve(false);
    });
  });
}

// ── Main ──

async function main() {
  const outDir = '/tmp/vkd-products-package';
  const imgDir = join(outDir, 'images');
  mkdirSync(imgDir, { recursive: true });

  console.log('=== VKD Products Packaging Tool ===\n');

  // 1. Download all images
  console.log(`Downloading ${products.length} product images…`);
  let downloaded = 0;
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const ext = extname(new URL(p.image).pathname) || '.png';
    const filename = `${String(i + 1).padStart(2, '0')}-${slugify(p.name)}${ext}`;
    const dest = join(imgDir, filename);
    p.localImage = `images/${filename}`;
    process.stdout.write(`  [${i + 1}/${products.length}] ${filename}… `);
    const ok = await downloadImage(p.image, dest);
    if (ok) { downloaded++; console.log('OK'); }
    else console.log('FAILED (will use remote URL)');
  }
  console.log(`\nDownloaded ${downloaded}/${products.length} images.\n`);

  // 2. Build structured data with all fields
  const dbRecords = products.map((p, i) => {
    const cat = categories.find(c => c.id === p.category);
    return {
      id: i + 1,
      sku: `VKD-${String(i + 1).padStart(3, '0')}`,
      slug: slugify(p.name),
      name: p.name,
      name_ascii: p.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd'),
      price_vnd: p.price,
      price_usd: p.price ? Math.round(p.price / 25500 * 100) / 100 : null,
      currency: 'VND',
      category_id: p.category,
      category_label: cat?.label || '',
      category_desc: cat?.desc || '',
      active_ingredient: p.activeIngredient,
      badge: p.badge || null,
      image_url: p.image,
      image_local: p.localImage,
      detail_url: p.detailUrl,
      source: 'samngoclinhvkdgroup.com',
      scraped_at: '2026-07-17',
    };
  });

  // 3. Write JSON
  const jsonPath = join(outDir, 'products.json');
  writeFileSync(jsonPath, JSON.stringify(dbRecords, null, 2), 'utf-8');
  console.log(`Written: ${jsonPath} (${dbRecords.length} records)`);

  // 4. Write CSV
  const csvHeaders = [
    'id', 'sku', 'slug', 'name', 'name_ascii', 'price_vnd', 'price_usd',
    'currency', 'category_id', 'category_label', 'active_ingredient',
    'badge', 'image_url', 'image_local', 'detail_url', 'source', 'scraped_at'
  ];
  const csvEscape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const csvLines = [
    csvHeaders.join(','),
    ...dbRecords.map(r => csvHeaders.map(h => csvEscape(r[h])).join(','))
  ];
  const csvPath = join(outDir, 'products.csv');
  writeFileSync(csvPath, '\ufeff' + csvLines.join('\n'), 'utf-8');
  console.log(`Written: ${csvPath}`);

  // 5. Write SQL (PostgreSQL / Supabase)
  const sqlLines = [
    '-- VKD Products Database Import Script',
    '-- Source: samngoclinhvkdgroup.com (43 products, scraped 2026-07-17)',
    '-- Target: PostgreSQL / Supabase',
    '',
    '-- Create tables',
    'CREATE TABLE IF NOT EXISTS vkd_categories (',
    '  id TEXT PRIMARY KEY,',
    '  label TEXT NOT NULL,',
    '  description TEXT',
    '  );',
    '',
    'CREATE TABLE IF NOT EXISTS vkd_products (',
    '  id SERIAL PRIMARY KEY,',
    '  sku TEXT UNIQUE NOT NULL,',
    '  slug TEXT UNIQUE NOT NULL,',
    '  name TEXT NOT NULL,',
    '  name_ascii TEXT,',
    '  price_vnd INTEGER,',
    '  price_usd NUMERIC(10,2),',
    '  currency TEXT DEFAULT \'VND\',',
    '  category_id TEXT REFERENCES vkd_categories(id),',
    '  active_ingredient TEXT,',
    '  badge TEXT,',
    '  image_url TEXT,',
    '  image_local TEXT,',
    '  detail_url TEXT,',
    '  source TEXT,',
    '  scraped_at DATE,',
    '  created_at TIMESTAMPTZ DEFAULT NOW()',
    ');',
    '',
    '-- Insert categories',
    ...categories.map(c =>
      `INSERT INTO vkd_categories (id, label, description) VALUES ('${c.id}', '${c.label.replace(/'/g, "''")}', '${c.desc.replace(/'/g, "''")}') ON CONFLICT (id) DO NOTHING;`
    ),
    '',
    '-- Insert products',
    ...dbRecords.map(r => {
      const vals = [
        r.sku, r.slug, r.name, r.name_ascii,
        r.price_vnd !== null ? r.price_vnd : 'NULL',
        r.price_usd !== null ? r.price_usd : 'NULL',
        r.currency, r.category_id, r.active_ingredient,
        r.badge, r.image_url, r.image_local, r.detail_url,
        r.source, r.scraped_at
      ].map(v => {
        if (v === null || v === 'NULL') return 'NULL';
        if (typeof v === 'number') return String(v);
        return `'${String(v).replace(/'/g, "''")}'`;
      });
      return `INSERT INTO vkd_products (sku, slug, name, name_ascii, price_vnd, price_usd, currency, category_id, active_ingredient, badge, image_url, image_local, detail_url, source, scraped_at) VALUES (${vals.join(', ')}) ON CONFLICT (sku) DO UPDATE SET name=EXCLUDED.name, price_vnd=EXCLUDED.price_vnd, image_url=EXCLUDED.image_url, detail_url=EXCLUDED.detail_url;`;
    }),
    '',
    '-- Verify',
    'SELECT category_id, COUNT(*) FROM vkd_products GROUP BY category_id ORDER BY category_id;',
    'SELECT COUNT(*) AS total_products FROM vkd_products;',
  ];
  const sqlPath = join(outDir, 'products.sql');
  writeFileSync(sqlPath, sqlLines.join('\n'), 'utf-8');
  console.log(`Written: ${sqlPath}`);

  // 6. Write README
  const readme = `# VKD Products Database Package

## Contents

\`\`\`
vkd-products-database.zip
├── products.json      # 43 products, structured JSON (ready for API/Supabase import)
├── products.csv        # Same data in CSV (Excel / Google Sheets / pgAdmin import)
├── products.sql        # PostgreSQL DDL + INSERT statements (run in Supabase SQL Editor)
├── README.txt          # This file
└── images/             # 43 product images downloaded from samngoclinhvkdgroup.com
    ├── 01-sam-ngoc-linh-thai-lat-ngam-mat-ong.png
    ├── 02-cao-sam-ngoc-linh-mat-ong.png
    └── ... (43 files total)
\`\`\`

## Product Count by Category

| Category ID | Label | Count |
|---|---|---|
| ginseng | Sâm Củ Tươi & Sâm Khô | ${dbRecords.filter(r => r.category_id === 'ginseng').length} |
| supplements | Thực Phẩm Bảo Vệ Sức Khỏe | ${dbRecords.filter(r => r.category_id === 'supplements').length} |
| tea_wine | Trà & Đồ Uống Sâm | ${dbRecords.filter(r => r.category_id === 'tea_wine').length} |
| cosmetics | Mỹ Phẩm & Làm Đẹp | ${dbRecords.filter(r => r.category_id === 'cosmetics').length} |
| **Total** | | **${dbRecords.length}** |

## Import Instructions

### Option A: Supabase SQL Editor (recommended)

1. Go to Supabase Dashboard → SQL Editor
2. Open a new query tab
3. Copy entire contents of \`products.sql\` and paste
4. Click Run — creates tables + inserts all 43 products

### Option B: Import JSON via API

\`\`\`javascript
import { createClient } from '@supabase/supabase-js';
import products from './products.json';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const { error } = await supabase
  .from('vkd_products')
  .upsert(products.map(({ id, ...p }) => p), { onConflict: 'sku' });
\`\`\`

### Option C: Import CSV via pgAdmin

1. Open pgAdmin → Tools → Import
2. Select products.csv
3. Target table: vkd_products (create first using products.sql DDL section)

## Image Storage

Images are in the \`images/\` folder, named: \`{id}-{slug}.{ext}\`

To upload to Supabase Storage:
\`\`\`javascript
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

for (const product of products) {
  const file = fs.readFileSync('./images/' + product.image_local.replace('images/', ''));
  await supabase.storage
    .from('product-images')
    .upload(product.image_local, file, { contentType: 'image/png' });
}
\`\`\`

## Data Fields

| Field | Type | Description |
|---|---|---|
| id | int | Sequential ID (1-43) |
| sku | text | Unique SKU (VKD-001 to VKD-043) |
| slug | text | URL-safe slug |
| name | text | Product name (Vietnamese) |
| name_ascii | text | ASCII-only name (no diacritics) |
| price_vnd | int | Price in VND (null = "Liên hệ") |
| price_usd | numeric | Approximate USD price (rate: 25,500 VND/USD) |
| currency | text | Always "VND" |
| category_id | text | ginseng / supplements / tea_wine / cosmetics |
| active_ingredient | text | Key active ingredient (e.g., MR2) |
| badge | text | Badge label (null if none) |
| image_url | text | Original remote image URL |
| image_local | text | Local image path in zip |
| detail_url | text | Official product page URL |
| source | text | samngoclinhvkdgroup.com |
| scraped_at | date | 2026-07-17 |

---
Generated: 2026-07-17
Source: https://samngoclinhvkdgroup.com/san-pham/
`;
  const readmePath = join(outDir, 'README.txt');
  writeFileSync(readmePath, readme, 'utf-8');
  console.log(`Written: ${readmePath}`);

  // 7. Create zip
  console.log('\nCreating .zip archive…');
  const { execSync } = await import('child_process');
  const zipPath = '/tmp/cc-agent/68645759/project/vkd-products-database.zip';
  execSync(`cd ${outDir} && zip -r ${zipPath} .`, { stdio: 'pipe' });

  // Stats
  const zipStat = statSync(zipPath);
  const imgCount = readdirSync(imgDir).length;
  const zipSizeMB = (zipStat.size / 1024 / 1024).toFixed(2);

  console.log('\n=== Package Complete ===');
  console.log(`Zip: ${zipPath}`);
  console.log(`Size: ${zipSizeMB} MB`);
  console.log(`Products: ${dbRecords.length}`);
  console.log(`Images: ${imgCount} files`);
  console.log(`Files: products.json, products.csv, products.sql, README.txt, images/`);
}

main().catch(console.error);
