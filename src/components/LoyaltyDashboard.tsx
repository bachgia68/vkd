import { useState } from 'react';
import { Crown, Star, Gift, Zap, Globe, ShoppingBag, TrendingUp, ChevronRight, PackageOpen, Sparkles } from 'lucide-react';
import { loyaltyTiers } from '../data/mockData';
import type { Language } from '../i18n/translations';
import TaWordmark from './TaWordmark';
import { useLoyaltyData } from '../hooks/useLoyaltyData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

type ActivityTab = 'history' | 'redeemed' | 'perks';

interface LoyaltyProps {
  lang: Language;
  onNavigate: (page: string) => void;
  /** Email of the logged-in customer, or undefined/null if anonymous. */
  userEmail?: string;
}

export default function LoyaltyDashboard({ lang, onNavigate, userEmail }: LoyaltyProps) {
  const isVi = lang === 'vi';
  const { data: loyaltyData, loading, error } = useLoyaltyData(userEmail || null);
  const [selectedTierIdx, setSelectedTierIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<ActivityTab>('history');

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-28 pb-16 flex items-center justify-center">
        <p className="text-forest-600">{isVi ? 'Đang tải...' : 'Loading...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-50 pt-28 pb-16 flex items-center justify-center">
        <p className="text-red-600">{isVi ? 'Lỗi: ' : 'Error: '}{error}</p>
      </div>
    );
  }

  // No email, or the email doesn't match a known customer yet — show the
  // same "new member" (0 points, Standard tier, no history) state that this
  // page always showed before real data existed. Never fabricate activity.
  const isNewMember = !userEmail || !loyaltyData?.customer;
  const currentPoints = isNewMember ? 0 : loyaltyData!.totalPoints;
  const currentTierIdx = isNewMember ? 0 : loyaltyData!.currentTierIndex;
  const orders = isNewMember ? [] : loyaltyData!.orders;

  const isMaxTier = currentTierIdx === loyaltyTiers.length - 1;
  const nextTierIdx = Math.min(currentTierIdx + 1, loyaltyTiers.length - 1);
  const nextTier = loyaltyTiers[nextTierIdx];

  const progress = isMaxTier
    ? 100
    : ((currentPoints - loyaltyTiers[currentTierIdx].minPoints) /
       (nextTier.minPoints - loyaltyTiers[currentTierIdx].minPoints)) * 100;

  // Cashback "saved" estimate = current tier's discount % applied to real
  // order totals. Not a stored ledger value (none exists yet) — a derived
  // figure from real order amounts, same spirit as calculatePointsFromOrder().
  const tierDiscount = loyaltyTiers[currentTierIdx].discount;
  const totalSavedVnd = Math.round(
    orders.reduce((sum, o) => sum + o.totalAmountVnd, 0) * (tierDiscount / 100)
  );
  const totalSavedUsd = Math.round(
    orders.reduce((sum, o) => sum + o.totalAmountUsd, 0) * (tierDiscount / 100)
  );

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-16">
      <div className="container-wide max-w-5xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-100 rounded-full mb-3">
              <Crown className="w-3.5 h-3.5 text-gold-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-700"><TaWordmark /> Elite Club</span>
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
            <div className="relative rounded-3xl overflow-hidden shadow-elegant-lg bg-forest-900 p-6 text-white">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gold-400/10 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-forest-600/20 translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-gold-400" />
                    <span className="text-gold-400 font-semibold text-sm">{isVi ? loyaltyTiers[currentTierIdx].nameVi : loyaltyTiers[currentTierIdx].name} Member</span>
                  </div>
                  <img src="/assets/images/TA_logo_header.png" alt="TA Logo" className="h-8 opacity-80" />
                </div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                  {isVi ? 'Điểm Tích Lũy' : 'Total Points'}
                </p>
                <p className="font-display text-4xl font-black text-white mb-1">
                  {loading ? '...' : currentPoints.toLocaleString()}
                </p>
                <p className="text-white/50 text-xs">
                  {isMaxTier
                    ? (isVi ? 'Bạn đã đạt hạng cao nhất' : "You've reached the top tier")
                    : (isVi
                        ? `Còn ${(nextTier.minPoints - currentPoints).toLocaleString()} điểm để lên ${nextTier.nameVi}`
                        : `${(nextTier.minPoints - currentPoints).toLocaleString()} pts to ${nextTier.name}`)}
                </p>
                {/* Progress bar */}
                <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} />
                </div>
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>{isVi ? loyaltyTiers[currentTierIdx].nameVi : loyaltyTiers[currentTierIdx].name}</span>
                  <span>{isVi ? nextTier.nameVi : nextTier.name} ({nextTier.minPoints.toLocaleString()} pts)</span>
                </div>
              </div>
            </div>

            {/* Tier benefits — bam vao 1 the de xem day du quyen loi trong dialog */}
            {loyaltyTiers.map((tier, i) => (
              <button
                key={tier.name}
                type="button"
                onClick={() => setSelectedTierIdx(i)}
                className={`w-full text-left rounded-2xl p-5 transition-all hover:shadow-elegant-lg hover:-translate-y-0.5 ${i === currentTierIdx ? 'ring-2 ring-forest-500 bg-white shadow-elegant' : 'bg-cream-100'}`}
              >
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
                <span className="inline-flex items-center gap-1 text-xs font-medium text-forest-500 mt-2">
                  {isVi ? 'Xem đầy đủ quyền lợi' : 'View full benefits'} <ChevronRight className="w-3 h-3" />
                </span>
              </button>
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
                    ? 'Điểm từ Website, Shopee, TikTok và showroom TA được gộp tự động vào tài khoản này.'
                    : 'Points from Website, Shopee, TikTok, and TA showrooms automatically merge into this account.'}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: isVi ? 'Tổng Điểm' : 'Total Points', value: currentPoints.toLocaleString(), icon: Star },
                { label: isVi ? 'Đơn Hàng' : 'Orders Placed', value: orders.length.toLocaleString(), icon: ShoppingBag },
                { label: isVi ? 'Tiết Kiệm Được' : 'Total Saved', value: isVi ? `${totalSavedVnd.toLocaleString('vi-VN')}₫` : `$${totalSavedUsd.toLocaleString()}`, icon: TrendingUp },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-2xl p-4 shadow-elegant text-center">
                  <Icon className="w-5 h-5 text-gold-500 mx-auto mb-2" />
                  <p className="font-display text-2xl font-bold text-forest-900">{value}</p>
                  <p className="text-forest-400 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Points activity — 3 tab: Lich Su Diem (that, tu don hang) / Qua
                Da Doi (chua co he thong doi qua that nao, de trong that thay
                vi bia du lieu) / Dac Quyen Cua Toi (that, day du perks hang
                hien tai, khong cat bot nhu the ben trai) */}
            <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
              <div className="flex items-center border-b border-cream-200">
                {([
                  { key: 'history' as const, label: isVi ? 'Lịch Sử Điểm' : 'Points History', icon: Zap },
                  { key: 'redeemed' as const, label: isVi ? 'Quà Đã Đổi' : 'Redeemed', icon: PackageOpen },
                  { key: 'perks' as const, label: isVi ? 'Đặc Quyền Của Tôi' : 'My Perks', icon: Sparkles },
                ]).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      activeTab === key
                        ? 'border-forest-900 text-forest-900'
                        : 'border-transparent text-forest-400 hover:text-forest-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              {activeTab === 'history' && (
                orders.length > 0 ? (
                  <div className="p-5 space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between pb-3 border-b border-cream-100 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-forest-900">
                            {isVi ? 'Đơn hàng' : 'Order'} #{order.orderNumber}
                          </p>
                          <p className="text-xs text-forest-400">
                            {new Date(order.purchasedAt).toLocaleDateString(isVi ? 'vi-VN' : 'en-US')}
                          </p>
                        </div>
                        <p className="font-semibold text-gold-500">
                          +{Math.round(order.totalAmountUsd)} {isVi ? 'điểm' : 'pts'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-forest-400">
                    <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{isVi ? 'Chưa có hoạt động tích điểm nào.' : 'No points activity yet.'}</p>
                    <p className="text-xs mt-1">{isVi ? 'Mua hàng để bắt đầu tích điểm.' : 'Shop to start earning points.'}</p>
                  </div>
                )
              )}

              {activeTab === 'redeemed' && (
                <div className="text-center py-12 text-forest-400">
                  <PackageOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">{isVi ? 'Chưa có quà nào được đổi.' : 'No rewards redeemed yet.'}</p>
                  <p className="text-xs mt-1">
                    {isVi ? 'Tính năng đổi điểm lấy quà sẽ sớm ra mắt.' : 'The points redemption catalog is coming soon.'}
                  </p>
                </div>
              )}

              {activeTab === 'perks' && (
                <div className="p-5">
                  <p className="text-xs text-forest-400 mb-3">
                    {isVi ? 'Toàn bộ quyền lợi của hạng' : 'All benefits of your'} <span className="font-semibold text-forest-700">{isVi ? loyaltyTiers[currentTierIdx].nameVi : loyaltyTiers[currentTierIdx].name}</span>
                  </p>
                  <ul className="space-y-2">
                    {(isVi ? loyaltyTiers[currentTierIdx].perksVi : loyaltyTiers[currentTierIdx].perks).map((perk, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-forest-700">
                        <Star className="w-4 h-4 text-gold-400 fill-gold-400 flex-shrink-0 mt-0.5" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
                    {isVi ? 'Bắt đầu mua hàng để tích điểm đổi quà.' : 'Start shopping to earn points you can redeem.'}
                  </p>
                </div>
              </div>
              <button onClick={() => onNavigate('catalog')} className="btn-primary text-sm flex-shrink-0">
                {isVi ? 'Mua Ngay' : 'Shop Now'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chi tiet 1 hang thanh vien — bam the hang o cot trai mo dialog nay,
          hien du toan bo perks that (khong cat con 3 dong nhu the tom tat). */}
      <Dialog open={selectedTierIdx !== null} onOpenChange={(open) => !open && setSelectedTierIdx(null)}>
        <DialogContent className="max-w-md">
          {selectedTierIdx !== null && (
            <>
              <DialogHeader>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${loyaltyTiers[selectedTierIdx].color} flex items-center justify-center mb-2`}>
                  <Crown className={`w-6 h-6 ${selectedTierIdx === 2 ? 'text-forest-900' : selectedTierIdx === 1 ? 'text-white' : 'text-forest-700'}`} />
                </div>
                <DialogTitle>{isVi ? loyaltyTiers[selectedTierIdx].nameVi : loyaltyTiers[selectedTierIdx].name}</DialogTitle>
                <p className="text-sm text-forest-500">
                  {loyaltyTiers[selectedTierIdx].minPoints.toLocaleString()}+ {isVi ? 'điểm' : 'pts'} · {loyaltyTiers[selectedTierIdx].discount}% {isVi ? 'hoàn tiền mọi đơn hàng' : 'cashback on every order'}
                </p>
              </DialogHeader>
              <ul className="space-y-2.5">
                {(isVi ? loyaltyTiers[selectedTierIdx].perksVi : loyaltyTiers[selectedTierIdx].perks).map((perk, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-forest-700">
                    <Star className="w-4 h-4 text-gold-400 fill-gold-400 flex-shrink-0 mt-0.5" />
                    {perk}
                  </li>
                ))}
              </ul>
              {selectedTierIdx > currentTierIdx && (
                <p className="text-xs text-forest-400 pt-2 border-t border-cream-200">
                  {isVi
                    ? `Tích thêm ${(loyaltyTiers[selectedTierIdx].minPoints - currentPoints).toLocaleString()} điểm để lên hạng này.`
                    : `Earn ${(loyaltyTiers[selectedTierIdx].minPoints - currentPoints).toLocaleString()} more points to unlock this tier.`}
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
