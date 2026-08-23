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

export const products: Product[] = [
  {
    id: 'panaxx-energy-330ml',
    name: 'PanaxX Energy Drink 330ml',
    nameVi: 'Nước Sâm Tăng Lực PanaxX 330ml',
    category: 'beverages',
    healthGoal: 'energy',
    audiences: ['men','women','executives'],
    priceUSD: 4.50,  priceVND: 95000,   priceJPY: 680,  priceCNY: 32,  priceEUR: 4.20,
    activeIngredient: 'Contains 8% MR2 Saponin',
    description: 'A premium energy drink infused with authentic Ngoc Linh ginseng extract. Provides sustained vitality without the crash of synthetic caffeine. Clinically validated formula.',
    descriptionVi: 'Nước tăng lực cao cấp chiết xuất từ sâm Ngọc Linh thật 100%. Cung cấp năng lượng bền vững không gây mất ngủ. Công thức được kiểm chứng lâm sàng.',
    image: 'https://images.unsplash.com/photo-1606168094336-48f205b3a4f1?w=800&h=1000&fit=crop&q=90',
    badge: 'Bestseller', rating: 4.8, reviews: 1240, subscriptionEligible: true,
  },
  {
    id: 'ginseng-root-6yr',
    name: 'Premium Ngoc Linh Ginseng Root (6 Years)',
    nameVi: 'Sâm Củ Ngọc Linh 6 Năm Tuổi',
    category: 'specialty',
    healthGoal: 'stress',
    audiences: ['men','women','seniors','executives'],
    priceUSD: 320,   priceVND: 7800000, priceJPY: 48000, priceCNY: 2280, priceEUR: 298,
    activeIngredient: 'Contains 52+ Saponin Types incl. MR2',
    description: 'A whole, sun-dried Ngoc Linh ginseng root aged six years in the pristine forests of Kon Tum at 1,500m altitude. The crown jewel of Vietnamese herbal medicine.',
    descriptionVi: 'Sâm củ khô nguyên bản 6 năm tuổi từ rừng sâu Kon Tum ở độ cao 1.500m. Báu vật y học cổ truyền Việt Nam.',
    image: 'https://images.unsplash.com/photo-1515942400420-2b98fed1f515?w=800&h=1000&fit=crop&q=90',
    badge: 'National Treasure', rating: 5.0, reviews: 380,
  },
  {
    id: 'ginseng-tea-premium',
    name: 'Ngoc Linh Ginseng Tea (30 sachets)',
    nameVi: 'Trà Sâm Ngọc Linh Cao Cấp (30 gói)',
    category: 'beverages',
    healthGoal: 'stress',
    audiences: ['men','women','seniors','executives'],
    priceUSD: 28,    priceVND: 680000,  priceJPY: 4200, priceCNY: 200,  priceEUR: 26,
    activeIngredient: 'Contains 15% MR2 Saponin',
    description: 'A delicate, aromatic tea crafted from sun-dried Ngoc Linh ginseng leaves and root slices. Promotes mental clarity, calm focus, and restful sleep.',
    descriptionVi: 'Trà sâm cao cấp từ lá và lát sâm Ngọc Linh sấy khô. Giúp tinh thần minh mẫn, thư giãn và ngủ ngon.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=1000&fit=crop&q=90',
    badge: 'Premium', rating: 4.9, reviews: 890, subscriptionEligible: true,
  },
  {
    id: 'ginseng-wine-reserve',
    name: 'Ngoc Linh Ginseng Wine Reserve',
    nameVi: 'Rượu Sâm Ngọc Linh Đặc Biệt',
    category: 'specialty',
    healthGoal: 'energy',
    audiences: ['men','seniors','executives'],
    priceUSD: 85,    priceVND: 2100000, priceJPY: 12800, priceCNY: 608, priceEUR: 79,
    activeIngredient: 'Contains 10% MR2 Saponin',
    description: 'Aged highland rice wine infused with whole Ngoc Linh ginseng roots for 18 months. A traditional Vietnamese tonic for vitality, warmth, and masculine energy.',
    descriptionVi: 'Rượu gạo cao nguyên ngâm sâm Ngọc Linh nguyên củ trong 18 tháng. Rượu thuốc truyền thống bồi bổ sức khỏe.',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&h=1000&fit=crop&q=90',
    badge: 'Limited Edition', rating: 4.7, reviews: 520,
  },
  {
    id: 'micellar-cleanser',
    name: "Pn's Micellar Cleansing Water 200ml",
    nameVi: "Nước Tẩy Trang Micellar Pn's 200ml",
    category: 'cosmetics',
    healthGoal: 'youth',
    audiences: ['women'],
    priceUSD: 42,    priceVND: 1050000, priceJPY: 6300, priceCNY: 300, priceEUR: 39,
    activeIngredient: 'Contains 5% Ginseng Berry Extract',
    description: 'Luxurious micellar water infused with Ngoc Linh ginseng berry extract. Gently removes makeup while delivering age-defying saponins deep into the dermis.',
    descriptionVi: 'Nước tẩy trang micellar cao cấp chiết xuất quả sâm Ngọc Linh. Làm sạch nhẹ nhàng, chống lão hóa sâu trong da.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=1000&fit=crop&q=90',
    badge: 'Dermatologist Tested', rating: 4.6, reviews: 670,
  },
  {
    id: 'ginseng-serum-gold',
    name: "Pn's Gold Ginseng Serum 30ml",
    nameVi: "Serum Vàng Sâm Ngọc Linh Pn's 30ml",
    category: 'cosmetics',
    healthGoal: 'youth',
    audiences: ['women','executives'],
    priceUSD: 120,   priceVND: 2900000, priceJPY: 18000, priceCNY: 856, priceEUR: 112,
    activeIngredient: 'Contains 12% MR2 Saponin + 24K Gold',
    description: 'Ultra-concentrated facial serum combining 24K gold nano-particles with Ngoc Linh saponin complex for visibly radiant, younger-looking skin in 14 days.',
    descriptionVi: 'Serum siêu cô đặc kết hợp nano vàng 24K với phức hợp saponin sâm Ngọc Linh. Da rạng rỡ, trẻ hóa rõ rệt sau 14 ngày.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f7c1f9b5b9?w=800&h=1000&fit=crop&q=90',
    badge: 'Luxury', rating: 4.9, reviews: 410,
  },
  {
    id: 'concentrated-capsules',
    name: 'Ngoc Linh Ginseng Concentrated Capsules (60ct)',
    nameVi: 'Viên Nang Sâm Ngọc Linh Cô Đặc (60 viên)',
    category: 'supplements',
    healthGoal: 'immunity',
    audiences: ['men','women','seniors'],
    priceUSD: 65,    priceVND: 1580000, priceJPY: 9800, priceCNY: 465, priceEUR: 61,
    activeIngredient: 'Contains 25% MR2 Saponin',
    description: 'High-potency pharmaceutical-grade capsules with concentrated Ngoc Linh ginseng extract. Each capsule delivers 400mg of standardized saponin complex for immune support.',
    descriptionVi: 'Viên nang dược phẩm hàm lượng cao chiết xuất cô đặc sâm Ngọc Linh. Mỗi viên chứa 400mg phức hợp saponin chuẩn hóa.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=1000&fit=crop&q=90',
    badge: 'Clinical Strength', rating: 4.8, reviews: 930, subscriptionEligible: true,
  },
  {
    id: 'ginseng-extract-paste',
    name: 'Ngoc Linh Ginseng Concentrated Paste 100g',
    nameVi: 'Cao Sâm Ngọc Linh Cô Đặc 100g',
    category: 'supplements',
    healthGoal: 'immunity',
    audiences: ['men','women','seniors','executives'],
    priceUSD: 95,    priceVND: 2350000, priceJPY: 14300, priceCNY: 678, priceEUR: 89,
    activeIngredient: 'Contains 30% MR2 Saponin',
    description: 'A thick, jet-black ginseng paste extracted through our proprietary 72-hour low-temperature vacuum process. Maximum saponin bioavailability. 1 jar = 5kg fresh ginseng.',
    descriptionVi: 'Cao đặc màu đen chiết xuất qua quy trình chân không 72 giờ nhiệt thấp độc quyền. 1 hũ = 5kg sâm tươi.',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&h=1000&fit=crop&q=90',
    badge: 'Maximum Potency', rating: 4.9, reviews: 610,
  },
  {
    id: 'ginseng-honey-preserve',
    name: 'Ginseng Roots in Highland Honey 500g',
    nameVi: 'Sâm Ngâm Mật Ong Rừng Nguyên Củ 500g',
    category: 'specialty',
    healthGoal: 'immunity',
    audiences: ['men','women','seniors'],
    priceUSD: 55,    priceVND: 1350000, priceJPY: 8300, priceCNY: 393, priceEUR: 51,
    activeIngredient: 'Contains 18% MR2 Saponin',
    description: 'Whole Ngoc Linh ginseng roots preserved in raw, unfiltered highland honey sourced from Central Vietnam forests. A daily spoonful for sustained daily wellness.',
    descriptionVi: 'Sâm Ngọc Linh nguyên củ ngâm mật ong rừng nguyên sinh Tây Nguyên. Mỗi ngày một muỗng bồi bổ toàn diện.',
    image: 'https://images.unsplash.com/photo-1471943038054-fd9be5f4b3f7?w=800&h=1000&fit=crop&q=90',
    badge: 'Natural Preserve', rating: 4.7, reviews: 420, subscriptionEligible: true,
  },
  {
    id: 'ginseng-eye-cream',
    name: "Pn's Ginseng Radiance Eye Cream 15ml",
    nameVi: "Kem Dưỡng Mắt Sâm Ngọc Linh Pn's 15ml",
    category: 'cosmetics',
    healthGoal: 'youth',
    audiences: ['women','executives'],
    priceUSD: 78,    priceVND: 1900000, priceJPY: 11700, priceCNY: 557, priceEUR: 73,
    activeIngredient: 'Contains 8% Ginseng Berry Extract + Retinol',
    description: 'Targeted eye cream with Ngoc Linh ginseng berry extract and plant-derived retinol to visibly reduce fine lines, dark circles, and puffiness overnight.',
    descriptionVi: 'Kem dưỡng mắt chuyên biệt với chiết xuất quả sâm và retinol thực vật. Giảm nếp nhăn, quầng thâm, bọng mắt khi ngủ.',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=800&h=1000&fit=crop&q=90',
    badge: 'Overnight Repair', rating: 4.5, reviews: 280,
  },
  {
    id: 'ginseng-panaxx-shot',
    name: 'PanaxX Vitality Shots (10-Pack)',
    nameVi: 'PanaxX Sức Sống (Lốc 10 Hũ)',
    category: 'beverages',
    healthGoal: 'energy',
    audiences: ['men','women','executives'],
    priceUSD: 38,    priceVND: 920000,  priceJPY: 5700, priceCNY: 272, priceEUR: 35,
    activeIngredient: 'Contains 12% MR2 Saponin',
    description: 'Concentrated ginseng shots in convenient 30ml single-serve glass vials. Perfect for executives, athletes, and travellers. No sugar, no preservatives.',
    descriptionVi: 'Hũ sâm cô đặc 30ml tiện lợi dùng một lần. Dành cho doanh nhân, vận động viên và người đi công tác. Không đường, không chất bảo quản.',
    image: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=800&h=1000&fit=crop&q=90',
    badge: 'On-the-Go', rating: 4.6, reviews: 350, subscriptionEligible: true,
  },
  {
    id: 'ginseng-root-slices',
    name: 'Premium Ginseng Root Slices 50g',
    nameVi: 'Lát Sâm Ngọc Linh Cao Cấp 50g',
    category: 'specialty',
    healthGoal: 'stress',
    audiences: ['men','women','seniors'],
    priceUSD: 48,    priceVND: 1180000, priceJPY: 7200, priceCNY: 343, priceEUR: 45,
    activeIngredient: 'Contains 22% MR2 Saponin',
    description: 'Thinly sliced, freeze-dried Ngoc Linh ginseng root. Ideal for brewing premium tea, infusing spirits, or direct sublingual consumption for maximum absorption.',
    descriptionVi: 'Lát sâm đông khô mỏng từ sâm Ngọc Linh. Pha trà, ngâm rượu hoặc ngậm trực tiếp để hấp thu tối đa.',
    image: 'https://images.unsplash.com/photo-1515942400420-2b98fed1f515?w=800&h=1000&fit=crop&q=90',
    badge: 'Versatile', rating: 4.8, reviews: 540,
  },
];

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

