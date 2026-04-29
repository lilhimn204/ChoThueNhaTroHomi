"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Home,
  LayoutDashboard,
  MessageSquareText,
  UserRound,
} from "lucide-react";

import { hostNavigation } from "@/constants/site";
import { cn } from "@/lib/utils";

const icons = [LayoutDashboard, ClipboardList, MessageSquareText, UserRound];

export function HostSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[30px] sm:p-5">
      <div className="group mb-4 rounded-[22px] bg-[var(--color-brand-950)] p-4 text-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] sm:mb-6 sm:rounded-[26px] sm:p-5">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-white/10 transition-transform duration-200 group-hover:scale-105 sm:size-11">
          <Home className="size-5" />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/55 sm:mt-5">
          Khu đăng tin
        </p>
        <h2 className="mt-2 text-lg font-semibold leading-tight sm:text-2xl">
          Quản lý phòng cho thuê của bạn
        </h2>
      </div>

      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:block lg:space-y-2">
        {hostNavigation.map((item, index) => {
          const Icon = icons[index];
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] active:scale-[0.99] sm:gap-3 sm:px-4",
                active
                  ? "bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)] shadow-sm ring-1 ring-[var(--color-border-soft)]"
                  : "text-[var(--color-text-muted)] hover:translate-x-1 hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]",
              )}
            >
              <Icon className="size-4 shrink-0 transition-transform duration-200" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
