import { useEffect, useState } from 'react';
import { FlaskConical, Building2, Microscope, Sparkles, ShieldPlus, Check, X, MapPin, type LucideIcon } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { fetchHeritageGalleryImages, fetchPageSections, type HeritageGalleryImage, type PageSection } from '../lib/siteContentApi';
import { usePageSection } from '../lib/usePageSection';
import SwipeCarousel, { CarouselImage } from './ui/SwipeCarousel';
import Reveal from './ui/Reveal';

const PILLAR_ICONS: Record<string, LucideIcon> = { Building2, Microscope, FlaskConical, Sparkles, ShieldPlus };

interface HeritageProps {
  lang: Language;
}

export default function Heritage({ lang }: HeritageProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';
  const cms = usePageSection('home', 'heritage');
  const [galleryImages, setGalleryImages] = useState<HeritageGalleryImage[]>([]);
  const [pillarSections, setPillarSections] = useState<PageSection[]>([]);

  useEffect(() => {
    fetchHeritageGalleryImages()
      .then(setGalleryImages)
      .catch(() => setGalleryImages([]));
  }, []);

  useEffect(() => {
    fetchPageSections('home')
      .then((rows) => setPillarSections(rows.filter((r) => r.block_type === 'pillar' && r.visible)))
      .catch(() => setPillarSections([]));
  }, []);

  // Truong hop chua migrate xong / loi mang: fallback ve 3 tru cot cu trong
  // translations.ts thay vi de trong trang — pillarSections rong CHI xay ra
  // khi fetch that bai, khong phai trang thai binh thuong (da seed 3 row that).
  const pillars =
    lang === 'vi' && pillarSections.length > 0
      ? pillarSections.map((s) => ({
          icon: PILLAR_ICONS[s.icon_key ?? ''] ?? Sparkles,
          title: s.title_vi ?? '',
          desc: s.content_vi ?? '',
        }))
      : [
          { icon: Building2, title: t.heritage.scaleTitle, desc: t.heritage.scaleDesc },
          { icon: Microscope, title: t.heritage.authorityTitle, desc: t.heritage.authorityDesc },
          { icon: FlaskConical, title: t.heritage.saponinTitle, desc: t.heritage.saponinDesc },
        ];

  if (cms?.visible === false) return null;

  return (
    <section id="heritage" className="section-padding bg-cream-100" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-100 rounded-full mb-6">
            <span className="w-2 h-2 bg-gold-400 rounded-full" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold-700">
              {t.heritage.label}
            </span>
          </div>
          <h2 className="font-display text-display-sm md:text-display-md text-forest-900 mb-6">
            {(lang === 'vi' ? cms?.title_vi : undefined) || t.heritage.title}
          </h2>
          <p className="text-forest-600 text-lg leading-relaxed">
            {(lang === 'vi' ? cms?.content_vi : undefined) || t.heritage.subtitle}
          </p>
          {lang === 'vi' && cms?.cta_text && cms?.cta_url && (
            <a href={cms.cta_url} target={cms.cta_url.startsWith('http') ? '_blank' : undefined} rel={cms.cta_url.startsWith('http') ? 'noopener noreferrer' : undefined} className="btn-gold inline-flex mt-6">
              {cms.cta_text}
            </a>
          )}
        </div>

        {/* Bảng so sánh Majonoside-R2 — thay cho khối chỉ lặp lại số "52+" đã
            có ở Hero (không mang thêm thông tin gì). MR2 là luận điểm khoa
            học khác biệt mạnh nhất của Sâm Ngọc Linh — không loài sâm nào
            khác trên thế giới có, nên đây là nơi đúng để chứng minh bằng
            dữ liệu so sánh thay vì lặp một con số suông. */}
        <div className="relative mb-16 overflow-hidden rounded-3xl">
          <img
            src="/assets/images/cusam.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/85 to-forest-950/50" />

          <div className="relative z-10 px-6 md:px-14 py-10 md:py-14">
            <span className="text-gold-400 text-sm font-semibold tracking-wider uppercase mb-3 block">
              {t.heritage.saponinTypes}
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-white leading-snug mb-8 max-w-2xl">
              {lang === 'vi'
                ? 'Majonoside-R2 — hoạt chất chỉ Sâm Ngọc Linh Việt Nam mới có'
                : 'Majonoside-R2 — the compound only Vietnamese Ngoc Linh ginseng has'}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                {
                  name: lang === 'vi' ? 'Sâm Ngọc Linh (TA)' : 'Ngoc Linh Ginseng (TA)',
                  latin: 'Panax vietnamensis',
                  has: true,
                  note: lang === 'vi' ? '~50% tổng saponin' : '~50% of total saponins',
                },
                {
                  name: lang === 'vi' ? 'Sâm Hàn Quốc' : 'Korean Ginseng',
                  latin: 'Panax ginseng',
                  has: false,
                  note: lang === 'vi' ? 'Không có MR2' : 'No MR2',
                },
                {
                  name: lang === 'vi' ? 'Sâm Hoa Kỳ' : 'American Ginseng',
                  latin: 'Panax quinquefolium',
                  has: false,
                  note: lang === 'vi' ? 'Không có MR2' : 'No MR2',
                },
                {
                  name: lang === 'vi' ? 'Tam Thất' : 'Notoginseng',
                  latin: 'Panax notoginseng',
                  has: false,
                  note: lang === 'vi' ? 'Không có MR2' : 'No MR2',
                },
              ].map((row) => (
                <div
                  key={row.name}
                  className={`rounded-2xl p-4 md:p-5 border ${
                    row.has ? 'bg-gold-400/15 border-gold-400/40' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${
                      row.has ? 'bg-gold-400 text-forest-900' : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {row.has ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                  <p className={`text-sm font-semibold leading-tight mb-0.5 ${row.has ? 'text-white' : 'text-white/70'}`}>
                    {row.name}
                  </p>
                  <p className="text-white/40 text-xs italic mb-2">{row.latin}</p>
                  <p className={`text-xs ${row.has ? 'text-gold-300' : 'text-white/40'}`}>{row.note}</p>
                </div>
              ))}
            </div>

            <p className="text-white/50 text-xs mt-6 max-w-2xl">
              {lang === 'vi'
                ? 'Majonoside-R2 (MR2) là saponin khung ocotillol đặc hữu, được dùng làm chỉ dấu định danh Sâm Ngọc Linh trong Dược điển Việt Nam IV.'
                : 'Majonoside-R2 (MR2) is an endemic ocotillol-type saponin used as the identity marker for Ngoc Linh ginseng in Vietnamese Pharmacopoeia IV.'}
            </p>
          </div>
        </div>

        {/* Photo gallery */}
        {galleryImages.length > 0 && (
          <div className="mb-16">
            <h3 className="font-display text-2xl md:text-3xl text-forest-900 mb-6 text-center">
              {t.heritage.galleryLabel}
            </h3>

            <SwipeCarousel
              items={galleryImages}
              getKey={(photo) => photo.id}
              ariaLabelPrev={lang === 'vi' ? 'Ảnh trước' : 'Previous image'}
              ariaLabelNext={lang === 'vi' ? 'Ảnh sau' : 'Next image'}
              renderSlide={(photo, isActive) => {
                const caption = lang === 'vi' ? photo.alt_vi : photo.alt_en;
                const capturedDate = photo.captured_date
                  ? new Date(photo.captured_date).toLocaleDateString('vi-VN')
                  : null;
                return (
                  <>
                    <div
                      className={`aspect-square overflow-hidden rounded-2xl transition-all duration-500 ease-out ${
                        isActive ? 'scale-105 shadow-elegant-lg opacity-100' : 'scale-95 opacity-70'
                      }`}
                    >
                      <CarouselImage src={photo.image_url} alt={caption || photo.alt_vi} fit="cover" />
                    </div>
                    {(photo.location || capturedDate) && (
                      <div className="flex items-center gap-3 mt-2 px-1 text-xs text-forest-500">
                        {photo.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {photo.location}
                          </span>
                        )}
                        {capturedDate && <span>{capturedDate}</span>}
                      </div>
                    )}
                  </>
                );
              }}
            />
          </div>
        )}

        {/* Pillars grid — so luong co the thay doi (them/xoa qua admin) nen
            dung breakpoint linh hoat thay vi co dinh 3 cot */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isGold = index % 2 === 1;

            return (
              <Reveal key={index} delayMs={index * 120}>
                <div className="group bg-white rounded-2xl p-8 shadow-elegant hover:shadow-elegant-lg transition-all duration-500 hover:-translate-y-1">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${
                      isGold ? 'bg-gold-100' : 'bg-forest-100'
                    }`}
                  >
                    <Icon className={`w-7 h-7 ${isGold ? 'text-gold-600' : 'text-forest-700'}`} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-forest-900 mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-forest-600 leading-relaxed text-sm">
                    {pillar.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
