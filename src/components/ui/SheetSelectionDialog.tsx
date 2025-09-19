import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Check, FileSpreadsheet, Search } from 'lucide-react';
import { TacticalButton } from './TacticalButton';

interface SheetSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sheets: string[];
  selectedSheet: string | null;
  onSheetSelect: (sheet: string) => void;
}

export const SheetSelectionDialog: React.FC<SheetSelectionDialogProps> = ({
  open,
  onOpenChange,
  sheets,
  selectedSheet,
  onSheetSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSheets, setFilteredSheets] = useState<string[]>(sheets);
  
  // Reset search when dialog opens
  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setFilteredSheets(sheets);
    }
  }, [open, sheets]);
  
  // Filter sheets when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSheets(sheets);
    } else {
      const filtered = sheets.filter(sheet => 
        sheet.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSheets(filtered);
    }
  }, [searchTerm, sheets]);
  
  // Organize sheets into columns (3 columns with max 11 sheets per column)
  const organizeIntoColumns = (sheets: string[]) => {
    const columns: string[][] = [[], [], []];
    const itemsPerColumn = Math.ceil(sheets.length / 3);
    
    sheets.forEach((sheet, index) => {
      const columnIndex = Math.floor(index / itemsPerColumn);
      if (columnIndex < 3) {
        columns[columnIndex].push(sheet);
      } else {
        // Fallback for any overflow
        columns[2].push(sheet);
      }
    });
    
    return columns;
  };
  
  const sheetColumns = organizeIntoColumns(filteredSheets);
  
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl tactical-glassmorphism tactical-border p-6 z-50 max-h-[90vh] overflow-hidden flex flex-col">
          <Dialog.Title className="text-xl font-mono text-tactical-accent-yellow mb-4 flex items-center">
            <FileSpreadsheet className="mr-2" size={20} />
            Вибір аркуша Excel
          </Dialog.Title>
          
          <Dialog.Description className="text-gray-300 mb-4">
            Виберіть аркуш Excel для аналізу даних розвідки.
          </Dialog.Description>
          
          {/* Search box */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Пошук аркушів..."
              className="w-full pl-10 pr-4 py-2 bg-tactical-dark border border-tactical-green-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-tactical-accent-yellow"
            />
          </div>
          
          {/* Sheet selection grid */}
          <div className="flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sheetColumns.map((column, colIndex) => (
                <div key={colIndex} className="space-y-2">
                  {column.map((sheet) => (
                    <button
                      key={sheet}
                      onClick={() => onSheetSelect(sheet)}
                      className={`w-full text-left p-3 rounded-md flex items-center justify-between transition-colors ${
                        selectedSheet === sheet
                          ? 'bg-tactical-green-700 text-white'
                          : 'bg-tactical-dark hover:bg-tactical-green-900 text-gray-200'
                      }`}
                    >
                      <span className="truncate pr-2">{sheet}</span>
                      {selectedSheet === sheet && <Check size={16} />}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            
            {filteredSheets.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Аркушів не знайдено
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-tactical-green-700">
            <TacticalButton
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Скасувати
            </TacticalButton>
            
            <TacticalButton
              onClick={() => {
                if (selectedSheet) {
                  onOpenChange(false);
                }
              }}
              disabled={!selectedSheet}
            >
              Підтвердити
            </TacticalButton>
          </div>
          
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};