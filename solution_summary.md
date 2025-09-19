# Solution Summary: Fix for Horizontal Range Parsing Issue

## Problem Description
The original Excel parser had an issue where it would fetch entire rows when parsing data ranges. This caused problems when two ranges were placed horizontally (side by side) in the same row, as the parser would mix data from both ranges, leading to incorrect parsing results.

Example of the issue:
- Log from `parseNameValuePairs()`: `['ОС РОВ', 7, empty, 'Склади', 0]`
- This shows data from two different systems being mixed in a single row

## Root Cause
The original implementation used `XLSX.utils.sheet_to_json(worksheet, { header: 1 })` which converts the entire sheet to a 2D array where each row is an array of all cell values in that row. When parsing ranges, the code would fetch entire rows which contained data from multiple ranges when they were placed horizontally.

## Solution Implemented

### 1. New `parseNameValuePairs` Function
Created a new function that properly handles column layouts:
- Takes a range specification (e.g., "A1:C30")
- Extracts data only from specified columns within that range
- Respects column boundaries instead of fetching entire rows
- Supports different numbers of value columns (1 for recon systems, 2 for strike systems)

```typescript
const parseNameValuePairs = (sheetData: any[][], range: string, valueColumns: number = 1): { name: string; values: number[] }[] => {
  // Parse the range to get start and end positions
  const [start, end] = range.includes(':') ? range.split(':') : [range, range];
  
  // Extract column letters and row numbers
  const startColMatch = start.match(/[A-Z]+/);
  const startRowMatch = start.match(/\d+/);
  const endColMatch = end.match(/[A-Z]+/);
  const endRowMatch = end.match(/\d+/);
  
  // Convert column letters to indices
  const startColIndex = startCol.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
  const endColIndex = endCol.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
  
  const results: { name: string; values: number[] }[] = [];
  
  // Process each row in the range
  for (let row = startRow - 1; row < endRow; row++) {
    // Get the name from the leftmost column
    const name = sheetData[row]?.[startColIndex];
    
    // Skip empty rows or rows without a name
    if (!name || name === '') {
      continue;
    }
    
    // Extract values from the specified number of columns to the right
    const values: number[] = [];
    for (let i = 0; i < valueColumns; i++) {
      const valueColIndex = startColIndex + 1 + i;
      if (valueColIndex <= endColIndex) {
        const value = sheetData[row]?.[valueColIndex];
        values.push(Number(value) || 0);
      } else {
        values.push(0); // Default to 0 if column doesn't exist
      }
    }
    
    results.push({
      name: String(name),
      values
    });
  }
  
  return results;
};
```

### 2. Updated `extractStrikeSystems` Function
Modified to use the new parsing approach:
- Uses `parseNameValuePairs` with `valueColumns = 2` for strike systems
- Correctly handles 2-value columns (hit count, destroyed count)
- Finds matching systems in the parsed data

### 3. Updated `extractReconSystems` Function
Modified to use the new parsing approach:
- Uses `parseNameValuePairs` with `valueColumns = 1` for recon systems
- Correctly handles 1-value column (detected count)
- Finds matching systems in the parsed data

## Benefits of the Solution

1. **Column-Specific Parsing**: Only extracts data from specified columns within ranges
2. **Horizontal Range Support**: Works correctly with horizontally placed ranges
3. **Backward Compatibility**: Maintains compatibility with existing functionality
4. **Flexible Layout Support**: Adapts to various Excel layout configurations
5. **Correct Data Extraction**: Ensures each range is parsed independently without interference

## Test Results

Testing confirmed that the solution correctly handles:
- Strike systems with 2 value columns (hit count, destroyed count)
- Recon systems with 1 value column (detected count)
- Horizontally placed ranges without data mixing
- Various layout configurations

Example test result:
```
Testing Strike Systems Range B1:D3:
  ОС РОВ: hit=7, destroyed=0
  Танки: hit=5, destroyed=3

Testing Recon Systems Range B1:C3:
  ОС РОВ: detected=7
  Танки: detected=5
```

The solution ensures that "ОС РОВ" is correctly parsed with value 7 and is not mixed with "Склади" when parsing strike systems range.