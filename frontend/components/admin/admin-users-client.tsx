"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Lock, Unlock } from "lucide-react";

import { AdminTable } from "@/components/admin/admin-table";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

import { userStatusMeta } from "@/constants/status";
import { exportCsv } from "@/lib/export-csv";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import { searchAdminUsers, updateUserStatus } from "@/services/user-service";
import type { AdminUser, PageResponse, UserStatus } from "@/types";

const PAGE_SIZE = 10;

const statusFilterOptions = [
  { label: "Tất cả trạng thái", value: "ALL" },
  { label: "Hoạt động", value: "ACTIVE" },
  { label: "Không hoạt động", value: "INACTIVE" },
  { label: "Đã khóa", value: "LOCKED" },
];

export function AdminUsersClient() {
  const { toast } = useToast();
  const [data, setData] = useState<PageResponse<AdminUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Confirm dialog state
  const [confirmTarget, setConfirmTarget] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(
    (signal?: AbortSignal) => {
      void searchAdminUsers({ keyword: keyword || undefined, page, size: PAGE_SIZE }, signal)
        .then((response) => {
          setData(response);
          setErrorMessage("");
        })
        .catch((error) => {
          if (signal?.aborted) return;
          setErrorMessage(getErrorMessage(error));
        })
        .finally(() => {
          if (!signal?.aborted) setLoading(false);
        });
    },
    [keyword, page],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
    return () => controller.abort();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPage(0);
  };

  const handlePageChange = (nextPage: number) => {
    setLoading(true);
    setPage(nextPage);
  };

  const isLockingTarget = confirmTarget ? confirmTarget.status !== "LOCKED" : false;

  const handleConfirmToggleLock = async () => {
    if (!confirmTarget) return;

    const user = confirmTarget;
    const isLocking = user.status !== "LOCKED";

    setActionLoading(user.id);
    try {
      const newStatus: UserStatus = isLocking ? "LOCKED" : "ACTIVE";
      const updated = await updateUserStatus(user.id, {
        status: newStatus,
        enabled: !isLocking,
      });

      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.map((u) => (u.id === user.id ? updated : u)),
        };
      });

      toast(
        isLocking
          ? `Đã khóa tài khoản "${user.fullName}"`
          : `Đã mở khóa tài khoản "${user.fullName}"`,
        "success",
      );
    } catch (error) {
      toast(getErrorMessage(error), "error");
    } finally {
      setActionLoading(null);
      setConfirmTarget(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!data) return [];
    if (statusFilter === "ALL") return data.content;
    return data.content.filter((user) => user.status === statusFilter);
  }, [data, statusFilter]);

  const handleExport = useCallback(() => {
    if (!data) return;

    void searchAdminUsers({ keyword: keyword || undefined, page: 0, size: 9999 })
      .then((response) => {
        exportCsv({
          filename: "homi-admin-users",
          headers: ["ID", "Họ tên", "Email", "SĐT", "Vai trò", "Trạng thái", "Ngày tạo"],
          rows: response.content.map((user) => [
            String(user.id),
            user.fullName,
            user.email,
            user.phone ?? "",
            user.roles.join(", "),
            userStatusMeta[user.status].label,
            formatDate(user.createdAt),
          ]),
        });
        toast("Đã xuất file CSV thành công", "success");
      })
      .catch((error) => {
        toast(getErrorMessage(error), "error");
      });
  }, [data, keyword, toast]);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
              Quản trị
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-4xl">
              Quản lý người dùng
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-base sm:leading-8">
              Xem danh sách, tìm kiếm và quản lý trạng thái tài khoản người dùng trong hệ thống.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              disabled={!data}
              onClick={handleExport}
              leadingIcon={<Download className="size-4" />}
            >
              Xuất CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-[22px] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-5">
        <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <Input
              label="Tìm kiếm"
              placeholder="Tìm theo tên, email hoặc SĐT..."
              value={keyword}
              onChange={(e) => {
                setLoading(true);
                setKeyword(e.target.value);
              }}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              label="Trạng thái"
              options={statusFilterOptions}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <Button className="w-full md:w-auto" type="submit">Tìm kiếm</Button>
        </form>
      </div>

      {/* Content */}
      {errorMessage ? (
        <Alert tone="warning" title="Lỗi tải dữ liệu" description={errorMessage} />
      ) : loading ? (
        <LoadingSkeleton className="h-96 rounded-[28px]" />
      ) : !data || filteredUsers.length === 0 ? (
        <EmptyState
          title="Không tìm thấy người dùng"
          description="Thử thay đổi từ khóa hoặc bộ lọc để tìm kết quả khác."
        />
      ) : (
        <>
          <AdminTable
            headers={["Họ tên", "Email", "SĐT", "Vai trò", "Trạng thái", "Ngày tạo", "Hành động"]}
            rows={filteredUsers.map((user) => [
              <span key={`name-${user.id}`} className="font-medium text-[var(--color-text-strong)]">
                {user.fullName}
              </span>,
              user.email,
              user.phone ?? "—",
              <div key={`roles-${user.id}`} className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <Badge key={role} tone={role === "ADMIN" ? "brand" : "muted"}>
                    {role === "ADMIN" ? "Admin" : "User"}
                  </Badge>
                ))}
              </div>,
              <Badge key={`status-${user.id}`} tone={userStatusMeta[user.status].tone}>
                {userStatusMeta[user.status].label}
              </Badge>,
              formatDate(user.createdAt),
              <div key={`actions-${user.id}`} className="flex gap-2">
                {user.status === "LOCKED" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionLoading === user.id}
                    onClick={() => setConfirmTarget(user)}
                    leadingIcon={<Unlock className="size-3.5" />}
                  >
                    Mở khóa
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionLoading === user.id || user.roles.includes("ADMIN")}
                    onClick={() => setConfirmTarget(user)}
                    leadingIcon={<Lock className="size-3.5" />}
                  >
                    Khóa
                  </Button>
                )}
              </div>,
            ])}
          />

          {data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmTarget !== null}
        title={isLockingTarget ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        description={
          confirmTarget
            ? isLockingTarget
              ? `Bạn có chắc muốn khóa tài khoản "${confirmTarget.fullName}"? Người dùng sẽ không thể đăng nhập sau khi bị khóa.`
              : `Bạn có chắc muốn mở khóa tài khoản "${confirmTarget.fullName}"? Người dùng sẽ có thể đăng nhập trở lại.`
            : ""
        }
        confirmLabel={isLockingTarget ? "Khóa tài khoản" : "Mở khóa"}
        tone={isLockingTarget ? "danger" : "warning"}
        loading={actionLoading !== null}
        onConfirm={handleConfirmToggleLock}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
