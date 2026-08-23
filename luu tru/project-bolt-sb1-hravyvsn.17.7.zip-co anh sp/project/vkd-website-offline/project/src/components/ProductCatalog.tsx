import { useState, useMemo } from 'react';
import { X, ShoppingBag, Star, Check } from 'lucide-react';
import type { Product, HealthGoal, TargetAudience } from '../data/mockData';
import { products, healthGoalLabels, audienceLabels } from '../data/mockData';
import { useCart } from '../context/CartContext';
import type { Language } from '../i18n/translations';


interface CatalogProps {
  lang: Language;
}

export default function ProductCatalog({ lang }: CatalogProps) {
  const { addToCart } = useCart();
  const isVi = lang === 'vi';
  const isRTL = lang === 'ar';

  const [selectedGoals, setSelectedGoals] = useState<Set<HealthGoal>>(new Set());
  const [selectedAudiences, setSelectedAudiences] = useState<Set<TargetAudience>>(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const toggleGoal = (goal: HealthGoal) => {
    setSelectedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(goal)) next.delete(goal);
      else next.add(goal);
      return next;
    });
  };

  const toggleAudience = (aud: TargetAudience) => {
    setSelectedAudiences((prev) => {
      const next = new Set(prev);
      if (next.has(aud)) next.delete(aud);
      else next.add(aud);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedGoals.size > 0 && !selectedGoals.has(p.healthGoal)) return false;
      if (selectedAudiences.size > 0 && !p.audiences.some((a) => selectedAudiences.has(a))) return false;
      return true;
    });
  }, [selectedGoals, selectedAudiences]);

  const goals = Object.keys(healthGoalLabels) as HealthGoal[];
  const audiences = Object.keys(audienceLabels) as TargetAudience[];

  return (
    <section id="catalog" className="section-padding bg-cream-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-100 rounded-full mb-6">
            <span className="w-2 h-2 bg-forest-500 rounded-full" />
            <span className="text-xs font-semibold tracking-wider uppercase text-forest-700">
              {isVi ? 'Danh Mục Sản Phẩm' : 'Product Catalog'}
            </span>
          </div>
          <h2 className="font-display text-display-sm md:text-display-md text-forest-900 mb-4">
            {isVi ? 'Bạn Muốn Cảm Thấy Thế Nào?' : 'How Do You Want to Feel?'}
          </h2>
          <p className="text-forest-600 text-lg">
            {isVi
              ? 'Lọc sản phẩm theo mục tiêu sức khỏe cá nhân — tiếp cận cá nhân hóa giống các thương hiệu cao cấp thế giới.'
              : 'Filter products by your personal health goals — a personalized approach modeled after world-class wellness brands.'}
          </p>
        </div>

        {/* Health Goal Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-forest-500 mb-4">
            {isVi ? 'Mục Tiêu Sức Khỏe' : 'Health Goals'}
          </h3>
          <div className="flex flex-wrap gap-3">
            {goals.map((goal) => {
              const isSelected = selectedGoals.has(goal);
              return (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    isSelected
                      ? 'bg-forest-900 text-cream-50 shadow-elegant'
                      : 'bg-white text-forest-700 hover:bg-forest-50 border border-cream-200'
                  }`}
                >
                  {isVi ? healthGoalLabels[goal].vi : healthGoalLabels[goal].en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Audience Sub-filters */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-forest-500 mb-4">
            {isVi ? 'Đối Tượng' : 'Target Audience'}
          </h3>
          <div className="flex flex-wrap gap-3">
            {audiences.map((aud) => {
              const isSelected = selectedAudiences.has(aud);
              return (
                <button
                  key={aud}
                  onClick={() => toggleAudience(aud)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                    isSelected
                      ? 'bg-gold-400 text-forest-900'
                      : 'bg-cream-100 text-forest-600 hover:bg-gold-50 border border-cream-200'
                  }`}
                >
                  {isVi ? audienceLabels[aud].vi : audienceLabels[aud].en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-forest-500">
          {filtered.length} {isVi ? 'sản phẩm' : 'products'}
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="product-card group flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-ginseng overflow-hidden cursor-pointer"
                onClick={() => setQuickViewProduct(product)}
              >
                <img
                  src={product.image}
                  alt={`VKD Group Premium ${product.name}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="product-card-overlay" />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gold-400 text-forest-900">
                    {product.badge}
                  </span>
                </div>

                {/* Quick view hint */}
                <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur rounded-full text-xs font-semibold text-forest-800">
                    {isVi ? 'Xem Nhanh' : 'Quick View'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                  <span className="text-sm font-medium text-forest-700">{product.rating}</span>
                  <span className="text-xs text-forest-400">({product.reviews})</span>
                </div>

                <h3 className="font-display text-lg font-semibold text-forest-900 mb-1">
                  {isVi ? product.nameVi : product.name}
                </h3>

                {/* Active ingredient */}
                <div className="inline-flex items-center gap-1.5 mb-3">
                  <Check className="w-3.5 h-3.5 text-forest-500" />
                  <span className="text-xs font-medium text-forest-600">{product.activeIngredient}</span>
                </div>

                <p className="text-forest-500 text-sm line-clamp-2 mb-4 flex-1">
                  {isVi ? product.descriptionVi : product.description}
                </p>

                {/* Price + Add to cart */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-cream-200">
                  <div>
                    <div className="text-lg font-display font-bold text-forest-900">
                      ${product.priceUSD.toFixed(2)}
                    </div>
                    <div className="text-xs text-forest-400">
                      {product.priceVND.toLocaleString('vi-VN')}₫
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-forest-900 text-cream-50 text-xs font-semibold hover:bg-forest-800 transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {isVi ? 'Thêm Vào Giỏ' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-forest-400">
            {isVi ? 'Không tìm thấy sản phẩm phù hợp.' : 'No products match your filters.'}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          lang={lang}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={(p) => {
            addToCart(p);
            setQuickViewProduct(null);
          }}
        />
      )}
    </section>
  );
}

function QuickViewModal({
  product,
  lang,
  onClose,
  onAddToCart,
}: {
  product: Product;
  lang: Language;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}) {
  const isVi = lang === 'vi';
  const isRTL = lang === 'ar';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-forest-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-cream-50 rounded-2xl shadow-elegant-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-forest-700" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-ginseng md:aspect-auto md:min-h-[500px] overflow-hidden rounded-l-2xl">
            <img
              src={product.image}
              alt={`VKD Group Premium ${product.name} — ${product.activeIngredient}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gold-400 text-forest-900">
                {product.badge}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col">
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
              <span className="text-sm font-medium text-forest-700">{product.rating}</span>
              <span className="text-xs text-forest-400">({product.reviews} {isVi ? 'đánh giá' : 'reviews'})</span>
            </div>

            <h2 className="font-display text-2xl font-bold text-forest-900 mb-2">
              {isVi ? product.nameVi : product.name}
            </h2>

            <div className="inline-flex items-center gap-1.5 mb-4">
              <Check className="w-4 h-4 text-forest-500" />
              <span className="text-sm font-medium text-forest-600">{product.activeIngredient}</span>
            </div>

            <p className="text-forest-600 leading-relaxed mb-6">
              {isVi ? product.descriptionVi : product.description}
            </p>

            {/* Health goal tag */}
            <div className="mb-6">
              <span className="px-4 py-2 rounded-full bg-forest-100 text-forest-700 text-sm font-medium">
                {isVi ? healthGoalLabels[product.healthGoal].vi : healthGoalLabels[product.healthGoal].en}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl font-display font-bold text-forest-900">
                ${product.priceUSD.toFixed(2)}
              </div>
              <div className="text-sm text-forest-400 mt-1">
                {product.priceVND.toLocaleString('vi-VN')}₫
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={() => onAddToCart(product)}
              className="btn-primary w-full justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              {isVi ? 'Thêm Vào Giỏ Hàng' : 'Add to Premium Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
