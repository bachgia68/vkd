---
name: manage-payos-checkout
description: Use when debugging, testing, or modifying the PayOS VietQR checkout flow - payment button not opening anything, webhook confirmation, env vars, or editing Checkout.tsx / api/create-payos-payment.ts / api/payos-webhook.ts.
---

# Van hanh & debug thanh toan PayOS (VietQR)

## QUAN TRONG - da port sang Vercel (chot ngay 2026-08-03)
Site chinh deploy tren Vercel (xem skill `deploy-vkd-site`), nhung 2 ham thanh toan ban dau
chi ton tai duoi dang Netlify Functions (`netlify/functions/*.mts`) - Vercel KHONG chay thu
muc nay, nen luong thanh toan THAT SU GAY tren domain that (`tasamngoclinh.com`) cho toi khi
phat hien va sua. Da port sang `api/create-payos-payment.ts` + `api/payos-webhook.ts` (dung
Vercel Node.js Serverless Function, KHONG dung Edge Runtime - SDK `@payos/node` tu detect
crypto provider theo `typeof window`, ep Node runtime de chac chan dung `node:crypto`).
File Netlify goc (`netlify/functions/*.mts`) VAN GIU LAI - neu sua logic thanh toan, sua CA
2 noi (`api/*.ts` la ban Vercel dang chay that, `netlify/functions/*.mts` la backup phong khi
quay lai Netlify).

## Luong hoat dong
- Khach bam "Dat Hang" o `src/components/Checkout.tsx` -> `handlePlaceOrder` kiem tra du Ho Ten/Email/Dia Chi (bao loi qua state `formError` neu thieu - DUNG de ham nay `return` cam lang nua). Neu hop le -> `handlePayOSCheckout` POST toi `/api/create-payos-payment` -> neu co `checkoutUrl`, `window.location.href` CHUYEN HUONG CA TRANG sang trang PayOS de khach quet VietQR tren do.
- `api/create-payos-payment.ts` can 3 bien moi truong: `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY` (dat tren **Vercel** -> Project Settings -> Environment Variables, lay tu my.payos.vn -> Kenh thanh toan -> Thong tin ket noi). Thieu 1 trong 3 -> ham tra ve 500, khach thay man "Thanh Toan That Bai". Cung can `SUPABASE_URL` + `SUPABASE_ANON_KEY` (server-side, khac voi `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` dung cho client) de goi RPC `record_payos_order` - ghi don hang that vao bang `orders`/`order_items` (project Supabase `xcwirgrlnibnjmseglee` - xac nhan qua bundle JS site that, KHONG phai project nao khac Joe tao rieng) ngay luc tao link thanh toan, khong doi den khi khach thanh toan xong.
- `api/payos-webhook.ts` xac thuc chu ky PayOS, goi RPC `mark_payos_order_paid` de danh dau don `paid` trong Supabase, roi gui email bao don qua Resend (can `RESEND_API_KEY` + `ORDER_NOTIFY_EMAIL`) - **CHI gui cho admin (`ORDER_NOTIFY_EMAIL`), CHUA gui email xac nhan cho khach hang** (chua co buoc doc lai `buyer_email` tu bang `customers` sau khi `mark_payos_order_paid` chay - can lam neu muon "bao email cho ca KH va admin").
- Dang ky lai webhook URL voi PayOS: `npm run payos:confirm-webhook <url>` (xem `scripts/confirm-payos-webhook.mjs` - can 3 bien env PayOS truyen qua tay), URL dung: `https://tasamngoclinh.com/api/payos-webhook`.

## Loi thuong gap khi test
- "Bam Dat Hang khong thay gi / khong co QR" -> phan lon la do form Ho Ten/Email/Dia Chi chua dien du (kiem tra dong `formError` co hien duoi nut khong).
- Test bang `npm run dev` (Vite thuan) -> `/api/*` KHONG ton tai o local, luon roi vao khoi `catch` -> hien "Thanh Toan That Bai". Day la gioi han moi truong local, KHONG PHAI bug can sua - muon test ham that o local can Vercel CLI (`vercel dev`), script `dev` trong package.json hien chua cau hinh viec nay.
- Chi PayOS (VietQR) hoat dong that - the/PayPal/VNPAY/MoMo co tinh khoa (`comingSoon: true` trong `paymentOptions`), khong phai bug thieu tich hop.
- Thanh toan LUON thu bang VND bat ke vung/tien te khach dang chon o buoc checkout (bien `payosTotal` tinh rieng theo VND, khong theo `region`).

## Kiem tra nhanh sau khi sua code
1. `npm run build` de bat loi type (chi kiem `src/`; `api/*.ts` khong nam trong `tsconfig` chinh - typecheck rieng bang tsconfig tam nếu sua nhieu, xem cach lam trong lich su session 2026-08-03).
2. Chay `npm run dev` nen, dien DU form, bam "Dat Hang" -> phai chuyen sang "Dang Xu Ly..." roi ve "Thanh Toan That Bai" - dung nhu ky vong o local, KHONG phai loi can sua.
3. Muon test luong that (tao link PayOS that, quet QR that, ghi don vao Supabase that) -> phai test tren `tasamngoclinh.com` da deploy Vercel VA da co du 5 bien moi truong (`PAYOS_CLIENT_ID/API_KEY/CHECKSUM_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`) + 2 bien Resend (`RESEND_API_KEY`, `ORDER_NOTIFY_EMAIL`) tren Vercel - chua xac nhan Joe da dien du chua, hoi lai truoc khi bao "da xong".
