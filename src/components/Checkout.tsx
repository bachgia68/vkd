import { useState } from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Truck, ShieldCheck, CheckCircle, Loader, AlertCircle, DollarSign } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Language } from '../i18n/translations';

interface CheckoutProps {
  lang: Language;
  onNavigate: (page: string) => void;
  onOrderSuccess: (orderId: string) => void;
}

type PaymentMethod = 'stripe' | 'paypal' | 'vnpay' | 'momo' | 'payos';
type PaymentState = 'idle' | 'processing' | 'verifying' | 'success' | 'failed';
type Region = 'vn' | 'us' | 'eu' | 'jp' | 'cn';

const regionConfig: Record<Region, { currency: string; symbol: string; taxRate: number; priceKey: 'priceVND' | 'priceUSD' | 'priceEUR' | 'priceJPY' | 'priceCNY' }> = {
  vn: { currency: 'VND', symbol: '₫', taxRate: 0.08, priceKey: 'priceVND' },
  us: { currency: 'USD', symbol: '$', taxRate: 0.09, priceKey: 'priceUSD' },
  eu: { currency: 'EUR', symbol: '€', taxRate: 0.10, priceKey: 'priceEUR' },
  jp: { currency: 'JPY', symbol: '¥', taxRate: 0.10, priceKey: 'priceJPY' },
  cn: { currency: 'CNY', symbol: '¥', taxRate: 0.09, priceKey: 'priceCNY' },
};

