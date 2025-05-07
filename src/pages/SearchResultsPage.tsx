
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyGrid from '@/components/PropertyGrid';
import PropertyDetailModal from '@/components/PropertyDetailModal';
import { toast } from 'sonner';
import { Property } from '@/components/PropertyCard';
import { supabase } from '@/integrations/supabase/client';

interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
}

const SearchResultsPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  // Get properties on component mount
  useEffect(() => {
    const loadProperties = async () => {
      if (!searchQuery.trim()) {
        navigate('/');
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Get all active and public properties from Supabase
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'active')
          .eq('isPublic', true);
        
        if (error) throw error;
        
        if (!data) {
          setProperties([]);
          setFilteredProperties([]);
          setIsLoading(false);
          return;
        }
        
        // Format the data to match the Property interface
        const formattedData: Property[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          address: item.address,
          fullAddress: item.fullAddress || item.address,
          price: item.price,
          type: item.type,
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms || 1,
          area: item.area,
          imageUrl: item.imageurl,
          description: item.description || '',
          status: item.status,
          featured: item.featured || false,
          isPublic: item.isPublic !== false,
          images: item.images || []
        }));
        
        setProperties(formattedData);
        
        // Filter properties based on search query
        const searchResults = formattedData.filter(property => {
          const query = searchQuery.toLowerCase();
          return (
            property.title.toLowerCase().includes(query) ||
            property.address.toLowerCase().includes(query) ||
            property.type.toLowerCase().includes(query) ||
            (property.description && property.description.toLowerCase().includes(query))
          );
        });
        
        setFilteredProperties(searchResults);
        
        // Get random recommended properties if search results are few
        if (searchResults.length < 3) {
          const recommended = formattedData
            .filter(p => !searchResults.find(s => s.id === p.id))
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
            
          setRecommendedProperties(recommended);
        }
        
      } catch (error) {
        console.error('Error loading properties:', error);
        toast.error('Não foi possível carregar os imóveis');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProperties();
  }, [searchQuery, navigate]);
  
  // Handle search and filter
  useEffect(() => {
    if (!properties.length) return;
    
    let result = [...properties];
    
    // Search filter
    const query = searchQuery.toLowerCase();
    result = result.filter(
      property => 
        property.title.toLowerCase().includes(query) || 
        property.address.toLowerCase().includes(query) ||
        property.type.toLowerCase().includes(query) ||
        (property.description && property.description.toLowerCase().includes(query))
    );
    
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
  }, [filters, properties, searchQuery]);
  
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
    navigate(`/busca?q=${encodeURIComponent(query.trim())}`);
  };
  
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };
  
  const handleResetFilters = () => {
    setFilters({});
  };
  
  const handleContactClick = (property: Property) => {
    toast.success(`Solicitação de contato para: ${property.title}`);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header siteName="ImobiliáriaApp" />
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Resultados da busca: "{searchQuery}"</h1>
          
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-80 flex-shrink-0">
              <PropertyFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </div>
            
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="space-y-6">
                  <div className="text-center py-12 bg-muted rounded-lg">
                    <h3 className="text-lg font-medium">Nenhum imóvel encontrado para "{searchQuery}"</h3>
                    <p className="mt-2 text-muted-foreground">
                      Tente fazer uma busca com termos mais genéricos ou ajuste seus filtros
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={handleResetFilters}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                  
                  {recommendedProperties.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Recomendados para você</h3>
                      <PropertyGrid 
                        properties={recommendedProperties}
                        onPropertyClick={handlePropertyClick}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-4 text-muted-foreground">
                    <p>{filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}</p>
                  </div>
                  
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

export default SearchResultsPage;
