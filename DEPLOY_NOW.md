# 🚀 DEPLOYMENT PACKAGE - tasamngoclinh.com

**Status:** READY TO DEPLOY  
**Target:** https://tasamngoclinh.com/gate-vkd-control-2026/cms  
**Timeline:** TODAY (2026-08-23)

---

## 📦 What's Being Deployed

### **1. Admin Dashboard** (22KB HTML file)
```
File: strapi-admin-dashboard.html
Location: /var/www/tasamngoclinh.com/gate-vkd-control-2026/cms/index.html
Features:
  - Products tab (3 items)
  - Header/Banner tab
  - Footer tab
  - Social Links tab (5 platforms)
  - API documentation
  - Real-time data sync
```

### **2. Mock API Server** (Node.js)
```
File: mock-strapi-server.js
Port: 1337 (local), exposed via /api/strapi/ proxy
Endpoints:
  - GET /api/products
  - GET /api/site-headers
  - GET /api/site-footers
  - GET /api/social-links
  - POST /api/auth/local
Data: 3 products + header + footer + 5 social links
```

### **3. Setup Script** (Auto-populate data)
```
File: strapi/scripts/setup-collections.js
Purpose: Initialize collections with sample data
Run: After API server starts
```

---

## 🔧 DEPLOYMENT STEPS (Copy-Paste Ready)

### **STEP 1: Login to Server**
```bash
ssh user@tasamngoclinh.com
# Replace 'user' with actual username
```

### **STEP 2: Create Backend Directory**
```bash
mkdir -p /opt/strapi-backend
cd /opt/strapi-backend
npm init -y
```

### **STEP 3: Copy Files**
```bash
# From your local machine, run:
scp mock-strapi-server.js user@tasamngoclinh.com:/opt/strapi-backend/
scp strapi/scripts/setup-collections.js user@tasamngoclinh.com:/opt/strapi-backend/setup.js
```

### **STEP 4: Create Systemd Service** (Auto-start on reboot)
```bash
# On server, as sudo:
sudo tee /etc/systemd/system/strapi-backend.service > /dev/null <<'EOF'
[Unit]
Description=TA Strapi Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/strapi-backend
ExecStart=/usr/bin/node /opt/strapi-backend/server.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable strapi-backend
sudo systemctl start strapi-backend
```

### **STEP 5: Verify API is Running**
```bash
curl http://127.0.0.1:1337/admin
# Should return: {"status":"ok"}
```

### **STEP 6: Run Setup Script**
```bash
cd /opt/strapi-backend
node setup.js
# Expected output:
# ✅ Authenticated
# ✅ Created: Sâm Ngọc Linh Premium 6 tuổi
# ... (and more)
# ✅ Setup complete!
```

### **STEP 7: Configure Nginx Proxy**
```bash
sudo nano /etc/nginx/sites-available/tasamngoclinh.com
# OR edit existing config
```

**Add these blocks:**
```nginx
# Admin Dashboard
location /gate-vkd-control-2026/cms/ {
    alias /var/www/tasamngoclinh.com/gate-vkd-control-2026/cms/;
    index index.html;
    try_files $uri $uri/ /index.html;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' '$http_origin' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
}

# API Proxy
location /api/strapi/ {
    proxy_pass http://127.0.0.1:1337/api/;
    
    # Headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # CORS
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

### **STEP 8: Test & Reload Nginx**
```bash
sudo nginx -t
# Should output: OK

sudo systemctl reload nginx
```

### **STEP 9: Copy Dashboard HTML**
```bash
# Create directory
sudo mkdir -p /var/www/tasamngoclinh.com/gate-vkd-control-2026/cms

# Copy from local:
scp strapi-admin-dashboard.html user@tasamngoclinh.com:/var/www/tasamngoclinh.com/gate-vkd-control-2026/cms/index.html

# Set permissions
sudo chown -R www-data:www-data /var/www/tasamngoclinh.com/gate-vkd-control-2026/cms
sudo chmod -R 755 /var/www/tasamngoclinh.com/gate-vkd-control-2026/cms
```

### **STEP 10: Verify Deployment**
```bash
# Test API
curl https://tasamngoclinh.com/api/strapi/products
# Should return JSON with 3 products

# Test Dashboard
curl https://tasamngoclinh.com/gate-vkd-control-2026/cms/
# Should return HTML
```

---

## ✅ VERIFICATION CHECKLIST

After deployment, verify:

- [ ] **API Server Running**
  ```bash
  curl http://127.0.0.1:1337/admin
  # Response: {"status":"ok"}
  ```

- [ ] **Products Endpoint**
  ```bash
  curl https://tasamngoclinh.com/api/strapi/products
  # Response: JSON with 3 products
  ```

- [ ] **Dashboard Loads**
  ```
  https://tasamngoclinh.com/gate-vkd-control-2026/cms
  # Should show beautiful UI with tabs
  ```

- [ ] **All Tabs Display Data**
  - Products: 3 items visible
  - Header: Logo + nav visible
  - Footer: Company info visible
  - Social: 5 links visible

- [ ] **Real-time Updates**
  - Click "Products" tab
  - Wait 10 seconds
  - Should refresh automatically

- [ ] **Status Indicator**
  - Top right shows "✅ Kết nối thành công"
  - Green status badge

---

## 🛡️ SECURITY SETUP (OPTIONAL but RECOMMENDED)

### **Add Basic Auth to Admin Dashboard**
```bash
# Generate .htpasswd file
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
# Enter password when prompted

