
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Property } from './PropertyCard';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Home, MapPin, MessageSquare } from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactClick: (property: Property) => void;
}

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  open,
  onOpenChange,
  onContactClick,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{property.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-video rounded-md overflow-hidden">
            <img 
              src={property.imageUrl} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Home className="h-3 w-3" />
              {property.type === 'rent' ? 'Aluguel' : 'Venda'}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              {property.bathrooms} {property.bathrooms === 1 ? 'banheiro' : 'banheiros'}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              {property.area}m²
            </Badge>
            
            <Badge className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
              {property.type === 'rent' 
                ? `R$ ${property.price}/mês`
                : `R$ ${property.price.toLocaleString()}`
              }
            </Badge>
          </div>
          
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{property.address}</span>
          </div>
          
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="location">Localização</TabsTrigger>
              <TabsTrigger value="photos">Fotos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sobre este imóvel</h3>
                <p className="text-gray-600">
                  {property.description || 
                    `Este ${property.type === 'rent' ? 'apartamento para alugar' : 'imóvel à venda'} 
                    possui ${property.bedrooms} ${property.bedrooms === 1 ? 'quarto' : 'quartos'}, 
                    ${property.bathrooms} ${property.bathrooms === 1 ? 'banheiro' : 'banheiros'} 
                    e ${property.area}m². Localizado em ${property.address}.`
                  }
                </p>
                
                <h3 className="text-lg font-medium">Características</h3>
                <ul className="grid grid-cols-2 gap-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>{property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>{property.bathrooms} {property.bathrooms === 1 ? 'banheiro' : 'banheiros'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>{property.area}m²</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Área de serviço</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Cozinha equipada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Água e gás individuais</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="location" className="pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Localização</h3>
                <p className="text-gray-600">{property.address}</p>
                <div className="aspect-video rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <p className="text-gray-500">Mapa indisponível</p>
                    <p className="text-sm text-gray-400">
                      Em uma implementação real, aqui seria exibido um mapa interativo
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="photos" className="pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Fotos do imóvel</h3>
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src={property.imageUrl} 
                    alt={property.title} 
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Mais fotos seriam exibidas aqui</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4">
            <div>
              <p className="text-lg font-bold">
                {property.type === 'rent' 
                  ? `R$ ${property.price}/mês`
                  : `R$ ${property.price.toLocaleString()}`
                }
              </p>
              {property.type === 'rent' && (
                <p className="text-sm text-gray-500">+ IPTU e condomínio</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">Agendar Visita</Button>
              <Button 
                className="flex items-center gap-1"
                onClick={() => onContactClick(property)}
              >
                <MessageSquare className="h-4 w-4" /> Entrar em Contato
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailModal;
