import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { fetchActiveComboSets, type ComboSet } from '../lib/siteContentApi';
import { comboToCartProduct, getComboPosterImage, comboFieldFor } from '../data/combos';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import type { Language } from '../i18n/translations';
import { usePageSection } from '../lib/usePageSection';

function formatVND(n: number): string {
  return n.toLocaleString('vi-VN') + '₫';
}

const headingFor = (lang: Language): string =>
  lang === 'en' ? "This Month's Combo" :
  lang === 'zh' ? '本月套装' :
  lang === 'fr' ? 'Combo du Mois' :
  'Combo Tháng Này';

const addToCartLabelFor = (lang: Language): string =>
  lang === 'en' ? 'Add to cart' :
  lang === 'zh' ? '加入购物车' :
  lang === 'fr' ? 'Ajouter au panier' :
  'Thêm vào giỏ';

export default function ComboOfTheMonth({ lang, onNavigate }: { lang: Language; onNavigate: (page: string, slug?: string) => void }) {
  const [combos, setCombos] = useState<ComboSet[]>([]);
  const { addToCart } = useCart();
  const isRTL = lang === 'ar';
  const cms = usePageSection('home', 'combo-of-the-month');

  useEffect(() => {
    let cancelled = false;
    const currentMonth = new Date().getMonth() + 1;
    fetchActiveComboSets()
      .then((all) => {
        if (cancelled) return;
        // Uu tien combo dung thang hien tai, neu chua du 3 thi lay them combo
        // active khac lap cho du — moi combo co theme rieng (khong trung),
        // hau het thang chi co 1 combo khop nen truoc day section chi hien 1
        // the don doc, nhin trong rat "coc loc" giua khoang trang rong.
        const thisMonth = all.filter((c) => c.month_tags.length === 0 || c.month_tags.includes(currentMonth));
        const rest = all.filter((c) => !thisMonth.includes(c));
        setCombos([...thisMonth, ...rest].slice(0, 3));
      })
      .catch(() => { if (!cancelled) setCombos([]); });
    return () => { cancelled = true; };
  }, []);

  if (cms?.visible === false) return null;
  if (combos.length === 0) return null;

  return (
    <div className="mt-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <h3 className="font-display text-2xl text-forest-900 mb-6 text-center">
        {(lang === 'vi' && cms?.title_vi) || headingFor(lang)}
      </h3>
      <div className="flex flex-wrap justify-center gap-6">
        {combos.map((combo) => {
          const firstProductSlug = products.find((p) => p.sku === combo.component_skus[0])?.slug;
          const goToDetail = () => { if (firstProductSlug) onNavigate('product-detail', firstProductSlug); };
          return (
            <div key={combo.id} className="product-card w-full sm:w-72 md:w-80">
              <button
                type="button"
                onClick={goToDetail}
                disabled={!firstProductSlug}
                className="relative aspect-square overflow-hidden w-full block text-left disabled:cursor-default"
              >
                <img src={getComboPosterImage(combo)} alt={comboFieldFor(combo, lang, 'name')} className="w-full h-full object-cover" />
                {combo.theme && (
                  <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-gold-400 text-forest-900">
                    {comboFieldFor(combo, lang, 'theme')}
                  </span>
                )}
              </button>
              <div className="p-6">
                <button type="button" onClick={goToDetail} disabled={!firstProductSlug} className="text-left disabled:cursor-default">
                  <h4 className="font-display text-lg font-semibold text-forest-900 mb-2 hover:text-forest-700 transition-colors">{comboFieldFor(combo, lang, 'name')}</h4>
                </button>
                <p className="text-forest-500 text-sm line-clamp-2 mb-3">{comboFieldFor(combo, lang, 'description')}</p>
                <p className="text-gold-600 font-semibold mb-4">{formatVND(combo.price_vnd)}</p>
                <button onClick={() => addToCart(comboToCartProduct(combo))} className="btn-gold w-full justify-center">
                  <ShoppingBag className="w-4 h-4" />
                  {addToCartLabelFor(lang)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
