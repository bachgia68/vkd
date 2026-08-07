import { useEffect, useState } from 'react';
import { Newspaper, ArrowRight } from 'lucide-react';
import { fetchBlogPosts, type BlogPost } from '../lib/siteContentApi';

interface BlogProps {
  onNavigate?: (page: string, slug?: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN');
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
            <article
              key={post.id}
              onClick={() => onNavigate?.('blog-post', post.id)}
              className="bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-500 hover:-translate-y-1 cursor-pointer"
            >
              {post.featured_image_url ? (
                <img
                  src={post.featured_image_url}
                  alt={post.featured_image_alt || post.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-48 bg-forest-100 flex items-center justify-center">
                  <Newspaper className="w-10 h-10 text-forest-400" />
                </div>
              )}

              <div className="p-8">
              <p className="text-xs text-forest-400 mb-2">{formatDate(post.created_at)}</p>
              <h3 className="font-display text-xl font-semibold text-forest-900 mb-3">{post.title}</h3>
              <p className="text-forest-600 leading-relaxed line-clamp-3">{post.excerpt}</p>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-forest-600">
                Đọc tiếp <ArrowRight className="w-4 h-4" />
              </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
