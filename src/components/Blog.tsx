import { Newspaper, ArrowRight } from 'lucide-react';
import { useBlogPosts } from '../lib/siteStore';

export default function Blog() {
  const posts = useBlogPosts();

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
              className="bg-white rounded-2xl p-8 shadow-elegant hover:shadow-elegant-lg transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center mb-6">
                <Newspaper className="w-6 h-6 text-forest-700" />
              </div>
              <p className="text-xs text-forest-400 mb-2">{post.createdAt}</p>
              <h3 className="font-display text-xl font-semibold text-forest-900 mb-3">{post.title}</h3>
              <p className="text-forest-600 leading-relaxed line-clamp-3">{post.excerpt}</p>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-forest-600">
                Đọc tiếp <ArrowRight className="w-4 h-4" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
