import { supabase } from '../lib/supabaseClient';

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
  const rows: ChannelRevenueRow[] = [
    { channel: 'Website/TMĐT (Online)', revenue: onlineRevenue, orders: orders.length, share: 0 },
    { channel: 'Showroom (Offline)', revenue: 0, orders: 0, share: 0 },
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

export async function fetchShowroomRevenueToday(): Promise<Record<string, number>> {
  // No POS integration yet — every showroom reports 0 until a real channel/POS feed exists.
  const warehouses = throwIfError(await supabase.from('warehouses').select('code').eq('type', 'showroom'));
  return Object.fromEntries((warehouses as { code: string }[]).map((w) => [w.code, 0]));
}
