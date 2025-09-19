import * as XLSX from 'xlsx';
import { ExcelData } from '../types';

/**
 * Interface for cell range specification
 * Represents a range of cells in an Excel sheet
 */
export interface CellRange {
  /** The starting cell reference (e.g., "A1") */
  start: string;
  /** The ending cell reference (e.g., "C10") */
  end: string;
  /** Optional sheet name. If not provided, uses the selected sheet */
  sheet?: string;
}

/**
 * Interface for cell mapping configuration
 * Defines how to map cells to data
 */
export interface CellMappingConfig {
  /** The name of the mapping (used for identification) */
  name: string;
  /** The ranges to include in this mapping */
  ranges: CellRange[];
  /** The number of value columns (1 for recon systems, 2 for strike systems) */
  valueColumns: number;
  /** Optional icon name for UI display */
  icon?: string;
}

/**
 * Class for handling cell range operations
 * Provides utility methods for working with cell ranges
 */
export class CellRangeUtil {
  /**
   * Parse a cell range string (e.g., "A1:C10") into a CellRange object
   * @param rangeStr The range string to parse
   * @param sheet Optional sheet name
   * @returns A CellRange object
   */
  static parseRangeString(rangeStr: string, sheet?: string): CellRange {
    // Handle single cell
    if (!rangeStr.includes(':')) {
      return {
        start: rangeStr,
        end: rangeStr,
        sheet
      };
    }
    
    const [start, end] = rangeStr.split(':');
    return {
      start: start.trim(),
      end: end.trim(),
      sheet
    };
  }
  
  /**
   * Convert a cell reference (e.g., "A1") to row and column indices
   * @param cellRef The cell reference
   * @returns An object with row and col indices (0-based)
   */
  static cellRefToIndices(cellRef: string): { row: number; col: number } {
    const colMatch = cellRef.match(/[A-Z]+/);
    const rowMatch = cellRef.match(/\d+/);
    
    if (!colMatch || !rowMatch) {
      throw new Error(`Invalid cell reference: ${cellRef}`);
    }
    
    const colStr = colMatch[0];
    const row = parseInt(rowMatch[0], 10) - 1; // Convert to 0-based
    
    // Convert column letters to index (A=0, B=1, etc.)
    const col = colStr.split('').reduce((acc, char) => {
      return acc * 26 + char.charCodeAt(0) - 64;
    }, 0) - 1; // Convert to 0-based
    
    return { row, col };
  }
  
  /**
   * Get the dimensions of a cell range
   * @param range The cell range
   * @returns An object with the range dimensions
   */
  static getRangeDimensions(range: CellRange): { 
    startRow: number; 
    startCol: number; 
    endRow: number; 
    endCol: number;
    rowCount: number;
    colCount: number;
  } {
    const start = this.cellRefToIndices(range.start);
    const end = this.cellRefToIndices(range.end);
    
    return {
      startRow: start.row,
      startCol: start.col,
      endRow: end.row,
      endCol: end.col,
      rowCount: end.row - start.row + 1,
      colCount: end.col - start.col + 1
    };
  }
  
  /**
   * Expand a cell range into an array of all cell references in the range
   * @param range The cell range to expand
   * @returns An array of cell references
   */
  static expandRange(range: CellRange): string[] {
    const { startRow, startCol, endRow, endCol } = this.getRangeDimensions(range);
    const cells: string[] = [];
    
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        // Convert column index back to letter
        let colStr = '';
        let tempCol = col + 1; // Convert back to 1-based for calculation
        
        while (tempCol > 0) {
          const remainder = (tempCol - 1) % 26;
          colStr = String.fromCharCode(65 + remainder) + colStr;
          tempCol = Math.floor((tempCol - 1) / 26);
        }
        
        cells.push(`${colStr}${row + 1}`); // Convert back to 1-based for cell reference
      }
    }
    
    return cells;
  }
}

/**
 * Class for mapping cell ranges to data
 * Handles the extraction of data from specified ranges
 */
export class CellMapping {
  private config: CellMappingConfig;
  
  constructor(config: CellMappingConfig) {
    this.config = config;
  }
  
  /**
   * Get the name of this mapping
   * @returns The mapping name
   */
  getName(): string {
    return this.config.name;
  }
  
  /**
   * Get the icon for this mapping
   * @returns The icon name or undefined
   */
  getIcon(): string | undefined {
    return this.config.icon;
  }
  
  /**
   * Get the number of value columns for this mapping
   * @returns The number of value columns
   */
  getValueColumns(): number {
    return this.config.valueColumns;
  }
  
  /**
   * Get the ranges for this mapping
   * @returns The cell ranges
   */
  getRanges(): CellRange[] {
    return this.config.ranges;
  }
  
