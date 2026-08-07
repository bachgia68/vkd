import { useState } from 'react';
import {
  MessageCircle,
  X,
  Phone,
  Mail,
  ArrowLeft,
  ShoppingBag,
  Package,
  Truck,
  Handshake,
  Headset,
  Maximize2,
  Minimize2,
  CheckCircle2,
} from 'lucide-react';
import type { Language } from '../i18n/translations';
import TaWordmark from './TaWordmark';
import { products as staticProducts } from '../data/products';
import { useLiveProducts } from '../hooks/useLiveProducts';
import { productTypes, type ProductTypeId } from '../data/productTypes';
import { submitCustomerLead } from '../lib/siteContentApi';

function formatVND(n: number | null): string {
  if (n === null) return 'Liên hệ';
  return n.toLocaleString('vi-VN') + '₫';
}

interface ChatWidgetProps {
  lang: Language;
  onNavigate: (page: string, slug?: string) => void;
}

type NodeId = 'menu' | 'product_advice' | 'order_status' | 'shipping_policy' | 'b2b' | 'human';

const FB_MESSENGER_URL = 'https://m.me/61592621322828';
const HOTLINE_TEL = 'tel:+84984999309';
const HOTLINE_DISPLAY = '(84) 984 999 309';
const SUPPORT_EMAIL = 'lienhe@samngoclinh-ta.vn';

const menuItems: { id: NodeId; icon: typeof ShoppingBag; vi: string; en: string }[] = [
  { id: 'product_advice', icon: ShoppingBag, vi: 'Tư vấn sản phẩm', en: 'Product advice' },
  { id: 'order_status', icon: Package, vi: 'Kiểm tra đơn hàng', en: 'Check order status' },
  { id: 'shipping_policy', icon: Truck, vi: 'Vận chuyển & đổi trả', en: 'Shipping & returns' },
  { id: 'b2b', icon: Handshake, vi: 'Hợp tác đại lý / B2B', en: 'B2B / distributor partnership' },
  { id: 'human', icon: Headset, vi: 'Gặp nhân viên tư vấn', en: 'Talk to a human agent' },
];

const nodeText: Record<Exclude<NodeId, 'menu'>, { vi: string; en: string }> = {
  product_advice: {
    vi: 'TA có nhiều dòng sản phẩm từ Sâm Ngọc Linh: sâm ngâm mật ong, trà & nước uống sâm, rượu sâm, mỹ phẩm sâm và nhiều dòng khác. Bạn có thể xem toàn bộ danh mục sản phẩm ngay bên dưới.',
    en: 'TA offers many Ngoc Linh Ginseng product lines: honey-steeped ginseng, ginseng tea & drinks, ginseng wine, ginseng cosmetics and more. You can browse the full catalog below.',
  },
  order_status: {
    vi: 'Để tra cứu tình trạng đơn hàng, vui lòng gửi mã đơn hàng cho nhân viên CSKH qua hotline hoặc Messenger bên dưới — chúng tôi sẽ kiểm tra và phản hồi ngay.',
    en: 'To check your order status, please share your order code with our support team via hotline or Messenger below — we will look it up right away.',
  },
  shipping_policy: {
    vi: 'TA giao hàng toàn quốc và xuất khẩu tới Mỹ, EU, Nhật Bản, Trung Quốc. Đổi trả trong 7 ngày với sản phẩm lỗi từ nhà sản xuất. Cần chi tiết hơn? Kết nối với CSKH bên dưới.',
    en: 'TA ships nationwide and exports to the US, EU, Japan and China. Returns are accepted within 7 days for manufacturing defects. Need more detail? Reach our support team below.',
  },
  b2b: {
    vi: 'TA có 3 hạng hợp tác B2B/đại lý với chính sách chiết khấu theo cấp độ và hỗ trợ tại 5 thị trường xuất khẩu. Đội ngũ phát triển đối tác sẵn sàng tư vấn trực tiếp bên dưới.',
    en: 'TA offers 3 B2B/distributor partnership tiers with tiered discounts across 5 export markets. Our partnership team is ready to talk directly below.',
  },
  human: {
    vi: 'Bạn có thể kết nối trực tiếp với nhân viên CSKH & Sales qua một trong các kênh sau:',
    en: 'You can reach our Customer Care & Sales team directly through any of the channels below:',
  },
};

