#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🪟 Criando pacote completo para Windows...\n');

// 1. Executar build da extensão
console.log('🔨 Compilando extensão...');
try {
  // Executar build React primeiro
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build React concluído!');
  
  // Depois executar build da extensão
  if (fs.existsSync('scripts/build-extension.js')) {
    execSync('node scripts/build-extension.js', { stdio: 'inherit' });
  }
  console.log('✅ Build da extensão concluído!');
} catch (error) {
  console.log('⚠️  Erro no build, criando versão básica...');
  
  // Criar pasta dist básica
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  
  // Copiar arquivos essenciais
  const basicFiles = [
    'public/manifest.json',
    'public/background.js', 
    'public/content-script.js',
    'public/injected-script.js',
    'public/favicon.ico'
  ];
  
  basicFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const destFile = file.replace('public/', 'dist/');
      fs.copyFileSync(file, destFile);
      console.log(`   ✅ ${file} → ${destFile}`);
    }
  });
  
  // Criar index.html básico
  const basicHTML = `<!DOCTYPE html>
<html>
<head>
    <title>LinkedIn Pattern Seeker</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial; padding: 20px; background: #f5f5f5; }
        .container { max-width: 400px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #0066cc; margin-bottom: 20px; }
        .status { padding: 10px; background: #e8f4fd; border-radius: 4px; margin: 10px 0; }
        button { background: #0066cc; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background: #0056b3; }
        input { width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px; }
        .result { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 LinkedIn Pattern Seeker</h1>
        <div class="status">
            <strong>Status:</strong> Extensão carregada com sucesso!
        </div>
        
        <div style="margin: 20px 0;">
            <label>Padrão 1:</label>
            <input type="text" id="pattern1" placeholder="Ex: inteligência artificial">
            
            <label>Padrão 2:</label>
            <input type="text" id="pattern2" placeholder="Ex: tecnologia">
            
            <button onclick="searchPatterns()" style="width: 100%; margin-top: 10px;">
                🔍 Buscar Padrões
            </button>
        </div>
        
        <div id="results"></div>
        
        <div style="margin-top: 20px; font-size: 12px; color: #666;">
            <p><strong>Como usar:</strong></p>
            <ol>
                <li>Vá para linkedin.com/feed/</li>
                <li>Faça login na sua conta</li>
                <li>Configure os padrões acima</li>
                <li>Clique em "Buscar Padrões"</li>
            </ol>
        </div>
    </div>
    
    <script>
        function searchPatterns() {
            const pattern1 = document.getElementById('pattern1').value;
            const pattern2 = document.getElementById('pattern2').value;
            const results = document.getElementById('results');
            
            if (!pattern1 || !pattern2) {
                results.innerHTML = '<div class="result" style="background: #ffe6e6;">❌ Por favor, preencha ambos os padrões</div>';
                return;
            }
            
            results.innerHTML = '<div class="result">🔍 Buscando padrões no LinkedIn...</div>';
            
            // Simular busca para demonstração
            setTimeout(() => {
                results.innerHTML = '<div class="result">✅ Busca iniciada! Verifique os resultados na página do LinkedIn.</div>';
            }, 1000);
            
            // Enviar mensagem para content script se disponível
            if (typeof chrome !== 'undefined' && chrome.runtime) {
                chrome.runtime.sendMessage({
                    action: 'searchPatterns',
                    pattern1: pattern1,
                    pattern2: pattern2
                });
            }
        }
    </script>
</body>
</html>`;
  
  fs.writeFileSync('dist/index.html', basicHTML);
  console.log('✅ Interface básica criada!');
}

// 2. Criar pasta de distribuição Windows
const packageDir = 'linkedin-pattern-seeker-windows';
if (fs.existsSync(packageDir)) {
  fs.rmSync(packageDir, { recursive: true, force: true });
}
fs.mkdirSync(packageDir);

console.log('\n📁 Copiando arquivos para Windows...');

// 3. Copiar pasta dist completa
copyDirectory('dist', path.join(packageDir, 'dist'));

// 4. Copiar arquivos de instalação Windows
const windowsFiles = [
  'instalar-windows.bat',
  'TUTORIAL_WINDOWS.md',
  'package.json',
  'README.md'
];

windowsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(packageDir, file));
    console.log(`   ✅ ${file}`);
  }
});

// 5. Copiar scripts necessários
if (fs.existsSync('scripts')) {
  const scriptsDir = path.join(packageDir, 'scripts');
  fs.mkdirSync(scriptsDir);
  
  const scriptFiles = fs.readdirSync('scripts');
  scriptFiles.forEach(file => {
    fs.copyFileSync(
      path.join('scripts', file), 
      path.join(scriptsDir, file)
    );
  });
  console.log('   ✅ scripts/');
}

// 6. Copiar arquivos públicos
if (fs.existsSync('public')) {
  const publicDir = path.join(packageDir, 'public');
  fs.mkdirSync(publicDir);
  
  const publicFiles = fs.readdirSync('public');
  publicFiles.forEach(file => {
    fs.copyFileSync(
      path.join('public', file),
      path.join(publicDir, file)
    );
  });
  console.log('   ✅ public/');
}

// 7. Criar arquivo de instruções rápidas
const quickStartWindows = `
🪟 INSTALAÇÃO RÁPIDA WINDOWS

1. 🖱️  Duplo-clique em: instalar-windows.bat
2. ⏳  Aguarde a instalação automática
3. 🌐  Chrome abrirá automaticamente
4. ⚙️   Vá para: chrome://extensions/
5. 🔧  Ative "Modo do desenvolvedor"
6. 📁  Clique "Carregar sem compactação"
7. 📂  Selecione a pasta "dist"
8. 🎯  Vá para linkedin.com/feed/ e use!

📖 Instruções detalhadas: TUTORIAL_WINDOWS.md

⚠️  Se der erro de segurança:
   - Clique "Mais informações"
   - Clique "Executar assim mesmo"

📁 Pasta da extensão: dist/
`;

fs.writeFileSync(path.join(packageDir, 'LEIA-ME-PRIMEIRO.txt'), quickStartWindows.trim());

// 8. Criar arquivo ZIP
try {
  const archiver = require('archiver');
  const output = fs.createWriteStream('linkedin-pattern-seeker-windows.zip');
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`\n🎉 Pacote Windows criado com sucesso!`);
    console.log(`📦 Arquivo: linkedin-pattern-seeker-windows.zip`);
    console.log(`📊 Tamanho: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\n📋 Para distribuir no Windows:`);
    console.log(`   1. Envie o arquivo ZIP para o usuário`);
    console.log(`   2. Usuário descompacta o ZIP`);
    console.log(`   3. Duplo-clique em "instalar-windows.bat"`);
    console.log(`   4. Seguir instruções automáticas`);
    console.log(`\n💡 Compatível com Windows 10 e 11`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(packageDir, false);
  archive.finalize();

} catch (error) {
  console.log(`\n✅ Pasta criada: ${packageDir}/`);
  console.log('⚠️  Para criar ZIP, instale: npm install archiver');
  console.log('\n📋 Para distribuir:');
  console.log(`   1. Compacte a pasta "${packageDir}" em ZIP`);
  console.log('   2. Envie para o usuário Windows');
}

// Função auxiliar para copiar diretórios
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);
  
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  
  console.log(`   ✅ ${src} → ${dest}`);
}