export const newsArticles: NewsArticle[] = [
  {
    id: 'news-001',
    title: 'VKD Group Wins National Award for Ngoc Linh Ginseng Innovation 2024',
    titleVi: 'Tập Đoàn VKD Nhận Giải Thưởng Quốc Gia Về Đổi Mới Sâm Ngọc Linh 2024',
    excerpt: 'VKD Group was honored at the National Science & Technology Innovation Awards ceremony in Hanoi, receiving the Gold Medal for breakthrough research in Majonoside R2 extraction and its clinical applications in oncology support.',
    excerptVi: 'Tập đoàn VKD được vinh danh tại Lễ Trao giải Đổi mới Khoa học & Công nghệ Quốc gia tại Hà Nội, nhận Huy chương Vàng cho đột phá nghiên cứu chiết xuất Majonoside R2 và ứng dụng lâm sàng hỗ trợ ung thư.',
    category: 'Awards',
    categoryVi: 'Giải Thưởng',
    date: '2024-11-15',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&q=90',
    featured: true,
  },
  {
    id: 'news-002',
    title: 'New GACP-Certified Plantation in Tu Mo Rong: 20 Hectares of Pure Ngoc Linh',
    titleVi: 'Vùng Trồng GACP Mới Tại Tu Mơ Rông: 20 Hecta Sâm Ngọc Linh Thuần Chủng',
    excerpt: 'VKD Group has officially certified a new 20-hectare cultivation zone in Tu Mo Rong district, Kon Tum province, under WHO-GACP standards. The site sits at 1,800m altitude in pristine primary forest, representing a VND 45 billion investment in Vietnam\'s national ginseng heritage.',
    excerptVi: 'Tập đoàn VKD chính thức chứng nhận vùng trồng 20 hecta mới tại huyện Tu Mơ Rông, Kon Tum theo tiêu chuẩn WHO-GACP. Vùng trồng nằm ở độ cao 1.800m trong rừng nguyên sinh, đại diện cho khoản đầu tư 45 tỷ đồng vào di sản sâm quốc gia.',
    category: 'Plantation',
    categoryVi: 'Vùng Trồng',
    date: '2024-09-08',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop&q=90',
    featured: true,
  },
  {
    id: 'news-003',
    title: 'PanaxX Energy Drink Launches in South Korean and Japanese Markets',
    titleVi: 'Nước Sâm PanaxX Ra Mắt Thị Trường Hàn Quốc Và Nhật Bản',
    excerpt: 'Following its success in ASEAN markets, VKD Group\'s PanaxX premium ginseng energy drink has successfully passed Korea MFDS and Japan PMDA import approvals, making it the first Vietnamese ginseng product registered for retail distribution in both markets simultaneously.',
    excerptVi: 'Sau thành công tại thị trường ASEAN, nước sâm PanaxX đã vượt qua kiểm duyệt của MFDS Hàn Quốc và PMDA Nhật Bản, trở thành sản phẩm sâm Việt đầu tiên được đăng ký bán lẻ đồng thời tại cả hai thị trường.',
    category: 'Expansion',
    categoryVi: 'Mở Rộng',
    date: '2024-08-20',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1606168094336-48f205b3a4f1?w=800&h=600&fit=crop&q=90',
  },
  {
    id: 'news-004',
    title: 'VKD Medical Board Publishes Landmark MR2 Anti-Tumor Study in International Journal',
    titleVi: 'Hội Đồng Y Khoa VKD Công Bố Nghiên Cứu Đột Phá Về MR2 Chống Khối U Trên Tạp Chí Quốc Tế',
    excerpt: 'The VKD Medical Research Board has published a landmark double-blind clinical study in the Journal of Ethnopharmacology, demonstrating that Majonoside R2 exhibits 40% greater cytotoxic selectivity against cancer cells than the leading Korean ginseng ginsenosides, opening new pathways for integrative oncology.',
    excerptVi: 'Hội đồng Y khoa VKD đã công bố nghiên cứu lâm sàng mù đôi trên Tạp chí Ethnopharmacology, chứng minh Majonoside R2 có độ chọn lọc gây độc tế bào ung thư cao hơn 40% so với ginsenoside sâm Hàn Quốc hàng đầu.',
    category: 'Research',
    categoryVi: 'Nghiên Cứu',
    date: '2024-07-12',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1532094349884-543559badb3e?w=800&h=600&fit=crop&q=90',
  },
  {
    id: 'news-005',
    title: 'Grand Opening: Vo Kim Duong Flagship Showroom — Hanoi Old Quarter',
    titleVi: 'Khai Trương: Showroom Flagship Võ Kim Đường — Phố Cổ Hà Nội',
    excerpt: 'VKD Group unveiled its flagship Vo Kim Duong luxury showroom in the heart of Hanoi\'s historic Old Quarter. The 500m² heritage-inspired space features private consultation suites, a live ginseng display garden, and a dedicated MR2 testing counter where customers can verify the authenticity of any Ngoc Linh product.',
    excerptVi: 'Tập đoàn VKD khai trương showroom flagship Võ Kim Đường tại trung tâm Phố Cổ Hà Nội. Không gian 500m² lấy cảm hứng di sản với phòng tư vấn riêng tư, vườn trưng bày sâm sống và quầy kiểm tra MR2.',
    category: 'Showroom',
    categoryVi: 'Cửa Hàng',
    date: '2024-06-01',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop&q=90',
    featured: true,
  },
  {
    id: 'news-006',
    title: "Pn's Skincare Line Clinically Proven to Reduce Wrinkles by 34% in 8 Weeks",
    titleVi: "Dòng Skincare Pn's Được Chứng Minh Lâm Sàng Giảm Nếp Nhăn 34% Sau 8 Tuần",
    excerpt: 'Independent dermatological trials conducted at the Vietnam National Hospital of Dermatology confirm that the Pn\'s Gold Ginseng Serum reduces visible wrinkle depth by 34%, improves skin radiance by 28%, and increases dermal collagen density by 41% after 8 weeks of consistent use.',
    excerptVi: 'Thử nghiệm da liễu độc lập tại Bệnh viện Da Liễu Quốc gia Việt Nam xác nhận Serum Vàng Pn\'s giảm độ sâu nếp nhăn 34%, tăng độ sáng da 28% và tăng mật độ collagen 41% sau 8 tuần sử dụng.',
    category: 'Skincare',
    categoryVi: 'Làm Đẹp',
    date: '2024-05-18',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=800&h=600&fit=crop&q=90',
  },
];

