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
        <div className="container-shell grid gap-8 py-12 xl:grid-cols-[0.72fr_1.28fr]">
          <LoadingSkeleton className="h-80 rounded-[32px]" />
          <LoadingSkeleton className="h-[32rem] rounded-[32px]" />
        </div>
      ) : (
        <div className="container-shell grid gap-8 py-12 xl:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[32px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
            <div className="relative mx-auto size-28 overflow-hidden rounded-full border-4 border-[var(--color-brand-50)]">
              <Image
                src={normalizeUploadImageSrc(
                  user.avatarUrl
                    || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
                )}
                alt={user.fullName}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
            <div className="mt-5 text-center">
              <h2 className="text-2xl font-semibold text-[var(--color-text-strong)]">
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

          <div className="space-y-6">
            <ProfileForm key={user.id} profile={user} />
            <PasswordChangeForm />
          </div>
        </div>
      )}
    </RequireAuth>
  );
}
