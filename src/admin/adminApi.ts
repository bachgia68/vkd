import { supabase } from '../lib/supabaseClient';
import { fetchAllBlogPostsForAdmin } from '../lib/siteContentApi';
import { slugify } from '../lib/slugify';
import type { SiteAddress, ContactPhone, SocialLink, BlogPost, TrustProofItem, ComboSet, SiteSection, HeritageGalleryImage } from '../lib/siteContentApi';
import type { DbOrder, DbRevenueDaily } from './types/admin';

export type { SiteAddress, ContactPhone, SocialLink, BlogPost, TrustProofItem, ComboSet, SiteSection, HeritageGalleryImage };
export { fetchAllBlogPostsForAdmin };
export type { DbOrder, DbRevenueDaily };

// Shared data-access layer for the admin panel. All reads/writes go through
// the Supabase client with the signed-in admin's session — RLS policies
// (is_admin() = auth.jwt().app_metadata.role = 'admin') gate every table here.

function throwIfError<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

// ---------- Products ----------

export interface DbProduct {
  id: string;
  sku: string;
  name_vi: string;
  category_id: number | null;
  price_vnd: number | null;
  active: boolean;
  stock_qty: number;
  low_stock_threshold: number;
  image_url: string | null;
}

export interface ProductCategory {
  id: number;
  code: string;
  name_vi: string;
}

export async function fetchProducts(): Promise<DbProduct[]> {
  return throwIfError(
    await supabase
      .from('products')
      .select('id, sku, name_vi, category_id, price_vnd, active, stock_qty, low_stock_threshold, image_url')
      .order('sku')
  );
}

export async function fetchProductCategories(): Promise<ProductCategory[]> {
  return throwIfError(await supabase.from('product_categories').select('id, code, name_vi').order('id'));
}

export async function createProduct(input: {
  sku: string;
  name_vi: string;
  category_id: number | null;
  price_vnd: number;
}): Promise<DbProduct> {
  const res = await supabase
    .from('products')
    .insert({ ...input, active: true, stock_qty: 0 })
    .select('id, sku, name_vi, category_id, price_vnd, active, stock_qty, low_stock_threshold, image_url')
    .single();
  return throwIfError(res);
}

export async function updateProduct(id: string, patch: Partial<Pick<DbProduct, 'name_vi' | 'price_vnd' | 'active' | 'stock_qty' | 'category_id'>>) {
  const { error } = await supabase.from('products').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string): Promise<{ error?: string }> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return { error: error.message };
  return {};
}

// ---------- CRM ----------

export interface CrmCustomer {
  id: string;
  full_name: string | null;
  email: string | null;
  tier: 'Platinum' | 'Gold' | 'Silver';
  spend: number;
  lastOrderAt: string | null;
  sensitive_data_purged: boolean;
}

export interface ConsentLogRow {
  id: string;
  customer_id: string | null;
  event: string;
  source: string;
  status: string;
  created_at: string;
}

export async function fetchCrmCustomers(): Promise<CrmCustomer[]> {
  const customers = throwIfError(
    await supabase.from('customers').select('id, full_name, email, sensitive_data_purged')
  );
  const members = throwIfError(await supabase.from('elite_club_members').select('customer_id, tier'));
  const orders = throwIfError(await supabase.from('orders').select('customer_id, total, created_at').eq('status', 'paid'));

  const tierByCustomer = new Map(members.map((m: { customer_id: string | null; tier: string }) => [m.customer_id, m.tier]));
  const spendByCustomer = new Map<string, { spend: number; last: string | null }>();
  for (const o of orders as { customer_id: string | null; total: number; created_at: string }[]) {
    if (!o.customer_id) continue;
    const cur = spendByCustomer.get(o.customer_id) ?? { spend: 0, last: null };
    cur.spend += Number(o.total);
    if (!cur.last || o.created_at > cur.last) cur.last = o.created_at;
    spendByCustomer.set(o.customer_id, cur);
  }

  return (customers as { id: string; full_name: string | null; email: string | null; sensitive_data_purged: boolean }[]).map((c) => ({
    id: c.id,
    full_name: c.full_name,
    email: c.email,
    tier: (tierByCustomer.get(c.id) as CrmCustomer['tier']) ?? 'Silver',
    spend: spendByCustomer.get(c.id)?.spend ?? 0,
    lastOrderAt: spendByCustomer.get(c.id)?.last ?? null,
    sensitive_data_purged: c.sensitive_data_purged,
  }));
}

export async function fetchConsentLog(customerId: string): Promise<ConsentLogRow[]> {
  return throwIfError(
    await supabase
      .from('consent_log')
      .select('id, customer_id, event, source, status, created_at')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
  );
}

