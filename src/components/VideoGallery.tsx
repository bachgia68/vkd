import { useEffect, useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { fetchFieldVideos, type FieldVideo } from '../lib/siteContentApi';
import SwipeCarousel, { CarouselImage } from './ui/SwipeCarousel';

export default function VideoGallery() {
  const [videos, setVideos] = useState<FieldVideo[]>([]);

  useEffect(() => {
    fetchFieldVideos()
      .then(setVideos)
      .catch(() => setVideos([]));
  }, []);

  if (videos.length === 0) return null;

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

        {/* Carousel */}
        <SwipeCarousel
          items={videos}
          getKey={(video) => video.id}
          slideWidthClassName="w-[240px] md:w-[300px]"
          ariaLabelPrev="Video trước"
          ariaLabelNext="Video sau"
          renderSlide={(video, isActive) => (
            <a
              href={video.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative block rounded-2xl overflow-hidden transition-all duration-500 ease-out ${
                isActive ? 'scale-105 shadow-elegant-lg opacity-100' : 'scale-95 opacity-70'
              }`}
            >
              <div className="aspect-[9/16] relative overflow-hidden">
                <CarouselImage
                  src={video.thumbnail_url}
                  alt={video.title}
                  fit="cover"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/30 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 transition-all group-hover:bg-gold-400/80 group-hover:scale-110">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                </div>

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-forest-900/70 backdrop-blur-sm flex items-center justify-center">
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-sm font-semibold text-white leading-snug mb-1 line-clamp-2">
                    {video.title}
                  </h3>
                  {video.subtitle && (
                    <p className="text-forest-300 text-xs line-clamp-1">{video.subtitle}</p>
                  )}
                </div>
              </div>
            </a>
          )}
        />
      </div>
    </section>
  );
}
