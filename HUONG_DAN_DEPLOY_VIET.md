# 🚀 HƯỚNG DẪN TRIỂN KHAI - TA ADMIN DASHBOARD

**Trạng thái:** ✅ Sẵn sàng triển khai  
**Đích:** https://tasamngoclinh.com/gate-vkd-control-2026/cms  
**Ngày:** 23/08/2026

---

## 📁 CÁC FILE CẦN THIẾT (Trong ổ D)

### **Vị trí:** `D:\TA page\site\`

```
D:\TA page\site\
├── strapi-admin-dashboard.html      ← File giao diện admin
├── mock-strapi-server.js             ← Server API
├── strapi\scripts\setup-collections.js ← Script tạo dữ liệu
├── deploy-to-server.bat              ← Script tự động (Windows)
├── DEPLOYMENT_COMMANDS.txt           ← Lệnh copy-paste
├── DEPLOY_QUICK_START.txt            ← Hướng dẫn nhanh
├── TASK_1_QWEN_REVENUE_CALCULATOR.md ← Task cho Qwen
└── HUONG_DAN_DEPLOY_VIET.md         ← File này
```

---

## 🎯 TÓM TẮT QUÁ TRÌNH

```
1️⃣  Kiểm tra file có đầy đủ
2️⃣  Kết nối SSH đến server
3️⃣  Copy file lên server
4️⃣  Cấu hình Systemd (tự khởi động)
5️⃣  Chạy script tạo dữ liệu
6️⃣  Cấu hình Nginx (proxy)
7️⃣  Kiểm tra kết quả
8️⃣  Giám sát 1 giờ
9️⃣  Gửi Task 1 cho Qwen
```

---

## 🚀 CÁCH 1: CHẠY TỰ ĐỘNG (CHỈ CÓ WINDOWS)

### **Bước 1: Mở Command Prompt (cmd) hoặc PowerShell**

Nhấn `Win + R`, gõ `cmd`, bấm Enter

### **Bước 2: Chuyển đến thư mục**

```bash
cd D:\TA page\site
```

### **Bước 3: Chạy script triển khai**

```bash
deploy-to-server.bat
```

**Kết quả:** Script sẽ tự động copy file lên server

**Sau đó:** Làm theo các bước còn lại trên server (xem **CÁCH 2**)

---

## 🔧 CÁCH 2: CHẠY THỦ CÔNG (CHI TIẾT)

### **BƯỚC 1: Kiểm tra file có đầy đủ**

```bash
cd D:\TA page\site

dir strapi-admin-dashboard.html
dir mock-strapi-server.js
dir strapi\scripts\setup-collections.js
```

**Kết quả mong đợi:** Cả 3 file hiện lên

---

### **BƯỚC 2: Kết nối SSH đến server**

```bash
ssh user@tasamngoclinh.com
```

⚠️ **Thay `user` bằng tên tài khoản SSH của bạn**

**Kiểm tra:**
```bash
echo "SSH OK"
```

---

### **BƯỚC 3: Copy file từ máy tính lên server (Chạy trên máy tính, không phải server)**

**Mở cửa sổ CMD mới (không tắt cái SSH)**

```bash
cd D:\TA page\site

scp mock-strapi-server.js user@tasamngoclinh.com:/opt/strapi-backend/server.js

scp strapi\scripts\setup-collections.js user@tasamngoclinh.com:/opt/strapi-backend/setup.js

scp strapi-admin-dashboard.html user@tasamngoclinh.com:/var/www/tasamngoclinh.com/gate-vkd-control-2026/cms/index.html
```

**Kết quả mong đợi:** Không có lỗi, file được copy

---

### **BƯỚC 4: Tạo thư mục (Chạy trên server)**

**Quay lại cửa sổ SSH**

```bash
mkdir -p /opt/strapi-backend
chmod 755 /opt/strapi-backend

sudo mkdir -p /var/www/tasamngoclinh.com/gate-vkd-control-2026/cms
sudo chmod 755 /var/www/tasamngoclinh.com/gate-vkd-control-2026/cms
```

---

### **BƯỚC 5: Cấu hình Systemd (tự khởi động)**

```bash
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

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable strapi-backend
sudo systemctl start strapi-backend

sleep 3

sudo systemctl status strapi-backend
```

