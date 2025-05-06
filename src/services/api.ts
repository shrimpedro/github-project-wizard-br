
import { toast } from 'sonner';

// URLs base para o backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Tipos básicos para resposta da API
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

// Interface para tratamento de erros
interface ApiError {
  message: string;
  status: number;
}

// Função auxiliar para fazer requisições
const fetchApi = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  try {
    // Mescla o cabeçalho de autorização, se o usuário estiver logado
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Configura a requisição
    const config: RequestInit = {
      ...options,
      headers,
    };

    // Faz a requisição
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw {
        message: data.message || 'Ocorreu um erro na requisição',
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    // Trata erros específicos
    const apiError = error as ApiError;
    
    // Lida com erros de autenticação
    if (apiError.status === 401) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    // Exibe mensagem de erro
    toast.error(apiError.message || 'Ocorreu um erro na requisição');
    throw error;
  }
};

// Serviço de autenticação
export const authService = {
  login: async (email: string, password: string) => {
    try {
      // Simulação de chamada de API em produção
      if (process.env.NODE_ENV === 'development') {
        // Login simulado para desenvolvimento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email === 'admin@imobiliaria.com' && password === 'admin123') {
          const mockResponse = {
            data: {
              user: {
                name: 'Administrador',
                email,
                role: 'admin',
              },
              token: 'mock-jwt-token',
            },
            status: 'success',
          };
          
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', JSON.stringify(mockResponse.data.user));
          localStorage.setItem('authToken', mockResponse.data.token);
          
          return mockResponse.data;
        } else {
          throw { message: 'Credenciais inválidas', status: 401 };
        }
      } else {
        // Chamada real de API em produção
        const response = await fetchApi<ApiResponse<{
          user: { name: string; email: string; role: string };
          token: string;
        }>>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        
        // Salva informações de autenticação
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('authToken', response.data.token);
        
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.location.href = '/';
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Serviço de imóveis
export const propertyService = {
  getAllProperties: async () => {
    // Em produção, isso chamaria o backend
    return fetchApi<ApiResponse<any[]>>('/properties');
  },
  
  getPropertyById: async (id: string) => {
    return fetchApi<ApiResponse<any>>(`/properties/${id}`);
  },
  
  createProperty: async (property: any) => {
    return fetchApi<ApiResponse<any>>('/properties', {
      method: 'POST',
      body: JSON.stringify(property),
    });
  },
  
  updateProperty: async (id: string, property: any) => {
    return fetchApi<ApiResponse<any>>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(property),
    });
  },
  
  deleteProperty: async (id: string) => {
    return fetchApi<ApiResponse<null>>(`/properties/${id}`, {
      method: 'DELETE',
    });
  },
  
  submitPropertyForReview: async (propertyData: any) => {
    return fetchApi<ApiResponse<any>>('/properties/submit', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },
};

// Serviço de mensagens
export const messageService = {
  getAllMessages: async () => {
    return fetchApi<ApiResponse<any[]>>('/messages');
  },
  
  getMessageById: async (id: string) => {
    return fetchApi<ApiResponse<any>>(`/messages/${id}`);
  },
  
  sendMessage: async (message: any) => {
    return fetchApi<ApiResponse<any>>('/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },
  
  markAsRead: async (id: string) => {
    return fetchApi<ApiResponse<any>>(`/messages/${id}/read`, {
      method: 'PUT',
    });
  },
  
  deleteMessage: async (id: string) => {
    return fetchApi<ApiResponse<null>>(`/messages/${id}`, {
      method: 'DELETE',
    });
  },
};

// Serviço de métricas
export const metricService = {
  getMetrics: async (timeRange: 'day' | 'week' | 'month' | 'year') => {
    return fetchApi<ApiResponse<any>>(`/metrics?timeRange=${timeRange}`);
  },
  
  getPropertyPerformance: async () => {
    return fetchApi<ApiResponse<any>>('/metrics/properties');
  },
};

export default {
  auth: authService,
  properties: propertyService,
  messages: messageService,
  metrics: metricService,
};
