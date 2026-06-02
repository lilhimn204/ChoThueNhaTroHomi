"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  ArrowUpRight,
  FileText,
  FolderTree,
  LayoutDashboard,
  LibraryBig,
  PanelLeft,
  Settings,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cmsNavigation } from "@/constants/site";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const cmsIcons = [LayoutDashboard, FileText, FolderTree, LibraryBig, Settings];

export function CmsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-[1680px] gap-5 px-4 py-5 lg:px-6 lg:py-7">
      <aside className="hidden w-[280px] shrink-0 xl:block">
        <CmsSidebar pathname={pathname} />
      </aside>

      <div className="min-w-0 flex-1 space-y-5">
        <header className="motion-panel animate-content-rise rounded-[26px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] lg:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="brand">CMS Homi</Badge>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Content workspace
                </span>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-3xl">
                Quản trị nội dung
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--color-text-muted)]">
                Không gian riêng cho bài viết, danh mục, media và quy trình xuất bản. Khu `/admin` hiện tại vẫn giữ nguyên cho vận hành hệ thống.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] px-4 py-2.5">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">Đang đăng nhập</p>
                <p className="max-w-44 truncate text-sm font-semibold text-[var(--color-text-strong)]">
                  {user?.fullName ?? "Admin Homi"}
                </p>
              </div>
              <Link href="/admin">
                <Button variant="outline" trailingIcon={<ArrowUpRight className="size-4" />}>
                  Về Admin
                </Button>
              </Link>
            </div>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 xl:hidden">
            {cmsNavigation.map((item, index) => {
              const Icon = cmsIcons[index];
              const active = item.href === "/cms" ? pathname === item.href : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "motion-soft inline-flex min-w-max items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-semibold",
                    active
                      ? "bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)]"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="animate-content-rise min-w-0">{children}</main>
      </div>
    </div>
  );
}

function CmsSidebar({ pathname }: { pathname: string | null }) {
  return (
    <div className="motion-panel sticky top-24 rounded-[30px] border border-white/10 bg-[var(--color-brand-950)] p-4 text-white shadow-[var(--shadow-card)] ring-1 ring-white/10 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[var(--shadow-card-hover)]">
      <div className="rounded-[24px] bg-white/10 p-4 ring-1 ring-white/10">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--color-inverse-surface)] text-[var(--color-inverse-text)] shadow-sm">
            <Archive className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Homi CMS
            </p>
            <h2 className="truncate text-lg font-semibold">Nội dung & xuất bản</h2>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/68">
          Quản lý bài viết song song với khu admin vận hành.
        </p>
      </div>

      <nav className="motion-stagger mt-5 space-y-1.5">
        {cmsNavigation.map((item, index) => {
          const Icon = cmsIcons[index];
          const active = item.href === "/cms" ? pathname === item.href : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "motion-pressable group flex items-start gap-3 rounded-[20px] px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 active:scale-[0.99]",
                active
                  ? "bg-white/20 text-white shadow-sm ring-1 ring-white/15"
                  : "text-white/72 hover:translate-x-1 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="motion-soft mt-0.5 size-4 shrink-0 group-hover:scale-110" />
              <span className="min-w-0">
                <span className="block font-semibold">{item.label}</span>
                <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-white/55">
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 rounded-[22px] border border-white/10 bg-black/10 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
          <PanelLeft className="size-3.5" />
          Trạng thái
        </div>
        <p className="mt-2 text-sm leading-6 text-white/72">
          Giai đoạn 1 đang dựng khung CMS. CRUD nội dung sẽ chuyển dần ở các giai đoạn sau.
        </p>
      </div>
    </div>
  );
}