**Kết quả mong đợi:**
```
● strapi-backend.service - TA Strapi Backend API
     Loaded: loaded (/etc/systemd/system/strapi-backend.service; enabled)
     Active: active (running)
```

---

### **BƯỚC 6: Kiểm tra API server chạy**

```bash
curl http://127.0.0.1:1337/admin
```

**Kết quả mong đợi:**
```json
{"status":"ok"}
```

---

### **BƯỚC 7: Tạo dữ liệu mẫu**

```bash
cd /opt/strapi-backend
node setup.js
```

**Kết quả mong đợi:**
```
🚀 Starting Strapi setup...
🔐 Authenticating...
✅ Authenticated
📦 Creating sample products...
  ✅ Created: Sâm Ngọc Linh Premium 6 tuổi
  ✅ Created: Sâm Ngọc Linh 3 tuổi
  ✅ Created: Trà Sâm Ngọc Linh
🎨 Creating site header...
✅ Site header created
🔗 Creating site footer...
✅ Site footer created
📱 Creating social links...
  ✅ Created: facebook
  ✅ Created: instagram
  ✅ Created: youtube
  ✅ Created: telegram
  ✅ Created: zalo
✅ Setup complete!
```

---

### **BƯỚC 8: Cấu hình Nginx (Proxy)**

```bash
sudo nano /etc/nginx/sites-available/tasamngoclinh.com
```

**Thêm đoạn này vào file:**

```nginx
# Admin Dashboard
location /gate-vkd-control-2026/cms/ {
    alias /var/www/tasamngoclinh.com/gate-vkd-control-2026/cms/;
    index index.html;
    try_files $uri $uri/ /index.html;
    add_header 'Access-Control-Allow-Origin' '$http_origin' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
}

# API Proxy
location /api/strapi/ {
    proxy_pass http://127.0.0.1:1337/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
}
```

**Lưu:** Bấm `Ctrl+X`, rồi `Y`, rồi `Enter`

---

### **BƯỚC 9: Kiểm tra & khởi động lại Nginx**

```bash
sudo nginx -t
```

**Kết quả mong đợi:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**Khởi động lại:**
```bash
sudo systemctl reload nginx
```

---

### **BƯỚC 10: Kiểm tra triển khai (Chạy trên máy tính)**

**Mở cửa sổ CMD mới**

```bash
curl https://tasamngoclinh.com/api/strapi/products
```

**Kết quả mong đợi:** JSON với 3 sản phẩm

```json
{"data":[
  {"sku":"SAM-001","name":{"vi":"Sâm Ngọc Linh Premium 6 tuổi",...}},
  {"sku":"SAM-002",...},
  {"sku":"SAM-003",...}
]}
```

---

### **BƯỚC 11: Kiểm tra trong trình duyệt**

**Mở link này trong Chrome/Firefox:**

```
https://tasamngoclinh.com/gate-vkd-control-2026/cms
```

**Kết quả mong đợi:**
- ✅ Trang tải lên
- ✅ Trạng thái xanh: "✅ Kết nối thành công"
- ✅ Tab "Sản Phẩm": Hiện 3 sản phẩm
- ✅ Tab "Header": Logo + menu
- ✅ Tab "Footer": Thông tin công ty
- ✅ Tab "Mạng Xã Hội": 5 nền tảng (FB, IG, YT, TG, Zalo)

---

### **BƯỚC 12: Giám sát log (Chạy trên server)**

```bash
sudo journalctl -u strapi-backend -f
```

**Kết quả mong đợi:** Không có lỗi, chỉ thấy log bình thường

**Dừng:** Bấm `Ctrl+C`

---

## ✅ KIỂM TRA DANH SÁCH

