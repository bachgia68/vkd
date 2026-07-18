---
name: deploy-vkd-site
description: Use when building, verifying, committing, and pushing changes to the VKD Group website so Netlify auto-deploys - the standard ship flow for this repo.
---

# Deploy website VKD Group

## Quy trinh chuan
1. Sua code bang Edit (Write cho FILE MOI thi dung PowerShell - xem skill `vkd-web` muc Moi truong).
2. `npm run build` - bat loi type/build truoc khi xem tren trinh duyet.
3. Xem thu: chay `npm run dev` nen, mo `preview_start({url: "http://localhost:5173"})`, kiem tra dung luong vua sua.
4. `git status` / `git diff` de soat lai dung file dinh commit (dung path ngan 8.3 hoac cd tuong doi - xem skill `vkd-web`, khong go lai path co dau tieng Viet cho git qua Bash).
5. `git add <file cu the>` (khong `git add -A`), commit voi message mo ta ro da sua gi va vi sao.
6. CHI push khi nguoi dung yeu cau ro rang (hoi truoc neu chua ro) - push len `origin main` la hanh dong cong khai va Netlify se tu deploy ngay khi co commit moi tren `main`.
7. Sau khi push, Netlify build & deploy tu dong trong khoang 1-2 phut - khong can thao tac gi them tren Netlify dashboard.

## Thong tin repo
- Remote: `https://github.com/bachgia68/vkd.git` (`origin`, nhanh `main`).
- Site live: `https://vkd-nature-storefront.netlify.app`.
- Build command Netlify: `npm run build`, publish `dist`, functions `netlify/functions` (xem `netlify.toml`).
- Bien moi truong can co tren Netlify (Site settings -> Environment variables): `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`, `RESEND_API_KEY`, `ORDER_NOTIFY_EMAIL`.