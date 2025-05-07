
import React, { useState } from 'react';
import { Search, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../ui/popover';

interface PropertySearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterChange?: (filters: PropertyFilters) => void;
}

export interface PropertyFilters {
  type?: 'all' | 'rent' | 'sale';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  status?: 'all' | 'active' | 'pending' | 'archived';
  isPublic?: boolean;
}

const PropertySearchBar = ({ 
  searchTerm, 
  onSearchChange,
  onFilterChange
}: PropertySearchBarProps) => {
  const [filters, setFilters] = useState<PropertyFilters>({
    type: 'all',
    status: 'all'
  });
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleResetFilters = () => {
    const defaultFilters: PropertyFilters = {
      type: 'all',
      status: 'all',
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      isPublic: undefined
    };
    setFilters(defaultFilters);
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onFilterChange && onFilterChange(filters);
    }
  };

  return (
    <div className="mb-6">
      <div className="relative flex items-center w-full mb-2">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Buscar imóveis por título, endereço..."
          className="w-full pl-8 pr-20"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute right-0 mr-1 flex items-center gap-1"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <Filter className="h-4 w-4" />
          Filtros
          {isFiltersOpen ? 
            <ChevronUp className="h-3 w-3" /> : 
            <ChevronDown className="h-3 w-3" />
          }
        </Button>
      </div>
      
      {isFiltersOpen && (
        <div className="bg-white border rounded-lg shadow-md p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select 
                value={filters.type} 
                onValueChange={(value: 'all' | 'rent' | 'sale') => handleFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="rent">Aluguel</SelectItem>
                  <SelectItem value="sale">Venda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={filters.status} 
                onValueChange={(value: 'all' | 'active' | 'pending' | 'archived') => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="archived">Arquivados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Visibilidade</label>
              <Select
                value={filters.isPublic !== undefined ? (filters.isPublic ? 'public' : 'private') : 'all'}
                onValueChange={(value) => {
                  if (value === 'all') {
                    handleFilterChange('isPublic', undefined);
                  } else {
                    handleFilterChange('isPublic', value === 'public');
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="public">Públicas</SelectItem>
                  <SelectItem value="private">Privadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Preço Mínimo (R$)</label>
              <Input
                type="number"
                placeholder="Mínimo"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Preço Máximo (R$)</label>
              <Input
                type="number"
                placeholder="Máximo"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Quartos</label>
              <Select 
                value={filters.bedrooms?.toString() || 'any'} 
                onValueChange={(value) => handleFilterChange('bedrooms', value === 'any' ? undefined : Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer quantidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Qualquer</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={handleResetFilters}>Limpar</Button>
            <Button onClick={() => onFilterChange && onFilterChange(filters)}>Aplicar</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySearchBar;
