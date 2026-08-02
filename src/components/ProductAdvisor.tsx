import { useMemo, useState } from 'react';
import { ArrowRight, RotateCcw, ShoppingBag, Sparkles } from 'lucide-react';
import type { HealthGoal, TargetAudience } from '../data/mockData';
import { healthGoalLabels, audienceLabels } from '../data/mockData';
import { products, toCartProduct } from '../data/products';
import { useCart } from '../context/CartContext';
import type { Language } from '../i18n/translations';

/**
 * ProductAdvisor — "Tìm Sản Phẩm Phù Hợp Trong 10 Giây"
 * -----------------------------------------------------------------------------
 * Khôi phục từ GinsengAdvisor.tsx (bản cũ, đã gỡ khi dữ liệu sản phẩm mẫu/fake bị
 * xóa). Bản mới chạy trên dữ liệu SẢN PHẨM THẬT của cả hai nguồn NCC (nội bộ,
 * gộp hiển thị dưới brand TA — supplier-guard-allow), không hiển
 * thị rating/reviews giả (đã bị gỡ khỏi UI toàn site — xem update-vkd-products
 * skill), và bổ sung nhóm "Gia Đình" — CHỈ gợi ý sản phẩm được đánh dấu
 * `familySafe` (không rượu, không sâm/mật ong cô đặc, không liều dùng theo bệnh lý).
 * Sản phẩm rượu (displayOnly18Plus) hoặc "Liên hệ" (chưa có giá) bị loại khỏi vòng
 * gợi ý vì không thể "Thêm Vào Giỏ" trực tiếp.
 * -----------------------------------------------------------------------------
 */

interface ProductAdvisorProps {
  lang: Language;
  onNavigate: (page: string, slug?: string) => void;
}

type Step = 0 | 1 | 2;

const goalIconMap: Record<HealthGoal, string> = {
  energy: '⚡',
  stress: '🧘',
  immunity: '🛡️',
  youth: '✨',
};

