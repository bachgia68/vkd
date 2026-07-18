export type Language = 'vi' | 'en' | 'zh' | 'fr' | 'ar';

export interface Translation {
  nav: {
    home: string;
    about: string;
    products: string;
    research: string;
    traceability: string;
    b2b: string;
    autoship: string;
    contact: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
    scrollText: string;
  };
  stats: {
    years: string;
    yearsLabel: string;
    regions: string;
    regionsLabel: string;
    products: string;
    productsLabel: string;
    countries: string;
    countriesLabel: string;
  };
  about: {
    label: string;
    title: string;
    titleHighlight: string;
    description1: string;
    description2: string;
    description3: string;
    cta: string;
    region1Name: string;
    region1Desc: string;
    region2Name: string;
    region2Desc: string;
    region3Name: string;
    region3Desc: string;
  };
  heritage: {
    label: string;
    title: string;
    subtitle: string;
    scaleTitle: string;
    scaleDesc: string;
    authorityTitle: string;
    authorityDesc: string;
    saponinTitle: string;
    saponinDesc: string;
    saponinCount: string;
    saponinTypes: string;
  };
  products: {
    label: string;
    title: string;
    subtitle: string;
    viewAll: string;
    categories: {
      beverages: { name: string; desc: string };
      supplements: { name: string; desc: string };
      cosmetics: { name: string; desc: string };
      specialty: { name: string; desc: string };
    };
  };
  showrooms: {
    label: string;
    title: string;
    subtitle: string;
    hoursLabel: string;
    addressLabel: string;
    phoneLabel: string;
    bookVisit: string;
    locations: { name: string; address: string; hours: string; phone: string }[];
  };
  traceability: {
    label: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    cta: string;
    guarantee: string;
  };
  b2b: {
    label: string;
    title: string;
    subtitle: string;
    distributorTitle: string;
    distributorDesc: string;
    investorTitle: string;
    investorDesc: string;
    oemTitle: string;
    oemDesc: string;
    cta: string;
  };
  certifications: {
    title: string;
    subtitle: string;
  };
  international: {
    title: string;
    subtitle: string;
    marketCn: string;
    marketEu: string;
    marketMe: string;
    marketSea: string;
  };
  footer: {
    brandDesc: string;
    quickLinks: string;
    contact: string;
    followUs: string;
    address: string;
    phone: string;
    email: string;
    copyright: string;
  };
}

