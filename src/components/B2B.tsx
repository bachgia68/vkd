import { Building2, TrendingUp, Package, ArrowRight } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

interface B2BProps {
  lang: Language;
}

export default function B2B({ lang }: B2BProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';

  const partnershipTypes = [
    {
      icon: Building2,
      title: t.b2b.distributorTitle,
      desc: t.b2b.distributorDesc,
      color: 'forest',
    },
    {
      icon: TrendingUp,
      title: t.b2b.investorTitle,
      desc: t.b2b.investorDesc,
      color: 'gold',
    },
    {
      icon: Package,
      title: t.b2b.oemTitle,
      desc: t.b2b.oemDesc,
      color: 'forest',
    },
  ];

  return (
    <section id="b2b" className="section-padding bg-cream-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-100 rounded-full mb-6">
            <span className="w-2 h-2 bg-forest-500 rounded-full" />
            <span className="text-xs font-semibold tracking-wider uppercase text-forest-700">
              {t.b2b.label}
            </span>
          </div>

          <h2 className="font-display text-display-sm md:text-display-md text-forest-900 mb-6">
            {t.b2b.title}
          </h2>
          <p className="text-forest-600 text-lg leading-relaxed">
            {t.b2b.subtitle}
          </p>
        </div>

        {/* Partnership Types */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {partnershipTypes.map((type, index) => {
            const Icon = type.icon;
            const isGold = type.color === 'gold';

            return (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-elegant hover:shadow-elegant-lg transition-all duration-500 group hover:-translate-y-1">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${
                    isGold ? 'bg-gold-100 group-hover:bg-gold-200' : 'bg-forest-100 group-hover:bg-forest-200'
                  }`}
                >
                  <Icon className={`w-8 h-8 ${isGold ? 'text-gold-600' : 'text-forest-700'}`} />
                </div>

                <h3 className="font-display text-xl font-semibold text-forest-900 mb-3">
                  {type.title}
                </h3>
                <p className="text-forest-600 leading-relaxed">{type.desc}</p>

                <div className="mt-6 flex items-center gap-2">
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isGold ? 'text-gold-600 group-hover:text-gold-700' : 'text-forest-600 group-hover:text-forest-700'
                    }`}
                  >
                    {t.b2b.cta}
                  </span>
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* International Markets */}
        <div className="bg-gradient-to-br from-forest-900 to-forest-950 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl md:text-3xl mb-3">
              {t.international.title}
            </h3>
            <p className="text-white/70">{t.international.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: t.international.marketCn, flag: 'CN' },
              { name: t.international.marketEu, flag: 'EU' },
              { name: t.international.marketMe, flag: 'ME' },
              { name: t.international.marketSea, flag: 'SEA' },
            ].map((market, i) => (
              <div
                key={i}
                className="text-center p-6 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-colors"
              >
                <div className="text-3xl font-display font-bold text-gold-400 mb-2">
                  {market.flag}
                </div>
                <p className="text-white text-sm font-medium">{market.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-white rounded-2xl shadow-elegant">
            <div className="text-forest-700 font-medium">
              {t.b2b.title}
            </div>
            <a href="#contact" className="btn-gold">
              {t.b2b.cta}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
