export const ADMIN_IMAGES = {
  loginHero: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=1400&q=80&auto=format&fit=crop',
  cmsHero: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80&auto=format&fit=crop',
  crmHero: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=1400&q=80&auto=format&fit=crop',
  warehouseHero: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1400&q=80&auto=format&fit=crop',
  growingRegion: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=80&auto=format&fit=crop',
};

export interface Warehouse {
  code: string;
  name: string;
  type: 'central' | 'showroom';
  province: string;
  lat: number;
  lng: number;
}

export const WAREHOUSES: Warehouse[] = [
  { code: 'KHO-TMR', name: 'Kho trung tâm Tu Mơ Rông', type: 'central', province: 'Kon Tum', lat: 14.99, lng: 107.94 },
  { code: 'KHO-DN', name: 'Kho trung tâm Đà Nẵng', type: 'central', province: 'Đà Nẵng', lat: 16.05, lng: 108.2 },
  { code: 'SR-DN', name: 'Showroom Võ Kim Đường - Đà Nẵng', type: 'showroom', province: 'Đà Nẵng', lat: 16.07, lng: 108.22 },
  { code: 'SR-HN', name: 'Showroom VKD - Hà Nội', type: 'showroom', province: 'Hà Nội', lat: 21.03, lng: 105.85 },
  { code: 'SR-HCM', name: 'Showroom VKD - TP.HCM', type: 'showroom', province: 'TP.HCM', lat: 10.78, lng: 106.7 },
];

export interface InventoryRow {
  sku: string;
  name: string;
  threshold: number;
  stock: Record<string, number>; // warehouse code -> qty
}

export const INVENTORY: InventoryRow[] = [
  { sku: 'VKD-SP1', name: 'Sâm tươi Thượng Hạng (10 năm)', threshold: 5, stock: { 'KHO-TMR': 14, 'KHO-DN': 22, 'SR-DN': 4, 'SR-HN': 6, 'SR-HCM': 9 } },
  { sku: 'VKD-SP2', name: 'Sâm tươi 7 năm tuổi', threshold: 5, stock: { 'KHO-TMR': 30, 'KHO-DN': 41, 'SR-DN': 8, 'SR-HN': 3, 'SR-HCM': 11 } },
  { sku: 'VKD-TR3', name: 'Trà túi lọc hồng sâm', threshold: 20, stock: { 'KHO-TMR': 120, 'KHO-DN': 210, 'SR-DN': 44, 'SR-HN': 38, 'SR-HCM': 52 } },
  { sku: 'VKD-ML4', name: 'Mật ong ngâm sâm', threshold: 10, stock: { 'KHO-TMR': 60, 'KHO-DN': 88, 'SR-DN': 12, 'SR-HN': 4, 'SR-HCM': 15 } },
  { sku: 'VKD-VN5', name: 'Viên nang chiết xuất MR2', threshold: 15, stock: { 'KHO-TMR': 95, 'KHO-DN': 140, 'SR-DN': 18, 'SR-HN': 9, 'SR-HCM': 24 } },
  { sku: 'VKD-RS6', name: 'Rượu sâm hạ thổ 3 năm', threshold: 5, stock: { 'KHO-TMR': 18, 'KHO-DN': 26, 'SR-DN': 3, 'SR-HN': 2, 'SR-HCM': 7 } },
];

export const PROVINCE_COORDS: Record<string, { lat: number; lng: number }> = {
  'Đà Nẵng': { lat: 16.05, lng: 108.2 },
  'Hà Nội': { lat: 21.03, lng: 105.85 },
  'TP.HCM': { lat: 10.78, lng: 106.7 },
  Huế: { lat: 16.46, lng: 107.59 },
  'Kon Tum': { lat: 14.35, lng: 108.0 },
  'Cần Thơ': { lat: 10.03, lng: 105.79 },
};

export const QR_HEATMAP = [
  { region: 'TP.HCM', count: 312, suspect: false },
  { region: 'Hà Nội', count: 266, suspect: false },
  { region: 'Đà Nẵng', count: 184, suspect: false },
  { region: 'Cần Thơ', count: 47, suspect: true },
  { region: 'Kon Tum', count: 39, suspect: false },
  { region: 'Hải Phòng', count: 22, suspect: true },
];

