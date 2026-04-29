"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { ApiError, getErrorMessage } from "@/services/api-client";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserProfile } from "@/types";

type AuthStep = "credentials" | "otp";

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleAccountsApi {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type?: "standard" | "icon";
          theme?: "outline" | "filled_blue" | "filled_black";
          size?: "large" | "medium" | "small";
          text?: "signin_with" | "signup_with" | "continue_with";
          shape?: "rectangular" | "pill" | "circle" | "square";
          width?: number;
        },
      ) => void;
    };
  };
}

const GOOGLE_SCRIPT_ID = "google-identity-services";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_AUTH_ENABLED = Boolean(GOOGLE_CLIENT_ID);

function getRedirectTarget(user: UserProfile, redirectTo?: string) {
  return redirectTo ?? (user.roles.includes("ADMIN") ? "/admin" : "/profile");
}

function GoogleAuthButton({
  mode,
  disabled,
  onCredential,
  onError,
}: {
  mode: "login" | "register";
  disabled?: boolean;
  onCredential: (idToken: string) => void;
  onError: (message: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!GOOGLE_CLIENT_ID || !container) {
      return;
    }

    let cancelled = false;

    const renderGoogleButton = () => {
      if (cancelled || !containerRef.current) {
        return;
      }

      const googleApi = (window as Window & { google?: GoogleAccountsApi }).google;
      if (!googleApi) {
        onError("Không thể tải đăng nhập Google. Vui lòng thử lại sau.");
        return;
      }

      containerRef.current.replaceChildren();
      googleApi.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback(response) {
          if (!response.credential) {
            onError("Google không trả về thông tin đăng nhập. Vui lòng thử lại.");
            return;
          }

          onCredential(response.credential);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      googleApi.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: mode === "register" ? "signup_with" : "signin_with",
        shape: "rectangular",
        width: Math.min(Math.max(containerRef.current.offsetWidth, 240), 400),
      });
    };

    if ((window as Window & { google?: GoogleAccountsApi }).google) {
      renderGoogleButton();
      return () => {
        cancelled = true;
      };
    }

    let script = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const handleLoad = () => {
      renderGoogleButton();
    };

    const handleError = () => {
      onError("Không thể tải đăng nhập Google. Vui lòng thử lại sau.");
    };

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    return () => {
      cancelled = true;
      script?.removeEventListener("load", handleLoad);
      script?.removeEventListener("error", handleError);
    };
  }, [mode, onCredential, onError]);

  if (!GOOGLE_AUTH_ENABLED) {
    return null;
  }

  return (
    <div
      className={disabled ? "pointer-events-none opacity-50" : undefined}
      ref={containerRef}
    />
  );
}

