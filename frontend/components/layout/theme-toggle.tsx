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
      className={`relative flex size-11 items-center justify-center rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] text-[var(--color-text-muted)] shadow-sm transition-all duration-300 hover:border-[var(--color-brand-500)] hover:text-[var(--color-brand-700)] ${className}`}
    >
      <Sun
        className={`absolute size-[18px] transition-all duration-300 ${
          resolvedTheme === "dark"
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        className={`absolute size-[18px] transition-all duration-300 ${
          resolvedTheme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
}