// ---------- TA Elite Club (loyalty) ----------

export interface LoyaltyMember {
  id: string;
  member_code: string;
  tier: string;
  points_balance: number;
  lifetime_points: number;
  joined_at: string;
  customer_full_name: string | null;
  customer_email: string | null;
}

export async function fetchLoyaltyMembers(): Promise<LoyaltyMember[]> {
  const members = throwIfError(
    await supabase
      .from('elite_club_members')
      .select('id, member_code, tier, points_balance, lifetime_points, joined_at, customer_id')
      .order('lifetime_points', { ascending: false })
  );
  const ids = (members as { customer_id: string | null }[]).map((m) => m.customer_id).filter(Boolean);
  const customers = ids.length
    ? throwIfError(await supabase.from('customers').select('id, full_name, email').in('id', ids))
    : [];
  const byId = new Map((customers as { id: string; full_name: string | null; email: string | null }[]).map((c) => [c.id, c]));

  return (members as { id: string; member_code: string; tier: string; points_balance: number; lifetime_points: number; joined_at: string; customer_id: string | null }[]).map((m) => ({
    id: m.id,
    member_code: m.member_code,
    tier: m.tier,
    points_balance: m.points_balance,
    lifetime_points: m.lifetime_points,
    joined_at: m.joined_at,
    customer_full_name: (m.customer_id && byId.get(m.customer_id)?.full_name) ?? null,
    customer_email: (m.customer_id && byId.get(m.customer_id)?.email) ?? null,
  }));
}

export async function purgeSensitiveData(customerId: string) {
  const { error } = await supabase.from('customers').update({ sensitive_data_purged: true }).eq('id', customerId);
  if (error) throw new Error(error.message);
  await supabase.from('consent_log').insert({
    customer_id: customerId,
    event: 'Yêu cầu xoá dữ liệu nhạy cảm',
    source: 'Admin panel',
    status: 'Đã xử lý',
  });
}

// ---------- Inventory / Warehouses ----------

export interface Warehouse {
  code: string;
  name: string;
  type: 'central' | 'showroom';
  province: string;
  lat: number;
  lng: number;
}

export interface InventoryRow {
  product_id: string;
  sku: string;
  name: string;
  threshold: number;
  stock: Record<string, number>;
}

export async function fetchWarehouses(): Promise<Warehouse[]> {
  return throwIfError(await supabase.from('warehouses').select('code, name, type, province, lat, lng').order('code'));
}

export async function fetchInventory(): Promise<InventoryRow[]> {
  const products = throwIfError(
    await supabase.from('products').select('id, sku, name_vi, low_stock_threshold').eq('active', true).order('sku')
  );
  const levels = throwIfError(await supabase.from('inventory_levels').select('warehouse_code, product_id, qty'));

  const byProduct = new Map<string, Record<string, number>>();
  for (const l of levels as { warehouse_code: string; product_id: string; qty: number }[]) {
    const rec = byProduct.get(l.product_id) ?? {};
    rec[l.warehouse_code] = l.qty;
    byProduct.set(l.product_id, rec);
  }

  return (products as { id: string; sku: string; name_vi: string; low_stock_threshold: number }[]).map((p) => ({
    product_id: p.id,
    sku: p.sku,
    name: p.name_vi,
    threshold: p.low_stock_threshold,
    stock: byProduct.get(p.id) ?? {},
  }));
}

export async function fetchQrHeatmap(): Promise<{ region: string; count: number; suspect: boolean }[]> {
  const rows = throwIfError(await supabase.from('qr_scan_events').select('region, suspect'));
  const byRegion = new Map<string, { count: number; suspect: boolean }>();
  for (const r of rows as { region: string | null; suspect: boolean }[]) {
    if (!r.region) continue;
    const cur = byRegion.get(r.region) ?? { count: 0, suspect: false };
    cur.count += 1;
    cur.suspect = cur.suspect || r.suspect;
    byRegion.set(r.region, cur);
  }
  return Array.from(byRegion.entries())
    .map(([region, v]) => ({ region, ...v }))
    .sort((a, b) => b.count - a.count);
}

export async function setInventoryLevel(warehouseCode: string, productId: string, qty: number) {
  const { error } = await supabase
    .from('inventory_levels')
    .upsert({ warehouse_code: warehouseCode, product_id: productId, qty, updated_at: new Date().toISOString() }, { onConflict: 'warehouse_code,product_id' });
  if (error) throw new Error(error.message);
}

export interface TransferLogRow {
  id: string;
  from_code: string;
  to_code: string;
  sku: string;
  qty: number;
  created_at: string;
}

