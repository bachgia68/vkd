import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, Droplets, Palette, Wine } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

interface ProductsProps {
  lang: Language;
  onNavigate?: (page: string) => void;
}

const productImages = [
  '/products/samk5/02-nuoc-tang-luc-dau-tay-do.png', // supplier-guard-allow — internal asset path, not customer-visible text
  '/assets/images/product-1.jpg',
  '/assets/images/product-2.jpg',
  '/assets/images/cay-sam-vkd.png',
];

const productCategories = [
  { key: 'beverages', icon: Droplets, image: productImages[0], color: 'forest', catalogType: 'tra-nuoc-uong-sam' },
  { key: 'supplements', icon: Sparkles, image: productImages[1], color: 'gold', catalogType: 'sam-ngam-mat-ong' },
  { key: 'cosmetics', icon: Palette, image: productImages[2], color: 'forest', catalogType: 'my-pham-sam' },
  { key: 'specialty', icon: Wine, image: productImages[3], color: 'gold', catalogType: 'sam-cu-tuoi-kho' },
];

export default function Products({ lang, onNavigate }: ProductsProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  // Joe: "phần sản phẩm chạy từ từ không hấp dẫn" — thẻ cũ chỉ có
  // hover-reveal (im lìm cho tới khi rê chuột, và không có gì xảy ra trên
  // mobile vì không có hover). Thêm hiệu ứng xuất hiện so le khi cuộn tới —
  // dùng IntersectionObserver thuần, không thêm thư viện animation mới.
  const gridRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="products" className="section-padding bg-cream-100" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-100 rounded-full mb-6">
            <span className="w-2 h-2 bg-gold-400 rounded-full" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold-700">
              {t.products.label}
            </span>
          </div>

          <h2 className="font-display text-display-sm md:text-display-md text-forest-900 mb-6">
            {t.products.title}
          </h2>
          <p className="text-forest-600 text-lg leading-relaxed">
            {t.products.subtitle}
          </p>
        </div>

        {/* Product Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {productCategories.map((category, index) => {
            const Icon = category.icon;
            const product = t.products.categories[category.key as keyof typeof t.products.categories];
            const isHovered = hoveredProduct === index;
            const isGold = category.color === 'gold';

            return (
              <div
                key={index}
                className={`product-card group cursor-pointer ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={inView ? { animationDelay: `${index * 120}ms` } : undefined}
                onMouseEnter={() => setHoveredProduct(index)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => onNavigate?.(`catalog?type=${category.catalogType}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onNavigate?.(`catalog?type=${category.catalogType}`);
                }}
              >
                {/* Image */}
                <div className="relative aspect-ginseng overflow-hidden">
                  <img
                    src={category.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <div className="product-card-overlay" />

                  {/* Icon overlay — cũng hiện khi tap trên mobile (group-active),
                      không chỉ hover chuột trên desktop */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0 group-active:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 ${
                        isHovered ? 'scale-100' : 'scale-90'
                      } ${isGold ? 'bg-gold-400' : 'bg-forest-700'}`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Category tag */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        isGold ? 'bg-gold-400 text-forest-900' : 'bg-forest-800 text-white'
                      }`}
                    >
                      0{index + 1}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-forest-900 mb-2 group-hover:text-gold-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-forest-500 text-sm line-clamp-3">{product.desc}</p>

                  {/* Hover link — luôn hiện sẵn mờ, không chỉ bật/tắt đột
                      ngột, để card không "im lìm" khi chưa rê chuột tới */}
                  <div
                    className={`mt-4 flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                      isHovered
                        ? 'opacity-100 translate-x-1'
                        : 'opacity-60 translate-x-0'
                    } ${isGold ? 'text-gold-600' : 'text-forest-600'}`}
                  >
                    <span>{t.products.viewAll}</span>
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <a
            href="#catalog"
            onClick={(e) => { e.preventDefault(); onNavigate?.('catalog'); }}
            className="btn-secondary inline-flex"
          >
            {t.products.viewAll}
            <ArrowRight className={`w-4 h-4 ml-2 ${isRTL ? 'rotate-180' : ''}`} />
          </a>
        </div>
      </div>
    </section>
  );
}
