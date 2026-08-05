export type Language = 'vi' | 'en' | 'zh' | 'fr' | 'ar';

export interface Translation {
  nav: {
    home: string;
    about: string;
    products: string;
    giftSets: string;
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
    galleryLabel: string;
    altCaySam: string;
    altCuSam: string;
    altVuonSam1: string;
    altVuonSam2: string;
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
      giftSets: 'Set Quà Tặng',
      research: 'Nghiên Cứu',
      traceability: 'Truy xuất',
      b2b: 'Hợp tác',
      autoship: 'Mua Định Kỳ',
      contact: 'Liên hệ',
    },
    hero: {
      badge: 'Bảo Tồn Nguyên Bản – Tuyển Chọn Tinh Hoa',
      titleLine1: 'Kho Báu Triệu Năm',
      titleLine2: 'Từ Rừng Sâu Việt Nam',
      subtitle: 'TA cung cấp Sâm Ngọc Linh chuẩn nguồn gốc từ vườn gốc Trà Linh và các dòng sản phẩm chế biến sâu đạt chuẩn kiểm định, rõ ràng pháp lý 100%.',
      cta: 'Xem Sản Phẩm Tuyển Chọn',
      ctaSecondary: 'Đặt Lịch Thăm Vườn',
      scrollText: 'Cuộn xuống',
    },
    stats: {
      years: '10+',
      yearsLabel: 'Năm R&D',
      regions: '1.800m+',
      regionsLabel: 'Đỉnh Cao Nhất – Hội Tụ Linh Khí Ngọc Linh',
      products: '50+',
      productsLabel: 'Sản Phẩm',
      countries: '5',
      countriesLabel: 'Thị Trường',
    },
    about: {
      label: 'Câu Chuyện',
      title: 'Về Chúng Tôi',
      titleHighlight: '',
      description1: 'Nếu bạn đang tìm kiếm Sâm Ngọc Linh — "Quốc bảo" của Việt Nam — nhưng hoang mang giữa "mê hồn trận" thật giả, giá cả hỗn loạn và giấy tờ mập mờ, thì TA Sâm Ngọc Linh được tạo ra để mang lại cho bạn sự an tâm tuyệt đối.',
      description2: 'Củ tươi nguyên bản: nhổ trực tiếp tại vườn nhà Khánh ở xã Trà Linh, huyện Nam Trà My, tỉnh Quảng Nam, độ cao trên 1.800m — chuẩn độ tuổi từ 6-10 năm trở lên, bao kiểm định hàm lượng Saponin toàn quốc.',
      description3: 'Sản phẩm chế biến sâu: tuyển chọn khắt khe từ các thương hiệu lớn, uy tín nhất Việt Nam — đầy đủ giấy tờ kiểm định hàm lượng Saponin, rõ ràng pháp lý 100%.',
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
      scaleTitle: 'Tập Hợp Đặc Sản',
      scaleDesc: 'Sâm Ngọc Linh cùng các sản phẩm đặc sản nổi tiếng của Việt Nam — từ nấm Lim Xanh rừng tự nhiên đến mật ong rừng nguyên chất. Tất cả đều được thẩm định chất lượng theo tiêu chuẩn GACP-WHO quốc tế.',
      authorityTitle: 'Thẩm Quyền Y Khoa',
      authorityDesc: 'Đội ngũ Giáo sư, Tiến sĩ, Bác sĩ đầu ngành trực tiếp nghiên cứu, phát triển và kiểm định chất lượng sản phẩm.',
      saponinTitle: '52+ Loại Saponin',
      saponinDesc: 'Sâm Ngọc Linh chứa hơn 52 loại saponin — cao nhất trong tất cả các loài sâm trên thế giới, mang lại giá trị dược lý vượt trội.',
      saponinCount: '52+',
      saponinTypes: 'Loại Saponin',
      galleryLabel: 'Vườn Sâm Nguyên Sinh',
      altCaySam: 'Cây sâm Ngọc Linh trong tự nhiên',
      altCuSam: 'Củ sâm Ngọc Linh',
      altVuonSam1: 'Vườn trồng sâm Ngọc Linh dưới tán rừng',
      altVuonSam2: 'Vườn sâm Ngọc Linh nhìn từ góc khác',
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
      title: 'Hệ Thống Điểm Kết Nối TA',
      subtitle: 'Trải nghiệm không gian luxury trực tiếp tại các điểm kết nối cao cấp trên toàn quốc.',
      hoursLabel: 'Giờ hoạt động',
      addressLabel: 'Địa chỉ',
      phoneLabel: 'Zalo / WhatsApp',
      bookVisit: 'ĐẶT LỊCH TƯ VẤN',
      locations: [
        { name: 'Điểm Kết Nối Hà Nội', address: 'Số 44 Ngõ 120 Trường Chinh, Phường Phương Mai, Quận Đống Đa, TP. Hà Nội', hours: '8:00 — 20:00 (T2 — CN)', phone: '(84) 984 999 309' },
        { name: 'Chi Nhánh Miền Nam (TP.HCM)', address: '170 Bis Trần Hưng Đạo, Phường Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh', hours: '8:00 — 20:00 (T2 — CN)', phone: '(84) 984 999 309' },
        { name: 'Chi Nhánh Đà Nẵng', address: '259 Lê Thanh Nghị, Phường Hòa Cường Nam, Quận Hải Châu, TP. Đà Nẵng', hours: '8:00 — 20:00 (T2 — CN)', phone: '(84) 984 999 309' },
        { name: 'Vùng Trồng Kon Tum', address: 'Đỉnh núi Ngọc Linh, xã Ngọc Lây, huyện Tu Mơ Rông, tỉnh Kon Tum', hours: 'Vùng nguyên liệu — không mở bán trực tiếp', phone: '(84) 984 999 309' },
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
      subtitle: 'Hợp tác cùng TA trong việc phân phối, xuất khẩu và phát triển thị trường quốc tế cho Sâm Ngọc Linh.',
      distributorTitle: 'Nhà Phân Phối',
      distributorDesc: 'Trở thành đại lý/điểm phân phối chính thức trên sàn giao dịch TA tại địa phương.',
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
      brandDesc: 'TA — Sàn giao dịch Sâm Ngọc Linh uy tín, kết nối vùng trồng chuẩn GACP-WHO với người tiêu dùng, minh bạch từng sản phẩm.',
      quickLinks: 'Liên Kết Nhanh',
      contact: 'Liên Hệ',
      followUs: 'Theo Dõi',
      address: '15°12\'N 108°18\'E, Trà Linh, Nam Trà My, Quảng Nam, Việt Nam',
      phone: 'Zalo / WhatsApp: (84) 984 999 309',
      email: 'khanh@tasamngoclinh.com',
      copyright: '© 2026 TA — Sàn Giao Dịch Sâm Ngọc Linh Việt Nam. Bảo lưu mọi quyền.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      products: 'Products',
      giftSets: 'Gift Sets',
      research: 'Research',
      traceability: 'Traceability',
      b2b: 'Partners',
      autoship: 'Subscribe',
      contact: 'Contact',
    },
    hero: {
      badge: 'Preserving the Original – Curating the Finest',
      titleLine1: 'The Billion-Year Treasure',
      titleLine2: "of Vietnam's Deep Forest",
      subtitle: 'TA offers verified-origin Ngoc Linh Ginseng from our own garden in Tra Linh, plus deeply-processed products meeting full quality certification and legal transparency.',
      cta: 'View Curated Products',
      ctaSecondary: 'Book a Garden Visit',
      scrollText: 'Scroll down',
    },
    stats: {
      years: '10+',
      yearsLabel: 'Years R&D',
      regions: '1,800m+',
      regionsLabel: 'The Highest Peak of Ngoc Linh',
      products: '50+',
      productsLabel: 'Products',
      countries: '5',
      countriesLabel: 'Markets',
    },
    about: {
      label: 'Our Story',
      title: 'About Us',
      titleHighlight: '',
      description1: 'If you are searching for Ngoc Linh Ginseng — Vietnam’s "national treasure" — but overwhelmed by counterfeits, chaotic pricing, and unclear paperwork, TA was created to give you complete peace of mind.',
      description2: 'Fresh, original-source roots: harvested directly from our own garden in Tra Linh commune, Nam Tra My district, Quang Nam province, at over 1,800m elevation — only roots aged 6-10 years and up, with nationwide Saponin content certification.',
      description3: 'Deeply-processed products: strictly curated from Vietnam’s most reputable large brands — fully certified for Saponin content, 100% legally transparent.',
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
      galleryLabel: 'Native Ginseng Garden',
      altCaySam: 'Ngoc Linh ginseng plant in its natural habitat',
      altCuSam: 'Ngoc Linh ginseng root close-up',
      altVuonSam1: 'Ngoc Linh ginseng cultivation under the forest canopy',
      altVuonSam2: 'Ngoc Linh ginseng plantation, alternate view',
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
      title: 'TA Connection Points',
      subtitle: 'Experience luxury in person at our premium connection points nationwide.',
      hoursLabel: 'Operating Hours',
      addressLabel: 'Address',
      phoneLabel: 'Zalo / WhatsApp',
      bookVisit: 'Book a Visit',
      locations: [
        { name: 'Hanoi Connection Point', address: '44 Alley 120 Truong Chinh St, Phuong Mai Ward, Dong Da District, Hanoi', hours: '8:00 — 20:00 (Mon — Sun)', phone: '(84) 984 999 309' },
        { name: 'Southern Branch (Ho Chi Minh City)', address: '170 Bis Tran Hung Dao St, Nguyen Cu Trinh Ward, District 1, Ho Chi Minh City', hours: '8:00 — 20:00 (Mon — Sun)', phone: '(84) 984 999 309' },
        { name: 'Da Nang Branch', address: '259 Le Thanh Nghi St, Hoa Cuong Nam Ward, Hai Chau District, Da Nang', hours: '8:00 — 20:00 (Mon — Sun)', phone: '(84) 984 999 309' },
        { name: 'Kon Tum Growing Region', address: 'Ngoc Linh Mountain, Ngoc Lay Commune, Tu Mo Rong District, Kon Tum', hours: 'Cultivation area — not open for retail visits', phone: '(84) 984 999 309' },
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
      subtitle: 'Partner with TA in distribution, export, and international market development for Ngoc Linh Ginseng.',
      distributorTitle: 'Distributor',
      distributorDesc: 'Become an official TA marketplace distributor in your region.',
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
      brandDesc: 'TA — The trusted Ngoc Linh Ginseng marketplace, connecting GACP-WHO certified cultivation regions with consumers, transparent by product.',
      quickLinks: 'Quick Links',
      contact: 'Contact',
      followUs: 'Follow Us',
      address: '15°12\'N 108°18\'E, Tra Linh, Nam Tra My, Quang Nam, Vietnam',
      phone: 'Zalo / WhatsApp: (84) 984 999 309',
      email: 'khanh@tasamngoclinh.com',
      copyright: '© 2026 TA — Ngoc Linh Ginseng Trading Marketplace. All rights reserved.',
    },
  },
  zh: {
    nav: {
      home: '首页',
      about: '关于我们',
      products: '产品',
      giftSets: '礼品套装',
      research: '研究',
      traceability: '溯源',
      b2b: '合作',
      autoship: '订阅',
      contact: '联系我们',
    },
    hero: {
      badge: '保留本源 · 甄选精粹',
      titleLine1: '亿年宝藏',
      titleLine2: '来自越南深林',
      subtitle: 'TA提供来自茶灵自家园地、产地可溯源的玉灵参，以及经过认证、法律透明的深加工产品。',
      cta: '查看精选产品',
      ctaSecondary: '预约参观园地',
      scrollText: '向下滚动',
    },
    stats: {
      years: '10+',
      yearsLabel: '年研发',
      regions: '1800m+',
      regionsLabel: '玉灵参最高峰 · 灵气汇聚之地',
      products: '50+',
      productsLabel: '产品',
      countries: '5',
      countriesLabel: '市场',
    },
    about: {
      label: '品牌故事',
      title: '关于我们',
      titleHighlight: '',
      description1: '如果您正在寻找越南"国宝"玉灵参，却在真假难辨、价格混乱、证件不清的市场中感到迷茫，TA正是为了给您带来绝对安心而创立。',
      description2: '原产鲜参：直接采挖自Khánh家位于广南省南茶眉县茶灵乡、海拔1800米以上的自家园地——只选6-10年以上参龄，附全国皂苷含量检测。',
      description3: '深加工产品：严格甄选自越南最具声誉的大品牌——皂苷含量检测齐全，法律信息100%透明。',
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
      galleryLabel: '原生玉灵参园',
      altCaySam: '生长在自然环境中的玉灵参植株',
      altCuSam: '玉灵参根部特写',
      altVuonSam1: '林下种植的玉灵参园',
      altVuonSam2: '玉灵参种植园（另一视角）',
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
      title: 'TA 连接点网络',
      subtitle: '在全国各地的高端展厅亲身体验奢华。',
      hoursLabel: '营业时间',
      addressLabel: '地址',
      phoneLabel: '电话',
      bookVisit: '预约参观',
      locations: [
        { name: '河内展厅', address: 'Số 44 Ngõ 120 Trường Chinh, Phường Phương Mai, Quận Đống Đa, TP. Hà Nội (越南河内)', hours: '8:00 — 20:00 (周一 — 周日)', phone: '(84) 984 999 309' },
        { name: '南部分公司（胡志明市）', address: '170 Bis Trần Hưng Đạo, Phường Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh (越南胡志明市)', hours: '8:00 — 20:00 (周一 — 周日)', phone: '(84) 984 999 309' },
        { name: '岘港分公司', address: '259 Lê Thanh Nghị, Phường Hòa Cường Nam, Quận Hải Châu, TP. Đà Nẵng (越南岘港)', hours: '8:00 — 20:00 (周一 — 周日)', phone: '(84) 984 999 309' },
        { name: '昆嵩种植区', address: 'Đỉnh núi Ngọc Linh, xã Ngọc Lây, huyện Tu Mơ Rông, tỉnh Kon Tum (越南昆嵩)', hours: '种植区 — 不对外零售', phone: '(84) 984 999 309' },
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
      subtitle: '与TA合作分销、出口和开发玉灵参国际市场。',
      distributorTitle: '分销商',
      distributorDesc: '成为您所在地区TA平台的官方分销商。',
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
      brandDesc: 'TA——值得信赖的玉灵参交易平台，连接GACP-WHO认证种植基地与消费者，产品全程透明。',
      quickLinks: '快速链接',
      contact: '联系我们',
      followUs: '关注我们',
      address: '15°12\'N 108°18\'E，茶灵，南茶眉，广南省，越南',
      phone: 'Zalo / WhatsApp：(84) 984 999 309',
      email: 'khanh@tasamngoclinh.com',
      copyright: '© 2026 TA。保留所有权利。',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      about: 'À Propos',
      products: 'Produits',
      giftSets: 'Coffrets Cadeaux',
      research: 'Recherche',
      traceability: 'Traçabilité',
      b2b: 'Partenariats',
      autoship: 'Abonnement',
      contact: 'Contact',
    },
    hero: {
      badge: 'Préserver l’Authentique – Sélectionner l’Excellence',
      titleLine1: 'Le Trésor Millénaire',
      titleLine2: 'de la Forêt Profonde du Vietnam',
      subtitle: 'TA propose du Ginseng Ngoc Linh à origine vérifiée, cultivé dans notre propre jardin à Tra Linh, ainsi que des produits transformés certifiés et en règle légale à 100%.',
      cta: 'Voir les Produits Sélectionnés',
      ctaSecondary: 'Réserver une Visite du Jardin',
      scrollText: 'Défiler vers le bas',
    },
    stats: {
      years: '10+',
      yearsLabel: "Années R&D",
      regions: '1 800m+',
      regionsLabel: 'Le Plus Haut Sommet du Ngoc Linh',
      products: '50+',
      productsLabel: 'Produits',
      countries: '5',
      countriesLabel: 'Marchés',
    },
    about: {
      label: 'Notre Histoire',
      title: 'À Propos',
      titleHighlight: '',
      description1: 'Si vous recherchez le Ginseng Ngoc Linh — le "trésor national" du Vietnam — mais êtes perdu face aux contrefaçons et à l’opacité du marché, TA a été créé pour vous offrir une tranquillité d’esprit totale.',
      description2: 'Racines fraîches d’origine : récoltées directement dans notre jardin à Tra Linh, district de Nam Tra My, province de Quang Nam, à plus de 1 800m d’altitude — uniquement des racines de 6 à 10 ans et plus, avec certification nationale du taux de Saponine.',
      description3: 'Produits transformés : sélectionnés rigoureusement auprès des marques les plus réputées du Vietnam — certification complète du taux de Saponine, transparence légale à 100%.',
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
      galleryLabel: 'Jardin Natif de Ginseng',
      altCaySam: 'Plant de ginseng Ngoc Linh à l’état naturel',
      altCuSam: 'Gros plan sur une racine de ginseng Ngoc Linh',
      altVuonSam1: 'Culture de ginseng Ngoc Linh sous la canopée forestière',
      altVuonSam2: 'Plantation de ginseng Ngoc Linh, vue alternative',
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
      title: 'Réseau de Points de Connexion TA',
      subtitle: 'Vivez l\u2019expérience du luxe en personne dans nos showrooms premium partout dans le pays.',
      hoursLabel: 'Heures d\u2019ouverture',
      addressLabel: 'Adresse',
      phoneLabel: 'Téléphone',
      bookVisit: 'Réserver une Visite',
      locations: [
        { name: 'Showroom Hanoï', address: 'Số 44 Ngõ 120 Trường Chinh, Phường Phương Mai, Quận Đống Đa, Hanoï', hours: '8h00 — 20h00 (Lun — Dim)', phone: '(84) 984 999 309' },
        { name: 'Succursale Sud (Hô Chi Minh-Ville)', address: '170 Bis Trần Hưng Đạo, Phường Nguyễn Cư Trinh, Quận 1, Hô Chi Minh-Ville', hours: '8h00 — 20h00 (Lun — Dim)', phone: '(84) 984 999 309' },
        { name: 'Succursale Da Nang', address: '259 Lê Thanh Nghị, Phường Hòa Cường Nam, Quận Hải Châu, Da Nang', hours: '8h00 — 20h00 (Lun — Dim)', phone: '(84) 984 999 309' },
        { name: 'Zone de culture Kon Tum', address: 'Đỉnh núi Ngọc Linh, xã Ngọc Lây, huyện Tu Mơ Rông, Kon Tum', hours: 'Zone de culture — pas ouverte à la vente directe', phone: '(84) 984 999 309' },
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
      subtitle: "Partenariat avec TA pour la distribution, l'exportation et le développement international du Ginseng Ngoc Linh.",
      distributorTitle: 'Distributeur',
      distributorDesc: 'Devenir distributeur officiel de la place de marché TA dans votre région.',
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
      brandDesc: 'TA — La place de marché de confiance pour le Ginseng Ngoc Linh, reliant les régions certifiées GACP-WHO aux consommateurs, transparente pour chaque produit.',
      quickLinks: 'Liens Rapides',
      contact: 'Contact',
      followUs: 'Suivez-nous',
      address: '15°12\'N 108°18\'E, Tra Linh, Nam Tra My, Quang Nam, Vietnam',
      phone: 'Zalo / WhatsApp : (84) 984 999 309',
      email: 'khanh@tasamngoclinh.com',
      copyright: '© 2026 TA — Place de marché du Ginseng Ngoc Linh. Tous droits réservés.',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'عنا',
      products: 'المنتجات',
      giftSets: 'أطقم الهدايا',
      research: 'البحث',
      traceability: 'التتبع',
      b2b: 'الشراكات',
      autoship: 'اشتراك',
      contact: 'اتصل بنا',
    },
    hero: {
      badge: 'الحفاظ على الأصالة – اختيار النخبة',
      titleLine1: 'كنز مليار عام',
      titleLine2: 'من غابات فيتنام العميقة',
      subtitle: 'تقدم TA جينسنغ نغوك لينه موثق المصدر من حديقتنا الخاصة في ترا لينه، بالإضافة إلى منتجات مصنعة معتمدة وشفافة قانونياً بنسبة 100%.',
      cta: 'عرض المنتجات المختارة',
      ctaSecondary: 'احجز زيارة للحديقة',
      scrollText: 'مرر للأسفل',
    },
    stats: {
      years: '+10',
      yearsLabel: 'سنوات بحث',
      regions: '+1800م',
      regionsLabel: 'أعلى قمة في نغوك لينه',
      products: '+50',
      productsLabel: 'منتج',
      countries: '5',
      countriesLabel: 'أسواق',
    },
    about: {
      label: 'قصتنا',
      title: 'عنا',
      titleHighlight: '',
      description1: 'إذا كنت تبحث عن جينسنغ نغوك لينه — "الكنز الوطني" لفيتنام — لكنك حائر بين المنتجات المقلدة وعدم وضوح الأوراق، فقد أُنشئت TA لتمنحك راحة بال تامة.',
      description2: 'جذور طازجة أصلية: تُقتلع مباشرة من حديقتنا الخاصة في ترا لينه، مقاطعة كوانغ نام، على ارتفاع يزيد عن 1800 متر — فقط جذور عمرها 6-10 سنوات فأكثر، مع شهادة فحص نسبة الصابونين على مستوى البلاد.',
      description3: 'منتجات مصنعة: مختارة بدقة من أكبر العلامات التجارية الموثوقة في فيتنام — شهادات فحص صابونين كاملة، وشفافية قانونية 100%.',
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
      galleryLabel: 'حديقة الجينسنغ الأصلية',
      altCaySam: 'نبتة جينسنغ نغوك لينه في بيئتها الطبيعية',
      altCuSam: 'لقطة مقربة لجذر جينسنغ نغوك لينه',
      altVuonSam1: 'مزرعة جينسنغ نغوك لينه تحت مظلة الغابة',
      altVuonSam2: 'مزرعة جينسنغ نغوك لينه، منظر آخر',
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
        { name: 'صالة عرض هانوي', address: 'Số 44 Ngõ 120 Trường Chinh, Phường Phương Mai, Quận Đống Đa, هانوي', hours: '8:00 — 20:00 (الإثنين — الأحد)', phone: '(84) 984 999 309' },
        { name: 'الفرع الجنوبي (هوشي منه)', address: '170 Bis Trần Hưng Đạo, Phường Nguyễn Cư Trinh, Quận 1, هوشي منه', hours: '8:00 — 20:00 (الإثنين — الأحد)', phone: '(84) 984 999 309' },
        { name: 'فرع دا نانغ', address: '259 Lê Thanh Nghị, Phường Hòa Cường Nam, Quận Hải Châu, دا نانغ', hours: '8:00 — 20:00 (الإثنين — الأحد)', phone: '(84) 984 999 309' },
        { name: 'منطقة زراعة كون توم', address: 'Đỉnh núi Ngọc Linh, xã Ngọc Lây, huyện Tu Mơ Rông, كون توم', hours: 'منطقة زراعية — غير مفتوحة للبيع المباشر', phone: '(84) 984 999 309' },
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
      subtitle: 'شارك مع TA في التوزيع والتصدير والتطوير الدولي لجينسينغ نغوك لينه.',
      distributorTitle: 'موزع',
      distributorDesc: 'كن موزعاً رسمياً لمنصة TA في منطقتك.',
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
      brandDesc: 'TA — منصة التداول الموثوقة لجينسينغ نغوك لينه، تربط مناطق الزراعة المعتمدة GACP-WHO بالمستهلكين بشفافية كاملة.',
      quickLinks: 'روابط سريعة',
      contact: 'اتصل بنا',
      followUs: 'تابعنا',
      address: '15°12\'N 108°18\'E، ترا لينه، نام ترا مي، كوانغ نام، فيتنام',
      phone: 'Zalo / WhatsApp: (84) 984 999 309',
      email: 'khanh@tasamngoclinh.com',
      copyright: '© 2026 TA. جميع الحقوق محفوظة.',
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
