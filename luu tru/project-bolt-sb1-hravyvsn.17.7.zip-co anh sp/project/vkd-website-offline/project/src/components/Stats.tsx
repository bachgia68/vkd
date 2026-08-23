import { Calendar, MapPin, Package, Globe } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

interface StatsProps {
  lang: Language;
}

export default function Stats({ lang }: StatsProps) {
  const t = translations[lang];

  const stats = [
    { icon: Calendar, value: t.stats.years, label: t.stats.yearsLabel, color: 'forest' },
    { icon: MapPin, value: t.stats.regions, label: t.stats.regionsLabel, color: 'gold' },
    { icon: Package, value: t.stats.products, label: t.stats.productsLabel, color: 'forest' },
    { icon: Globe, value: t.stats.countries, label: t.stats.countriesLabel, color: 'gold' },
  ];

  return (
    <section className="relative -mt-16 z-20">
      <div className="container-wide">
        <div className="bg-cream-50 rounded-2xl shadow-elegant-lg overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const isGold = stat.color === 'gold';

              return (
                <div
                  key={index}
                  className={`relative p-8 md:p-10 text-center group ${
                    index < stats.length - 1 ? 'border-r border-cream-200 lg:border-r' : ''
                  } ${index < 2 ? 'border-b border-cream-200 lg:border-b-0' : ''}`}
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isGold ? 'bg-gold-50' : 'bg-forest-50'
                    }`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                        isGold ? 'bg-gold-100 group-hover:bg-gold-200' : 'bg-forest-100 group-hover:bg-forest-200'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isGold ? 'text-gold-600' : 'text-forest-700'}`} />
                    </div>

                    <div
                      className={`text-4xl md:text-5xl font-display font-bold mb-2 ${
                        isGold ? 'text-gold-600' : 'text-forest-800'
                      }`}
                    >
                      {stat.value}
                    </div>

                    <div className="text-forest-500 text-sm font-medium">{stat.label}</div>
                  </div>

                  <svg
                    className={`absolute top-0 right-0 w-16 h-16 opacity-10 ${index === stats.length - 1 ? 'hidden' : ''}`}
                    viewBox="0 0 50 50"
                  >
                    <path d="M50 0 L50 50 L0 50" fill="none" stroke="currentColor" strokeWidth="1" className={isGold ? 'text-gold-500' : 'text-forest-500'} />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
