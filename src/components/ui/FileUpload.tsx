import React, { useState, useCallback } from 'react';
import { Upload, FileX, FileSpreadsheet } from 'lucide-react';
import { TacticalButton } from './TacticalButton';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  accept = '.xlsx,.xls',
  maxSize = 10, // 10MB default
}) => {
  
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const validateFile = useCallback((file: File): boolean => {
    setError(null);
    
    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    const validTypes = accept.split(',').map(type => type.replace('.', '').trim());
    
    if (!validTypes.includes(fileType || '')) {
      setError(`Невірний формат файлу. Підтримуються лише ${accept} файли.`);
      return false;
    }
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`Файл занадто великий. Максимальний розмір: ${maxSize}MB.`);
      return false;
    }
    
    return true;
  }, [accept, maxSize]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelected(file);
    }
  }, [onFileSelected, validateFile]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelected(file);
    }
  }, [onFileSelected, validateFile]);
  
  const handleButtonClick = useCallback(() => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput?.click();
  }, []);
  
  // Custom handler for the button to prevent event bubbling
  const handleButtonClickWithEvent = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent event from bubbling to the container
    handleButtonClick();
  }, [handleButtonClick]);
  
  return (
    <div className="w-full">
      <div
        className={`
          border-2 border-dashed rounded-md p-8 text-center cursor-pointer
          transition-all duration-200 flex flex-col items-center justify-center
          min-h-[200px]
          ${isDragging 
            ? 'border-tactical-accent-yellow bg-tactical-green-900 bg-opacity-20' 
            : 'border-tactical-green-700 hover:border-tactical-green-600'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        {isDragging ? (
          <FileSpreadsheet size={48} className="text-tactical-accent-yellow mb-4" />
        ) : (
          <Upload size={48} className="text-tactical-green-400 mb-4" />
        )}
        
        <h3 className="text-lg font-mono mb-2">
          {isDragging ? 'Відпустіть файл тут' : 'Перетягніть Excel файл сюди'}
        </h3>
        <p className="text-gray-400 mb-4">або</p>
        
        <TacticalButton 
          icon={FileSpreadsheet}
          onClick={handleButtonClickWithEvent}
        >
          Вибрати файл
        </TacticalButton>
        
        <input
          id="file-upload"
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <p className="text-sm text-gray-400 mt-4">
          Підтримуються файли {accept} до {maxSize}MB
        </p>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-md flex items-center">
          <FileX size={20} className="text-red-500 mr-2" />
          <span className="text-red-400">{error}</span>
        </div>
      )}
    </div>
  );
};