export default function ProductAdvisor({ lang, onNavigate }: ProductAdvisorProps) {
  const isVi = lang === 'vi';
  const { addToCart } = useCart();

  const [step, setStep] = useState<Step>(0);
  const [audience, setAudience] = useState<TargetAudience | null>(null);
  const [goal, setGoal] = useState<HealthGoal | null>(null);
  const [added, setAdded] = useState(false);

  const goals = Object.keys(healthGoalLabels) as HealthGoal[];
  const audiences = Object.keys(audienceLabels) as TargetAudience[];

  const pool = useMemo(
    () =>
      products
        .filter((p) => p.price != null && !p.displayOnly18Plus)
        .map(toCartProduct),
    []
  );

  const match = useMemo(() => {
    if (!goal || !audience) return null;
    const candidates = audience === 'family' ? pool.filter((p) => p.familySafe) : pool;
    const exact = candidates.filter((p) => p.healthGoal === goal && p.audiences.includes(audience));
    const byGoal = candidates.filter((p) => p.healthGoal === goal);
    return exact[0] ?? byGoal[0] ?? candidates[0] ?? null;
  }, [goal, audience, pool]);

  const reset = () => {
    setStep(0);
    setAudience(null);
    setGoal(null);
    setAdded(false);
  };

  const selectAudience = (a: TargetAudience) => {
    setAudience(a);
    setStep(1);
  };

  const selectGoal = (g: HealthGoal) => {
    setGoal(g);
    setStep(2);
  };

  const viewAllMatching = () => {
    if (!match) return;
    onNavigate('catalog');
  };

  return (
    <section className="section-padding bg-gradient-to-b from-cream-50 to-cream-100 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-300/10 rounded-full blur-[140px]" />

      <div className="container-wide relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-900 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold-300">
              TA Product Advisor
            </span>
          </div>
          <h2 className="font-display text-display-sm md:text-display-md text-forest-900">
            {isVi ? 'Tìm Sản Phẩm Phù Hợp Với Bạn Trong 10 Giây' : 'Find Your Product Match In 10 Seconds'}
          </h2>
          <p className="text-forest-600 text-lg mt-4">
            {isVi
              ? 'Trả lời 2 câu hỏi ngắn — hệ thống đề xuất sản phẩm phù hợp nhất từ toàn bộ danh mục TA.'
              : 'Answer two quick questions for an instant, personalized recommendation across the full TA catalog.'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-elegant-lg border border-cream-200 p-6 md:p-10 min-h-[380px]">
          <div className="flex items-center gap-2 mb-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                  i <= step ? 'bg-gold-400' : 'bg-cream-200'
                }`}
              />
            ))}
          </div>

          {step === 0 && (
            <div className="animate-fade-in-up">
              <span className="text-gold-600 text-xs font-semibold tracking-wider uppercase">
                {isVi ? 'Câu 1 / 2' : 'Question 1 / 2'}
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-forest-900 mt-2 mb-8">
                {isVi ? 'Ai sẽ dùng sản phẩm?' : 'Who will use the product?'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {audiences.map((a) => (
                  <button
                    key={a}
                    onClick={() => selectAudience(a)}
                    className="group text-left p-5 rounded-xl border-2 border-cream-200 hover:border-gold-400 hover:bg-gold-50 transition-all duration-300"
                  >
                    <span className="block font-display text-lg text-forest-900">
                      {isVi ? audienceLabels[a].vi : audienceLabels[a].en}
                    </span>
                    {a === 'family' && (
                      <span className="block text-xs text-forest-400 mt-1">
                        {isVi ? 'Chỉ gợi ý sản phẩm an toàn, không rượu' : 'Only alcohol-free, family-safe picks'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in-up">
              <span className="text-gold-600 text-xs font-semibold tracking-wider uppercase">
                {isVi ? 'Câu 2 / 2' : 'Question 2 / 2'}
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-forest-900 mt-2 mb-8">
                {isVi ? 'Bạn muốn cảm thấy thế nào?' : 'How do you want to feel?'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {goals.map((g) => (
                  <button
                    key={g}
                    onClick={() => selectGoal(g)}
                    className="group text-left p-5 rounded-xl border-2 border-cream-200 hover:border-gold-400 hover:bg-gold-50 transition-all duration-300"
                  >
                    <span className="text-2xl mb-2 block">{goalIconMap[g]}</span>
                    <span className="block font-display text-lg text-forest-900">
                      {isVi ? healthGoalLabels[g].vi : healthGoalLabels[g].en}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(0)}
                className="mt-6 text-sm text-forest-500 hover:text-forest-700 transition-colors"
              >
                {isVi ? '← Quay lại' : '← Back'}
              </button>
            </div>
          )}

          {step === 2 && match && (
            <div className="animate-fade-in-up">
              <span className="text-gold-600 text-xs font-semibold tracking-wider uppercase">
                {isVi ? 'Đề xuất dành riêng cho bạn' : 'Your personalized match'}
              </span>
              <div className="grid md:grid-cols-[180px_1fr] gap-6 mt-4 items-center">
                <div className="relative rounded-xl overflow-hidden aspect-square bg-cream-100">
                  <img
                    src={match.image}
                    alt={isVi ? match.nameVi : match.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {match.badge && (
                    <span className="absolute top-2 left-2 bg-gold-400 text-forest-900 text-[10px] font-bold px-2 py-1 rounded-full">
                      {match.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-2xl text-forest-900 mb-1">
                    {isVi ? match.nameVi : match.name}
                  </h3>
                  <p className="text-forest-600 text-sm mb-3">
                    {isVi ? match.descriptionVi : match.description}
                  </p>
                  <span className="inline-block text-xs font-semibold text-forest-700 bg-forest-100 px-3 py-1 rounded-full mb-5">
                    {match.activeIngredient}
                  </span>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        addToCart(match);
                        setAdded(true);
                      }}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {added ? (isVi ? 'Đã Thêm Vào Giỏ' : 'Added To Cart') : isVi ? 'Thêm Vào Giỏ' : 'Add To Cart'}
                    </button>
                    <button
                      onClick={viewAllMatching}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-forest-900 text-forest-900 text-sm font-semibold hover:bg-forest-900 hover:text-white transition-colors"
                    >
                      {isVi ? 'Xem Tất Cả Sản Phẩm Phù Hợp' : 'See All Matching Products'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={reset}
                className="mt-8 inline-flex items-center gap-2 text-sm text-forest-500 hover:text-forest-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isVi ? 'Làm Lại Từ Đầu' : 'Start Over'}
              </button>
            </div>
          )}

          {step === 2 && !match && (
            <div className="animate-fade-in-up text-center py-10">
              <p className="text-forest-600 mb-6">
                {isVi ? 'Chưa tìm được sản phẩm phù hợp — thử lại với lựa chọn khác.' : 'No match found — try a different combination.'}
              </p>
              <button onClick={reset} className="btn-primary text-xs">
                {isVi ? 'Làm Lại Từ Đầu' : 'Start Over'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
