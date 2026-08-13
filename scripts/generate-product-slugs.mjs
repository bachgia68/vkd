// Sinh public/product-slugs.json + public/products-seo.json từ
// src/data/products.ts lúc build, để các serverless function (api/sitemap.ts,
// api/product.ts — bundle riêng biệt với app, KHÔNG bundle được import xuyên
// sang src/, đã gặp lỗi ERR_MODULE_NOT_FOUND trên production) đọc qua HTTP
// thay vì import trực tiếp module TS.
import { writeFileSync } from 'node:fs';
import { products } from '../src/data/products.ts';

const slugs = products.map((p) => p.slug);
writeFileSync('public/product-slugs.json', JSON.stringify(slugs));
console.log(`generate-product-slugs: wrote ${slugs.length} slugs to public/product-slugs.json`);

// Chỉ các field api/product.ts cần để render title/description/OG/JSON-LD —
// không copy toàn bộ Product (tránh rò rỉ field nội bộ như supplierId).
const productsSeo = products.map((p) => ({
  slug: p.slug,
  sku: p.sku,
  name: p.name,
  price: p.price,
  image: p.image,
  description: p.description,
}));
writeFileSync('public/products-seo.json', JSON.stringify(productsSeo));
console.log(`generate-product-slugs: wrote ${productsSeo.length} entries to public/products-seo.json`);
