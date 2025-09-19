import React, { useState } from 'react';
import { TacticalPanel } from './TacticalPanel';
import { Save, Edit, X } from 'lucide-react';
import { TacticalButton } from './TacticalButton';

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
            Налаштуйте відповідність комірок Excel до елементів інформаційної панелі. 
            Використовуйте формат діапазонів (A1:C25) для автоматичного виявлення назв та значень.
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
              <div className="flex flex-col">
                <label className="text-sm text-gray-300 mb-1">
                  Діапазон (Назва/Значення)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={mappings['strike.range'] || ''}
                    onChange={(e) => handleInputChange('strike.range', e.target.value)}
                    className="bg-tactical-dark border border-tactical-green-700 rounded px-2 py-1 text-sm font-mono"
                    placeholder="Наприклад: C4:D15"
                  />
                ) : (
                  <div className="bg-tactical-dark bg-opacity-50 border border-tactical-green-800 rounded px-2 py-1 text-sm font-mono">
                    {mappings['strike.range'] || 'Не встановлено'}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Формат: Діапазон | Приклад: C4:D15 (назви зліва, значення справа)
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-tactical-accent-cyan font-mono text-md mb-3 pb-1 border-b border-tactical-green-800">
              Розвідувальні системи
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col">
                <label className="text-sm text-gray-300 mb-1">
                  Діапазон (Назва/Значення)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={mappings['recon.range'] || ''}
                    onChange={(e) => handleInputChange('recon.range', e.target.value)}
                    className="bg-tactical-dark border border-tactical-green-700 rounded px-2 py-1 text-sm font-mono"
                    placeholder="Наприклад: C18:C20"
                  />
                ) : (
                  <div className="bg-tactical-dark bg-opacity-50 border border-tactical-green-800 rounded px-2 py-1 text-sm font-mono">
                    {mappings['recon.range'] || 'Не встановлено'}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Формат: Діапазон | Приклад: C18:C20 (назви зліва, значення справа)
                </div>
              </div>
            </div>

            <h3 className="text-tactical-accent-cyan font-mono text-md mt-6 mb-3 pb-1 border-b border-tactical-green-800">
              Зведена статистика
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col">
                <label className="text-sm text-gray-300 mb-1">
                  Загальна кількість польотів
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={mappings['summary.totalFlights'] || ''}
                    onChange={(e) => handleInputChange('summary.totalFlights', e.target.value)}
                    className="bg-tactical-dark border border-tactical-green-700 rounded px-2 py-1 text-sm font-mono"
                    placeholder="Наприклад: C23"
                  />
                ) : (
                  <div className="bg-tactical-dark bg-opacity-50 border border-tactical-green-800 rounded px-2 py-1 text-sm font-mono">
                    {mappings['summary.totalFlights'] || 'Не встановлено'}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-300 mb-1">
                  Унікальні цілі
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={mappings['summary.uniqueTargets'] || ''}
                    onChange={(e) => handleInputChange('summary.uniqueTargets', e.target.value)}
                    className="bg-tactical-dark border border-tactical-green-700 rounded px-2 py-1 text-sm font-mono"
                    placeholder="Наприклад: C24"
                  />
                ) : (
                  <div className="bg-tactical-dark bg-opacity-50 border border-tactical-green-800 rounded px-2 py-1 text-sm font-mono">
                    {mappings['summary.uniqueTargets'] || 'Не встановлено'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </TacticalPanel>
    </div>
  );
};