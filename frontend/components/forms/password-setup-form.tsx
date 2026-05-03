"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { ApiError, getErrorMessage } from "@/services/api-client";
import { setMyPassword } from "@/services/user-service";

export function PasswordSetupForm() {
  const { refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});

    if (formData.newPassword.length < 6) {
      setFieldErrors({ newPassword: "Mật khẩu mới phải có ít nhất 6 ký tự." });
      setSubmitting(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: "Mật khẩu xác nhận không khớp." });
      setSubmitting(false);
      return;
    }

    try {
      const response = await setMyPassword({
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setSuccessMessage(response.message);
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
      await refreshProfile();
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
    <form
      className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:rounded-[32px] sm:p-8"
      onSubmit={handleSubmit}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--color-surface-soft)] text-[var(--color-brand-700)]">
            <KeyRound className="size-5" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
            Tạo mật khẩu cho tài khoản
          </h2>
        </div>
        <p className="text-sm leading-7 text-[var(--color-text-muted)]">
          Sau khi tạo mật khẩu, bạn có thể đăng nhập bằng cả Google và email/password.
        </p>
      </div>

      {successMessage ? (
        <div className="mt-6">
          <Alert tone="success" title="Đã tạo mật khẩu" description={successMessage} />
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-6">
          <Alert tone="warning" title="Không thể tạo mật khẩu" description={errorMessage} />
        </div>
      ) : null}

      <div className="motion-stagger mt-6 grid gap-5 sm:mt-8 md:grid-cols-2">
        <Input
          label="Mật khẩu mới"
          type="password"
          autoComplete="new-password"
          value={formData.newPassword}
          onChange={(event) => handleChange("newPassword", event.target.value)}
          error={fieldErrors.newPassword}
          hint="Tối thiểu 6 ký tự."
          required
        />
        <Input
          label="Xác nhận mật khẩu"
          type="password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={(event) => handleChange("confirmPassword", event.target.value)}
          error={fieldErrors.confirmPassword}
          required
        />
      </div>

      <div className="mt-6 sm:mt-8">
        <Button className="w-full sm:w-auto" type="submit" disabled={submitting}>
          {submitting ? "Đang tạo mật khẩu..." : "Tạo mật khẩu"}
        </Button>
      </div>
    </form>
  );
}
