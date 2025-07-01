import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Search, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ChromeResponse } from "@/types/chrome";

const Index = () => {
  const [isExtension, setIsExtension] = useState(false);
  const [isLinkedInTab, setIsLinkedInTab] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [patterns, setPatterns] = useState({ pattern1: "", pattern2: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentTab, setCurrentTab] = useState(null);
  const { toast } = useToast();

  // Verifica se está executando como extensão do Chrome
  useEffect(() => {
    const checkExtensionEnvironment = async () => {
      try {
        const chromeGlobal = (window as any).chrome;
        if (typeof chromeGlobal !== 'undefined' && chromeGlobal.runtime && chromeGlobal.runtime.id) {
          setIsExtension(true);
          await checkLinkedInStatus();
        }
      } catch (error) {
        console.log('Não está executando como extensão:', error);
        setIsExtension(false);
      }
    };

    checkExtensionEnvironment();
  }, []);

  // Verifica status do LinkedIn
  const checkLinkedInStatus = async () => {
    if (!isExtension) return;

    try {
      const chromeGlobal = (window as any).chrome;
      const response = await new Promise<ChromeResponse>((resolve) => {
        chromeGlobal.runtime.sendMessage({ action: 'checkStatus' }, resolve);
      });

      if (response.success) {
        setIsLinkedInTab(response.isLinkedIn || false);
        setIsLoggedIn(response.isLoggedIn || false);
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível verificar o status do LinkedIn",
        variant: "destructive"
      });
    }
  };

  const handleLogin = async () => {
    // Simulação de login - em implementação real, usaria OAuth do LinkedIn
    toast({
      title: "Simulação de Login",
      description: "Em ambiente real, redirecionaria para OAuth do LinkedIn",
    });
    setIsLoggedIn(true);
  };

  const handleSearch = async () => {
    if (!patterns.pattern1 || !patterns.pattern2) {
      toast({
        title: "Erro",
        description: "Por favor, defina ambos os padrões de busca",
        variant: "destructive"
      });
      return;
    }

    if (!isExtension) {
      toast({
        title: "Modo demonstração",
        description: "Para funcionalidade completa, use como extensão do Chrome",
        variant: "destructive"
      });
      return;
    }

    if (!isLinkedInTab) {
      toast({
        title: "Acesse o LinkedIn",
        description: "Abra o LinkedIn em uma aba para realizar a busca",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const chromeGlobal = (window as any).chrome;
      const response = await new Promise<ChromeResponse>((resolve) => {
        chromeGlobal.runtime.sendMessage({ 
          action: 'searchPatterns',
          pattern1: patterns.pattern1,
          pattern2: patterns.pattern2
        }, resolve);
      });

      if (response.success && response.results) {
        setSearchResults(response.results);
        toast({
          title: "Busca concluída",
          description: `Encontrados ${response.results.length} posts de ${response.totalAnalyzed} analisados`,
        });
      } else {
        throw new Error(response.error || "Erro na busca");
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível extrair posts do LinkedIn",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">LinkedIn Pattern Seeker</h1>
          <p className="text-xl text-muted-foreground">
            Análise de padrões em posts do LinkedIn com janela temporal de 7 dias
          </p>
        </div>

        {/* Status da Extensão */}
        <Alert>
          <AlertDescription>
            {isExtension ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Extensão Ativa</Badge>
                  <span>Executando como extensão do Chrome</span>
                </div>
                {isLinkedInTab ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">LinkedIn Detectado</Badge>
                    <span className="text-sm">
                      {isLoggedIn ? 'Usuário logado detectado' : 'Faça login no LinkedIn para usar'}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Acesse linkedin.com em uma aba para fazer a análise
                  </div>
                )}
              </div>
            ) : (
              <div>
                <strong>Modo Demonstração:</strong> Para funcionalidade completa, instale como extensão do Chrome.
                <br />
                <span className="text-sm">1. Execute `npm run build` 2. Carregue a pasta `dist` no Chrome em chrome://extensions/</span>
              </div>
            )}
          </AlertDescription>
        </Alert>

        {/* Login Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Autenticação LinkedIn
            </CardTitle>
            <CardDescription>
              Conecte-se ao LinkedIn para acessar posts do seu feed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoggedIn ? (
              <Button onClick={handleLogin} className="w-full">
                Login com LinkedIn
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Conectado</Badge>
                <span className="text-sm text-muted-foreground">
                  Usuário simulado logado
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pattern Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuração de Padrões</CardTitle>
            <CardDescription>
              Defina os dois padrões que deseja buscar nos posts da última semana
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pattern1">Padrão 1</Label>
                <Input
                  id="pattern1"
                  placeholder="Ex: inteligência artificial"
                  value={patterns.pattern1}
                  onChange={(e) => setPatterns(prev => ({ ...prev, pattern1: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pattern2">Padrão 2</Label>
                <Input
                  id="pattern2"
                  placeholder="Ex: tecnologia"
                  value={patterns.pattern2}
                  onChange={(e) => setPatterns(prev => ({ ...prev, pattern2: e.target.value }))}
                />
              </div>
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={!isLoggedIn || isSearching}
              className="w-full"
            >
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Buscando..." : "Buscar Padrões"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados da Análise</CardTitle>
              <CardDescription>
                Posts encontrados nos últimos 7 dias contendo os padrões especificados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {searchResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{result.author}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(result.timestamp).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge 
                      variant={result.matchedPattern === 'both' ? 'default' : 'secondary'}
                    >
                      {result.matchedPattern === 'both' ? 'Ambos padrões' : 
                       result.matchedPattern === 'pattern1' ? 'Padrão 1' : 'Padrão 2'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm">{result.content}</p>
                  
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{result.engagement.likes} curtidas</span>
                    <span>{result.engagement.comments} comentários</span>
                    <span>{result.engagement.shares} compartilhamentos</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Technical Implementation Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notas de Implementação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm"><strong>Para implementação real seria necessário:</strong></p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Servidor proxy para contornar limitações de CORS</li>
              <li>• Integração com LinkedIn API oficial ou scraping autorizado</li>
              <li>• Sistema de autenticação OAuth do LinkedIn</li>
              <li>• Processamento de texto para detecção de padrões</li>
              <li>• Armazenamento de dados para análise temporal</li>
              <li>• Compliance com termos de serviço do LinkedIn</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;