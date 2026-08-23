import { ArrowRight, Shield, Award, Leaf } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

interface HeroProps {
  lang: Language;
  onNavigate?: (page: string) => void;
}

export default function Hero({ lang, onNavigate }: HeroProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background Layer */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/assets/images/cay-sam-vkd.png')`,
            backgroundPosition: 'center 30%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/80 via-forest-900/60 to-forest-950/90" />
        <div className="absolute inset-0 opacity-10 bg-ginseng-pattern" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-forest-500/20 rounded-full blur-[150px] animate-pulse-slow" />
      </div>

      {/* Floating Ginseng Graphics */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute -left-20 top-1/3 w-64 h-96 opacity-20 animate-float"
          viewBox="0 0 100 200"
          fill="none"
        >
          <path
            d="M50 180 C30 150, 20 100, 25 60 C30 20, 45 10, 50 5 C55 10, 70 20, 75 60 C80 100, 70 150, 50 180"
            stroke="#5a9479"
            strokeWidth="2"
            fill="none"
          />
          <path d="M50 5 L45 -20 M50 5 L55 -20" stroke="#5a9479" strokeWidth="2" strokeLinecap="round" />
          <path d="M35 50 L15 30 M45 50 L25 35" stroke="#5a9479" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M65 50 L85 30 M55 50 L75 35" stroke="#5a9479" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        <svg
          className="absolute -right-16 bottom-1/4 w-48 h-80 opacity-20 animate-float"
          style={{ animationDelay: '2s' }}
          viewBox="0 0 100 200"
          fill="none"
        >
          <path
            d="M50 180 C30 150, 20 100, 25 60 C30 20, 45 10, 50 5 C55 10, 70 20, 75 60 C80 100, 70 150, 50 180"
            stroke="#D4AF37"
            strokeWidth="2"
            fill="none"
          />
          <path d="M50 5 L45 -20 M50 5 L55 -20" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
          <path d="M35 50 L15 30 M45 50 L25 35" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M65 50 L85 30 M55 50 L75 35" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide text-center text-white pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-fade-in-down">
          <Leaf className="w-4 h-4 text-gold-400" />
          <span className="text-sm font-medium tracking-wide">{t.hero.badge}</span>
        </div>

        {/* Main Title */}
        <h1 className="font-display mb-6 animate-fade-in-up">
          <span className="block text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-2">
            {t.hero.titleLine1}
          </span>
          <span className="block text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gradient-gold">
            {t.hero.titleLine2}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/80 leading-relaxed mb-10 animate-fade-in-up animation-delay-200">
          {t.hero.subtitle}
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-in-up animation-delay-400">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Shield className="w-4 h-4 text-forest-300" />
            <span className="text-xs font-medium">cGMP Certified</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Award className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-medium">ISO 9001/22000</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Leaf className="w-4 h-4 text-forest-300" />
            <span className="text-xs font-medium">HACCP</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
          <a href="#catalog" onClick={(e) => { e.preventDefault(); onNavigate?.('catalog'); }} className="btn-gold group">
            {t.hero.cta}
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
          </a>
          <a
            href="#traceability"
            className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
          >
            {t.hero.ctaSecondary}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in animation-delay-600">
        <span className="text-white/60 text-xs tracking-widest uppercase">{t.hero.scrollText}</span>
        <div className="scroll-indicator" />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-50 to-transparent" />
    </section>
  );
}
