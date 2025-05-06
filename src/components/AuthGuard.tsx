
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(auth);
      
      if (!auth) {
        toast.error('Você precisa estar autenticado para acessar esta página');
      }
    };
    
    checkAuth();
  }, []);

  // Enquanto verifica autenticação
  if (isAuthenticated === null) {
    return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  }

  // Se não estiver autenticado, redirecione para login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado, renderize as rotas filhas
  return <>{children}</>;
};

export default AuthGuard;
