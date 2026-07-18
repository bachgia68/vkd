import { Crown, Star, Gift, Zap, Globe, ShoppingBag, TrendingUp, ChevronRight } from 'lucide-react';
import { loyaltyTiers } from '../data/mockData';
import type { Language } from '../i18n/translations';

interface LoyaltyProps {
  lang: Language;
  onNavigate: (page: string) => void;
}

const mockActivity = [
  { date: '2024-11-15', desc: 'Online Order #VKD-A9B2C3', descVi: 'Đơn hàng #VKD-A9B2C3', pts: +450, channel: 'Website' },
  { date: '2024-11-02', desc: 'Vo Kim Duong — Hanoi', descVi: 'Cửa hàng Võ Kim Đường — Hà Nội', pts: +280, channel: 'Showroom' },
  { date: '2024-10-20', desc: 'Shopee Mall Purchase', descVi: 'Mua hàng Shopee Mall', pts: +190, channel: 'Shopee' },
  { date: '2024-10-08', desc: 'TikTok Flash Deal', descVi: 'Flash Deal TikTok', pts: +95, channel: 'TikTok' },
  { date: '2024-09-30', desc: 'Referral Bonus — Dr. Nguyen', descVi: 'Thưởng giới thiệu — Bác sĩ Nguyễn', pts: +500, channel: 'Referral' },
];

const channelIcons: Record<string, string> = {
  Website: '🌐', Showroom: '🏪', Shopee: '🛍', TikTok: '📱', Referral: '🤝',
};

