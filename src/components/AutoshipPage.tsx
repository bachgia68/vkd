import { useState } from 'react';
import { RefreshCw, CheckCircle, Info, Calendar, Pause, X, Plus } from 'lucide-react';
import { vkdProducts, toCartProduct } from '../data/vkdProducts';
import type { Language } from '../i18n/translations';

interface AutoshipProps {
  lang: Language;
  onNavigate: (page: string) => void;
}

const frequencies = [
  { days: 30, labelEn: 'Every 30 days', labelVi: 'Mỗi 30 ngày' },
  { days: 60, labelEn: 'Every 60 days', labelVi: 'Mỗi 60 ngày' },
  { days: 90, labelEn: 'Every 90 days', labelVi: 'Mỗi 90 ngày' },
];

// Sản phẩm dùng hàng ngày/định kỳ (thực phẩm bổ sung) phù hợp đặt hàng tự động.
const products = vkdProducts.filter(p => p.category === 'supplements').map(toCartProduct);
const subscriptionProducts = products;

interface MockSubscription {
  productId: string;
  frequencyDays: number;
  nextDate: string;
  status: 'active' | 'paused';
}

export default function AutoshipPage({ lang, onNavigate: _nav }: AutoshipProps) {
  const isVi = lang === 'vi';
  const [subscriptions, setSubscriptions] = useState<MockSubscription[]>([
    { productId: 'VKD-010', frequencyDays: 30, nextDate: '2026-08-10', status: 'active' },
    { productId: 'VKD-003', frequencyDays: 30, nextDate: '2026-08-10', status: 'active' },
  ]);
  const [freq, setFreq] = useState(30);

  const togglePause = (id: string) => {
    setSubscriptions(prev => prev.map(s =>
      s.productId === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
    ));
  };

  const cancelSub = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.productId !== id));
  };

  const addSubscription = (productId: string) => {
    if (subscriptions.find(s => s.productId === productId)) return;
    const nextDate = new Date(Date.now() + freq * 86400000).toISOString().split('T')[0];
    setSubscriptions(prev => [...prev, { productId, frequencyDays: freq, nextDate, status: 'active' }]);

  };

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-16">
      <div className="container-wide max-w-4xl">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-100 rounded-full mb-6">
            <RefreshCw className="w-3.5 h-3.5 text-forest-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-forest-700">
              {isVi ? 'VKD Autoship' : 'VKD Autoship'}
            </span>
          </div>
          <h1 className="font-display text-display-sm text-forest-900 mb-4">
            {isVi ? 'Đặt Hàng Định Kỳ — Tiết Kiệm 10%' : 'Subscribe & Save 10%'}
          </h1>
          <p className="text-forest-600 text-lg">
            {isVi
              ? 'Không bao giờ bỏ lỡ liều sâm hàng ngày. Giao tự động, giảm giá ngay, hủy bất kỳ lúc nào.'
              : 'Never miss your daily ginseng dose. Auto-delivery, instant savings, cancel anytime — no commitment.'}
          </p>
        </div>

        {/* Benefits banner */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: '💰', titleEn: 'Save 10% Always',        titleVi: 'Luôn Tiết Kiệm 10%',      descEn: 'Permanent subscriber discount on every shipment', descVi: 'Giảm giá thành viên vĩnh viễn mọi đơn' },
            { icon: '🚚', titleEn: 'Free Express Delivery',  titleVi: 'Giao Hàng Nhanh Miễn Phí', descEn: 'DHL Express included on all subscription orders', descVi: 'DHL Express miễn phí cho mọi đơn định kỳ' },
            { icon: '⚡', titleEn: 'Flex & Cancel Anytime',  titleVi: 'Linh Hoạt Hủy Bất Kỳ Lúc Nào', descEn: 'Pause, skip, or cancel with one tap — zero penalty', descVi: 'Tạm dừng, bỏ qua hoặc hủy một chạm — không phí' },
          ].map(b => (
            <div key={b.titleEn} className="bg-white rounded-2xl p-5 shadow-elegant text-center">
              <div className="text-3xl mb-3">{b.icon}</div>
              <p className="font-display font-semibold text-forest-900 mb-1">{isVi ? b.titleVi : b.titleEn}</p>
              <p className="text-forest-500 text-sm">{isVi ? b.descVi : b.descEn}</p>
            </div>
          ))}
        </div>

        {/* Active subscriptions */}
        <div className="bg-white rounded-2xl shadow-elegant overflow-hidden mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 bg-forest-900">
            <h3 className="font-display font-semibold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-gold-400" />
              {isVi ? 'Đăng Ký Đang Hoạt Động' : 'Active Subscriptions'}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-gold-400 text-forest-900 text-xs font-bold">{subscriptions.filter(s => s.status === 'active').length}</span>
          </div>

          {subscriptions.length === 0 ? (
            <div className="text-center py-12 text-forest-400">
              <RefreshCw className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>{isVi ? 'Chưa có đăng ký nào.' : 'No active subscriptions yet.'}</p>
            </div>
          ) : (
            <div className="divide-y divide-cream-100">
              {subscriptions.map(sub => {
                const product = products.find(p => p.id === sub.productId);
                if (!product) return null;
                return (
                  <div key={sub.productId} className={`flex items-center gap-4 p-5 ${sub.status === 'paused' ? 'opacity-60 bg-cream-50' : ''}`}>
                    <img src={product.image} alt={product.name} className="w-16 h-20 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-forest-900 text-sm leading-snug">{isVi ? product.nameVi : product.name}</p>
                      <p className="text-xs text-forest-400 mt-0.5">{product.activeIngredient}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-forest-600">
                          <RefreshCw className="w-3 h-3" />
                          {frequencies.find(f => f.days === sub.frequencyDays)?.[isVi ? 'labelVi' : 'labelEn']}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-forest-600">
                          <Calendar className="w-3 h-3" />
                          {isVi ? 'Giao tiếp theo:' : 'Next:'} {sub.nextDate}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${sub.status === 'active' ? 'bg-forest-100 text-forest-700' : 'bg-cream-200 text-forest-500'}`}>
                          {sub.status === 'active' ? (isVi ? 'Đang Hoạt Động' : 'Active') : (isVi ? 'Tạm Dừng' : 'Paused')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <div className="text-right mb-1">
                        <p className="font-bold text-forest-900 text-sm">${(product.priceUSD * 0.9).toFixed(2)}</p>
                        <p className="text-xs text-forest-400 line-through">${product.priceUSD.toFixed(2)}</p>
                      </div>
                      <button onClick={() => togglePause(sub.productId)} className="inline-flex items-center gap-1 text-xs text-forest-500 hover:text-forest-700 transition-colors">
                        <Pause className="w-3 h-3" />
                        {sub.status === 'active' ? (isVi ? 'Tạm dừng' : 'Pause') : (isVi ? 'Tiếp tục' : 'Resume')}
                      </button>
                      <button onClick={() => cancelSub(sub.productId)} className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors">
                        <X className="w-3 h-3" />
                        {isVi ? 'Hủy' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add subscription */}
        <div className="bg-white rounded-2xl shadow-elegant overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-cream-200">
            <h3 className="font-display font-semibold text-forest-900">
              {isVi ? 'Thêm Sản Phẩm Định Kỳ' : 'Add Subscription Products'}
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 p-4 bg-gold-50 rounded-xl">
              <Info className="w-5 h-5 text-gold-600 flex-shrink-0" />
              <p className="text-sm text-gold-800">
                {isVi ? 'Chọn tần suất giao hàng trước, sau đó nhấn "+" để thêm sản phẩm vào gói định kỳ.' : 'Select delivery frequency first, then tap "+" to add a product to your autoship.'}
              </p>
            </div>

            {/* Frequency picker */}
            <div className="flex gap-2 mb-6">
              {frequencies.map(f => (
                <button
                  key={f.days}
                  onClick={() => setFreq(f.days)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${freq === f.days ? 'bg-forest-900 text-cream-50' : 'bg-cream-100 text-forest-600 hover:bg-forest-50'}`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {isVi ? f.labelVi : f.labelEn}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {subscriptionProducts.map(product => {
                const alreadyAdded = subscriptions.some(s => s.productId === product.id);
                return (
                  <div key={product.id} className={`flex gap-3 p-4 rounded-xl border ${alreadyAdded ? 'border-forest-200 bg-forest-50' : 'border-cream-200 hover:border-forest-300 transition-colors'}`}>
                    <img src={product.image} alt={product.name} className="w-14 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-forest-900 text-sm font-medium leading-tight line-clamp-2">{isVi ? product.nameVi : product.name}</p>
                      <p className="text-xs text-forest-400 mt-0.5">{product.activeIngredient}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="font-bold text-forest-900 text-sm">${(product.priceUSD * 0.9).toFixed(2)}</span>
                          <span className="text-xs text-forest-400 line-through ml-1">${product.priceUSD.toFixed(2)}</span>
                        </div>
                        {alreadyAdded ? (
                          <span className="flex items-center gap-1 text-xs text-forest-600 font-semibold">
                            <CheckCircle className="w-4 h-4 text-forest-500" />
                            {isVi ? 'Đã thêm' : 'Added'}
                          </span>
                        ) : (
                          <button onClick={() => addSubscription(product.id)} className="w-8 h-8 rounded-full bg-forest-900 hover:bg-forest-700 text-white flex items-center justify-center transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Notification log */}
        <div className="bg-white rounded-2xl shadow-elegant p-6">
          <h3 className="font-display font-semibold text-forest-900 mb-4">
            {isVi ? 'Thông Báo Tự Động' : 'Automated Notifications'}
          </h3>
          <div className="space-y-3">
            {[
              { icon: '📦', msg: isVi ? 'Đơn PanaxX của bạn sẽ tự động gửi sau 3 ngày.' : 'Your PanaxX autoship will dispatch in 3 days.', time: isVi ? '7 ngày trước' : '7 days ago', type: 'reminder' },
              { icon: '✅', msg: isVi ? 'Đơn định kỳ #VKD-SUB-001 đã được xác nhận và giao thành công.' : 'Subscription #VKD-SUB-001 confirmed and delivered successfully.', time: isVi ? '37 ngày trước' : '37 days ago', type: 'success' },
              { icon: '🎁', msg: isVi ? 'Tích thêm 280 điểm Elite từ đơn Autoship tháng trước.' : 'Earned +280 Elite points from last month\'s Autoship.', time: isVi ? '37 ngày trước' : '37 days ago', type: 'points' },
            ].map((n, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-cream-50">
                <span className="text-xl flex-shrink-0">{n.icon}</span>
                <div>
                  <p className="text-forest-800 text-sm">{n.msg}</p>
                  <p className="text-forest-400 text-xs mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
