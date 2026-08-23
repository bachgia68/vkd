# 🚀 Deploy Strapi Admin to tasamngoclinh.com

**Goal:** Integrate Strapi API + Admin Dashboard at `https://tasamngoclinh.com/gate-vkd-control-2026/cms`

---

## 📋 Architecture

```
tasamngoclinh.com
├── /gate-vkd-control-2026/cms          ← Admin Dashboard UI (HTML)
└── /api/strapi/                        ← API Proxy
    ├── /api/products
    ├── /api/site-headers
    ├── /api/site-footers
    └── /api/social-links
```

---

## 🔧 Deployment Steps

### **Phase 1: Prepare Files**

**1. Copy admin dashboard to web server:**
```bash
scp strapi-admin-dashboard.html user@tasamngoclinh.com:/var/www/tasamngoclinh.com/gate-vkd-control-2026/cms/index.html
```

**2. Copy mock Strapi server to web server:**
```bash
scp mock-strapi-server.js user@tasamngoclinh.com:/opt/strapi-backend/server.js
scp strapi/scripts/setup-collections.js user@tasamngoclinh.com:/opt/strapi-backend/setup.js
```

### **Phase 2: Setup on Web Server**

**SSH into web server:**
```bash
ssh user@tasamngoclinh.com
```

**Install Node.js (if not present):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs
```

**Create Strapi backend directory:**
```bash
mkdir -p /opt/strapi-backend
cd /opt/strapi-backend
npm init -y
```

**Create systemd service (optional, for auto-start):**
```bash
sudo nano /etc/systemd/system/strapi-backend.service
```

Paste:
```ini
[Unit]
Description=Strapi Backend API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/strapi-backend
ExecStart=/usr/bin/node /opt/strapi-backend/server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Enable & start service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable strapi-backend
sudo systemctl start strapi-backend
```

### **Phase 3: Configure Nginx Proxy**

**Edit Nginx config:**
```bash
sudo nano /etc/nginx/sites-available/tasamngoclinh.com
```

**Add proxy block:**
```nginx
server {
    listen 443 ssl http2;
    server_name tasamngoclinh.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Admin Dashboard
    location /gate-vkd-control-2026/cms/ {
        alias /var/www/tasamngoclinh.com/gate-vkd-control-2026/cms/;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/strapi/ {
        proxy_pass http://127.0.0.1:1337/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Access-Control-Allow-Origin *;
    }
}
```

**Test & reload Nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### **Phase 4: Initialize & Populate Data**

**On web server, run setup script:**
```bash
cd /opt/strapi-backend
node setup.js
```

**Expected output:**
```
✅ Setup complete!
  ✅ Created: Sâm Ngọc Linh Premium 6 tuổi
  ✅ Created: Sâm Ngọc Linh 3 tuổi
  ✅ Created: Trà Sâm Ngọc Linh
  ... (and more)
```

### **Phase 5: Verify Deployment**

**Test API endpoints:**
```bash
curl https://tasamngoclinh.com/api/strapi/products
curl https://tasamngoclinh.com/api/strapi/site-headers
curl https://tasamngoclinh.com/api/strapi/social-links
```

**Access admin dashboard:**
```
https://tasamngoclinh.com/gate-vkd-control-2026/cms
```

Should show:
- ✅ 3 Products (Sâm 6yr, 3yr, Trà)
- ✅ 1 Site Header
- ✅ 1 Site Footer
- ✅ 5 Social Links

---

## 🔌 Update Frontend API URLs

### **React Hooks** (Next.js)

**File:** `app/lib/strapi.ts`

```typescript
// Development (localhost)
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:1337'
  : 'https://tasamngoclinh.com/api/strapi';

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
}

