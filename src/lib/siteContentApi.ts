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
  const { data, error } = await supabase.from('contact_phones').select('id, label, value').order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase.from('social_links').select('id, platform, url').order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  created_at: string;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, excerpt, body, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
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
