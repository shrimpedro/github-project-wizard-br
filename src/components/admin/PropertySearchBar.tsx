
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

interface PropertySearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const PropertySearchBar = ({ searchTerm, onSearchChange }: PropertySearchBarProps) => {
  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Buscar imóveis..."
          className="w-full pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PropertySearchBar;
