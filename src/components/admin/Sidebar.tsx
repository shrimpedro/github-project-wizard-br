
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings, Users, MessageSquare, Image, Edit } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Edit, label: 'Anúncios', path: '/admin/imoveis' },
    { icon: MessageSquare, label: 'Mensagens', path: '/admin/mensagens' },
    { icon: Users, label: 'Usuários', path: '/admin/usuarios' },
    { icon: BarChart2, label: 'Métricas', path: '/admin/metricas' },
    { icon: Image, label: 'Mídia', path: '/admin/midia' },
    { icon: Settings, label: 'Configurações', path: '/admin/configuracoes' },
  ];
  
  return (
    <div className="h-full w-64 bg-gray-900 text-white">
      <div className="p-6">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`
              flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors
              ${isActive(item.path) ? 'bg-gray-800 text-white border-l-4 border-primary' : ''}
            `}
          >
            <item.icon size={20} className="mr-3" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
