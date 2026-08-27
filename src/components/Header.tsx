import { useState, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown, ShoppingBag } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations, languageNames } from '../i18n/translations';
import { useCart } from '../context/CartContext';
import { productTypes } from '../data/productTypes';
import { healthGoalLabels } from '../data/mockData';
import type { HealthGoal } from '../data/mockData';
import { fetchVisibleLanguages, fetchTextOverrides, fetchVisibleNavItems, fetchProductMenuItems, type SiteLanguage, type NavItem, type ProductMenuItem } from '../lib/siteContentApi';

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
  blogResearch: 'header.nav.blog',
  b2b: 'header.nav.partnership',
};

interface HeaderProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  visibleSections: Set<string>;
}

export default function Header({ lang, onLangChange, onNavigate, currentPage, visibleSections }: HeaderProps) {
  const t = translations[lang];
  const { totalItems, toggleCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [isBlogMenuOpen, setIsBlogMenuOpen] = useState(false);
  const [isMobileProductMenuOpen, setIsMobileProductMenuOpen] = useState(false);
  const [languages, setLanguages] = useState<SiteLanguage[]>(FALLBACK_LANGUAGES);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [dbNavItems, setDbNavItems] = useState<NavItem[]>([]);
  const [dbProductMenu, setDbProductMenu] = useState<ProductMenuItem[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchVisibleLanguages()
      .then((rows) => setLanguages(rows.length > 0 ? rows : FALLBACK_LANGUAGES))
      .catch(() => setLanguages(FALLBACK_LANGUAGES));
    fetchTextOverrides()
      .then(setOverrides)
      .catch(() => setOverrides({}));
    fetchVisibleNavItems()
      .then(setDbNavItems)
      .catch(() => setDbNavItems([]));
    fetchProductMenuItems()
      .then(setDbProductMenu)
      .catch(() => setDbProductMenu([]));
  }, []);

  const navLabel = (key: string) => {
    const overrideKey = NAV_OVERRIDE_KEYS[key];
    const fallback = t.nav[key as keyof typeof t.nav] ?? key;
    return (overrideKey && overrides[overrideKey]) || fallback;
  };

  const FALLBACK_NAV = [
    { key: 'home', href: 'home', label_vi: null },
    { key: 'about', href: 'about', label_vi: null },
    { key: 'products', href: 'catalog', label_vi: null },
    { key: 'giftSets', href: 'catalog?type=set-qua-tang', label_vi: null },
    { key: 'traceability', href: 'traceability', label_vi: null },
    ...(visibleSections.has('showrooms') ? [{ key: 'showrooms', href: 'showrooms', label_vi: null }] : []),
    ...(visibleSections.has('blog') ? [{ key: 'blogResearch', href: 'blog', label_vi: null }] : []),
    { key: 'b2b', href: 'b2b', label_vi: null },
    { key: 'autoship', href: 'autoship', label_vi: null },
  ];
  const navItems = dbNavItems.length > 0
    ? dbNavItems.map((i) => ({ key: i.key, href: i.href, label_vi: i.label_vi }))
    : FALLBACK_NAV;

  const navItemLabel = (item: { key: string; label_vi: string | null }) =>
    item.label_vi || navLabel(item.key);

  // Product dropdown — DB-driven with hardcoded fallback
  const dbSam = dbProductMenu.filter((i) => i.section === 'sam');
  const dbDacSan = dbProductMenu.filter((i) => i.section === 'dac_san');
  const dbHealth = dbProductMenu.filter((i) => i.section === 'health');
  const useDbMenu = dbProductMenu.length > 0;

  const samProductTypes = productTypes.filter((pt) => pt.group === 'sam' && pt.id !== 'set-qua-tang');
  const dacSanProductTypes = productTypes.filter((pt) => pt.group === 'dac-san');
  const healthGoals = Object.keys(healthGoalLabels) as HealthGoal[];

  const handleNav = (href: string) => {
    if (href === 'traceability') {
      onNavigate('traceability');
    } else if (href === 'b2b') {
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
          <button onClick={() => handleNav('home')} className="flex-shrink-0 flex items-center gap-3 group">
            <img
              src="/assets/images/TA_logo_header.png"
              alt="TA — Sàn Giao Dịch Sâm Ngọc Linh Logo"
              className="h-12 md:h-14 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              if (item.key === 'products') {
                return (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => setIsProductMenuOpen(true)}
                    onMouseLeave={() => setIsProductMenuOpen(false)}
                  >
                    <button
                      onClick={() => handleNav('catalog')}
                      className={`nav-link text-sm font-medium tracking-wide flex items-center gap-1 ${
                        currentPage === item.href
                          ? 'text-gold-600'
                          : useLightText
                          ? 'text-white/90 hover:text-white'
                          : 'text-forest-700 hover:text-forest-900'
                      }`}
                    >
                      {navLabel('products')}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {isProductMenuOpen && (
                      <div className="absolute top-full left-0 pt-2 w-[640px] z-50">
                        <div className="bg-cream-50 rounded-2xl shadow-elegant-lg border border-cream-200 py-5 px-2 grid grid-cols-3 gap-2">
                          {useDbMenu ? (
                            <>
                              <div>
                                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-forest-400">
                                  {lang === 'vi' ? 'Theo loại sản phẩm' : 'By product type'}
                                </p>
                                {dbSam.map((item) => (
                                  <button
                                    key={item.id}
                                    onClick={() => { setIsProductMenuOpen(false); onNavigate(item.href); }}
                                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                                  >
                                    {lang === 'vi' ? item.label_vi : (item.label_en || item.label_vi)}
                                  </button>
                                ))}
                              </div>
                              <div>
                                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-forest-400">
                                  {lang === 'vi' ? 'Đặc Sản Việt Nam' : 'Vietnamese Specialties'}
                                </p>
                                {dbDacSan.map((item) => (
                                  <button
                                    key={item.id}
                                    onClick={() => { setIsProductMenuOpen(false); onNavigate(item.href); }}
                                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                                  >
                                    {lang === 'vi' ? item.label_vi : (item.label_en || item.label_vi)}
                                  </button>
                                ))}
                              </div>
                              <div>
                                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-forest-400">
                                  {lang === 'vi' ? 'Theo mục tiêu' : 'By goal'}
                                </p>
                                {dbHealth.map((item) => (
                                  <button
                                    key={item.id}
                                    onClick={() => { setIsProductMenuOpen(false); onNavigate(item.href); }}
                                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                                  >
                                    {lang === 'vi' ? item.label_vi : (item.label_en || item.label_vi)}
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-forest-400">
                                  {lang === 'vi' ? 'Theo loại sản phẩm' : 'By product type'}
                                </p>
                                {samProductTypes.map((pt) => (
                                  <button
                                    key={pt.id}
                                    onClick={() => { setIsProductMenuOpen(false); onNavigate(`catalog?type=${pt.id}`); }}
                                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                                  >
                                    {lang === 'vi' ? pt.labelVi : pt.labelEn}
                                  </button>
                                ))}
                              </div>
                              <div>
                                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-forest-400">
                                  {lang === 'vi' ? 'Đặc Sản Việt Nam' : 'Vietnamese Specialties'}
                                </p>
                                {dacSanProductTypes.map((pt) => (
                                  <button
                                    key={pt.id}
                                    onClick={() => { setIsProductMenuOpen(false); onNavigate(`catalog?type=${pt.id}`); }}
                                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                                  >
                                    {lang === 'vi' ? pt.labelVi : pt.labelEn}
                                  </button>
                                ))}
                              </div>
                              <div>
                                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-forest-400">
                                  {lang === 'vi' ? 'Theo mục tiêu' : 'By goal'}
                                </p>
                                {healthGoals.map((g) => (
                                  <button
                                    key={g}
                                    onClick={() => { setIsProductMenuOpen(false); onNavigate(`catalog?goal=${g}`); }}
                                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                                  >
                                    {lang === 'vi' ? healthGoalLabels[g].vi : healthGoalLabels[g].en}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.key === 'blogResearch') {
                return (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => setIsBlogMenuOpen(true)}
                    onMouseLeave={() => setIsBlogMenuOpen(false)}
                  >
                    <button
                      className={`nav-link text-sm font-medium tracking-wide flex items-center gap-1 ${
                        currentPage === 'blog' || currentPage === 'research'
                          ? 'text-gold-600'
                          : useLightText
                          ? 'text-white/90 hover:text-white'
                          : 'text-forest-700 hover:text-forest-900'
                      }`}
                    >
                      {navLabel('blogResearch')}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {isBlogMenuOpen && (
                      <div className="absolute top-full left-0 pt-2 w-56 z-50">
                        <div className="bg-cream-50 rounded-2xl shadow-elegant-lg border border-cream-200 py-3">
                          <button
                            onClick={() => { setIsBlogMenuOpen(false); onNavigate('blog'); }}
                            className="w-full text-left px-5 py-2.5 text-sm text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                          >
                            {t.nav.blog}
                          </button>
                          <button
                            onClick={() => { setIsBlogMenuOpen(false); onNavigate('research'); }}
                            className="w-full text-left px-5 py-2.5 text-sm text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                          >
                            {lang === 'vi' ? 'Nghiên Cứu Khoa Học' : 'Scientific Research'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.key === 'about') {
                return (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => setIsAboutMenuOpen(true)}
                    onMouseLeave={() => setIsAboutMenuOpen(false)}
                  >
                    <button
                      className={`nav-link text-sm font-medium tracking-wide flex items-center gap-1 ${
                        currentPage === 'about' || currentPage === 'about-story'
                          ? 'text-gold-600'
                          : useLightText
                          ? 'text-white/90 hover:text-white'
                          : 'text-forest-700 hover:text-forest-900'
                      }`}
                    >
                      {navLabel('about')}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {isAboutMenuOpen && (
                      <div className="absolute top-full left-0 pt-2 w-64 z-50">
                        <div className="bg-cream-50 rounded-2xl shadow-elegant-lg border border-cream-200 py-3">
                          <button
                            onClick={() => { setIsAboutMenuOpen(false); onNavigate('about-story'); }}
                            className="w-full text-left px-5 py-2.5 text-sm text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                          >
                            {lang === 'vi' ? 'Câu chuyện người sáng lập' : "Founder's Story"}
                          </button>
                          {visibleSections.has('about') && (
                            <button
                              onClick={() => { setIsAboutMenuOpen(false); onNavigate('about'); }}
                              className="w-full text-left px-5 py-2.5 text-sm text-forest-700 hover:bg-gold-50 hover:text-forest-900 transition-colors"
                            >
                              {lang === 'vi' ? 'Về TA' : 'About TA'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
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
                  {navItemLabel(item)}
                </button>
              );
            })}
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
                        key={l.key}
                        onClick={() => {
                          onLangChange(l.key as Language);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-forest-50 transition-colors ${
                          l.key === lang ? 'bg-forest-50 text-forest-700 font-medium' : 'text-forest-600'
                        } ${l.key === 'ar' ? 'text-right' : ''}`}
                        dir={l.key === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {l.label}
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
              {navItems.map((item) =>
                item.key === 'products' ? (
                  <div key={item.key} className="space-y-1">
                    <button
                      onClick={() => setIsMobileProductMenuOpen((v) => !v)}
                      className="w-full flex items-center justify-between px-4 py-3 text-forest-700 hover:bg-forest-50 hover:text-forest-900 rounded-lg transition-colors"
                    >
                      <span>{t.nav.products}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isMobileProductMenuOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isMobileProductMenuOpen && (
                      <div className="pl-4 space-y-3 pb-2">
                        <button
                          onClick={() => handleNav('catalog')}
                          className="block w-full text-left px-4 py-2 text-sm font-semibold text-forest-900 hover:bg-forest-50 rounded-lg transition-colors"
                        >
                          {lang === 'vi' ? 'Xem tất cả sản phẩm' : 'View all products'}
                        </button>
                        <div>
                          <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-forest-400">
                            {lang === 'vi' ? 'Theo loại sản phẩm' : 'By product type'}
                          </p>
                          {samProductTypes.map((pt) => (
                            <button
                              key={pt.id}
                              onClick={() => handleNav(`catalog?type=${pt.id}`)}
                              className="block w-full text-left px-4 py-2 text-sm text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
                            >
                              {lang === 'vi' ? pt.labelVi : pt.labelEn}
                            </button>
                          ))}
                        </div>
                        <div>
                          <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-forest-400">
                            {lang === 'vi' ? 'Đặc Sản Việt Nam' : 'Vietnamese Specialties'}
                          </p>
                          {dacSanProductTypes.map((pt) => (
                            <button
                              key={pt.id}
                              onClick={() => handleNav(`catalog?type=${pt.id}`)}
                              className="block w-full text-left px-4 py-2 text-sm text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
                            >
                              {lang === 'vi' ? pt.labelVi : pt.labelEn}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : item.key === 'blogResearch' ? (
                  <div key={item.key} className="space-y-1">
                    <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-forest-400">
                      {navLabel('blogResearch')}
                    </p>
                    <button
                      onClick={() => handleNav('blog')}
                      className="block w-full text-left px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50 hover:text-forest-900 rounded-lg transition-colors"
                    >
                      {t.nav.blog}
                    </button>
                    <button
                      onClick={() => handleNav('research')}
                      className="block w-full text-left px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50 hover:text-forest-900 rounded-lg transition-colors"
                    >
                      {lang === 'vi' ? 'Nghiên Cứu Khoa Học' : 'Scientific Research'}
                    </button>
                  </div>
                ) : item.key === 'about' ? (
                  <div key={item.key} className="space-y-1">
                    <button
                      onClick={() => handleNav('about-story')}
                      className="block w-full text-left px-4 py-3 text-forest-700 hover:bg-forest-50 hover:text-forest-900 rounded-lg transition-colors"
                    >
                      {lang === 'vi' ? 'Câu chuyện người sáng lập' : "Founder's Story"}
                    </button>
                    {visibleSections.has('about') && (
                      <button
                        onClick={() => handleNav('about')}
                        className="block w-full text-left px-4 py-3 text-forest-700 hover:bg-forest-50 hover:text-forest-900 rounded-lg transition-colors"
                      >
                        {lang === 'vi' ? 'Về TA' : 'About TA'}
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    key={item.key}
                    onClick={() => handleNav(item.href)}
                    className="block w-full text-left px-4 py-3 text-forest-700 hover:bg-forest-50 hover:text-forest-900 rounded-lg transition-colors"
                  >
                    {navItemLabel(item)}
                  </button>
                )
              )}
              <div className="pt-4 border-t border-cream-200">
                <div className="flex flex-wrap gap-2 px-4">
                  {languages.map((l) => (
                    <button
                      key={l.key}
                      onClick={() => {
                        onLangChange(l.key as Language);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                        l.key === lang ? 'bg-forest-100 text-forest-700' : 'bg-cream-100 text-forest-600 hover:bg-forest-50'
                      }`}
                    >
                      {l.label}
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
