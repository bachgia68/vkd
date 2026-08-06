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
  Users,
  ShieldAlert,
  Phone,
} from 'lucide-react';
import { products as staticProducts, toCartProduct, type Product } from '../data/products';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { productTypes } from '../data/productTypes';
import type { Language } from '../i18n/translations';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  lang: Language;
  slug: string;
  onNavigate: (page: string, slug?: string) => void;
}

interface DetailUiStrings {
  notFoundTitle: string;
  backToCatalog: string;
  authenticBadge: string;
  activeIngredientLabel: string;
  targetUsersLabel: string;
  addToCart: string;
  buyNow: string;
  fulfillmentNote: string;
  ingredientsTitle: string;
  usageTitle: string;
  warningsTitle: string;
  restrictedBadge: string;
  restrictedTitle: string;
  restrictedText: string;
  contactText: string;
  contactCta: string;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
}

const detailUi: Record<Language, DetailUiStrings> = {
  vi: {
    notFoundTitle: 'Không tìm thấy sản phẩm',
    backToCatalog: 'Quay lại danh mục',
    authenticBadge: 'Hàng chính hãng TA',
    activeIngredientLabel: 'Hoạt chất chính',
    targetUsersLabel: 'Đối tượng sử dụng',
    addToCart: 'Thêm Vào Giỏ',
    buyNow: 'Mua Ngay',
    fulfillmentNote:
      'Đặt hàng, thanh toán và giao nhận thực hiện trọn gói trên TA — không chuyển hướng ra ngoài.',
    ingredientsTitle: 'Thành Phần',
    usageTitle: 'Hướng Dẫn Sử Dụng',
    warningsTitle: 'Lưu Ý',
    restrictedBadge: '18+ Trưng bày',
    restrictedTitle: 'Chỉ trưng bày — chưa mở bán',
    restrictedText:
      'Sản phẩm có cồn hiện chỉ trưng bày, đang chờ xác nhận của Bộ Công Thương. TA cam kết không bán rượu cho người chưa đủ 18 tuổi. Vui lòng liên hệ TA để được tư vấn khi sản phẩm được cấp phép.',
    contactText: 'Sản phẩm tươi theo thời giá — vui lòng liên hệ TA để được báo giá và tư vấn.',
    contactCta: 'Liên hệ TA: 0984 999 309',
    ctaTitle: 'Khám phá toàn bộ hệ sinh thái TA',
    ctaText:
      'Sâm Ngọc Linh và đặc sản vùng miền — cùng quy về một nơi đặt hàng, một giỏ hàng, một lần thanh toán.',
    ctaButton: 'Xem thêm sản phẩm khác',
  },
  en: {
    notFoundTitle: 'Product not found',
    backToCatalog: 'Back to catalog',
    authenticBadge: 'Genuine TA product',
    activeIngredientLabel: 'Key Active Ingredient',
    targetUsersLabel: 'Intended users',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    fulfillmentNote:
      'Ordering, payment, and delivery are handled entirely on TA — no external redirects.',
    ingredientsTitle: 'Ingredients',
    usageTitle: 'How to Use',
    warningsTitle: 'Warnings',
    restrictedBadge: '18+ Display only',
    restrictedTitle: 'Display only — not yet for sale',
    restrictedText:
      'This alcoholic product is currently display-only, pending approval from the Ministry of Industry and Trade. TA is committed to not selling alcohol to anyone under 18. Please contact TA for advice once the product is licensed for sale.',
    contactText: 'This is a fresh product priced by market rate — please contact TA for a quote and advice.',
    contactCta: 'Contact TA: 0984 999 309',
    ctaTitle: 'Explore the full TA ecosystem',
    ctaText:
      'Ngoc Linh ginseng and regional specialties — all in one place to order, one cart, one checkout.',
    ctaButton: 'View more products',
  },
  zh: {
    notFoundTitle: '未找到产品',
    backToCatalog: '返回目录',
    authenticBadge: 'TA正品',
    activeIngredientLabel: '核心活性成分',
    targetUsersLabel: '适用对象',
    addToCart: '加入购物车',
    buyNow: '立即购买',
    fulfillmentNote: '下单、支付与配送均在TA内完整处理——不会跳转至外部平台。',
    ingredientsTitle: '成分',
    usageTitle: '使用说明',
    warningsTitle: '注意事项',
    restrictedBadge: '18+ 仅展示',
    restrictedTitle: '仅展示 — 尚未开放销售',
    restrictedText:
      '该含酒精产品目前仅作展示，正等待工贸部批准。TA承诺不向未满18岁人士销售酒类产品。产品获批销售后，请联系TA咨询。',
    contactText: '该产品为鲜品，价格随行就市 — 请联系TA获取报价与咨询。',
    contactCta: '联系TA：0984 999 309',
    ctaTitle: '探索TA完整生态系统',
    ctaText: '土莫隆参与各地特产——汇聚于同一下单平台，一个购物车，一次结账。',
    ctaButton: '查看更多产品',
  },
  fr: {
    notFoundTitle: 'Produit introuvable',
    backToCatalog: 'Retour au catalogue',
    authenticBadge: 'Produit authentique TA',
    activeIngredientLabel: 'Principal Actif',
    targetUsersLabel: 'Public visé',
    addToCart: 'Ajouter au Panier',
    buyNow: 'Acheter Maintenant',
    fulfillmentNote:
      'La commande, le paiement et la livraison sont entièrement gérés sur TA — aucune redirection externe.',
    ingredientsTitle: 'Ingrédients',
    usageTitle: "Mode d'emploi",
    warningsTitle: 'Précautions',
    restrictedBadge: '18+ Exposition uniquement',
    restrictedTitle: 'Exposition uniquement — pas encore en vente',
    restrictedText:
      "Ce produit alcoolisé est actuellement en exposition uniquement, en attente d'approbation du Ministère de l'Industrie et du Commerce. TA s'engage à ne pas vendre d'alcool aux personnes de moins de 18 ans. Veuillez contacter TA pour obtenir des conseils une fois le produit autorisé à la vente.",
    contactText:
      'Produit frais au prix du marché — veuillez contacter TA pour un devis et des conseils.',
    contactCta: 'Contactez TA : 0984 999 309',
    ctaTitle: "Découvrez tout l'écosystème TA",
    ctaText:
      'Sâm Ngọc Linh et spécialités régionales — réunis en un seul endroit pour commander, un seul panier, un seul paiement.',
    ctaButton: 'Voir plus de produits',
  },
  ar: {
    notFoundTitle: 'المنتج غير موجود',
    backToCatalog: 'العودة إلى الكتالوج',
    authenticBadge: 'منتج أصلي من TA',
    activeIngredientLabel: 'المكوّن الفعّال الرئيسي',
    targetUsersLabel: 'الفئة المستهدفة',
    addToCart: 'أضف إلى السلة',
    buyNow: 'اشترِ الآن',
    fulfillmentNote: 'يتم تنفيذ الطلب والدفع والتسليم بالكامل عبر TA — دون أي تحويل خارجي.',
    ingredientsTitle: 'المكونات',
    usageTitle: 'طريقة الاستخدام',
    warningsTitle: 'تحذيرات',
    restrictedBadge: '18+ للعرض فقط',
    restrictedTitle: 'للعرض فقط — لم يُطرح للبيع بعد',
    restrictedText:
      'هذا المنتج الكحولي مخصص للعرض فقط حاليًا، بانتظار موافقة وزارة الصناعة والتجارة. تلتزم TA بعدم بيع الكحول لمن هم دون سن 18 عامًا. يرجى التواصل مع TA للحصول على استشارة عند اعتماد المنتج للبيع.',
    contactText: 'هذا منتج طازج يُسعَّر حسب السوق — يرجى التواصل مع TA للحصول على عرض سعر واستشارة.',
    contactCta: 'تواصل مع TA: 0984 999 309',
    ctaTitle: 'استكشف منظومة TA بالكامل',
    ctaText: 'سام نغوك لينه والمنتجات الإقليمية المميزة — كلها في مكان واحد للطلب، سلة واحدة، دفع واحد.',
    ctaButton: 'عرض المزيد من المنتجات',
  },
};

