import { useState } from 'react';
import { Play, X } from 'lucide-react';

// Mỗi video: poster từ /assets/images/, url là YouTube embed (để trống nếu chưa có)
const VIDEOS = [
  {
    id: 'hanh-trinh',
    title: 'Hành Trình Gieo Trồng Sâm Ngọc Linh',
    subtitle: 'Câu chuyện của Khánh và vườn sâm tại Trà Linh',
    poster: '/assets/images/video-poster-hanh-trinh.jpg',
    youtubeId: '',
  },
  {
    id: 'vuon-nha-khanh',
    title: 'Vườn Nhà Khánh — Nơi Sâm Lớn Dưới Tán Rừng Già',
    subtitle: 'Thực địa tại xã Trà Linh, Nam Trà My, Quảng Nam',
    poster: '/assets/images/video-poster-vuon-nha-khanh.jpg',
    youtubeId: '',
  },
  {
    id: 'vung-trong',
    title: 'Vùng Trồng Sâm Ngọc Linh TA',
    subtitle: 'Điều kiện tự nhiên độc đáo tạo nên dược tính đỉnh cao',
    poster: '/assets/images/video-poster-vung-trong.jpg',
    youtubeId: '',
  },
  {
    id: 'chuan-goc',
    title: 'Chuẩn Gốc — Kiểm Định & Bảo Chứng Chất Lượng',
    subtitle: 'Hàm lượng MR2 được kiểm định toàn quốc',
    poster: '/assets/images/video-poster-chuan-goc.jpg',
    youtubeId: '',
  },
];

export default function VideoGallery() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = VIDEOS.find((v) => v.id === activeId);

  return (
    <section id="video-gallery" className="section-padding bg-forest-950">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-800 rounded-full mb-4">
            <Play className="w-3 h-3 text-gold-400 fill-gold-400" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold-300">Câu Chuyện Thực Địa</span>
          </div>
          <h2 className="font-display text-display-sm md:text-display-md text-white mb-4">
            Nhìn Tận Mắt — Tin Tận Tâm
          </h2>
          <p className="text-forest-300 text-base leading-relaxed">
            Từng thước phim quay thẳng tại vườn sâm nhà Khánh, Trà Linh — không dàn dựng, không chỉnh sửa.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VIDEOS.map((v) => (
            <button
              key={v.id}
              onClick={() => v.youtubeId ? setActiveId(v.id) : undefined}
              className="group relative rounded-2xl overflow-hidden text-left focus:outline-none"
              style={{ cursor: v.youtubeId ? 'pointer' : 'default' }}
            >
              <div className="aspect-[9/16] sm:aspect-[3/4] relative overflow-hidden">
                <img
                  src={v.poster}
                  alt={v.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/30 to-transparent" />

                {/* Play button */}
                {v.youtubeId ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 transition-all group-hover:bg-gold-400/80 group-hover:scale-110">
                      <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-forest-900/80 backdrop-blur-sm rounded-full">
                    <span className="text-xs text-forest-300 font-medium">Sắp ra mắt</span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-sm font-semibold text-white leading-snug mb-1 line-clamp-2">
                    {v.title}
                  </h3>
                  <p className="text-forest-300 text-xs line-clamp-1">{v.subtitle}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox — chỉ hiện khi có youtubeId */}
      {active && active.youtubeId && (
        <div
          className="fixed inset-0 z-50 bg-forest-950/95 flex items-center justify-center p-4"
          onClick={() => setActiveId(null)}
        >
          <button
            onClick={() => setActiveId(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1&rel=0`}
              title={active.title}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
