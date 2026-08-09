# Loyalty Program Admin Configuration — Design

Ngày: 2026-08-09
Trạng thái: Quyết định tự động theo uỷ quyền của Joe ("tự quyết định, t ra ngoài")
sau khi đã chốt phạm vi qua vài câu hỏi trực tiếp. Ghi rõ lý do cho từng quyết
định để Joe review lại sau.

## 0. Bối cảnh / yêu cầu gốc

Joe: "đầu vào admin tất cả các con số để admin tự điều chỉnh mức độ giảm, sản
phẩm nào giảm... để quản lý được toàn bộ club không để bị lỗ, có thể ẩn hiện
và thay đổi một cách chủ động, không fix cứng gì."

Đã chốt qua AskUserQuestion (Joe trả lời trước khi rời đi):
- Phạm vi số liệu cần đưa vào admin: (1) ngưỡng điểm + %hoàn tiền mỗi hạng,
  (2) tỷ lệ đổi điểm (VNĐ/điểm) + trần % khi redeem, (3) cờ redeem theo SKU,
  (4) công tắc bật/tắt toàn bộ club.
- Giữ cố định 3 hạng (Tiêu Chuẩn/VIP/VVIP Elite) — chỉ sửa số, không thêm/bớt
  hạng.
- Cờ redeem theo SKU đặt ngay trong trang "Sản Phẩm & Kho" có sẵn, không tạo
  trang mới.

## 1. Phát hiện quan trọng trong lúc khảo sát code — quyết định kiến trúc

**Hạng/% cashback KHÔNG áp dụng như giảm giá thật ở bất kỳ đâu** — grep
`Checkout.tsx` không có chỗ nào dùng `loyaltyTiers`/tier discount. Nó chỉ là
con số hiển thị (LoyaltyDashboard "Tổng Tiết Kiệm" ước tính, copy EliteTeaser).
→ Sửa ngưỡng/% hạng là thay đổi **hiển thị**, rủi ro tài chính thấp.

**Redemption thật sự ảnh hưởng tiền** nằm ở đúng 2 số:
`REDEMPTION_VND_PER_POINT` (100) và `MAX_REDEEM_RATIO` (0.3) — nhưng 2 số này
đang **hard-code ở 3 nơi độc lập, không liên kết**:
1. `Checkout.tsx` (hiển thị UI + tính discount hiển thị cho khách)
2. Hàm SQL `record_payos_order()` — dòng `v_discount := ... * 100` — tính
   `discount_amount`/`subtotal` ghi vào bảng `orders` để sổ sách.
3. (Trần 30% chỉ có ở Checkout.tsx, SQL không validate lại.)

Nếu chỉ đổi UI mà không đổi hàm SQL, admin đổi tỷ lệ trong giao diện nhưng sổ
sách kế toán (`orders.discount_amount`) vẫn tính theo 100đ/điểm cũ — **sai
lệch dữ liệu tài chính, không phải bug hiển thị**. Vì vậy thiết kế dưới đây
bắt buộc: **hàm SQL tự đọc từ bảng cấu hình, không nhận số từ client** — client
(Checkout.tsx) chỉ dùng cấu hình để hiển thị/tính trước cho khách xem, nguồn
sự thật cuối cùng luôn là giá trị trong DB tại thời điểm tạo đơn.

**Hệ thống CRM tier riêng (Silver/Gold/Platinum/Elite trong `accrue_loyalty_points()`)
KHÔNG nằm trong phạm vi spec này** — đây là hệ thống thứ 2, độc lập, đã được
ghi nhận từ trước (`SUPABASE_SCHEMA.md` mục "Two loyalty point systems"), dùng
công thức tích điểm khác hẳn (`floor(total/10000)` theo VNĐ, không phải theo
USD như hệ 3-hạng khách thấy). Không đụng vào — hợp nhất 2 hệ thống là việc
lớn hơn nhiều, ngoài phạm vi Joe yêu cầu lần này.

## 2. Schema mới (Supabase project `xcwirgrlnibnjmseglee`)

### 2.1 Bảng `loyalty_settings` (đúng 1 dòng, singleton)

```sql
create table public.loyalty_settings (
  id boolean primary key default true,
  redemption_vnd_per_point numeric not null default 100,
  max_redeem_ratio numeric not null default 0.3,
  club_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint loyalty_settings_singleton check (id)
);
insert into public.loyalty_settings (id) values (true);
```