  /**
   * Extract data from the specified ranges in the Excel data
   * @param excelData The Excel data
   * @returns An array of name/value pairs
   */
  extractData(excelData: ExcelData): { name: string; values: number[] }[] {
    if (!excelData.selectedSheet || !excelData.data[excelData.selectedSheet]) {
      return [];
    }
    
    const results: { name: string; values: number[] }[] = [];
    const valueColumns = this.config.valueColumns;
    
    // Process each range
    for (const range of this.config.ranges) {
      const sheetName = range.sheet || excelData.selectedSheet;
      const sheetData = excelData.data[sheetName];
      
      if (!sheetData) {
        continue;
      }
      
      const { startRow, startCol, endRow, endCol } = CellRangeUtil.getRangeDimensions(range);
      
      // Process each row in the range
      for (let row = startRow; row <= endRow; row++) {
        // Skip if row doesn't exist in the sheet data
        if (!sheetData[row]) {
          continue;
        }
        
        // Get the name from the leftmost column in the range
        const name = sheetData[row][startCol];
        
        // Skip empty rows or rows without a name
        if (!name || name === '') {
          continue;
        }
        
        // Extract values from the specified number of columns to the right
        const values: number[] = [];
        for (let i = 0; i < valueColumns; i++) {
          const valueColIndex = startCol + 1 + i;
          if (valueColIndex <= endCol) {
            const value = sheetData[row][valueColIndex];
            values.push(Number(value) || 0);
          } else {
            values.push(0); // Default to 0 if column doesn't exist
          }
        }
        
        // Add to results
        results.push({
          name: String(name),
          values
        });
      }
    }
    
    return results;
  }
}

/**
 * Class for mapping tables in Excel sheets
 * Handles the extraction of tabular data with specific structure
 */
export class TableMapping {
  private mappings: CellMapping[] = [];
  
  /**
   * Add a cell mapping to this table mapping
   * @param mapping The cell mapping to add
   */
  addMapping(mapping: CellMapping): void {
    this.mappings.push(mapping);
  }
  
  /**
   * Get all cell mappings
   * @returns The array of cell mappings
   */
  getMappings(): CellMapping[] {
    return this.mappings;
  }
  
  /**
   * Find a mapping by name
   * @param name The name to search for
   * @returns The matching cell mapping or undefined
   */
  findMapping(name: string): CellMapping | undefined {
    return this.mappings.find(mapping => mapping.getName() === name);
  }
  
  /**
   * Extract data from all mappings
   * @param excelData The Excel data
   * @returns A record of mapping names to extracted data
   */
  extractAllData(excelData: ExcelData): Record<string, { name: string; values: number[] }[]> {
    const result: Record<string, { name: string; values: number[] }[]> = {};
    
    for (const mapping of this.mappings) {
      result[mapping.getName()] = mapping.extractData(excelData);
    }
    
    return result;
  }
}

/**
 * Factory class for creating cell mappings
 * Provides utility methods for creating common mapping types
 */
export class CellMappingFactory {
  /**
   * Create a strike system mapping (2 value columns)
   * @param name The system name
   * @param rangeStr The range string (e.g., "A1:C10")
   * @param icon Optional icon name
   * @param sheet Optional sheet name
   * @returns A CellMapping for a strike system
   */
  static createStrikeSystemMapping(name: string, rangeStr: string, icon?: string, sheet?: string): CellMapping {
    const range = CellRangeUtil.parseRangeString(rangeStr, sheet);
    
    return new CellMapping({
      name,
      ranges: [range],
      valueColumns: 2, // Strike systems have 2 value columns (hit count, destroyed count)
      icon
    });
  }
  
  /**
   * Create a recon system mapping (1 value column)
   * @param name The system name
   * @param rangeStr The range string (e.g., "A1:B10")
   * @param icon Optional icon name
   * @param sheet Optional sheet name
   * @returns A CellMapping for a recon system
   */
  static createReconSystemMapping(name: string, rangeStr: string, icon?: string, sheet?: string): CellMapping {
    const range = CellRangeUtil.parseRangeString(rangeStr, sheet);
    
    return new CellMapping({
      name,
      ranges: [range],
      valueColumns: 1, // Recon systems have 1 value column (detected count)
      icon
    });
  }
  
  /**
   * Create a multi-range mapping
   * @param name The mapping name
   * @param rangeStrs Array of range strings
   * @param valueColumns Number of value columns
   * @param icon Optional icon name
   * @param sheet Optional sheet name
   * @returns A CellMapping with multiple ranges
   */
  static createMultiRangeMapping(
    name: string, 
    rangeStrs: string[], 
    valueColumns: number,
    icon?: string,
    sheet?: string
  ): CellMapping {
    const ranges = rangeStrs.map(rangeStr => CellRangeUtil.parseRangeString(rangeStr, sheet));
    
    return new CellMapping({
      name,
      ranges,
      valueColumns,
      icon
    });
  }
}