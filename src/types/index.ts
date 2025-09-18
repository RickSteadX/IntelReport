// Excel data types
export interface ExcelData {
  sheets: string[];
  selectedSheet: string | null;
  data: Record<string, any[]>;
}

// Military asset types
export interface StrikeSystem {
  name: string;
  icon: string;
  hitCount: number;
  destroyedCount: number;
}

export interface ReconSystem {
  name: string;
  icon: string;
  detectedCount: number;
}

export interface SummaryStatistics {
  totalFlights: number;
  uniqueTargets: number;
  monthlyStats: Record<string, number>;
  dateRange: {
    start: string;
    end: string;
  };
}

// Cell reference types for Excel parsing
export interface CellReference {
  sheet: string;
  cell: string;
}

export interface AssetCellReferences {
  name: string;
  icon: string;
  hitCell?: string;
  destroyedCell?: string;
  detectedCell?: string;
}

// UI state types
export interface AppState {
  isFullscreen: boolean;
  isFileUploaded: boolean;
  isProcessing: boolean;
  error: string | null;
}