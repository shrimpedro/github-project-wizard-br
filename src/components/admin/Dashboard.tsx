
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart2, Home, MessageSquare, Users } from 'lucide-react';

const DashboardStats = () => {
  // Esses dados viriam de uma API real em produção
  const stats = [
    { title: 'Total de Imóveis', value: '245', icon: Home, change: '+12%', changeType: 'positive' },
    { title: 'Visualizações', value: '12,361', icon: BarChart2, change: '+24%', changeType: 'positive' },
    { title: 'Mensagens', value: '64', icon: MessageSquare, change: '-5%', changeType: 'negative' },
    { title: 'Usuários', value: '573', icon: Users, change: '+18%', changeType: 'positive' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
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
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="font-medium">Novo imóvel adicionado</p>
                <p className="text-sm text-gray-500">Hoje, 14:25</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Nova mensagem recebida</p>
                <p className="text-sm text-gray-500">Hoje, 12:42</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Usuário atualizado</p>
                <p className="text-sm text-gray-500">Ontem, 18:31</p>
              </div>
              <div>
                <p className="font-medium">Imóvel marcado como alugado</p>
                <p className="text-sm text-gray-500">Ontem, 10:15</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Imóveis Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="font-medium">Apartamento em Pinheiros</p>
                <p className="text-sm text-gray-500">342 visualizações esta semana</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Casa em Vila Madalena</p>
                <p className="text-sm text-gray-500">289 visualizações esta semana</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Studio na Consolação</p>
                <p className="text-sm text-gray-500">267 visualizações esta semana</p>
              </div>
              <div>
                <p className="font-medium">Apartamento em Moema</p>
                <p className="text-sm text-gray-500">243 visualizações esta semana</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;
