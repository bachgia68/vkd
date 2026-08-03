import { supabase } from './supabaseClient';

/**
 * Loyalty / order-history query helper for the public (anon-key) client.
 *
 * IMPORTANT — read docs/superpowers/SUPABASE_SCHEMA.md before touching this file.
 * The `customers`/`orders`/`elite_club_members`/`loyalty_transactions` tables
 * already existed in production before this file was written (they back the real
 * PayOS checkout flow — see api/create-payos-payment.ts, api/payos-webhook.ts).
 * Their RLS policies only grant SELECT to authenticated admins, on purpose: they
 * hold real customer PII (email, phone, shipping address). This module does NOT
 * query those tables directly with the anon client (that would just come back
 * empty/denied) — it calls a single narrow, curated Postgres RPC function,
 * `get_loyalty_data_by_email`, that runs as SECURITY DEFINER and returns only the
 * fields below. See the schema doc for the full rationale and the residual
 * email-enumeration tradeoff that RPC still carries.
 */

/** 1 USD ≈ this many VND. Matches the constant already used by src/data/products.ts,
 * src/data/vkdProducts.ts and src/data/trimicoProducts.ts (`VND_PER_USD`). Real
 * `orders` rows store a single `total` + `currency`, not separate USD/VND amounts,
 * so one of totalAmountUsd/totalAmountVnd below is always a converted estimate,
 * not a value that was actually charged in that currency. */
const VND_PER_USD = 25000;

export interface Customer {
  id: string;
  email: string;
  phone: string | null;
  fullName: string;
  registeredAt: string;
  /** 0=Standard, 1=VIP, 2=VVIP Elite — derived from totalPoints via
   * calculateTierIndex(), not read from a stored column. See schema doc:
   * "Two loyalty point systems currently coexist". */
  tierIndex: number;
}

export interface Order {
  id: string;
  customerId: string;
  /** Real column is `orders.order_code`. */
  orderNumber: string;
  totalAmountUsd: number;
  totalAmountVnd: number;
  /** Real values seen in production are 'pending' and 'paid' (the PayOS webhook
   * flips pending -> paid; see api/payos-webhook.ts / mark_payos_order_paid()).
   * 'refunded' and 'cancelled' are modeled for forward-compatibility even though
   * nothing currently writes them. */
  status: 'pending' | 'paid' | 'refunded' | 'cancelled';
  purchasedAt: string;
}

export interface LoyaltyPointsRecord {
  id: string;
  customerId: string;
  orderId: string | null;
  amountPoints: number;
  reason: 'purchase' | 'referral' | 'manual_adjustment';
  createdAt: string;
}

export interface LoyaltyData {
  customer: Customer | null;
  totalPoints: number;
  currentTierIndex: number;
  orders: Order[];
  pointsHistory: LoyaltyPointsRecord[];
}

const EMPTY_LOYALTY_DATA: LoyaltyData = {
  customer: null,
  totalPoints: 0,
  currentTierIndex: 0,
  orders: [],
  pointsHistory: [],
};

// Shape returned by the get_loyalty_data_by_email RPC (see docs/superpowers/SUPABASE_SCHEMA.md).
interface RpcLoyaltyResponse {
  customer: {
    id: string;
    email: string;
    phone: string | null;
    fullName: string;
    registeredAt: string;
  } | null;
  totalPoints: number;
  orders: {
    id: string;
    customerId: string;
    orderNumber: string;
    total: number;
    currency: string;
    status: string;
    purchasedAt: string;
  }[];
  pointsHistory: {
    id: string;
    orderId: string | null;
    amountPoints: number;
    reason: string | null;
    createdAt: string;
  }[];
}

function toAmounts(total: number, currency: string): { usd: number; vnd: number } {
  const normalized = (currency || 'VND').toUpperCase();
  if (normalized === 'USD') {
    return { usd: total, vnd: Math.round(total * VND_PER_USD) };
  }
  // Default: treat as VND (matches current production data — PayOS orders are
  // always recorded in VND today, see record_payos_order()).
  return { usd: Math.round((total / VND_PER_USD) * 100) / 100, vnd: total };
}

function isKnownOrderStatus(value: string): value is Order['status'] {
  return value === 'pending' || value === 'paid' || value === 'refunded' || value === 'cancelled';
}

/**
 * Fetch complete loyalty data for a customer by email.
 * Used by LoyaltyDashboard after user authenticates.
 */
export async function getLoyaltyDataByEmail(email: string): Promise<LoyaltyData> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) return EMPTY_LOYALTY_DATA;

  try {
    const { data, error } = await supabase.rpc('get_loyalty_data_by_email', {
      p_email: trimmedEmail,
    });

    if (error || !data) {
      console.error('[getLoyaltyDataByEmail] RPC error:', error);
      return EMPTY_LOYALTY_DATA;
    }

    const rpc = data as RpcLoyaltyResponse;
    if (!rpc.customer) return EMPTY_LOYALTY_DATA;

    const totalPoints = rpc.totalPoints ?? 0;

    const orders: Order[] = (rpc.orders || []).map((o) => {
      const { usd, vnd } = toAmounts(Number(o.total), o.currency);
      return {
        id: o.id,
        customerId: o.customerId,
        orderNumber: o.orderNumber,
        totalAmountUsd: usd,
        totalAmountVnd: vnd,
        status: isKnownOrderStatus(o.status) ? o.status : 'pending',
        purchasedAt: o.purchasedAt,
      };
    });

    const pointsHistory: LoyaltyPointsRecord[] = (rpc.pointsHistory || []).map((p) => ({
      id: p.id,
      customerId: rpc.customer!.id,
      orderId: p.orderId,
      amountPoints: p.amountPoints,
      reason: p.reason === 'referral' || p.reason === 'manual_adjustment' ? p.reason : 'purchase',
      createdAt: p.createdAt,
    }));

    const currentTierIndex = calculateTierIndex(totalPoints);

    return {
      customer: {
        id: rpc.customer.id,
        email: rpc.customer.email,
        phone: rpc.customer.phone,
        fullName: rpc.customer.fullName,
        registeredAt: rpc.customer.registeredAt,
        tierIndex: currentTierIndex,
      },
      totalPoints,
      currentTierIndex,
      orders,
      pointsHistory,
    };
  } catch (err) {
    console.error('[getLoyaltyDataByEmail] Error:', err);
    return EMPTY_LOYALTY_DATA;
  }
}

/**
 * Calculate tier index based on current points.
 * Returns 0=Standard, 1=VIP, 2=VVIP Elite.
 * Thresholds match src/data/mockData.ts -> loyaltyTiers[].minPoints exactly —
 * keep these two in sync if the tier ladder ever changes.
 */
export function calculateTierIndex(points: number): number {
  if (points >= 20000) return 2; // VVIP Elite
  if (points >= 5000) return 1; // VIP
  return 0; // Standard
}

/**
 * Calculate loyalty points earned from an order.
 * Base: 1 point per $1 USD equivalent.
 * Future: Apply bonuses for referrals, etc.
 *
 * Note: this is the brief's forward-looking "$1 = 1 point" estimator for
 * client-side previews (e.g. "you'll earn ~N points" at checkout). It is
 * intentionally NOT what getLoyaltyDataByEmail() reports as totalPoints — the
 * real, already-live accrue_loyalty_points() Postgres function uses a different
 * formula (floor(total_vnd / 10000)). See docs/superpowers/SUPABASE_SCHEMA.md,
 * "Two loyalty point systems currently coexist".
 */
export function calculatePointsFromOrder(amountUsd: number): number {
  return Math.round(amountUsd * 1);
}
