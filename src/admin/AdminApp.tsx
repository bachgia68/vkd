import { Routes, Route } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminHome from './AdminHome';
import CmsPage from './pages/CmsPage';
import CrmErpPage from './pages/CrmErpPage';
import InventoryQrPage from './pages/InventoryQrPage';
import ProductsPage from './pages/ProductsPage';
import AgentsPage from './pages/AgentsPage';
import ShowroomsPage from './pages/ShowroomsPage';
import RevenuePage from './pages/RevenuePage';
import SettingsPage from './pages/SettingsPage';
import CatalogExportPage from './pages/CatalogExportPage';
import ChannelsPage from './pages/ChannelsPage';

function Gate() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  if (isLoading) {
    return <div className="min-h-screen bg-forest-950" />;
  }
  return isAuthenticated ? <AdminLayout /> : <AdminLogin />;
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/" element={<Gate />}>
          <Route index element={<AdminHome />} />
          <Route path="cms" element={<CmsPage />} />
          <Route path="crm-erp" element={<CrmErpPage />} />
          <Route path="inventory-qr" element={<InventoryQrPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="catalog-export" element={<CatalogExportPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="showrooms" element={<ShowroomsPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="channels" element={<ChannelsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
