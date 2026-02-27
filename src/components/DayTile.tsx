import React from 'react';
import { Check, Lock } from 'lucide-react';

interface DayTileProps {
  day: number;
  title: string;
  completed: boolean;
  locked: boolean;
  available: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

export function DayTile({ day, title, completed, locked, available, isCurrent, onClick }: DayTileProps) {
  if (!available) {
    return (
      <div className="bg-[var(--background-elevated)] p-4 border border-[var(--border)] opacity-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center">
              <Lock className="w-4 h-4 text-[var(--secondary-text)]" />
            </div>
            <div>
              <div className="text-xs text-[var(--secondary-text)] mb-0.5"
                   style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}>
                DAY {day}
              </div>
              <div className="text-sm text-[var(--secondary-text)]">Coming soon</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleClick = () => {
    if (!locked) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={locked}
      className={`w-full text-left bg-[var(--background-elevated)] p-4 border transition-all ${
        isCurrent
          ? 'border-[var(--accent-orange)]'
          : 'border-[var(--border)]'
      } ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--accent-orange)]/50'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            completed
              ? 'bg-[var(--accent-orange)]'
              : 'bg-[#2A2A2A]'
          }`}>
            {completed ? (
              <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
            ) : locked ? (
              <Lock className="w-4 h-4 text-[var(--secondary-text)]" />
            ) : (
              <svg className="w-5 h-5 text-[var(--accent-orange)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            )}
          </div>
          <div>
            <div className="text-xs text-[var(--secondary-text)] mb-0.5"
                 style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}>
              DAY {day}
            </div>
            <div className="text-sm text-white font-medium">
              {title}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
