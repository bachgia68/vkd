import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

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
  vi: 'Chứng chỉ gốc — Tập Đoàn Y Dược Sâm Ngọc Linh Việt Nam',
  en: 'Original certificate — Vietnam Ngoc Linh Ginseng Pharma Group',
  zh: '原始证书 — 越南玉琳参医药集团',
  fr: 'Certificat original — Groupe Pharmaceutique Ngoc Linh Vietnam',
  ar: 'الشهادة الأصلية — مجموعة نوك لين الدوائية الفيتنامية',
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
        <div className="text-center mb-10">
          <h3 className="font-display text-2xl text-forest-900 mb-2">
            {t.certifications.title}
          </h3>
          <p className="text-forest-500">{t.certifications.subtitle}</p>
        </div>

        {/* Certifications Grid — real scanned certificates */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <button
              key={index}
              onClick={() => setPreview({ src: cert.image, name: cert.name })}
              className="group relative flex flex-col rounded-xl bg-white overflow-hidden border border-cream-200 hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-1 text-left"
            >
              <div className="aspect-[3/4] overflow-hidden bg-cream-50">
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/20 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-3 border-t border-cream-100">
                <p className="text-forest-900 text-xs font-semibold leading-snug">{cert.name}</p>
              </div>
            </button>
          ))}
        </div>
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
