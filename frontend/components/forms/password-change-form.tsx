"use client";

import { useState } from "react";
import { LockKeyhole } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, getErrorMessage } from "@/services/api-client";
import { changeMyPassword } from "@/services/user-service";

export function PasswordChangeForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
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

    if (formData.newPassword !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: "Mật khẩu xác nhận không khớp." });
      setSubmitting(false);
      return;
    }

    try {
      const response = await changeMyPassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccessMessage(response.message);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
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
      className="motion-panel group animate-content-rise rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-8"
      onSubmit={handleSubmit}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="motion-soft flex size-11 items-center justify-center rounded-2xl bg-[var(--color-surface-soft)] text-[var(--color-brand-700)] group-hover:scale-[1.03]">
            <LockKeyhole className="size-5" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
            Đổi mật khẩu
          </h2>
        </div>
        <p className="text-sm leading-7 text-[var(--color-text-muted)]">
          Nhập mật khẩu hiện tại để xác minh trước khi đặt mật khẩu mới.
        </p>
      </div>

      {successMessage ? (
        <div className="mt-6">
          <Alert tone="success" title="Đổi mật khẩu thành công" description={successMessage} />
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-6">
          <Alert tone="warning" title="Không thể đổi mật khẩu" description={errorMessage} />
        </div>
      ) : null}

      <div className="motion-stagger mt-6 grid gap-5 md:grid-cols-3 sm:mt-8">
        <Input
          label="Mật khẩu hiện tại"
          type="password"
          autoComplete="current-password"
          value={formData.currentPassword}
          onChange={(event) => handleChange("currentPassword", event.target.value)}
          error={fieldErrors.currentPassword}
          required
        />
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
          label="Xác nhận mật khẩu mới"
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
          {submitting ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
        </Button>
      </div>
    </form>
  );
}
