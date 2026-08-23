@echo off
title TA Studio
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║         TA STUDIO - Video Marketing       ║
echo  ║         Sam Ngoc Linh Brand               ║
echo  ╚══════════════════════════════════════════╝
echo.

REM ── Credentials ────────────────────────────────────────────
set TELEGRAM_BOT_TOKEN=7749056562:AAHMxs0lN7GxJLExGHPq8P5YEjN7OFZ-qkU
set TELEGRAM_CHAT_ID=-1002691066984

REM Gemini API key (aistudio.google.com)
set GEMINI_API_KEY=AIzaSyChrHvxexuDB5NdNt3LKlZ1HzuxVSFJQng

REM Kling AI – video chuyển động thật (klingai.com)
set KLING_API_KEY=api-key-kling-Uk7kpWywTKdiU99U35XMuKmtXohwnxaazQETz7GMrr0

REM Admin password cho trang quản lý (đổi tùy ý)
set ADMIN_PASSWORD=ta2026
REM ────────────────────────────────────────────────────────────

echo [1/3] Dang khoi dong backend API (Flask)...
cd /d "%~dp0backend"
start /B "" "C:\Users\DELL\AppData\Local\Python\bin\python.exe" app.py > backend.log 2>&1

echo [2/3] Cho server khoi dong...
timeout /t 3 /nobreak >nul

echo [3/3] Mo TA Studio trong trinh duyet...
start "" "http://localhost:5050"

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║  TA Studio dang chay!                                ║
echo  ║                                                      ║
echo  ║  May tinh:  http://localhost:5050                    ║
echo  ║  Dien thoai (cung WiFi): http://192.168.66.101:5050  ║
echo  ║                                                      ║
echo  ║  KOL Mai dung tren dien thoai:                      ║
echo  ║   1. Ket noi cung mang WiFi                         ║
echo  ║   2. Mo trinh duyet, vao: 192.168.66.101:5050       ║
echo  ║   3. Nhan "Add to Home Screen" de dung nhu app      ║
echo  ║                                                      ║
echo  ║  Xem log backend: backend\backend.log               ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
echo  [Dong cua so nay - backend van chay o nen]
pause >nul
