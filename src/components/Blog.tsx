import { useEffect, useState } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { fetchBlogPosts, type BlogPost } from '../lib/siteContentApi';

interface BlogProps {
  onNavigate?: (page: string, slug?: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN');
}

function estimateReadingMinutes(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function Blog({ onNavigate }: BlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogPosts().then(setPosts).catch(() => setPosts([]));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="section-padding bg-cream-50">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-100 rounded-full mb-6">
            <span className="w-2 h-2 bg-forest-500 rounded-full" />
            <span className="text-xs font-semibold tracking-wider uppercase text-forest-700">Tin Tức &amp; Kiến Thức</span>
          </div>
          <h2 className="font-display text-display-sm md:text-display-md text-forest-900 mb-6">Bài Viết Từ TA</h2>
          <p className="text-forest-600 text-lg leading-relaxed">
            Cập nhật kiến thức khoa học và câu chuyện vùng trồng Sâm Ngọc Linh.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <a
              key={post.id}
              href={`/blog/${post.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('blog-post', post.slug);
              }}
              className="block bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-500 hover:-translate-y-1 cursor-pointer"
            >
              {post.featured_image_url ? (
                <img
                  src={post.featured_image_url}
                  alt={post.featured_image_alt || post.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="relative w-full h-48 bg-forest-900 flex items-end p-6 overflow-hidden">
                  <p className="relative font-display text-lg text-white leading-snug line-clamp-3">
                    {post.title}
                  </p>
                </div>
              )}

              <div className="p-8">
              <div className="flex items-center gap-3 text-xs text-forest-400 mb-2">
                <span>{formatDate(post.created_at)}</span>
                <span className="w-1 h-1 rounded-full bg-forest-300" />
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {estimateReadingMinutes(post.body)} phút đọc
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold text-forest-900 mb-3">{post.title}</h3>
              <p className="text-forest-600 leading-relaxed line-clamp-3">{post.excerpt}</p>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-forest-600">
                Đọc tiếp <ArrowRight className="w-4 h-4" />
              </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
