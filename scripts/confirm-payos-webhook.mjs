// Script chạy MỘT LẦN sau khi đã có PAYOS_CLIENT_ID / PAYOS_API_KEY / PAYOS_CHECKSUM_KEY thật
// và site đã deploy, để đăng ký webhook URL với payOS.
//
// Cách chạy (từ thư mục project):
//   PAYOS_CLIENT_ID=xxx PAYOS_API_KEY=xxx PAYOS_CHECKSUM_KEY=xxx \
//     node scripts/confirm-payos-webhook.mjs https://vkd-nature-storefront.netlify.app/.netlify/functions/payos-webhook

import { PayOS } from '@payos/node';

const webhookUrl = process.argv[2];
if (!webhookUrl) {
  console.error('Thiếu webhook URL. Ví dụ:');
  console.error('  node scripts/confirm-payos-webhook.mjs https://<site>/.netlify/functions/payos-webhook');
  process.exit(1);
}

const { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY } = process.env;
if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
  console.error('Thiếu biến môi trường PAYOS_CLIENT_ID / PAYOS_API_KEY / PAYOS_CHECKSUM_KEY.');
  process.exit(1);
}

const payos = new PayOS({
  clientId: PAYOS_CLIENT_ID,
  apiKey: PAYOS_API_KEY,
  checksumKey: PAYOS_CHECKSUM_KEY,
});

const result = await payos.webhooks.confirm(webhookUrl);
console.log('Đã đăng ký webhook thành công:', result);
