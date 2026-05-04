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

  if (floatingLabel) {
    return (
      <label className="group flex flex-col gap-2">
        <span className="relative block">
          <input
            id={inputId}
            className={cn(
              "peer motion-soft h-14 w-full max-w-full rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-input-bg)] px-4 pb-2 pt-6 text-base text-[var(--color-text-strong)] shadow-sm outline-none placeholder:text-transparent hover:border-[var(--color-brand-500)] focus:border-[var(--color-brand-500)] focus:shadow-[var(--shadow-focus)] focus:ring-2 focus:ring-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm",
              trailingIcon && "pr-12",
              error &&
                "border-[var(--color-danger-500)] focus:border-[var(--color-danger-500)] focus:ring-[var(--color-focus-ring-danger)]",
              className,
            )}
            placeholder=" "
            {...props}
          />
          <span className="pointer-events-none absolute left-4 top-2 text-xs font-semibold text-[var(--color-text-muted)] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[var(--color-brand-700)]">
            {label}
          </span>
          {trailingIcon ? (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {trailingIcon}
            </span>
          ) : null}
        </span>
        {error ? (
          <span className="animate-slide-up text-sm text-[var(--color-danger-600)]">{error}</span>
        ) : hint ? (
          <span className="text-sm text-[var(--color-text-muted)]">{hint}</span>
        ) : null}
      </label>
    );
  }

  return (
    <label className="group flex flex-col gap-2">
      <span className="motion-soft text-sm font-semibold text-[var(--color-text-strong)] group-focus-within:text-[var(--color-brand-700)]">
        {label}
      </span>
      <input
        id={inputId}
        className={cn(
          "motion-soft h-12 w-full max-w-full rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-input-bg)] px-4 text-base text-[var(--color-text-strong)] shadow-sm outline-none placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-brand-500)] focus:border-[var(--color-brand-500)] focus:shadow-[var(--shadow-focus)] focus:ring-2 focus:ring-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm",
          trailingIcon && "pr-12",
          error &&
            "border-[var(--color-danger-500)] focus:border-[var(--color-danger-500)] focus:ring-[var(--color-focus-ring-danger)]",
          className,
        )}
        {...props}
      />
      {trailingIcon ? (
        <span className="-mt-12 mb-1 ml-auto mr-3 flex h-11 items-center">
          {trailingIcon}
        </span>
      ) : null}
      {error ? (
        <span className="animate-slide-up text-sm text-[var(--color-danger-600)]">{error}</span>
      ) : hint ? (
        <span className="text-sm text-[var(--color-text-muted)]">{hint}</span>
      ) : null}
    </label>
  );
}
