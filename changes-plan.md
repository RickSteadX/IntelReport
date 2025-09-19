# Changes Plan

## 1. UI Improvements
- Add padding to text to prevent clipping with box decorations
- Create a side sliding menu for controls
- Make dashboard data-only
- Move copyright label to sliding menu
- Update header text to "Розвіддонесення </br> ВПС (тип С) РУБпАК"
- Brighten the color palette while maintaining blur in the background

## 2. Sheet Selection Dialog
- Optimize for long lists
- Make it 3 columns with 11 sheets per column

## 3. Excel Parser Improvements
- Update parser to handle cell ranges (i.e., A1:C25+D1:F15)
- Use cell values directly for "Total" values instead of calculating them

## 4. New Components
- Create a cell map component for mapping sheet cells to dashboard
- Create a dictionary component for pairing icons with word sets

## Implementation Steps:
1. Update the color palette in tailwind.config.js
2. Create a sliding menu component
3. Update the App.tsx layout
4. Modify the SheetSelectionDialog component
5. Enhance the excelParser.ts to handle cell ranges
6. Create new components for cell mapping and icon dictionary
7. Update styling in index.css