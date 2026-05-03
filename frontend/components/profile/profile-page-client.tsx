"use client";

import Image from "next/image";
import { useState } from "react";
import { CalendarDays, KeyRound, Mail, Settings, UserRound } from "lucide-react";

import { RequireAuth } from "@/components/auth/require-auth";
import { ProfileForm } from "@/components/forms/profile-form";
import { AccountSettingsPanel } from "@/components/profile/account-settings-panel";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/format";
import { normalizeUploadImageSrc } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";

type ProfileTab = "info" | "account";

const tabs: Array<{
  id: ProfileTab;
  label: string;
  description: string;
  icon: typeof UserRound;
}> = [
  {
    id: "info",
    label: "Chỉnh sửa thông tin",
    description: "Họ tên, số điện thoại, email và ảnh đại diện.",
    icon: UserRound,
  },
  {
    id: "account",
    label: "Cài đặt tài khoản",
    description: "Mật khẩu, bảo mật và trạng thái đăng nhập.",
    icon: Settings,
  },
];

function getAvatarInitial(name: string) {
  const trimmedName = name.trim();
  return (trimmedName.charAt(0) || "H").toUpperCase();
}

function ProfileAvatar({
  user,
  sizeClassName = "size-28",
}: {
  user: UserProfile;
  sizeClassName?: string;
}) {
  const avatarUrl = user.avatarUrl?.trim();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border-4 border-[var(--color-brand-50)] bg-[var(--color-brand-50)] shadow-[var(--shadow-card)]",
        sizeClassName,
      )}
    >
      {avatarUrl ? (
        <Image
          src={normalizeUploadImageSrc(avatarUrl)}
          alt="Ảnh đại diện"
          fill
          className="motion-soft object-cover hover:scale-[1.04]"
          sizes="112px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[var(--color-brand-800)] text-3xl font-semibold text-white">
          {getAvatarInitial(user.fullName)}
        </div>
      )}
    </div>
  );
}

export function ProfilePageClient() {
  const { status, user } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");

  return (
    <RequireAuth>
      {status === "loading" || !user ? (
        <div className="container-shell grid gap-5 py-8 sm:gap-8 sm:py-12 xl:grid-cols-[0.72fr_1.28fr]">
          <LoadingSkeleton className="h-64 rounded-[24px] sm:h-80 sm:rounded-[32px]" />
          <LoadingSkeleton className="h-[28rem] rounded-[24px] sm:h-[32rem] sm:rounded-[32px]" />
        </div>
      ) : (
        <div className="container-shell grid gap-5 py-8 sm:gap-8 sm:py-12 xl:grid-cols-[0.72fr_1.28fr]">
          <aside className="motion-panel animate-content-rise rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:rounded-[32px] sm:p-6 xl:sticky xl:top-28 xl:self-start">
            <div className="flex justify-center">
              <ProfileAvatar user={user} />
            </div>

            <div className="mt-5 text-center">
              <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
                {user.fullName}
              </h2>
              <p className="mt-2 break-all text-sm text-[var(--color-text-muted)]">{user.email}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {user.roles.map((role) => (
                  <Badge key={role} tone="brand">
                    {role}
                  </Badge>
                ))}
                {user.authProvider === "GOOGLE" ? (
                  <Badge tone="muted">Google</Badge>
                ) : null}
              </div>

              <div className="mt-5 space-y-3 rounded-[22px] border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] p-4 text-left">
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                  <Mail className="size-4 shrink-0 text-[var(--color-brand-700)]" />
                  <span className="min-w-0 truncate">{user.email}</span>
                </div>
                {user.createdAt ? (
                  <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                    <CalendarDays className="size-4 shrink-0 text-[var(--color-brand-700)]" />
                    <span>Tham gia từ {formatDate(user.createdAt)}</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                  <KeyRound className="size-4 shrink-0 text-[var(--color-brand-700)]" />
                  <span>
                    {user.passwordConfigured ? "Đã có mật khẩu đăng nhập" : "Chưa tạo mật khẩu"}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <main className="min-w-0 space-y-5 sm:space-y-6">
            <section className="motion-panel animate-content-rise rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-card)] sm:rounded-[32px] sm:p-4">
              <div
                className="grid gap-2 sm:grid-cols-2"
                role="tablist"
                aria-label="Hồ sơ cá nhân"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const selected = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      className={cn(
                        "motion-pressable rounded-[22px] px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]",
                        selected
                          ? "bg-[var(--color-brand-50)] text-[var(--color-brand-800)] shadow-sm ring-1 ring-[var(--color-border-soft)]"
                          : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]",
                      )}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-2xl",
                            selected
                              ? "bg-white/70 text-[var(--color-brand-800)]"
                              : "bg-[var(--color-surface-soft)] text-[var(--color-brand-700)]",
                          )}
                        >
                          <Icon className="size-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold sm:text-base">
                            {tab.label}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-[var(--color-text-muted)]">
                            {tab.description}
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <div role="tabpanel" aria-label={activeTab === "info" ? "Chỉnh sửa thông tin" : "Cài đặt tài khoản"}>
              {activeTab === "info" ? (
                <ProfileForm key={user.id} profile={user} />
              ) : (
                <AccountSettingsPanel user={user} />
              )}
            </div>
          </main>
        </div>
      )}
    </RequireAuth>
  );
}
