import { FlaskConical, Building2, Microscope } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

interface HeritageProps {
  lang: Language;
}

export default function Heritage({ lang }: HeritageProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';

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

        {/* Saponin highlight banner */}
        <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-forest-900 to-forest-700 p-10 md:p-16">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-forest-400/15 rounded-full blur-[100px]" />

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-gold-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
                {t.heritage.saponinTypes}
              </span>
              <h3 className="font-display text-5xl md:text-6xl text-white mb-4">
                {t.heritage.saponinCount}
              </h3>
              <p className="text-white/70 leading-relaxed max-w-md">
                {t.heritage.saponinDesc}
              </p>
            </div>

            {/* Saponin visual */}
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <svg viewBox="0 0 200 200" className="w-56 h-56 md:w-72 md:h-72">
                  {/* Concentric circles */}
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.2" />
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.3" />
                  <circle cx="100" cy="100" r="50" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
                  <circle cx="100" cy="100" r="30" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />

                  {/* Molecular dots */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2;
                    const r = 90;
                    const x = 100 + Math.cos(angle) * r;
                    const y = 100 + Math.sin(angle) * r;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#D4AF37"
                        opacity="0.8"
                        className="animate-pulse-slow"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    );
                  })}

                  {/* Center molecule */}
                  <circle cx="100" cy="100" r="12" fill="#D4AF37" />
                  <circle cx="100" cy="100" r="6" fill="#0B2F1D" />

                  {/* Connecting lines */}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const angle = (i / 6) * Math.PI * 2;
                    const x = 100 + Math.cos(angle) * 30;
                    const y = 100 + Math.sin(angle) * 30;
                    return (
                      <line
                        key={i}
                        x1="100"
                        y1="100"
                        x2={x}
                        y2={y}
                        stroke="#D4AF37"
                        strokeWidth="1.5"
                        opacity="0.5"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
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
