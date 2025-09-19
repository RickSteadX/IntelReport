## Fix Excel Parser for Horizontal Range Support

### Problem Analysis
- [x] Investigate current `parseNameValuePairs()` implementation
- [x] Understand how it fetches entire rows and causes conflicts with horizontal ranges
- [x] Analyze the provided log data showing mixed row content

The issue is that the current implementation uses `XLSX.utils.sheet_to_json(worksheet, { header: 1 })` which converts the entire sheet to a 2D array where each row is an array of all cell values in that row. When two ranges are placed horizontally (side by side), the parsing logic fetches entire rows which contain data from both ranges, causing incorrect parsing.

### Solution Design
- [x] Modify parser to only extract data from specified columns within ranges
- [x] Implement column-specific parsing instead of row-based parsing
- [x] Ensure strike systems (3-column) and recon systems (2-column) work correctly
- [x] Test with various range layouts including horizontal placement

### Implementation
- [x] Create a new `parseNameValuePairs()` function in excelParser.ts that properly handles column layouts
- [x] Modify `extractStrikeSystems()` to use the new parsing approach
- [x] Modify `extractReconSystems()` to use the new parsing approach
- [x] Ensure backward compatibility with existing functionality
- [x] Test with sample data that replicates the issue

### Verification
- [x] Test with horizontally placed ranges
- [x] Verify strike systems parsing still works correctly
- [x] Verify recon systems parsing still works correctly
- [x] Test edge cases and various layout configurations

## Summary

The issue has been successfully fixed by implementing a new parsing approach that:

1. Only extracts data from specified columns within ranges
2. Respects column boundaries instead of fetching entire rows
3. Properly handles both strike systems (2 value columns) and recon systems (1 value column)
4. Works correctly with various range layouts including horizontal placement

The solution ensures that when two ranges are placed horizontally, each range is parsed independently without interfering with the other.