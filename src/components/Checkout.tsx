import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Truck, ShieldCheck, CheckCircle, Loader, AlertCircle, DollarSign, Crown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Language } from '../i18n/translations';
import { useLoyaltyData } from '../hooks/useLoyaltyData';

// TA Elite Club redemption: 1 điểm = 100đ giảm giá, tối đa 30% giá trị đơn hàng
// mỗi lần thanh toán (bảo vệ biên lợi nhuận). Điểm chỉ thực sự bị trừ khi đơn
// hàng thanh toán thành công (xem mark_payos_order_paid trong migration
// wire_loyalty_accrual_and_redemption) — huỷ/bỏ giữa chừng không mất điểm.
const REDEMPTION_VND_PER_POINT = 100;
const MAX_REDEEM_RATIO = 0.3;

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

export default function Checkout({ lang, onNavigate, onOrderSuccess }: CheckoutProps) {
  const { items, subtotalVND } = useCart();
  const isVi = lang === 'vi';

  const [region, setRegion] = useState<Region>(isVi ? 'vn' : 'us');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('payos');
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', country: 'Vietnam' });
  const [formError, setFormError] = useState<string | null>(null);

  // Chỉ tra điểm khi email hợp lệ và đã rời khỏi ô nhập (blur) — tránh gọi
  // RPC theo từng phím gõ.
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const paypalRendered = useRef(false);

  const [lookupEmail, setLookupEmail] = useState<string | null>(null);
  const { data: loyaltyData } = useLoyaltyData(lookupEmail);
  const pointsBalance = loyaltyData?.totalPoints ?? 0;
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  const rc = regionConfig[region];
  const subtotal = region === 'vn' ? subtotalVND : items.reduce((s, item) => s + (item[rc.priceKey] as number) * item.quantity, 0);
  const tax = subtotal * rc.taxRate;
  const total = subtotal + tax;

  // PayOS chỉ hỗ trợ VND — tính riêng theo tổng VN, không phụ thuộc khu vực đang chọn.
  // Phí vận chuyển KHÔNG tính ở bước đặt hàng — nhân viên TA liên hệ xác nhận sau khi nhận đơn.
  const payosSubtotal = Math.round(subtotalVND + subtotalVND * regionConfig.vn.taxRate);
  const maxRedeemablePoints = Math.max(
    0,
    Math.min(pointsBalance, Math.floor((payosSubtotal * MAX_REDEEM_RATIO) / REDEMPTION_VND_PER_POINT))
  );
  const appliedPoints = Math.min(pointsToRedeem, maxRedeemablePoints);
  const redemptionDiscount = appliedPoints * REDEMPTION_VND_PER_POINT;
  const payosTotal = Math.max(0, payosSubtotal - redemptionDiscount);

  const handlePayOSCheckout = async () => {
    setPaymentState('processing');
    try {
      const origin = window.location.origin;
      const res = await fetch('/api/create-payos-payment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          amount: payosTotal,
          items: items.map((i) => ({ sku: i.id, name: i.nameVi || i.name, quantity: i.quantity, price: i.priceVND })),
          buyerName: form.name,
          buyerEmail: form.email,
          buyerPhone: form.phone,
          returnUrl: `${origin}/?payos_return=1`,
          cancelUrl: `${origin}/?payos_cancel=1`,
          pointsRedeemed: appliedPoints,
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

  // Render PayPal Smart Buttons when PayPal tab selected
  useEffect(() => {
    if (paymentMethod !== 'paypal') return;
    if (!paypalContainerRef.current) return;
    if (paypalRendered.current) return;

    const PPID = import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined;
    if (!PPID) return;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PPID}&currency=USD`;
    script.onload = () => {
      if (!paypalContainerRef.current) return;
      paypalRendered.current = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).paypal.Buttons({
        createOrder: async () => {
          const amountUSD = regionConfig.us.priceKey === 'priceUSD'
            ? items.reduce((s, i) => s + i.priceUSD * i.quantity, 0) * (1 + regionConfig.us.taxRate)
            : subtotalVND / 25000;
          const res = await fetch('/api/create-paypal-order', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              amountUSD: Math.max(1, parseFloat(amountUSD.toFixed(2))),
              description: `TA Sâm Ngọc Linh — ${items.length} sản phẩm`,
            }),
          });
          const data = await res.json() as { orderID: string };
          return data.orderID;
        },
        onApprove: async (data: { orderID: string }) => {
          setPaymentState('verifying');
          const res = await fetch('/api/capture-paypal-order', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID }),
          });
          const result = await res.json() as { success: boolean; paypalOrderId: string };
          if (result.success) {
            onOrderSuccess(`PAYPAL-${result.paypalOrderId}`);
          } else {
            setPaymentState('failed');
          }
        },
        onError: () => setPaymentState('failed'),
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' },
      }).render(paypalContainerRef.current);
    };
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, [paymentMethod, items, subtotalVND]);

  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || !form.address) {
      setFormError(
        isVi
          ? 'Vui lòng điền đầy đủ Họ Tên, Email và Địa Chỉ trước khi đặt hàng.'
          : 'Please fill in your Name, Email, and Address before placing the order.'
      );
      return;
    }
    setFormError(null);
    localStorage.setItem('ta_customer_email', form.email);
    await handlePayOSCheckout();
  };

  const paymentOptions: { key: PaymentMethod; label: string; logo: string; type: string; comingSoon?: boolean }[] = [
    { key: 'payos',   label: 'PayOS · Chuyển khoản QR', logo: '🏦', type: 'VietQR Napas 24/7' },
    { key: 'paypal',  label: 'PayPal',              logo: '🅿',  type: 'International (USD)' },
    { key: 'stripe',  label: 'Credit / Debit Card', logo: '💳', type: 'International', comingSoon: true },
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
                      onBlur={key === 'email' ? (e) => {
                        const v = e.target.value.trim();
                        setLookupEmail(v.includes('@') ? v : null);
                      } : undefined}
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
                    ? 'Phí và phương thức vận chuyển sẽ được nhân viên TA liên hệ xác nhận với bạn ngay sau khi đặt hàng.'
                    : 'Shipping method and fee will be confirmed by TA staff by phone shortly after you place this order.'}
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
                    onClick={() => { if (!opt.comingSoon) { setPaymentMethod(opt.key); paypalRendered.current = false; } }}
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

              {paymentMethod === 'payos' && (
                <div className="p-4 rounded-xl bg-forest-50 border border-forest-100 text-sm text-forest-700 space-y-1">
                  <p className="font-semibold text-forest-900">Thanh toán bằng mã VietQR</p>
                  <p>Bấm "Đặt Hàng" để mở trang thanh toán an toàn của PayOS. Quét mã QR bằng app ngân hàng — đơn hàng xác nhận tự động ngay khi chuyển khoản thành công.</p>
                  <p className="text-forest-500 text-xs pt-1">
                    Số tiền: <span className="font-semibold">{fmtPrice(payosTotal, 'vn')}</span> (VND)
                  </p>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800">
                    <p className="font-semibold mb-1">PayPal — International Payment (USD)</p>
                    <p className="text-xs text-blue-600">Thanh toán bảo mật qua PayPal. Click nút PayPal bên dưới để hoàn tất.</p>
                  </div>
                  <div ref={paypalContainerRef} className="min-h-[50px]" />
                </div>
              )}
              <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-forest-50">
                <ShieldCheck className="w-4 h-4 text-forest-600 flex-shrink-0" />
                <p className="text-forest-600 text-xs">{isVi ? 'Thanh toán được mã hóa 256-bit SSL. TA không lưu thông tin thẻ của bạn.' : '256-bit SSL encrypted. TA never stores your card details.'}</p>
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
                  {redemptionDiscount > 0 && (
                    <div className="flex justify-between text-sm text-gold-600 font-medium">
                      <span>{isVi ? `Đổi ${appliedPoints.toLocaleString()} điểm TA Elite Club` : `Redeem ${appliedPoints.toLocaleString()} TA Elite Club points`}</span>
                      <span>−{fmtPrice(redemptionDiscount, 'vn')}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-cream-200">
                    <span className="font-bold text-forest-900">{isVi ? 'Tổng Cộng' : 'Total'}</span>
                    <span className="font-display font-bold text-forest-900 text-xl">{fmtPrice(total, region)}</span>
                  </div>
                  {redemptionDiscount > 0 && (
                    <p className="text-forest-400 text-xs text-right">
                      {isVi ? `Thanh toán qua PayOS (VND): ${fmtPrice(payosTotal, 'vn')}` : `PayOS charge (VND): ${fmtPrice(payosTotal, 'vn')}`}
                    </p>
                  )}
                </div>

                {maxRedeemablePoints > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-forest-50 border border-forest-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-4 h-4 text-gold-500" />
                      <p className="text-forest-900 text-sm font-semibold">
                        {isVi
                          ? `Bạn có ${pointsBalance.toLocaleString()} điểm TA Elite Club`
                          : `You have ${pointsBalance.toLocaleString()} TA Elite Club points`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={maxRedeemablePoints}
                        step={1}
                        value={appliedPoints}
                        onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                        className="flex-1 accent-gold-500"
                      />
                      <button
                        type="button"
                        onClick={() => setPointsToRedeem(maxRedeemablePoints)}
                        className="text-xs font-semibold text-forest-600 hover:text-forest-900 whitespace-nowrap"
                      >
                        {isVi ? 'Dùng tối đa' : 'Max'}
                      </button>
                    </div>
                    <p className="text-forest-400 text-xs mt-1.5">
                      {isVi
                        ? `Dùng ${appliedPoints.toLocaleString()} điểm = giảm ${fmtPrice(redemptionDiscount, 'vn')} (tối đa ${Math.round(MAX_REDEEM_RATIO * 100)}% giá trị đơn).`
                        : `Using ${appliedPoints.toLocaleString()} points = ${fmtPrice(redemptionDiscount, 'vn')} off (capped at ${Math.round(MAX_REDEEM_RATIO * 100)}% of order value).`}
                    </p>
                  </div>
                )}

                {paymentMethod !== 'paypal' && (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={items.length === 0}
                    className="btn-gold w-full justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {isVi ? 'Đặt Hàng' : 'Place Order'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {formError && (
                  <p className="text-center text-red-600 text-xs mt-3">{formError}</p>
                )}

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
