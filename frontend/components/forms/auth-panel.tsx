"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { ApiError, getErrorMessage } from "@/services/api-client";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthPanel({
  mode,
  redirectTo,
}: {
  mode: "login" | "register";
  redirectTo?: string;
}) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const content = useMemo(
    () =>
      mode === "login"
        ? {
            title: "Đăng nhập để quản lý yêu cầu và hồ sơ",
            description:
              "Form được trình bày gọn, có nhãn rõ ràng và hướng dẫn ngay dưới trường nhập.",
            cta: "Đăng nhập",
            secondaryLabel: "Chưa có tài khoản?",
            secondaryHref: "/register",
            secondaryAction: "Đăng ký ngay",
          }
        : {
            title: "Tạo tài khoản để theo dõi phòng trọ quan tâm",
            description:
              "Tạo tài khoản để lưu hồ sơ, gửi yêu cầu xem phòng và theo dõi lịch sử liên hệ.",
            cta: "Tạo tài khoản",
            secondaryLabel: "Đã có tài khoản?",
            secondaryHref: "/login",
            secondaryAction: "Đăng nhập",
          },
    [mode],
  );

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setErrorMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});

    if (mode === "register" && formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: "Mật khẩu xác nhận chưa trùng khớp." });
      setSubmitting(false);
      return;
    }

    try {
      const user =
        mode === "login"
          ? await login({
              email: formData.email.trim(),
              password: formData.password,
            })
          : await register({
              fullName: formData.fullName.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
              password: formData.password,
            });

      setSuccessMessage(
        mode === "login"
          ? "Đăng nhập thành công. Đang chuyển trang..."
          : "Đăng ký thành công. Đang chuyển trang...",
      );

      const redirectTarget =
        redirectTo ?? (user.roles.includes("ADMIN") ? "/admin" : "/profile");

      router.replace(redirectTarget);
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(
          Object.fromEntries(
            error.fieldErrors.map((fieldError) => [fieldError.field, fieldError.message]),
          ),
        );
      }

      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[32px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-strong)]">
          {content.title}
        </h1>
        <p className="text-base leading-7 text-[var(--color-text-muted)]">
          {content.description}
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {successMessage ? (
          <Alert tone="success" title="Thao tác thành công" description={successMessage} />
        ) : null}

        {errorMessage ? (
          <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
        ) : null}

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

        <Button className="w-full" size="lg" type="submit" disabled={submitting}>
          {content.cta}
        </Button>
      </form>

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
