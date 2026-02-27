import React from 'react';
import { mockUser } from '../../data/mockData';

export function ProfileSection() {
  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Avatar and Name */}
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-[var(--accent-orange)] rounded-full flex items-center justify-center text-4xl">
          👤
        </div>
        <h2 className="text-2xl font-medium mb-1 text-black">{mockUser.name}</h2>
        <p className="text-[var(--secondary-text)]">Day {mockUser.currentDay} of 70</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 border-2 border-[var(--border)] text-center shadow-sm">
          <div className="text-4xl font-medium mb-1 text-black" style={{ fontFamily: 'var(--font-bebas)' }}>
            {mockUser.streak}
          </div>
          <div className="text-sm text-[var(--secondary-text)]">Day Streak</div>
        </div>

        <div className="bg-white p-5 border-2 border-[var(--border)] text-center shadow-sm">
          <div className="text-4xl font-medium mb-1 text-black" style={{ fontFamily: 'var(--font-bebas)' }}>
            {mockUser.xp.toLocaleString()}
          </div>
          <div className="text-sm text-[var(--secondary-text)]">Total XP</div>
        </div>

        <div className="bg-white p-5 border-2 border-[var(--border)] text-center shadow-sm">
          <div className="text-4xl font-medium mb-1 text-black" style={{ fontFamily: 'var(--font-bebas)' }}>
            {mockUser.status}
          </div>
          <div className="text-sm text-[var(--secondary-text)]">Status Level</div>
        </div>

        <div className="bg-white p-5 border-2 border-[var(--border)] text-center shadow-sm">
          <div className="text-4xl font-medium mb-1 text-black" style={{ fontFamily: 'var(--font-bebas)' }}>
            {mockUser.pauseTokens}
          </div>
          <div className="text-sm text-[var(--secondary-text)]">Pause Tokens</div>
        </div>
      </div>

      {/* Status Info */}
      <div className="bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/30 p-5">
        <h3 className="font-medium mb-2 text-black">About Status</h3>
        <p className="text-sm text-[var(--secondary-text)] leading-relaxed">
          Your status level unlocks personalized feedback from Coach Devon. 
          Keep practicing to reach higher status levels and receive deeper insights.
        </p>
      </div>
    </div>
  );
}
