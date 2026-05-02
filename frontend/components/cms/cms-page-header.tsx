import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

interface CmsPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function CmsPageHeader({
  eyebrow,
  title,
  description,
  children,
}: CmsPageHeaderProps) {
  return (
    <section className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Badge tone="brand">{eyebrow}</Badge>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--color-text-muted)]">
            {description}
          </p>
        </div>
        {children ? <div className="flex shrink-0 flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  );
}
