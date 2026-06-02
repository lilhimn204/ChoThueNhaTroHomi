"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  Eye,
  Lock,
  MailCheck,
  ShieldCheck,
  Unlock,
  UserCog,
  X,
} from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { userStatusMeta } from "@/constants/status";
import { useAuth } from "@/hooks/use-auth";
import { exportCsv } from "@/lib/export-csv";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import {
  getAdminUser,
  searchAdminUsers,
  updateUserRoles,
  updateUserStatus,
  verifyAdminUserEmail,
} from "@/services/user-service";
import type { AdminUser, PageResponse, UserRole, UserStatus } from "@/types";

const PAGE_SIZE = 10;

const statusFilterOptions = [
  { label: "Tất cả trạng thái", value: "" },
  { label: "Hoạt động", value: "ACTIVE" },
  { label: "Chưa kích hoạt", value: "INACTIVE" },
  { label: "Đã khóa", value: "LOCKED" },
];

const roleFilterOptions = [
  { label: "Tất cả vai trò", value: "" },
  { label: "Người dùng", value: "USER" },
  { label: "Quản trị viên", value: "ADMIN" },
];

const roleOptions = [
  { label: "Người dùng", value: "USER" },
  { label: "Quản trị viên", value: "ADMIN" },
];

function getPrimaryRole(user: AdminUser): UserRole {
  return user.roles.includes("ADMIN") ? "ADMIN" : "USER";
}

function roleLabel(role: string) {
  return role === "ADMIN" ? "Admin" : "User";
}

function providerLabel(provider: AdminUser["authProvider"]) {
  return provider === "GOOGLE" ? "Google" : "Email/password";
}

