import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Share2, MessageCircle, Music2, Video, Link2 } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations, languageNames } from '../i18n/translations';
import {
  fetchContactPhones,
  fetchSocialLinks,
  fetchVisibleLanguages,
  fetchTextOverrides,
  fetchVisibleNavItems,
  type ContactPhone,
  type SocialLink,
  type SiteLanguage,
  type NavItem,
} from '../lib/siteContentApi';
import NewsletterCTA from './NewsletterCTA';
import { POLICY_PATHS } from '../lib/policyRoutes';

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
  const [dbNavItems, setDbNavItems] = useState<NavItem[]>([]);
  // site_text_overrides chỉ lưu 1 ngôn ngữ (value_vi) — admin sửa footer chỉ nhập
  // được tiếng Việt, nên override CHỈ áp dụng khi lang='vi', các ngôn ngữ khác
  // luôn dùng bản dịch t.footer.* đã có sẵn thay vì hiện tiếng Việt lẫn vào.
  const activeOverrides = lang === 'vi' ? overrides : {};

  useEffect(() => {
    fetchContactPhones().then(setPhones).catch(() => setPhones([]));
    fetchSocialLinks().then(setSocialLinks).catch(() => setSocialLinks([]));
    fetchVisibleLanguages()
      .then((rows) => setLanguages(rows.length > 0 ? rows : FALLBACK_LANGUAGES))
      .catch(() => setLanguages(FALLBACK_LANGUAGES));
    fetchTextOverrides().then(setOverrides).catch(() => setOverrides({}));
    fetchVisibleNavItems().then(setDbNavItems).catch(() => setDbNavItems([]));
  }, []);

  const navLabel = (key: string) => {
    const overrideKey = NAV_OVERRIDE_KEYS[key];
    const fallback = t.nav[key as keyof typeof t.nav] ?? key;
    return (overrideKey && activeOverrides[overrideKey]) || fallback;
  };

  // Liên Kết Nhanh giờ đọc CHUNG bảng nav_items với menu Header (quản lý ở
  // /gate-vkd-control-2026/nav-items) — thêm/xóa/ẩn/đổi thứ tự ở đó tự động
  // phản ánh xuống đây, khỏi cần trang admin riêng cho footer. "Liên hệ"
  // (cuộn tới #contact ngay trong footer) không có trong nav_items (header
  // không cần mục này) nên vẫn thêm cứng thêm vào cuối danh sách.
  const navItems: { key: string; page: string; anchor?: string; label?: string | null }[] = dbNavItems.length > 0
    ? [
        ...dbNavItems.map((i) => ({
          key: i.key,
          page: i.key === 'b2b' ? 'home' : i.href,
          anchor: i.key === 'b2b' ? 'b2b' : undefined,
          label: i.label_vi,
        })),
        { key: 'contact', page: 'home', anchor: 'contact' },
      ]
    : [
        { key: 'home', page: 'home' },
        { key: 'about', page: 'about-story' },
        { key: 'products', page: 'catalog' },
        { key: 'traceability', page: 'traceability' },
        { key: 'b2b', page: 'home', anchor: 'b2b' },
        { key: 'contact', page: 'home', anchor: 'contact' },
      ];

  // "Liên hệ" trong Liên Kết Nhanh truoc day tro thang vao <footer id="contact">
  // — khi nguoi dung DA o gan cuoi trang (dang doc footer), scrollIntoView vao
  // chinh no khong tao chuyen dong nao ca, tao cam giac "bam khong an tuong gi"
  // (bao cao cua Joe: "link Lien he ko di toi dau"). Gio id gan vao dung khoi
  // "Lien He" (dia chi/Zalo/email) + them hieu ung nhap nhay ngan de nguoi
  // dung THAY duoc phan hoi ngay ca khi khong can cuon xa.
  const [highlightContact, setHighlightContact] = useState(false);

  const handleFooterNav = (page: string, anchor?: string) => {
    onNavigate?.(page);
    if (anchor) {
      // Bam lien tiep 2 lan (150ms + 450ms) vi da quan sat that: lan dau doi
      // khi navigate xong sang trang khac roi cuon co the bi 1 hieu ung khac
      // tren trang (vd useEffect reset scroll ve dau trang) chay sau do va
      // de len — cuon lai lan 2 dam bao van toi dung vi tri du co race.
      const doScroll = () => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
      setTimeout(doScroll, 150);
      setTimeout(doScroll, 500);
      if (anchor === 'contact') {
        setTimeout(() => {
          setHighlightContact(true);
          setTimeout(() => setHighlightContact(false), 1500);
        }, 500);
      }
    }
  };

  return (
    <footer className="bg-forest-950 text-white pt-20 pb-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        {/* Widget CRO "Nhận Cẩm Nang" — nổi bật ngay đầu footer, mọi trang đều thấy */}
        <div className="mb-16">
          <NewsletterCTA />
        </div>

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
              {activeOverrides['footer.brandDesc'] ?? t.footer.brandDesc}
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
            <h5 className="font-semibold mb-6 text-gold-400">{activeOverrides['footer.quickLinks'] ?? t.footer.quickLinks}</h5>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => handleFooterNav(item.page, item.anchor)}
                    className="text-forest-300 hover:text-white transition-colors text-left"
                  >
                    {(lang === 'vi' && item.label) || navLabel(item.key)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div
            id="contact"
            className={`rounded-xl transition-all duration-500 ${
              highlightContact ? 'ring-2 ring-gold-400 bg-forest-900/60 -m-3 p-3' : ''
            }`}
          >
            <h5 className="font-semibold mb-6 text-gold-400">{activeOverrides['footer.contact'] ?? t.footer.contact}</h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="text-forest-300">{activeOverrides['footer.address'] || t.footer.address}</span>
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
                <a href={`mailto:${activeOverrides['footer.email'] || t.footer.email}`} className="text-forest-300 hover:text-white transition-colors">
                  {activeOverrides['footer.email'] || t.footer.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Language Selector */}
          <div>
            <h5 className="font-semibold mb-6 text-gold-400">{activeOverrides['footer.followUs'] ?? t.footer.followUs}</h5>
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
              {activeOverrides['footer.copyright'] || t.footer.copyright}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-forest-400 text-sm">
              {/* <a href> that (khong phai <button>) de Google index rieng tung
                  trang chinh sach + mo tab moi/copy link hoat dong dung —
                  onClick van dieu huong qua SPA state cho click thuong. */}
              <a
                href={POLICY_PATHS['policy-privacy']}
                onClick={(e) => { e.preventDefault(); handleFooterNav('policy-privacy'); }}
                className="hover:text-white transition-colors"
              >
                {activeOverrides['policies.privacy'] || t.policies.privacy}
              </a>
              <a
                href={POLICY_PATHS['policy-terms']}
                onClick={(e) => { e.preventDefault(); handleFooterNav('policy-terms'); }}
                className="hover:text-white transition-colors"
              >
                {activeOverrides['policies.terms'] || t.policies.terms}
              </a>
              <a
                href={POLICY_PATHS['policy-shipping']}
                onClick={(e) => { e.preventDefault(); handleFooterNav('policy-shipping'); }}
                className="hover:text-white transition-colors"
              >
                {activeOverrides['policies.shipping'] || t.policies.shipping}
              </a>
              <a
                href={POLICY_PATHS['policy-refund']}
                onClick={(e) => { e.preventDefault(); handleFooterNav('policy-refund'); }}
                className="hover:text-white transition-colors"
              >
                {activeOverrides['policies.refund'] || t.policies.refund}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
