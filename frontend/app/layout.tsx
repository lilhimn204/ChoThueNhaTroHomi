import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thuenhahomi.id.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Homi | Website cho thuê phòng trọ Hà Nội",
    template: "%s | Homi",
  },
  description:
    "Nền tảng tìm kiếm và quản lý phòng trọ tại Hà Nội. Lọc theo quận, giá thuê, diện tích và tiện ích. Gửi yêu cầu xem phòng trực tuyến.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "1254x1254" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "Homi",
    title: "Homi | Website cho thuê phòng trọ Hà Nội",
    description:
      "Tìm phòng trọ Hà Nội nhanh gọn, rõ ràng. Lọc theo khu vực, mức giá và tiện ích.",
    images: [
      {
        url: "/og-image.png",
        width: 1254,
        height: 1254,
        alt: "Homi - Website cho thuê phòng trọ Hà Nội",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Homi | Website cho thuê phòng trọ Hà Nội",
    description:
      "Tìm phòng trọ Hà Nội nhanh gọn, rõ ràng. Lọc theo khu vực, mức giá và tiện ích.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body
        className="min-h-full bg-[var(--color-background)] text-[var(--color-text-strong)]"
        suppressHydrationWarning
      >
        <AppProviders>
          <div className="relative flex min-h-screen flex-col overflow-x-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,_var(--gradient-hero-1),_transparent_45%),radial-gradient(circle_at_top_right,_var(--gradient-hero-2),_transparent_35%)]" />
            <SiteHeader />
            <main className="relative flex-1">{children}</main>
            <SiteFooter />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
