import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "warm";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-brand-700)] text-[var(--color-brand-contrast)] shadow-[var(--shadow-button)] hover:-translate-y-0.5 hover:bg-[var(--color-brand-800)] hover:shadow-[var(--shadow-button-hover)] active:translate-y-0 active:scale-[0.98] active:bg-[var(--color-brand-900)]",
  secondary:
    "bg-[var(--color-surface-soft)] text-[var(--color-text-strong)] shadow-sm hover:-translate-y-0.5 hover:bg-[var(--color-border-soft)] hover:shadow-[var(--shadow-card)] active:translate-y-0 active:scale-[0.98]",
  ghost:
    "bg-transparent text-[var(--color-text-strong)] hover:bg-[var(--color-surface-soft)] active:scale-[0.98]",
  outline:
    "border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-strong)] shadow-sm hover:-translate-y-0.5 hover:border-[var(--color-brand-500)] hover:bg-[var(--color-surface-soft)] hover:shadow-[var(--shadow-card)] active:translate-y-0 active:scale-[0.98]",
  warm:
    "bg-[var(--color-accent-500)] text-[var(--color-warm-text)] shadow-[var(--shadow-button)] hover:-translate-y-0.5 hover:bg-[var(--color-accent-600)] hover:shadow-[var(--shadow-button-hover)] active:translate-y-0 active:scale-[0.98]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 rounded-xl px-4 text-sm",
  md: "h-11 rounded-2xl px-5 text-sm",
  lg: "h-12 rounded-2xl px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    leadingIcon,
    trailingIcon,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:shadow-[var(--shadow-focus)] disabled:translate-y-0 disabled:scale-100 disabled:shadow-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </button>
  );
});

Button.displayName = "Button";
