import { ArrowRight } from 'lucide-react';
import { trimicoProducts, formatVNDorContact } from '../data/trimicoProducts';

const featuredSlugs = [
  'tra-sam-ngoc-linh-thuong-hang',
  'nam-lim-xanh-rung-thai-lat-100g',
  'mat-ong-dang-rung-ngoc-linh-500ml',
  'thach-sam-ngoc-linh-trimico',
];

export default function TrimicoTeaser({ onNavigate }: { onNavigate: (page: string, slug?: string) => void }) {
  const featured = featuredSlugs
    .map((s) => trimicoProducts.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="section-padding bg-forest-950" id="trimico">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-400/15 rounded-full mb-6">
              <span className="w-2 h-2 bg-gold-400 rounded-full" />
              <span className="text-xs font-semibold tracking-wider uppercase text-gold-300">
                Đối tác thương hiệu mới
              </span>
            </div>
            <h2 className="font-display text-display-sm md:text-display-md text-cream-50 mb-4">
              Danh Mục Bổ Sung
            </h2>
            <p className="text-cream-300 text-lg leading-relaxed max-w-xl">
              Sâm Ngọc Linh, Nấm Lim Xanh, mật ong rừng và đặc sản Quảng Nam — hơn 50 sản phẩm thật, đặt hàng trực tiếp trên TA.
            </p>
          </div>
          <button
            onClick={() => onNavigate('trimico-catalog')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-400 text-forest-900 text-sm font-semibold hover:bg-gold-300 transition-colors self-start md:self-auto shrink-0"
          >
            Xem Danh Mục
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <button
              key={product.sku}
              onClick={() => onNavigate('trimico-product-detail', product.slug)}
              className="group text-left bg-forest-900/60 rounded-2xl overflow-hidden border border-forest-800 hover:border-gold-400/60 transition-all duration-500"
            >
              <div className="aspect-[4/5] overflow-hidden bg-forest-800">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-cream-50 leading-snug line-clamp-2 mb-2 group-hover:text-gold-300 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gold-400 font-display font-bold">{formatVNDorContact(product.price)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
