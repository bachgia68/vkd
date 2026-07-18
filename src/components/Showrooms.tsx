import { MapPin, Clock, Phone, ArrowRight } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

interface ShowroomsProps {
  lang: Language;
}

export default function Showrooms({ lang }: ShowroomsProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';

  return (
    <section id="showrooms"  className="section-padding bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-100 rounded-full mb-6">
            <span className="w-2 h-2 bg-forest-500 rounded-full" />
            <span className="text-xs font-semibold tracking-wider uppercase text-forest-700">
              {t.showrooms.label}
            </span>
          </div>
          <h2 className="font-display text-display-sm md:text-display-md text-forest-900 mb-6">
            {t.showrooms.title}
          </h2>
          <p className="text-forest-600 text-lg leading-relaxed">
            {t.showrooms.subtitle}
          </p>
        </div>

        {/* Showroom cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {t.showrooms.locations.map((location, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cream-50 to-cream-100 border border-cream-200 p-8 transition-all duration-500 hover:shadow-elegant-lg hover:border-gold-300"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="100" cy="0" r="80" fill="#0B2F1D" />
                </svg>
              </div>

              <div className="relative z-10">
                {/* Index badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-forest-900 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-gold-400" />
                  </div>
                  <span className="font-display text-3xl text-forest-200 group-hover:text-gold-200 transition-colors">
                    0{index + 1}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-display text-2xl font-semibold text-forest-900 mb-4">
                  {location.name}
                </h3>

                {/* Address */}
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="w-4 h-4 text-forest-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-forest-400 mb-1">
                      {t.showrooms.addressLabel}
                    </span>
                    <p className="text-forest-700 text-sm leading-relaxed">
                      {location.address}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3 mb-3">
                  <Clock className="w-4 h-4 text-forest-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-forest-400 mb-1">
                      {t.showrooms.hoursLabel}
                    </span>
                    <p className="text-forest-700 text-sm">{location.hours}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 mb-6">
                  <Phone className="w-4 h-4 text-forest-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-forest-400 mb-1">
                      {t.showrooms.phoneLabel}
                    </span>
                    <a
                      href={`tel:${location.phone.replace(/\s/g, '')}`}
                      className="text-forest-700 text-sm hover:text-gold-600 transition-colors"
                    >
                      {location.phone}
                    </a>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-gold-600 transition-colors group/link"
                >
                  {t.showrooms.bookVisit}
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover/link:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
