
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BarChart2, Calendar, Users, Eye, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const weeklyData = [
  { name: 'Dom', visitas: 120, contatos: 15, favoritos: 25 },
  { name: 'Seg', visitas: 180, contatos: 23, favoritos: 30 },
  { name: 'Ter', visitas: 150, contatos: 18, favoritos: 22 },
  { name: 'Qua', visitas: 170, contatos: 20, favoritos: 27 },
  { name: 'Qui', visitas: 190, contatos: 25, favoritos: 35 },
  { name: 'Sex', visitas: 220, contatos: 30, favoritos: 40 },
  { name: 'Sáb', visitas: 200, contatos: 28, favoritos: 38 },
];

const monthlyData = [
  { name: 'Jan', visitas: 750, contatos: 95, favoritos: 120 },
  { name: 'Fev', visitas: 820, contatos: 110, favoritos: 140 },
  { name: 'Mar', visitas: 930, contatos: 125, favoritos: 160 },
  { name: 'Abr', visitas: 890, contatos: 115, favoritos: 150 },
  { name: 'Mai', visitas: 950, contatos: 130, favoritos: 165 },
  { name: 'Jun', visitas: 980, contatos: 140, favoritos: 170 },
  { name: 'Jul', visitas: 1050, contatos: 150, favoritos: 190 },
  { name: 'Ago', visitas: 1100, contatos: 155, favoritos: 200 },
  { name: 'Set', visitas: 1200, contatos: 170, favoritos: 220 },
  { name: 'Out', visitas: 1250, contatos: 180, favoritos: 230 },
  { name: 'Nov', visitas: 1300, contatos: 185, favoritos: 240 },
  { name: 'Dez', visitas: 1400, contatos: 200, favoritos: 260 },
];

const propertyPerformanceData = [
  { id: '1', title: 'Apartamento em Pinheiros', visitas: 350, contatos: 42, conversao: 12 },
  { id: '2', title: 'Casa em Vila Madalena', visitas: 480, contatos: 65, conversao: 13.5 },
  { id: '3', title: 'Studio na Consolação', visitas: 260, contatos: 30, conversao: 11.5 },
  { id: '4', title: 'Apartamento em Moema', visitas: 310, contatos: 38, conversao: 12.3 },
  { id: '5', title: 'Casa em Perdizes', visitas: 290, contatos: 35, conversao: 12.1 },
];

const MetricsManager = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');

  // Selecionar dados com base no intervalo de tempo
  const chartData = timeRange === 'month' || timeRange === 'year' ? monthlyData : weeklyData;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Análise de Performance</h1>
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <Tabs defaultValue="overview" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="properties">Imóveis</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button 
            variant={timeRange === 'day' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('day')}
          >
            Dia
          </Button>
          <Button 
            variant={timeRange === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('week')}
          >
            Semana
          </Button>
          <Button 
            variant={timeRange === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            Mês
          </Button>
          <Button 
            variant={timeRange === 'year' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('year')}
          >
            Ano
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Card de Visualizações */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Visualizações Totais</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,361</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUp className="mr-1 h-3 w-3" />
              <span>24% no último mês</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Card de Contatos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Contatos Recebidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUp className="mr-1 h-3 w-3" />
              <span>18% no último mês</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Card de Taxa de Conversão */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8%</div>
            <div className="flex items-center text-xs text-red-500">
              <ArrowDown className="mr-1 h-3 w-3" />
              <span>0.5% no último mês</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Card de Tempo Médio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tempo Médio no Site</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3m 45s</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUp className="mr-1 h-3 w-3" />
              <span>10% no último mês</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico principal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visitas e Interações</CardTitle>
            <CardDescription>
              Análise de visitas, contatos e favoritos {
                timeRange === 'day' ? 'no dia' :
                timeRange === 'week' ? 'na semana' :
                timeRange === 'month' ? 'no mês' : 'no ano'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visitas" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="contatos" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="favoritos" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance dos imóveis */}
        <Card>
          <CardHeader>
            <CardTitle>Performance dos Imóveis</CardTitle>
            <CardDescription>
              Os 5 imóveis mais visualizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={propertyPerformanceData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="title" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visitas" fill="#8884d8" name="Visualizações" />
                  <Bar dataKey="contatos" fill="#82ca9d" name="Contatos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Taxa de conversão */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão por Imóvel</CardTitle>
            <CardDescription>
              Porcentagem de visitas que resultaram em contatos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={propertyPerformanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="conversao" fill="#8884d8" name="Taxa de Conversão (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Disponíveis</CardTitle>
            <CardDescription>
              Baixe relatórios detalhados para análise mais aprofundada
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Relatório de Visitas</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                Análise detalhada de visualizações de páginas, tempo no site e fontes de tráfego.
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <ArrowDown className="h-4 w-4" />
                  Baixar PDF
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Relatório de Contatos</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                Informações sobre mensagens recebidas, taxa de resposta e tempo médio de resposta.
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <ArrowDown className="h-4 w-4" />
                  Baixar PDF
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Relatório de Performance</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                Análise completa de todos os imóveis, conversões e principais métricas.
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <ArrowDown className="h-4 w-4" />
                  Baixar PDF
                </Button>
              </CardFooter>
            </Card>
          </CardContent>
          <CardFooter>
            <Button className="w-full flex items-center justify-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Acessar Todos os Relatórios
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MetricsManager;
