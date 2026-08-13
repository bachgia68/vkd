export const config = { runtime: 'nodejs' };

// vercel.json rewrite "/product/:slug" -> "/api/product?slug=:slug" — cùng
// mục đích với api/blog.ts (fix SEO: SPA không SSR). Helper KHÔNG tách file
// riêng — xem comment đầu api/blog.ts (Vercel Node function không bundle
// import chéo giữa các file trong api/, ERR_MODULE_NOT_FOUND) — lặp lại
// nguyên khối ở đây thay vì import.
//
// Đọc từ public/products-seo.json (sinh lúc build bởi
// scripts/generate-product-slugs.mjs) thay vì import trực tiếp
// src/data/products.ts — cùng lý do đã ghi trong api/sitemap.ts.
// Giá hiển thị là giá catalog tĩnh lúc build, không phải giá override admin
// realtime (fetchProductOverrides là RPC cần context khác) — chấp nhận lệch
// nhỏ cho mục đích snapshot SEO, giá thật trên trang vẫn đúng sau khi JS load.
interface ProductSeoRow {
  slug: string;
  sku: string;
  name: string;
  price: number | null;
  image: string;
  description: string;
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
  const slug = new URL(request.url).searchParams.get('slug') ?? '';

  const [baseHtmlRes, product] = await Promise.all([
    fetch(`${origin}/index.html`),
    fetchProduct(origin, slug),
  ]);
  const baseHtml = await baseHtmlRes.text();

  if (!product) {
    return new Response(baseHtml, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  const url = `https://tasamngoclinh.com/product/${product.slug}`;
  const imageUrl = product.image.startsWith('http')
    ? product.image
    : `https://tasamngoclinh.com${product.image}`;

  const jsonLdBlocks: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://tasamngoclinh.com/' },
        { '@type': 'ListItem', position: 2, name: 'Sản phẩm', item: 'https://tasamngoclinh.com/#catalog' },
        { '@type': 'ListItem', position: 3, name: product.name, item: url },
      ],
    },
  ];
  if (product.price !== null) {
    jsonLdBlocks.unshift({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: imageUrl,
      sku: product.sku,
      brand: { '@type': 'Brand', name: 'TA Sâm Ngọc Linh' },
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'VND',
        price: product.price,
        availability: 'https://schema.org/InStock',
      },
    });
  }

  const html = renderPage(baseHtml, {
    title: `${product.name} — TA Sâm Ngọc Linh`,
    description: product.description,
    url,
    imageUrl,
    ogType: 'product',
    jsonLdBlocks,
  });

  return new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 's-maxage=3600, stale-while-revalidate' },
  });
}

async function fetchProduct(origin: string, slug: string): Promise<ProductSeoRow | null> {
  if (!slug) return null;
  try {
    const res = await fetch(`${origin}/products-seo.json`);
    if (!res.ok) return null;
    const products = (await res.json()) as ProductSeoRow[];
    return products.find((p) => p.slug === slug) ?? null;
  } catch (err) {
    console.error('api/product: fetch products-seo.json failed:', err);
    return null;
  }
}
