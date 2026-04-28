"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/layout/notification-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { accountNavigation, publicNavigation, siteConfig } from "@/constants/site";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { status, user, logout } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname?.startsWith(href);

  const isAuthenticated = status === "authenticated" && user;
  const isAdmin = user?.roles.includes("ADMIN");
  const hostHref = isAuthenticated
    ? "/host/dashboard"
    : "/login?redirect=%2Fhost%2Fdashboard";

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-header-border)] bg-[var(--color-header-bg)] shadow-sm backdrop-blur-xl transition-shadow duration-300">
      <div className="container-shell flex h-18 items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Homi logo"
            width={44}
            height={44}
            className="rounded-2xl shadow-[var(--shadow-card)] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-card-hover)]"
          />
          <div>
            <p className="font-heading text-lg font-semibold text-[var(--color-text-strong)]">
              {siteConfig.name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Tìm phòng Hà Nội
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 after:absolute after:inset-x-4 after:-bottom-1 after:h-0.5 after:origin-center after:rounded-full after:bg-[var(--color-brand-700)] after:transition-transform after:duration-200",
                isActive(item.href)
                  ? "bg-[var(--color-brand-50)] text-[var(--color-brand-800)] shadow-sm after:scale-x-100"
                  : "text-[var(--color-text-muted)] after:scale-x-0 hover:-translate-y-0.5 hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)] hover:after:scale-x-100",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <NotificationBell />

          <Link href={hostHref}>
            <Button variant="warm" size="sm">
              Đăng tin
            </Button>
          </Link>

          {isAdmin ? (
            <Link
              href="/admin"
              className="rounded-full px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:-translate-y-0.5 hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]"
            >
              Khu admin
            </Link>
          ) : null}

          {isAuthenticated ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  {user.fullName.split(" ").at(-1) ?? "Tài khoản"}
                </Button>
              </Link>
              <Button variant="primary" size="sm" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            accountNavigation.map((item, index) => (
              <Link key={item.href} href={item.href}>
                <Button variant={index === 0 ? "ghost" : "primary"} size="sm">
                  {item.label}
                </Button>
              </Link>
            ))
          )}
        </div>

        <button
          type="button"
          aria-label="Mở menu"
          className="inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] text-[var(--color-text-strong)] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-brand-500)] hover:shadow-[var(--shadow-card)] active:scale-[0.98] lg:hidden"
          onClick={() => setMobileOpen((current) => !current)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="animate-slide-up border-t border-[var(--color-border-soft)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] lg:hidden">
          <div className="container-shell flex flex-col gap-2 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">Giao diện</p>
              <ThemeToggle />
            </div>

            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-[var(--color-brand-50)] text-[var(--color-brand-800)] shadow-sm"
                    : "text-[var(--color-text-muted)] hover:translate-x-1 hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]",
                )}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Link href={hostHref} onClick={() => setMobileOpen(false)}>
                <Button className="w-full" variant="warm">
                  Đăng tin
                </Button>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link href="/profile" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" variant="outline">
                      Hồ sơ
                    </Button>
                  </Link>
                  <Button className="w-full" onClick={handleLogout}>
                    Đăng xuất
                  </Button>
                </>
              ) : (
                accountNavigation.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button className="w-full" variant={index === 0 ? "outline" : "primary"}>
                      {item.label}
                    </Button>
                  </Link>
                ))
              )}
            </div>
            {isAdmin ? (
              <Link
                href="/admin"
                className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] transition-all duration-200 hover:translate-x-1 hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]"
                onClick={() => setMobileOpen(false)}
              >
                Khu admin
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
