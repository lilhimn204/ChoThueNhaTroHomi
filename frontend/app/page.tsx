import Link from "next/link";
import { ArrowRight, Building2, Clock3, ListFilter, ShieldCheck } from "lucide-react";

import { FeaturedRoomsSection } from "@/components/rooms/featured-rooms-section";
import { HeroSearchSection } from "@/components/rooms/hero-search-section";
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
  "Người dùng chọn khu vực, ngân sách và tiêu chí cần ưu tiên.",
  "Hệ thống trả về danh sách phòng theo thẻ để xem nhanh và dễ so sánh.",
  "Người dùng xem chi tiết và gửi yêu cầu liên hệ hoặc xem phòng.",
];

export default function Home() {
  return (
    <div className="pb-12">
      <HeroSearchSection />

      <FeaturedRoomsSection />

      <section className="container-shell mt-12 grid gap-5 sm:mt-20 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] bg-[var(--color-brand-950)] p-5 text-white shadow-[var(--shadow-card-hover)] sm:rounded-[32px] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
            Vì sao chọn Homi
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Tìm phòng quanh trường học và khu nội thành Hà Nội để đơn giản hóa việc chọn nơi ở.
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/74 sm:text-base sm:leading-8">
            Homi tập trung vào những thông tin người thuê cần xem đầu tiên:
            khu vực, giá, diện tích, tiện ích và trạng thái còn phòng. Cách trình
            bày gọn giúp sinh viên và người đi làm so sánh nhanh trước khi liên hệ.
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-[22px] bg-white/8 p-4 sm:mt-8 sm:items-center sm:rounded-[28px]">
            <Building2 className="size-5 text-[var(--color-accent-500)]" />
            <p className="text-sm leading-6 text-white/80">
              Ưu tiên các khu vực đông sinh viên như Cầu Giấy, Đống Đa, Thanh Xuân, Hà Đông, Nam Từ Liêm và các quận lân cận.
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          {reasons.map((reason) => (
            <article
              key={reason.title}
              className="rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--stat-brand-bg)] text-[var(--stat-brand-text)]">
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
      </section>

      <section className="container-shell mt-12 grid gap-5 sm:mt-20 sm:gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] sm:rounded-[32px] sm:p-8">
          <SectionHeading
            eyebrow="Quy trình tìm phòng"
            title="Từ lọc phòng đến gửi yêu cầu xem phòng trong vài bước."
            description="Trang danh sách phòng là điểm bắt đầu. Sau khi tìm thấy phòng phù hợp, bạn có thể xem chi tiết, gọi trực tiếp hoặc gửi yêu cầu hẹn lịch xem phòng."
          />
          <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex gap-3 rounded-[20px] bg-[var(--color-surface-soft)] px-4 py-3 sm:gap-4 sm:rounded-[24px] sm:px-5 sm:py-4"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-sm font-semibold text-[var(--color-brand-800)]">
                  0{index + 1}
                </div>
                <p className="text-sm leading-7 text-[var(--color-text-strong)]">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] bg-[linear-gradient(180deg,rgba(15,76,92,0.95),rgba(11,59,71,0.98))] p-5 text-white shadow-[var(--shadow-card-hover)] sm:rounded-[32px] sm:p-8">
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
      </section>
    </div>
  );
}
