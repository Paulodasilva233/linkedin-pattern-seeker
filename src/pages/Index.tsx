import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, Calendar, Users, BarChart3, Download, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [pattern1, setPattern1] = useState('');
  const [pattern2, setPattern2] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!pattern1 || !pattern2) {
      alert('Por favor, preencha ambos os padrões');
      return;
    }

    setIsSearching(true);
    
    // Simular busca
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          author: 'João Silva',
          content: `Acabei de ler sobre ${pattern1} e como está revolucionando o ${pattern2}. Impressionante!`,
          likes: 45,
          comments: 12,
          date: '2024-01-15',
          engagement: 85
        },
        {
          id: 2,
          author: 'Maria Santos',
          content: `Minha experiência com ${pattern1} no setor de ${pattern2} tem sido transformadora.`,
          likes: 78,
          comments: 23,
          date: '2024-01-14',
          engagement: 92
        },
        {
          id: 3,
          author: 'Pedro Costa',
          content: `Tendências de ${pattern1} para ${pattern2} em 2024: o que esperar?`,
          likes: 124,
          comments: 45,
          date: '2024-01-13',
          engagement: 78
        }
      ];
      
      setResults(mockResults);
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">LinkedIn Pattern Seeker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/win">
                <Button variant="outline" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Instalador Windows
                </Button>
              </Link>
              <Badge variant="secondary">v1.0.0</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">
              Analise Padrões no LinkedIn
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra tendências e padrões em posts do LinkedIn com análise temporal de 7 dias. 
              Identifique oportunidades de engajamento e insights valiosos.
            </p>
          </div>

          {/* Search Form */}
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Buscar Padrões
              </CardTitle>
              <CardDescription>
                Digite dois padrões para analisar correlações nos posts do LinkedIn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pattern1">Padrão 1</Label>
                  <Input
                    id="pattern1"
                    placeholder="Ex: inteligência artificial"
                    value={pattern1}
                    onChange={(e) => setPattern1(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pattern2">Padrão 2</Label>
                  <Input
                    id="pattern2"
                    placeholder="Ex: marketing digital"
                    value={pattern2}
                    onChange={(e) => setPattern2(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full"
                size="lg"
              >
                {isSearching ? (
                  <>
                    <Search className="w-4 h-4 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Padrões
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">Resultados Encontrados</h3>
                <p className="text-gray-600">Análise de padrões dos últimos 7 dias</p>
              </div>

              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="posts">Posts Relevantes</TabsTrigger>
                  <TabsTrigger value="metrics">Métricas</TabsTrigger>
                  <TabsTrigger value="trends">Tendências</TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="space-y-4">
                  {results.map((result) => (
                    <Card key={result.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{result.author}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {result.date}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">
                            {result.engagement}% engajamento
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{result.content}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              {result.likes} curtidas
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {result.comments} comentários
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="metrics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Métricas de Engajamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">3</div>
                          <div className="text-sm text-gray-600">Posts Encontrados</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">85%</div>
                          <div className="text-sm text-gray-600">Engajamento Médio</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">247</div>
                          <div className="text-sm text-gray-600">Total de Interações</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="trends">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tendências Identificadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Alert>
                          <TrendingUp className="w-4 h-4" />
                          <AlertDescription>
                            Aumento de 25% nas discussões sobre {pattern1} relacionadas a {pattern2} nos últimos 7 dias.
                          </AlertDescription>
                        </Alert>
                        <Alert>
                          <Users className="w-4 h-4" />
                          <AlertDescription>
                            Posts que combinam ambos os padrões têm 40% mais engajamento que a média.
                          </AlertDescription>
                        </Alert>
                        <Alert>
                          <Calendar className="w-4 h-4" />
                          <AlertDescription>
                            Pico de atividade observado entre terça e quinta-feira.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
