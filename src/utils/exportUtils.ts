
import * as XLSX from 'xlsx';
import { Property } from '../components/PropertyCard';

/**
 * Exports data to an Excel file
 * @param data Array of objects to export
 * @param filename Name of the file without extension
 * @param sheetName Optional name for the sheet
 */
export const exportToExcel = (
  data: any[],
  filename: string,
  sheetName: string = 'Dados'
): void => {
  try {
    // Ensure we have data to export
    if (!data || data.length === 0) {
      throw new Error('Não há dados para exportar');
    }

    // For complex objects, flatten them or handle nested properties differently
    const processedData = data.map(item => {
      // Create a new object with processed values
      const processedItem: Record<string, any> = {};
      
      // Process each property
      for (const [key, value] of Object.entries(item)) {
        // Skip internal React properties or complex objects
        if (key.startsWith('_') || typeof value === 'function') {
          continue;
        }
        
        // Format values appropriately
        if (typeof value === 'boolean') {
          processedItem[key] = value ? 'Sim' : 'Não';
        } else if (value instanceof Date) {
          processedItem[key] = value.toLocaleDateString('pt-BR');
        } else if (Array.isArray(value)) {
          // For arrays, join with commas or other handling
          processedItem[key] = value.join(', ');
        } else if (value === null || value === undefined) {
          processedItem[key] = '';
        } else if (typeof value === 'object') {
          // Skip objects or convert to string representation
          continue;
        } else {
          processedItem[key] = value;
        }
      }
      
      // Add formatted values for specific fields
      if (item.type) {
        processedItem.tipo = item.type === 'rent' ? 'Aluguel' : 'Venda';
      }
      if (item.price !== undefined) {
        processedItem.precoFormatado = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(item.price);
      }
      if (item.status) {
        processedItem.statusFormatado = translateStatus(item.status);
      }
      if (item.isPublic !== undefined) {
        processedItem.visibilidade = item.isPublic ? 'Público' : 'Privado';
      }
      
      return processedItem;
    });

    // Create workbook
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Export file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    return;
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    throw error;
  }
};

// Helper function to translate property status to Portuguese
const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'Ativo',
    'pending': 'Pendente',
    'archived': 'Arquivado'
  };
  
  return statusMap[status] || status;
};

/**
 * Exports list of properties to Excel file
 * @param properties Array of Property objects
 * @param filename Name of the file without extension
 */
export const exportPropertiesToExcel = (
  properties: Property[],
  filename: string = 'imoveis_exportados'
): void => {
  // Map properties to a format suitable for export
  const exportData = properties.map(property => ({
    id: property.id,
    titulo: property.title,
    endereco: property.address,
    preco: property.price,
    tipo: property.type === 'rent' ? 'Aluguel' : 'Venda',
    quartos: property.bedrooms,
    banheiros: property.bathrooms,
    area: property.area,
    descricao: property.description || '',
    status: translateStatus(property.status || 'active'),
    destaque: property.featured ? 'Sim' : 'Não',
    visibilidade: property.isPublic ? 'Público' : 'Privado'
  }));
  
  exportToExcel(exportData, filename, 'Imóveis');
};
