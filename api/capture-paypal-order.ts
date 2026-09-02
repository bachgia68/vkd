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
  const { orderID } = req.body as { orderID: string };
  if (!orderID) return res.status(400).json({ error: 'Missing orderID' });

  try {
    const token = await getAccessToken();
    const capture = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    const data = await capture.json() as { status: string; id: string };
    if (data.status === 'COMPLETED') {
      res.status(200).json({ success: true, paypalOrderId: data.id });
    } else {
      res.status(400).json({ error: 'Capture failed', status: data.status });
    }
  } catch {
    res.status(500).json({ error: 'PayPal capture error' });
  }
}
