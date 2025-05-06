
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Image, Upload, Search, Trash2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  created_at: string;
  size: number;
  content_type: string;
}

const MediaManagerPage = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  useEffect(() => {
    fetchMedia();
  }, []);
  
  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, we would fetch from a Supabase bucket
      // For now, we'll use sample data
      const { data: mediaFiles, error } = await supabase
        .storage
        .from('media')
        .list();
        
      if (error) {
        throw error;
      }
      
      // Transform the data
      const formattedMedia = mediaFiles?.map(file => ({
        id: file.id,
        name: file.name,
        url: supabase.storage.from('media').getPublicUrl(file.name).data.publicUrl,
        created_at: file.created_at || new Date().toISOString(),
        size: file.metadata?.size || 0,
        content_type: file.metadata?.mimetype || 'image/jpeg'
      })) || [];
      
      setMediaItems(formattedMedia);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Erro ao carregar a biblioteca de mídia');
      setMediaItems([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(0);
      
      try {
        // Upload to Supabase storage bucket
        const { data, error } = await supabase.storage
          .from('media')
          .upload(`${Date.now()}_${file.name}`, file, {
            cacheControl: '3600',
            upsert: false,
            onUploadProgress: (progress) => {
              setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
            },
          });
          
        if (error) throw error;
        
        toast.success(`Arquivo "${file.name}" enviado com sucesso!`);
        fetchMedia(); // Refresh the list
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error(`Erro ao enviar "${file.name}"`);
      } finally {
        setUploadProgress(null);
      }
    }
    
    // Reset the input
    event.target.value = '';
  };
  
  const handleDeleteMedia = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${name}"?`)) return;
    
    try {
      const { error } = await supabase.storage
        .from('media')
        .remove([name]);
        
      if (error) throw error;
      
      setMediaItems(mediaItems.filter(item => item.id !== id));
      toast.success(`"${name}" excluído com sucesso!`);
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error(`Erro ao excluir "${name}"`);
    }
  };
  
  const copyUrlToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopiedUrl(url);
        toast.success('URL copiada para a área de transferência!');
        setTimeout(() => setCopiedUrl(null), 3000);
      })
      .catch(() => {
        toast.error('Erro ao copiar URL');
      });
  };
  
  // Filter media items based on search query and active tab
  const filteredMediaItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'images') return matchesSearch && item.content_type.startsWith('image/');
    if (activeTab === 'documents') return matchesSearch && (
      item.content_type.includes('pdf') || 
      item.content_type.includes('word') || 
      item.content_type.includes('excel') ||
      item.content_type.includes('text')
    );
    
    return matchesSearch;
  });

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl">Gerenciador de Mídia</CardTitle>
          <div>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium">
                <Upload className="h-4 w-4" />
                Enviar Arquivos
              </div>
              <Input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
            </Label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {uploadProgress !== null && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="text-sm text-gray-500 mt-1">Enviando: {uploadProgress}%</p>
              </div>
            )}
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar arquivos..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="images">Imagens</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                {renderMediaGrid(filteredMediaItems)}
              </TabsContent>
              
              <TabsContent value="images" className="mt-4">
                {renderMediaGrid(filteredMediaItems)}
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4">
                {renderMediaGrid(filteredMediaItems)}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  function renderMediaGrid(items: MediaItem[]) {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded aspect-square"></div>
              <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded mt-1 w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }
    
    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum arquivo encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery 
              ? "Tente uma busca diferente ou envie novos arquivos" 
              : "Comece enviando seus arquivos"
            }
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white border rounded-md overflow-hidden group">
            <div className="relative aspect-square">
              {item.content_type.startsWith('image/') ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Erro';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center p-4">
                    <Image className="mx-auto h-8 w-8 text-gray-400" />
                    <span className="text-xs mt-2 block text-gray-500 truncate">
                      {item.content_type.split('/')[1]?.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => copyUrlToClipboard(item.url)}
                >
                  {copiedUrl === item.url ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleDeleteMedia(item.id, item.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-2">
              <p className="text-sm font-medium truncate" title={item.name}>
                {item.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(item.size)}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default MediaManagerPage;