export type CustomerSegment = 'active_vip' | 'lapsed_vip' | 'active';

export interface Customer {
  id: number;
  name: string;
  tier: 'Platinum' | 'Gold' | 'Silver';
  spend: number;
  last: string;
  segment: CustomerSegment;
  devices: number;
}

export const CUSTOMERS: Customer[] = [
  { id: 1, name: 'Trần Bảo Long', tier: 'Platinum', spend: 342000000, last: '20/04/2026', segment: 'lapsed_vip', devices: 2 },
  { id: 2, name: 'Nguyễn Thảo Vy', tier: 'Gold', spend: 186500000, last: '11/07/2026', segment: 'active_vip', devices: 1 },
  { id: 3, name: 'Phạm Minh Đức', tier: 'Gold', spend: 96000000, last: '02/05/2026', segment: 'lapsed_vip', devices: 1 },
  { id: 4, name: 'Lê Thu Hà', tier: 'Silver', spend: 34500000, last: '14/07/2026', segment: 'active', devices: 1 },
  { id: 5, name: 'Vũ Anh Khoa', tier: 'Platinum', spend: 410000000, last: '09/07/2026', segment: 'active_vip', devices: 3 },
];

export const CONSENT_LOG: [string, string, string, string][] = [
  ['16/01/2026', 'Đồng ý xử lý dữ liệu sức khỏe', 'App Elite Club', 'Đã ghi nhận'],
  ['16/01/2026', 'Đồng ý nhận ZNS/Marketing', 'Zalo OA', 'Đã ghi nhận'],
  ['02/06/2026', 'Yêu cầu xem dữ liệu cá nhân', 'Email hỗ trợ', 'Đã xử lý'],
];

export const BANNED_KEYWORDS = ['đặc trị', 'chữa khỏi hoàn toàn', 'chữa khỏi', 'thần dược', 'thay thế thuốc chữa bệnh'];
export const MANDATORY_DISCLAIMER =
  'Sản phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh. Hiệu quả có thể khác nhau tùy cơ địa mỗi người.';

export type ArticleStage = 0 | 1 | 2;
export interface Article {
  id: number;
  title: string;
  stage: ArticleStage;
  body: string;
}

export const ARTICLES: Article[] = [
  {
    id: 1,
    title: 'Majonoside-R2 và vai trò với hệ miễn dịch',
    stage: 1,
    body: 'Sâm Ngọc Linh chứa hàm lượng Majonoside-R2 (MR2) cao, một saponin đặc hữu được nhiều nghiên cứu sơ bộ quan tâm. Sản phẩm hỗ trợ tăng cường thể trạng, không phải là thuốc đặc trị bệnh nào.',
  },
  {
    id: 2,
    title: 'Kinh nghiệm chọn sâm tươi Tu Mơ Rông chuẩn',
    stage: 2,
    body: 'Bài viết hướng dẫn khách hàng nhận biết sâm Ngọc Linh tự nhiên qua đường vân ngọc, mắt đốt và mùi hương đặc trưng vùng Tu Mơ Rông.',
  },
  {
    id: 3,
    title: 'Sâm Ngọc Linh chữa khỏi hoàn toàn suy nhược cơ thể?',
    stage: 0,
    body: 'Nhiều khách hàng phản hồi sau khi dùng sâm Ngọc Linh đặc trị chứng mất ngủ và chữa khỏi hoàn toàn tình trạng suy nhược kéo dài nhiều năm.',
  },
  {
    id: 4,
    title: 'Câu chuyện vùng trồng: Nam Trà My mùa thu hoạch',
    stage: 2,
    body: 'Ghi chép từ vùng trồng Nam Trà My, Quảng Nam trong mùa thu hoạch chính vụ, nơi khí hậu và độ cao tạo nên chất lượng sâm đặc trưng.',
  },
];

export function fmt(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n);
}

export type ProductStatus = 'active' | 'hidden' | 'out_of_stock';
export interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  status: ProductStatus;
  icon: 'leaf' | 'box' | 'shield';
}

export const PRODUCT_CATEGORIES = ['Sâm tươi', 'Trà & TPCN', 'Rượu sâm', 'Mỹ phẩm'];

