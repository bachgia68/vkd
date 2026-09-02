import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import FounderStory from './components/FounderStory';
import Heritage from './components/Heritage';
import Products from './components/Products';
import Traceability from './components/Traceability';
import B2B from './components/B2B';
import Certifications from './components/Certifications';
import Footer from './components/Footer';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import ProductAdvisor from './components/ProductAdvisor';
import ResearchHub from './components/ResearchHub';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import LoyaltyDashboard from './components/LoyaltyDashboard';
import AutoshipPage from './components/AutoshipPage';
import BatchTraceabilityLookup from './components/BatchTraceabilityLookup';
import ChatWidget from './components/ChatWidget';
import EliteTeaser from './components/EliteTeaser';
import TrustProof from './components/TrustProof';
import ComboOfTheMonth from './components/ComboOfTheMonth';
import About from './components/About';
import Blog from './components/Blog';
import BlogPostDetail from './components/BlogPostDetail';
import VideoGallery from './components/VideoGallery';
import Showrooms from './components/Showrooms';
import PolicyPage from './components/PolicyPage';
import { fetchVisibleSections } from './lib/siteContentApi';
import type { Language } from './i18n/translations';

function App() {
  const [lang, setLang] = useState<Language>('vi');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [orderId, setOrderId] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('');
  const [traceQr, setTraceQr] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  // Chưa có hệ thống đăng nhập thật — tạm nhận diện khách qua email đã dùng
  // ở lần đặt hàng gần nhất (lưu ở Checkout.tsx), để trang Loyalty Dashboard
  // hiển thị đúng điểm/hạng của khách quay lại thay vì luôn coi là "chưa có".
  const [userEmail] = useState<string | undefined>(
    () => localStorage.getItem('ta_customer_email') || undefined
  );
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchVisibleSections()
      .then((rows) => setVisibleSections(new Set(rows.map((r) => r.key))))
      .catch(() => setVisibleSections(new Set()));
  }, []);

  // Đồng bộ điều hướng trong app với lịch sử trình duyệt, để nút Back của
  // trình duyệt quay về trang trước đó trong app thay vì thoát hẳn ra khỏi
  // site (bug do trước đây currentPage chỉ là state nội bộ, không gắn với
  // history entry nào).
  useEffect(() => {
    // Link chia sẻ trực tiếp một bài viết/sản phẩm (vd. đăng fanpage, kết quả
    // Google) trỏ vào /blog/<id> hoặc /product/<slug> — nếu trang vừa tải
    // thẳng vào đường dẫn này (không phải điều hướng nội bộ), mở đúng trang
    // đó ngay từ đầu thay vì rơi về trang chủ.
    const matchPathname = (pathname: string): { page: string; slug?: string } => {
      const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
      if (blogMatch) return { page: 'blog-post', slug: blogMatch[1] };
      if (pathname === '/blog' || pathname === '/blog/') return { page: 'blog' };
      const productMatch = pathname.match(/^\/product\/([^/]+)\/?$/);
      if (productMatch) return { page: 'product-detail', slug: productMatch[1] };
      if (pathname === '/products' || pathname === '/products/') return { page: 'catalog' };
      return { page: 'home' };
    };

    const initial = matchPathname(window.location.pathname);
    if (initial.slug) setSelectedSlug(initial.slug);
    if (initial.page !== 'home') setCurrentPage(initial.page);
    window.history.replaceState(
      { page: initial.page, slug: initial.slug },
      '',
      initial.page === 'home' ? window.location.pathname + window.location.search : window.location.pathname,
    );

    const onPopState = (event: PopStateEvent) => {
      const state = event.state as { page?: string; slug?: string } | null;
      if (state?.page) {
        setCurrentPage(state.page);
        if (state.slug) setSelectedSlug(state.slug);
      } else {
        const match = matchPathname(window.location.pathname);
        if (match.slug) setSelectedSlug(match.slug);
        setCurrentPage(match.page);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setCurrentPage(page);
    // Bài viết Blog và trang chi tiết sản phẩm có route thật (/blog/<id>,
    // /product/<slug>) để chia sẻ link trực tiếp và Google index được từng
    // trang — mọi trang khác trong app dùng state nội bộ như trước, pathname
    // reset về '/' khi rời khỏi các trang này.
    const pathname =
      page === 'blog-post' && slug
        ? `/blog/${slug}`
        : page === 'product-detail' && slug
        ? `/product/${slug}`
        : page === 'blog'
        ? '/blog'
        : page === 'catalog'
        ? '/products'
        : '/';
    window.history.pushState({ page, slug: slug ?? selectedSlug }, '', pathname + window.location.search);
  };

  const handleOrderSuccess = (id: string) => {
    setOrderId(id);
    setCurrentPage('order-success');
  };

  const [basePage, queryString] = currentPage.split('?');
  const catalogType = new URLSearchParams(queryString).get('type') ?? undefined;
  const catalogGoal = new URLSearchParams(queryString).get('goal') ?? undefined;

  return (
    <CartProvider>
      <div className="min-h-screen bg-cream-50">
        <Header
          lang={lang}
          onLangChange={setLang}
          onNavigate={navigate}
          currentPage={currentPage}
          visibleSections={visibleSections}
        />

        <main>
          {currentPage === 'home' && (
            <>
              <Hero lang={lang} onNavigate={navigate} />
              {visibleSections.has('heritage') && <Heritage lang={lang} />}
              <Products lang={lang} onNavigate={navigate} />
              <ComboOfTheMonth lang={lang} />
              <EliteTeaser lang={lang} onNavigate={navigate} />
              <ProductAdvisor lang={lang} onNavigate={navigate} />
              <Certifications lang={lang} />
              <TrustProof lang={lang} />
              <B2B lang={lang} />
              {visibleSections.has('video-gallery') && <VideoGallery />}
            </>
          )}

          {currentPage === 'traceability' && (
            <Traceability lang={lang} />
          )}

          {currentPage === 'about' && visibleSections.has('about') && (
            <About lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'blog' && visibleSections.has('blog') && (
            <Blog onNavigate={navigate} />
          )}

          {currentPage === 'blog-post' && visibleSections.has('blog') && (
            <BlogPostDetail slug={selectedSlug} lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'showrooms' && visibleSections.has('showrooms') && (
            <Showrooms lang={lang} />
          )}

          {basePage === 'catalog' && (
            <ProductCatalog lang={lang} onNavigate={navigate} initialType={catalogType} initialGoal={catalogGoal} />
          )}

          {basePage === 'product-detail' && (
            <ProductDetail slug={selectedSlug} lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'research' && (
            <ResearchHub lang={lang} />
          )}

          {currentPage === 'about-story' && (
            <FounderStory lang={lang} onNavigate={navigate} />
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
            <LoyaltyDashboard lang={lang} onNavigate={navigate} userEmail={userEmail} />
          )}

          {currentPage === 'autoship' && (
            <AutoshipPage lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'trace' && (
            <BatchTraceabilityLookup lang={lang} qrHash={traceQr} onNavigate={navigate} />
          )}

          {currentPage === 'policy-privacy' && (
            <PolicyPage policyKey="privacy" lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'policy-terms' && (
            <PolicyPage policyKey="terms" lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'policy-shipping' && (
            <PolicyPage policyKey="shipping" lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'policy-refund' && (
            <PolicyPage policyKey="refund" lang={lang} onNavigate={navigate} />
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
