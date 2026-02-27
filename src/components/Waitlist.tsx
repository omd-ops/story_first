import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { FeedbackButton } from './FeedbackButton';

interface WaitlistProps {
  onComplete: () => void;
}

export function Waitlist({ onComplete }: WaitlistProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    source: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5 bg-white">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-8 bg-[var(--accent-orange)] rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <h2 className="text-4xl mb-4 tracking-wide text-black" style={{ fontFamily: 'var(--font-bebas)' }}>
              Thanks for Joining
            </h2>
            <p className="text-[var(--secondary-text)] leading-relaxed">
              We'll be in touch shortly with next steps.
            </p>
          </div>
          
          {/* Demo access button */}
          <button
            onClick={onComplete}
            className="text-sm text-[var(--secondary-text)] hover:text-black transition-colors font-semibold"
          >
            View demo →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-white">
      <div className="max-w-md w-full">
        {/* Hero */}
        <div className="text-center mb-16">
          {/* Orange Star Icon */}
          <div className="w-32 h-32 mx-auto mb-12">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                fill="var(--accent-orange)"
                stroke="var(--accent-orange)"
                strokeWidth="0.5"
              />
            </svg>
          </div>
          
          <h1
            className="text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight tracking-wide text-black"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            You Are<br />
            the Stories<br />
            You Tell
          </h1>
          <p className="text-lg text-[var(--secondary-text)]">
            StoryFirst is a five minutes a day, 70-day habit.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={onComplete}
          className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-dark)] text-white py-4 px-6 rounded-full font-semibold transition-all flex items-center justify-center gap-2 text-base shadow-md hover:shadow-lg"
        >
          Start My Story
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      <FeedbackButton />
    </div>
  );
}