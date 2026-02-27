import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IntroStep } from './IntroStep';
import { VideoStep } from './VideoStep';
import { QAStep } from './QAStep';
import { ChallengeStep } from './ChallengeStep';
import { ChallengeResponseStep } from './ChallengeResponseStep';
import { ChallengeAudioStep } from './ChallengeAudioStep';
import { SnoozeReminderStep } from './SnoozeReminderStep';
import { WrapStep } from './WrapStep';

interface LessonFlowProps {
  day: number;
  onClose: () => void;
  onComplete: () => void;
}

type LessonStep = 'intro' | 'video' | 'qa' | 'challenge' | 'challengeResponse' | 'challengeAudio' | 'snoozeReminder' | 'wrapVideo' | 'wrap';

export function LessonFlow({ day, onClose, onComplete }: LessonFlowProps) {
  const [step, setStep] = useState<LessonStep>('intro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(95); // 1:35 in seconds
  const [qaIndex, setQaIndex] = useState(0);
  const [responses, setResponses] = useState<any[]>([]); // Changed to any[] to store different types
  const [currentResponse, setCurrentResponse] = useState<any>(''); // Can be string or audio blob
  const [challengeResponse, setChallengeResponse] = useState('');
  const [showMicPermission, setShowMicPermission] = useState(false);
  const [hasAskedMicPermission, setHasAskedMicPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const lessonTitle = 'The Hook';
  const qaQuestions = [
    'What moment this week made you stop and think?',
    'Who was involved in that moment?',
    'What emotion did you feel most strongly?',
  ];

  const xpPerQuestion = [0, 10, 20]; // XP earned for each question

  // Simulate video playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  // Auto-play video when transitioning from intro to video step
  useEffect(() => {
    if (step === 'video') {
      setIsPlaying(true);
    }
  }, [step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
  };

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 15));
  };

  const handleSkipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 15));
  };

  const handleVideoComplete = () => {
    setStep('qa');
  };

  const handleNextStep = () => {
    if (step === 'qa') {
      if (qaIndex < qaQuestions.length - 1) {
        setResponses([...responses, currentResponse]);
        setCurrentResponse('');
        setQaIndex(qaIndex + 1);
      } else {
        setResponses([...responses, currentResponse]);
        setStep('challenge'); // Go directly to challenge after Q&A
      }
    } else if (step === 'challenge') {
      setStep('challengeResponse');
    } else if (step === 'challengeResponse') {
      setStep('challengeAudio');
    } else if (step === 'challengeAudio') {
      setStep('wrap');
    } else if (step === 'wrap') {
      onComplete();
    }
  };

  const handleSnooze = () => {
    setStep('snoozeReminder');
  };

  const canProceed = () => {
    if (step === 'qa') {
      // Handle different response types
      if (typeof currentResponse === 'string') {
        return currentResponse.trim().length > 0;
      }
      // For non-string types (like Blob for audio), check if it exists
      return currentResponse !== null && currentResponse !== '';
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-[var(--background)] z-50 overflow-hidden flex flex-col">
      {/* Responsive Container for Lesson Content */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="px-5 md:px-8 py-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-black/60 mb-1">Day {day} • Video Lesson</div>
              <h1 className="text-2xl md:text-3xl tracking-wider text-black" style={{ fontFamily: 'var(--font-bebas)' }}>
                {lessonTitle}
              </h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 -m-2 hover:bg-[var(--background-elevated)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              <IntroStep day={day} onContinue={() => setStep('video')} />
            </motion.div>
          )}

          {step === 'video' && (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              <VideoStep
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onSeek={handleSeek}
                onSkipBack={handleSkipBack}
                onSkipForward={handleSkipForward}
                onComplete={handleVideoComplete}
                formatTime={formatTime}
                day={day}
                lessonTitle={lessonTitle}
              />
            </motion.div>
          )}

          {step === 'qa' && (
            <motion.div
              key="qa"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-y-auto px-5 md:px-8 py-8"
            >
              <QAStep
                day={day}
                question={qaQuestions[qaIndex]}
                currentIndex={qaIndex}
                totalQuestions={qaQuestions.length}
                response={currentResponse}
                responses={responses}
                xp={xpPerQuestion[qaIndex]}
                onResponseChange={setCurrentResponse}
                onNext={handleNextStep}
                canProceed={canProceed()}
              />
            </motion.div>
          )}

          {step === 'challenge' && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-y-auto"
            >
              <ChallengeStep day={day} streak={day} onDoNow={handleNextStep} onSnooze={handleSnooze} />
            </motion.div>
          )}

          {step === 'challengeResponse' && (
            <motion.div
              key="challengeResponse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-y-auto"
            >
              <ChallengeResponseStep day={day} onNext={handleNextStep} />
            </motion.div>
          )}

          {step === 'challengeAudio' && (
            <motion.div
              key="challengeAudio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-y-auto"
            >
              <ChallengeAudioStep day={day} onNext={handleNextStep} />
            </motion.div>
          )}

          {step === 'snoozeReminder' && (
            <motion.div
              key="snoozeReminder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-y-auto"
            >
              <SnoozeReminderStep onSelect={onComplete} />
            </motion.div>
          )}

          {step === 'wrap' && (
            <motion.div
              key="wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-y-auto px-5 md:px-8 py-8"
            >
              <WrapStep day={day} streak={13} onFinish={handleNextStep} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
