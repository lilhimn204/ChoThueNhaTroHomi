import type { ComponentType } from "react";

import { CircleAlert, CircleCheckBig, Info } from "lucide-react";

import { cn } from "@/lib/utils";

type AlertTone = "info" | "success" | "warning";

const styles: Record<
  AlertTone,
  { wrapper: string; icon: ComponentType<{ className?: string }> }
> = {
  info: {
    wrapper:
      "border-[var(--alert-info-border)] bg-[var(--alert-info-bg)] text-[var(--alert-info-text)]",
    icon: Info,
  },
  success: {
    wrapper:
      "border-[var(--alert-success-border)] bg-[var(--alert-success-bg)] text-[var(--alert-success-text)]",
    icon: CircleCheckBig,
  },
  warning: {
    wrapper:
      "border-[var(--alert-warning-border)] bg-[var(--alert-warning-bg)] text-[var(--alert-warning-text)]",
    icon: CircleAlert,
  },
};

export function Alert({
  title,
  description,
  tone = "info",
}: {
  title: string;
  description: string;
  tone?: AlertTone;
}) {
  const Icon = styles[tone].icon;

  return (
    <div
      className={cn(
        "motion-panel group flex gap-3 rounded-3xl border px-4 py-4 shadow-sm backdrop-blur-sm hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]",
        styles[tone].wrapper,
      )}
    >
      <span className="motion-soft mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl bg-white/35 group-hover:scale-105">
        <Icon className="size-5" />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm leading-6 opacity-90">{description}</p>
      </div>
    </div>
  );
}
