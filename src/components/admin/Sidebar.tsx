
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, MessageSquare, BarChart2, Settings, LogOut, Building, Image, Share2 } from 'lucide-react';
import { authService } from '../../services/api';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold">ImobiliáriaApp</span>
        </Link>
      </div>
      
      <nav className="mt-6 flex-1 px-4 space-y-1">
        <Link
          to="/admin"
          className={`group flex items-center px-4 py-2 text-sm rounded-md ${
            isActive('/admin') && !isActive('/admin/imoveis') && !isActive('/admin/mensagens') && !isActive('/admin/metricas') && !isActive('/admin/usuarios') && !isActive('/admin/configuracoes') && !isActive('/admin/media') && !isActive('/admin/social')
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Home className="mr-3 h-5 w-5" />
          Dashboard
        </Link>
        
        <Link
          to="/admin/imoveis"
          className={`group flex items-center px-4 py-2 text-sm rounded-md ${
            isActive('/admin/imoveis')
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Building className="mr-3 h-5 w-5" />
          Imóveis
        </Link>
        
        <Link
          to="/admin/mensagens"
          className={`group flex items-center px-4 py-2 text-sm rounded-md ${
            isActive('/admin/mensagens')
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <MessageSquare className="mr-3 h-5 w-5" />
          Mensagens
        </Link>
        
        <Link
          to="/admin/metricas"
          className={`group flex items-center px-4 py-2 text-sm rounded-md ${
            isActive('/admin/metricas')
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <BarChart2 className="mr-3 h-5 w-5" />
          Métricas
        </Link>
        
        <Link
          to="/admin/usuarios"
          className={`group flex items-center px-4 py-2 text-sm rounded-md ${
            isActive('/admin/usuarios')
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Users className="mr-3 h-5 w-5" />
          Usuários
        </Link>
        
        <Link
          to="/admin/media"
          className={`group flex items-center px-4 py-2 text-sm rounded-md ${
            isActive('/admin/media')
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Image className="mr-3 h-5 w-5" />
          Mídia
        </Link>
        
        <Link
          to="/admin/social"
          className={`group flex items-center px-4 py-2 text-sm rounded-md ${
            isActive('/admin/social')
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Share2 className="mr-3 h-5 w-5" />
          Redes Sociais
        </Link>
        
        <Link
          to="/admin/configuracoes"
          className={`group flex items-center px-4 py-2 text-sm rounded-md ${
            isActive('/admin/configuracoes')
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Settings className="mr-3 h-5 w-5" />
          Configurações
        </Link>
      </nav>
      
      <div className="p-4 mt-auto border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full group flex items-center px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
