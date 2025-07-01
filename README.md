# LinkedIn Pattern Seeker - Extensão Chrome

Uma aplicação React que funciona como extensão do Chrome para análise de padrões em posts do LinkedIn com webscraping direto da página.

## 🚀 Funcionalidades

- **Webscraping em tempo real** do LinkedIn sem usar API oficial
- **Análise de padrões** em posts dos últimos 7 dias
- **Interface React moderna** com Tailwind CSS e Shadcn UI
- **Execução local** no navegador através de extensão
- **Detecção automática** de login do LinkedIn
- **Extração de métricas** de engajamento (curtidas, comentários, compartilhamentos)

## 📋 Pré-requisitos

- Node.js 18+ 
- Google Chrome
- Conta ativa no LinkedIn

## 🛠️ Instalação e Uso

### 1. Desenvolvimento Local

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>
cd linkedin-pattern-seeker

# Instale dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

### 2. Instalação Automática da Extensão

**Opção A - Instalador Automático (Recomendado):**

```bash
# Linux/Mac
chmod +x install.sh
./install.sh

# Windows
install.bat
```

**Opção B - Manual:**

```bash
# Instale dependências e compile a extensão
npm run install:extension

# Ou separadamente:
npm install
npm run build:extension

# Para criar arquivo zip (opcional)
npm run pack:extension
```

### 3. Instalar Extensão no Chrome

1. Abra Chrome e navegue para `chrome://extensions/`
2. Ative o "Modo do desenvolvedor" no canto superior direito
3. Clique em "Carregar sem compactação"
4. Selecione a pasta `dist` gerada pelo build
5. A extensão "LinkedIn Pattern Seeker" aparecerá na lista

### 4. Usar a Extensão

1. **Acesse o LinkedIn**: Vá para `https://www.linkedin.com/feed/`
2. **Faça login**: Certifique-se de estar logado na sua conta
3. **Abra a extensão**: Clique no ícone da extensão na barra de ferramentas
4. **Configure padrões**: Defina os dois padrões que deseja buscar
5. **Execute análise**: Clique em "Buscar Padrões" para extrair posts

## 🔧 Arquitetura Técnica

### Estrutura da Extensão

```
├── public/
│   ├── manifest.json          # Configuração da extensão Chrome
│   ├── content-script.js      # Script que executa nas páginas LinkedIn
│   └── background.js          # Service Worker da extensão
├── src/
│   ├── pages/Index.tsx        # Interface principal React
│   ├── types/chrome.d.ts      # Declarações TypeScript para Chrome API
│   └── components/            # Componentes UI Shadcn
```

### Como Funciona

1. **Content Script** (`content-script.js`):
   - Executa diretamente nas páginas do LinkedIn
   - Extrai posts usando seletores DOM
   - Filtra por janela temporal de 7 dias
   - Busca padrões no conteúdo dos posts

2. **Background Script** (`background.js`):
   - Gerencia comunicação entre popup e content script
   - Controla permissões e estado da extensão

3. **Interface React** (`Index.tsx`):
   - Popup da extensão com interface moderna
   - Configuração de padrões de busca
   - Exibição de resultados com métricas

### Funcionalidades de Webscraping

- **Extração de Posts**: Busca elementos DOM com `[data-urn*="urn:li:activity"]`
- **Filtro Temporal**: Analisa apenas posts dos últimos 7 dias
- **Detecção de Padrões**: Busca texto usando métodos de string JavaScript
- **Métricas de Engajamento**: Extrai curtidas, comentários e compartilhamentos

## ⚠️ Considerações Importantes

### Limitações Técnicas
- **Dependente da estrutura DOM**: Pode quebrar se LinkedIn alterar a estrutura
- **Rate Limiting**: LinkedIn pode detectar automação excessiva
- **Scroll Infinito**: Pode ser necessário rolar para carregar mais posts

### Conformidade e Ética
- **Termos de Serviço**: Verifique compliance com ToS do LinkedIn
- **Uso Responsável**: Evite sobrecarga dos servidores LinkedIn
- **Dados Pessoais**: Respeite privacidade dos usuários

### Melhorias Futuras
- Cache local de posts para análise offline
- Exportação de dados para CSV/JSON
- Análise avançada com processamento de linguagem natural
- Dashboard com visualizações e gráficos

## 🐛 Troubleshooting

### Extensão não carrega
- Verifique se o build foi executado corretamente
- Confirme que todos os arquivos estão na pasta `dist`
- Recarregue a extensão em `chrome://extensions/`

### Não detecta posts
- Certifique-se de estar na página do feed LinkedIn
- Aguarde carregar completamente antes de executar
- Tente rolar a página para carregar mais posts

### Erro de permissões
- Verifique se a extensão tem permissão para acessar LinkedIn
- Recarregue a página do LinkedIn após instalar extensão

## 📄 Tecnologias Utilizadas

- **React 18** - Interface de usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn UI** - Componentes de interface
- **Chrome Extension API** - Integração com navegador
- **Vite** - Build tool

## 📄 Licença

Este projeto é fornecido como exemplo educacional. Use responsavelmente e em conformidade com os termos de serviço do LinkedIn.

---

## Project info (Lovable)

**URL**: https://lovable.dev/projects/88d0676f-4433-4914-8324-e4a432192bd1

### Deploy
Simply open [Lovable](https://lovable.dev/projects/88d0676f-4433-4914-8324-e4a432192bd1) and click on Share -> Publish.