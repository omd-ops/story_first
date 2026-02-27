import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, Clock, TrendingUp, Send, Mic, Check, X, Square, Bell, Moon, Sparkles, RotateCcw, RotateCw, Info, Lightbulb, Bug, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonFlowFeedbackButton } from './LessonFlowFeedbackButton';

export function SnoozeReminderStep({ onSelect }: any) {
  const reminderOptions = [
    {
      icon: <Clock className="w-6 h-6 text-[var(--accent-orange)]" />,
      title: "Later today",
      subtitle: "2 hours"
    },
    {
      icon: <Moon className="w-6 h-6 text-[var(--accent-orange)]" />,
      title: "Tonight",
      subtitle: "8:00 PM"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[var(--accent-orange)]" />,
      title: "Surprise me",
      subtitle: "Random"
    }
  ];

  return (
    <div className="fixed inset-0 bg-[var(--background)] flex flex-col justify-center px-5 py-8">
      <LessonFlowFeedbackButton />
      <div className="max-w-md mx-auto w-full">
        {/* Main Heading */}
        <h2 className="text-4xl mb-4 tracking-wider text-black leading-tight" style={{ fontFamily: 'var(--font-bebas)' }}>
          When Should We Remind You?
        </h2>

        {/* Subtitle */}
        <p className="text-[var(--secondary-text)] mb-8">Your streak is safe for now</p>

        {/* Reminder Options */}
        <div className="space-y-4">
          {reminderOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelect(option.title)}
              className="w-full bg-[var(--background-elevated)] border-2 border-[var(--border-medium)] rounded p-5 hover:bg-[var(--background-secondary)] hover:border-[var(--accent-orange)] transition-all flex items-center gap-4 shadow-sm"
            >
              <div className="flex-shrink-0">
                {option.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="text-black font-medium text-lg">{option.title}</div>
                <div className="text-[var(--secondary-text)] text-sm">{option.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

