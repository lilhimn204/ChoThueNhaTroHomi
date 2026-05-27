"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";

import { AdminTable } from "@/components/admin/admin-table";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  supportTicketStatusMeta,
  supportTicketTypeLabel,
} from "@/constants/status";
import { exportCsv } from "@/lib/export-csv";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import {
  searchAdminSupportTickets,
  SUPPORT_TICKETS_CHANGED_EVENT,
  updateAdminSupportTicketStatus,
} from "@/services/support-service";
import type {
  PageResponse,
  SupportTicket,
  SupportTicketStatus,
  SupportTicketType,
} from "@/types";

const PAGE_SIZE = 8;

const typeOptions: Array<{ value: SupportTicketType; label: string }> = [
  { value: "ROOM_REPORT", label: supportTicketTypeLabel.ROOM_REPORT },
  { value: "CONTACT", label: supportTicketTypeLabel.CONTACT },
];

const statusOptions: Array<{ value: SupportTicketStatus; label: string }> = [
  { value: "NEW", label: supportTicketStatusMeta.NEW.label },
  { value: "REVIEWING", label: supportTicketStatusMeta.REVIEWING.label },
  { value: "RESOLVED", label: supportTicketStatusMeta.RESOLVED.label },
  { value: "DISMISSED", label: supportTicketStatusMeta.DISMISSED.label },
];

function normalizeFilterParam<T extends string>(
  value: string | null,
  allowedValues: T[],
): T | "" {
  return allowedValues.includes(value as T) ? (value as T) : "";
}

