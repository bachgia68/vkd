import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-reveal thuan CSS + IntersectionObserver, khong them thu vien
 * (khong framer-motion/GSAP) - dung chung theo chuan taste-skill Section 5.C
 * (whileInView tuong duong) nhung khong doi stack da khoa cua site.
 * Dung: const { ref, revealed } = useScrollReveal(); className={revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, revealed };
}
