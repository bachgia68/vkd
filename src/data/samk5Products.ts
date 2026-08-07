// Dữ liệu sản phẩm thật NCC thứ ba (samk5.vn — Sâm Ngọc Linh K5, Công ty TNHH MTV
// Đầu Tư Phát Triển Du Lịch Xơ Đăng, Kon Tum) — đồng bộ từ samk5.vn ngày 2026-08-07.
// Cùng nguyên tắc Branded House với VKD Group/TRIMICO: chỉ dữ liệu thật, không bịa
// rating/reviews (số sao/lượt bán trên site gốc không mang qua, đúng quy tắc đã áp
// dụng cho VKD/TRIMICO). Tên hiển thị khách hàng KHÔNG được chứa "K5" hay tên công
// ty gốc — xem BANNED_PATTERNS mới thêm trong scripts/check-no-supplier-names.js.
//
// Lệch giá giữa trang danh mục và trang chi tiết sản phẩm trên samk5.vn (site gốc
// có bug/không nhất quán giữa 2 trang cho cùng 1 sản phẩm — ví dụ "Tổ Yến 100ml —
// 5 Hủ/Hộp" trang danh mục ghi 525.000đ nhưng trang chi tiết mặc định hiển thị
// 288.000đ, khả năng do biến thể đóng gói khác nhau chưa rõ):
//   - SK5-004 (Tổ Yến 100ml-5 hủ): dùng giá trang DANH MỤC 525.000đ (khớp tên "5
//     hủ/hộp" đầy đủ trong tên sản phẩm hơn giá trang chi tiết).
//   - SK5-005 (Tổ Yến Kids): dùng giá trang DANH MỤC 225.000đ (trang chi tiết ghi
//     45.000đ, nhiều khả năng là giá 1 hũ lẻ chứ không phải "lốc 5 hũ" như mô tả).
//   Joe nên xác nhận lại 2 giá này với samk5.vn trước khi coi là chính thức.

import type { HealthGoal, TargetAudience } from './mockData';

export type Samk5CategoryId = 'nuoc-giai-khat' | 'sam-yen';

export interface Samk5Category {
  id: Samk5CategoryId;
  label: string;
  desc: string;
}

export const samk5Categories: Samk5Category[] = [
  { id: 'nuoc-giai-khat', label: 'Nước Giải Khát Sâm Ngọc Linh', desc: 'Nước uống dưỡng da, nước tăng lực, nước bù khoáng chiết xuất sâm' },
  { id: 'sam-yen', label: 'Sâm Yến', desc: 'Tổ yến chưng kết hợp Sâm Ngọc Linh — bồi bổ, tăng đề kháng' },
];

export interface Samk5Product {
  sku: string;
  slug: string;
  name: string;
  price: number; // VND
  image: string;
  category: Samk5CategoryId;
  description: string;
  ingredients?: string;
  usage?: string;
  volume?: string;
  healthGoal: HealthGoal;
  audiences: TargetAudience[];
  familySafe: boolean;
  sourceUrl: string;
}

const IMG = '/products/samk5/';
const SRC = 'https://samk5.vn/san-pham/';

