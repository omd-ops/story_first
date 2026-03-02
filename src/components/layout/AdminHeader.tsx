"use client";

import {
  Bell,
  User,
  ChevronDown,
  X,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "../ui/button";

interface AdminHeaderProps {
  onNavigate?: (screen: string) => void;
}

type NotificationItem = {
  id: string;
  type: "approval" | "info" | "error";
  title: string;
  message: string;
  createdAt: string;
  unread: boolean;
};

function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "just now";
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
}

export function AdminHeader({ onNavigate }: AdminHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const loadNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications", { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) return;
      setNotifications(Array.isArray(json.items) ? json.items : []);
    } catch {
      // Keep UI resilient; notification modal can stay empty on failure.
    }
  };

  useEffect(() => {
    void loadNotifications();
    const timer = setInterval(() => {
      void loadNotifications();
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications],
  );

  return (
    <>
      <header
        className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-[var(--sf-border)] flex items-center justify-between px-8 z-10"
        style={{ fontFamily: "var(--font-helvetica)" }}
      >
        <div className="flex items-center gap-4">
          <h1
            className="text-2xl tracking-wide text-[var(--sf-text-primary)]"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNotificationModal(true)}
            className="relative p-2 hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-[var(--sf-text-secondary)]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--sf-red)]"></span>
            )}
          </button>

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
                    onNavigate?.("settings");
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

      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[var(--sf-border)]">
              <div>
                <h2
                  className="text-2xl tracking-wide"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  Notifications
                </h2>
                <p className="text-sm text-[var(--sf-text-muted)] mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
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
                    const IconComponent =
                      notification.type === "error"
                        ? AlertCircle
                        : notification.type === "approval"
                          ? UserPlus
                          : CheckCircle;

                    const iconBg =
                      notification.type === "error"
                        ? "bg-red-100"
                        : notification.type === "approval"
                          ? "bg-orange-100"
                          : "bg-green-100";

                    const iconColor =
                      notification.type === "error"
                        ? "text-[var(--sf-red)]"
                        : notification.type === "approval"
                          ? "text-[var(--sf-orange)]"
                          : "text-[var(--sf-green)]";

                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          notification.unread ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${iconBg}`}
                          >
                            <IconComponent className={`w-5 h-5 ${iconColor}`} />
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
                              {formatRelativeTime(notification.createdAt)}
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
