
import * as XLSX from 'xlsx';
import { Property } from '@/components/PropertyCard';

export const exportToExcel = (data: Property[], filename: string = 'imoveis') => {
  // Preparar os dados para o formato Excel
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(property => ({
      'ID': property.id,
      'Título': property.title,
      'Endereço': property.address,
      'Tipo': property.type === 'rent' ? 'Aluguel' : 'Venda',
      'Preço': property.type === 'rent' ? `R$ ${property.price}/mês` : `R$ ${property.price.toLocaleString()}`,
      'Quartos': property.bedrooms,
      'Banheiros': property.bathrooms,
      'Área (m²)': property.area,
      'Status': property.status || 'Ativo',
      'Destaque': property.featured ? 'Sim' : 'Não'
    }))
  );

  // Ajustar largura das colunas
  const columnWidths = [
    { wch: 10 }, // ID
    { wch: 30 }, // Título
    { wch: 40 }, // Endereço
    { wch: 10 }, // Tipo
    { wch: 15 }, // Preço
    { wch: 10 }, // Quartos
    { wch: 10 }, // Banheiros
    { wch: 10 }, // Área
    { wch: 10 }, // Status
    { wch: 10 }  // Destaque
  ];
  worksheet['!cols'] = columnWidths;

  // Criar o workbook e adicionar a planilha
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Imóveis');

  // Exportar o arquivo
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
