import React from 'react';
import { Star } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function StreakDisplay({ streak, size = 'medium', showLabel = true }: StreakDisplayProps) {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl',
  };

  const starSizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-10 h-10',
  };

  return (
    <div className="flex items-center gap-2">
      <svg className={starSizeClasses[size]} fill="var(--accent-orange)" viewBox="0 0 24 24">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
      <div className="flex flex-col">
        <span className={`${sizeClasses[size]} font-medium leading-none text-white`}>
          {streak}
        </span>
        {showLabel && (
          <span className="text-sm text-[var(--secondary-text)] leading-tight">
            {streak === 1 ? 'day' : 'days'}
          </span>
        )}
      </div>
    </div>
  );
}