export const translations: Record<Language, Translation> = {
  vi: {
    nav: {
      home: 'Trang chủ',
      about: 'Giới thiệu',
      products: 'Sản phẩm',
      research: 'Nghiên Cứu',
      traceability: 'Truy xuất',
      b2b: 'Hợp tác',
      autoship: 'Mua Định Kỳ',
      contact: 'Liên hệ',
    },
    hero: {
      badge: 'Quốc Bảo Việt Nam',
      titleLine1: 'Kho Báu Triệu Năm',
      titleLine2: 'Từ Rừng Sâu Việt Nam',
      subtitle: 'Sâm Ngọc Linh — Báu vật thiên nhiên từ rừng sâu miền Trung Việt Nam. VKD Group tự hào sở hữu 3 vùng trồng quy mô lớn nhất, chứng nhận cGMP, HACCP, ISO 9001/22000.',
      cta: 'Khám Phá Ngay',
      ctaSecondary: 'Truy Xuất Nguồn Gốc',
      scrollText: 'Cuộn xuống',
    },
    stats: {
      years: '10+',
      yearsLabel: 'Năm R&D',
      regions: '3',
      regionsLabel: 'Vùng Trồng',
      products: '50+',
      productsLabel: 'Sản Phẩm',
      countries: '5',
      countriesLabel: 'Thị Trường',
    },
    about: {
      label: 'Câu Chuyện',
      title: 'Về Chúng Tôi',
      titleHighlight: '',
      description1: 'Tập Đoàn Y Dược Sâm Ngọc Linh Việt Nam là đơn vị tiên phong trong việc bảo tồn và phát triển Sâm Ngọc Linh (Panax vietnamensis) — "Quốc Bảo Việt Nam".',
      description2: 'Với gần 10 năm nghiên cứu và phát triển cùng đội ngũ Giáo sư, Tiến sĩ hàng đầu, chúng tôi đã xây dựng 3 vùng trồng chuẩn GACP tại Kon Tum, Quảng Nam và Nghệ An.',
      description3: 'Hệ sinh thái sản phẩm đa dạng từ thực phẩm bổ sung, nước tăng lực, đến mỹ phẩm cao cấp, tất cả đều được sản xuất theo tiêu chuẩn quốc tế.',
      cta: 'Tìm Hiểu Thêm',
      region1Name: 'Tu Mơ Rông, Kon Tum',
      region1Desc: 'Vùng trồng nguyên bản, nơi Sâm Ngọc Linh được phát hiện lần đầu.',
      region2Name: 'Nam Trà My, Quảng Nam',
      region2Desc: 'Vùng trồng với điều kiện thổ nhưỡng lý tưởng cho sâm phát triển.',
      region3Name: 'Kỳ Sơn, Nghệ An',
      region3Desc: 'Vùng trồng mới mở rộng với quy mô lớn nhất.',
    },
    heritage: {
      label: 'Di Sản & Khoa Học',
      title: 'Kết Tinh Giữa Tự Nhiên và Khoa Học',
      subtitle: 'Sâm Ngọc Linh chứa bộ hợp chất saponin phong phú bậc nhất thế giới, được nghiên cứu và phát triển bởi đội ngũ y khoa hàng đầu Việt Nam.',
      scaleTitle: 'Quy Mô Hàng Ngàn Hecta',
      scaleDesc: 'Ba vùng trồng chuẩn GACP trải dài từ Tây Nguyên đến Bắc Trung Bộ, tạo nên chuỗi cung ứng sâm Ngọc Linh lớn nhất Việt Nam.',
      authorityTitle: 'Thẩm Quyền Y Khoa',
      authorityDesc: 'Đội ngũ Giáo sư, Tiến sĩ, Bác sĩ đầu ngành trực tiếp nghiên cứu, phát triển và kiểm định chất lượng sản phẩm.',
      saponinTitle: '52+ Loại Saponin',
      saponinDesc: 'Sâm Ngọc Linh chứa hơn 52 loại saponin — cao nhất trong tất cả các loài sâm trên thế giới, mang lại giá trị dược lý vượt trội.',
      saponinCount: '52+',
      saponinTypes: 'Loại Saponin',
    },
    products: {
      label: 'Hệ Sinh Thái',
      title: 'Sản Phẩm',
      subtitle: 'Dòng sản phẩm premium được chiết xuất từ Sâm Ngọc Linh thật 100%, kết hợp khoa học hiện đại và công nghệ sản xuất tiên tiến.',
      viewAll: 'Xem Tất Cả',
      categories: {
        beverages: { name: 'Nước Tăng Lực', desc: 'Nước uống bổ sung năng lượng và tăng lực từ sâm Ngọc Linh' },
        supplements: { name: 'Thực Phẩm Bổ Sung', desc: 'Viên nang, cao, trà sâm bổ sung sức khỏe' },
        cosmetics: { name: "Mỹ Phẩm Pn's", desc: 'Dòng dược mỹ phẩm cao cấp từ chiết xuất sâm' },
        specialty: { name: 'Sâm Tươi & Khô', desc: 'Sâm nguyên củ, sâm khô, rượu sâm đặc biệt' },
      },
    },
    showrooms: {
      label: 'Showroom',
      title: 'Hệ Thống Showroom Võ Kim Dương',
      subtitle: 'Trải nghiệm không gian luxury trực tiếp tại các showroom cao cấp trên toàn quốc.',
      hoursLabel: 'Giờ hoạt động',
      addressLabel: 'Địa chỉ',
      phoneLabel: 'Điện thoại',
      bookVisit: 'Đặt Lịch Khám',
      locations: [
        { name: 'Showroom Hà Nội', address: 'Số 44 Ngõ 120 Trường Chinh, Phường Phương Mai, Quận Đống Đa, TP. Hà Nội', hours: '8:00 — 20:00 (T2 — CN)', phone: '1800 28 28 66' },
        { name: 'Chi Nhánh Miền Nam (TP.HCM)', address: '170 Bis Trần Hưng Đạo, Phường Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh', hours: '8:00 — 20:00 (T2 — CN)', phone: '1800 28 28 66' },
        { name: 'Chi Nhánh Đà Nẵng', address: '259 Lê Thanh Nghị, Phường Hòa Cường Nam, Quận Hải Châu, TP. Đà Nẵng', hours: '8:00 — 20:00 (T2 — CN)', phone: '1800 28 28 66' },
        { name: 'Vùng Trồng Kon Tum', address: 'Đỉnh núi Ngọc Linh, xã Ngọc Lây, huyện Tu Mơ Rông, tỉnh Kon Tum', hours: 'Vùng nguyên liệu — không mở bán trực tiếp', phone: '1800 28 28 66' },
      ],
    },
    traceability: {
      label: 'Minh Bạch',
      title: 'Truy Xuất Nguồn Gốc',
      subtitle: 'Mỗi sản phẩm có mã QR riêng để bạn kiểm chứng nguồn gốc, vùng trồng, ngày thu hoạch và quy trình sản xuất.',
      step1Title: 'Quét Mã QR',
      step1Desc: 'Quét mã QR trên bao bì sản phẩm',
      step2Title: 'Xác Minh Nguồn Gốc',
      step2Desc: 'Xem vùng trồng, ngày thu hoạch',
      step3Title: 'Kiểm Tra Chất Lượng',
      step3Desc: 'Xem kết quả kiểm định độc lập',
      step4Title: 'An Tâm Sử Dụng',
      step4Desc: 'Cam kết sâm thật 100%',
      cta: 'Hướng Dẫn Truy Xuất',
      guarantee: 'Cam kết hoàn tiền 200% nếu phát hiện hàng giả',
    },
    b2b: {
      label: 'Hợp Tác',
      title: 'Trở Thành Đối Tác',
      subtitle: 'Hợp tác cùng VKD Group trong việc phân phối, xuất khẩu và phát triển thị trường quốc tế.',
      distributorTitle: 'Nhà Phân Phối',
      distributorDesc: 'Trở thành đại lý/điểm phân phối chính thức của VKD Group tại địa phương.',
      investorTitle: 'Nhà Đầu Tư',
      investorDesc: 'Cơ hội đầu tư vào chuỗi giá trị Sâm Ngọc Linh với tiềm năng tăng trưởng cao.',
      oemTitle: 'OEM/ODM',
      oemDesc: 'Sản xuất theo thương hiệu riêng với nguyên liệu sâm Ngọc Linh chính gốc.',
      cta: 'Đăng Ký Hợp Tác',
    },
    certifications: {
      title: 'Chứng Nhận Quốc Tế',
      subtitle: 'Đạt chuẩn các hệ thống quản lý chất lượng và an toàn thực phẩm quốc tế',
    },
    international: {
      title: 'Hành Trình Quốc Tế',
      subtitle: 'Đang hiện diện tại các thị trường',
      marketCn: 'Trung Quốc',
      marketEu: 'Châu Âu',
      marketMe: 'Trung Đông',
      marketSea: 'Đông Nam Á',
    },
    footer: {
      brandDesc: 'Tập Đoàn Y Dược Sâm Ngọc Linh Việt Nam — Đơn vị tiên phong bảo tồn và phát triển Quốc Bảo Việt Nam.',
      quickLinks: 'Liên Kết Nhanh',
      contact: 'Liên Hệ',
      followUs: 'Theo Dõi',
      address: 'Trụ sở: Việt Nam',
      phone: 'Hotline: 1800 28 28 66',
      email: 'info@vkdnature.com',
      copyright: '© 2024 VKD Group. Bản quyền thuộc về Tập Đoàn Y Dược Sâm Ngọc Linh Việt Nam.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      products: 'Products',
      research: 'Research',
      traceability: 'Traceability',
      b2b: 'Partners',
      autoship: 'Subscribe',
      contact: 'Contact',
    },
    hero: {
      badge: "Vietnam's National Treasure",
      titleLine1: 'The Billion-Year Treasure',
      titleLine2: "of Vietnam's Deep Forest",
      subtitle: 'Ngoc Linh Ginseng — a natural treasure from the deep forests of Central Vietnam. VKD Group owns the three largest cultivation regions, certified cGMP, HACCP, ISO 9001/22000.',
      cta: 'Discover Now',
      ctaSecondary: 'Verify Authenticity',
      scrollText: 'Scroll down',
    },
    stats: {
      years: '10+',
      yearsLabel: 'Years R&D',
      regions: '3',
      regionsLabel: 'Cultivation Regions',
      products: '50+',
      productsLabel: 'Products',
      countries: '5',
      countriesLabel: 'Markets',
    },
    about: {
      label: 'Our Story',
      title: 'About Us',
      titleHighlight: '',
      description1: 'VKD Group is a pioneer in preserving and developing Panax Vietnamensis — "Vietnam\'s National Treasure".',
      description2: 'With nearly 10 years of R&D with leading Professors and PhDs, we have established 3 GACP-certified cultivation regions in Kon Tum, Quảng Nam, and Nghệ An.',
      description3: 'A diverse product ecosystem from supplements, energy drinks, to premium cosmetics, all manufactured to international standards.',
      cta: 'Learn More',
      region1Name: 'Tu Mơ Rông, Kon Tum',
      region1Desc: 'Original cultivation region, where Panax Vietnamensis was first discovered.',
      region2Name: 'Nam Trà My, Quảng Nam',
      region2Desc: 'Ideal soil conditions for optimal ginseng growth.',
      region3Name: 'Kỳ Sơn, Nghệ An',
      region3Desc: 'Newly expanded region with the largest scale.',
    },
    heritage: {
      label: 'Heritage & Science',
      title: 'Where Nature Meets Science',
      subtitle: 'Ngoc Linh Ginseng contains the richest saponin profile in the world, researched and developed by Vietnam\u2019s leading medical authorities.',
      scaleTitle: 'Thousands of Hectares',
      scaleDesc: 'Three GACP-standard cultivation regions spanning from the Central Highlands to North Central Vietnam — Vietnam\u2019s largest Ngoc Linh ginseng supply chain.',
      authorityTitle: 'Medical Authority',
      authorityDesc: 'A team of leading Professors, PhDs, and physicians directly researches, develops, and quality-tests every product.',
      saponinTitle: '52+ Saponin Types',
      saponinDesc: 'Ngoc Linh Ginseng contains over 52 saponin types — the highest among all ginseng species worldwide — delivering exceptional pharmacological value.',
      saponinCount: '52+',
      saponinTypes: 'Saponin Types',
    },
    products: {
      label: 'Ecosystem',
      title: 'Products',
      subtitle: 'Premium products extracted from 100% authentic Panax Vietnamensis, combining modern science with advanced manufacturing technology.',
      viewAll: 'View All',
      categories: {
        beverages: { name: 'Energy Drinks', desc: 'Energy and vitality boosters from Panax Vietnamensis' },
        supplements: { name: 'Supplements', desc: 'Capsules, extracts, ginseng tea for health' },
        cosmetics: { name: "Pn's Cosmetics", desc: 'Premium cosmeceuticals from ginseng extract' },
        specialty: { name: 'Fresh & Dried Ginseng', desc: 'Whole root, dried ginseng, specialty ginseng wine' },
      },
    },
    showrooms: {
      label: 'Showroom',
      title: 'Vo Kim Duong Showroom Network',
      subtitle: 'Experience luxury in person at our premium showrooms nationwide.',
      hoursLabel: 'Operating Hours',
      addressLabel: 'Address',
      phoneLabel: 'Phone',
      bookVisit: 'Book a Visit',
      locations: [
        { name: 'Hanoi Showroom', address: '44 Alley 120 Truong Chinh St, Phuong Mai Ward, Dong Da District, Hanoi', hours: '8:00 — 20:00 (Mon — Sun)', phone: '1800 28 28 66' },
        { name: 'Southern Branch (Ho Chi Minh City)', address: '170 Bis Tran Hung Dao St, Nguyen Cu Trinh Ward, District 1, Ho Chi Minh City', hours: '8:00 — 20:00 (Mon — Sun)', phone: '1800 28 28 66' },
        { name: 'Da Nang Branch', address: '259 Le Thanh Nghi St, Hoa Cuong Nam Ward, Hai Chau District, Da Nang', hours: '8:00 — 20:00 (Mon — Sun)', phone: '1800 28 28 66' },
        { name: 'Kon Tum Growing Region', address: 'Ngoc Linh Mountain, Ngoc Lay Commune, Tu Mo Rong District, Kon Tum', hours: 'Cultivation area — not open for retail visits', phone: '1800 28 28 66' },
      ],
    },
    traceability: {
      label: 'Transparency',
      title: 'Product Traceability',
      subtitle: 'Each product has a unique QR code to verify origin, cultivation region, harvest date, and production process.',
      step1Title: 'Scan QR Code',
      step1Desc: 'Scan the QR code on product packaging',
      step2Title: 'Verify Origin',
      step2Desc: 'View cultivation region and harvest date',
      step3Title: 'Check Quality',
      step3Desc: 'View independent test results',
      step4Title: 'Use with Confidence',
      step4Desc: '100% authentic ginseng guarantee',
      cta: 'Traceability Guide',
      guarantee: '200% money-back guarantee if counterfeit detected',
    },
    b2b: {
      label: 'Partnership',
      title: 'Become a Partner',
      subtitle: 'Partner with VKD Group in distribution, export, and international market development.',
      distributorTitle: 'Distributor',
      distributorDesc: 'Become an official VKD Group distributor in your region.',
      investorTitle: 'Investor',
      investorDesc: 'Investment opportunities in the Panax Vietnamensis value chain with high growth potential.',
      oemTitle: 'OEM/ODM',
      oemDesc: 'Manufacture under your brand with authentic Panax Vietnamensis ingredients.',
      cta: 'Apply Now',
    },
    certifications: {
      title: 'International Certifications',
      subtitle: 'Meeting international quality management and food safety standards',
    },
    international: {
      title: 'International Journey',
      subtitle: 'Currently present in markets',
      marketCn: 'China',
      marketEu: 'Europe',
      marketMe: 'Middle East',
      marketSea: 'Southeast Asia',
    },
    footer: {
      brandDesc: 'VKD Group — Pioneering the preservation and development of Vietnam\u2019s National Treasure.',
      quickLinks: 'Quick Links',
      contact: 'Contact',
      followUs: 'Follow Us',
      address: 'Headquarters: Vietnam',
      phone: 'Hotline: +84 1800 28 28 66',
      email: 'info@vkdnature.com',
      copyright: '© 2024 VKD Group. All rights reserved.',
    },
  },
  zh: {
    nav: {
      home: '首页',
      about: '关于我们',
      products: '产品',
      research: '研究',
      traceability: '溯源',
      b2b: '合作',
      autoship: '订阅',
      contact: '联系我们',
    },
    hero: {
      badge: '越南国宝',
      titleLine1: '亿年宝藏',
      titleLine2: '来自越南深林',
      subtitle: '玉灵参 — 来自越南中部深林的天然珍宝。VKD集团拥有三大种植基地，通过cGMP、HACCP、ISO 9001/22000认证。',
      cta: '立即探索',
      ctaSecondary: '溯源验证',
      scrollText: '向下滚动',
    },
    stats: {
      years: '10+',
      yearsLabel: '年研发',
      regions: '3',
      regionsLabel: '种植基地',
      products: '50+',
      productsLabel: '产品',
      countries: '5',
      countriesLabel: '市场',
    },
    about: {
      label: '品牌故事',
      title: '关于我们',
      titleHighlight: '',
      description1: '越南玉灵参集团是保护和开发"越南国宝"——玉灵参的领军企业。',
      description2: '经过近10年的研发，与顶尖教授和博士团队合作，我们在昆嵩、广南和义安建立了3个符合GACP标准的种植基地。',
      description3: '产品生态系统丰富多样，从保健品、能量饮料到高端化妆品，均按国际标准生产。',
      cta: '了解更多',
      region1Name: '昆嵩省涂摩荣县',
      region1Desc: '原产地，玉灵参首次被发现的地方。',
      region2Name: '广南省南茶眉县',
      region2Desc: '理想的土壤条件，最适合人参生长。',
      region3Name: '义安省奇山县',
      region3Desc: '新扩建的种植基地，规模最大。',
    },
    heritage: {
      label: '传承与科学',
      title: '自然与科学的结晶',
      subtitle: '玉灵参含有世界上最丰富的皂苷成分，由越南顶尖医学权威团队研发。',
      scaleTitle: '数千公顷规模',
      scaleDesc: '三大GAP标准种植基地，从中部高原到北部中部，构成越南最大的玉灵参供应链。',
      authorityTitle: '医学权威',
      authorityDesc: '顶尖教授、博士和医师团队直接参与产品研发、开发和质量检测。',
      saponinTitle: '52+ 种皂苷',
      saponinDesc: '玉灵参含有超过52种皂苷 — 在所有人参品种中含量最高 — 带来卓越的药理价值。',
      saponinCount: '52+',
      saponinTypes: '种皂苷',
    },
    products: {
      label: '产品生态',
      title: '产品系列',
      subtitle: '从100%玉灵参提取的高端产品，融合现代科学与先进制造技术。',
      viewAll: '查看全部',
      categories: {
        beverages: { name: '能量饮料', desc: '来自玉灵参的能量和活力补充饮品' },
        supplements: { name: '保健品', desc: '胶囊、提取物、人参茶补充健康' },
        cosmetics: { name: "Pn's化妆品", desc: '来自人参提取物的高端药妆' },
        specialty: { name: '鲜参和干参', desc: '整根人参、干参、特色人参酒' },
      },
    },
    showrooms: {
      label: '展厅',
      title: '玉金阳展厅网络',
      subtitle: '在全国各地的高端展厅亲身体验奢华。',
      hoursLabel: '营业时间',
      addressLabel: '地址',
      phoneLabel: '电话',
      bookVisit: '预约参观',
      locations: [
        { name: '河内展厅', address: 'Số 44 Ngõ 120 Trường Chinh, Phường Phương Mai, Quận Đống Đa, TP. Hà Nội (越南河内)', hours: '8:00 — 20:00 (周一 — 周日)', phone: '1800 28 28 66' },
        { name: '南部分公司（胡志明市）', address: '170 Bis Trần Hưng Đạo, Phường Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh (越南胡志明市)', hours: '8:00 — 20:00 (周一 — 周日)', phone: '1800 28 28 66' },
        { name: '岘港分公司', address: '259 Lê Thanh Nghị, Phường Hòa Cường Nam, Quận Hải Châu, TP. Đà Nẵng (越南岘港)', hours: '8:00 — 20:00 (周一 — 周日)', phone: '1800 28 28 66' },
        { name: '昆嵩种植区', address: 'Đỉnh núi Ngọc Linh, xã Ngọc Lây, huyện Tu Mơ Rông, tỉnh Kon Tum (越南昆嵩)', hours: '种植区 — 不对外零售', phone: '1800 28 28 66' },
      ],
    },
    traceability: {
      label: '透明度',
      title: '产品溯源',
      subtitle: '每个产品都有唯一的二维码，可验证产地、种植区域、收获日期和生产过程。',
      step1Title: '扫描二维码',
      step1Desc: '扫描产品包装上的二维码',
      step2Title: '验证产地',
      step2Desc: '查看种植区域和收获日期',
      step3Title: '检查质量',
      step3Desc: '查看独立检测结果',
      step4Title: '安心使用',
      step4Desc: '100%正参保证',
      cta: '溯源指南',
      guarantee: '发现假货，200%退款保证',
    },
    b2b: {
      label: '合作',
      title: '成为合作伙伴',
      subtitle: '与越南玉灵参集团合作分销、出口和开发国际市场。',
      distributorTitle: '分销商',
      distributorDesc: '成为您所在地区的越南玉灵参集团官方分销商。',
      investorTitle: '投资者',
      investorDesc: '投资玉灵参价值链的高增长潜力机会。',
      oemTitle: 'OEM/ODM',
      oemDesc: '使用正宗玉灵参原料，以您的品牌生产。',
      cta: '立即申请',
    },
    certifications: {
      title: '国际认证',
      subtitle: '符合国际质量管理和食品安全标准',
    },
    international: {
      title: '国际之旅',
      subtitle: '目前市场的',
      marketCn: '中国',
      marketEu: '欧洲',
      marketMe: '中东',
      marketSea: '东南亚',
    },
    footer: {
      brandDesc: '越南玉灵参集团——保护和发展越南国宝的先锋。',
      quickLinks: '快速链接',
      contact: '联系我们',
      followUs: '关注我们',
      address: '总部：越南',
      phone: '热线：+84 1800 28 28 66',
      email: 'info@vkdnature.com',
      copyright: '© 2024 越南玉灵参集团。保留所有权利。',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      about: 'À Propos',
      products: 'Produits',
      research: 'Recherche',
      traceability: 'Traçabilité',
      b2b: 'Partenariats',
      autoship: 'Abonnement',
      contact: 'Contact',
    },
    hero: {
      badge: 'Trésor National du Vietnam',
      titleLine1: 'Le Trésor Millénaire',
      titleLine2: 'de la Forêt Profonde du Vietnam',
      subtitle: 'Ginseng Ngoc Linh — un trésor naturel des forêts profondes du Centre Vietnam. VKD Group possède les trois plus grandes régions de culture, certifié cGMP, HACCP, ISO 9001/22000.',
      cta: 'Découvrir',
      ctaSecondary: "Vérifier l'Authenticité",
      scrollText: 'Défiler vers le bas',
    },
    stats: {
      years: '10+',
      yearsLabel: "Années R&D",
      regions: '3',
      regionsLabel: 'Régions de Culture',
      products: '50+',
      productsLabel: 'Produits',
      countries: '5',
      countriesLabel: 'Marchés',
    },
    about: {
      label: 'Notre Histoire',
      title: 'À Propos',
      titleHighlight: '',
      description1: 'VKD Group est pionnier dans la préservation et le développement du Panax Vietnamensis — "Trésor National du Vietnam".',
      description2: "Avec près de 10 ans de R&D avec des Professeurs et Docteurs de premier plan, nous avons établi 3 régions de culture certifiées GACP à Kon Tum, Quảng Nam et Nghệ An.",
      description3: "Un écosystème de produits diversifié, des compléments alimentaires aux boissons énergisantes et cosmétiques haut de gamme, tous fabriqués selon les normes internationales.",
      cta: 'En Savoir Plus',
      region1Name: 'Tu Mơ Rông, Kon Tum',
      region1Desc: 'Région originelle, où le Panax Vietnamensis a été découvert.',
      region2Name: 'Nam Trà My, Quảng Nam',
      region2Desc: 'Conditions de sol idéales pour une croissance optimale.',
      region3Name: 'Kỳ Sơn, Nghệ An',
      region3Desc: 'Région nouvellement étendue à la plus grande échelle.',
    },
    heritage: {
      label: 'Patrimoine & Science',
      title: 'Quand la Nature Rencontre la Science',
      subtitle: 'Le Ginseng Ngoc Linh contient le profil de saponines le plus riche au monde, recherché et développé par les plus grandes autorités médicales du Vietnam.',
      scaleTitle: 'Des Milliers d\u2019Hectares',
      scaleDesc: 'Trois régions de culture certifiées GACP, des Hauts Plateaux du Centre au Nord Central — la plus grande chaîne d\u2019approvisionnement en ginseng Ngoc Linh du Vietnam.',
      authorityTitle: 'Autorité Médicale',
      authorityDesc: 'Une équipe de Professeurs, Docteurs et médecins de premier plan recherche, développe et teste la qualité de chaque produit.',
      saponinTitle: '52+ Types de Saponines',
      saponinDesc: 'Le Ginseng Ngoc Linh contient plus de 52 types de saponines — le plus élevé parmi toutes les espèces de ginseng — offrant une valeur pharmacologique exceptionnelle.',
      saponinCount: '52+',
      saponinTypes: 'Types de Saponines',
    },
    products: {
      label: 'Écosystème',
      title: 'Produits',
      subtitle: 'Produits premium extraits de Panax Vietnamensis 100% authentique, alliant science moderne et technologie de fabrication avancée.',
      viewAll: 'Voir Tout',
      categories: {
        beverages: { name: 'Boissons Énergisantes', desc: "Boosters d'énergie et de vitalité" },
        supplements: { name: 'Compléments', desc: 'Gélules, extraits, thé au ginseng' },
        cosmetics: { name: "Cosmétiques Pn's", desc: 'Cosmétique haut de gamme' },
        specialty: { name: 'Ginseng Frais & Séché', desc: 'Racine entière, ginseng séché, vin spécial' },
      },
    },
    showrooms: {
      label: 'Showroom',
      title: 'Réseau de Showrooms Vo Kim Duong',
      subtitle: 'Vivez l\u2019expérience du luxe en personne dans nos showrooms premium partout dans le pays.',
      hoursLabel: 'Heures d\u2019ouverture',
      addressLabel: 'Adresse',
      phoneLabel: 'Téléphone',
      bookVisit: 'Réserver une Visite',
      locations: [
        { name: 'Showroom Hanoï', address: 'Số 44 Ngõ 120 Trường Chinh, Phường Phương Mai, Quận Đống Đa, Hanoï', hours: '8h00 — 20h00 (Lun — Dim)', phone: '1800 28 28 66' },
        { name: 'Succursale Sud (Hô Chi Minh-Ville)', address: '170 Bis Trần Hưng Đạo, Phường Nguyễn Cư Trinh, Quận 1, Hô Chi Minh-Ville', hours: '8h00 — 20h00 (Lun — Dim)', phone: '1800 28 28 66' },
        { name: 'Succursale Da Nang', address: '259 Lê Thanh Nghị, Phường Hòa Cường Nam, Quận Hải Châu, Da Nang', hours: '8h00 — 20h00 (Lun — Dim)', phone: '1800 28 28 66' },
        { name: 'Zone de culture Kon Tum', address: 'Đỉnh núi Ngọc Linh, xã Ngọc Lây, huyện Tu Mơ Rông, Kon Tum', hours: 'Zone de culture — pas ouverte à la vente directe', phone: '1800 28 28 66' },
      ],
    },
    traceability: {
      label: 'Transparence',
      title: 'Traçabilité des Produits',
      subtitle: "Chaque produit possède un QR code unique pour vérifier l'origine, la région de culture, la date de récolte et le processus de production.",
      step1Title: 'Scanner le QR Code',
      step1Desc: 'Scanner le code QR sur l\'emballage',
      step2Title: "Vérifier l'Origine",
      step2Desc: 'Voir la région de culture et la date de récolte',
      step3Title: 'Contrôler la Qualité',
      step3Desc: 'Voir les résultats de tests indépendants',
      step4Title: 'Utiliser en Toute Confiance',
      step4Desc: 'Garantie ginseng 100% authentique',
      cta: 'Guide de Traçabilité',
      guarantee: 'Remboursement à 200% en cas de contrefaçon',
    },
    b2b: {
      label: 'Partenariat',
      title: 'Devenir Partenaire',
      subtitle: "Partenariat avec VKD Group pour la distribution, l'exportation et le développement international.",
      distributorTitle: 'Distributeur',
      distributorDesc: 'Devenir distributeur officiel VKD Group dans votre région.',
      investorTitle: 'Investisseur',
      investorDesc: "Opportunités d'investissement dans la chaîne de valeur Panax Vietnamensis.",
      oemTitle: 'OEM/ODM',
      oemDesc: 'Fabrication sous votre marque avec des ingrédients authentiques.',
      cta: 'Postuler',
    },
    certifications: {
      title: 'Certifications Internationales',
      subtitle: 'Conforme aux normes internationales de gestion de qualité et de sécurité alimentaire',
    },
    international: {
      title: 'Journée Internationale',
      subtitle: 'Présent sur les marchés',
      marketCn: 'Chine',
      marketEu: 'Europe',
      marketMe: 'Moyen-Orient',
      marketSea: 'Asie du Sud-Est',
    },
    footer: {
      brandDesc: 'VKD Group — Pionnier dans la préservation du Trésor National du Vietnam.',
      quickLinks: 'Liens Rapides',
      contact: 'Contact',
      followUs: 'Suivez-nous',
      address: 'Siège: Vietnam',
      phone: 'Hotline: +84 1800 28 28 66',
      email: 'info@vkdnature.com',
      copyright: '© 2024 VKD Group. Tous droits réservés.',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'عنا',
      products: 'المنتجات',
      research: 'البحث',
      traceability: 'التتبع',
      b2b: 'الشراكات',
      autoship: 'اشتراك',
      contact: 'اتصل بنا',
    },
    hero: {
      badge: 'كنز فيتنام الوطني',
      titleLine1: 'كنز مليار عام',
      titleLine2: 'من غابات فيتنام العميقة',
      subtitle: 'جينسنغ نغوك لينه — كنز طبيعي من غابات وسط فيتنام العميقة. تمتلك مجموعة VKD أكبر ثلاث مناطق زراعة، حاصلة على شهادات cGMP وHACCP وISO.',
      cta: 'اكتشف الآن',
      ctaSecondary: 'تحقق من الأصالة',
      scrollText: 'مرر للأسفل',
    },
    stats: {
      years: '+10',
      yearsLabel: 'سنوات بحث',
      regions: '3',
      regionsLabel: 'مناطق زراعة',
      products: '+50',
      productsLabel: 'منتج',
      countries: '5',
      countriesLabel: 'أسواق',
    },
    about: {
      label: 'قصتنا',
      title: 'عنا',
      titleHighlight: '',
      description1: 'مجموعة VKD رائدة في الحفاظ على وتطوير باناكس فيتنامensis — "كنز فيتنام الوطني".',
      description2: 'مع ما يقارب 10 سنوات من البحث والتطوير مع أساتذة ودكاترة رائدين، أنشأنا 3 مناطق زراعة معتمدة GACP.',
      description3: 'نظام بيئي متنوع من المنتجات من المكملات والمشروبات إلى مستحضرات التجميل الفاخرة.',
      cta: 'اعرف المزيد',
      region1Name: 'تو مو رونغ، كون توم',
      region1Desc: 'المنطقة الأصلية، حيث اكتُشف لأول مرة.',
      region2Name: 'نام ترا مي، كوانغ نام',
      region2Desc: 'ظروف تربة مثالية للنمو الأمثل.',
      region3Name: 'كي سون، نجيه آن',
      region3Desc: 'منطقة موسعة حديثاً بأكبر نطاق.',
    },
    heritage: {
      label: 'التراث والعلوم',
      title: 'حيث تلتقي الطبيعة بالعلوم',
      subtitle: 'يحتوي جينسنغ نغوك لينه على أغنى ملف من الصابونين في العالم، بحث وتطوير من قبل كبار المراجع الطبية في فيتنام.',
      scaleTitle: 'آلاف الهكتارات',
      scaleDesc: 'ثلاث مناطق زراعة معتمدة GACP تمتد من هضبة الوسط إلى شمال الوسط — أكبر سلسلة توريد لجينسنغ نغوك لينه في فيتنام.',
      authorityTitle: 'المرجعية الطبية',
      authorityDesc: 'فريق من كبار الأساتذة والأطباء يبحثون ويطورون ويختبرون جودة كل منتج.',
      saponinTitle: '+52 نوع صابونين',
      saponinDesc: 'يحتوي جينسنغ نغوك لينه على أكثر من 52 نوعاً من الصابونين — الأعلى بين جميع أنواع الجينسنغ — مما يوفر قيمة دوائية استثنائية.',
      saponinCount: '+52',
      saponinTypes: 'نوع صابونين',
    },
    products: {
      label: 'النظام البيئي',
      title: 'المنتجات',
      subtitle: 'منتجات فاخرة مستخلصة من باناكس فيتنامensis 100% أصلي.',
      viewAll: 'عرض الكل',
      categories: {
        beverages: { name: 'مشروبات الطاقة', desc: 'معززات الطاقة والحيوية' },
        supplements: { name: 'المكملات', desc: 'كبسولات ومستخلصات وشاي الجينسينج' },
        cosmetics: { name: "مستحضرات Pn's", desc: 'مستحضرات تجميلية فاخرة' },
        specialty: { name: 'جينسينج طازج ومجفف', desc: 'جذور كاملة وجينسينج مجفف' },
      },
    },
    showrooms: {
      label: 'صالة العرض',
      title: 'شبكة صالات عرض فو كيم ديونغ',
      subtitle: 'عش الفخامة شخصياً في صالات العرض الفاخرة لدينا في جميع أنحاء البلاد.',
      hoursLabel: 'ساعات العمل',
      addressLabel: 'العنوان',
      phoneLabel: 'الهاتف',
      bookVisit: 'احجز زيارة',
      locations: [
        { name: 'صالة عرض هانوي', address: 'Số 44 Ngõ 120 Trường Chinh, Phường Phương Mai, Quận Đống Đa, هانوي', hours: '8:00 — 20:00 (الإثنين — الأحد)', phone: '1800 28 28 66' },
        { name: 'الفرع الجنوبي (هوشي منه)', address: '170 Bis Trần Hưng Đạo, Phường Nguyễn Cư Trinh, Quận 1, هوشي منه', hours: '8:00 — 20:00 (الإثنين — الأحد)', phone: '1800 28 28 66' },
        { name: 'فرع دا نانغ', address: '259 Lê Thanh Nghị, Phường Hòa Cường Nam, Quận Hải Châu, دا نانغ', hours: '8:00 — 20:00 (الإثنين — الأحد)', phone: '1800 28 28 66' },
        { name: 'منطقة زراعة كون توم', address: 'Đỉnh núi Ngọc Linh, xã Ngọc Lây, huyện Tu Mơ Rông, كون توم', hours: 'منطقة زراعية — غير مفتوحة للبيع المباشر', phone: '1800 28 28 66' },
      ],
    },
    traceability: {
      label: 'الشفافية',
      title: 'تتبع المنتج',
      subtitle: 'كل منتج يحتوي على رمز QR فريد للتحقق من الأصل ومنطقة الزراعة.',
      step1Title: 'مسح رمز QR',
      step1Desc: 'امسح الرمز على العبوة',
      step2Title: 'تحقق من المصدر',
      step2Desc: 'شاهد منطقة الزراعة وتاريخ الحصاد',
      step3Title: 'تحقق من الجودة',
      step3Desc: 'شاهد نتائج الاختبارات المستقلة',
      step4Title: 'استخدم بثقة',
      step4Desc: 'ضمان الجينسينج 100% أصلي',
      cta: 'دليل التتبع',
      guarantee: 'استرداد 200% في حالة اكتشاف تزوير',
    },
    b2b: {
      label: 'الشراكة',
      title: 'كن شريكاً',
      subtitle: 'شارك مع مجموعة VKD في التوزيع والتصدير والتطوير الدولي.',
      distributorTitle: 'موزع',
      distributorDesc: 'كن موزعاً رسمياً لـ VKD في منطقتك.',
      investorTitle: 'مستثمر',
      investorDesc: 'فرص استثمارية في سلسلة قيمة باناكس فيتنامensis.',
      oemTitle: 'OEM/ODM',
      oemDesc: 'تصنيع بعلامتك التجارية مع مكونات أصلية.',
      cta: 'قدم الآن',
    },
    certifications: {
      title: 'شهادات دولية',
      subtitle: 'مطابق لمعايير إدارة الجودة وسلامة الغذاء الدولية',
    },
    international: {
      title: 'الرحلة الدولية',
      subtitle: 'موجود حالياً في أسواق',
      marketCn: 'الصين',
      marketEu: 'أوروبا',
      marketMe: 'الشرق الأوسط',
      marketSea: 'جنوب شرق آسيا',
    },
    footer: {
      brandDesc: 'مجموعة VKD — رائدة في الحفاظ على كنز فيتنام الوطني.',
      quickLinks: 'روابط سريعة',
      contact: 'اتصل بنا',
      followUs: 'تابعنا',
      address: 'المقر: فيتنام',
      phone: 'الخط الساخن: +84 1800 28 28 66',
      email: 'info@vkdnature.com',
      copyright: '© 2024 مجموعة VKD. جميع الحقوق محفوظة.',
    },
  },
};

export const languageNames: Record<Language, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  zh: '中文',
  fr: 'Français',
  ar: 'العربية',
};

export const languageFlags: Record<Language, string> = {
  vi: '🇻🇳',
  en: '🇬🇧',
  zh: '🇨🇳',
  fr: '🇫🇷',
  ar: '🇸🇦',
};
