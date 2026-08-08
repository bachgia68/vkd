// src/components/Products.tsx
import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { products as staticProducts } from '../data/products';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { getFeaturedProducts } from '../data/featuredProducts';
import ProductCarousel from './ProductCarousel';

interface ProductsProps {
  lang: Language;
  onNavigate?: (page: string, slug?: string) => void;
}

export default function Products({ lang, onNavigate }: ProductsProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';
  const liveProducts = useLiveProducts(staticProducts);
  const featured = useMemo(() => getFeaturedProducts(liveProducts), [liveProducts]);

  if (featured.length === 0) return null;

  return (
    <section id="products" className="section-padding bg-cream-100" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
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

        <div className="mb-12">
          <ProductCarousel products={featured} lang={lang} onNavigate={onNavigate} />
        </div>

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
