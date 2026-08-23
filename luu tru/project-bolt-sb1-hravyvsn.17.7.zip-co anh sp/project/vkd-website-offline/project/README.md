# VKD Group — Ngoc Linh Ginseng Vietnam Medical Group

> **"The Billion-Year Treasure of Vietnam's Deep Forest"**  
> A world-class luxury e-commerce and corporate platform for Vietnam's premier Ngoc Linh Ginseng medical group.

---

## Project Overview

VKD Group (Tập Đoàn Y Dược Sâm Ngọc Linh Việt Nam) is Vietnam's leading cultivator and producer of Ngoc Linh Ginseng (*Panax Vietnamensis*) — the only ginseng species containing the unique Majonoside R2 (MR2) saponin. This platform serves as their global digital headquarters, combining luxury e-commerce, clinical research transparency, and omni-channel commerce infrastructure.

### Strategic Goals
- Establish VKD as a global premium wellness brand alongside Korean KGC (Jung Kwan Jang)
- Drive international B2B expansion across 5 key markets (Vietnam, USA, EU, Japan, China)
- Provide full supply-chain transparency via blockchain-backed QR traceability
- Create a seamless omni-channel loyalty ecosystem across online and offline touchpoints

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 + `@tailwindcss/postcss` |
| Icons | Lucide React |
| Fonts | Playfair Display (headings) + Inter (body) via Google Fonts |
| State | React Context API (Cart, Language, Page routing) |
| Images | Unsplash CDN (context-aware premium URLs) |
| Deployment | Vite build → Vercel / Netlify / AWS Amplify |

---

## Features

### 🏛️ Homepage (10 Sections)
- **Hero** — Cinematic forest background, "Billion-Year Treasure" headline, trust badges (cGMP/ISO/HACCP)
- **Stats** — 10+ years, 3 GACP regions, 50+ products, 5 export markets
- **About** — Company story with 3 cultivation region cards
- **Heritage & Science** — 52+ saponin animated molecular diagram
- **Featured Products** — 4 category cards with hover animations
- **OmniChannel Hub** — Official stores (Shopee/TikTok/Facebook), Live events, Social proof, VKD Elite Club banner
- **Showrooms** — 4 Vo Kim Duong luxury locations with hours and booking
- **Traceability** — QR blockchain scanner animation, 200% guarantee
- **B2B / Partners** — 3 partnership tiers + international markets
- **News Feed** — 6 real articles with category filters and featured hero layout

### 🛒 E-Commerce
- **Product Catalog** — Benefit-driven filters (4 Health Goals × 4 Audiences), 12 products
- **Quick View Modal** — Full product detail without page navigation
- **Cart Drawer** — Slide-out with quantity controls, dual-currency pricing, checkout CTA
- **Checkout Page** — 5-region currency selector (VND/USD/EUR/JPY/CNY), shipping calculator, 4 payment gateways (Stripe/PayPal/VNPAY/MoMo), animated payment simulation
- **Order Confirmation** — Tracking timeline, animated Elite points counter, QR authenticity code
- **VKD Autoship** — Subscribe & Save 10%, frequency picker (30/60/90 days), subscription management dashboard

### 🔬 Research Hub
- **Saponin Matrix** — Interactive bar chart: Ngoc Linh vs Korean Red Ginseng (8 compounds)
- **Clinical Studies** — 6 peer-reviewed papers with author badges, PDF download
- **Education Guides** — 3 consumer guides (authentication, dosage, infusion methods)

### 👑 VKD Elite Club
- **Loyalty Dashboard** — Points history, tier progress (Standard/VIP/VVIP), omni-channel sync
- **3 Membership Tiers** — 3%/7%/12% cashback with escalating perks
- **Omni-sync** — Points from Website + Shopee + TikTok + showroom unified

### 🌐 Internationalization
- **5 Languages** — Vietnamese, English, Chinese, French, Arabic (RTL)
- **5 Regional Currencies** — VND, USD, EUR, JPY, CNY with proper formatting
- **RTL Support** — Full layout mirroring for Arabic

---

## Local Installation