export async function fetchTransferLog(): Promise<TransferLogRow[]> {
  const rows = throwIfError(
    await supabase
      .from('inventory_transfers')
      .select('id, from_code, to_code, qty, created_at, products(sku)')
      .order('created_at', { ascending: false })
      .limit(20)
  );
  return (
    rows as unknown as {
      id: string;
      from_code: string;
      to_code: string;
      qty: number;
      created_at: string;
      products: { sku: string } | { sku: string }[] | null;
    }[]
  ).map((r) => ({
    id: r.id,
    from_code: r.from_code,
    to_code: r.to_code,
    sku: (Array.isArray(r.products) ? r.products[0]?.sku : r.products?.sku) ?? '',
    qty: r.qty,
    created_at: r.created_at,
  }));
}

export async function transferStock(fromCode: string, toCode: string, productId: string, qty: number) {
  const levels = throwIfError(
    await supabase.from('inventory_levels').select('warehouse_code, qty').eq('product_id', productId).in('warehouse_code', [fromCode, toCode])
  );
  const fromQty = (levels as { warehouse_code: string; qty: number }[]).find((l) => l.warehouse_code === fromCode)?.qty ?? 0;
  const toQty = (levels as { warehouse_code: string; qty: number }[]).find((l) => l.warehouse_code === toCode)?.qty ?? 0;
  if (qty > fromQty) throw new Error(`Kho nguồn chỉ còn ${fromQty} sản phẩm, không đủ để chuyển ${qty}.`);

  await setInventoryLevel(fromCode, productId, fromQty - qty);
  await setInventoryLevel(toCode, productId, toQty + qty);
  const { error } = await supabase.from('inventory_transfers').insert({ from_code: fromCode, to_code: toCode, product_id: productId, qty });
  if (error) throw new Error(error.message);
}

// ---------- CMS ----------

export interface CmsArticle {
  id: string;
  title: string;
  stage: 0 | 1 | 2;
  body: string;
}

export async function fetchArticles(): Promise<CmsArticle[]> {
  return throwIfError(await supabase.from('cms_articles').select('id, title, stage, body').order('created_at', { ascending: false }));
}

export async function createArticle(title: string): Promise<CmsArticle> {
  const res = await supabase.from('cms_articles').insert({ title, stage: 0, body: '' }).select('id, title, stage, body').single();
  return throwIfError(res);
}

export async function updateArticle(id: string, patch: Partial<Pick<CmsArticle, 'body' | 'stage'>>) {
  const { error } = await supabase.from('cms_articles').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
}

// ---------- Agents / Dealers ----------

export interface Agent {
  id: string;
  code: string;
  name: string;
  tier: 'Cấp 1' | 'Cấp 2' | 'Affiliate KOL/KOC';
  discount_pct: number;
  revenue: number;
  status: 'active' | 'paused';
}

export async function fetchAgents(): Promise<Agent[]> {
  return throwIfError(await supabase.from('agents').select('id, code, name, tier, discount_pct, revenue, status').order('code'));
}

export async function createAgent(input: { code: string; name: string; tier: Agent['tier']; discount_pct: number }): Promise<Agent> {
  const res = await supabase
    .from('agents')
    .insert({ ...input, revenue: 0, status: 'active' })
    .select('id, code, name, tier, discount_pct, revenue, status')
    .single();
  return throwIfError(res);
}

export async function updateAgent(id: string, patch: Partial<Pick<Agent, 'discount_pct' | 'status'>>) {
  const { error } = await supabase.from('agents').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}

// ---------- Revenue ----------

export interface ChannelRevenueRow {
  channel: string;
  revenue: number;
  orders: number;
  share: number;
}

export async function fetchChannelRevenue(): Promise<ChannelRevenueRow[]> {
  const orders = throwIfError(await supabase.from('orders').select('total').eq('status', 'paid'));
  const onlineRevenue = (orders as { total: number }[]).reduce((s, o) => s + Number(o.total), 0);
  const showroomEntries = throwIfError(
    await supabase.from('showroom_revenue_entries').select('revenue_amount, orders_count').eq('is_demo', false)
  );
  const showroomRevenue = (showroomEntries as { revenue_amount: number; orders_count: number }[]).reduce(
    (s, e) => s + Number(e.revenue_amount),
    0
  );
  const showroomOrders = (showroomEntries as { revenue_amount: number; orders_count: number }[]).reduce(
    (s, e) => s + Number(e.orders_count),
    0
  );
  const rows: ChannelRevenueRow[] = [
    { channel: 'Website/TMĐT (Online)', revenue: onlineRevenue, orders: orders.length, share: 0 },
    { channel: 'Showroom (Offline)', revenue: showroomRevenue, orders: showroomOrders, share: 0 },
    { channel: 'Affiliate (KOL/KOC)', revenue: 0, orders: 0, share: 0 },
    { channel: 'Nhà thuốc/Siêu thị (OTC-KA)', revenue: 0, orders: 0, share: 0 },
  ];
  const total = rows.reduce((s, r) => s + r.revenue, 0) || 1;
  return rows.map((r) => ({ ...r, share: Math.round((r.revenue / total) * 100) }));
}

