import * as XLSX from 'xlsx';
import type { ExcelData, StrikeSystem, ReconSystem, SummaryStatistics } from '../types';
import { findIconForText } from './iconDictionary';
import { CellMapping, CellMappingFactory, TableMapping } from './cellMapping';

// Default configuration for cell references
const DEFAULT_STRIKE_SYSTEMS = [
  { name: 'Танки', icon: 'tank' },
  { name: 'ББМ', icon: 'truck-military' },
  { name: 'Артилерійські системи', icon: 'artillery' },
  { name: 'РСЗВ', icon: 'rocket' },
  { name: 'Засоби ППО', icon: 'shield' },
  { name: 'Літаки', icon: 'plane' },
  { name: 'Гелікоптери', icon: 'helicopter' },
  { name: 'БПЛА', icon: 'drone' },
  { name: 'Крилаті ракети', icon: 'missile' },
  { name: 'Кораблі/катери', icon: 'ship' },
  { name: 'Автомобілі та автoцистерни', icon: 'truck' },
  { name: 'Спеціальна техніка', icon: 'wrench' },
];

const DEFAULT_RECON_SYSTEMS = [
  { name: 'РЛС', icon: 'radar' },
  { name: 'Засоби РЕБ', icon: 'radio' },
  { name: 'Пускові установки', icon: 'rocket-launch' },
];

const DEFAULT_SUMMARY_CELLS = {
  totalFlights: '',
  uniqueTargets: '',
  monthlyStats: {
    sheet: '',
    range: '',
  },
  dateRange: {
    start: '',
    end: '',
  },
};

// Store the current cell mappings
let strikeSystemsTableMapping = new TableMapping();
let reconSystemsTableMapping = new TableMapping();

// Initialize default mappings
DEFAULT_STRIKE_SYSTEMS.forEach(system => {
  const mapping = CellMappingFactory.createStrikeSystemMapping(
    system.name,
    '', // Empty range by default
    system.icon
  );
  strikeSystemsTableMapping.addMapping(mapping);
});

DEFAULT_RECON_SYSTEMS.forEach(system => {
  const mapping = CellMappingFactory.createReconSystemMapping(
    system.name,
    '', // Empty range by default
    system.icon
  );
  reconSystemsTableMapping.addMapping(mapping);
});

let SUMMARY_CELLS = { ...DEFAULT_SUMMARY_CELLS };

/**
 * Update cell mappings with new format
 * Format: [Text]/[Number]/[Number?] with cell ranges like "1A:C30"
 */
export const updateCellMappings = (mappings: Record<string, string>) => {
  // Update strike systems
  Object.entries(mappings).forEach(([key, value]) => {
    if (key.startsWith('strike.')) {
      const systemName = key.replace('strike.', '');
      let mapping = strikeSystemsTableMapping.findMapping(systemName);
      
      if (mapping) {
        // Update existing mapping
        const newMapping = CellMappingFactory.createStrikeSystemMapping(
          systemName,
          value.trim(),
          mapping.getIcon()
        );
        
        // Replace the mapping in the table
        const updatedMappings = strikeSystemsTableMapping.getMappings().map(m => 
          m.getName() === systemName ? newMapping : m
        );
        
        strikeSystemsTableMapping = new TableMapping();
        updatedMappings.forEach(m => strikeSystemsTableMapping.addMapping(m));
      } else {
        // Add new system
        const newMapping = CellMappingFactory.createStrikeSystemMapping(
          systemName,
          value.trim(),
          findIconForText(systemName)
        );
        strikeSystemsTableMapping.addMapping(newMapping);
      }
    }
    
    // Update recon systems
    if (key.startsWith('recon.')) {
      const systemName = key.replace('recon.', '');
      let mapping = reconSystemsTableMapping.findMapping(systemName);
      
      if (mapping) {
        // Update existing mapping
        const newMapping = CellMappingFactory.createReconSystemMapping(
          systemName,
          value.trim(),
          mapping.getIcon()
        );
        
        // Replace the mapping in the table
        const updatedMappings = reconSystemsTableMapping.getMappings().map(m => 
          m.getName() === systemName ? newMapping : m
        );
        
        reconSystemsTableMapping = new TableMapping();
        updatedMappings.forEach(m => reconSystemsTableMapping.addMapping(m));
      } else {
        // Add new system
        const newMapping = CellMappingFactory.createReconSystemMapping(
          systemName,
          value.trim(),
          findIconForText(systemName)
        );
        reconSystemsTableMapping.addMapping(newMapping);
      }
    }
    
    // Update summary cells
    if (key.startsWith('summary.')) {
      const field = key.replace('summary.', '');
      if (field === 'totalFlights') SUMMARY_CELLS.totalFlights = value.trim();
      if (field === 'uniqueTargets') SUMMARY_CELLS.uniqueTargets = value.trim();
      if (field === 'dateRangeStart') SUMMARY_CELLS.dateRange.start = value.trim();
      if (field === 'dateRangeEnd') SUMMARY_CELLS.dateRange.end = value.trim();
      if (field === 'monthlyStatsSheet') SUMMARY_CELLS.monthlyStats.sheet = value.trim();
      if (field === 'monthlyStatsRange') SUMMARY_CELLS.monthlyStats.range = value.trim();
    }
  });
};

