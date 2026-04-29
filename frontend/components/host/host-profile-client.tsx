"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { ApiError, getErrorMessage } from "@/services/api-client";
import { getHostProfile, updateHostProfile } from "@/services/host-service";

const defaultForm = {
  fullName: "",
  email: "",
  phone: "",
  avatarUrl: "",
  address: "",
  hostBio: "",
};

export function HostProfileClient() {
  const { refreshProfile } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();

    void getHostProfile(controller.signal)
      .then((profile) => {
        setForm({
          fullName: profile.fullName ?? "",
          email: profile.email ?? "",
          phone: profile.phone ?? "",
          avatarUrl: profile.avatarUrl ?? "",
          address: profile.address ?? "",
          hostBio: profile.hostBio ?? "",
        });
        setErrorMessage("");
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setSuccessMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});

    try {
      const updatedProfile = await updateHostProfile({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        avatarUrl: form.avatarUrl.trim(),
        address: form.address.trim(),
        hostBio: form.hostBio.trim(),
      });

      setForm({
        fullName: updatedProfile.fullName ?? "",
        email: updatedProfile.email ?? "",
        phone: updatedProfile.phone ?? "",
        avatarUrl: updatedProfile.avatarUrl ?? "",
        address: updatedProfile.address ?? "",
        hostBio: updatedProfile.hostBio ?? "",
      });
      setSuccessMessage("Đã cập nhật hồ sơ người cho thuê.");
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

  if (loading) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <LoadingSkeleton className="h-40 rounded-[24px] sm:h-44 sm:rounded-[32px]" />
        <LoadingSkeleton className="h-[28rem] rounded-[24px] sm:h-[30rem] sm:rounded-[32px]" />
      </div>
    );
  }

  return (
    <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
      <section className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
              Hồ sơ người cho thuê
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-3xl">
              Thông tin liên hệ và giới thiệu
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Hồ sơ rõ ràng giúp người tìm phòng tin tưởng hơn khi gửi yêu cầu xem phòng.
            </p>
          </div>
          <Button className="w-full sm:w-auto" type="submit" disabled={submitting} trailingIcon={<Save className="size-4" />}>
            Lưu hồ sơ
          </Button>
        </div>

        {successMessage ? (
          <div className="mt-6">
            <Alert tone="success" title="Thao tác thành công" description={successMessage} />
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6">
            <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
          </div>
        ) : null}
      </section>

      <section className="grid min-w-0 gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text-strong)]">
            Thông tin cơ bản
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Input
              label="Họ tên"
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              error={fieldErrors.fullName}
              required
            />
            <Input
              label="Số điện thoại"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              error={fieldErrors.phone}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              disabled
              hint="Email đăng nhập không chỉnh tại màn này để tránh lỗi phiên đăng nhập."
            />
            <Input
              label="Địa chỉ"
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
              error={fieldErrors.address}
            />
            <div className="md:col-span-2">
              <Input
                label="Ảnh đại diện"
                placeholder="https://..."
                value={form.avatarUrl}
                onChange={(event) => updateField("avatarUrl", event.target.value)}
                error={fieldErrors.avatarUrl}
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Mô tả ngắn về người cho thuê"
                value={form.hostBio}
                onChange={(event) => updateField("hostBio", event.target.value)}
                error={fieldErrors.hostBio}
              />
            </div>
          </div>
        </div>

        <aside className="rounded-[24px] border border-white/10 bg-[var(--color-brand-950)] p-4 text-white shadow-[var(--shadow-card)] ring-1 ring-white/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] sm:rounded-[32px] sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
            Gợi ý hồ sơ tốt
          </p>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-white/78">
            <li>Ghi rõ khu vực bạn đang cho thuê để khách dễ hình dung.</li>
            <li>Dùng số điện thoại thường xuyên nghe máy.</li>
            <li>Mô tả ngắn, thật, tránh quảng cáo quá đà.</li>
            <li>Ảnh đại diện nên rõ ràng nếu muốn tăng độ tin cậy.</li>
          </ul>
        </aside>
      </section>
    </form>
  );
}
