// This is a simple test script to verify the concept of the cell mapping components

// Create a sample Excel data structure
const excelData = {
  sheets: ['Sheet1'],
  selectedSheet: 'Sheet1',
  data: {
    'Sheet1': [
      [null, 'Уражено', 'Знищено', null, 'Уражено', 'Знищено', null, null, '0:00 01.09.2025'],
      ['Танки', 5, 3, 'РЛС', 2, 0, null, null, '23:59 01.09.2025'],
      ['ББМ', 10, 7, 'Засоби РЕБ', 3, 0, null, null, null],
      ['РСЗВ', 2, 1, 'Пускові установки', 1, 0, null, null, null],
      ['Артилерійські системи', 8, 4, null, null, null, null, null, null]
    ]
  }
};

// Simplified CellRangeUtil
class CellRangeUtil {
  static cellRefToIndices(cellRef) {
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
  
  static parseRangeString(rangeStr, sheet) {
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
  
  static getRangeDimensions(range) {
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
}

// Simplified CellMapping
class CellMapping {
  constructor(config) {
    this.config = config;
  }
  
  getName() {
    return this.config.name;
  }
  
  getIcon() {
    return this.config.icon;
  }
  
  getValueColumns() {
    return this.config.valueColumns;
  }
  
  getRanges() {
    return this.config.ranges;
  }
  
  extractData(excelData) {
    if (!excelData.selectedSheet || !excelData.data[excelData.selectedSheet]) {
      return [];
    }
    
    const results = [];
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
        const values = [];
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

// Simplified TableMapping
class TableMapping {
  constructor() {
    this.mappings = [];
  }
  
  addMapping(mapping) {
    this.mappings.push(mapping);
  }
  
  getMappings() {
    return this.mappings;
  }
  
  findMapping(name) {
    return this.mappings.find(mapping => mapping.getName() === name);
  }
  
  extractAllData(excelData) {
    const result = {};
    
    for (const mapping of this.mappings) {
      result[mapping.getName()] = mapping.extractData(excelData);
    }
    
    return result;
  }
}

// Simplified CellMappingFactory
class CellMappingFactory {
  static createStrikeSystemMapping(name, rangeStr, icon, sheet) {
    const range = CellRangeUtil.parseRangeString(rangeStr, sheet);
    
    return new CellMapping({
      name,
      ranges: [range],
      valueColumns: 2, // Strike systems have 2 value columns (hit count, destroyed count)
      icon
    });
  }
  
  static createReconSystemMapping(name, rangeStr, icon, sheet) {
    const range = CellRangeUtil.parseRangeString(rangeStr, sheet);
    
    return new CellMapping({
      name,
      ranges: [range],
      valueColumns: 1, // Recon systems have 1 value column (detected count)
      icon
    });
  }
  
  static createMultiRangeMapping(name, rangeStrs, valueColumns, icon, sheet) {
    const ranges = rangeStrs.map(rangeStr => CellRangeUtil.parseRangeString(rangeStr, sheet));
    
    return new CellMapping({
      name,
      ranges,
      valueColumns,
      icon
    });
  }
}

// Run tests
console.log('Running Cell Mapping Tests...');

// Test CellRangeUtil
console.log('\n1. Testing CellRangeUtil:');

const range = CellRangeUtil.parseRangeString('A1:C5');
console.log('Parsed Range:', range);

const indices = CellRangeUtil.cellRefToIndices('B3');
console.log('Cell B3 Indices:', indices);

const dimensions = CellRangeUtil.getRangeDimensions(range);
console.log('Range Dimensions:', dimensions);

// Test CellMapping
console.log('\n2. Testing CellMapping:');

// Create a strike system mapping
const tankMapping = CellMappingFactory.createStrikeSystemMapping(
  'Танки',
  'A2:C2',
  'tank'
);

console.log('Tank Mapping:', {
  name: tankMapping.getName(),
  icon: tankMapping.getIcon(),
  valueColumns: tankMapping.getValueColumns(),
  ranges: tankMapping.getRanges()
});

// Extract data using the mapping
const tankData = tankMapping.extractData(excelData);
console.log('Extracted Tank Data:', tankData);

// Create a recon system mapping
const rlsMapping = CellMappingFactory.createReconSystemMapping(
  'РЛС',
  'D2:E2',
  'radar'
);

console.log('RLS Mapping:', {
  name: rlsMapping.getName(),
  icon: rlsMapping.getIcon(),
  valueColumns: rlsMapping.getValueColumns(),
  ranges: rlsMapping.getRanges()
});

// Extract data using the mapping
const rlsData = rlsMapping.extractData(excelData);
console.log('Extracted RLS Data:', rlsData);

// Test TableMapping
console.log('\n3. Testing TableMapping:');

const tableMapping = new TableMapping();

// Add strike system mappings
tableMapping.addMapping(tankMapping);
tableMapping.addMapping(CellMappingFactory.createStrikeSystemMapping(
  'ББМ',
  'A3:C3',
  'truck-military'
));
tableMapping.addMapping(CellMappingFactory.createStrikeSystemMapping(
  'РСЗВ',
  'A4:C4',
  'rocket'
));

// Add recon system mappings
tableMapping.addMapping(rlsMapping);
tableMapping.addMapping(CellMappingFactory.createReconSystemMapping(
  'Засоби РЕБ',
  'D3:E3',
  'radio'
));

console.log('Table Mappings Count:', tableMapping.getMappings().length);

// Find a mapping by name
const foundMapping = tableMapping.findMapping('ББМ');
console.log('Found ББМ Mapping:', foundMapping ? foundMapping.getName() : 'Not found');

// Extract all data
const allData = tableMapping.extractAllData(excelData);
console.log('All Extracted Data:', allData);

// Test multi-range mapping
console.log('\n4. Testing Multi-Range Mapping:');

const multiRangeMapping = CellMappingFactory.createMultiRangeMapping(
  'Artillery',
  ['A4:C4', 'A5:C5'],
  2,
  'artillery'
);

console.log('Multi-Range Mapping:', {
  name: multiRangeMapping.getName(),
  icon: multiRangeMapping.getIcon(),
  valueColumns: multiRangeMapping.getValueColumns(),
  rangesCount: multiRangeMapping.getRanges().length
});

// Extract data using the multi-range mapping
const artilleryData = multiRangeMapping.extractData(excelData);
console.log('Extracted Artillery Data:', artilleryData);

console.log('\nAll tests completed successfully!');