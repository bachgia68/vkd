@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
cd /d "D:\TA page\site\tasks"

set SCRIPT=generate_and_post_blog.py
set PY=C:\Users\DELL\AppData\Local\Python\bin\python3.14.exe
if not exist "%PY%" set PY=python

:: Quick Python check
%PY% --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python khong tim thay: %PY%
    pause & exit /b 1
)

:menu
cls
echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║    AUTO BLOG — SAM NGOC LINH (TA)                   ║
echo  ║    AI: Ollama local (Gemini fallback neu co key)     ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
echo  1. Khoa Hoc   (MR2, saponin, nghien cuu)
echo  2. Doi Song   (lifestyle, gia dinh, suc khoe)
echo  3. Di San     (nui Ngoc Linh, van hoa, lich su)
echo  4. Tu nhap tieu de bai viet bat ky
echo  5. Xem log 50 dong cuoi
echo  6. Chay auto (tu dong chon topic theo thu)
echo  0. Thoat
echo.
set /p CHOICE="  Chon [0-6]: "

if "!CHOICE!"=="1" goto run_science
if "!CHOICE!"=="2" goto run_lifestyle
if "!CHOICE!"=="3" goto run_heritage
if "!CHOICE!"=="4" goto run_custom
if "!CHOICE!"=="5" goto show_log
if "!CHOICE!"=="6" goto run_auto
if "!CHOICE!"=="0" exit /b 0
goto menu

:run_science
    echo.
    echo [DANG CHAY] Topic: KHOA HOC — cho doi (co the mat 1-2 phut)...
    echo.
    %PY% %SCRIPT% --topic science
    goto done

:run_lifestyle
    echo.
    echo [DANG CHAY] Topic: DOI SONG — cho doi...
    echo.
    %PY% %SCRIPT% --topic lifestyle
    goto done

:run_heritage
    echo.
    echo [DANG CHAY] Topic: DI SAN — cho doi...
    echo.
    %PY% %SCRIPT% --topic heritage
    goto done

:run_custom
    echo.
    set /p CUSTOM_TOPIC="  Topic (science/lifestyle/heritage): "
    set /p CUSTOM_TITLE="  Tieu de bai viet (bo trong = dung queue): "
    echo.
    echo [DANG CHAY] Cho doi (1-2 phut)...
    echo.
    if "!CUSTOM_TITLE!"=="" (
        %PY% %SCRIPT% --topic !CUSTOM_TOPIC!
    ) else (
        %PY% %SCRIPT% --topic !CUSTOM_TOPIC! --title "!CUSTOM_TITLE!"
    )
    goto done

:run_auto
    echo.
    for /f %%d in ('powershell -NoProfile -Command "(Get-Date).DayOfWeek"') do set DOW=%%d
    if "!DOW!"=="Monday"    set AUTO_TOPIC=science
    if "!DOW!"=="Tuesday"   set AUTO_TOPIC=lifestyle
    if "!DOW!"=="Wednesday" set AUTO_TOPIC=science
    if "!DOW!"=="Thursday"  set AUTO_TOPIC=lifestyle
    if "!DOW!"=="Friday"    set AUTO_TOPIC=heritage
    if "!DOW!"=="Saturday"  set AUTO_TOPIC=heritage
    if "!DOW!"=="Sunday"    set AUTO_TOPIC=science
    if not defined AUTO_TOPIC set AUTO_TOPIC=science
    echo [AUTO] Thu: !DOW! → topic: !AUTO_TOPIC!
    echo.
    %PY% %SCRIPT% --topic !AUTO_TOPIC!
    exit /b !errorlevel!

:show_log
    cls
    echo === 50 DONG LOG GAN NHAT (blog_execution.log) ===
    echo.
    powershell -NoProfile -Command "Get-Content 'blog_execution.log' -Tail 50 -ErrorAction SilentlyContinue"
    echo.
    pause
    goto menu

:done
    echo.
    if errorlevel 1 (
        echo  [THAT BAI] Co loi! Xem chi tiet o tren.
    ) else (
        echo  [THANH CONG] Bai viet da tao!
        echo  Kiem tra: https://tasamngoclinh.com/gate-vkd-control-2026/cms
        echo  Telegram bot se bao cao chi tiet.
    )
    echo.
    pause
    goto menu