export function AdminSupportTicketsClient() {
  const searchParams = useSearchParams();
  const lastSearchKeyRef = useRef("");
  const initialType = normalizeFilterParam(
    searchParams.get("type"),
    typeOptions.map((option) => option.value),
  );
  const initialStatus = normalizeFilterParam(
    searchParams.get("status"),
    statusOptions.map((option) => option.value),
  );
  const [filters, setFilters] = useState({
    keyword: "",
    type: initialType,
    status: initialStatus,
  });
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<PageResponse<SupportTicket> | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [editor, setEditor] = useState({
    status: "NEW" as SupportTicketStatus,
    adminNote: "",
  });

  useEffect(() => {
    const searchKey = searchParams.toString();
    if (lastSearchKeyRef.current === searchKey) {
      return;
    }

    lastSearchKeyRef.current = searchKey;
    const nextType = normalizeFilterParam(
      searchParams.get("type"),
      typeOptions.map((option) => option.value),
    );
    const nextStatus = normalizeFilterParam(
      searchParams.get("status"),
      statusOptions.map((option) => option.value),
    );

    queueMicrotask(() => {
      setPage(1);
      setLoading(true);
      setErrorMessage("");
      setFilters((current) => {
        if (current.type === nextType && current.status === nextStatus) {
          return current;
        }

        return {
          ...current,
          type: nextType,
          status: nextStatus,
        };
      });
    });
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();

    void searchAdminSupportTickets(
      {
        keyword: filters.keyword.trim(),
        type: filters.type as SupportTicketType | "",
        status: filters.status as SupportTicketStatus | "",
        page: page - 1,
        size: PAGE_SIZE,
      },
      controller.signal,
    )
      .then((nextResponse) => {
        setResponse(nextResponse);

        const firstTicket = nextResponse.content[0];
        if (firstTicket) {
          setSelectedTicketId(firstTicket.id);
          setEditor({
            status: firstTicket.status,
            adminNote: firstTicket.adminNote ?? "",
          });
        } else {
          setSelectedTicketId(null);
          setEditor({ status: "NEW", adminNote: "" });
        }
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
  }, [filters, page]);

  const selectedTicket = useMemo(
    () => response?.content.find((item) => item.id === selectedTicketId) ?? null,
    [response, selectedTicketId],
  );

  const chooseTicket = (ticket: SupportTicket) => {
    setSelectedTicketId(ticket.id);
    setEditor({
      status: ticket.status,
      adminNote: ticket.adminNote ?? "",
    });
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedTicketId) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedTicket = await updateAdminSupportTicketStatus(selectedTicketId, {
        status: editor.status,
        adminNote: editor.adminNote.trim(),
      });

      setSuccessMessage("Đã cập nhật trạng thái yêu cầu hỗ trợ.");
      setResponse((current) =>
        current
          ? {
              ...current,
              content: current.content.map((item) =>
                item.id === updatedTicket.id ? updatedTicket : item,
              ),
            }
          : current,
      );
      setEditor({
        status: updatedTicket.status,
        adminNote: updatedTicket.adminNote ?? "",
      });
      window.dispatchEvent(new Event(SUPPORT_TICKETS_CHANGED_EVENT));
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="motion-panel animate-content-rise rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
              Hỗ trợ Homi
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-4xl">
              Báo cáo tin sai và liên hệ người dùng
            </h1>
          </div>
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            disabled={exporting || loading}
            onClick={async () => {
              setExporting(true);
              try {
                const all = await searchAdminSupportTickets({
                  keyword: filters.keyword.trim(),
                  type: filters.type as SupportTicketType | "",
                  status: filters.status as SupportTicketStatus | "",
                  page: 0,
                  size: 9999,
                });
                exportCsv({
                  filename: "homi-admin-support-tickets",
                  headers: [
                    "Loại",
                    "Tiêu đề",
                    "Mã tin/link",
                    "Người gửi",
                    "Email",
                    "Số điện thoại",
                    "Trạng thái",
                    "Ngày gửi",
                  ],
                  rows: all.content.map((ticket) => [
                    supportTicketTypeLabel[ticket.type],
                    ticket.subject,
                    ticket.listingReference ?? "",
                    ticket.fullName ?? "",
                    ticket.email ?? "",
                    ticket.phone ?? "",
                    supportTicketStatusMeta[ticket.status].label,
                    formatDate(ticket.createdAt),
                  ]),
                });
              } catch (error) {
                setErrorMessage(getErrorMessage(error));
              } finally {
                setExporting(false);
              }
            }}
            leadingIcon={<Download className="size-4" />}
          >
            {exporting ? "Đang xuất..." : "Xuất CSV"}
          </Button>
        </div>
      </div>

      {successMessage ? (
        <Alert tone="success" title="Thao tác thành công" description={successMessage} />
      ) : null}

      {errorMessage ? (
        <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
      ) : null}

      <div className="grid min-w-0 gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <section className="space-y-4">
          <div className="motion-panel motion-stagger grid gap-4 rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[28px] sm:p-5 lg:grid-cols-3">
            <Input
              label="Tìm yêu cầu"
              placeholder="Email, số điện thoại, mã tin..."
              value={filters.keyword}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({ ...current, keyword: event.target.value }));
                setPage(1);
              }}
            />
            <Select
              label="Loại yêu cầu"
              options={[{ label: "Tất cả", value: "" }, ...typeOptions]}
              value={filters.type}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({
                  ...current,
                  type: event.target.value as SupportTicketType | "",
                }));
                setPage(1);
              }}
            />
            <Select
              label="Trạng thái"
              options={[{ label: "Tất cả", value: "" }, ...statusOptions]}
              value={filters.status}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({
                  ...current,
                  status: event.target.value as SupportTicketStatus | "",
                }));
                setPage(1);
              }}
            />
          </div>

          {loading && !response ? (
            <LoadingSkeleton className="h-[30rem] rounded-[28px]" />
          ) : response?.content.length ? (
            <>
              <AdminTable
                headers={["Loại", "Tiêu đề", "Người gửi", "Trạng thái", "Ngày gửi", "Tác vụ"]}
                rows={response.content.map((ticket) => [
                  supportTicketTypeLabel[ticket.type],
                  <div key={`${ticket.id}-subject`} className="max-w-[16rem]">
                    <p className="line-clamp-2 font-semibold text-[var(--color-text-strong)]">
                      {ticket.subject}
                    </p>
                    {ticket.listingReference ? (
                      <p className="mt-1 line-clamp-1 text-xs text-[var(--color-text-muted)]">
                        {ticket.listingReference}
                      </p>
                    ) : null}
                  </div>,
                  ticket.fullName || ticket.email || ticket.phone || "Chưa cung cấp",
                  <Badge
                    key={`${ticket.id}-status`}
                    tone={supportTicketStatusMeta[ticket.status].tone}
                  >
                    {supportTicketStatusMeta[ticket.status].label}
                  </Badge>,
                  formatDate(ticket.createdAt),
                  <Button
                    key={`${ticket.id}-action`}
                    variant="outline"
                    size="sm"
                    onClick={() => chooseTicket(ticket)}
                  >
                    Xử lý
                  </Button>,
                ])}
              />
              <Pagination
                currentPage={page}
                totalPages={response.totalPages}
                onPageChange={(nextPage) => {
                  setLoading(true);
                  setErrorMessage("");
                  setPage(nextPage);
                }}
              />
            </>
          ) : (
            <EmptyState
              title="Không có yêu cầu phù hợp"
              description="Thử bỏ bớt điều kiện lọc hoặc kiểm tra lại sau khi có người dùng gửi hỗ trợ mới."
            />
          )}
        </section>

        <aside className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
            Xử lý yêu cầu
          </h2>

          {selectedTicket ? (
            <>
              <div className="motion-panel mt-4 space-y-3 rounded-[22px] bg-[var(--color-surface-soft)] p-4 hover:-translate-y-0.5 hover:shadow-sm sm:rounded-[28px] sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={supportTicketStatusMeta[selectedTicket.status].tone}>
                    {supportTicketStatusMeta[selectedTicket.status].label}
                  </Badge>
                  <Badge tone="muted">
                    {supportTicketTypeLabel[selectedTicket.type]}
                  </Badge>
                </div>
                <p className="text-lg font-semibold text-[var(--color-text-strong)]">
                  {selectedTicket.subject}
                </p>
                {selectedTicket.listingReference ? (
                  <p className="text-sm text-[var(--color-brand-700)]">
                    {selectedTicket.listingReference}
                  </p>
                ) : null}
                <p className="text-sm text-[var(--color-text-muted)]">
                  {[selectedTicket.fullName, selectedTicket.email, selectedTicket.phone]
                    .filter(Boolean)
                    .join(" - ") || "Người gửi chưa cung cấp thông tin liên hệ."}
                </p>
                {selectedTicket.reason ? (
                  <p className="text-sm font-semibold text-[var(--color-text-strong)]">
                    Lý do: {selectedTicket.reason}
                  </p>
                ) : null}
                <p className="text-sm leading-7 text-[var(--color-text-strong)]">
                  {selectedTicket.message}
                </p>
                {selectedTicket.handledByName ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    Xử lý bởi {selectedTicket.handledByName}
                  </p>
                ) : null}
              </div>

              <form className="motion-stagger mt-6 space-y-4" onSubmit={handleUpdate}>
                <Select
                  label="Trạng thái mới"
                  options={statusOptions}
                  value={editor.status}
                  onChange={(event) =>
                    setEditor((current) => ({
                      ...current,
                      status: event.target.value as SupportTicketStatus,
                    }))
                  }
                />
                <Textarea
                  label="Ghi chú admin"
                  value={editor.adminNote}
                  onChange={(event) =>
                    setEditor((current) => ({ ...current, adminNote: event.target.value }))
                  }
                  placeholder="Đã kiểm tra tin, đã phản hồi người dùng, hoặc lý do bỏ qua..."
                  maxLength={600}
                />
                <Button className="w-full" type="submit" disabled={submitting}>
                  {submitting ? "Đang lưu..." : "Lưu cập nhật"}
                </Button>
              </form>
            </>
          ) : (
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
              Chọn một yêu cầu từ bảng bên trái để cập nhật trạng thái và ghi chú xử lý.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
