
import React from 'react';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
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

interface PropertyTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

const PropertyTable = ({ properties, onEdit, onDelete }: PropertyTableProps) => {
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
                    <span>{property.title}</span>
                    {property.featured && (
                      <Badge className="bg-primary text-white px-2 py-1 text-xs rounded-md ml-1">
                        Destaque
                      </Badge>
                    )}
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
                  {property.isPublic === false ? (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <EyeOff className="h-3 w-3" />
                      Privado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200 bg-green-50">
                      <Eye className="h-3 w-3" />
                      Público
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {getStatusBadge(property.status)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(property)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(property)}
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