export default function ChatWidget({ lang, onNavigate }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [node, setNode] = useState<NodeId>('menu');
  const [selectedCategory, setSelectedCategory] = useState<ProductTypeId | null>(null);
  const [leadCaptureOpen, setLeadCaptureOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadDone, setLeadDone] = useState(false);
  const [leadError, setLeadError] = useState('');
  const l = lang === 'en' ? 'en' : 'vi';
  const products = useLiveProducts(staticProducts);

  const t = {
    title: 'TA Trợ lý',
    subtitle: l === 'vi' ? 'Sẵn sàng hỗ trợ bạn' : 'Here to help',
    greeting:
      l === 'vi'
        ? 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?'
        : 'Hello! How can I help you today?',
    back: l === 'vi' ? 'Quay lại menu' : 'Back to menu',
    backToCategories: l === 'vi' ? 'Chọn nhu cầu khác' : 'Choose another need',
    viewCatalog: l === 'vi' ? 'Xem danh mục sản phẩm' : 'View product catalog',
    viewDetail: l === 'vi' ? 'Xem chi tiết' : 'View details',
    askConsult: l === 'vi' ? 'Nhận tư vấn qua điện thoại' : 'Get phone consultation',
    consultTitle: l === 'vi' ? 'Để lại thông tin, TA sẽ gọi lại tư vấn' : 'Leave your info and TA will call you back',
    nameLabel: l === 'vi' ? 'Họ và tên' : 'Full name',
    phoneLabel: l === 'vi' ? 'Số điện thoại' : 'Phone number',
    submitConsult: l === 'vi' ? 'Gửi yêu cầu' : 'Send request',
    consultError: l === 'vi' ? 'Vui lòng nhập họ tên và số điện thoại.' : 'Please enter your name and phone number.',
    consultDone: l === 'vi' ? 'Đã ghi nhận! TA sẽ liên hệ tư vấn trong thời gian sớm nhất.' : 'Got it! TA will reach out to you shortly.',
    callHotline: l === 'vi' ? `Gọi hotline ${HOTLINE_DISPLAY}` : `Call hotline ${HOTLINE_DISPLAY}`,
    messenger: l === 'vi' ? 'Nhắn tin qua Messenger' : 'Message us on Messenger',
    email: l === 'vi' ? 'Gửi email' : 'Send an email',
    expand: l === 'vi' ? 'Mở rộng cửa sổ chat' : 'Expand chat window',
    collapse: l === 'vi' ? 'Thu nhỏ cửa sổ chat' : 'Collapse chat window',
  };

  const resetProductFlow = () => {
    setSelectedCategory(null);
    setLeadCaptureOpen(false);
    setLeadDone(false);
    setLeadName('');
    setLeadPhone('');
    setLeadError('');
  };

  const goToMenu = () => {
    setNode('menu');
    resetProductFlow();
  };

  const openCatalog = () => {
    setIsOpen(false);
    onNavigate('catalog');
  };

  const viewProduct = (slug: string) => {
    setIsOpen(false);
    onNavigate('product-detail', slug);
  };

  const categoryProducts = selectedCategory
    ? products.filter((p) => p.productType === selectedCategory).slice(0, 2)
    : [];

  const submitConsult = async () => {
    if (!leadName.trim() || !leadPhone.trim()) {
      setLeadError(t.consultError);
      return;
    }
    setLeadSubmitting(true);
    setLeadError('');
    try {
      const categoryLabel = selectedCategory
        ? productTypes.find((t) => t.id === selectedCategory)?.[l === 'vi' ? 'labelVi' : 'labelEn'] ?? ''
        : '';
      await submitCustomerLead({
        name: leadName.trim(),
        phone: leadPhone.trim(),
        interest: categoryLabel,
        message: '',
      });
      setLeadDone(true);
    } catch (e) {
      setLeadError(e instanceof Error ? e.message : (l === 'vi' ? 'Có lỗi xảy ra, vui lòng thử lại.' : 'Something went wrong, please try again.'));
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-3">
      {isOpen && (
        <div
          className={`bg-cream-50 rounded-2xl shadow-elegant-lg overflow-hidden flex flex-col border border-forest-100 animate-fade-in-down transition-[width,height] duration-300 ${
            isExpanded
              ? 'w-[26rem] sm:w-[34rem] h-[85vh] max-h-[46rem] max-w-[calc(100vw-3rem)]'
              : 'w-[22rem] max-w-[calc(100vw-3rem)] max-h-[32rem]'
          }`}
        >
          <div className="bg-forest-900 text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <p className="font-serif font-semibold leading-tight text-white"><TaWordmark /> Trợ lý</p>
              <p className="text-xs text-forest-300">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="w-8 h-8 rounded-full hover:bg-forest-800 flex items-center justify-center transition-colors"
                aria-label={isExpanded ? t.collapse : t.expand}
                title={isExpanded ? t.collapse : t.expand}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-forest-800 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {node === 'menu' ? (
              <>
                <p className="text-sm text-forest-800 bg-forest-50 rounded-xl rounded-tl-none px-4 py-3">
                  {t.greeting}
                </p>
                <div className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setNode(item.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-forest-100 hover:border-gold-400 hover:bg-gold-50 transition-colors text-left"
                      >
                        <Icon className="w-4 h-4 text-forest-700 flex-shrink-0" />
                        <span className="text-sm text-forest-900">{item[l]}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-forest-800 bg-forest-50 rounded-xl rounded-tl-none px-4 py-3">
                  {nodeText[node][l]}
                </p>

                {node === 'product_advice' && !selectedCategory && (
                  <>
                    <div className="space-y-2">
                      {productTypes.map((pt) => {
                        const label = l === 'vi' ? pt.labelVi : pt.labelEn;
                        return (
                          <button
                            key={pt.id}
                            onClick={() => setSelectedCategory(pt.id)}
                            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-forest-100 hover:border-gold-400 hover:bg-gold-50 transition-colors text-left"
                          >
                            <span className="text-sm text-forest-900 font-medium">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={openCatalog}
                      className="w-full px-4 py-3 rounded-xl bg-gold-400 hover:bg-gold-500 text-forest-900 font-medium text-sm transition-colors"
                    >
                      {t.viewCatalog}
                    </button>
                  </>
                )}

                {node === 'product_advice' && selectedCategory && !leadCaptureOpen && !leadDone && (
                  <>
                    <div className="space-y-2">
                      {categoryProducts.map((p) => {
                        return (
                          <div key={p.slug} className="border border-forest-100 rounded-xl p-3">
                            <p className="text-sm font-medium text-forest-900">{p.name}</p>
                            <p className="text-sm text-gold-600 font-semibold mt-0.5">{formatVND(p.price)}</p>
                            <button
                              onClick={() => viewProduct(p.slug)}
                              className="text-xs text-forest-600 hover:text-forest-900 underline mt-1.5"
                            >
                              {t.viewDetail}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setLeadCaptureOpen(true)}
                      className="w-full px-4 py-3 rounded-xl bg-gold-400 hover:bg-gold-500 text-forest-900 font-medium text-sm transition-colors"
                    >
                      {t.askConsult}
                    </button>
                    <button
                      onClick={openCatalog}
                      className="w-full px-4 py-2.5 rounded-xl border border-forest-200 hover:bg-forest-50 text-forest-900 text-sm transition-colors"
                    >
                      {t.viewCatalog}
                    </button>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="flex items-center gap-2 text-xs text-forest-600 hover:text-forest-900 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {t.backToCategories}
                    </button>
                  </>
                )}

                {node === 'product_advice' && leadCaptureOpen && !leadDone && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-forest-900">{t.consultTitle}</p>
                    <div>
                      <label className="text-[11px] uppercase tracking-wide text-forest-400">{t.nameLabel}</label>
                      <input
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full border border-forest-200 rounded-lg px-3 py-2.5 text-sm mt-1 focus:outline-none focus:border-gold-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wide text-forest-400">{t.phoneLabel}</label>
                      <input
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="w-full border border-forest-200 rounded-lg px-3 py-2.5 text-sm mt-1 focus:outline-none focus:border-gold-400"
                      />
                    </div>
                    {leadError && <p className="text-xs text-red-600">{leadError}</p>}
                    <button
                      onClick={submitConsult}
                      disabled={leadSubmitting}
                      className="w-full px-4 py-3 rounded-xl bg-gold-400 hover:bg-gold-500 text-forest-900 font-medium text-sm transition-colors disabled:opacity-60 disabled:pointer-events-none"
                    >
                      {leadSubmitting ? '...' : t.submitConsult}
                    </button>
                  </div>
                )}

                {node === 'product_advice' && leadDone && (
                  <div className="flex items-start gap-2.5 bg-forest-50 text-forest-700 rounded-xl p-4 text-sm">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {t.consultDone}
                  </div>
                )}

                {node === 'human' && (
                  <div className="space-y-2">
                    <a
                      href={HOTLINE_TEL}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-sm transition-colors"
                    >
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      {t.callHotline}
                    </a>
                    <a
                      href={FB_MESSENGER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gold-400 hover:bg-gold-500 text-forest-900 font-medium text-sm transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 flex-shrink-0" />
                      {t.messenger}
                    </a>
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-forest-200 hover:bg-forest-50 text-forest-900 text-sm transition-colors"
                    >
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      {t.email}
                    </a>
                  </div>
                )}

                <button
                  onClick={goToMenu}
                  className="flex items-center gap-2 text-xs text-forest-600 hover:text-forest-900 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {t.back}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          goToMenu();
        }}
        className="w-14 h-14 rounded-full bg-gold-400 hover:bg-gold-500 shadow-elegant-lg flex items-center justify-center transition-all hover:scale-105"
        aria-label="Open chat"
      >
        {isOpen ? <X className="w-6 h-6 text-forest-900" /> : <MessageCircle className="w-6 h-6 text-forest-900" />}
      </button>
    </div>
  );
}
