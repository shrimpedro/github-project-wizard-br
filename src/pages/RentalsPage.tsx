
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyGrid from '@/components/PropertyGrid';
import PropertyDetailModal from '@/components/PropertyDetailModal';
import { propertyService } from '@/services/api';
import { toast } from 'sonner';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: 'rent' | 'sale';
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  description: string;
  status: string;
  featured: boolean;
}

interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
}

const RentalsPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;
  
  const location = useLocation();
  
  // Get properties on component mount
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setIsLoading(true);
        const data = await propertyService.getPropertyByType('rent');
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error('Error loading properties:', error);
        toast.error('Não foi possível carregar os imóveis');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProperties();
  }, []);
  
  // Handle search and filter
  useEffect(() => {
    let result = [...properties];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        property => 
          property.title.toLowerCase().includes(query) || 
          property.address.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query)
      );
    }
    
    // Apply price filters
    if (filters.minPrice) {
      result = result.filter(property => property.price >= (filters.minPrice || 0));
    }
    
    if (filters.maxPrice) {
      result = result.filter(property => property.price <= (filters.maxPrice || Infinity));
    }
    
    // Apply bedroom filter
    if (filters.bedrooms) {
      result = result.filter(property => property.bedrooms >= (filters.bedrooms || 0));
    }
    
    // Apply bathroom filter
    if (filters.bathrooms) {
      result = result.filter(property => property.bathrooms >= (filters.bathrooms || 0));
    }
    
    // Apply area filters
    if (filters.minArea) {
      result = result.filter(property => property.area >= (filters.minArea || 0));
    }
    
    if (filters.maxArea) {
      result = result.filter(property => property.area <= (filters.maxArea || Infinity));
    }
    
    setFilteredProperties(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, filters, properties]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  const currentProperties = filteredProperties.slice(
    (currentPage - 1) * propertiesPerPage,
    currentPage * propertiesPerPage
  );
  
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };
  
  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery('');
  };
  
  const handleContactClick = (property: Property) => {
    // In a real app, this would show a contact form or redirect to a contact page
    toast.success(`Solicitação de contato para: ${property.title}`);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header siteName="ImobiliáriaApp" />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Imóveis para Alugar</h1>
          
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <PropertyFilters 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium">Nenhum imóvel encontrado</h3>
                  <p className="mt-2 text-muted-foreground">
                    Tente ajustar seus filtros de busca
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleResetFilters}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              ) : (
                <>
                  <PropertyGrid 
                    properties={currentProperties}
                    onPropertyClick={handlePropertyClick}
                  />
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mt-8">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <span className="text-sm">
                        Página {currentPage} de {totalPages}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onContactClick={handleContactClick}
        />
      )}
      
      <Footer siteName="ImobiliáriaApp" contactEmail="contato@imobiliaria.com" contactPhone="(11) 9999-9999" />
    </div>
  );
};

export default RentalsPage;