export interface SocialCampaignRow {
  platform: string;
  reach: number;
  engagement: number;
  conversions: number;
  convRate: number;
}

export async function fetchSocialCampaigns(): Promise<SocialCampaignRow[]> {
  const rows = throwIfError(await supabase.from('social_campaign_stats').select('platform, reach, engagement, conversions'));
  return (rows as { platform: string; reach: number; engagement: number; conversions: number }[]).map((r) => ({
    ...r,
    convRate: r.reach > 0 ? Math.round((r.conversions / r.reach) * 10000) / 100 : 0,
  }));
}

// ---------- Batches / QR truy xuất ----------

export interface CultivationRegion {
  code: string;
  name_vi: string;
  province: string;
}

export interface Batch {
  id: string;
  batch_id: string;
  product_id: string;
  product_sku: string;
  product_name: string;
  cultivation_region_code: string | null;
  cultivation_region_name: string | null;
  harvest_date: string | null;
  qc_status: string;
  qty_kg: number | null;
  warehouse_location: string | null;
  qr_hash: string;
  created_at: string;
  is_demo: boolean;
}

export async function fetchCultivationRegions(): Promise<CultivationRegion[]> {
  return throwIfError(await supabase.from('cultivation_regions').select('code, name_vi, province').order('code'));
}

export async function fetchBatches(): Promise<Batch[]> {
  const rows = throwIfError(
    await supabase
      .from('batches')
      .select(
        'id, batch_id, product_id, cultivation_region_code, harvest_date, qc_status, qty_kg, warehouse_location, qr_hash, created_at, is_demo, products(sku, name_vi), cultivation_regions(name_vi)'
      )
      .order('created_at', { ascending: false })
  );
  return (
    rows as unknown as {
      id: string;
      batch_id: string;
      product_id: string;
      cultivation_region_code: string | null;
      harvest_date: string | null;
      qc_status: string;
      qty_kg: number | null;
      warehouse_location: string | null;
      qr_hash: string;
      created_at: string;
      is_demo: boolean;
      products: { sku: string; name_vi: string } | { sku: string; name_vi: string }[] | null;
      cultivation_regions: { name_vi: string } | { name_vi: string }[] | null;
    }[]
  ).map((r) => {
    const product = Array.isArray(r.products) ? r.products[0] : r.products;
    const region = Array.isArray(r.cultivation_regions) ? r.cultivation_regions[0] : r.cultivation_regions;
    return {
      id: r.id,
      batch_id: r.batch_id,
      product_id: r.product_id,
      product_sku: product?.sku ?? '',
      product_name: product?.name_vi ?? '',
      cultivation_region_code: r.cultivation_region_code,
      cultivation_region_name: region?.name_vi ?? null,
      harvest_date: r.harvest_date,
      qc_status: r.qc_status,
      qty_kg: r.qty_kg,
      warehouse_location: r.warehouse_location,
      qr_hash: r.qr_hash,
      created_at: r.created_at,
      is_demo: r.is_demo,
    };
  });
}

function randomBatchSuffix() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function createBatch(input: {
  product_id: string;
  product_sku: string;
  cultivation_region_code: string;
  harvest_date: string;
  qty_kg: number;
  warehouse_location: string;
  qc_status: string;
}): Promise<Batch> {
  const dateTag = input.harvest_date.replace(/-/g, '');
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = randomBatchSuffix();
    const batch_id = `${input.product_sku}-${dateTag}-${suffix}`;
    const qr_hash = `${batch_id}-${randomBatchSuffix()}`;
    const { data, error } = await supabase
      .from('batches')
      .insert({
        batch_id,
        product_id: input.product_id,
        cultivation_region_code: input.cultivation_region_code,
        harvest_date: input.harvest_date,
        qty_kg: input.qty_kg,
        warehouse_location: input.warehouse_location,
        qc_status: input.qc_status,
        qr_hash,
      })
      .select('id, batch_id, product_id, cultivation_region_code, harvest_date, qc_status, qty_kg, warehouse_location, qr_hash, created_at')
      .single();
    if (!error) {
      return {
        ...(data as Omit<Batch, 'product_sku' | 'product_name' | 'cultivation_region_name' | 'is_demo'>),
        product_sku: input.product_sku,
        product_name: '',
        cultivation_region_name: null,
        is_demo: false,
      };
    }
    if (!error.message.includes('duplicate key')) throw new Error(error.message);
  }
  throw new Error('Không tạo được mã lô hàng duy nhất, thử lại.');
}

