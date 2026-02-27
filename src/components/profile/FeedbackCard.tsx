import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FeedbackCardProps } from './types';

export function FeedbackCard({ week, isExpanded, onToggle, summary, details }: FeedbackCardProps) {
  return (
    <div className="bg-white rounded border-2 border-[var(--border)] overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <div className="font-medium mb-1 text-black">Week {week}</div>
          <div className="text-sm text-[var(--secondary-text)]">{summary}</div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-[var(--secondary-text)]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[var(--secondary-text)]" />
        )}
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-[var(--border)] pt-5">
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="text-center">
              <div className="text-2xl font-medium mb-1 text-black">{details.hookScore}</div>
              <div className="text-xs text-[var(--secondary-text)]">Hook</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium mb-1 text-black">{details.characterScore}</div>
              <div className="text-xs text-[var(--secondary-text)]">Character</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium mb-1 text-black">{details.emotionScore}</div>
              <div className="text-xs text-[var(--secondary-text)]">Emotion</div>
            </div>
          </div>

          <div className="bg-[var(--background-elevated)] rounded-xl p-4 border border-[var(--border)]">
            <div className="text-xs text-[var(--secondary-text)] mb-2 tracking-wider" style={{ fontFamily: 'var(--font-bebas)' }}>
              FROM COACH DEVON
            </div>
            <p className="text-sm leading-relaxed text-black">{details.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
}
