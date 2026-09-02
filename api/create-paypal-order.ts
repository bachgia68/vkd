export const config = { runtime: 'nodejs' };

import type { VercelRequest, VercelResponse } from '@vercel/node';

const PAYPAL_API = 'https://api-m.paypal.com';

async function getAccessToken(): Promise<string> {
  const creds = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { amountUSD, description } = req.body as { amountUSD: number; description: string };
  if (!amountUSD || amountUSD <= 0) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const token = await getAccessToken();
    const order = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: 'USD', value: amountUSD.toFixed(2) },
          description: description || 'TA Sâm Ngọc Linh',
        }],
        application_context: {
          brand_name: 'TA Sâm Ngọc Linh',
          user_action: 'PAY_NOW',
        },
      }),
    });
    const orderData = await order.json() as { id: string };
    res.status(200).json({ orderID: orderData.id });
  } catch {
    res.status(500).json({ error: 'PayPal API error' });
  }
}
