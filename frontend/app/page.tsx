import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Clock3,
  HomeIcon,
  ListFilter,
  MapPinned,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { FeaturedRoomsSection } from "@/components/rooms/featured-rooms-section";
import { HeroSearchSection } from "@/components/rooms/hero-search-section";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

const reasons = [
  {
    icon: ListFilter,
    title: "Lọc phòng theo đúng nhu cầu",
    description:
      "Chọn quận, ngân sách, diện tích, tiện ích và trạng thái còn phòng để rút gọn danh sách cần xem.",
  },
  {
    icon: Clock3,
    title: "Thông tin rõ ràng trước khi liên hệ",
    description:
      "Mỗi bài đăng hiển thị giá thuê, địa chỉ, diện tích, tiện ích và số liên hệ để bạn so sánh nhanh.",
  },
  {
    icon: ShieldCheck,
    title: "Theo dõi yêu cầu liên hệ để không bỏ sót",
    description:
      "Sau khi gửi yêu cầu xem phòng, bạn có thể xem lại lịch sử liên hệ trong tài khoản cá nhân.",
  },
];

const steps = [
  {
    icon: Search,
    title: "Lọc tiêu chí",
    description: "Chọn khu vực, ngân sách, diện tích và tiện ích cần ưu tiên.",
  },
  {
    icon: HomeIcon,
    title: "So sánh phòng",
    description: "Xem danh sách phòng theo thẻ, nổi bật giá, diện tích và trạng thái.",
  },
  {
    icon: CalendarCheck,
    title: "Hẹn xem",
    description: "Mở chi tiết, gọi trực tiếp hoặc gửi yêu cầu liên hệ để được phản hồi.",
  },
];

const stats = [
  { icon: Building2, label: "Phòng đang quản lý", value: 120, suffix: "+" },
  { icon: MapPinned, label: "Quận nội thành", value: 12, suffix: "+" },
  { icon: Users, label: "Người dùng quan tâm", value: 850, suffix: "+" },
];

const testimonials = [
  {
    name: "Minh Anh",
    role: "Sinh viên Cầu Giấy",
    initials: "MA",
    content: "Mình lọc được phòng đúng ngân sách nhanh hơn vì giá, diện tích và khu vực hiện ngay trên thẻ.",
  },
  {
    name: "Hoàng Nam",
    role: "Người đi làm",
    initials: "HN",
    content: "Phần lưu phòng và lịch sử liên hệ giúp mình không bị lẫn giữa nhiều phòng đã hỏi.",
  },
  {
    name: "Thu Trang",
    role: "Người thuê tại Thanh Xuân",
    initials: "TT",
    content: "Giao diện rõ ràng, xem trên điện thoại vẫn dễ so sánh trước khi gọi chủ phòng.",
  },
];

