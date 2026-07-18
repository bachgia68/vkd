import { PayOS } from '@payos/node';

// Nhận thông báo thanh toán từ PayOS (server-to-server) sau khi khách quét VietQR
// chuyển khoản thành công. payOS gọi endpoint này trực tiếp — không qua trình duyệt khách.
//
// LƯU Ý: dự án hiện CHƯA có database, nên endpoint này mới chỉ xác thực chữ ký (chống giả
// mạo) và ghi log. Muốn tự động cập nhật trạng thái đơn hàng thật, cần nối thêm một nơi lưu
// trữ (vd. Supabase) ở bước "TODO" bên dưới.

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

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('PayOS webhook verify failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }
};
