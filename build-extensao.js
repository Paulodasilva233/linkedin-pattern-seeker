#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Compilando LinkedIn Pattern Seeker Extension...\n');

try {
  // 1. Limpar pasta dist
  if (fs.existsSync('dist')) {
    console.log('🧹 Limpando pasta dist...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // 2. Build do projeto
  console.log('📦 Compilando projeto...');
  execSync('npm run build', { stdio: 'inherit' });

  // 3. Copiar arquivos da extensão
  console.log('📁 Copiando arquivos da extensão...');
  
  const extensionFiles = [
    { src: 'public/manifest.json', dest: 'dist/manifest.json' },
    { src: 'public/background.js', dest: 'dist/background.js' },
    { src: 'public/content-script.js', dest: 'dist/content-script.js' },
    { src: 'public/favicon.ico', dest: 'dist/favicon.ico' }
  ];

  extensionFiles.forEach(file => {
    if (fs.existsSync(file.src)) {
      fs.copyFileSync(file.src, file.dest);
      console.log(`   ✅ ${file.src} → ${file.dest}`);
    } else {
      console.log(`   ⚠️  ${file.src} não encontrado`);
    }
  });

  console.log('\n🎉 Extensão compilada com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('   1. Abra Chrome: chrome://extensions/');
  console.log('   2. Ative "Modo do desenvolvedor"');
  console.log('   3. Clique "Recarregar" na extensão LinkedIn Pattern Seeker');
  console.log('   4. Ou clique "Carregar sem compactação" e selecione a pasta "dist"');
  console.log('   5. Vá para linkedin.com/feed/ e teste!');

} catch (error) {
  console.error('❌ Erro durante a compilação:', error.message);
  process.exit(1);
}