import * as XLSX from 'xlsx';
import type { ExcelData, StrikeSystem, ReconSystem, SummaryStatistics } from '../types';
import { findIconForText } from './iconDictionary';

// Default configuration for cell ranges
const DEFAULT_STRIKE_RANGE = 'C4:D15'; // Default range for strike systems (name on left, numbers on right)
const DEFAULT_RECON_RANGE = 'C18:C20'; // Default range for recon systems
const DEFAULT_SUMMARY_CELLS = {
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

// Store the current cell mappings
let STRIKE_RANGE = DEFAULT_STRIKE_RANGE;
let RECON_RANGE = DEFAULT_RECON_RANGE;
let SUMMARY_CELLS = { ...DEFAULT_SUMMARY_CELLS };

/**
 * Update cell mappings
 */
export const updateCellMappings = (mappings: Record<string, string>) => {
  // Update strike systems range
  if (mappings['strike.range']) {
    STRIKE_RANGE = mappings['strike.range'];
  }
  
  // Update recon systems range
  if (mappings['recon.range']) {
    RECON_RANGE = mappings['recon.range'];
  }
  
  // Update summary cells
  if (mappings['summary.totalFlights']) SUMMARY_CELLS.totalFlights = mappings['summary.totalFlights'];
  if (mappings['summary.uniqueTargets']) SUMMARY_CELLS.uniqueTargets = mappings['summary.uniqueTargets'];
  if (mappings['summary.dateRangeStart']) SUMMARY_CELLS.dateRange.start = mappings['summary.dateRangeStart'];
  if (mappings['summary.dateRangeEnd']) SUMMARY_CELLS.dateRange.end = mappings['summary.dateRangeEnd'];
  if (mappings['summary.monthlyStatsSheet']) SUMMARY_CELLS.monthlyStats.sheet = mappings['summary.monthlyStatsSheet'];
  if (mappings['summary.monthlyStatsRange']) SUMMARY_CELLS.monthlyStats.range = mappings['summary.monthlyStatsRange'];
};

/**
 * Get current cell mappings as a flat object
 */
export const getCurrentCellMappings = (): Record<string, string> => {
  const mappings: Record<string, string> = {};
  
  // Strike systems range
  mappings['strike.range'] = STRIKE_RANGE;
  
  // Recon systems range
  mappings['recon.range'] = RECON_RANGE;
  
  // Summary cells
  mappings['summary.totalFlights'] = SUMMARY_CELLS.totalFlights;
  mappings['summary.uniqueTargets'] = SUMMARY_CELLS.uniqueTargets;
  mappings['summary.dateRangeStart'] = SUMMARY_CELLS.dateRange.start;
  mappings['summary.dateRangeEnd'] = SUMMARY_CELLS.dateRange.end;
  mappings['summary.monthlyStatsSheet'] = SUMMARY_CELLS.monthlyStats.sheet;
  mappings['summary.monthlyStatsRange'] = SUMMARY_CELLS.monthlyStats.range;
  
  return mappings;
};

/**
 * Reset cell mappings to defaults
 */
export const resetCellMappings = () => {
  STRIKE_RANGE = DEFAULT_STRIKE_RANGE;
  RECON_RANGE = DEFAULT_RECON_RANGE;
  SUMMARY_CELLS = { ...DEFAULT_SUMMARY_CELLS };
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
 * Parse a cell reference range (e.g., "A1:C3")
 * Returns an array of all cell references in the range
 */
const expandCellRange = (range: string): string[] => {
  // Handle single cell
  if (!range.includes(':')) {
    return [range];
  }
  
  const [start, end] = range.split(':');
  
  // Extract column letters and row numbers
  const startColMatch = start.match(/[A-Z]+/);
  const startRowMatch = start.match(/\d+/);
  const endColMatch = end.match(/[A-Z]+/);
  const endRowMatch = end.match(/\d+/);
  
  if (!startColMatch || !startRowMatch || !endColMatch || !endRowMatch) {
    return [range]; // Invalid range format, return as is
  }
  
  const startCol = startColMatch[0];
  const startRow = parseInt(startRowMatch[0], 10);
  const endCol = endColMatch[0];
  const endRow = parseInt(endRowMatch[0], 10);
  
  // Convert column letters to indices
  const startColIndex = startCol.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0);
  const endColIndex = endCol.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0);
  
  // Generate all cells in the range
  const cells: string[] = [];
  
  for (let col = startColIndex; col <= endColIndex; col++) {
    for (let row = startRow; row <= endRow; row++) {
      // Convert column index back to letter
      let colStr = '';
      let tempCol = col;
      
      while (tempCol > 0) {
        const remainder = (tempCol - 1) % 26;
        colStr = String.fromCharCode(65 + remainder) + colStr;
        tempCol = Math.floor((tempCol - 1) / 26);
      }
      
      cells.push(`${colStr}${row}`);
    }
  }
  
  return cells;
};

/**
 * Get cell value from Excel data with support for ranges and combined ranges
 */
const getCellValue = (data: any[][], cellRef: string): any => {
  // Handle combined ranges (e.g., "A1:B2+C3:D4")
  if (cellRef.includes('+')) {
    const ranges = cellRef.split('+');
    let sum = 0;
    
    ranges.forEach(range => {
      const cells = expandCellRange(range.trim());
      cells.forEach(cell => {
        sum += Number(getSingleCellValue(data, cell)) || 0;
      });
    });
    
    return sum;
  }
  
  // Handle single range or single cell
  const cells = expandCellRange(cellRef);
  let sum = 0;
  
  cells.forEach(cell => {
    sum += Number(getSingleCellValue(data, cell)) || 0;
  });
  
  return sum;
};

