"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, Search, UserCircle, X } from "lucide-react";
import { useEffect, useState, type FocusEvent, type MouseEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/layout/notification-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  accountNavigation,
  headerNavigation,
  siteConfig,
  type HeaderNavigationItem,
  type NavigationLink,
} from "@/constants/site";
import { useAuth } from "@/hooks/use-auth";
import { useDelayedPresence } from "@/hooks/use-delayed-presence";
import { cn } from "@/lib/utils";

function getHrefPathname(href: string) {
  if (!href || href === "#") {
    return href;
  }

  try {
    return new URL(href, "https://homi.local").pathname;
  } catch {
    return href.split("?")[0] ?? href;
  }
}

function DesktopDropdownLink({
  item,
  onPlaceholderClick,
  onNavigate,
}: {
  item: NavigationLink;
  onPlaceholderClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  onNavigate: () => void;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (item.isPlaceholder) {
      onPlaceholderClick(event);
      return;
    }

    onNavigate();
  };

  return (
    <Link
      role="menuitem"
      href={item.href}
      className="motion-soft group/item block rounded-2xl px-4 py-3 text-left hover:bg-[var(--color-surface-soft)] focus-visible:bg-[var(--color-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
      onClick={handleClick}
    >
      <span className="block text-sm font-semibold text-[var(--color-text-strong)] group-hover/item:text-[var(--color-brand-700)]">
        {item.label}
      </span>
      {item.description ? (
        <span className="mt-1 block text-xs leading-5 text-[var(--color-text-muted)]">
          {item.description}
        </span>
      ) : null}
    </Link>
  );
}

