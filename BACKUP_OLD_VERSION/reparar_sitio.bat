@echo off
title Reparando Iniciativa Sonora...
echo ==========================================
echo   LIMPIANDO INSTALACION ANTERIOR
echo ==========================================
if exist node_modules (
    echo Borrando node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Borrando package-lock.json...
    del package-lock.json
)

echo.
echo ==========================================
echo   INSTALANDO DEPENDENCIAS (Esto puede tardar unos minutos)
echo ==========================================
call npm install

echo.
echo ==========================================
echo   TODO LISTO! INICIANDO SERVIDOR...
echo ==========================================
echo Si el navegador no abre automaticamente, visita: http://localhost:5173
call npm run dev
pause
