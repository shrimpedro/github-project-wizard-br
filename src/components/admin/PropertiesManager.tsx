
import React, { useState } from 'react';
import { PlusCircle, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Property } from '../PropertyCard';
import PropertyTable from './PropertyTable';
import PropertyFormDialog from './PropertyFormDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import PropertySearchBar, { PropertyFilters } from './PropertySearchBar';
import { exportPropertiesToExcel } from '@/utils/exportUtils';

// Propriedades iniciais para demonstração
const initialProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento em Pinheiros',
    address: 'Pinheiros, São Paulo - SP',
    fullAddress: 'Rua dos Pinheiros, 123, Apto 45 - Pinheiros, São Paulo - SP',
    price: 2500,
    type: 'rent',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    contactPhone: '(11) 98765-4321',
    contactEmail: 'contato@example.com',
    isPublic: true,
    status: 'active',
    featured: false,
    images: []
  },
  {
    id: '2',
    title: 'Casa em Vila Madalena',
    address: 'Vila Madalena, São Paulo - SP',
    fullAddress: 'Rua Aspicuelta, 456 - Vila Madalena, São Paulo - SP',
    price: 1200000,
    type: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    contactPhone: '(11) 98765-4321',
    contactEmail: 'contato@example.com',
    isPublic: true,
    status: 'active',
    featured: true,
    images: []
  },
  {
    id: '3',
    title: 'Studio na Consolação',
    address: 'Consolação, São Paulo - SP',
    fullAddress: 'Rua da Consolação, 789, Apto 12 - Consolação, São Paulo - SP',
    price: 1800,
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 40,
    imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3R1ZGlvJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    contactPhone: '(11) 98765-4321',
    contactEmail: 'contato@example.com',
    isPublic: false,
    status: 'active',
    featured: false,
    images: []
  },
];

const PropertiesManager = () => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);

  // Filtrar propriedades com base no termo de pesquisa e filtros
  const filteredProperties = properties.filter(property => {
    // Search term filter
    const matchesSearchTerm = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearchTerm) return false;
    
    // Type filter
    if (filters.type && filters.type !== 'all' && property.type !== filters.type) {
      return false;
    }
    
    // Status filter
    if (filters.status && filters.status !== 'all' && property.status !== filters.status) {
      return false;
    }
    
    // Min price filter
    if (filters.minPrice && property.price < filters.minPrice) {
      return false;
    }
    
    // Max price filter
    if (filters.maxPrice && property.price > filters.maxPrice) {
      return false;
    }
    
    // Bedrooms filter
    if (filters.bedrooms && filters.bedrooms > 0 && property.bedrooms < filters.bedrooms) {
      return false;
    }
    
    // Visibility filter
    if (filters.isPublic !== undefined && property.isPublic !== filters.isPublic) {
      return false;
    }
    
    return true;
  });

  // Adicionar nova propriedade
  const handleAddProperty = (newProperty: Omit<Property, 'id'>) => {
    const id = Date.now().toString();
    
    // Ensure all required properties are present
    setProperties([...properties, { 
      id, 
      ...newProperty,
      status: newProperty.status || 'active'
    }]);
    
    setIsAddDialogOpen(false);
    toast.success('Imóvel adicionado com sucesso!');
  };

  // Editar propriedade existente
  const handleEditProperty = (updatedProperty: Property) => {
    setProperties(properties.map(property => 
      property.id === updatedProperty.id ? updatedProperty : property
    ));
    
    setIsEditDialogOpen(false);
    toast.success('Imóvel atualizado com sucesso!');
  };

  // Excluir propriedade
  const handleDeleteProperty = () => {
    if (currentProperty) {
      setProperties(properties.filter(property => property.id !== currentProperty.id));
      setIsDeleteDialogOpen(false);
      toast.success('Imóvel removido com sucesso!');
    }
  };

  // Preparar para edição
  const prepareForEdit = (property: Property) => {
    setCurrentProperty(property);
    setIsEditDialogOpen(true);
  };

  // Preparar para exclusão
  const prepareForDelete = (property: Property) => {
    setCurrentProperty(property);
    setIsDeleteDialogOpen(true);
  };

  // Exportar propriedades para Excel
  const handleExportToExcel = () => {
    try {
      exportPropertiesToExcel(filteredProperties);
      toast.success('Imóveis exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar imóveis:', error);
      toast.error('Erro ao exportar imóveis. Tente novamente.');
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl">Gerenciamento de Imóveis</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              className="flex items-center gap-1" 
              onClick={handleExportToExcel}
            >
              <FileSpreadsheet className="h-4 w-4" /> Exportar Excel
            </Button>
            <Button 
              className="flex items-center gap-1" 
              onClick={() => setIsAddDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4" /> Adicionar Imóvel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PropertySearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm}
            onFilterChange={setFilters}
          />
          <PropertyTable 
            properties={filteredProperties} 
            onEdit={prepareForEdit} 
            onDelete={prepareForDelete} 
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <PropertyFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddProperty}
        isEditing={false}
      />
      
      <PropertyFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditProperty}
        initialData={currentProperty || undefined}
        isEditing={true}
      />
      
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteProperty}
        title={currentProperty?.title || ''}
      />
    </div>
  );
};

export default PropertiesManager;
