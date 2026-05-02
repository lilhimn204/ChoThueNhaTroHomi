import type { LucideIcon } from "lucide-react";

export function HostStatCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}) {
  return (
    <div className="motion-panel group rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[28px] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">{label}</p>
          <p className="motion-soft mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] group-hover:text-[var(--color-brand-700)] sm:mt-4 sm:text-4xl">
            {value}
          </p>
        </div>
        <div className="motion-soft flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--stat-brand-bg)] text-[var(--stat-brand-text)] shadow-sm group-hover:scale-105 group-hover:shadow-md sm:size-12">
          <Icon className="motion-soft size-5 group-hover:-rotate-6" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)]">{helper}</p>
    </div>
  );
}
