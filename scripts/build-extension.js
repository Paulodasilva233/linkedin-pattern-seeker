#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 LinkedIn Pattern Seeker - Build Automático da Extensão\n');

// Função para executar comandos
function execCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} concluído!\n`);
  } catch (error) {
    console.error(`❌ Erro durante: ${description}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Função para copiar arquivos
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

// 1. Limpar pasta dist se existir
if (fs.existsSync('dist')) {
  console.log('🧹 Limpando pasta dist...');
  fs.rmSync('dist', { recursive: true, force: true });
  console.log('✅ Pasta dist limpa!\n');
}

// 2. Instalar dependências se node_modules não existir
if (!fs.existsSync('node_modules')) {
  execCommand('npm install', 'Instalando dependências');
}

// 3. Build do projeto
execCommand('npm run build', 'Compilando projeto React');

// 4. Copiar arquivos específicos da extensão para dist
console.log('📁 Copiando arquivos da extensão...');

// Copiar arquivos do public para dist
const extensionFiles = [
  'public/manifest.json',
  'public/background.js',
  'public/content-script.js',
  'public/favicon.ico'
];

extensionFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const destFile = file.replace('public/', 'dist/');
    copyFile(file, destFile);
    console.log(`   ✅ ${file} → ${destFile}`);
  }
});

// 5. Verificar se todos os arquivos necessários estão na pasta dist
console.log('\n🔍 Verificando arquivos da extensão...');
const requiredFiles = [
  'dist/index.html',
  'dist/manifest.json',
  'dist/background.js',
  'dist/content-script.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - FALTANDO`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n🎉 Build da extensão concluído com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('   1. Abra Chrome em: chrome://extensions/');
  console.log('   2. Ative "Modo do desenvolvedor"');
  console.log('   3. Clique em "Carregar sem compactação"');
  console.log('   4. Selecione a pasta "dist" deste projeto');
  console.log('   5. Vá para linkedin.com/feed/ e teste a extensão!');
} else {
  console.log('\n❌ Build incompleto - alguns arquivos estão faltando');
  process.exit(1);
}