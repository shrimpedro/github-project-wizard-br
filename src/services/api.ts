
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

// Mapeamento entre as propriedades do banco de dados e o frontend
const mapPropertyFromDb = (property: any) => ({
  id: property.id,
  title: property.title,
  address: property.address,
  price: property.price,
  type: property.type,
  bedrooms: property.bedrooms,
  bathrooms: property.bathrooms,
  area: property.area,
  imageUrl: property.imageurl || 'https://via.placeholder.com/800x600?text=Sem+Imagem',
  description: property.description,
  status: property.status,
  featured: property.featured
});

// Serviço de imóveis
export const propertyService = {
  getAllProperties: async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw { message: error.message, status: 400 };
    return data.map(mapPropertyFromDb);
  },
  
  getPropertyById: async (id: string) => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw { message: error.message, status: 400 };
    return mapPropertyFromDb(data);
  },
  
  getPropertyByType: async (type: 'rent' | 'sale') => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('type', type)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw { message: error.message, status: 400 };
    return data.map(mapPropertyFromDb);
  },
  
  getFeaturedProperties: async (limit = 6) => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('featured', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw { message: error.message, status: 400 };
    return data.map(mapPropertyFromDb);
  },
  
  createProperty: async (property: any) => {
    // Transform property to match DB schema
    const dbProperty = {
      title: property.title,
      address: property.address,
      price: property.price,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      description: property.description,
      imageurl: property.imageUrl || null,
      status: property.status || 'active',
      featured: property.featured || false
    };
    
    const { data, error } = await supabase
      .from('properties')
      .insert([dbProperty])
      .select();
    
    if (error) throw { message: error.message, status: 400 };
    return mapPropertyFromDb(data[0]);
  },
  
  updateProperty: async (id: string, property: any) => {
    // Transform property to match DB schema
    const dbProperty: any = {};
    
    if (property.title !== undefined) dbProperty.title = property.title;
    if (property.address !== undefined) dbProperty.address = property.address;
    if (property.price !== undefined) dbProperty.price = property.price;
    if (property.type !== undefined) dbProperty.type = property.type;
    if (property.bedrooms !== undefined) dbProperty.bedrooms = property.bedrooms;
    if (property.bathrooms !== undefined) dbProperty.bathrooms = property.bathrooms;
    if (property.area !== undefined) dbProperty.area = property.area;
    if (property.description !== undefined) dbProperty.description = property.description;
    if (property.imageUrl !== undefined) dbProperty.imageurl = property.imageUrl;
    if (property.status !== undefined) dbProperty.status = property.status;
    if (property.featured !== undefined) dbProperty.featured = property.featured;
    
    const { data, error } = await supabase
      .from('properties')
      .update(dbProperty)
      .eq('id', id)
      .select();
    
    if (error) throw { message: error.message, status: 400 };
    return mapPropertyFromDb(data[0]);
  },
  
  deleteProperty: async (id: string) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    if (error) throw { message: error.message, status: 400 };
    return null;
  },
  
  searchProperties: async (params: {
    type?: 'rent' | 'sale';
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    minArea?: number;
    maxArea?: number;
  }) => {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'active');
    
    if (params.type) {
      query = query.eq('type', params.type);
    }
    
    if (params.minPrice) {
      query = query.gte('price', params.minPrice);
    }
    
    if (params.maxPrice) {
      query = query.lte('price', params.maxPrice);
    }
    
    if (params.bedrooms) {
      query = query.gte('bedrooms', params.bedrooms);
    }
    
    if (params.bathrooms) {
      query = query.gte('bathrooms', params.bathrooms);
    }
    
    if (params.minArea) {
      query = query.gte('area', params.minArea);
    }
    
    if (params.maxArea) {
      query = query.lte('area', params.maxArea);
    }
    
    const { data, error } = await query;
    
    if (error) throw { message: error.message, status: 400 };
    return data.map(mapPropertyFromDb);
  },
  
  submitPropertyForReview: async (propertyData: any) => {
    // Create with pending status
    const property = { 
      ...propertyData, 
      status: 'pending',
      imageurl: propertyData.imageUrl
    };
    delete property.imageUrl; // Remove imageUrl as we use imageurl in DB
    
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select();
    
    if (error) throw { message: error.message, status: 400 };
    return mapPropertyFromDb(data[0]);
  },
};

