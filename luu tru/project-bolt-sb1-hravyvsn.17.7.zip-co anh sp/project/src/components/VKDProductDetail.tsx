import { useState } from 'react';
import {
  ExternalLink,
  Check,
  ChevronRight,
  ArrowLeft,
  Gem,
  Fingerprint,
  TreePine,
  Dna,
  MapPin,
  Network,
  ShieldCheck,
  ShoppingBag,
  Heart,
  Star,
  Award,
  Leaf,
  FlaskConical,
} from 'lucide-react';

const VKD_BASE_URL = 'https://samngoclinhvkdgroup.com/san-pham/';

interface FeaturedProduct {
  name: string;
  price: number;
  image: string;
  detailUrl: string;
  badge: string;
  sku: string;
  shortDesc: string;
  longDesc: string;
  activeIngredient: string;
  volume: string;
  age: string;
  rating: number;
  reviews: number;
}

const featured: FeaturedProduct = {
  name: 'Rượu Ngọc Đế Sâm Ngọc Linh 12 năm – 500ml',
  price: 1118000,
  image: 'https://samngoclinhvkdgroup.com/wp-content/uploads/2026/06/ruou-sam-12-nam.png',
  detailUrl: `${VKD_BASE_URL}ruou-ngoc-de-sam-ngoc-linh-12-nam-500ml/`,
  badge: '12 năm',
  sku: 'VKD-ND-12N',
  shortDesc: 'Sâm 12 năm tuổi + Hồng Sâm + Tam Thất — chai 500ml',
  longDesc:
    'Tác phẩm đỉnh cao của y sinh học định lượng và nghệ thuật truyền thống. Rượu Ngọc Đế 12 năm sở hữu chất lượng sâm tuyển chọn trên 12 năm tuổi dưới tán rừng tự nhiên Tu Mơ Rông, trải qua quy trình sắc ký đồ HPLC độc bản để bảo chứng chính xác hàm lượng Majonoside-R2 cao nhất.',
  activeIngredient: 'Sâm 12 năm tuổi + Hồng Sâm + Tam Thất',
  volume: 'Chai 500ml',
  age: '12+ năm',
  rating: 5.0,
  reviews: 128,
};

const trustBadges = [
  { icon: Gem, label: 'Pha Lê Thủ Công' },
  { icon: Fingerprint, label: 'NFC Chống Giả' },
  { icon: TreePine, label: 'Sâm Đạt 12+ Tuổi' },
];

const proofCards = [
  {
    icon: Dna,
    title: 'Định Lượng Hoạt Chất MR2',
    desc: 'Hàm lượng Majonoside-R2 chiếm hơn 50% tổng lượng saponin, có chứng chỉ sắc ký đồ đi kèm thông qua chip NFC riêng biệt.',
  },
  {
    icon: MapPin,
    title: 'Toạ Độ GPS Thực Tế',
    desc: 'Xóa tan nghi ngại về diện tích ảo. Khách hàng quét mã QR để đối chiếu tọa độ GPS thực tế của phân khu trồng sâm tại Kon Tum / Quảng Nam.',
  },
  {
    icon: Network,
    title: 'Hệ Sinh Thái Khép Kín',
    desc: 'Quy trình sản xuất độc lập từ khâu ươm giống dưới tán rừng tự nhiên đến khâu chiết xuất đóng chai, loại bỏ 100% rủi ro tạp chất.',
  },
];

const specs = [
  { label: 'Mã sản phẩm', value: featured.sku },
  { label: 'Thể tích', value: featured.volume },
  { label: 'Tuổi sâm', value: featured.age },
  { label: 'Hoạt chất chính', value: 'Majonoside-R2 (MR2)' },
  { label: 'Vùng trồng', value: 'Tu Mơ Rông — Kon Tum' },
  { label: 'Chứng nhận', value: 'cGMP · HACCP · ISO 22000' },
];

