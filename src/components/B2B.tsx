import { useState } from 'react';
import { Building2, TrendingUp, Package, ArrowRight } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import PartnerRegisterModal from './PartnerRegisterModal';
import type { B2BLeadType } from '../lib/siteContentApi';

interface B2BProps {
  lang: Language;
}

export default function B2B({ lang }: B2BProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';
  const [openType, setOpenType] = useState<B2BLeadType | null>(null);

  const partnershipTypes: { icon: typeof Building2; title: string; desc: string; color: string; type: B2BLeadType }[] = [
    {
      icon: Building2,
      title: t.b2b.distributorTitle,
      desc: t.b2b.distributorDesc,
      color: 'forest',
      type: 'distributor',
    },
    {
      icon: TrendingUp,
      title: t.b2b.investorTitle,
      desc: t.b2b.investorDesc,
      color: 'gold',
      type: 'investor',
    },
    {
      icon: Package,
      title: t.b2b.oemTitle,
      desc: t.b2b.oemDesc,
      color: 'forest',
      type: 'oem',
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
              <button
                key={index}
                onClick={() => setOpenType(type.type)}
                className="text-left bg-white rounded-2xl p-8 shadow-elegant hover:shadow-elegant-lg transition-all duration-500 group hover:-translate-y-1"
              >
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
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-white rounded-2xl shadow-elegant">
            <div className="text-forest-700 font-medium">
              {t.b2b.title}
            </div>
            <button onClick={() => setOpenType('distributor')} className="btn-gold">
              {t.b2b.cta}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {openType && <PartnerRegisterModal type={openType} onClose={() => setOpenType(null)} />}
    </section>
  );
}
