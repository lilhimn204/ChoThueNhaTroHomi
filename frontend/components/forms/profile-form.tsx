"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { updateMyProfile } from "@/services/user-service";
import { ApiError, getErrorMessage } from "@/services/api-client";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeUploadImageSrc } from "@/lib/images";
import { uploadAvatarImage } from "@/services/upload-service";
import type { UserProfile } from "@/types";

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const { replaceUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone ?? "",
    avatarUrl: profile.avatarUrl ?? "",
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setErrorMessage("");
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMessage("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Ảnh không được vượt quá 5MB.");
      return;
    }

    setUploadingAvatar(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const uploadedImage = await uploadAvatarImage(file);
      handleChange("avatarUrl", uploadedImage.url);
      setSuccessMessage("Đã tải ảnh đại diện lên. Bấm lưu thay đổi để cập nhật hồ sơ.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (uploadingAvatar) {
      setErrorMessage("Vui lòng chờ ảnh tải lên xong trước khi lưu hồ sơ.");
      return;
    }

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});

    try {
      const nextProfile = await updateMyProfile({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        avatarUrl: formData.avatarUrl.trim(),
      });

      replaceUser(nextProfile);
      setSuccessMessage("Đã lưu thay đổi hồ sơ thành công.");
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
      className="rounded-[32px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:p-8"
      onSubmit={handleSubmit}
    >
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-strong)]">
          Hồ sơ cá nhân
        </h1>
        <p className="text-base leading-7 text-[var(--color-text-muted)]">
          Cập nhật các thông tin cơ bản dùng cho việc liên hệ: họ tên, email, số điện
          thoại và ảnh đại diện.
        </p>
      </div>

      {successMessage ? (
        <div className="mt-6">
          <Alert tone="success" title="Cập nhật thành công" description={successMessage} />
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-6">
          <Alert tone="warning" title="Không thể cập nhật" description={errorMessage} />
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Input
          label="Họ tên"
          value={formData.fullName}
          onChange={(event) => handleChange("fullName", event.target.value)}
          error={fieldErrors.fullName}
        />
        <Input label="Email" value={formData.email} type="email" disabled />
        <Input
          label="Số điện thoại"
          value={formData.phone}
          onChange={(event) => handleChange("phone", event.target.value)}
          error={fieldErrors.phone}
        />
        <div className="md:col-span-2">
          <span className="text-sm font-semibold text-[var(--color-text-strong)]">
            Ảnh đại diện
          </span>
          <div className="mt-2 rounded-[28px] border border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] p-4 shadow-sm transition-colors duration-200 hover:border-[var(--color-brand-500)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative size-28 shrink-0 overflow-hidden rounded-full border-4 border-[var(--color-surface)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
                {formData.avatarUrl ? (
                  <Image
                    src={normalizeUploadImageSrc(formData.avatarUrl)}
                    alt={formData.fullName || "Ảnh đại diện"}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--color-brand-700)]">
                    <ImagePlus className="size-8" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label
                    htmlFor="avatar-upload"
                    className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--color-brand-800)] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-brand-700)] hover:shadow-[var(--shadow-button-hover)] active:scale-[0.98]"
                  >
                    <ImagePlus className="size-4" />
                    {uploadingAvatar ? "Đang tải ảnh..." : "Chọn ảnh từ máy"}
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      disabled={uploadingAvatar}
                      onChange={handleAvatarUpload}
                    />
                  </label>

                  {formData.avatarUrl ? (
                    <button
                      type="button"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 text-sm font-semibold text-[var(--color-text-strong)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--color-danger-500)] hover:text-[var(--color-danger-600)] active:scale-[0.98]"
                      onClick={() => handleChange("avatarUrl", "")}
                    >
                      <Trash2 className="size-4" />
                      Gỡ ảnh
                    </button>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                  Chọn ảnh JPG, PNG hoặc WEBP, tối đa 5MB.
                </p>
                {fieldErrors.avatarUrl ? (
                  <p className="mt-2 text-sm text-[var(--color-danger-600)]">
                    {fieldErrors.avatarUrl}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="submit" disabled={submitting || uploadingAvatar}>
          Lưu thay đổi
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setFormData({
              fullName: profile.fullName,
              email: profile.email,
              phone: profile.phone ?? "",
              avatarUrl: profile.avatarUrl ?? "",
            })
          }
        >
          Đặt lại
        </Button>
      </div>
    </form>
  );
}
