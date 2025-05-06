
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

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
  status?: string; // Adding the missing status property
  featured?: boolean; // Adding the missing featured property
}

interface PropertyCardProps {
  property: Property;
  onClick?: (property: Property) => void;
}

const formatPrice = (price: number, type: 'rent' | 'sale'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(price) + (type === 'rent' ? '/mês' : '');
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(property);
    }
  };

  return (
    <Link to={`/imovel/${property.id}`} onClick={handleClick}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {property.featured && (
            <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 text-xs rounded-md">
              Destaque
            </div>
          )}
        </div>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-lg font-bold">{property.title}</h3>
          <p className="text-sm text-gray-500">{property.address}</p>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-xl font-bold text-primary">
            {formatPrice(property.price, property.type)}
          </p>
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