/**
 * Get current cell mappings as a flat object
 */
export const getCurrentCellMappings = (): Record<string, string> => {
  const mappings: Record<string, string> = {};
  
  // Strike systems
  strikeSystemsTableMapping.getMappings().forEach(mapping => {
    const ranges = mapping.getRanges();
    if (ranges.length > 0) {
      const rangeStr = `${ranges[0].start}:${ranges[0].end}`;
      mappings[`strike.${mapping.getName()}`] = rangeStr;
    } else {
      mappings[`strike.${mapping.getName()}`] = '';
    }
  });
  
  // Recon systems
  reconSystemsTableMapping.getMappings().forEach(mapping => {
    const ranges = mapping.getRanges();
    if (ranges.length > 0) {
      const rangeStr = `${ranges[0].start}:${ranges[0].end}`;
      mappings[`recon.${mapping.getName()}`] = rangeStr;
    } else {
      mappings[`recon.${mapping.getName()}`] = '';
    }
  });
  
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
  // Reset strike systems
  strikeSystemsTableMapping = new TableMapping();
  DEFAULT_STRIKE_SYSTEMS.forEach(system => {
    const mapping = CellMappingFactory.createStrikeSystemMapping(
      system.name,
      '', // Empty range by default
      system.icon
    );
    strikeSystemsTableMapping.addMapping(mapping);
  });
  
  // Reset recon systems
  reconSystemsTableMapping = new TableMapping();
  DEFAULT_RECON_SYSTEMS.forEach(system => {
    const mapping = CellMappingFactory.createReconSystemMapping(
      system.name,
      '', // Empty range by default
      system.icon
    );
    reconSystemsTableMapping.addMapping(mapping);
  });
  
  // Reset summary cells
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
 * Extract strike systems data from Excel using the cell mapping components
 */
export const extractStrikeSystems = (excelData: ExcelData): StrikeSystem[] => {
  if (!excelData.selectedSheet || !excelData.data[excelData.selectedSheet]) {
    return [];
  }
  
  const mappings = strikeSystemsTableMapping.getMappings();
  
  return mappings.map(mapping => {
    const extractedData = mapping.extractData(excelData);
    const systemData = extractedData.find(item => item.name === mapping.getName());
    
    return {
      name: mapping.getName(),
      icon: mapping.getIcon() || 'default',
      hitCount: systemData?.values[0] || 0,
      destroyedCount: systemData?.values[1] || 0,
    };
  });
};

/**
 * Extract reconnaissance systems data from Excel using the cell mapping components
 */
export const extractReconSystems = (excelData: ExcelData): ReconSystem[] => {
  if (!excelData.selectedSheet || !excelData.data[excelData.selectedSheet]) {
    return [];
  }
  
  const mappings = reconSystemsTableMapping.getMappings();
  
  return mappings.map(mapping => {
    const extractedData = mapping.extractData(excelData);
    const systemData = extractedData.find(item => item.name === mapping.getName());
    
    return {
      name: mapping.getName(),
      icon: mapping.getIcon() || 'default',
      detectedCount: systemData?.values[0] || 0,
    };
  });
};

/**
 * Extract summary statistics from Excel using the new format
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