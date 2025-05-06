
import * as XLSX from 'xlsx';

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