function DesktopNavItem({
  item,
  active,
  onPlaceholderClick,
}: {
  item: HeaderNavigationItem;
  active: boolean;
  onPlaceholderClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const hasDropdown = Boolean(item.children?.length);
  const [open, setOpen] = useState(false);
  const [suppressed, setSuppressed] = useState(false);

  const openDropdown = () => {
    if (!suppressed) {
      setOpen(true);
    }
  };

  const resetDropdown = () => {
    setOpen(false);
    setSuppressed(false);
  };

  const handleDropdownNavigate = () => {
    setOpen(false);
    setSuppressed(true);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      resetDropdown();
    }
  };

  const triggerClassName = cn(
    "motion-soft relative inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium after:absolute after:inset-x-4 after:-bottom-1 after:h-0.5 after:origin-center after:rounded-full after:bg-[var(--color-brand-700)] after:transition-transform after:duration-200 after:ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
    active
      ? "bg-[var(--color-brand-50)] text-[var(--color-brand-800)] shadow-sm after:scale-x-100"
      : "text-[var(--color-text-muted)] after:scale-x-0 hover:-translate-y-0.5 hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)] hover:after:scale-x-100",
  );

  if (!hasDropdown) {
    return (
      <Link
        href={item.href}
        className={triggerClassName}
        onClick={item.isPlaceholder ? onPlaceholderClick : undefined}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={openDropdown}
      onMouseLeave={resetDropdown}
      onFocus={openDropdown}
      onBlur={handleBlur}
    >
      <Link
        href={item.href}
        className={triggerClassName}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={item.isPlaceholder ? onPlaceholderClick : undefined}
      >
        <span>{item.label}</span>
        <ChevronDown
          className={cn("motion-soft size-4", open && "rotate-180")}
          aria-hidden="true"
        />
      </Link>

      <div
        className={cn(
          "absolute left-1/2 top-full z-50 w-[min(24rem,calc(100vw_-_2rem))] -translate-x-1/2 pt-3 transition duration-200 ease-out",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-2 opacity-0",
        )}
        role="menu"
      >
        <div className="motion-panel rounded-[22px] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-2 shadow-xl ring-1 ring-[var(--color-border-soft)]">
          {item.description ? (
            <div className="border-b border-[var(--color-border-soft)] px-4 py-3">
              <p className="text-sm font-semibold text-[var(--color-text-strong)]">
                {item.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                {item.description}
              </p>
            </div>
          ) : null}
          <div className="grid gap-1 py-2">
            {item.children?.map((child) => (
              <DesktopDropdownLink
                key={`${item.label}-${child.label}`}
                item={child}
                onPlaceholderClick={onPlaceholderClick}
                onNavigate={handleDropdownNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNavLink({
  item,
  active,
  onNavigate,
  onPlaceholderClick,
}: {
  item: NavigationLink;
  active: boolean;
  onNavigate: () => void;
  onPlaceholderClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (item.isPlaceholder) {
      onPlaceholderClick(event);
      return;
    }

    onNavigate();
  };

  return (
    <Link
      href={item.href}
      className={cn(
        "motion-soft block min-h-11 rounded-2xl px-4 py-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]",
        active
          ? "bg-[var(--color-brand-50)] text-[var(--color-brand-800)] shadow-sm"
          : "text-[var(--color-text-muted)] hover:translate-x-1 hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]",
      )}
      onClick={handleClick}
    >
      <span className="flex items-center justify-between gap-3 font-semibold">
        <span>{item.label}</span>
        {item.isPlaceholder ? (
          <span className="rounded-full bg-[var(--color-surface-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-text-muted)]">
            Sắp có
          </span>
        ) : null}
      </span>
      {item.description ? (
        <span className="mt-1 block text-xs leading-5 text-[var(--color-text-muted)]">
          {item.description}
        </span>
      ) : null}
    </Link>
  );
}

function MobileAccordionGroup({
  id,
  label,
  description,
  open,
  active,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  description?: string;
  open: boolean;
  active?: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-[var(--color-border-soft)] bg-[var(--color-surface)] shadow-sm">
      <button
        type="button"
        className={cn(
          "motion-pressable flex min-h-11 w-full items-center justify-between gap-3 rounded-[22px] px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]",
          active || open
            ? "text-[var(--color-brand-800)]"
            : "text-[var(--color-text-strong)]",
        )}
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold">{label}</span>
          {description ? (
            <span className="mt-1 block text-xs leading-5 text-[var(--color-text-muted)]">
              {description}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={cn("motion-soft size-4 shrink-0", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          id={id}
          className="animate-fade-in grid gap-1 border-t border-[var(--color-border-soft)] p-2"
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpandedSections, setMobileExpandedSections] = useState<
    Record<string, boolean>
  >({
    "Tìm phòng": true,
    "Tài khoản": true,
  });
  const { present: mobileMenuPresent, leaving: mobileMenuLeaving } =
    useDelayedPresence(mobileOpen);
  const { status, user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href.includes("?")) {
      return false;
    }

    const hrefPathname = getHrefPathname(href);

    if (!hrefPathname || hrefPathname === "#") {
      return false;
    }

    return hrefPathname === "/"
      ? pathname === hrefPathname
      : pathname?.startsWith(hrefPathname);
  };

  const isNavItemActive = (item: HeaderNavigationItem) =>
    isActive(item.href) || Boolean(item.children?.some((child) => isActive(child.href)));

  const isAuthenticated = status === "authenticated" && user;
  const isAdmin = user?.roles.includes("ADMIN");
  const hostHref = isAuthenticated
    ? "/host/dashboard"
    : "/login?redirect=%2Fhost%2Fdashboard";
  const mobileMenuId = "site-mobile-navigation";
  const authenticatedAccountLinks: NavigationLink[] = [
    {
      label: "Hồ sơ",
      href: "/profile",
      description: "Cập nhật thông tin cá nhân và ảnh đại diện.",
    },
    {
      label: "Phòng đã lưu",
      href: "/saved-rooms",
      description: "Xem lại các phòng bạn đã lưu để so sánh sau.",
    },
    {
      label: "Lịch sử liên hệ",
      href: "/contact-history",
      description: "Theo dõi yêu cầu liên hệ và lịch hẹn xem phòng đã gửi.",
    },
    ...(isAdmin
      ? [
          {
            label: "Khu quản trị",
            href: "/admin",
            description: "Quản lý phòng, báo cáo và người dùng.",
          },
        ]
      : []),
  ];

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    router.push("/");
  };

  const handlePlaceholderClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  const toggleMobileSection = (section: string) => {
    setMobileExpandedSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  useEffect(() => {
    if (!mobileMenuPresent) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuPresent]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
      className={cn(
        "sticky top-0 z-50 border-b border-[var(--color-header-border)] bg-[var(--color-header-bg)] pt-[env(safe-area-inset-top)] backdrop-blur-xl transition-[box-shadow,background-color] duration-300",
        scrolled ? "shadow-[var(--shadow-card)]" : "shadow-sm",
      )}
    >
      <div
        className={cn(
          "container-shell flex items-center justify-between gap-3 transition-[height] duration-300 sm:gap-6",
          scrolled ? "h-14 sm:h-16" : "h-16 sm:h-18",
        )}
      >
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <Image
            src="/logo.png"
            alt="Homi logo"
            width={44}
            height={44}
            className={cn(
              "shrink-0 rounded-2xl shadow-[var(--shadow-card)] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_28px_color-mix(in_srgb,var(--color-brand-500)_34%,transparent)]",
              scrolled ? "size-10" : "size-11",
            )}
          />
          <div className="min-w-0">
            <p className="truncate font-heading text-lg font-semibold text-[var(--color-text-strong)]">
              {siteConfig.name}
            </p>
            <p className="hidden text-xs text-[var(--color-text-muted)] sm:block">
              Tìm phòng Hà Nội
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {headerNavigation.map((item) => (
            <DesktopNavItem
              key={item.label}
              item={item}
              active={isNavItemActive(item)}
              onPlaceholderClick={handlePlaceholderClick}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/rooms"
            aria-label="Tìm kiếm nhanh"
            className="motion-pressable inline-flex size-11 items-center justify-center rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] text-[var(--color-text-muted)] shadow-sm hover:-translate-y-0.5 hover:border-[var(--color-brand-500)] hover:text-[var(--color-brand-700)] hover:shadow-[var(--shadow-card)]"
          >
            <Search className="size-[18px]" />
          </Link>
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
              className={cn(
                "motion-soft inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-semibold",
                isActive("/admin")
                  ? "bg-[var(--color-brand-50)] text-[var(--color-brand-800)] shadow-sm ring-1 ring-[var(--color-border-soft)]"
                  : "text-[var(--color-text-muted)] hover:-translate-y-0.5 hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]",
              )}
            >
              Khu quản trị
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
          aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={mobileOpen}
          aria-controls={mobileMenuId}
          className="motion-pressable inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] text-[var(--color-text-strong)] shadow-sm hover:-translate-y-0.5 hover:border-[var(--color-brand-500)] hover:shadow-[var(--shadow-card)] active:scale-[0.98] xl:hidden"
          onClick={() => setMobileOpen((current) => !current)}
        >
          {mobileOpen || mobileMenuPresent ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>
      </header>

      {mobileMenuPresent ? (
        <div
          className={cn(
            "fixed inset-0 z-[80] bg-[var(--color-overlay-bg)] backdrop-blur-sm xl:hidden",
            mobileMenuLeaving
              ? "pointer-events-none animate-overlay-out"
              : "animate-overlay-in",
          )}
          onClick={closeMobileMenu}
        >
          <div
            id={mobileMenuId}
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng Homi"
            className={cn(
              "absolute inset-y-0 right-0 flex h-[100dvh] w-full max-w-md flex-col overflow-hidden border-l border-[var(--color-border-soft)] bg-[var(--color-background)] shadow-[var(--shadow-drawer)]",
              mobileMenuLeaving ? "animate-drawer-right-out" : "animate-drawer-right-in",
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border-soft)] px-4 py-3 pt-[calc(0.75rem_+_env(safe-area-inset-top))]">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)]">
                  <UserCircle className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-text-strong)]">
                    {isAuthenticated ? user.fullName : "Khách Homi"}
                  </p>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">
                    {isAuthenticated ? user.email : "Đăng nhập để lưu phòng và theo dõi liên hệ"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Đóng menu"
                onClick={closeMobileMenu}
                className="motion-pressable inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] text-[var(--color-text-strong)] shadow-sm"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 pb-4 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">Giao diện</p>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <NotificationBell />
              </div>
            </div>

            <Link href={hostHref} onClick={closeMobileMenu}>
              <Button className="w-full" variant="warm">
                Đăng tin
              </Button>
            </Link>

            <nav aria-label="Menu chính" className="motion-stagger grid gap-2">
              {headerNavigation.map((item, index) =>
                item.children?.length ? (
                  <MobileAccordionGroup
                    key={item.label}
                    id={`mobile-nav-group-${index}`}
                    label={item.label}
                    description={item.description}
                    open={Boolean(mobileExpandedSections[item.label])}
                    active={isNavItemActive(item)}
                    onToggle={() => toggleMobileSection(item.label)}
                  >
                    {item.children.map((child) => (
                      <MobileNavLink
                        key={`${item.label}-${child.label}`}
                        item={child}
                        active={isActive(child.href)}
                        onNavigate={closeMobileMenu}
                        onPlaceholderClick={handlePlaceholderClick}
                      />
                    ))}
                  </MobileAccordionGroup>
                ) : (
                  <MobileNavLink
                    key={item.label}
                    item={item}
                    active={isActive(item.href)}
                    onNavigate={closeMobileMenu}
                    onPlaceholderClick={handlePlaceholderClick}
                  />
                ),
              )}
            </nav>

            <div className="grid gap-2">
              <MobileAccordionGroup
                id="mobile-nav-account"
                label="Tài khoản"
                description={
                  isAuthenticated
                    ? "Quản lý hồ sơ và phiên đăng nhập."
                    : "Đăng nhập hoặc tạo tài khoản Homi."
                }
                open={Boolean(mobileExpandedSections["Tài khoản"])}
                active={
                  isActive("/profile") ||
                  isActive("/saved-rooms") ||
                  isActive("/contact-history") ||
                  isActive("/admin")
                }
                onToggle={() => toggleMobileSection("Tài khoản")}
              >
                {isAuthenticated ? (
                  <>
                    {authenticatedAccountLinks.map((item) => (
                      <MobileNavLink
                        key={item.href}
                        item={item}
                        active={isActive(item.href)}
                        onNavigate={closeMobileMenu}
                        onPlaceholderClick={handlePlaceholderClick}
                      />
                    ))}
                    <button
                      type="button"
                      className="motion-soft rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-muted)] hover:translate-x-1 hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  accountNavigation.map((item) => (
                    <MobileNavLink
                      key={item.href}
                      item={{
                        ...item,
                        description:
                          item.href === "/login"
                            ? "Tiếp tục với email, mật khẩu hoặc Google."
                            : "Tạo tài khoản mới và xác minh email bằng OTP.",
                      }}
                      active={isActive(item.href)}
                      onNavigate={closeMobileMenu}
                      onPlaceholderClick={handlePlaceholderClick}
                    />
                  ))
                )}
              </MobileAccordionGroup>
            </div>
            </div>

            <div className="shrink-0 border-t border-[var(--color-border-soft)] bg-[var(--color-surface)]/95 px-4 pb-[calc(1rem_+_env(safe-area-inset-bottom))] pt-3 backdrop-blur">
              {isAuthenticated ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/profile" onClick={closeMobileMenu}>
                    <Button className="w-full" variant="outline">
                      Hồ sơ
                    </Button>
                  </Link>
                  <Button className="w-full" variant="primary" onClick={handleLogout}>
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={closeMobileMenu}>
                    <Button className="w-full" variant="outline">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/register" onClick={closeMobileMenu}>
                    <Button className="w-full">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
