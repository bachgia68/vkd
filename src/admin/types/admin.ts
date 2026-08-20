import type { Database } from '../utils/supabaseClient';

export type DbProduct = Database['public']['Tables']['products']['Row'];
export type DbOrder = Database['public']['Tables']['orders']['Row'];
export type DbOrderItem = Database['public']['Tables']['order_items']['Row'];
export type DbRevenueDaily = Database['public']['Tables']['revenue_daily']['Row'];

export type UserRole = 'owner' | 'editor' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
}
