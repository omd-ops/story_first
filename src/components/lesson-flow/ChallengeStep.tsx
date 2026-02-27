import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, Clock, TrendingUp, Send, Mic, Check, X, Square, Bell, Moon, Sparkles, RotateCcw, RotateCw, Info, Lightbulb, Bug, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonFlowFeedbackButton } from './LessonFlowFeedbackButton';

export function ChallengeStep({ day, streak, onDoNow, onSnooze }: any) {
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSnoozeClick = () => {
    setShowCelebration(true);
    // Auto-hide celebration and call onSnooze after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
      onSnooze();
    }, 3000);
  };

  return (
    <>
    <div className="h-full flex flex-col justify-center px-5 py-8">
      <LessonFlowFeedbackButton />
      <div className="max-w-md mx-auto w-full">
        {/* Header with Badge and Streak */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-block bg-[var(--accent-yellow)] text-black px-5 py-2 rounded-full">
            <span className="font-medium">Day {day} Challenge</span>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-br from-[var(--accent-orange)]/10 to-[var(--accent-orange)]/5 px-3 py-1.5 rounded-full border border-[var(--accent-orange)]/20">
            <span className="text-2xl">🔥</span>
            <span className="text-black text-sm font-bold">{streak}</span>
          </div>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl mb-6 tracking-wider text-black leading-tight" style={{ fontFamily: 'var(--font-bebas)' }}>
          Tell a Story That Starts with a Hook
        </h2>

        {/* Time Estimate */}
        <div className="flex items-center gap-2 text-[var(--secondary-text)] mb-8">
          <Clock className="w-5 h-5" />
          <span>Estimated time: ~10 minutes</span>
        </div>

        {/* Challenge Box */}
        <div className="bg-white border-2 border-gray-100 rounded p-6 mb-8 shadow-sm">
          <h3 className="text-black font-semibold mb-4 text-lg">Your Challenge:</h3>
          <p className="text-black mb-4 leading-relaxed">
            Think of a personal experience from the last week. Open with a surprising statement, question, or moment that makes someone want to hear more. Then complete the story.
          </p>
          <p className="text-[var(--secondary-text)] text-sm">
            You can submit via text or voice recording
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onDoNow}
            className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] text-white py-4 rounded-full font-semibold transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            Do Now
          </button>
          <button
            onClick={handleSnoozeClick}
            className="w-full bg-white border-2 border-gray-200 text-black py-4 rounded-full font-medium hover:bg-gray-50 hover:border-gray-300 transition-all hover:shadow-md flex items-center justify-center gap-2"
          >
            <Bell className="w-5 h-5" />
            Snooze
          </button>
        </div>
      </div>
    </div>

    {/* Celebration Modal after Snooze */}
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded p-8 max-w-sm w-full shadow-2xl text-center"
          >
            {/* Orange Circle with Checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6, bounce: 0.4, delay: 0.1 }}
              className="w-20 h-20 mx-auto mb-8 bg-[var(--accent-orange)] rounded-full flex items-center justify-center shadow-lg"
            >
              <Check className="w-10 h-10 text-white" strokeWidth={2.5} />
            </motion.div>

            {/* Message */}
            <p className="text-[var(--secondary-text)] text-base mb-4 leading-relaxed font-medium">
              Crafting hooks that capture attention
            </p>
            <p className="text-[var(--secondary-text)] text-sm leading-relaxed">
              You're building something powerful. See you tomorrow.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

