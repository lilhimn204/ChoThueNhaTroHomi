import { cn } from "@/lib/utils";

type BadgeTone = "brand" | "success" | "warning" | "muted" | "danger";

const badgeStyles: Record<BadgeTone, string> = {
  brand:
    "bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)]",
  success:
    "bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]",
  warning:
    "bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)]",
  muted:
    "bg-[var(--badge-muted-bg)] text-[var(--badge-muted-text)]",
  danger:
    "bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)]",
};

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "motion-soft inline-flex items-center rounded-full border border-[var(--badge-border)] px-3 py-1 text-xs font-semibold tracking-wide shadow-[var(--badge-shadow)] backdrop-blur-md hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[var(--shadow-card)]",
        badgeStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
