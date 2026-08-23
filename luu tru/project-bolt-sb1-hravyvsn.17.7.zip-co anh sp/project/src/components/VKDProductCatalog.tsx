import { useState, useMemo } from 'react';
import {
  ExternalLink,
  Search,
  SlidersHorizontal,
  Leaf,
  FlaskConical,
  Wine,
  Sparkles,
  Check,
  X,
  ChevronRight,
} from 'lucide-react';

/**
 * VKDProductCatalog
 * -----------------------------------------------------------------------------
 * Trang danh mục sản phẩm Võ Kim Đường (VKD Group) — phong cách "Quiet Luxury".
 *
 * - Dữ liệu sản phẩm thật được lấy từ samngoclinhvkdgroup.com (43 SKU, đã scrape).
 * - Mỗi thẻ sản phẩm là một <a href target="_blank" rel="noopener noreferrer">
 *   trỏ về trang chi tiết thật trên website chính thức.
 * - Bộ lọc phân tầng 4 nhóm danh mục chuẩn.
 * - Tông màu: Forest Green #0B2F1D + Gold #C9A646 / #E4C568 trên nền kem.
 * -----------------------------------------------------------------------------
 */

const VKD_BASE_URL = 'https://samngoclinhvkdgroup.com/san-pham/';

type CategoryId = 'ginseng' | 'supplements' | 'tea_wine' | 'cosmetics';

interface Category {
  id: CategoryId;
  label: string;
  desc: string;
  icon: typeof Leaf;
}

interface VKDProduct {
  name: string;
  price: number; // VND — only in-stock, priced products are listed here
  image: string;
  detailUrl: string;
  category: CategoryId;
  activeIngredient: string;
  badge?: string;
}

const categories: Category[] = [
  {
    id: 'ginseng',
    label: 'Sâm Củ Tươi & Sâm Khô',
    desc: 'Sâm Ngọc Linh chính gốc Tu Mơ Rông',
    icon: Leaf,
  },
  {
    id: 'supplements',
    label: 'Thực Phẩm Bảo Vệ Sức Khỏe',
    desc: 'Dịch chiết sâm, viên nang, nước uống sâm',
    icon: FlaskConical,
  },
  {
    id: 'tea_wine',
    label: 'Trà & Đồ Uống Sâm',
    desc: 'Trà sâm túi lọc, rượu sâm Ngọc Linh cao cấp',
    icon: Wine,
  },
  {
    id: 'cosmetics',
    label: 'Mỹ Phẩm & Làm Đẹp',
    desc: 'Collagen sâm, kem dưỡng sâm',
    icon: Sparkles,
  },
];

// Ảnh sản phẩm lưu local trong /public/products (tải sẵn từ vkd-products-database).
// Chỉ liệt kê sản phẩm ĐANG CÓ SẴN VÀ CÓ GIÁ — 3 SKU "Liên hệ" (chưa niêm yết giá) đã được lọc bỏ.
const IMG = '/products/';

