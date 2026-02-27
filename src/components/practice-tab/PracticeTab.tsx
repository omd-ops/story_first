import React from 'react';
import { mockUser } from '../../data/mockData';
import { groupLessonsByWeek } from './groupLessonsByWeek';
import { WeekCard } from './WeekCard';
import { PracticeTabProps } from './types';

export function PracticeTab({ onLessonSelect }: PracticeTabProps) {
  const weeks = groupLessonsByWeek();
  const [expandedWeek, setExpandedWeek] = React.useState<number | null>(null);

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeek(expandedWeek === weekNumber ? null : weekNumber);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-white">
      {/* Responsive Container */}
      <div className="max-w-4xl mx-auto px-5 md:px-8 lg:px-12">
        {/* Header */}
        <div className="py-8 md:py-12">
          <div className="flex items-start justify-between mb-12 md:mb-16">
            <div>
              <div className="text-xs text-[var(--secondary-text)] mb-3 tracking-[0.1em] font-bold uppercase">
                StoryFirst Program
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl tracking-tight text-black leading-[0.95]" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.02em' }}>
                70-Day<br />Journey
              </h1>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-dark)] rounded-full flex items-center justify-center mb-2 shadow-lg relative">
                <span className="text-white text-3xl md:text-4xl font-bold relative z-10" style={{ fontFamily: 'var(--font-bebas)' }}>
                  {mockUser.streak}
                </span>
              </div>
              <div className="text-[10px] text-[var(--secondary-text)] tracking-[0.15em] font-bold uppercase">
                Day Streak
              </div>
            </div>
          </div>

          {/* Weeks List with connecting line */}
          <div className="relative mt-12">
            {/* Vertical connecting line */}
            <div className="absolute left-[29px] md:left-[33px] top-[72px] bottom-0 w-[2px] bg-[var(--border)]"></div>
            
            <div className="space-y-8">
              {weeks.map((week, index) => (
                <WeekCard
                  key={week.weekNumber}
                  weekNumber={week.weekNumber}
                  title={week.title}
                  lessons={week.lessons}
                  completed={week.completed}
                  locked={week.locked}
                  available={week.available}
                  isLast={index === weeks.length - 1}
                  onLessonSelect={onLessonSelect}
                  toggleWeek={toggleWeek}
                  expanded={expandedWeek === week.weekNumber}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
