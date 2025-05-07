
import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Slider } from './ui/slider';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

export interface FilterValues {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
}

interface PropertyFilterProps {
  onFilterChange: (filters: FilterValues) => void;
  filters?: FilterValues;
  initialFilters?: Partial<FilterValues>;
  onResetFilters?: () => void;
}

const PropertyFilters: React.FC<PropertyFilterProps> = ({ 
  onFilterChange,
  filters = {},
  initialFilters = {},
  onResetFilters
}) => {
  const [localFilters, setLocalFilters] = useState<FilterValues>({
    minPrice: filters.minPrice || initialFilters.minPrice,
    maxPrice: filters.maxPrice || initialFilters.maxPrice,
    bedrooms: filters.bedrooms || initialFilters.bedrooms,
    bathrooms: filters.bathrooms || initialFilters.bathrooms,
    minArea: filters.minArea || initialFilters.minArea,
    maxArea: filters.maxArea || initialFilters.maxArea,
  });

  const [expanded, setExpanded] = useState(true);

  // Update local filters when external filters change
  useEffect(() => {
    setLocalFilters({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      minArea: filters.minArea,
      maxArea: filters.maxArea,
    });
  }, [filters]);

  // Apply initial filters on mount
  useEffect(() => {
    if (Object.values(initialFilters).some(val => val !== undefined)) {
      onFilterChange(localFilters);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    const numberValue = value === '' ? undefined : Number(value);
    setLocalFilters(prev => ({
      ...prev,
      [field]: numberValue
    }));
  };

  const handleSelectChange = (field: keyof FilterValues, value: string) => {
    const numberValue = value === 'any' ? undefined : Number(value);
    setLocalFilters(prev => ({
      ...prev,
      [field]: numberValue
    }));

    // Auto-apply filter when dropdown selection changes
    onFilterChange({
      ...localFilters,
      [field]: numberValue
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterValues = {
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      minArea: undefined,
      maxArea: undefined,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    if (onResetFilters) {
      onResetFilters();
    }
  };

  return (
    <Card className="shadow-sm border rounded-lg overflow-hidden">
      <div className="bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h3 className="font-medium">Filtros</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Limpar
            </Button>
            <Button size="sm" onClick={handleApplyFilters}>
              Aplicar
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-3">Faixa de Preço</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="minPrice">Mínimo (R$)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="Mínimo"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handleInputChange('minPrice', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxPrice">Máximo (R$)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="Máximo"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Separator />
          
          {/* Bedrooms & Bathrooms */}
          <div>
            <h4 className="font-medium mb-3">Dormitórios e Banheiros</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Quartos</Label>
                <Select
                  value={localFilters.bedrooms?.toString() || 'any'}
                  onValueChange={(value) => handleSelectChange('bedrooms', value)}
                >
                  <SelectTrigger id="bedrooms" className="mt-1">
                    <SelectValue placeholder="Qualquer" />
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
              <div>
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Select
                  value={localFilters.bathrooms?.toString() || 'any'}
                  onValueChange={(value) => handleSelectChange('bathrooms', value)}
                >
                  <SelectTrigger id="bathrooms" className="mt-1">
                    <SelectValue placeholder="Qualquer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Qualquer</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />
          
          {/* Area Range */}
          <div>
            <h4 className="font-medium mb-3">Área (m²)</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="minArea">Mínima</Label>
                <Input
                  id="minArea"
                  type="number"
                  placeholder="Mín"
                  value={localFilters.minArea || ''}
                  onChange={(e) => handleInputChange('minArea', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxArea">Máxima</Label>
                <Input
                  id="maxArea"
                  type="number"
                  placeholder="Máx"
                  value={localFilters.maxArea || ''}
                  onChange={(e) => handleInputChange('maxArea', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyFilters;
