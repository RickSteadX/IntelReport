import React from 'react';
import type { SummaryStatistics as SummaryStatsType } from '../../types';
import { TacticalPanel } from '../ui/TacticalPanel';
import { Plane, Target, Calendar } from 'lucide-react';

interface SummaryStatisticsProps {
  statistics: SummaryStatsType;
}

export const SummaryStatistics: React.FC<SummaryStatisticsProps> = ({ statistics }) => {
  const { totalFlights, uniqueTargets, dateRange, monthlyStats } = statistics;
  
  // Get the top 3 months by destruction count
  const topMonths = Object.entries(monthlyStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  
  return (
    <TacticalPanel title="Зведена статистика" className="h-full" padding="normal">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-tactical-dark bg-opacity-50 p-3 rounded-md border border-tactical-green-800">
          <div className="flex items-center mb-2">
            <div className="mr-2 bg-tactical-green-800 p-1.5 rounded-full">
              <Plane size={16} className="text-tactical-accent-cyan" />
            </div>
            <span className="text-sm text-gray-300">Всього вильотів</span>
          </div>
          <div className="font-mono text-2xl gradient-text-blue font-bold">
            {totalFlights}
          </div>
        </div>
        
        <div className="bg-tactical-dark bg-opacity-50 p-3 rounded-md border border-tactical-green-800">
          <div className="flex items-center mb-2">
            <div className="mr-2 bg-tactical-green-800 p-1.5 rounded-full">
              <Target size={16} className="text-tactical-accent-cyan" />
            </div>
            <span className="text-sm text-gray-300">Унікальних цілей</span>
          </div>
          <div className="font-mono text-2xl gradient-text-blue font-bold">
            {uniqueTargets}
          </div>
        </div>
        
        <div className="bg-tactical-dark bg-opacity-50 p-3 rounded-md border border-tactical-green-800">
          <div className="flex items-center mb-2">
            <div className="mr-2 bg-tactical-green-800 p-1.5 rounded-full">
              <Calendar size={16} className="text-tactical-accent-cyan" />
            </div>
            <span className="text-sm text-gray-300">Період розвідки</span>
          </div>
          <div className="font-mono text-sm text-tactical-accent-blue">
            {dateRange.start} - {dateRange.end}
          </div>
        </div>
      </div>
      
      {topMonths.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-mono text-gray-300 mb-2">Топ місяці за знищенням</h4>
          <div className="grid grid-cols-3 gap-2">
            {topMonths.map(([month, count]) => (
              <div 
                key={month} 
                className="bg-tactical-dark bg-opacity-50 p-2 rounded-md border border-tactical-green-800 text-center"
              >
                <div className="text-xs text-gray-400">{month}</div>
                <div className="font-mono text-lg text-tactical-accent-purple">{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </TacticalPanel>
  );
};