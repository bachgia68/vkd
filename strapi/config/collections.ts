/**
 * Strapi Collections Configuration for TA (Sâm Ngọc Linh)
 *
 * Collections:
 * 1. Products: Ginseng products with images, descriptions, pricing
 * 2. BlogPosts: Blog articles with featured images, translations
 * 3. Media: Product images, blog images (optimized, <300KB)
 */

export const products = {
  displayName: 'Products',
  singularName: 'product',
  pluralName: 'products',
  description: 'Ginseng products catalog',
  kind: 'collectionType',
  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true,
    },
    slug: {
      type: 'uid',
      targetField: 'name',
    },
    description: {
      type: 'richtext',
    },
    price: {
      type: 'decimal',
      required: true,
    },
    currency: {
      type: 'enumeration',
      enum: ['VND', 'USD'],
      default: 'VND',
    },
    images: {
      type: 'media',
      multiple: true,
      allowedTypes: ['images'],
    },
    category: {
      type: 'string',
      enum: ['fresh', 'dried', 'extract', 'tea', 'supplement'],
    },
    stock: {
      type: 'integer',
      default: 0,
    },
    featured: {
      type: 'boolean',
      default: false,
    },
    metadata: {
      type: 'json',
    },
    createdAt: {
      type: 'datetime',
      private: true,
    },
    updatedAt: {
      type: 'datetime',
      private: true,
    },
  },
};

export const blogPosts = {
  displayName: 'Blog Posts',
  singularName: 'blog-post',
  pluralName: 'blog-posts',
  description: 'Blog articles about ginseng, health, farming',
  kind: 'collectionType',
  attributes: {
    title: {
      type: 'string',
      required: true,
      unique: true,
    },
    slug: {
      type: 'uid',
      targetField: 'title',
    },
    content: {
      type: 'richtext',
      required: true,
    },
    excerpt: {
      type: 'text',
      maxLength: 500,
    },
    featuredImage: {
      type: 'media',
      allowedTypes: ['images'],
    },
    author: {
      type: 'string',
      default: 'TA Team',
    },
    locale: {
      type: 'enumeration',
      enum: ['vi', 'en'],
      default: 'vi',
    },
    tags: {
      type: 'json',
    },
    published: {
      type: 'boolean',
      default: false,
    },
    publishedAt: {
      type: 'datetime',
    },
    createdAt: {
      type: 'datetime',
      private: true,
    },
    updatedAt: {
      type: 'datetime',
      private: true,
    },
  },
};

export const mediaFiles = {
  displayName: 'Media Files',
  singularName: 'media-file',
  pluralName: 'media-files',
  description: 'Optimized images (<300KB, webp)',
  kind: 'collectionType',
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    url: {
      type: 'string',
      required: true,
    },
    file: {
      type: 'media',
      allowedTypes: ['images'],
      required: true,
    },
    size: {
      type: 'integer',
      description: 'File size in bytes',
    },
    width: {
      type: 'integer',
    },
    height: {
      type: 'integer',
    },
    format: {
      type: 'enumeration',
      enum: ['webp', 'jpg', 'png'],
      default: 'webp',
    },
    type: {
      type: 'enumeration',
      enum: ['product', 'blog', 'hero', 'gallery'],
    },
    tags: {
      type: 'json',
    },
    quality: {
      type: 'enumeration',
      enum: ['low', 'medium', 'high'],
      default: 'high',
    },
    uploadedAt: {
      type: 'datetime',
      private: true,
    },
  },
};

export const siteHeader = {
  displayName: 'Site Header',
  singularName: 'site-header',
  pluralName: 'site-headers',
  description: 'Homepage header configuration (logo, nav, hero CTA)',
  kind: 'collectionType',
  attributes: {
    logoUrl: {
      type: 'string',
      description: 'Logo image URL or media ID',
    },
    logoAlt: {
      type: 'string',
      description: 'Logo alt text',
    },
    navLinks: {
      type: 'json',
      description: 'Navigation menu items: [{text, url, target?}]',
    },
    heroTitle: {
      type: 'string',
      description: 'Main hero section title',
    },
    heroSubtitle: {
      type: 'string',
      description: 'Hero section subtitle',
    },
    ctaButtonText: {
      type: 'string',
      description: 'Call-to-action button label',
    },
    ctaButtonLink: {
      type: 'string',
      description: 'CTA button URL',
    },
    ctaButtonStyle: {
      type: 'enumeration',
      enum: ['primary', 'secondary'],
      default: 'primary',
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
    updatedAt: {
      type: 'datetime',
      private: true,
    },
  },
};

export const siteFooter = {
  displayName: 'Site Footer',
  singularName: 'site-footer',
  pluralName: 'site-footers',
  description: 'Homepage footer configuration (company info, links, copyright)',
  kind: 'collectionType',
  attributes: {
    companyName: {
      type: 'string',
      description: 'Official company name',
    },
    companyAddress: {
      type: 'text',
      description: 'Physical address',
    },
    companyPhone: {
      type: 'string',
      description: 'Contact phone number',
    },
    companyEmail: {
      type: 'string',
      description: 'Support email',
    },
    footerLinks: {
      type: 'json',
      description: 'Footer link sections: [{title, links: [{text, url}]}]',
    },
    copyrightText: {
      type: 'text',
      description: 'Copyright notice',
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
    updatedAt: {
      type: 'datetime',
      private: true,
    },
  },
};

export const socialLinks = {
  displayName: 'Social Links',
  singularName: 'social-link',
  pluralName: 'social-links',
  description: 'Social media links for footer/header (YouTube, FB, Instagram, etc.)',
  kind: 'collectionType',
  attributes: {
    platform: {
      type: 'enumeration',
      enum: ['youtube', 'facebook', 'instagram', 'tiktok', 'twitter', 'linkedin', 'telegram', 'zalo', 'pinterest', 'snapchat'],
      required: true,
    },
    url: {
      type: 'string',
      required: true,
      description: 'Link to social profile',
    },
    icon: {
      type: 'string',
      description: 'Icon: emoji, SVG code, or icon library reference',
    },
    displayOrder: {
      type: 'integer',
      default: 0,
      description: 'Sort order in footer/header',
    },
    displayText: {
      type: 'string',
      description: 'Label shown on hover or alternative text',
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
    openInNewTab: {
      type: 'boolean',
      default: true,
    },
    createdAt: {
      type: 'datetime',
      private: true,
    },
    updatedAt: {
      type: 'datetime',
      private: true,
    },
  },
};
