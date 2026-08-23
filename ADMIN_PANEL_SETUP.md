# Admin Panel Feature: Header/Footer/Social Links Management

**Phase 1 Status:** ✅ Strapi Schema + TypeScript Types + React Hooks  
**Phase 2:** Frontend Integration  
**Phase 3:** Admin UX Polish (optional)

---

## ✅ Phase 1: Completed

### Collections Schema
- **SiteHeader** — logo, nav_links, hero title/subtitle, CTA button
- **SiteFooter** — company info, footer links, copyright text
- **SocialLinks** — platform, URL, icon, display order, active toggle

**Files:**
- `strapi/config/collections.ts` — collection definitions

### TypeScript Types
- `lib/types/siteConfig.ts` — interfaces for all 3 collections

### React Hooks
- `lib/hooks/useHeader.ts` — fetch header from Strapi
- `lib/hooks/useFooter.ts` — fetch footer from Strapi
- `lib/hooks/useSocialLinks.ts` — fetch social links (sorted by display_order)

---

## 📋 Phase 1 Checklist — Before Strapi Admin Access

### A1: Initialize Strapi Collections
```bash
# Start Strapi locally (requires Node.js):
cd site
npm install
npm run develop
```

**Strapi admin will auto-detect collections** from `strapi/config/collections.ts`.

### A2: Test Via Strapi Admin
1. Open `http://localhost:1337/admin`
2. Navigate to **Content Manager** sidebar
3. Verify collections exist:
   - ✅ Site Headers (singular entry)
   - ✅ Site Footers (singular entry)
   - ✅ Social Links (list of platforms)

### A3: Create Initial Data (Via Strapi Admin UI)

**SiteHeader Entry:**
- logoUrl: `https://tasamngoclinh.com/logo.png`
- logoAlt: `TA - Sâm Ngọc Linh`
- navLinks: `[{"text": "Sản phẩm", "url": "/vi/products"}, {"text": "Blog", "url": "/vi/blog"}, {"text": "Liên hệ", "url": "/vi/contact"}]`
- heroTitle: `Sâm Ngọc Linh Chuyên Nghiệp`
- heroSubtitle: `Chất lượng hàng đầu, chăm sóc sức khỏe tự nhiên`
- ctaButtonText: `Xem sản phẩm`
- ctaButtonLink: `/vi/products`
- isActive: `true`

**SiteFooter Entry:**
- companyName: `Vườn Sâm Ngọc Linh nhà Khánh`
- companyAddress: `Kon Tum, Việt Nam`
- companyPhone: `+84 xxx xxxx`
- companyEmail: `contact@tasamngoclinh.com`
- footerLinks: `[{"title": "Về chúng tôi", "links": [{"text": "Lịch sử", "url": "/about"}, {"text": "Blog", "url": "/blog"}]}, {"title": "Chính sách", "links": [{"text": "Bảo mật", "url": "/privacy"}, {"text": "Điều khoản", "url": "/terms"}]}]`
- copyrightText: `© 2026 TA. All rights reserved.`
- isActive: `true`

**SocialLinks Entries (add each separately):**
| Platform | URL | Icon | DisplayOrder |
|----------|-----|------|--------------|
| youtube | `https://youtube.com/@tasamngoclinh` | 🎥 | 1 |
| facebook | `https://facebook.com/tasamngoclinh` | f | 2 |
| instagram | `https://instagram.com/tasamngoclinh` | 📷 | 3 |
| tiktok | `https://tiktok.com/@tasamngoclinh` | ♪ | 4 |
| telegram | `https://t.me/tasamngoclinh_bot` | ✈️ | 5 |

### A4: Verify API Endpoints
```bash
# Test header endpoint
curl http://localhost:1337/api/site-headers?filters[isActive][$eq]=true

# Test footer endpoint
curl http://localhost:1337/api/site-footers?filters[isActive][$eq]=true

# Test social links (sorted by displayOrder)
curl "http://localhost:1337/api/social-links?filters[isActive][$eq]=true&sort=displayOrder:asc"
```

---

## 🔌 Phase 2: Frontend Integration (Next Steps)

### B1: Update Homepage Hero Component

**File:** `app/[locale]/page.tsx` (or `components/HeroSection.tsx`)

