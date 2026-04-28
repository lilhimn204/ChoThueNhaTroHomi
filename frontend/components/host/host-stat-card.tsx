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
    <div className="group rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">{label}</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text-strong)] transition-colors duration-200 group-hover:text-[var(--color-brand-700)]">
            {value}
          </p>
        </div>
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--stat-brand-bg)] text-[var(--stat-brand-text)] shadow-sm transition-all duration-200 ease-out group-hover:scale-105 group-hover:shadow-md">
          <Icon className="size-5 transition-transform duration-200 group-hover:-rotate-6" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)]">{helper}</p>
    </div>
  );
}