// Serviço de mensagens
export const messageService = {
  getAllMessages: async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, properties(title, imageurl)')
      .order('created_at', { ascending: false });
    
    if (error) throw { message: error.message, status: 400 };
    
    // Format the data to include property title if available
    return data.map((message: any) => ({
      ...message,
      property: message.properties ? {
        title: message.properties.title,
        imageUrl: message.properties.imageurl
      } : null
    }));
  },
  
  getMessageById: async (id: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, properties(title, imageurl)')
      .eq('id', id)
      .single();
    
    if (error) throw { message: error.message, status: 404 };
    
    // Format the data to include property title if available
    return {
      ...data,
      property: data.properties ? {
        title: data.properties.title,
        imageUrl: data.properties.imageurl
      } : null
    };
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

// Serviço de métricas - atualizando para dados reais
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
    
    // Get analytics data from database
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .gte('visit_date', new Date(Date.now() - rangeValue * 24 * 60 * 60 * 1000).toISOString());
    
    if (error) throw { message: error.message, status: 400 };
    
    // Get messages data for the same period to calculate conversion
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .gte('created_at', new Date(Date.now() - rangeValue * 24 * 60 * 60 * 1000).toISOString());
    
    if (messagesError) throw { message: messagesError.message, status: 400 };
    
    // Process data for charts based on timeRange
    let processedData;
    
    if (timeRange === 'day') {
      // Group by hour
      processedData = processDataByHour(data, messagesData);
    } else if (timeRange === 'week') {
      // Group by day
      processedData = processDataByDay(data, messagesData);
    } else if (timeRange === 'month') {
      // Group by day
      processedData = processDataByDay(data, messagesData);
    } else {
      // Group by month
      processedData = processDataByMonth(data, messagesData);
    }
    
    return {
      chartData: processedData,
      summary: {
        totalVisits: data.length,
        totalContacts: messagesData.length,
        conversionRate: data.length > 0 ? ((messagesData.length / data.length) * 100).toFixed(2) : 0,
        averageTimeOnSite: calculateAverageTimeOnSite(data)
      }
    };
  },
  
  getPropertyPerformance: async () => {
    // Get analytics data grouped by property
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('analytics')
      .select('property_id, page_path')
      .not('property_id', 'is', null);
    
    if (analyticsError) throw { message: analyticsError.message, status: 400 };
    
    // Get messages data grouped by property
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('property_id')
      .not('property_id', 'is', null);
    
    if (messagesError) throw { message: messagesError.message, status: 400 };
    
    // Get property details
    const { data: propertiesData, error: propertiesError } = await supabase
      .from('properties')
      .select('id, title');
    
    if (propertiesError) throw { message: propertiesError.message, status: 400 };
    
    // Create property performance data
    const propertyMap = new Map();
    
    // Count visits per property
    analyticsData.forEach((item: any) => {
      if (item.property_id) {
        if (!propertyMap.has(item.property_id)) {
          propertyMap.set(item.property_id, { visitas: 0, contatos: 0 });
        }
        propertyMap.get(item.property_id).visitas += 1;
      }
    });
    
    // Count contacts per property
    messagesData.forEach((item: any) => {
      if (item.property_id) {
        if (!propertyMap.has(item.property_id)) {
          propertyMap.set(item.property_id, { visitas: 0, contatos: 0 });
        }
        propertyMap.get(item.property_id).contatos += 1;
      }
    });
    
    // Format the data with property titles
    const propertyPerformance = Array.from(propertyMap.entries()).map(([propertyId, data]) => {
      const property = propertiesData.find((p: any) => p.id === propertyId);
      return {
        id: propertyId,
        title: property ? property.title : 'Imóvel Desconhecido',
        visitas: (data as any).visitas,
        contatos: (data as any).contatos,
        conversao: (data as any).visitas > 0 
          ? (((data as any).contatos / (data as any).visitas) * 100).toFixed(1) 
          : 0
      };
    });
    
    // Sort by views descending
    return propertyPerformance.sort((a, b) => b.visitas - a.visitas);
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
        visitor_id: visitorId,
        visit_date: new Date().toISOString()
      }]);
    
    if (error) console.error('Error tracking page visit:', error);
  }
};