const products: VKDProduct[] = [
  // --- Sâm Củ Tươi & Sâm Khô ---
  {
    name: 'Sâm Ngọc Linh thái lát ngâm mật ong',
    price: 2500000,
    image: `${IMG}01-sam-ngoc-linh-thai-lat-ngam-mat-ong.png`,
    detailUrl: `${VKD_BASE_URL}sam-ngoc-linh-thai-lat-ngam-mat-ong/`,
    category: 'ginseng',
    activeIngredient: 'Majonoside R2 (MR2) — độc quyền Ngọc Linh',
    badge: 'Quốc Bảo',
  },

  // --- Thực Phẩm Bảo Vệ Sức Khỏe ---
  {
    name: 'Cao Sâm Ngọc Linh Mật Ong',
    price: 2200000,
    image: `${IMG}02-cao-sam-ngoc-linh-mat-ong.png`,
    detailUrl: `${VKD_BASE_URL}cao-sam-ngoc-linh-mat-ong/`,
    category: 'supplements',
    activeIngredient: 'Cao đặc 70% + Saponin MR2',
    badge: 'Hàm lượng cao',
  },
  {
    name: 'Nước Cốt Sâm Ngọc Linh',
    price: 445000,
    image: `${IMG}03-nuoc-cot-sam-ngoc-linh.png`,
    detailUrl: `${VKD_BASE_URL}nuoc-cot-sam-ngoc-linh/`,
    category: 'supplements',
    activeIngredient: 'Chiết xuất sâm 8–10 năm tuổi',
  },
  {
    name: 'Giải Độc Gan Panaxx Naturis',
    price: 440000,
    image: `${IMG}04-giai-doc-gan-panaxx-naturis.png`,
    detailUrl: `${VKD_BASE_URL}giai-doc-gan-panaxx-naturis/`,
    category: 'supplements',
    activeIngredient: 'MR2 + Cà gai leo + Khúng khéng',
    badge: 'Bảo vệ gan',
  },
  {
    name: 'Kẹo Sâm Ngọc Linh (PanaxX Candy)',
    price: 72000,
    image: `${IMG}08-keo-sam-ngoc-linh-panaxx-candy.png`,
    detailUrl: `${VKD_BASE_URL}keo-sam-ngoc-linh-panaxx-candy/`,
    category: 'supplements',
    activeIngredient: 'Saponin sâm Ngọc Linh',
  },
  {
    name: 'Bánh Sâm Ngọc Linh (PanaxX Cookie)',
    price: 58000,
    image: `${IMG}09-banh-sam-ngoc-linh-panaxx-cookie.png`,
    detailUrl: `${VKD_BASE_URL}banh-sam-ngoc-linh-panaxx-cookie/`,
    category: 'supplements',
    activeIngredient: 'Chiết xuất sâm Ngọc Linh',
  },
  {
    name: 'Panaxx Super Drink 190ml (Bản Mới)',
    price: 15000,
    image: `${IMG}10-panaxx-super-drink-190ml-ban-moi.png`,
    detailUrl: `${VKD_BASE_URL}panaxx-super-drink-190ml-ban-moi/`,
    category: 'supplements',
    activeIngredient: 'MR2 + Vitamin B3/B6',
  },

  // --- Trà & Đồ Uống Sâm ---
  {
    name: 'Trà Sâm Ngọc Linh',
    price: 345000,
    image: `${IMG}11-tra-sam-ngoc-linh.png`,
    detailUrl: `${VKD_BASE_URL}tra-sam-ngoc-linh/`,
    category: 'tea_wine',
    activeIngredient: 'Lát sâm Ngọc Linh sấy khô',
  },
  {
    name: 'Set 5 Lon Nước Tăng Lực (5 Vị)',
    price: 130000,
    image: `${IMG}12-set-5-lon-nuoc-tang-luc-5-vi.png`,
    detailUrl: `${VKD_BASE_URL}set-5-lon-nuoc-tang-luc-5-vi/`,
    category: 'tea_wine',
    activeIngredient: 'Saponin MR2 + Taurine + Vitamin B',
    badge: 'Ngũ Hành',
  },
  {
    name: 'PanaxX – Bản Kim 325ml',
    price: 26000,
    image: `${IMG}13-panaxx-ban-kim-325ml.png`,
    detailUrl: `${VKD_BASE_URL}panaxx-ban-kim-325ml/`,
    category: 'tea_wine',
    activeIngredient: 'Sâm Ngọc Linh 0,05% — Hương Xoài',
  },
  {
    name: 'PanaxX – Bản Mộc 325ml',
    price: 26000,
    image: `${IMG}14-panaxx-ban-moc-325ml.png`,
    detailUrl: `${VKD_BASE_URL}panaxx-ban-moc-325ml/`,
    category: 'tea_wine',
    activeIngredient: 'Sâm Ngọc Linh 0,05% — Hương Dưa Gang',
  },
  {
    name: 'PanaxX – Bản Thuỷ 325ml',
    price: 26000,
    image: `${IMG}15-panaxx-ban-thuy-325ml.png`,
    detailUrl: `${VKD_BASE_URL}panaxx-ban-thuy-325ml/`,
    category: 'tea_wine',
    activeIngredient: 'Sâm Ngọc Linh 0,05% — Hương Chanh Dây',
  },
  {
    name: 'PanaxX – Bản Hoả 325ml',
    price: 26000,
    image: `${IMG}16-panaxx-ban-hoa-325ml.png`,
    detailUrl: `${VKD_BASE_URL}panaxx-ban-hoa-325ml/`,
    category: 'tea_wine',
    activeIngredient: 'Sâm Ngọc Linh 0,05% — Hương Ổi Hồng',
  },
  {
    name: 'Rượu Ngọc Đế -Thiên Hương 750ml',
    price: 1750000,
    image: `${IMG}17-ruou-ngoc-de-thien-huong-750ml.png`,
    detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-thien-huong-750ml/`,
    category: 'tea_wine',
    activeIngredient: 'Sâm Ngọc Linh ngâm ủ truyền thống',
    badge: 'Cao cấp',
  },
  {
    name: 'Rượu Ngọc Đế Sâm Ngọc Linh 12 năm – 500ml',
    price: 1118000,
    image: `${IMG}18-ruou-ngoc-de-sam-ngoc-linh-12-nam-500ml.png`,
    detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-sam-ngoc-linh-12-nam-500ml/`,
    category: 'tea_wine',
    activeIngredient: 'Sâm 12 năm tuổi + Hồng Sâm + Tam Thất',
    badge: '12 năm',
  },
  {
    name: 'Rượu Ngọc Đế Sâm Ngọc Linh 10 năm – 500ml',
    price: 980000,
    image: `${IMG}19-ruou-ngoc-de-sam-ngoc-linh-10-nam-500ml.png`,
    detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-sam-ngoc-linh-10-nam-500ml/`,
    category: 'tea_wine',
    activeIngredient: 'Sâm 10 năm tuổi — chưng cất châu Âu',
    badge: '10 năm',
  },
  {
    name: 'Rượu Ngọc Đế – Thăng Long (Chai cao) 500ml',
    price: 860000,
    image: `${IMG}20-ruou-ngoc-de-thang-long-chai-cao-500ml.png`,
    detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-thang-long-chai-cao-500ml/`,
    category: 'tea_wine',
    activeIngredient: 'Sâm Ngọc Linh 8+ năm tuổi',
  },
  {
    name: 'Rượu Ngọc Đế – Thăng Long (Chai thấp) 500ml',
    price: 860000,
    image: `${IMG}21-ruou-ngoc-de-thang-long-chai-thap-500ml.png`,
    detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-thang-long-chai-thap-500ml/`,
    category: 'tea_wine',
    activeIngredient: 'Sâm Ngọc Linh 8+ năm tuổi',
  },
  {
    name: 'Rượu Ngọc Đế Sâm Ngọc Linh Normal 500ml',
    price: 585000,
    image: `${IMG}22-ruou-ngoc-de-sam-ngoc-linh-normal-500ml.png`,
    detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-sam-ngoc-linh-normal-500ml/`,
    category: 'tea_wine',
    activeIngredient: 'Sâm Ngọc Linh 8+ năm + Tam Thất + Câu Kỉ',
  },
  {
    name: 'Rượu Sâm Ngọc Linh Xê Đăng',
    price: 690000,
    image: `${IMG}23-ruou-sam-ngoc-linh-xe-dang.png`,
    detailUrl: `${VKD_BASE_URL}ruou-sam-ngoc-linh-xe-dang/`,
    category: 'tea_wine',
    activeIngredient: 'Sâm Ngọc Linh + Dược liệu quý',
  },
  {
    name: 'Rượu Sâm Ngọc Linh 19.5 Độ',
    price: 370000,
    image: `${IMG}24-ruou-sam-ngoc-linh-19-5-do.png`,
    detailUrl: `${VKD_BASE_URL}ruou-sam-ngoc-linh-19-5-do/`,
    category: 'tea_wine',
    activeIngredient: 'Sâm Ngọc Linh 8+ năm — 19.5°',
  },
  {
    name: 'Combo 2 Chai Rượu Sâm Ngọc Linh 19.5 Độ',
    price: 715000,
    image: `${IMG}25-combo-2-chai-ruou-sam-ngoc-linh-19-5-do.png`,
    detailUrl: `${VKD_BASE_URL}combo-2-chai-ruou-sam-ngoc-linh-19-5-do/`,
    category: 'tea_wine',
    activeIngredient: 'Combo 2 chai — tiết kiệm',
    badge: 'Combo',
  },
  {
    name: 'Rượu Ngọc Đế Phổ Thông 300ml',
    price: 200000,
    image: `${IMG}26-ruou-ngoc-de-pho-thong-300ml.png`,
    detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-pho-thong-300ml/`,
    category: 'tea_wine',
    activeIngredient: 'Sâm Ngọc Linh ngâm ủ',
  },
  {
    name: 'Rượu Kim Bôi',
    price: 72000,
    image: `${IMG}27-ruou-kim-boi.png`,
    detailUrl: `${VKD_BASE_URL}ruou-kim-boi/`,
    category: 'tea_wine',
    activeIngredient: 'Rượu gạo truyền thống + Sâm Ngọc Linh',
  },
  {
    name: 'Men Kim Bôi',
    price: 80000,
    image: `${IMG}28-men-kim-boi.png`,
    detailUrl: `${VKD_BASE_URL}men-kim-boi/`,
    category: 'tea_wine',
    activeIngredient: '36 vị thuốc bắc — men rượu truyền thống',
  },

  // --- Mỹ Phẩm & Làm Đẹp ---
  {
    name: 'Bộ Trẻ Hóa Combo (Big Size)',
    price: 8760000,
    image: `${IMG}29-bo-tre-hoa-combo-big-size.png`,
    detailUrl: `${VKD_BASE_URL}bo-tre-hoa-combo-big-size/`,
    category: 'cosmetics',
    activeIngredient: 'Sâm Ngọc Linh + PCG (Tam Thất + Đông Trùng + Linh Chi)',
    badge: 'Combo Premium',
  },
  {
    name: 'Bộ phục hồi da',
    price: 3230000,
    image: `${IMG}30-bo-phuc-hoi-da.png`,
    detailUrl: `${VKD_BASE_URL}bo-phuc-hoi-da/`,
    category: 'cosmetics',
    activeIngredient: 'Chiết xuất sâm Ngọc Linh PN’s Choice',
  },
  {
    name: 'Nước Trẻ Hóa Da (Purely Refreshing)',
    price: 3470000,
    image: `${IMG}31-nuoc-tre-hoa-da-purely-refreshing.png`,
    detailUrl: `${VKD_BASE_URL}nuoc-tre-hoa-da-purely-refreshing/`,
    category: 'cosmetics',
    activeIngredient: 'Gold Water + Saponin cô đặc',
    badge: 'Nước thần',
  },
  {
    name: 'Bộ Trẻ Hóa Da Combo (Mini Size)',
    price: 1850000,
    image: `${IMG}32-bo-tre-hoa-da-combo-mini-size.png`,
    detailUrl: `${VKD_BASE_URL}bo-tre-hoa-da-combo-mini-size/`,
    category: 'cosmetics',
    activeIngredient: 'Combo 4 sản phẩm PN’s Choice',
  },
  {
    name: 'Kem Dưỡng Ban Đêm (Night Cream)',
    price: 1900000,
    image: `${IMG}33-kem-duong-ban-dem-night-cream.png`,
    detailUrl: `${VKD_BASE_URL}kem-duong-ban-dem-night-cream/`,
    category: 'cosmetics',
    activeIngredient: 'Advanced Night Repair + Sâm Ngọc Linh',
  },
  {
    name: 'Serum Dưỡng Da (Serum)',
    price: 1780000,
    image: `${IMG}34-serum-duong-da-serum.png`,
    detailUrl: `${VKD_BASE_URL}serum-duong-da-serum/`,
    category: 'cosmetics',
    activeIngredient: 'Power Rejuvenation Serum + Saponin',
  },
  {
    name: 'Kem Dưỡng Ban Ngày (Day Cream)',
    price: 1580000,
    image: `${IMG}35-kem-duong-ban-ngay-day-cream.png`,
    detailUrl: `${VKD_BASE_URL}kem-duong-ban-ngay-day-cream/`,
    category: 'cosmetics',
    activeIngredient: 'Advanced Day Repair + Sâm Ngọc Linh',
  },
  {
    name: 'Kem Mắt (Eyes Cream)',
    price: 1150000,
    image: `${IMG}36-kem-mat-eyes-cream.png`,
    detailUrl: `${VKD_BASE_URL}kem-mat-eyes-cream/`,
    category: 'cosmetics',
    activeIngredient: 'Active Intensive Eye Cream + Sâm',
  },
  {
    name: 'Kem Dưỡng Ban Đêm (Night Cream) — Pn’s',
    price: 780000,
    image: `${IMG}37-kem-duong-ban-dem-night-cream-pn-s.png`,
    detailUrl: `${VKD_BASE_URL}kem-ban-dem-night-cream/`,
    category: 'cosmetics',
    activeIngredient: 'Micellar Repair Night — Saponin cô đặc',
  },
  {
    name: 'Kem Chống Nắng (Daily UV)',
    price: 850000,
    image: `${IMG}38-kem-chong-nang-daily-uv.png`,
    detailUrl: `${VKD_BASE_URL}kem-chong-nang-daily-uv/`,
    category: 'cosmetics',
    activeIngredient: 'SPF 50 PA++++ + Sâm Ngọc Linh',
  },
  {
    name: 'Nước Dưỡng Da (Micellar Serum)',
    price: 850000,
    image: `${IMG}39-nuoc-duong-da-micellar-serum.png`,
    detailUrl: `${VKD_BASE_URL}nuoc-duong-da-micellar-serum/`,
    category: 'cosmetics',
    activeIngredient: 'Micellar Repair Serum — Saponin',
  },
  {
    name: 'Kem Ban Ngày (Day Cream) — Pn’s',
    price: 580000,
    image: `${IMG}40-kem-ban-ngay-day-cream-pn-s.png`,
    detailUrl: `${VKD_BASE_URL}kem-ban-ngay-day-cream/`,
    category: 'cosmetics',
    activeIngredient: 'Micellar Repair Day + Sâm Ngọc Linh',
  },
  {
    name: 'Nước Cân Bằng (Micellar Toner)',
    price: 560000,
    image: `${IMG}41-nuoc-can-bang-micellar-toner.png`,
    detailUrl: `${VKD_BASE_URL}nuoc-can-bang-micellar-toner/`,
    category: 'cosmetics',
    activeIngredient: 'Micellar Repair Toner — Saponin',
  },
  {
    name: 'Sữa Rửa Mặt (Micellar Cleaner)',
    price: 450000,
    image: `${IMG}42-sua-rua-mat-micellar-cleaner.png`,
    detailUrl: `${VKD_BASE_URL}sua-rua-mat-micellar-cleaner/`,
    category: 'cosmetics',
    activeIngredient: 'Micellar Repair Cleaner + Sâm',
  },
  {
    name: 'Mặt Nạ Dưỡng Da (Face Mask) 5 Miếng',
    price: 250000,
    image: `${IMG}43-mat-na-duong-da-face-mask-5-mieng.png`,
    detailUrl: `${VKD_BASE_URL}mat-na-duong-da-face-mask-5-mieng/`,
    category: 'cosmetics',
    activeIngredient: 'Rejuvenating Face Mask + Sâm Ngọc Linh',
  },
];

const formatVND = (price: number): string =>
  new Intl.NumberFormat('vi-VN').format(price) + '₫';

const descriptionFor = (product: VKDProduct): string => {
  const cat = categories.find((c) => c.id === product.category);
  return `${cat?.desc ?? ''} · Thành phần nổi bật: ${product.activeIngredient}.`;
};

export default function VKDProductCatalog({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
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
  }, [activeCategory, query, sortBy]);

  const countByCategory = (id: CategoryId) =>
    products.filter((p) => p.category === id).length;

  return (
    <section
      id="vkd-catalog"
      className="section-padding bg-cream-50 min-h-screen"
      style={{ paddingTop: '5rem', paddingBottom: '5rem' }}
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
            Danh Mục Sản Phẩm
          </h2>
          <p className="text-forest-600 text-lg leading-relaxed">
            Bộ sưu tập Sâm Ngọc Linh thật — từ củ sâm nguyên bản vùng trồng Tu Mơ Rông
            đến dòng mỹ phẩm PN’s Choice cao cấp. Mỗi sản phẩm liên kết trực tiếp về
            trang chính thức để quý khách kiểm chứng nguồn gốc.
          </p>
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
              placeholder="Tìm sản phẩm theo tên…"
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
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 rotate-90 pointer-events-none" />
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-forest-900 text-cream-50 text-sm font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {mobileFiltersOpen ? 'Ẩn lọc' : 'Bộ lọc'}
          </button>
        </div>

        <div className="grid md:grid-cols-[260px_1fr] gap-8 lg:gap-10">
          {/* Sidebar — Category Hierarchy */}
          <aside
            className={`${
              mobileFiltersOpen ? 'block' : 'hidden'
            } md:block animate-fade-in`}
          >
            <div className="sticky top-6 space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-500 mb-4 px-1">
                  Nhóm Danh Mục
                </h3>
                <ul className="space-y-1.5">
                  <li>
                    <CategoryButton
                      active={activeCategory === 'all'}
                      onClick={() => setActiveCategory('all')}
                      icon={null}
                      label="Tất cả sản phẩm"
                      count={products.length}
                    />
                  </li>
                  {categories.map((cat) => {
                    const Icon = cat.icon;
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
                          <p className="mt-1 ml-7 mr-2 text-xs text-forest-400 leading-relaxed">
                            {cat.desc}
                          </p>
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
                    Cam kết VKD
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-cream-200">
                  Mỗi liên kết đều trỏ về trang sản phẩm chính thức tại
                  <span className="text-gold-300"> samngoclinhvkdgroup.com</span> —
                  quý khách có thể đối chiếu giá, chứng chỉ và mã QR nguồn gốc trực tiếp.
                </p>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-forest-500">
                <span className="font-semibold text-forest-800">{filtered.length}</span> sản phẩm
                {activeCategory !== 'all' && (
                  <span className="text-forest-400">
                    {' · '}
                    {categories.find((c) => c.id === activeCategory)?.label}
                  </span>
                )}
              </p>
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="inline-flex items-center gap-1 text-xs text-forest-500 hover:text-forest-800 transition-colors"
                >
                  <X className="w-3 h-3" /> Xóa tìm kiếm
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 text-forest-400">
                <p className="font-display text-xl text-forest-600 mb-2">
                  Không tìm thấy sản phẩm
                </p>
                <p className="text-sm">Thử bỏ bộ lọc hoặc tìm với từ khóa khác.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.detailUrl} product={product} />
                ))}
              </div>
            )}

            {/* Footer CTA */}
            <div className="mt-14 rounded-3xl bg-gradient-to-br from-forest-800 to-forest-900 p-8 md:p-10 text-center shadow-elegant-lg">
              <h3 className="font-display text-2xl md:text-3xl text-cream-50 mb-3">
                Khám phá toàn bộ hệ sinh thái VKD
              </h3>
              <p className="text-cream-200 mb-6 max-w-xl mx-auto leading-relaxed">
                Đặt hàng chính hãng, kiểm tra chứng chỉ cGMP/HACCP và truy xuất QR
                nguồn gốc vùng trồng Tu Mơ Rông — Nam Trà My — Puxailaileng.
              </p>
              <a
                href={VKD_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gold-400 text-forest-900 text-sm font-semibold hover:bg-gold-300 transition-all hover:shadow-gold active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                Xem tất cả trên samngoclinhvkdgroup.com
              </a>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('vkd-detail')}
                  className="block mx-auto mt-4 text-sm text-cream-200 hover:text-gold-300 transition-colors underline underline-offset-4"
                >
                  Xem trang chi tiết sản phẩm tiêu biểu (Rượu Ngọc Đế 12 năm)
                </button>
              )}
            </div>
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
        active
          ? 'bg-forest-900 text-cream-50 shadow-elegant'
          : 'text-forest-700 hover:bg-forest-50'
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
      <span
        className={`text-xs font-semibold ${
          active ? 'text-gold-300' : 'text-forest-400'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function ProductCard({ product }: { product: VKDProduct }) {
  return (
    <a
      href={product.detailUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-cream-200 hover:border-gold-300 transition-all duration-500 hover:shadow-elegant-lg hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            // Graceful fallback: hide broken image, show elegant placeholder
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-gold-400 text-forest-900 shadow-sm">
              {product.badge}
            </span>
          </div>
        )}

        {/* External link hint */}
        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-2">
          <ExternalLink className="w-4 h-4 text-forest-700" />
        </div>

        {/* "Xem chi tiết" overlay bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-forest-900/95 backdrop-blur text-cream-50 text-xs font-semibold tracking-wider uppercase py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          Xem chi tiết trên Web
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-base font-semibold text-forest-900 mb-2 leading-snug line-clamp-2 group-hover:text-forest-700 transition-colors">
          {product.name}
        </h3>

        {/* Mô tả chi tiết */}
        <div className="inline-flex items-start gap-1.5 mb-3">
          <Check className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" />
          <span className="text-xs text-forest-600 leading-relaxed line-clamp-2">
            {descriptionFor(product)}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-4 border-t border-cream-200 flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-display font-bold text-forest-900">
              {formatVND(product.price)}
            </div>
            <div className="text-[11px] text-forest-400">Giá bán lẻ · VND</div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 group-hover:text-gold-600 transition-colors">
            Chi tiết
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </a>
  );
}