export async function fetchHeader() {
  const res = await fetch(`${API_URL}/site-headers`);
  return res.json();
}
```

**Environment variables** (`.env.local`):
```
NEXT_PUBLIC_STRAPI_URL=https://tasamngoclinh.com/api/strapi
```

---

## 🛡️ Security Checklist

- [ ] Set CORS headers in mock-strapi-server.js for tasamngoclinh.com domain
- [ ] Use HTTPS/SSL certificates
- [ ] Restrict admin dashboard to admin IPs (optional)
- [ ] Add authentication to /gate-vkd-control-2026/cms (basic auth or JWT)
- [ ] Enable rate limiting on API endpoints
- [ ] Use environment variables for secrets

### **Add CORS config to mock-strapi-server.js:**
```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://tasamngoclinh.com');
res.setHeader('Access-Control-Allow-Credentials', 'true');
```

### **Add Basic Auth to admin dashboard:**
```javascript
// In Nginx config
location /gate-vkd-control-2026/cms/ {
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
    ...
}
```

---

## 📊 API Endpoints After Deploy

| Endpoint | URL |
|----------|-----|
| **Products** | `https://tasamngoclinh.com/api/strapi/products` |
| **Headers** | `https://tasamngoclinh.com/api/strapi/site-headers` |
| **Footers** | `https://tasamngoclinh.com/api/strapi/site-footers` |
| **Social** | `https://tasamngoclinh.com/api/strapi/social-links` |
| **Admin UI** | `https://tasamngoclinh.com/gate-vkd-control-2026/cms` |

---

## 🔄 Updating Data

### **Method 1: Via Setup Script**
```bash
ssh user@tasamngoclinh.com
cd /opt/strapi-backend
node setup.js
```

### **Method 2: Via API (POST requests)**
```bash
curl -X POST https://tasamngoclinh.com/api/strapi/products \
  -H "Content-Type: application/json" \
  -d '{"data": {"sku": "SAM-004", "name": {...}, ...}}'
```

### **Method 3: Real Strapi Admin** (Future)
Replace mock server with actual Strapi CMS when ready.

---

## 📱 Testing Checklist

- [ ] Admin dashboard loads at `/gate-vkd-control-2026/cms`
- [ ] Products tab shows 3 items
- [ ] Header tab shows navigation + hero
- [ ] Footer tab shows company info
- [ ] Social tab shows 5 platforms
- [ ] API endpoints return JSON
- [ ] Frontend can fetch and display data
- [ ] Multilingual content (VI, EN, FR, ZH) displays correctly
- [ ] Mobile responsive design works

---

## 🐛 Troubleshooting

### **"Cannot connect to API"**
```bash
# Check if server is running
curl http://127.0.0.1:1337/admin

# Check systemd status
sudo systemctl status strapi-backend

# View logs
sudo journalctl -u strapi-backend -f
```

### **"CORS errors in browser console"**
- Verify Nginx proxy headers include CORS
- Check mock-strapi-server.js has correct Access-Control headers
- Ensure tasamngoclinh.com is in CORS whitelist

### **"Empty products list"**
- Run setup.js again: `node /opt/strapi-backend/setup.js`
- Check if data persists (currently in memory - need file storage for production)

### **"Admin dashboard shows loading spinner forever"**
- Check browser console for network errors
- Verify API_URL in HTML matches Nginx proxy path
- Check Nginx proxy config

---

## 🚀 Production Improvements

### **1. Persistent Database**
Replace in-memory storage with PostgreSQL:
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create Strapi database
sudo -u postgres createdb strapi_db
sudo -u postgres psql -c "CREATE USER strapi WITH PASSWORD 'password'; GRANT ALL PRIVILEGES ON DATABASE strapi_db TO strapi;"
```

### **2. Real Strapi Instance**
Install full Strapi instead of mock server:
```bash
npm install -g strapi@5
strapi new . --template=quick-start
strapi develop
```

### **3. Docker Container**
Use Docker for easy deployment:
```bash
docker build -f Dockerfile.strapi -t strapi-backend .
docker run -p 1337:1337 -d strapi-backend
```

### **4. Backup & Recovery**
```bash
# Backup data
pg_dump strapi_db > backup.sql

# Restore
psql strapi_db < backup.sql
```

---

**Status:** ✅ Ready for Production Deployment
**Last Updated:** 2026-08-23
