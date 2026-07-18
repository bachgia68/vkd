import { PayOS } from '@payos/node';

// Tạo link thanh toán PayOS (VietQR Napas 24/7).
// Yêu cầu 3 biến môi trường cấu hình trong Netlify: PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY
// Lấy từ my.payos.vn -> Kênh thanh toán -> Thông tin kết nối.

interface CartLine {
  name: string;
  quantity: number;
  price: number;
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
