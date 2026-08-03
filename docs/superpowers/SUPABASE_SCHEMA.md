# Supabase Schema — Loyalty / Order Integration

Project: `xcwirgrlnibnjmseglee` ("Vkd web Project", `ap-south-1`) — the same Supabase
project already used by `AdminAuthContext.tsx` and `src/admin/adminApi.ts`. URL and
anon key come from `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`); see
`.env.example` for the documented shape.

## Important: this schema already existed before Task 1

The original task brief for this step sketched a *brand-new* schema (`customers`,
`orders`, `loyalty_points` tables with `tier_index`, `order_number`,
`total_amount_usd`/`total_amount_vnd` columns, an "anyone can read anything"
`USING (TRUE)` RLS policy). Before running any of that SQL, this table inventory was
pulled from the live project via the Supabase MCP tools:

```
customers            (1 row)   — already exists, real customer PII
orders               (1 row)   — already exists, real order
order_items          (1 row)
elite_club_members   (0 rows)  — the real "loyalty tier" table
loyalty_transactions (0 rows)  — the real "loyalty points ledger" table
carts, cart_items, coupons, coupon_redemptions, wishlists, ...
```

`customers`, `orders`, and a table named `loyalty_transactions` (not
`loyalty_points`) **already exist** in production, wired up to the real PayOS
checkout flow (`checkout_cart`, `record_payos_order`, `mark_payos_order_paid`,
`accrue_loyalty_points` — all existing Postgres functions). Running the brief's
`CREATE TABLE customers (...)` verbatim would have failed (`relation "customers"
already exists`), and blanket `USING (TRUE)` SELECT policies on `customers`/`orders`
would have made every customer's email, phone, and full order/shipping history
world-readable through the public anon key embedded in the site's client-side JS.
Neither was done. **No `CREATE TABLE` statements were run.** This document instead
records the real schema and the one additive object that *was* created: a narrow,
curated read function.

## Real schema (subset relevant to loyalty)

```sql
-- Already exists. RLS enabled; SELECT restricted to authenticated admins (is_admin()).
create table customers (
  id                  uuid primary key default extensions.uuid_generate_v4(),
  email               text unique,
  phone               text unique,
  full_name           text,
  preferred_locale    text default 'vi',
  preferred_currency  text default 'VND',
  created_at          timestamptz default now(),
  sensitive_data_purged boolean not null default false
);

-- Already exists. RLS enabled; SELECT restricted to authenticated admins (is_admin()).
create table orders (
  id                          uuid primary key default extensions.uuid_generate_v4(),
  order_code                  text unique not null,     -- brief called this "order_number"
  customer_id                 uuid references customers(id),
  cart_id                     uuid references carts(id),
  status                      text default 'pending',   -- real values seen in prod: 'pending', 'paid'
                                                          -- (NOT 'completed' as the original brief assumed)
  currency                    text default 'VND',
  subtotal, discount_amount, shipping_fee, total  numeric,  -- ONE total + currency code,
                                                              -- not separate usd/vnd columns
  coupon_code, payment_method, payment_ref        text,
  shipping_carrier, shipping_tracking_code,
  delivery_confirmation_code  text,
  shipping_address            jsonb,
  created_at, updated_at      timestamptz default now()
);

-- Already exists. RLS enabled; SELECT restricted to authenticated admins (is_admin()).
create table order_items (
  id uuid primary key default extensions.uuid_generate_v4(),
  order_id uuid references orders(id),
  product_id uuid references products(id),
  sku text not null, name_vi text not null,
  quantity int not null check (quantity > 0),
  unit_price numeric not null, line_total numeric not null
);

-- Already exists. This is the real "loyalty tier" table (brief invented a
-- `tier_index` column on `customers` for this — that column does not exist).
-- RLS enabled; only `is_admin()` authenticated users have direct table access.
create table elite_club_members (
  id                uuid primary key default extensions.uuid_generate_v4(),
  customer_id       uuid unique references customers(id),
  member_code       text unique not null,
  tier              text default 'Silver',   -- internal CRM tier: Silver/Gold/Platinum/Elite
  points_balance    int default 0,           -- redeemable balance
  lifetime_points   int default 0,
  kiotviet_sync_id  text,
  joined_at         timestamptz default now()
);

-- Already exists. This is the real "loyalty points ledger" (brief called it
-- `loyalty_points` with an `amount_points` column keyed by customer_id — the
-- real table is keyed by `member_id` -> elite_club_members.id, not customer_id
-- directly, and the column is `points_delta`, not `amount_points`).
-- RLS was enabled but had ZERO policies (fully inaccessible, even to admins)
-- before this task; left as-is (see "What Task 1 added" below).
create table loyalty_transactions (
  id           uuid primary key default extensions.uuid_generate_v4(),
  member_id    uuid references elite_club_members(id),
  order_id     uuid references orders(id),
  points_delta int not null,        -- brief's "amount_points"
  reason       text,                -- 'purchase' in the existing accrue_loyalty_points() fn
  created_at   timestamptz default now()
);
```

