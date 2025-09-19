import React, { useState, useEffect } from 'react';
import { getCurrentCellMappings, updateCellMappings } from '../../utils/excelParser';

interface CellMapEntry {
  key: string;
  label: string;
  value: string;
  format: string; // Format like "Text", "Number", "Number?"
}

export const CellMapManager: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (mappings: Record<string, string>) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [mappings, setMappings] = useState<CellMapEntry[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCellMappings();
    }
  }, [isOpen]);

  const loadCellMappings = () => {
    const currentMappings = getCurrentCellMappings();
    const formattedMappings: CellMapEntry[] = Object.entries(currentMappings).map(([key, value]) => {
      // Format label based on key
      let label = key;
      if (key.startsWith('strike.')) {
        label = `Ударні системи: ${key.replace('strike.', '')}`;
      } else if (key.startsWith('recon.')) {
        label = `Розвідувальні системи: ${key.replace('recon.', '')}`;
      } else if (key.startsWith('summary.')) {
        const field = key.replace('summary.', '');
        const labels: Record<string, string> = {
          'totalFlights': 'Загальна кількість польотів',
          'uniqueTargets': 'Унікальні цілі',
          'dateRangeStart': 'Початкова дата',
          'dateRangeEnd': 'Кінцева дата',
          'monthlyStatsSheet': 'Аркуш місячної статистики',
          'monthlyStatsRange': 'Діапазон місячної статистики'
        };
        label = `Статистика: ${labels[field] || field}`;
      }
      
      // Determine format
      let format = 'Text';
      if (key.includes('totalFlights') || key.includes('uniqueTargets') || 
          key.startsWith('strike.') || key.startsWith('recon.')) {
        format = 'Number';
      } else if (key.includes('dateRange')) {
        format = 'Text';
      } else if (key.includes('monthlyStats')) {
        format = key.includes('Range') ? 'Text' : 'Text';
      }
      
      return {
        key,
        label,
        value,
        format
      };
    });
    
    setMappings(formattedMappings);
  };

  const handleInputChange = (key: string, value: string) => {
    setMappings(prev => 
      prev.map(mapping => 
        mapping.key === key ? { ...mapping, value } : mapping
      )
    );
  };

  const handleSave = () => {
    const newMappings: Record<string, string> = {};
    mappings.forEach(mapping => {
      newMappings[mapping.key] = mapping.value;
    });
    updateCellMappings(newMappings);
    onSave(newMappings);
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="tactical-glassmorphism rounded-lg border border-tactical-green-700 w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-tactical-green-700">
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
        
        <div className="p-4 overflow-y-auto flex-grow">
          <p className="text-gray-300 mb-4">
            Налаштуйте відповідність комірок Excel до елементів інформаційної панелі. 
            Використовуйте формат діапазонів (A1:C25) або комбінації діапазонів (A1:C25+D1:F15).
          </p>
          
          <div className="flex justify-end mb-4">
            {isEditing ? (
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-tactical-green-700 hover:bg-tactical-green-600 text-white rounded font-mono"
              >
                Зберегти
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-tactical-dark border border-tactical-green-700 hover:bg-tactical-green-900 text-tactical-accent-yellow rounded font-mono"
              >
                Редагувати
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Strike Systems */}
            <div>
              <h3 className="text-tactical-accent-cyan font-mono text-md mb-3 pb-1 border-b border-tactical-green-800">
                Ударні системи
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {mappings
                  .filter(mapping => mapping.key.startsWith('strike.'))
                  .map(mapping => (
                    <div key={mapping.key} className="flex flex-col">
                      <label className="text-sm text-gray-300 mb-1">
                        {mapping.label.replace('Ударні системи: ', '')}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={mapping.value}
                          onChange={(e) => handleInputChange(mapping.key, e.target.value)}
                          className="bg-tactical-dark border border-tactical-green-700 rounded px-3 py-2 text-sm font-mono"
                          placeholder="Наприклад: A1:C25"
                        />
                      ) : (
                        <div className="bg-tactical-dark bg-opacity-50 border border-tactical-green-800 rounded px-3 py-2 text-sm font-mono">
                          {mapping.value || 'Не встановлено'}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Формат: {mapping.format} | Приклад: 1A:C30
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Recon Systems */}
            <div>
              <h3 className="text-tactical-accent-cyan font-mono text-md mb-3 pb-1 border-b border-tactical-green-800">
                Розвідувальні системи
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {mappings
                  .filter(mapping => mapping.key.startsWith('recon.'))
                  .map(mapping => (
                    <div key={mapping.key} className="flex flex-col">
                      <label className="text-sm text-gray-300 mb-1">
                        {mapping.label.replace('Розвідувальні системи: ', '')}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={mapping.value}
                          onChange={(e) => handleInputChange(mapping.key, e.target.value)}
                          className="bg-tactical-dark border border-tactical-green-700 rounded px-3 py-2 text-sm font-mono"
                          placeholder="Наприклад: A1:C25"
                        />
                      ) : (
                        <div className="bg-tactical-dark bg-opacity-50 border border-tactical-green-800 rounded px-3 py-2 text-sm font-mono">
                          {mapping.value || 'Не встановлено'}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Формат: {mapping.format} | Приклад: 1A:C30
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Summary Statistics */}
            <div>
              <h3 className="text-tactical-accent-cyan font-mono text-md mb-3 pb-1 border-b border-tactical-green-800">
                Зведена статистика
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {mappings
                  .filter(mapping => mapping.key.startsWith('summary.'))
                  .map(mapping => (
                    <div key={mapping.key} className="flex flex-col">
                      <label className="text-sm text-gray-300 mb-1">
                        {mapping.label.replace('Статистика: ', '')}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={mapping.value}
                          onChange={(e) => handleInputChange(mapping.key, e.target.value)}
                          className="bg-tactical-dark border border-tactical-green-700 rounded px-3 py-2 text-sm font-mono"
                          placeholder={mapping.key.includes('Range') ? "Наприклад: A1" : mapping.key.includes('Sheet') ? "Наприклад: Monthly" : "Наприклад: A1:C25"}
                        />
                      ) : (
                        <div className="bg-tactical-dark bg-opacity-50 border border-tactical-green-800 rounded px-3 py-2 text-sm font-mono">
                          {mapping.value || 'Не встановлено'}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Формат: {mapping.format} | {mapping.key.includes('Range') ? "Одна комірка" : mapping.key.includes('Sheet') ? "Назва аркуша" : "Діапазон"}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};