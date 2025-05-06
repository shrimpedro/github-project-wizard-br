
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { X, Plus, Image } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Property } from '../PropertyCard';
import { Separator } from '../ui/separator';

// Schema de validação usando Zod
const propertySchema = z.object({
  title: z.string().min(5, 'O título precisa ter pelo menos 5 caracteres'),
  address: z.string().min(5, 'O endereço precisa ter pelo menos 5 caracteres'),
  fullAddress: z.string().optional(),
  price: z.coerce.number().positive('O preço precisa ser um número positivo'),
  type: z.enum(['rent', 'sale']),
  bedrooms: z.coerce.number().int().min(0, 'Número de quartos não pode ser negativo'),
  bathrooms: z.coerce.number().int().min(0, 'Número de banheiros não pode ser negativo'),
  area: z.coerce.number().positive('A área precisa ser um número positivo'),
  description: z.string().optional(),
  imageUrl: z.string().url('Insira uma URL válida para a imagem principal'),
  images: z.array(z.string().url('Insira URLs válidas para as imagens')).optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email('Email inválido').optional(),
  isPublic: z.boolean().default(true),
  status: z.enum(['active', 'pending', 'archived']).default('active'),
  featured: z.boolean().default(false),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (data: PropertyFormValues) => void;
}

const PropertyForm = ({ initialData, onSubmit }: PropertyFormProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title || '',
      address: initialData?.address || '',
      fullAddress: initialData?.fullAddress || '',
      price: initialData?.price || 0,
      type: initialData?.type || 'rent',
      bedrooms: initialData?.bedrooms || 0,
      bathrooms: initialData?.bathrooms || 0,
      area: initialData?.area || 0,
      description: initialData?.description || '',
      imageUrl: initialData?.imageUrl || '',
      images: initialData?.images || [],
      contactPhone: initialData?.contactPhone || '',
      contactEmail: initialData?.contactEmail || '',
      isPublic: initialData?.isPublic !== undefined ? initialData.isPublic : true,
      status: initialData?.status || 'active',
      featured: initialData?.featured || false,
    },
  });

  const handleSubmit = (data: PropertyFormValues) => {
    // Add the current list of image URLs to the form data
    data.images = imageUrls;
    onSubmit(data);
  };

  const addImageUrl = () => {
    if (newImageUrl && newImageUrl.trim() !== '') {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    const updatedUrls = [...imageUrls];
    updatedUrls.splice(index, 1);
    setImageUrls(updatedUrls);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="images">Fotos</TabsTrigger>
            <TabsTrigger value="contacts">Contato & Visibilidade</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Apartamento em Pinheiros" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Público</FormLabel>
                    <FormControl>
                      <Input placeholder="Pinheiros, São Paulo - SP" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este endereço será visível para todos os visitantes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Completo (Privado)</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua Exemplo, 123 - Bairro, Cidade - Estado" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este endereço será visível apenas para administradores e corretores
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="rent">Aluguel</SelectItem>
                        <SelectItem value="sale">Venda</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      {form.watch('type') === 'rent' ? 'Valor mensal' : 'Valor de venda'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quartos</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banheiros</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o imóvel em detalhes..." 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem Principal</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Esta será a imagem principal do imóvel
                  </FormDescription>
                  <FormMessage />
                  
                  {field.value && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Preview:</p>
                      <img 
                        src={field.value} 
                        alt="Preview" 
                        className="h-32 w-full object-cover rounded-md" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Imagem+Inválida';
                        }}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <Separator className="my-4" />
            
            <div>
              <FormLabel>Imagens Adicionais</FormLabel>
              <div className="flex gap-2 mt-1 mb-3">
                <Input 
                  placeholder="https://exemplo.com/imagem2.jpg" 
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button 
                  type="button" 
                  onClick={addImageUrl}
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={url} 
                      alt={`Imagem ${index + 1}`} 
                      className="h-24 w-full object-cover rounded-md" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Imagem+Inválida';
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImageUrl(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {imageUrls.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-24 w-full border-2 border-dashed border-gray-300 rounded-md text-gray-400">
                    <Image className="h-6 w-6 mb-1" />
                    <span className="text-xs">Sem imagens adicionais</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone de Contato</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 98765-4321" {...field} />
                    </FormControl>
                    <FormDescription>
                      Telefone do responsável pelo imóvel (não público)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de Contato</FormLabel>
                    <FormControl>
                      <Input placeholder="contato@exemplo.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Email do responsável pelo imóvel (não público)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-0.5">
                      <FormLabel>Listagem Pública</FormLabel>
                      <FormDescription>
                        Se ativado, o imóvel será visível no site público
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-0.5">
                      <FormLabel>Imóvel em Destaque</FormLabel>
                      <FormDescription>
                        Se ativado, o imóvel aparecerá na seção de destaques
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status do Imóvel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Define a situação atual do imóvel
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Limpar
          </Button>
          <Button type="submit">
            {initialData ? 'Salvar Alterações' : 'Adicionar Imóvel'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PropertyForm;
