import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AdminStat } from "@/types";

const toneClasses = {
  brand: "bg-[var(--stat-brand-bg)] text-[var(--stat-brand-text)]",
  success: "bg-[var(--stat-success-bg)] text-[var(--stat-success-text)]",
  warning: "bg-[var(--stat-warning-bg)] text-[var(--stat-warning-text)]",
  neutral: "bg-[var(--stat-neutral-bg)] text-[var(--stat-neutral-text)]",
};

export function AdminStatCard({ stat }: { stat: AdminStat }) {
  return (
    <div className="group rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
      <p className="text-sm font-medium text-[var(--color-text-muted)]">{stat.label}</p>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text-strong)] transition-colors duration-200 group-hover:text-[var(--color-brand-700)]">
        {stat.value}
      </p>
      <div
        className={cn(
          "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-sm transition-all duration-200 ease-out group-hover:translate-x-1 group-hover:shadow-md",
          toneClasses[stat.tone],
        )}
      >
        <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:rotate-12" />
        {stat.change}
      </div>
    </div>
  );
}
