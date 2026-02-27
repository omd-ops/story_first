import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FeedbackButton } from '../FeedbackButton';
import { ProfileSection } from './ProfileSection';
import { SettingsSection } from './SettingsSection';
import { FeedbackSection } from './FeedbackSection';
import { ProfileProps } from './types';

export function Profile({ onClose }: ProfileProps) {
  const [activeSection, setActiveSection] = useState<'profile' | 'settings' | 'feedback'>('profile');

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-black" style={{ fontFamily: 'var(--font-arizona)', textTransform: 'uppercase' }}>
              {activeSection === 'profile' && 'Profile'}
              {activeSection === 'settings' && 'Settings'}
              {activeSection === 'feedback' && 'Grading History'}
            </h1>
            <button
              onClick={onClose}
              className="p-2 -m-2 hover:bg-[var(--background-elevated)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-2 flex gap-2">
          <button
            onClick={() => setActiveSection('profile')}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
              activeSection === 'profile'
                ? 'bg-[var(--accent-orange)] text-white'
                : 'text-black hover:bg-[var(--background-elevated)]'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveSection('settings')}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
              activeSection === 'settings'
                ? 'bg-[var(--accent-orange)] text-white'
                : 'text-black hover:bg-[var(--background-elevated)]'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveSection('feedback')}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
              activeSection === 'feedback'
                ? 'bg-[var(--accent-orange)] text-white'
                : 'text-black hover:bg-[var(--background-elevated)]'
            }`}
          >
            Grading
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-6">
        {activeSection === 'profile' && <ProfileSection />}
        {activeSection === 'settings' && <SettingsSection />}
        {activeSection === 'feedback' && <FeedbackSection />}
      </div>
      <FeedbackButton />
    </div>
  );
}
