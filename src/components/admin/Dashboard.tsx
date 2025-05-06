
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart2, Home, MessageSquare, Users } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalMessages: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch real stats from your backend here
  useEffect(() => {
    // Simulating API call with setTimeout
    const timer = setTimeout(() => {
      // This would be replaced with a real API call
      setStats({
        totalProperties: 0,
        totalViews: 0,
        totalMessages: 0,
        totalUsers: 0
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  const recentActivities = loading ? [] : [
    {
      title: 'Bem-vindo ao dashboard',
      time: new Date().toLocaleString('pt-BR')
    }
  ];

  const popularProperties = loading ? [] : [
    {
      title: 'Ainda sem imóveis populares',
      views: 0
    }
  ];

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
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="border-b pb-2">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma atividade recente</p>
                <p className="text-sm mt-2">As atividades aparecerão aqui quando você começar a usar o sistema</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Imóveis Populares</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : popularProperties.length > 0 ? (
              <div className="space-y-4">
                {popularProperties.map((property, index) => (
                  <div key={index} className="border-b pb-2">
                    <p className="font-medium">{property.title}</p>
                    <p className="text-sm text-gray-500">{property.views} visualizações esta semana</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum imóvel popular</p>
                <p className="text-sm mt-2">Adicione imóveis para começar a ver estatísticas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
