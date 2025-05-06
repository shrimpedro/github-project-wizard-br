
import { supabase } from '@/integrations/supabase/client';
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
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw { message: error.message, status: 401 };
      
      // Salva informações de autenticação
      localStorage.setItem('isAuthenticated', 'true');
      
      return { 
        user: data.user, 
        session: data.session 
      };
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.location.href = '/';
  },
  
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  getSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  signup: async (email: string, password: string, userData: { name: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    if (error) throw { message: error.message, status: 400 };
    return data;
  }
};

// Serviço de imóveis
export const propertyService = {
  getAllProperties: async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*');
    
    if (error) throw { message: error.message, status: 400 };
    return data;
  },
  
  getPropertyById: async (id: string) => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw { message: error.message, status: 400 };
    return data;
  },
  
  createProperty: async (property: any) => {
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select();
    
    if (error) throw { message: error.message, status: 400 };
    return data[0];
  },
  
  updateProperty: async (id: string, property: any) => {
    const { data, error } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id)
      .select();
    
    if (error) throw { message: error.message, status: 400 };
    return data[0];
  },
  
  deleteProperty: async (id: string) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    if (error) throw { message: error.message, status: 400 };
    return null;
  },
  
  submitPropertyForReview: async (propertyData: any) => {
    // Create with pending status
    const property = { ...propertyData, status: 'pending' };
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select();
    
    if (error) throw { message: error.message, status: 400 };
    return data[0];
  },
};

// Serviço de mensagens
export const messageService = {
  getAllMessages: async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw { message: error.message, status: 400 };
    return data;
  },
  
  getMessageById: async (id: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw { message: error.message, status: 400 };
    return data;
  },
  
  sendMessage: async (message: any) => {
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select();
    
    if (error) throw { message: error.message, status: 400 };
    return data[0];
  },
  
  markAsRead: async (id: string) => {
    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', id)
      .select();
    
    if (error) throw { message: error.message, status: 400 };
    return data[0];
  },
  
  deleteMessage: async (id: string) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);
    
    if (error) throw { message: error.message, status: 400 };
    return null;
  },
};

// Serviço de métricas
export const metricService = {
  getMetrics: async (timeRange: 'day' | 'week' | 'month' | 'year') => {
    let rangeValue = 1;
    let timeUnit: 'day' | 'week' | 'month' | 'year' = 'day';
    
    switch (timeRange) {
      case 'week':
        rangeValue = 7;
        timeUnit = 'day';
        break;
      case 'month':
        rangeValue = 30;
        timeUnit = 'day';
        break;
      case 'year':
        rangeValue = 12;
        timeUnit = 'month';
        break;
      default:
        rangeValue = 1;
        timeUnit = 'day';
    }
    
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .gte('visit_date', new Date(Date.now() - rangeValue * 24 * 60 * 60 * 1000).toISOString());
    
    if (error) throw { message: error.message, status: 400 };
    return data;
  },
  
  getPropertyPerformance: async () => {
    const { data, error } = await supabase
      .from('analytics')
      .select('property_id, page_path')
      .order('visit_date', { ascending: false });
    
    if (error) throw { message: error.message, status: 400 };
    return data;
  },

  // Track page visits
  trackPageVisit: async (pageData: { 
    page_path: string;
    property_id?: string;
    referrer?: string;
    device?: string;
  }) => {
    const visitorId = localStorage.getItem('visitor_id') || 
      Math.random().toString(36).substring(2, 15);
    
    // Store the visitor ID for future visits
    localStorage.setItem('visitor_id', visitorId);
    
    const { error } = await supabase
      .from('analytics')
      .insert([{ 
        ...pageData,
        visitor_id: visitorId
      }]);
    
    if (error) console.error('Error tracking page visit:', error);
  }
};

// Serviço de páginas
export const pageService = {
  getPageBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw { message: error.message, status: 404 };
    return data;
  },
  
  getAllPages: async () => {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('title');
    
    if (error) throw { message: error.message, status: 400 };
    return data;
  },
  
  updatePage: async (id: string, content: any) => {
    const { data, error } = await supabase
      .from('pages')
      .update(content)
      .eq('id', id)
      .select();
    
    if (error) throw { message: error.message, status: 400 };
    return data[0];
  }
};

// Serviço de configurações do site
export const siteSettingsService = {
  getSettings: async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error) throw { message: error.message, status: 400 };
    return data;
  },
  
  updateSettings: async (settings: any) => {
    const { data, error } = await supabase
      .from('site_settings')
      .update(settings)
      .eq('id', 1)
      .select();
    
    if (error) throw { message: error.message, status: 400 };
    return data[0];
  }
};

// Serviço de usuários/perfis
export const userService = {
  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw { message: error.message, status: 400 };
    return data;
  },
  
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw { message: error.message, status: 404 };
    return data;
  },
  
  updateUserProfile: async (userId: string, profileData: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select();
    
    if (error) throw { message: error.message, status: 400 };
    return data[0];
  },
  
  updateUserRole: async (userId: string, role: 'user' | 'admin' | 'broker') => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select();
    
    if (error) throw { message: error.message, status: 400 };
    return data[0];
  }
};

export default {
  auth: authService,
  properties: propertyService,
  messages: messageService,
  metrics: metricService,
  pages: pageService,
  settings: siteSettingsService,
  users: userService
};
