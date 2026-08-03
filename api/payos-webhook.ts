import { PayOS } from '@payos/node';

export const config = { runtime: 'nodejs' };

// Nhận thông báo thanh toán từ PayOS (server-to-server) sau khi khách quét VietQR
// chuyển khoản thành công. payOS gọi endpoint này trực tiếp — không qua trình duyệt khách.
// Bản port sang Vercel (thư mục /api) — xem ghi chú runtime ở api/create-payos-payment.ts.
//
// Xác thực chữ ký (chống giả mạo), đánh dấu đơn hàng "đã thanh toán" trên Supabase
// (xem api/create-payos-payment.ts — đơn được ghi lại lúc tạo link thanh
// toán), rồi gửi email báo đơn cho TA và email xác nhận cho khách.

async function fetchBuyerEmail(orderCode: string): Promise<string | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_order_buyer_email`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: supabaseAnonKey,
        authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ p_order_code: orderCode }),
    });
    const email = await res.json();
    return typeof email === 'string' && email ? email : null;
  } catch (err) {
    console.error('get_order_buyer_email failed:', err);
    return null;
  }
}

async function notifyCustomer(
  buyerEmail: string,
  webhookData: { orderCode: number; amount: number; transactionDateTime: string }
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: 'TA Sâm Ngọc Linh <onboarding@resend.dev>',
        to: [buyerEmail],
        subject: `Xác nhận đơn hàng #${webhookData.orderCode} — TA Sâm Ngọc Linh`,
        html: `
          <h2>Cảm ơn anh/chị đã đặt hàng tại TA Sâm Ngọc Linh</h2>
          <p>Chúng tôi đã nhận được thanh toán cho đơn hàng của anh/chị.</p>
          <p><b>Mã đơn:</b> ${webhookData.orderCode}</p>
          <p><b>Số tiền:</b> ${webhookData.amount.toLocaleString('vi-VN')}đ</p>
          <p><b>Thời gian thanh toán:</b> ${webhookData.transactionDateTime}</p>
          <p>Đội ngũ TA sẽ liên hệ xác nhận và tiến hành giao hàng trong thời gian sớm nhất.
          Mọi thắc mắc xin liên hệ Zalo/hotline 0984 999 309.</p>
        `,
      }),
    });
  } catch (err) {
    console.error('Resend customer notify failed:', err);
  }
}

async function markOrderPaid(orderCode: string, paymentRef: string) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return;

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/mark_payos_order_paid`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: supabaseAnonKey,
        authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ p_order_code: orderCode, p_payment_ref: paymentRef }),
    });
    const data = (await res.json()) as { success?: boolean };
    if (!data?.success) {
      console.error('mark_payos_order_paid: order not found or already processed', orderCode);
    }
  } catch (err) {
    console.error('mark_payos_order_paid failed:', err);
  }
}

async function notifyNewOrder(webhookData: { orderCode: number; amount: number; reference: string; transactionDateTime: string; description: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: 'TA Sâm Ngọc Linh <onboarding@resend.dev>',
        to: [to],
        subject: `[TA] Đơn hàng mới #${webhookData.orderCode} — đã thanh toán`,
        html: `
          <h2>Đơn hàng mới đã thanh toán qua PayOS</h2>
          <p><b>Mã đơn:</b> ${webhookData.orderCode}</p>
          <p><b>Số tiền:</b> ${webhookData.amount.toLocaleString('vi-VN')}đ</p>
          <p><b>Mã tham chiếu ngân hàng:</b> ${webhookData.reference}</p>
          <p><b>Thời gian:</b> ${webhookData.transactionDateTime}</p>
          <p><b>Nội dung CK:</b> ${webhookData.description}</p>
        `,
      }),
    });
  } catch (err) {
    console.error('Resend notify failed:', err);
  }
}

// Named export (not `export default (req) => Response`) - see comment in
// api/create-payos-payment.ts for why the default-export arrow form hangs on Vercel.
export async function POST(req: Request) {
  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (!clientId || !apiKey || !checksumKey) {
    return new Response('Missing PayOS env vars', { status: 500 });
  }

  const payos = new PayOS({ clientId, apiKey, checksumKey });

  try {
    const body = (await req.json()) as Parameters<typeof payos.webhooks.verify>[0];
    const webhookData = await payos.webhooks.verify(body);

    // Dữ liệu test mẫu mà payOS gửi khi bấm "Xác nhận Webhook URL" trên my.payos.vn
    if (['Ma giao dich thu nghiem', 'VQRIO123'].includes(webhookData.description)) {
      return new Response(JSON.stringify({ received: true, test: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    console.log('PayOS webhook verified:', {
      orderCode: webhookData.orderCode,
      amount: webhookData.amount,
      reference: webhookData.reference,
      transactionDateTime: webhookData.transactionDateTime,
    });

    const orderCode = String(webhookData.orderCode);
    await markOrderPaid(orderCode, webhookData.reference);
    await notifyNewOrder(webhookData);

    const buyerEmail = await fetchBuyerEmail(orderCode);
    if (buyerEmail) await notifyCustomer(buyerEmail, webhookData);

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('PayOS webhook verify failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }
}
