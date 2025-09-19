import { useState, useCallback } from 'react';
import type { ExcelData } from '../types';
import { parseExcelFile } from '../utils/excelParser';

export const useExcelData = () => {
  const [excelData, setExcelData] = useState<ExcelData>({
    sheets: [],
    selectedSheet: null,
    data: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const processExcelFile = useCallback(async (file: File) => {
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await parseExcelFile(file);
      setExcelData(data);
      setFileName(file.name);
    } catch (err) {
      setError('Failed to parse Excel file. Please check the file format.');
      console.error('Error parsing Excel file:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const selectSheet = useCallback((sheetName: string) => {
    setExcelData(prev => ({
      ...prev,
      selectedSheet: sheetName,
    }));
  }, []);
  
  const resetData = useCallback(() => {
    setExcelData({
      sheets: [],
      selectedSheet: null,
      data: {},
    });
    setFileName(null);
    setError(null);
  }, []);
  
  return {
    excelData,
    isLoading,
    error,
    fileName,
    processExcelFile,
    selectSheet,
    resetData,
  };
};