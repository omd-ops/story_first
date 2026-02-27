"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Home, BookOpen, Menu, User, ArrowLeft } from 'lucide-react';
import { PracticeTab } from '@/components/PracticeTab';
import { FeedTab } from '@/components/FeedTab';
import { LessonFlow } from '@/components/LessonFlow';
import { Profile } from '@/components/Profile';
import { Waitlist } from '@/components/Waitlist';
import { Orientation } from '@/components/Orientation';
import { Onboarding } from '@/components/Onboarding';
import { FeedbackButton } from '@/components/FeedbackButton';

type View = 'onboarding' | 'waitlist' | 'orientation' | 'feed' | 'practice' | 'lesson' | 'profile';

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/95 px-4 py-2 text-sm font-semibold text-black shadow-sm backdrop-blur-sm hover:bg-[var(--background-elevated)]"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
}

export default function App() {
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<View>('onboarding');
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [viewHistory, setViewHistory] = useState<View[]>([]);

  useEffect(() => {
    const requestedView = searchParams.get('view');
    const requestedDay = Number(searchParams.get('day'));

    if (requestedView === 'lesson' && Number.isFinite(requestedDay) && requestedDay > 0) {
      setSelectedLesson(requestedDay);
      setCurrentView('lesson');
      setViewHistory([]);
      return;
    }

    if (requestedView === 'practice' || requestedView === 'feed' || requestedView === 'profile') {
      setSelectedLesson(null);
      setCurrentView(requestedView);
      setViewHistory([]);
    }
  }, [searchParams]);

  const navigateTo = (nextView: View) => {
    setViewHistory((prev) => (currentView !== nextView ? [...prev, currentView] : prev));
    setCurrentView(nextView);
  };

  const goBack = () => {
    if (viewHistory.length === 0) {
      window.history.back();
      return;
    }

    setViewHistory((prev) => {
      const previousView = prev[prev.length - 1];
      if (!previousView) return prev;
      setCurrentView(previousView);
      if (previousView !== 'lesson') {
        setSelectedLesson(null);
      }
      return prev.slice(0, -1);
    });
  };

  const handleLessonSelect = (day: number) => {
    setSelectedLesson(day);
    navigateTo('lesson');
  };

  const handleLessonComplete = () => {
    setSelectedLesson(null);
    navigateTo('feed');
  };

  const handleLessonClose = () => {
    setSelectedLesson(null);
    navigateTo('practice');
  };

  const handleOrientationComplete = (action: 'start' | 'later') => {
    if (action === 'start') {
      handleLessonSelect(1); // Start Day 1
    } else {
      navigateTo('feed'); // Go to Feed
    }
  };

  const isStartingView = currentView === 'onboarding' || currentView === 'waitlist' || currentView === 'orientation';
  const showBackButton = isStartingView || viewHistory.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Comment out the next line to hide the temporary back button */}
      {showBackButton && <BackButton onBack={goBack} />}
      {/* Main Content */}
      {currentView === 'onboarding' && <Onboarding onComplete={() => navigateTo('waitlist')} />}
      {currentView === 'waitlist' && <Waitlist onComplete={() => navigateTo('orientation')} />}
      {currentView === 'orientation' && <Orientation onComplete={handleOrientationComplete} />}
      {currentView === 'practice' && (
        <>
          {/* Top Navigation Bar with Profile - Responsive */}
          <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-[var(--border)] z-40 transition-all">
            <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-5 flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl tracking-wider text-black" style={{ fontFamily: 'var(--font-bebas)' }}>
                StoryFirst
              </h1>
              <div className="flex items-center gap-6">
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => navigateTo('practice')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all relative group"
                  >
                    {currentView === 'practice' && (
                      <div className="absolute inset-0 bg-[var(--accent-blue)] rounded-full opacity-100"></div>
                    )}
                    <BookOpen
                      className={`w-5 h-5 relative z-10 transition-colors ${
                        currentView === 'practice'
                          ? 'text-white'
                          : 'text-black'
                      }`}
                      strokeWidth={currentView === 'practice' ? 2.5 : 2}
                    />
                    <span className={`text-sm font-semibold relative z-10 transition-colors ${
                      currentView === 'practice'
                        ? 'text-white'
                        : 'text-black'
                    }`}>
                      Learn
                    </span>
                  </button>
                  <button
                    onClick={() => navigateTo('feed')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all relative group hover:bg-[var(--background-elevated)]"
                  >
                    <Home
                      className="w-5 h-5 relative z-10 text-black"
                      strokeWidth={2}
                    />
                    <span className="text-sm font-semibold relative z-10 text-black">
                      Feed
                    </span>
                  </button>
                </nav>
                <button
                  onClick={() => navigateTo('profile')}
                  className="p-2.5 hover:bg-[var(--background-elevated)] rounded-full transition-all"
                >
                  <User className="w-6 h-6 text-black" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
          <div className="pt-20">
            <PracticeTab onLessonSelect={handleLessonSelect} />
          </div>
        </>
      )}
      {currentView === 'feed' && (
        <>
          {/* Top Navigation Bar with Profile - Responsive */}
          <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-[var(--border)] z-40 transition-all">
            <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-5 flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl tracking-wider text-black" style={{ fontFamily: 'var(--font-bebas)' }}>
                StoryFirst
              </h1>
              <div className="flex items-center gap-6">
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => navigateTo('practice')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all relative hover:bg-[var(--background-elevated)]"
                  >
                    <BookOpen
                      className="w-5 h-5 relative z-10 text-black"
                      strokeWidth={2}
                    />
                    <span className="text-sm font-semibold relative z-10 text-black">
                      Learn
                    </span>
                  </button>
                  <button
                    onClick={() => navigateTo('feed')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all relative group"
                  >
                    {currentView === 'feed' && (
                      <div className="absolute inset-0 bg-[var(--accent-orange)] rounded-full opacity-100"></div>
                    )}
                    <Home
                      className={`w-5 h-5 relative z-10 transition-colors ${
                        currentView === 'feed'
                          ? 'text-white'
                          : 'text-black'
                      }`}
                      strokeWidth={currentView === 'feed' ? 2.5 : 2}
                    />
                    <span className={`text-sm font-semibold relative z-10 transition-colors ${
                      currentView === 'feed'
                        ? 'text-white'
                        : 'text-black'
                    }`}>
                      Feed
                    </span>
                  </button>
                </nav>
                <button
                  onClick={() => navigateTo('profile')}
                  className="p-2.5 hover:bg-[var(--background-elevated)] rounded-full transition-all"
                >
                  <User className="w-6 h-6 text-black" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
          <div className="pt-20">
            <FeedTab />
          </div>
        </>
      )}
      {currentView === 'lesson' && selectedLesson && (
        <LessonFlow
          day={selectedLesson}
          onClose={handleLessonClose}
          onComplete={handleLessonComplete}
        />
      )}
      {currentView === 'profile' && <Profile onClose={() => navigateTo('practice')} />}

      {/* Bottom Navigation - Only show on mobile, hide on tablet/desktop */}
      {currentView !== 'lesson' && currentView !== 'profile' && currentView !== 'waitlist' && currentView !== 'orientation' && currentView !== 'onboarding' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[var(--border)] safe-area-bottom z-40">
          <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-around">
            {/* Learn Tab */}
            <button
              onClick={() => navigateTo('practice')}
              className="flex flex-col items-center gap-1 px-6 py-2.5 rounded transition-all relative"
            >
              {currentView === 'practice' && (
                <div className="absolute inset-0 bg-[var(--accent-blue)] rounded opacity-100"></div>
              )}
              <BookOpen
                className={`w-6 h-6 relative z-10 transition-colors ${
                  currentView === 'practice'
                    ? 'text-white'
                    : 'text-black'
                }`}
                strokeWidth={currentView === 'practice' ? 2.5 : 2}
              />
              <span className={`text-xs font-semibold relative z-10 transition-colors ${
                currentView === 'practice'
                  ? 'text-white'
                  : 'text-black'
              }`}>
                Learn
              </span>
            </button>

            {/* Feed Tab */}
            <button
              onClick={() => navigateTo('feed')}
              className="flex flex-col items-center gap-1 px-6 py-2.5 rounded transition-all relative"
            >
              {currentView === 'feed' && (
                <div className="absolute inset-0 bg-[var(--accent-orange)] rounded opacity-100"></div>
              )}
              <Home
                className={`w-6 h-6 relative z-10 transition-colors ${
                  currentView === 'feed'
                    ? 'text-white'
                    : 'text-black'
                }`}
                strokeWidth={currentView === 'feed' ? 2.5 : 2}
              />
              <span className={`text-xs font-semibold relative z-10 transition-colors ${
                currentView === 'feed'
                  ? 'text-white'
                  : 'text-black'
              }`}>
                Feed
              </span>
            </button>
          </div>
        </nav>
      )}
      <FeedbackButton />
    </div>
  );
}
