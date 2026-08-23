export type Language = 'vi' | 'en' | 'fr' | 'zh';

export interface MultilingualText {
  vi: string;
  en?: string;
  fr?: string;
  zh?: string;
}

export interface NavLink {
  text: MultilingualText;
  url: string;
  target?: '_blank' | '_self';
}

export interface SiteHeader {
  id: string;
  logoUrl?: string;
  logoAlt?: string;
  navLinks?: NavLink[];
  heroTitle?: MultilingualText;
  heroSubtitle?: MultilingualText;
  ctaButtonText?: MultilingualText;
  ctaButtonLink?: string;
  ctaButtonStyle?: 'primary' | 'secondary';
  isActive: boolean;
  updatedAt?: string;
}

export interface FooterLink {
  text: MultilingualText;
  url: string;
}

export interface FooterLinkSection {
  title: MultilingualText;
  links: FooterLink[];
}

export interface SiteFooter {
  id: string;
  companyName?: MultilingualText;
  companyAddress?: MultilingualText;
  companyPhone?: string;
  companyEmail?: string;
  footerLinks?: FooterLinkSection[];
  copyrightText?: MultilingualText;
  isActive: boolean;
  updatedAt?: string;
}

export interface SocialLink {
  id: string;
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitter' | 'linkedin' | 'telegram' | 'zalo' | 'pinterest' | 'snapchat' | 'whatsapp';
  url: string;
  icon?: string;
  displayOrder: number;
  displayText?: MultilingualText;
  isActive: boolean;
  openInNewTab: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: MultilingualText;
  displayOrder: number;
}

export interface Product {
  id: string;
  sku: string;
  name: MultilingualText;
  description: MultilingualText;
  shortDescription?: MultilingualText;
  price: number;
  salePrice?: number;
  images: ProductImage[];
  category?: string;
  tags?: string[];
  attributes?: Record<string, string>;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  stock: number;
  isActive: boolean;
  featured: boolean;
  seoTitle?: MultilingualText;
  seoDescription?: MultilingualText;
  seoKeywords?: string[];
  createdAt?: string;
  updatedAt?: string;
}
