import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Share2, MessageCircle, Music2, Video, Link2 } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations, languageNames } from '../i18n/translations';
import {
  fetchContactPhones,
  fetchSocialLinks,
  fetchVisibleLanguages,
  fetchTextOverrides,
  type ContactPhone,
  type SocialLink,
  type SiteLanguage,
} from '../lib/siteContentApi';

const FALLBACK_LANGUAGES: SiteLanguage[] = (['vi', 'en', 'zh', 'fr', 'ar'] as Language[]).map((key, i) => ({
  id: key,
  key,
  label: languageNames[key],
  sort_order: i,
}));

const NAV_OVERRIDE_KEYS: Partial<Record<string, string>> = {
  home: 'header.nav.home',
  about: 'header.nav.about',
  products: 'header.nav.products',
  traceability: 'header.nav.traceability',
  b2b: 'header.nav.partnership',
};

interface FooterProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  onNavigate?: (page: string) => void;
}

const SOCIAL_ICONS: Record<string, typeof Share2> = {
  Facebook: Link2,
  TikTok: Music2,
  YouTube: Video,
  Instagram: Link2,
  Zalo: MessageCircle,
  WhatsApp: Share2,
};

export default function Footer({ lang, onLangChange, onNavigate }: FooterProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';
  const [phones, setPhones] = useState<ContactPhone[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [languages, setLanguages] = useState<SiteLanguage[]>(FALLBACK_LANGUAGES);
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchContactPhones().then(setPhones).catch(() => setPhones([]));
    fetchSocialLinks().then(setSocialLinks).catch(() => setSocialLinks([]));
    fetchVisibleLanguages()
      .then((rows) => setLanguages(rows.length > 0 ? rows : FALLBACK_LANGUAGES))
      .catch(() => setLanguages(FALLBACK_LANGUAGES));
    fetchTextOverrides().then(setOverrides).catch(() => setOverrides({}));
  }, []);

  const navLabel = (key: string) => {
    const overrideKey = NAV_OVERRIDE_KEYS[key];
    const fallback = t.nav[key as keyof typeof t.nav] ?? key;
    return (overrideKey && overrides[overrideKey]) || fallback;
  };

  // "traceability" và "contact" trỏ tới trang/khối còn tồn tại thật;
  // "about" đi tới trang FounderStory chuẩn (không phải anchor #about đã bị
  // gỡ khỏi trang chủ ở bản nâng cấp Phase 1); "b2b" cuộn tới khối B2B vẫn
  // còn trên trang chủ.
  const navItems = [
    { key: 'home', page: 'home' },
    { key: 'about', page: 'about-story' },
    { key: 'products', page: 'catalog' },
    { key: 'traceability', page: 'traceability' },
    { key: 'b2b', page: 'home', anchor: 'b2b' },
    { key: 'contact', page: 'home', anchor: 'contact' },
  ];

  const handleFooterNav = (page: string, anchor?: string) => {
    onNavigate?.(page);
    if (anchor) {
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer id="contact" className="bg-forest-950 text-white pt-20 pb-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img
                src="/assets/images/TA_logo_clean.png"
                alt="TA — Sàn giao dịch Sâm Ngọc Linh"
                className="h-16 w-auto object-contain"
              />
            </div>

            <p className="text-forest-300 leading-relaxed mb-6">
              {overrides['footer.brandDesc'] ?? t.footer.brandDesc}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => {
                const Icon = SOCIAL_ICONS[link.platform] ?? Link2;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="w-10 h-10 rounded-lg bg-forest-800 hover:bg-forest-600 flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-6 text-gold-400">{overrides['footer.quickLinks'] ?? t.footer.quickLinks}</h5>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => handleFooterNav(item.page, item.anchor)}
                    className="text-forest-300 hover:text-white transition-colors text-left"
                  >
                    {navLabel(item.key)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-semibold mb-6 text-gold-400">{overrides['footer.contact'] ?? t.footer.contact}</h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="text-forest-300">{t.footer.address}</span>
              </li>
              {phones.map((phone) => (
                <li key={phone.id} className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <a
                    href={`tel:${phone.value.replace(/[^\d+]/g, '')}`}
                    className="text-forest-300 hover:text-white transition-colors"
                  >
                    {phone.label}: {phone.value}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <a href="mailto:duyenmoc08@gmail.com" className="text-forest-300 hover:text-white transition-colors">
                  duyenmoc08@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Language Selector */}
          <div>
            <h5 className="font-semibold mb-6 text-gold-400">{overrides['footer.followUs'] ?? t.footer.followUs}</h5>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((l) => (
                <button
                  key={l.key}
                  onClick={() => onLangChange(l.key as Language)}
                  className={`px-3 py-2 text-sm rounded-lg transition-all ${
                    l.key === lang
                      ? 'bg-gold-400 text-forest-900 font-medium'
                      : 'bg-forest-800 text-forest-300 hover:bg-forest-700 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-forest-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-forest-400 text-sm">
              {t.footer.copyright}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-forest-400 text-sm">
              <button
                onClick={() => handleFooterNav('policy-privacy')}
                className="hover:text-white transition-colors"
              >
                {t.policies.privacy}
              </button>
              <button
                onClick={() => handleFooterNav('policy-terms')}
                className="hover:text-white transition-colors"
              >
                {t.policies.terms}
              </button>
              <button
                onClick={() => handleFooterNav('policy-shipping')}
                className="hover:text-white transition-colors"
              >
                {t.policies.shipping}
              </button>
              <button
                onClick={() => handleFooterNav('policy-refund')}
                className="hover:text-white transition-colors"
              >
                {t.policies.refund}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
