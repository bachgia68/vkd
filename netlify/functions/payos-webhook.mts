import { PayOS } from '@payos/node';

// Nhận thông báo thanh toán từ PayOS (server-to-server) sau khi khách quét VietQR
// chuyển khoản thành công. payOS gọi endpoint này trực tiếp — không qua trình duyệt khách.
//
// LƯU Ý: dự án hiện CHƯA có database, nên endpoint này mới chỉ xác thực chữ ký (chống giả
// mạo), gửi email báo đơn cho VKD, và ghi log. Muốn tự động cập nhật trạng thái đơn hàng thật,
// cần nối thêm một nơi lưu trữ (vd. Supabase) ở bước "TODO" bên dưới.

async function notifyNewOrder(webhookData: { orderCode: number; amount: number; reference: string; transactionDateTime: string; description: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: 'VKD Group <onboarding@resend.dev>',
        to: [to],
        subject: `[VKD] Đơn hàng mới #${webhookData.orderCode} — đã thanh toán`,
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

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (!clientId || !apiKey || !checksumKey) {
    return new Response('Missing PayOS env vars', { status: 500 });
  }

  const payos = new PayOS({ clientId, apiKey, checksumKey });

  try {
    const body = await req.json();
    const webhookData = await payos.webhooks.verify(body);

    // Dữ liệu test mẫu mà payOS gửi khi bấm "Xác nhận Webhook URL" trên my.payos.vn
    if (['Ma giao dich thu nghiem', 'VQRIO123'].includes(webhookData.description)) {
      return new Response(JSON.stringify({ received: true, test: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    // TODO: khi có database — cập nhật đơn hàng theo webhookData.orderCode sang trạng thái
    // "đã thanh toán" tại đây (vd. lưu vào bảng orders trên Supabase).
    console.log('PayOS webhook verified:', {
      orderCode: webhookData.orderCode,
      amount: webhookData.amount,
      reference: webhookData.reference,
      transactionDateTime: webhookData.transactionDateTime,
    });

    await notifyNewOrder(webhookData);

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('PayOS webhook verify failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }
};