### Two loyalty point systems currently coexist (flagged, not reconciled)

The database already has a working `accrue_loyalty_points(p_order_id)` function
(pre-dates this task) that: requires the customer to already have an
`elite_club_members` row (no auto-enrollment), awards `floor(order.total / 10000)`
points per **VND**, and re-tiers on `lifetime_points` thresholds of 2,000,000 /
8,000,000 / 20,000,000 (Gold / Platinum / Elite) — i.e. it is scaled for VND order
totals in the tens of millions to reach a mid tier.

The customer-facing tier ladder this task's brief specifies
(`calculateTierIndex()` below, matching `src/data/mockData.ts` → `loyaltyTiers`)
uses small round thresholds — 0 / 5,000 / 20,000 points — designed for the brief's
"1 point per $1 USD" model (`calculatePointsFromOrder()`).

**These two are not the same point economy.** `loyaltyService.ts` deliberately does
not try to silently reconcile them: `getLoyaltyDataByEmail()` reports whatever is
actually in `elite_club_members.points_balance` / `loyalty_transactions` (the real,
already-accruing ledger), and `currentTierIndex` is derived from that real point
total using the brief's thresholds — it does **not** read `elite_club_members.tier`
(the Silver/Gold/Platinum/Elite CRM label), because that label is on a different
scale and is used by the admin CRM page (`src/admin/pages/CrmErpPage.tsx`), not the
customer-facing `LoyaltyDashboard`. Reconciling the two formulas (or migrating one
onto the other) is a product decision, not something this task should decide
unilaterally — flagged for follow-up.

## What Task 1 added

One new database object, applied via Supabase migration
`create_get_loyalty_data_by_email_fn` (see `list_migrations` on this project):

```sql
create or replace function public.get_loyalty_data_by_email(p_email text)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_customer record;
  v_member record;
  v_orders jsonb;
  v_points_history jsonb;
begin
  select id, email, phone, full_name, created_at
    into v_customer
    from public.customers
    where lower(email) = lower(trim(p_email))
    limit 1;

  if not found then
    return jsonb_build_object(
      'customer', null, 'totalPoints', 0,
      'orders', '[]'::jsonb, 'pointsHistory', '[]'::jsonb
    );
  end if;

  select * into v_member from public.elite_club_members where customer_id = v_customer.id;

  select coalesce(jsonb_agg(jsonb_build_object(
      'id', o.id, 'customerId', o.customer_id, 'orderNumber', o.order_code,
      'total', o.total, 'currency', o.currency, 'status', o.status,
      'purchasedAt', o.created_at
    ) order by o.created_at desc), '[]'::jsonb)
    into v_orders
    from public.orders o where o.customer_id = v_customer.id;

  if v_member.id is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
        'id', lt.id, 'orderId', lt.order_id, 'amountPoints', lt.points_delta,
        'reason', lt.reason, 'createdAt', lt.created_at
      ) order by lt.created_at desc), '[]'::jsonb)
      into v_points_history
      from public.loyalty_transactions lt where lt.member_id = v_member.id;
  else
    v_points_history := '[]'::jsonb;
  end if;

  return jsonb_build_object(
    'customer', jsonb_build_object(
      'id', v_customer.id, 'email', v_customer.email, 'phone', v_customer.phone,
      'fullName', v_customer.full_name, 'registeredAt', v_customer.created_at
    ),
    'totalPoints', coalesce(v_member.points_balance, 0),
    'orders', v_orders,
    'pointsHistory', v_points_history
  );
end;
$function$;

grant execute on function public.get_loyalty_data_by_email(text) to anon, authenticated;
```

