#!/usr/bin/env node

/**
 * Strapi Collections Auto-Setup Script
 * Creates collections and sample data for TA project
 */

const STRAPI_URL = 'http://localhost:1337';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin@123';

let JWT_TOKEN = '';

async function request(method, path, body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (JWT_TOKEN) {
    headers.Authorization = `Bearer ${JWT_TOKEN}`;
  }

  const options = {
    method,
    headers,
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${STRAPI_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    console.error(`❌ Error: ${response.status}`, data);
    throw new Error(`API Error: ${data.error?.message || 'Unknown error'}`);
  }
  return data;
}

async function authenticate() {
  console.log('🔐 Authenticating...');
  try {
    const data = await request('POST', '/api/auth/local', {
      identifier: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    JWT_TOKEN = data.jwt;
    console.log('✅ Authenticated');
  } catch (err) {
    console.error('❌ Authentication failed. Make sure Strapi admin user exists.');
    throw err;
  }
}

async function createSampleProducts() {
  console.log('📦 Creating sample products...');
  const products = [
    {
      sku: 'SAM-001',
      name: { vi: 'Sâm Ngọc Linh Premium 6 tuổi', en: 'Premium Ngoc Linh Ginseng 6 years', fr: 'Ginseng Premium Ngoc Linh 6 ans', zh: '高丽参 6 年期' },
      description: { vi: 'Sâm tự nhiên 100% từ rừng Ngọc Linh', en: 'Natural ginseng 100% from Ngoc Linh forest', fr: 'Ginseng naturel 100% de la forêt Ngoc Linh', zh: '天然高丽参，产自崇山峻岭' },
      shortDescription: { vi: 'Sâm 6 tuổi chất lượng premium', en: 'Premium 6-year ginseng', fr: 'Ginseng premium 6 ans', zh: '优质 6 年期参' },
      price: 500000,
      salePrice: 450000,
      category: 'ginseng',
      stock: 25,
      featured: true,
      isActive: true,
    },
    {
      sku: 'SAM-002',
      name: { vi: 'Sâm Ngọc Linh 3 tuổi', en: 'Ngoc Linh Ginseng 3 years', fr: 'Ginseng Ngoc Linh 3 ans', zh: '高丽参 3 年期' },
      description: { vi: 'Sâm 3 tuổi giá cả hợp lý', en: 'Affordable 3-year ginseng', fr: 'Ginseng 3 ans abordable', zh: '价格实惠的 3 年期参' },
      shortDescription: { vi: 'Sâm 3 tuổi giá tốt', en: 'Affordable ginseng', fr: 'Ginseng abordable', zh: '实惠参' },
      price: 250000,
      salePrice: 220000,
      category: 'ginseng',
      stock: 50,
      featured: true,
      isActive: true,
    },
    {
      sku: 'SAM-003',
      name: { vi: 'Trà Sâm Ngọc Linh', en: 'Ngoc Linh Ginseng Tea', fr: 'Thé Ginseng Ngoc Linh', zh: '高丽参茶' },
      description: { vi: 'Trà từ sâm Ngọc Linh thơm ngon', en: 'Delicious ginseng tea', fr: 'Thé de ginseng délicieux', zh: '美味参茶' },
      shortDescription: { vi: 'Trà sâm chất lượng cao', en: 'High quality tea', fr: 'Thé de qualité', zh: '优质茶' },
      price: 150000,
      category: 'tea',
      stock: 100,
      featured: false,
      isActive: true,
    },
  ];

  for (const product of products) {
    try {
      await request('POST', '/api/products', { data: product });
      console.log(`  ✅ Created: ${product.name.vi}`);
    } catch (err) {
      console.log(`  ⚠️  Product ${product.sku} may already exist`);
    }
  }
}

async function createSiteHeader() {
  console.log('🎨 Creating site header...');
  const header = {
    logoUrl: '/images/logo.png',
    logoAlt: 'TA Logo',
    navLinks: [
      { text: { vi: 'Trang chủ', en: 'Home', fr: 'Accueil', zh: '首页' }, url: '/', target: '_self' },
      { text: { vi: 'Sản phẩm', en: 'Products', fr: 'Produits', zh: '产品' }, url: '/products', target: '_self' },
      { text: { vi: 'Blog', en: 'Blog', fr: 'Blog', zh: '博客' }, url: '/blog', target: '_self' },
    ],
    heroTitle: { vi: 'Sâm Ngọc Linh - Chất lượng hàng đầu', en: 'Premium Ngoc Linh Ginseng', fr: 'Ginseng Ngoc Linh Premium', zh: '顶级高丽参' },
    heroSubtitle: { vi: 'Chăm sóc sức khỏe tự nhiên', en: 'Natural health care', fr: 'Soins de santé naturels', zh: '天然健康护理' },
    ctaButtonText: { vi: 'Mua ngay', en: 'Shop now', fr: 'Acheter maintenant', zh: '立即购买' },
    ctaButtonLink: '/products',
    ctaButtonStyle: 'primary',
    isActive: true,
  };

  try {
    await request('POST', '/api/site-headers', { data: header });
    console.log('✅ Site header created');
  } catch (err) {
    console.log('⚠️  Header may already exist');
  }
}

async function createSiteFooter() {
  console.log('🔗 Creating site footer...');
  const footer = {
    companyName: { vi: 'Công ty TNHH TA', en: 'TA Company', fr: 'Entreprise TA', zh: 'TA 公司' },
    companyAddress: { vi: '123 Đường Sâm, Kon Tum, Việt Nam', en: '123 Ginseng Street, Kon Tum, Vietnam', fr: '123 Rue du Ginseng, Kon Tum, Vietnam', zh: '越南昆嗣省参街 123 号' },
    companyPhone: '0984999309',
    companyEmail: 'contact@ta.local',
    copyrightText: { vi: '© 2026 TA. Bảo lưu mọi quyền.', en: '© 2026 TA. All rights reserved.', fr: '© 2026 TA. Tous droits réservés.', zh: '© 2026 TA. 版权所有。' },
    isActive: true,
  };

  try {
    await request('POST', '/api/site-footers', { data: footer });
    console.log('✅ Site footer created');
  } catch (err) {
    console.log('⚠️  Footer may already exist');
  }
}

async function createSocialLinks() {
  console.log('📱 Creating social links...');
  const links = [
    { platform: 'facebook', url: 'https://facebook.com/tasamngoclinh', displayOrder: 1, displayText: { vi: 'Facebook', en: 'Facebook', fr: 'Facebook', zh: '脸书' }, isActive: true, openInNewTab: true },
    { platform: 'instagram', url: 'https://instagram.com/tasamngoclinh', displayOrder: 2, displayText: { vi: 'Instagram', en: 'Instagram', fr: 'Instagram', zh: '抖音' }, isActive: true, openInNewTab: true },
    { platform: 'youtube', url: 'https://youtube.com/@tasamngoclinh', displayOrder: 3, displayText: { vi: 'YouTube', en: 'YouTube', fr: 'YouTube', zh: 'YouTube' }, isActive: true, openInNewTab: true },
    { platform: 'telegram', url: 'https://t.me/tasamngoclinh_bot', displayOrder: 4, displayText: { vi: 'Telegram', en: 'Telegram', fr: 'Telegram', zh: 'Telegram' }, isActive: true, openInNewTab: true },
    { platform: 'zalo', url: 'https://zalo.me/tasamngoclinh', displayOrder: 5, displayText: { vi: 'Zalo', en: 'Zalo', fr: 'Zalo', zh: 'Zalo' }, isActive: true, openInNewTab: true },
  ];

  for (const link of links) {
    try {
      await request('POST', '/api/social-links', { data: link });
      console.log(`  ✅ Created: ${link.platform}`);
    } catch (err) {
      console.log(`  ⚠️  ${link.platform} may already exist`);
    }
  }
}

async function main() {
  console.log('🚀 Starting Strapi setup...\n');

  try {
    await authenticate();
    await createSampleProducts();
    await createSiteHeader();
    await createSiteFooter();
    await createSocialLinks();

    console.log('\n✅ Setup complete!');
    console.log('📊 Access Strapi admin: http://localhost:1337/admin');
  } catch (err) {
    console.error('\n❌ Setup failed:', err.message);
    process.exit(1);
  }
}

main();