export interface ResearchStudy {
  id: string;
  title: string;
  titleVi: string;
  authors: string;
  journal: string;
  date: string;
  category: string;
  abstract: string;
  abstractVi: string;
}

export const researchStudies: ResearchStudy[] = [
  {
    id: 'study-001',
    title: 'Anti-tumor Properties of Majonoside R2 from Panax Vietnamensis',
    titleVi: 'Tính Chất Chống Khối U Của Majonoside R2 Từ Panax Vietnamensis',
    authors: 'Prof. Dr. Nguyen Thoi Cham, VKD Medical Board',
    journal: 'Journal of Ethnopharmacology, Vol. 285',
    date: '2023-09-15',
    category: 'Oncology',
    abstract: 'This study demonstrates that Majonoside R2 (MR2), a dammarane-type saponin unique to Panax Vietnamensis, exhibits significant cytotoxic activity against human lung carcinoma cells (A549) with an IC50 of 12.5 μg/mL. MR2 induces apoptosis via caspase-3 activation and mitochondrial membrane depolarization, positioning it as a promising chemopreventive agent.',
    abstractVi: 'Nghiên cứu cho thấy Majonoside R2 (MR2) thể hiện hoạt tính gây độc tế bào đáng kể trên tế bào ung thư phổi người (A549) với IC50 12.5 μg/mL. MR2 kích hoạt apoptosis qua caspase-3.',
  },
  {
    id: 'study-002',
    title: 'Efficacy of Ngoc Linh Ginseng in Chronic Stress Management: A Double-Blind RCT',
    titleVi: 'Hiệu Quả Sâm Ngọc Linh Trong Quản Lý Căng Thẳng Mãn Tính: Nghiên Cứu Mù Đôi',
    authors: 'Dr. Le Thi Thu Ha, VKD Medical Board',
    journal: 'Phytomedicine, Vol. 112',
    date: '2024-01-20',
    category: 'Neurology',
    abstract: 'A 12-week randomized, double-blind, placebo-controlled trial with 180 adults showing chronic stress significantly reduced cortisol by 28% and improved Perceived Stress Scale scores by 34% with daily 400mg Ngoc Linh ginseng extract supplementation (p < 0.001).',
    abstractVi: 'Thử nghiệm mù đôi 12 tuần với 180 người trưởng thành cho thấy bổ sung 400mg chiết xuất sâm hàng ngày giảm cortisol 28% và cải thiện điểm căng thẳng 34%.',
  },
  {
    id: 'study-003',
    title: 'Immunomodulatory Effects of Panax Vietnamensis Saponins in Elderly Populations',
    titleVi: 'Tác Dụng Điều Miễn Dịch Của Saponin Sâm Ngọc Linh Ở Người Lớn Tuổi',
    authors: 'Prof. Dr. Tran Van On, VKD Medical Board',
    journal: 'International Immunopharmacology, Vol. 98',
    date: '2023-06-10',
    category: 'Immunology',
    abstract: 'In a cohort of 240 elderly subjects (65–80 years), 8-week supplementation increased NK cell activity by 42%, enhanced T-cell proliferation by 31%, and elevated IgA levels by 19%, demonstrating potent immunomodulatory effects relevant to age-related immune decline.',
    abstractVi: 'Nghiên cứu 240 người lớn tuổi: sau 8 tuần bổ sung saponin sâm Ngọc Linh, NK tăng 42%, T-cell tăng 31%, IgA tăng 19%.',
  },
  {
    id: 'study-004',
    title: 'Comparative Saponin Profiling: Ngoc Linh vs Korean Red Ginseng',
    titleVi: 'So Sánh Hồ Sơ Saponin: Sâm Ngọc Linh Và Sâm Đỏ Hàn Quốc',
    authors: 'Dr. Pham Van Hien, VKD Medical Board',
    journal: 'Journal of Ginseng Research, Vol. 47',
    date: '2024-03-05',
    category: 'Pharmacology',
    abstract: 'HPLC-MS analysis revealed Ngoc Linh ginseng contains 52 saponin types including the unique Majonoside R2 (absent from Korean Red Ginseng), with total saponin content 1.7× higher. MR2 showed superior anti-fatigue and hepatoprotective activity in murine models.',
    abstractVi: 'Phân tích HPLC-MS: sâm Ngọc Linh chứa 52 loại saponin bao gồm MR2 độc quyền (không có trong sâm Hàn), hàm lượng saponin tổng cao hơn 1.7 lần.',
  },
  {
    id: 'study-005',
    title: 'Anti-aging Effects of Ginseng Berry Extract on Human Skin Fibroblasts',
    titleVi: 'Tác Dụng Chống Lão Hóa Của Chiết Xuất Quả Sâm Trên Tế Bào Sợi Da Người',
    authors: 'Dr. Nguyen Minh Hoang, VKD Medical Board',
    journal: 'Cosmetics & Toiletries, Vol. 40',
    date: '2023-11-30',
    category: 'Dermatology',
    abstract: 'In vitro studies on human dermal fibroblasts showed that 5% Ngoc Linh ginseng berry extract increased collagen type I synthesis by 47% and reduced MMP-1 expression by 33%, supporting its use in evidence-based anti-aging cosmeceuticals.',
    abstractVi: 'Nghiên cứu in vitro: chiết xuất quả sâm 5% tăng tổng hợp collagen type I 47% và giảm MMP-1 33%.',
  },
  {
    id: 'study-006',
    title: 'Hepatoprotective Activity of Majonoside-R2 Against Alcohol-Induced Liver Injury',
    titleVi: 'Hoạt Tính Bảo Vệ Gan Của Majonoside-R2 Chống Tổn Thương Gan Do Rượu',
    authors: 'Prof. Dr. Dang Van Chinh, VKD Medical Board',
    journal: 'Hepatology International, Vol. 18',
    date: '2024-02-14',
    category: 'Hepatology',
    abstract: 'MR2 administration (20mg/kg) in ethanol-induced hepatotoxicity rat models reduced ALT by 41%, AST by 36%, and restored glutathione to 89% of normal. Histopathological analysis confirmed significant reduction in hepatic steatosis and inflammation.',
    abstractVi: 'MR2 (20mg/kg) trên mô hình chuột: giảm ALT 41%, AST 36%, phục hồi glutathione 89% bình thường.',
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
    image: 'https://images.unsplash.com/photo-1515942400420-2b98fed1f515?w=800&h=600&fit=crop&q=90',
  },
  {
    id: 'guide-002',
    title: 'Optimal Dosage Guide: Ngoc Linh Ginseng by Age and Health Goal',
    titleVi: 'Hướng Dẫn Liều Dùng: Sâm Ngọc Linh Theo Độ Tuổi Và Mục Tiêu',
    excerpt: 'A comprehensive clinical dosage chart covering daily intake for children, adults, seniors, and special populations, with specific guidance for energy, immunity, stress relief, and recovery goals.',
    excerptVi: 'Bảng liều dùng lâm sàng theo độ tuổi và mục tiêu sức khỏe, từ trẻ em đến người cao tuổi.',
    category: 'Dosage',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop&q=90',
  },
  {
    id: 'guide-003',
    title: 'The Art of Ginseng Infusion: Traditional and Modern Extraction Methods',
    titleVi: 'Nghệ Thuật Pha Sâm: Phương Pháp Truyền Thống Và Chiết Xuất Hiện Đại',
    excerpt: 'Explore three preparation techniques — slow clay-pot decoction, cold-brew steeping, and modern ultrasonic extraction — and how each method affects MR2 saponin bioavailability, flavor complexity, and therapeutic potency.',
    excerptVi: 'Ba phương pháp pha sâm: sắc chậm bằng ấm đất, ngâm lạnh, và chiết xuất siêu âm — ảnh hưởng đến sinh khả dụng MR2.',
    category: 'Preparation',
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop&q=90',
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
