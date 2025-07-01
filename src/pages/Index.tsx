import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Search, User, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [patterns, setPatterns] = useState({ pattern1: "", pattern2: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

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

    setIsSearching(true);
    
    // Simulação de busca - em implementação real, faria requisições para API/proxy
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          author: "João Silva",
          content: `Exemplo de post contendo ${patterns.pattern1}. Este é um resultado simulado para demonstração.`,
          timestamp: "2024-07-01T10:00:00Z",
          matchedPattern: "pattern1",
          engagement: { likes: 45, comments: 12, shares: 8 }
        },
        {
          id: 2,
          author: "Maria Santos",
          content: `Post interessante sobre ${patterns.pattern2} e suas implicações no mercado atual.`,
          timestamp: "2024-06-30T15:30:00Z",
          matchedPattern: "pattern2",
          engagement: { likes: 78, comments: 23, shares: 15 }
        },
        {
          id: 3,
          author: "Pedro Costa",
          content: `Análise detalhada sobre ${patterns.pattern1} versus ${patterns.pattern2} no contexto empresarial.`,
          timestamp: "2024-06-29T09:15:00Z",
          matchedPattern: "both",
          engagement: { likes: 156, comments: 67, shares: 34 }
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
      
      toast({
        title: "Busca concluída",
        description: `Encontrados ${mockResults.length} posts na última semana`,
      });
    }, 2000);
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

        {/* Alerta sobre limitações */}
        <Alert>
          <AlertDescription>
            <strong>Importante:</strong> Esta é uma demonstração da interface. Para funcionamento completo, 
            seria necessário implementar proxy/backend para contornar limitações de CORS e usar a API oficial do LinkedIn.
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