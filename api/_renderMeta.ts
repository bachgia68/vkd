// Helper dùng chung cho api/blog.ts + api/product.ts.
//
// Site là Vite SPA thuần client-side, không SSR — src/hooks/useDocumentMeta.ts
// chỉ đổi title/OG SAU KHI JS chạy, nên crawler không chạy JS (Zalo, Facebook/
// Messenger link preview, một số bot) luôn thấy title/description/OG của
// TRANG CHỦ cho mọi bài blog/sản phẩm. Fix: 2 serverless function (blog,
// product) fetch lại index.html tĩnh đã build, ghi đè các thẻ head bằng dữ
// liệu thật của đúng bài/sản phẩm, rồi trả HTML đó cho MỌI request tới
// /blog/:id và /product/:slug (không chỉ bot) — client vẫn hydrate React bình
// thường lên trên, useDocumentMeta chỉ set lại đúng giá trị đã có sẵn nên vô hại.
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function originFromRequest(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (forwardedHost) return `https://${forwardedHost}`;
  return new URL(request.url).origin;
}

export interface PageMeta {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  ogType: 'article' | 'product';
  jsonLdBlocks: object[];
}

export function renderPage(baseHtml: string, meta: PageMeta): string {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description.slice(0, 300));

  let html = baseHtml;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="title" content="[^"]*"\s*\/>/, `<meta name="title" content="${title}" />`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${description}" />`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${meta.url}" />`,
  );
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
