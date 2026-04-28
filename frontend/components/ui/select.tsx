import type { SelectHTMLAttributes } from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  hint?: string;
}

export function Select({
  label,
  options,
  className,
  hint,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name ?? label;

  return (
    <label className="group flex flex-col gap-2">
      <span className="text-sm font-semibold text-[var(--color-text-strong)] transition-colors duration-200 group-focus-within:text-[var(--color-brand-700)]">
        {label}
      </span>
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "h-12 w-full max-w-full appearance-none rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-input-bg)] px-4 pr-10 text-base text-[var(--color-text-strong)] shadow-sm outline-none transition-all duration-200 hover:border-[var(--color-brand-500)] focus:-translate-y-0.5 focus:border-[var(--color-brand-500)] focus:shadow-[var(--shadow-focus)] focus:ring-2 focus:ring-[var(--color-focus-ring)] sm:text-sm",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)] transition-transform duration-200 group-focus-within:rotate-180 group-focus-within:text-[var(--color-brand-700)]" />
      </div>
      {hint ? <span className="text-sm text-[var(--color-text-muted)]">{hint}</span> : null}
    </label>
  );
}
