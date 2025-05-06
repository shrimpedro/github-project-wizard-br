
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Facebook, Instagram, Linkedin, Twitter, Share2, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface SocialAccount {
  id: string;
  platform: string;
  connected: boolean;
  username: string;
  lastSync?: string;
}

interface ScheduledPost {
  id: string;
  content: string;
  image?: string;
  platforms: string[];
  scheduledDate: string;
  status: 'scheduled' | 'published' | 'failed';
}

const SocialIntegrationsPage = () => {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    { id: '1', platform: 'facebook', connected: false, username: '' },
    { id: '2', platform: 'instagram', connected: false, username: '' },
    { id: '3', platform: 'twitter', connected: false, username: '' },
    { id: '4', platform: 'linkedin', connected: false, username: '' },
  ]);
  
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  
  const [formData, setFormData] = useState({
    content: '',
    image: '',
    scheduledDate: '',
    platforms: [] as string[],
  });
  
  const handleConnectAccount = (platform: string) => {
    // In a real implementation, this would redirect to OAuth flow
    const updatedAccounts = socialAccounts.map(account => {
      if (account.platform === platform) {
        return {
          ...account,
          connected: true,
          username: `usuario_${platform}`,
          lastSync: new Date().toISOString()
        };
      }
      return account;
    });
    
    setSocialAccounts(updatedAccounts);
    toast.success(`Conta ${platform} conectada com sucesso!`);
  };
  
  const handleDisconnectAccount = (platform: string) => {
    const updatedAccounts = socialAccounts.map(account => {
      if (account.platform === platform) {
        return {
          ...account,
          connected: false,
          username: '',
          lastSync: undefined
        };
      }
      return account;
    });
    
    setSocialAccounts(updatedAccounts);
    toast.success(`Conta ${platform} desconectada.`);
  };
  
  const handleTogglePlatform = (platform: string) => {
    const platforms = formData.platforms.includes(platform)
      ? formData.platforms.filter(p => p !== platform)
      : [...formData.platforms, platform];
      
    setFormData({ ...formData, platforms });
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSchedulePost = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content || formData.platforms.length === 0 || !formData.scheduledDate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      content: formData.content,
      image: formData.image || undefined,
      platforms: formData.platforms,
      scheduledDate: formData.scheduledDate,
      status: 'scheduled'
    };
    
    setScheduledPosts([...scheduledPosts, newPost]);
    setFormData({
      content: '',
      image: '',
      scheduledDate: '',
      platforms: [],
    });
    
    toast.success('Post agendado com sucesso!');
  };
  
  const handleShareProperty = (propertyId: string) => {
    toast.success('Imóvel compartilhado nas redes sociais!');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      default:
        return <Share2 className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Integrações com Redes Sociais</h1>
      
      <Tabs defaultValue="accounts">
        <TabsList className="mb-4">
          <TabsTrigger value="accounts">Contas Conectadas</TabsTrigger>
          <TabsTrigger value="post">Agendar Publicações</TabsTrigger>
          <TabsTrigger value="scheduled">Publicações Agendadas</TabsTrigger>
          <TabsTrigger value="share">Compartilhar Imóveis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialAccounts.map((account) => (
              <Card key={account.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    {getSocialIcon(account.platform)}
                    <CardTitle className="ml-2 capitalize">
                      {account.platform}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {account.connected ? (
                    <div className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Conectado como:</span>
                        <span className="font-medium">{account.username}</span>
                      </div>
                      {account.lastSync && (
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-500">Última sincronização:</span>
                          <span>{formatDate(account.lastSync)}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Conecte sua conta {account.platform} para compartilhar conteúdo automaticamente.
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  {account.connected ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleDisconnectAccount(account.platform)}
                    >
                      Desconectar
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => handleConnectAccount(account.platform)}
                    >
                      Conectar
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="post">
          <Card>
            <CardHeader>
              <CardTitle>Agendar Publicação</CardTitle>
              <CardDescription>
                Crie e agende publicações para suas redes sociais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSchedulePost}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo da Publicação</Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Escreva aqui o conteúdo da sua publicação..."
                      value={formData.content}
                      onChange={handleFormChange}
                      className="min-h-32"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image">URL da Imagem (opcional)</Label>
                    <Input
                      id="image"
                      name="image"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={formData.image}
                      onChange={handleFormChange}
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="h-32 object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Imagem+Inválida';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Plataformas</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {socialAccounts.filter(a => a.connected).map((account) => (
                        <div key={account.id} className="flex items-center space-x-2">
                          <Switch
                            id={`platform-${account.platform}`}
                            checked={formData.platforms.includes(account.platform)}
                            onCheckedChange={() => handleTogglePlatform(account.platform)}
                          />
                          <Label htmlFor={`platform-${account.platform}`} className="flex items-center gap-1">
                            {getSocialIcon(account.platform)}
                            <span className="capitalize">{account.platform}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                    {socialAccounts.filter(a => a.connected).length === 0 && (
                      <p className="text-sm text-gray-500">
                        Você precisa conectar pelo menos uma conta de rede social na aba "Contas Conectadas".
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Data e Hora de Publicação</Label>
                    <Input
                      id="scheduledDate"
                      name="scheduledDate"
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={
                      socialAccounts.filter(a => a.connected).length === 0 ||
                      formData.platforms.length === 0
                    }
                  >
                    Agendar Publicação
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled">
          {scheduledPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Share2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma publicação agendada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Agende suas primeiras publicações na aba "Agendar Publicações"
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Publicação Agendada</CardTitle>
                        <CardDescription>
                          {formatDate(post.scheduledDate)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        {post.platforms.map((platform) => (
                          <div key={platform} className="text-gray-500">
                            {getSocialIcon(platform)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{post.content}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post"
                        className="h-32 object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Imagem+Inválida';
                        }}
                      />
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : post.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {post.status === 'published' ? 'Publicado' : post.status === 'failed' ? 'Falha' : 'Agendado'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="destructive" size="sm">Cancelar</Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="share">
          <Card>
            <CardHeader>
              <CardTitle>Compartilhar Imóveis</CardTitle>
              <CardDescription>
                Compartilhe imóveis diretamente nas redes sociais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="property">Selecionar Imóvel</Label>
                  <Select>
                    <SelectTrigger id="property">
                      <SelectValue placeholder="Selecione um imóvel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prop1">Apartamento em Pinheiros</SelectItem>
                      <SelectItem value="prop2">Casa em Vila Madalena</SelectItem>
                      <SelectItem value="prop3">Studio na Consolação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="share-message">Mensagem Personalizada</Label>
                  <Textarea
                    id="share-message"
                    placeholder="Confira este excelente imóvel! #imobiliaria #imovel"
                    className="min-h-24"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Plataformas para Compartilhar</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {socialAccounts.map((account) => (
                      <div key={account.id} className="flex items-center space-x-2">
                        <Switch
                          id={`share-${account.platform}`}
                          disabled={!account.connected}
                        />
                        <Label 
                          htmlFor={`share-${account.platform}`} 
                          className={`flex items-center gap-1 ${!account.connected ? 'text-gray-400' : ''}`}
                        >
                          {getSocialIcon(account.platform)}
                          <span className="capitalize">{account.platform}</span>
                          {!account.connected && <span className="text-xs">(não conectado)</span>}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Outras Opções de Compartilhamento</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="share-email" />
                      <Label htmlFor="share-email" className="flex items-center gap-1">
                        <Mail className="h-5 w-5" />
                        <span>Email Marketing</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="share-whatsapp" />
                      <Label htmlFor="share-whatsapp" className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                          <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                          <path d="M9.5 13.5a5 5 0 0 0 5 0" />
                        </svg>
                        <span>WhatsApp</span>
                      </Label>
                    </div>
                  </div>
                </div>
                
                <Button onClick={() => handleShareProperty('1')} className="w-full">
                  Compartilhar Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialIntegrationsPage;
