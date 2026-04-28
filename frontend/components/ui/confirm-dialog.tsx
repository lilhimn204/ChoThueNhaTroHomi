"use client";

import { useCallback, useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "warning" | "brand";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const toneConfig = {
  danger: {
    iconBg: "bg-[var(--alert-danger-bg)]",
    iconColor: "text-[var(--alert-danger-text)]",
    button: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    iconBg: "bg-[var(--alert-warning-bg)]",
    iconColor: "text-[var(--alert-warning-text)]",
    button: "bg-[var(--color-accent-600)] hover:bg-[var(--color-accent-500)] text-[var(--color-warm-text)]",
  },
  brand: {
    iconBg: "bg-[var(--badge-brand-bg)]",
    iconColor: "text-[var(--badge-brand-text)]",
    button: "bg-[var(--color-brand-700)] text-[var(--color-brand-contrast)] hover:bg-[var(--color-brand-800)]",
  },
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  tone = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button when dialog opens
  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onCancel();
    },
    [onCancel],
  );

  if (!open) return null;

  const config = toneConfig[tone];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-md animate-scale-in rounded-3xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card-hover)] ring-1 ring-white/10">
        {/* Icon + Content */}
        <div className="flex gap-4">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 ease-out",
              config.iconBg,
            )}
          >
            <AlertTriangle className={cn("size-6", config.iconColor)} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-[var(--color-text-strong)]">
              {title}
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-[var(--color-text-muted)]">
              {description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            ref={cancelRef}
            className="w-full sm:w-auto"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-button-hover)] active:translate-y-0 active:scale-[0.98] disabled:translate-y-0 disabled:scale-100 disabled:opacity-50 sm:w-auto",
              config.button,
            )}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
