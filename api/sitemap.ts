export const config = { runtime: 'nodejs' };

// Sinh sitemap.xml động: "/" + toàn bộ bài Blog đã published (route thật /blog/<slug>,
// xem App.tsx) + toàn bộ sản phẩm trong catalog thật (route thật /product/<slug>).
// Thay cho public/sitemap.xml tĩnh trước đây chỉ liệt kê "/" — xem ghi chú trong git
// history của file đó về lý do. vercel.json rewrite "/sitemap.xml" -> "/api/sitemap"
// để URL công khai vẫn là /sitemap.xml như robots.txt đã khai báo.
//
// Slug sản phẩm đọc từ public/product-slugs.json (sinh lúc build bởi
// scripts/generate-product-slugs.mjs) thay vì import trực tiếp
// src/data/products.ts — hàm serverless này build tách biệt với app, import
// xuyên sang src/ từng làm crash production (ERR_MODULE_NOT_FOUND, file .ts
// không được bundle vào /var/task).
interface BlogPostRow {
  id: string;
  slug: string | null;
  created_at: string;
}

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;');
}

// Hreflang cho tung URL — dung ?lang= (khong doi sang path /en/...) de khop
// dung co che App.tsx dang dung (xem comment SUPPORTED_LANGS trong App.tsx).
const HREFLANG_LANGS = ['en', 'zh', 'fr'];
function hreflangLinks(url: string): string {
  const alternates = [
    `<xhtml:link rel="alternate" hreflang="vi" href="${escapeXml(url)}" />`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(url)}" />`,
    ...HREFLANG_LANGS.map(
      (l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(`${url}?lang=${l}`)}" />`,
    ),
  ];
  return alternates.join('');
}

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  let posts: BlogPostRow[] = [];
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/blog_posts?select=id,slug,created_at&published=eq.true&order=created_at.desc`,
        {
          headers: {
            apikey: supabaseAnonKey,
            authorization: `Bearer ${supabaseAnonKey}`,
          },
        },
      );
      if (res.ok) posts = (await res.json()) as BlogPostRow[];
    } catch (err) {
      console.error('sitemap: fetch blog_posts failed:', err);
    }
  }

  let productSlugs: string[] = [];
  try {
    const res = await fetch('https://tasamngoclinh.com/product-slugs.json');
    if (res.ok) productSlugs = (await res.json()) as string[];
  } catch (err) {
    console.error('sitemap: fetch product-slugs.json failed:', err);
  }

  const homeUrl = 'https://tasamngoclinh.com/';
  const policyPaths = ['/chinh-sach-bao-mat', '/dieu-khoan-su-dung', '/chinh-sach-van-chuyen', '/chinh-sach-doi-tra'];
  const urls = [
    `<url><loc>${homeUrl}</loc><changefreq>weekly</changefreq><priority>1.0</priority>${hreflangLinks(homeUrl)}</url>`,
    ...policyPaths.map((path) => {
      const url = `https://tasamngoclinh.com${path}`;
      return `<url><loc>${escapeXml(url)}</loc><changefreq>yearly</changefreq><priority>0.3</priority>${hreflangLinks(url)}</url>`;
    }),
    ...productSlugs.map((slug) => {
      const url = `https://tasamngoclinh.com/product/${slug}`;
      return `<url><loc>${escapeXml(url)}</loc><changefreq>weekly</changefreq><priority>0.8</priority>${hreflangLinks(url)}</url>`;
    }),
    ...posts.map((p) => {
      const lastmod = p.created_at?.slice(0, 10);
      const url = `https://tasamngoclinh.com/blog/${p.slug ?? p.id}`;
      return `<url><loc>${escapeXml(url)}</loc>${
        lastmod ? `<lastmod>${lastmod}</lastmod>` : ''
      }<changefreq>monthly</changefreq><priority>0.7</priority>${hreflangLinks(url)}</url>`;
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