`id boolean primary key default true` + `check (id)` là kỹ thuật ép bảng chỉ
có đúng 1 dòng (id chỉ nhận giá trị `true`, insert dòng thứ 2 vi phạm PK).

RLS: `select` cho `anon`/`authenticated` (không nhạy cảm, cần đọc phía khách
để hiển thị UI redeem). `update` chỉ cho `authenticated` (admin đăng nhập
Supabase Auth) — không có `insert`/`delete` cho ai ngoài service role (schema
cố định 1 dòng, không cần thêm/xoá).

### 2.2 Bảng `loyalty_tiers` (đúng 3 dòng, tier_index cố định 0/1/2)

```sql
create table public.loyalty_tiers (
  tier_index smallint primary key check (tier_index in (0, 1, 2)),
  name text not null,
  name_vi text not null,
  min_points integer not null,
  discount_pct numeric not null,
  updated_at timestamptz not null default now()
);
insert into public.loyalty_tiers (tier_index, name, name_vi, min_points, discount_pct) values
  (0, 'Standard', 'Tiêu Chuẩn', 0, 3),
  (1, 'VIP', 'VIP', 5000, 7),
  (2, 'VVIP Elite', 'VVIP Elite', 20000, 12);
```

Giữ nguyên đúng số hiện tại làm giá trị khởi tạo — không đổi trải nghiệm hiện
tại cho tới khi Joe chủ động sửa trong admin. RLS: `select` public, `update`
chỉ admin — không cho `insert`/`delete` (3 hạng cố định theo quyết định đã
chốt).

Cột `perks`/`perksVi` (mảng quyền lợi liệt kê dạng bullet) **giữ nguyên hard-code
trong `mockData.ts`, không đưa vào DB** — Joe chỉ yêu cầu điều chỉnh "mức độ
giảm" (số), không yêu cầu sửa nội dung quyền lợi mô tả; đưa cả list quyền lợi
vào admin là mở rộng phạm vi không ai yêu cầu (YAGNI).

### 2.3 Cột mới trên `products`

```sql
alter table public.products add column redeem_eligible boolean not null default true;
```

Mặc định `true` — không có sản phẩm nào bị khoá redeem cho tới khi admin chủ
động tắt, giữ đúng hành vi hiện tại (mọi SKU đều dùng điểm được).

### 2.4 Sửa RPC hiện có

`get_product_overrides()` — thêm `redeem_eligible` vào cột trả về:
```sql
create or replace function public.get_product_overrides()
returns table(sku text, price_vnd numeric, active boolean, stock_qty integer, redeem_eligible boolean)
language sql stable security definer set search_path to 'public'
as $$
  select sku, price_vnd, active, stock_qty, redeem_eligible from public.products;
$$;
```

`record_payos_order(...)` — bản 8-tham số (bản đang thực sự được gọi) sửa lại
để tự đọc `loyalty_settings` thay vì hard-code 100, và tự tính trần redeem
dựa trên **tổng giá trị các dòng hàng có `redeem_eligible = true`** (không
phải tổng cả đơn) — đây là điểm khớp đúng yêu cầu "sản phẩm nào giảm" của Joe
ở đúng nơi duy nhất có đủ dữ liệu order_items để tính (client không biết
chắc admin đã đổi cờ SKU nào gần nhất, nên không thể tin client tính đúng).

