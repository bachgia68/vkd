import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import SwipeCarousel, { CarouselImage } from './ui/SwipeCarousel';

interface CertificationsProps {
  lang: Language;
}

const certNames: Record<Language, { cgmp: string; haccp: string; iso9001: string; iso22000: string; ginseng: string }> = {
  vi: {
    cgmp: 'cGMP',
    haccp: 'HACCP CODEX 2020',
    iso9001: 'ISO 9001:2015',
    iso22000: 'ISO 22000:2018',
    ginseng: 'Chứng Nhận Sâm Ngọc Linh',
  },
  en: {
    cgmp: 'cGMP',
    haccp: 'HACCP CODEX 2020',
    iso9001: 'ISO 9001:2015',
    iso22000: 'ISO 22000:2018',
    ginseng: 'Ngoc Linh Ginseng Certification',
  },
  zh: {
    cgmp: 'cGMP 认证',
    haccp: 'HACCP CODEX 2020',
    iso9001: 'ISO 9001:2015',
    iso22000: 'ISO 22000:2018',
    ginseng: '玉琳参认证',
  },
  fr: {
    cgmp: 'cGMP',
    haccp: 'HACCP CODEX 2020',
    iso9001: 'ISO 9001:2015',
    iso22000: 'ISO 22000:2018',
    ginseng: 'Certification Ginseng Ngoc Linh',
  },
  ar: {
    cgmp: 'cGMP',
    haccp: 'HACCP CODEX 2020',
    iso9001: 'ISO 9001:2015',
    iso22000: 'ISO 22000:2018',
    ginseng: 'شهادة جينسنغ نوك لين',
  },
};

const certDesc: Record<Language, string> = {
  vi: 'Chứng chỉ gốc — sản phẩm chính hãng TA',
  en: 'Original certificate — Authentic TA product',
  zh: '原始证书 — TA正品认证',
  fr: 'Certificat original — Produit authentique TA',
  ar: 'الشهادة الأصلية — منتج TA أصلي',
};

export default function Certifications({ lang }: CertificationsProps) {
  const t = translations[lang];
  const names = certNames[lang];
  const [preview, setPreview] = useState<{ src: string; name: string } | null>(null);

  const certifications = [
    { image: '/certifications/cgmp.jpg', name: names.cgmp },
    { image: '/certifications/haccp-codex-2020.jpg', name: names.haccp },
    { image: '/certifications/iso-9001-2015.jpg', name: names.iso9001 },
    { image: '/certifications/iso-22000-2018.jpg', name: names.iso22000 },
    { image: '/certifications/chung-nhan-sam-1.jpg', name: `${names.ginseng} 1` },
    { image: '/certifications/chung-nhan-sam-2.jpg', name: `${names.ginseng} 2` },
    { image: '/certifications/chung-nhan-sam-3.jpg', name: `${names.ginseng} 3` },
  ];

  return (
    <section className="section-padding-sm bg-cream-100">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="font-display text-3xl md:text-4xl uppercase tracking-wide text-forest-900 mb-3">
            {t.certifications.title}
          </h3>
          <p className="text-forest-500">{t.certifications.subtitle}</p>
        </div>

        {/* Certifications Carousel — real scanned certificates, logo-style layout */}
        <SwipeCarousel
          items={certifications}
          getKey={(_cert, index) => String(index)}
          slideWidthClassName="w-[180px] md:w-[220px]"
          ariaLabelPrev={lang === 'vi' ? 'Chứng chỉ trước' : 'Previous certificate'}
          ariaLabelNext={lang === 'vi' ? 'Chứng chỉ sau' : 'Next certificate'}
          renderSlide={(cert, isActive) => (
            <button
              onClick={() => setPreview({ src: cert.image, name: cert.name })}
              className="group flex flex-col items-center text-center w-full"
            >
              <div
                className={`relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-cream-50 transition-all duration-500 ease-out ${
                  isActive ? 'scale-105 shadow-elegant-lg opacity-100' : 'scale-95 opacity-70'
                }`}
              >
                <CarouselImage src={cert.image} alt={cert.name} fit="contain" />
                <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/20 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <p className="mt-4 text-forest-900 text-base font-bold leading-snug">{cert.name}</p>
            </button>
          )}
        />
      </div>

      {/* Lightbox */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-forest-950/90 flex items-center justify-center p-6"
          onClick={() => setPreview(null)}
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={preview.src}
              alt={preview.name}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <p className="text-center text-cream-100 text-sm font-semibold mt-4">{preview.name}</p>
            <p className="text-center text-cream-300 text-xs mt-1">{certDesc[lang]}</p>
          </div>
        </div>
      )}
    </section>
  );
}
