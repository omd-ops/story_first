import React from 'react';
import { ChevronDown, Lock } from 'lucide-react';

export function WeekCard({ weekNumber, title, lessons, completed, locked, available, isLast, onLessonSelect, toggleWeek, expanded }: any) {
  // Calculate progress
  const completedLessons = lessons.filter((l: any) => l.completed).length;
  const totalLessons = lessons.length;
  
  // Determine week status
  const isFullyCompleted = completedLessons === totalLessons;
  const isInProgress = completedLessons > 0 && completedLessons < totalLessons && available;
  
  // Find first available lesson that's not completed
  const firstAvailableLesson = lessons.find((l: any) => l.available && !l.completed);
  
  // SVG circle properties for 7 segments
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const segmentLength = circumference / totalLessons;
  const gapLength = segmentLength * 0.2; // 20% gap between segments
  const dashLength = segmentLength - gapLength;
  
  return (
    <div className="relative flex items-start gap-5 group">
      {/* Week Number Circle with Progress */}
      <div className="relative z-10 flex-shrink-0 pt-1">
        <button
          onClick={() => !locked && toggleWeek(weekNumber)}
          disabled={locked}
          className={`w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all relative ${
            locked
              ? 'bg-white border-2 border-[var(--border-medium)] cursor-not-allowed'
              : 'bg-white shadow-lg hover:scale-110 cursor-pointer'
          }`}
        >
          {/* Background Circle with 7 dashed segments */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 60 60">
            {/* Background track - 7 dashed segments */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth="3"
              strokeDasharray={`${dashLength} ${gapLength}`}
              strokeLinecap="round"
            />
            {/* Progress - completed segments */}
            {!locked && lessons.map((lesson: any, index: number) => {
              if (!lesson.completed) return null;
              
              const segmentCircumference = circumference;
              const offset = (segmentCircumference / totalLessons) * index;
              
              return (
                <circle
                  key={index}
                  cx="30"
                  cy="30"
                  r={radius}
                  fill="none"
                  stroke={available ? 'var(--accent-blue)' : 'black'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={-offset}
                  style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
              );
            })}
          </svg>
          
          {/* Center Content */}
          {locked ? (
            <Lock className="w-5 h-5 text-[var(--secondary-text)] relative z-10" />
          ) : (
            <span className="text-black text-xl font-bold relative z-10" style={{ fontFamily: 'var(--font-bebas)' }}>
              J{weekNumber}
            </span>
          )}
        </button>
      </div>

      {/* Stacked Cards - 7 cards layered */}
      <div className="flex-1 relative" style={{ perspective: '1000px' }}>
        {!expanded && (
          <>
            {/* Stack effect - bottom cards */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`stack-${i}`}
                className={`absolute left-0 right-0 ${
                  isFullyCompleted
                    ? 'bg-gradient-to-br from-[#E8F8F0] to-[#D4F1E3] border-2 border-[#A8E6CF]/30'
                    : isInProgress
                    ? 'bg-gradient-to-br from-[#E8F4FF] to-[#D6EBFF] border-2 border-[var(--accent-blue)]/20'
                    : 'bg-white border-2 border-[var(--border)]'
                }`}
                style={{
                  transform: `translateY(${(6 - i) * -4}px) translateX(${(6 - i) * 3}px)`,
                  zIndex: i,
                  opacity: 0.6,
                  height: '100px'
                }}
              />
            ))}
          </>
        )}
        
        {/* Top card - main display card (collapsed view) */}
        {!expanded && (
          <div
            className={`relative w-full text-left p-6 md:p-8 transition-all duration-300 ${
              isFullyCompleted
                ? 'bg-gradient-to-br from-[#E8F8F0] to-[#D4F1E3] border-2 border-[#A8E6CF]/40 shadow-md'
                : isInProgress
                ? 'bg-gradient-to-br from-[#E8F4FF] to-[#D6EBFF] border-2 border-[var(--accent-blue)]/30 shadow-md'
                : available && !locked
                ? 'bg-white border-2 border-[var(--border)] shadow-md'
                : locked
                ? 'bg-white border-2 border-[var(--border)]'
                : 'bg-white border-2 border-[var(--border)]'
            }`}
            style={{ zIndex: 7 }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3
                className={`text-2xl md:text-3xl tracking-wide leading-tight ${
                  locked ? 'text-[var(--secondary-text)]' : 'text-black'
                }`}
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                {locked ? `Journey ${weekNumber}` : title}
              </h3>
              
              {/* Badge */}
              {!locked && isFullyCompleted && (
                <div className="bg-[#A8E6CF] px-4 py-2 rounded-full shadow-sm">
                  <span className="text-black text-[10px] font-bold tracking-wider uppercase">
                    Completed
                  </span>
                </div>
              )}
              
              {!locked && !isFullyCompleted && available && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (firstAvailableLesson) {
                      onLessonSelect(firstAvailableLesson.day);
                    }
                  }}
                  className="bg-[var(--accent-blue)] px-4 py-2 rounded-full shadow-sm hover:bg-[var(--accent-blue-dark)] transition-all"
                >
                  <span className="text-white text-[10px] font-bold tracking-wider uppercase">
                    Start Now
                  </span>
                </button>
              )}
            </div>
            
            <p
              className={`text-sm md:text-base ${
                locked ? 'text-[var(--tertiary-text)]' : 'text-black/60'
              }`}
            >
              7 lessons · {lessons.filter((l: any) => l.completed).length} completed
            </p>
          </div>
        )}

        {/* Expanded view - individual lesson cards */}
        {expanded && (
          <div className="space-y-3">
            {lessons.map((lesson: any, index: number) => (
              <button
                key={lesson.day}
                onClick={() => !lesson.locked && onLessonSelect(lesson.day)}
                disabled={lesson.locked}
                className={`w-full text-left p-5 md:p-6 transition-all duration-300 border-2 ${
                  lesson.completed
                    ? 'bg-gradient-to-br from-[#E8F8F0] to-[#D4F1E3] border-[#A8E6CF]/40'
                    : lesson.available && !lesson.locked
                    ? 'bg-white border-[var(--accent-blue)] hover:shadow-lg hover:-translate-y-1'
                    : lesson.locked
                    ? 'bg-white border-[var(--border)] opacity-50 cursor-not-allowed'
                    : 'bg-white border-[var(--border)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        lesson.completed
                          ? 'bg-[#A8E6CF]'
                          : lesson.available && !lesson.locked
                          ? 'bg-[var(--accent-blue)]/10 border-2 border-[var(--accent-blue)]'
                          : 'bg-gray-100'
                      }`}
                    >
                      {lesson.locked ? (
                        <Lock className="w-4 h-4 text-gray-400" />
                      ) : (
                        <span
                          className={`text-sm font-bold ${
                            lesson.completed ? 'text-black' : 'text-[var(--accent-blue)]'
                          }`}
                          style={{ fontFamily: 'var(--font-bebas)' }}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-black" style={{ fontFamily: 'var(--font-bebas)' }}>
                        Day {lesson.day}
                      </h4>
                      <p className="text-sm text-black/60">{lesson.title}</p>
                    </div>
                  </div>
                  
                  {lesson.completed && (
                    <div className="bg-[#A8E6CF] px-3 py-1 rounded-full">
                      <span className="text-black text-[10px] font-bold tracking-wider uppercase">
                        Done
                      </span>
                    </div>
                  )}
                  
                  {lesson.available && !lesson.locked && !lesson.completed && (
                    <div className="bg-[var(--accent-blue)] px-3 py-1 rounded-full">
                      <span className="text-white text-[10px] font-bold tracking-wider uppercase">
                        Start
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-black/50">{lesson.duration}</p>
              </button>
            ))}
            
            {/* Collapse button */}
            <button
              onClick={() => toggleWeek(weekNumber)}
              className="w-full flex justify-center p-3 bg-transparent hover:bg-gray-50 transition-all rounded"
            >
              <ChevronDown className="w-5 h-5 text-black/60" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
