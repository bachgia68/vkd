@echo off
chcp 65001 >nul
cd /d "D:\TA page\site\tasks"
set PY=C:\Users\DELL\AppData\Local\Python\bin\python3.14.exe

:menu
cls
echo.
echo  AUTO BLOG - SAM NGOC LINH (TA)
echo  ================================
echo  1. Khoa hoc  (saponin, MR2)
echo  2. Doi song  (lifestyle)
echo  3. Di san    (heritage)
echo  0. Thoat
echo.
set /p c=Chon (0-3): 

if "%c%"=="1" goto khoa_hoc
if "%c%"=="2" goto doi_song
if "%c%"=="3" goto di_san
if "%c%"=="0" exit /b 0
goto menu

:khoa_hoc
echo.
echo [DANG CHAY] Topic: khoa hoc...
echo.
"%PY%" generate_and_post_blog.py --topic science
echo.
pause
goto menu

:doi_song
echo.
echo [DANG CHAY] Topic: doi song...
echo.
"%PY%" generate_and_post_blog.py --topic lifestyle
echo.
pause
goto menu

:di_san
echo.
echo [DANG CHAY] Topic: di san...
echo.
"%PY%" generate_and_post_blog.py --topic heritage
echo.
pause
goto menu
