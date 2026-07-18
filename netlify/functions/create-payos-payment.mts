import { PayOS } from '@payos/node';

// Tạo link thanh toán PayOS (VietQR Napas 24/7).
// Yêu cầu 3 biến môi trường cấu hình trong Netlify: PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY
// Lấy từ my.payos.vn -> Kênh thanh toán -> Thông tin kết nối.
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
      }),
    });
  } catch (err) {
    console.error('record_payos_order failed:', err);
  }
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (!clientId || !apiKey || !checksumKey) {
    return new Response(
      JSON.stringify({ error: 'Chưa cấu hình PAYOS_CLIENT_ID / PAYOS_API_KEY / PAYOS_CHECKSUM_KEY trên Netlify.' }),
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
    };

    if (!body.amount || body.amount < 1000) {
      return new Response(JSON.stringify({ error: 'Số tiền không hợp lệ' }), { status: 400 });
    }

    // Mã đơn hàng phải là số nguyên, duy nhất theo thời gian tạo (đủ dùng cho quy mô hiện tại).
    const orderCode = Number(String(Date.now()).slice(-9));

    const paymentLink = await payos.paymentRequests.create({
      orderCode,
      amount: Math.round(body.amount),
      description: `VKD don hang ${orderCode}`.slice(0, 25),
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
};
