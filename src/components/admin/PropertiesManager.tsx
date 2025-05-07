
import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, FileSpreadsheet, Upload, Download, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Property } from '../PropertyCard';
import PropertyTable from './PropertyTable';
import PropertyFormDialog from './PropertyFormDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import PropertySearchBar, { PropertyFilters } from './PropertySearchBar';
import { exportPropertiesToExcel } from '@/utils/exportUtils';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

const PropertiesManager = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch properties from database
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*');

        if (error) throw error;

        if (data) {
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
            images: item.images || [],
            contactPhone: item.contactPhone,
            contactEmail: item.contactEmail
          }));
          
          setProperties(formattedData);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Erro ao carregar imóveis');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on search term and filters
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

  // Add new property
  const handleAddProperty = async (newProperty: Omit<Property, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([{ 
          title: newProperty.title,
          address: newProperty.address,
          fullAddress: newProperty.fullAddress || newProperty.address,
          price: newProperty.price,
          type: newProperty.type,
          bedrooms: newProperty.bedrooms,
          bathrooms: newProperty.bathrooms || 1,
          area: newProperty.area,
          imageurl: newProperty.imageUrl,
          description: newProperty.description || '',
          status: newProperty.status || 'active',
          featured: newProperty.featured || false,
          isPublic: newProperty.isPublic !== false
        }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        // Format the newly added property to match the Property interface
        const addedProperty: Property = {
          id: data[0].id,
          title: data[0].title,
          address: data[0].address,
          fullAddress: data[0].fullAddress || data[0].address,
          price: data[0].price,
          type: data[0].type,
          bedrooms: data[0].bedrooms,
          bathrooms: data[0].bathrooms || 1,
          area: data[0].area,
          imageUrl: data[0].imageurl,
          description: data[0].description || '',
          status: data[0].status,
          featured: data[0].featured || false,
          isPublic: data[0].isPublic !== false,
          images: []
        };

        setProperties([...properties, addedProperty]);
        setIsAddDialogOpen(false);
        toast.success('Imóvel adicionado com sucesso!');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Erro ao adicionar imóvel');
    }
  };

  // Edit existing property
  const handleEditProperty = async (updatedProperty: Property) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          title: updatedProperty.title,
          address: updatedProperty.address,
          fullAddress: updatedProperty.fullAddress || updatedProperty.address,
          price: updatedProperty.price,
          type: updatedProperty.type,
          bedrooms: updatedProperty.bedrooms,
          bathrooms: updatedProperty.bathrooms || 1,
          area: updatedProperty.area,
          imageurl: updatedProperty.imageUrl,
          description: updatedProperty.description || '',
          status: updatedProperty.status,
          featured: updatedProperty.featured,
          isPublic: updatedProperty.isPublic
        })
        .eq('id', updatedProperty.id);

      if (error) throw error;

      setProperties(properties.map(property => 
        property.id === updatedProperty.id ? updatedProperty : property
      ));
      
      setIsEditDialogOpen(false);
      toast.success('Imóvel atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Erro ao atualizar imóvel');
    }
  };

  // Delete property
  const handleDeleteProperty = async () => {
    if (currentProperty) {
      try {
        const { error } = await supabase
          .from('properties')
          .delete()
          .eq('id', currentProperty.id);

        if (error) throw error;

        setProperties(properties.filter(property => property.id !== currentProperty.id));
        setIsDeleteDialogOpen(false);
        toast.success('Imóvel removido com sucesso!');
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Erro ao remover imóvel');
      }
    }
  };

  // Toggle property visibility (public/private)
  const handleToggleVisibility = async (property: Property) => {
    try {
      const newVisibility = !property.isPublic;
      
      const { error } = await supabase
        .from('properties')
        .update({ isPublic: newVisibility })
        .eq('id', property.id);

      if (error) throw error;

      setProperties(properties.map(p => 
        p.id === property.id ? { ...p, isPublic: newVisibility } : p
      ));
      
      toast.success(`Imóvel agora é ${newVisibility ? 'público' : 'privado'}`);
    } catch (error) {
      console.error('Error toggling property visibility:', error);
      toast.error('Erro ao alterar visibilidade do imóvel');
    }
  };

  // Toggle property featured status
  const handleToggleFeatured = async (property: Property) => {
    try {
      const newFeatured = !property.featured;
      
      const { error } = await supabase
        .from('properties')
        .update({ featured: newFeatured })
        .eq('id', property.id);

      if (error) throw error;

      setProperties(properties.map(p => 
        p.id === property.id ? { ...p, featured: newFeatured } : p
      ));
      
      toast.success(`Imóvel ${newFeatured ? 'destacado' : 'removido dos destaques'}`);
    } catch (error) {
      console.error('Error toggling property featured status:', error);
      toast.error('Erro ao alterar destaque do imóvel');
    }
  };

  // Change property status
  const handleChangeStatus = async (property: Property, status: 'active' | 'pending' | 'archived') => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', property.id);

      if (error) throw error;

      setProperties(properties.map(p => 
        p.id === property.id ? { ...p, status } : p
      ));
      
      toast.success(`Status do imóvel alterado para ${status}`);
    } catch (error) {
      console.error('Error changing property status:', error);
      toast.error('Erro ao alterar status do imóvel');
    }
  };

  // Prepare for editing
  const prepareForEdit = (property: Property) => {
    setCurrentProperty(property);
    setIsEditDialogOpen(true);
  };

  // Prepare for deletion
  const prepareForDelete = (property: Property) => {
    setCurrentProperty(property);
    setIsDeleteDialogOpen(true);
  };

  // Export properties to Excel
  const handleExportToExcel = () => {
    try {
      exportPropertiesToExcel(filteredProperties);
      toast.success('Imóveis exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar imóveis:', error);
      toast.error('Erro ao exportar imóveis. Tente novamente.');
    }
  };

  // Handle import button click
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Import properties from Excel
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) return;

        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast.error('Arquivo vazio ou sem dados válidos');
          return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const item of jsonData) {
          const property: any = {
            title: item.title,
            address: item.address,
            fullAddress: item.fullAddress || item.address,
            price: Number(item.price),
            type: item.type === 'Venda' ? 'sale' : 'rent',
            bedrooms: Number(item.bedrooms),
            bathrooms: Number(item.bathrooms || 1),
            area: Number(item.area),
            imageurl: item.imageUrl || '',
            description: item.description || '',
            status: item.status || 'active',
            featured: Boolean(item.featured) || false,
            isPublic: Boolean(item.isPublic) !== false
          };

          try {
            const { error } = await supabase
              .from('properties')
              .insert([property]);

            if (error) throw error;
            successCount++;
          } catch (error) {
            console.error('Error importing property:', error);
            errorCount++;
          }
        }

        if (successCount > 0) {
          // Refresh properties list
          const { data, error } = await supabase
            .from('properties')
            .select('*');

          if (error) throw error;

          if (data) {
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
          }

          toast.success(`${successCount} imóveis importados com sucesso!`);
        }

        if (errorCount > 0) {
          toast.error(`Erro ao importar ${errorCount} imóveis`);
        }
      } catch (error) {
        console.error('Error processing Excel file:', error);
        toast.error('Erro ao processar arquivo Excel');
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      toast.error('Erro ao ler o arquivo');
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl">Gerenciamento de Imóveis</CardTitle>
          <div className="flex space-x-2">
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={fileInputRef}
              onChange={handleImportExcel}
              className="hidden"
            />
            <Button 
              variant="outline"
              className="flex items-center gap-1" 
              onClick={handleImportClick}
            >
              <Upload className="h-4 w-4" /> Importar Excel
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-1" 
              onClick={handleExportToExcel}
            >
              <Download className="h-4 w-4" /> Exportar Excel
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
            onToggleVisibility={handleToggleVisibility}
            onToggleFeatured={handleToggleFeatured}
            onChangeStatus={handleChangeStatus}
            isLoading={isLoading}
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
