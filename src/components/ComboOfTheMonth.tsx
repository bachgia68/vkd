import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { fetchActiveComboSets, type ComboSet } from '../lib/siteContentApi';
import { comboToCartProduct, getComboPosterImage, comboFieldFor } from '../data/combos';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import type { Language } from '../i18n/translations';
import { usePageSection } from '../lib/usePageSection';
import SwipeCarousel from './ui/SwipeCarousel';

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

const prevLabelFor = (lang: Language): string => (lang === 'vi' ? 'Combo trước' : 'Previous combo');
const nextLabelFor = (lang: Language): string => (lang === 'vi' ? 'Combo sau' : 'Next combo');

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
        // Uu tien combo dung thang hien tai len dau, con lai xep sau — hien
        // TAT CA combo active (khong gioi han con 3 nhu truoc) vi gio la
        // carousel that (SwipeCarousel) chu khong phai luoi flex-wrap can
        // giua nua, nen nhieu the khong con lam mat can doi bo cuc.
        const thisMonth = all.filter((c) => c.month_tags.length === 0 || c.month_tags.includes(currentMonth));
        const rest = all.filter((c) => !thisMonth.includes(c));
        setCombos([...thisMonth, ...rest]);
      })
      .catch(() => { if (!cancelled) setCombos([]); });
    return () => { cancelled = true; };
  }, []);

  if (cms?.visible === false) return null;
  if (combos.length === 0) return null;

  return (
    <div className="mt-12" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* container-wide: block nay truoc gio khong co container nao (bare
          div toan chieu rong <main>), chi "khong lo" vi flex-wrap it the tu
          xuong dong thay vi tran. SwipeCarousel (keen-slider) la carousel
          CHUAN cua site — co nut mui ten + dots that, dung lai thay vi tu
          viet overflow-x-auto (ban truoc bi cat cut o mep man hinh, khong
          co dau hieu keo duoc, nhin nhu loi — dung y cua Joe: "de carousel"
          nghia la carousel that co dieu huong, khong chi la 1 dai cuon tron). */}
      <div className="container-wide">
        <h3 className="font-display text-2xl text-forest-900 mb-6 text-center">
          {(lang === 'vi' && cms?.title_vi) || headingFor(lang)}
        </h3>
        <SwipeCarousel
          items={combos}
          getKey={(combo) => combo.id}
          ariaLabelPrev={prevLabelFor(lang)}
          ariaLabelNext={nextLabelFor(lang)}
          slideWidthClassName="w-[280px] md:w-[320px]"
          renderSlide={(combo) => {
            const firstProductSlug = products.find((p) => p.sku === combo.component_skus[0])?.slug;
            const goToDetail = () => { if (firstProductSlug) onNavigate('product-detail', firstProductSlug); };
            return (
              <div className="product-card">
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
          }}
        />
      </div>
    </div>
  );
}
