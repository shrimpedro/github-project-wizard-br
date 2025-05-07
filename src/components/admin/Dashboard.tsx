
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { 
  BarChart2, Home, MessageSquare, Users, TrendingUp, 
  Calendar, Eye, Clock, ArrowRight, ExternalLink
} from 'lucide-react';
import { Property } from '../PropertyCard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface DashboardProps {
  properties?: Property[];
  messages?: any[];
  users?: any[];
}

const Dashboard = ({ properties = [], messages = [], users = [] }: DashboardProps) => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalMessages: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeProperties, setActiveProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const navigate = useNavigate();

  // Calculate stats based on available data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real scenario, this would be fetched from a analytics service
        const viewsCount = Math.floor(Math.random() * 500) + 100;
        
        setStats({
          totalProperties: properties.length,
          totalViews: viewsCount,
          totalMessages: messages.length,
          totalUsers: users.length
        });
        
        // Filter active and featured properties
        setActiveProperties(properties.filter(p => p.status === 'active'));
        setFeaturedProperties(properties.filter(p => p.featured));
        
        // Sort messages by date (newest first)
        const sortedMessages = [...messages].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setRecentMessages(sortedMessages);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Erro ao carregar dados do dashboard');
        setLoading(false);
      }
    };

    fetchData();
  }, [properties, messages, users]);

  // Mock data for charts
  const propertyTypeData = [
    { name: 'Aluguel', count: properties.filter(p => p.type === 'rent').length },
    { name: 'Venda', count: properties.filter(p => p.type === 'sale').length },
  ];

  const monthlyViewsData = [
    { name: 'Jan', views: 65 },
    { name: 'Fev', views: 84 },
    { name: 'Mar', views: 97 },
    { name: 'Abr', views: 110 },
    { name: 'Mai', views: 126 },
    { name: 'Jun', views: 148 },
  ];

  const propertyStatusData = [
    { name: 'Ativos', value: properties.filter(p => p.status === 'active').length },
    { name: 'Pendentes', value: properties.filter(p => p.status === 'pending').length },
    { name: 'Arquivados', value: properties.filter(p => p.status === 'archived').length },
  ];

  const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

  const statsItems = [
    { 
      title: 'Total de Imóveis', 
      value: loading ? '...' : stats.totalProperties, 
      icon: Home, 
      change: loading ? '...' : '+5%', 
      changeType: 'positive',
      href: '/admin/properties'
    },
    { 
      title: 'Visualizações', 
      value: loading ? '...' : stats.totalViews, 
      icon: Eye, 
      change: loading ? '...' : '+12%', 
      changeType: 'positive',
      href: '/admin/metrics'
    },
    { 
      title: 'Mensagens', 
      value: loading ? '...' : stats.totalMessages, 
      icon: MessageSquare, 
      change: loading ? '...' : '+3%', 
      changeType: 'positive',
      href: '/admin/messages'
    },
    { 
      title: 'Usuários', 
      value: loading ? '...' : stats.totalUsers, 
      icon: Users, 
      change: loading ? '...' : '+2%', 
      changeType: 'positive',
      href: '/admin/users'
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {statsItems.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-500' : 
                  stat.changeType === 'negative' ? 'text-red-500' : 'text-gray-500'
                } flex items-center`}>
                  {stat.change} em relação ao mês passado
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-auto text-muted-foreground hover:text-primary"
                  onClick={() => navigateTo(stat.href)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visualizações Mensais</CardTitle>
            <CardDescription>Total de visualizações nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-full"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyViewsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tipos de Imóveis</CardTitle>
            <CardDescription>Distribuição dos imóveis por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-full"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={propertyTypeData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Quantidade" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Status dos Imóveis</CardTitle>
            <CardDescription>Distribuição por status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-full"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {propertyStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Imóveis em Destaque</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigateTo('/admin/properties')}>
                Ver Todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : featuredProperties.length > 0 ? (
              <div className="space-y-4">
                {featuredProperties.slice(0, 5).map((property) => (
                  <div key={property.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{property.title}</p>
                      <p className="text-sm text-gray-500">
                        {property.type === 'rent' ? 'Aluguel' : 'Venda'} - {formatCurrency(property.price)}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto hover:bg-transparent"
                      onClick={() => navigateTo(`/admin/properties/${property.id}`)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum imóvel em destaque</p>
                <p className="text-sm mt-2">Adicione imóveis destacados para exibição aqui</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Mensagens Recentes</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigateTo('/admin/messages')}>
                Ver Todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.slice(0, 5).map((message, index) => (
                  <div key={index} className="border-b pb-2">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{message.name}</p>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {message.created_at ? new Date(message.created_at).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{message.email}</p>
                    <p className="text-sm line-clamp-2 mt-1">{message.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma mensagem recente</p>
                <p className="text-sm mt-2">As mensagens aparecerão aqui quando recebidas</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Atividades Recentes</CardTitle>
              <Button variant="outline" size="sm">
                Ver Todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Novo imóvel adicionado</p>
                  <p className="text-sm text-gray-500">Apartamento em Pinheiros adicionado ao catálogo</p>
                  <p className="text-xs text-gray-500 mt-1">Há 3 horas atrás</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Nova mensagem recebida</p>
                  <p className="text-sm text-gray-500">Maria Oliveira enviou uma pergunta sobre um imóvel</p>
                  <p className="text-xs text-gray-500 mt-1">Há 1 dia atrás</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Novo usuário registrado</p>
                  <p className="text-sm text-gray-500">Carlos Santos criou uma conta</p>
                  <p className="text-xs text-gray-500 mt-1">Há 2 dias atrás</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Aumento nas visualizações</p>
                  <p className="text-sm text-gray-500">+25% de visualizações nesta semana</p>
                  <p className="text-xs text-gray-500 mt-1">Há 3 dias atrás</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
