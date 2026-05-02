"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

const ICONS: Record<ToastTone, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const TONE_STYLES: Record<ToastTone, string> = {
  success:
    "border-[var(--alert-success-border)] bg-[var(--alert-success-bg)] text-[var(--alert-success-text)]",
  error:
    "border-[var(--alert-danger-border)] bg-[var(--alert-danger-bg)] text-[var(--alert-danger-text)]",
  warning:
    "border-[var(--alert-warning-border)] bg-[var(--alert-warning-bg)] text-[var(--alert-warning-text)]",
  info: "border-[var(--alert-info-border)] bg-[var(--alert-info-bg)] text-[var(--alert-info-text)]",
};

const ICON_STYLES: Record<ToastTone, string> = {
  success: "text-[var(--color-success-600)]",
  error: "text-[var(--color-danger-500)]",
  warning: "text-[var(--color-accent-500)]",
  info: "text-[var(--color-brand-700)]",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast container */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3">
        {toasts.map((t) => {
          const Icon = ICONS[t.tone];
          return (
            <div
              key={t.id}
              className={cn(
                "motion-panel pointer-events-auto flex w-80 animate-slide-up items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-lg backdrop-blur-sm hover:-translate-y-0.5",
                TONE_STYLES[t.tone],
              )}
            >
              <Icon className={cn("mt-0.5 size-5 shrink-0", ICON_STYLES[t.tone])} />
              <p className="flex-1 text-sm font-medium leading-5">{t.message}</p>
              <button
                type="button"
                className="motion-pressable mt-0.5 shrink-0 rounded-lg p-0.5 opacity-60 hover:opacity-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                onClick={() => dismiss(t.id)}
              >
                <X className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
