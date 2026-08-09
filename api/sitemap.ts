export const config = { runtime: 'nodejs' };

// Sinh sitemap.xml động: "/" + toàn bộ bài Blog đã published (route thật /blog/<id>,
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
  created_at: string;
  updated_at?: string | null;
}

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;');
}

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  let posts: BlogPostRow[] = [];
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/blog_posts?select=id,created_at,updated_at&published=eq.true&order=created_at.desc`,
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

  const urls = [
    `<url><loc>https://tasamngoclinh.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    ...productSlugs.map(
      (slug) =>
        `<url><loc>${escapeXml(`https://tasamngoclinh.com/product/${slug}`)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    ),
    ...posts.map((p) => {
      const lastmod = (p.updated_at ?? p.created_at)?.slice(0, 10);
      return `<url><loc>${escapeXml(`https://tasamngoclinh.com/blog/${p.id}`)}</loc>${
        lastmod ? `<lastmod>${lastmod}</lastmod>` : ''
      }<changefreq>monthly</changefreq><priority>0.7</priority></url>`;
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
