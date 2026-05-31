"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { ApiError, getErrorMessage } from "@/services/api-client";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthReveal, AuthStagger, AuthStaggerItem } from "@/components/forms/auth-motion";
import { getSafeAuthRedirect } from "@/lib/safe-redirect";
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
        context?: "signin" | "signup" | "use";
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
          locale?: string;
          logo_alignment?: "left" | "center";
        },
      ) => void;
    };
  };
}

const GOOGLE_SCRIPT_ID = "google-identity-services";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_AUTH_ENABLED = Boolean(GOOGLE_CLIENT_ID);

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
  const onCredentialRef = useRef(onCredential);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onCredentialRef.current = onCredential;
    onErrorRef.current = onError;
  }, [onCredential, onError]);

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
        onErrorRef.current("Không thể tải đăng nhập Google. Vui lòng thử lại sau.");
        return;
      }

      containerRef.current.replaceChildren();
      googleApi.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback(response) {
          if (!response.credential) {
            onErrorRef.current("Google không trả về thông tin đăng nhập. Vui lòng thử lại.");
            return;
          }

          onCredentialRef.current(response.credential);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        context: mode === "register" ? "signup" : "signin",
      });

      googleApi.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "outline",
        size: "medium",
        text: "signin_with",
        shape: "rectangular",
        width: Math.min(Math.max(containerRef.current.offsetWidth, 260), 520),
        locale: "vi",
        logo_alignment: "left",
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
      script.src = "https://accounts.google.com/gsi/client?hl=vi";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const handleLoad = () => {
      renderGoogleButton();
    };

    const handleError = () => {
      onErrorRef.current("Không thể tải đăng nhập Google. Vui lòng thử lại sau.");
    };

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    return () => {
      cancelled = true;
      script?.removeEventListener("load", handleLoad);
      script?.removeEventListener("error", handleError);
    };
  }, [mode]);

  if (!GOOGLE_AUTH_ENABLED) {
    return null;
  }

  return (
    <div
      className={
        disabled
          ? "motion-soft pointer-events-none flex min-h-12 w-full items-center justify-center rounded-[16px] opacity-55 grayscale [&>div]:!w-full [&_iframe]:!mx-auto [&_iframe]:!w-full"
          : "motion-soft flex min-h-12 w-full items-center justify-center rounded-[16px] hover:-translate-y-0.5 hover:shadow-sm [&>div]:!w-full [&_iframe]:!mx-auto [&_iframe]:!w-full"
      }
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const content = useMemo(
    () =>
      mode === "login"
        ? {
            title: "Tiếp tục hành trình tìm phòng",
            description: GOOGLE_AUTH_ENABLED
              ? "Đăng nhập bằng email, mật khẩu hoặc Google để theo dõi phòng đã quan tâm."
              : "Đăng nhập bằng email và mật khẩu để theo dõi phòng đã quan tâm.",
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
                  ? "Đăng ký bằng email, xác minh OTP hoặc tiếp tục nhanh bằng Google."
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
    router.replace(getSafeAuthRedirect(user, redirectTo));
  };

  const passwordToggle = (visible: boolean, onToggle: () => void, label: string) => (
    <button
      type="button"
      aria-label={label}
      onClick={onToggle}
      className="motion-pressable flex size-11 items-center justify-center rounded-[14px] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-brand-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
    >
      {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );

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
    <AuthReveal
      className="w-full rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[0_18px_55px_rgba(16,42,67,0.10)] ring-1 ring-[var(--color-border-soft)] sm:p-6 lg:p-7"
      delay={0.08}
      hover
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
          {step === "otp" ? "Xác minh bảo mật" : mode === "login" ? "Đăng nhập Homi" : "Đăng ký Homi"}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-3xl">
          {content.title}
        </h1>
        <p className="text-sm leading-6 text-[var(--color-text-muted)] sm:text-base sm:leading-7">
          {content.description}
        </p>
      </div>

      <div className="mt-5 space-y-4 sm:mt-6">
        {step === "credentials" && GOOGLE_AUTH_ENABLED ? (
          <AuthStagger className="space-y-4" delay={0.04}>
            <AuthStaggerItem>
              <GoogleAuthButton
                mode={mode}
                disabled={submitting || googleSubmitting}
                onCredential={(idToken) => {
                  void handleGoogleCredential(idToken);
                }}
                onError={setErrorMessage}
              />
            </AuthStaggerItem>

            <AuthStaggerItem className="motion-soft flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
              <span className="h-px flex-1 bg-[var(--color-border-soft)]" />
              <span>Hoặc</span>
              <span className="h-px flex-1 bg-[var(--color-border-soft)]" />
            </AuthStaggerItem>
          </AuthStagger>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <AuthStagger className="space-y-4">
            {successMessage ? (
              <AuthStaggerItem>
                <Alert
                  tone="success"
                  title="Thao tác thành công"
                  description={successMessage}
                />
              </AuthStaggerItem>
            ) : null}

            {errorMessage ? (
              <AuthStaggerItem>
                <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
              </AuthStaggerItem>
            ) : null}

            {step === "otp" ? (
              <>
                <AuthStaggerItem>
                  <Alert
                    tone="info"
                    title="Kiểm tra Gmail"
                    description={`Mã OTP được gửi đến ${pendingEmail || formData.email}. Mã có hiệu lực trong ${otpExpiresInMinutes} phút. Kiểm tra mục "Thư rác" nếu chưa thấy email trong Hộp thư đến.`}
                  />
                </AuthStaggerItem>
                <AuthStaggerItem>
                  <Input
                    label="Mã OTP"
                    name="otp"
                    floatingLabel
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
                </AuthStaggerItem>
              </>
            ) : (
              <>
                {mode === "register" ? (
                  <>
                    <AuthStaggerItem className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Họ tên"
                        name="fullName"
                        floatingLabel
                        autoComplete="name"
                        placeholder="Nguyễn Thị An"
                        value={formData.fullName}
                        onChange={(event) => handleChange("fullName", event.target.value)}
                        error={fieldErrors.fullName}
                      />
                      <Input
                        label="Email"
                        name="email"
                        floatingLabel
                        type="email"
                        autoComplete="email"
                        placeholder="an.nguyen@example.com"
                        value={formData.email}
                        onChange={(event) => handleChange("email", event.target.value)}
                        error={fieldErrors.email}
                      />
                    </AuthStaggerItem>

                    <AuthStaggerItem className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Số điện thoại"
                        name="phone"
                        floatingLabel
                        type="tel"
                        autoComplete="tel"
                        placeholder="0911222333"
                        value={formData.phone}
                        onChange={(event) => handleChange("phone", event.target.value)}
                        error={fieldErrors.phone}
                      />
                      <Input
                        label="Mật khẩu"
                        name="password"
                        floatingLabel
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="********"
                        value={formData.password}
                        onChange={(event) => handleChange("password", event.target.value)}
                        error={fieldErrors.password}
                        trailingIcon={passwordToggle(
                          showPassword,
                          () => setShowPassword((current) => !current),
                          showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu",
                        )}
                      />
                    </AuthStaggerItem>

                    <AuthStaggerItem>
                      <Input
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        floatingLabel
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="********"
                        value={formData.confirmPassword}
                        onChange={(event) => handleChange("confirmPassword", event.target.value)}
                        error={fieldErrors.confirmPassword}
                        trailingIcon={passwordToggle(
                          showConfirmPassword,
                          () => setShowConfirmPassword((current) => !current),
                          showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận",
                        )}
                      />
                    </AuthStaggerItem>
                  </>
                ) : (
                  <>
                    <AuthStaggerItem>
                      <Input
                        label="Email"
                        name="email"
                        floatingLabel
                        type="email"
                        autoComplete="email"
                        placeholder="an.nguyen@example.com"
                        value={formData.email}
                        onChange={(event) => handleChange("email", event.target.value)}
                        error={fieldErrors.email}
                      />
                    </AuthStaggerItem>

                    <AuthStaggerItem>
                      <Input
                        label="Mật khẩu"
                        name="password"
                        floatingLabel
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="********"
                        value={formData.password}
                        onChange={(event) => handleChange("password", event.target.value)}
                        error={fieldErrors.password}
                        trailingIcon={passwordToggle(
                          showPassword,
                          () => setShowPassword((current) => !current),
                          showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu",
                        )}
                      />
                    </AuthStaggerItem>

                    <AuthStaggerItem className="-mt-1 flex justify-end">
                      <Link
                        href="/forgot-password"
                        className="motion-soft rounded-xl px-1 py-1 text-sm font-semibold text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
                      >
                        Quên mật khẩu?
                      </Link>
                    </AuthStaggerItem>
                  </>
                )}
              </>
            )}

            <AuthStaggerItem>
              <Button
                className="w-full"
                size="lg"
                type="submit"
                disabled={submitting || googleSubmitting}
                leadingIcon={
                  submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : successMessage ? (
                    <CheckCircle2 className="size-4" />
                  ) : undefined
                }
              >
                {submitting ? "Đang xử lý..." : content.cta}
              </Button>
            </AuthStaggerItem>

            {step === "otp" ? (
              <AuthStaggerItem className="flex flex-col gap-3 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="motion-pressable inline-flex min-h-11 items-center rounded-xl px-1 font-semibold text-[var(--color-brand-700)] hover:-translate-y-0.5 hover:text-[var(--color-brand-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
                  type="button"
                  disabled={resending || submitting}
                  onClick={() => {
                    void handleResendOtp();
                  }}
                >
                  {resending ? "Đang gửi lại..." : "Gửi lại OTP"}
                </button>
                <span>Chờ khoảng {resendCooldownSeconds} giây giữa các lần gửi.</span>
              </AuthStaggerItem>
            ) : null}
          </AuthStagger>
        </form>
      </div>

      <p className="mt-6 text-sm text-[var(--color-text-muted)]">
        {content.secondaryLabel}{" "}
        <Link
          href={content.secondaryHref}
          className="motion-soft rounded-xl font-semibold text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
        >
          {content.secondaryAction}
        </Link>
      </p>
    </AuthReveal>
  );
}
