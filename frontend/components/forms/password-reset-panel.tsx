"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, getErrorMessage } from "@/services/api-client";
import {
  requestPasswordReset,
  resendPasswordResetOtp,
  resetPassword,
} from "@/services/auth-service";

type ResetStep = "email" | "otp" | "done";

export function PasswordResetPanel() {
  const [step, setStep] = useState<ResetStep>("email");
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpExpiresInMinutes, setOtpExpiresInMinutes] = useState(10);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setErrorMessage("");
  };

  const applyApiFieldErrors = (error: unknown) => {
    if (error instanceof ApiError) {
      setFieldErrors(
        Object.fromEntries(
          error.fieldErrors.map((fieldError) => [fieldError.field, fieldError.message]),
        ),
      );
    }

    setErrorMessage(getErrorMessage(error));
  };

  const handleRequestOtp = async () => {
    const response = await requestPasswordReset({ email: formData.email.trim() });
    setPendingEmail(response.email);
    setOtpExpiresInMinutes(response.expiresInMinutes);
    setResendCooldownSeconds(response.resendCooldownSeconds);
    setStep("otp");
    setSuccessMessage(response.message);
  };

  const handleResetPassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: "Mật khẩu xác nhận chưa trùng khớp." });
      return;
    }

    await resetPassword({
      email: pendingEmail || formData.email.trim(),
      otp: formData.otp.trim(),
      newPassword: formData.newPassword,
    });

    setStep("done");
    setSuccessMessage("Mật khẩu đã được đặt lại. Bạn có thể đăng nhập bằng mật khẩu mới.");
    setErrorMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});

    try {
      if (step === "email") {
        await handleRequestOtp();
      } else if (step === "otp") {
        await handleResetPassword();
      }
    } catch (error) {
      applyApiFieldErrors(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});

    try {
      const response = await resendPasswordResetOtp({
        email: pendingEmail || formData.email.trim(),
      });
      setPendingEmail(response.email);
      setOtpExpiresInMinutes(response.expiresInMinutes);
      setResendCooldownSeconds(response.resendCooldownSeconds);
      setSuccessMessage(response.message);
    } catch (error) {
      applyApiFieldErrors(error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="motion-panel animate-content-rise rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
          Khôi phục tài khoản
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-3xl">
          Quên mật khẩu Homi
        </h1>
        <p className="text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">
          Nhập email tài khoản để nhận OTP qua Gmail, sau đó đặt lại mật khẩu mới.
        </p>
      </div>

      <div className="mt-6 space-y-4 sm:mt-8">
        <form className="motion-stagger space-y-5" onSubmit={handleSubmit}>
          {successMessage ? (
            <Alert tone="success" title="Thao tác thành công" description={successMessage} />
          ) : null}

          {errorMessage ? (
            <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
          ) : null}

          {step === "done" ? (
            <div className="space-y-4">
              <Alert
                tone="info"
                title="Đăng nhập lại"
                description="Các phiên đăng nhập cũ đã được thu hồi. Hãy đăng nhập lại để tiếp tục sử dụng Homi."
              />
              <Link
                href="/login"
                className="motion-pressable inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--color-brand-700)] px-6 py-2.5 text-center text-base font-medium leading-tight text-[var(--color-brand-contrast)] shadow-[var(--shadow-button)] hover:-translate-y-0.5 hover:bg-[var(--color-brand-800)] hover:shadow-[var(--shadow-button-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] active:translate-y-0 active:scale-[0.98] active:bg-[var(--color-brand-900)]"
              >
                Về trang đăng nhập
              </Link>
            </div>
          ) : null}

          {step === "email" ? (
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="an.nguyen@example.com"
              hint="Homi sẽ gửi mã OTP đến email đã đăng ký."
              value={formData.email}
              onChange={(event) => handleChange("email", event.target.value)}
              error={fieldErrors.email}
            />
          ) : null}

          {step === "otp" ? (
            <>
              <Alert
                tone="info"
                title="Kiểm tra Gmail"
                description={`Mã OTP được gửi đến ${pendingEmail || formData.email}. Mã có hiệu lực trong ${otpExpiresInMinutes} phút. Kiểm tra mục "Thư rác" nếu chưa thấy email trong Hộp thư đến.`}
              />
              <Input
                label="Mã OTP"
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                hint="Nhập đủ 6 chữ số trong email đặt lại mật khẩu."
                value={formData.otp}
                onChange={(event) =>
                  handleChange("otp", event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                error={fieldErrors.otp}
              />
              <Input
                label="Mật khẩu mới"
                name="newPassword"
                type="password"
                placeholder="********"
                hint="Tối thiểu 6 ký tự."
                value={formData.newPassword}
                onChange={(event) => handleChange("newPassword", event.target.value)}
                error={fieldErrors.newPassword}
              />
              <Input
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                type="password"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={(event) => handleChange("confirmPassword", event.target.value)}
                error={fieldErrors.confirmPassword}
              />
            </>
          ) : null}

          {step !== "done" ? (
            <Button className="w-full" size="lg" type="submit" disabled={submitting || resending}>
              {submitting
                ? "Đang xử lý..."
                : step === "email"
                  ? "Gửi mã OTP"
                  : "Đặt lại mật khẩu"}
            </Button>
          ) : null}

          {step === "otp" ? (
            <div className="flex flex-col gap-3 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
              <button
                className="motion-pressable inline-flex rounded-xl px-1 font-semibold text-[var(--color-brand-700)] hover:-translate-y-0.5 hover:text-[var(--color-brand-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled={resending || submitting}
                onClick={() => {
                  void handleResendOtp();
                }}
              >
                {resending ? "Đang gửi lại..." : "Gửi lại OTP"}
              </button>
              <span>Chờ khoảng {resendCooldownSeconds} giây giữa các lần gửi.</span>
            </div>
          ) : null}
        </form>
      </div>

      <p className="mt-6 text-sm text-[var(--color-text-muted)]">
        Đã nhớ mật khẩu?{" "}
        <Link
          href="/login"
          className="motion-soft rounded-xl font-semibold text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
