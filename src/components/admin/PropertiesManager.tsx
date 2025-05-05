
import React, { useState } from 'react';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { toast } from 'sonner';
import { Property } from '../PropertyCard';
import PropertyForm from './PropertyForm';

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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" /> Adicionar Imóvel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Imóvel</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do novo imóvel abaixo.
                </DialogDescription>
              </DialogHeader>
              <PropertyForm onSubmit={handleAddProperty} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar imóveis..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Quartos</TableHead>
                  <TableHead>Área (m²)</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <img 
                            src={property.imageUrl} 
                            alt={property.title} 
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <span>{property.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{property.address}</TableCell>
                      <TableCell>
                        {property.type === 'rent' ? 'Aluguel' : 'Venda'}
                      </TableCell>
                      <TableCell>
                        {property.type === 'rent' 
                          ? `R$ ${property.price}/mês`
                          : `R$ ${property.price.toLocaleString()}`
                        }
                      </TableCell>
                      <TableCell>{property.bedrooms}</TableCell>
                      <TableCell>{property.area}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => prepareForEdit(property)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => prepareForDelete(property)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum imóvel encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Imóvel</DialogTitle>
            <DialogDescription>
              Atualize os detalhes do imóvel abaixo.
            </DialogDescription>
          </DialogHeader>
          {currentProperty && (
            <PropertyForm 
              onSubmit={(formData) => handleEditProperty({ ...formData, id: currentProperty.id })} 
              initialData={currentProperty} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o imóvel "{currentProperty?.title}"? Esta ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteProperty}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertiesManager;
