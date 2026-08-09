// src/components/ProductCarousel.tsx
import { useRef, useState, useCallback, useEffect, type PointerEvent, type MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../data/products';
import type { Language } from '../i18n/translations';

interface ProductCarouselProps {
  products: Product[];
  lang: Language;
  onNavigate?: (page: string, slug?: string) => void;
}

const VND_PER_USD = 25000;

function formatPrice(price: number | null, lang: Language): string {
  if (price === null) return lang === 'vi' ? 'Liên hệ' : 'Contact us';
  if (lang === 'vi') return price.toLocaleString('vi-VN') + '₫';
  const usd = Math.round((price / VND_PER_USD) * 100) / 100;
  return `$${usd.toFixed(2)}`;
}

export default function ProductCarousel({ products, lang, onNavigate }: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Native overflow-x scroll only responds to touch drag / trackpad / shift+wheel —
  // a mouse user (desktop, no touchscreen) has no way to "swipe" it at all without
  // this. Tracks click-vs-drag via total pointer movement so a drag that ends on
  // top of a card doesn't also fire its navigation.
  const dragState = useRef<{ startX: number; startScrollLeft: number; moved: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
  }, [updateArrows, products]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-carousel-card]') as HTMLElement | null;
    const amount = (card?.offsetWidth ?? 280) + 24;
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = trackRef.current;
    if (!el) return;
    dragState.current = { startX: e.clientX, startScrollLeft: el.scrollLeft, moved: 0 };
    setIsDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    const drag = dragState.current;
    if (!el || !drag) return;
    const delta = e.clientX - drag.startX;
    drag.moved = Math.max(drag.moved, Math.abs(delta));
    el.scrollLeft = drag.startScrollLeft - delta;
  };

  const endDrag = () => {
    setIsDragging(false);
    // Clear on next tick so the click handler on the card (fired right after
    // pointerup) can still read dragState.current.moved this one last time.
    setTimeout(() => {
      dragState.current = null;
    }, 0);
  };

  const onCardClick = (e: MouseEvent) => {
    if ((dragState.current?.moved ?? 0) > 6) {
      e.preventDefault();
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="relative group/carousel">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label={lang === 'vi' ? 'Xem sản phẩm trước' : 'Previous products'}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-11 h-11 rounded-full bg-white shadow-elegant-lg items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 text-forest-900" />
        </button>
      )}

      <div
        ref={trackRef}
        onScroll={updateArrows}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className={`flex gap-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isDragging ? 'cursor-grabbing select-none' : 'md:cursor-grab'
        }`}
      >
        {products.map((product) => (
          <a
            key={product.sku}
            data-carousel-card
            href={`/product/${product.slug}`}
            className="product-card group cursor-pointer flex-shrink-0 w-64 md:w-72 block"
            onClick={(e) => {
              onCardClick(e);
              if (e.defaultPrevented) return;
              e.preventDefault();
              onNavigate?.('product-detail', product.slug);
            }}
          >
            <div className="relative aspect-ginseng overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                loading="lazy"
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gold-400 text-forest-900">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-display text-lg font-semibold text-forest-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <div className="text-base font-display font-bold text-forest-900">
                {formatPrice(product.price, lang)}
              </div>
            </div>
          </a>
        ))}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label={lang === 'vi' ? 'Xem thêm sản phẩm' : 'More products'}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-11 h-11 rounded-full bg-white shadow-elegant-lg items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5 text-forest-900" />
        </button>
      )}
    </div>
  );
}
