// Test script to replicate the exact issue mentioned in the problem description
const fs = require('fs');

// Simulate how XLSX.utils.sheet_to_json(worksheet, { header: 1 }) would parse the CSV
function csvToArray(csv) {
  return csv.split('\n').map(row => row.split(','));
}

// Sample data that replicates the issue
// This represents a row where two ranges are placed horizontally
const testData = [
  ['', '', '', '', '', '', ''],           // Row 0
  ['', 'ОС РОВ', 7, '', 'Склади', 0, ''], // Row 1 - This is the problematic row
  ['', 'Other', 5, 3, '', '', ''],        // Row 2
];

console.log("Test data that replicates the issue:");
testData.forEach((row, index) => {
  console.log(`Row ${index}:`, row);
});

// Import our parseNameValuePairs function logic
function parseNameValuePairs(sheetData, range, valueColumns = 1) {
  // Parse the range to get start and end positions
  const [start, end] = range.includes(':') ? range.split(':') : [range, range];
  
  // Extract column letters and row numbers
  const startColMatch = start.match(/[A-Z]+/);
  const startRowMatch = start.match(/\d+/);
  const endColMatch = end.match(/[A-Z]+/);
  const endRowMatch = end.match(/\d+/);
  
  if (!startColMatch || !startRowMatch || !endColMatch || !endRowMatch) {
    return []; // Invalid range format
  }
  
  const startCol = startColMatch[0];
  const startRow = parseInt(startRowMatch[0], 10);
  const endCol = endColMatch[0];
  const endRow = parseInt(endRowMatch[0], 10);
  
  // Convert column letters to indices (A=0, B=1, etc.)
  const startColIndex = startCol.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
  const endColIndex = endCol.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
  
  const results = [];
  
  // Process each row in the range
  for (let row = startRow - 1; row < endRow; row++) {
    // Get the name from the leftmost column
    const name = sheetData[row]?.[startColIndex];
    
    // Skip empty rows or rows without a name
    if (!name || name === '') {
      continue;
    }
    
    // Extract values from the specified number of columns to the right
    const values = [];
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
}

console.log("\nTesting with range B2:C3 (Should only get 'ОС РОВ' with value 7):");
const result1 = parseNameValuePairs(testData, "B2:C3", 1);
console.log(JSON.stringify(result1, null, 2));

console.log("\nTesting with range B1:D1 (Should only get 'ОС РОВ' with value 7, ignoring 'Склади'):");
const result2 = parseNameValuePairs(testData, "B1:D1", 1);
console.log(JSON.stringify(result2, null, 2));

console.log("\nTesting with range E1:F1 (Should only get 'Склади' with value 0):");
const result3 = parseNameValuePairs(testData, "E1:F1", 1);
console.log(JSON.stringify(result3, null, 2));

// Test with the correct ranges
console.log("\nTesting with range B2:B2 (Should only get 'ОС РОВ' with value 7):");
const result4 = parseNameValuePairs(testData, "B2:B2", 1);
console.log(JSON.stringify(result4, null, 2));

console.log("\nTesting with range E1:E1 (Should only get 'Склади' with value 0):");
const result5 = parseNameValuePairs(testData, "E1:E1", 1);
console.log(JSON.stringify(result5, null, 2));