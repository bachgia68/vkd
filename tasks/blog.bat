@echo off
cd /d "D:\TA page\site\tasks"
set PY=C:\Users\DELL\AppData\Local\Python\bin\python3.14.exe

:menu
cls
echo.
echo  AUTO BLOG - SAM NGOC LINH (TA)
echo  =====================================
echo  1. Sinh bai tu dong        (auto queue)
echo  2. Chon chu de cu the      (topic-based)
echo  3. Quet tin tuc va viet    (scrape + write)
echo  0. Thoat
echo.
set /p c=Chon (0-3): 

if "%c%"=="1" goto auto
if "%c%"=="2" goto topic
if "%c%"=="3" goto scrape
if "%c%"=="0" exit /b 0
goto menu

:auto
echo.
echo [AUTO] Sinh bai tu dong tu queue...
echo.
"%PY%" generate_and_post_blog.py --auto
echo.
pause
goto menu

:topic
cls
echo.
echo  CHON TOPIC:
echo  A. Khoa hoc (science)
echo  B. Doi song (lifestyle)
echo  C. Di san   (heritage)
echo  D. KGC / Premium
echo.
set /p t=Chon (A-D): 

if /i "%t%"=="A" (
  "%PY%" generate_and_post_blog.py --topic science
) else if /i "%t%"=="B" (
  "%PY%" generate_and_post_blog.py --topic lifestyle
) else if /i "%t%"=="C" (
  "%PY%" generate_and_post_blog.py --topic heritage
) else if /i "%t%"=="D" (
  "%PY%" generate_and_post_blog.py --topic kgc
) else (
  echo Lua chon khong hop le.
)
echo.
pause
goto menu

:scrape
echo.
echo [SCRAPE] Dang quet tin tuc thi truong...
echo.
"%PY%" generate_and_post_blog.py --scrape
echo.
pause
goto menu