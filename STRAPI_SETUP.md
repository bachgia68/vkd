# Strapi Setup Guide - TA Project

## Prerequisites
- Docker Desktop installed and running
- Node.js installed

## Step 1: Start Strapi Stack
```bash
start-strapi.bat
```

Wait for the output:
```
✅ All services started!
  - Strapi Admin:  http://localhost:1337/admin
```

## Step 2: Create Admin User (First Time Only)
1. Open: **http://localhost:1337/admin**
2. First time will show setup wizard
3. Fill in:
   - **Email:** admin@example.com
   - **Password:** Admin@123
   - **Confirm:** Admin@123
   - Click "Let's start"

## Step 3: Create Collections in Admin UI

### Collection 1: "product"
1. Click "Content-Type Builder" (left sidebar, under "Plugins")
2. Click "+ Create new collection type"
3. **Name:** product (singular: product)
4. Click "Continue"
5. Add fields:
   - `sku` - Text (required, unique)
   - `name` - JSON
   - `description` - JSON
   - `shortDescription` - JSON (optional)
   - `price` - Number
   - `salePrice` - Number (optional)
   - `category` - Text (optional)
   - `stock` - Number
   - `featured` - Boolean
   - `isActive` - Boolean
6. Click "Save"

### Collection 2: "site-header"
1. Click "+ Create new collection type"
2. **Name:** site-header (singular: site-header)
3. Click "Continue"
4. Add fields:
   - `logoUrl` - Text
   - `logoAlt` - Text (optional)
   - `navLinks` - JSON
   - `heroTitle` - JSON
   - `heroSubtitle` - JSON
   - `ctaButtonText` - JSON
   - `ctaButtonLink` - Text
   - `ctaButtonStyle` - Text (optional)
   - `isActive` - Boolean
5. Click "Save"

### Collection 3: "site-footer"
1. Click "+ Create new collection type"
2. **Name:** site-footer (singular: site-footer)
3. Click "Continue"
4. Add fields:
   - `companyName` - JSON
   - `companyAddress` - JSON
   - `companyPhone` - Text
   - `companyEmail` - Text
   - `copyrightText` - JSON
   - `isActive` - Boolean
5. Click "Save"

### Collection 4: "social-link"
1. Click "+ Create new collection type"
2. **Name:** social-link (singular: social-link)
3. Click "Continue"
4. Add fields:
   - `platform` - Text
   - `url` - Text
   - `displayOrder` - Number
   - `displayText` - JSON
   - `isActive` - Boolean
   - `openInNewTab` - Boolean
5. Click "Save"

## Step 4: Generate TypeScript Types
```bash
cd "D:\TA page\site"
node -e "console.log('Types auto-generated on first frontend boot')"
```

## Step 5: Run Setup Script
```bash
run-setup.bat
```

Expected output:
```
🔐 Authenticating...
✅ Authenticated
📦 Creating sample products...
  ✅ Created: Sâm Ngọc Linh Premium 6 tuổi
  ...
🎨 Creating site header...
✅ Site header created
...
✅ Setup complete!
📊 Access Strapi admin: http://localhost:1337/admin
```

## Step 6: Verify in Admin UI
1. Go to **http://localhost:1337/admin**
2. Check each collection:
   - **Products** - should show 3 sample items
   - **Site Headers** - should show 1 header
   - **Site Footers** - should show 1 footer
   - **Social Links** - should show 5 links

## Troubleshooting

### Port 1337 already in use
```bash
docker-compose down
docker-compose up -d
```

### Strapi won't start
1. Check logs: `docker-compose logs strapi`
2. Ensure PostgreSQL is healthy: `docker-compose logs postgres`

### Script fails at authentication
1. Verify admin user exists in Strapi admin UI
2. Ensure email is `admin@example.com` and password is `Admin@123`
3. Check Strapi is running: `curl http://localhost:1337/admin`

### Collections not visible
1. Refresh Strapi admin page (Ctrl+R)
2. Check "Content-Type Builder" shows all 4 collections
3. If missing, create them manually via UI

## Next Steps
- Connect frontend to Strapi API: `/app/lib/strapi.ts`
- See React hooks in `/app/hooks/useHeader.ts`, `useFooter.ts`, etc.