export default function VKDProductDetail() {
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  return (
    <section
      className="bg-cream-50 min-h-screen"
      style={{ paddingTop: '6rem', paddingBottom: '5rem' }}
    >
      <div className="container-wide" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-forest-500 mb-8 animate-fade-in">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1 hover:text-forest-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại
          </button>
          <ChevronRight className="w-3 h-3 text-forest-300" />
          <span className="text-forest-400">Danh mục</span>
          <ChevronRight className="w-3 h-3 text-forest-300" />
          <span className="text-forest-400">Rượu Ngọc Đế</span>
          <ChevronRight className="w-3 h-3 text-forest-300" />
          <span className="text-forest-700 font-medium truncate max-w-[200px]">
            {featured.name}
          </span>
        </div>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
          {/* Image Column */}
          <div className="space-y-4 animate-fade-in-up">
            <div className="relative bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-elegant">
              <div className="aspect-[4/5] overflow-hidden bg-cream-100">
                <img
                  src={featured.image}
                  alt={featured.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = '0';
                  }}
                />
              </div>
              <div className="absolute top-5 left-5">
                <span className="px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-gold-400 text-forest-900 shadow-sm">
                  {featured.badge}
                </span>
              </div>
              <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                <span className="text-[11px] font-semibold text-forest-700">Xác minh NFC</span>
              </div>
            </div>

            {/* Thumbnail strip (decorative — same image variants) */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden border border-cream-200 bg-cream-100 cursor-pointer hover:border-gold-400 transition-colors"
                >
                  <img
                    src={featured.image}
                    alt={`${featured.name} — ảnh ${i}`}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = '0';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Content Column */}
          <div className="flex flex-col animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-700 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-gold-500" />
                Dòng Ngọc Đế Cao Cấp
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-forest-600">
                <ShieldCheck className="w-4 h-4 text-forest-500" />
                NFC Blockchain
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl text-forest-900 mb-3 leading-tight">
              {featured.name}
            </h1>

            <p className="text-forest-400 text-sm mb-5">
              Mã sản phẩm: {featured.sku} · {featured.shortDesc}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(featured.rating)
                        ? 'fill-gold-400 text-gold-400'
                        : 'text-cream-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-forest-700">{featured.rating}</span>
              <span className="text-xs text-forest-400">({featured.reviews} đánh giá)</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-display font-bold text-forest-900 mb-6 pb-6 border-b border-cream-200">
              {new Intl.NumberFormat('vi-VN').format(featured.price)}₫
              <span className="text-sm font-normal text-forest-400 ml-2">· {featured.volume}</span>
            </div>

            {/* Description */}
            <p className="text-forest-600 leading-relaxed mb-6">{featured.longDesc}</p>

            {/* Active ingredient highlight */}
            <div className="inline-flex items-start gap-2 mb-6 p-4 rounded-2xl bg-forest-50 border border-forest-100">
              <FlaskConical className="w-5 h-5 text-forest-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-forest-500 mb-1">
                  Hoạt chất chính
                </p>
                <p className="text-sm text-forest-800 font-medium">{featured.activeIngredient}</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-b border-cream-200 py-6 mb-6">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.label} className="text-center">
                    <Icon className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-forest-700">
                      {badge.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quantity + Actions */}
            <div className="flex gap-4 items-stretch mb-4">
              <div className="flex items-center rounded-full border border-cream-200 bg-white overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-forest-600 hover:bg-forest-50 transition-colors text-lg"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold text-forest-800">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-12 h-12 flex items-center justify-center text-forest-600 hover:bg-forest-50 transition-colors text-lg"
                >
                  +
                </button>
              </div>

              <a
                href={featured.detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-800 text-cream-50 text-sm font-bold py-4 px-6 rounded-full uppercase tracking-wider transition-all hover:shadow-elegant-lg active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                Đặt Mua Sưu Tầm
              </a>

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
              <ExternalLink className="w-3 h-3" />
              Liên kết trỏ về trang chính thức samngoclinhvkdgroup.com để kiểm chứng giá và chứng chỉ.
            </p>
          </div>
        </div>

        {/* Scientific Proof Section */}
        <section className="rounded-3xl border border-forest-100 bg-gradient-to-br from-forest-50 to-cream-100 p-8 lg:p-12 mb-16 animate-fade-in-up">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full mb-5">
              <Leaf className="w-3.5 h-3.5 text-forest-500" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-forest-600">
                VKD Transparency
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-forest-900 mb-3">
              Cam Kết Minh Bạch Vùng Trồng & Khoa Học Định Lượng
            </h2>
            <p className="text-forest-600 max-w-2xl mx-auto leading-relaxed">
              Mỗi chai Rượu Ngọc Đế mang theo câu chuyện đầy đủ về nguồn gốc, hoạt chất và quy trình —
              không khoảng trống, không phỏng đoán.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proofCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white p-7 rounded-2xl shadow-elegant hover:shadow-elegant-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-forest-900 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-forest-600 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Specifications Table */}
        <section className="bg-white rounded-3xl border border-cream-200 shadow-elegant p-8 lg:p-10 mb-16 animate-fade-in-up">
          <h2 className="font-display text-xl text-forest-900 mb-6 flex items-center gap-2">
            <Check className="w-5 h-5 text-gold-500" />
            Thông Số Kỹ Thuật
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0">
            {specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex items-center justify-between py-3.5 border-b border-cream-100 ${
                  i % 2 === 1 ? 'sm:pl-8' : ''
                }`}
              >
                <span className="text-sm text-forest-500">{spec.label}</span>
                <span className="text-sm font-semibold text-forest-800">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-forest-800 to-forest-900 p-8 md:p-10 text-center shadow-elegant-lg">
          <h3 className="font-display text-2xl md:text-3xl text-cream-50 mb-3">
            Khám phá toàn bộ hệ sinh thái VKD
          </h3>
          <p className="text-cream-200 mb-6 max-w-xl mx-auto leading-relaxed">
            Đặt hàng chính hãng, kiểm tra chứng chỉ cGMP/HACCP và truy xuất QR nguồn gốc
            vùng trồng Tu Mơ Rông — Nam Trà My — Puxailaileng.
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
        </div>
      </div>
    </section>
  );
}
