import { useState, useEffect, type ReactElement } from 'react';
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
import NewsletterCTA from './components/NewsletterCTA';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import ProductAdvisor from './components/ProductAdvisor';
import GenericPageSectionBlock from './components/GenericPageSectionBlock';
import { fetchPageSections, type PageSection } from './lib/siteContentApi';
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
import { STATIC_PAGE_PATHS } from './lib/policyRoutes';
import type { Language } from './i18n/translations';

const SUPPORTED_LANGS: Language[] = ['vi', 'en', 'zh', 'fr'];

function App() {
  // Doc ?lang= tu URL luc mount (vd link chia se /product/x?lang=en) — chi
  // doc 1 lan, KHONG dong vao logic navigate() ben duoi (ham do da tung vo
  // vi so sanh sai chuoi co query, xem comment "ROOT CAUSE" trong navigate())
  // de tranh tai phat loai bug do. Doi ngon ngu sau nay ghi lai URL qua
  // history.replaceState truc tiep (handleLangChange ben duoi), khong qua ham navigate.
  const [lang, setLang] = useState<Language>(() => {
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    return urlLang && (SUPPORTED_LANGS as string[]).includes(urlLang) ? (urlLang as Language) : 'vi';
  });
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
  const [homeSections, setHomeSections] = useState<PageSection[]>([]);

  useEffect(() => {
    fetchVisibleSections()
      .then((rows) => setVisibleSections(new Set(rows.map((r) => r.key))))
      .catch(() => setVisibleSections(new Set()));
  }, []);

  useEffect(() => {
    fetchPageSections('home')
      .then((rows) => setHomeSections(rows))
      .catch(() => setHomeSections([]));
  }, []);

  // Block co component rieng — thu tu hien tren trang chu di theo sort_order
  // that su cua page_sections (keo tha trong Page Builder GIO se chuyen block
  // that, truoc day chi doi sort_order trong DB nhung JSX o day cung hoa
  // cung nen keo khong co tac dung). 'hero' luon co dinh dau tien (khong keo
  // duoc), 'about'/'showrooms'/'stats'/'pillar' khong phai section trang chu
  // (about/showrooms la trang rieng, pillar la muc con trong heritage) nen
  // khong dua vao day — con lai block_type nao KHONG co trong map nay se roi
  // ve GenericPageSectionBlock (anh/tieu de/mo ta/CTA tu do, xem file do).
  const DEDICATED_HOME_BLOCKS: Record<string, () => ReactElement | null> = {
    heritage: () => (visibleSections.has('heritage') ? <Heritage lang={lang} /> : null),
    products: () => <Products lang={lang} onNavigate={navigate} />,
    'combo-of-the-month': () => <ComboOfTheMonth lang={lang} onNavigate={navigate} />,
    'elite-teaser': () => <EliteTeaser lang={lang} onNavigate={navigate} />,
    'product-advisor': () => <ProductAdvisor lang={lang} onNavigate={navigate} />,
    certifications: () => <Certifications lang={lang} />,
    'trust-proof': () => <TrustProof lang={lang} />,
    b2b: () => <B2B lang={lang} />,
    newsletter: () => (
      <section className="section-padding bg-cream-50">
        <div className="container-wide max-w-3xl">
          <NewsletterCTA />
        </div>
      </section>
    ),
  };
  const NON_ORDERABLE_HOME_TYPES = new Set(['hero', 'about', 'showrooms', 'stats', 'pillar']);
  const orderedHomeSections = homeSections
    .filter((s) => s.visible && !NON_ORDERABLE_HOME_TYPES.has(s.block_type))
    .sort((a, b) => a.sort_order - b.sort_order);

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
      // /products?type=xxx hoặc ?goal=xxx (link chia sẻ/reload trang danh mục
      // đã lọc) — giữ nguyên query trong `page` (vd. "catalog?type=xxx") để
      // khớp đúng format `navigate()` dùng, nếu không app sẽ mở /products
      // nhưng RỚT MẤT bộ lọc đang chọn khi tải thẳng/refresh URL đó.
      if (pathname === '/products' || pathname === '/products/') {
        const q = window.location.search; // gồm dấu '?' nếu có
        return { page: q ? `catalog${q}` : 'catalog' };
      }
      // Trang chính sách + Giới Thiệu có URL thật riêng (xem lib/policyRoutes.ts)
      // — tải thẳng /chinh-sach-bao-mat hoặc /gioi-thieu hoặc chia sẻ link đó
      // phải mở đúng trang, không rơi về trang chủ.
      const staticEntry = Object.entries(STATIC_PAGE_PATHS).find(
        ([, path]) => pathname === path || pathname === `${path}/`
      );
      if (staticEntry) return { page: staticEntry[0] };
      return { page: 'home' };
    };

    const initial = matchPathname(window.location.pathname);
    if (initial.slug) setSelectedSlug(initial.slug);
    if (initial.page !== 'home') setCurrentPage(initial.page);
    // Query string (vd. /blog?page=4) phải giữ nguyên cho mọi trang, không chỉ
    // 'home' — trước đây bị drop trên mọi route khác, khiến Blog.tsx đọc lại
    // ?page= = null khi load thẳng URL và luôn rơi về trang 1.
    window.history.replaceState(
      { page: initial.page, slug: initial.slug },
      '',
      window.location.pathname + window.location.search,
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

  // hreflang: moi ngon ngu can 1 URL rieng de Google hieu day la ban dich
  // cua cung 1 trang (khong co URL khac nhau thi hreflang vo nghia). Dung
  // ?lang= thay vi doi hang path /en/... — khong dong vao navigate()/router
  // hien co (rui ro cao, xem comment o navigate()), van du dieu kien hreflang
  // hop le (URL that su khac nhau, xem duoc qua GET truc tiep).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.delete('lang');
    const basePath = window.location.pathname;
    const baseQs = params.toString();
    const urlFor = (l: Language | 'x-default') => {
      const p = new URLSearchParams(params);
      if (l !== 'vi' && l !== 'x-default') p.set('lang', l);
      const qs = p.toString();
      return `https://tasamngoclinh.com${basePath}${qs ? `?${qs}` : ''}`;
    };

    const created: HTMLLinkElement[] = [];
    [...SUPPORTED_LANGS, 'x-default' as const].forEach((l) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = l;
      link.href = l === 'x-default' ? `https://tasamngoclinh.com${basePath}${baseQs ? `?${baseQs}` : ''}` : urlFor(l);
      document.head.appendChild(link);
      created.push(link);
    });
    return () => created.forEach((el) => el.remove());
  }, [lang, currentPage, selectedSlug]);

  const handleLangChange = (next: Language) => {
    setLang(next);
    const params = new URLSearchParams(window.location.search);
    if (next === 'vi') params.delete('lang');
    else params.set('lang', next);
    const qs = params.toString();
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${qs ? `?${qs}` : ''}`
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const navigate = (page: string, slug?: string) => {
    if (slug) setSelectedSlug(slug);
    setCurrentPage(page);
    // ROOT CAUSE (đã vá lại sau khi tái phát 2026-09-07): `page` không phải
    // lúc nào cũng là 1 key thuần ('catalog', 'blog'...) — Header.tsx gọi
    // onNavigate(`catalog?type=${id}`) / `catalog?goal=${g}` để lọc danh mục,
    // nên `page` có thể là "catalog?type=sam-cu-tuoi-kho". Toàn bộ khối dưới
    // đây PHẢI so sánh trên `pageBase` (phần trước dấu '?'), KHÔNG so sánh
    // `page` trực tiếp — so sánh `page === 'catalog'` sẽ luôn false với chuỗi
    // có query, rơi xuống nhánh mặc định '/', làm mất hẳn "/products" khỏi
    // address bar dù nội dung trang vẫn đúng (state currentPage vẫn đúng).
    // RULE cho các lần sửa router sau: bất cứ chỗ nào so sánh `currentPage`
    // hoặc `page` bằng '===', phải tách qua `.split('?')[0]` trước, vì
    // `currentPage` trong app này là "key" hoặc "key?query", không bao giờ
    // là key thuần tuý đảm bảo.
    const [pageBase, pageQuery] = page.split('?');
    // Bài viết Blog và trang chi tiết sản phẩm có route thật (/blog/<id>,
    // /product/<slug>) để chia sẻ link trực tiếp và Google index được từng
    // trang — mọi trang khác trong app dùng state nội bộ như trước, pathname
    // reset về '/' khi rời khỏi các trang này.
    const pathname =
      pageBase === 'blog-post' && slug
        ? `/blog/${slug}`
        : pageBase === 'product-detail' && slug
        ? `/product/${slug}`
        : pageBase === 'blog'
        ? '/blog'
        : pageBase === 'catalog'
        ? '/products'
        : STATIC_PAGE_PATHS[pageBase] ?? '/';
    // Query string ưu tiên lấy từ chính `page` truyền vào (vd. type=..., goal=...
    // khi lọc danh mục) — đây là filter MỚI cần áp dụng, không phải query cũ
    // trên address bar. Nếu `page` không mang query riêng (catalog/blog không
    // lọc gì, chỉ đổi trang), giữ lại window.location.search hiện tại để
    // không mất phân trang (?page=4) đang có. Mọi trang khác bỏ hẳn query.
    const search =
      pageBase === 'catalog' && pageQuery
        ? `?${pageQuery}`
        : pageBase === 'catalog' || pageBase === 'blog'
        ? window.location.search
        : '';
    window.history.pushState({ page, slug: slug ?? selectedSlug }, '', pathname + search);
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
          onLangChange={handleLangChange}
          onNavigate={navigate}
          currentPage={currentPage}
          visibleSections={visibleSections}
        />

        <main>
          {currentPage === 'home' && (
            <>
              <Hero lang={lang} onNavigate={navigate} />
              {orderedHomeSections.map((s) => {
                const render = DEDICATED_HOME_BLOCKS[s.block_type];
                return (
                  <div key={s.id}>
                    {render ? render() : <GenericPageSectionBlock section={s} />}
                  </div>
                );
              })}
              {visibleSections.has('video-gallery') && <VideoGallery lang={lang} />}
            </>
          )}

          {currentPage === 'traceability' && (
            <Traceability lang={lang} />
          )}

          {currentPage === 'about' && (
            <About lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'blog' && (
            <Blog lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'blog-post' && (
            <BlogPostDetail slug={selectedSlug} lang={lang} onNavigate={navigate} />
          )}

          {currentPage === 'showrooms' && (
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

          {currentPage === 'certifications-page' && (
            <Certifications lang={lang} />
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
          <Footer lang={lang} onLangChange={handleLangChange} onNavigate={navigate} />
        )}

        <CartDrawer lang={lang} onCheckout={() => navigate('checkout')} />
        <ChatWidget lang={lang} onNavigate={navigate} />
      </div>
    </CartProvider>
  );
}

export default App;
