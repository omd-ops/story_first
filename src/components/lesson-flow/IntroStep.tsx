import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, Clock, TrendingUp, Send, Mic, Check, X, Square, Bell, Moon, Sparkles, RotateCcw, RotateCw, Info, Lightbulb, Bug, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonFlowFeedbackButton } from './LessonFlowFeedbackButton';

export function IntroStep({ day, onContinue }: { day: number; onContinue: () => void }) {
  const [introPhase, setIntroPhase] = useState<'dayIntro' | 'lesson'>('dayIntro');
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play
  const [introTime, setIntroTime] = useState(0);
  const introDuration = 5; // 5 seconds for day intro
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure video plays on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Video autoplay prevented:', err);
      });
    }
  }, []);

  // Auto-play day intro video
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (introPhase === 'dayIntro' && introTime < introDuration) {
      interval = setInterval(() => {
        setIntroTime(prev => {
          if (prev >= introDuration - 1) {
            // Auto-transition to main lesson after 5 seconds
            setTimeout(() => {
              onContinue();
            }, 1000);
            return introDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [introPhase, introTime, introDuration, onContinue]);

  return (
    <div className="h-full w-full flex flex-col bg-black relative overflow-hidden">
      <LessonFlowFeedbackButton />
      {/* Full Screen Day Intro Video */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-black flex items-center justify-center relative">
          {/* Background Video */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              console.log('Video failed to load');
            }}
            crossOrigin="anonymous"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4"
              type="video/mp4"
            />
          </video>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Day Number and Introduction Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center"
            >
              <h1 
                className="text-8xl md:text-9xl text-white mb-4 tracking-wider drop-shadow-2xl"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                DAY {day}
              </h1>
              <div className="inline-block bg-white/90 backdrop-blur-sm text-black px-8 py-3 rounded-full">
                <span className="text-xl font-medium">Introduction</span>
              </div>
            </motion.div>
          </div>

          {/* Video Controls - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-5 pb-8 pt-12">
            <div className="flex items-center justify-center gap-6">
              {/* Skip Backward 15s */}
              <button
                onClick={() => {
                  setIntroTime(Math.max(0, introTime - 15));
                }}
                className="flex items-center justify-center gap-2 text-white hover:text-blue-400 transition-colors group"
              >
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <RotateCcw className="w-7 h-7" strokeWidth={2.5} />
                  <span 
                    className="absolute text-[10px] font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ 
                      fontFamily: 'var(--font-helvetica)'
                    }}
                  >
                    15
                  </span>
                </div>
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={() => {
                  if (videoRef.current) {
                    if (isPlaying) {
                      videoRef.current.pause();
                      setIsPlaying(false);
                    } else {
                      videoRef.current.play().catch(err => {
                        console.log('Video play error:', err);
                      });
                      setIsPlaying(true);
                    }
                  }
                }}
                className="w-16 h-16 rounded-full bg-[#5B8DEE] hover:bg-[#4A7CD6] flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 text-white" fill="white" strokeWidth={0} />
                ) : (
                  <Play className="w-7 h-7 text-white ml-0.5" fill="white" strokeWidth={0} />
                )}
              </button>

              {/* Skip Forward 15s */}
              <button
                onClick={() => {
                  const newTime = Math.min(introDuration, introTime + 15);
                  setIntroTime(newTime);
                  if (newTime >= introDuration) {
                    onContinue();
                  }
                }}
                className="flex items-center justify-center gap-2 text-white hover:text-blue-400 transition-colors group"
              >
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <RotateCw className="w-7 h-7" strokeWidth={2.5} />
                  <span 
                    className="absolute text-[10px] font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ 
                      fontFamily: 'var(--font-helvetica)'
                    }}
                  >
                    15
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

