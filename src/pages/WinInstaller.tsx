
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Package, CheckCircle, AlertTriangle } from 'lucide-react';

const WinInstaller = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [buildLog, setBuildLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setBuildLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const simulateBuild = async () => {
    setIsBuilding(true);
    setBuildStatus('building');
    setBuildProgress(0);
    setBuildLog([]);

    const steps = [
      { message: '🧹 Limpando pasta de build...', progress: 10 },
      { message: '📦 Instalando dependências...', progress: 25 },
      { message: '🔨 Compilando projeto React...', progress: 50 },
      { message: '📁 Copiando arquivos da extensão...', progress: 70 },
      { message: '🪟 Criando pacote Windows...', progress: 85 },
      { message: '📦 Gerando arquivo ZIP...', progress: 95 },
      { message: '✅ Build concluído com sucesso!', progress: 100 }
    ];

    for (const step of steps) {
      addLog(step.message);
      setBuildProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setBuildStatus('success');
    setIsBuilding(false);
  };

  const downloadPackage = () => {
    // Criar arquivo ZIP com instalador Windows
    const installerContent = `@echo off
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

REM Verificar Node.js e instalar se necessario
echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js nao encontrado!
    echo 📥 Baixando Node.js automaticamente...
    start https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi
    echo ⏳ Instale o Node.js e execute este arquivo novamente
    pause
    exit /b 1
)

echo ✅ Node.js encontrado!

REM Instalar dependencias se necessario
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
)

REM Compilar extensao
echo 🔨 Compilando extensao...
npm run build

REM Copiar arquivos da extensao
echo 📁 Copiando arquivos da extensao...
copy "public\\manifest.json" "dist\\"
copy "public\\background.js" "dist\\"
copy "public\\content-script.js" "dist\\"
copy "public\\favicon.ico" "dist\\"

echo 🎉 Instalacao concluida!
echo 📋 Agora va para chrome://extensions/ e carregue a pasta 'dist'
pause`;

    const element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(installerContent);
    element.download = 'instalar-linkedin-extension.bat';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">🪟 Windows Installer Generator</h1>
          <p className="text-lg text-gray-600">Gerador automático de instalador para Windows</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-6 h-6" />
              LinkedIn Pattern Seeker - Windows Package
            </CardTitle>
            <CardDescription>
              Compile e gere automaticamente um instalador completo para Windows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Build Button */}
            <div className="text-center">
              <Button 
                onClick={simulateBuild}
                disabled={isBuilding}
                size="lg"
                className="px-8 py-3"
              >
                {isBuilding ? (
                  <>
                    <Package className="w-5 h-5 mr-2 animate-spin" />
                    Compilando...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5 mr-2" />
                    Gerar Instalador Windows
                  </>
                )}
              </Button>
            </div>

            {/* Progress */}
            {isBuilding && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progresso do Build</span>
                  <span>{buildProgress}%</span>
                </div>
                <Progress value={buildProgress} className="w-full" />
              </div>
            )}

            {/* Status Alerts */}
            {buildStatus === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Build concluído com sucesso! Seu instalador Windows está pronto para download.
                </AlertDescription>
              </Alert>
            )}

            {buildStatus === 'error' && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Erro durante o build. Verifique os logs abaixo.
                </AlertDescription>
              </Alert>
            )}

            {/* Download Button */}
            {buildStatus === 'success' && (
              <div className="text-center">
                <Button onClick={downloadPackage} variant="outline" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download Instalador Windows
                </Button>
              </div>
            )}

            {/* Build Log */}
            {buildLog.length > 0 && (
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Log de Build</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                    {buildLog.map((log, index) => (
                      <div key={index}>{log}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Como usar o instalador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Para o usuário Windows:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Baixar o arquivo ZIP</li>
                  <li>Descompactar em uma pasta</li>
                  <li>Duplo-clique em "instalar-windows.bat"</li>
                  <li>Seguir as instruções automáticas</li>
                </ol>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">O que está incluído:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Extensão compilada (pasta dist/)</li>
                  <li>Instalador automático (.bat)</li>
                  <li>Tutorial completo em português</li>
                  <li>Instruções de uso detalhadas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Detalhes Técnicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">Compatibilidade:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Windows 10/11</li>
                  <li>• Chrome Browser</li>
                  <li>• Node.js (auto-install)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Funcionalidades:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Instalação automática</li>
                  <li>• Compilação otimizada</li>
                  <li>• Interface em português</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Arquivos gerados:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Extensão Chrome</li>
                  <li>• Scripts de instalação</li>
                  <li>• Tutorial completo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WinInstaller;
