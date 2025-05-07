
import React from 'react';
import { Edit, Trash2, Eye, EyeOff, Star, StarOff, MoreHorizontal, Check } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Property } from '../PropertyCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from '../ui/skeleton';

interface PropertyTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
  onToggleVisibility?: (property: Property) => void;
  onToggleFeatured?: (property: Property) => void;
  onChangeStatus?: (property: Property, status: 'active' | 'pending' | 'archived') => void;
  isLoading?: boolean;
}

const PropertyTable = ({ 
  properties, 
  onEdit, 
  onDelete,
  onToggleVisibility,
  onToggleFeatured,
  onChangeStatus,
  isLoading = false
}: PropertyTableProps) => {
  // Helper function to format price
  const formatPrice = (price: number, type: 'rent' | 'sale'): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price) + (type === 'rent' ? '/mês' : '');
  };

  // Helper function to get status badge
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Ativo</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pendente</Badge>;
      case 'archived':
        return <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">Arquivado</Badge>;
      default:
        return <Badge variant="outline">Ativo</Badge>;
    }
  };

  if (isLoading) {
    return (
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
              <TableHead>Visibilidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
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
            <TableHead>Visibilidade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length > 0 ? (
            properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <img 
                      src={property.imageUrl} 
                      alt={property.title} 
                      className="h-10 w-10 rounded-md object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Sem+Imagem';
                      }}
                    />
                    <div className="flex flex-col">
                      <span>{property.title}</span>
                      {property.featured && (
                        <Badge className="mt-1 w-fit bg-primary text-white px-2 py-0.5 text-xs rounded-md">
                          Destaque
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{property.address}</TableCell>
                <TableCell>
                  {property.type === 'rent' ? 'Aluguel' : 'Venda'}
                </TableCell>
                <TableCell>
                  {formatPrice(property.price, property.type)}
                </TableCell>
                <TableCell>{property.bedrooms}</TableCell>
                <TableCell>{property.area}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onToggleVisibility && onToggleVisibility(property)}
                    className={`flex items-center gap-1 ${property.isPublic ? 'text-green-600' : 'text-gray-600'}`}
                  >
                    {property.isPublic === false ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Privado
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Público
                      </>
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-1 h-8">
                        {getStatusBadge(property.status)}
                        <MoreHorizontal className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onChangeStatus && onChangeStatus(property, 'active')}
                        className={property.status === 'active' ? 'bg-green-50' : ''}
                      >
                        {property.status === 'active' && <Check className="h-4 w-4 mr-2" />}
                        Ativo
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onChangeStatus && onChangeStatus(property, 'pending')}
                        className={property.status === 'pending' ? 'bg-amber-50' : ''}
                      >
                        {property.status === 'pending' && <Check className="h-4 w-4 mr-2" />}
                        Pendente
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onChangeStatus && onChangeStatus(property, 'archived')}
                        className={property.status === 'archived' ? 'bg-gray-50' : ''}
                      >
                        {property.status === 'archived' && <Check className="h-4 w-4 mr-2" />}
                        Arquivado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onToggleFeatured && onToggleFeatured(property)}
                      title={property.featured ? "Remover destaque" : "Destacar"}
                    >
                      {property.featured ? (
                        <StarOff className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(property)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(property)}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Nenhum imóvel encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PropertyTable;
