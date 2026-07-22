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
} from 'lucide-react';
import type { Language } from '../i18n/translations';

interface ChatWidgetProps {
  lang: Language;
  onNavigate: (page: string) => void;
}

type NodeId = 'menu' | 'product_advice' | 'order_status' | 'shipping_policy' | 'b2b' | 'human';

const FB_MESSENGER_URL = 'https://m.me/tapdoanyduocsamngoclinhvn';
const HOTLINE_TEL = 'tel:1800282866';
const HOTLINE_DISPLAY = '1800 28 28 66';
const SUPPORT_EMAIL = 'info@vkdnature.com';

const menuItems: { id: NodeId; icon: typeof ShoppingBag; vi: string; en: string }[] = [
  { id: 'product_advice', icon: ShoppingBag, vi: 'Tư vấn sản phẩm', en: 'Product advice' },
  { id: 'order_status', icon: Package, vi: 'Kiểm tra đơn hàng', en: 'Check order status' },
  { id: 'shipping_policy', icon: Truck, vi: 'Vận chuyển & đổi trả', en: 'Shipping & returns' },
  { id: 'b2b', icon: Handshake, vi: 'Hợp tác đại lý / B2B', en: 'B2B / distributor partnership' },
  { id: 'human', icon: Headset, vi: 'Gặp nhân viên tư vấn', en: 'Talk to a human agent' },
];

const nodeText: Record<Exclude<NodeId, 'menu'>, { vi: string; en: string }> = {
  product_advice: {
    vi: 'VKD có 4 dòng sản phẩm từ Sâm Ngọc Linh: Đồ uống, Thực phẩm bổ sung, Mỹ phẩm và Đặc sản, được lọc theo 4 mục tiêu sức khỏe. Bạn có thể xem toàn bộ danh mục sản phẩm ngay bên dưới.',
    en: 'VKD offers 4 Ngoc Linh Ginseng product lines: beverages, supplements, cosmetics, and specialty items, filterable by health goal. You can browse the full catalog below.',
  },
  order_status: {
    vi: 'Để tra cứu tình trạng đơn hàng, vui lòng gửi mã đơn hàng cho nhân viên CSKH qua hotline hoặc Messenger bên dưới — chúng tôi sẽ kiểm tra và phản hồi ngay.',
    en: 'To check your order status, please share your order code with our support team via hotline or Messenger below — we will look it up right away.',
  },
  shipping_policy: {
    vi: 'VKD giao hàng toàn quốc và xuất khẩu tới Mỹ, EU, Nhật Bản, Trung Quốc. Đổi trả trong 7 ngày với sản phẩm lỗi từ nhà sản xuất. Cần chi tiết hơn? Kết nối với CSKH bên dưới.',
    en: 'VKD ships nationwide and exports to the US, EU, Japan and China. Returns are accepted within 7 days for manufacturing defects. Need more detail? Reach our support team below.',
  },
  b2b: {
    vi: 'VKD có 3 hạng hợp tác B2B/đại lý với chính sách chiết khấu theo cấp độ và hỗ trợ tại 5 thị trường xuất khẩu. Đội ngũ phát triển đối tác sẵn sàng tư vấn trực tiếp bên dưới.',
    en: 'VKD offers 3 B2B/distributor partnership tiers with tiered discounts across 5 export markets. Our partnership team is ready to talk directly below.',
  },
  human: {
    vi: 'Bạn có thể kết nối trực tiếp với nhân viên CSKH & Sales qua một trong các kênh sau:',
    en: 'You can reach our Customer Care & Sales team directly through any of the channels below:',
  },
};

export default function ChatWidget({ lang, onNavigate }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [node, setNode] = useState<NodeId>('menu');
  const l = lang === 'en' ? 'en' : 'vi';

  const t = {
    title: 'VKD Trợ lý',
    subtitle: l === 'vi' ? 'Sẵn sàng hỗ trợ bạn' : 'Here to help',
    greeting:
      l === 'vi'
        ? 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?'
        : 'Hello! How can I help you today?',
    back: l === 'vi' ? 'Quay lại menu' : 'Back to menu',
    viewCatalog: l === 'vi' ? 'Xem danh mục sản phẩm' : 'View product catalog',
    callHotline: l === 'vi' ? `Gọi hotline ${HOTLINE_DISPLAY}` : `Call hotline ${HOTLINE_DISPLAY}`,
    messenger: l === 'vi' ? 'Nhắn tin qua Messenger' : 'Message us on Messenger',
    email: l === 'vi' ? 'Gửi email' : 'Send an email',
  };

  const openCatalog = () => {
    setIsOpen(false);
    onNavigate('catalog');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-[22rem] max-w-[calc(100vw-3rem)] max-h-[32rem] bg-cream-50 rounded-2xl shadow-elegant-lg overflow-hidden flex flex-col border border-forest-100 animate-fade-in-down">
          <div className="bg-forest-900 text-white px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-serif font-semibold leading-tight">{t.title}</p>
              <p className="text-xs text-forest-300">{t.subtitle}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-forest-800 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
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

                {node === 'product_advice' && (
                  <button
                    onClick={openCatalog}
                    className="w-full px-4 py-3 rounded-xl bg-gold-400 hover:bg-gold-500 text-forest-900 font-medium text-sm transition-colors"
                  >
                    {t.viewCatalog}
                  </button>
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
                  onClick={() => setNode('menu')}
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
          setNode('menu');
        }}
        className="w-14 h-14 rounded-full bg-gold-400 hover:bg-gold-500 shadow-elegant-lg flex items-center justify-center transition-all hover:scale-105"
        aria-label="Open chat"
      >
        {isOpen ? <X className="w-6 h-6 text-forest-900" /> : <MessageCircle className="w-6 h-6 text-forest-900" />}
      </button>
    </div>
  );
}
