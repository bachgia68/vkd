@echo off
REM Run Strapi collections setup script

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Strapi Collections Setup
echo ========================================
echo.

cd /d "D:\TA page\site"

REM Check if Strapi is running
echo ⏳ Checking if Strapi is running...
curl -s http://localhost:1337/admin >nul 2>&1
if errorlevel 1 (
    echo ❌ Strapi is not running. Please run start-strapi.bat first.
    echo.
    pause
    exit /b 1
)

echo ✅ Strapi is running.
echo.

REM Run setup script
echo 🚀 Running setup script...
echo.
node strapi/scripts/setup-collections.js

if errorlevel 1 (
    echo.
    echo ❌ Setup failed. Check Strapi admin UI or error messages above.
    echo.
) else (
    echo.
    echo ✅ Setup complete!
    echo.
    echo 📊 View your data at: http://localhost:1337/admin
)

pause
