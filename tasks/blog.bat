@echo off
cd /d "D:\TA page\site\tasks"
set PY=C:\Users\DELL\AppData\Local\Python\bin\python3.14.exe

echo.
echo ============================================================
echo   AUTO BLOG - SAM NGOC LINH (TA)
echo   tasamngoclinh.com
echo ============================================================
echo.
echo  [1] Kiem tra Ollama...
echo.

:: Start Ollama neu chua chay
tasklist /FI "IMAGENAME eq ollama.exe" 2>nul | find /I "ollama.exe" >nul
if errorlevel 1 (
  echo [START] Khoi dong Ollama...
  start /B ollama serve
  timeout /t 8 /nobreak >nul
  echo [OK] Ollama da khoi dong
) else (
  echo [OK] Ollama dang chay san
)

echo.
echo  [2] Sinh bai viet tu dong (round-robin topics)...
echo      - Chon category ke tiep: science/lifestyle/heritage/kgc
echo      - Sinh noi dung + kiem tra compliance
echo      - Tao anh featured + upload Supabase
echo      - Gui bao cao Telegram
echo.

"%PY%" generate_and_post_blog.py --auto

echo.
echo ============================================================
echo   HOAN THANH!
echo.
echo   Preview:  https://tasamngoclinh.com/blog/
echo   Admin:    https://tasamngoclinh.com/blog-admin.html
echo   Telegram: Kiem tra @tasamngoclinh_bot
echo ============================================================
echo.
pause