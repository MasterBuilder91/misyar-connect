// src/app/components/ui/CompatibilityIndicator.tsx
import React from 'react';
import { cn } from '@/app/utils/cn';

interface CompatibilityIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const CompatibilityIndicator: React.FC<CompatibilityIndicatorProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className,
}) => {
  // Determine color based on score
  const getColor = () => {
    if (score >= 80) return 'bg-green-700 text-white';
    if (score >= 60) return 'bg-amber-500 text-white';
    return 'bg-rose-700 text-white';
  };

  // Determine size
  const getSize = () => {
    switch (size) {
      case 'sm': return 'w-12 h-12 text-sm';
      case 'lg': return 'w-20 h-20 text-xl';
      default: return 'w-16 h-16 text-lg';
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn(
        "rounded-full flex items-center justify-center font-medium",
        getSize(),
        getColor()
      )}>
        {score}%
      </div>
      {showLabel && (
        <span className="mt-2 text-sm text-gray-500">Compatibility</span>
      )}
    </div>
  );
};

export default CompatibilityIndicator;
