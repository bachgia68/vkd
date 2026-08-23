@echo off
REM Deploy TA Admin Dashboard to tasamngoclinh.com
REM Usage: deploy-to-server.bat

setlocal enabledelayedexpansion

echo.
echo ================================================
echo    TA Admin Dashboard Deployment Script
echo ================================================
echo.

REM Configuration
set SERVER_USER=user
set SERVER_HOST=tasamngoclinh.com
set BACKEND_DIR=/opt/strapi-backend
set WEBROOT=/var/www/tasamngoclinh.com/gate-vkd-control-2026/cms
set STRAPI_PORT=1337

echo.
echo 📋 STEP 1: Verify Files Exist
echo ================================================
if not exist "strapi-admin-dashboard.html" (
    echo ❌ ERROR: strapi-admin-dashboard.html not found!
    exit /b 1
)
if not exist "mock-strapi-server.js" (
    echo ❌ ERROR: mock-strapi-server.js not found!
    exit /b 1
)
if not exist "strapi\scripts\setup-collections.js" (
    echo ❌ ERROR: strapi/scripts/setup-collections.js not found!
    exit /b 1
)
echo ✅ All files found

echo.
echo 📋 STEP 2: Verify SSH Connection
echo ================================================
echo Checking SSH connection to %SERVER_HOST%...
ssh %SERVER_USER%@%SERVER_HOST% "echo SSH OK" > nul 2>&1
if errorlevel 1 (
    echo ❌ Cannot connect to %SERVER_HOST%
    echo Solution:
    echo   1. Verify server hostname
    echo   2. Check SSH is installed
    echo   3. Verify SSH key is configured
    echo   4. Edit this script to set SERVER_USER and SERVER_HOST
    exit /b 1
)
echo ✅ SSH connection successful

echo.
echo 📋 STEP 3: Copy Backend Files
echo ================================================
echo Copying mock-strapi-server.js...
scp mock-strapi-server.js %SERVER_USER%@%SERVER_HOST%:%BACKEND_DIR%/server.js
if errorlevel 1 (
    echo ❌ Failed to copy mock-strapi-server.js
    exit /b 1
)
echo ✅ mock-strapi-server.js copied

echo Copying setup-collections.js...
scp strapi\scripts\setup-collections.js %SERVER_USER%@%SERVER_HOST%:%BACKEND_DIR%/setup.js
if errorlevel 1 (
    echo ❌ Failed to copy setup-collections.js
    exit /b 1
)
echo ✅ setup-collections.js copied

echo.
echo 📋 STEP 4: Copy Dashboard HTML
echo ================================================
echo Copying strapi-admin-dashboard.html...
scp strapi-admin-dashboard.html %SERVER_USER%@%SERVER_HOST%:%WEBROOT%/index.html
if errorlevel 1 (
    echo ❌ Failed to copy dashboard HTML
    exit /b 1
)
echo ✅ Dashboard HTML copied

echo.
echo 📋 STEP 5: Create Backend Directory
echo ================================================
ssh %SERVER_USER%@%SERVER_HOST% "mkdir -p %BACKEND_DIR% && chmod 755 %BACKEND_DIR%"
if errorlevel 1 (
    echo ⚠️  Warning: Could not create backend directory (might already exist)
)
echo ✅ Backend directory ready

echo.
echo 📋 STEP 6: Create Webroot Directory
echo ================================================
ssh %SERVER_USER%@%SERVER_HOST% "sudo mkdir -p %WEBROOT% && sudo chmod 755 %WEBROOT%"
if errorlevel 1 (
    echo ⚠️  Warning: Could not create webroot (might already exist)
)
echo ✅ Webroot directory ready

echo.
echo 📋 STEP 7: Setup Systemd Service (On Server)
echo ================================================
echo Run this command on server to setup auto-start:
echo.
echo ssh %SERVER_USER%@%SERVER_HOST%
echo sudo tee /etc/systemd/system/strapi-backend.service ^^> /dev/null ^^<^<'EOF'
echo [Unit]
echo Description=TA Strapi Backend API
echo After=network.target
echo.
echo [Service]
echo Type=simple
echo User=www-data
echo WorkingDirectory=%BACKEND_DIR%
echo ExecStart=/usr/bin/node %BACKEND_DIR%/server.js
echo Restart=on-failure
echo RestartSec=10
echo.
echo [Install]
echo WantedBy=multi-user.target
echo EOF
echo.
echo sudo systemctl daemon-reload
echo sudo systemctl enable strapi-backend
echo sudo systemctl start strapi-backend
echo.

echo.
echo 📋 STEP 8: Run Setup Script (On Server)
echo ================================================
echo Run this command on server to populate data:
echo.
echo ssh %SERVER_USER%@%SERVER_HOST%
echo cd %BACKEND_DIR%
echo node setup.js
echo.

echo.
echo 📋 STEP 9: Configure Nginx (On Server)
echo ================================================
echo Add this to /etc/nginx/sites-available/tasamngoclinh.com:
echo.
echo # Admin Dashboard
echo location /gate-vkd-control-2026/cms/ {
echo     alias %WEBROOT%/;
echo     index index.html;
echo     try_files $uri $uri/ /index.html;
echo     add_header 'Access-Control-Allow-Origin' '$http_origin' always;
echo     add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
echo }
echo.
echo # API Proxy
echo location /api/strapi/ {
echo     proxy_pass http://127.0.0.1:%STRAPI_PORT%/api/;
echo     proxy_set_header Host $host;
echo     proxy_set_header X-Real-IP $remote_addr;
echo     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
echo     proxy_set_header X-Forwarded-Proto $scheme;
echo     add_header 'Access-Control-Allow-Origin' '*' always;
echo     add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
echo }
echo.

echo.
echo 📋 STEP 10: Test Nginx and Reload
echo ================================================
echo Run on server:
echo.
echo sudo nginx -t
echo sudo systemctl reload nginx
echo.

echo.
echo ================================================
echo ✅ FILE TRANSFER COMPLETE
echo ================================================
echo.
echo 📊 Next Steps (Run on tasamngoclinh.com):
echo.
echo 1. SSH to server:
echo    ssh %SERVER_USER%@%SERVER_HOST%
echo.
echo 2. Setup systemd service (copy from Step 7 above)
echo.
echo 3. Start API server:
echo    sudo systemctl start strapi-backend
echo.
echo 4. Verify running:
echo    curl http://127.0.0.1:%STRAPI_PORT%/admin
echo.
echo 5. Populate data:
echo    cd %BACKEND_DIR%
echo    node setup.js
echo.
echo 6. Configure Nginx (edit /etc/nginx/sites-available/tasamngoclinh.com)
echo    Add location blocks from Step 9
echo.
echo 7. Test and reload Nginx:
echo    sudo nginx -t
echo    sudo systemctl reload nginx
echo.
echo 8. Verify deployment:
echo    curl https://%SERVER_HOST%/api/strapi/products
echo    curl https://%SERVER_HOST%/gate-vkd-control-2026/cms/
echo.
echo 📍 Admin Dashboard URL:
echo    https://%SERVER_HOST%/gate-vkd-control-2026/cms
echo.
echo 📍 API Endpoints:
echo    https://%SERVER_HOST%/api/strapi/products
echo    https://%SERVER_HOST%/api/strapi/site-headers
echo    https://%SERVER_HOST%/api/strapi/site-footers
echo    https://%SERVER_HOST%/api/strapi/social-links
echo.
echo ================================================
echo For detailed instructions, see: DEPLOY_NOW.md
echo ================================================
echo.
pause
