
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { LogIn, Shield } from 'lucide-react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulação de autenticação - em uma aplicação real, isso seria uma chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Credenciais simuladas para teste
      if (credentials.email === 'admin@imobiliaria.com' && credentials.password === 'admin123') {
        // Armazenar estado de login (em produção usaria JWT ou algo similar)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({
          name: 'Administrador',
          email: credentials.email,
          role: 'admin'
        }));
        
        toast.success('Login realizado com sucesso!');
        navigate('/admin');
      } else {
        toast.error('Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Área do Corretor</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o painel administrativo
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu-email@exemplo.com"
                  value={credentials.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Button variant="link" className="p-0 h-auto font-normal text-xs" type="button">
                    Esqueceu a senha?
                  </Button>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Para teste, use:</p>
                <p>Email: admin@imobiliaria.com</p>
                <p>Senha: admin123</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full flex items-center gap-2" type="submit" disabled={isLoading}>
                <LogIn className="h-4 w-4" />
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
