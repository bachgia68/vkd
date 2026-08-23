@echo off
title Ollama Coder - qwen2.5-coder
cd /d "D:\TA page\site\ta_production\project"

echo ============================================
echo  Ollama Coder - qwen2.5-coder:7b
echo  Claude lam sep, Ollama viet code
echo ============================================
echo.
echo Cu phap:
echo   aider --model ollama/qwen2.5-coder:7b [file]
echo   Vi du: aider --model ollama/qwen2.5-coder:7b src/components/mai/MaiStudio.tsx
echo.
echo Dang kiem tra Ollama...
ollama list

echo.
echo Bat dau phien lam viec...
echo Nhap lenh aider ben duoi hoac paste task tu Claude:
echo.

cmd /k