export const samk5Products: Samk5Product[] = [
  {
    sku: 'SK5-001',
    slug: 'nuoc-uong-duong-da-sam-ngoc-linh-collagen-noliko',
    name: 'Nước Uống Dưỡng Da Sâm Ngọc Linh Collagen Noliko',
    price: 20000,
    image: `${IMG}01-nuoc-uong-duong-da-collagen.png`,
    category: 'nuoc-giai-khat',
    description: 'Bổ sung collagen giúp da sáng đẹp, ngăn ngừa lão hoá, cung cấp vitamin cần thiết tốt cho sức khoẻ.',
    volume: '240ml/lon',
    healthGoal: 'youth',
    audiences: ['women', 'seniors'],
    familySafe: true,
    sourceUrl: `${SRC}thuc-pham-bo-sung-nuoc-uong-duong-da-sam-ngoc-linh-collagen-noliko-240mllon`,
  },
  {
    sku: 'SK5-002',
    slug: 'nuoc-tang-luc-sam-ngoc-linh-dau-tay-do',
    name: 'Nước Tăng Lực Sâm Ngọc Linh Dâu Tây Đỏ',
    price: 252000,
    image: `${IMG}02-nuoc-tang-luc-dau-tay-do.png`,
    category: 'nuoc-giai-khat',
    description: 'Nước giải khát bổ sung dâu tây đỏ và chiết xuất Sâm Ngọc Linh, hương thơm dịu ngọt, vị gas nhẹ, mang đến thức uống giàu năng lượng.',
    ingredients: 'Nước bão hòa CO2, đường mía, Dextrose, Taurine, nước ép dâu tây đỏ (1,5g/l), Caffein, cao Sâm Ngọc Linh (40mg/l), Vitamin B3, B5, B6, Kẽm.',
    usage: 'Lắc đều trước khi dùng. Ngon hơn khi uống lạnh.',
    volume: 'Lon 320ml',
    healthGoal: 'energy',
    audiences: ['men', 'executives'],
    familySafe: false,
    sourceUrl: `${SRC}thuc-pham-bo-sung-nuoc-tang-luc-sam-ngoc-linh-k5-dau-tay-do`,
  },
  {
    sku: 'SK5-003',
    slug: 'chanh-khoang-sam-ngoc-linh',
    name: 'Chanh Khoáng Sâm Ngọc Linh',
    price: 252000,
    image: `${IMG}03-chanh-khoang.png`,
    category: 'nuoc-giai-khat',
    description: 'Kết hợp vị chanh tươi mát cùng tinh chất Sâm Ngọc Linh và khoáng chất — giải nhiệt, bù nước, bù khoáng, tăng cường sức khỏe.',
    healthGoal: 'energy',
    audiences: ['men', 'women', 'executives'],
    familySafe: true,
    sourceUrl: `${SRC}thuc-pham-bo-sung-k5-chanh-khoang-sam-ngoc-linh`,
  },
  {
    sku: 'SK5-004',
    slug: 'to-yen-sam-ngoc-linh-100ml-5-hu-hop',
    name: 'Tổ Yến Sâm Ngọc Linh 100ml – 5 Hủ/Hộp',
    price: 525000,
    image: `${IMG}04-to-yen-sam-100ml-5hu.png`,
    category: 'sam-yen',
    description: 'Tổ Yến Sâm Ngọc Linh tinh chế từ cây Sâm Ngọc Linh trên 10 năm tuổi trồng tự nhiên, kết hợp Tổ Yến tươi nuôi tự nhiên tại Việt Nam.',
    ingredients: 'Nước, đường phèn, Tổ Yến chưng (10%), Cao Sâm Ngọc Linh (125mg/l), Canxi lactate, chất ổn định, chất bảo quản, hương tổng hợp yến sâm.',
    usage: 'Dùng 1 chai/ngày. Dùng trực tiếp, lắc nhẹ trước khi dùng, ngon hơn khi uống lạnh.',
    volume: 'Hộp 5 chai 100ml',
    healthGoal: 'immunity',
    audiences: ['seniors', 'women', 'men'],
    familySafe: true,
    sourceUrl: `${SRC}to-yen-sam-ngoc-linh-100ml-5-huhop`,
  },
  {
    sku: 'SK5-005',
    slug: 'to-yen-sam-ngoc-linh-kids',
    name: 'Tổ Yến Sâm Ngọc Linh Kids',
    price: 225000,
    image: `${IMG}05-to-yen-sam-kids.png`,
    category: 'sam-yen',
    description: 'Tổ Yến Sâm Ngọc Linh đặc chế dành riêng cho trẻ em, kết hợp Tổ Yến nguyên chất, DHA, Omega, Taurine và các dưỡng chất hỗ trợ phát triển toàn diện.',
    ingredients: 'Nước, đường phèn, Tổ Yến chưng (10%), Cao Sâm Ngọc Linh (0,25g/l), chất xơ, Lysine, Taurine, Omega 3-6, DHA, Kẽm Gluconate, Vitamin D3.',
    usage: 'Lắc nhẹ trước khi dùng, dùng ngay sau khi mở nắp, ngon hơn khi ướp lạnh.',
    volume: 'Lốc 5 hũ 100ml',
    healthGoal: 'immunity',
    audiences: ['family'],
    familySafe: true,
    sourceUrl: `${SRC}to-yen-sam-ngoc-linh-k5-kids`,
  },
  {
    sku: 'SK5-006',
    slug: 'collagen-sam-ngoc-linh-to-yen-noliko-plus',
    name: 'Collagen Sâm Ngọc Linh Tổ Yến Noliko+',
    price: 500000,
    image: `${IMG}06-collagen-to-yen-noliko-plus.png`,
    category: 'sam-yen',
    description: 'Kết hợp Sâm Ngọc Linh, Đông Trùng Hạ Thảo, Đương Quy, Tổ Yến tươi cùng collagen và vitamin C/B3/B5/B6 — hỗ trợ làn da tươi trẻ, mịn màng.',
    ingredients: 'Nước, đường Isomalt, Tổ Yến (8%), Collagen Peptide (2400-2800mg), chiết xuất táo, chiết xuất Sâm Ngọc Linh (2%), chiết xuất Đông Trùng Hạ Thảo, chiết xuất Đương Quy, vitamin C/B3/B5/B6.',
    usage: 'Lắc nhẹ trước khi dùng, uống 1 chai/ngày, dùng liên tục tối thiểu 1 tháng để đạt hiệu quả.',
    volume: 'Hộp',
    healthGoal: 'youth',
    audiences: ['women'],
    familySafe: true,
    sourceUrl: `${SRC}tpbs-collagen-sam-ngoc-linh-to-yen-noliko`,
  },
];
