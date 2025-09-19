import React from 'react';
import type { StrikeSystem } from '../../types';
import { TacticalPanel } from '../ui/TacticalPanel';
import { MilitaryIcon } from '../ui/MilitaryIcon';

interface StrikeSystemsTableProps {
  systems: StrikeSystem[];
}

export const StrikeSystemsTable: React.FC<StrikeSystemsTableProps> = ({ systems }) => {
  return (
    <TacticalPanel title="Ударні системи" className="h-full" padding="normal">
      <div className="overflow-x-auto snap-scroll">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-tactical-green-700">
              <th className="py-2 px-3 text-left text-sm font-mono text-tactical-accent-cyan">Система</th>
              <th className="py-2 px-3 text-center text-sm font-mono text-tactical-accent-cyan">Уражено</th>
              <th className="py-2 px-3 text-center text-sm font-mono text-tactical-accent-cyan">Знищено</th>
            </tr>
          </thead>
          <tbody>
            {systems.map((system, index) => (
              <tr 
                key={system.name} 
                className={`
                  ${index % 2 === 0 ? 'bg-tactical-dark bg-opacity-30' : ''}
                  hover:bg-tactical-green-900 hover:bg-opacity-20 transition-colors
                `}
              >
                <td className="py-2 px-3 flex items-center">
                  <div className="mr-2 bg-tactical-green-800 p-1.5 rounded-full">
                    <MilitaryIcon iconName={system.icon} text={system.name} size={16} className="text-tactical-accent-yellow" />
                  </div>
                  <span>{system.name}</span>
                </td>
                <td className="py-2 px-3 text-center font-mono text-tactical-accent-blue">
                  {system.hitCount}
                </td>
                <td className="py-2 px-3 text-center font-mono text-tactical-accent-red">
                  {system.destroyedCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TacticalPanel>
  );
};