import { originFromRequest, renderPage } from './_renderMeta.ts';

export const config = { runtime: 'nodejs' };

// vercel.json rewrite "/blog/:id" -> "/api/blog?id=:id" — xem _renderMeta.ts
// cho lý do vì sao cần function này (fix SEO: SPA không SSR, mọi bài blog
// chia sẻ chung title/OG trang chủ với crawler không chạy JS).
interface BlogPostRow {
  id: string;
  title: string;
  excerpt: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  created_at: string;
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
