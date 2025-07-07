@echo off
echo 🚀 Compilando LinkedIn Pattern Seeker Extension...
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado. Instale Node.js primeiro.
    echo Baixe em: https://nodejs.org/
    pause
    exit /b 1
)

REM Instalar dependências se não existirem
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    npm install
)

REM Executar build
echo 🔨 Compilando extensão...
node build-extensao.js

echo.
echo ✅ Concluído! Siga as instruções acima.
pause