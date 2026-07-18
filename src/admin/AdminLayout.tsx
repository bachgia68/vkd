import { NavLink, Outlet } from 'react-router-dom';
import { LayoutGrid, FileText, Users, Warehouse, LogOut, Leaf, Package, Handshake, Store, BarChart3 } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

const NAV = [
  { to: '/gate-vkd-control-2026', end: true, label: 'Tổng quan', icon: LayoutGrid },
  { to: '/gate-vkd-control-2026/products', end: false, label: 'Sản phẩm & Kho', icon: Package },
  { to: '/gate-vkd-control-2026/agents', end: false, label: 'Đại lý & Affiliate', icon: Handshake },
  { to: '/gate-vkd-control-2026/showrooms', end: false, label: 'Showroom O2O', icon: Store },
  { to: '/gate-vkd-control-2026/revenue', end: false, label: 'Doanh thu đa kênh', icon: BarChart3 },
  { to: '/gate-vkd-control-2026/cms', end: false, label: 'Duyệt Bài CMS', icon: FileText },
  { to: '/gate-vkd-control-2026/crm-erp', end: false, label: 'CRM & ERP', icon: Users },
  { to: '/gate-vkd-control-2026/inventory-qr', end: false, label: 'Kho hàng & QR', icon: Warehouse },
];

export default function AdminLayout() {
  const { logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="sticky top-0 z-40 bg-forest-950 text-cream-100">
        <div className="container-wide flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-gold-400" />
            <span className="font-display text-sm tracking-wide">Võ Kim Đường — Control Portal</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-gold-400/15 text-gold-300' : 'text-cream-200/70 hover:bg-white/5 hover:text-cream-50'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-cream-300/70 hover:text-cream-50 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </div>
      </header>
      <main className="container-wide py-8">
        <Outlet />
      </main>
    </div>
  );
}
