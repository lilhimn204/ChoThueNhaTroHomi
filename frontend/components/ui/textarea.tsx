import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Textarea({
  className,
  label,
  hint,
  error,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name ?? label;

  return (
    <label className="group flex flex-col gap-2">
      <span className="motion-soft text-sm font-semibold text-[var(--color-text-strong)] group-focus-within:text-[var(--color-brand-700)]">
        {label}
      </span>
      <textarea
        id={textareaId}
        className={cn(
          "motion-soft min-h-28 w-full max-w-full rounded-3xl border border-[var(--color-border-strong)] bg-[var(--color-input-bg)] px-4 py-3 text-base text-[var(--color-text-strong)] shadow-sm outline-none placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-brand-500)] focus:border-[var(--color-brand-500)] focus:shadow-[var(--shadow-focus)] focus:ring-2 focus:ring-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm",
          error &&
            "border-[var(--color-danger-500)] focus:border-[var(--color-danger-500)] focus:ring-[var(--color-focus-ring-danger)]",
          className,
        )}
        {...props}
      />
      {error ? (
        <span className="animate-slide-up text-sm text-[var(--color-danger-600)]">{error}</span>
      ) : hint ? (
        <span className="text-sm text-[var(--color-text-muted)]">{hint}</span>
      ) : null}
    </label>
  );
}
