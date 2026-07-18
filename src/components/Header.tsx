import { useState, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown, ShoppingBag } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations, languageNames } from '../i18n/translations';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ lang, onLangChange, onNavigate, currentPage }: HeaderProps) {
  const t = translations[lang];
  const { totalItems, toggleCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: 'home' },
    { key: 'about', href: 'about' },
    { key: 'products', href: 'catalog' },
    { key: 'research', href: 'research' },
    { key: 'traceability', href: 'traceability' },
    { key: 'b2b', href: 'b2b' },
    { key: 'autoship', href: 'autoship' },
  ];

  const languages: Language[] = ['vi', 'en', 'zh', 'fr', 'ar'];

  const handleNav = (href: string) => {
    if (href === 'about' || href === 'traceability' || href === 'b2b') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      onNavigate(href);
    }
    setIsMobileMenuOpen(false);
  };

  const isHome = currentPage === 'home';
  const useLightText = !isScrolled && isHome;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-cream-50/95 backdrop-blur-md shadow-elegant py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <nav className="container-wide">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-3 group">
            <img
              src="/assets/images/logo-sam-ngoc-linh.png"
              alt="VKD Group — Ngoc Linh Ginseng Vietnam Medical Group Logo"
              className="h-12 md:h-14 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNav(item.href)}
                className={`nav-link text-sm font-medium tracking-wide ${
                  currentPage === item.href
                    ? 'text-gold-600'
                    : useLightText
                    ? 'text-white/90 hover:text-white'
                    : 'text-forest-700 hover:text-forest-900'
                }`}
              >
                {t.nav[item.key as keyof typeof t.nav] || item.key}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  useLightText ? 'text-white/90 hover:bg-white/10' : 'text-forest-700 hover:bg-forest-50'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden md:inline">{languageNames[lang]}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-40 bg-cream-50 rounded-xl shadow-elegant-lg z-50 overflow-hidden animate-fade-in-down">
                    {languages.map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          onLangChange(l);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-forest-50 transition-colors ${
                          l === lang ? 'bg-forest-50 text-forest-700 font-medium' : 'text-forest-600'
                        } ${l === 'ar' ? 'text-right' : ''}`}
                        dir={l === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {languageNames[l]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className={`relative p-2 rounded-full transition-all ${
                useLightText ? 'text-white/90 hover:bg-white/10' : 'text-forest-700 hover:bg-forest-50'
              }`}
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-400 text-forest-900 text-xs font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* CTA Button */}
            <button
              onClick={() => handleNav('b2b')}
              className={`hidden md:inline-flex btn-primary text-xs ${
                useLightText ? 'bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 text-white' : ''
              }`}
            >
              {t.b2b.cta}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                useLightText ? 'text-white hover:bg-white/10' : 'text-forest-700 hover:bg-forest-50'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-cream-50 shadow-elegant-lg animate-fade-in-down rounded-b-2xl">
            <div className="container-wide py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.href)}
                  className="block w-full text-left px-4 py-3 text-forest-700 hover:bg-forest-50 hover:text-forest-900 rounded-lg transition-colors"
                >
                  {t.nav[item.key as keyof typeof t.nav] || item.key}
                </button>
              ))}
              <div className="pt-4 border-t border-cream-200">
                <div className="flex flex-wrap gap-2 px-4">
                  {languages.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        onLangChange(l);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                        l === lang ? 'bg-forest-100 text-forest-700' : 'bg-cream-100 text-forest-600 hover:bg-forest-50'
                      }`}
                    >
                      {languageNames[l]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
