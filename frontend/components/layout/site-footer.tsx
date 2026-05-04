"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

import { publicNavigation, siteConfig, supportNavigation } from "@/constants/site";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  const quickLinks = [
    ...publicNavigation,
    { label: "Tin tức", href: "/news" },
  ];
  const supportLinks = supportNavigation.filter((item) =>
    ["Câu hỏi thường gặp", "Liên hệ Homi", "Chính sách bảo mật", "Điều khoản sử dụng"].includes(item.label),
  );

  return (
    <footer className="mt-16 border-t border-[var(--color-footer-border)] bg-[var(--color-footer-bg)] backdrop-blur">
      <div className="h-1 bg-gradient-to-r from-[var(--color-brand-700)] via-[var(--color-accent-500)] to-[var(--color-brand-700)]" />
      <div className="container-shell grid gap-8 py-10 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Homi logo"
              width={44}
              height={44}
              className="rounded-2xl"
            />
            <div>
              <p className="font-heading text-lg font-semibold">{siteConfig.name}</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Tìm phòng trọ Hà Nội rõ ràng và dễ liên hệ.
              </p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[var(--color-text-muted)]">
            Homi giúp người thuê lọc phòng theo khu vực, ngân sách, diện tích và
            tiện ích. Thông tin được trình bày gọn để bạn so sánh và liên hệ nhanh.
          </p>
          <div className="space-y-2 text-sm text-[var(--color-text-muted)]">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-700)]" />
              76 Minh Khai, Hai Bà Trưng, Hà Nội
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle className="size-4 text-[var(--color-brand-700)]" />
              Hỗ trợ người thuê và người đăng tin
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
            Liên kết nhanh
          </h3>
          <div className="grid gap-3 text-sm">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="motion-soft w-fit text-[var(--color-text-muted)] hover:translate-x-1 hover:text-[var(--color-text-strong)]"
            >
              {item.label}
            </Link>
          ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
            Hỗ trợ
          </h3>
          <div className="grid gap-3 text-sm">
            {supportLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="motion-soft w-fit text-[var(--color-text-muted)] hover:translate-x-1 hover:text-[var(--color-text-strong)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
            Liên hệ
          </h3>
          <div className="space-y-2 text-sm text-[var(--color-text-muted)]">
            <p className="flex items-center gap-2">
              <Mail className="size-4 text-[var(--color-brand-700)]" />
              support@homi.local
            </p>
            <p className="flex items-center gap-2">
              <Phone className="size-4 text-[var(--color-brand-700)]" />
              0900 000 000
            </p>
          </div>
          <form
            className="shine-surface grid gap-2 rounded-[22px] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-3 shadow-sm"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="text-sm font-semibold text-[var(--color-text-strong)]">
              Nhận tin phòng mới
            </label>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                type="email"
                placeholder="email@example.com"
                className="h-11 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-input-bg)] px-3 text-sm outline-none focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-focus-ring)]"
              />
              <Button type="submit" size="sm" aria-label="Đăng ký nhận tin" leadingIcon={<Send className="size-4" />}>
                Gửi
              </Button>
            </div>
          </form>
        </section>
      </div>

      <div className="border-t border-[var(--color-footer-border)]">
        <div className="container-shell flex flex-col gap-3 py-5 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © Đào Công Minh. Made with ♥ by Đào Công Minh.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="motion-pressable inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2 font-semibold text-[var(--color-text-strong)] shadow-sm hover:-translate-y-0.5 hover:border-[var(--color-brand-500)]"
          >
            <ArrowUp className="size-4" />
            Lên đầu trang
          </button>
        </div>
      </div>
    </footer>
  );
}
