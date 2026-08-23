@echo off
title Mai Studio - KOL Mai
cd /d "D:\TA page\site\ta_production\project"

echo Kiem tra dev server...
netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% == 0 (
    echo Dev server dang chay tren port 5173
) else (
    echo Khoi dong dev server...
    start "Vite Dev" cmd /c "npm run dev -- --port 5173 --strictPort"
    timeout /t 5 /nobreak >nul
)

echo Mo Mai Studio...
start "" "http://localhost:5173/mai-studio"

echo.
echo Mai Studio da mo trong trinh duyet.
echo Dong cua so nay de tat server hoac de nguyen.
pause
