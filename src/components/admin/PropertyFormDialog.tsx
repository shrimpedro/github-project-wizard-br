
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import PropertyForm from './PropertyForm';
import { Property } from '../PropertyCard';

interface PropertyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (property: any) => void;
  initialData?: Property;
  isEditing: boolean;
}

const PropertyFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing,
}: PropertyFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Atualize os detalhes do imóvel abaixo.' 
              : 'Preencha os detalhes do novo imóvel abaixo.'}
          </DialogDescription>
        </DialogHeader>
        <PropertyForm
          onSubmit={onSubmit}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PropertyFormDialog;