export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id: 'p1', name: 'Sâm Ngọc Linh tươi Thượng Hạng (10 năm)', sku: 'VKD-SP1', category: 'Sâm tươi', price: 45000000, status: 'active', icon: 'leaf' },
  { id: 'p2', name: 'Sâm Ngọc Linh tươi 7 năm tuổi', sku: 'VKD-SP2', category: 'Sâm tươi', price: 28000000, status: 'active', icon: 'leaf' },
  { id: 'p3', name: 'Trà túi lọc hồng sâm Ngọc Linh', sku: 'VKD-TR3', category: 'Trà & TPCN', price: 890000, status: 'active', icon: 'box' },
  { id: 'p4', name: 'Mật ong rừng ngâm sâm', sku: 'VKD-ML4', category: 'Trà & TPCN', price: 3200000, status: 'hidden', icon: 'box' },
  { id: 'p5', name: 'Viên nang chiết xuất MR2', sku: 'VKD-VN5', category: 'Trà & TPCN', price: 2450000, status: 'active', icon: 'shield' },
  { id: 'p6', name: 'Rượu Ngọc Đế hạ thổ 3 năm', sku: 'VKD-RS6', category: 'Rượu sâm', price: 6500000, status: 'out_of_stock', icon: 'box' },

  // --- Bổ sung 2026-07-17: 40 SKU thật lấy từ samngoclinhvkdgroup.com (đã lọc bỏ 3 SKU "Liên hệ" chưa niêm yết giá) ---
  { id: 'p7', name: 'Sâm Ngọc Linh thái lát ngâm mật ong', sku: 'VKD-001', category: 'Sâm tươi', price: 2500000, status: 'active', icon: 'leaf' },
  { id: 'p8', name: 'Cao Sâm Ngọc Linh Mật Ong', sku: 'VKD-002', category: 'Trà & TPCN', price: 2200000, status: 'active', icon: 'shield' },
  { id: 'p9', name: 'Nước Cốt Sâm Ngọc Linh', sku: 'VKD-003', category: 'Trà & TPCN', price: 445000, status: 'active', icon: 'shield' },
  { id: 'p10', name: 'Giải Độc Gan Panaxx Naturis', sku: 'VKD-004', category: 'Trà & TPCN', price: 440000, status: 'active', icon: 'shield' },
  { id: 'p11', name: 'Kẹo Sâm Ngọc Linh (PanaxX Candy)', sku: 'VKD-008', category: 'Trà & TPCN', price: 72000, status: 'active', icon: 'shield' },
  { id: 'p12', name: 'Bánh Sâm Ngọc Linh (PanaxX Cookie)', sku: 'VKD-009', category: 'Trà & TPCN', price: 58000, status: 'active', icon: 'shield' },
  { id: 'p13', name: 'Panaxx Super Drink 190ml (Bản Mới)', sku: 'VKD-010', category: 'Trà & TPCN', price: 15000, status: 'active', icon: 'shield' },
  { id: 'p14', name: 'Trà Sâm Ngọc Linh', sku: 'VKD-011', category: 'Trà & TPCN', price: 345000, status: 'active', icon: 'box' },
  { id: 'p15', name: 'Set 5 Lon Nước Tăng Lực (5 Vị)', sku: 'VKD-012', category: 'Trà & TPCN', price: 130000, status: 'active', icon: 'box' },
  { id: 'p16', name: 'PanaxX – Bản Kim 325ml', sku: 'VKD-013', category: 'Trà & TPCN', price: 26000, status: 'active', icon: 'box' },
  { id: 'p17', name: 'PanaxX – Bản Mộc 325ml', sku: 'VKD-014', category: 'Trà & TPCN', price: 26000, status: 'active', icon: 'box' },
  { id: 'p18', name: 'PanaxX – Bản Thuỷ 325ml', sku: 'VKD-015', category: 'Trà & TPCN', price: 26000, status: 'active', icon: 'box' },
  { id: 'p19', name: 'PanaxX – Bản Hoả 325ml', sku: 'VKD-016', category: 'Trà & TPCN', price: 26000, status: 'active', icon: 'box' },
  { id: 'p20', name: 'Rượu Ngọc Đế -Thiên Hương 750ml', sku: 'VKD-017', category: 'Rượu sâm', price: 1750000, status: 'active', icon: 'box' },
  { id: 'p21', name: 'Rượu Ngọc Đế Sâm Ngọc Linh 12 năm – 500ml', sku: 'VKD-018', category: 'Rượu sâm', price: 1118000, status: 'active', icon: 'box' },
  { id: 'p22', name: 'Rượu Ngọc Đế Sâm Ngọc Linh 10 năm – 500ml', sku: 'VKD-019', category: 'Rượu sâm', price: 980000, status: 'active', icon: 'box' },
  { id: 'p23', name: 'Rượu Ngọc Đế – Thăng Long (Chai cao) 500ml', sku: 'VKD-020', category: 'Rượu sâm', price: 860000, status: 'active', icon: 'box' },
  { id: 'p24', name: 'Rượu Ngọc Đế – Thăng Long (Chai thấp) 500ml', sku: 'VKD-021', category: 'Rượu sâm', price: 860000, status: 'active', icon: 'box' },
  { id: 'p25', name: 'Rượu Ngọc Đế Sâm Ngọc Linh Normal 500ml', sku: 'VKD-022', category: 'Rượu sâm', price: 585000, status: 'active', icon: 'box' },
  { id: 'p26', name: 'Rượu Sâm Ngọc Linh Xê Đăng', sku: 'VKD-023', category: 'Rượu sâm', price: 690000, status: 'active', icon: 'box' },
  { id: 'p27', name: 'Rượu Sâm Ngọc Linh 19.5 Độ', sku: 'VKD-024', category: 'Rượu sâm', price: 370000, status: 'active', icon: 'box' },
  { id: 'p28', name: 'Combo 2 Chai Rượu Sâm Ngọc Linh 19.5 Độ', sku: 'VKD-025', category: 'Rượu sâm', price: 715000, status: 'active', icon: 'box' },
  { id: 'p29', name: 'Rượu Ngọc Đế Phổ Thông 300ml', sku: 'VKD-026', category: 'Rượu sâm', price: 200000, status: 'active', icon: 'box' },
  { id: 'p30', name: 'Rượu Kim Bôi', sku: 'VKD-027', category: 'Rượu sâm', price: 72000, status: 'active', icon: 'box' },
  { id: 'p31', name: 'Men Kim Bôi', sku: 'VKD-028', category: 'Rượu sâm', price: 80000, status: 'active', icon: 'box' },
  { id: 'p32', name: 'Bộ Trẻ Hóa Combo (Big Size)', sku: 'VKD-029', category: 'Mỹ phẩm', price: 8760000, status: 'active', icon: 'box' },
  { id: 'p33', name: 'Bộ phục hồi da', sku: 'VKD-030', category: 'Mỹ phẩm', price: 3230000, status: 'active', icon: 'box' },
  { id: 'p34', name: 'Nước Trẻ Hóa Da (Purely Refreshing)', sku: 'VKD-031', category: 'Mỹ phẩm', price: 3470000, status: 'active', icon: 'box' },
  { id: 'p35', name: 'Bộ Trẻ Hóa Da Combo (Mini Size)', sku: 'VKD-032', category: 'Mỹ phẩm', price: 1850000, status: 'active', icon: 'box' },
  { id: 'p36', name: 'Kem Dưỡng Ban Đêm (Night Cream)', sku: 'VKD-033', category: 'Mỹ phẩm', price: 1900000, status: 'active', icon: 'box' },
  { id: 'p37', name: 'Serum Dưỡng Da (Serum)', sku: 'VKD-034', category: 'Mỹ phẩm', price: 1780000, status: 'active', icon: 'box' },
  { id: 'p38', name: 'Kem Dưỡng Ban Ngày (Day Cream)', sku: 'VKD-035', category: 'Mỹ phẩm', price: 1580000, status: 'active', icon: 'box' },
  { id: 'p39', name: 'Kem Mắt (Eyes Cream)', sku: 'VKD-036', category: 'Mỹ phẩm', price: 1150000, status: 'active', icon: 'box' },
  { id: 'p40', name: 'Kem Dưỡng Ban Đêm (Night Cream) — Pn’s', sku: 'VKD-037', category: 'Mỹ phẩm', price: 780000, status: 'active', icon: 'box' },
  { id: 'p41', name: 'Kem Chống Nắng (Daily UV)', sku: 'VKD-038', category: 'Mỹ phẩm', price: 850000, status: 'active', icon: 'box' },
  { id: 'p42', name: 'Nước Dưỡng Da (Micellar Serum)', sku: 'VKD-039', category: 'Mỹ phẩm', price: 850000, status: 'active', icon: 'box' },
  { id: 'p43', name: 'Kem Ban Ngày (Day Cream) — Pn’s', sku: 'VKD-040', category: 'Mỹ phẩm', price: 580000, status: 'active', icon: 'box' },
  { id: 'p44', name: 'Nước Cân Bằng (Micellar Toner)', sku: 'VKD-041', category: 'Mỹ phẩm', price: 560000, status: 'active', icon: 'box' },
  { id: 'p45', name: 'Sữa Rửa Mặt (Micellar Cleaner)', sku: 'VKD-042', category: 'Mỹ phẩm', price: 450000, status: 'active', icon: 'box' },
  { id: 'p46', name: 'Mặt Nạ Dưỡng Da (Face Mask) 5 Miếng', sku: 'VKD-043', category: 'Mỹ phẩm', price: 250000, status: 'active', icon: 'box' },
];

