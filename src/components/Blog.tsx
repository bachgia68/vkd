import { useEffect, useState } from 'react';
import { ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { fetchBlogPosts, fetchBlogCategories, fetchSiteSetting, type BlogPost, type BlogCategory } from '../lib/siteContentApi';
import SwipeCarousel, { CarouselImage } from './ui/SwipeCarousel';

interface BlogProps {
  onNavigate?: (page: string, slug?: string) => void;
}

// Rotation fallback — dùng ảnh thật trong public/assets, không dark box
const FALLBACK_IMAGES = [
  '/assets/images/heritage-cu-sam-2.jpg',
  '/assets/images/heritage-vuon-sam-1.jpg',
  '/assets/images/heritage-la-sam.jpg',
  '/assets/images/heritage-hat-sam-1.jpg',
  '/assets/images/heritage-cu-sam-3.jpg',
  '/assets/images/sam-ngoc-linh-plant.png',
  '/assets/images/heritage-vuon-khanh-nhieu-cay.jpg',
  '/assets/images/cay-sam-ngoc-linh.png',
];

function getFallback(index: number): string {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

// Tự detect category từ title/body
function detectCategory(post: BlogPost): string {
  const text = (post.title + ' ' + (post.excerpt || '')).toLowerCase();
  if (/mr2|majonoside|saponin|hoạt chất|dược chất|enzyme|vi sinh/i.test(text)) return 'Khoa học';
  if (/vùng trồng|ngọc linh|núi|vườn|canh tác|bảo tồn/i.test(text)) return 'Vùng trồng';
  if (/dinh dưỡng|sức khỏe|miễn dịch|tăng cường|bổ sung/i.test(text)) return 'Sức khoẻ';
  if (/kol|testimonial|câu chuyện|kinh nghiệm/i.test(text)) return 'Câu chuyện';
  return 'Kiến thức';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN');
}

function estimateReadingMinutes(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface PostCardProps {
  post: BlogPost;
  index: number;
  onNavigate?: (page: string, slug?: string) => void;
}

function PostCard({ post, index, onNavigate }: PostCardProps) {
  const img = post.featured_image_url || getFallback(index);
  const category = detectCategory(post);
  const slug = post.slug;

  return (
    <a
      href={`/blog/${slug}`}
      onClick={(e) => { e.preventDefault(); onNavigate?.('blog-post', slug); }}
      className="group block bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-500 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden aspect-[16/9]">
        <img
          src={img}
          alt={post.featured_image_alt || post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/30 to-transparent" />
        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-forest-800 text-xs font-semibold rounded-full">
          {category}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-forest-400 mb-3">
          <span>{formatDate(post.created_at)}</span>
          <span className="w-1 h-1 rounded-full bg-forest-300" />
          <Clock className="w-3 h-3" />
          <span>{estimateReadingMinutes(post.body)} phút</span>
        </div>
        <h3 className="font-display text-lg font-semibold text-forest-900 mb-2 line-clamp-2 leading-snug group-hover:text-forest-700 transition-colors">
          {post.title}
        </h3>
        <p className="text-forest-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
        <div className="flex items-center gap-1.5 text-sm font-medium text-forest-600 group-hover:text-forest-800 transition-colors">
          Đọc tiếp <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </a>
  );
}

function FeaturedPostSlide({ post, index, onNavigate }: PostCardProps) {
  const img = post.featured_image_url || getFallback(index);
  const category = detectCategory(post);
  const slug = post.slug;

  return (
    <a
      href={`/blog/${slug}`}
      onClick={(e) => { e.preventDefault(); onNavigate?.('blog-post', slug); }}
      className="group block bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-500 h-full"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <CarouselImage
          src={img}
          alt={post.featured_image_alt || post.title}
          fit="cover"
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/30 to-transparent pointer-events-none" />
        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-forest-800 text-xs font-semibold rounded-full">
          {category}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-forest-400 mb-2">
          <span>{formatDate(post.created_at)}</span>
          <span className="w-1 h-1 rounded-full bg-forest-300" />
          <Clock className="w-3 h-3" />
          <span>{estimateReadingMinutes(post.body)} phút</span>
        </div>
        <h3 className="font-display text-base font-semibold text-forest-900 mb-2 line-clamp-2 leading-snug group-hover:text-forest-700 transition-colors">
          {post.title}
        </h3>
        <p className="text-forest-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
      </div>
    </a>
  );
}

function HeroPost({ post, onNavigate }: { post: BlogPost; onNavigate?: (page: string, slug?: string) => void }) {
  const img = post.featured_image_url || getFallback(0);
  const category = detectCategory(post);
  const slug = post.slug;

  return (
    <a
      href={`/blog/${slug}`}
      onClick={(e) => { e.preventDefault(); onNavigate?.('blog-post', slug); }}
      className="group relative block rounded-3xl overflow-hidden shadow-elegant-lg hover:shadow-2xl transition-all duration-500"
      style={{ minHeight: '420px' }}
    >
      <img
        src={img}
        alt={post.featured_image_alt || post.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* gradient overlay một chiều — đúng chuẩn design system, không gradient trang trí */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 to-forest-950/20" />

      <div className="relative h-full flex flex-col justify-end p-8 md:p-12" style={{ minHeight: '420px' }}>
        <div className="max-w-xl">
          <span className="inline-block px-3 py-1 bg-gold-400/20 border border-gold-400/40 text-gold-300 text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            {category}
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-4 text-white/60 text-xs mb-6">
            <span>{formatDate(post.created_at)}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {estimateReadingMinutes(post.body)} phút đọc</span>
          </div>
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-forest-900 text-sm font-semibold rounded-full transition-all group-hover:bg-gold-400 group-hover:text-white">
            Đọc bài viết <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </a>
  );
}

function getPageFromUrl(): number {
  const p = new URLSearchParams(window.location.search).get('page');
  const n = parseInt(p ?? '1', 10);
  return isNaN(n) || n < 1 ? 1 : n;
}

function setPageInUrl(p: number) {
  const url = new URL(window.location.href);
  if (p === 1) url.searchParams.delete('page');
  else url.searchParams.set('page', String(p));
  window.history.replaceState(null, '', url.toString());
}

export default function Blog({ onNavigate }: BlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [postsPerPage, setPostsPerPage] = useState(9);
  const [page, setPage] = useState(() => getPageFromUrl());

  useEffect(() => {
    fetchBlogPosts().then(setPosts).catch(() => setPosts([]));
    fetchBlogCategories().then(setCategories).catch(() => {});
    fetchSiteSetting('posts_per_page').then((v) => {
      if (v) { const n = parseInt(v, 10); if (!isNaN(n) && n > 2) setPostsPerPage(n); }
    }).catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  const [hero, ...rest] = posts;
  const isFullPage = window.location.pathname === '/blog';

  // Category filter — only on full /blog page
  const filteredRest = (isFullPage && selectedCat !== 'all')
    ? rest.filter((p) => p.category_id === selectedCat)
    : rest;

  const postsToShow = isFullPage ? filteredRest : rest.slice(0, 6);

  // Pagination for full page
  let gridPosts = postsToShow;
  let totalPages = 1;
  if (isFullPage && postsToShow.length > postsPerPage) {
    totalPages = Math.ceil(postsToShow.length / postsPerPage);
    const start = (page - 1) * postsPerPage;
    gridPosts = postsToShow.slice(start, start + postsPerPage);
  }

  // Carousel "Bài Viết Nổi Bật" — dùng lại data đã fetch, N bài mới nhất sau hero
  const featuredPosts = rest.slice(0, 8);

  return (
    <section id="blog" className={`${isFullPage ? 'pt-32 pb-16' : 'section-padding'} bg-cream-50`}>
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-100 rounded-full mb-4">
              <span className="w-2 h-2 bg-forest-500 rounded-full" />
              <span className="text-xs font-semibold tracking-wider uppercase text-forest-700">Tin Tức &amp; Kiến Thức</span>
            </div>
            <h2 className="font-display text-display-sm md:text-display-md text-forest-900">
              {isFullPage ? 'Tất Cả Bài Viết' : 'Bài Viết Từ TA'}
            </h2>
            {isFullPage && <p className="text-forest-600 text-sm mt-2">{rest.length} bài viết</p>}
          </div>
          {!isFullPage && posts.length > 4 && (
            <a
              href="/blog"
              onClick={(e) => { e.preventDefault(); onNavigate?.('blog'); }}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-forest-600 hover:text-forest-900 transition-colors"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Category filter tabs — chỉ hiện trên /blog đầy đủ khi có categories từ DB */}
        {isFullPage && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => { setSelectedCat('all'); setPage(1); setPageInUrl(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCat === 'all'
                  ? 'bg-forest-700 text-white'
                  : 'bg-white border border-cream-300 text-forest-600 hover:border-forest-400 hover:text-forest-900'
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCat(cat.id); setPage(1); setPageInUrl(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCat === cat.id
                    ? 'bg-forest-700 text-white'
                    : 'bg-white border border-cream-300 text-forest-600 hover:border-forest-400 hover:text-forest-900'
                }`}
              >
                {cat.name_vi}
              </button>
            ))}
          </div>
        )}

        {/* Hero post */}
        <div className="mb-10">
          <HeroPost post={hero} onNavigate={onNavigate} />
        </div>

        {/* Carousel bài viết nổi bật — vuốt ngang, không thay thế lưới phân trang bên dưới */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="font-display text-xl md:text-2xl font-bold text-forest-900 mb-6">
              Bài Viết Nổi Bật
            </h3>
            <SwipeCarousel
              items={featuredPosts}
              getKey={(post) => post.id}
              slideWidthClassName="w-[260px] md:w-[300px]"
              renderSlide={(post, _isActive) => {
                const idx = featuredPosts.indexOf(post) + 1;
                return <FeaturedPostSlide post={post} index={idx} onNavigate={onNavigate} />;
              }}
            />
          </div>
        )}

        {/* Grid posts — bắt đầu từ index 1 để fallback không trùng với hero */}
        {gridPosts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i + 1} onNavigate={onNavigate} />
            ))}
          </div>
        )}

        {/* Pagination — hiển thị trên trang /blog đầy đủ */}
        {isFullPage && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
              <button
                onClick={() => { setPageInUrl(page - 1); setPage(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-4 py-2 border border-forest-300 text-forest-700 rounded-lg hover:bg-forest-50 transition-colors text-sm font-medium"
              >
                ← Trước
              </button>
            )}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPageInUrl(p); setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-forest-600 text-white'
                      : 'border border-forest-300 text-forest-700 hover:bg-forest-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {page < totalPages && (
              <button
                onClick={() => { setPageInUrl(page + 1); setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-4 py-2 border border-forest-300 text-forest-700 rounded-lg hover:bg-forest-50 transition-colors text-sm font-medium"
              >
                Sau →
              </button>
            )}
          </div>
        )}

        {/* Mobile xem tất cả — chỉ hiển thị trên homepage, không show trên /blog page */}
        {!isFullPage && posts.length > 4 && (
          <div className="mt-10 flex justify-center md:hidden">
            <a
              href="/blog"
              onClick={(e) => { e.preventDefault(); onNavigate?.('blog'); }}
              className="inline-flex items-center gap-2 px-6 py-3 border border-forest-300 text-forest-700 rounded-full text-sm font-medium hover:bg-forest-50 transition-colors"
            >
              Xem tất cả bài viết <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
