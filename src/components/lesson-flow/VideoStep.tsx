import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, Clock, TrendingUp, Send, Mic, Check, X, Square, Bell, Moon, Sparkles, RotateCcw, RotateCw, Info, Lightbulb, Bug, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonFlowFeedbackButton } from './LessonFlowFeedbackButton';

interface VideoStepProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (e: any) => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onComplete: () => void;
  formatTime: (seconds: number) => string;
  day: number;
  lessonTitle: string;
  videoUrl?: string | null;
}

export function VideoStep({ isPlaying, currentTime, duration, onPlayPause, onSeek, onSkipBack, onSkipForward, onComplete, formatTime, day, lessonTitle, videoUrl,} : VideoStepProps) {
  const progress = (currentTime / duration) * 100;
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure video plays on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Video autoplay prevented:', err);
      });
    }
  }, []);

  // Sync video play/pause with isPlaying state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.log('Video play error:', err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Check if video is complete
  useEffect(() => {
    if (currentTime >= duration && duration > 0) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }, [currentTime, duration, onComplete]);

  // Caption data with timestamps (start and end time in seconds)
  const captions = [
    { start: 0, end: 3, text: "Welcome to today's lesson on storytelling." },
    { start: 3, end: 7, text: "So the first thing we need to understand is how the hook grabs attention immediately." },
    { start: 7, end: 11, text: "A strong hook makes your audience want to hear more." },
    { start: 11, end: 15, text: "Think about the opening moments of your favorite stories." },
    { start: 15, end: 19, text: "They all have one thing in common - they pull you in right away." },
    { start: 19, end: 23, text: "Today, we'll explore how to craft your own compelling hooks." },
    { start: 23, end: 27, text: "Every great story starts with a moment that disrupts the ordinary." },
    { start: 27, end: 31, text: "It's the unexpected event, the surprising question, or the bold statement." },
    { start: 31, end: 35, text: "Your hook should make people lean forward, not sit back." },
    { start: 35, end: 39, text: "Consider what makes you stop scrolling when you're on your phone." },
    { start: 39, end: 43, text: "It's usually something that triggers curiosity or emotion." },
    { start: 43, end: 47, text: "The same principle applies to your storytelling." },
    { start: 47, end: 51, text: "Start with the moment that changed everything." },
    { start: 51, end: 55, text: "Don't bury the lead - put your most interesting detail first." },
    { start: 55, end: 59, text: "You can always fill in the background later." },
    { start: 59, end: 63, text: "Think of your hook as a promise to your audience." },
    { start: 63, end: 67, text: "You're saying: if you stay with me, this will be worth your time." },
    { start: 67, end: 71, text: "And then you need to deliver on that promise." },
    { start: 71, end: 75, text: "Practice identifying hooks in stories you encounter today." },
    { start: 75, end: 79, text: "What made you stop and pay attention?" },
    { start: 79, end: 83, text: "What created that initial spark of interest?" },
    { start: 83, end: 87, text: "Those insights will help you craft better hooks for your own stories." },
    { start: 87, end: 91, text: "Remember, you have just seconds to capture attention." },
    { start: 91, end: 95, text: "Make every word count, and start with your strongest moment." },
  ];

  // Find the current caption based on video time
  const currentCaption = captions.find(
    caption => currentTime >= caption.start && currentTime < caption.end
  );

  return (
    <div className="h-full w-full flex flex-col bg-black relative overflow-hidden">
      <LessonFlowFeedbackButton />
      {/* Video Player */}
      <div className="absolute inset-0 bg-black flex items-center justify-center">
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
            src={ videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-young-man-in-a-lecture-hall-4119-large.mp4" }
            type="video/mp4"
          />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Title Overlay - Top */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent px-5 pt-6 pb-12 z-20">
          <div className="text-xs text-white/70 mb-1">Day {day} • Video Lesson</div>
          <h1 className="text-3xl md:text-4xl tracking-wider text-white" style={{ fontFamily: 'var(--font-bebas)' }}>
            {lessonTitle}
          </h1>
        </div>

        {/* Play Button Overlay - Only show when paused */}
        {!isPlaying && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={onPlayPause}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow-2xl transition-colors z-10"
          >
            <Play className="w-10 h-10 text-white ml-1" fill="white" />
          </motion.button>
        )}

        {/* Captions - Show when playing and there's an active caption */}
        <AnimatePresence mode="wait">
          {isPlaying && currentCaption && (
            <motion.div
              key={currentCaption.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-44 left-4 right-4 px-6 py-4"
            >
              <p className="text-white text-center text-base leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'var(--font-helvetica)' }}>
                "{currentCaption.text}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-5 pb-8 pt-12">
          {/* Single Line Progress Bar */}
          <div className="mb-6 px-2">
            <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5B8DEE] transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Skip Controls */}
          <div className="flex items-center justify-center gap-6">
            {/* Skip Backward 15s */}
            <button
              onClick={() => onSkipBack()}
              className="flex items-center justify-center gap-2 text-white hover:text-[#5B8DEE] transition-colors group"
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
              onClick={onPlayPause}
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
              onClick={() => onSkipForward()}
              className="flex items-center justify-center gap-2 text-white hover:text-[#5B8DEE] transition-colors group"
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
  );
}