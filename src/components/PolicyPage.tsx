import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { getPolicyContent, type PolicyKey } from '../data/policyContent';
import { fetchPolicyPage } from '../lib/siteContentApi';

interface PolicyPageProps {
  policyKey: PolicyKey;
  lang: Language;
  onNavigate?: (page: string) => void;
}

export default function PolicyPage({ policyKey, lang, onNavigate }: PolicyPageProps) {
  const isRTL = lang === 'ar';
  const fallback = getPolicyContent(policyKey, lang);
  const backLabel = lang === 'vi' ? 'Về trang chủ' : 'Back to home';
  const [cmsTitle, setCmsTitle] = useState<string | null>(null);
  const [cmsBody, setCmsBody] = useState<string | null>(null);
  const [cmsUpdated, setCmsUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetchPolicyPage(policyKey).then((d) => {
      if (d) { setCmsTitle(d.title_vi); setCmsBody(d.body_vi); setCmsUpdated(d.updated_label); }
    }).catch(() => {});
  }, [policyKey]);

  const title = cmsTitle || fallback.title;
  const updated = cmsUpdated || fallback.updated;

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

        <h1 className="font-display text-display-sm md:text-display-md text-forest-900 mb-2">{title}</h1>
        <p className="text-sm text-forest-500 mb-10">{updated}</p>

        <div className="space-y-4">
          {cmsBody ? (
            cmsBody.split('\n').filter(Boolean).map((para, i) => (
              <p key={i} className="text-forest-700 leading-relaxed">{para}</p>
            ))
          ) : (
            fallback.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-display text-lg font-semibold text-forest-900 mb-2">{section.heading}</h2>
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-forest-700 leading-relaxed mb-2">{paragraph}</p>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
