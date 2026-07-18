import { QrCode, ScanLine, FileSearch, CheckCircle, Shield } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';

interface TraceabilityProps {
  lang: Language;
}

export default function Traceability({ lang }: TraceabilityProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';

  const steps = [
    { icon: ScanLine, title: t.traceability.step1Title, desc: t.traceability.step1Desc },
    { icon: FileSearch, title: t.traceability.step2Title, desc: t.traceability.step2Desc },
    { icon: CheckCircle, title: t.traceability.step3Title, desc: t.traceability.step3Desc },
    { icon: Shield, title: t.traceability.step4Title, desc: t.traceability.step4Desc },
  ];

  return (
    <section
      id="traceability"
      className="section-padding bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 text-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5 bg-ginseng-pattern" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-forest-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-gold-400/10 rounded-full blur-[120px]" />
      </div>

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - QR Scanner */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-br from-gold-400/30 to-forest-400/30 rounded-3xl blur-xl" />

              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
                {/* QR Icon placeholder */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold-400 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold-400 rounded-br-lg" />

                  <div className="absolute inset-4 flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-white/40" />
                  </div>

                  <div className="absolute inset-4 overflow-hidden">
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-gold-400"
                      style={{
                        boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
                        animation: 'scan 2s ease-in-out infinite',
                      }}
                    />
                  </div>
                </div>

                <style>{`
                  @keyframes scan {
                    0%, 100% { top: 0; }
                    50% { top: 100%; }
                  }
                `}</style>

                <div className="text-center">
                  <h3 className="font-display text-xl text-white mb-2">
                    {t.traceability.cta}
                  </h3>
                  <p className="text-white/60 text-sm">{t.traceability.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3 px-6 py-4 bg-gold-400/20 rounded-xl border border-gold-400/30">
              <Shield className="w-6 h-6 text-gold-400" />
              <p className="text-gold-200 text-sm font-medium">{t.traceability.guarantee}</p>
            </div>
          </div>

          {/* Right side - Steps */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full">
              <span className="w-2 h-2 bg-gold-400 rounded-full" />
              <span className="text-xs font-semibold tracking-wider uppercase text-gold-200">
                {t.traceability.label}
              </span>
            </div>

            <h2 className="font-display text-display-sm md:text-display-md text-white">
              {t.traceability.title}
            </h2>

            <div className="space-y-6 mt-10">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;

                return (
                  <div key={index} className="flex items-start gap-6 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center shadow-lg shadow-forest-500/30">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {!isLast && (
                        <div className="w-0.5 h-full min-h-[60px] bg-gradient-to-b from-forest-400 to-forest-600/20 mt-4" />
                      )}
                    </div>

                    <div className="pb-8">
                      <span className="text-gold-400 text-xs font-semibold tracking-wider uppercase">
                        Step {index + 1}
                      </span>
                      <h3 className="text-xl font-semibold text-white mt-1 mb-2">{step.title}</h3>
                      <p className="text-white/70">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
