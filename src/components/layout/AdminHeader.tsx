"use client";

import { Bell, User, ChevronDown, X, UserPlus, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '../ui/button';

interface AdminHeaderProps {
  onNavigate?: (screen: string) => void;
}

export function AdminHeader({ onNavigate }: AdminHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/phone');
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'approval',
      icon: UserPlus,
      iconBg: 'bg-orange-100',
      iconColor: 'text-[var(--sf-orange)]',
      title: 'New User Pending Approval',
      message: 'Sarah Johnson is waiting for admin approval',
      time: '5 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'approval',
      icon: UserPlus,
      iconBg: 'bg-orange-100',
      iconColor: 'text-[var(--sf-orange)]',
      title: 'New User Pending Approval',
      message: 'Mike Chen is waiting for admin approval',
      time: '12 minutes ago',
      unread: true
    },
    {
      id: 3,
      type: 'slack',
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-[var(--sf-green)]',
      title: 'Slack Notification Sent',
      message: 'New signup alert sent to #admin-notifications',
      time: '1 hour ago',
      unread: false
    },
    {
      id: 4,
      type: 'approval',
      icon: UserPlus,
      iconBg: 'bg-orange-100',
      iconColor: 'text-[var(--sf-orange)]',
      title: 'New User Pending Approval',
      message: 'Emma Davis is waiting for admin approval',
      time: '2 hours ago',
      unread: false
    },
    {
      id: 5,
      type: 'slack',
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-[var(--sf-green)]',
      title: 'Slack Notification Sent',
      message: 'User approval notification sent to #admin-notifications',
      time: '3 hours ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header
        className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-[var(--sf-border)] flex items-center justify-between px-8 z-10"
        style={{ fontFamily: 'var(--font-helvetica)' }}
      >
        <div className="flex items-center gap-4">
          <h1
            className="text-2xl tracking-wide text-[var(--sf-text-primary)]"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            onClick={() => setShowNotificationModal(true)}
            className="relative p-2 hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-[var(--sf-text-secondary)]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--sf-red)]"></span>
            )}
          </button>

          {/* Admin Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-[var(--sf-orange)] flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-[var(--sf-text-primary)]">Admin</span>
              <ChevronDown className="w-4 h-4 text-[var(--sf-text-secondary)]" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-[var(--sf-border)] py-2">
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    onNavigate?.('settings');
                    setShowProfileMenu(false);
                  }}
                >
                  Settings
                </button>
                <hr className="my-2 border-[var(--sf-border)]" />
                <button
                  className="w-full px-4 py-2 text-left text-sm text-[var(--sf-red)] hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[var(--sf-border)]">
              <div>
                <h2
                  className="text-2xl tracking-wide"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  Notifications
                </h2>
                <p className="text-sm text-[var(--sf-text-muted)] mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-[var(--sf-text-secondary)]">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--sf-border)]">
                  {notifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${notification.unread ? 'bg-blue-50/30' : ''
                          }`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${notification.iconBg}`}>
                            <IconComponent className={`w-5 h-5 ${notification.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-sm font-medium text-[var(--sf-text-primary)]">
                                {notification.title}
                              </h3>
                              {notification.unread && (
                                <span className="w-2 h-2 bg-[var(--sf-orange)] flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-sm text-[var(--sf-text-secondary)] mb-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-[var(--sf-text-muted)] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[var(--sf-border)]">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowNotificationModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}