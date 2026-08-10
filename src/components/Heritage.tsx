import { useEffect, useState } from 'react';
import { FlaskConical, Building2, Microscope } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { fetchHeritageGalleryImages, type HeritageGalleryImage } from '../lib/siteContentApi';

interface HeritageProps {
  lang: Language;
}

export default function Heritage({ lang }: HeritageProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';
  const [galleryImages, setGalleryImages] = useState<HeritageGalleryImage[]>([]);

  useEffect(() => {
    fetchHeritageGalleryImages()
      .then(setGalleryImages)
      .catch(() => setGalleryImages([]));
  }, []);

  const pillars = [
    {
      icon: Building2,
      title: t.heritage.scaleTitle,
      desc: t.heritage.scaleDesc,
      accent: 'forest',
    },
    {
      icon: Microscope,
      title: t.heritage.authorityTitle,
      desc: t.heritage.authorityDesc,
      accent: 'gold',
    },
    {
      icon: FlaskConical,
      title: t.heritage.saponinTitle,
      desc: t.heritage.saponinDesc,
      accent: 'forest',
    },
  ];

  return (
    <section id="heritage" className="section-padding bg-cream-100" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-100 rounded-full mb-6">
            <span className="w-2 h-2 bg-gold-400 rounded-full" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold-700">
              {t.heritage.label}
            </span>
          </div>
          <h2 className="font-display text-display-sm md:text-display-md text-forest-900 mb-6">
            {t.heritage.title}
          </h2>
          <p className="text-forest-600 text-lg leading-relaxed">
            {t.heritage.subtitle}
          </p>
        </div>

        {/* Saponin highlight — the running product strip that used to live here
            was removed: it duplicated the swipeable Products carousel already
            shown earlier on the homepage (per Joe's decision), and this page
            was already flagged for having too many sections. */}
        <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-forest-900 to-forest-700">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-forest-400/15 rounded-full blur-[100px]" />

          <div className="relative z-10 px-8 md:px-16 py-10 md:py-14 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-gold-400 text-sm font-semibold tracking-wider uppercase mb-3 block">
                {t.heritage.saponinTypes}
              </span>
              <h3 className="font-display text-4xl md:text-5xl text-white leading-none">
                {t.heritage.saponinCount}
                <span className="text-white/60 text-lg md:text-xl font-sans font-normal ml-3 align-middle">
                  {t.heritage.saponinDesc}
                </span>
              </h3>
            </div>
          </div>
        </div>

        {/* Photo gallery */}
        <div className="mb-16">
          <h3 className="font-display text-2xl md:text-3xl text-forest-900 mb-6 text-center">
            {t.heritage.galleryLabel}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square overflow-hidden rounded-2xl shadow-elegant"
              >
                <img
                  src={photo.image_url}
                  alt={(lang === 'vi' ? photo.alt_vi : photo.alt_en) || photo.alt_vi}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Three pillars grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isGold = pillar.accent === 'gold';

            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-elegant hover:shadow-elegant-lg transition-all duration-500 hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${
                    isGold ? 'bg-gold-100' : 'bg-forest-100'
                  }`}
                >
                  <Icon className={`w-7 h-7 ${isGold ? 'text-gold-600' : 'text-forest-700'}`} />
                </div>
                <h3 className="font-display text-xl font-semibold text-forest-900 mb-3">
                  {pillar.title}
                </h3>
                <p className="text-forest-600 leading-relaxed text-sm">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
