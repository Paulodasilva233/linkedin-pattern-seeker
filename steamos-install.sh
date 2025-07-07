#!/bin/bash

# LinkedIn Pattern Seeker - Instalador Automático SteamOS/Steam Deck
echo "🎮 LinkedIn Pattern Seeker - Instalador SteamOS"
echo "=================================================="
echo ""

# Verificar se está no desktop mode
if [ "$XDG_CURRENT_DESKTOP" != "KDE" ]; then
    echo "⚠️  ATENÇÃO: Mude para Modo Desktop primeiro!"
    echo "   Steam Button → Power → Switch to Desktop"
    echo ""
    read -p "Pressione Enter quando estiver no Desktop Mode..."
fi

echo "✅ Modo Desktop detectado"
echo ""

# Função para verificar comando
check_command() {
    if command -v "$1" &> /dev/null; then
        echo "✅ $1 encontrado"
        return 0
    else
        echo "❌ $1 não encontrado"
        return 1
    fi
}

# Verificar e instalar Node.js
echo "🔍 Verificando Node.js..."
if ! check_command node; then
    echo "📦 Instalando Node.js via Flatpak..."
    flatpak install -y flathub org.nodejs.node
    
    if [ $? -eq 0 ]; then
        echo "✅ Node.js instalado com sucesso!"
        # Adicionar ao PATH se necessário
        export PATH="$PATH:/var/lib/flatpak/exports/bin"
    else
        echo "❌ Erro ao instalar Node.js"
        echo "💡 Tente instalar manualmente via Discover (loja de apps)"
        exit 1
    fi
else
    echo "✅ Node.js já está instalado: $(node --version)"
fi

echo ""

# Verificar e instalar Chrome
echo "🔍 Verificando Chrome/Chromium..."
if ! check_command google-chrome && ! check_command chromium; then
    echo "🌐 Instalando Chrome via Flatpak..."
    flatpak install -y flathub com.google.Chrome
    
    if [ $? -eq 0 ]; then
        echo "✅ Chrome instalado com sucesso!"
    else
        echo "⚠️  Falha ao instalar Chrome, tentando Chromium..."
        # Tentar instalar Chromium como alternativa
        if command -v pacman &> /dev/null; then
            sudo steamos-readonly disable
            sudo pacman -S --noconfirm chromium
            sudo steamos-readonly enable
        else
            echo "❌ Não foi possível instalar navegador"
            echo "💡 Instale Chrome ou Chromium manualmente via Discover"
            exit 1
        fi
    fi
else
    if check_command google-chrome; then
        echo "✅ Chrome já está instalado"
    elif check_command chromium; then
        echo "✅ Chromium já está instalado"
    fi
fi

echo ""

# Instalar dependências do projeto
echo "📦 Instalando dependências do projeto..."
if [ -f "package.json" ]; then
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao instalar dependências"
        exit 1
    fi
    
    echo "✅ Dependências instaladas!"
else
    echo "❌ Arquivo package.json não encontrado"
    echo "💡 Certifique-se de estar na pasta correta do projeto"
    exit 1
fi

echo ""

# Compilar extensão
echo "🔨 Compilando extensão..."
if [ -f "scripts/build-extension.js" ]; then
    node scripts/build-extension.js
    
    if [ $? -ne 0 ]; then
        echo "❌ Erro durante o build"
        exit 1
    fi
else
    npm run build:extension
    
    if [ $? -ne 0 ]; then
        echo "❌ Erro durante o build"
        exit 1
    fi
fi

echo ""

# Verificar se dist foi criado
if [ -d "dist" ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📁 Pasta 'dist' criada"
else
    echo "❌ Pasta 'dist' não foi criada"
    exit 1
fi

echo ""
echo "🎉 Instalação concluída com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. 🌐 Abrir Chrome:"
if check_command google-chrome; then
    echo "   google-chrome"
    echo "   ou: flatpak run com.google.Chrome"
elif check_command chromium; then
    echo "   chromium"
else
    echo "   flatpak run com.google.Chrome"
fi
echo ""
echo "2. ⚙️  Carregar extensão:"
echo "   - Digite: chrome://extensions/"
echo "   - Ative 'Modo do desenvolvedor'"
echo "   - Clique 'Carregar extensão'"
echo "   - Selecione a pasta 'dist' deste projeto"
echo ""
echo "3. 🎯 Usar no LinkedIn:"
echo "   - Vá para: linkedin.com/feed/"
echo "   - Faça login na sua conta"
echo "   - Clique no ícone da extensão"
echo "   - Configure os padrões e execute!"
echo ""
echo "🎮 Dica Steam Deck:"
echo "   Use touchpad como mouse e L2/R2 para scroll"
echo ""

# Perguntar se quer abrir Chrome automaticamente
read -p "🚀 Quer abrir o Chrome agora? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🌐 Abrindo Chrome..."
    
    if check_command google-chrome; then
        google-chrome > /dev/null 2>&1 &
    elif command -v flatpak &> /dev/null; then
        flatpak run com.google.Chrome > /dev/null 2>&1 &
    elif check_command chromium; then
        chromium > /dev/null 2>&1 &
    fi
    
    sleep 2
    echo "✅ Chrome aberto! Vá para chrome://extensions/"
fi

echo ""
echo "🆘 Se precisar de ajuda, consulte o arquivo TUTORIAL_STEAMOS.md"