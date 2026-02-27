import React, { useState } from 'react';
import { FeedbackCard } from './FeedbackCard';

export function FeedbackSection() {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([]);

  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev =>
      prev.includes(week)
        ? prev.filter(w => w !== week)
        : [...prev, week]
    );
  };

  const feedbackData = [
    {
      week: 2,
      available: true,
      summary: 'Strong progress on emotional authenticity',
      details: {
        hookScore: 8.5,
        characterScore: 7.8,
        emotionScore: 9.2,
        feedback: 'Your hooks are getting sharper. I noticed in Day 9 how you opened with a question that immediately created tension. That\'s exactly what we\'re looking for. Keep leaning into specificity - your best moments this week were when you named exact details instead of general feelings.',
      },
    },
    {
      week: 1,
      available: true,
      summary: 'Great foundation work',
      details: {
        hookScore: 7.2,
        characterScore: 7.0,
        emotionScore: 8.0,
        feedback: 'Welcome to StoryFirst! You\'re showing up consistently, and that\'s the hardest part. I can see you\'re still finding your voice - that\'s normal. Pay attention to the moments where you surprised yourself. Those are the seeds of your unique storytelling style.',
      },
    },
  ];

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30 p-5">
        <p className="text-sm text-black">
          <span className="font-medium">Status 1 unlocked!</span> You now receive weekly grading from Coach Devon.
        </p>
      </div>

      {feedbackData.map((item) => (
        <FeedbackCard
          key={item.week}
          week={item.week}
          isExpanded={expandedWeeks.includes(item.week)}
          onToggle={() => toggleWeek(item.week)}
          {...item}
        />
      ))}

      <div className="text-center py-8 text-[var(--secondary-text)] text-sm">
        Grading is delivered weekly after completing at least 5 lessons
      </div>
    </div>
  );
}
