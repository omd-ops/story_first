import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface CelebrationProps {
  type: 'first-lesson' | 'streak-milestone' | 'status-unlock';
  streak?: number;
  status?: number;
  onDismiss: () => void;
}

export function Celebration({ type, streak, status, onDismiss }: CelebrationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getMessage = () => {
    if (type === 'first-lesson') {
      return {
        title: 'YOU DID IT',
        subtitle: 'First lesson complete',
      };
    }
    if (type === 'streak-milestone') {
      return {
        title: `${streak} DAYS`,
        subtitle: 'Streak milestone reached!',
      };
    }
    if (type === 'status-unlock') {
      return {
        title: `STATUS ${status}`,
        subtitle: 'Unlocked personalized feedback',
      };
    }
    return { title: '', subtitle: '' };
  };

  const message = getMessage();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative"
          >
            {/* Animated sparkles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: 360,
                    x: Math.cos((i / 12) * Math.PI * 2) * 100,
                    y: Math.sin((i / 12) * Math.PI * 2) * 100,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    ease: 'easeOut',
                  }}
                  className="absolute top-1/2 left-1/2"
                >
                  <Sparkles className="w-4 h-4 text-[var(--accent-orange)]" />
                </motion.div>
              ))}
            </div>

            {/* Main celebration card */}
            <div className="bg-[var(--background-elevated)] rounded p-12 text-center shadow-2xl max-w-sm mx-5 border border-[var(--border)]">
              <motion.div
                initial={{ rotate: -30, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 10,
                  delay: 0.2,
                }}
                className="w-24 h-24 mx-auto mb-6 bg-[var(--accent-orange)] rounded-full flex items-center justify-center"
              >
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl mb-3 tracking-wider text-white"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                {message.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-[var(--secondary-text)]"
              >
                {message.subtitle}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}