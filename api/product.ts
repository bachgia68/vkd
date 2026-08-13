import { originFromRequest, renderPage } from './_renderMeta.ts';

export const config = { runtime: 'nodejs' };

// vercel.json rewrite "/product/:slug" -> "/api/product?slug=:slug" — cùng
// mục đích với api/blog.ts, xem _renderMeta.ts.
//
// Đọc từ public/products-seo.json (sinh lúc build bởi
// scripts/generate-product-slugs.mjs) thay vì import trực tiếp
// src/data/products.ts — cùng lý do đã ghi trong api/sitemap.ts
// (ERR_MODULE_NOT_FOUND, function này build tách biệt với app).
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
