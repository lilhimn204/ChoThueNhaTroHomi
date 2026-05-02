"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useDelayedPresence } from "@/hooks/use-delayed-presence";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "@/services/notification-service";
import type { AppNotification } from "@/types";

const POLL_INTERVAL = 30_000; // 30 seconds

export function NotificationBell() {
  const router = useRouter();
  const { status } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const { present: dropdownPresent, leaving: dropdownLeaving } =
    useDelayedPresence(open, 160);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = status === "authenticated";

  // Poll for unread count
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCount = () => {
      void getUnreadCount()
        .then((response) => setUnreadCount(response.count))
        .catch(() => {
          // Silently ignore polling errors
        });
    };

    fetchCount();
    const interval = setInterval(fetchCount, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Load notifications when dropdown opens
  const loadNotifications = useCallback(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    void getNotifications({ page: 0, size: 10 })
      .then((response) => setNotifications(response.content))
      .catch(() => {
        // Silently ignore
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!open) {
      loadNotifications();
    }
    setOpen((current) => !current);
  };

  const handleClickNotification = async (notification: AppNotification) => {
    if (!notification.read) {
      try {
        await markAsRead(notification.id);
        setUnreadCount((current) => Math.max(0, current - 1));
        setNotifications((current) =>
          current.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n,
          ),
        );
      } catch {
        // Silently ignore
      }
    }

    setOpen(false);
    router.push(notification.targetUrl);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications((current) =>
        current.map((n) => ({ ...n, read: true })),
      );
    } catch {
      // Silently ignore
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} mới)` : ""}`}
        aria-expanded={open}
        className="motion-pressable relative inline-flex size-11 items-center justify-center rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] text-[var(--color-text-muted)] shadow-sm hover:-translate-y-0.5 hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)] hover:shadow-[var(--shadow-card)] active:scale-[0.98]"
        onClick={handleToggle}
      >
        <Bell className={cn("motion-soft size-[18px]", open && "rotate-12")} />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-[var(--color-surface)]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {dropdownPresent ? (
        <div
          className={cn(
            "motion-panel absolute right-0 top-full z-50 mt-2 w-[min(calc(100vw_-_2rem),22rem)] origin-top-right overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] shadow-xl sm:w-96",
            dropdownLeaving
              ? "pointer-events-none animate-popover-out"
              : "animate-popover-in",
          )}
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border-soft)] px-4 py-3">
            <h3 className="text-sm font-semibold text-[var(--color-text-strong)]">
              Thông báo
            </h3>
            {unreadCount > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                leadingIcon={<CheckCheck className="size-3.5" />}
              >
                Đọc tất cả
              </Button>
            ) : null}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="size-5 animate-spin rounded-full border-2 border-[var(--color-brand-700)] border-t-transparent" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-[var(--color-text-muted)]">
                Chưa có thông báo nào
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className={cn(
                    "motion-soft flex w-full gap-3 border-b border-[var(--color-border-soft)] px-4 py-3 text-left last:border-b-0 hover:bg-[var(--color-surface-soft)]",
                    !notification.read && "bg-[var(--color-brand-50)]/50",
                  )}
                  onClick={() => handleClickNotification(notification)}
                >
                  <div
                    className={cn(
                      "mt-1 size-2 shrink-0 rounded-full",
                      notification.read
                        ? "bg-transparent"
                        : "bg-[var(--color-brand-700)]",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--color-text-strong)]">
                      {notification.title}
                    </p>
                    <p className="mt-0.5 text-sm leading-5 text-[var(--color-text-muted)]">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
