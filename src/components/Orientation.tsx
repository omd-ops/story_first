import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FeedbackButton } from './FeedbackButton';

interface OrientationProps {
  onComplete: (action: 'start' | 'later') => void;
}

export function Orientation({ onComplete }: OrientationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const slides = [
    {
      title: 'WELCOME TO STORYFIRST',
      content: 'This is a 70-day practice. Not a course. Not homework. A daily ritual to build your storytelling voice.',
    },
    {
      title: 'HOW IT WORKS',
      content: 'Every day: A 5-minute lesson from Coach Devon. A few reflection questions. An optional challenge. That\'s it.',
    },
    {
      title: 'STREAKS MATTER',
      content: 'Show up daily. Build your streak. Unlock higher status levels and receive personalized feedback on your storytelling.',
    },
  ];

  // Auto-advance through slides
  useEffect(() => {
    if (currentSlide < slides.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
      }, 4500); // Show each slide for 4.5 seconds
      return () => clearTimeout(timer);
    } else {
      // After last slide, show the button
      const buttonTimer = setTimeout(() => {
        setShowButton(true);
      }, 4500);
      return () => clearTimeout(buttonTimer);
    }
  }, [currentSlide, slides.length]);

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Video Background - Full Screen */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
            type="video/mp4"
          />
          {/* Fallback gradient if video doesn't load */}
          <div className="w-full h-full bg-gradient-to-br from-[var(--accent-orange)] to-[var(--accent-orange-dark)]"></div>
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Progress Indicator */}
      <div className="relative z-10 px-5 pt-8 pb-6">
        <div className="text-center lg:max-w-md lg:mx-auto">
          <div className="text-sm text-white/80 mb-4 tracking-[0.1em] font-bold uppercase" style={{ fontFamily: 'var(--font-helvetica)' }}>
            Day 0 of 70
          </div>
          <div className="flex gap-2 justify-center">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-10 bg-white'
                    : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Text Content Overlays */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-5">
        <AnimatePresence mode="wait">
          {!showButton && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-2xl mx-auto w-full text-center"
            >
              <h2
                className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-wide text-white leading-tight drop-shadow-2xl"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                {slides[currentSlide].title}
              </h2>
              <p className="text-xl md:text-2xl leading-relaxed text-white/90 drop-shadow-lg">
                {slides[currentSlide].content}
              </p>
            </motion.div>
          )}

          {/* Start Day 1 Button - Appears after all slides */}
          {showButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-md mx-auto w-full space-y-4"
            >
              <button
                onClick={() => onComplete('start')}
                className="w-full bg-white hover:bg-white/90 text-black py-5 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                Start Day 1
                <ArrowRight className="w-6 h-6" />
              </button>
              <button
                onClick={() => onComplete('later')}
                className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-4 rounded-full font-semibold transition-all border border-white/30"
              >
                Remind me later
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <FeedbackButton />
    </div>
  );
}