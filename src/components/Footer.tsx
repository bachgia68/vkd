import { MapPin, Phone, Mail, Share2, Globe, MessageCircle } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations, languageNames } from '../i18n/translations';

interface FooterProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  onNavigate?: (page: string) => void;
}

export default function Footer({ lang, onLangChange }: FooterProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';

  const navItems = [
    { key: 'home', href: '#home' },
    { key: 'about', href: '#about' },
    { key: 'products', href: '#products' },
    { key: 'traceability', href: '#traceability' },
    { key: 'b2b', href: '#b2b' },
    { key: 'contact', href: '#contact' },
  ];

  const languages: Language[] = ['vi', 'en', 'zh', 'fr', 'ar'];

  return (
    <footer id="contact" className="bg-forest-950 text-white pt-20 pb-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img
                src="/assets/images/logo-sam-ngoc-linh.png"
                alt="VKD Group"
                className="h-16 w-auto object-contain"
              />
            </div>

            <p className="text-forest-300 leading-relaxed mb-6">
              {t.footer.brandDesc}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/tapdoanyduocsamngoclinhvn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-forest-800 hover:bg-forest-600 flex items-center justify-center transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-forest-800 hover:bg-forest-600 flex items-center justify-center transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-forest-800 hover:bg-forest-600 flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-6 text-gold-400">{t.footer.quickLinks}</h5>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className="text-forest-300 hover:text-white transition-colors"
                  >
                    {t.nav[item.key as keyof typeof t.nav]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-semibold mb-6 text-gold-400">{t.footer.contact}</h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="text-forest-300">{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <a href="tel:1800282866" className="text-forest-300 hover:text-white transition-colors">
                  {t.footer.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <a href="mailto:info@vkdnature.com" className="text-forest-300 hover:text-white transition-colors">
                  {t.footer.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Language Selector */}
          <div>
            <h5 className="font-semibold mb-6 text-gold-400">{t.footer.followUs}</h5>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => onLangChange(l)}
                  className={`px-3 py-2 text-sm rounded-lg transition-all ${
                    l === lang
                      ? 'bg-gold-400 text-forest-900 font-medium'
                      : 'bg-forest-800 text-forest-300 hover:bg-forest-700 hover:text-white'
                  }`}
                >
                  {languageNames[l]}
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

            <div className="flex items-center gap-6 text-forest-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
