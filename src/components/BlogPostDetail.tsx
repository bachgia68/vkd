import { useEffect, useState, type ReactElement } from 'react';
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
  onNavigate?: (page: string) => void;
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
    text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );

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

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line === '---') {
      flushList();
      flushParagraph();
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
  const featured = getFeaturedProducts(liveProducts);
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
