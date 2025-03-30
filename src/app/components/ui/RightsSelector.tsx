// src/app/components/ui/RightsSelector.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/app/utils/cn';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface RightOption {
  id: string;
  label: string;
  note: string;
}

interface RightsSelectorProps {
  options: RightOption[];
  selectedRights: string[];
  onChange: (rightId: string) => void;
  className?: string;
}

export const RightsSelector: React.FC<RightsSelectorProps> = ({
  options,
  selectedRights,
  onChange,
  className,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center">
        <h2 className="text-lg font-medium text-gray-900">{t('rights.sectionTitle')}</h2>
        <div className="relative ml-2 group">
          <InformationCircleIcon className="h-5 w-5 text-amber-500" />
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-cream-100 border border-amber-500 rounded-lg shadow-lg z-10">
            <p className="text-sm text-gray-700">{t('rights.infoTooltip')}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {options.map((option) => (
          <div 
            key={option.id}
            className={cn(
              "p-4 border rounded-xl transition-colors cursor-pointer",
              selectedRights.includes(option.id) 
                ? "border-teal-700 bg-teal-50" 
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => onChange(option.id)}
          >
            <div className="flex items-start">
              <div className={cn(
                "flex-shrink-0 w-5 h-5 mt-0.5 border rounded",
                selectedRights.includes(option.id)
                  ? "bg-teal-700 border-teal-700"
                  : "border-gray-300"
              )}>
                {selectedRights.includes(option.id) && (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-500">{option.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">
          {t('rights.explanationLabel')}
        </label>
        <div className="mt-1">
          <textarea
            id="explanation"
            name="explanation"
            rows={4}
            className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder={t('rights.explanationPlaceholder')}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500 text-right">
          {t('rights.characterCount', { current: 0, max: 500 })}
        </p>
      </div>
    </div>
  );
};

export default RightsSelector;
