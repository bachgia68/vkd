import type { Database } from '../utils/supabaseClient';

export type DbProduct = Database['public']['Tables']['products']['Row'];
export type DbOrder = Database['public']['Tables']['orders']['Row'];
export type DbOrderItem = Database['public']['Tables']['order_items']['Row'];
export type DbRevenueDaily = Database['public']['Tables']['revenue_daily']['Row'];

export interface DbSubscription {
  id: string;
  customer_email: string;
  customer_name: string | null;
  customer_phone: string | null;
  product_sku: string;
  frequency_days: number;
  next_date: string;
  status: 'active' | 'paused' | 'cancelled';
  discount_percent: number;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'owner' | 'editor' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
}