```sql
create or replace function public.record_payos_order(
  p_order_code text, p_amount numeric, p_buyer_name text, p_buyer_email text,
  p_buyer_phone text, p_shipping_address jsonb, p_items jsonb,
  p_points_redeemed integer default 0
)
returns uuid
language plpgsql security definer set search_path to 'public', 'pg_temp'
as $$
declare
  v_customer_id uuid;
  v_order_id uuid;
  v_item jsonb;
  v_settings record;
  v_eligible_subtotal numeric := 0;
  v_max_discount numeric;
  v_discount numeric;
  v_points_redeemed integer;
begin
  select * into v_settings from public.loyalty_settings limit 1;

  if p_buyer_email is not null and p_buyer_email <> '' then
    v_customer_id := public.upsert_customer(p_buyer_email, p_buyer_phone, p_buyer_name, 'VND', 'vi');
  end if;

  -- Eligible subtotal computed from real product.redeem_eligible at write
  -- time — never trust a client-computed figure for a value that caps real
  -- money discounted off an order.
  select coalesce(sum(
    coalesce((v_item->>'quantity')::int, 1) * coalesce((v_item->>'price')::numeric, 0)
  ), 0)
  into v_eligible_subtotal
  from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) v_item
  where coalesce((
    select p.redeem_eligible from public.products p where p.sku = (v_item->>'sku') limit 1
  ), true);

  v_max_discount := v_eligible_subtotal * v_settings.max_redeem_ratio;
  v_discount := least(
    coalesce(p_points_redeemed, 0) * v_settings.redemption_vnd_per_point,
    v_max_discount
  );
  v_points_redeemed := floor(v_discount / v_settings.redemption_vnd_per_point);
  v_discount := v_points_redeemed * v_settings.redemption_vnd_per_point;

  insert into public.orders (order_code, customer_id, status, currency, subtotal, discount_amount,
    total, payment_method, shipping_address, points_redeemed)
  values (p_order_code, v_customer_id, 'pending', 'VND', p_amount + v_discount, v_discount,
    p_amount, 'payos', p_shipping_address, v_points_redeemed)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb))
  loop
    insert into public.order_items (order_id, product_id, sku, name_vi, quantity, unit_price, line_total)
    values (
      v_order_id,
      (select id from public.products where sku = (v_item->>'sku') limit 1),
      coalesce(v_item->>'sku', 'UNKNOWN'),
      coalesce(v_item->>'name', ''),
      coalesce((v_item->>'quantity')::int, 1),
      coalesce((v_item->>'price')::numeric, 0),
      coalesce((v_item->>'quantity')::int, 1) * coalesce((v_item->>'price')::numeric, 0)
    );
  end loop;

  return v_order_id;
end;
$$;
```

Lưu ý: `p_amount` client gửi lên vẫn là số tiền NET sau khi trừ discount
(đúng hành vi cũ) — nếu client tính sai/cố tình gửi `p_points_redeemed` vượt
trần, hàm này tự kẹp lại `v_discount` theo đúng trần thật, **nhưng
`p_amount` (số tiền thật sẽ thu qua PayOS) không tự sửa lại theo** vì link
thanh toán PayOS đã được tạo với `p_amount` đó ở bước trước trong cùng
request (`api/create-payos-payment.ts` gọi PayOS trước, ghi Supabase sau,
không blocking nhau — xem comment đầu file). Ghi nhận đây là **giới hạn đã
biết**: kẹp phía SQL chỉ đảm bảo *sổ sách* (`orders.discount_amount`) không
bao giờ sai, không ngăn được 1 request client cố tình gửi amount đã trừ quá
tay tới PayOS. Rủi ro thực tế thấp (không có UI nào trên site cho phép nhập
tay điểm vượt trần — trần đã được UI Checkout.tsx tự chặn), nhưng nếu Joe cần
chặn tuyệt đối ở tầng API sau này, cần sửa `api/create-payos-payment.ts` để
tính lại `p_amount` từ `loyalty_settings` trước khi gọi PayOS — ngoài phạm vi
spec này (spec này giải quyết đúng lỗ hổng Joe nêu: cấu hình bị fix cứng và
không nhất quán, không phải lỗ hổng gian lận qua API).

## 3. Frontend

### 3.1 `src/lib/loyaltySettingsApi.ts` (mới)

```ts
export interface LoyaltySettings {
  redemptionVndPerPoint: number;
  maxRedeemRatio: number;
  clubEnabled: boolean;
}
export interface LoyaltyTierRow {
  tierIndex: number;
  name: string;
  nameVi: string;
  minPoints: number;
  discountPct: number;
}
export async function fetchLoyaltySettings(): Promise<LoyaltySettings>
export async function fetchLoyaltyTierRows(): Promise<LoyaltyTierRow[]>
```
Đọc thẳng 2 bảng qua Supabase client (RLS public select), không cần RPC —
không có PII, khác với `products`/`get_product_overrides` (lý do bảng đó
phải qua RPC là để phân biệt SKU chưa track vs SKU bị ẩn, không áp dụng ở
đây).

