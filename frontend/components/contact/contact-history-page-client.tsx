"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { RequireAuth } from "@/components/auth/require-auth";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { contactRequestStatusMeta, contactRequestTypeLabel } from "@/constants/status";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import { getMyContactRequests } from "@/services/contact-request-service";
import type { ContactRequest, PageResponse } from "@/types";

const PAGE_SIZE = 5;

export function ContactHistoryPageClient() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<PageResponse<ContactRequest> | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void getMyContactRequests(page - 1, PAGE_SIZE, controller.signal)
      .then((nextResponse) => {
        setResponse(nextResponse);
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
  }, [page]);

  const requests = response?.content ?? [];

  return (
    <RequireAuth>
      <div className="container-shell py-8 sm:py-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
              Lịch sử liên hệ
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-4xl">
              Lịch sử yêu cầu liên hệ
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-base sm:leading-8">
              Danh sách được trình bày gọn để trên điện thoại vẫn dễ đọc. Mỗi
              mục hiển thị tên phòng, thời gian gửi, trạng thái và ghi chú từ admin.
            </p>
          </div>
          <Link href="/rooms" className="block w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Xem thêm phòng trọ</Button>
          </Link>
        </div>

        <div className="mt-8">
          {errorMessage ? (
            <Alert
              tone="warning"
              title="Không tải được lịch sử yêu cầu"
              description={errorMessage}
            />
          ) : loading ? (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-40 rounded-[30px]" />
              ))}
            </div>
          ) : requests.length ? (
            <div className="space-y-4">
              <div className="grid gap-4">
                {requests.map((request) => (
                  <article
                    key={request.id}
                    className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[30px] sm:p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge tone={contactRequestStatusMeta[request.status].tone}>
                            {contactRequestStatusMeta[request.status].label}
                          </Badge>
                          <Badge tone="muted">
                            {contactRequestTypeLabel[request.requestType]}
                          </Badge>
                          <span className="text-sm text-[var(--color-text-muted)]">
                            {formatDate(request.createdAt)}
                          </span>
                        </div>
                        <h2 className="text-lg font-semibold text-[var(--color-text-strong)] sm:text-xl">
                          {request.roomTitle}
                        </h2>
                        <p className="max-w-3xl text-sm leading-7 text-[var(--color-text-muted)]">
                          {request.message || "Không có lời nhắn bổ sung."}
                        </p>
                        {request.preferredViewingTime ? (
                          <p className="text-sm text-[var(--color-text-muted)]">
                            Thời gian mong muốn:{" "}
                            <span className="font-medium text-[var(--color-text-strong)]">
                              {request.preferredViewingTime}
                            </span>
                          </p>
                        ) : null}
                        {request.adminNote ? (
                          <div className="rounded-[22px] border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-text-strong)] shadow-sm">
                            <span className="font-semibold">Ghi chú admin:</span>{" "}
                            {request.adminNote}
                          </div>
                        ) : null}
                      </div>
                      <Link href={`/rooms/${request.roomSlug}`} className="block w-full sm:w-auto">
                        <Button className="w-full sm:w-auto" variant="outline">Xem lại phòng</Button>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={response?.totalPages ?? 1}
                onPageChange={(nextPage) => {
                  setLoading(true);
                  setErrorMessage("");
                  setPage(nextPage);
                }}
              />
            </div>
          ) : (
            <EmptyState
              title="Bạn chưa gửi yêu cầu nào"
              description="Sau khi đăng nhập và gửi form xem phòng, lịch sử sẽ hiển thị tại đây để bạn theo dõi trạng thái xử lý."
              actionLabel="Tìm phòng ngay"
              onAction={() => router.push("/rooms")}
            />
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
