@echo off
REM Chay batch dich san pham (EN/ZH/FR) qua Ollama local.
REM Yeu cau: Ollama dang chay (ollama serve) va co model qwen2.5:7b-instruct
REM   (kiem tra: ollama list). Neu chua co: ollama pull qwen2.5:7b-instruct
REM Ket qua: ghi de src\data\products.ts, in ra so SKU dich thanh cong/loi,
REM   SKU loi luu vao tasks\phase11_translate_needs_review.json de xem lai.
cd /d "%~dp0.."
echo ===============================================
echo   Dich san pham TA qua Ollama (qwen2.5:7b-instruct)
echo ===============================================
node scripts\translate-products-ollama.mjs
echo.
echo ===============================================
echo   XONG. Kiem tra ket qua o tren, sau do chay:
echo     npx tsc --noEmit
echo     npm run build
echo   Neu sach, bao Claude de deploy len live.
echo ===============================================
pause
