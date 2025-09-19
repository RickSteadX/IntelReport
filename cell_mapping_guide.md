# Cell Mapping Component Architecture Guide

This guide explains the new cell mapping component architecture for the Excel parsing functionality in the IntelReport application. The new architecture provides a flexible and robust way to map Excel cell ranges to data structures, supporting various table layouts including horizontally adjacent ranges.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Key Components](#key-components)
3. [Cell Range Specification](#cell-range-specification)
4. [Working with Different Table Structures](#working-with-different-table-structures)
5. [Implementation Guide](#implementation-guide)
6. [Examples](#examples)

## Architecture Overview

The cell mapping architecture is designed to provide a flexible way to map Excel cell ranges to data structures. It supports:

- Single cell references (e.g., "A1")
- Cell ranges (e.g., "A1:C10")
- Multiple cell ranges for a single mapping
- Different table structures (strike systems with 2 value columns, recon systems with 1 value column)
- Horizontal adjacency of ranges

The architecture consists of several components that work together to provide a comprehensive solution for Excel data extraction:

1. **CellRange**: Represents a range of cells in an Excel sheet
2. **CellMapping**: Maps cell ranges to data structures
3. **TableMapping**: Groups related cell mappings together
4. **CellMappingFactory**: Creates common types of cell mappings

## Key Components

### CellRange

The `CellRange` interface defines a range of cells in an Excel sheet:

```typescript
interface CellRange {
  start: string;      // Starting cell reference (e.g., "A1")
  end: string;        // Ending cell reference (e.g., "C10")
  sheet?: string;     // Optional sheet name
}
```

### CellMapping

The `CellMapping` class is responsible for mapping cell ranges to data structures:

```typescript
class CellMapping {
  constructor(config: CellMappingConfig);
  
  getName(): string;
  getIcon(): string | undefined;
  getValueColumns(): number;
  getRanges(): CellRange[];
  extractData(excelData: ExcelData): { name: string; values: number[] }[];
}
```

### TableMapping

The `TableMapping` class groups related cell mappings together:

```typescript
class TableMapping {
  addMapping(mapping: CellMapping): void;
  getMappings(): CellMapping[];
  findMapping(name: string): CellMapping | undefined;
  extractAllData(excelData: ExcelData): Record<string, { name: string; values: number[] }[]>;
}
```

### CellMappingFactory

The `CellMappingFactory` class provides utility methods for creating common types of cell mappings:

```typescript
class CellMappingFactory {
  static createStrikeSystemMapping(name: string, rangeStr: string, icon?: string, sheet?: string): CellMapping;
  static createReconSystemMapping(name: string, rangeStr: string, icon?: string, sheet?: string): CellMapping;
  static createMultiRangeMapping(name: string, rangeStrs: string[], valueColumns: number, icon?: string, sheet?: string): CellMapping;
}
```

## Cell Range Specification

Cell ranges can be specified in several ways:

1. **Single cell**: "A1"
2. **Cell range**: "A1:C10"
3. **Multiple cell ranges**: ["A1:C10", "E1:G10"]

The `CellRangeUtil` class provides utility methods for working with cell ranges:

```typescript
class CellRangeUtil {
  static parseRangeString(rangeStr: string, sheet?: string): CellRange;
  static cellRefToIndices(cellRef: string): { row: number; col: number };
  static getRangeDimensions(range: CellRange): { startRow: number; startCol: number; endRow: number; endCol: number; rowCount: number; colCount: number };
  static expandRange(range: CellRange): string[];
}
```

## Working with Different Table Structures

The cell mapping architecture supports different table structures through the `valueColumns` parameter:

1. **Strike Systems**: 2 value columns (hit count, destroyed count)
2. **Recon Systems**: 1 value column (detected count)

For example, a strike system table might look like:

| Name | Hit Count | Destroyed Count |
|------|-----------|----------------|
| Tanks | 10 | 5 |
| Artillery | 8 | 3 |

While a recon system table might look like:

| Name | Detected Count |
|------|---------------|
| RLS | 15 |
| REB | 7 |

The `CellMapping` class handles these different structures through the `valueColumns` parameter in the configuration.

## Implementation Guide

### Step 1: Create Cell Mappings

First, create cell mappings for each system you want to extract data from:

```typescript
// Create a strike system mapping (2 value columns)
const tankMapping = CellMappingFactory.createStrikeSystemMapping(
  'Tanks',
  'A2:C2',
  'tank'
);

// Create a recon system mapping (1 value column)
const rlsMapping = CellMappingFactory.createReconSystemMapping(
  'RLS',
  'D2:E2',
  'radar'
);
```

### Step 2: Group Mappings into Tables

Group related mappings into table mappings:

```typescript
const strikeSystemsTable = new TableMapping();
strikeSystemsTable.addMapping(tankMapping);
strikeSystemsTable.addMapping(artilleryMapping);

const reconSystemsTable = new TableMapping();
reconSystemsTable.addMapping(rlsMapping);
reconSystemsTable.addMapping(rebMapping);
```

### Step 3: Extract Data

Extract data from the Excel file using the table mappings:

```typescript
// Parse the Excel file
const excelData = await parseExcelFile(file);

// Extract strike systems data
const strikeSystems = strikeSystemsTable.getMappings().map(mapping => {
  const extractedData = mapping.extractData(excelData);
  const systemData = extractedData.find(item => item.name === mapping.getName());
  
  return {
    name: mapping.getName(),
    icon: mapping.getIcon() || 'default',
    hitCount: systemData?.values[0] || 0,
    destroyedCount: systemData?.values[1] || 0,
  };
});

// Extract recon systems data
const reconSystems = reconSystemsTable.getMappings().map(mapping => {
  const extractedData = mapping.extractData(excelData);
  const systemData = extractedData.find(item => item.name === mapping.getName());
  
  return {
    name: mapping.getName(),
    icon: mapping.getIcon() || 'default',
    detectedCount: systemData?.values[0] || 0,
  };
});
```

## Examples

### Example 1: Basic Strike System Mapping

```typescript
// Create a strike system mapping
const tankMapping = CellMappingFactory.createStrikeSystemMapping(
  'Tanks',
  'A2:C2',
  'tank'
);

// Extract data
const tankData = tankMapping.extractData(excelData);
console.log(tankData); // [{ name: 'Tanks', values: [10, 5] }]
```

### Example 2: Multi-Range Mapping

```typescript
// Create a multi-range mapping for artillery systems
const artilleryMapping = CellMappingFactory.createMultiRangeMapping(
  'Artillery',
  ['A3:C3', 'A4:C4'],
  2,
  'artillery'
);

// Extract data
const artilleryData = artilleryMapping.extractData(excelData);
console.log(artilleryData); // [{ name: 'Artillery', values: [8, 3] }, { name: 'Howitzers', values: [5, 2] }]
```

### Example 3: Handling Horizontal Adjacency

The cell mapping architecture handles horizontal adjacency of ranges by treating each range independently:

```typescript
// Create mappings for horizontally adjacent ranges
const tankMapping = CellMappingFactory.createStrikeSystemMapping(
  'Tanks',
  'A2:C2',
  'tank'
);

const rlsMapping = CellMappingFactory.createReconSystemMapping(
  'RLS',
  'D2:E2',
  'radar'
);

// Extract data
const tankData = tankMapping.extractData(excelData);
const rlsData = rlsMapping.extractData(excelData);

console.log(tankData); // [{ name: 'Tanks', values: [10, 5] }]
console.log(rlsData);  // [{ name: 'RLS', values: [15] }]
```

This approach ensures that each range is processed independently, avoiding conflicts between horizontally adjacent ranges.