function fmtPrice(amount: number, region: Region) {
  const { symbol, currency } = regionConfig[region];
  if (currency === 'VND' || currency === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  return `${symbol}${amount.toFixed(2)}`;
}

export default function Checkout({ lang, onNavigate }: CheckoutProps) {
  const { items, subtotalVND } = useCart();
  const isVi = lang === 'vi';

  const [region, setRegion] = useState<Region>('vn');
  const [paymentMethod] = useState<PaymentMethod>('payos');
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', country: 'Vietnam' });

  const rc = regionConfig[region];
  const subtotal = region === 'vn' ? subtotalVND : items.reduce((s, item) => s + (item[rc.priceKey] as number) * item.quantity, 0);
  const tax = subtotal * rc.taxRate;
  const total = subtotal + tax;

  // PayOS chỉ hỗ trợ VND — tính riêng theo tổng VN, không phụ thuộc khu vực đang chọn.
  // Phí vận chuyển KHÔNG tính ở bước đặt hàng — nhân viên VKD liên hệ xác nhận sau khi nhận đơn.
  const payosTotal = Math.round(subtotalVND + subtotalVND * regionConfig.vn.taxRate);

  const handlePayOSCheckout = async () => {
    setPaymentState('processing');
    try {
      const origin = window.location.origin;
      const res = await fetch('/.netlify/functions/create-payos-payment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          amount: payosTotal,
          items: items.map((i) => ({ name: i.nameVi || i.name, quantity: i.quantity, price: i.priceVND })),
          buyerName: form.name,
          buyerEmail: form.email,
          buyerPhone: form.phone,
          returnUrl: `${origin}/?payos_return=1`,
          cancelUrl: `${origin}/?payos_cancel=1`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        setPaymentState('failed');
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setPaymentState('failed');
    }
  };

  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || !form.address) return;
    await handlePayOSCheckout();
  };

  const paymentOptions: { key: PaymentMethod; label: string; logo: string; type: string; comingSoon?: boolean }[] = [
    { key: 'payos',   label: 'PayOS · Chuyển khoản QR', logo: '🏦', type: 'VietQR Napas 24/7' },
    { key: 'stripe',  label: 'Credit / Debit Card', logo: '💳', type: 'International', comingSoon: true },
    { key: 'paypal',  label: 'PayPal',              logo: '🅿',  type: 'International', comingSoon: true },
    { key: 'vnpay',   label: 'VNPAY',               logo: '🇻🇳', type: 'Domestic (VN)', comingSoon: true },
    { key: 'momo',    label: 'MoMo Wallet',         logo: '💜', type: 'Domestic (VN)', comingSoon: true },
  ];

  if (paymentState === 'processing' || paymentState === 'verifying') {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Loader className="w-10 h-10 text-forest-600 animate-spin" />
          </div>
          <h2 className="font-display text-2xl font-bold text-forest-900 mb-2">
            {paymentState === 'processing'
              ? (isVi ? 'Đang Xử Lý Thanh Toán...' : 'Processing Payment...')
              : (isVi ? 'Đang Xác Minh Giao Dịch...' : 'Verifying Transaction...')}
          </h2>
          <p className="text-forest-500">{isVi ? 'Vui lòng không đóng trang này.' : 'Please do not close this page.'}</p>
        </div>
      </div>
    );
  }

  if (paymentState === 'failed') {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-forest-900 mb-2">
            {isVi ? 'Thanh Toán Thất Bại' : 'Payment Failed'}
          </h2>
          <p className="text-forest-500 mb-6">
            {isVi ? 'Giao dịch không thành công. Vui lòng kiểm tra lại thông tin thanh toán.' : 'Transaction was declined. Please check your payment details and try again.'}
          </p>
          <button onClick={() => setPaymentState('idle')} className="btn-primary">
            {isVi ? 'Thử Lại' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-16">
      <div className="container-wide max-w-6xl">
        {/* Back */}
        <button onClick={() => onNavigate('catalog')} className="flex items-center gap-2 text-forest-500 hover:text-forest-800 mb-8 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          {isVi ? 'Quay Lại Cửa Hàng' : 'Back to Shop'}
        </button>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8">

          {/* ── LEFT: Forms ── */}
          <div className="space-y-6">
            {/* Region picker */}
            <div className="bg-white rounded-2xl p-6 shadow-elegant">
              <h3 className="font-display font-semibold text-forest-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gold-500" />
                {isVi ? 'Khu Vực & Tiền Tệ' : 'Region & Currency'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(regionConfig) as Region[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${region === r ? 'bg-forest-900 text-cream-50' : 'bg-cream-100 text-forest-600 hover:bg-forest-50'}`}
                  >
                    {r.toUpperCase()} · {regionConfig[r].currency}
                  </button>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl p-6 shadow-elegant">
              <h3 className="font-display font-semibold text-forest-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-gold-500" />
                {isVi ? 'Thông Tin Nhận Hàng' : 'Delivery Information'}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[
                  { key: 'name',    label: isVi ? 'Họ Tên' : 'Full Name',      placeholder: isVi ? 'Nguyễn Văn A' : 'John Smith' },
                  { key: 'email',   label: 'Email',                             placeholder: 'your@email.com' },
                  { key: 'phone',   label: isVi ? 'Số Điện Thoại' : 'Phone',   placeholder: '+84 ...' },
                  { key: 'country', label: isVi ? 'Quốc Gia' : 'Country',      placeholder: 'Vietnam' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-forest-600 mb-1.5 uppercase tracking-wide">{label}</label>
                    <input
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none text-forest-900 text-sm bg-cream-50 transition-all"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-forest-600 mb-1.5 uppercase tracking-wide">{isVi ? 'Địa Chỉ' : 'Street Address'}</label>
                  <input
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder={isVi ? '123 Đường Lê Lợi, Quận 1...' : '123 Main Street...'}
                    className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none text-forest-900 text-sm bg-cream-50 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-gold-50 border border-gold-100">
                <Truck className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <p className="text-gold-800 text-xs">
                  {isVi
                    ? 'Phí và phương thức vận chuyển sẽ được nhân viên VKD liên hệ xác nhận với bạn ngay sau khi đặt hàng.'
                    : 'Shipping method and fee will be confirmed by VKD staff by phone shortly after you place this order.'}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 shadow-elegant">
              <h3 className="font-display font-semibold text-forest-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gold-500" />
                {isVi ? 'Phương Thức Thanh Toán' : 'Payment Method'}
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.key}
                    disabled={opt.comingSoon}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      opt.comingSoon
                        ? 'border-cream-200 opacity-50 cursor-not-allowed'
                        : paymentMethod === opt.key
                          ? 'border-forest-600 bg-forest-50'
                          : 'border-cream-200 hover:border-forest-300'
                    }`}
                  >
                    {opt.comingSoon && (
                      <span className="absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-wide text-forest-500 bg-cream-100 px-2 py-0.5 rounded-full">
                        {isVi ? 'Sắp Ra Mắt' : 'Coming Soon'}
                      </span>
                    )}
                    <div className="text-2xl mb-1">{opt.logo}</div>
                    <div className="font-semibold text-forest-900 text-sm">{opt.label}</div>
                    <div className="text-forest-400 text-xs">{opt.type}</div>
                  </button>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-forest-50 border border-forest-100 text-sm text-forest-700 space-y-1">
                <p className="font-semibold text-forest-900">Thanh toán bằng mã VietQR</p>
                <p>
                  Bấm “Đặt Hàng” để mở trang thanh toán an toàn của PayOS. Quét mã QR bằng app
                  ngân hàng để chuyển khoản — đơn hàng xác nhận tự động ngay khi chuyển khoản
                  thành công.
                </p>
                <p className="text-forest-500 text-xs pt-1">
                  Số tiền thanh toán qua PayOS: <span className="font-semibold">{fmtPrice(payosTotal, 'vn')}</span> (VND)
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-forest-50">
                <ShieldCheck className="w-4 h-4 text-forest-600 flex-shrink-0" />
                <p className="text-forest-600 text-xs">{isVi ? 'Thanh toán được mã hóa 256-bit SSL. VKD không lưu thông tin thẻ của bạn.' : '256-bit SSL encrypted. VKD never stores your card details.'}</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div>
            <div className="bg-white rounded-2xl shadow-elegant overflow-hidden sticky top-24">
              <div className="bg-forest-900 px-6 py-4">
                <h3 className="font-display font-semibold text-white">{isVi ? 'Tóm Tắt Đơn Hàng' : 'Order Summary'}</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-14 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-forest-900 text-xs font-medium leading-snug line-clamp-2">{isVi ? item.nameVi : item.name}</p>
                        <p className="text-forest-400 text-xs mt-0.5">×{item.quantity}</p>
                      </div>
                      <div className="text-forest-900 text-sm font-bold flex-shrink-0">
                        {fmtPrice((item[rc.priceKey] as number) * item.quantity, region)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-cream-200">
                  {[
                    { label: isVi ? 'Tạm Tính' : 'Subtotal', value: fmtPrice(subtotal, region) },
                    { label: isVi ? `Thuế (${(rc.taxRate * 100).toFixed(0)}%)` : `Tax (${(rc.taxRate * 100).toFixed(0)}%)`, value: fmtPrice(tax, region) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm text-forest-600">
                      <span>{label}</span><span>{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm text-forest-400 italic">
                    <span>{isVi ? 'Phí vận chuyển' : 'Shipping fee'}</span>
                    <span>{isVi ? 'Xác nhận sau' : 'Confirmed later'}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-cream-200">
                    <span className="font-bold text-forest-900">{isVi ? 'Tổng Cộng' : 'Total'}</span>
                    <span className="font-display font-bold text-forest-900 text-xl">{fmtPrice(total, region)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={items.length === 0}
                  className="btn-gold w-full justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                  {isVi ? 'Đặt Hàng' : 'Place Order'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {items.length === 0 && (
                  <p className="text-center text-forest-400 text-xs mt-3">{isVi ? 'Giỏ hàng trống' : 'Your cart is empty'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
