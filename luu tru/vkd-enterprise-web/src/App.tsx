import { useState, useEffect } from 'react';
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
import ProductCatalog from './components/ProductCatalog';
import ResearchHub from './components/ResearchHub';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import LoyaltyDashboard from './components/LoyaltyDashboard';
import AutoshipPage from './components/AutoshipPage';
import type { Language } from './i18n/translations';

type Page = 'home' | 'catalog' | 'research' | 'checkout' | 'order-success' | 'loyalty' | 'autoship';

function App() {
  const [lang, setLang] = useState<Language>('vi');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const navigate = (page: string) => setCurrentPage(page as Page);

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
            <ProductCatalog lang={lang} />
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
        </main>

        {currentPage !== 'checkout' && currentPage !== 'order-success' && (
          <Footer lang={lang} onLangChange={setLang} onNavigate={navigate} />
        )}

        <CartDrawer lang={lang} onCheckout={() => navigate('checkout')} />
      </div>
    </CartProvider>
  );
}

export default App;