### 3.2 Hook `useLoyaltyConfig()` (mới, `src/hooks/useLoyaltyConfig.ts`)

Fail-open giống hệt `useLiveProducts`: lỗi fetch → dùng default cứng (100đ,
30%, `club_enabled: true`, 3 hạng y hệt `mockData.ts` hiện tại) — không bao
giờ chặn trang vì Supabase lỗi.

### 3.3 Nơi tiêu thụ

- `LoyaltyDashboard.tsx`, `EliteTeaser.tsx`: thay `loyaltyTiers` (import tĩnh
  từ `mockData.ts`) bằng tier rows từ `useLoyaltyConfig()`. `mockData.ts`
  giữ nguyên làm giá trị fallback mặc định trong hook, không xoá.
- `src/lib/loyaltyService.ts` — `calculateTierIndex()` nhận tier thresholds
  làm tham số thay vì đọc hard-code, gọi từ `getLoyaltyDataByEmail` sau khi
  đã fetch tiers.
- `Checkout.tsx` — bỏ 2 hằng số `REDEMPTION_VND_PER_POINT`/`MAX_REDEEM_RATIO`,
  dùng `useLoyaltyConfig()`. Tính `eligibleSubtotal` = tổng dòng hàng có
  `product.redeemEligible !== false` (field mới trên `Product`, đọc qua
  `useLiveProducts`), trần redeem hiển thị = `eligibleSubtotal * maxRedeemRatio`
  thay vì tổng cả đơn — khớp con số hàm SQL sẽ tự tính lại, tránh khách thấy
  UI cho phép 1 số nhưng lúc thanh toán bị kẹp xuống thấp hơn không rõ lý do.
- `App.tsx`/homepage: `EliteTeaser` chỉ render khi `clubEnabled === true`.
  `LoyaltyDashboard` khi `clubEnabled === false` hiện thông báo "Chương trình
  tạm ngừng" thay vì dashboard đầy đủ (không xoá dữ liệu điểm của khách, chỉ
  ẩn giao diện — Joe có thể bật lại bất cứ lúc nào không mất dữ liệu).

### 3.4 Admin — mở rộng `LoyaltyPage.tsx`

Thêm khối "Cài đặt chương trình" phía trên bảng hội viên hiện có (không đụng
bảng đó): 3 hàng hạng (tên/ngưỡng điểm/%hoàn tiền, input số + text), 2 ô số
(tỷ lệ đổi điểm, trần %), 1 toggle bật/tắt club, 1 nút Lưu ghi cả 4 bảng/cột
liên quan qua các hàm mới trong `adminApi.ts`
(`updateLoyaltyTiers`, `updateLoyaltySettings`).

### 3.5 Admin — mở rộng `ProductsPage.tsx`

Thêm 1 cột "Đổi điểm" (toggle) trong bảng sản phẩm hiện có, ghi qua
`updateProduct(id, { redeem_eligible })` (mở rộng hàm `updateProduct` đã có
sẵn cho phép `active`/`price_vnd`).

## 4. Testing

Không có test runner (đã ghi nhận nhiều lần trong repo) — verify bằng:
- `npx tsc -b && npm run build && npm run check:brand`.
- Script `tsx` throwaway kiểm `calculateTierIndex`/eligible-subtotal logic
  thuần (không cần DB thật).
- Verify SQL functions bằng `execute_sql` qua Supabase MCP trên project thật
  (project này không có staging riêng — mọi migration áp thẳng production,
  đã có tiền lệ làm vậy trong repo này) — chạy thử `record_payos_order` với
  input giả lập, kiểm `orders.discount_amount` ra đúng số trước khi coi là
  xong.
- Verify UI thật qua browser preview: đổi 1 số trong admin Loyalty settings,
  xác nhận EliteTeaser/LoyaltyDashboard hiển thị đổi theo ngay (không cache).

## 5. Non-goals

- Không hợp nhất 2 hệ thống loyalty (client 3-hạng vs CRM Silver/Gold/Platinum/Elite).
- Không thêm/bớt số lượng hạng.
- Không đưa danh sách quyền lợi (perks) từng hạng vào admin.
- Không tự động chặn client gửi `p_amount` sai lệch tới PayOS (giới hạn đã
  ghi ở §2.4) — chỉ đảm bảo sổ sách Supabase luôn đúng.
