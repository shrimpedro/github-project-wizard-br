
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

const SubmitPropertyPage = () => {
  const [propertyForm, setPropertyForm] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    title: '',
    address: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    price: '',
    description: '',
    images: [] as File[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPropertyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setPropertyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setPropertyForm(prev => ({ ...prev, images: [...prev.images, ...filesArray] }));
    }
  };

  const removeImage = (index: number) => {
    setPropertyForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulando o envio para um servidor
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Resetar formulário após envio bem-sucedido
      setPropertyForm({
        name: '',
        email: '',
        phone: '',
        propertyType: '',
        title: '',
        address: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        price: '',
        description: '',
        images: []
      });
      
      toast.success('Imóvel enviado com sucesso! Entraremos em contato em breve para avaliação.');
    } catch (error) {
      toast.error('Erro ao enviar imóvel. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header logo="" siteName="ImobiliáriaApp" />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Envie seu imóvel para avaliação</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Formulário de Submissão</CardTitle>
                <CardDescription>
                  Preencha os detalhes do seu imóvel para que nossa equipe faça uma avaliação e entre em contato com você.
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="bg-primary/10 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-lg mb-2">Informações de Contato</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={propertyForm.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={propertyForm.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={propertyForm.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Detalhes do Imóvel</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="propertyType">Tipo de Imóvel *</Label>
                        <Select
                          value={propertyForm.propertyType}
                          onValueChange={(value) => handleSelectChange(value, 'propertyType')}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Apartamento</SelectItem>
                            <SelectItem value="house">Casa</SelectItem>
                            <SelectItem value="commercial">Comercial</SelectItem>
                            <SelectItem value="land">Terreno</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="title">Título do Anúncio *</Label>
                        <Input
                          id="title"
                          name="title"
                          value={propertyForm.title}
                          onChange={handleInputChange}
                          placeholder="Ex: Apartamento em Pinheiros"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Endereço *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={propertyForm.address}
                          onChange={handleInputChange}
                          placeholder="Rua, número, bairro, cidade - Estado"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="area">Área (m²) *</Label>
                        <Input
                          id="area"
                          name="area"
                          type="number"
                          value={propertyForm.area}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price">Preço (R$) *</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={propertyForm.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Quartos</Label>
                        <Input
                          id="bedrooms"
                          name="bedrooms"
                          type="number"
                          min="0"
                          value={propertyForm.bedrooms}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Banheiros</Label>
                        <Input
                          id="bathrooms"
                          name="bathrooms"
                          type="number"
                          min="0"
                          value={propertyForm.bathrooms}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Descrição do Imóvel *</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={propertyForm.description}
                          onChange={handleInputChange}
                          rows={5}
                          placeholder="Descreva as características, diferenciais e estado do imóvel"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label>Fotos do Imóvel</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 mb-2">
                            Arraste imagens ou clique para selecionar
                          </p>
                          <Input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('images')?.click()}
                          >
                            Selecionar Imagens
                          </Button>
                        </div>
                        
                        {propertyForm.images.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Imagens selecionadas:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {propertyForm.images.map((file, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Imóvel ${index + 1}`}
                                    className="h-24 w-full object-cover rounded"
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-1 right-1 rounded-full bg-white/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeImage(index)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="18" y1="6" x2="6" y2="18"></line>
                                      <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    Voltar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Enviar para Avaliação'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <div className="mt-12 bg-primary/5 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Como funciona o processo?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Envio do Imóvel</h3>
                  <p className="text-sm text-gray-600">
                    Preencha o formulário com todos os detalhes e envie para nossa equipe.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Avaliação</h3>
                  <p className="text-sm text-gray-600">
                    Nossa equipe de corretores verificará os dados e fará uma avaliação do imóvel.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Publicação</h3>
                  <p className="text-sm text-gray-600">
                    Após aprovado, seu imóvel será publicado em nosso site e começará a receber visitas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer 
        siteName="ImobiliáriaApp"
        contactEmail="contato@imobiliaria.com"
        contactPhone="(11) 9999-9999"
      />
    </div>
  );
};

export default SubmitPropertyPage;
