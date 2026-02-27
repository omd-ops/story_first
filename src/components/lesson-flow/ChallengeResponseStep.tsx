import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, Clock, TrendingUp, Send, Mic, Check, X, Square, Bell, Moon, Sparkles, RotateCcw, RotateCw, Info, Lightbulb, Bug, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonFlowFeedbackButton } from './LessonFlowFeedbackButton';

export function ChallengeResponseStep({ day, onNext }: any) {
  const [storyText, setStoryText] = useState('');
  
  const hasContent = storyText.trim().length > 0;
  
  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      <LessonFlowFeedbackButton />
      {/* Header */}
      <div className="bg-white px-5 py-6 border-b border-[var(--border)]">
        <h1 className="text-black text-2xl tracking-wider" style={{ fontFamily: 'var(--font-bebas)' }}>
          Day {day} Challenge
        </h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-32">
        <div className="max-w-md mx-auto">
          <textarea
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            placeholder="Start with your hook, then tell your story..."
            rows={15}
            className="w-full bg-white border-2 border-[var(--accent-orange)] rounded px-5 py-4 text-black placeholder-[var(--secondary-text)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)] focus:ring-opacity-20 transition-all"
            style={{ minHeight: '400px' }}
          />
        </div>
      </div>

      {/* Action Buttons - Sticky at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-5 border-t border-[var(--border)]">
        <div className="max-w-md mx-auto">
          <button
            onClick={onNext}
            disabled={!hasContent}
            className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] text-white py-4 rounded-full font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

