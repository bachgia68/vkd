import { useState } from 'react';
import { Download, BookOpen, Microscope, Beaker, Clock, ChevronRight } from 'lucide-react';
import { researchStudies, educationGuides, saponinComparison } from '../data/mockData';
import type { Language } from '../i18n/translations';


interface ResearchHubProps {
  lang: Language;
}

type Tab = 'saponin' | 'studies' | 'guides';

export default function ResearchHub({ lang }: ResearchHubProps) {
  const isVi = lang === 'vi';
  const isRTL = lang === 'ar';
  const [activeTab, setActiveTab] = useState<Tab>('saponin');

  const tabs: { key: Tab; label: string; labelVi: string; icon: typeof Microscope }[] = [
    { key: 'saponin', labelVi: 'Ma Trận Saponin', label: 'Saponin Matrix', icon: Microscope },
    { key: 'studies', labelVi: 'Nghiên Cứu Lâm Sàng', label: 'Clinical Studies', icon: Beaker },
    { key: 'guides', labelVi: 'Hướng Dẫn Sử Dụng', label: 'Education Guides', icon: BookOpen },
  ];

  return (
    <section id="research" className="section-padding bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-100 rounded-full mb-6">
            <span className="w-2 h-2 bg-gold-400 rounded-full" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gold-700">
              {isVi ? 'Trung Tâm Nghiên Cứu' : 'Research Hub'}
            </span>
          </div>
          <h2 className="font-display text-display-sm md:text-display-md text-forest-900 mb-4">
            {isVi
              ? 'Trung Tâm Nghiên Cứu Lâm Sàng & Y Khoa Sâm Ngọc Linh'
              : 'Ngoc Linh Ginseng Clinical & Medical Research Hub'}
          </h2>
          <p className="text-forest-600 text-lg leading-relaxed">
            {isVi
              ? 'Cơ sở dữ liệu khoa học được duy trì bởi VKD Medical Board — hội đồng y khoa hàng đầu Việt Nam về Sâm Ngọc Linh.'
              : 'A scientific database maintained by the VKD Medical Board — Vietnam\u2019s leading medical authority on Ngoc Linh Ginseng.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-forest-900 text-cream-50 shadow-elegant'
                    : 'bg-cream-100 text-forest-600 hover:bg-forest-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {isVi ? tab.labelVi : tab.label}
              </button>
            );
          })}
        </div>

        {/* Saponin Matrix Tab */}
        {activeTab === 'saponin' && (
          <div className="animate-fade-in">
            <div className="bg-gradient-to-br from-forest-950 to-forest-800 rounded-3xl p-8 md:p-12 mb-8">
              <div className="grid md:grid-cols-2 gap-8 items-center mb-10">
                <div>
                  <h3 className="font-display text-2xl text-white mb-4">
                    {isVi
                      ? 'Majonoside R2 (MR2) — Hợp Chất Độc Quyền'
                      : 'Majonoside R2 (MR2) — The Exclusive Compound'}
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-4">
                    {isVi
                      ? 'MR2 là saponin dammarane-type duy nhất chỉ tìm thấy trong Sâm Ngọc Linh (Panax Vietnamensis), không có trong bất kỳ loài sâm nào khác trên thế giới. Nghiên cứu cho thấy MR2 có hoạt tính chống khối u, bảo vệ gan, và chống oxy hóa vượt trội.'
                      : 'MR2 is a dammarane-type saponin found exclusively in Ngoc Linh Ginseng (Panax Vietnamensis) — absent from all other ginseng species worldwide. Research shows MR2 exhibits superior anti-tumor, hepatoprotective, and antioxidant activities.'}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1.5 rounded-full bg-gold-400/20 text-gold-300 text-xs font-medium border border-gold-400/30">
                      Anti-tumor
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-forest-400/20 text-forest-200 text-xs font-medium border border-forest-400/30">
                      Hepatoprotective
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-forest-400/20 text-forest-200 text-xs font-medium border border-forest-400/30">
                      Antioxidant
                    </span>
                  </div>
                </div>

                {/* MR2 molecule visual */}
                <div className="flex justify-center">
                  <svg viewBox="0 0 200 200" className="w-48 h-48 md:w-64 md:h-64">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.2" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.3" />
                    <circle cx="100" cy="100" r="50" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
                    {Array.from({ length: 8 }).map((_, i) => {
                      const angle = (i / 8) * Math.PI * 2;
                      const r = 70;
                      return (
                        <circle
                          key={i}
                          cx={100 + Math.cos(angle) * r}
                          cy={100 + Math.sin(angle) * r}
                          r="5"
                          fill="#D4AF37"
                          opacity="0.7"
                          className="animate-pulse-slow"
                          style={{ animationDelay: `${i * 300}ms` }}
                        />
                      );
                    })}
                    <circle cx="100" cy="100" r="14" fill="#D4AF37" />
                    <circle cx="100" cy="100" r="7" fill="#0B2F1D" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Comparison Chart */}
            <div className="bg-cream-50 rounded-2xl p-6 md:p-8 overflow-x-auto">
              <h3 className="font-display text-xl font-semibold text-forest-900 mb-2">
                {isVi ? 'So Sánh Saponin: Sâm Ngọc Linh vs Sâm Đỏ Hàn Quốc' : 'Saponin Comparison: Ngoc Linh vs Korean Red Ginseng'}
              </h3>
              <p className="text-forest-500 text-sm mb-6">
                {isVi
                  ? 'Hàm lượng tương đối saponin (% so với mức cao nhất đo được)'
                  : 'Relative saponin content (% of highest measured level)'}
              </p>

              <div className="space-y-4">
                {saponinComparison.map((row, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-2 md:gap-4 items-center">
                    {/* Label */}
                    <div>
                      <div className="text-sm font-semibold text-forest-800">{row.saponin}</div>
                      <div className="text-xs text-forest-400 mt-0.5">
                        {isVi ? row.benefitVi : row.benefit}
                      </div>
                    </div>

                    {/* Ngoc Linh bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-forest-600 w-20 flex-shrink-0">
                        {isVi ? 'Ngọc Linh' : 'Ngoc Linh'}
                      </span>
                      <div className="flex-1 bg-cream-200 rounded-full h-6 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-forest-700 to-forest-500 rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                          style={{ width: `${row.ngocLinh}%` }}
                        >
                          <span className="text-xs font-bold text-cream-50">{row.ngocLinh}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Korean bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-forest-400 w-20 flex-shrink-0">
                        {isVi ? 'Hàn Quốc' : 'Korean'}
                      </span>
                      <div className="flex-1 bg-cream-200 rounded-full h-6 overflow-hidden">
                        <div
                          className={`h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700 ${
                            row.korean === 0
                              ? 'bg-red-300'
                              : 'bg-gradient-to-r from-cream-500 to-cream-400'
                          }`}
                          style={{ width: `${Math.max(row.korean, 3)}%` }}
                        >
                          <span className="text-xs font-bold text-forest-900">
                            {row.korean === 0 ? '0%' : `${row.korean}%`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-cream-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-forest-600"></div>
                  <span className="text-sm text-forest-600">
                    {isVi ? 'Sâm Ngọc Linh (Panax Vietnamensis)' : 'Ngoc Linh Ginseng (Panax Vietnamensis)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-cream-400"></div>
                  <span className="text-sm text-forest-600">
                    {isVi ? 'Sâm Đỏ Hàn Quốc' : 'Korean Red Ginseng'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Studies Tab */}
        {activeTab === 'studies' && (
          <div className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              {researchStudies.map((study) => (
                <div
                  key={study.id}
                  className="bg-cream-50 rounded-2xl p-6 shadow-elegant hover:shadow-elegant-lg transition-all duration-500 group"
                >
                  {/* Category badge + Date */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-forest-100 text-forest-700 text-xs font-semibold">
                      {study.category}
                    </span>
                    <span className="text-xs text-forest-400">{study.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-semibold text-forest-900 mb-3 leading-tight">
                    {isVi ? study.titleVi : study.title}
                  </h3>

                  {/* Abstract */}
                  <p className="text-forest-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {isVi ? study.abstractVi : study.abstract}
                  </p>

                  {/* Author badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center">
                      <Microscope className="w-4 h-4 text-forest-600" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-forest-700">{study.authors}</div>
                      <div className="text-xs text-forest-400">{study.journal}</div>
                    </div>
                  </div>

                  {/* Download button */}
                  <button className="inline-flex items-center gap-2 text-sm font-medium text-forest-600 hover:text-gold-600 transition-colors group/btn">
                    <Download className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    {isVi ? 'Tải PDF' : 'Download PDF'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Guides Tab */}
        {activeTab === 'guides' && (
          <div className="animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6">
              {educationGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-cream-50 rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-500 group cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={guide.image}
                      alt={`VKD Group Education Guide: ${isVi ? guide.titleVi : guide.title}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-gold-400 text-forest-900 text-xs font-semibold">
                        {guide.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-3.5 h-3.5 text-forest-400" />
                      <span className="text-xs text-forest-400">{guide.readTime}</span>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-forest-900 mb-3 leading-tight">
                      {isVi ? guide.titleVi : guide.title}
                    </h3>

                    <p className="text-forest-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {isVi ? guide.excerptVi : guide.excerpt}
                    </p>

                    <div className="flex items-center gap-1 text-sm font-medium text-forest-600 group-hover:text-gold-600 transition-colors">
                      {isVi ? 'Đọc Tiếp' : 'Read More'}
                      <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
