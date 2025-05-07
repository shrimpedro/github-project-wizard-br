
import * as XLSX from 'xlsx';
import { Property } from '@/components/PropertyCard';

export const exportPropertiesToExcel = (properties: Property[]) => {
  // Format the data for Excel export
  const dataToExport = properties.map(property => ({
    'ID': property.id,
    'Título': property.title,
    'Endereço': property.address,
    'Endereço Completo': property.fullAddress || property.address,
    'Preço': property.price,
    'Tipo': property.type === 'rent' ? 'Aluguel' : 'Venda',
    'Quartos': property.bedrooms,
    'Banheiros': property.bathrooms || 1,
    'Área (m²)': property.area,
    'Descrição': property.description || '',
    'Status': property.status,
    'Destaque': property.featured ? 'Sim' : 'Não',
    'Público': property.isPublic !== false ? 'Sim' : 'Não',
    'URL da Imagem': property.imageUrl || '',
    'Contato - Email': property.contactEmail || '',
    'Contato - Telefone': property.contactPhone || ''
  }));

  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Imóveis');
  
  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, 'imoveis_exportados.xlsx');
};
