"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Flag } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { roomReportReasonLabel } from "@/constants/status";
import { useAuth } from "@/hooks/use-auth";
import { ApiError, getErrorMessage } from "@/services/api-client";
import { createRoomReport } from "@/services/room-report-service";
import type { RoomReportReason } from "@/types";

const reportReasonOptions: Array<{ value: RoomReportReason; label: string }> = [
  { value: "WRONG_INFO", label: roomReportReasonLabel.WRONG_INFO },
  { value: "DUPLICATE", label: roomReportReasonLabel.DUPLICATE },
  { value: "SCAM", label: roomReportReasonLabel.SCAM },
  { value: "UNAVAILABLE", label: roomReportReasonLabel.UNAVAILABLE },
  { value: "INAPPROPRIATE", label: roomReportReasonLabel.INAPPROPRIATE },
  { value: "OTHER", label: roomReportReasonLabel.OTHER },
];

export function RoomReportCard({ roomId }: { roomId: number }) {
  const { status } = useAuth();
  const pathname = usePathname();
  const loginHref = `/login?redirect=${encodeURIComponent(pathname)}`;
  const [formData, setFormData] = useState({
    reason: "WRONG_INFO" as RoomReportReason,
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});

    try {
      await createRoomReport({
        roomId,
        reason: formData.reason,
        details: formData.details.trim(),
      });

      setSuccessMessage("Da gui bao cao. Admin se xem xet va cap nhat lai tin dang neu can.");
      setFormData((current) => ({ ...current, details: "" }));
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
    <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
          Bao cao tin dang
        </p>
        <h3 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
          Tin dang co van de?
        </h3>
      </div>

      {status !== "authenticated" ? (
        <div className="motion-panel mt-4 space-y-4 rounded-[22px] bg-[var(--color-surface-soft)] p-4 hover:-translate-y-0.5 hover:shadow-sm sm:mt-6 sm:rounded-[28px] sm:p-5">
          <p className="text-sm leading-7 text-[var(--color-text-muted)]">
            Dang nhap de gui bao cao va giup admin xac minh chat luong tin dang.
          </p>
          <Link href={loginHref}>
            <Button className="w-full" leadingIcon={<Flag className="size-4" />}>
              Dang nhap de bao cao
            </Button>
          </Link>
        </div>
      ) : (
        <form className="motion-stagger mt-4 space-y-4 sm:mt-6" onSubmit={handleSubmit}>
          {successMessage ? (
            <Alert tone="success" title="Da ghi nhan bao cao" description={successMessage} />
          ) : null}

          {errorMessage ? (
            <Alert tone="warning" title="Khong the gui bao cao" description={errorMessage} />
          ) : null}

          <Select
            label="Ly do"
            options={reportReasonOptions}
            value={formData.reason}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                reason: event.target.value as RoomReportReason,
              }))
            }
          />
          <Textarea
            label="Chi tiet"
            value={formData.details}
            onChange={(event) => {
              setFormData((current) => ({ ...current, details: event.target.value }));
              setFieldErrors((current) => ({ ...current, details: "" }));
              setErrorMessage("");
            }}
            error={fieldErrors.details}
            placeholder="Vi du: so dien thoai khong dung, gia thuc te khac, phong da het..."
            maxLength={1000}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={submitting}
            variant="outline"
            leadingIcon={<Flag className="size-4" />}
          >
            {submitting ? "Dang gui..." : "Gui bao cao"}
          </Button>
        </form>
      )}
    </div>
  );
}
