
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Home, MessageSquare, Users, Calendar, Eye, ArrowRight, ExternalLink,
  Clock, Bell
} from 'lucide-react';
import { Property } from '../PropertyCard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

interface DashboardProps {
  properties?: Property[];
  messages?: any[];
  users?: any[];
}

const Dashboard = ({ properties = [], messages = [], users = [] }: DashboardProps) => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalRentProperties: 0,
    totalSaleProperties: 0,
    totalMessages: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeProperties, setActiveProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const navigate = useNavigate();

  // Fetch real data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch properties
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('*');

        if (propertiesError) throw propertiesError;
        
        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (messagesError) throw messagesError;

        // Calculate stats
        const allProperties = propertiesData || [];
        const rentProperties = allProperties.filter(p => p.type === 'rent');
        const saleProperties = allProperties.filter(p => p.type === 'sale');
        const activeProps = allProperties.filter(p => p.status === 'active');
        const featuredProps = allProperties.filter(p => p.featured);

        setStats({
          totalProperties: allProperties.length,
          totalRentProperties: rentProperties.length,
          totalSaleProperties: saleProperties.length,
          totalMessages: messagesData?.length || 0,
          totalUsers: users.length
        });
        
        setActiveProperties(activeProps);
        setFeaturedProperties(featuredProps);
        setRecentMessages(messagesData || []);

        // Mock recent activities (would be implemented with a real activity log in production)
        setRecentActivities([
          { type: 'property_added', message: 'Novo imóvel adicionado', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
          { type: 'message_received', message: 'Nova mensagem recebida', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          { type: 'property_updated', message: 'Imóvel atualizado', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { type: 'property_viewed', message: 'Aumento nas visualizações', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
        ]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [users]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Card de Imóveis */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Imóveis Cadastrados</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalProperties}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500 flex items-center">
                <span className="mr-2">{loading ? '...' : stats.totalRentProperties} para locação</span>
                <span>{loading ? '...' : stats.totalSaleProperties} para venda</span>
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto text-muted-foreground hover:text-primary"
                onClick={() => navigateTo('/admin/properties')}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card de Mensagens */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalMessages}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                {loading ? '...' : recentMessages.length} mensagens recentes
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto text-muted-foreground hover:text-primary"
                onClick={() => navigateTo('/admin/messages')}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Card de Usuários */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalUsers}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                Administradores e corretores
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto text-muted-foreground hover:text-primary"
                onClick={() => navigateTo('/admin/users')}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Card de Atividades */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Atividades Recentes</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : recentActivities.length}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                nas últimas 72 horas
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto text-muted-foreground hover:text-primary"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Imóveis em Destaque */}
        <Card>
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

        {/* Mensagens Recentes */}
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
      </div>
      
      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <>
                <div className="h-16 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-16 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-16 bg-gray-200 animate-pulse rounded"></div>
              </>
            ) : recentActivities.map((activity, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  {activity.type === 'property_added' && <Home className="h-5 w-5 text-primary" />}
                  {activity.type === 'message_received' && <MessageSquare className="h-5 w-5 text-primary" />}
                  {activity.type === 'property_updated' && <ExternalLink className="h-5 w-5 text-primary" />}
                  {activity.type === 'property_viewed' && <Eye className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <p className="font-medium">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
