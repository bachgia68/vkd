@echo off
REM Strapi Autostart Script — Phase 3
REM Opens localhost:1337/admin automatically after startup

cd /d "%~dp0"

REM Ensure logs directory exists
if not exist "logs" mkdir logs

REM Start Strapi in background, redirect output to log
echo Starting Strapi...
start /b npm run develop > logs\strapi-startup.log 2>&1

REM Wait 5 seconds for Strapi to initialize
timeout /t 5 /nobreak

REM Open admin panel in default browser
echo Opening admin panel...
start http://localhost:1337/admin

REM Completion message
echo.
echo Strapi started. Admin panel opening in browser.
echo Log file: logs\strapi-startup.log
echo.
