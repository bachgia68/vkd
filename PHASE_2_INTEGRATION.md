# Phase 2: Frontend Integration — Complete

**Status:** ✅ Components created + Config ready  
**Next:** Test locally + Deploy

---

## ✅ Phase 2 Deliverables

### Components Created
- **HeroSection.tsx** — Fetches header from Strapi, displays dynamic hero
- **Footer.tsx** — Fetches footer + social links, displays dynamic footer
- **app/layout.tsx** — Next.js root layout
- **app/page.tsx** — Homepage with HeroSection + Footer

### Configuration Files
- **next.config.js** — next-intl setup
- **tsconfig.json** — TypeScript paths (@/* alias)
- **i18n.ts** — Internationalization config
- **tailwind.config.ts** — Updated to include app/ directory
- **.env.local** — Strapi URL: `http://localhost:1337`

### Global Styles
- **app/globals.css** — Tailwind setup + custom CSS variables

---

## 🧪 Phase 2 Testing

### Test Checklist

**Step 1: Start Strapi**
```bash
cd site
npm install
npm run develop
```
Wait for: `Strapi listening on port 1337`

**Step 2: Create Admin Content**
1. Open `http://localhost:1337/admin`
2. Login or setup admin account
3. Add entries:
   - **Site Headers:** 1 entry with heroTitle, heroSubtitle, ctaButtonText, etc.
   - **Site Footers:** 1 entry with company info
   - **Social Links:** 5+ entries (YouTube, FB, Instagram, etc.)
   - Check `isActive: true` on all

**Step 3: Verify API Endpoints**
```bash
# Test header
curl "http://localhost:1337/api/site-headers?filters[isActive][$eq]=true"

# Test footer
curl "http://localhost:1337/api/site-footers?filters[isActive][$eq]=true"

# Test social links
curl "http://localhost:1337/api/social-links?filters[isActive][$eq]=true&sort=displayOrder:asc"
```

**Step 4: Start Next.js Dev Server**
```bash
npm run dev
```
Wait for: `ready - started server on localhost:3000`

**Step 5: Test Frontend**
- Open `http://localhost:3000`
- Verify:
  - [ ] Hero section displays (title, subtitle, CTA button visible)
  - [ ] Footer displays (company name, phone, email visible)
  - [ ] Social links show with icons (emoji or text)
  - [ ] No console errors
  - [ ] Responsive on mobile (resize browser to 375px)

**Step 6: Test Admin → Frontend Flow**
1. Change hero title in Strapi admin
2. Publish/save entry
3. Refresh browser (`F5`)
4. Hero title should update immediately
5. ✅ Dynamic updates working

---

## 🔍 Expected Output

### Hero Section
```
┌─────────────────────────────────────────┐
│  Sâm Ngọc Linh Chuyên Nghiệp            │
│  Chất lượng hàng đầu, chăm sóc sức khỏe │
│                                         │
│   [Xem sản phẩm]   (CTA button)         │
└─────────────────────────────────────────┘
```

### Footer
```
┌─────────────────────────────────────────┐
│ TA - Sâm Ngọc Linh | Về chúng tôi | ... │
│ Kon Tum, Việt Nam                       │
│ +84 xxx xxxx | contact@ta.com           │
│                                         │
│ 🎥 📘 📷 ♪ ✈️  (Social icons)           │
│                                         │
│ © 2026 TA. All rights reserved.         │
└─────────────────────────────────────────┘
```

---

## ⚠️ Troubleshooting

### "Cannot find module '@/lib/hooks/useHeader'"
- **Cause:** TypeScript paths not configured
- **Fix:** Verify tsconfig.json has `"@/*": ["./*"]`

### Hero not loading, shows "Đang tải..." forever
- **Cause:** Strapi not running or API unreachable
- **Fix:**
  ```bash
  curl http://localhost:1337/api/site-headers
  # Should return JSON, not error
  ```

### Footer shows "Lỗi: Failed to fetch footer"
- **Cause:** Strapi CORS or auth issue
- **Fix:**
  1. Check Strapi admin console for errors
  2. Verify entry is published (not draft)
  3. Verify `isActive: true` on entry

### "Next.js dev server won't start"
- **Cause:** Port 3000 in use or deps missing
- **Fix:**
  ```bash
  npm install
  npm run dev -- -p 3001  # Use different port
  ```

### Styling broken (no colors)
- **Cause:** Tailwind CSS not processing
- **Fix:**
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```

---

## ✅ Success Criteria — Phase 2

- [ ] Hero section fetches data from Strapi
- [ ] Footer displays dynamic content
- [ ] Social links show with icons in correct order
- [ ] Admin changes appear on homepage immediately (no deployment)
- [ ] No console errors
- [ ] Mobile responsive (375px width)
- [ ] All Strapi API endpoints working

---

## 📊 Phase 2 Summary

| Component | Status | Lines | Notes |
|-----------|--------|-------|-------|
| HeroSection | ✅ | 70 | Fetches useHeader hook |
| Footer | ✅ | 90 | Fetches useFooter + useSocialLinks |
| Hooks (3) | ✅ | 60 | useHeader, useFooter, useSocialLinks |
| Config (5) | ✅ | ~200 | next.config, tsconfig, tailwind, i18n, env |
| CSS | ✅ | 50 | globals.css + Tailwind |
| **Total** | ✅ | ~510 | Ready for deployment |

---

## 🚀 Phase 3 (Optional): Polish & Deployment

Once Phase 2 verified:
1. **Mobile responsive** — test on devices
2. **Performance** — Lighthouse audit
3. **A/B testing** — test multiple header variants in Strapi
4. **Deploy** — Vercel (`npm run build && npm run start`)

---

## 📌 Files Modified/Created

```
✅ app/layout.tsx (new)
✅ app/page.tsx (new)
✅ app/globals.css (new)
✅ components/HeroSection.tsx (new)
✅ components/Footer.tsx (new)
✅ lib/hooks/useHeader.ts (Phase 1)
✅ lib/hooks/useFooter.ts (Phase 1)
✅ lib/hooks/useSocialLinks.ts (Phase 1)
✅ lib/types/siteConfig.ts (Phase 1)
✅ tailwind.config.ts (updated)
✅ next.config.js (new)
✅ tsconfig.json (new)
✅ i18n.ts (new)
✅ .env.local (new)
```

---

**Phase 2 ✅ Complete. Ready for testing.**