export default function Home() {
  return (
    <div className="pb-12">
      <HeroSearchSection />

      <FeaturedRoomsSection />

      <AnimateOnScroll as="section" className="container-shell mt-12 grid gap-5 sm:mt-20 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="motion-panel rounded-[24px] bg-[var(--color-brand-950)] p-5 text-white shadow-[var(--shadow-card-hover)] hover:-translate-y-1 sm:rounded-[32px] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
            Vì sao chọn Homi
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Tìm phòng quanh trường học và khu nội thành Hà Nội để <span className="text-[var(--color-accent-500)]">đơn giản hóa</span> việc chọn nơi ở.
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/74 sm:text-base sm:leading-8">
            Homi tập trung vào những thông tin người thuê cần xem đầu tiên:
            khu vực, giá, diện tích, tiện ích và trạng thái còn phòng. Cách trình
            bày gọn giúp sinh viên và người đi làm so sánh nhanh trước khi liên hệ.
          </p>
          <div className="motion-soft mt-6 flex items-start gap-3 rounded-[22px] bg-white/8 p-4 hover:bg-white/10 sm:mt-8 sm:items-center sm:rounded-[28px]">
            <Building2 className="size-5 text-[var(--color-accent-500)]" />
            <p className="text-sm leading-6 text-white/80">
              Ưu tiên các khu vực đông sinh viên như Cầu Giấy, Đống Đa, Thanh Xuân, Hà Đông, Nam Từ Liêm và các quận lân cận.
            </p>
          </div>
        </div>

        <div className="motion-stagger grid gap-5">
          {reasons.map((reason, index) => (
            <article
              key={reason.title}
              className="motion-panel group relative overflow-hidden rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] sm:rounded-[28px] sm:p-6"
            >
              <span className="absolute right-5 top-4 text-4xl font-semibold text-[var(--color-brand-500)]/10">
                0{index + 1}
              </span>
              <div className="flex items-start gap-4">
                <div className="motion-soft flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--stat-brand-bg)] text-[var(--stat-brand-text)] group-hover:scale-105 group-hover:rotate-3 group-hover:shadow-md">
                  <reason.icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[var(--color-text-strong)] sm:text-xl">
                    {reason.title}
                  </h3>
                  <p className="text-sm leading-7 text-[var(--color-text-muted)]">
                    {reason.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll as="section" className="container-shell mt-12 sm:mt-20">
        <div className="grid gap-3 rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:grid-cols-3 sm:rounded-[34px] sm:p-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="motion-panel flex items-center gap-4 rounded-[22px] bg-[var(--color-surface-soft)] px-4 py-4 hover:-translate-y-0.5 hover:bg-[var(--color-border-soft)]"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)]">
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--color-text-strong)]">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll as="section" className="container-shell mt-12 grid gap-5 sm:mt-20 sm:gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] sm:rounded-[32px] sm:p-8">
          <SectionHeading
            eyebrow="Quy trình tìm phòng"
            title="Từ lọc phòng đến gửi yêu cầu xem phòng trong vài bước."
            description="Trang danh sách phòng là điểm bắt đầu. Sau khi tìm thấy phòng phù hợp, bạn có thể xem chi tiết, gọi trực tiếp hoặc gửi yêu cầu hẹn lịch xem phòng."
          />
          <div className="motion-stagger relative mt-6 grid gap-3 sm:mt-8 sm:gap-4">
            <div className="absolute bottom-6 left-[1.1rem] top-6 hidden w-px bg-gradient-to-b from-[var(--color-brand-500)] via-[var(--color-accent-500)] to-transparent sm:block" />
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="motion-soft group relative flex gap-3 rounded-[20px] bg-[var(--color-surface-soft)] px-4 py-3 hover:-translate-y-0.5 hover:bg-[var(--color-border-soft)] sm:gap-4 sm:rounded-[24px] sm:px-5 sm:py-4"
              >
                <div className="motion-soft z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-brand-800)] shadow-sm group-hover:scale-105">
                  <step.icon className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    Bước 0{index + 1}
                  </p>
                  <h3 className="mt-1 font-semibold text-[var(--color-text-strong)]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-7 text-[var(--color-text-muted)]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="motion-panel rounded-[24px] bg-[linear-gradient(180deg,rgba(15,76,92,0.95),rgba(11,59,71,0.98))] p-5 text-white shadow-[var(--shadow-card-hover)] hover:-translate-y-1 sm:rounded-[32px] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
            Dành cho người thuê
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Lưu thông tin phòng phù hợp, liên hệ nhanh và theo dõi lịch sử yêu cầu.
          </h3>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-white/80">
            <li>Xem danh sách phòng theo khu vực và mức giá mong muốn.</li>
            <li>Gửi yêu cầu xem phòng để chủ phòng hoặc admin phản hồi.</li>
            <li>Đăng nhập để quản lý hồ sơ và lịch sử liên hệ của bạn.</li>
          </ul>
          <Link href="/rooms" className="mt-6 block sm:mt-8 sm:inline-flex">
            <Button className="w-full sm:w-auto" variant="warm" size="lg" trailingIcon={<ArrowRight className="size-4" />}>
              Bắt đầu tìm phòng
            </Button>
          </Link>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll as="section" className="container-shell mt-12 space-y-6 sm:mt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Người thuê nói gì"
            title="Trải nghiệm tìm phòng rõ ràng hơn."
            description="Một vài phản hồi mẫu từ nhóm người dùng mục tiêu của Homi: sinh viên, người mới đi làm và người thuê dài hạn."
          />
          <Sparkles className="hidden size-10 text-[var(--color-accent-500)] sm:block" />
        </div>
        <div className="motion-stagger grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-brand-700)] text-sm font-semibold text-[var(--color-brand-contrast)]">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text-strong)]">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">{testimonial.role}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-1 text-[var(--color-accent-500)]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
                {testimonial.content}
              </p>
            </article>
          ))}
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll as="section" className="container-shell mt-12 sm:mt-20">
        <div className="shine-surface rounded-[28px] bg-[linear-gradient(135deg,var(--color-brand-700),var(--color-brand-950))] p-5 text-white shadow-[var(--shadow-card-hover)] sm:rounded-[36px] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
                Bắt đầu với Homi
              </p>
              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                Tìm phòng phù hợp hoặc tạo tài khoản để lưu lại lựa chọn của bạn.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78">
                Danh sách phòng, bộ lọc và lịch sử liên hệ giúp bạn so sánh có hệ thống trước khi hẹn xem.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:flex">
              <Link href="/rooms">
                <Button className="w-full" variant="warm" size="lg" trailingIcon={<ArrowRight className="size-4" />}>
                  Tìm phòng ngay
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full border-white/25 bg-white/10 text-white hover:bg-white/15" variant="outline" size="lg" leadingIcon={<MessageCircle className="size-4" />}>
                  Tạo tài khoản
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
