"use client";

import Image from "next/image";

import { RequireAuth } from "@/components/auth/require-auth";
import { PasswordChangeForm } from "@/components/forms/password-change-form";
import { ProfileForm } from "@/components/forms/profile-form";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/format";
import { normalizeUploadImageSrc } from "@/lib/images";

export function ProfilePageClient() {
  const { status, user } = useAuth();

  return (
    <RequireAuth>
      {status === "loading" || !user ? (
        <div className="container-shell grid gap-5 py-8 sm:gap-8 sm:py-12 xl:grid-cols-[0.72fr_1.28fr]">
          <LoadingSkeleton className="h-64 rounded-[24px] sm:h-80 sm:rounded-[32px]" />
          <LoadingSkeleton className="h-[28rem] rounded-[24px] sm:h-[32rem] sm:rounded-[32px]" />
        </div>
      ) : (
        <div className="container-shell grid gap-5 py-8 sm:gap-8 sm:py-12 xl:grid-cols-[0.72fr_1.28fr]">
          <aside className="motion-panel animate-content-rise rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
            <div className="group relative mx-auto size-28 overflow-hidden rounded-full border-4 border-[var(--color-brand-50)]">
              <Image
                src={normalizeUploadImageSrc(
                  user.avatarUrl
                    || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
                )}
                alt={user.fullName}
                fill
                className="motion-soft object-cover group-hover:scale-[1.04]"
                sizes="112px"
              />
            </div>
            <div className="mt-5 text-center">
              <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
                {user.fullName}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{user.email}</p>
              <div className="mt-4 flex justify-center gap-2">
                {user.roles.map((role) => (
                  <Badge key={role} tone="brand">
                    {role}
                  </Badge>
                ))}
              </div>
              {user.createdAt ? (
                <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                  Tham gia từ {formatDate(user.createdAt)}
                </p>
              ) : null}
            </div>
          </aside>

          <div className="motion-stagger min-w-0 space-y-5 sm:space-y-6">
            <ProfileForm key={user.id} profile={user} />
            <PasswordChangeForm />
          </div>
        </div>
      )}
    </RequireAuth>
  );
}
