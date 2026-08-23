import { useState } from 'react';
import { ShoppingBag, Tv2, CheckCircle, Crown, Star, ArrowRight, Zap, Gift, Users, MessageSquare } from 'lucide-react';
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

const liveEvents = [
  { title: 'VKD Expert LIVE: MR2 Saponin Deep Dive', titleVi: 'VKD Expert LIVE: Khám Phá MR2 Saponin', platform: 'TikTok', time: 'Every Tue & Thu, 8PM ICT', timeVi: 'Thứ 3 & 5 hàng tuần, 20:00 ICT', live: true },
  { title: 'VKD Plantation Tour — Behind the Scenes Kon Tum', titleVi: 'Tham Quan Vùng Trồng Kon Tum — Hậu Trường', platform: 'FB', time: 'Every Sat, 10AM ICT', timeVi: 'Thứ 7 hàng tuần, 10:00 ICT', live: false },
  { title: 'Pn\'s Beauty Science with Dr. Nguyen Minh Hoang', titleVi: 'Khoa Học Làm Đẹp Pn\'s Cùng Bác Sĩ Nguyễn Minh Hoàng', platform: 'Instagram', time: 'Every Wed, 7PM ICT', timeVi: 'Thứ 4 hàng tuần, 19:00 ICT', live: false },
];

const reviews = [
  { handle: '@dr.minhthu_wellness', platform: 'Instagram', text: 'After 3 months on VKD ginseng capsules, my patients report measurable improvements in fatigue and cognitive resilience. MR2 is not marketing — it\'s pharmacology.', textVi: 'Sau 3 tháng dùng viên nang sâm VKD, bệnh nhân của tôi báo cáo cải thiện rõ về mệt mỏi và nhận thức. MR2 không phải marketing — đó là dược lý học.', stars: 5, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop' },
  { handle: '@executive.life.vn', platform: 'FB', text: 'PanaxX has replaced my morning espresso. Clean energy, no crash, and I can actually focus for 6-hour strategy sessions. Worth every dong.', textVi: 'PanaxX đã thay thế cà phê sáng của tôi. Năng lượng sạch, không mệt đột ngột và tôi có thể tập trung cho các buổi chiến lược 6 tiếng.', stars: 5, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { handle: '@nguyen.phuong.beauty', platform: 'Instagram', text: 'The Pn\'s Gold Serum is genuinely transformative. My dermatologist confirmed collagen density improvement at the 6-week check-in. Quiet luxury — real results.', textVi: 'Serum Vàng Pn\'s thực sự đột phá. Bác sĩ da liễu của tôi xác nhận mật độ collagen cải thiện rõ sau 6 tuần.', stars: 5, image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop' },
  { handle: '@kontumlover', platform: 'TikTok', text: 'I visited the Kon Tum plantation on the VVIP tour. Seeing 6-year-old roots in their natural habitat at 1,800m — no supplement brand does this. VKD is the real deal.', textVi: 'Tôi đã tham quan vùng trồng Kon Tum trong chuyến tour VVIP. Nhìn thấy sâm 6 năm tuổi trong môi trường tự nhiên ở 1.800m — không thương hiệu nào làm được điều này.', stars: 5, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
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
              {isVi ? 'Mua Hàng Chính Hãng — Không Gian Giả Mạo' : 'Buy Authentic — Zero Counterfeits Guaranteed'}
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

      {/* ── LIVE & SOCIAL HUB ── */}
      <div className="section-padding bg-forest-950 text-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Live Events */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/20 rounded-full mb-6">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-xs font-semibold tracking-wider uppercase text-red-400">
                  {isVi ? 'VKD Live & Mạng Xã Hội' : 'VKD Live & Social Hub'}
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl text-white mb-4">
                {isVi ? 'Livestream Chuyên Gia & Cộng Đồng' : 'Expert Livestreams & Community'}
              </h2>
              <p className="text-white/60 mb-8">
                {isVi
                  ? 'Theo dõi chương trình phát sóng trực tiếp hàng tuần từ hội đồng y khoa VKD, tham quan vùng trồng và hội thảo làm đẹp.'
                  : 'Tune into weekly live broadcasts from the VKD medical board, plantation tours, and beauty science workshops.'}
              </p>

              <div className="space-y-4">
                {liveEvents.map((ev, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      {ev.platform === 'TikTok'    && <Tv2        className="w-5 h-5 text-white" />}
                      {ev.platform === 'FB'  && <Users   className="w-5 h-5 text-blue-400" />}
                      {ev.platform === 'Instagram' && <MessageSquare  className="w-5 h-5 text-pink-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-white/50">{ev.platform}</span>
                        {ev.live && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/30 text-red-300 text-xs font-bold">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-white font-medium text-sm leading-snug mb-1">{isVi ? ev.titleVi : ev.title}</p>
                      <p className="text-white/40 text-xs">{isVi ? ev.timeVi : ev.time}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-gold-400 transition-colors self-center flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof Gallery */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-400/20 rounded-full mb-6">
                <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                <span className="text-xs font-semibold tracking-wider uppercase text-gold-400">
                  {isVi ? 'Phản Hồi Cộng Đồng' : 'Social Proof Gallery'}
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl text-white mb-8">
                {isVi ? 'Khách Hàng Nói Gì Về VKD' : 'What Our Community Says'}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {reviews.map((rev, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={rev.image} alt={rev.handle} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="text-white text-xs font-semibold">{rev.handle}</div>
                        <div className="text-white/40 text-xs">{rev.platform}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: rev.stars }).map((_, s) => (
                        <Star key={s} className="w-3 h-3 fill-gold-400 text-gold-400" />
                      ))}
                    </div>
                    <p className="text-white/70 text-xs leading-relaxed line-clamp-3">
                      {isVi ? rev.textVi : rev.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
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
