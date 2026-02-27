import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, Clock, TrendingUp, Send, Mic, Check, X, Square, Bell, Moon, Sparkles, RotateCcw, RotateCw, Info, Lightbulb, Bug, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonFlowFeedbackButton } from './LessonFlowFeedbackButton';

export function WrapStep({ day, streak, onFinish }: any) {
  // Auto-redirect after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="max-w-md mx-auto text-center h-full flex flex-col justify-center">
      <LessonFlowFeedbackButton />
      {/* Confetti/Celebration Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2, times: [0, 0.1, 0.9, 1] }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -50, x: Math.random() * window.innerWidth, opacity: 1 }}
            animate={{
              y: window.innerHeight + 50,
              rotate: Math.random() * 360,
              opacity: 0,
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 0.5,
            }}
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: ['#FF8B3D', '#FFD166', '#FFFFFF'][Math.floor(Math.random() * 3)],
            }}
          />
        ))}
      </motion.div>

      {/* Success Icon with Pop Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.7, bounce: 0.5 }}
        className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-[var(--accent-orange)] to-[#E67A2E] rounded-full flex items-center justify-center shadow-2xl shadow-[var(--accent-orange)]/50 relative"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-[var(--accent-orange)] opacity-20"
        />
        <svg className="w-14 h-14 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl mb-4 tracking-wider text-white" style={{ fontFamily: 'var(--font-bebas)' }}
      >
        Day {day} Complete
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg mb-2 text-white"
      >
        You practiced:
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[var(--secondary-text)] mb-8"
      >
        Crafting hooks that capture attention
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-[var(--secondary-text)]"
      >
        You're building something powerful. See you tomorrow.
      </motion.p>
    </div>
  );
}

// Floating Feedback Button Component
