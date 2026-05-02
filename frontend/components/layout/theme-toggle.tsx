"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={resolvedTheme === "dark" ? "Chuyển sang sáng" : "Chuyển sang tối"}
      className={`motion-pressable relative flex size-11 items-center justify-center rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] text-[var(--color-text-muted)] shadow-sm hover:-translate-y-0.5 hover:border-[var(--color-brand-500)] hover:text-[var(--color-brand-700)] hover:shadow-[var(--shadow-card)] active:scale-[0.98] ${className}`}
    >
      <Sun
        className={`motion-soft absolute size-[18px] ${
          resolvedTheme === "dark"
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        className={`motion-soft absolute size-[18px] ${
          resolvedTheme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
}
