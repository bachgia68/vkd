import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { ArrowLeft, Newspaper, Clock, UserRound, Quote, List } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { fetchBlogPost, type BlogPost } from '../lib/siteContentApi';
import { products as staticProducts } from '../data/products';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { getFeaturedProducts } from '../data/featuredProducts';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useJsonLd } from '../hooks/useJsonLd';
import { slugify } from '../lib/slugify';
import ProductCarousel from './ProductCarousel';

interface BlogPostDetailProps {
  slug: string;
  lang: Language;
  onNavigate?: (page: string, slug?: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN');
}

function slugifyHeading(text: string, index: number) {
  const base = slugify(text);
  return `${base || 'section'}-${index}`;
}

// Ước lượng thời gian đọc kiểu tiếng Việt (~200 từ/phút), làm tròn lên phút gần nhất.
function estimateReadingMinutes(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface TocEntry {
  id: string;
  text: string;
}

// Bài viết được sinh với định dạng markdown cố định (H2/H3, bullet, bold,
// đoạn văn, bảng — xem prompt trong node "Xay dung Prompt" của n8n) nên một
// parser nhỏ tự viết là đủ. Thêm hỗ trợ "> " (blockquote) để tác giả có thể
// tự đánh dấu khối số liệu/trích dẫn nổi bật (Key Stat / Social Proof) chỉ
// bằng cú pháp markdown, không cần trường dữ liệu riêng.
function renderMarkdown(body: string): { blocks: ReactElement[]; toc: TocEntry[] } {
  const lines = body.split('\n');
  const blocks: ReactElement[] = [];
  const toc: TocEntry[] = [];
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let paragraph: string[] = [];
  let quoteLines: string[] = [];
  let key = 0;
  let headingIndex = 0;

  const renderInline = (text: string) =>
    text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });

