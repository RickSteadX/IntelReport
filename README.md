# Military Intelligence Dashboard

A modern, military-themed web application for visualizing intelligence data from Excel spreadsheets. The application focuses on displaying military asset destruction statistics with a dark, tactical aesthetic.

## Features

- **Excel Data Integration**: Upload and parse Excel files containing military intelligence data
- **Multi-sheet Support**: Select specific sheets from Excel workbooks
- **Data Visualization**: Display strike systems and reconnaissance systems data
- **Summary Statistics**: Show total flights, unique targets, and date ranges
- **Military Tactical UI**: Dark theme with military-inspired design elements
- **Responsive Design**: Optimized for viewing from phones and tablets
- **Fullscreen Mode**: Toggle fullscreen for tactical operations

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom military theme
- **UI Components**: Radix UI for accessible primitives
- **Icons**: Lucide React for military-themed iconography
- **Excel Parsing**: XLSX library

## Design System

- Military tactical theme with dark green and black color scheme
- Grid and hexagonal background patterns
- Glassmorphism effects with backdrop blur
- Military accent colors (yellow, red, blue)
- Custom fonts: JetBrains Mono for data and Inter for text
- Tactical border styling with corner accents

## Project Structure

```
military-intel-dashboard/
├── src/
│   ├── assets/            # SVG patterns and icons
│   ├── components/
│   │   ├── dashboard/     # Dashboard-specific components
│   │   └── ui/            # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles and Tailwind directives
├── public/                # Static assets
├── index.html             # HTML entry point
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Project dependencies
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Build for production:
   ```
   npm run build
   ```

## Data Format

The application expects Excel files with the following structure:

- Strike systems data (tanks, aircraft, etc.) with hit and destroyed counts
- Reconnaissance systems data with detection counts
- Summary statistics including total flights, unique targets, and date ranges

## Usage

1. Upload an Excel file using the drag-and-drop interface or file selector
2. Select the appropriate sheet if the workbook contains multiple sheets
3. View the parsed data in the military-themed dashboard
4. Toggle fullscreen mode for tactical operations
5. Reset data to upload a different file

## Accessibility

- Keyboard navigation support
- Screen reader compatible components
- Focus management for dialogs and interactive elements
- Proper ARIA attributes for enhanced accessibility