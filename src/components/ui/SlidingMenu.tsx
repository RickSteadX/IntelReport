import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Shield, Settings } from 'lucide-react';
import { FullscreenToggle } from './FullscreenToggle';
import { TacticalButton } from './TacticalButton';
import { CellMappingComponent } from './CellMappingComponent';

interface SlidingMenuProps {
  fileName: string | null;
  selectedSheet: string | null;
  onResetData: () => void;
  onChangeSheet: () => void;
  hasMultipleSheets: boolean;
  onOpenCellSettings: () => void;
  children?: React.ReactNode;
}

export const SlidingMenu: React.FC<SlidingMenuProps> = ({
  fileName,
  selectedSheet,
  onResetData,
  onChangeSheet,
  hasMultipleSheets,
  onOpenCellSettings,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-0 top-0 h-full z-40 flex">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-tactical-green-700 hover:bg-tactical-green-600 text-white h-16 w-8 flex items-center justify-center self-center rounded-l-md transition-all duration-200"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Menu panel */}
      <div 
        className={`tactical-glassmorphism backdrop-blur-md border-l-0 rounded-l-md h-full transition-width duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'w-64' : 'w-0'
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          <h3 className="text-tactical-accent-yellow font-mono text-lg mb-6 border-b border-tactical-green-700 pb-2">
            Управління
          </h3>

          <div className="space-y-4 flex-grow">
            <div className="flex flex-col gap-2">
              <FullscreenToggle />
              
              {fileName && (
                <>
                  <TacticalButton
                    onClick={onResetData}
                    variant="danger"
                    className="w-full"
                  >
                    Скинути дані
                  </TacticalButton>

                  {hasMultipleSheets && (
                    <TacticalButton
                      variant="secondary"
                      onClick={onChangeSheet}
                      className="w-full"
                    >
                      Змінити аркуш
                    </TacticalButton>
                  )}
                  
                  <TacticalButton
                    icon={Settings}
                    onClick={onOpenCellSettings}
                    variant="secondary"
                    className="w-full"
                  >
                    Налаштування комірок
                  </TacticalButton>
                </>
              )}
            </div>

            {fileName && selectedSheet && (
              <div className="mt-6 p-3 bg-tactical-dark bg-opacity-50 rounded-md">
                <h4 className="text-sm font-medium text-tactical-accent-cyan mb-1">Поточний файл:</h4>
                <p className="text-sm font-mono truncate">{fileName}</p>
                
                <h4 className="text-sm font-medium text-tactical-accent-cyan mt-3 mb-1">Аркуш:</h4>
                <p className="text-sm font-mono">{selectedSheet}</p>
              </div>
            )}
            
            {fileName && <CellMappingComponent />}
            
            {children}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-tactical-green-700 text-center text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <Shield size={14} />
              <span>Військова розвідка © {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};