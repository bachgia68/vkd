import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { getPolicyContent, type PolicyKey } from '../data/policyContent';
import { fetchPolicyPage, type PolicySectionBlock } from '../lib/siteContentApi';

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
  const [cmsSections, setCmsSections] = useState<PolicySectionBlock[] | null>(null);
  const [cmsUpdated, setCmsUpdated] = useState<string | null>(null);

  useEffect(() => {
    // BUG DA SUA (2026-09-07): truoc day state cms* chi duoc SET khi
    // lang==='vi', nhung KHONG BAO GIO duoc RESET khi doi sang ngon ngu
    // khac hoac doi sang policyKey khac — nen doi ngon ngu VI->EN ngay
    // tren cung trang (khong reload full) de lai noi dung tieng Viet cu
    // dinh trong state, hien de len ban dich EN dung le ra phai fallback
    // ve policyContent.ts (bao cao cua Joe: "dich het ra cac ngon ngu roi
    // lai thanh tieng Viet het" — that ra la KHONG BAO GIO dich, ban VI cu
    // bi ket lai do thieu buoc reset nay). Gio LUON reset truoc, chi set
    // lai khi thuc su co du lieu VI moi cho dung policyKey dang xem.
    setCmsTitle(null);
    setCmsUpdated(null);
    setCmsSections(null);
    setCmsBody(null);
    // sections_vi chi ap dung khi lang='vi' — CMS moi ho tro 1 ngon ngu (viet),
    // cac ngon ngu khac luon dung ban dich co san trong policyContent.ts.
    if (lang !== 'vi') return;
    fetchPolicyPage(policyKey).then((d) => {
      if (!d) return;
      setCmsTitle(d.title_vi);
      setCmsUpdated(d.updated_label);
      if (d.sections_vi && d.sections_vi.length > 0) setCmsSections(d.sections_vi);
      else if (d.body_vi) setCmsBody(d.body_vi);
    }).catch(() => {});
  }, [policyKey, lang]);

  const title = cmsTitle || fallback.title;
  const updated = cmsUpdated || fallback.updated;
  const sections = cmsSections || (cmsBody ? null : fallback.sections);

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
          {sections ? (
            sections.map((section, si) => (
              <div key={si}>
                <h2 className="font-display text-lg font-semibold text-forest-900 mb-2">{section.heading}</h2>
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-forest-700 leading-relaxed mb-2">{paragraph}</p>
                ))}
              </div>
            ))
          ) : (
            (cmsBody ?? '').split('\n').filter(Boolean).map((para, i) => (
              <p key={i} className="text-forest-700 leading-relaxed">{para}</p>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
