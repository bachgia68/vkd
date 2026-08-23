import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import ProductGallery from '@/components/ProductGallery';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Sản phẩm nổi bật</h2>
        <ProductGallery featured={true} />
      </section>
      <Footer />
    </main>
  );
}
