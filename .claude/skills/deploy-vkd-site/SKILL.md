---
name: deploy-vkd-site
description: Use when building, verifying, committing, and pushing changes to the VKD Group website so Vercel auto-deploys - the standard ship flow for this repo.
---

# Deploy website VKD Group

## QUAN TRONG - Vercel la site that (chot ngay 2026-08-03)
Repo nay tung deploy song song ca Netlify va Vercel tu cung 1 GitHub repo, gay nham lan.
Nguoi dung da xac nhan **Vercel la noi khach hang thuc su vao** (domain `tasamngoclinh.com`
tro vao day). Netlify da duoc doi ten tu `vkd-nature-storefront` sang `old-site-nature`
ngay 2026-08-04 (theo yeu cau nguoi dung, giu lai phong khi can dung lai, khong xoa han) -
`netlify.toml` van con cau hinh trong repo nhung KHONG con la target chinh - dung dua vao
no de bao cao trang thai site, va can hoi nguoi dung truoc khi go bo han de tranh xoa nham
cau hinh con dung.

## Quy trinh chuan
1. Sua code bang Edit (Write cho FILE MOI thi dung PowerShell - xem skill `vkd-web` muc Moi truong).
2. `npm run build` - bat loi type/build truoc khi xem tren trinh duyet.
3. Xem thu: chay `npm run dev` nen, mo `preview_start({url: "http://localhost:5173"})`, kiem tra dung luong vua sua.
4. `git status` / `git diff` de soat lai dung file dinh commit (dung path ngan 8.3 hoac cd tuong doi - xem skill `vkd-web`, khong go lai path co dau tieng Viet cho git qua Bash).
5. `git add <file cu the>` (khong `git add -A`), commit voi message mo ta ro da sua gi va vi sao.
6. CHI push khi nguoi dung yeu cau ro rang (hoi truoc neu chua ro) - push len `origin main` la hanh dong cong khai. Vercel project `ta` (team `bachgia68-1157s-projects`) da lien ket voi GitHub repo `bachgia68/vkd` nhanh `main` nen se tu redeploy ngay khi co commit moi.
7. Sau khi push, kiem tra deployment moi nhat qua Vercel MCP (`list_deployments` / `get_deployment` cho project `prj_tmnHHwdlbdivLazUpypJGwK9JLY2`) thay vi doan - Netlify cung se build song song nhung khong con la ban that.

## Thong tin repo
- Remote: `https://github.com/bachgia68/vkd.git` (`origin`, nhanh `main`).
- Site live (that): `https://tasamngoclinh.com` (Vercel project `ta`, team `bachgia68-1157s-projects`).
- Site cu/backup, khong con dung (da doi ten 2026-08-04 de tranh nham voi TA): `https://old-site-nature.netlify.app`.
- Build command: `npm run build`, publish `dist` (Vercel tu detect framework Vite qua `vercel.json` chi co rewrites SPA).
- Bien moi truong can co tren Vercel (Project Settings -> Environment Variables): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (bat buoc de dang nhap admin hoat dong - xem skill `manage-admin-mockdata`), va cac bien PayOS/Resend neu dung serverless functions tuong duong ben Vercel (`PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`, `RESEND_API_KEY`, `ORDER_NOTIFY_EMAIL` - can doi chieu lai vi cau hinh cu ghi cho Netlify Functions, chua xac nhan da copy sang Vercel).