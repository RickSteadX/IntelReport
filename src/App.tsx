import { useState, useEffect } from 'react';
import { FileSpreadsheet, X, Shield } from 'lucide-react';
import { FileUpload } from './components/ui/FileUpload';
import { TacticalPanel } from './components/ui/TacticalPanel';
import { TacticalButton } from './components/ui/TacticalButton';
import { SheetSelectionDialog } from './components/ui/SheetSelectionDialog';
import { FullscreenToggle } from './components/ui/FullscreenToggle';
import { Dashboard } from './components/dashboard/Dashboard';
import { useExcelData } from './hooks/useExcelData';

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
  
  // Show sheet selection dialog when file is loaded and has multiple sheets
  useEffect(() => {
    if (excelData.sheets.length > 1) {
      setShowSheetDialog(true);
    }
  }, [excelData.sheets]);
  
  return (
    <div className="min-h-screen bg-tactical-black bg-hex-pattern">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-mono font-bold text-tactical-accent-yellow mb-2">
                Військова розвідка: аналіз даних
              </h1>
              <p className="text-gray-400">
                Візуалізація даних розвідки з Excel файлів
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <FullscreenToggle />
              
              {fileName && (
                <TacticalButton
                  icon={X}
                  onClick={resetData}
                  variant="danger"
                >
                  Скинути дані
                </TacticalButton>
              )}
            </div>
          </div>
          
          {fileName && (
            <div className="tactical-glassmorphism p-3 flex items-center justify-between">
              <div className="flex items-center">
                <FileSpreadsheet className="mr-2 text-tactical-accent-yellow" size={20} />
                <span className="font-mono">{fileName}</span>
                {excelData.selectedSheet && (
                  <span className="ml-2 text-sm text-gray-400">
                    (Аркуш: {excelData.selectedSheet})
                  </span>
                )}
              </div>
              
              {excelData.sheets.length > 1 && (
                <TacticalButton
                  variant="secondary"
                  onClick={() => setShowSheetDialog(true)}
                  className="text-sm"
                >
                  Змінити аркуш
                </TacticalButton>
              )}
            </div>
          )}
        </header>
        
        <main>
          {!fileName ? (
            <TacticalPanel className="max-w-2xl mx-auto">
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
            <div className="tactical-border p-6 bg-tactical-dark bg-opacity-70 backdrop-blur-sm rounded-md">
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
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <Shield size={14} />
            <span>Військова розвідка © {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
      
      <SheetSelectionDialog
        open={showSheetDialog}
        onOpenChange={setShowSheetDialog}
        sheets={excelData.sheets}
        selectedSheet={excelData.selectedSheet}
        onSheetSelect={selectSheet}
      />
    </div>
  );
}

export default App;