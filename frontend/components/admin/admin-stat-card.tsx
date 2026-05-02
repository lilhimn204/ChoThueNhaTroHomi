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
    <div className="motion-panel group rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[28px] sm:p-5">
      <p className="text-sm font-medium text-[var(--color-text-muted)]">{stat.label}</p>
      <p className="motion-soft mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] group-hover:text-[var(--color-brand-700)] sm:mt-4 sm:text-4xl">
        {stat.value}
      </p>
      <div
        className={cn(
          "motion-soft mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-sm group-hover:translate-x-1 group-hover:shadow-md",
          toneClasses[stat.tone],
        )}
      >
        <ArrowUpRight className="motion-soft size-4 group-hover:rotate-12" />
        {stat.change}
      </div>
    </div>
  );
}
