export type HealthGoal = 'energy' | 'stress' | 'immunity' | 'youth';
export type TargetAudience = 'men' | 'women' | 'seniors' | 'executives';

export interface Product {
  id: string;
  name: string;
  nameVi: string;
  category: string;
  healthGoal: HealthGoal;
  audiences: TargetAudience[];
  priceUSD: number;
  priceVND: number;
  priceJPY: number;
  priceCNY: number;
  priceEUR: number;
  activeIngredient: string;
  description: string;
  descriptionVi: string;
  image: string;
  badge: string;
  rating: number;
  reviews: number;
  subscriptionEligible?: boolean;
}

export const healthGoalLabels: Record<HealthGoal, { en: string; vi: string; icon: string }> = {
  energy:    { en: 'Energy & Vitality',             vi: 'Năng Lượng & Sức Sống',        icon: 'Zap'       },
  stress:    { en: 'Stress Relief & Mental Clarity', vi: 'Giảm Căng Thẳng & Tinh Thần',  icon: 'Brain'     },
  immunity:  { en: 'Immunity & Longevity',           vi: 'Miễn Dịch & Trường Thọ',       icon: 'ShieldPlus'},
  youth:     { en: 'Youth & Radiance',               vi: 'Tuổi Thanh Xuân & Rạng Rỡ',    icon: 'Sparkles'  },
};

export const audienceLabels: Record<TargetAudience, { en: string; vi: string }> = {
  men:        { en: 'Men',        vi: 'Nam'              },
  women:      { en: 'Women',      vi: 'Nữ'               },
  seniors:    { en: 'Seniors',    vi: 'Người Lớn Tuổi'   },
  executives: { en: 'Executives', vi: 'Doanh Nhân'       },
};

// Mảng dữ liệu sản phẩm mẫu (fake, ảnh Unsplash) trước đây đã bị xóa khỏi đây —
// toàn bộ sản phẩm hiển thị trên site giờ lấy từ src/data/vkdProducts.ts (dữ liệu
// thật, đồng bộ từ samngoclinhvkdgroup.com). Interface Product ở trên chỉ còn giữ
// lại để làm kiểu dữ liệu dùng chung cho giỏ hàng (xem CartContext.tsx + toCartProduct()).

