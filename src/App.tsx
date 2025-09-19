import { useState, useEffect } from 'react';
import { FileSpreadsheet, Shield } from 'lucide-react';
import { FileUpload } from './components/ui/FileUpload';
import { TacticalPanel } from './components/ui/TacticalPanel';
import { TacticalButton } from './components/ui/TacticalButton';
import { SheetSelectionDialog } from './components/ui/SheetSelectionDialog';
import { SlidingMenu } from './components/ui/SlidingMenu';
import { Dashboard } from './components/dashboard/Dashboard';
import { useExcelData } from './hooks/useExcelData';
import { CellMapManager } from './components/ui/CellMapManager';
import { getCurrentCellMappings, updateCellMappings } from './utils/excelParser';

function App() {
  const {
    excelData,
    isLoading,
    error,
    fileName,
    processExcelFile,
    selectSheet,
    resetData,
  } = useExcelData();
  
  const [showSheetDialog, setShowSheetDialog] = useState(false);
  const [showCellMapManager, setShowCellMapManager] = useState(false);
  const [cellMappings, setCellMappings] = useState<Record<string, string>>({});
  
  // Load cell mappings when component mounts
  useEffect(() => {
    setCellMappings(getCurrentCellMappings());
  }, []);
  
  // Show sheet selection dialog when file is loaded and has multiple sheets
  useEffect(() => {
    if (excelData.sheets.length > 1) {
      setShowSheetDialog(true);
    }
  }, [excelData.sheets]);
  
  const handleCellMappingsSave = (mappings: Record<string, string>) => {
    setCellMappings(mappings);
    updateCellMappings(mappings);
    setShowCellMapManager(false);
  };
  
  return (
    <div className="min-h-screen bg-tactical-black bg-hex-pattern">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-mono font-bold text-tactical-accent-yellow mb-2">
                Розвіддонесення <br /> ВПС (тип С) РУБпАК
              </h1>
              <p className="text-gray-400">
                Візуалізація даних розвідки з Excel файлів
              </p>
            </div>
          </div>
          
          {fileName && (
            <div className="tactical-glassmorphism p-3 flex items-center justify-between">
              <div className="flex items-center">
                <FileSpreadsheet className="mr-2 text-tactical-accent-yellow" size={20} />
                <span className="font-mono">{fileName}</span>
              </div>
            </div>
          )}
        </header>
        
        <main>
          {!fileName ? (
            <TacticalPanel className="max-w-2xl mx-auto" padding="large">
              <div className="text-center mb-6">
                <Shield size={48} className="text-tactical-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-mono text-tactical-accent-yellow mb-2">
                  Завантажте Excel файл з даними розвідки
                </h2>
                <p className="text-gray-300">
                  Підтримуються файли Excel (.xlsx, .xls) з даними про ударні та розвідувальні системи
                </p>
              </div>
              
              <FileUpload onFileSelected={processExcelFile} />
            </TacticalPanel>
          ) : (
            <div className="dashboard-container tactical-border">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-tactical-accent-yellow border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-4 text-gray-300">Обробка даних...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-tactical-accent-red">{error}</p>
                  <TacticalButton
                    onClick={resetData}
                    variant="secondary"
                    className="mt-4"
                  >
                    Спробувати інший файл
                  </TacticalButton>
                </div>
              ) : excelData.selectedSheet ? (
                <Dashboard excelData={excelData} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-300">Виберіть аркуш для аналізу даних</p>
                  <TacticalButton
                    onClick={() => setShowSheetDialog(true)}
                    className="mt-4"
                  >
                    Вибрати аркуш
                  </TacticalButton>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      
      {/* Sliding Menu */}
      <SlidingMenu
        fileName={fileName}
        selectedSheet={excelData.selectedSheet}
        onResetData={resetData}
        onChangeSheet={() => setShowSheetDialog(true)}
        hasMultipleSheets={excelData.sheets.length > 1}
        onOpenCellSettings={() => setShowCellMapManager(true)}
      />
      
      {/* Dialogs */}
      <SheetSelectionDialog
        open={showSheetDialog}
        onOpenChange={setShowSheetDialog}
        sheets={excelData.sheets}
        selectedSheet={excelData.selectedSheet}
        onSheetSelect={selectSheet}
      />
      
      <CellMapManager
        isOpen={showCellMapManager}
        onClose={() => setShowCellMapManager(false)}
        onSave={handleCellMappingsSave}
      />
    </div>
  );
}

export default App;