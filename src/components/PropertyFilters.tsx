
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
import { Card } from './ui/card';

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

  const [expanded, setExpanded] = useState(false);

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
    const numberValue = value === '' ? undefined : Number(value);
    setLocalFilters(prev => ({
      ...prev,
      [field]: numberValue
    }));
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
    <Card className="p-4 mb-6">
      <Accordion
        type="single"
        collapsible
        value={expanded ? "filters" : ""}
        onValueChange={(value) => setExpanded(value === "filters")}
      >
        <AccordionItem value="filters" className="border-none">
          <div className="flex items-center justify-between">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filtros</span>
              </div>
            </AccordionTrigger>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Limpar
              </Button>
              <Button size="sm" onClick={handleApplyFilters}>
                Aplicar
              </Button>
            </div>
          </div>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="minPrice">Preço Mínimo (R$)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="Min"
                    value={localFilters.minPrice || ''}
                    onChange={(e) => handleInputChange('minPrice', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice">Preço Máximo (R$)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxPrice || ''}
                    onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bedrooms">Quartos</Label>
                  <Select
                    value={localFilters.bedrooms?.toString() || ''}
                    onValueChange={(value) => handleSelectChange('bedrooms', value)}
                  >
                    <SelectTrigger id="bedrooms">
                      <SelectValue placeholder="Qualquer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Qualquer</SelectItem>
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
                    value={localFilters.bathrooms?.toString() || ''}
                    onValueChange={(value) => handleSelectChange('bathrooms', value)}
                  >
                    <SelectTrigger id="bathrooms">
                      <SelectValue placeholder="Qualquer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Qualquer</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="minArea">Área Mínima (m²)</Label>
                  <Input
                    id="minArea"
                    type="number"
                    placeholder="Min"
                    value={localFilters.minArea || ''}
                    onChange={(e) => handleInputChange('minArea', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxArea">Área Máxima (m²)</Label>
                  <Input
                    id="maxArea"
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxArea || ''}
                    onChange={(e) => handleInputChange('maxArea', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default PropertyFilters;
