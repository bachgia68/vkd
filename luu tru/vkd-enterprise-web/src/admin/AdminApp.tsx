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

function Gate() {
  const { isAuthenticated } = useAdminAuth();
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
          <Route path="agents" element={<AgentsPage />} />
          <Route path="showrooms" element={<ShowroomsPage />} />
          <Route path="revenue" element={<RevenuePage />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
