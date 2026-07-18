import { useState } from 'react';
import {
  Check,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  Heart,
  Leaf,
  FlaskConical,
  AlertTriangle,
  MapPin,
} from 'lucide-react';
import { findVKDProduct, formatVND, toCartProduct, categories } from '../data/vkdProducts';
import { useCart } from '../context/CartContext';

interface VKDProductDetailProps {
  slug: string;
  onNavigate: (page: string, slug?: string) => void;
}

export default function VKDProductDetail({ slug, onNavigate }: VKDProductDetailProps) {
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();

  const product = findVKDProduct(slug);

  if (!product) {
    return (
      <section className="bg-cream-50 min-h-screen flex items-center justify-center" style={{ paddingTop: '6rem' }}>
        <div className="text-center">
          <p className="font-display text-2xl text-forest-900 mb-4">Không tìm thấy sản phẩm</p>
          <button onClick={() => onNavigate('catalog')} className="btn-primary text-xs">
            Quay lại danh mục
          </button>
        </div>
      </section>
    );
  }

  const category = categories.find((c) => c.id === product.category);

  const handleAddToCart = () => {
    const cartProduct = toCartProduct(product);
    for (let i = 0; i < qty; i++) addToCart(cartProduct);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onNavigate('checkout');
  };

  return (
    <section className="bg-cream-50 min-h-screen" style={{ paddingTop: '6rem', paddingBottom: '5rem' }}>
      <div className="container-wide" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-forest-500 mb-8 animate-fade-in flex-wrap">
          <button
            onClick={() => onNavigate('catalog')}
            className="inline-flex items-center gap-1 hover:text-forest-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại danh mục
          </button>
          <ChevronRight className="w-3 h-3 text-forest-300" />
          <span className="text-forest-400">{category?.label}</span>
          <ChevronRight className="w-3 h-3 text-forest-300" />
          <span className="text-forest-700 font-medium truncate max-w-[220px]">{product.name}</span>
        </div>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
          {/* Image Column */}
          <div className="animate-fade-in-up">
            <div className="relative bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-elegant">
              <div className="aspect-[4/5] overflow-hidden bg-cream-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = '0';
                  }}
                />
              </div>
              {product.badge && (
                <div className="absolute top-5 left-5">
                  <span className="px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-gold-400 text-forest-900 shadow-sm">
                    {product.badge}
                  </span>
                </div>
              )}
              <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                <span className="text-[11px] font-semibold text-forest-700">Hàng chính hãng VKD</span>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex flex-col animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-700 text-xs font-semibold">
                <Leaf className="w-3.5 h-3.5 text-gold-500" />
                {category?.label}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl text-forest-900 mb-3 leading-tight">
              {product.name}
            </h1>

            <p className="text-forest-400 text-sm mb-6">Mã sản phẩm: {product.sku}</p>

            {/* Price */}
            <div className="text-3xl font-display font-bold text-forest-900 mb-6 pb-6 border-b border-cream-200">
              {formatVND(product.price)}
              {product.volume && (
                <span className="text-sm font-normal text-forest-400 ml-2">· {product.volume}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-forest-600 leading-relaxed mb-6">{product.description}</p>

            {/* Active ingredient highlight */}
            <div className="inline-flex items-start gap-2 mb-6 p-4 rounded-2xl bg-forest-50 border border-forest-100">
              <FlaskConical className="w-5 h-5 text-forest-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-forest-500 mb-1">
                  Hoạt chất chính
                </p>
                <p className="text-sm text-forest-800 font-medium">{product.activeIngredient}</p>
              </div>
            </div>

            {/* Quantity + Actions */}
            <div className="flex gap-4 items-stretch mb-4 flex-wrap">
              <div className="flex items-center rounded-full border border-cream-200 bg-white overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-forest-600 hover:bg-forest-50 transition-colors text-lg"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold text-forest-800">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-12 h-12 flex items-center justify-center text-forest-600 hover:bg-forest-50 transition-colors text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 bg-white border border-forest-900 hover:bg-forest-50 text-forest-900 text-sm font-bold py-4 px-6 rounded-full uppercase tracking-wider transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                Thêm Vào Giỏ
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-800 text-cream-50 text-sm font-bold py-4 px-6 rounded-full uppercase tracking-wider transition-all hover:shadow-elegant-lg active:scale-95"
              >
                Mua Ngay
              </button>

              <button
                onClick={() => setLiked((v) => !v)}
                className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all ${
                  liked
                    ? 'border-gold-400 bg-gold-50 text-gold-500'
                    : 'border-cream-200 text-forest-500 hover:border-gold-400 hover:text-gold-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-gold-400' : ''}`} />
              </button>
            </div>

            <p className="text-xs text-forest-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" />
              Đặt hàng, thanh toán và giao nhận thực hiện trọn gói trên VKD Group — không chuyển hướng ra ngoài.
            </p>
          </div>
        </div>

        {/* Full detail sections synced from source site */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {product.ingredients && (
            <DetailCard icon={FlaskConical} title="Thành Phần">
              {product.ingredients}
            </DetailCard>
          )}
          {product.benefits && (
            <DetailCard icon={Check} title="Công Dụng">
              {product.benefits}
            </DetailCard>
          )}
          {product.warnings && (
            <DetailCard icon={AlertTriangle} title="Lưu Ý">
              {product.warnings}
            </DetailCard>
          )}
          {product.origin && (
            <DetailCard icon={MapPin} title="Nguồn Gốc Xuất Xứ">
              {product.origin}
            </DetailCard>
          )}
        </div>

        {/* Footer CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-forest-800 to-forest-900 p-8 md:p-10 text-center shadow-elegant-lg">
          <h3 className="font-display text-2xl md:text-3xl text-cream-50 mb-3">
            Khám phá toàn bộ hệ sinh thái VKD
          </h3>
          <p className="text-cream-200 mb-6 max-w-xl mx-auto leading-relaxed">
            Đặt hàng chính hãng, kiểm tra chứng chỉ cGMP/HACCP và truy xuất nguồn gốc vùng trồng
            Tu Mơ Rông — Nam Trà My — Puxailaileng.
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gold-400 text-forest-900 text-sm font-semibold hover:bg-gold-300 transition-all hover:shadow-gold active:scale-95"
          >
            Xem thêm sản phẩm khác
          </button>
        </div>
      </div>
    </section>
  );
}

function DetailCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Check;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 shadow-elegant p-6">
      <h3 className="font-display text-base text-forest-900 mb-3 flex items-center gap-2">
        <Icon className="w-4.5 h-4.5 text-gold-500" />
        {title}
      </h3>
      <p className="text-sm text-forest-600 leading-relaxed whitespace-pre-line">{children}</p>
    </div>
  );
}
