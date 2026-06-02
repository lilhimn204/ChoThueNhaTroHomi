"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  ExternalLink,
  Flag,
  Headset,
  LayoutDashboard,
  MessageSquareMore,
  Newspaper,
  Users,
} from "lucide-react";

import { adminNavigation } from "@/constants/site";
import { cn } from "@/lib/utils";
import {
  searchAdminSupportTickets,
  SUPPORT_TICKETS_CHANGED_EVENT,
} from "@/services/support-service";

const icons = [
  LayoutDashboard,
  Building2,
  Newspaper,
  MessageSquareMore,
  Flag,
  Headset,
  Users,
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [newSupportTicketCount, setNewSupportTicketCount] = useState(0);

  const refreshSupportTicketCount = useCallback((signal?: AbortSignal) => {
    void searchAdminSupportTickets(
      {
        status: "NEW",
        page: 0,
        size: 1,
      },
      signal,
    )
      .then((response) => setNewSupportTicketCount(response.totalElements))
      .catch(() => {
        if (!signal?.aborted) {
          setNewSupportTicketCount(0);
        }
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refreshSupportTicketCount(controller.signal);

    const handleRefresh = () => refreshSupportTicketCount();
    const handleFocus = () => refreshSupportTicketCount();
    const interval = window.setInterval(() => refreshSupportTicketCount(), 30_000);

    window.addEventListener(SUPPORT_TICKETS_CHANGED_EVENT, handleRefresh);
    window.addEventListener("focus", handleFocus);

    return () => {
      controller.abort();
      window.clearInterval(interval);
      window.removeEventListener(SUPPORT_TICKETS_CHANGED_EVENT, handleRefresh);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshSupportTicketCount]);

  return (
    <aside className="motion-panel animate-content-rise self-start rounded-[28px] border border-white/10 bg-[var(--color-brand-950)] p-4 text-white shadow-[var(--shadow-card)] ring-1 ring-white/10 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[var(--shadow-card-hover)] xl:sticky xl:top-24">
      <div className="mb-5 px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
          Khu quản trị
        </p>
        <h2 className="mt-2 text-xl font-semibold leading-tight">Quản trị bài đăng và yêu cầu</h2>
      </div>
      <nav className="motion-stagger space-y-1.5">
        {adminNavigation.map((item, index) => {
          const Icon = icons[index];
          const active = item.href === "/admin" ? pathname === item.href : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "motion-pressable group flex items-center gap-3 rounded-[18px] px-3.5 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 active:scale-[0.99]",
                active
                  ? "bg-white/20 text-white shadow-sm ring-1 ring-white/15"
                  : "text-white/72 hover:translate-x-1 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="motion-soft size-4 group-hover:scale-110" />
              <span className="min-w-0 flex-1">{item.label}</span>
              {item.href === "/admin/support-tickets" && newSupportTicketCount > 0 ? (
                <span
                  aria-label={`${newSupportTicketCount} yêu cầu hỗ trợ mới`}
                  className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--color-accent-500)] px-2 py-0.5 text-xs font-bold text-[var(--color-warm-text)] shadow-sm"
                >
                  {newSupportTicketCount > 99 ? "99+" : newSupportTicketCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 border-t border-white/10 pt-4">
        <a
          href="https://thuenhahomi.id.vn/cms"
          target="_blank"
          rel="noopener noreferrer"
          className="motion-pressable group flex items-center justify-between gap-3 rounded-[18px] bg-[var(--color-inverse-surface)] px-3.5 py-3 text-sm font-semibold text-[var(--color-inverse-text)] shadow-sm hover:-translate-y-0.5 hover:bg-[var(--color-inverse-surface-hover)] hover:shadow-[var(--shadow-button-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45 active:scale-[0.99]"
        >
          <span className="flex items-center gap-3">
            <Newspaper className="motion-soft size-4 group-hover:scale-110" />
            <span>CMS</span>
          </span>
          <ExternalLink className="size-4 opacity-70" />
        </a>
        <p className="mt-2 px-1 text-xs leading-5 text-white/55">
          Quản lý nội dung và bài viết ở giao diện CMS.
        </p>
      </div>
    </aside>
  );
}
