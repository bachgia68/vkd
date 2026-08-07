import { useEffect, useState } from 'react';
import { Quote, Newspaper, Camera } from 'lucide-react';
import { fetchTrustProofItems, type TrustProofItem } from '../lib/siteContentApi';
import type { Language } from '../i18n/translations';

const KIND_ICON = { testimonial: Quote, press: Newspaper, photo: Camera } as const;

export default function TrustProof({ lang }: { lang: Language }) {
  const [items, setItems] = useState<TrustProofItem[]>([]);
  const isRTL = lang === 'ar';

  useEffect(() => {
    let cancelled = false;
    fetchTrustProofItems()
      .then((data) => { if (!cancelled) setItems(data); })
      .catch(() => { if (!cancelled) setItems([]); });
    return () => { cancelled = true; };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="section-padding-sm bg-cream-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => {
            const Icon = KIND_ICON[item.kind];
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-cream-200 p-6">
                {item.image_url && (
                  <img src={item.image_url} alt={item.source_name} className="w-full h-40 object-cover rounded-xl mb-4" loading="lazy" />
                )}
                <Icon className="w-5 h-5 text-gold-500 mb-3" />
                <p className="text-forest-800 text-sm leading-relaxed mb-3">{item.quote_text}</p>
                {item.source_url ? (
                  <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-forest-500 hover:text-gold-600 underline underline-offset-2">
                    {item.source_name}
                  </a>
                ) : (
                  <span className="text-xs text-forest-500">{item.source_name}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
