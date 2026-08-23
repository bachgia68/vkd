# Phase 2 Test Plan — Live Verification

**Target:** Verify HeroSection + Footer components fetch & render Strapi data  
**Expected:** Hero + Footer show dynamic content from Strapi admin  
**Timeline:** 10-15 min test + 2-3 min troubleshooting if needed

---

## Test Sequence

### 1️⃣ Check Dependencies (npm install)
```bash
npm install
# Espera: "added X packages, audited Y packages in Zs"
```
**Expected:** ✅ No errors

---

### 2️⃣ Start Strapi (port 1337)
```bash
npm run develop
# Espera: "Strapi listening on port 1337"
```
**Expected:** ✅ Admin at http://localhost:1337/admin

**Action:** Abrir http://localhost:1337/admin
- Login (create admin if first time)
- Navegar para "Content Manager" → Verify 3 collections exist:
  - ✅ Site Headers
  - ✅ Site Footers
  - ✅ Social Links

---

### 3️⃣ Add Test Data in Strapi

**Site Headers (adicionar 1 entry):**
```json
{
  "heroTitle": "🧪 Test: Sâm Ngọc Linh Chuyên Nghiệp",
  "heroSubtitle": "Phase 2 Testing - Data from Strapi Admin",
  "ctaButtonText": "Ver Produto →",
  "ctaButtonLink": "/products",
  "isActive": true
}
```

**Site Footers (adicionar 1 entry):**
```json
{
  "companyName": "🧪 TA - Sâm Ngọc Linh",
  "companyAddress": "Test Address - Kon Tum, VN",
  "companyPhone": "+84 test",
  "companyEmail": "test@ta.com",
  "copyrightText": "© 2026 TA Test. All rights reserved.",
  "isActive": true
}
```

**Social Links (adicionar 3 entries):**
```
1. platform: youtube, url: https://youtube.com, icon: 🎥, displayOrder: 1
2. platform: facebook, url: https://facebook.com, icon: 📘, displayOrder: 2
3. platform: instagram, url: https://instagram.com, icon: 📷, displayOrder: 3
```

**Publish todos os entries** (botão "Publish" no Strapi admin)

---

### 4️⃣ Verify Strapi API

Em outro terminal:
```bash
# Test header endpoint
curl "http://localhost:1337/api/site-headers?filters[isActive][$eq]=true" | jq .

# Espera: JSON array com heroTitle = "🧪 Test: ..."
```

---

### 5️⃣ Start Next.js Dev Server (port 3000)

Em terceiro terminal:
```bash
npm run dev
# Espera: "ready - started server on 0.0.0.0:3000"
```

---

### 6️⃣ Test Frontend

Abrir browser: http://localhost:3000

**Esperado na tela:**

```
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🧪 Test: Sâm Ngọc Linh Chuyên Nghiệp            ║
║   Phase 2 Testing - Data from Strapi Admin        ║
║                                                    ║
║   [Ver Produto →]   ← CTA button interactive      ║
║                                                    ║
╚════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════

╔════════════════════════════════════════════════════╗
║   🧪 TA - Sâm Ngọc Linh                           ║
║                                                    ║
║   Test Address - Kon Tum, VN                      ║
║   +84 test                                         ║
║   test@ta.com                                      ║
║                                                    ║
║   [🎥] [📘] [📷]   ← Social icons clickable       ║
║                                                    ║
║   © 2026 TA Test. All rights reserved.            ║
╚════════════════════════════════════════════════════╝
```

---

## ✅ Test Validation

- [ ] Hero title shows "🧪 Test: Sâm Ngọc Linh..."
- [ ] Hero subtitle shows "Phase 2 Testing..."
- [ ] CTA button visible and clickable (href="/products")
- [ ] Footer company name shows "🧪 TA - Sâm Ngọc Linh"
- [ ] Footer address/phone/email displayed
- [ ] 3 social icons visible in footer (🎥 📘 📷)
- [ ] Social icons are in correct order (1, 2, 3)
- [ ] Browser console has NO errors
- [ ] Responsive on mobile (resize to 375px width)

**All ✅ = Phase 2 PASS**

---

## 🔄 Live Update Test

1. Abrir Strapi admin: http://localhost:1337/admin
2. Editar Site Headers: Mudar heroTitle para "✅ LIVE UPDATE WORKS!"
3. Click "Save & Publish"
4. Voltar ao browser http://localhost:3000
5. **Apertar F5** (refresh)
6. Esperar que title mude para "✅ LIVE UPDATE WORKS!"

**If title updates = Dynamic rendering working ✅**

---

## 🐛 Troubleshooting

| Erro | Causa | Fix |
|------|-------|-----|
| "Cannot find module '@/lib/hooks'" | Paths not set | Check tsconfig.json paths |
| Hero shows "Đang tải..." forever | Strapi não started | Run `npm run develop` |
| "Failed to fetch" error | API unreachable | Check Strapi port 1337 |
| No styles (plain text) | Tailwind not working | Run `npm run dev` again |
| Port 3000 in use | Another process | Use `npm run dev -- -p 3001` |

---

## 📊 Success Metrics

| Métrica | Target | Status |
|---------|--------|--------|
| Hero renders | < 2s | ⏳ |
| Footer renders | < 2s | ⏳ |
| Social icons appear | Yes | ⏳ |
| Admin → Frontend sync | < 1s | ⏳ |
| Mobile responsive | Yes | ⏳ |
| No console errors | 0 | ⏳ |

---

**Phase 2 Test Ready. Aguardando npm install concluir.**
