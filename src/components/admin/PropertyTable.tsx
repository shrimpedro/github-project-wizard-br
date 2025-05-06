
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
              <TableCell colSpan={8} className="h-24 text-center">
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
