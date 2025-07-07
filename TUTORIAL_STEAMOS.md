# 🎮 TUTORIAL SteamOS/Steam Deck - LinkedIn Pattern Seeker

## Para usuários do Steam Deck e SteamOS

### 🎯 O que você precisa saber:
- SteamOS usa Linux (baseado em Arch)
- Precisa usar o **Modo Desktop**
- Pode precisar instalar o Chrome/Chromium

---

## 🖥️ PASSO 1: Entrar no Modo Desktop

1. **No Steam Deck:**
   - Pressione **Steam Button** → Power → **Switch to Desktop**
   - Ou segure **Power Button** → **Switch to Desktop**

2. **No SteamOS (PC):**
   - Saia do Big Picture Mode
   - Acesse o desktop normal do KDE

---

## 🌐 PASSO 2: Instalar Navegador (se necessário)

### Verificar se tem Chrome/Chromium:
```bash
# Abrir terminal (Konsole)
which google-chrome
which chromium
```

### Se não tiver, instalar:

**Opção A - Chrome (recomendado):**
```bash
# Instalar via Flatpak
flatpak install flathub com.google.Chrome
```

**Opção B - Chromium:**
```bash
# Via pacman (pode precisar desabilitar readonly)
sudo steamos-readonly disable
sudo pacman -S chromium
sudo steamos-readonly enable
```

**Opção C - Via Discover (mais fácil):**
1. Abrir **Discover** (loja de apps)
2. Buscar **"Chrome"** ou **"Chromium"**
3. Instalar

---

## 📥 PASSO 3: Baixar e Preparar Extensão

### 3.1 Baixar arquivos
```bash
# Criar pasta no Desktop
mkdir ~/Desktop/linkedin-extension
cd ~/Desktop/linkedin-extension

# Se tiver o projeto completo:
git clone <url-do-repositorio> .

# Ou descompactar ZIP baixado
```

### 3.2 Instalar Node.js (se necessário)
```bash
# Verificar se tem Node.js
node --version

# Se não tiver, instalar via Flatpak
flatpak install flathub org.nodejs.node
```

### 3.3 Compilar extensão
```bash
# Na pasta do projeto
npm install
npm run build:extension

# Ou usar o script automático
chmod +x install.sh
./install.sh
```

---

## 🔧 PASSO 4: Instalar no Chrome/Chromium

### 4.1 Abrir Chrome
```bash
# Chrome via Flatpak
flatpak run com.google.Chrome

# Ou Chromium
chromium
```

### 4.2 Carregar extensão
1. Digite: `chrome://extensions/` (ou `chromium://extensions/`)
2. Ative **"Modo do desenvolvedor"**
3. Clique **"Carregar extensão"** ou **"Load unpacked"**
4. Selecione a pasta **`dist`** do projeto
5. Extensão deve aparecer na lista

---

## 🎯 PASSO 5: Usar no LinkedIn

1. Abrir **LinkedIn.com/feed/**
2. Fazer **login** na conta
3. Clicar no **ícone da extensão**
4. Configurar **padrões de busca**
5. Executar **análise**

---

## ⚠️ PROBLEMAS ESPECÍFICOS DO STEAMOS

### 🔒 "Permissão negada"
```bash
# Tornar arquivos executáveis
chmod +x install.sh
chmod +x scripts/*.js

# Se precisar de sudo
sudo steamos-readonly disable
# fazer alterações
sudo steamos-readonly enable
```

### 📦 "Comando não encontrado"
```bash
# Verificar se Flatpak está funcionando
flatpak list

# Atualizar Flatpak
flatpak update

# Verificar PATH
echo $PATH
```

### 🌐 "Chrome não abre"
```bash
# Tentar diferentes comandos
google-chrome
chromium-browser
chromium
flatpak run com.google.Chrome

# Verificar instalação
which google-chrome
which chromium
```

### 💾 "Não consegue instalar Node.js"
**Alternativa:** Use o **AppImage** do Node.js
```bash
# Baixar Node.js AppImage
wget https://nodejs.org/dist/latest/node-v*-linux-x64.AppImage
chmod +x node-v*-linux-x64.AppImage
./node-v*-linux-x64.AppImage --version
```

---

## 🎮 DICAS PARA STEAM DECK

### Controles
- Use **touchpad** como mouse
- **L2/R2** para scroll
- **Steam+X** para teclado virtual

### Performance
- Use **modo desktop** para melhor experiência
- **Dock** o Steam Deck para usar teclado/mouse

### Persistência
- Salve arquivos em **~/Desktop** ou **~/Documents**
- Algumas mudanças podem ser perdidas em updates

---

## 🔄 SCRIPT AUTOMÁTICO PARA STEAMOS

Criei um script específico:

```bash
#!/bin/bash
# steamos-install.sh

echo "🎮 LinkedIn Pattern Seeker - Instalador SteamOS"
echo "================================================"

# Verificar se está no desktop mode
if [ "$XDG_CURRENT_DESKTOP" != "KDE" ]; then
    echo "⚠️  Mude para Modo Desktop primeiro!"
    exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "📦 Instalando Node.js via Flatpak..."
    flatpak install -y flathub org.nodejs.node
fi

# Verificar Chrome
if ! command -v google-chrome &> /dev/null; then
    echo "🌐 Instalando Chrome via Flatpak..."
    flatpak install -y flathub com.google.Chrome
fi

# Compilar extensão
echo "🔨 Compilando extensão..."
npm install
npm run build:extension

echo "✅ Pronto! Agora:"
echo "1. Abrir Chrome: flatpak run com.google.Chrome"
echo "2. Ir para: chrome://extensions/"
echo "3. Carregar pasta 'dist'"
```

---

## 📱 RESUMO STEAMOS

1. **Desktop Mode** → Entrar no modo desktop
2. **Chrome** → Instalar via Flatpak/Discover
3. **Terminal** → Compilar extensão
4. **Chrome** → Carregar pasta "dist"
5. **LinkedIn** → Usar normalmente

---

### 🆘 Se nada funcionar:
1. **Reiniciar** Steam Deck
2. **Atualizar** sistema
3. **Usar Discover** em vez de terminal
4. **Tentar Firefox** como alternativa (com adaptações)