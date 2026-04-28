"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { ApiError, getErrorMessage } from "@/services/api-client";
import { createContactRequest } from "@/services/contact-request-service";
import type { UserProfile } from "@/types";

function ContactRequestForm({
  roomId,
  user,
}: {
  roomId: number;
  user: UserProfile;
}) {
  const [formData, setFormData] = useState({
    requestType: "VIEWING",
    fullName: user.fullName,
    email: user.email,
    phone: user.phone ?? "",
    preferredViewingTime: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

    try {
      await createContactRequest({
        roomId,
        requestType: formData.requestType as "CONTACT" | "VIEWING",
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        preferredViewingTime: formatViewingTime(formData.preferredViewingTime),
      });

      setSuccessMessage("Đã ghi nhận yêu cầu. Chủ trọ hoặc admin có thể xem và cập nhật trạng thái ngay.");
      setFormData((current) => ({
        ...current,
        message: "",
        preferredViewingTime: "",
      }));
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
    <>
      {successMessage ? (
        <div className="mt-4 sm:mt-6">
          <Alert tone="success" title="Đã ghi nhận yêu cầu" description={successMessage} />
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 sm:mt-6">
          <Alert tone="warning" title="Không thể gửi yêu cầu" description={errorMessage} />
        </div>
      ) : null}

      <form className="mt-4 space-y-4 sm:mt-6" onSubmit={handleSubmit}>
        <Select
          label="Loại yêu cầu"
          options={[
            { label: "Đặt lịch xem phòng", value: "VIEWING" },
            { label: "Yêu cầu liên hệ", value: "CONTACT" },
          ]}
          value={formData.requestType}
          onChange={(event) => handleChange("requestType", event.target.value)}
        />
        <Input
          label="Họ tên"
          value={formData.fullName}
          onChange={(event) => handleChange("fullName", event.target.value)}
          error={fieldErrors.fullName}
          placeholder="Nguyễn Thị An"
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(event) => handleChange("email", event.target.value)}
          error={fieldErrors.email}
          placeholder="an.nguyen@example.com"
        />
        <Input
          label="Số điện thoại"
          value={formData.phone}
          onChange={(event) => handleChange("phone", event.target.value)}
          error={fieldErrors.phone}
          placeholder="0911222333"
        />
        <Input
          label="Thời gian xem phòng"
          type="datetime-local"
          min={getLocalDateTimeMin()}
          value={formData.preferredViewingTime}
          onChange={(event) => handleChange("preferredViewingTime", event.target.value)}
          error={fieldErrors.preferredViewingTime}
          hint="Có thể bỏ trống nếu bạn chỉ cần hỏi thêm thông tin."
        />
        <Textarea
          label="Lời nhắn"
          value={formData.message}
          onChange={(event) => handleChange("message", event.target.value)}
          error={fieldErrors.message}
          placeholder="Em quan tâm phòng này và muốn xem phòng vào cuối tuần."
        />
        <Button className="w-full" type="submit" disabled={submitting}>
          Gửi yêu cầu
        </Button>
      </form>
    </>
  );
}

export function ContactFormCard({
  roomId,
  ownerId,
}: {
  roomId: number;
  ownerId?: number | null;
}) {
  const { status, user } = useAuth();
  const pathname = usePathname();
  const loginHref = `/login?redirect=${encodeURIComponent(pathname)}`;
  const isOwnRoom = status === "authenticated" && user && ownerId != null && user.id === ownerId;

  return (
    <div className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:rounded-[32px] sm:p-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
          Yêu cầu xem phòng
        </p>
        <h3 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
          Gửi thông tin liên hệ
        </h3>
        <p className="text-sm leading-6 text-[var(--color-text-muted)]">
          Chọn thời gian xem phòng cụ thể để chủ trọ phản hồi nhanh và đúng lịch hơn.
        </p>
      </div>

      {status !== "authenticated" || !user ? (
        <div className="mt-4 space-y-4 rounded-[22px] bg-[var(--color-surface-soft)] p-4 sm:mt-6 sm:rounded-[28px] sm:p-5">
          <p className="text-sm leading-7 text-[var(--color-text-muted)]">
            Bạn cần đăng nhập trước khi gửi yêu cầu liên hệ hoặc đặt lịch xem phòng.
          </p>
          <Link href={loginHref}>
            <Button className="w-full">Đăng nhập để tiếp tục</Button>
          </Link>
        </div>
      ) : isOwnRoom ? (
        <div className="mt-4 sm:mt-6">
          <Alert
            tone="warning"
            title="Không thể gửi yêu cầu"
            description="Bạn không thể gửi yêu cầu xem phòng cho bài đăng của chính mình."
          />
        </div>
      ) : (
        <ContactRequestForm key={user.id} roomId={roomId} user={user} />
      )}
    </div>
  );
}

function getLocalDateTimeMin() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function formatViewingTime(value: string) {
  if (!value) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