```bash
# 1. Clone or extract the project
git clone <your-repo-url>
cd vkd-group-website

# 2. Install dependencies
npm install
# or
yarn install

# 3. Start the development server
npm run dev
# → Opens at http://localhost:5173

# 4. Build for production
npm run build

# 5. Preview the production build locally
npm run preview
```

**Requirements:** Node.js ≥ 18.0.0, npm ≥ 9.0.0

---

## Deployment

### Vercel (Recommended — Zero Config)
```bash
npm install -g vercel
vercel --prod
```
Or connect your GitHub repo at [vercel.com](https://vercel.com) — Vite is auto-detected.

### Netlify
```bash
npm run build
# Drag and drop the /dist folder at app.netlify.com/drop
# Or use netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```
Add `dist/_redirects` file with:
```
/* /index.html 200
```

### AWS Amplify
1. Push to GitHub/GitLab
2. Go to AWS Amplify Console → "Host web app"
3. Connect repository, Amplify auto-detects Vite
4. Build settings (auto-detected):
   - Build command: `npm run build`
   - Output directory: `dist`

### Manual / Self-Hosted (Nginx)
```nginx
server {
  listen 80;
  root /var/www/vkd-group/dist;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Sticky navbar, lang switcher, cart badge
│   ├── Hero.tsx            # Full-screen cinematic hero
│   ├── Stats.tsx           # Key metrics floating cards
│   ├── About.tsx           # Company story + cultivation regions
│   ├── Heritage.tsx        # 52+ saponin science section
│   ├── Products.tsx        # 4-category featured products
│   ├── OmniChannel.tsx     # Official stores + Live hub + Elite banner
│   ├── Showrooms.tsx       # Vo Kim Duong showroom network
│   ├── Traceability.tsx    # QR blockchain verification
│   ├── B2B.tsx             # Partnership & international markets
│   ├── Certifications.tsx  # cGMP/HACCP/ISO certificates
│   ├── NewsFeed.tsx        # News articles with category filters
│   ├── ProductCatalog.tsx  # Health-goal filtered catalog + quick view
│   ├── CartDrawer.tsx      # Slide-out shopping cart
│   ├── Checkout.tsx        # Multi-currency checkout + payment sim
│   ├── OrderConfirmation.tsx  # Success page + loyalty points
│   ├── ResearchHub.tsx     # Saponin matrix + clinical studies
│   ├── LoyaltyDashboard.tsx  # VKD Elite Club member area
│   ├── AutoshipPage.tsx    # Subscribe & Save management
│   └── Footer.tsx          # 4-column footer + lang switcher
├── context/
│   └── CartContext.tsx     # Cart state (add/remove/qty/subtotal)
├── data/
│   └── mockData.ts         # 12 products, 6 studies, 6 news, loyalty tiers
├── i18n/
│   └── translations.ts     # 5-language translation system
├── App.tsx                 # Page router + CartProvider root
└── index.css               # Tailwind v4 theme (colors, fonts, animations)
```

---

## Brand Design System

| Token | Value |
|---|---|
| Primary Green | `#0B2F1D` (forest-900) |
| Gold Accent | `#D4AF37` (gold-400) |
| Background | `#fefdfb` (cream-50) |
| Heading Font | Playfair Display |
| Body Font | Inter |
| Border Radius | 1rem (cards), 9999px (pills) |
| Spacing Unit | 8px base |

---

## SEO Configuration

- **Meta tags** — Title, description, keywords optimized for "Ngoc Linh Ginseng", "Panax Vietnamensis", "MR2 Saponin"
- **OpenGraph** — Rich social sharing with product images
- **Twitter Cards** — `summary_large_image` format
- **Structured Data** — Organization + Product JSON-LD schemas
- **Alt tags** — Descriptive SEO alt text on all images (e.g., "VKD Group Premium Ngoc Linh Ginseng Root 6 Years Old")
- **Canonical URL** — Points to `samngoclinhvkdgroup.com`

---

## License

© 2024 VKD Group — Tập Đoàn Y Dược Sâm Ngọc Linh Việt Nam. All rights reserved.  
Contact: info@vkdnature.com | 1800-28-28-66
