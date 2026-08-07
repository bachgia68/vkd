import { PayOS } from '@payos/node';

export const config = { runtime: 'nodejs' };

// Tạo link thanh toán PayOS (VietQR Napas 24/7).
// Bản port sang Vercel Node.js Serverless Function (thư mục /api, không phải Edge Runtime — SDK
// @payos/node tự chọn crypto provider theo môi trường, ép về Node runtime để chắc chắn dùng
// node:crypto thay vì SubtleCrypto detect nhầm trên Edge). File gốc netlify/functions/*.mts vẫn
// giữ lại phòng khi cần deploy Netlify song song — sửa cả 2 nơi nếu đổi logic.
// Yêu cầu 3 biến môi trường cấu hình trên Vercel (Project Settings -> Environment Variables):
// PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY. Lấy từ my.payos.vn -> Kênh thanh toán -> Thông tin kết nối.
//
// Cũng cần SUPABASE_URL, SUPABASE_ANON_KEY để ghi lại đơn hàng ngay khi tạo link thanh toán —
// trước đây đơn hàng chỉ tồn tại trong state trình duyệt + 1 email thông báo, mất hoàn toàn nếu
// khách đóng tab hoặc email lỗi. Việc ghi Supabase không được chặn luồng thanh toán: nếu lỗi,
// khách vẫn nhận được link PayOS bình thường, lỗi chỉ log lại phía server.

interface CartLine {
  sku?: string;
  name: string;
  quantity: number;
  price: number;
}

async function recordOrder(params: {
  orderCode: string;
  amount: number;
  items: CartLine[];
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  pointsRedeemed?: number;
}) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return;

  try {
    await fetch(`${supabaseUrl}/rest/v1/rpc/record_payos_order`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: supabaseAnonKey,
        authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        p_order_code: params.orderCode,
        p_amount: params.amount,
        p_buyer_name: params.buyerName ?? null,
        p_buyer_email: params.buyerEmail ?? null,
        p_buyer_phone: params.buyerPhone ?? null,
        p_shipping_address: null,
        p_items: params.items.map((i) => ({ sku: i.sku, name: i.name, quantity: i.quantity, price: i.price })),
        p_points_redeemed: params.pointsRedeemed ?? 0,
      }),
    });
  } catch (err) {
    console.error('record_payos_order failed:', err);
  }
}

// Vercel Node functions expect named HTTP-method exports (GET/POST/...) that
// take a Web `Request` and return a `Response` - a bare `export default (req) => Response`
// is treated as the legacy `(req, res) => void` signature, its return value is
// silently ignored, and the request hangs until Vercel's function timeout (504).
export async function POST(req: Request) {
  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (!clientId || !apiKey || !checksumKey) {
    return new Response(
      JSON.stringify({ error: 'Chưa cấu hình PAYOS_CLIENT_ID / PAYOS_API_KEY / PAYOS_CHECKSUM_KEY trên Vercel.' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const payos = new PayOS({ clientId, apiKey, checksumKey });

  try {
    const body = (await req.json()) as {
      amount: number;
      items?: CartLine[];
      buyerName?: string;
      buyerEmail?: string;
      buyerPhone?: string;
      returnUrl: string;
      cancelUrl: string;
      pointsRedeemed?: number;
    };

    if (!body.amount || body.amount < 1000) {
      return new Response(JSON.stringify({ error: 'Số tiền không hợp lệ' }), { status: 400 });
    }

    // Mã đơn hàng phải là số nguyên, duy nhất theo thời gian tạo (đủ dùng cho quy mô hiện tại).
    const orderCode = Number(String(Date.now()).slice(-9));

    const paymentLink = await payos.paymentRequests.create({
      orderCode,
      amount: Math.round(body.amount),
      description: `TA don hang ${orderCode}`.slice(0, 25),
      buyerName: body.buyerName,
      buyerEmail: body.buyerEmail,
      buyerPhone: body.buyerPhone,
      items: body.items?.map((i) => ({ name: i.name, quantity: i.quantity, price: Math.round(i.price) })),
      cancelUrl: body.cancelUrl,
      returnUrl: body.returnUrl,
    });

    await recordOrder({
      orderCode: String(orderCode),
      amount: Math.round(body.amount),
      items: body.items ?? [],
      buyerName: body.buyerName,
      buyerEmail: body.buyerEmail,
      buyerPhone: body.buyerPhone,
      pointsRedeemed: body.pointsRedeemed && body.pointsRedeemed > 0 ? Math.round(body.pointsRedeemed) : 0,
    });

    return new Response(
      JSON.stringify({
        checkoutUrl: paymentLink.checkoutUrl,
        qrCode: paymentLink.qrCode,
        paymentLinkId: paymentLink.paymentLinkId,
        orderCode: paymentLink.orderCode,
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Lỗi không xác định' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }
}
