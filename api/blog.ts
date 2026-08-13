export const config = { runtime: 'nodejs' };

// vercel.json rewrite "/blog/:id" -> "/api/blog?id=:id".
//
// Site là Vite SPA thuần client-side, không SSR — src/hooks/useDocumentMeta.ts
// chỉ đổi title/OG SAU KHI JS chạy, nên crawler không chạy JS (Zalo, Facebook/
// Messenger link preview, một số bot) luôn thấy title/description/OG của
// TRANG CHỦ cho mọi bài blog. Fix: fetch lại index.html tĩnh đã build, ghi đè
// các thẻ head bằng dữ liệu thật của đúng bài, trả cho MỌI request (không chỉ
// bot) — client vẫn hydrate React bình thường lên trên, useDocumentMeta chỉ
// set lại đúng giá trị đã có sẵn nên vô hại.
//
// Helper KHÔNG tách file riêng (từng thử ./_renderMeta.ts, Vercel Node
// function không bundle import chéo giữa các file trong api/ — lỗi
// ERR_MODULE_NOT_FOUND trên production, cùng gốc với comment trong
// api/sitemap.ts) — lặp lại nguyên khối trong api/product.ts, chấp nhận trùng
// code để mỗi function tự chứa đủ, đúng pattern đã có sẵn trong repo.
interface BlogPostRow {
  id: string;
  title: string;
  excerpt: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  created_at: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function originFromRequest(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (forwardedHost) return `https://${forwardedHost}`;
  return new URL(request.url).origin;
}

interface PageMeta {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  ogType: 'article' | 'product';
  jsonLdBlocks: object[];
}

function renderPage(baseHtml: string, meta: PageMeta): string {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description.slice(0, 300));

  let html = baseHtml;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="title" content="[^"]*"\s*\/>/, `<meta name="title" content="${title}" />`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${description}" />`,
  );
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${meta.url}" />`);
  html = html.replace(
    /<meta property="og:type" content="[^"]*"\s*\/>/,
    `<meta property="og:type" content="${meta.ogType}" />`,
  );
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${meta.url}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`);
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${description}" />`,
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${meta.imageUrl}" />`,
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${description}" />`,
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${meta.imageUrl}" />`,
  );

  const jsonLdScripts = meta.jsonLdBlocks
    .map((block) => `<script type="application/ld+json">${JSON.stringify(block)}</script>`)
    .join('\n');
  html = html.replace('</head>', `${jsonLdScripts}\n</head>`);

  return html;
}

export async function GET(request: Request) {
  const origin = originFromRequest(request);
  const id = new URL(request.url).searchParams.get('id') ?? '';

  const [baseHtmlRes, post] = await Promise.all([
    fetch(`${origin}/index.html`),
    fetchPost(id),
  ]);
  const baseHtml = await baseHtmlRes.text();

  if (!post) {
    // Bài không tồn tại/chưa published — trả HTML gốc, để React tự hiện
    // "Không tìm thấy bài viết." như hiện tại, không giả mạo meta cho ID rác.
    return new Response(baseHtml, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  const url = `https://tasamngoclinh.com/blog/${post.id}`;
  const imageUrl = post.featured_image_url
    ? post.featured_image_url.startsWith('http')
      ? post.featured_image_url
      : `https://tasamngoclinh.com${post.featured_image_url}`
    : 'https://tasamngoclinh.com/assets/images/TA_logo_clean.png';

  const html = renderPage(baseHtml, {
    title: `${post.title} — TA Sâm Ngọc Linh`,
    description: post.excerpt,
    url,
    imageUrl,
    ogType: 'article',
    jsonLdBlocks: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: imageUrl,
        datePublished: post.created_at,
        dateModified: post.created_at,
        author: { '@type': 'Organization', name: 'TA Sâm Ngọc Linh' },
        publisher: {
          '@type': 'Organization',
          name: 'TA Sâm Ngọc Linh',
          logo: { '@type': 'ImageObject', url: 'https://tasamngoclinh.com/assets/images/TA_logo_clean.png' },
        },
        mainEntityOfPage: url,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://tasamngoclinh.com/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://tasamngoclinh.com/#blog' },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  });

  return new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 's-maxage=3600, stale-while-revalidate' },
  });
}

async function fetchPost(id: string): Promise<BlogPostRow | null> {
  if (!id) return null;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?select=id,title,excerpt,featured_image_url,featured_image_alt,created_at&id=eq.${encodeURIComponent(id)}&published=eq.true`,
      { headers: { apikey: supabaseAnonKey, authorization: `Bearer ${supabaseAnonKey}` } },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as BlogPostRow[];
    return rows[0] ?? null;
  } catch (err) {
    console.error('api/blog: fetch post failed:', err);
    return null;
  }
}