export function AuthPanel({
  mode,
  redirectTo,
}: {
  mode: "login" | "register";
  redirectTo?: string;
}) {
  const router = useRouter();
  const {
    login,
    register,
    verifyRegistrationOtp,
    resendRegistrationOtp,
    loginWithGoogle,
  } = useAuth();
  const [step, setStep] = useState<AuthStep>("credentials");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpExpiresInMinutes, setOtpExpiresInMinutes] = useState(10);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const content = useMemo(
    () =>
      mode === "login"
        ? {
            title: "Đăng nhập để quản lý yêu cầu và hồ sơ",
            description: GOOGLE_AUTH_ENABLED
              ? "Dùng email, mật khẩu hoặc Google để tiếp tục quản lý hồ sơ Homi."
              : "Dùng email và mật khẩu để tiếp tục quản lý hồ sơ Homi.",
            cta: "Đăng nhập",
            secondaryLabel: "Chưa có tài khoản?",
            secondaryHref: "/register",
            secondaryAction: "Đăng ký ngay",
          }
        : {
            title: step === "otp" ? "Xác minh email đăng ký" : "Tạo tài khoản Homi",
            description:
              step === "otp"
                ? "Nhập mã 6 chữ số đã được gửi đến Gmail để kích hoạt tài khoản."
                : GOOGLE_AUTH_ENABLED
                  ? "Đăng ký bằng email và xác minh OTP, hoặc tiếp tục nhanh bằng Google."
                  : "Đăng ký bằng email và xác minh OTP để kích hoạt tài khoản.",
            cta: step === "otp" ? "Xác minh OTP" : "Tạo tài khoản",
            secondaryLabel: "Đã có tài khoản?",
            secondaryHref: "/login",
            secondaryAction: "Đăng nhập",
          },
    [mode, step],
  );

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

  const finishAuthentication = (user: UserProfile) => {
    setSuccessMessage("Đăng nhập thành công. Đang chuyển trang...");
    router.replace(getRedirectTarget(user, redirectTo));
  };

  const handleCredentialsSubmit = async () => {
    if (mode === "register" && formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: "Mật khẩu xác nhận chưa trùng khớp." });
      return;
    }

    const user =
      mode === "login"
        ? await login({
            email: formData.email.trim(),
            password: formData.password,
          })
        : null;

    if (user) {
      finishAuthentication(user);
      return;
    }

    const registration = await register({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
    });

    setPendingEmail(registration.email);
    setOtpExpiresInMinutes(registration.expiresInMinutes);
    setResendCooldownSeconds(registration.resendCooldownSeconds);
    setStep("otp");
    setSuccessMessage(registration.message);
  };

  const handleOtpSubmit = async () => {
    const user = await verifyRegistrationOtp({
      email: pendingEmail || formData.email.trim(),
      otp: formData.otp.trim(),
    });

    finishAuthentication(user);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});

    try {
      if (step === "otp") {
        await handleOtpSubmit();
      } else {
        await handleCredentialsSubmit();
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
      const response = await resendRegistrationOtp(pendingEmail || formData.email.trim());
      setOtpExpiresInMinutes(response.expiresInMinutes);
      setResendCooldownSeconds(response.resendCooldownSeconds);
      setSuccessMessage(response.message);
    } catch (error) {
      applyApiFieldErrors(error);
    } finally {
      setResending(false);
    }
  };

  const handleGoogleCredential = async (idToken: string) => {
    setGoogleSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});

    try {
      const user = await loginWithGoogle(idToken);
      finishAuthentication(user);
    } catch (error) {
      applyApiFieldErrors(error);
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] sm:rounded-[32px] sm:p-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-3xl">
          {content.title}
        </h1>
        <p className="text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">
          {content.description}
        </p>
      </div>

      <div className="mt-6 space-y-4 sm:mt-8">
        {step === "credentials" && GOOGLE_AUTH_ENABLED ? (
          <>
            <GoogleAuthButton
              mode={mode}
              disabled={submitting || googleSubmitting}
              onCredential={(idToken) => {
                void handleGoogleCredential(idToken);
              }}
              onError={setErrorMessage}
            />

            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
              <span className="h-px flex-1 bg-[var(--color-border-soft)]" />
              <span>Email</span>
              <span className="h-px flex-1 bg-[var(--color-border-soft)]" />
            </div>
          </>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {successMessage ? (
            <Alert tone="success" title="Thao tác thành công" description={successMessage} />
          ) : null}

          {errorMessage ? (
            <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
          ) : null}

          {step === "otp" ? (
            <>
              <Alert
                tone="info"
                title="Kiểm tra Gmail"
                description={`Mã OTP được gửi đến ${pendingEmail || formData.email}. Mã có hiệu lực trong ${otpExpiresInMinutes} phút.`}
              />
              <Input
                label="Mã OTP"
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                hint="Nhập đủ 6 chữ số trong email xác nhận."
                value={formData.otp}
                onChange={(event) =>
                  handleChange("otp", event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                error={fieldErrors.otp}
              />
            </>
          ) : (
            <>
              {mode === "register" ? (
                <Input
                  label="Họ tên"
                  name="fullName"
                  placeholder="Nguyễn Thị An"
                  hint="Tên này sẽ hiển thị trong hồ sơ và lịch sử yêu cầu."
                  value={formData.fullName}
                  onChange={(event) => handleChange("fullName", event.target.value)}
                  error={fieldErrors.fullName}
                />
              ) : null}

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="an.nguyen@example.com"
                hint="Email sẽ được dùng để đăng nhập."
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
                error={fieldErrors.email}
              />

              {mode === "register" ? (
                <Input
                  label="Số điện thoại"
                  name="phone"
                  placeholder="0911222333"
                  hint="Dùng cho việc liên hệ khi cần xem phòng."
                  value={formData.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  error={fieldErrors.phone}
                />
              ) : null}

              <Input
                label="Mật khẩu"
                name="password"
                type="password"
                placeholder="********"
                hint={mode === "register" ? "Tối thiểu 6 ký tự." : "Nhập mật khẩu đã đăng ký."}
                value={formData.password}
                onChange={(event) => handleChange("password", event.target.value)}
                error={fieldErrors.password}
              />

              {mode === "register" ? (
                <Input
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={(event) => handleChange("confirmPassword", event.target.value)}
                  error={fieldErrors.confirmPassword}
                />
              ) : null}
            </>
          )}

          <Button className="w-full" size="lg" type="submit" disabled={submitting || googleSubmitting}>
            {submitting ? "Đang xử lý..." : content.cta}
          </Button>

          {step === "otp" ? (
            <div className="flex flex-col gap-3 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
              <button
                className="font-semibold text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)] disabled:cursor-not-allowed disabled:opacity-60"
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
        {content.secondaryLabel}{" "}
        <Link
          href={content.secondaryHref}
          className="font-semibold text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)]"
        >
          {content.secondaryAction}
        </Link>
      </p>
    </div>
  );
}
