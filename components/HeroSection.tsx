'use client';

import { useHeader } from '@/lib/hooks/useHeader';

export default function HeroSection() {
  const { header, loading, error } = useHeader();

  if (loading) {
    return (
      <section className="w-full h-96 bg-gradient-to-r from-gold to-cream flex items-center justify-center">
        <p className="text-gray-600">Đang tải...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full h-96 bg-gradient-to-r from-gold to-cream flex items-center justify-center">
        <p className="text-red-600">Lỗi: {error}</p>
      </section>
    );
  }

  if (!header) {
    return (
      <section className="w-full h-96 bg-gradient-to-r from-gold to-cream flex items-center justify-center">
        <p className="text-gray-600">Chưa cấu hình hero section</p>
      </section>
    );
  }

  return (
    <section className="w-full min-h-96 bg-gradient-to-r from-gold via-cream to-navy flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {header.heroTitle && (
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
            {header.heroTitle}
          </h1>
        )}
        {header.heroSubtitle && (
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            {header.heroSubtitle}
          </p>
        )}
        {header.ctaButtonText && header.ctaButtonLink && (
          <a
            href={header.ctaButtonLink}
            className={`inline-block px-8 py-3 rounded-lg font-semibold transition-all ${
              header.ctaButtonStyle === 'primary'
                ? 'bg-navy text-gold hover:bg-gray-800'
                : 'bg-gold text-navy hover:bg-yellow-600'
            }`}
          >
            {header.ctaButtonText}
          </a>
        )}
      </div>
    </section>
  );
}
