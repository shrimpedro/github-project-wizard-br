
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import PropertyGrid from '../components/PropertyGrid';
import PropertyDetailModal from '../components/PropertyDetailModal';
import { Property } from '../components/PropertyCard';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { propertyService, siteSettingsService, messageService } from '../services/api';

const HomePage = () => {
  const [settings, setSettings] = useState<any>({});
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [featuredRentals, setFeaturedRentals] = useState<Property[]>([]);
  const [featuredSales, setFeaturedSales] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [propertiesData, siteSettings] = await Promise.all([
          propertyService.getAllProperties(),
          siteSettingsService.getSettings()
        ]);
        
        // Get featured properties or most recently added if not enough featured ones
        const rentals = propertiesData
          .filter(p => p.type === 'rent' && p.status === 'active')
          .sort((a, b) => (a.featured === b.featured) ? 0 : a.featured ? -1 : 1)
          .slice(0, 3);
          
        const sales = propertiesData
          .filter(p => p.type === 'sale' && p.status === 'active')
          .sort((a, b) => (a.featured === b.featured) ? 0 : a.featured ? -1 : 1)
          .slice(0, 3);
        
        setFeaturedRentals(rentals);
        setFeaturedSales(sales);
        setSettings(siteSettings);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erro ao carregar dados do site');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manipular cliques em imóveis
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailOpen(true);
  };

  // Abrir formulário de contato
  const handleContactClick = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailOpen(false);
    setIsContactOpen(true);
  };

  // Atualizar campos do formulário de contato
  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  // Enviar formulário de contato
  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const messageData = {
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        message: contactForm.message,
        property_id: selectedProperty?.id
      };
      
      await messageService.sendMessage(messageData);
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setIsContactOpen(false);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Não foi possível enviar sua mensagem. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header logo={settings.logo} siteName={settings.site_name || "ImobiliáriaApp"} />
      
      <main className="flex-grow">
        <HeroSection 
          title={settings.hero_title || "Encontre seu novo lar"} 
          subtitle={settings.hero_subtitle || "Milhares de imóveis para alugar ou comprar"} 
          backgroundImage={settings.hero_background || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80"} 
        />
        
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Destaques para alugar</h2>
            <Link to="/alugar" className="text-primary hover:underline font-medium">
              Ver todos
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            featuredRentals.length > 0 ? (
              <PropertyGrid 
                properties={featuredRentals} 
                onPropertyClick={handlePropertyClick}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum imóvel para alugar disponível no momento</p>
              </div>
            )
          )}
        </div>
        
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Encontre o imóvel perfeito para você</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Contamos com um time de especialistas prontos para ajudar você a encontrar seu novo lar ou investimento.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 20H6a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v3"></path>
                    <path d="M9 12v-4h6v4"></path>
                    <path d="M9 16h6"></path>
                    <path d="M16 20l2-2 4 4"></path>
                    <path d="M21 15l-2 2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Busque</h3>
                <p className="text-gray-600">
                  Utilize nossa ferramenta de busca avançada para encontrar o imóvel ideal.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"></path>
                    <path d="M19 17V5a2 2 0 0 0-2-2H4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Visite</h3>
                <p className="text-gray-600">
                  Agende visitas online e conheça os imóveis que mais te interessam.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 10h.01"></path>
                    <path d="M15 10h.01"></path>
                    <path d="M12 18H7a2 2 0 0 1-2-2v-1.1a2 2 0 0 1 .6-1.4l.4-.4A7.8 7.8 0 0 1 12 10a7.8 7.8 0 0 1 6 2.9l.4.4a2 2 0 0 1 .6 1.4V16a2 2 0 0 1-2 2h-5z"></path>
                    <path d="M12 18v-2"></path>
                    <rect x="2" y="2" width="20" height="8" rx="2"></rect>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Feche Negócio</h3>
                <p className="text-gray-600">
                  Negocie e firme seu contrato de forma segura e transparente.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Destaques para comprar</h2>
            <Link to="/comprar" className="text-primary hover:underline font-medium">
              Ver todos
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            featuredSales.length > 0 ? (
              <PropertyGrid 
                properties={featuredSales} 
                onPropertyClick={handlePropertyClick}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum imóvel para venda disponível no momento</p>
              </div>
            )
          )}
        </div>
      </main>
      
      <Footer 
        siteName={settings.site_name || "ImobiliáriaApp"} 
        contactEmail={settings.contact_email || "contato@imobiliaria.com"} 
        contactPhone={settings.contact_phone || "(11) 9999-9999"} 
      />
      
      {/* Modal de detalhes do imóvel */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          onContactClick={handleContactClick}
        />
      )}
      
      {/* Modal de contato */}
      {selectedProperty && (
        <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Entre em contato sobre este imóvel</DialogTitle>
              <DialogDescription>
                Preencha o formulário abaixo para enviar uma mensagem sobre {selectedProperty.title}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmitContact}>
              <div className="space-y-4 py-4">
                <div className="flex gap-3 mb-4 bg-gray-50 p-3 rounded-md">
                  <img 
                    src={selectedProperty.imageUrl} 
                    alt={selectedProperty.title} 
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{selectedProperty.title}</h3>
                    <p className="text-sm text-gray-500">{selectedProperty.address}</p>
                    <p className="text-sm font-medium">
                      {selectedProperty.type === 'rent' 
                        ? `R$ ${selectedProperty.price}/mês`
                        : `R$ ${selectedProperty.price.toLocaleString()}`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Seu nome completo" 
                      value={contactForm.name} 
                      onChange={handleContactFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      placeholder="(00) 00000-0000" 
                      value={contactForm.phone} 
                      onChange={handleContactFormChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="seu-email@exemplo.com" 
                    value={contactForm.email} 
                    onChange={handleContactFormChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="Olá, tenho interesse neste imóvel e gostaria de mais informações." 
                    className="min-h-24" 
                    value={contactForm.message} 
                    onChange={handleContactFormChange}
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Enviar Mensagem</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default HomePage;
