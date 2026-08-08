import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { ArrowLeft, Newspaper } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { fetchBlogPost, type BlogPost } from '../lib/siteContentApi';
import { products as staticProducts } from '../data/products';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { getFeaturedProducts } from '../data/featuredProducts';
import ProductCarousel from './ProductCarousel';

interface BlogPostDetailProps {
  postId: string;
  lang: Language;
  onNavigate?: (page: string, slug?: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN');
}

// Bài viết được sinh với định dạng markdown cố định (chỉ H2/H3, bullet, bold,
// đoạn văn — xem prompt trong node "Xay dung Prompt" của n8n) nên một parser
// nhỏ tự viết là đủ, không cần thêm thư viện markdown cho một tập cú pháp cố
// định như vậy.
function renderMarkdown(body: string) {
  const lines = body.split('\n');
  const blocks: ReactElement[] = [];
  let listItems: string[] = [];
  let paragraph: string[] = [];
  let key = 0;

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
      blocks.push(
        <ul key={key++} className="list-disc pl-5 space-y-1.5 text-forest-700 leading-relaxed mb-4">
          {listItems.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
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

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx].trim();
    if (!line || line === '---') {
      flushList();
      flushParagraph();
      continue;
    }
    if (isTableRow(line) && isTableSeparator(lines[idx + 1] || '')) {
      flushList();
      flushParagraph();
      const header = parseTableRow(line);
      const rows: string[][] = [];
      let rowIdx = idx + 2;
      while (rowIdx < lines.length && isTableRow(lines[rowIdx].trim())) {
        rows.push(parseTableRow(lines[rowIdx]));
        rowIdx++;
      }
      idx = rowIdx - 1;
      blocks.push(
        <div key={key++} className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-forest-200">
                {header.map((cell, i) => (
                  <th key={i} className="text-left py-2 pr-4 font-semibold text-forest-900">
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-forest-100">
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-2 pr-4 text-forest-700 align-top">
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
    if (line.startsWith('### ')) {
      flushList();
      flushParagraph();
      blocks.push(
        <h3 key={key++} className="font-display text-lg font-semibold text-forest-900 mt-6 mb-2">
          {renderInline(line.slice(4))}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      flushParagraph();
      blocks.push(
        <h2 key={key++} className="font-display text-xl font-semibold text-forest-900 mt-8 mb-3">
          {renderInline(line.slice(3))}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      // Tiêu đề H1 đã hiển thị riêng ở đầu trang, bỏ qua nếu Gemini lặp lại trong body.
      continue;
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      flushParagraph();
      listItems.push(line.slice(2));
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushList();
  flushParagraph();
  return blocks;
}

export default function BlogPostDetail({ postId, lang, onNavigate }: BlogPostDetailProps) {
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const liveProducts = useLiveProducts(staticProducts);
  const featured = useMemo(() => getFeaturedProducts(liveProducts), [liveProducts]);
  const featuredTitle = lang === 'vi' ? 'Sản Phẩm Nổi Bật' : 'Featured Products';
  const backLabel = lang === 'vi' ? 'Về Bài Viết' : 'Back to articles';

  useEffect(() => {
    setPost(undefined);
    fetchBlogPost(postId)
      .then(setPost)
      .catch(() => setPost(null));
  }, [postId]);

  return (
    <section className="section-padding bg-cream-50 min-h-screen">
      <div className="container-wide max-w-3xl">
        <button
          onClick={() => onNavigate?.('blog')}
          className="inline-flex items-center gap-2 text-sm text-forest-600 hover:text-forest-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {backLabel}
        </button>

        {post === undefined && <p className="text-forest-500">Đang tải...</p>}
        {post === null && <p className="text-forest-500">Không tìm thấy bài viết.</p>}

        {post && (
          <article>
            {post.featured_image_url ? (
              <img
                src={post.featured_image_url}
                alt={post.featured_image_alt || post.title}
                className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8"
              />
            ) : (
              <div className="w-full h-48 bg-forest-100 rounded-2xl flex items-center justify-center mb-8">
                <Newspaper className="w-10 h-10 text-forest-400" />
              </div>
            )}

            <p className="text-xs text-forest-400 mb-2">{formatDate(post.created_at)}</p>
            <h1 className="font-display text-display-sm md:text-display-md text-forest-900 mb-8">
              {post.title}
            </h1>

            <div>{renderMarkdown(post.body)}</div>
          </article>
        )}

        {post && featured.length > 0 && (
          <div className="mt-16 pt-12 border-t border-forest-100">
            <h2 className="font-display text-xl font-semibold text-forest-900 mb-6">
              {featuredTitle}
            </h2>
            <ProductCarousel products={featured} lang={lang} onNavigate={onNavigate} />
          </div>
        )}
      </div>
    </section>
  );
}
