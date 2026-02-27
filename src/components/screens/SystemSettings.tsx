import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { Save, RotateCcw } from 'lucide-react';

export function SystemSettings() {
  return (
    <div>
      <PageHeader 
        title="SYSTEM SETTINGS"
        subtitle="Configure platform defaults and behaviors"
        actions={
          <>
            <Button variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        {/* XP Values */}
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <h3 
            className="text-lg tracking-wide mb-4"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            XP VALUES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                Video Completion XP
              </label>
              <input 
                type="number"
                defaultValue="30"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                Q&A Response XP
              </label>
              <input 
                type="number"
                defaultValue="50"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                Challenge Completion XP
              </label>
              <input 
                type="number"
                defaultValue="70"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                Bonus Streak XP (per day)
              </label>
              <input 
                type="number"
                defaultValue="10"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Status Thresholds */}
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <h3 
            className="text-lg tracking-wide mb-4"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            STATUS LEVEL THRESHOLDS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                Level 2 (XP Required)
              </label>
              <input 
                type="number"
                defaultValue="500"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                Level 3 (XP Required)
              </label>
              <input 
                type="number"
                defaultValue="1500"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <h3 
            className="text-lg tracking-wide mb-4"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            REMINDER DEFAULTS
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                  Daily Reminder Time
                </label>
                <input 
                  type="time"
                  defaultValue="09:00"
                  className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                  Streak Warning (days missed)
                </label>
                <input 
                  type="number"
                  defaultValue="1"
                  className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[var(--sf-border)]">
              <div>
                <p className="font-medium text-[var(--sf-text-primary)]">Email Reminders</p>
                <p className="text-sm text-[var(--sf-text-muted)]">Send daily email reminders by default</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--sf-text-primary)]">SMS Reminders</p>
                <p className="text-sm text-[var(--sf-text-muted)]">Send daily SMS reminders by default</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
          </div>
        </div>

        {/* Token Settings */}
        <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
          <h3 
            className="text-lg tracking-wide mb-4"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            PAUSE TOKEN SETTINGS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                Starting Token Count (Default: 3)
              </label>
              <input 
                type="number"
                defaultValue="3"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
              />
              <p className="text-xs text-[var(--sf-text-muted)] mt-1">
                Number of pause tokens new users receive upon signup
              </p>
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                Maximum Tokens
              </label>
              <input 
                type="number"
                defaultValue="10"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
              />
              <p className="text-xs text-[var(--sf-text-muted)] mt-1">
                Maximum tokens a user can accumulate
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--sf-border)]">
            <h4 className="text-sm font-medium text-[var(--sf-text-secondary)] mb-4">
              Token Earnings per Status Level
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                  Status 1 Earnings
                </label>
                <input 
                  type="number"
                  defaultValue="1"
                  className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
                />
                <p className="text-xs text-[var(--sf-text-muted)] mt-1">
                  Tokens earned when reaching Status 1
                </p>
              </div>
              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                  Status 2 Earnings
                </label>
                <input 
                  type="number"
                  defaultValue="2"
                  className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
                />
                <p className="text-xs text-[var(--sf-text-muted)] mt-1">
                  Tokens earned when reaching Status 2
                </p>
              </div>
              <div>
                <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">
                  Status 3 Earnings
                </label>
                <input 
                  type="number"
                  defaultValue="3"
                  className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
                />
                <p className="text-xs text-[var(--sf-text-muted)] mt-1">
                  Tokens earned when reaching Status 3
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
