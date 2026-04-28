import Link from "next/link";
import Image from "next/image";
import { publicNavigation, siteConfig } from "@/constants/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--color-footer-border)] bg-[var(--color-footer-bg)] backdrop-blur">
      <div className="container-shell grid gap-10 py-10 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
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
          <div className="space-y-1 text-sm text-[var(--color-text-muted)]">
            <p>Địa chỉ: 76 Minh Khai, Hai Bà Trưng, Hà Nội</p>
            <p>Bản quyền © Đào Công Minh</p>
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