```typescript
import { useHeader } from '@/lib/hooks/useHeader';

export function HeroSection() {
  const { header, loading } = useHeader();
  
  if (loading) return <div>Loading...</div>;
  if (!header) return null;

  return (
    <section className="hero bg-gradient-to-r from-gold to-cream">
      <h1>{header.heroTitle}</h1>
      <p>{header.heroSubtitle}</p>
      <a href={header.ctaButtonLink} className="btn btn-primary">
        {header.ctaButtonText}
      </a>
    </section>
  );
}
```

### B2: Update Footer Component

**File:** `components/Footer.tsx`

```typescript
import { useFooter } from '@/lib/hooks/useFooter';
import { useSocialLinks } from '@/lib/hooks/useSocialLinks';

export function Footer() {
  const { footer } = useFooter();
  const { links } = useSocialLinks();

  return (
    <footer className="bg-navy text-cream">
      <div className="footer-content">
        <div className="footer-section">
          <h4>{footer?.companyName}</h4>
          <p>{footer?.companyAddress}</p>
          <p>{footer?.companyPhone}</p>
          <p>{footer?.companyEmail}</p>
        </div>

        {footer?.footerLinks?.map((section) => (
          <div key={section.title} className="footer-section">
            <h5>{section.title}</h5>
            <ul>
              {section.links.map((link) => (
                <li key={link.url}>
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="social-links">
          {links.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target={link.openInNewTab ? '_blank' : '_self'}
              rel="noopener noreferrer"
              title={link.displayText || link.platform}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p>{footer?.copyrightText}</p>
      </div>
    </footer>
  );
}
```

### B3: Update Navigation (if needed)

**File:** `components/Navigation.tsx`

```typescript
import { useHeader } from '@/lib/hooks/useHeader';

export function Navigation() {
  const { header } = useHeader();

  return (
    <nav className="navbar">
      {header?.logoUrl && (
        <img src={header.logoUrl} alt={header.logoAlt} className="logo" />
      )}
      <ul>
        {header?.navLinks?.map((link) => (
          <li key={link.url}>
            <a href={link.url} target={link.target}>
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### B4: Environment Setup

**File:** `.env.local`
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

---

## ✅ Success Criteria — Phase 1 Complete

- [ ] Strapi collections created (SiteHeader, SiteFooter, SocialLinks)
- [ ] Admin can access Strapi admin UI (`http://localhost:1337/admin`)
- [ ] Admin can create/edit entries in each collection
- [ ] API endpoints respond with data
- [ ] React hooks fetch and return data correctly
- [ ] TypeScript types match Strapi response structure
- [ ] No console errors

---

## 📌 Phase 2 Acceptance Criteria (When Ready)

- [ ] Homepage uses dynamic header (hero title/subtitle/CTA from Strapi)
- [ ] Footer displays dynamic company info + footer links
- [ ] Social links display in footer with icons
- [ ] Admin changes in Strapi immediately reflect on homepage
- [ ] Mobile responsive (social icons, footer layout)

---

## 🔧 Troubleshooting

### Strapi not starting?
```bash
npm install
npm run build
npm run develop
```

### Port 1337 already in use?
```bash
# Kill process on port 1337
lsof -ti:1337 | xargs kill -9

# Or use different port
PORT=1338 npm run develop
```

### API not returning data?
1. Check Strapi admin: verify entries are published (not drafts)
2. Check `isActive: true` for each entry
3. Verify API endpoint with curl:
   ```bash
   curl "http://localhost:1337/api/site-headers"
   ```

### Hooks returning `null`?
1. Verify `NEXT_PUBLIC_STRAPI_URL` in `.env.local`
2. Check browser console for fetch errors
3. Verify Strapi CORS settings allow frontend domain

---

## 📚 Related Files

- Strapi schema: `strapi/config/collections.ts`
- Types: `lib/types/siteConfig.ts`
- Hooks: `lib/hooks/useHeader.ts`, `useFooter.ts`, `useSocialLinks.ts`
- Feature spec: `FEATURE_ADMIN_HEADER_FOOTER.md`

---

## 🎯 Timeline

**Phase 1 (Now):** 2-3 hours
- Collections schema ✅
- Types + Hooks ✅
- Admin data entry (manual)

**Phase 2:** 3-4 hours
- Integrate hooks into components
- Test end-to-end
- Admin UI polish (optional)

**Total ETC:** 7-9 hours

---

**Status:** Phase 1 ✅ Complete. Ready for Phase 2 integration.
