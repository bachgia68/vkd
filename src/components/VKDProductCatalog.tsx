import { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Leaf,
  FlaskConical,
  Wine,
  Sparkles,
  Check,
  X,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import {
  vkdProducts,
  categories,
  formatVND,
  toCartProduct,
  getLocalizedProduct,
  getLocalizedCategory,
  type VKDProduct,
  type Category,
  type CategoryId,
} from '../data/vkdProducts';
import type { Language } from '../i18n/translations';
import { useCart } from '../context/CartContext';

/**
 * VKDProductCatalog
 * -----------------------------------------------------------------------------
 * Trang danh mục sản phẩm Võ Kim Đường (VKD Group) — phong cách "Quiet Luxury".
 *
 * - Dữ liệu sản phẩm thật lấy từ samngoclinhvkdgroup.com, đồng bộ 2026-07-17.
 * - Chỉ hiển thị sản phẩm ĐANG BÁN — đã loại các SKU "Hết hàng"/ngừng sản xuất
 *   trên chính trang gốc (xem src/data/vkdProducts.ts).
 * - Bấm vào sản phẩm mở trang chi tiết NỘI BỘ — mua hàng, giỏ hàng, thanh toán
 *   xử lý trọn gói trên site này, không điều hướng ra ngoài.
 * - Tông màu: Forest Green #0B2F1D + Gold #C9A646 / #E4C568 trên nền kem.
 * - Nội dung sản phẩm được dịch theo `lang` (xem src/data/vkdProductTranslations.ts).
 * -----------------------------------------------------------------------------
 */

const categoryIcons: Record<CategoryId, typeof Leaf> = {
  ginseng: Leaf,
  supplements: FlaskConical,
  tea_wine: Wine,
  cosmetics: Sparkles,
};

const descriptionFor = (product: VKDProduct, category?: Category): string => {
  return `${category?.desc ?? ''} · ${product.activeIngredient}.`;
};

interface CatalogUiStrings {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  sortDefault: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  hideFilters: string;
  showFilters: string;
  categoryGroup: string;
  allProducts: string;
  commitmentLabel: string;
  commitmentText: string;
  productsCountSuffix: string;
  clearSearch: string;
  noResultsTitle: string;
  noResultsSubtitle: string;
  viewDetail: string;
  addToCart: string;
  retailPriceLabel: string;
}

const catalogUi: Record<Language, CatalogUiStrings> = {
  vi: {
    title: 'Danh Mục Sản Phẩm',
    subtitle:
      'Bộ sưu tập Sâm Ngọc Linh thật — từ củ sâm nguyên bản vùng trồng Tu Mơ Rông đến dòng mỹ phẩm Pn’s Choice cao cấp. Đặt hàng và thanh toán trực tiếp trên VKD Group.',
    searchPlaceholder: 'Tìm sản phẩm theo tên…',
    sortDefault: 'Sắp xếp: Mặc định',
    sortPriceAsc: 'Giá: Thấp → Cao',
    sortPriceDesc: 'Giá: Cao → Thấp',
    hideFilters: 'Ẩn lọc',
    showFilters: 'Bộ lọc',
    categoryGroup: 'Nhóm Danh Mục',
    allProducts: 'Tất cả sản phẩm',
    commitmentLabel: 'Cam kết VKD',
    commitmentText:
      'Toàn bộ thông tin, hình ảnh và giá bán được đồng bộ trực tiếp từ hệ thống chính thức. Đặt hàng, giỏ hàng và thanh toán xử lý trọn gói tại đây.',
    productsCountSuffix: 'sản phẩm',
    clearSearch: 'Xóa tìm kiếm',
    noResultsTitle: 'Không tìm thấy sản phẩm',
    noResultsSubtitle: 'Thử bỏ bộ lọc hoặc tìm với từ khóa khác.',
    viewDetail: 'Xem chi tiết sản phẩm',
    addToCart: 'Thêm giỏ',
    retailPriceLabel: 'Giá bán lẻ · VND',
  },
  en: {
    title: 'Product Catalog',
    subtitle:
      "An authentic Ngoc Linh ginseng collection — from whole roots grown in Tu Mo Rong to the premium Pn's Choice cosmetics line. Order and pay directly on VKD Group.",
    searchPlaceholder: 'Search products by name…',
    sortDefault: 'Sort: Default',
    sortPriceAsc: 'Price: Low → High',
    sortPriceDesc: 'Price: High → Low',
    hideFilters: 'Hide filters',
    showFilters: 'Filters',
    categoryGroup: 'Categories',
    allProducts: 'All Products',
    commitmentLabel: 'VKD Commitment',
    commitmentText:
      'All information, images, and prices are synced directly from our official system. Ordering, cart, and checkout are handled entirely here.',
    productsCountSuffix: 'products',
    clearSearch: 'Clear search',
    noResultsTitle: 'No products found',
    noResultsSubtitle: 'Try removing filters or searching a different keyword.',
    viewDetail: 'View product details',
    addToCart: 'Add to cart',
    retailPriceLabel: 'Retail price · VND',
  },
  zh: {
    title: '产品目录',
    subtitle: '正宗玉琳参精选系列——从土莫隆产区的原生参根,到高端Pn\'s Choice化妆品系列。在VKD Group直接下单与支付。',
    searchPlaceholder: '按名称搜索产品…',
    sortDefault: '排序:默认',
    sortPriceAsc: '价格:从低到高',
    sortPriceDesc: '价格:从高到低',
    hideFilters: '隐藏筛选',
    showFilters: '筛选',
    categoryGroup: '分类',
    allProducts: '全部产品',
    commitmentLabel: 'VKD承诺',
    commitmentText: '所有信息、图片及价格均直接同步自官方系统。下单、购物车与支付均在此完整处理。',
    productsCountSuffix: '件产品',
    clearSearch: '清除搜索',
    noResultsTitle: '未找到产品',
    noResultsSubtitle: '请尝试取消筛选或使用其他关键词搜索。',
    viewDetail: '查看产品详情',
    addToCart: '加入购物车',
    retailPriceLabel: '零售价·越南盾',
  },
  fr: {
    title: 'Catalogue de Produits',
    subtitle:
      "Une collection authentique de ginseng Ngoc Linh — des racines entières cultivées à Tu Mo Rong à la gamme de cosmétiques premium Pn's Choice. Commandez et payez directement sur VKD Group.",
    searchPlaceholder: 'Rechercher un produit par nom…',
    sortDefault: 'Trier : Par défaut',
    sortPriceAsc: 'Prix : Croissant',
    sortPriceDesc: 'Prix : Décroissant',
    hideFilters: 'Masquer les filtres',
    showFilters: 'Filtres',
    categoryGroup: 'Catégories',
    allProducts: 'Tous les produits',
    commitmentLabel: 'Engagement VKD',
    commitmentText:
      'Toutes les informations, images et prix sont synchronisés directement depuis notre système officiel. Commande, panier et paiement sont entièrement gérés ici.',
    productsCountSuffix: 'produits',
    clearSearch: 'Effacer la recherche',
    noResultsTitle: 'Aucun produit trouvé',
    noResultsSubtitle: "Essayez de supprimer les filtres ou de rechercher un autre mot-clé.",
    viewDetail: 'Voir les détails du produit',
    addToCart: 'Ajouter au panier',
    retailPriceLabel: 'Prix de détail · VND',
  },
  ar: {
    title: 'كتالوج المنتجات',
    subtitle:
      "مجموعة أصيلة من جينسنغ نوك لين — من الجذور الكاملة المزروعة في توو مو رونغ إلى سلسلة مستحضرات Pn's Choice الفاخرة. اطلب وادفع مباشرة عبر VKD Group.",
    searchPlaceholder: 'ابحث عن المنتجات بالاسم…',
    sortDefault: 'الترتيب: افتراضي',
    sortPriceAsc: 'السعر: من الأقل إلى الأعلى',
    sortPriceDesc: 'السعر: من الأعلى إلى الأقل',
    hideFilters: 'إخفاء الفلاتر',
    showFilters: 'الفلاتر',
    categoryGroup: 'الفئات',
    allProducts: 'جميع المنتجات',
    commitmentLabel: 'التزام VKD',
    commitmentText:
      'جميع المعلومات والصور والأسعار متزامنة مباشرة مع نظامنا الرسمي. تتم إدارة الطلب وسلة التسوق والدفع بالكامل هنا.',
    productsCountSuffix: 'منتج',
    clearSearch: 'مسح البحث',
    noResultsTitle: 'لم يتم العثور على منتجات',
    noResultsSubtitle: 'جرّب إزالة الفلاتر أو البحث بكلمة مختلفة.',
    viewDetail: 'عرض تفاصيل المنتج',
    addToCart: 'أضف إلى السلة',
    retailPriceLabel: 'سعر التجزئة · دونغ',
  },
};

export default function VKDProductCatalog({
  lang,
  onNavigate,
}: {
  lang: Language;
  onNavigate: (page: string, slug?: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const ui = catalogUi[lang];
  const isRTL = lang === 'ar';

  const localizedProducts = useMemo(
    () => vkdProducts.map((p) => getLocalizedProduct(p, lang)),
    [lang]
  );
  const localizedCategories = useMemo(
    () => categories.map((c) => getLocalizedCategory(c, lang)),
    [lang]
  );

  const filtered = useMemo(() => {
    let list = localizedProducts.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (query.trim() && !p.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [localizedProducts, activeCategory, query, sortBy]);

  const countByCategory = (id: CategoryId) => vkdProducts.filter((p) => p.category === id).length;

  return (
    <section
      id="vkd-catalog"
      className="section-padding bg-cream-50 min-h-screen"
      style={{ paddingTop: '5rem', paddingBottom: '5rem' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container-wide" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-100 rounded-full mb-6 animate-fade-in-down">
            <span className="w-2 h-2 bg-gold-400 rounded-full" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-forest-700">
              Võ Kim Đường · VKD Group
            </span>
          </div>
          <h2 className="font-display text-display-sm md:text-display-md text-forest-900 mb-4 animate-fade-in-up">
            {ui.title}
          </h2>
          <p className="text-forest-600 text-lg leading-relaxed">{ui.subtitle}</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-stretch md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ui.searchPlaceholder}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-cream-200 text-sm text-forest-800 placeholder:text-forest-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200 transition-all"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none pl-11 pr-10 py-3 rounded-full bg-white border border-cream-200 text-sm font-medium text-forest-700 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200 transition-all cursor-pointer"
            >
              <option value="default">{ui.sortDefault}</option>
              <option value="price-asc">{ui.sortPriceAsc}</option>
              <option value="price-desc">{ui.sortPriceDesc}</option>
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 rotate-90 pointer-events-none" />
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-forest-900 text-cream-50 text-sm font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {mobileFiltersOpen ? ui.hideFilters : ui.showFilters}
          </button>
        </div>

        <div className="grid md:grid-cols-[260px_1fr] gap-8 lg:gap-10">
          {/* Sidebar — Category Hierarchy */}
          <aside className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block animate-fade-in`}>
            <div className="sticky top-6 space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-500 mb-4 px-1">
                  {ui.categoryGroup}
                </h3>
                <ul className="space-y-1.5">
                  <li>
                    <CategoryButton
                      active={activeCategory === 'all'}
                      onClick={() => setActiveCategory('all')}
                      icon={null}
                      label={ui.allProducts}
                      count={vkdProducts.length}
                    />
                  </li>
                  {localizedCategories.map((cat) => {
                    const Icon = categoryIcons[cat.id];
                    return (
                      <li key={cat.id}>
                        <CategoryButton
                          active={activeCategory === cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          icon={<Icon className="w-4 h-4" />}
                          label={cat.label}
                          count={countByCategory(cat.id)}
                        />
                        {activeCategory === cat.id && (
                          <p className="mt-1 ml-7 mr-2 text-xs text-forest-400 leading-relaxed">{cat.desc}</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Authenticity note */}
              <div className="rounded-2xl bg-forest-900 p-5 text-cream-100 shadow-elegant">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-gold-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold-300">
                    {ui.commitmentLabel}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-cream-200">{ui.commitmentText}</p>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-forest-500">
                <span className="font-semibold text-forest-800">{filtered.length}</span>{' '}
                {ui.productsCountSuffix}
                {activeCategory !== 'all' && (
                  <span className="text-forest-400">
                    {' · '}
                    {localizedCategories.find((c) => c.id === activeCategory)?.label}
                  </span>
                )}
              </p>
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="inline-flex items-center gap-1 text-xs text-forest-500 hover:text-forest-800 transition-colors"
                >
                  <X className="w-3 h-3" /> {ui.clearSearch}
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 text-forest-400">
                <p className="font-display text-xl text-forest-600 mb-2">{ui.noResultsTitle}</p>
                <p className="text-sm">{ui.noResultsSubtitle}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product) => {
                  const category = localizedCategories.find((c) => c.id === product.category);
                  return (
                    <ProductCard
                      key={product.sku}
                      product={product}
                      category={category}
                      ui={ui}
                      onNavigate={onNavigate}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
        active ? 'bg-forest-900 text-cream-50 shadow-elegant' : 'text-forest-700 hover:bg-forest-50'
      }`}
    >
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
          active ? 'bg-gold-400 text-forest-900' : 'bg-cream-100 text-forest-500 group-hover:bg-gold-50'
        }`}
      >
        {icon ?? <Sparkles className="w-4 h-4" />}
      </span>
      <span className="flex-1 text-sm font-medium leading-tight">{label}</span>
      <span className={`text-xs font-semibold ${active ? 'text-gold-300' : 'text-forest-400'}`}>{count}</span>
    </button>
  );
}

function ProductCard({
  product,
  category,
  ui,
  onNavigate,
}: {
  product: VKDProduct;
  category?: Category;
  ui: CatalogUiStrings;
  onNavigate: (page: string, slug?: string) => void;
}) {
  const { addToCart } = useCart();

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-cream-200 hover:border-gold-300 transition-all duration-500 hover:shadow-elegant-lg hover:-translate-y-1">
      {/* Image */}
      <button
        onClick={() => onNavigate('product-detail', product.slug)}
        className="relative aspect-[4/5] overflow-hidden bg-cream-100 text-left w-full"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-gold-400 text-forest-900 shadow-sm">
              {product.badge}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-forest-900/95 backdrop-blur text-cream-50 text-xs font-semibold tracking-wider uppercase py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          {ui.viewDetail}
        </div>
      </button>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <button onClick={() => onNavigate('product-detail', product.slug)} className="text-left">
          <h3 className="font-display text-base font-semibold text-forest-900 mb-2 leading-snug line-clamp-2 group-hover:text-forest-700 transition-colors">
            {product.name}
          </h3>
        </button>

        <div className="inline-flex items-start gap-1.5 mb-3">
          <Check className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" />
          <span className="text-xs text-forest-600 leading-relaxed line-clamp-2">
            {descriptionFor(product, category)}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-4 border-t border-cream-200 flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-display font-bold text-forest-900">{formatVND(product.price)}</div>
            <div className="text-[11px] text-forest-400">{ui.retailPriceLabel}</div>
          </div>
          <button
            onClick={() => addToCart(toCartProduct(product))}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-forest-900 text-cream-50 text-xs font-semibold hover:bg-forest-800 transition-colors active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {ui.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
