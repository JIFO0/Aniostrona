@echo off
title Aniastrona - Export & Podglad
echo ================================================
echo   Aniastrona - Eksport i Podglad Strony
echo ================================================
echo.
echo Budowanie statycznej wersji strony i uruchamianie podgladu...
echo.

cd /d "%~dp0"
py export_static.py --preview || python export_static.py --preview || npm run export:preview
pause
