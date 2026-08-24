import type { ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

/**
 * Wrapper scroll-reveal dung chung (khong them thu vien animation).
 * Dung o .map() duoc vi tu goi hook rieng trong component con.
 */
export default function Reveal({
  children,
  delayMs = 0,
  className = '',
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const { ref, revealed } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{ transitionDelay: revealed ? `${delayMs}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