export interface NewsArticle {
  id: string;
  title: string;
  titleVi: string;
  excerpt: string;
  excerptVi: string;
  category: string;
  categoryVi: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

// Tin tức thật, lấy nguyên gốc (tiêu đề/ngày đăng/ảnh đại diện) từ samngoclinhvkdgroup.com ngày 2026-07-18.
// Đã bỏ toàn bộ 6 bài tin cũ (giải thưởng/nghiên cứu/mở rộng thị trường bịa đặt, ảnh Unsplash không liên quan).
export const newsArticles: NewsArticle[] = [
  {
    id: 'news-001',
    title: 'VKD Group Honored with "Trusted Vietnamese Brand 2026" Award',
    titleVi: 'Sâm Ngọc Linh VKD Khẳng Định Vị Thế Với Danh Hiệu "Thương Hiệu Việt Nam Ưu Tiên Tin Dùng 2026"',
    excerpt: 'At a ceremony held on April 12, 2026 at the Army Theatre in Hanoi, VKD Group was named a "Trusted Vietnamese Brand" — recognition for a decade of pursuing transparent sourcing and standardized quality for Ngoc Linh ginseng.',
    excerptVi: 'Tại lễ công bố "Thương hiệu Việt Nam ưu tiên tin dùng" tổ chức ngày 12/04/2026 tại Nhà hát Quân đội, Hà Nội, Tập đoàn Y Dược Sâm Ngọc Linh Việt Nam (VKD Group) đã được xướng tên vinh danh — kết quả của hành trình minh bạch hóa nguồn gốc và chuẩn hóa chất lượng sản phẩm.',
    category: 'Awards',
    categoryVi: 'Giải Thưởng',
    date: '2026-04-13',
    readTime: '4 min',
    image: '/assets/news/news-thuong-hieu-tin-dung-2026.jpg',
    featured: true,
  },
  {
    id: 'news-002',
    title: 'VKD Group Officially Enters the Indonesian Market',
    titleVi: 'Sâm Ngọc Linh VKD Chính Thức "Tiến Quân" Sang Thị Trường Indonesia',
    excerpt: 'On January 29, 2026, VKD Group signed a commercial partnership agreement with Indonesian distributor P.T. Linkup Wang Ekonomi (LWE), marking Ngoc Linh ginseng\'s entry into Southeast Asia\'s largest herbal-beverage market.',
    excerptVi: 'Chiều 29/01/2026, Tập đoàn Y Dược Sâm Ngọc Linh VKD đã chính thức ký kết Hợp đồng thương mại với đối tác P.T Linkup Wang Ekonomi (LWE), đưa Sâm Ngọc Linh bước chân vào thị trường Indonesia gần 280 triệu dân.',
    category: 'Expansion',
    categoryVi: 'Mở Rộng',
    date: '2026-01-30',
    readTime: '5 min',
    image: '/assets/news/news-indonesia-2026.jpg',
    featured: true,
  },
  {
    id: 'news-003',
    title: 'VKD Group at CAEXPO 2025: Vietnamese Herbal Brand on the International Stage',
    titleVi: 'Sâm Ngọc Linh VKD Tại CAEXPO 2025: Khẳng Định Thương Hiệu Dược Liệu Việt Trên Trường Quốc Tế',
    excerpt: 'From September 17–21, 2025, VKD Group exhibited at the 22nd China-ASEAN Expo (CAEXPO) in Nanning, Guangxi — one of the region\'s largest trade fairs with over 3,200 exhibitors from 60 countries — showcasing Ngoc Linh ginseng to international partners.',
    excerptVi: 'Từ 17–21/9/2025, Hội chợ Trung Quốc – ASEAN (CAEXPO) lần thứ 22 tổ chức tại Nam Ninh, Quảng Tây quy tụ hơn 3.200 doanh nghiệp từ 60 quốc gia. VKD Group mang gian hàng trưng bày Sâm Ngọc Linh đến sự kiện, thu hút sự chú ý của đông đảo quan khách và đối tác quốc tế.',
    category: 'Trade Fair',
    categoryVi: 'Hội Chợ',
    date: '2025-09-23',
    readTime: '4 min',
    image: '/assets/news/news-caexpo-2025.jpg',
  },
  {
    id: 'news-004',
    title: 'VKD Products Presented at VUSTA\'s 40th Anniversary Ceremony',
    titleVi: 'Giới Thiệu Sản Phẩm Tại Lễ Kỷ Niệm 40 Năm Thành Lập VUSTA',
    excerpt: 'At the ceremony marking 60 years since President Ho Chi Minh\'s meeting with Vietnamese intellectuals and the 40th founding anniversary of VUSTA, the Vietnam Ngoc Linh Ginseng Institute and VKD Group introduced products extracted from Ngoc Linh ginseng — the result of nearly a decade of conservation and R&D.',
    excerptVi: 'Tại Lễ kỷ niệm 60 năm ngày Chủ tịch Hồ Chí Minh gặp gỡ đội ngũ trí thức và 40 năm ngày thành lập VUSTA (24/3), Viện Bảo tồn và Phát triển sâm Ngọc Linh Việt Nam cùng Tập đoàn Y Dược Sâm Ngọc Linh Việt Nam đã ra mắt các sản phẩm chiết xuất từ Sâm Ngọc Linh — thành quả gần 10 năm nghiên cứu, bảo tồn và phát triển.',
    category: 'Company',
    categoryVi: 'Nội Bộ',
    date: '2023-04-04',
    readTime: '4 min',
    image: '/assets/images/gian-hang.jpg',
  },
  {
    id: 'news-005',
    title: '1st Anniversary of the Southern Ha Tinh Entrepreneurs Club — VKD as Diamond Sponsor',
    titleVi: 'Kỷ Niệm 1 Năm Thành Lập CLB Doanh Nhân Hà Tĩnh Phía Nam — VKD Là Nhà Tài Trợ Kim Cương',
    excerpt: 'On May 13, 2023 in Ho Chi Minh City, the Southern Ha Tinh Entrepreneurs Club (HTEC) marked its first anniversary under the theme "Brand Positioning — Future Direction." VKD Group took part as Diamond Sponsor, and the two organizations signed a strategic cooperation agreement.',
    excerptVi: 'Chiều 13/5/2023 tại TP Hồ Chí Minh, Câu lạc bộ Doanh nhân Hà Tĩnh phía Nam (HTEC) tổ chức chương trình kỷ niệm 1 năm thành lập với chủ đề "Định vị thương hiệu – định hướng tương lai". Tập đoàn Y Dược Sâm Ngọc Linh Việt Nam vinh dự là nhà tài trợ Kim Cương và đã ký kết hợp đồng hợp tác chiến lược với CLB.',
    category: 'Company',
    categoryVi: 'Nội Bộ',
    date: '2023-05-13',
    readTime: '3 min',
    image: '/assets/news/news-htec-1nam.webp',
  },
];

export interface EducationGuide {
  id: string;
  title: string;
  titleVi: string;
  excerpt: string;
  excerptVi: string;
  category: string;
  readTime: string;
}

export const educationGuides: EducationGuide[] = [
  {
    id: 'guide-001',
    title: 'How to Distinguish Genuine Ngoc Linh Ginseng from Counterfeits',
    titleVi: 'Cách Phân Biệt Sâm Ngọc Linh Thật Và Hàng Giả',
    excerpt: 'Learn the 5 key visual markers — root ring patterns, skin texture, aroma profile, saponin crystal residue, and certification QR codes — that separate authentic Panax Vietnamensis from common counterfeits flooding the market.',
    excerptVi: '5 dấu hiệu nhận biết sâm thật: vân củ đặc trưng, bề mặt da sâm, hương thơm, tinh thể saponin, và mã QR chứng nhận nguồn gốc.',
    category: 'Authentication',
    readTime: '8 min',
  },
  {
    id: 'guide-002',
    title: 'Optimal Dosage Guide: Ngoc Linh Ginseng by Age and Health Goal',
    titleVi: 'Hướng Dẫn Liều Dùng: Sâm Ngọc Linh Theo Độ Tuổi Và Mục Tiêu',
    excerpt: 'A comprehensive clinical dosage chart covering daily intake for children, adults, seniors, and special populations, with specific guidance for energy, immunity, stress relief, and recovery goals.',
    excerptVi: 'Bảng liều dùng lâm sàng theo độ tuổi và mục tiêu sức khỏe, từ trẻ em đến người cao tuổi.',
    category: 'Dosage',
    readTime: '6 min',
  },
  {
    id: 'guide-003',
    title: 'The Art of Ginseng Infusion: Traditional and Modern Extraction Methods',
    titleVi: 'Nghệ Thuật Pha Sâm: Phương Pháp Truyền Thống Và Chiết Xuất Hiện Đại',
    excerpt: 'Explore three preparation techniques — slow clay-pot decoction, cold-brew steeping, and modern ultrasonic extraction — and how each method affects MR2 saponin bioavailability, flavor complexity, and therapeutic potency.',
    excerptVi: 'Ba phương pháp pha sâm: sắc chậm bằng ấm đất, ngâm lạnh, và chiết xuất siêu âm — ảnh hưởng đến sinh khả dụng MR2.',
    category: 'Preparation',
    readTime: '10 min',
  },
];

export interface SaponinComparison {
  saponin: string;
  ngocLinh: number;
  korean: number;
  benefit: string;
  benefitVi: string;
}

export const saponinComparison: SaponinComparison[] = [
  { saponin: 'Majonoside R2 (MR2)', ngocLinh: 100, korean: 0,  benefit: 'Unique to Ngoc Linh — anti-tumor, hepatoprotective', benefitVi: 'Độc quyền sâm Ngọc Linh — chống khối u, bảo vệ gan' },
  { saponin: 'Ginsenoside Rg1',     ngocLinh: 85,  korean: 70, benefit: 'Cognitive enhancement, anti-fatigue',                 benefitVi: 'Tăng nhận thức, chống mệt mỏi' },
  { saponin: 'Ginsenoside Rb1',     ngocLinh: 90,  korean: 75, benefit: 'Neuroprotection, anti-stress',                         benefitVi: 'Bảo vệ thần kinh, chống căng thẳng' },
  { saponin: 'Ginsenoside Rd',      ngocLinh: 78,  korean: 60, benefit: 'Anti-inflammatory, immunomodulatory',                  benefitVi: 'Kháng viêm, điều hòa miễn dịch' },
  { saponin: 'Ginsenoside Re',      ngocLinh: 82,  korean: 65, benefit: 'Antioxidant, cardioprotective',                        benefitVi: 'Chống oxy hóa, bảo vệ tim' },
  { saponin: 'Pseudoginsenoside F11',ngocLinh: 70, korean: 45, benefit: 'Anti-anxiety, memory support',                        benefitVi: 'Chống lo âu, hỗ trợ trí nhớ' },
  { saponin: 'Ginsenoside Rh4',     ngocLinh: 65,  korean: 30, benefit: 'Anti-aging, skin regeneration',                       benefitVi: 'Chống lão hóa, tái tạo da' },
  { saponin: 'Total Saponin Types', ngocLinh: 52,  korean: 38, benefit: 'Overall pharmacological diversity',                   benefitVi: 'Đa dạng dược lý tổng thể (số loại)' },
];

export interface LoyaltyTier {
  name: string;
  nameVi: string;
  minPoints: number;
  discount: number;
  color: string;
  perks: string[];
  perksVi: string[];
}

export const loyaltyTiers: LoyaltyTier[] = [
  {
    name: 'Standard',     nameVi: 'Tiêu Chuẩn',
    minPoints: 0,         discount: 3,
    color: 'from-cream-400 to-cream-500',
    perks: ['3% cashback on all orders','Free standard shipping on orders over $100','Birthday gift voucher'],
    perksVi: ['Hoàn 3% mọi đơn hàng','Miễn phí vận chuyển đơn trên 2.300.000đ','Voucher sinh nhật'],
  },
  {
    name: 'VIP',          nameVi: 'VIP',
    minPoints: 5000,      discount: 7,
    color: 'from-forest-500 to-forest-700',
    perks: ['7% cashback','Free express shipping globally','Priority product launches','Annual health consultation'],
    perksVi: ['Hoàn 7% mọi đơn hàng','Miễn phí vận chuyển nhanh toàn cầu','Ưu tiên ra mắt sản phẩm','Tư vấn sức khỏe thường niên'],
  },
  {
    name: 'VVIP Elite',   nameVi: 'VVIP Elite',
    minPoints: 20000,     discount: 12,
    color: 'from-gold-500 to-gold-700',
    perks: ['12% cashback','Dedicated VKD concierge','Private plantation tours (Kon Tum)','Exclusive limited-edition drops','Quarterly MR2 health screening'],
    perksVi: ['Hoàn 12% mọi đơn hàng','Quản lý VKD riêng','Tham quan vùng trồng độc quyền (Kon Tum)','Phiên bản giới hạn độc quyền','Kiểm tra sức khỏe MR2 hàng quý'],
  },
];
