import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { X, ChevronDown, Check, FileSpreadsheet } from 'lucide-react';
import { TacticalButton } from './TacticalButton';

interface SheetSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sheets: string[];
  selectedSheet: string | null;
  onSheetSelect: (sheet: string) => void;
}

export const SheetSelectionDialog: React.FC<SheetSelectionDialogProps> = ({
  open,
  onOpenChange,
  sheets,
  selectedSheet,
  onSheetSelect,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md tactical-glassmorphism tactical-border p-6 z-50">
          <Dialog.Title className="text-xl font-mono text-tactical-accent-yellow mb-4 flex items-center">
            <FileSpreadsheet className="mr-2" size={20} />
            Вибір аркуша Excel
          </Dialog.Title>
          
          <Dialog.Description className="text-gray-300 mb-6">
            Виберіть аркуш Excel для аналізу даних розвідки.
          </Dialog.Description>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Аркуш з даними
            </label>
            
            <Select.Root
              value={selectedSheet || undefined}
              onValueChange={onSheetSelect}
            >
              <Select.Trigger className="w-full flex items-center justify-between bg-tactical-dark border border-tactical-green-700 rounded px-4 py-2 text-left">
                <Select.Value placeholder="Виберіть аркуш" />
                <Select.Icon>
                  <ChevronDown size={18} />
                </Select.Icon>
              </Select.Trigger>
              
              <Select.Portal>
                <Select.Content className="tactical-glassmorphism border border-tactical-green-700 rounded-md overflow-hidden z-50">
                  <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-tactical-dark cursor-default">
                    <ChevronDown className="transform rotate-180" />
                  </Select.ScrollUpButton>
                  
                  <Select.Viewport className="p-1">
                    {sheets.map((sheet) => (
                      <Select.Item
                        key={sheet}
                        value={sheet}
                        className="relative flex items-center px-8 py-2 rounded-sm text-sm data-[highlighted]:bg-tactical-green-800 outline-none cursor-pointer"
                      >
                        <Select.ItemText>{sheet}</Select.ItemText>
                        <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  
                  <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-tactical-dark cursor-default">
                    <ChevronDown />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          
          <div className="flex justify-end gap-3">
            <TacticalButton
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Скасувати
            </TacticalButton>
            
            <TacticalButton
              onClick={() => {
                if (selectedSheet) {
                  onOpenChange(false);
                }
              }}
              disabled={!selectedSheet}
            >
              Підтвердити
            </TacticalButton>
          </div>
          
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};