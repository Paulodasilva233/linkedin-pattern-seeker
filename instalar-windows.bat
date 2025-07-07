@echo off
cls
color 0A

echo.
echo 🪟 LinkedIn Pattern Seeker - Instalador Windows
echo ================================================
echo.
echo 📋 Este instalador vai:
echo    - Verificar se tem Node.js (instalar se precisar)
echo    - Compilar a extensao automaticamente
echo    - Abrir Chrome para voce carregar a extensao
echo.
pause

REM Verificar se Node.js esta instalado
echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js nao encontrado!
    echo.
    echo 📥 Opcoes para instalar Node.js:
    echo    1. Automatico - Baixar e instalar agora
    echo    2. Manual - Eu instalo depois
    echo    3. Pular - Usar versao ja compilada
    echo.
    set /p choice="Escolha uma opcao (1/2/3): "
    
    if "!choice!"=="1" (
        echo 📦 Baixando Node.js...
        echo 🌐 Abrindo pagina de download do Node.js...
        start https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi
        echo.
        echo ⏳ Por favor:
        echo    1. Baixe e instale o Node.js
        echo    2. Reinicie este instalador
        echo    3. Ou pressione qualquer tecla se ja instalou
        echo.
        pause
        
        REM Verificar novamente
        node --version >nul 2>&1
        if errorlevel 1 (
            echo ❌ Node.js ainda nao foi instalado
            echo 📋 Vou usar a versao ja compilada
            goto :use_compiled
        )
    ) else if "!choice!"=="2" (
        echo 📋 Instale Node.js manualmente: https://nodejs.org/
        echo ⏳ Execute este instalador novamente depois
        pause
        exit /b 1
    ) else (
        echo 📋 Usando versao ja compilada...
        goto :use_compiled
    )
)

echo ✅ Node.js encontrado: 
node --version
echo ✅ npm encontrado:
npm --version
echo.

REM Verificar se package.json existe
if not exist "package.json" (
    echo ❌ package.json nao encontrado!
    echo 📁 Certifique-se de estar na pasta correta do projeto
    echo 💡 A pasta deve conter: package.json, src/, public/
    pause
    exit /b 1
)

echo ✅ Projeto encontrado
echo.

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependencias
    echo 💡 Tentando usar versao ja compilada...
    goto :use_compiled
)

echo ✅ Dependencias instaladas!
echo.

REM Compilar extensao
echo 🔨 Compilando extensao...
if exist "scripts\build-extension.js" (
    node scripts\build-extension.js
) else (
    call npm run build
)

if errorlevel 1 (
    echo ❌ Erro na compilacao
    echo 💡 Usando versao ja compilada...
    goto :use_compiled
)

echo ✅ Extensao compilada com sucesso!
goto :install_chrome

:use_compiled
echo.
echo 📁 Verificando se existe versao ja compilada...
if exist "dist" (
    echo ✅ Pasta 'dist' encontrada!
    echo 📋 Vou usar a versao ja compilada
) else (
    echo ❌ Pasta 'dist' nao encontrada
    echo 💡 Criando versao basica...
    mkdir dist
    
    REM Copiar arquivos basicos
    if exist "public\manifest.json" copy "public\manifest.json" "dist\"
    if exist "public\background.js" copy "public\background.js" "dist\"
    if exist "public\content-script.js" copy "public\content-script.js" "dist\"
    if exist "public\injected-script.js" copy "public\injected-script.js" "dist\"
    if exist "public\favicon.ico" copy "public\favicon.ico" "dist\"
    
    REM Criar index.html basico se nao existir
    if not exist "dist\index.html" (
        echo ^<!DOCTYPE html^> > "dist\index.html"
        echo ^<html^>^<head^>^<title^>LinkedIn Pattern Seeker^</title^>^</head^> >> "dist\index.html"
        echo ^<body^>^<h1^>LinkedIn Pattern Seeker^</h1^>^<p^>Extensao carregada!^</p^>^</body^>^</html^> >> "dist\index.html"
    )
    
    echo ✅ Versao basica criada!
)

:install_chrome
echo.
echo 🎉 Instalacao concluida!
echo.
echo 📋 Proximo passo - Carregar no Chrome:
echo.
echo    1. 🌐 Vou abrir o Chrome para voce
echo    2. ⚙️  Navegue para: chrome://extensions/
echo    3. 🔧 Ative 'Modo do desenvolvedor' (canto superior direito)
echo    4. 📁 Clique 'Carregar sem compactacao'
echo    5. 📂 Selecione a pasta 'dist' deste projeto
echo    6. 🎯 Va para linkedin.com/feed/ e teste!
echo.
echo 💡 Pasta para selecionar: %CD%\dist
echo.

set /p open_chrome="🚀 Abrir Chrome agora? (s/n): "
if /i "!open_chrome!"=="s" (
    echo 🌐 Abrindo Chrome...
    start chrome.exe
    timeout /t 3 /nobreak >nul
    echo ✅ Chrome aberto!
    echo 📋 Digite: chrome://extensions/
) else (
    echo 📋 Lembre-se: chrome://extensions/
)

echo.
echo 📁 Localizacao da extensao:
echo    %CD%\dist
echo.
echo 🎯 Para usar:
echo    1. Va para linkedin.com/feed/
echo    2. Faca login no LinkedIn
echo    3. Clique no icone da extensao
echo    4. Configure os padroes e busque!
echo.
echo 🎉 Instalacao Windows concluida com sucesso!
echo.
pause