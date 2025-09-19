import React, { useState, useEffect } from 'react';
import { getCurrentCellMappings, updateCellMappings } from '../../utils/excelParser';

interface CellMapping {
  key: string;
  label: string;
  value: string;
  type: 'text' | 'number' | 'number?';
}

export const CellMappingComponent: React.FC = () => {
  const [mappings, setMappings] = useState<CellMapping[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCellMappings();
  }, []);

  const loadCellMappings = () => {
    const currentMappings = getCurrentCellMappings();
    const formattedMappings: CellMapping[] = Object.entries(currentMappings).map(([key, value]) => {
      // Determine type based on key
      let type: 'text' | 'number' | 'number?' = 'text';
      if (key.includes('summary.totalFlights') || key.includes('summary.uniqueTargets')) {
        type = 'number';
      } else if (key.includes('summary.dateRange')) {
        type = 'text';
      } else if (key.startsWith('strike.') || key.startsWith('recon.')) {
        type = 'number';
      }
      
      // Format label
      let label = key;
      if (key.startsWith('strike.')) {
        label = `Strike: ${key.replace('strike.', '')}`;
      } else if (key.startsWith('recon.')) {
        label = `Recon: ${key.replace('recon.', '')}`;
      } else if (key.startsWith('summary.')) {
        label = `Summary: ${key.replace('summary.', '')}`;
      }
      
      return {
        key,
        label,
        value,
        type
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
    setIsEditing(false);
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-tactical-accent-cyan font-mono text-md">
          Cell Mappings
        </h3>
        <div>
          {isEditing ? (
            <button 
              onClick={handleSave}
              className="text-tactical-green-500 hover:text-tactical-green-300 text-sm"
            >
              Save
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-tactical-accent-yellow hover:text-tactical-accent-cyan text-sm"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {mappings.map((mapping) => (
          <div key={mapping.key} className="flex items-center justify-between">
            <label className="text-xs text-gray-400 w-1/3 truncate">
              {mapping.label}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={mapping.value}
                onChange={(e) => handleInputChange(mapping.key, e.target.value)}
                className="bg-tactical-dark border border-tactical-green-700 rounded px-2 py-1 text-xs font-mono w-2/3"
                placeholder="e.g., 1A:C30"
              />
            ) : (
              <div className="text-xs font-mono text-gray-300 truncate w-2/3 text-right">
                {mapping.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};