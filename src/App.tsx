import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Heritage from './components/Heritage';
import Products from './components/Products';
import Showrooms from './components/Showrooms';
import Traceability from './components/Traceability';
import B2B from './components/B2B';
import Certifications from './components/Certifications';
import NewsFeed from './components/NewsFeed';
import OmniChannel from './components/OmniChannel';
import Footer from './components/Footer';
import VKDProductCatalog from './components/VKDProductCatalog';
import VKDProductDetail from './components/VKDProductDetail';
import ResearchHub from './components/ResearchHub';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import LoyaltyDashboard from './components/LoyaltyDashboard';
import AutoshipPage from './components/AutoshipPage';
import BatchTraceabilityLookup from './components/BatchTraceabilityLookup';
import ChatWidget from './components/ChatWidget';
import type { Language } from './i18n/translations';

type Page = 'home' | 'catalog' | 'product-detail' | 'research' | 'checkout' | 'order-success' | 'loyalty' | 'autoship' | 'trace';

function App() {
  const [lang, setLang] = useState<Language>('vi');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [orderId, setOrderId] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('');
  const [traceQr, setTraceQr] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  // Xử lý khi trình duyệt quay lại từ trang thanh toán PayOS (VietQR).
  useEffect(() => {
    if (searchParams.get('payos_return') === '1') {
      const orderCode = searchParams.get('orderCode');
      const status = searchParams.get('status');
      setSearchParams({}, { replace: true });
      if (!status || status === 'PAID') {
        setOrderId(orderCode ? `PAYOS-${orderCode}` : 'PAYOS-' + Date.now());
        setCurrentPage('order-success');
      } else {
        setCurrentPage('checkout');
      }
    } else if (searchParams.get('payos_cancel') === '1') {
      setSearchParams({}, { replace: true });
      setCurrentPage('checkout');
    } else if (searchParams.get('trace')) {
      setTraceQr(searchParams.get('trace') as string);
      setCurrentPage('trace');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const navigate = (page: string, slug?: string) => {
    if (slug) setSelectedSlug(slug);
    setCurrentPage(page as Page);
  };

  const handleOrderSuccess = (id: string) => {
    setOrderId(id);
    setCurrentPage('order-success');
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-cream-50">
        <Header
          lang={lang}
          onLangChange={setLang}
          onNavigate={navigate}
          currentPage={currentPage}
        />

        <main>
          {currentPage === 'home' && (
            <>
              <Hero lang={lang} onNavigate={navigate} />
              <Stats lang={lang} />
              <About lang={lang} />
              <Heritage lang={lang} />
              <Products lang={lang} onNavigate={navigate} />
              <OmniChannel lang={lang} onNavigate={navigate} />
              <Showrooms lang={lang} />
              <Traceability lang={lang} />
              <B2B lang={lang} />
              <Certifications lang={lang} />
              <NewsFeed lang={lang} />
            </>
          )}

          {currentPage === 'catalog' && (
            <VKDProductCatalog lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'product-detail' && (
            <VKDProductDetail slug={selectedSlug} lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'research' && (
            <ResearchHub lang={lang} />
          )}

          {currentPage === 'checkout' && (
            <Checkout
              lang={lang}
              onNavigate={navigate}
              onOrderSuccess={handleOrderSuccess}
            />
          )}

          {currentPage === 'order-success' && (
            <OrderConfirmation
              lang={lang}
              orderId={orderId}
              onNavigate={navigate}
            />
          )}

          {currentPage === 'loyalty' && (
            <LoyaltyDashboard lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'autoship' && (
            <AutoshipPage lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'trace' && (
            <BatchTraceabilityLookup lang={lang} qrHash={traceQr} onNavigate={navigate} />
          )}
        </main>

        {currentPage !== 'checkout' && currentPage !== 'order-success' && currentPage !== 'trace' && (
          <Footer lang={lang} onLangChange={setLang} onNavigate={navigate} />
        )}

        <CartDrawer lang={lang} onCheckout={() => navigate('checkout')} />
        <ChatWidget lang={lang} onNavigate={navigate} />
      </div>
    </CartProvider>
  );
}

export default App;
