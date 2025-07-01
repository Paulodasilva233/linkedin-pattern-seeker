@echo off
cls

echo.
echo 🚀 LinkedIn Pattern Seeker - Instalador Automatico
echo ==================================================
echo.

REM Verificar se Node.js esta instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js nao encontrado!
    echo 📥 Por favor, instale Node.js primeiro: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

REM Verificar se npm esta disponivel
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm nao encontrado!
    pause
    exit /b 1
)

echo ✅ npm encontrado
npm --version
echo.

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas com sucesso!
echo.

REM Executar build da extensao
echo 🔨 Compilando extensao...
node scripts/build-extension.js
if errorlevel 1 (
    echo ❌ Erro durante o build
    pause
    exit /b 1
)

echo.
echo 🎉 Instalacao concluida com sucesso!
echo.
echo 📋 Como carregar a extensao no Chrome:
echo    1. Abra Chrome
echo    2. Digite: chrome://extensions/
echo    3. Ative 'Modo do desenvolvedor' (canto superior direito)
echo    4. Clique em 'Carregar sem compactacao'
echo    5. Selecione a pasta 'dist' deste projeto
echo    6. Va para linkedin.com/feed/ e teste!
echo.
echo 🔧 Scripts disponiveis:
echo    npm run build:extension  - Recompilar extensao
echo    npm run pack:extension   - Criar arquivo zip
echo.

pause