export type AgentTier = 'Cấp 1' | 'Cấp 2' | 'Affiliate KOL/KOC';
export type AgentStatus = 'active' | 'paused';
export interface Agent {
  id: string;
  code: string;
  name: string;
  tier: AgentTier;
  discountPct: number;
  revenue: number;
  status: AgentStatus;
}

export const AGENTS: Agent[] = [
  { id: 'a1', code: 'DL-001', name: 'Đại lý Ngọc Linh Premium - TP.HCM', tier: 'Cấp 1', discountPct: 25, revenue: 1580000000, status: 'active' },
  { id: 'a2', code: 'DL-014', name: 'Đại lý Kon Tum Xanh', tier: 'Cấp 2', discountPct: 15, revenue: 620000000, status: 'active' },
  { id: 'a3', code: 'DL-022', name: 'Đại lý Sâm Việt Hà Nội', tier: 'Cấp 1', discountPct: 22, revenue: 940000000, status: 'active' },
  { id: 'a4', code: 'AFF-007', name: 'Nhân Tâm Beauty (KOL)', tier: 'Affiliate KOL/KOC', discountPct: 12, revenue: 340000000, status: 'active' },
  { id: 'a5', code: 'AFF-011', name: 'Minh Khang Wellness (KOC)', tier: 'Affiliate KOL/KOC', discountPct: 10, revenue: 128000000, status: 'paused' },
];

