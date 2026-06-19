import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Filter,
  Heart,
  MapPinned,
  MessageSquareText,
  ShieldCheck,
  UserPlus,
  WalletCards,
} from "lucide-react";

import {
  LandingReveal,
  LandingStagger,
  LandingStaggerItem,
} from "@/components/landing/landing-motion";
import { HomeRoomSections } from "@/components/rooms/home-room-sections";
import { Button } from "@/components/ui/button";

const reasons = [
  {
    icon: Filter,
    title: "Lọc đủ tiêu chí cần thiết",
    description:
      "Thu hẹp danh sách theo quận, ngân sách, diện tích, loại phòng và tiện ích thay vì lướt từng tin.",
  },
  {
    icon: WalletCards,
    title: "So sánh trước khi liên hệ",
    description:
      "Giá thuê, diện tích, địa chỉ và trạng thái còn phòng được đặt ở vị trí dễ nhìn trên từng tin.",
  },
  {
    icon: ShieldCheck,
    title: "Theo dõi các phòng đã quan tâm",
    description:
      "Đăng nhập để lưu phòng và xem lại lịch sử yêu cầu, tránh bỏ sót khi đang cân nhắc nhiều lựa chọn.",
  },
];

const steps = [
  {
    icon: MapPinned,
    title: "Chọn khu vực",
    description: "Bắt đầu từ quận, khoảng giá và diện tích phù hợp với lịch học hoặc nơi làm việc.",
  },
  {
    icon: Heart,
    title: "Lưu lựa chọn",
    description: "Mở chi tiết để xem hình ảnh, tiện ích và giữ lại những phòng đáng cân nhắc.",
  },
  {
    icon: CalendarCheck2,
    title: "Hẹn xem phòng",
    description: "Gọi trực tiếp hoặc gửi yêu cầu liên hệ để chủ phòng phản hồi lịch xem phù hợp.",
  },
];

export default function Home() {
  return (
    <div className="pb-6 sm:pb-12">
      <HomeRoomSections />

      <LandingReveal className="container-shell mt-16 sm:mt-24">
        <section className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-[var(--color-brand-700)]">
              Tìm phòng theo cách ít rối hơn
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.04em] text-[var(--color-text-strong)] sm:text-4xl">
              Tập trung vào thông tin giúp bạn ra quyết định.
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--color-text-muted)]">
              Homi giữ luồng tìm kiếm gọn: lọc danh sách, kiểm tra phòng phù hợp rồi chủ động hẹn xem.
            </p>
            <Link
              href="/explore/checklist-truoc-khi-thue"
              className="motion-soft mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-700)] hover:gap-3 hover:text-[var(--color-brand-800)]"
            >
              Xem checklist trước khi thuê
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <LandingStagger className="border-y border-[var(--color-border-strong)]">
            {reasons.map((reason) => (
              <LandingStaggerItem
                key={reason.title}
                className="grid gap-3 border-b border-[var(--color-border-soft)] py-5 last:border-b-0 sm:grid-cols-[3rem_1fr] sm:gap-5 sm:py-6"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)]">
                  <reason.icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-strong)]">
                    {reason.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
                    {reason.description}
                  </p>
                </div>
              </LandingStaggerItem>
            ))}
          </LandingStagger>
        </section>
      </LandingReveal>

      <LandingReveal className="container-shell mt-16 sm:mt-24">
        <section className="overflow-hidden rounded-[28px] bg-[var(--color-brand-950)] text-white shadow-[var(--shadow-card-hover)] sm:rounded-[36px]">
          <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
            <div className="relative min-h-[18rem] sm:min-h-[24rem] lg:min-h-full">
              <Image
                src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=84"
                alt="Không gian bếp và bàn làm việc trong một phòng trọ gọn gàng"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 44vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,24,32,0.02),rgba(4,24,32,0.42))]" />
            </div>

            <div className="px-5 py-7 sm:px-8 sm:py-10 lg:px-10">
              <p className="text-sm font-semibold text-[var(--color-accent-500)]">
                Ba bước để bắt đầu
              </p>
              <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Từ bộ lọc đến lịch hẹn xem phòng trong một luồng rõ ràng.
              </h2>
              <LandingStagger className="mt-7 grid gap-5">
                {steps.map((step, index) => (
                  <LandingStaggerItem
                    key={step.title}
                    className="grid grid-cols-[2.75rem_1fr] gap-4"
                  >
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-[var(--color-accent-500)]">
                      <step.icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/58">0{index + 1}</p>
                      <h3 className="mt-1 font-semibold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/70">{step.description}</p>
                    </div>
                  </LandingStaggerItem>
                ))}
              </LandingStagger>
            </div>
          </div>
        </section>
      </LandingReveal>

      <LandingReveal className="container-shell mt-16 sm:mt-24">
        <section className="relative isolate overflow-hidden rounded-[28px] bg-[var(--color-brand-800)] px-5 py-8 text-white shadow-[var(--shadow-card-hover)] sm:rounded-[36px] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <Image
            src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=82"
            alt="Phòng trọ có cửa sổ lớn và nội thất sáng màu"
            fill
            className="-z-20 object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,24,32,0.98),rgba(4,24,32,0.78)_60%,rgba(4,24,32,0.46))]" />

          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--color-accent-500)]">
              <CheckCircle2 className="size-4" />
              Bắt đầu với Homi
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Tìm phòng phù hợp, lưu lại lựa chọn và chủ động hẹn xem.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/76">
              Mở danh sách phòng để lọc theo nhu cầu hoặc tạo tài khoản để theo dõi các lựa chọn bạn đã lưu.
            </p>
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <Link href="/rooms">
                <Button
                  className="w-full sm:w-auto"
                  variant="warm"
                  size="lg"
                  trailingIcon={<ArrowRight className="size-4" />}
                >
                  Tìm phòng ngay
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="w-full border-white/22 bg-white/10 text-white hover:bg-white/16 sm:w-auto"
                  variant="outline"
                  size="lg"
                  leadingIcon={<UserPlus className="size-4" />}
                >
                  Tạo tài khoản
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/72">
            <p className="flex items-center gap-2">
              <MessageSquareText className="size-4 text-[var(--color-accent-500)]" />
              Theo dõi lịch sử liên hệ
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[var(--color-accent-500)]" />
              Xem thông tin trước khi hẹn phòng
            </p>
          </div>
        </section>
      </LandingReveal>
    </div>
  );
}
