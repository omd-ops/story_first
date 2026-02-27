import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, Clock, TrendingUp, Send, Mic, Check, X, Square, Bell, Moon, Sparkles, RotateCcw, RotateCw, Info, Lightbulb, Bug, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonFlowFeedbackButton } from './LessonFlowFeedbackButton';
import { transcribeAudio, scoreTranscription, persistSample } from '@/lib/audioPipeline';

export function QAStep({ day, question, currentIndex, totalQuestions, response, responses, xp, onResponseChange, onNext, canProceed }: any) {
  const [selectedMCQ, setSelectedMCQ] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [score, setScore] = useState<{ score: number; reasoning: string } | null>(null);
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'transcribing' | 'scoring' | 'done' | 'error'>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [showMicPermission, setShowMicPermission] = useState(false);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);
  const [showXpTooltip, setShowXpTooltip] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // MCQ options for question 1
  const mcqOptions = [
    "A conversation that challenged my perspective",
    "An unexpected event that changed my plans",
    "A quiet moment of reflection",
    "A decision I had to make quickly"
  ];

  // Timer for recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleMCQSelect = (option: string) => {
    setSelectedMCQ(option);
    onResponseChange(option);
  };

  const handleTextChange = (value: string) => {
    setTextAnswer(value);
    onResponseChange(value);
  };

  const handleMicClick = async () => {
    if (!hasAskedPermission) {
      setShowMicPermission(true);
      return;
    }
    await startRecording();
  };

  const handlePermissionGrant = async () => {
    setHasAskedPermission(true);
    setShowMicPermission(false);
    await startRecording();
  };

  const handlePermissionDeny = () => {
    setShowMicPermission(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        onResponseChange('Audio recording completed');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      // Gracefully handle environments without microphone (demo/testing)
      console.log('Microphone not available, using simulated recording mode');
      
      // Start simulated recording
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Mark as simulated
      (mediaRecorderRef.current as any) = { isSimulated: true };
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Create a simulated audio blob
      if (mediaRecorderRef.current && (mediaRecorderRef.current as any).isSimulated) {
        const dummyBlob = new Blob(['simulated audio data'], { type: 'audio/webm' });
        setAudioBlob(dummyBlob);
        onResponseChange(dummyBlob);
      } else if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    }
  };

  // Kick off transcription + scoring when an audio blob exists.
  useEffect(() => {
    const runPipeline = async () => {
      if (!audioBlob) return;
      try {
        setPipelineStatus('transcribing');
        const tx = await transcribeAudio(audioBlob);
        setTranscription(tx.transcription);

        setPipelineStatus('scoring');
        const sc = await scoreTranscription(tx.transcription);
        setScore({ score: sc.score, reasoning: sc.reasoning });

        await persistSample(audioBlob, tx.transcription, sc);
        setPipelineStatus('done');
      } catch (err) {
        console.error(err);
        setPipelineStatus('error');
      }
    };
    runPipeline();
  }, [audioBlob]);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine if submit button should be enabled
  const isSubmitEnabled = () => {
    if (currentIndex === 0) return selectedMCQ.length > 0;
    if (currentIndex === 1) return textAnswer.trim().length > 0;
    if (currentIndex === 2) return audioBlob !== null;
    return false;
  };

  return (
    <>
      <LessonFlowFeedbackButton />
      <div className="fixed inset-0 bg-[var(--background)] flex flex-col">
        {/* Header Bar */}
        <div className="bg-blue-600 px-5 py-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl tracking-wider" style={{ fontFamily: 'var(--font-bebas)' }}>
              Day {day} Q&A
            </h2>
            <div className="flex items-center gap-1.5 relative">
              <div className="flex items-center gap-2 bg-blue-700/50 px-3 py-1.5 rounded-full">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">+{xp} XP</span>
              </div>
              <button
                onClick={() => setShowXpTooltip(!showXpTooltip)}
                className="w-7 h-7 rounded-full bg-blue-700/50 flex items-center justify-center hover:bg-blue-700/70 transition-colors"
              >
                <Info className="w-4 h-4 text-white" />
              </button>
              
              {/* XP Tooltip */}
              <AnimatePresence>
                {showXpTooltip && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-white rounded shadow-2xl p-4 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-black font-semibold text-sm mb-1.5">
                          What is XP?
                        </h4>
                        <p className="text-[var(--secondary-text)] text-xs leading-relaxed">
                          XP (Experience Points) track your progress as you build your storytelling skills. Earn XP by completing lessons, answering questions, and taking on challenges. The more you practice, the more you grow!
                        </p>
                      </div>
                    </div>
                    {/* Arrow pointing up */}
                    <div className="absolute -top-2 right-3 w-4 h-4 bg-white rotate-45 shadow-2xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Progress Bars */}
          <div className="flex gap-2">
            {[...Array(totalQuestions)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full ${
                  i < currentIndex
                    ? 'bg-white'
                    : i === currentIndex
                    ? 'bg-blue-400'
                    : 'bg-blue-800/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-5 py-8 pb-32">
          <div className="max-w-md mx-auto">
            {/* Question */}
            <h3 className="text-2xl mb-6 text-black leading-tight" style={{ fontFamily: 'var(--font-bebas)' }}>
              {question}
            </h3>

            {/* Question Type 1: MCQ */}
            {currentIndex === 0 && (
              <div className="space-y-3">
                {mcqOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleMCQSelect(option)}
                    className={`w-full text-left p-4 rounded border-2 transition-all ${
                      selectedMCQ === option
                        ? 'border-[var(--accent-orange)] bg-[var(--accent-orange)]/10'
                        : 'border-[var(--border)] bg-[var(--background-elevated)] hover:bg-[#F5F5F5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center flex-shrink-0 transition-all ${
                        selectedMCQ === option
                          ? 'border-[var(--accent-orange)] bg-[var(--accent-orange)]'
                          : 'border-[#D1D5DB] bg-white'
                      }`}>
                        {selectedMCQ === option && (
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        )}
                      </div>
                      <span className="text-black">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Question Type 2: Text Input */}
            {currentIndex === 1 && (
              <div className="mb-4">
                <textarea
                  value={textAnswer}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Type your answer..."
                  rows={8}
                  className="w-full bg-[var(--background-elevated)] border-2 border-[var(--border)] rounded px-5 py-4 text-black placeholder-[var(--secondary-text)] resize-none focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
                />
              </div>
            )}

            {/* Question Type 3: Audio Recording */}
            {currentIndex === 2 && (
              <div className="mb-4">
                <div className="bg-[var(--background-elevated)] border-2 border-[var(--border)] rounded p-8 text-center">
                  {!isRecording && !audioBlob && (
                    <div>
                      <button
                        onClick={handleMicClick}
                        className="w-20 h-20 rounded-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] flex items-center justify-center mx-auto mb-4 transition-colors"
                      >
                        <Mic className="w-10 h-10 text-white" />
                      </button>
                      <p className="text-black font-medium mb-2">Tap to record your answer</p>
                      <p className="text-[var(--secondary-text)] text-sm">Voice recording</p>
                    </div>
                  )}

                  {isRecording && (
                    <div>
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-red-500/20"
                        />
                        <button
                          onClick={stopRecording}
                          className="relative w-full h-full rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                        >
                          <Square className="w-8 h-8 text-white" fill="white" />
                        </button>
                      </div>
                      <p className="text-black font-medium mb-2">Recording...</p>
                      <p className="text-[var(--accent-orange)] text-2xl font-bold" style={{ fontFamily: 'var(--font-bebas)' }}>
                        {formatRecordingTime(recordingTime)}
                      </p>
                      <p className="text-[var(--secondary-text)] text-sm mt-2">Tap to stop</p>
                    </div>
                  )}

                  {audioBlob && !isRecording && (
                    <div>
                      <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-10 h-10 text-white" strokeWidth={3} />
                      </div>
                      <p className="text-black font-medium mb-2">Recording complete!</p>
                      <p className="text-[var(--secondary-text)] text-sm mb-4">Duration: {formatRecordingTime(recordingTime)}</p>
                      <button
                        onClick={() => {
                          setAudioBlob(null);
                          setRecordingTime(0);
                          onResponseChange('');
                        }}
                        className="text-[var(--accent-orange)] text-sm font-medium hover:underline"
                      >
                        Record again
                      </button>
                      <div className="mt-4 text-left bg-white/60 border border-[var(--border)] rounded p-3 text-sm text-black">
                        <p className="font-semibold mb-1">Processing status: {pipelineStatus}</p>
                        {transcription && (
                          <p className="mb-2">
                            <span className="font-semibold">Transcription:</span> {transcription}
                          </p>
                        )}
                        {pipelineStatus === 'scoring' && (
                          <p className="mb-1">
                            <span className="font-semibold">Score:</span> Scoring...
                          </p>
                        )}
                        {score && (
                          <div className="mb-1 rounded bg-white p-2 border border-[var(--border)]">
                            <p>
                              <span className="font-semibold">Score:</span> {score.score}/10
                            </p>
                            <p className="text-[var(--secondary-text)]">{score.reasoning}</p>
                          </div>
                        )}
                        {pipelineStatus === 'error' && (
                          <p className="text-red-600">There was a problem processing the audio.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button - Sticky at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-[var(--background)] px-5 py-5 border-t border-[var(--border)]">
          <div className="max-w-md mx-auto">
            <button
              onClick={onNext}
              disabled={!isSubmitEnabled()}
              className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] text-white py-3.5 rounded-full font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Microphone Permission Modal */}
      <AnimatePresence>
        {showMicPermission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5"
            onClick={handlePermissionDeny}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[var(--accent-orange)]/20 flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-[var(--accent-orange)]" />
                </div>
                <h3 className="text-black text-2xl mb-2 tracking-wider" style={{ fontFamily: 'var(--font-bebas)' }}>
                  Allow microphone access?
                </h3>
                <p className="text-[var(--secondary-text)] text-sm leading-relaxed">
                  StoryFirst needs access to your microphone to record your audio answer. This will only be used for your responses.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePermissionGrant}
                  className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] text-white py-3.5 rounded-full font-medium transition-colors"
                >
                  Allow Microphone
                </button>
                <button
                  onClick={handlePermissionDeny}
                  className="w-full bg-white border-2 border-gray-300 text-black py-3.5 rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                  Not Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