export const SHOWROOM_REVENUE_TODAY: Record<string, number> = {
  'SR-DN': 84000000,
  'SR-HN': 96000000,
  'SR-HCM': 121000000,
};

export interface TransferOrder {
  id: number;
  fromCode: string;
  toCode: string;
  sku: string;
  qty: number;
  time: string;
}

export const CHANNEL_REVENUE = [
  { channel: 'Showroom (Offline)', revenue: 620000000, orders: 214, share: 32 },
  { channel: 'Website/TMĐT (Online)', revenue: 480000000, orders: 892, share: 25 },
  { channel: 'Affiliate (KOL/KOC)', revenue: 340000000, orders: 156, share: 18 },
  { channel: 'Nhà thuốc/Siêu thị (OTC-KA)', revenue: 480000000, orders: 310, share: 25 },
];

export const SOCIAL_CAMPAIGNS = [
  { platform: 'Facebook', reach: 482000, engagement: 31200, conversions: 640, convRate: 2.05 },
  { platform: 'Zalo OA', reach: 156000, engagement: 22800, conversions: 890, convRate: 3.9 },
  { platform: 'TikTok', reach: 921000, engagement: 68400, conversions: 512, convRate: 0.75 },
  { platform: 'YouTube Shorts', reach: 214000, engagement: 15100, conversions: 208, convRate: 1.38 },
];

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}