export default function LoyaltyDashboard({ lang, onNavigate }: LoyaltyProps) {
  const isVi = lang === 'vi';
  const currentPoints = 1515;
  const currentTierIdx = 1; // VIP
  const nextTier = loyaltyTiers[2];

  const progress = ((currentPoints - loyaltyTiers[currentTierIdx].minPoints) /
    (nextTier.minPoints - loyaltyTiers[currentTierIdx].minPoints)) * 100;

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-16">
      <div className="container-wide max-w-5xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-100 rounded-full mb-3">
              <Crown className="w-3.5 h-3.5 text-gold-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">VKD Elite Club</span>
            </div>
            <h1 className="font-display text-display-sm text-forest-900">
              {isVi ? 'Hội Viên Của Tôi' : 'My Membership'}
            </h1>
          </div>
          <button onClick={() => onNavigate('catalog')} className="btn-primary text-sm">
            <ShoppingBag className="w-4 h-4" />
            {isVi ? 'Mua Thêm' : 'Shop & Earn'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── LEFT: Member card ── */}
          <div className="lg:col-span-1 space-y-6">

            {/* Member card */}
            <div className="relative rounded-3xl overflow-hidden shadow-elegant-lg bg-gradient-to-br from-forest-800 to-forest-950 p-6 text-white">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gold-400/10 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-forest-600/20 translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-gold-400" />
                    <span className="text-gold-400 font-semibold text-sm">VIP Member</span>
                  </div>
                  <img src="/assets/images/logo-sam-ngoc-linh.png" alt="VKD Logo" className="h-8 opacity-80" />
                </div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                  {isVi ? 'Điểm Tích Lũy' : 'Total Points'}
                </p>
                <p className="font-display text-4xl font-black text-white mb-1">{currentPoints.toLocaleString()}</p>
                <p className="text-white/50 text-xs">
                  {isVi ? `Còn ${(nextTier.minPoints - currentPoints).toLocaleString()} điểm để lên ${nextTier.nameVi}` : `${(nextTier.minPoints - currentPoints).toLocaleString()} pts to ${nextTier.name}`}
                </p>
                {/* Progress bar */}
                <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>VIP</span><span>VVIP Elite (20,000 pts)</span>
                </div>
              </div>
            </div>

            {/* Tier benefits */}
            {loyaltyTiers.map((tier, i) => (
              <div key={tier.name} className={`rounded-2xl p-5 ${i === currentTierIdx ? 'ring-2 ring-forest-500 bg-white shadow-elegant' : 'bg-cream-100'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                    <Crown className={`w-4 h-4 ${i === 2 ? 'text-forest-900' : i === 1 ? 'text-white' : 'text-forest-700'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-forest-900 text-sm">{isVi ? tier.nameVi : tier.name}</p>
                    <p className="text-forest-400 text-xs">{tier.minPoints.toLocaleString()}+ pts · {tier.discount}% cashback</p>
                  </div>
                  {i === currentTierIdx && (
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-forest-100 text-forest-600 text-xs font-bold">
                      {isVi ? 'Hiện tại' : 'Current'}
                    </span>
                  )}
                </div>
                <ul className="space-y-1">
                  {(isVi ? tier.perksVi : tier.perks).slice(0, 3).map((perk, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-xs text-forest-600">
                      <Star className="w-3 h-3 text-gold-400 fill-gold-400 flex-shrink-0 mt-0.5" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── RIGHT: Activity & Channels ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Omni-channel sync banner */}
            <div className="bg-forest-900 rounded-2xl p-5 text-white flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-400/20 flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <p className="font-semibold mb-0.5">
                  {isVi ? 'Đồng Bộ Đa Kênh Tự Động' : 'Omni-Channel Auto-Sync Active'}
                </p>
                <p className="text-white/60 text-sm">
                  {isVi
                    ? 'Điểm từ Website, Shopee, TikTok và showroom Võ Kim Đường được gộp tự động vào tài khoản này.'
                    : 'Points from Website, Shopee, TikTok, and Vo Kim Duong showrooms automatically merge into this account.'}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: isVi ? 'Tổng Điểm' : 'Total Points', value: currentPoints.toLocaleString(), icon: Star },
                { label: isVi ? 'Đơn Hàng' : 'Orders Placed', value: '12', icon: ShoppingBag },
                { label: isVi ? 'Tiết Kiệm Được' : 'Total Saved', value: '$84', icon: TrendingUp },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-2xl p-4 shadow-elegant text-center">
                  <Icon className="w-5 h-5 text-gold-500 mx-auto mb-2" />
                  <p className="font-display text-2xl font-bold text-forest-900">{value}</p>
                  <p className="text-forest-400 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Points activity */}
            <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-cream-200">
                <h3 className="font-display font-semibold text-forest-900">
                  {isVi ? 'Lịch Sử Điểm' : 'Points Activity'}
                </h3>
                <Zap className="w-4 h-4 text-gold-500" />
              </div>
              <div className="divide-y divide-cream-100">
                {mockActivity.map((act, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-cream-50 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-cream-100 flex items-center justify-center text-lg flex-shrink-0">
                      {channelIcons[act.channel] || '•'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-forest-800 text-sm font-medium">{isVi ? act.descVi : act.desc}</p>
                      <p className="text-forest-400 text-xs">{act.date} · {act.channel}</p>
                    </div>
                    <span className="font-bold text-forest-600 text-sm flex-shrink-0">+{act.pts} pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Redeem CTA */}
            <div className="bg-gradient-to-r from-gold-400 to-gold-500 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Gift className="w-7 h-7 text-forest-900" />
                <div>
                  <p className="font-display font-bold text-forest-900">
                    {isVi ? 'Đổi Điểm Lấy Quà' : 'Redeem Your Points'}
                  </p>
                  <p className="text-forest-800/70 text-sm">
                    {isVi ? `${currentPoints} điểm = giảm ngay ${Math.floor(currentPoints / 100) * 5}k₫` : `${currentPoints} pts = $${(currentPoints * 0.005).toFixed(2)} off`}
                  </p>
                </div>
              </div>
              <button onClick={() => onNavigate('catalog')} className="btn-primary text-sm flex-shrink-0">
                {isVi ? 'Đổi Ngay' : 'Redeem'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
