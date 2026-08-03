export type HealthGoal = 'energy' | 'stress' | 'immunity' | 'youth';
export type TargetAudience = 'men' | 'women' | 'seniors' | 'executives' | 'family';

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
  familySafe?: boolean;
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
  family:     { en: 'Family',     vi: 'Gia Đình'         },
};

// Mảng dữ liệu sản phẩm mẫu (fake, ảnh Unsplash) trước đây đã bị xóa khỏi đây —
// toàn bộ sản phẩm hiển thị trên site giờ lấy từ src/data/vkdProducts.ts (dữ liệu
// thật, đồng bộ từ samngoclinhvkdgroup.com). Interface Product ở trên chỉ còn giữ
// lại để làm kiểu dữ liệu dùng chung cho giỏ hàng (xem CartContext.tsx + toCartProduct()).

// `NewsArticle`/`newsArticles` (5 bài tin về VKD Group — giải thưởng, CAEXPO,
// VUSTA, HTEC) đã bị xoá khỏi đây cùng `NewsFeed.tsx` (component không được
// render ở bất kỳ đâu trong App.tsx — code chết). Không đổi tên "VKD" thành
// "TA" trong các bài đó vì đây là sự kiện lịch sử THẬT của VKD Group — đổi tên
// sẽ tạo lịch sử giả cho TA. Nếu cần mục tin tức trên site, viết bài mới đúng
// sự kiện của TA, không tái dùng nội dung này.

export interface EducationGuide {
  id: string;
  title: string;
  titleVi: string;
  excerpt: string;
  excerptVi: string;
  category: string;
  readTime: string;
  image: string;
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
    image: '/assets/images/sam-ngoc-linh-plant.png',
  },
  {
    id: 'guide-002',
    title: 'Optimal Dosage Guide: Ngoc Linh Ginseng by Age and Health Goal',
    titleVi: 'Hướng Dẫn Liều Dùng: Sâm Ngọc Linh Theo Độ Tuổi Và Mục Tiêu',
    excerpt: 'A comprehensive clinical dosage chart covering daily intake for children, adults, seniors, and special populations, with specific guidance for energy, immunity, stress relief, and recovery goals.',
    excerptVi: 'Bảng liều dùng lâm sàng theo độ tuổi và mục tiêu sức khỏe, từ trẻ em đến người cao tuổi.',
    category: 'Dosage',
    readTime: '6 min',
    image: '/assets/images/product-1.jpg',
  },
  {
    id: 'guide-003',
    title: 'The Art of Ginseng Infusion: Traditional and Modern Extraction Methods',
    titleVi: 'Nghệ Thuật Pha Sâm: Phương Pháp Truyền Thống Và Chiết Xuất Hiện Đại',
    excerpt: 'Explore three preparation techniques — slow clay-pot decoction, cold-brew steeping, and modern ultrasonic extraction — and how each method affects MR2 saponin bioavailability, flavor complexity, and therapeutic potency.',
    excerptVi: 'Ba phương pháp pha sâm: sắc chậm bằng ấm đất, ngâm lạnh, và chiết xuất siêu âm — ảnh hưởng đến sinh khả dụng MR2.',
    category: 'Preparation',
    readTime: '10 min',
    image: '/assets/images/nature-forest.jpg',
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
    perks: ['12% cashback','Dedicated TA concierge','Private plantation tours (Kon Tum)','Exclusive limited-edition drops','Quarterly MR2 health screening'],
    perksVi: ['Hoàn 12% mọi đơn hàng','Quản lý TA riêng','Tham quan vùng trồng độc quyền (Kon Tum)','Phiên bản giới hạn độc quyền','Kiểm tra sức khỏe MR2 hàng quý'],
  },
];
