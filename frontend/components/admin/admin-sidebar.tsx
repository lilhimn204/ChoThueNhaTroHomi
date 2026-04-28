"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Flag, LayoutDashboard, MessageSquareMore, Users } from "lucide-react";

import { adminNavigation } from "@/constants/site";
import { cn } from "@/lib/utils";

const icons = [LayoutDashboard, Building2, MessageSquareMore, Flag, Users];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="self-start rounded-[28px] border border-white/10 bg-[var(--color-brand-950)] p-4 text-white shadow-[var(--shadow-card)] ring-1 ring-white/10 transition-all duration-300 ease-out hover:shadow-[var(--shadow-card-hover)] xl:sticky xl:top-24">
      <div className="mb-5 px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
          Khu quản trị
        </p>
        <h2 className="mt-2 text-xl font-semibold leading-tight">Quản trị bài đăng và yêu cầu</h2>
      </div>
      <nav className="space-y-1.5">
        {adminNavigation.map((item, index) => {
          const Icon = icons[index];
          const active = item.href === "/admin" ? pathname === item.href : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[18px] px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 active:scale-[0.99]",
                active
                  ? "bg-white/20 text-white shadow-sm ring-1 ring-white/15"
                  : "text-white/72 hover:translate-x-1 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="size-4 transition-transform duration-200" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
