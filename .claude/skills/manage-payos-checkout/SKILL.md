---
name: manage-payos-checkout
description: Use when debugging, testing, or modifying the PayOS VietQR checkout flow - payment button not opening anything, webhook confirmation, env vars, or editing Checkout.tsx / create-payos-payment.mts / payos-webhook.mts.
---

# Van hanh & debug thanh toan PayOS (VietQR)

## Luong hoat dong
- Khach bam "Dat Hang" o `src/components/Checkout.tsx` -> `handlePlaceOrder` kiem tra du Ho Ten/Email/Dia Chi (bao loi qua state `formError` neu thieu - DUNG de ham nay `return` cam lang nua, da tung gay bug "bam khong thay gi/khong thay QR" vi khach chua dien du form ma khong duoc bao). Neu hop le -> `handlePayOSCheckout` POST toi `/.netlify/functions/create-payos-payment` -> neu co `checkoutUrl`, `window.location.href` CHUYEN HUONG CA TRANG sang trang PayOS (KHONG phai popup/modal/iframe rieng) de khach quet VietQR tren do.
- `netlify/functions/create-payos-payment.mts` can 3 bien moi truong: `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY` (dat tren Netlify -> Site settings -> Environment variables, lay tu my.payos.vn -> Kenh thanh toan -> Thong tin ket noi). Thieu 1 trong 3 -> ham tra ve 500, khach thay man "Thanh Toan That Bai".
- `netlify/functions/payos-webhook.mts` xac thuc chu ky PayOS, gui email bao don (Resend, can `RESEND_API_KEY` + `ORDER_NOTIFY_EMAIL`), roi CHI ghi log - chua luu don hang vao database nao (co san comment TODO trong file de noi khi co DB that).
- Dang ky lai webhook URL voi PayOS: `npm run payos:confirm-webhook <url>` (xem `scripts/confirm-payos-webhook.mjs` - can 3 bien env PayOS truyen qua tay, URL dang `https://<site>/.netlify/functions/payos-webhook`).

## Loi thuong gap khi test
- "Bam Dat Hang khong thay gi / khong co QR" -> phan lon la do form Ho Ten/Email/Dia Chi chua dien du (kiem tra dong `formError` co hien duoi nut khong). Da sua de LUON bao loi ro khi thieu field trong `handlePlaceOrder` - neu thay lai hien tuong cam lang, co the ai do da sua mat doan `setFormError`.
- Test bang `npm run dev` (Vite thuan, khong phai Netlify Dev) -> `/.netlify/functions/*` KHONG ton tai o local, luon roi vao khoi `catch` -> hien "Thanh Toan That Bai". Day la gioi han moi truong local, KHONG PHAI bug can sua - muon test ham Netlify that o local can Netlify CLI (`netlify dev`), script `dev` trong package.json hien chua cau hinh viec nay.
- Chi PayOS (VietQR) hoat dong that - the/PayPal/VNPAY/MoMo co tinh khoa (`comingSoon: true` trong `paymentOptions`), khong phai bug thieu tich hop.
- Thanh toan LUON thu bang VND bat ke vung/tien te khach dang chon o buoc checkout (bien `payosTotal` tinh rieng theo VND, khong theo `region`).

## Kiem tra nhanh sau khi sua code
1. `npm run build` de bat loi type.
2. Chay `npm run dev` nen, dien DU form, bam "Dat Hang" -> phai chuyen sang "Dang Xu Ly..." roi (do thieu Netlify functions o local) roi ve "Thanh Toan That Bai" - dung nhu ky vong, KHONG phai loi can sua.
3. Muon test luong that (tao link PayOS that, quet QR that) -> phai test tren site da deploy Netlify, khong test day du duoc o local.