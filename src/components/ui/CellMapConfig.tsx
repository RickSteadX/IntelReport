import React from 'react';
import { TacticalPanel } from './TacticalPanel';

interface CellMapConfigProps {
  cellMappings: Record<string, string>;
  onSave: (mappings: Record<string, string>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CellMapConfig: React.FC<CellMapConfigProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <TacticalPanel className="w-full max-w-3xl max-h-[80vh] overflow-y-auto" hasTacticalBorder={true}>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-tactical-green-700">
          <h2 className="text-xl font-mono text-tactical-accent-yellow">
            Налаштування відображення даних
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 mb-4">
            Налаштування комірок тепер доступні в бічному меню. 
            Відкрийте бічне меню праворуч і натисніть "Налаштування комірок".
          </p>
        </div>
      </TacticalPanel>
    </div>
  );
};