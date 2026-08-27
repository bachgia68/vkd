import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
    },
  },
});
import AdminHome from './AdminHome';
import CmsPage from './pages/CmsPage';
import CrmErpPage from './pages/CrmErpPage';
import InventoryQrPage from './pages/InventoryQrPage';
import ProductsManagePage from './pages/ProductsManagePage';
import AgentsPage from './pages/AgentsPage';
import ShowroomsPage from './pages/ShowroomsPage';
import RevenuePage from './pages/RevenuePage';
import SettingsPage from './pages/SettingsPage';
import CatalogExportPage from './pages/CatalogExportPage';
import ChannelsPage from './pages/ChannelsPage';
import TrustProofPage from './pages/TrustProofPage';
import CombosPage from './pages/CombosPage';
import SiteSectionsPage from './pages/SiteSectionsPage';
import LoyaltyPage from './pages/LoyaltyPage';
import HeritageGalleryPage from './pages/HeritageGalleryPage';
import FieldVideosPage from './pages/FieldVideosPage';
import OrdersPage from './pages/OrdersPage';
import LanguagesPage from './pages/LanguagesPage';
import HeaderFooterPage from './pages/HeaderFooterPage';
import HomepageTextPage from './pages/HomepageTextPage';
import BlogAdminPage from './pages/BlogAdminPage';
import PageBuilderPage from './pages/PageBuilderPage';
import NavItemsPage from './pages/NavItemsPage';
import BlogCategoryPage from './pages/BlogCategoryPage';
import ProductMenuPage from './pages/ProductMenuPage';
import PolicyContentPage from './pages/PolicyContentPage';
import SiteConfigPage from './pages/SiteConfigPage';

function Gate() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  if (isLoading) {
    return <div className="min-h-screen bg-forest-950" />;
  }
  return isAuthenticated ? <AdminLayout /> : <AdminLogin />;
}

export default function AdminApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <Routes>
        <Route path="/" element={<Gate />}>
          <Route index element={<AdminHome />} />
          <Route path="cms" element={<CmsPage />} />
          <Route path="crm-erp" element={<CrmErpPage />} />
          <Route path="loyalty" element={<LoyaltyPage />} />
          <Route path="inventory-qr" element={<InventoryQrPage />} />
          <Route path="products" element={<ProductsManagePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="catalog-export" element={<CatalogExportPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="showrooms" element={<ShowroomsPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="channels" element={<ChannelsPage />} />
          <Route path="trust-proof" element={<TrustProofPage />} />
          <Route path="heritage-gallery" element={<HeritageGalleryPage />} />
          <Route path="field-videos" element={<FieldVideosPage />} />
          <Route path="combos" element={<CombosPage />} />
          <Route path="site-sections" element={<SiteSectionsPage />} />
          <Route path="languages" element={<LanguagesPage />} />
          <Route path="header-footer" element={<HeaderFooterPage />} />
          <Route path="homepage-text" element={<HomepageTextPage />} />
          <Route path="blog-admin" element={<BlogAdminPage />} />
          <Route path="page-builder" element={<PageBuilderPage />} />
          <Route path="nav-items" element={<NavItemsPage />} />
          <Route path="blog-categories" element={<BlogCategoryPage />} />
          <Route path="product-menu" element={<ProductMenuPage />} />
          <Route path="policy-content" element={<PolicyContentPage />} />
          <Route path="site-config" element={<SiteConfigPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}