  const parseTableRow = (line: string) =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim());

  const isTableRow = (line: string) => line.trim().startsWith('|') && line.trim().endsWith('|');
  const isTableSeparator = (line: string) => /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$/.test(line.trim());

  const flushList = () => {
    if (listItems.length) {
      const Tag = listType === 'ol' ? 'ol' : 'ul';
      const listClass = listType === 'ol' ? 'list-decimal' : 'list-disc';
      blocks.push(
        <Tag key={key++} className={`${listClass} pl-5 space-y-1.5 text-forest-700 leading-relaxed mb-4`}>
          {listItems.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </Tag>
      );
      listItems = [];
      listType = null;
    }
  };

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(
        <p key={key++} className="text-forest-700 leading-relaxed mb-4">
          {renderInline(paragraph.join(' '))}
        </p>
      );
      paragraph = [];
    }
  };

  const flushQuote = () => {
    if (quoteLines.length) {
      blocks.push(
        <div
          key={key++}
          className="my-6 rounded-2xl bg-gold-50 border-l-4 border-gold-400 px-6 py-5 flex gap-3"
        >
          <Quote className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
          <p className="font-display text-lg md:text-xl text-forest-900 leading-snug">
            {renderInline(quoteLines.join(' '))}
          </p>
        </div>
      );
      quoteLines = [];
    }
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx].trim();
    if (!line || line === '---') {
      flushList();
      flushParagraph();
      flushQuote();
      continue;
    }
    if (isTableRow(line) && isTableSeparator(lines[idx + 1] || '')) {
      flushList();
      flushParagraph();
      flushQuote();
      const header = parseTableRow(line);
      const rows: string[][] = [];
      let rowIdx = idx + 2;
      while (rowIdx < lines.length && isTableRow(lines[rowIdx].trim())) {
        rows.push(parseTableRow(lines[rowIdx]));
        rowIdx++;
      }
      idx = rowIdx - 1;
      blocks.push(
        <div key={key++} className="overflow-x-auto mb-6 rounded-xl border border-forest-100">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-forest-50 border-b border-forest-200">
                {header.map((cell, i) => (
                  <th key={i} className="text-left py-3 px-4 font-semibold text-forest-900">
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-forest-100 last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-3 px-4 text-forest-700 align-top">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }
    if (line.startsWith('> ')) {
      flushList();
      flushParagraph();
      quoteLines.push(line.slice(2));
      continue;
    }
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushList();
      flushParagraph();
      flushQuote();
      const [, alt, src] = imageMatch;
      const isVideo = /\.(mp4|webm|mov)$/i.test(src.split('?')[0]);
      blocks.push(
        <figure key={key++} className="my-8">
          {isVideo ? (
            <video
              src={src}
              controls
              playsInline
              className="w-full rounded-2xl shadow-elegant"
            />
          ) : (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className="w-full rounded-2xl shadow-elegant object-cover"
            />
          )}
          {alt && <figcaption className="mt-2 text-center text-sm text-forest-500">{alt}</figcaption>}
        </figure>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      flushParagraph();
      flushQuote();
      blocks.push(
        <h3 key={key++} className="font-display text-lg font-semibold text-forest-900 mt-6 mb-2">
          {renderInline(line.slice(4))}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      flushParagraph();
      flushQuote();
      const text = line.slice(3);
      const id = slugifyHeading(text, headingIndex++);
      toc.push({ id, text });
      blocks.push(
        <h2
          key={key++}
          id={id}
          className="font-display text-xl md:text-2xl font-semibold text-forest-900 mt-10 mb-4 scroll-mt-24"
        >
          {renderInline(text)}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      // Tiêu đề H1 đã hiển thị riêng ở đầu trang, bỏ qua nếu Gemini lặp lại trong body.
      continue;
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      flushParagraph();
      flushQuote();
      if (listType === 'ol') flushList();
      listType = 'ul';
      listItems.push(line.slice(2));
    } else if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      flushQuote();
      if (listType === 'ul') flushList();
      listType = 'ol';
      listItems.push(line.replace(/^\d+\.\s+/, ''));
    } else {
      flushList();
      flushQuote();
      paragraph.push(line);
    }
  }
  flushList();
  flushParagraph();
  flushQuote();
  return { blocks, toc };
}

export default function BlogPostDetail({ slug, lang, onNavigate }: BlogPostDetailProps) {
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const liveProducts = useLiveProducts(staticProducts);
  const featured = useMemo(() => getFeaturedProducts(liveProducts), [liveProducts]);
  const featuredTitle = lang === 'vi' ? 'Tiếp Tục Khám Phá' : 'Keep Exploring';
  const backLabel = lang === 'vi' ? 'Về Bài Viết' : 'Back to articles';

  useEffect(() => {
    setPost(undefined);
    fetchBlogPost(slug)
      .then(setPost)
      .catch(() => setPost(null));
  }, [slug]);

  useDocumentMeta({
    title: post ? `${post.title} — TA Sâm Ngọc Linh` : 'TA Sâm Ngọc Linh',
    description: post?.excerpt,
    path: `/blog/${slug}`,
    image: post?.featured_image_url ?? undefined,
  });

  useJsonLd(
    post
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          image: post.featured_image_url ?? undefined,
          datePublished: post.created_at,
          author: { '@type': 'Organization', name: 'TA Sâm Ngọc Linh' },
          publisher: {
            '@type': 'Organization',
            name: 'TA Sâm Ngọc Linh',
            logo: { '@type': 'ImageObject', url: 'https://tasamngoclinh.com/assets/images/TA_logo_clean.png' },
          },
          mainEntityOfPage: `https://tasamngoclinh.com/blog/${slug}`,
        }
      : null
  );

  useJsonLd(
    post
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://tasamngoclinh.com/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://tasamngoclinh.com/blog' },
            { '@type': 'ListItem', position: 3, name: post.title, item: `https://tasamngoclinh.com/blog/${slug}` },
          ],
        }
      : null
  );

  const { blocks, toc } = useMemo(() => (post ? renderMarkdown(post.body) : { blocks: [], toc: [] }), [post]);
  const readingMinutes = useMemo(() => (post ? estimateReadingMinutes(post.body) : 0), [post]);

  return (
    <section className="bg-cream-50 min-h-screen">
      <div className="container-wide max-w-3xl pt-8">
        <button
          onClick={() => onNavigate?.('blog')}
          className="inline-flex items-center gap-2 text-sm text-forest-600 hover:text-forest-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {backLabel}
        </button>
      </div>

      {post === undefined && <p className="text-forest-500 container-wide max-w-3xl">Đang tải...</p>}
      {post === null && <p className="text-forest-500 container-wide max-w-3xl">Không tìm thấy bài viết.</p>}

      {post && (
        <>
          {/* Hero Banner */}
          <div className="relative w-full h-72 md:h-[420px] overflow-hidden">
            {post.featured_image_url ? (
              <img
                src={post.featured_image_url}
                alt={post.featured_image_alt || post.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-forest-900 flex items-center justify-center">
                <Newspaper className="w-12 h-12 text-forest-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-forest-950/10" />

            <div className="relative h-full container-wide max-w-3xl flex flex-col justify-end pb-8">
              <span className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-gold-400/90 text-forest-900 text-xs font-semibold tracking-wider uppercase mb-4">
                Tin Tức &amp; Kiến Thức
              </span>
              <h1 className="font-display text-display-sm md:text-display-md text-white leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-cream-200 text-sm">
                <span className="flex items-center gap-1.5">
                  <UserRound className="w-3.5 h-3.5" /> Đội Ngũ Nghiên Cứu TA
                </span>
                <span className="flex items-center gap-1.5">{formatDate(post.created_at)}</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {readingMinutes} phút đọc
                </span>
              </div>
            </div>
          </div>

          <div className="container-wide max-w-3xl py-10 md:py-14">
            {/* Hook subtitle */}
            {post.excerpt && (
              <p className="font-display text-lg md:text-xl text-forest-700 leading-relaxed italic mb-10 pb-8 border-b border-forest-100">
                {post.excerpt}
              </p>
            )}

            {/* Interactive TOC */}
            {toc.length > 1 && (
              <nav className="mb-10 rounded-2xl bg-white border border-forest-100 p-5 shadow-elegant">
                <p className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-forest-500 mb-3">
                  <List className="w-3.5 h-3.5" /> Mục Lục
                </p>
                <ol className="space-y-2">
                  {toc.map((item, i) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex gap-2 text-sm text-forest-600 hover:text-gold-700 transition-colors"
                      >
                        <span className="text-gold-500 font-medium">{i + 1}.</span>
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <article>{blocks}</article>
          </div>
        </>
      )}

      {post && featured.length > 0 && (
        <div className="bg-forest-950 py-12 md:py-16">
          <div className="container-wide max-w-5xl">
            <div className="text-center max-w-xl mx-auto mb-10">
              <p className="text-xs uppercase tracking-wider font-semibold text-gold-400 mb-2">
                Từ Bộ Sưu Tập TA
              </p>
              <h2 className="font-display text-2xl text-white">{featuredTitle}</h2>
            </div>
            <ProductCarousel products={featured} lang={lang} onNavigate={onNavigate} />
          </div>
        </div>
      )}
    </section>
  );
}
