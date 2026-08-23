import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Language } from '../i18n/translations';


interface CartDrawerProps {
  lang: Language;
  onCheckout?: () => void;
}

export default function CartDrawer({ lang, onCheckout }: CartDrawerProps) {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalItems, subtotalUSD, subtotalVND } = useCart();
  const isVi = lang === 'vi';
  const isRTL = lang === 'ar';

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[90] bg-forest-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 bottom-0 right-0 z-[95] w-full max-w-md bg-cream-50 shadow-elegant-lg transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream-200 bg-forest-900 text-cream-50">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-gold-400" />
            <h2 className="font-display text-lg font-semibold">
              {isVi ? 'Giỏ Hàng Cao Cấp' : 'Premium Cart'}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-gold-400 text-forest-900 text-xs font-bold">
              {totalItems}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-full hover:bg-forest-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-cream-400" />
              </div>
              <p className="text-forest-500 font-medium mb-1">
                {isVi ? 'Giỏ hàng trống' : 'Your cart is empty'}
              </p>
              <p className="text-forest-400 text-sm">
                {isVi ? 'Khám phá bộ sưu tập sâm Ngọc Linh' : 'Explore our Ngoc Linh ginseng collection'}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white rounded-xl p-4 shadow-elegant"
              >
                {/* Image */}
                <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={`VKD Group Premium ${item.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-forest-900 text-sm leading-tight mb-1">
                    {isVi ? item.nameVi : item.name}
                  </h3>
                  <p className="text-xs text-forest-400 mb-2">{item.activeIngredient}</p>

                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-2 bg-cream-100 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full hover:bg-cream-200 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3 text-forest-600" />
                      </button>
                      <span className="text-sm font-medium text-forest-800 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full hover:bg-cream-200 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3 text-forest-600" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-sm font-bold text-forest-900">
                        ${(item.priceUSD * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-xs text-forest-400">
                        {(item.priceVND * item.quantity).toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="self-start text-forest-300 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cream-200 p-6 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-forest-600 text-sm">
                {isVi ? 'Tạm tính' : 'Subtotal'}
              </span>
              <div className="text-right">
                <div className="text-xl font-display font-bold text-forest-900">
                  ${subtotalUSD.toFixed(2)}
                </div>
                <div className="text-xs text-forest-400">
                  {subtotalVND.toLocaleString('vi-VN')}₫
                </div>
              </div>
            </div>

            <p className="text-xs text-forest-400 mb-4">
              {isVi
                ? 'Phí vận chuyển và thuế được tính tại bước thanh toán'
                : 'Shipping and taxes calculated at checkout'}
            </p>

            {/* Checkout button */}
            <button onClick={() => { closeCart(); onCheckout?.(); }}
              className="btn-gold w-full justify-center">
              {isVi ? 'Tiến Hành Thanh Toán' : 'Proceed to Checkout'}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>

            {/* Continue shopping */}
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-forest-500 hover:text-forest-700 mt-3 transition-colors"
            >
              {isVi ? 'Tiếp Tục Mua Sắm' : 'Continue Shopping'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
