// Sinh public/product-slugs.json từ src/data/products.ts lúc build, để
// api/sitemap.ts (Vercel serverless function, bundle riêng biệt với app,
// KHÔNG bundle được import xuyên sang src/ — đã gặp lỗi ERR_MODULE_NOT_FOUND
// trên production) đọc qua HTTP thay vì import trực tiếp module TS.
import { writeFileSync } from 'node:fs';
import { products } from '../src/data/products.ts';

const slugs = products.map((p) => p.slug);
writeFileSync('public/product-slugs.json', JSON.stringify(slugs));
console.log(`generate-product-slugs: wrote ${slugs.length} slugs to public/product-slugs.json`);
