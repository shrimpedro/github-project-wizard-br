
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Property } from '../PropertyCard';
import PropertyTable from './PropertyTable';
import PropertyFormDialog from './PropertyFormDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import PropertySearchBar from './PropertySearchBar';

// Propriedades iniciais para demonstração
const initialProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento em Pinheiros',
    address: 'Pinheiros, São Paulo - SP',
    price: 2500,
    type: 'rent',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: '2',
    title: 'Casa em Vila Madalena',
    address: 'Vila Madalena, São Paulo - SP',
    price: 1200000,
    type: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: '3',
    title: 'Studio na Consolação',
    address: 'Consolação, São Paulo - SP',
    price: 1800,
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 40,
    imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3R1ZGlvJTIwYXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
  },
];

const PropertiesManager = () => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);

  // Filtrar propriedades com base no termo de pesquisa
  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Adicionar nova propriedade
  const handleAddProperty = (newProperty: Omit<Property, 'id'>) => {
    const id = Date.now().toString();
    
    // Ensure all required properties are present
    setProperties([...properties, { 
      id, 
      title: newProperty.title,
      address: newProperty.address,
      price: newProperty.price,
      type: newProperty.type,
      bedrooms: newProperty.bedrooms,
      bathrooms: newProperty.bathrooms,
      area: newProperty.area,
      imageUrl: newProperty.imageUrl,
      description: newProperty.description
    }]);
    
    setIsAddDialogOpen(false);
    toast.success('Imóvel adicionado com sucesso!');
  };

  // Editar propriedade existente
  const handleEditProperty = (updatedProperty: Property) => {
    // Ensure we're using the complete Property type with all required fields
    setProperties(properties.map(property => 
      property.id === updatedProperty.id ? {
        id: updatedProperty.id,
        title: updatedProperty.title,
        address: updatedProperty.address,
        price: updatedProperty.price,
        type: updatedProperty.type,
        bedrooms: updatedProperty.bedrooms,
        bathrooms: updatedProperty.bathrooms,
        area: updatedProperty.area,
        imageUrl: updatedProperty.imageUrl,
        description: updatedProperty.description
      } : property
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

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl">Gerenciamento de Imóveis</CardTitle>
          <Button 
            className="flex items-center gap-1" 
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="h-4 w-4" /> Adicionar Imóvel
          </Button>
        </CardHeader>
        <CardContent>
          <PropertySearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
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
