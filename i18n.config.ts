/**
 * i18n Configuration for next-intl
 * Support: Vietnamese (vi), English (en)
 */

export const i18n = {
  locales: ['vi', 'en'] as const,
  defaultLocale: 'vi' as const,
  localePrefix: 'always' as const,
};

export type Locale = (typeof i18n.locales)[number];

// Translation messages
export const messages = {
  vi: {
    common: {
      home: 'Trang chủ',
      products: 'Sản phẩm',
      blog: 'Blog',
      contact: 'Liên hệ',
      about: 'Giới thiệu',
      chat: 'Chat với AI',
    },
    hero: {
      title: 'Vườn Sâm Ngọc Linh nhà Khánh',
      subtitle: 'Sâm Ngọc Linh chính gốc, chất lượng hàng đầu',
      cta: 'Khám phá ngay',
    },
    footer: {
      address: '📍 Vườn sâm Ngọc Linh nhà Khánh',
      phone: '☎️ 0984999309',
      email: '✉️ tasamngoclinh@gmail.com',
      copyright: '© 2026 Vườn sâm Ngọc Linh nhà Khánh. Bản quyền được bảo vệ.',
    },
  },
  en: {
    common: {
      home: 'Home',
      products: 'Products',
      blog: 'Blog',
      contact: 'Contact',
      about: 'About',
      chat: 'Chat with AI',
    },
    hero: {
      title: 'Khanh\'s Ngoc Linh Ginseng Farm',
      subtitle: 'Premium authentic Ngoc Linh Ginseng, highest quality',
      cta: 'Explore now',
    },
    footer: {
      address: '📍 Khanh\'s Ngoc Linh Ginseng Farm',
      phone: '☎️ 0984999309',
      email: '✉️ tasamngoclinh@gmail.com',
      copyright: '© 2026 Khanh\'s Ngoc Linh Ginseng Farm. All rights reserved.',
    },
  },
};