// Helper functions for processing metrics data
function processDataByHour(analyticsData: any[], messagesData: any[]) {
  const hourData: any = {};
  
  // Initialize hour data
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    hourData[hour] = { name: `${hour}:00`, visitas: 0, contatos: 0, favoritos: 0 };
  }
  
  // Count visits per hour
  analyticsData.forEach((item: any) => {
    const hour = new Date(item.visit_date).getHours().toString().padStart(2, '0');
    hourData[hour].visitas += 1;
  });
  
  // Count contacts per hour
  messagesData.forEach((item: any) => {
    const hour = new Date(item.created_at).getHours().toString().padStart(2, '0');
    hourData[hour].contatos += 1;
  });
  
  // Convert to array
  return Object.values(hourData);
}

function processDataByDay(analyticsData: any[], messagesData: any[]) {
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dayData: any = {};
  
  // Initialize day data
  for (let i = 0; i < 7; i++) {
    dayData[i] = { name: dayNames[i], visitas: 0, contatos: 0, favoritos: 0 };
  }
  
  // Count visits per day
  analyticsData.forEach((item: any) => {
    const day = new Date(item.visit_date).getDay();
    dayData[day].visitas += 1;
  });
  
  // Count contacts per day
  messagesData.forEach((item: any) => {
    const day = new Date(item.created_at).getDay();
    dayData[day].contatos += 1;
  });
  
  // Convert to array
  return Object.values(dayData);
}

function processDataByMonth(analyticsData: any[], messagesData: any[]) {
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthData: any = {};
  
  // Initialize month data
  for (let i = 0; i < 12; i++) {
    monthData[i] = { name: monthNames[i], visitas: 0, contatos: 0, favoritos: 0 };
  }
  
  // Count visits per month
  analyticsData.forEach((item: any) => {
    const month = new Date(item.visit_date).getMonth();
    monthData[month].visitas += 1;
  });
  
  // Count contacts per month
  messagesData.forEach((item: any) => {
    const month = new Date(item.created_at).getMonth();
    monthData[month].contatos += 1;
  });
  
  // Convert to array
  return Object.values(monthData);
}

function calculateAverageTimeOnSite(analyticsData: any[]) {
  // This is a placeholder. In a real implementation, you would track session duration
  return '2m 37s'; // Default value
}

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
  },
  
  createPage: async (pageData: any) => {
    const { data, error } = await supabase
      .from('pages')
      .insert([pageData])
      .select();
    
    if (error) throw { message: error.message, status: 400 };
    return data[0];
  },
  
  deletePage: async (id: string) => {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);
    
    if (error) throw { message: error.message, status: 400 };
    return null;
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

// Serviço de média
export const mediaService = {
  getAllMedia: async () => {
    try {
      const { data, error } = await supabase.storage.from('media').list();
      
      if (error) throw error;
      
      // Process data to include URLs
      return data?.map(file => ({
        id: file.id,
        name: file.name,
        url: supabase.storage.from('media').getPublicUrl(file.name).data.publicUrl,
        created_at: file.created_at || new Date().toISOString(),
        size: file.metadata?.size || 0,
        content_type: file.metadata?.mimetype || 'image/jpeg'
      })) || [];
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  },
  
  uploadMedia: async (file: File, onProgress?: (progress: number) => void) => {
    const fileName = `${Date.now()}_${file.name}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          ...(onProgress && {
            onUploadProgress: (progress) => {
              onProgress(Math.round((progress.loaded / progress.total) * 100));
            },
          }),
        });
        
      if (error) throw error;
      
      return {
        id: data?.id || fileName,
        name: fileName,
        url: supabase.storage.from('media').getPublicUrl(fileName).data.publicUrl,
        created_at: new Date().toISOString(),
        size: file.size,
        content_type: file.type
      };
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  },
  
  deleteMedia: async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('media')
        .remove([fileName]);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  }
};

export default {
  auth: authService,
  properties: propertyService,
  messages: messageService,
  metrics: metricService,
  pages: pageService,
  settings: siteSettingsService,
  users: userService,
  media: mediaService
};
