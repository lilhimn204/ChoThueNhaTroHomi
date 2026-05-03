"use client";

import { CheckCircle2 } from "lucide-react";

import { PasswordChangeForm } from "@/components/forms/password-change-form";
import { PasswordSetupForm } from "@/components/forms/password-setup-form";
import { Alert } from "@/components/ui/alert";
import type { UserProfile } from "@/types";

function GoogleIcon() {
  return (
    <span className="flex size-10 items-center justify-center rounded-2xl border border-[var(--color-border-soft)] bg-white text-lg font-bold shadow-sm">
      <span className="text-[#4285F4]">G</span>
    </span>
  );
}

export function AccountSettingsPanel({ user }: { user: UserProfile }) {
  const isGoogleAccount = user.authProvider === "GOOGLE";
  const shouldCreatePassword = isGoogleAccount && !user.passwordConfigured;

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            {isGoogleAccount ? (
              <GoogleIcon />
            ) : (
              <span className="flex size-10 items-center justify-center rounded-2xl bg-[var(--color-surface-soft)] text-[var(--color-success-700)]">
                <CheckCircle2 className="size-5" />
              </span>
            )}

            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
                Cài đặt tài khoản
              </h1>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                {isGoogleAccount
                  ? "Bạn đang đăng nhập bằng Google."
                  : "Bạn đang đăng nhập bằng email và mật khẩu."}
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit rounded-full bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">
            {user.passwordConfigured ? "Đã có mật khẩu" : "Chưa tạo mật khẩu"}
          </span>
        </div>

        {shouldCreatePassword ? (
          <div className="mt-5">
            <Alert
              tone="info"
              title="Tài khoản Google chưa có mật khẩu riêng"
              description="Tạo mật khẩu để vẫn có thể đăng nhập bằng email/password khi không dùng Google."
            />
          </div>
        ) : null}
      </section>

      {shouldCreatePassword ? <PasswordSetupForm /> : <PasswordChangeForm />}
    </div>
  );
}
