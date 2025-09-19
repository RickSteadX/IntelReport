import React, { useState, useEffect } from 'react';
import type { ExcelData, StrikeSystem, ReconSystem, SummaryStatistics as SummaryStatsType } from '../../types';
import { extractStrikeSystems, extractReconSystems, extractSummaryStatistics } from '../../utils/excelParser';
import { StrikeSystemsTable } from './StrikeSystemsTable';
import { ReconSystemsTable } from './ReconSystemsTable';
import { SummaryStatistics } from './SummaryStatistics';
import { TacticalPanel } from '../ui/TacticalPanel';
import { AlertTriangle } from 'lucide-react';

interface DashboardProps {
  excelData: ExcelData;
}

export const Dashboard: React.FC<DashboardProps> = ({ excelData }) => {
  const [strikeSystems, setStrikeSystems] = useState<StrikeSystem[]>([]);
  const [reconSystems, setReconSystems] = useState<ReconSystem[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStatsType>({
    totalFlights: 0,
    uniqueTargets: 0,
    monthlyStats: {},
    dateRange: { start: '', end: '' },
  });
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      if (excelData.selectedSheet) {
        const extractedStrikeSystems = extractStrikeSystems(excelData);
        const extractedReconSystems = extractReconSystems(excelData);
        const extractedSummaryStats = extractSummaryStatistics(excelData);
        
        setStrikeSystems(extractedStrikeSystems);
        setReconSystems(extractedReconSystems);
        setSummaryStats(extractedSummaryStats);
        setError(null);
      }
    } catch (err) {
      setError('Помилка при обробці даних Excel. Перевірте формат файлу.');
      console.error('Error processing Excel data:', err);
    }
  }, [excelData]);
  
  if (error) {
    return (
      <TacticalPanel className="p-6 text-center">
        <AlertTriangle size={48} className="text-tactical-accent-red mx-auto mb-4" />
        <h3 className="text-xl font-mono text-tactical-accent-red mb-2">Помилка обробки даних</h3>
        <p className="text-gray-300">{error}</p>
      </TacticalPanel>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3">
        <SummaryStatistics statistics={summaryStats} />
      </div>
      
      <div className="lg:col-span-2">
        <StrikeSystemsTable systems={strikeSystems} />
      </div>
      
      <div className="lg:col-span-1">
        <ReconSystemsTable systems={reconSystems} />
      </div>
    </div>
  );
};