export async function fetchShowroomRevenueToday(): Promise<Record<string, number>> {
  const warehouses = throwIfError(await supabase.from('warehouses').select('code').eq('type', 'showroom'));
  const today = new Date().toISOString().slice(0, 10);
  const entries = throwIfError(
    await supabase
      .from('showroom_revenue_entries')
      .select('warehouse_code, revenue_amount')
      .eq('revenue_date', today)
      .eq('is_demo', false)
  );
  const byWarehouse = Object.fromEntries((warehouses as { code: string }[]).map((w) => [w.code, 0]));
  for (const e of entries as { warehouse_code: string; revenue_amount: number }[]) {
    byWarehouse[e.warehouse_code] = (byWarehouse[e.warehouse_code] ?? 0) + Number(e.revenue_amount);
  }
  return byWarehouse;
}

export interface DemoRevenueRow {
  warehouse_code: string;
  revenue_amount: number;
  orders_count: number;
  revenue_date: string;
}

export async function fetchDemoShowroomRevenue(): Promise<DemoRevenueRow[]> {
  return throwIfError(
    await supabase
      .from('showroom_revenue_entries')
      .select('warehouse_code, revenue_amount, orders_count, revenue_date')
      .eq('is_demo', true)
      .order('revenue_date', { ascending: false })
  );
}

export interface ShowroomRevenueUploadRow {
  warehouse_code: string;
  revenue_date: string;
  revenue_amount: number;
  orders_count: number;
}

export async function uploadShowroomRevenue(rows: ShowroomRevenueUploadRow[]) {
  const { error } = await supabase
    .from('showroom_revenue_entries')
    .insert(rows.map((r) => ({ ...r, source: 'manual_upload' })));
  if (error) throw new Error(error.message);
}

// ---------- Site settings: addresses / contact / social / blog / B2B leads ----------
// Public-read tables (footer, showroom section, homepage blog) — writes here
// require an authenticated admin session (is_admin()), reads are open to
// everyone including the anonymous storefront. The read side (fetchSiteAddresses,
// fetchContactPhones, fetchSocialLinks, fetchBlogPosts) lives in
// ../lib/siteContentApi.ts since the public storefront needs them too — the
// types are re-exported above for admin page convenience.

export async function createSiteAddress(input: Omit<SiteAddress, 'id'>): Promise<SiteAddress> {
  const res = await supabase
    .from('site_addresses')
    .insert(input)
    .select('id, name, address, hours, phone, category')
    .single();
  return throwIfError(res);
}

