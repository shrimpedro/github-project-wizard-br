
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart2, Home, MessageSquare, Users } from 'lucide-react';
import { Property } from '../PropertyCard';

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

  // Calculate stats based on available data
  useEffect(() => {
    setStats({
      totalProperties: properties.length,
      totalViews: 0, // Could be calculated from analytics if available
      totalMessages: messages.length,
      totalUsers: users.length
    });
    setLoading(false);
  }, [properties, messages, users]);

  const statsItems = [
    { 
      title: 'Total de Imóveis', 
      value: loading ? '...' : stats.totalProperties, 
      icon: Home, 
      change: loading ? '...' : '+0%', 
      changeType: 'neutral' 
    },
    { 
      title: 'Visualizações', 
      value: loading ? '...' : stats.totalViews, 
      icon: BarChart2, 
      change: loading ? '...' : '+0%', 
      changeType: 'neutral' 
    },
    { 
      title: 'Mensagens', 
      value: loading ? '...' : stats.totalMessages, 
      icon: MessageSquare, 
      change: loading ? '...' : '+0%', 
      changeType: 'neutral' 
    },
    { 
      title: 'Usuários', 
      value: loading ? '...' : stats.totalUsers, 
      icon: Users, 
      change: loading ? '...' : '+0%', 
      changeType: 'neutral' 
    },
  ];

  const recentProperties = properties
    .slice(0, 5)
    .map(property => ({
      title: property.title,
      type: property.type === 'rent' ? 'Aluguel' : 'Venda',
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(property.price)
    }));

  const recentMessages = messages
    .slice(0, 5)
    .map(message => ({
      title: message?.name || 'Contato',
      time: message?.created_at ? new Date(message.created_at).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR')
    }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsItems.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-500' : 
                stat.changeType === 'negative' ? 'text-red-500' : 'text-gray-500'
              } flex items-center`}>
                {stat.change} em relação ao mês passado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Imóveis Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : recentProperties.length > 0 ? (
              <div className="space-y-4">
                {recentProperties.map((property, index) => (
                  <div key={index} className="border-b pb-2">
                    <p className="font-medium">{property.title}</p>
                    <p className="text-sm text-gray-500">{property.type} - {property.price}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum imóvel cadastrado</p>
                <p className="text-sm mt-2">Adicione imóveis para ver as estatísticas</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mensagens Recentes</CardTitle>
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
                {recentMessages.map((message, index) => (
                  <div key={index} className="border-b pb-2">
                    <p className="font-medium">{message.title}</p>
                    <p className="text-sm text-gray-500">{message.time}</p>
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
    </div>
  );
};

export default Dashboard;
