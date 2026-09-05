// Tải ảnh thật của 55 sản phẩm Phase 11 (samtramy/tumorong/tumorongshop/khanhthanh)
// về public/products/<supplier>/ rồi cập nhật lại field `image` trong products.ts
// sang đường dẫn local. Chạy 1 lần.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const productsPath = path.join(root, 'src', 'data', 'products.ts');
const listPath = path.join(root, 'phase11_download_list.json');

const list = JSON.parse(fs.readFileSync(listPath, 'utf8'));

function extFromUrl(url) {
  const m = url.match(/\.(jpe?g|png|webp|gif)(\?|$)/i);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

async function download(url, destPath) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

const results = [];
for (const item of list) {
  const ext = extFromUrl(item.image);
  const dir = path.join(root, 'public', 'products', item.supplierId);
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${item.sku.toLowerCase()}-${item.slug}.${ext}`.slice(0, 120);
  const destPath = path.join(dir, filename);
  const localRef = `/products/${item.supplierId}/${filename}`;
  try {
    const size = await download(item.image, destPath);
    results.push({ sku: item.sku, ok: true, size, localPath: localRef });
    console.log(`OK ${item.sku} (${(size / 1024).toFixed(0)}KB) -> ${localRef}`);
  } catch (err) {
    results.push({ sku: item.sku, ok: false, error: err.message, originalUrl: item.image });
    console.error(`FAIL ${item.sku}: ${err.message}`);
  }
}

const okMap = new Map(results.filter((r) => r.ok).map((r) => [r.sku, r.localPath]));
console.log(`\nTải xong: ${okMap.size}/${list.length} thành công.`);

// Cập nhật products.ts: thay field "image" của các SKU tải thành công sang path local.
let src = fs.readFileSync(productsPath, 'utf8');
for (const [sku, localPath] of okMap) {
  const re = new RegExp(`("sku":"${sku}"[^}]*"image":")[^"]*(")`);
  if (re.test(src)) {
    src = src.replace(re, `$1${localPath}$2`);
  } else {
    console.error(`Không tìm thấy pattern image cho SKU ${sku} trong products.ts — bỏ qua, giữ URL gốc.`);
  }
}
fs.writeFileSync(productsPath, src, 'utf8');
console.log('Đã cập nhật products.ts với đường dẫn ảnh local.');

fs.writeFileSync(
  path.join(root, 'phase11_download_result.json'),
  JSON.stringify(results, null, 2),
  'utf8'
);
