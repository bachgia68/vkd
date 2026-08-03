import { useState } from 'react';
import { Crown, Zap, Gift } from 'lucide-react';
import type { Language } from '../i18n/translations';
import TaWordmark from './TaWordmark';

interface OmniChannelProps {
  lang: Language;
  onNavigate?: (page: string) => void;
}

export default function OmniChannel({ lang, onNavigate }: OmniChannelProps) {
  const isVi = lang === 'vi';
  const isRTL = lang === 'ar';
  const [showElitePopup, setShowElitePopup] = useState(false);

  return (
    <section id="omnichannel" className="bg-cream-50" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── TA ELITE CLUB BANNER ── */}
      <div className="section-padding-sm bg-gradient-to-r from-gold-700 via-gold-500 to-gold-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M30 5l4 12h13l-10 8 4 12-11-8-11 8 4-12-10-8h13z'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container-wide relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-forest-900/20 flex items-center justify-center">
                <Crown className="w-7 h-7 text-forest-900" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-forest-900">
                  <TaWordmark /> {isVi ? 'Elite Club — Đặc Quyền Đồng Bộ Đa Kênh' : 'Elite Club — Omni-Channel Loyalty'}
                </h3>
                <p className="text-forest-800/80 text-sm">
                  {isVi
                    ? 'Điểm tích lũy, hạng thành viên và ưu đãi sức khỏe đồng bộ trên Website, TikTok, Shopee và tại showroom TA.'
                    : 'Points, membership tier, and health benefits sync seamlessly across Website, TikTok Shop, Shopee, and TA showrooms.'}
                </p>
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => setShowElitePopup(true)}
                className="btn-primary bg-forest-900 hover:bg-forest-800 text-sm"
              >
                <Gift className="w-4 h-4" />
                {isVi ? 'Tham Gia Miễn Phí' : 'Join Free'}
              </button>
              <button
                onClick={() => onNavigate?.('loyalty')}
                className="btn-secondary bg-transparent border-forest-900/30 text-forest-900 hover:bg-forest-900/10 text-sm"
              >
                {isVi ? 'Xem Đặc Quyền' : 'View Perks'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Elite Club Popup */}
      {showElitePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-forest-950/70 backdrop-blur-sm" onClick={() => setShowElitePopup(false)} />
          <div className="relative bg-white rounded-3xl shadow-elegant-lg max-w-lg w-full p-8 animate-fade-in">
            <button onClick={() => setShowElitePopup(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center transition-colors">
              <Zap className="w-4 h-4 text-forest-600" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-forest-900" />
              </div>
              <h3 className="font-display text-2xl font-bold text-forest-900 mb-2"><TaWordmark /> Elite Club</h3>
              <p className="text-forest-500 text-sm">
                {isVi
                  ? 'Mỗi đơn hàng — dù trên website, Shopee, TikTok hay tại showroom TA — đều tích điểm vào một tài khoản duy nhất.'
                  : 'Every purchase — whether on the website, Shopee, TikTok, or in a TA showroom — earns points to a single unified account.'}
              </p>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { tier: 'Standard', color: 'bg-cream-200', pts: '0+ pts', disc: '3%' },
                { tier: 'VIP',      color: 'bg-forest-600', pts: '5,000+ pts', disc: '7%', light: true },
                { tier: 'VVIP Elite', color: 'bg-gold-500', pts: '20,000+ pts', disc: '12%' },
              ].map((t) => (
                <div key={t.tier} className={`flex items-center justify-between p-3 rounded-xl ${t.color} ${t.light ? 'text-white' : 'text-forest-900'}`}>
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    <span className="font-semibold text-sm">{t.tier}</span>
                    <span className="text-xs opacity-70">{t.pts}</span>
                  </div>
                  <span className="font-bold text-sm">{t.disc} {isVi ? 'hoàn tiền' : 'cashback'}</span>
                </div>
              ))}
            </div>
            <button className="btn-gold w-full justify-center">
              <Gift className="w-4 h-4" />
              {isVi ? 'Đăng Ký — Miễn Phí Mãi Mãi' : 'Join Now — Always Free'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
