import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  floatingLabel?: boolean;
  trailingIcon?: ReactNode;
}

export function Input({
  className,
  label,
  hint,
  error,
  id,
  floatingLabel,
  trailingIcon,
  ...props
}: InputProps) {
  const inputId = id ?? props.name ?? label;
  const feedbackId = `${inputId}-${error ? "error" : "hint"}`;
  const describedBy = error || hint ? feedbackId : props["aria-describedby"];
  const inputClassName = cn(
    "motion-soft h-12 min-h-12 w-full max-w-full rounded-[16px] border border-[var(--color-border-strong)] bg-[var(--color-input-bg)] px-4 text-base leading-none text-[var(--color-text-strong)] shadow-[0_1px_0_rgba(16,42,67,0.04)] outline-none placeholder:text-[var(--color-text-muted)] placeholder:opacity-75 hover:border-[var(--color-brand-500)] focus:border-[var(--color-brand-500)] focus:shadow-[var(--shadow-focus)] focus:ring-2 focus:ring-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:bg-[var(--color-surface-soft)] disabled:text-[var(--color-text-muted)] disabled:opacity-70 sm:text-sm",
    trailingIcon && "pr-14",
    error &&
      "border-[var(--color-danger-500)] focus:border-[var(--color-danger-500)] focus:ring-[var(--color-focus-ring-danger)]",
    className,
  );

  return (
    <label className="group flex min-w-0 flex-col gap-2" htmlFor={inputId}>
      <span className="motion-soft text-sm font-semibold leading-5 text-[var(--color-text-strong)] group-focus-within:text-[var(--color-brand-700)]">
        {label}
      </span>
      <span className="relative block min-w-0">
        <input
          id={inputId}
          className={inputClassName}
          data-floating-label={floatingLabel ? "true" : undefined}
          {...props}
          aria-describedby={describedBy}
          aria-invalid={error ? true : props["aria-invalid"]}
        />
        {trailingIcon ? (
          <span className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center">
            {trailingIcon}
          </span>
        ) : null}
      </span>
      {error ? (
        <span
          className="animate-slide-up text-sm leading-5 text-[var(--color-danger-600)]"
          id={feedbackId}
        >
          {error}
        </span>
      ) : hint ? (
        <span className="text-sm leading-5 text-[var(--color-text-muted)]" id={feedbackId}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}
