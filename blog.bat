@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

:: ================================================================
::  TA Blog Engine v5.0 - Auto-detect Python + Venv + Menu
::  Target: D:\TA page\site\ta_production\project\blog.bat
:: ================================================================

:: ?? 1. Auto-detect Python ?????????????????????????????????????
set PY=
set "CANDIDATES=C:\Users\DELL\AppData\Local\Python\bin\python3.14.exe C:\Users\DELL\AppData\Local\Programs\Python\Python312\python.exe C:\Users\DELL\AppData\Local\Programs\Python\Python311\python.exe C:\Users\DELL\AppData\Local\Programs\Python\Python310\python.exe C:\Python312\python.exe C:\Python311\python.exe C:\Python310\python.exe C:\Users\DELL\anaconda3\python.exe C:\ProgramData\anaconda3\python.exe C:\Users\DELL\miniconda3\python.exe"

for %%C in (%CANDIDATES%) do (
  if exist "%%C" (
    set PY=%%C
    goto :found_py
  )
)
:: Last resort: try PATH
python --version >nul 2>&1
if not errorlevel 1 (
  set PY=python
  goto :found_py
)
echo.
echo  [ERR] Khong tim thay Python tren may!
echo  Cai Python tai https://python.org va thu lai.
echo.
pause & exit /b 1

:found_py
echo  [OK] Python: %PY%

:: ?? 2. Venv setup ??????????????????????????????????????????????
set VENV_DIR=%~dp0venv_blog
set VENV_PY=%VENV_DIR%\Scripts\python.exe
set VENV_PIP=%VENV_DIR%\Scripts\pip.exe

if not exist "%VENV_PY%" (
  echo  [SETUP] Tao virtual environment venv_blog...
  "%PY%" -m venv "%VENV_DIR%"
  if errorlevel 1 (
    echo  [ERR] Khong tao duoc venv. Thu chay lai voi quyen Admin.
    pause & exit /b 1
  )
  echo  [SETUP] Cai packages can thiet...
  "%VENV_PIP%" install --quiet requests Pillow 2>nul
  echo  [OK] Dependencies da cai xong
)

:: ?? 3. Menu ????????????????????????????????????????????????????
:menu
cls
echo.
echo  ============================================================
echo    BLOG ENGINE v5.0 - TA SAM NGOC LINH
echo    tasamngoclinh.com
echo  ============================================================
echo.
echo    [1]  Auto-generate Bai viet SEO + Kich ban Video FB
echo         Chon chu de tu dong (round-robin A/B/C/D)
echo.
echo    [2]  Nhap Tu Khoa / Tieu De chi dinh
echo         Sinh bai SEO + Kich ban Video FB
echo.
echo    [3]  Batch Series: Sinh 5 bai viet + 5 kich ban video
echo.
echo    [0]  Thoat
echo.
set CHOICE=
set /p CHOICE=   Chon [0-3]: 

if "%CHOICE%"=="1" goto :opt_auto
if "%CHOICE%"=="2" goto :opt_custom
if "%CHOICE%"=="3" goto :opt_batch
if "%CHOICE%"=="0" goto :end
echo  [ERR] Lua chon khong hop le, thu lai.
timeout /t 2 /nobreak >nul
goto :menu

:opt_auto
echo.
echo  [CHAY] Auto-generate bai viet + kich ban video...
echo.
"%VENV_PY%" "%~dp0scripts\generate_blog.py" --mode auto
goto :done

:opt_custom
echo.
set TITLE=
set /p TITLE=  Nhap Tieu de hoac Tu khoa: 
if "%TITLE%"=="" (
  echo  [ERR] Tieu de khong duoc de trong!
  timeout /t 2 /nobreak >nul
  goto :menu
)
echo.
echo  [CHAY] Sinh bai theo chu de: %TITLE%
echo.
"%VENV_PY%" "%~dp0scripts\generate_blog.py" --mode custom --title "%TITLE%"
goto :done

:opt_batch
echo.
echo  [CHAY] Sinh batch 5 bai viet + 5 kich ban video...
echo  (Co the mat 10-15 phut, vui long doi...)
echo.
"%VENV_PY%" "%~dp0scripts\generate_blog.py" --mode batch --count 5
goto :done

:done
echo.
echo  ============================================================
echo    HOAN THANH!
echo.
echo    Preview:   https://tasamngoclinh.com/blog/
echo    Admin CMS: https://tasamngoclinh.com/blog-admin.html
echo    Telegram:  @tasamngoclinh_bot
echo    Scripts:   %~dp0content\video_scripts\
echo  ============================================================
echo.
echo  An phim bat ky de quay ve menu...
pause >nul
goto :menu

:end
echo  Tam biet!
exit /b 0