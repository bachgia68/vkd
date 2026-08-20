import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name_vi: string;
          price_vnd: number;
          stock_qty: number;
          active: boolean;
          category_id: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string;
          total_vnd: number;
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price_vnd: number;
        };
      };
      revenue_daily: {
        Row: {
          date: string;
          showroom_vnd: number;
          online_vnd: number;
          affiliate_vnd: number;
          otc_ka_vnd: number;
          total_vnd: number;
        };
      };
    };
  };
};
