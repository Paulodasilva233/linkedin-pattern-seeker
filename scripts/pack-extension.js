#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 LinkedIn Pattern Seeker - Empacotador da Extensão\n');

// Verificar se dist existe
if (!fs.existsSync('dist')) {
  console.log('❌ Pasta dist não encontrada. Execute primeiro: npm run build:extension');
  process.exit(1);
}

// Verificar se o Chrome está disponível para criar o pacote
try {
  console.log('🔍 Verificando se Chrome está disponível...');
  
  // Criar arquivo zip da extensão
  const archiver = require('archiver');
  
  if (!archiver) {
    console.log('📦 Instalando archiver para criar zip...');
    execSync('npm install archiver --save-dev', { stdio: 'inherit' });
  }
  
  console.log('📦 Criando arquivo zip da extensão...');
  
  const output = fs.createWriteStream('linkedin-pattern-seeker-extension.zip');
  const archive = require('archiver')('zip', {
    zlib: { level: 9 } // Melhor compressão
  });
  
  output.on('close', () => {
    console.log(`✅ Extensão empacotada: linkedin-pattern-seeker-extension.zip`);
    console.log(`📊 Tamanho: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    console.log('\n📋 Como instalar:');
    console.log('   1. Descompacte o arquivo zip');
    console.log('   2. Abra Chrome em: chrome://extensions/');
    console.log('   3. Ative "Modo do desenvolvedor"');
    console.log('   4. Clique em "Carregar sem compactação"');
    console.log('   5. Selecione a pasta descompactada');
  });
  
  archive.on('error', (err) => {
    console.error('❌ Erro ao criar zip:', err);
    process.exit(1);
  });
  
  archive.pipe(output);
  archive.directory('dist/', false);
  archive.finalize();
  
} catch (error) {
  console.log('⚠️  Não foi possível criar o zip automaticamente.');
  console.log('📋 Instruções manuais:');
  console.log('   1. Compacte manualmente a pasta "dist"');
  console.log('   2. Ou use a pasta "dist" diretamente no Chrome');
  console.log('   3. Chrome → chrome://extensions/ → Carregar sem compactação');
}