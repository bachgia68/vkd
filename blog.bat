@echo off
chcp 65001 >nul
title HE THONG SINH BAI VIET CHUYEN GIA 2200+ TU - TA SAM NGOC LINH

cd /d "%~dp0"

set PYTHON_CMD=python
where python >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Users\DELL\AppData\Local\Python\bin\python3.14.exe" set PYTHON_CMD=C:\Users\DELL\AppData\Local\Python\bin\python3.14.exe
    if exist "C:\Python312\python.exe" set PYTHON_CMD=C:\Python312\python.exe
    if exist "C:\Python311\python.exe" set PYTHON_CMD=C:\Python311\python.exe
    if exist "C:\Python310\python.exe" set PYTHON_CMD=C:\Python310\python.exe
    if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" set PYTHON_CMD=%LOCALAPPDATA%\Programs\Python\Python312\python.exe
    if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" set PYTHON_CMD=%LOCALAPPDATA%\Programs\Python\Python311\python.exe
)

if not exist "venv_blog\Scripts\activate.bat" (
    echo [SETUP] Tao moi truong ao venv_blog...
    "%PYTHON_CMD%" -m venv venv_blog
    call venv_blog\Scripts\activate.bat
    pip install --quiet requests Pillow
) else (
    call venv_blog\Scripts\activate.bat
)

echo.
echo =======================================================
echo   TA SAM NGOC LINH - BLOG GENERATOR (2200+ TU CHUAN)
echo =======================================================
echo.
echo [1] Nhap Tieu de / Tu khoa chi dinh (Sinh bai 2.200+ tu)
echo [2] Sinh bai tu dong theo Content Matrix
echo [3] Thoat
echo.
set /p choice="Chon chuc nang (1-3): "

if "%choice%"=="1" (
    echo.
    set /p topicname="Nhap tieu de hoac tu khoa: "
    echo.
    echo [DANG CHAY] Sinh bai viet 2200+ tu...
    "%PYTHON_CMD%" scripts\generate_blog.py --topic "%topicname%"
    echo.
    echo Preview:  https://tasamngoclinh.com/blog/
    echo Admin:    https://tasamngoclinh.com/blog-admin.html
    echo Telegram: @tasamngoclinh_bot
    pause
    goto end
)

if "%choice%"=="2" (
    echo.
    echo [DANG CHAY] Tu dong chon chu de tu Content Matrix...
    "%PYTHON_CMD%" scripts\generate_blog.py --auto
    echo.
    echo Preview:  https://tasamngoclinh.com/blog/
    echo Admin:    https://tasamngoclinh.com/blog-admin.html
    echo Telegram: @tasamngoclinh_bot
    pause
    goto end
)

:end