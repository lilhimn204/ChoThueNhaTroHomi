"use client";

import { useEffect, useMemo, useState } from "react";
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

import { contactRequestStatusMeta, contactRequestTypeLabel } from "@/constants/status";
import { exportCsv } from "@/lib/export-csv";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import {
  searchAdminContactRequests,
  updateAdminContactRequestStatus,
} from "@/services/contact-request-service";
import type {
  AdminContactRequest,
  ContactRequestStatus,
  PageResponse,
} from "@/types";

const PAGE_SIZE = 8;

export function AdminContactRequestsClient() {

  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<PageResponse<AdminContactRequest> | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [editor, setEditor] = useState({
    status: "PENDING" as ContactRequestStatus,
    adminNote: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    void searchAdminContactRequests(
      {
        keyword: filters.keyword.trim(),
        status: filters.status as ContactRequestStatus | "",
        page: page - 1,
        size: PAGE_SIZE,
      },
      controller.signal,
    )
      .then((nextResponse) => {
        setResponse(nextResponse);

        const firstRequest = nextResponse.content[0];

        if (firstRequest) {
          setSelectedRequestId(firstRequest.id);
          setEditor({
            status: firstRequest.status,
            adminNote: firstRequest.adminNote ?? "",
          });
        } else {
          setSelectedRequestId(null);
          setEditor({
            status: "PENDING",
            adminNote: "",
          });
        }
        setErrorMessage("");
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(getErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [filters, page]);

  const selectedRequest = useMemo(
    () => response?.content.find((item) => item.id === selectedRequestId) ?? null,
    [response, selectedRequestId],
  );

  const chooseRequest = (request: AdminContactRequest) => {
    setSelectedRequestId(request.id);
    setEditor({
      status: request.status,
      adminNote: request.adminNote ?? "",
    });
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedRequestId) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedRequest = await updateAdminContactRequestStatus(selectedRequestId, {
        status: editor.status,
        adminNote: editor.adminNote.trim(),
      });

      setSuccessMessage("Đã cập nhật trạng thái yêu cầu.");
      setResponse((current) =>
        current
          ? {
              ...current,
              content: current.content.map((item) =>
                item.id === updatedRequest.id ? updatedRequest : item,
              ),
            }
          : current,
      );
      setEditor({
        status: updatedRequest.status,
        adminNote: updatedRequest.adminNote ?? "",
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
              Quản lý yêu cầu liên hệ
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text-strong)]">
              Quản lý yêu cầu liên hệ
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--color-text-muted)]">
              Màn hình này giúp admin xử lý yêu cầu nhanh. Các thao tác được đặt gần bảng dữ
              liệu, trạng thái dễ nhìn và ghi chú admin vẫn đọc tốt trên điện thoại.
            </p>
          </div>
          <Button
            variant="outline"
            disabled={exporting || loading}
            onClick={async () => {
              setExporting(true);
              try {
                const all = await searchAdminContactRequests(
                  {
                    keyword: filters.keyword.trim(),
                    status: filters.status as ContactRequestStatus | "",
                    page: 0,
                    size: 9999,
                  },
                );
                exportCsv({
                  filename: "homi-admin-contact-requests",
                  headers: ["Người gửi", "Email", "SĐT", "Phòng", "Loại", "Trạng thái", "Ghi chú admin", "Ngày gửi"],
                  rows: all.content.map((r) => [
                    r.requesterName,
                    r.email,
                    r.phone,
                    r.roomTitle,
                    contactRequestTypeLabel[r.requestType],
                    contactRequestStatusMeta[r.status].label,
                    r.adminNote ?? "",
                    formatDate(r.createdAt),
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

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4">
          <div className="grid gap-4 rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] md:grid-cols-2">
            <Input
              label="Tìm yêu cầu"
              placeholder="Tìm theo tên, email, phòng..."
              value={filters.keyword}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({ ...current, keyword: event.target.value }));
                setPage(1);
              }}
            />
            <Select
              label="Trạng thái"
              options={[
                { label: "Tất cả", value: "" },
                { label: "Đang chờ xử lý", value: "PENDING" },
                { label: "Đang liên hệ", value: "IN_PROGRESS" },
                { label: "Đã xử lý", value: "RESOLVED" },
                { label: "Đã hủy", value: "CANCELLED" },
              ]}
              value={filters.status}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({ ...current, status: event.target.value }));
                setPage(1);
              }}
            />
          </div>

          {loading && !response ? (
            <LoadingSkeleton className="h-[30rem] rounded-[28px]" />
          ) : response?.content.length ? (
            <>
              <AdminTable
                headers={["Người gửi", "Phòng", "Loại", "Trạng thái", "Ngày gửi", "Tác vụ"]}
                rows={response.content.map((request) => [
                  request.requesterName,
                  request.roomTitle,
                  contactRequestTypeLabel[request.requestType],
                  <Badge
                    key={`${request.id}-status`}
                    tone={contactRequestStatusMeta[request.status].tone}
                  >
                    {contactRequestStatusMeta[request.status].label}
                  </Badge>,
                  formatDate(request.createdAt),
                  <Button
                    key={`${request.id}-action`}
                    variant="outline"
                    size="sm"
                    onClick={() => chooseRequest(request)}
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
              description="Thử bỏ bớt điều kiện tìm kiếm hoặc chờ người dùng gửi thêm yêu cầu mới."
            />
          )}
        </section>

        <aside className="rounded-[32px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
          <h2 className="text-2xl font-semibold text-[var(--color-text-strong)]">
            Cập nhật yêu cầu
          </h2>

          {selectedRequest ? (
            <>
              <div className="mt-4 space-y-3 rounded-[28px] bg-[var(--color-surface-soft)] p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={contactRequestStatusMeta[selectedRequest.status].tone}>
                    {contactRequestStatusMeta[selectedRequest.status].label}
                  </Badge>
                  <Badge tone="muted">
                    {contactRequestTypeLabel[selectedRequest.requestType]}
                  </Badge>
                </div>
                <p className="text-lg font-semibold text-[var(--color-text-strong)]">
                  {selectedRequest.requesterName}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">{selectedRequest.email}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{selectedRequest.phone}</p>
                <p className="text-sm leading-7 text-[var(--color-text-strong)]">
                  {selectedRequest.message || "Không có nội dung bổ sung."}
                </p>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleUpdate}>
                <Select
                    label="Trạng thái mới"
                  options={[
                    { label: "Đang chờ xử lý", value: "PENDING" },
                    { label: "Đang liên hệ", value: "IN_PROGRESS" },
                    { label: "Đã xử lý", value: "RESOLVED" },
                    { label: "Đã hủy", value: "CANCELLED" },
                  ]}
                  value={editor.status}
                  onChange={(event) =>
                    setEditor((current) => ({
                      ...current,
                      status: event.target.value as ContactRequestStatus,
                    }))
                  }
                />
                <Textarea
                  label="Ghi chú admin"
                  value={editor.adminNote}
                  onChange={(event) =>
                    setEditor((current) => ({ ...current, adminNote: event.target.value }))
                  }
                  placeholder="Đã gọi lại và hẹn lịch xem phòng..."
                />
                <Button className="w-full" type="submit" disabled={submitting}>
                  Lưu cập nhật
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
