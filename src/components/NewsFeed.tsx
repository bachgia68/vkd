import { useState } from 'react';
import { Calendar, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { newsArticles } from '../data/mockData';
import type { Language } from '../i18n/translations';

interface NewsFeedProps {
  lang: Language;
}

export default function NewsFeed({ lang }: NewsFeedProps) {
  const isVi = lang === 'vi';
  const isRTL = lang === 'ar';
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(newsArticles.map(a => isVi ? a.categoryVi : a.category)))];
  const filtered = activeCategory === 'all'
    ? newsArticles
    : newsArticles.filter(a => (isVi ? a.categoryVi : a.category) === activeCategory);

  const featured = filtered.find(a => a.featured);
  const rest = filtered.filter(a => !a.featured || filtered.indexOf(a) > 0);

  return (
    <section id="news" className="section-padding bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cream-100 rounded-full mb-6">
            <Calendar className="w-3.5 h-3.5 text-forest-600" />
            <span className="text-xs font-semibold tracking-wider uppercase text-forest-700">
              {isVi ? 'Tin Tức & Sự Kiện' : 'News & Updates'}
            </span>
          </div>
          <h2 className="font-display text-display-sm md:text-display-md text-forest-900 mb-4">
            {isVi ? 'Tin Tức VKD Group' : 'VKD Group News'}
          </h2>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-forest-900 text-cream-50'
                  : 'bg-cream-100 text-forest-600 hover:bg-forest-50'
              }`}
            >
              {cat === 'all' ? (isVi ? 'Tất Cả' : 'All') : cat}
            </button>
          ))}
        </div>

        {/* Featured article */}
        {featured && (
          <div className="group cursor-pointer rounded-3xl overflow-hidden bg-cream-50 shadow-elegant hover:shadow-elegant-lg transition-all duration-500 mb-8 grid md:grid-cols-[1.5fr_1fr]">
            <div className="relative aspect-[16/9] md:aspect-auto overflow-hidden">
              <img
                src={featured.image}
                alt={`VKD Group News: ${isVi ? featured.titleVi : featured.title}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-forest-950/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-gold-400 text-forest-900 text-xs font-bold">
                  {isVi ? 'Nổi Bật' : 'Featured'}
                </span>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-forest-500 mb-3">
                {isVi ? featured.categoryVi : featured.category}
              </span>
              <h3 className="font-display text-2xl font-bold text-forest-900 mb-4 leading-tight">
                {isVi ? featured.titleVi : featured.title}
              </h3>
              <p className="text-forest-600 text-sm leading-relaxed mb-6 line-clamp-3">
                {isVi ? featured.excerptVi : featured.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-forest-400 mb-6">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />{featured.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />{featured.readTime}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-forest-700 group-hover:text-gold-600 transition-colors">
                {isVi ? 'Đọc Tiếp' : 'Read Full Article'}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        )}

        {/* Rest grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(article => (
            <div
              key={article.id}
              className="group bg-cream-50 rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-500 hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={article.image}
                  alt={`VKD Group: ${isVi ? article.titleVi : article.title}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-gold-400/90 text-forest-900 text-xs font-semibold">
                    {isVi ? article.categoryVi : article.category}
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-forest-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{article.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                </div>
                <h3 className="font-display font-semibold text-forest-900 text-base leading-tight mb-3 line-clamp-2 flex-1">
                  {isVi ? article.titleVi : article.title}
                </h3>
                <p className="text-forest-500 text-sm line-clamp-2 mb-4">
                  {isVi ? article.excerptVi : article.excerpt}
                </p>
                <div className="flex items-center gap-1 text-sm font-medium text-forest-600 group-hover:text-gold-600 transition-colors mt-auto">
                  {isVi ? 'Đọc Tiếp' : 'Read More'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
