import { MapPin, Check } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

interface AboutProps {
  lang: Language;
}

export default function About({ lang }: AboutProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';

  const regions = [
    { name: t.about.region1Name, desc: t.about.region1Desc, coords: '14°36\'N 107°48\'E' },
    { name: t.about.region2Name, desc: t.about.region2Desc, coords: '15°12\'N 108°18\'E' },
    { name: t.about.region3Name, desc: t.about.region3Desc, coords: '19°24\'N 104°54\'E' },
  ];

  const features =
    lang === 'vi'
      ? ['Sâm thật 100%', 'GACP Certified', 'R&D với GS/TS', 'Chuỗi cung ứng minh bạch']
      : lang === 'en'
      ? ['100% Authentic', 'GACP Certified', 'R&D with PhDs', 'Transparent Supply Chain']
      : lang === 'zh'
      ? ['100%正品', 'GACP认证', '博士研发', '透明供应链']
      : lang === 'fr'
      ? ['100% Authentique', 'Certifié GACP', 'R&D avec Docteurs', 'Chaîne Transparente']
      : ['100% أصلي', 'معتمد GACP', 'بحث مع دكاترة', 'سلسلة شفافة'];

  return (
    <section id="about" className="section-padding bg-cream-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-100 rounded-full">
              <span className="w-2 h-2 bg-forest-500 rounded-full" />
              <span className="text-xs font-semibold tracking-wider uppercase text-forest-700">
                {t.about.label}
              </span>
            </div>

            <h2 className="font-display text-display-sm md:text-display-md text-forest-900">
              {t.about.title}
              {t.about.titleHighlight && (
                <span className="text-gradient-primary block mt-2">{t.about.titleHighlight}</span>
              )}
            </h2>

            <div className="space-y-4 text-forest-600 leading-relaxed">
              <p className="text-lg">{t.about.description1}</p>
              <p>{t.about.description2}</p>
              <p>{t.about.description3}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-forest-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-forest-600" />
                  </div>
                  <span className="text-forest-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <a href="#heritage" className="btn-primary inline-flex">
              {t.about.cta}
            </a>
          </div>

          {/* Visual Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant-lg">
              <img
                src="/assets/images/sam-ngoc-linh-plant.png"
                alt="Panax Vietnamensis"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-900/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-white/80 text-sm mb-2 italic">Panax Vietnamensis</p>
                <h3 className="font-display text-2xl text-white mb-1">Sâm Ngọc Linh</h3>
                <p className="text-gold-400 text-sm">{t.hero.badge}</p>
              </div>
            </div>

            {/* Region Cards */}
            <div className="absolute -right-4 top-1/4 space-y-4 hidden lg:block">
              {regions.slice(0, 2).map((region, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-elegant-lg p-4 w-56 animate-slide-in-right"
                  style={{ animationDelay: `${(i + 1) * 200}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-forest-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-forest-900 text-sm">{region.name}</h4>
                      <p className="text-forest-400 text-xs mt-0.5">{region.coords}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute -left-4 bottom-8 hidden lg:block">
              <div
                className="bg-white rounded-xl shadow-elegant-lg p-4 w-56 animate-slide-in-left"
                style={{ animationDelay: '600ms' }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-forest-900 text-sm">{regions[2].name}</h4>
                    <p className="text-forest-400 text-xs mt-0.5">{regions[2].coords}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
