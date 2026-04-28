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

      <section className="container-shell mt-20 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] bg-[var(--color-brand-950)] p-8 text-white shadow-[var(--shadow-card-hover)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
            Vì sao chọn Homi
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            Tìm phòng quanh trường học và khu nội thành Hà Nội để đơn giản hóa việc chọn nơi ở.
          </h2>
          <p className="mt-4 text-base leading-8 text-white/74">
            Homi tập trung vào những thông tin người thuê cần xem đầu tiên:
            khu vực, giá, diện tích, tiện ích và trạng thái còn phòng. Cách trình
            bày gọn giúp sinh viên và người đi làm so sánh nhanh trước khi liên hệ.
          </p>
          <div className="mt-8 flex items-center gap-3 rounded-[28px] bg-white/8 p-4">
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
              className="rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--stat-brand-bg)] text-[var(--stat-brand-text)]">
                  <reason.icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[var(--color-text-strong)]">
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

      <section className="container-shell mt-20 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[32px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]">
          <SectionHeading
            eyebrow="Quy trình tìm phòng"
            title="Từ lọc phòng đến gửi yêu cầu xem phòng trong vài bước."
            description="Trang danh sách phòng là điểm bắt đầu. Sau khi tìm thấy phòng phù hợp, bạn có thể xem chi tiết, gọi trực tiếp hoặc gửi yêu cầu hẹn lịch xem phòng."
          />
          <div className="mt-8 grid gap-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex gap-4 rounded-[24px] bg-[var(--color-surface-soft)] px-5 py-4"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-sm font-semibold text-[var(--color-brand-800)]">
                  0{index + 1}
                </div>
                <p className="text-sm leading-7 text-[var(--color-text-strong)]">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] bg-[linear-gradient(180deg,rgba(15,76,92,0.95),rgba(11,59,71,0.98))] p-8 text-white shadow-[var(--shadow-card-hover)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
            Dành cho người thuê
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight">
            Lưu thông tin phòng phù hợp, liên hệ nhanh và theo dõi lịch sử yêu cầu.
          </h3>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-white/80">
            <li>Xem danh sách phòng theo khu vực và mức giá mong muốn.</li>
            <li>Gửi yêu cầu xem phòng để chủ phòng hoặc admin phản hồi.</li>
            <li>Đăng nhập để quản lý hồ sơ và lịch sử liên hệ của bạn.</li>
          </ul>
          <Link href="/rooms" className="mt-8 inline-flex">
            <Button variant="warm" size="lg" trailingIcon={<ArrowRight className="size-4" />}>
              Bắt đầu tìm phòng
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
