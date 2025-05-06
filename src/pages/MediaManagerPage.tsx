
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload, X, Image as ImageIcon, Copy, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { mediaService } from '@/services/api';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  created_at: string;
  size: number;
  content_type: string;
}

const MediaManagerPage = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [search, setSearch] = useState('');

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      const mediaFiles = await mediaService.getAllMedia();
      setFiles(mediaFiles);
    } catch (error) {
      console.error('Error loading media:', error);
      toast.error('Não foi possível carregar os arquivos de mídia');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const file = fileList[0];
    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Create a custom progress handler
      const progressHandler = (progress: number) => {
        setUploadProgress(progress);
      };
      
      // Upload the file
      const uploadedFile = await mediaService.uploadMedia(file, progressHandler);
      
      // Add the new file to the state
      setFiles(prevFiles => [uploadedFile, ...prevFiles]);
      toast.success('Arquivo enviado com sucesso!');
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao enviar o arquivo');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o arquivo "${fileName}"?`)) return;
    
    try {
      await mediaService.deleteMedia(fileName);
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
      
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
      }
      
      toast.success('Arquivo excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Erro ao excluir o arquivo');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copiada para a área de transferência!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciador de Mídia</h1>
        <div className="flex items-center">
          <div className="relative">
            <Input
              type="text"
              placeholder="Pesquisar arquivos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 mr-4"
            />
            {search && (
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setSearch('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="relative">
            <Input
              type="file"
              id="fileUpload"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button 
              onClick={() => document.getElementById('fileUpload')?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>{uploadProgress}%</span>
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Enviar Arquivo
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="grid">Grade</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid" className="w-full">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Nenhum arquivo encontrado</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {search ? 'Tente uma pesquisa diferente.' : 'Comece enviando um arquivo.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredFiles.map(file => (
                    <div 
                      key={file.id}
                      className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${selectedFile?.id === file.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedFile(file)}
                    >
                      {file.content_type.startsWith('image/') ? (
                        <div className="aspect-square bg-muted relative">
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          <div className="text-center p-4">
                            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-xs text-muted-foreground truncate max-w-full">
                              {file.content_type.split('/')[1].toUpperCase()}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="p-2">
                        <p className="text-sm font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list" className="w-full">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Nenhum arquivo encontrado</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {search ? 'Tente uma pesquisa diferente.' : 'Comece enviando um arquivo.'}
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 text-sm font-medium">Nome</th>
                        <th className="text-left p-3 text-sm font-medium">Tipo</th>
                        <th className="text-left p-3 text-sm font-medium">Tamanho</th>
                        <th className="text-left p-3 text-sm font-medium">Data</th>
                        <th className="text-left p-3 text-sm font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map(file => (
                        <tr 
                          key={file.id} 
                          className={`border-t hover:bg-muted/30 ${selectedFile?.id === file.id ? 'bg-muted/30' : ''}`}
                          onClick={() => setSelectedFile(file)}
                        >
                          <td className="p-3 text-sm">{file.name}</td>
                          <td className="p-3 text-sm">{file.content_type.split('/')[1].toUpperCase()}</td>
                          <td className="p-3 text-sm">{formatFileSize(file.size)}</td>
                          <td className="p-3 text-sm">{formatDate(file.created_at)}</td>
                          <td className="p-3 text-sm">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(file.url);
                                }}
                              >
                                <Copy size={16} />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFile(file.id, file.name);
                                }}
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-1">
          {selectedFile ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </CardTitle>
                <CardDescription>
                  {formatDate(selectedFile.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedFile.content_type.startsWith('image/') ? (
                  <div className="aspect-video bg-muted rounded-md overflow-hidden">
                    <img 
                      src={selectedFile.url} 
                      alt={selectedFile.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {selectedFile.content_type.split('/')[1].toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-[100px_1fr] gap-1">
                    <span className="text-sm font-medium">Tipo:</span>
                    <span className="text-sm">{selectedFile.content_type}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-1">
                    <span className="text-sm font-medium">Tamanho:</span>
                    <span className="text-sm">{formatFileSize(selectedFile.size)}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-1">
                    <span className="text-sm font-medium">URL:</span>
                    <span className="text-sm truncate">
                      {selectedFile.url}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(selectedFile.url)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar URL
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleDeleteFile(selectedFile.id, selectedFile.name)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Selecione um arquivo para ver os detalhes
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaManagerPage;
