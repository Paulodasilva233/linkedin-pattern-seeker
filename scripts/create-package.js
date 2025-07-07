#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Criando pacote completo para distribuição...\n');

// 1. Verificar se dist existe e executar build se necessário
if (!fs.existsSync('dist')) {
  console.log('🔨 Executando build da extensão...');
  try {
    execSync('node scripts/build-extension.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Erro no build:', error.message);
    process.exit(1);
  }
}

// 2. Criar pasta de distribuição
const packageDir = 'linkedin-pattern-seeker-package';
if (fs.existsSync(packageDir)) {
  fs.rmSync(packageDir, { recursive: true, force: true });
}
fs.mkdirSync(packageDir);

console.log('📁 Copiando arquivos...');

// 3. Copiar pasta dist completa
const distSource = 'dist';
const distDest = path.join(packageDir, 'dist');
copyDirectory(distSource, distDest);

// 4. Copiar arquivos de documentação
const filesToCopy = [
  'TUTORIAL_INSTALACAO.md',
  'README.md'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(packageDir, file));
    console.log(`   ✅ ${file}`);
  }
});

// 5. Criar arquivo de instruções rápidas
const quickStart = `
# INSTALAÇÃO RÁPIDA

1. Abra Chrome e digite: chrome://extensions/
2. Ative "Modo do desenvolvedor"
3. Clique "Carregar sem compactação"
4. Selecione a pasta "dist" deste pacote
5. Vá para linkedin.com/feed/ e use!

Leia TUTORIAL_INSTALACAO.md para instruções detalhadas.
`;

fs.writeFileSync(path.join(packageDir, 'LEIA-ME-PRIMEIRO.txt'), quickStart.trim());

// 6. Criar arquivo ZIP se archiver estiver disponível
try {
  const archiver = require('archiver');
  const output = fs.createWriteStream('linkedin-pattern-seeker-completo.zip');
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`\n🎉 Pacote criado com sucesso!`);
    console.log(`📦 Arquivo: linkedin-pattern-seeker-completo.zip`);
    console.log(`📊 Tamanho: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\n📋 Para distribuir:`);
    console.log(`   1. Envie o arquivo ZIP para o usuário`);
    console.log(`   2. Peça para descompactar`);
    console.log(`   3. Seguir instruções do TUTORIAL_INSTALACAO.md`);
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
  console.log(`   1. Compacte a pasta "${packageDir}" manualmente`);
  console.log('   2. Envie o arquivo ZIP para o usuário');
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