@echo off
chcp 65001 >nul
title HE THONG SINH BAI VIET CHUYEN GIA - TA SAM NGOC LINH
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
    if exist "%APPDATA%\Local\Python\bin\python3.14.exe" set PYTHON_CMD=%APPDATA%\Local\Python\bin\python3.14.exe
)

if not exist "venv_blog\Scripts\activate.bat" (
    echo  [SETUP] Tao moi truong ao venv_blog...
    "%PYTHON_CMD%" -m venv venv_blog
    call venv_blog\Scripts\activate.bat
    pip install --quiet requests Pillow
) else (
    call venv_blog\Scripts\activate.bat
)

:MENU
echo.
echo  ================================================
echo   HE THONG SINH BAI VIET - TA SAM NGOC LINH v6.0
echo   Tieu chuan: 2000-2500 tu / YAML frontmatter
echo  ================================================
echo.
echo  [1] Nhap Tieu de / Tu khoa bai viet moi
echo  [2] Sinh bai tu dong theo Content Matrix
echo  [3] Thoat
echo.
set /p choice="  Chon chuc nang (1-3): "

if "%choice%"=="1" goto CUSTOM
if "%choice%"=="2" goto AUTO
if "%choice%"=="3" goto END
echo  Lua chon khong hop le. Vui long chon 1, 2, hoac 3.
goto MENU

:CUSTOM
echo.
set /p title="  Nhap tieu de hoac tu khoa: "
if "%title%"=="" (
    echo  [LOI] Tieu de khong duoc de trong.
    goto MENU
)
echo.
echo  [DANG CHAY] Sinh bai viet: %title%
echo  Tieu chuan: 2000-2500 tu, YAML frontmatter, TOC, bang so sanh
echo.
"%PYTHON_CMD%" scripts\generate_blog.py --topic "%title%"
echo.
echo  ================================================
echo   HOAN THANH
echo   Preview:  https://tasamngoclinh.com/blog/
echo   Admin:    https://tasamngoclinh.com/blog-admin.html
echo   Telegram: Kiem tra @tasamngoclinh_bot
echo   Scripts:  content\video_scripts\
echo  ================================================
goto MENU

:AUTO
echo.
echo  [DANG CHAY] Tu dong chon chu de tu Content Matrix (vong tron A-B-C-D)
echo  Tieu chuan: 2000-2500 tu, YAML frontmatter, TOC, bang so sanh
echo.
"%PYTHON_CMD%" scripts\generate_blog.py --auto
echo.
echo  ================================================
echo   HOAN THANH
echo   Preview:  https://tasamngoclinh.com/blog/
echo   Admin:    https://tasamngoclinh.com/blog-admin.html
echo   Telegram: Kiem tra @tasamngoclinh_bot
echo   Scripts:  content\video_scripts\
echo  ================================================
goto MENU

:END
echo  Tam biet!
exit /b 0