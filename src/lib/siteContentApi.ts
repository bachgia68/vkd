import { supabase } from './supabaseClient';

// Public-facing reads for site content editable from the admin Settings/CMS
// pages (addresses, contact phones, social links, blog posts) plus anonymous
// B2B lead submission. RLS grants public SELECT on these tables; writes are
// gated to admins in ../admin/adminApi.ts. B2B lead inserts go through the
// submit_b2b_lead() SECURITY DEFINER RPC since anonymous visitors have no
// direct table access — same pattern as record_payos_order() for checkout.

export interface SiteAddress {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  category: 'showroom' | 'growing_region';
}

export async function fetchSiteAddresses(): Promise<SiteAddress[]> {
  const { data, error } = await supabase
    .from('site_addresses')
    .select('id, name, address, hours, phone, category')
    .eq('visible', true)
    .order('created_at');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface ContactPhone {
  id: string;
  label: string;
  value: string;
}

export async function fetchContactPhones(): Promise<ContactPhone[]> {
  const { data, error } = await supabase
    .from('contact_phones')
    .select('id, label, value')
    .eq('visible', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('social_links')
    .select('id, platform, url')
    .eq('visible', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface FieldVideo {
  id: string;
  facebook_url: string;
  thumbnail_url: string;
  title: string;
  subtitle: string;
  sort_order: number;
}

export async function fetchFieldVideos(): Promise<FieldVideo[]> {
  const { data, error } = await supabase
    .from('field_videos')
    .select('id, facebook_url, thumbnail_url, title, subtitle, sort_order')
    .eq('visible', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  created_at: string;
  published: boolean;
  captions?: Record<string, string>;
  meta_description?: string | null;
  author?: string | null;
  featured?: boolean | null;
  pinned?: boolean | null;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, body, featured_image_url, featured_image_alt, created_at, published, meta_description')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

// Admin-only: includes unpublished drafts (e.g. from the unattended daily
// content routine) so they can be reviewed before going live.
export async function fetchAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, body, featured_image_url, featured_image_alt, created_at, published, captions, author, featured, pinned')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Route /blog/<slug> là chuẩn (đọc được, chuẩn SEO — xem docs/DESIGN_SYSTEM.md).
// Vẫn chấp nhận UUID cũ (post.id) để không vỡ link đã chia sẻ trước khi cột
// slug được thêm vào (2026-08-14) — nhưng KHÔNG dùng .or('id.eq.<slug>')
// chung với slug thường: cột id là kiểu uuid, PostgREST sẽ lỗi 400
// "invalid input syntax for type uuid" nếu giá trị không phải UUID hợp lệ.
export async function fetchBlogPost(slugOrId: string): Promise<BlogPost | null> {
  const query = supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, body, featured_image_url, featured_image_alt, created_at, published, meta_description')
    .eq('published', true);
  const { data, error } = await (UUID_RE.test(slugOrId) ? query.eq('id', slugOrId) : query.eq('slug', slugOrId)).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export interface TrustProofItem {
  id: string;
  kind: 'testimonial' | 'press' | 'photo';
  quote_text: string;
  source_name: string;
  source_url: string | null;
  image_url: string | null;
  sort_order: number;
}

export async function fetchTrustProofItems(): Promise<TrustProofItem[]> {
  const { data, error } = await supabase
    .from('trust_proof_items')
    .select('id, kind, quote_text, source_name, source_url, image_url, sort_order')
    .eq('published', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface ComboSet {
  id: string;
  slug: string;
  name_vi: string;
  theme: string;
  month_tags: number[];
  component_skus: string[];
  price_vnd: number;
  poster_image_url: string | null;
  description_vi: string;
  sort_order: number;
}

export async function fetchActiveComboSets(): Promise<ComboSet[]> {
  const { data, error } = await supabase
    .from('combo_sets')
    .select('id, slug, name_vi, theme, month_tags, component_skus, price_vnd, poster_image_url, description_vi, sort_order')
    .eq('active', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface SiteSection {
  id: string;
  key: string;
  label_vi: string;
  nav_group: string;
  path: string;
  sort_order: number;
}

export interface HeritageGalleryImage {
  id: string;
  image_url: string;
  alt_vi: string;
  alt_en: string;
  location: string;
  captured_date: string | null;
  sort_order: number;
}

export async function fetchHeritageGalleryImages(): Promise<HeritageGalleryImage[]> {
  const { data, error } = await supabase
    .from('heritage_gallery_images')
    .select('id, image_url, alt_vi, alt_en, location, captured_date, sort_order')
    .eq('visible', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchVisibleSections(): Promise<SiteSection[]> {
  const { data, error } = await supabase
    .from('site_sections')
    .select('id, key, label_vi, nav_group, path, sort_order')
    .eq('visible', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ---------- Languages (which languages show in Header/Footer language switcher) ----------

export interface SiteLanguage {
  id: string;
  key: string;
  label: string;
  sort_order: number;
}

export async function fetchVisibleLanguages(): Promise<SiteLanguage[]> {
  const { data, error } = await supabase
    .from('site_languages')
    .select('id, key, label, sort_order')
    .eq('visible', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ---------- Text overrides (admin-edited Header/Footer copy, fallback to translations.ts) ----------

export async function fetchTextOverrides(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('site_text_overrides').select('key, value_vi');
  if (error) throw new Error(error.message);
  const map: Record<string, string> = {};
  (data ?? []).forEach((row) => {
    map[row.key] = row.value_vi;
  });
  return map;
}

export async function submitCustomerLead(input: {
  name: string;
  phone: string;
  interest: string;
  message: string;
}) {
  const { error } = await supabase.rpc('submit_customer_lead', {
    p_name: input.name,
    p_phone: input.phone,
    p_interest: input.interest,
    p_message: input.message,
  });
  if (error) throw new Error(error.message);
}

export type B2BLeadType = 'distributor' | 'investor' | 'oem';

export async function submitB2BLead(input: {
  type: B2BLeadType;
  name: string;
  phone: string;
  email: string;
  message: string;
}) {
  const { error } = await supabase.rpc('submit_b2b_lead', {
    p_type: input.type,
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email,
    p_message: input.message,
  });
  if (error) throw new Error(error.message);
}

// Live price/stock/visibility overrides from the admin "Sản phẩm & Kho" page.
// The static catalog in ../data/products.ts stays the source of truth for
// content (name, description, images, taxonomy) — a full CMS migration is a
// separate, much larger project. This overlay is the surgical fix for the
// concrete gap: editing price/stock/hide-product in admin previously had zero
// effect on what customers saw. Goes through get_product_overrides() (a
// SECURITY DEFINER RPC) rather than a plain table read because RLS on
// products only exposes active=true rows — a plain SELECT can't distinguish
// "SKU not tracked in Supabase yet" from "admin explicitly hid this SKU",
// and only the RPC path lets us tell those apart correctly.
export interface ProductOverride {
  sku: string;
  price_vnd: number | null;
  active: boolean;
  stock_qty: number;
}

export async function fetchProductOverrides(): Promise<ProductOverride[]> {
  const { data, error } = await supabase.rpc('get_product_overrides');
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ---------- Page Sections (admin-editable blocks for homepage/subpages) ----------

export interface PageSection {
  id: string;
  page_key: string;
  block_type: string;
  sort_order: number;
  title_vi: string | null;
  content_vi: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_url: string | null;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

// ---------- Nav Items ----------

export interface NavItem {
  id: string;
  key: string;
  label_vi: string;
  href: string;
  sort_order: number;
  visible: boolean;
}

export async function fetchVisibleNavItems(): Promise<NavItem[]> {
  const { data, error } = await supabase
    .from('nav_items')
    .select('id, key, label_vi, href, sort_order, visible')
    .eq('visible', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchPageSections(pageKey: string): Promise<PageSection[]> {
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_key', pageKey)
    .eq('visible', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ---------- Blog Categories ----------

export interface BlogCategory {
  id: string;
  slug: string;
  name_vi: string;
  sort_order: number;
  visible: boolean;
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('id, slug, name_vi, sort_order, visible')
    .eq('visible', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ---------- Product Menu Items ----------

export interface ProductMenuItem {
  id: string;
  section: string;
  slug: string;
  label_vi: string;
  label_en: string;
  href: string;
  sort_order: number;
  visible: boolean;
}

export async function fetchProductMenuItems(): Promise<ProductMenuItem[]> {
  const { data, error } = await supabase
    .from('product_menu_items')
    .select('id, section, slug, label_vi, label_en, href, sort_order, visible')
    .eq('visible', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ---------- Policy Pages ----------

export interface PolicyPageContent {
  id: string;
  policy_key: string;
  title_vi: string;
  body_vi: string;
  updated_label: string;
}

export async function fetchPolicyPage(policyKey: string): Promise<PolicyPageContent | null> {
  const { data, error } = await supabase
    .from('policy_pages')
    .select('id, policy_key, title_vi, body_vi, updated_label')
    .eq('policy_key', policyKey)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

// ---------- Site Settings ----------

export async function fetchSiteSetting(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) return null;
  return data?.value ?? null;
}
