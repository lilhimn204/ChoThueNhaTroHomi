import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  BookmarkCheck,
  CalendarCheck,
  CheckCircle2,
  MailCheck,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import { AuthReveal, AuthStagger, AuthStaggerItem } from "@/components/forms/auth-motion";

type AuthIntroMode = "login" | "register";

interface AuthIntroNote {
  icon: LucideIcon;
  label: string;
  desktopOnly?: boolean;
}

interface AuthIntroContent {
  eyebrow: string;
  summary: string;
  headline: string;
  description: string;
  notes: AuthIntroNote[];
  highlightTitle: string;
  highlightDescription: string;
}

const authIntroContent: Record<AuthIntroMode, AuthIntroContent> = {
  login: {
    eyebrow: "Tài khoản Homi",
    summary: "Quay lại danh sách phòng bạn quan tâm",
    headline: "Tiếp tục tìm nơi ở phù hợp.",
    description:
      "Đăng nhập để xem lại phòng đã lưu, theo dõi yêu cầu liên hệ và quản lý thông tin cá nhân thuận tiện hơn.",
    notes: [
      { icon: BookmarkCheck, label: "Xem lại các phòng đã lưu để so sánh nhanh." },
      { icon: CalendarCheck, label: "Theo dõi yêu cầu liên hệ và lịch hẹn xem phòng." },
      {
        icon: UserRoundCheck,
        label: "Cập nhật hồ sơ để chủ trọ phản hồi thuận tiện hơn.",
        desktopOnly: true,
      },
    ],
    highlightTitle: "Mọi lựa chọn trong một tài khoản",
    highlightDescription:
      "Phòng đã lưu và lịch sử liên hệ được sắp xếp rõ ràng để bạn tiếp tục tìm kiếm bất cứ lúc nào.",
  },
  register: {
    eyebrow: "Bắt đầu với Homi",
    summary: "Tạo tài khoản trong vài bước",
    headline: "Lưu lại lựa chọn phù hợp ngay từ lần đầu tìm kiếm.",
    description:
      "Tạo tài khoản để lưu phòng, gửi yêu cầu liên hệ và theo dõi phản hồi thuận tiện hơn.",
    notes: [
      { icon: MailCheck, label: "Xác minh email bằng OTP để hoàn tất đăng ký." },
      { icon: BookmarkCheck, label: "Lưu các phòng phù hợp để quay lại so sánh." },
      {
        icon: ShieldCheck,
        label: "Theo dõi yêu cầu liên hệ tại một nơi.",
        desktopOnly: true,
      },
    ],
    highlightTitle: "Tạo hồ sơ một lần, dùng lâu dài",
    highlightDescription:
      "Thông tin cơ bản giúp bạn gửi yêu cầu xem phòng nhanh hơn trong những lần tiếp theo.",
  },
};

export function AuthIntroPanel({ mode }: { mode: AuthIntroMode }) {
  const content = authIntroContent[mode];

  return (
    <AuthReveal
      className="auth-intro-panel order-2 relative overflow-hidden rounded-[26px] border p-4 sm:p-6 lg:order-1 lg:p-7"
      hover
    >
      <div className="pattern-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center gap-3">
          <div className="auth-intro-logo flex size-11 shrink-0 items-center justify-center rounded-[14px] border p-2 sm:size-12 sm:p-2.5">
            <Image
              src="/logo.png"
              alt="Logo Homi"
              width={40}
              height={40}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
          <div>
            <p className="auth-intro-eyebrow text-xs font-semibold uppercase tracking-[0.22em]">
              {content.eyebrow}
            </p>
            <p className="auth-intro-title mt-0.5 text-sm font-semibold">{content.summary}</p>
          </div>
        </div>

        <h1
          className={`auth-intro-title text-balance mt-4 max-w-[700px] text-[2rem] font-semibold leading-[1.04] tracking-tight sm:text-[2.45rem] lg:mt-7 ${
            mode === "login"
              ? "lg:text-[3.45rem] xl:text-[3.7rem]"
              : "lg:text-[3.15rem] xl:text-[3.45rem]"
          }`}
        >
          {content.headline}
        </h1>
        <p className="auth-intro-description mt-3 max-w-xl text-sm leading-6 sm:text-base sm:leading-7 lg:mt-4">
          {content.description}
        </p>

        <AuthStagger className="mt-5 grid auto-rows-fr gap-2 lg:mt-7" delay={0.14}>
          {content.notes.map((note) => (
            <AuthStaggerItem
              className={`auth-intro-benefit motion-soft flex h-full min-h-12 items-center gap-3 rounded-[14px] border px-3.5 py-2.5 text-sm ${
                note.desktopOnly ? "hidden lg:flex" : ""
              }`}
              key={note.label}
            >
              <note.icon className="auth-intro-benefit-icon size-4 shrink-0" strokeWidth={2.2} />
              <span className="leading-5">{note.label}</span>
            </AuthStaggerItem>
          ))}
        </AuthStagger>

        <div className="mt-auto hidden pt-5 lg:block">
          <div className="auth-intro-highlight rounded-[18px] border p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="auth-intro-highlight-icon mt-0.5 size-[18px] shrink-0"
                strokeWidth={2.2}
              />
              <div>
                <p className="auth-intro-title text-sm font-semibold">{content.highlightTitle}</p>
                <p className="auth-intro-highlight-description mt-1.5 text-sm leading-5">
                  {content.highlightDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthReveal>
  );
}
