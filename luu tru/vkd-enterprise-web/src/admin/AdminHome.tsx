import { Link } from 'react-router-dom';
import {
  FileText,
  Users,
  Warehouse,
  ArrowUpRight,
  TrendingUp,
  ShoppingBag,
  ShieldAlert,
  Package,
  Handshake,
  Store,
  BarChart3,
} from 'lucide-react';
import { fmt } from './adminMockData';

const KPIS = [
  { label: 'Doanh thu tháng', value: '1,320,000,000đ', delta: '▲ 12.4% so với tháng trước', icon: TrendingUp, tone: 'up' },
  { label: 'Đơn hàng', value: fmt(486), delta: '▲ 8 đơn hôm nay', icon: ShoppingBag, tone: 'up' },
  { label: 'Khách Elite mới', value: fmt(37), delta: '▲ 5 tuần này', icon: Users, tone: 'up' },
  { label: 'Cảnh báo nghi hàng giả', value: '2', delta: 'Cần xác minh', icon: ShieldAlert, tone: 'down' },
];

const SECTIONS = [
  {
    to: '/gate-vkd-control-2026/products',
    icon: Package,
    title: 'Sản phẩm & Kho hàng',
    desc: 'Danh mục sản phẩm chuẩn Shopee/Amazon: thêm, sửa nhanh, ẩn/hiện, xoá kèm ảnh xem trước tức thì.',
  },
  {
    to: '/gate-vkd-control-2026/agents',
    icon: Handshake,
    title: 'Đại lý & Affiliate',
    desc: 'Quản lý đại lý cấp 1/2 và Affiliate KOL/KOC: chiết khấu theo tầng, doanh số, duyệt/tạm dừng tài khoản.',
  },
  {
    to: '/gate-vkd-control-2026/showrooms',
    icon: Store,
    title: 'Showroom O2O',
    desc: 'Doanh thu thời gian thực từng showroom và lệnh điều phối kho nội bộ giữa các điểm bán.',
  },
  {
    to: '/gate-vkd-control-2026/revenue',
    icon: BarChart3,
    title: 'Doanh thu đa kênh',
    desc: 'So sánh doanh thu Showroom/Online/Affiliate/OTC-KA và hiệu suất chiến dịch Facebook, Zalo OA, TikTok.',
  },
  {
    to: '/gate-vkd-control-2026/cms',
    icon: FileText,
    title: 'Duyệt Bài CMS',
    desc: 'Quy trình duyệt bài y khoa 3 bước, tự động quét từ khoá quảng cáo bị cấm và chèn khuyến cáo bắt buộc.',
  },
  {
    to: '/gate-vkd-control-2026/crm-erp',
    icon: Users,
    title: 'CRM & ERP Khách hàng VIP',
    desc: 'Phân nhóm khách hàng động, kích hoạt chiến dịch Zalo OA/HubSpot, hồ sơ 360 và nhật ký đồng ý dữ liệu.',
  },
  {
    to: '/gate-vkd-control-2026/inventory-qr',
    icon: Warehouse,
    title: 'Kho hàng & Truy xuất QR',
    desc: 'Tồn kho đa điểm thời gian thực, tự động định tuyến đơn hàng, bản đồ nhiệt vị trí quét QR.',
  },
];

export default function AdminHome() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-forest-500 mb-1">Vận hành / Tổng quan</p>
        <h1 className="font-display text-3xl text-forest-900">Tổng quan kinh doanh</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-forest-100 p-5 shadow-elegant">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-forest-500">
              {k.label}
              <k.icon className="w-4 h-4 text-gold-500" />
            </div>
            <p className="font-display text-2xl text-forest-900 mt-3">{k.value}</p>
            <p className={`text-xs mt-1 ${k.tone === 'up' ? 'text-forest-600' : 'text-red-600'}`}>{k.delta}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display text-xl text-forest-900 mb-4">Phân hệ vận hành</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {SECTIONS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group bg-white rounded-2xl border border-forest-100 p-6 shadow-elegant hover:shadow-elegant-lg hover:-translate-y-1 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-forest-900 text-gold-400 flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-forest-900">{s.title}</h3>
                <ArrowUpRight className="w-4 h-4 text-forest-400 group-hover:text-gold-500 transition-colors" />
              </div>
              <p className="text-sm text-forest-600/80 mt-2 leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
