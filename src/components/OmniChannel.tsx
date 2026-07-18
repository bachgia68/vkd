import { useState } from 'react';
import { ShoppingBag, Tv2, CheckCircle, Crown, ArrowRight, Zap, Gift, Users } from 'lucide-react';
import type { Language } from '../i18n/translations';

interface OmniChannelProps {
  lang: Language;
  onNavigate?: (page: string) => void;
}

const stores = [
  {
    name: 'Shopee Premium Mall',
    name_vi: 'Shopee Premium Mall',
    desc: 'Official flagship store — anti-counterfeit guarantee',
    desc_vi: 'Gian hàng flagship chính hãng — bảo đảm chống hàng giả',
    badge: 'Verified Premium',
    color: 'from-orange-500 to-orange-600',
    icon: ShoppingBag,
    url: '#',
  },
  {
    name: 'TikTok Shop VKD',
    name_vi: 'TikTok Shop VKD',
    desc: 'Live commerce & exclusive flash deals',
    desc_vi: 'Live thương mại & flash deals độc quyền',
    badge: 'Live Now',
    color: 'from-gray-900 to-gray-700',
    icon: Tv2,
    url: '#',
  },
  {
    name: 'Users Commerce',
    name_vi: 'Users Thương Mại',
    desc: 'Community-verified marketplace store',
    desc_vi: 'Cửa hàng xác minh bởi cộng đồng',
    badge: 'Trusted Seller',
    color: 'from-blue-600 to-blue-700',
    icon: Users,
    url: '#',
  },
];

export default function OmniChannel({ lang, onNavigate }: OmniChannelProps) {
  const isVi = lang === 'vi';
  const isRTL = lang === 'ar';
  const [showElitePopup, setShowElitePopup] = useState(false);

  return (
    <section id="omnichannel" className="bg-cream-50" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── OFFICIAL STORES ── */}
      <div className="section-padding border-b border-cream-200">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-100 rounded-full mb-6">
              <CheckCircle className="w-3.5 h-3.5 text-forest-600" />
              <span className="text-xs font-semibold tracking-wider uppercase text-forest-700">
                {isVi ? 'Kênh Mua Sắm Chính Hãng' : 'Official Retail Channels'}
              </span>
            </div>
            <h2 className="font-display text-display-sm md:text-display-md text-forest-900 mb-4">
              {isVi ? 'Mua Hàng Chính Hãng — Không Lo Hàng Giả' : 'Buy Authentic — Zero Counterfeits Guaranteed'}
            </h2>
            <p className="text-forest-600">
              {isVi
                ? 'VKD Group chỉ phân phối qua các kênh được xác minh. Mua từ bất kỳ cửa hàng nào dưới đây để đảm bảo tính xác thực và được bảo hành 200%.'
                : 'VKD Group distributes exclusively through verified channels. Purchase from any store below for a 200% authenticity guarantee.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stores.map((store) => {
              const Icon = store.icon;
              return (
                <a
                  key={store.name}
                  href={store.url}
                  className="group relative bg-white rounded-2xl p-8 shadow-elegant hover:shadow-elegant-lg transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${store.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${store.color} flex items-center justify-center mb-5 shadow-md`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display font-semibold text-forest-900 text-lg">{isVi ? store.name_vi : store.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 text-xs font-bold">{store.badge}</span>
                  </div>
                  <p className="text-forest-500 text-sm mb-4">{isVi ? store.desc_vi : store.desc}</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-forest-700 group-hover:text-gold-600 transition-colors">
                    {isVi ? 'Đến Cửa Hàng' : 'Shop Now'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── VKD ELITE CLUB BANNER ── */}
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
                  {isVi ? 'VKD Elite Club — Đặc Quyền Đồng Bộ Đa Kênh' : 'VKD Elite Club — Omni-Channel Loyalty'}
                </h3>
                <p className="text-forest-800/80 text-sm">
                  {isVi
                    ? 'Điểm tích lũy, hạng thành viên và ưu đãi sức khỏe đồng bộ trên Website, TikTok, Shopee và tại showroom Võ Kim Đường.'
                    : 'Points, membership tier, and health benefits sync seamlessly across Website, TikTok Shop, Shopee, and Vo Kim Duong showrooms.'}
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
              <h3 className="font-display text-2xl font-bold text-forest-900 mb-2">VKD Elite Club</h3>
              <p className="text-forest-500 text-sm">
                {isVi
                  ? 'Mỗi đơn hàng — dù trên website, Shopee, TikTok hay tại showroom Võ Kim Đường — đều tích điểm vào một tài khoản duy nhất.'
                  : 'Every purchase — whether on the website, Shopee, TikTok, or in a Vo Kim Duong showroom — earns points to a single unified account.'}
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
