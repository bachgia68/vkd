import { useEffect, useState } from 'react';
import { CheckCircle, Crown, Package, Truck, Star, Download, Share2, ArrowRight } from 'lucide-react';
import type { Language } from '../i18n/translations';

interface OrderConfirmProps {
  lang: Language;
  orderId: string;
  onNavigate: (page: string) => void;
}

export default function OrderConfirmation({ lang, orderId, onNavigate }: OrderConfirmProps) {
  const isVi = lang === 'vi';
  const [pointsAnimated, setPointsAnimated] = useState(0);
  const earnedPoints = 450;

  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame += 12;
      if (frame >= earnedPoints) { setPointsAnimated(earnedPoints); clearInterval(interval); }
      else setPointsAnimated(frame);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { icon: CheckCircle, label: isVi ? 'Đơn Đã Xác Nhận'  : 'Order Confirmed',      done: true,  active: false },
    { icon: Package,     label: isVi ? 'Đang Đóng Gói'     : 'Packaging',            done: false, active: true  },
    { icon: Truck,       label: isVi ? 'Đang Vận Chuyển'   : 'Out for Delivery',     done: false, active: false },
    { icon: Star,        label: isVi ? 'Đã Giao Hàng'      : 'Delivered',            done: false, active: false },
  ];

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-16">
      <div className="container-wide max-w-3xl">

        {/* Success badge */}
        <div className="text-center mb-10">
          <div className="relative inline-flex">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center mx-auto shadow-elegant-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center">
              <Star className="w-4 h-4 text-forest-900 fill-forest-900" />
            </div>
          </div>
          <h1 className="font-display text-display-sm text-forest-900 mt-6 mb-2">
            {isVi ? 'Đặt Hàng Thành Công!' : 'Order Confirmed!'}
          </h1>
          <p className="text-forest-500">
            {isVi
              ? `Cảm ơn bạn đã tin tưởng VKD Group. Mã đơn hàng của bạn là`
              : 'Thank you for your trust in VKD Group. Your order ID is'}
            &nbsp;<span className="font-bold text-forest-800 font-mono">{orderId}</span>
          </p>
        </div>

        {/* VKD Elite Points earned */}
        <div className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl p-6 mb-6 text-center shadow-gold">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Crown className="w-6 h-6 text-forest-900" />
            <span className="font-display font-bold text-forest-900 text-lg">VKD Elite Club</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-forest-800">{isVi ? 'Bạn vừa tích được' : 'You just earned'}</span>
            <span className="font-display text-4xl font-black text-forest-900">+{pointsAnimated}</span>
            <span className="text-forest-800">{isVi ? 'điểm' : 'points'}</span>
          </div>
          <p className="text-forest-800/70 text-sm mt-1">
            {isVi ? 'Điểm tích lũy ngay — đồng bộ trên mọi kênh VKD' : 'Points credited instantly — synced across all VKD channels'}
          </p>
        </div>

        {/* Order tracking steps */}
        <div className="bg-white rounded-2xl shadow-elegant p-6 mb-6">
          <h3 className="font-display font-semibold text-forest-900 mb-6">
            {isVi ? 'Theo Dõi Đơn Hàng' : 'Order Tracking'}
          </h3>
          <div className="flex justify-between relative">
            <div className="absolute top-5 left-8 right-8 h-px bg-cream-200" />
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center relative z-10 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step.done ? 'bg-forest-600 text-white' : step.active ? 'bg-gold-400 text-forest-900 animate-pulse' : 'bg-cream-200 text-forest-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium ${step.done || step.active ? 'text-forest-800' : 'text-forest-400'}`}>{step.label}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-cream-50 flex items-center gap-3">
            <Truck className="w-5 h-5 text-forest-600 flex-shrink-0" />
            <div>
              <p className="text-forest-800 font-medium text-sm">DHL Express Premium</p>
              <p className="text-forest-500 text-xs">
                {isVi ? 'Dự kiến giao: ' : 'Estimated delivery: '}
                <span className="font-semibold text-forest-700">
                  {new Date(Date.now() + 3 * 86400000).toLocaleDateString(isVi ? 'vi-VN' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* QR Code placeholder */}
        <div className="bg-white rounded-2xl shadow-elegant p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-32 h-32 flex-shrink-0 bg-forest-900 rounded-xl flex items-center justify-center p-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* QR code pattern placeholder */}
              <rect width="100" height="100" fill="#0B2F1D"/>
              {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => (
                Math.random() > 0.5 ? <rect key={`${r}-${c}`} x={5+c*13} y={5+r*13} width="11" height="11" fill="#D4AF37" rx="1"/> : null
              )))}
              <rect x="5" y="5" width="35" height="35" fill="none" stroke="#D4AF37" strokeWidth="3"/>
              <rect x="60" y="5" width="35" height="35" fill="none" stroke="#D4AF37" strokeWidth="3"/>
              <rect x="5" y="60" width="35" height="35" fill="none" stroke="#D4AF37" strokeWidth="3"/>
              <rect x="12" y="12" width="21" height="21" fill="#D4AF37"/>
              <rect x="67" y="12" width="21" height="21" fill="#D4AF37"/>
              <rect x="12" y="67" width="21" height="21" fill="#D4AF37"/>
            </svg>
          </div>
          <div>
            <h4 className="font-display font-semibold text-forest-900 mb-1">
              {isVi ? 'Mã QR Xác Thực Sản Phẩm' : 'Product Authenticity QR Code'}
            </h4>
            <p className="text-forest-500 text-sm mb-3">
              {isVi
                ? 'Quét mã QR để xác minh nguồn gốc sản phẩm VKD Group của bạn trên blockchain.'
                : 'Scan to verify your VKD Group product origin on our blockchain traceability system.'}
            </p>
            <div className="flex gap-3">
              <button className="btn-secondary text-xs px-4 py-2">
                <Download className="w-3.5 h-3.5" />
                {isVi ? 'Tải Hóa Đơn PDF' : 'Download Invoice'}
              </button>
              <button className="btn-secondary text-xs px-4 py-2">
                <Share2 className="w-3.5 h-3.5" />
                {isVi ? 'Chia Sẻ' : 'Share'}
              </button>
            </div>
          </div>
        </div>

        {/* Continue buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => onNavigate('catalog')} className="btn-primary">
            {isVi ? 'Tiếp Tục Mua Sắm' : 'Continue Shopping'}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => onNavigate('loyalty')} className="btn-secondary">
            <Crown className="w-4 h-4" />
            {isVi ? 'Xem Điểm VKD Elite' : 'View Elite Points'}
          </button>
        </div>
      </div>
    </div>
  );
}