export async function deleteSiteAddress(id: string) {
  const { error } = await supabase.from('site_addresses').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function createContactPhone(label: string, value: string): Promise<ContactPhone> {
  const res = await supabase.from('contact_phones').insert({ label, value }).select('id, label, value').single();
  return throwIfError(res);
}

export async function deleteContactPhone(id: string) {
  const { error } = await supabase.from('contact_phones').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function createSocialLink(platform: string, url: string): Promise<SocialLink> {
  const res = await supabase.from('social_links').insert({ platform, url }).select('id, platform, url').single();
  return throwIfError(res);
}

export async function deleteSocialLink(id: string) {
  const { error } = await supabase.from('social_links').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// URL /blog/<slug> phải đọc được (chuẩn SEO, xem docs/DESIGN_SYSTEM.md) —
// sinh slug từ title lúc tạo bài, tự thêm hậu tố -2/-3... nếu trùng thay vì
// để lỗi unique constraint văng ra tay admin.
async function generateUniqueBlogSlug(title: string): Promise<string> {
  const base = slugify(title) || 'bai-viet';
  let candidate = base;
  let suffix = 2;
  for (;;) {
    const { data, error } = await supabase.from('blog_posts').select('id').eq('slug', candidate).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

export async function createBlogPost(input: {
  title: string;
  excerpt: string;
  body: string;
  featured_image_url?: string | null;
  featured_image_alt?: string | null;
}): Promise<BlogPost> {
  const slug = await generateUniqueBlogSlug(input.title);
  const res = await supabase
    .from('blog_posts')
    .insert({ ...input, slug })
    .select('id, slug, title, excerpt, body, featured_image_url, featured_image_alt, created_at, published')
    .single();
  return throwIfError(res);
}

export async function updateBlogPost(
  id: string,
  patch: Partial<{
    title: string;
    excerpt: string;
    body: string;
    featured_image_url: string | null;
    featured_image_alt: string | null;
  }>,
): Promise<BlogPost> {
  // Cố ý KHÔNG tự sinh lại slug khi title đổi — slug đã public (SEO, link đã
  // chia sẻ) không nên đổi ngầm sau khi bài đã đăng.
  const res = await supabase
    .from('blog_posts')
    .update(patch)
    .eq('id', id)
    .select('id, slug, title, excerpt, body, featured_image_url, featured_image_alt, created_at, published')
    .single();
  return throwIfError(res);
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// Flips a draft (published=false, e.g. from the unattended daily content
// routine) live on the public site, or unpublishes a live post.
export async function setBlogPostPublished(id: string, published: boolean) {
  const { error } = await supabase.from('blog_posts').update({ published }).eq('id', id);
  if (error) throw new Error(error.message);
}

// Uploads a featured image to the public `blog-images` storage bucket and
// returns its public URL. Admin-only (RLS on storage.objects gates the insert).
export async function uploadBlogImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('blog-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Trust & Proof (testimonials/press/photos, published-gated) ----------

export async function fetchAllTrustProofItems(): Promise<(TrustProofItem & { published: boolean })[]> {
  return throwIfError(
    await supabase
      .from('trust_proof_items')
      .select('id, kind, quote_text, source_name, source_url, image_url, sort_order, published')
      .order('sort_order')
  );
}

export async function createTrustProofItem(input: {
  kind: TrustProofItem['kind'];
  quote_text: string;
  source_name: string;
  source_url?: string | null;
  image_url?: string | null;
}) {
  const res = await supabase
    .from('trust_proof_items')
    .insert({ ...input, published: false })
    .select('id, kind, quote_text, source_name, source_url, image_url, sort_order, published')
    .single();
  return throwIfError(res);
}

export async function updateTrustProofItem(
  id: string,
  patch: Partial<Pick<TrustProofItem, 'quote_text' | 'source_name' | 'source_url' | 'sort_order'> & { published: boolean }>
) {
  const { error } = await supabase.from('trust_proof_items').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteTrustProofItem(id: string) {
  const { error } = await supabase.from('trust_proof_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function uploadTrustProofImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('trust-proof-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('trust-proof-images').getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Combo/Gift Sets (seasonal bundles assembled from existing SKUs) ----------

export async function fetchAllComboSets(): Promise<(ComboSet & { active: boolean })[]> {
  return throwIfError(
    await supabase
      .from('combo_sets')
      .select('id, slug, name_vi, theme, month_tags, component_skus, price_vnd, poster_image_url, description_vi, sort_order, active')
      .order('sort_order')
  );
}

export async function createComboSet(input: {
  slug: string;
  name_vi: string;
  theme: string;
  month_tags: number[];
  component_skus: string[];
  price_vnd: number;
  poster_image_url?: string | null;
  description_vi: string;
}) {
  const res = await supabase
    .from('combo_sets')
    .insert({ ...input, active: false })
    .select('id, slug, name_vi, theme, month_tags, component_skus, price_vnd, poster_image_url, description_vi, sort_order, active')
    .single();
  return throwIfError(res);
}

export async function updateComboSet(
  id: string,
  patch: Partial<Pick<ComboSet, 'name_vi' | 'theme' | 'month_tags' | 'component_skus' | 'price_vnd' | 'poster_image_url' | 'description_vi' | 'sort_order'> & { active: boolean }>
) {
  const { error } = await supabase.from('combo_sets').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteComboSet(id: string) {
  const { error } = await supabase.from('combo_sets').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function uploadComboImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('combo-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('combo-images').getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Heritage Gallery (Vườn Sâm Nguyên Sinh photo grid on homepage) ----------

export async function fetchAllHeritageGalleryImages(): Promise<(HeritageGalleryImage & { visible: boolean })[]> {
  return throwIfError(
    await supabase
      .from('heritage_gallery_images')
      .select('id, image_url, alt_vi, alt_en, sort_order, visible')
      .order('sort_order')
  );
}

export async function createHeritageGalleryImage(input: {
  image_url: string;
  alt_vi: string;
  alt_en?: string;
  sort_order?: number;
}) {
  const res = await supabase
    .from('heritage_gallery_images')
    .insert({ alt_en: '', sort_order: 0, ...input, visible: true })
    .select('id, image_url, alt_vi, alt_en, sort_order, visible')
    .single();
  return throwIfError(res);
}

export async function updateHeritageGalleryImage(
  id: string,
  patch: Partial<Pick<HeritageGalleryImage, 'alt_vi' | 'alt_en' | 'sort_order'> & { visible: boolean }>
) {
  const { error } = await supabase
    .from('heritage_gallery_images')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteHeritageGalleryImage(id: string) {
  const { error } = await supabase.from('heritage_gallery_images').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function uploadHeritageGalleryImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('heritage-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('heritage-images').getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Site Sections (admin-controlled visibility for orphaned pages) ----------

export async function fetchAllSiteSections(): Promise<(SiteSection & { visible: boolean })[]> {
  return throwIfError(
    await supabase
      .from('site_sections')
      .select('id, key, label_vi, nav_group, path, sort_order, visible')
      .order('sort_order')
  );
}

export async function updateSiteSectionVisibility(id: string, visible: boolean) {
  const { error } = await supabase.from('site_sections').update({ visible, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
}

// ---------- Channels (kênh phân phối: Facebook, TikTok, YouTube, Zalo, ...) ----------

export interface Channel {
  id: string;
  channel_name: string;
  platform_type: 'facebook' | 'tiktok' | 'youtube' | 'zalo' | 'instagram' | 'linkedin' | 'other';
  channel_url: string | null;
  webhook_url: string | null;
  is_active: boolean;
  sort_order: number;
  notes: string | null;
}

export async function fetchChannels(): Promise<Channel[]> {
  return throwIfError(
    await supabase
      .from('channels')
      .select('id, channel_name, platform_type, channel_url, webhook_url, is_active, sort_order, notes')
      .order('sort_order')
  );
}

export async function createChannel(input: {
  channel_name: string;
  platform_type: Channel['platform_type'];
  channel_url?: string;
  webhook_url?: string;
  notes?: string;
}): Promise<Channel> {
  const res = await supabase
    .from('channels')
    .insert(input)
    .select('id, channel_name, platform_type, channel_url, webhook_url, is_active, sort_order, notes')
    .single();
  return throwIfError(res);
}

export async function updateChannel(
  id: string,
  patch: Partial<Pick<Channel, 'channel_name' | 'channel_url' | 'webhook_url' | 'is_active' | 'notes'>>
) {
  const { error } = await supabase.from('channels').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteChannel(id: string) {
  const { error } = await supabase.from('channels').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ---------- Post captions (1 caption/kênh cho mỗi bài viết) ----------

export interface PostCaption {
  id: string;
  post_id: string;
  channel_id: string;
  caption_text: string;
  video_url: string | null;
  is_published: boolean;
  published_at: string | null;
}

export async function fetchPostCaptions(postId: string): Promise<PostCaption[]> {
  return throwIfError(
    await supabase
      .from('post_captions')
      .select('id, post_id, channel_id, caption_text, video_url, is_published, published_at')
      .eq('post_id', postId)
  );
}

export async function saveCaption(postId: string, channelId: string, captionText: string): Promise<PostCaption> {
  const res = await supabase
    .from('post_captions')
    .upsert(
      { post_id: postId, channel_id: channelId, caption_text: captionText, updated_at: new Date().toISOString() },
      { onConflict: 'post_id,channel_id' }
    )
    .select('id, post_id, channel_id, caption_text, video_url, is_published, published_at')
    .single();
  return throwIfError(res);
}

// Uploads a video for one (post, channel) caption to the public `blog-videos`
// bucket (200MB cap, video mime allow-list — enforced server-side by the
// bucket config, not just this client check). Admin-only.
export async function uploadCaptionVideo(captionId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'mp4';
  const path = `${captionId}-${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from('blog-videos').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);
  const { data } = supabase.storage.from('blog-videos').getPublicUrl(path);
  const { error } = await supabase
    .from('post_captions')
    .update({ video_url: data.publicUrl, video_uploaded_at: new Date().toISOString() })
    .eq('id', captionId);
  if (error) throw new Error(error.message);
  return data.publicUrl;
}

// Removes the stored video for a caption once it's already been posted to the
// real platform (via webhook) — the copy in our own Supabase Storage is no
// longer needed after that and just costs storage space, so this deletes the
// object AND clears video_url. Does not touch caption_text/is_published.
export async function deleteCaptionVideo(caption: PostCaption) {
  if (caption.video_url) {
    const path = caption.video_url.split('/blog-videos/')[1];
    if (path) {
      const { error: removeError } = await supabase.storage.from('blog-videos').remove([path]);
      if (removeError) throw new Error(removeError.message);
    }
  }
  const { error } = await supabase.from('post_captions').update({ video_url: null }).eq('id', caption.id);
  if (error) throw new Error(error.message);
}

// Marks a caption as published/approved and (if the channel has a webhook
// configured) fires it so an external automation (n8n/Zapier/Make ...) the
// admin owns can pick it up and actually post to that platform. This code
// never calls Facebook/TikTok/YouTube/Zalo's own APIs directly — no such
// credentials exist in this project. Without a webhook_url configured for the
// channel, this only marks the caption approved for manual copy-paste.
export async function publishCaption(caption: PostCaption, webhookUrl: string | null, payload: unknown) {
  const { error } = await supabase
    .from('post_captions')
    .update({ is_published: true, published_at: new Date().toISOString() })
    .eq('id', caption.id);
  if (error) throw new Error(error.message);

  if (webhookUrl) {
    let res: Response;
    try {
      res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Webhook delivery failure shouldn't roll back the "approved" state —
      // the admin can retry the webhook independently. Surfaced as a toast
      // by the caller.
      throw new Error('Đã lưu duyệt, nhưng gọi webhook kênh thất bại (kiểm tra lại URL webhook).');
    }
    if (!res.ok) {
      throw new Error(`Đã lưu duyệt, nhưng n8n phản hồi lỗi (HTTP ${res.status}) — kiểm tra workflow.`);
    }
  }
}

export interface B2BLead {
  id: string;
  type: 'distributor' | 'investor' | 'oem';
  name: string;
  phone: string;
  email: string;
  message: string;
  status: 'new' | 'contacted';
  created_at: string;
}

export async function fetchB2BLeads(): Promise<B2BLead[]> {
  return throwIfError(
    await supabase
      .from('b2b_leads')
      .select('id, type, name, phone, email, message, status, created_at')
      .order('created_at', { ascending: false })
  );
}

export async function markLeadContacted(id: string) {
  const { error } = await supabase.from('b2b_leads').update({ status: 'contacted' }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteLead(id: string) {
  const { error } = await supabase.from('b2b_leads').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export interface CustomerLead {
  id: string;
  name: string;
  phone: string;
  interest: string;
  message: string;
  source: string;
  status: 'new' | 'contacted';
  created_at: string;
}

export async function fetchCustomerLeads(): Promise<CustomerLead[]> {
  return throwIfError(
    await supabase
      .from('customer_leads')
      .select('id, name, phone, interest, message, source, status, created_at')
      .order('created_at', { ascending: false })
  );
}

export async function markCustomerLeadContacted(id: string) {
  const { error } = await supabase.from('customer_leads').update({ status: 'contacted' }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteCustomerLead(id: string) {
  const { error } = await supabase.from('customer_leads').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ---------- Orders (realtime) ----------

export async function fetchOrders(): Promise<DbOrder[]> {
  return throwIfError(
    await supabase
      .from('orders')
      .select('id, customer_name, customer_phone, total_vnd, status, created_at, updated_at')
      .order('created_at', { ascending: false })
  );
}

export async function createOrder(input: Omit<DbOrder, 'id' | 'created_at' | 'updated_at'>): Promise<DbOrder> {
  const res = await supabase
    .from('orders')
    .insert(input)
    .select('id, customer_name, customer_phone, total_vnd, status, created_at, updated_at')
    .single();
  return throwIfError(res);
}

export async function updateOrderStatus(id: string, status: DbOrder['status']): Promise<DbOrder> {
  const res = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, customer_name, customer_phone, total_vnd, status, created_at, updated_at')
    .single();
  return throwIfError(res);
}

// ---------- Revenue Daily (metrics) ----------

export async function fetchRevenueDaily(): Promise<DbRevenueDaily[]> {
  return throwIfError(
    await supabase
      .from('revenue_daily')
      .select('date, showroom_vnd, online_vnd, affiliate_vnd, otc_ka_vnd, total_vnd')
      .order('date', { ascending: false })
      .limit(90)
  );
}

// ---------- Dashboard KPIs (Tổng quan) ----------

export interface DashboardKpis {
  revenueThisMonth: number;
  paidOrdersThisMonth: number;
  totalCustomers: number;
  suspectScans: number;
}

export async function fetchDashboardKpis(): Promise<DashboardKpis> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [ordersRes, customersRes, scansRes] = await Promise.all([
    supabase.from('orders').select('total, created_at').eq('status', 'paid').gte('created_at', monthStart),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase.from('qr_scan_events').select('id', { count: 'exact', head: true }).eq('suspect', true),
  ]);
  if (ordersRes.error) throw new Error(ordersRes.error.message);
  if (customersRes.error) throw new Error(customersRes.error.message);
  if (scansRes.error) throw new Error(scansRes.error.message);

  const orders = (ordersRes.data ?? []) as { total: number }[];
  return {
    revenueThisMonth: orders.reduce((sum, o) => sum + Number(o.total), 0),
    paidOrdersThisMonth: orders.length,
    totalCustomers: customersRes.count ?? 0,
    suspectScans: scansRes.count ?? 0,
  };
}
