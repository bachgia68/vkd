@echo off
cd /d "D:\TA page\site\tasks"
set PY=C:\Users\DELL\AppData\Local\Python\bin\python3.14.exe

echo.
echo  AUTO BLOG - SAM NGOC LINH
echo  Dang kiem tra Ollama...
echo.

:: Start Ollama neu chua chay
tasklist /FI "IMAGENAME eq ollama.exe" 2>nul | find /I "ollama.exe" >nul
if errorlevel 1 (
  echo [START] Khoi dong Ollama...
  start /B ollama serve
  timeout /t 8 /nobreak >nul
) else (
  echo [OK] Ollama dang chay
)

echo.
echo [CHAY] Sinh bai tu dong (round-robin topics)...
echo.

"%PY%" generate_and_post_blog.py --auto

echo.
echo [XONG] Kiem tra Telegram de xem ket qua!
echo.
pause