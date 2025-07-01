#!/bin/bash

# LinkedIn Pattern Seeker - Instalador Automático
echo "🚀 LinkedIn Pattern Seeker - Instalador Automático"
echo "=================================================="
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "📥 Por favor, instale Node.js primeiro: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar se npm está disponível
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado!"
    exit 1
fi

echo "✅ npm encontrado: $(npm --version)"
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas com sucesso!"
echo ""

# Executar build da extensão
echo "🔨 Compilando extensão..."
node scripts/build-extension.js

if [ $? -ne 0 ]; then
    echo "❌ Erro durante o build"
    exit 1
fi

echo ""
echo "🎉 Instalação concluída com sucesso!"
echo ""
echo "📋 Como carregar a extensão no Chrome:"
echo "   1. Abra Chrome"
echo "   2. Digite: chrome://extensions/"
echo "   3. Ative 'Modo do desenvolvedor' (canto superior direito)"
echo "   4. Clique em 'Carregar sem compactação'"
echo "   5. Selecione a pasta 'dist' deste projeto"
echo "   6. Vá para linkedin.com/feed/ e teste!"
echo ""
echo "🔧 Scripts disponíveis:"
echo "   npm run build:extension  - Recompilar extensão"
echo "   npm run pack:extension   - Criar arquivo zip"
echo ""