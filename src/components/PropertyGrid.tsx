
import React from 'react';
import PropertyCard, { Property } from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  title?: string;
  onPropertyClick?: (property: Property) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ properties, title, onPropertyClick }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property}
            onClick={() => onPropertyClick && onPropertyClick(property)}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid;
