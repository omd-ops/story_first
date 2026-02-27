import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface WelcomeOverlayProps {
  show: boolean;
  onClose: () => void;
}

export function WelcomeOverlay({ show, onClose }: WelcomeOverlayProps) {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-[var(--sf-orange)]" />
          <h1 
            className="text-4xl tracking-wide"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            WELCOME TO STORYFIRST ADMIN
          </h1>
        </div>

        <p className="text-[var(--sf-text-secondary)] mb-8">
          Your complete operations dashboard for managing the StoryFirst storytelling platform.
          This is a desktop-first internal operations tool with 13 comprehensive screens.
        </p>

        <div className="space-y-6">
          <div>
            <h2 
              className="text-2xl tracking-wide mb-3 text-[var(--sf-text-primary)]"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              AVAILABLE SCREENS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Dashboard', desc: 'Metrics, activity, and alerts' },
                { name: 'Lesson Builder', desc: 'Create and edit lesson content' },
                { name: 'Content Dashboard', desc: 'Manage all 70 days of content' },
                { name: 'User List', desc: 'View and manage all users' },
                { name: 'User Detail', desc: 'Individual user management' },
                { name: 'Signup Queue', desc: 'Waitlist priority management' },
                { name: 'Grading Queue', desc: 'Review pending feedback' },
                { name: 'Grading Detail', desc: 'Edit and approve AI feedback' },
                { name: 'Circle Management', desc: 'Manage user groups' },
                { name: 'Circle Communication', desc: 'Send bulk messages' },
                { name: 'Celebrations', desc: 'Milestone configuration' },
                { name: 'System Settings', desc: 'Platform configuration' },
                { name: 'Feed Content', desc: 'Manage feed posts' },
              ].map((screen, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg border border-[var(--sf-border)]">
                  <h3 className="font-medium text-[var(--sf-text-primary)] mb-1">{screen.name}</h3>
                  <p className="text-sm text-[var(--sf-text-muted)]">{screen.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 
              className="text-2xl tracking-wide mb-3 text-[var(--sf-text-primary)]"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              DESIGN SYSTEM
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--sf-orange)] rounded-lg"></div>
                <div>
                  <p className="font-medium">Orange</p>
                  <p className="text-sm text-[var(--sf-text-muted)]">Primary actions, active states</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FFD93D] rounded-lg"></div>
                <div>
                  <p className="font-medium">Yellow</p>
                  <p className="text-sm text-[var(--sf-text-muted)]">Progress, success, warnings</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--sf-blue)] rounded-lg"></div>
                <div>
                  <p className="font-medium">Blue</p>
                  <p className="text-sm text-[var(--sf-text-muted)]">Info, in-progress states</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--sf-border)] flex justify-end">
          <Button 
            onClick={onClose}
            className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}