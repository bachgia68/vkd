import { useState, type ReactNode } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * [TEST — keen-slider, nhánh test/keen-slider-swipe-carousel] Carousel vuot
 * ngang chuan cua site (kieu kgc.co.kr): keen-slider free-snap + slide dang
 * active "noi len" (scale + shadow). Dung chung cho moi khoi anh/video/the
 * bai viet vuot duoc — dung lai component nay, dung tu viet lai co che moi
 * lan (xem docs/DESIGN_SYSTEM.md muc 7).
 */
// keen-slider's own stylesheet sets `.keen-slider__slide { width: 100% }`,
// which wins over Tailwind's plain w-[..] utility (equal specificity, and
// Tailwind's JIT scanner can't see a className built at runtime to add the
// `!important` suffix, since it only scans literal strings in source). So
// slide width is instead re-declared as hand-written CSS text, parsed from
// the same `w-[NNpx]` / `variant:w-[NNpx]` tokens callers already pass.
const TAILWIND_BREAKPOINTS: Record<string, number> = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };

function buildSlideWidthCss(slideWidthClassName: string, scopeClass: string): string {
  return slideWidthClassName
    .split(' ')
    .filter(Boolean)
    .map((token) => token.match(/^(?:([a-z0-9]+):)?w-\[(\d+)px\]$/))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map(([, variant, px]) => {
      const rule = `.${scopeClass}{width:${px}px!important}`;
      const minWidth = variant ? TAILWIND_BREAKPOINTS[variant] : undefined;
      return minWidth ? `@media(min-width:${minWidth}px){${rule}}` : rule;
    })
    .join('');
}

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

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    mode: 'free-snap',
    slides: { perView: 'auto', spacing: 16 },
    slideChanged(slider) {
      setActiveIndex(slider.track.details.rel);
    },
  });

  if (items.length === 0) return null;

  const slideWidthCss = buildSlideWidthCss(slideWidthClassName, 'ta-swipe-slide');

  return (
    <div>
      {slideWidthCss && <style>{slideWidthCss}</style>}
      <div className="relative">
        <div ref={sliderRef} className="keen-slider pb-2">
          {items.map((item, index) => (
            <div
              key={getKey(item, index)}
              className={`keen-slider__slide ta-swipe-slide flex-shrink-0 ${slideWidthClassName}`}
            >
              {renderSlide(item, index === activeIndex)}
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => instanceRef.current?.prev()}
              aria-label={ariaLabelPrev}
              className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-elegant text-forest-700 hover:bg-gold-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => instanceRef.current?.next()}
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
              onClick={() => instanceRef.current?.moveToIdx(index)}
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
