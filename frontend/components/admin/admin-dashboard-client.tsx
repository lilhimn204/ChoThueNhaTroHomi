"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";

import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminTable } from "@/components/admin/admin-table";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { contactRequestStatusMeta, roomStatusMeta } from "@/constants/status";
import { exportCsv } from "@/lib/export-csv";
import { formatCompactCurrency, formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import { getDashboardSummary } from "@/services/admin-service";
import type { DashboardSummary } from "@/types";

export function AdminDashboardClient() {

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void getDashboardSummary(controller.signal)
      .then((response) => {
        setSummary(response);
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

  const stats = useMemo(
    () =>
      summary
        ? [
            {
              label: "Tổng bài đăng",
              value: String(summary.totalRooms),
              change: "Tổng bài đăng đang tồn tại trong hệ thống",
              tone: "brand" as const,
            },
            {
              label: "Phòng còn trống",
              value: String(summary.availableRooms),
              change: "Có thể hiển thị ngay trên trang công khai",
              tone: "success" as const,
            },
            {
              label: "Yêu cầu chờ xử lý",
              value: String(summary.pendingRequests),
              change: "Cần admin theo dõi và phản hồi",
              tone: "warning" as const,
            },
            {
              label: "Người dùng",
              value: String(summary.totalUsers),
              change: "Tài khoản đang có trong hệ thống",
              tone: "neutral" as const,
            },
          ]
        : [],
    [summary],
  );

  const handleExport = useCallback(() => {
    if (!summary) return;

    const rows: string[][] = [
      ["--- THỐNG KÊ TỔNG QUAN ---", "", "", ""],
      ["Tổng bài đăng", String(summary.totalRooms), "", ""],
      ["Phòng còn trống", String(summary.availableRooms), "", ""],
      ["Yêu cầu chờ xử lý", String(summary.pendingRequests), "", ""],
      ["Người dùng", String(summary.totalUsers), "", ""],
      ["", "", "", ""],
      ["--- BÀI ĐĂNG MỚI CẬP NHẬT ---", "", "", ""],
      ...summary.recentRooms.map((room) => [
        room.title,
        room.districtName,
        formatCompactCurrency(room.price),
        roomStatusMeta[room.status].label,
      ]),
      ["", "", "", ""],
      ["--- YÊU CẦU LIÊN HỆ GẦN ĐÂY ---", "", "", ""],
      ...summary.recentRequests.map((request) => [
        request.requesterName,
        request.roomTitle,
        contactRequestStatusMeta[request.status].label,
        formatDate(request.createdAt),
      ]),
    ];

    exportCsv({
      filename: "homi-admin-dashboard",
      headers: ["Nội dung", "Chi tiết 1", "Chi tiết 2", "Chi tiết 3"],
      rows,
    });
  }, [summary]);

  return (
    <div className="space-y-6">
      <div className="motion-panel animate-content-rise rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
              Admin Dashboard
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-4xl">
              Tổng quan hệ thống
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--color-text-muted)]">
              Theo dõi nhanh tổng bài đăng, phòng còn trống, yêu cầu mới và các
              nội dung cần admin xử lý trong ngày.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/rooms">
              <Button>Quản lý bài đăng</Button>
            </Link>
            <Link href="/admin/contact-requests">
              <Button variant="outline">Xem yêu cầu mới</Button>
            </Link>
            <Button
              variant="outline"
              disabled={!summary}
              onClick={handleExport}
              leadingIcon={<Download className="size-4" />}
            >
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {errorMessage ? (
        <Alert tone="warning" title="Không tải được dashboard" description={errorMessage} />
      ) : loading || !summary ? (
        <div className="space-y-6">
          <div className="motion-stagger grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-44 rounded-[28px]" />
            ))}
          </div>
          <div className="motion-stagger grid gap-6 xl:grid-cols-2">
            <LoadingSkeleton className="h-80 rounded-[28px]" />
            <LoadingSkeleton className="h-80 rounded-[28px]" />
          </div>
        </div>
      ) : (
        <>
          <div className="motion-stagger grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
            {stats.map((stat) => (
              <AdminStatCard key={stat.label} stat={stat} />
            ))}
          </div>

          <DashboardCharts />

          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <section className="min-w-0 space-y-4">
              <div className="motion-panel flex flex-col gap-3 rounded-[24px] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-4 py-4 shadow-sm hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
                  Bài đăng mới cập nhật
                </h2>
                <Link href="/admin/rooms">
                  <Button variant="ghost">Xem tất cả</Button>
                </Link>
              </div>
              <AdminTable
                headers={["Phòng", "Khu vực", "Giá", "Trạng thái"]}
                rows={summary.recentRooms.map((room) => [
                  room.title,
                  room.districtName,
                  formatCompactCurrency(room.price),
                  <Badge key={`${room.id}-status`} tone={roomStatusMeta[room.status].tone}>
                    {roomStatusMeta[room.status].label}
                  </Badge>,
                ])}
              />
            </section>

            <section className="min-w-0 space-y-4">
              <div className="motion-panel flex flex-col gap-3 rounded-[24px] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-4 py-4 shadow-sm hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
                  Yêu cầu liên hệ gần đây
                </h2>
                <Link href="/admin/contact-requests">
                  <Button variant="ghost">Mở chi tiết</Button>
                </Link>
              </div>
              <AdminTable
                headers={["Người gửi", "Phòng", "Trạng thái", "Ngày tạo"]}
                rows={summary.recentRequests.map((request) => [
                  request.requesterName,
                  request.roomTitle,
                  <Badge
                    key={`${request.id}-request-status`}
                    tone={contactRequestStatusMeta[request.status].tone}
                  >
                    {contactRequestStatusMeta[request.status].label}
                  </Badge>,
                  formatDate(request.createdAt),
                ])}
              />
            </section>
          </div>
        </>
      )}
    </div>
  );
}