function formatVND(price: number | null): string {
  if (price == null) return 'Liên hệ';
  return price.toLocaleString('vi-VN') + '₫';
}

const VND_PER_USD = 25000;

function formatPrice(price: number | null, lang: Language): string {
  if (lang === 'vi') return formatVND(price);
  if (price == null) return 'Contact us';
  const usd = Math.round((price / VND_PER_USD) * 100) / 100;
  return `$${usd.toFixed(2)}`;
}

export default function ProductDetail({ lang, slug, onNavigate }: ProductDetailProps) {
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();

  const ui = detailUi[lang];
  const isRTL = lang === 'ar';

  const products = useLiveProducts(staticProducts);
  const product: Product | undefined = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <section className="bg-cream-50 min-h-screen flex items-center justify-center" style={{ paddingTop: '6rem' }}>
        <div className="text-center">
          <p className="font-display text-2xl text-forest-900 mb-4">{ui.notFoundTitle}</p>
          <button onClick={() => onNavigate('catalog')} className="btn-primary text-xs">
            {ui.backToCatalog}
          </button>
        </div>
      </section>
    );
  }

  const categoryMeta = productTypes.find((t) => t.id === product.productType);
  const categoryLabel = categoryMeta ? (lang === 'en' ? categoryMeta.labelEn : categoryMeta.labelVi) : undefined;

  const canOrder = product.price != null && !product.displayOnly18Plus;

  const handleAddToCart = () => {
    if (!canOrder) return;
    const cartProduct = toCartProduct(product);
    for (let i = 0; i < qty; i++) addToCart(cartProduct);
  };

  const handleBuyNow = () => {
    if (!canOrder) return;
    handleAddToCart();
    onNavigate('checkout');
  };

  return (
    <section
      className="bg-cream-50 min-h-screen"
      style={{ paddingTop: '6rem', paddingBottom: '5rem' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container-wide" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-forest-500 mb-8 animate-fade-in flex-wrap">
          <button
            onClick={() => onNavigate('catalog')}
            className="inline-flex items-center gap-1 hover:text-forest-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {ui.backToCatalog}
          </button>
          <ChevronRight className="w-3 h-3 text-forest-300" />
          {categoryLabel && <span className="text-forest-400">{categoryLabel}</span>}
          <ChevronRight className="w-3 h-3 text-forest-300" />
          <span className="text-forest-700 font-medium truncate max-w-[220px]">{product.name}</span>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
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
              {product.displayOnly18Plus && (
                <div className="absolute top-5 right-5">
                  <span className="px-3 py-1.5 text-xs font-bold tracking-wider uppercase rounded-full bg-red-600 text-white shadow-sm">
                    {ui.restrictedBadge}
                  </span>
                </div>
              )}
              {!product.displayOnly18Plus && (
                <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur">
                  <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                  <span className="text-[11px] font-semibold text-forest-700">{ui.authenticBadge}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {categoryLabel && (
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-700 text-xs font-semibold">
                  <Leaf className="w-3.5 h-3.5 text-gold-500" />
                  {categoryLabel}
                </span>
              </div>
            )}

            <h1 className="font-display text-3xl md:text-4xl text-forest-900 mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="text-3xl font-display font-bold text-forest-900 mb-6 pb-6 border-b border-cream-200">
              {formatPrice(product.price, lang)}
              {product.volume && (
                <span className="text-sm font-normal text-forest-400 ml-2">· {product.volume}</span>
              )}
            </div>

            <p className="text-forest-600 leading-relaxed mb-6">{product.description}</p>

            {product.displayOnly18Plus && (
              <div className="inline-flex items-start gap-2 mb-6 p-4 rounded-2xl bg-red-50 border border-red-200">
                <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-700 mb-1">
                    {ui.restrictedTitle}
                  </p>
                  <p className="text-sm text-red-700/90">{ui.restrictedText}</p>
                </div>
              </div>
            )}

            {product.price == null && !product.displayOnly18Plus && (
              <div className="inline-flex items-start gap-2 mb-6 p-4 rounded-2xl bg-forest-50 border border-forest-100">
                <Phone className="w-5 h-5 text-forest-600 mt-0.5 shrink-0" />
                <p className="text-sm text-forest-700">{ui.contactText}</p>
              </div>
            )}

            {product.targetUsers && (
              <div className="inline-flex items-start gap-2 mb-6 p-4 rounded-2xl bg-forest-50 border border-forest-100">
                <Users className="w-5 h-5 text-forest-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-forest-500 mb-1">
                    {ui.targetUsersLabel}
                  </p>
                  <p className="text-sm text-forest-800">{product.targetUsers}</p>
                </div>
              </div>
            )}

            {product.activeIngredient && (
              <div className="inline-flex items-start gap-2 mb-6 p-4 rounded-2xl bg-forest-50 border border-forest-100">
                <FlaskConical className="w-5 h-5 text-forest-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-forest-500 mb-1">
                    {ui.activeIngredientLabel}
                  </p>
                  <p className="text-sm text-forest-800 font-medium">{product.activeIngredient}</p>
                </div>
              </div>
            )}

            {canOrder ? (
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
                  {ui.addToCart}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-800 text-cream-50 text-sm font-bold py-4 px-6 rounded-full uppercase tracking-wider transition-all hover:shadow-elegant-lg active:scale-95"
                >
                  {ui.buyNow}
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
            ) : (
              <a
                href="tel:0984999309"
                className="inline-flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-800 text-cream-50 text-sm font-bold py-4 px-6 rounded-full uppercase tracking-wider transition-all w-full sm:w-auto mb-4"
              >
                <Phone className="w-4 h-4" />
                {ui.contactCta}
              </a>
            )}

            <p className="text-xs text-forest-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" />
              {ui.fulfillmentNote}
            </p>
          </div>
        </div>

        {/* Detail sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {product.ingredients && (
            <DetailCard icon={FlaskConical} title={ui.ingredientsTitle}>
              {product.ingredients}
            </DetailCard>
          )}
          {product.usage && (
            <DetailCard icon={Check} title={ui.usageTitle}>
              {product.usage}
            </DetailCard>
          )}
          {product.warnings && (
            <DetailCard icon={AlertTriangle} title={ui.warningsTitle}>
              {product.warnings}
            </DetailCard>
          )}
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-forest-900 p-10 md:p-14 text-center">
          <h3 className="font-display text-2xl md:text-3xl text-cream-50 mb-4">{ui.ctaTitle}</h3>
          <p className="text-cream-200 max-w-xl mx-auto mb-8">{ui.ctaText}</p>
          <button onClick={() => onNavigate('catalog')} className="btn-primary text-xs">
            {ui.ctaButton}
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
  children: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 p-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-forest-600" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-forest-500">{title}</h4>
      </div>
      <p className="text-sm text-forest-700 leading-relaxed whitespace-pre-line">{children}</p>
    </div>
  );
}
