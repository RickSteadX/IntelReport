import * as XLSX from 'xlsx';
import type { ExcelData, StrikeSystem, ReconSystem, SummaryStatistics, AssetCellReferences } from '../types';

// Configuration for cell references
const STRIKE_SYSTEMS: AssetCellReferences[] = [
  { name: 'Танки', icon: 'tank', hitCell: 'C4', destroyedCell: 'D4' },
  { name: 'ББМ', icon: 'truck-military', hitCell: 'C5', destroyedCell: 'D5' },
  { name: 'Артилерійські системи', icon: 'artillery', hitCell: 'C6', destroyedCell: 'D6' },
  { name: 'РСЗВ', icon: 'rocket', hitCell: 'C7', destroyedCell: 'D7' },
  { name: 'Засоби ППО', icon: 'shield', hitCell: 'C8', destroyedCell: 'D8' },
  { name: 'Літаки', icon: 'plane', hitCell: 'C9', destroyedCell: 'D9' },
  { name: 'Гелікоптери', icon: 'helicopter', hitCell: 'C10', destroyedCell: 'D10' },
  { name: 'БПЛА', icon: 'drone', hitCell: 'C11', destroyedCell: 'D11' },
  { name: 'Крилаті ракети', icon: 'missile', hitCell: 'C12', destroyedCell: 'D12' },
  { name: 'Кораблі/катери', icon: 'ship', hitCell: 'C13', destroyedCell: 'D13' },
  { name: 'Автомобілі та автоцистерни', icon: 'truck', hitCell: 'C14', destroyedCell: 'D14' },
  { name: 'Спеціальна техніка', icon: 'wrench', hitCell: 'C15', destroyedCell: 'D15' },
];

const RECON_SYSTEMS: AssetCellReferences[] = [
  { name: 'РЛС', icon: 'radar', detectedCell: 'C18' },
  { name: 'Засоби РЕБ', icon: 'radio', detectedCell: 'C19' },
  { name: 'Пускові установки', icon: 'rocket-launch', detectedCell: 'C20' },
];

const SUMMARY_CELLS = {
  totalFlights: 'C23',
  uniqueTargets: 'C24',
  monthlyStats: {
    sheet: 'Monthly',
    range: 'A2:B13',
  },
  dateRange: {
    start: 'C26',
    end: 'C27',
  },
};

/**
 * Parse an Excel file and extract the data
 */
export const parseExcelFile = async (file: File): Promise<ExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        
        const sheets = workbook.SheetNames;
        const excelData: Record<string, any[]> = {};
        
        // Read all sheets
        sheets.forEach(sheet => {
          const worksheet = workbook.Sheets[sheet];
          excelData[sheet] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        });
        
        resolve({
          sheets,
          selectedSheet: sheets.length > 0 ? sheets[0] : null,
          data: excelData,
        });
      } catch (error) {
        reject(new Error('Failed to parse Excel file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Get cell value from Excel data
 */
const getCellValue = (data: any[][], cellRef: string): any => {
  const colMatch = cellRef.match(/[A-Z]+/);
  const rowMatch = cellRef.match(/\d+/);
  
  if (!colMatch || !rowMatch) return null;
  
  const col = colMatch[0];
  const row = parseInt(rowMatch[0], 10) - 1;
  
  // Convert column letter to index (A=0, B=1, etc.)
  const colIndex = col.split('').reduce((acc, char) => {
    return acc * 26 + char.charCodeAt(0) - 64;
  }, 0) - 1;
  
  return data[row]?.[colIndex] ?? 0;
};

/**
 * Extract strike systems data from Excel
 */
export const extractStrikeSystems = (excelData: ExcelData): StrikeSystem[] => {
  if (!excelData.selectedSheet || !excelData.data[excelData.selectedSheet]) {
    return [];
  }
  
  const sheetData = excelData.data[excelData.selectedSheet];
  
  return STRIKE_SYSTEMS.map(system => ({
    name: system.name,
    icon: system.icon,
    hitCount: Number(getCellValue(sheetData, system.hitCell || '')) || 0,
    destroyedCount: Number(getCellValue(sheetData, system.destroyedCell || '')) || 0,
  }));
};

/**
 * Extract reconnaissance systems data from Excel
 */
export const extractReconSystems = (excelData: ExcelData): ReconSystem[] => {
  if (!excelData.selectedSheet || !excelData.data[excelData.selectedSheet]) {
    return [];
  }
  
  const sheetData = excelData.data[excelData.selectedSheet];
  
  return RECON_SYSTEMS.map(system => ({
    name: system.name,
    icon: system.icon,
    detectedCount: Number(getCellValue(sheetData, system.detectedCell || '')) || 0,
  }));
};

/**
 * Extract summary statistics from Excel
 */
export const extractSummaryStatistics = (excelData: ExcelData): SummaryStatistics => {
  if (!excelData.selectedSheet || !excelData.data[excelData.selectedSheet]) {
    return {
      totalFlights: 0,
      uniqueTargets: 0,
      monthlyStats: {},
      dateRange: { start: '', end: '' },
    };
  }
  
  const mainSheetData = excelData.data[excelData.selectedSheet];
  
  // Extract monthly stats if available
  const monthlyStats: Record<string, number> = {};
  if (excelData.data[SUMMARY_CELLS.monthlyStats.sheet]) {
    const monthlySheetData = excelData.data[SUMMARY_CELLS.monthlyStats.sheet];
    // Process the range A2:B13 for monthly data
    for (let i = 1; i <= 12; i++) {
      const month = monthlySheetData[i]?.[0];
      const value = monthlySheetData[i]?.[1];
      if (month && value !== undefined) {
        monthlyStats[month] = Number(value);
      }
    }
  }
  
  return {
    totalFlights: Number(getCellValue(mainSheetData, SUMMARY_CELLS.totalFlights)) || 0,
    uniqueTargets: Number(getCellValue(mainSheetData, SUMMARY_CELLS.uniqueTargets)) || 0,
    monthlyStats,
    dateRange: {
      start: String(getCellValue(mainSheetData, SUMMARY_CELLS.dateRange.start) || ''),
      end: String(getCellValue(mainSheetData, SUMMARY_CELLS.dateRange.end) || ''),
    },
  };
};