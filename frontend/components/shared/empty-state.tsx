import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}) {
  return (
    <div className="motion-panel animate-content-rise group rounded-[30px] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-10 text-center shadow-[var(--shadow-card)] hover:-translate-y-1 hover:border-[var(--color-brand-500)] hover:shadow-[var(--shadow-card-hover)]">
      <div className="motion-soft mx-auto flex size-16 items-center justify-center rounded-2xl bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)] shadow-sm group-hover:scale-[1.03]">
        <SearchX className="motion-soft size-7 group-hover:scale-110" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[var(--color-text-strong)]">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="mt-6 inline-flex">
          <Button variant="outline">{actionLabel}</Button>
        </Link>
      ) : actionLabel && onAction ? (
        <Button className="mt-6" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
