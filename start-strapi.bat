@echo off
REM Start Strapi + PostgreSQL + n8n via Docker Compose

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   TA Project - Docker Compose Startup
echo ========================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker not running. Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    timeout /t 5 /nobreak
)

REM Start containers
echo 🚀 Starting containers...
cd /d "D:\TA page\site"
docker-compose up -d

echo.
echo ⏳ Waiting for services to be healthy...
timeout /t 3 /nobreak

REM Check Strapi
:check_strapi
curl -s http://localhost:1337/admin >nul 2>&1
if errorlevel 1 (
    echo ⏳ Strapi still starting...
    timeout /t 2 /nobreak
    goto check_strapi
)

echo.
echo ✅ All services started!
echo.
echo 📋 Service URLs:
echo   - Strapi Admin:  http://localhost:1337/admin
echo   - n8n:          http://localhost:5678
echo   - PostgreSQL:   localhost:5432
echo.
echo 💡 Next steps:
echo   1. Open http://localhost:1337/admin
echo   2. Create 4 collections via admin UI (see console)
echo   3. Run: node strapi/scripts/setup-collections.js
echo.
pause
