import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Carousel vuot ngang chuan cua site (kieu kgc.co.kr): scroll-snap + slide
 * dang active "noi len" (scale + shadow). Dung chung cho moi khoi anh/video/
 * the bai viet vuot duoc — dung lai component nay, dung tu viet lai co che
 * IntersectionObserver moi lan (xem docs/DESIGN_SYSTEM.md muc 7).
 */
interface SwipeCarouselProps<T> {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderSlide: (item: T, isActive: boolean) => ReactNode;
  slideWidthClassName?: string;
  ariaLabelPrev?: string;
  ariaLabelNext?: string;
  showDots?: boolean;
}

export default function SwipeCarousel<T>({
  items,
  getKey,
  renderSlide,
  slideWidthClassName = 'w-[280px] md:w-[360px]',
  ariaLabelPrev = 'Trước',
  ariaLabelNext = 'Sau',
  showDots = true,
}: SwipeCarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: track, threshold: 0.6 }
    );

    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const scrollToSlide = (index: number) => {
    slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const scrollByAmount = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = slideRefs.current[0];
    const slideWidth = slide ? slide.offsetWidth + 16 : 300;
    track.scrollBy({ left: direction * slideWidth, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <div>
      <div className="relative">
        <div ref={trackRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth">
          {items.map((item, index) => (
            <div
              key={getKey(item, index)}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className={`snap-center flex-shrink-0 ${slideWidthClassName}`}
            >
              {renderSlide(item, index === activeIndex)}
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollByAmount(-1)}
              aria-label={ariaLabelPrev}
              className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-elegant text-forest-700 hover:bg-gold-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(1)}
              aria-label={ariaLabelNext}
              className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white shadow-elegant text-forest-700 hover:bg-gold-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {showDots && items.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {items.map((item, index) => (
            <button
              key={getKey(item, index)}
              type="button"
              onClick={() => scrollToSlide(index)}
              aria-label={`${ariaLabelNext} ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex ? 'w-6 h-2 bg-gold-400' : 'w-2 h-2 bg-forest-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Khung anh tu dong vua khung — thay the object-cover cat mat khi anh khong
 * dung ty le khung (chung chi/tai lieu scan, poster...). fit="contain" giu
 * nguyen toan bo anh (khong cat), nen mo bg-cream-50 lap khoang trong.
 * fit="cover" (mac dinh) lap day khung, dung cho anh chup thuong (vuon, san
 * pham) khong so mat noi dung quan trong o ria.
 */
export function CarouselImage({
  src,
  alt,
  fit = 'cover',
  className = '',
}: {
  src: string;
  alt: string;
  fit?: 'cover' | 'contain';
  className?: string;
}) {
  return (
    <div className={`w-full h-full ${fit === 'contain' ? 'bg-cream-50' : ''} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full ${fit === 'contain' ? 'object-contain p-3' : 'object-cover'}`}
      />
    </div>
  );
}
