import { Award, ShieldCheck, Leaf, Globe } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

interface CertificationsProps {
  lang: Language;
}

export default function Certifications({ lang }: CertificationsProps) {
  const t = translations[lang];

  const certifications = [
    {
      icon: ShieldCheck,
      name: 'cGMP',
      desc: 'Current Good Manufacturing Practice',
    },
    {
      icon: Leaf,
      name: 'HACCP',
      desc: 'Hazard Analysis Critical Control Points',
    },
    {
      icon: Award,
      name: 'ISO 9001',
      desc: 'Quality Management System',
    },
    {
      icon: Globe,
      name: 'ISO 22000',
      desc: 'Food Safety Management',
    },
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

        {/* Certifications Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            const isGold = index % 2 === 1;

            return (
              <div
                key={index}
                className="group flex flex-col items-center text-center p-6 rounded-xl bg-white hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 ${
                    isGold ? 'bg-gold-100 group-hover:bg-gold-200' : 'bg-forest-100 group-hover:bg-forest-200'
                  }`}
                >
                  <Icon className={`w-7 h-7 ${isGold ? 'text-gold-600' : 'text-forest-700'}`} />
                </div>
                <h4 className="font-display text-lg font-semibold text-forest-900 mb-1">
                  {cert.name}
                </h4>
                <p className="text-forest-500 text-xs">{cert.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
