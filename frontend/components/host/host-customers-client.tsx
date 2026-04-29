"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Download, PhoneCall } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

import { exportCsv } from "@/lib/export-csv";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import {
  searchHostContactRequests,
  updateHostContactRequestStatus,
} from "@/services/host-service";
import type { ContactRequestStatus, HostContactRequest, PageResponse } from "@/types";

const PAGE_SIZE = 8;

const statusOptions = [
  { label: "Tất cả trạng thái", value: "" },
  { label: "Chưa xử lý", value: "PENDING" },
  { label: "Đã liên hệ", value: "IN_PROGRESS" },
  { label: "Đã chốt", value: "RESOLVED" },
  { label: "Từ chối", value: "CANCELLED" },
];

const hostContactStatusMeta: Record<
  ContactRequestStatus,
  { label: string; tone: "brand" | "success" | "warning" | "danger" }
> = {
  PENDING: { label: "Chưa xử lý", tone: "warning" },
  IN_PROGRESS: { label: "Đã liên hệ", tone: "brand" },
  RESOLVED: { label: "Đã chốt", tone: "success" },
  CANCELLED: { label: "Từ chối", tone: "danger" },
};

export function HostCustomersClient() {

  const [status, setStatus] = useState<ContactRequestStatus | "">("");
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<PageResponse<HostContactRequest> | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionRequestId, setActionRequestId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [exporting, setExporting] = useState(false);

  const loadCustomers = useCallback((pageValue: number, signal?: AbortSignal) => {
    return searchHostContactRequests(
      {
        status,
        page: pageValue - 1,
        size: PAGE_SIZE,
      },
      signal,
    )
      .then((nextResponse) => {
        setResponse(nextResponse);
      })
      .catch((error) => {
        if (signal?.aborted) {
          return;
        }

        setErrorMessage(getErrorMessage(error));
      })
      .finally(() => {
        if (!signal?.aborted) {
          setLoading(false);
        }
      });
  }, [status]);

  useEffect(() => {
    const controller = new AbortController();
    void loadCustomers(page, controller.signal);
    return () => controller.abort();
  }, [loadCustomers, page]);

  const updateStatus = async (
    requestId: number,
    nextStatus: ContactRequestStatus,
  ) => {
    setActionRequestId(requestId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateHostContactRequestStatus(requestId, {
        status: nextStatus,
        note: hostContactStatusMeta[nextStatus].label,
      });
      setSuccessMessage("Đã cập nhật trạng thái khách liên hệ.");
      await loadCustomers(page);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setActionRequestId(null);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
              Khách liên hệ
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-3xl">
              Quản lý người quan tâm phòng
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Mỗi yêu cầu gắn với một bài đăng của bạn. Cập nhật trạng thái để dễ theo dõi
              trong quá trình tư vấn.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:flex sm:flex-wrap sm:items-end lg:w-auto">
            <div className="w-full lg:w-64">
              <Select
                label="Lọc trạng thái"
                options={statusOptions}
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as ContactRequestStatus | "");
                  setLoading(true);
                  setErrorMessage("");
                  setPage(1);
                }}
              />
            </div>
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              disabled={exporting || loading}
              onClick={async () => {
                setExporting(true);
                try {
                  const all = await searchHostContactRequests({
                    status,
                    page: 0,
                    size: 9999,
                  });
                  exportCsv({
                    filename: "homi-host-customers",
                    headers: ["Tên khách", "Email", "SĐT", "Phòng quan tâm", "Loại yêu cầu", "Trạng thái", "Lời nhắn", "Ngày gửi"],
                    rows: all.content.map((c) => [
                      c.requesterName,
                      c.email,
                      c.phone,
                      c.roomTitle,
                      c.requestType === "VIEWING" ? "Xem phòng" : "Liên hệ",
                      hostContactStatusMeta[c.status].label,
                      c.message || "",
                      formatDate(c.createdAt),
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
      </section>

      {successMessage ? (
        <Alert tone="success" title="Thao tác thành công" description={successMessage} />
      ) : null}

      {errorMessage ? (
        <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
      ) : null}

      {loading && !response ? (
        <div className="space-y-4">
          <LoadingSkeleton className="h-60 rounded-[30px]" />
          <LoadingSkeleton className="h-60 rounded-[30px]" />
        </div>
      ) : response?.content.length ? (
        <>
          <div className="space-y-4">
            {response.content.map((customer) => {
              const statusMeta = hostContactStatusMeta[customer.status];

              return (
                <article
                  key={customer.id}
                  className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[30px] sm:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                        <span className="text-sm text-[var(--color-text-muted)]">
                          {formatDate(customer.createdAt)}
                        </span>
                      </div>
                      <h2 className="mt-3 text-lg font-semibold text-[var(--color-text-strong)] sm:text-xl">
                        {customer.requesterName}
                      </h2>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Quan tâm: {customer.roomTitle}
                      </p>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-text-muted)]">
                        {customer.message || "Khách chưa để lại lời nhắn."}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[var(--color-surface-soft)] p-4 text-sm text-[var(--color-text-muted)] lg:min-w-64">
                      <p className="font-semibold text-[var(--color-text-strong)]">
                        {customer.phone}
                      </p>
                      <p className="mt-1">{customer.email || "Chưa có email"}</p>
                      <Link href={`tel:${customer.phone}`}>
                        <Button className="mt-4 w-full" size="sm" leadingIcon={<PhoneCall className="size-4" />}>
                          Gọi khách
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2 sm:flex sm:flex-wrap">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={actionRequestId === customer.id}
                      onClick={() => updateStatus(customer.id, "IN_PROGRESS")}
                    >
                      Đã liên hệ
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={actionRequestId === customer.id}
                      onClick={() => updateStatus(customer.id, "RESOLVED")}
                    >
                      Đã chốt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={actionRequestId === customer.id}
                      onClick={() => updateStatus(customer.id, "CANCELLED")}
                    >
                      Từ chối
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

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
          title="Chưa có khách liên hệ phù hợp"
          description="Khi có người gửi yêu cầu từ bài đăng của bạn, danh sách sẽ hiển thị tại đây."
        />
      )}
    </div>
  );
}