- [ ] File đầy đủ trong `D:\TA page\site\`
- [ ] SSH kết nối được
- [ ] 3 file copy lên server thành công
- [ ] Systemd service chạy (`Active: active`)
- [ ] Setup script tạo dữ liệu xong
- [ ] Nginx cấu hình OK
- [ ] API trả về JSON (3 sản phẩm)
- [ ] Dashboard hiển thị trên trình duyệt
- [ ] Trạng thái xanh ✅

---

## 🎯 KẾT QUẢ CUỐI CÙNG

### **Dashboard URL:**
```
https://tasamngoclinh.com/gate-vkd-control-2026/cms
```

### **API Endpoints:**
```
https://tasamngoclinh.com/api/strapi/products
https://tasamngoclinh.com/api/strapi/site-headers
https://tasamngoclinh.com/api/strapi/site-footers
https://tasamngoclinh.com/api/strapi/social-links
```

### **Hiển thị Dashboard:**
- 📦 **Tab Sản Phẩm**: 3 sản phẩm (Sâm 6 tuổi, 3 tuổi, Trà)
- 🎨 **Tab Header**: Logo, menu điều hướng, hero
- 🔗 **Tab Footer**: Tên công ty, địa chỉ, điện thoại, email
- 📱 **Tab Mạng Xã Hội**: Facebook, Instagram, YouTube, Telegram, Zalo
- ⚙️ **Tab API**: Tài liệu endpoints

---

## 🔄 BƯỚC TIẾP THEO (Sau 1 giờ)

### **Gửi Task 1 cho Qwen:**

```
File: D:\TA page\site\TASK_1_QWEN_REVENUE_CALCULATOR.md

Copy nội dung và gửi cho Qwen/Ollama:

"Hãy thực hiện task này trên file strapi-admin-dashboard.html
Làm theo tất cả requirements và test cases."

Qwen sẽ:
1. Thêm tính năng tính doanh thu
2. Hiển thị doanh thu theo sản phẩm
3. Thêm stat box tổng doanh thu
4. Format tiền tệ VND
5. Kiểm tra responsive
6. Gửi lại cho Claude review
```

---

## ⚠️ LỖI THƯỜNG GẶP

### **❌ SSH không kết nối**
**Nguyên nhân:** Tài khoản SSH, key không đúng  
**Giải pháp:** 
- Kiểm tra tên người dùng: `user` có đúng không
- Kiểm tra SSH key: `~/.ssh/authorized_keys` trên server

### **❌ scp: permission denied**
**Nguyên nhân:** Quyền truy cập thư mục `/opt/strapi-backend`  
**Giải pháp:**
```bash
sudo chown www-data:www-data /opt/strapi-backend
sudo chmod 755 /opt/strapi-backend
```

### **❌ Setup script fail**
**Nguyên nhân:** Server API chưa chạy  
**Giải pháp:**
```bash
sudo systemctl restart strapi-backend
sleep 3
node /opt/strapi-backend/setup.js
```

### **❌ Nginx 502 Bad Gateway**
**Nguyên nhân:** API server chưa chạy hoặc Nginx proxy sai  
**Giải pháp:**
```bash
sudo systemctl status strapi-backend
sudo netstat -tuln | grep 1337
sudo systemctl reload nginx
```

### **❌ Dashboard trống**
**Nguyên nhân:** Dữ liệu chưa được tạo  
**Giải pháp:**
```bash
cd /opt/strapi-backend
node setup.js
```

### **❌ CORS error trong console**
**Nguyên nhân:** Nginx headers chưa đúng  
**Giải pháp:**
- Clear cache: `Ctrl+Shift+R` trong trình duyệt
- Kiểm tra Nginx config: `sudo grep -A 5 "Access-Control" /etc/nginx/sites-available/tasamngoclinh.com`

---

## 📊 THỜI GIAN DỰ TỈ

```
⏱️  5-10 phút:    Copy file (scp)
⏱️  5 phút:       Setup systemd
⏱️  2-3 phút:     Chạy script tạo dữ liệu
⏱️  10 phút:      Cấu hình Nginx
⏱️  5-10 phút:    Kiểm tra endpoints
⏱️  60 phút:      Giám sát (optional)
━━━━━━━━━━
⏱️  ~1-1.5 giờ:   TỔNG CỘNG
```

---

## 🎉 HOÀN THÀNH

✅ Dashboard sống tại: https://tasamngoclinh.com/gate-vkd-control-2026/cms

**Tiếp theo:** Gửi Task 1 cho Qwen, hoặc giám sát API 1 giờ

---

## 📞 CẦN GIÚP?

- **Tính năng mà không biết:** Xem `DEPLOY_QUICK_START.txt`
- **Chi tiết từng bước:** Xem `DEPLOY_NOW.md`
- **Lỗi kỹ thuật:** Xem phần "**Lỗi Thường Gặp**" ở trên

---

**Sẵn sàng? Chạy ngay! 🚀**
