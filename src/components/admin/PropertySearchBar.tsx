
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
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
      bedrooms: undefined
    };
    setFilters(defaultFilters);
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  return (
    <div className="mb-4 flex flex-col space-y-2">
      <div className="relative flex items-center w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Buscar imóveis por título, endereço..."
          className="w-full pl-8 pr-20"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute right-0 mr-1 flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Filtros de Busca</h4>
                <p className="text-sm text-muted-foreground">
                  Refine sua busca com filtros específicos
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-2">
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
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Preço Min (R$)</label>
                    <Input
                      type="number"
                      placeholder="Mínimo"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Preço Max (R$)</label>
                    <Input
                      type="number"
                      placeholder="Máximo"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Quartos</label>
                  <Select 
                    value={filters.bedrooms?.toString() || '0'} 
                    onValueChange={(value) => handleFilterChange('bedrooms', value ? Number(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer quantidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Qualquer</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" onClick={handleResetFilters}>Limpar</Button>
                  <Button onClick={() => onFilterChange && onFilterChange(filters)}>Aplicar</Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PropertySearchBar;
