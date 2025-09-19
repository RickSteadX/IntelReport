// Test script to verify our Excel parser implementation
const fs = require('fs');

// Simulate how XLSX.utils.sheet_to_json(worksheet, { header: 1 }) would parse the CSV
// This converts the CSV to a 2D array like the Excel parser does
function csvToArray(csv) {
  return csv.split('\n').map(row => row.split(','));
}

// Read the CSV file
const csvData = fs.readFileSync('test_excel_data.csv', 'utf8');
const sheetData = csvToArray(csvData);

console.log("Sheet data as parsed by XLSX:");
sheetData.forEach((row, index) => {
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

console.log("\nTesting parseNameValuePairs with range B2:D6 (Strike systems):");
const strikeResult = parseNameValuePairs(sheetData, "B2:D6", 2);
console.log(JSON.stringify(strikeResult, null, 2));

console.log("\nTesting parseNameValuePairs with range F2:G5 (Recon systems):");
const reconResult = parseNameValuePairs(sheetData, "F2:G5", 1);
console.log(JSON.stringify(reconResult, null, 2));

// Test the problematic case: horizontally placed ranges
console.log("\nTesting parseNameValuePairs with range B2:D7 (Strike systems with horizontal overlap):");
const horizontalStrikeResult = parseNameValuePairs(sheetData, "B2:D7", 2);
console.log(JSON.stringify(horizontalStrikeResult, null, 2));