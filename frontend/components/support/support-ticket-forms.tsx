"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/services/api-client";
import { createSupportTicket } from "@/services/support-service";
import type { SupportTicketType } from "@/types";

const reportReasons = [
  { label: "Thông tin sai", value: "Thông tin sai" },
  { label: "Phòng không còn trống", value: "Phòng không còn trống" },
  { label: "Giá hoặc diện tích không đúng", value: "Giá hoặc diện tích không đúng" },
  { label: "Nghi ngờ lừa đảo", value: "Nghi ngờ lừa đảo" },
  { label: "Nội dung không phù hợp", value: "Nội dung không phù hợp" },
  { label: "Khác", value: "Khác" },
];

const initialReportForm = {
  listingReference: "",
  reason: reportReasons[0].value,
  message: "",
  email: "",
  phone: "",
};

const initialContactForm = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

function useSupportSubmit() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (
    type: SupportTicketType,
    payload: Record<string, string>,
    onSuccess: () => void,
  ) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await createSupportTicket({
        type,
        listingReference: payload.listingReference?.trim(),
        reason: payload.reason?.trim(),
        fullName: payload.fullName?.trim(),
        email: payload.email?.trim(),
        phone: payload.phone?.trim(),
        subject: payload.subject?.trim(),
        message: payload.message.trim(),
      });
      onSuccess();
      setSuccessMessage("Đã gửi thông tin. Admin Homi sẽ kiểm tra và xử lý trong thời gian sớm nhất.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return { loading, successMessage, errorMessage, submit };
}

export function ReportWrongListingForm() {
  const [form, setForm] = useState(initialReportForm);
  const { loading, successMessage, errorMessage, submit } = useSupportSubmit();

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <form
      className="motion-panel space-y-5 rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] sm:rounded-[34px] sm:p-7"
      onSubmit={(event) => {
        event.preventDefault();
        void submit("ROOM_REPORT", form, () => setForm(initialReportForm));
      }}
    >
      {successMessage ? <Alert tone="success" title="Đã gửi báo cáo" description={successMessage} /> : null}
      {errorMessage ? <Alert tone="warning" title="Không thể gửi báo cáo" description={errorMessage} /> : null}

      <Input
        label="Mã tin hoặc link bài đăng"
        placeholder="#12345 hoặc https://..."
        value={form.listingReference}
        onChange={(event) => updateField("listingReference", event.target.value)}
        required
      />
      <Select
        label="Lý do báo cáo"
        options={reportReasons}
        value={form.reason}
        onChange={(event) => updateField("reason", event.target.value)}
      />
      <Textarea
        label="Nội dung chi tiết"
        placeholder="Mô tả điểm sai, ảnh hưởng hoặc thông tin bạn muốn Homi kiểm tra."
        value={form.message}
        onChange={(event) => updateField("message", event.target.value)}
        required
        maxLength={1500}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Email liên hệ"
          type="email"
          placeholder="ban@example.com"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
        <Input
          label="Số điện thoại"
          placeholder="0901234567"
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
      </div>
      <Button className="w-full" type="submit" disabled={loading} trailingIcon={<Send className="size-4" />}>
        {loading ? "Đang gửi..." : "Gửi báo cáo"}
      </Button>
    </form>
  );
}

export function ContactHomiForm() {
  const [form, setForm] = useState(initialContactForm);
  const { loading, successMessage, errorMessage, submit } = useSupportSubmit();

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <form
      className="motion-panel space-y-5 rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] sm:rounded-[34px] sm:p-7"
      onSubmit={(event) => {
        event.preventDefault();
        void submit("CONTACT", form, () => setForm(initialContactForm));
      }}
    >
      {successMessage ? <Alert tone="success" title="Đã gửi liên hệ" description={successMessage} /> : null}
      {errorMessage ? <Alert tone="warning" title="Không thể gửi liên hệ" description={errorMessage} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Họ tên"
          placeholder="Nguyễn Văn An"
          value={form.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="ban@example.com"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          required
        />
      </div>
      <Input
        label="Số điện thoại"
        placeholder="0901234567"
        value={form.phone}
        onChange={(event) => updateField("phone", event.target.value)}
        required
      />
      <Input
        label="Tiêu đề"
        placeholder="Tôi cần hỗ trợ về..."
        value={form.subject}
        onChange={(event) => updateField("subject", event.target.value)}
        required
      />
      <Textarea
        label="Nội dung"
        placeholder="Nhập nội dung bạn muốn gửi tới Homi."
        value={form.message}
        onChange={(event) => updateField("message", event.target.value)}
        required
        maxLength={1500}
      />
      <Button className="w-full" type="submit" disabled={loading} trailingIcon={<Send className="size-4" />}>
        {loading ? "Đang gửi..." : "Gửi liên hệ"}
      </Button>
    </form>
  );
}
