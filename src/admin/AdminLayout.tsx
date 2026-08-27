import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutGrid, FileText, Users, Warehouse, LogOut, Leaf, Package, Handshake, Store, BarChart3, Settings, FileSpreadsheet, Share2, Quote, Gift, Menu, X, Eye, Crown, Images, Languages, Type, Clapperboard } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { Button } from '../components/ui/button';

const NAV = [
  { to: '/gate-vkd-control-2026', end: true, label: 'Tổng quan', icon: LayoutGrid },
  { to: '/gate-vkd-control-2026/products', end: false, label: 'Sản phẩm & Kho', icon: Package },
  { to: '/gate-vkd-control-2026/catalog-export', end: false, label: 'Catalog & Xuất File', icon: FileSpreadsheet },
  { to: '/gate-vkd-control-2026/combos', end: false, label: 'Combo & Quà Tặng', icon: Gift },
  { to: '/gate-vkd-control-2026/agents', end: false, label: 'Đại lý & Affiliate', icon: Handshake },
  { to: '/gate-vkd-control-2026/showrooms', end: false, label: 'Showroom O2O', icon: Store },
  { to: '/gate-vkd-control-2026/revenue', end: false, label: 'Doanh thu đa kênh', icon: BarChart3 },
  { to: '/gate-vkd-control-2026/cms', end: false, label: 'Duyệt Bài CMS', icon: FileText },
  { to: '/gate-vkd-control-2026/channels', end: false, label: 'Kênh phân phối', icon: Share2 },
  { to: '/gate-vkd-control-2026/trust-proof', end: false, label: 'Uy tín & Bằng chứng', icon: Quote },
  { to: '/gate-vkd-control-2026/heritage-gallery', end: false, label: 'Ảnh Vườn Sâm', icon: Images },
  { to: '/gate-vkd-control-2026/field-videos', end: false, label: 'Video Thực Địa', icon: Clapperboard },
  { to: '/gate-vkd-control-2026/site-sections', end: false, label: 'Quản lý Trang', icon: Eye },
  { to: '/gate-vkd-control-2026/languages', end: false, label: 'Ngôn ngữ', icon: Languages },
  { to: '/gate-vkd-control-2026/nav-items', end: false, label: 'Menu Điều Hướng', icon: Menu },
  { to: '/gate-vkd-control-2026/header-footer', end: false, label: 'Header & Footer', icon: Type },
  { to: '/gate-vkd-control-2026/homepage-text', end: false, label: 'Nội Dung Trang Chủ', icon: Type },
  { to: '/gate-vkd-control-2026/blog-admin', end: false, label: 'Blog Admin', icon: FileText },
  { to: '/gate-vkd-control-2026/page-builder', end: false, label: 'Page Builder', icon: LayoutGrid },
  { to: '/gate-vkd-control-2026/crm-erp', end: false, label: 'CRM & ERP', icon: Users },
  { to: '/gate-vkd-control-2026/loyalty', end: false, label: 'TA Elite Club', icon: Crown },
  { to: '/gate-vkd-control-2026/inventory-qr', end: false, label: 'Kho hàng & QR', icon: Warehouse },
  { to: '/gate-vkd-control-2026/settings', end: false, label: 'Địa chỉ & Liên hệ', icon: Settings },
];

export default function AdminLayout() {
  const { logout } = useAdminAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="sticky top-0 z-40 bg-forest-950 text-cream-100">
        <div className="container-wide flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-gold-400" />
            <span className="font-display text-sm tracking-wide">TA — Control Portal</span>
          </div>
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto max-w-[70vw] scrollbar-thin">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm transition-colors flex-shrink-0 whitespace-nowrap ${
                    isActive ? 'bg-gold-400/15 text-gold-300' : 'text-cream-200/70 hover:bg-white/5 hover:text-cream-50'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Button
              onClick={logout}
              variant="ghost"
              className="hidden md:flex text-cream-300/70 hover:text-cream-50 hover:bg-white/5"
            >
              <LogOut className="w-4 h-4" /> Đăng xuất
            </Button>
            <Button
              onClick={() => setMobileNavOpen((v) => !v)}
              variant="ghost"
              size="icon"
              className="md:hidden text-cream-200 hover:bg-white/5"
              aria-label={mobileNavOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav className="md:hidden border-t border-white/10 bg-forest-950 px-4 py-3 space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-gold-400/15 text-gold-300' : 'text-cream-200/70 hover:bg-white/5 hover:text-cream-50'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
            <Button
              onClick={logout}
              variant="ghost"
              className="w-full justify-start text-cream-300/70 hover:bg-white/5 mt-2 border-t border-white/10 pt-4 rounded-lg"
            >
              <LogOut className="w-4 h-4" /> Đăng xuất
            </Button>
          </nav>
        )}
      </header>
      <main className="container-wide py-8">
        <Outlet />
      </main>
    </div>
  );
}
