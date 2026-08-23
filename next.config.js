/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['localhost', 'tasamngoclinh.com'],
  },
  env: {
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
  },
};

module.exports = withNextIntl(nextConfig);
