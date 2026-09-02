/**
 * Generate public/sitemap.xml from src/data/products.ts
 * Run: node scripts/generate-sitemap.mjs
 * Optionally add to prebuild script in package.json
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TODAY = new Date().toISOString().slice(0, 10);
const BASE = 'https://tasamngoclinh.com';

// Parse slugs from products.ts (no TS compiler needed)
const productsTs = readFileSync(resolve(ROOT, 'src/data/products.ts'), 'utf-8');
const slugMatches = [...productsTs.matchAll(/"slug":\s*"([^"]+)"/g)];
const hiddenAfterSlug = productsTs.split('"slug":');

// Collect slugs with hidden status
const slugs = [];
for (let i = 1; i < hiddenAfterSlug.length; i++) {
  const slugMatch = hiddenAfterSlug[i].match(/"([^"]+)"/);
  if (!slugMatch) continue;
  const slug = slugMatch[1];
  // Look ahead ~300 chars for hidden: true
  const lookahead = hiddenAfterSlug[i].slice(0, 400);
  const isHidden = /hidden:\s*true/.test(lookahead);
  if (!isHidden) slugs.push(slug);
}

const staticPages = [
  { loc: `${BASE}/`, priority: '1.0', changefreq: 'weekly' },
  { loc: `${BASE}/blog`, priority: '0.8', changefreq: 'daily' },
];

function urlEntry({ loc, priority = '0.7', changefreq = 'weekly' }) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  '',
  '  <!-- Static pages -->',
  ...staticPages.map(urlEntry),
  '',
  `  <!-- Product pages (${slugs.length} visible) -->`,
  ...slugs.map(slug => urlEntry({ loc: `${BASE}/product/${slug}` })),
  '',
  '</urlset>',
];

const xml = lines.join('\n');
const out = resolve(ROOT, 'public/sitemap.xml');
writeFileSync(out, xml, 'utf-8');
console.log(`✓ sitemap.xml — ${slugs.length} products + ${staticPages.length} static pages → ${out}`);
