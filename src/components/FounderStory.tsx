import { ArrowLeft, Heart, MapPin, Leaf, ShieldCheck, Phone } from 'lucide-react';
import type { Language } from '../i18n/translations';

interface FounderStoryProps {
  lang: Language;
  onNavigate: (page: string) => void;
}

/**
 * FounderStory — trang "Về Chúng Tôi" đầy đủ (câu chuyện founder Khánh).
 * Nội dung gốc bằng tiếng Việt (do chủ shop tự viết) — bản dịch đầy đủ 5 ngôn
 * ngữ chưa có ở bản đầu, các ngôn ngữ khác hiện tạm hiển thị bản tóm tắt tiếng
 * Anh ngắn gọn thay vì dịch trọn vẹn câu chuyện dài — cần làm riêng sau nếu
 * cần bản dịch đầy đủ.
 */
export default function FounderStory({ lang, onNavigate }: FounderStoryProps) {
  const isVi = lang === 'vi';
  const isRTL = lang === 'ar';

  return (
    <section className="bg-cream-50 min-h-screen" style={{ paddingTop: '6rem', paddingBottom: '6rem' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide" style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem' }}>
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm text-forest-500 hover:text-forest-700 transition-colors mb-10"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          {isVi ? 'Về trang chủ' : 'Back to home'}
        </button>

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-100 rounded-full mb-6">
            <Heart className="w-3.5 h-3.5 text-forest-600" />
            <span className="text-xs font-semibold tracking-wider uppercase text-forest-700">
              {isVi ? 'Sứ Mệnh Từ Tâm Nguyện' : 'A Mission Born From the Heart'}
            </span>
          </div>
          <h1 className="font-display text-display-sm md:text-display-md text-forest-900 mb-4">
            {isVi
              ? 'Chào Mừng Bạn Đến Với TA Sâm Ngọc Linh'
              : 'Welcome to TA Ngoc Linh Ginseng'}
          </h1>
          <p className="text-gold-600 text-lg italic">
            {isVi ? 'Nơi chỉ bán sự thật và sự minh bạch' : 'Where we only sell truth and transparency'}
          </p>
        </div>

        {isVi ? (
          <div className="prose-story space-y-6 text-forest-700 leading-relaxed text-lg">
            <p className="text-xl font-medium text-forest-900">Chào bạn, tôi là Khánh.</p>

            <p>
              Nếu bạn đang tìm kiếm Sâm Ngọc Linh — "Quốc bảo" của Việt Nam — nhưng lại hoang mang
              giữa một "mê hồn trận" thật giả, giá cả hỗn loạn và giấy tờ mập mờ, thì TA Sâm Ngọc
              Linh chính là nơi được tạo ra để mang lại cho bạn sự an tâm tuyệt đối.
            </p>

            <h2 className="font-display text-2xl text-forest-900 pt-6">
              Hành Trình Hơn 10 Năm Tìm Kiếm "Năng Lượng Chữa Lành Tinh Sạch"
            </h2>

            <p>
              Hơn 20 năm chứng kiến mẹ chìm trong bệnh tật dai dẳng là chừng ấy năm tôi trăn trở đi
              tìm giải pháp bồi bổ cho mẹ. Ngày đó, vì quá thương vợ, bố tôi tích trữ đủ loại: từ
              các loại cao cho đến những bình rượu ngâm động vật...
            </p>
            <p>Nhưng rồi mẹ vẫn không qua khỏi.</p>
            <p>
              Cách đây 4 năm, sau 100 ngày mất của mẹ, đứng trước những bình rượu ấy, tôi đột nhiên
              rùng mình. Một cảm giác xót thương nghẹn đắng ở cổ họng. Những đau đớn của bao sinh
              linh rốt cuộc cũng chẳng thể giữ nổi người tôi yêu thương nhất. Tôi nhìn bố và nghẹn
              ngào: "Bố ơi, mình trút bỏ hết đi. Giải thoát cho họ về với đất..."
            </p>
            <p>
              Khoảnh khắc đó đã thức tỉnh tôi hoàn toàn. Tôi tự hứa với lòng mình: sức khỏe thực sự
              của con người không thể xây dựng trên sự đau đớn của sinh linh khác. Tôi phải đi tìm
              một nguồn thảo dược TINH SẠCH, BÌNH AN và TỬ TẾ từ tự nhiên.
            </p>
            <p>
              Tôi quyết định rời thành phố, tìm về vùng đại ngàn Trà Linh (Nam Trà My, Quảng Nam).
              Suốt hơn 10 năm qua, dưới tán rừng già ở độ cao trên 1.800m — đỉnh cao nhất, nơi hội
              tụ nhiều linh khí nhất của khối núi Ngọc Linh — tôi kiên trì nuôi đất, chăm sâm hoàn
              toàn tự nhiên. Cây sâm lớn lên chỉ bằng sương mù, nước nguồn và mùn đất rừng nguyên
              sinh — chắt chiu từng giọt linh khí của đất trời để tạo nên nguồn năng lượng bồi bổ
              thuần khiết nhất.
            </p>

            <h2 className="font-display text-2xl text-forest-900 pt-6">
              TA Sâm Ngọc Linh — Nơi Chỉ Bán Sự Thật &amp; Sự Minh Bạch
            </h2>

            <p>
              Hôm nay, TA Sâm Ngọc Linh ra đời không phải chỉ để bán hàng. Chúng tôi được xây dựng
              như một "điểm tựa niềm tin" giữa một thị trường sâm thật - giả lẫn lộn, phục vụ khách
              hàng bằng 2 trụ cột minh bạch tuyệt đối:
            </p>

            <div className="grid md:grid-cols-2 gap-6 not-prose my-8">
              <div className="bg-white rounded-2xl p-6 shadow-elegant border border-cream-200">
                <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center mb-4">
                  <Leaf className="w-5 h-5 text-forest-600" />
                </div>
                <h3 className="font-display text-lg font-semibold text-forest-900 mb-3">
                  1. Củ Sâm Tươi Nguyên Bản — Nhổ Tận Vườn Nhà Khánh (Trà Linh)
                </h3>
                <ul className="space-y-2 text-sm text-forest-600 list-none">
                  <li>• Gốc gác rõ ràng: 100% sâm củ tươi gieo trồng và thu hoạch trực tiếp tại vườn nhà Khánh ở xã Trà Linh, huyện Nam Trà My, tỉnh Quảng Nam.</li>
                  <li>• Đủ độ tuổi: chỉ thu hoạch những củ sâm từ 6–10 năm tuổi trở lên, tích tụ hàm lượng Saponin (đặc biệt là hợp chất MR2) ở mức cao nhất.</li>
                  <li>• Bao kiểm định hàm lượng Saponin toàn quốc.</li>
                  <li>• Mục thị sở thị: Khánh luôn mở rộng cửa lán gỗ tại Trà Linh, trân trọng mời anh em, bạn bè và quý khách ghé thăm tận vườn để tự tay sờ, tự tay nhổ sâm.</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-elegant border border-cream-200">
                <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-gold-600" />
                </div>
                <h3 className="font-display text-lg font-semibold text-forest-900 mb-3">
                  2. Sản Phẩm Chế Biến Sâu Tuyển Chọn — Đầy Đủ Giấy Tờ Pháp Lý
                </h3>
                <ul className="space-y-2 text-sm text-forest-600 list-none">
                  <li>• Đáp ứng nhu cầu sử dụng tiện lợi hàng ngày (Trà sâm, Dịch chiết, Cao sâm, Viên nang...), TA Sâm Ngọc Linh đóng vai trò đơn vị tuyển chọn nghiêm ngặt.</li>
                  <li>• Chỉ hợp tác với các thương hiệu lớn, uy tín hàng đầu, có nhà xưởng đạt chuẩn GMP.</li>
                  <li>• 100% sản phẩm có đầy đủ giấy công bố chất lượng, kiểm định hàm lượng Saponin và hóa đơn chứng từ minh bạch.</li>
                  <li>• Chỉ những sản phẩm thực sự an toàn, tinh sạch mới xuất hiện trên kệ hàng TA Sâm Ngọc Linh.</li>
                </ul>
              </div>
            </div>

            {/* Mục thị sở thị — ảnh vườn thật */}
            <div className="not-prose my-10 rounded-2xl overflow-hidden shadow-elegant-lg">
              <img
                src="/assets/images/heritage-vuon-sam-1-bo.jpg"
                alt="Vườn giống Sâm Ngọc Linh tại Trà Linh, Nam Trà My"
                className="w-full aspect-video object-cover"
              />
              <div className="bg-forest-900 p-5 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                <p className="text-cream-100 text-sm">
                  Vườn giống thật tại Trà Linh, Nam Trà My — nơi Khánh trực tiếp chăm sóc từng luống
                  sâm dưới tán rừng già hơn 10 năm qua.
                </p>
              </div>
            </div>

            <div className="bg-forest-950 rounded-2xl p-8 md:p-10 my-10 not-prose">
              <p className="text-cream-100 text-lg italic leading-relaxed">
                "Trồng một cây sâm mất 6-10 năm, nhưng xây dựng một thương hiệu mất cả một đời. Mỗi
                sản phẩm gửi đến tay bạn, TA Sâm Ngọc Linh không chỉ trao đi hàm lượng dược tính quý
                giá, mà còn gửi gắm cả tâm nguyện thanh sạch của một người con làm nghề bằng sự tử
                tế."
              </p>
              <p className="text-gold-400 text-sm font-semibold mt-4">— Khánh, Founder TA Sâm Ngọc Linh</p>
            </div>

            <div className="not-prose bg-white rounded-2xl p-8 shadow-elegant border border-cream-200">
              <h3 className="font-display text-lg font-semibold text-forest-900 mb-4">
                Thông Tin Liên Hệ
              </h3>
              <ul className="space-y-3 text-sm text-forest-600">
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  Địa chỉ vườn sâm: Xã Trà Linh, Huyện Nam Trà My, Tỉnh Quảng Nam
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  Hotline/Zalo/WhatsApp: (+84) 984 999 309
                </li>
              </ul>
              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href="https://zalo.me/0984999309"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex"
                >
                  Đặt Lịch Thăm Vườn Qua Zalo
                </a>
                <a
                  href="https://wa.me/84984999309"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex"
                >
                  Liên Hệ Qua WhatsApp
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-forest-700 leading-relaxed text-lg">
            <p className="text-xl font-medium text-forest-900">Hello, I'm Khánh.</p>
            <p>
              If you're searching for Ngoc Linh Ginseng — Vietnam's national treasure — but
              overwhelmed by counterfeits and unclear paperwork, TA Ngoc Linh Ginseng was created
              to give you complete peace of mind.
            </p>
            <p>
              For more than 10 years, I've tended a single garden by hand in Tra Linh, Nam Tra My
              district, Quang Nam province, at over 1,800m elevation on the highest peak of the
              Ngoc Linh mountain range — growing ginseng naturally on mist, spring water, and
              primary-forest soil alone.
            </p>
            <p>
              TA serves you on two pillars of transparency: fresh roots harvested directly from our
              own garden (aged 6-10 years and up, nationally certified Saponin content, and open
              for visitors to see and harvest ginseng themselves), and strictly curated
              deep-processed products from Vietnam's most reputable GMP-certified brands, each with
              full quality certification and transparent invoicing.
            </p>
            <div className="bg-forest-950 rounded-2xl p-8 my-8">
              <p className="text-cream-100 italic">
                "Growing a ginseng root takes 6-10 years, but building a brand takes a lifetime."
              </p>
              <p className="text-gold-400 text-sm font-semibold mt-4">— Khánh, Founder</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-elegant border border-cream-200">
              <h3 className="font-display text-lg font-semibold text-forest-900 mb-4">Contact</h3>
              <p className="text-sm text-forest-600 mb-4">
                Garden address: Tra Linh Commune, Nam Tra My District, Quang Nam Province, Vietnam
                <br />
                Hotline/Zalo/WhatsApp: (+84) 984 999 309
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://zalo.me/0984999309" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
                  Book a Garden Visit via Zalo
                </a>
                <a href="https://wa.me/84984999309" target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex">
                  Contact via WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