### Why an RPC function instead of RLS `SELECT` policies

The brief's Step 1 asked for `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` plus
`FOR SELECT USING (TRUE)` policies on `customers`/`orders`/`loyalty_points` so the
anon client could read them directly. That would have been a real data-exposure
regression on this project specifically, because:

- `customers` already has real rows with `email`/`phone`/`full_name`.
- `orders` already has `shipping_address` (jsonb, full name/address/phone of the
  recipient) on real rows.
- The anon key is public — it ships in the site's JS bundle. A `USING (TRUE)`
  SELECT policy is equivalent to an unauthenticated public API that returns every
  customer's PII and full order history.

This project's own existing code already solves "the anon client needs to read/
write something narrow and specific" a different way: `SECURITY DEFINER` Postgres
functions with `GRANT EXECUTE TO anon` (see `get_cart_contents`, `checkout_cart`,
`record_payos_order`, `add_to_cart`, `toggle_wishlist`, `validate_coupon` — all
pre-existing). `get_loyalty_data_by_email` follows that exact convention: it runs
with definer privileges (so it can read `customers`/`orders`/`elite_club_members`/
`loyalty_transactions` despite their restrictive admin-only RLS policies), but only
ever *returns* a curated shape — no `shipping_address`, no other customers' rows,
nothing beyond what `LoyaltyData` needs. Direct anon `SELECT` access to the
underlying tables was verified to still be blocked after this change
(`GET /rest/v1/customers` with the anon key returns `[]`).

**Residual tradeoff, not fixed here:** the function looks a customer up by email
alone, with no proof of ownership (no OTP/magic-link/session check). Anyone who
knows or guesses an email can see whether it belongs to a customer and, if so,
their name/phone/point balance/order totals (not full shipping address). This
mirrors the "check your points" pattern many small-business loyalty widgets use,
and is a strict improvement over the brief's original "read the whole table"
proposal, but it is still an email-enumeration surface. Recommended follow-up
(out of scope for Task 1): require a signed-in Supabase Auth session, or an
email OTP step, before calling this RPC from the client. Flagged for the site
owner / a later task, not silently fixed.

### RLS status left unchanged

No existing RLS policy was modified or removed. `customers`, `orders`,
`order_items`, `elite_club_members` keep their pre-existing
`admin full access` / `admin read` policies (authenticated + `is_admin()`).
`loyalty_transactions` still has RLS enabled with zero policies (no direct table
access for anyone, admin included) — same as before this task; the admin CRM page
does not currently read it directly, and adding an admin policy for it was not
part of this task's scope.

## Tier mapping (customer-facing)

`tierIndex` 0/1/2 maps to `src/data/mockData.ts` → `loyaltyTiers[]` in order:

| index | name (mockData)     | minPoints |
|-------|----------------------|-----------|
| 0     | Standard / Tiêu Chuẩn | 0         |
| 1     | VIP                   | 5,000     |
| 2     | VVIP Elite            | 20,000    |

`calculateTierIndex(points)` in `src/lib/loyaltyService.ts` implements this table
and is the single source of truth for turning a raw point total into a tier index
for the customer-facing UI — it does not read any tier column from the database.

## Env vars

See `.env.example` — `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (already in use
by `src/lib/supabaseClient.ts` for the admin login flow; now also consumed by
`src/lib/loyaltyService.ts`).
