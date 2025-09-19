import React, { useState } from 'react';
import { TacticalPanel } from './TacticalPanel';
import { TacticalButton } from './TacticalButton';
import { Save, Edit, X } from 'lucide-react';

interface CellMapConfigProps {
  cellMappings: Record<string, string>;
  onSave: (mappings: Record<string, string>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CellMapConfig: React.FC<CellMapConfigProps> = ({
  cellMappings,
  onSave,
  isOpen,
  onClose
}) => {
  const [mappings, setMappings] = useState<Record<string, string>>(cellMappings);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setMappings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave(mappings);
    setIsEditing(false);
  };

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
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 mb-4">
            Налаштуйте відповідність комірок Excel до елементів дашборду. 
            Підтримуються діапазони (A1:C25) та комбінації діапазонів (A1:C25+D1:F15).
          </p>

          <div className="flex justify-end mb-4">
            {isEditing ? (
              <TacticalButton 
                icon={Save} 
                onClick={handleSave}
                variant="primary"
              >
                Зберегти
              </TacticalButton>
            ) : (
              <TacticalButton 
                icon={Edit} 
                onClick={() => setIsEditing(true)}
                variant="secondary"
              >
                Редагувати
              </TacticalButton>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-tactical-accent-cyan font-mono text-md mb-3 pb-1 border-b border-tactical-green-800">
              Ударні системи
            </h3>
            <div className="space-y-3">
              {Object.entries(mappings)
                .filter(([key]) => key.startsWith('strike.'))
                .map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">
                      {key.replace('strike.', '')}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="bg-tactical-dark border border-tactical-green-700 rounded px-2 py-1 text-sm font-mono"
                      />
                    ) : (
                      <div className="bg-tactical-dark bg-opacity-50 border border-tactical-green-800 rounded px-2 py-1 text-sm font-mono">
                        {value}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h3 className="text-tactical-accent-cyan font-mono text-md mb-3 pb-1 border-b border-tactical-green-800">
              Розвідувальні системи
            </h3>
            <div className="space-y-3">
              {Object.entries(mappings)
                .filter(([key]) => key.startsWith('recon.'))
                .map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">
                      {key.replace('recon.', '')}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="bg-tactical-dark border border-tactical-green-700 rounded px-2 py-1 text-sm font-mono"
                      />
                    ) : (
                      <div className="bg-tactical-dark bg-opacity-50 border border-tactical-green-800 rounded px-2 py-1 text-sm font-mono">
                        {value}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <h3 className="text-tactical-accent-cyan font-mono text-md mt-6 mb-3 pb-1 border-b border-tactical-green-800">
              Зведена статистика
            </h3>
            <div className="space-y-3">
              {Object.entries(mappings)
                .filter(([key]) => key.startsWith('summary.'))
                .map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">
                      {key.replace('summary.', '')}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="bg-tactical-dark border border-tactical-green-700 rounded px-2 py-1 text-sm font-mono"
                      />
                    ) : (
                      <div className="bg-tactical-dark bg-opacity-50 border border-tactical-green-800 rounded px-2 py-1 text-sm font-mono">
                        {value}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </TacticalPanel>
    </div>
  );
};