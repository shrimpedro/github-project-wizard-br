
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { LockIcon } from 'lucide-react';

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: 'rent' | 'sale';
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  description?: string;
  status?: 'active' | 'pending' | 'archived';
  featured?: boolean;
  isPublic?: boolean;
  images?: string[];
  contactPhone?: string;
  contactEmail?: string;
  fullAddress?: string;
}

interface PropertyCardProps {
  property: Property;
  onClick?: (property: Property) => void;
  showPrivateInfo?: boolean;
}

const formatPrice = (price: number, type: 'rent' | 'sale'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(price) + (type === 'rent' ? '/mês' : '');
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, showPrivateInfo = false }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(property);
    }
  };

  // If the property is not public and we're not showing private info, don't render the card
  if (property.isPublic === false && !showPrivateInfo) {
    return null;
  }

  return (
    <Link to={`/imovel/${property.id}`} onClick={handleClick}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Sem+Imagem';
            }}
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {property.featured && (
              <Badge className="bg-primary text-white px-2 py-1 text-xs rounded-md">
                Destaque
              </Badge>
            )}
            {property.isPublic === false && (
              <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs rounded-md">
                <LockIcon size={12} /> Privado
              </Badge>
            )}
          </div>
        </div>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-lg font-bold">{property.title}</h3>
          <p className="text-sm text-gray-500">
            {showPrivateInfo && property.fullAddress ? property.fullAddress : property.address}
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-xl font-bold text-primary">
            {formatPrice(property.price, property.type)}
          </p>
          {showPrivateInfo && property.contactPhone && (
            <p className="text-sm text-gray-500 mt-2">
              <strong>Contato:</strong> {property.contactPhone}
            </p>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between text-sm text-gray-600 border-t">
          <div>{property.bedrooms} quartos</div>
          <div>{property.bathrooms} banheiros</div>
          <div>{property.area} m²</div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PropertyCard;
