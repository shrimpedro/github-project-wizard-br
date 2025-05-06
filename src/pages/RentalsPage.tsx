
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyGrid from '../components/PropertyGrid';
import PropertyDetailModal from '../components/PropertyDetailModal';
import { Property } from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import { propertyService, siteSettingsService } from '../services/api';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

const RentalsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Get filter values from URL params
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const minBedrooms = searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined;
  const minBathrooms = searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined;
  const minArea = searchParams.get('minArea') ? Number(searchParams.get('minArea')) : undefined;
  const maxArea = searchParams.get('maxArea') ? Number(searchParams.get('maxArea')) : undefined;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [propertiesData, siteSettings] = await Promise.all([
          propertyService.getAllProperties(),
          siteSettingsService.getSettings()
        ]);
        
        // Filter only for rent properties
        const rentProperties = propertiesData.filter(property => 
          property.type === 'rent' && property.status === 'active'
        );
        
        setProperties(rentProperties);
        setSettings(siteSettings);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Não foi possível carregar os imóveis');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    let filtered = [...properties];
    
    if (minPrice) {
      filtered = filtered.filter(property => property.price >= minPrice);
    }
    
    if (maxPrice) {
      filtered = filtered.filter(property => property.price <= maxPrice);
    }
    
    if (minBedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= minBedrooms);
    }
    
    if (minBathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= minBathrooms);
    }
    
    if (minArea) {
      filtered = filtered.filter(property => property.area >= minArea);
    }
    
    if (maxArea) {
      filtered = filtered.filter(property => property.area <= maxArea);
    }
    
    setFilteredProperties(filtered);
  }, [properties, minPrice, maxPrice, minBedrooms, minBathrooms, minArea, maxArea]);

  const handleFilterChange = (filters: any) => {
    // Update URL with filters
    setSearchParams({
      minPrice: filters.minPrice ? filters.minPrice.toString() : '',
      maxPrice: filters.maxPrice ? filters.maxPrice.toString() : '',
      bedrooms: filters.bedrooms ? filters.bedrooms.toString() : '',
      bathrooms: filters.bathrooms ? filters.bathrooms.toString() : '',
      minArea: filters.minArea ? filters.minArea.toString() : '',
      maxArea: filters.maxArea ? filters.maxArea.toString() : '',
    });
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header logo={settings.logo} siteName={settings.site_name || "ImobiliáriaApp"} />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Imóveis para Alugar</h1>
            
            <PropertyFilters 
              onFilterChange={handleFilterChange}
              initialFilters={{
                minPrice,
                maxPrice,
                bedrooms: minBedrooms,
                bathrooms: minBathrooms,
                minArea,
                maxArea
              }}
            />
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredProperties.length > 0 ? (
                  <PropertyGrid 
                    properties={filteredProperties} 
                    onPropertyClick={handlePropertyClick}
                  />
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-700">Nenhum imóvel encontrado</h3>
                    <p className="text-gray-500 mt-2">Tente ajustar os filtros para ver mais opções</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer 
        siteName={settings.site_name || "ImobiliáriaApp"} 
        contactEmail={settings.contact_email || "contato@imobiliaria.com"} 
        contactPhone={settings.contact_phone || "(11) 9999-9999"} 
      />
      
      {/* Modal de detalhes do imóvel */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}
    </div>
  );
};

export default RentalsPage;