export function AdminUsersClient() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [data, setData] = useState<PageResponse<AdminUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "">("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [page, setPage] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [detailTarget, setDetailTarget] = useState<AdminUser | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [lockTarget, setLockTarget] = useState<AdminUser | null>(null);
  const [lockReason, setLockReason] = useState("");
  const [roleTarget, setRoleTarget] = useState<AdminUser | null>(null);
  const [nextRole, setNextRole] = useState<UserRole>("USER");
  const [verifyTarget, setVerifyTarget] = useState<AdminUser | null>(null);

  const updateCachedUser = useCallback((updated: AdminUser) => {
    setData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        content: current.content.map((item) => (item.id === updated.id ? updated : item)),
      };
    });

    setDetailTarget((current) => (current?.id === updated.id ? updated : current));
    setRoleTarget((current) => (current?.id === updated.id ? updated : current));
    setLockTarget((current) => (current?.id === updated.id ? updated : current));
    setVerifyTarget((current) => (current?.id === updated.id ? updated : current));
  }, []);

  const fetchUsers = useCallback(
    (signal?: AbortSignal) => {
      void searchAdminUsers(
        {
          keyword: keyword || undefined,
          status: statusFilter,
          role: roleFilter,
          page,
          size: PAGE_SIZE,
        },
        signal,
      )
        .then((response) => {
          setData(response);
          setErrorMessage("");
        })
        .catch((error) => {
          if (!signal?.aborted) {
            setErrorMessage(getErrorMessage(error));
          }
        })
        .finally(() => {
          if (!signal?.aborted) {
            setLoading(false);
          }
        });
    },
    [keyword, page, roleFilter, statusFilter],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
    return () => controller.abort();
  }, [fetchUsers]);

  const users = useMemo(() => data?.content ?? [], [data]);
  const activeAdmins = useMemo(
    () => users.filter((item) => item.roles.includes("ADMIN") && item.status !== "LOCKED").length,
    [users],
  );

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setPage(0);
  };

  const handleFilterChange = (next: { status?: UserStatus | ""; role?: UserRole | "" }) => {
    if (next.status !== undefined) {
      setStatusFilter(next.status);
    }

    if (next.role !== undefined) {
      setRoleFilter(next.role);
    }

    setLoading(true);
    setPage(0);
  };

  const handlePageChange = (nextPage: number) => {
    setLoading(true);
    setPage(nextPage);
  };

  const handleOpenDetail = async (user: AdminUser) => {
    setDetailTarget(user);
    setDetailLoading(true);

    try {
      const freshUser = await getAdminUser(user.id);
      setDetailTarget(freshUser);
      updateCachedUser(freshUser);
    } catch (error) {
      toast(getErrorMessage(error), "error");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleConfirmLock = async () => {
    if (!lockTarget) {
      return;
    }

    const isLocking = lockTarget.status !== "LOCKED";
    setActionLoading(lockTarget.id);

    try {
      const updated = await updateUserStatus(lockTarget.id, {
        status: isLocking ? "LOCKED" : "ACTIVE",
        enabled: !isLocking,
        lockReason: isLocking ? lockReason.trim() : undefined,
      });

      updateCachedUser(updated);
      toast(
        isLocking
          ? `Đã khóa tài khoản "${lockTarget.fullName}".`
          : `Đã mở khóa tài khoản "${lockTarget.fullName}".`,
        "success",
      );
      setLockTarget(null);
      setLockReason("");
    } catch (error) {
      toast(getErrorMessage(error), "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenRoleDialog = (user: AdminUser) => {
    setRoleTarget(user);
    setNextRole(getPrimaryRole(user));
  };

  const handleConfirmRole = async () => {
    if (!roleTarget) {
      return;
    }

    setActionLoading(roleTarget.id);

    try {
      const updated = await updateUserRoles(roleTarget.id, [nextRole]);
      updateCachedUser(updated);
      toast(`Đã cập nhật vai trò cho "${roleTarget.fullName}".`, "success");
      setRoleTarget(null);
    } catch (error) {
      toast(getErrorMessage(error), "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmVerifyEmail = async () => {
    if (!verifyTarget) {
      return;
    }

    setActionLoading(verifyTarget.id);

    try {
      const updated = await verifyAdminUserEmail(verifyTarget.id);
      updateCachedUser(updated);
      toast(`Đã xác minh email "${verifyTarget.email}".`, "success");
      setVerifyTarget(null);
    } catch (error) {
      toast(getErrorMessage(error), "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = useCallback(() => {
    void searchAdminUsers({
      keyword: keyword || undefined,
      status: statusFilter,
      role: roleFilter,
      page: 0,
      size: 9999,
    })
      .then((response) => {
        exportCsv({
          filename: "homi-admin-users",
          headers: [
            "ID",
            "Họ tên",
            "Email",
            "SĐT",
            "Vai trò",
            "Provider",
            "Email verified",
            "Trạng thái",
            "Ngày tạo",
          ],
          rows: response.content.map((item) => [
            String(item.id),
            item.fullName,
            item.email,
            item.phone ?? "",
            item.roles.join(", "),
            providerLabel(item.authProvider),
            item.emailVerified ? "Đã xác minh" : "Chưa xác minh",
            userStatusMeta[item.status].label,
            formatDate(item.createdAt),
          ]),
        });
        toast("Đã xuất file CSV thành công.", "success");
      })
      .catch((error) => {
        toast(getErrorMessage(error), "error");
      });
  }, [keyword, roleFilter, statusFilter, toast]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="motion-panel animate-content-rise rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
              Quản trị
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-4xl">
              Quản lý người dùng
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-base sm:leading-8">
              Tìm kiếm, phân quyền, xác minh email và khóa/mở khóa tài khoản trong hệ thống Homi.
            </p>
          </div>
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

      <div className="grid gap-4 md:grid-cols-3">
        <UserMetric label="Tổng người dùng" value={String(data?.totalElements ?? 0)} />
        <UserMetric label="Admin đang hiển thị" value={String(activeAdmins)} />
        <UserMetric
          label="Chưa xác minh email"
          value={String(users.filter((item) => !item.emailVerified).length)}
        />
      </div>

      <div className="motion-panel rounded-[22px] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] sm:rounded-[28px] sm:p-5">
        <form
          onSubmit={handleSearch}
          className="motion-stagger grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto] lg:items-end"
        >
          <Input
            label="Tìm kiếm"
            placeholder="Tìm theo tên, email hoặc SĐT..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Select
            label="Trạng thái"
            options={statusFilterOptions}
            value={statusFilter}
            onChange={(event) =>
              handleFilterChange({ status: event.target.value as UserStatus | "" })
            }
          />
          <Select
            label="Vai trò"
            options={roleFilterOptions}
            value={roleFilter}
            onChange={(event) => handleFilterChange({ role: event.target.value as UserRole | "" })}
          />
          <Button className="w-full lg:w-auto" type="submit">
            Tìm kiếm
          </Button>
        </form>
      </div>

      {errorMessage ? (
        <Alert tone="warning" title="Lỗi tải dữ liệu" description={errorMessage} />
      ) : loading ? (
        <LoadingSkeleton className="h-96 rounded-[28px]" />
      ) : !data || users.length === 0 ? (
        <EmptyState
          title="Không tìm thấy người dùng"
          description="Thử thay đổi từ khóa, trạng thái hoặc vai trò để tìm kết quả khác."
        />
      ) : (
        <>
          <AdminTable
            headers={[
              "Họ tên",
              "Email",
              "SĐT",
              "Vai trò",
              "Xác minh",
              "Trạng thái",
              "Ngày tạo",
              "Hành động",
            ]}
            rows={users.map((item) => [
              <span key={`name-${item.id}`} className="font-medium text-[var(--color-text-strong)]">
                {item.fullName}
              </span>,
              item.email,
              item.phone ?? "-",
              <RoleBadges key={`roles-${item.id}`} roles={item.roles} />,
              <Badge key={`verified-${item.id}`} tone={item.emailVerified ? "success" : "warning"}>
                {item.emailVerified ? "Đã xác minh" : "Chưa xác minh"}
              </Badge>,
              <Badge key={`status-${item.id}`} tone={userStatusMeta[item.status].tone}>
                {userStatusMeta[item.status].label}
              </Badge>,
              formatDate(item.createdAt),
              <UserActions
                key={`actions-${item.id}`}
                user={item}
                currentUserId={currentUser?.id}
                loading={actionLoading === item.id}
                onView={() => void handleOpenDetail(item)}
                onOpenRole={() => handleOpenRoleDialog(item)}
                onOpenLock={() => {
                  setLockTarget(item);
                  setLockReason("");
                }}
                onVerifyEmail={() => setVerifyTarget(item)}
              />,
            ])}
          />

          <Pagination
            currentPage={page + 1}
            totalPages={data.totalPages}
            onPageChange={(nextPage) => handlePageChange(nextPage - 1)}
          />
        </>
      )}

      <UserDetailDialog
        user={detailTarget}
        loading={detailLoading}
        onClose={() => setDetailTarget(null)}
      />

      <LockUserDialog
        user={lockTarget}
        reason={lockReason}
        loading={actionLoading === lockTarget?.id}
        onReasonChange={setLockReason}
        onCancel={() => {
          setLockTarget(null);
          setLockReason("");
        }}
        onConfirm={() => void handleConfirmLock()}
      />

      <RoleDialog
        user={roleTarget}
        role={nextRole}
        loading={actionLoading === roleTarget?.id}
        onRoleChange={setNextRole}
        onCancel={() => setRoleTarget(null)}
        onConfirm={() => void handleConfirmRole()}
      />

      <ConfirmDialog
        open={verifyTarget !== null}
        title="Xác minh email"
        description={
          verifyTarget
            ? `Xác nhận email "${verifyTarget.email}" đã hợp lệ? Tài khoản chưa kích hoạt sẽ được chuyển sang trạng thái hoạt động.`
            : ""
        }
        confirmLabel="Xác minh"
        tone="brand"
        loading={actionLoading === verifyTarget?.id}
        onConfirm={() => void handleConfirmVerifyEmail()}
        onCancel={() => setVerifyTarget(null)}
      />
    </div>
  );
}

function UserMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="motion-panel rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
      <p className="text-sm font-medium text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[var(--color-text-strong)]">{value}</p>
    </div>
  );
}

function RoleBadges({ roles }: { roles: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((role) => (
        <Badge key={role} tone={role === "ADMIN" ? "brand" : "muted"}>
          {roleLabel(role)}
        </Badge>
      ))}
    </div>
  );
}

function UserActions({
  user,
  currentUserId,
  loading,
  onView,
  onOpenRole,
  onOpenLock,
  onVerifyEmail,
}: {
  user: AdminUser;
  currentUserId?: number;
  loading: boolean;
  onView: () => void;
  onOpenRole: () => void;
  onOpenLock: () => void;
  onVerifyEmail: () => void;
}) {
  const isSelf = user.id === currentUserId;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onView}
        leadingIcon={<Eye className="size-3.5" />}
      >
        Chi tiết
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={onOpenRole}
        leadingIcon={<UserCog className="size-3.5" />}
      >
        Quyền
      </Button>
      {!user.emailVerified ? (
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={onVerifyEmail}
          leadingIcon={<MailCheck className="size-3.5" />}
        >
          Xác minh
        </Button>
      ) : null}
      <Button
        variant="outline"
        size="sm"
        disabled={loading || isSelf}
        onClick={onOpenLock}
        leadingIcon={
          user.status === "LOCKED" ? (
            <Unlock className="size-3.5" />
          ) : (
            <Lock className="size-3.5" />
          )
        }
      >
        {user.status === "LOCKED" ? "Mở khóa" : "Khóa"}
      </Button>
    </div>
  );
}

function UserDetailDialog({
  user,
  loading,
  onClose,
}: {
  user: AdminUser | null;
  loading: boolean;
  onClose: () => void;
}) {
  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[var(--color-overlay-bg)] p-4 backdrop-blur-sm">
      <div className="motion-panel max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card-hover)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
              Hồ sơ người dùng
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text-strong)]">
              {user.fullName}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{user.email}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Đóng">
            <X className="size-5" />
          </Button>
        </div>

        {loading ? (
          <LoadingSkeleton className="mt-5 h-48 rounded-2xl" />
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <DetailItem label="Số điện thoại" value={user.phone ?? "Chưa cập nhật"} />
            <DetailItem label="Nguồn đăng nhập" value={providerLabel(user.authProvider)} />
            <DetailItem
              label="Email"
              value={user.emailVerified ? "Đã xác minh" : "Chưa xác minh"}
            />
            <DetailItem label="Trạng thái" value={userStatusMeta[user.status].label} />
            <DetailItem label="Vai trò" value={user.roles.map(roleLabel).join(", ")} />
            <DetailItem label="Ngày tạo" value={formatDate(user.createdAt)} />
            <DetailItem label="Cập nhật cuối" value={formatDate(user.updatedAt)} />
            <DetailItem label="Địa chỉ" value={user.address ?? "Chưa cập nhật"} />
            <div className="md:col-span-2">
              <DetailItem label="Giới thiệu chủ trọ" value={user.hostBio ?? "Chưa cập nhật"} />
            </div>
            {user.lockReason || user.lockedAt ? (
              <div className="md:col-span-2">
                <DetailItem
                  label="Thông tin khóa"
                  value={[
                    user.lockedAt ? `Thời điểm: ${formatDate(user.lockedAt)}` : "",
                    user.lockReason ? `Lý do: ${user.lockReason}` : "",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold leading-6 text-[var(--color-text-strong)]">
        {value}
      </p>
    </div>
  );
}

function LockUserDialog({
  user,
  reason,
  loading,
  onReasonChange,
  onCancel,
  onConfirm,
}: {
  user: AdminUser | null;
  reason: string;
  loading: boolean;
  onReasonChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!user) {
    return null;
  }

  const isLocking = user.status !== "LOCKED";

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[var(--color-overlay-bg)] p-4 backdrop-blur-sm">
      <div className="motion-panel w-full max-w-lg rounded-3xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card-hover)]">
        <div className="flex gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--alert-warning-bg)] text-[var(--alert-warning-text)]">
            {isLocking ? <Lock className="size-6" /> : <Unlock className="size-6" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-strong)]">
              {isLocking ? "Khóa tài khoản" : "Mở khóa tài khoản"}
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-[var(--color-text-muted)]">
              {isLocking
                ? `Tài khoản "${user.fullName}" sẽ không thể đăng nhập sau khi bị khóa.`
                : `Tài khoản "${user.fullName}" sẽ có thể đăng nhập trở lại.`}
            </p>
          </div>
        </div>

        {isLocking ? (
          <div className="mt-5">
            <Textarea
              label="Lý do khóa"
              placeholder="Ví dụ: tài khoản đăng tin sai sự thật nhiều lần..."
              value={reason}
              maxLength={300}
              onChange={(event) => onReasonChange(event.target.value)}
              hint={`${reason.length}/300 ký tự. Nội dung này chỉ hiển thị trong khu admin.`}
            />
          </div>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" disabled={loading} onClick={onCancel}>
            Hủy
          </Button>
          <Button disabled={loading} variant={isLocking ? "warm" : "primary"} onClick={onConfirm}>
            {loading ? "Đang xử lý..." : isLocking ? "Khóa tài khoản" : "Mở khóa"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function RoleDialog({
  user,
  role,
  loading,
  onRoleChange,
  onCancel,
  onConfirm,
}: {
  user: AdminUser | null;
  role: UserRole;
  loading: boolean;
  onRoleChange: (role: UserRole) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[var(--color-overlay-bg)] p-4 backdrop-blur-sm">
      <div className="motion-panel w-full max-w-lg rounded-3xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card-hover)]">
        <div className="flex gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)]">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-strong)]">
              Phân quyền người dùng
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-[var(--color-text-muted)]">
              Cập nhật vai trò cho <span className="font-semibold">{user.fullName}</span>. Thao tác hạ quyền admin cuối cùng sẽ bị chặn.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <Select
            label="Vai trò"
            options={roleOptions}
            value={role}
            onChange={(event) => onRoleChange(event.target.value as UserRole)}
          />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" disabled={loading} onClick={onCancel}>
            Hủy
          </Button>
          <Button disabled={loading} onClick={onConfirm}>
            {loading ? "Đang lưu..." : "Lưu vai trò"}
          </Button>
        </div>
      </div>
    </div>
  );
}
