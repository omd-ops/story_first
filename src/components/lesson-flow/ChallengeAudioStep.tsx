import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, Clock, TrendingUp, Send, Mic, Check, X, Square, Bell, Moon, Sparkles, RotateCcw, RotateCw, Info, Lightbulb, Bug, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonFlowFeedbackButton } from './LessonFlowFeedbackButton';
import { transcribeAudio, scoreTranscription, persistSample } from '@/lib/audioPipeline';

export function ChallengeAudioStep({ day, onNext }: any) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [score, setScore] = useState<{ score: number; reasoning: string } | null>(null);
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'transcribing' | 'scoring' | 'done' | 'error'>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.log('Microphone not available, using simulated recording mode');
      
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      (mediaRecorderRef.current as any) = { isSimulated: true };
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaRecorderRef.current && (mediaRecorderRef.current as any).isSimulated) {
        const dummyBlob = new Blob(['simulated audio data'], { type: 'audio/webm' });
        setAudioBlob(dummyBlob);
      } else if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setScore(null);
    setPipelineStatus('idle');
    setRecordingTime(0);
  };

  // Run transcription + scoring when challenge audio is ready.
  useEffect(() => {
    const runPipeline = async () => {
      if (!audioBlob) return;
      try {
        setPipelineStatus('transcribing');
        const tx = await transcribeAudio(audioBlob);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const hasContent = audioBlob !== null;
  const canSubmit = hasContent && (pipelineStatus === 'done' || pipelineStatus === 'error');
  
  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      <LessonFlowFeedbackButton />
      {/* Header */}
      <div className="bg-white px-5 py-6 border-b border-[var(--border)]">
        <h1 className="text-black text-2xl tracking-wider" style={{ fontFamily: 'var(--font-bebas)' }}>
          Day {day} Challenge - Audio
        </h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-8 pb-32">
        <div className="max-w-md mx-auto">
          <div className="space-y-6">
            {!audioBlob ? (
              <div className="text-center">
                <p className="text-[var(--secondary-text)] mb-2 text-lg">
                  {isRecording ? 'Recording your story...' : 'Now record your audio response'}
                </p>
                <p className="text-[var(--secondary-text)] mb-8 text-sm">
                  {!isRecording && 'Tap the microphone to start'}
                </p>
                
                {/* Recording Button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-2xl ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] hover:scale-105 active:scale-95'
                  }`}
                >
                  {isRecording ? (
                    <Square className="w-12 h-12 text-white" fill="white" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </button>

                {/* Recording Timer */}
                {isRecording && (
                  <div className="mt-8 text-4xl text-black font-mono tracking-wider" style={{ fontFamily: 'var(--font-bebas)' }}>
                    {formatTime(recordingTime)}
                  </div>
                )}
              </div>
            ) : (
              /* Recorded Audio Preview */
              <div className="bg-[var(--background-elevated)] border-2 border-[var(--accent-orange)] rounded p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[var(--accent-orange)] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mic className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-black font-semibold text-lg">Audio Recording</div>
                    <div className="text-[var(--secondary-text)]">{formatTime(recordingTime)}</div>
                  </div>
                  <button
                    onClick={deleteRecording}
                    className="w-10 h-10 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 hover:text-red-600 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Audio Waveform Visualization (Mock) */}
                <div className="flex items-center gap-1 h-20 mb-4">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[var(--accent-orange)] rounded-full opacity-60"
                      style={{
                        height: `${Math.random() * 70 + 20}%`,
                      }}
                    />
                  ))}
                </div>

                <p className="text-[var(--secondary-text)] text-sm text-center">
                  Tap the X to delete and re-record
                </p>

                {pipelineStatus === 'transcribing' && (
                  <p className="text-[var(--secondary-text)] text-sm text-center mt-3">
                    Transcribing audio...
                  </p>
                )}
                {pipelineStatus === 'scoring' && (
                  <p className="text-[var(--secondary-text)] text-sm text-center mt-3">
                    Scoring your response...
                  </p>
                )}
                {pipelineStatus === 'done' && score && (
                  <p className="text-[var(--secondary-text)] text-sm text-center mt-3">
                    Score: {score.score}/10
                  </p>
                )}
                {pipelineStatus === 'error' && (
                  <p className="text-red-500 text-sm text-center mt-3">
                    Scoring failed. You can still submit this recording.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons - Sticky at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-5 border-t border-[var(--border)]">
        <div className="max-w-md mx-auto">
          <button
            onClick={onNext}
            disabled={!canSubmit}
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