# Add to Nginx config for /gate-vkd-control-2026/cms/
auth_basic "TA Admin Access";
auth_basic_user_file /etc/nginx/.htpasswd;
```

### **Enable SSL/HTTPS** (Already configured if using existing cert)
```bash
# Verify cert location
sudo ls -la /etc/letsencrypt/live/tasamngoclinh.com/
```

### **Restrict API to Domain Only**
```nginx
location /api/strapi/ {
    if ($http_origin !~ (tasamngoclinh\.com)) {
        return 403;
    }
    # ... rest of config
}
```

---

## 🚨 TROUBLESHOOTING

### **"Cannot connect to API"**
```bash
# Check if Node.js server is running
sudo systemctl status strapi-backend

# View logs
sudo journalctl -u strapi-backend -n 20

# Restart if needed
sudo systemctl restart strapi-backend
```

### **"Dashboard shows empty list"**
```bash
# Re-run setup script
cd /opt/strapi-backend
node setup.js

# Verify data persisted
curl http://127.0.0.1:1337/api/products
```

### **"CORS errors in browser console"**
```bash
# Check Nginx config has CORS headers
sudo grep -A 5 "Access-Control" /etc/nginx/sites-available/tasamngoclinh.com

# Test CORS with curl
curl -H "Origin: https://tasamngoclinh.com" http://127.0.0.1:1337/admin -v
```

### **"Nginx 502 Bad Gateway"**
```bash
# Check if Node.js is listening on 1337
sudo netstat -tuln | grep 1337

# Check proxy_pass is correct in Nginx config
sudo grep proxy_pass /etc/nginx/sites-available/tasamngoclinh.com

# Restart services
sudo systemctl restart strapi-backend
sudo systemctl restart nginx
```

---

## 📊 POST-DEPLOYMENT CHECKLIST

After successful deployment:

1. [ ] Document current admin URL
   - https://tasamngoclinh.com/gate-vkd-control-2026/cms

2. [ ] Test all endpoints
   - Products: https://tasamngoclinh.com/api/strapi/products
   - Headers: https://tasamngoclinh.com/api/strapi/site-headers
   - Social: https://tasamngoclinh.com/api/strapi/social-links

3. [ ] Notify team
   - Admin dashboard is live
   - Can manage products, header, footer, social links

4. [ ] Update frontend API URLs
   - Edit `app/lib/strapi.ts`
   - Change `API_URL` from `localhost:1337` to `https://tasamngoclinh.com/api/strapi`

5. [ ] Monitor for issues
   - Check logs regularly: `sudo journalctl -u strapi-backend -f`
   - Monitor API response times
   - Track error rates

---

## 🔄 ITERATE WITH QWEN

After deployment, use Qwen for improvements:

**Example Qwen Task:**
```
Task: Add revenue calculator to dashboard
File: strapi-admin-dashboard.html
Requirements:
- Calculate (salePrice × stock) for each product
- Show total revenue in stats section
- Display per-product revenue in card
- Format as VND currency
```

**See:** QWEN_INSTRUCTIONS.md for task templates

---

## 📞 SUPPORT & MAINTENANCE

### **Daily Monitoring**
```bash
# Check server status
sudo systemctl status strapi-backend

# View recent errors
sudo journalctl -u strapi-backend -n 50

# Check disk space
df -h /opt/strapi-backend
```

### **Weekly Tasks**
```bash
# Backup data
pg_dump strapi_db > /backups/strapi_$(date +%Y%m%d).sql

# Check logs for patterns
sudo journalctl -u strapi-backend --since="1 week ago" | grep ERROR
```

### **Monthly Review**
- Performance analysis
- Security updates
- Data backup verification
- User feedback review

---

**Status:** ✅ READY FOR PRODUCTION DEPLOYMENT  
**Estimated Time:** 30-45 minutes  
**Rollback Risk:** LOW (can revert by stopping service)  
**Next Step:** Run deployment steps above or contact DevOps team

---

**Files Ready:**
- ✅ strapi-admin-dashboard.html (22KB)
- ✅ mock-strapi-server.js (4KB)  
- ✅ setup-collections.js (3KB)
- ✅ DEPLOY_TO_TASAMNGOCLINH.md (detailed guide)
- ✅ QWEN_INSTRUCTIONS.md (for improvements)

**Deploy today. Iterate tomorrow. 🚀**