/**
 * Get value from a single cell
 */
const getSingleCellValue = (data: any[][], cellRef: string): any => {
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
 * Parse a range to extract name/value pairs
 * Assumes names are in the left column and values are in the right column
 */
const parseNameValuePairs = (data: any[][], range: string): { name: string; value: number }[] => {
  const [start, end] = range.split(':');
  
  // Extract column letters and row numbers
  const startColMatch = start.match(/[A-Z]+/);
  const startRowMatch = start.match(/\d+/);
  const endColMatch = end.match(/[A-Z]+/);
  const endRowMatch = end.match(/\d+/);
  
  if (!startColMatch || !startRowMatch || !endColMatch || !endRowMatch) {
    return [];
  }
  
  const startRow = parseInt(startRowMatch[0], 10) - 1;
  const endRow = parseInt(endRowMatch[0], 10) - 1;
  
  // Convert column letters to indices
  const startColIndex = startColMatch[0].split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
  const endColIndex = endColMatch[0].split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
  
  const pairs: { name: string; value: number }[] = [];
  
  // Process each row in the range
  for (let row = startRow; row <= endRow; row++) {
    // Get name from left column (startColIndex)
    const name = data[row]?.[startColIndex];
    // Get value from right column (endColIndex)
    const value = data[row]?.[endColIndex];
    
    // Only add if name exists and is not empty
    if (name && String(name).trim() !== '') {
      pairs.push({
        name: String(name),
        value: Number(value) || 0
      });
    }
  }
  
  return pairs;
};

/**
 * Extract strike systems data from Excel using dynamic name detection
 * Names are on the left, numbers (hit/destroyed) are on the right
 */
export const extractStrikeSystems = (excelData: ExcelData): StrikeSystem[] => {
  if (!excelData.selectedSheet || !excelData.data[excelData.selectedSheet]) {
    return [];
  }
  
  const sheetData = excelData.data[excelData.selectedSheet];
  
  // Parse the range to get name/value pairs
  const pairs = parseNameValuePairs(sheetData, STRIKE_RANGE);
  
  // For strike systems, we need to split the value into hitCount and destroyedCount
  // We'll assume the value represents hitCount and destroyedCount is 0 or needs to be calculated
  // In a real implementation, you might have two columns for hit/destroyed
  return pairs.map(pair => ({
    name: pair.name,
    icon: findIconForText(pair.name),
    hitCount: pair.value,
    destroyedCount: Math.floor(pair.value * 0.5) // Example: destroyed is 50% of hit
  }));
};

/**
 * Extract reconnaissance systems data from Excel using dynamic name detection
 * Names are on the left, numbers (detected) are on the right
 */
export const extractReconSystems = (excelData: ExcelData): ReconSystem[] => {
  if (!excelData.selectedSheet || !excelData.data[excelData.selectedSheet]) {
    return [];
  }
  
  const sheetData = excelData.data[excelData.selectedSheet];
  
  // Parse the range to get name/value pairs
  const pairs = parseNameValuePairs(sheetData, RECON_RANGE);
  
  return pairs.map(pair => ({
    name: pair.name,
    icon: findIconForText(pair.name),
    detectedCount: pair.value
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
  if (SUMMARY_CELLS.monthlyStats.sheet && excelData.data[SUMMARY_CELLS.monthlyStats.sheet]) {
    const monthlySheetData = excelData.data[SUMMARY_CELLS.monthlyStats.sheet];
    
    // Parse the range
    if (SUMMARY_CELLS.monthlyStats.range) {
      const range = SUMMARY_CELLS.monthlyStats.range;
      const [start, end] = range.split(':');
      
      const startColMatch = start.match(/[A-Z]+/);
      const startRowMatch = start.match(/\d+/);
      const endRowMatch = end.match(/\d+/);
      
      if (startColMatch && startRowMatch && endRowMatch) {
        const startRow = parseInt(startRowMatch[0], 10) - 1;
        const endRow = parseInt(endRowMatch[0], 10) - 1;
        
        for (let i = startRow; i <= endRow; i++) {
          const month = monthlySheetData[i]?.[0];
          const value = monthlySheetData[i]?.[1];
          if (month && value !== undefined) {
            monthlyStats[month] = Number(value);
          }
        }
      }
    }
  }
  
  return {
    totalFlights: SUMMARY_CELLS.totalFlights ? 
      Number(getCellValue(mainSheetData, SUMMARY_CELLS.totalFlights)) || 0 : 0,
    uniqueTargets: SUMMARY_CELLS.uniqueTargets ? 
      Number(getCellValue(mainSheetData, SUMMARY_CELLS.uniqueTargets)) || 0 : 0,
    monthlyStats,
    dateRange: {
      start: SUMMARY_CELLS.dateRange.start ? 
        String(getCellValue(mainSheetData, SUMMARY_CELLS.dateRange.start) || '') : '',
      end: SUMMARY_CELLS.dateRange.end ? 
        String(getCellValue(mainSheetData, SUMMARY_CELLS.dateRange.end) || '') : '',
    },
  };
};