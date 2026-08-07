import { ArrowLeft } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { getPolicyContent, type PolicyKey } from '../data/policyContent';

interface PolicyPageProps {
  policyKey: PolicyKey;
  lang: Language;
  onNavigate?: (page: string) => void;
}

export default function PolicyPage({ policyKey, lang, onNavigate }: PolicyPageProps) {
  const isRTL = lang === 'ar';
  const content = getPolicyContent(policyKey, lang);
  const backLabel = lang === 'vi' ? 'Về trang chủ' : 'Back to home';

  return (
    <section className="section-padding bg-cream-50 min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide max-w-3xl">
        <button
          onClick={() => onNavigate?.('home')}
          className="inline-flex items-center gap-2 text-sm text-forest-600 hover:text-forest-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {backLabel}
        </button>

        <h1 className="font-display text-display-sm md:text-display-md text-forest-900 mb-2">
          {content.title}
        </h1>
        <p className="text-sm text-forest-500 mb-10">{content.updated}</p>

        <div className="space-y-8">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-lg font-semibold text-forest-900 mb-2">
                {section.heading}
              </h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="text-forest-700 leading-relaxed mb-2">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
