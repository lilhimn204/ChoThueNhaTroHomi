"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Building2, Download, EyeOff, MessageSquareText, Plus, UsersRound } from "lucide-react";

import { HostStatCard } from "@/components/host/host-stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { contactRequestStatusMeta } from "@/constants/status";
import { useAuth } from "@/hooks/use-auth";
import { exportCsv } from "@/lib/export-csv";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import { getHostDashboard } from "@/services/host-service";
import type { HostDashboard } from "@/types";

export function HostDashboardClient() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<HostDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void getHostDashboard(controller.signal)
      .then((response) => {
        setDashboard(response);
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
  }, []);

  const handleExport = useCallback(() => {
    if (!dashboard) return;

    const rows: string[][] = [
      ["--- THỐNG KÊ ---", "", "", "", ""],
      ["Tổng bài đăng", String(dashboard.totalPosts), "", "", ""],
      ["Đang hiển thị", String(dashboard.availablePosts), "", "", ""],
      ["Đã ẩn / hết phòng", String(dashboard.closedOrHiddenPosts), "", "", ""],
      ["Khách quan tâm", String(dashboard.totalContactRequests), "", "", ""],
      ["", "", "", "", ""],
      ["--- LIÊN HỆ MỚI NHẤT ---", "", "", "", ""],
      ...dashboard.recentContactRequests.map((c) => [
        c.requesterName,
        c.roomTitle,
        contactRequestStatusMeta[c.status].label,
        c.message || "",
        formatDate(c.createdAt),
      ]),
    ];

    exportCsv({
      filename: "homi-host-dashboard",
      headers: ["Nội dung", "Chi tiết 1", "Chi tiết 2", "Chi tiết 3", "Chi tiết 4"],
      rows,
    });
  }, [dashboard]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="motion-panel animate-content-rise overflow-hidden rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px]">
        <div className="grid gap-5 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[1.3fr_0.7fr] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
              Tổng quan chủ trọ
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-4xl">
              Xin chào, {dashboard?.fullName ?? user?.fullName ?? "bạn"}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-base sm:leading-8">
              Đây là khu vực riêng để bạn đăng phòng, theo dõi khách quan tâm và cập nhật
              trạng thái phòng mà không cần vào trang quản trị tổng.
            </p>
          </div>
          <div className="motion-panel rounded-[22px] bg-[var(--color-brand-950)] p-4 text-white shadow-sm hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] sm:rounded-[28px] sm:p-5">
            <p className="text-sm text-white/60">CTA chính</p>
            <p className="mt-3 text-2xl font-semibold">Có phòng trống mới?</p>
            <Link href="/host/posts/create">
              <Button className="mt-5 w-full" variant="warm" trailingIcon={<Plus className="size-4" />}>
                Đăng bài mới
              </Button>
            </Link>
            <Button
              className="mt-2 w-full"
              variant="outline"
              disabled={!dashboard}
              onClick={handleExport}
              leadingIcon={<Download className="size-4" />}
            >
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <Alert tone="warning" title="Không tải được tổng quan" description={errorMessage} />
      ) : null}

      {loading ? (
        <div className="space-y-6">
          <section className="motion-stagger grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-40 rounded-[28px]" />
            ))}
          </section>
          <LoadingSkeleton className="h-80 rounded-[32px]" />
        </div>
      ) : !dashboard ? (
        <EmptyState
          title="Chưa có dữ liệu tổng quan"
          description="Không thể tải dữ liệu khu đăng tin. Hãy kiểm tra backend hoặc đăng nhập lại."
        />
      ) : (
        <>
          <section className="motion-stagger grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <HostStatCard
              label="Tổng bài đăng"
              value={String(dashboard.totalPosts)}
              helper="Tất cả phòng bạn đang quản lý."
              icon={Building2}
            />
            <HostStatCard
              label="Đang hiển thị"
              value={String(dashboard.availablePosts)}
              helper="Có thể nhận yêu cầu liên hệ mới."
              icon={UsersRound}
            />
            <HostStatCard
              label="Đã ẩn / hết phòng"
              value={String(dashboard.closedOrHiddenPosts)}
              helper="Không ưu tiên hiển thị với người tìm phòng."
              icon={EyeOff}
            />
            <HostStatCard
              label="Khách quan tâm"
              value={String(dashboard.totalContactRequests)}
              helper="Tổng yêu cầu liên hệ từ bài đăng của bạn."
              icon={MessageSquareText}
            />
          </section>

          <section className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
                  Liên hệ mới nhất
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Ưu tiên phản hồi nhanh để tăng khả năng chốt phòng.
                </p>
              </div>
              <Link href="/host/customers">
                <Button variant="outline">Xem tất cả</Button>
              </Link>
            </div>

            {dashboard.recentContactRequests.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="Chưa có khách liên hệ"
                  description="Khi người tìm phòng gửi yêu cầu, danh sách mới nhất sẽ hiển thị tại đây."
                />
              </div>
            ) : (
              <div className="motion-stagger mt-6 divide-y divide-[var(--color-border-soft)]">
                {dashboard.recentContactRequests.map((customer) => {
                  const status = contactRequestStatusMeta[customer.status];

                  return (
                    <div key={customer.id} className="motion-panel grid gap-3 rounded-2xl px-3 py-4 hover:bg-[var(--color-surface-soft)] md:grid-cols-[1fr_auto] md:items-center">
                      <div>
                        <p className="font-semibold text-[var(--color-text-strong)]">
                          {customer.requesterName}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                          {customer.roomTitle}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                          {customer.message || "Khách chưa để lại lời nhắn."}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:justify-end">
                        <Badge tone={status.tone}>{status.label}</Badge>
                        <span className="text-sm text-[var(--color-text-muted)]">
                          {formatDate(customer.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
