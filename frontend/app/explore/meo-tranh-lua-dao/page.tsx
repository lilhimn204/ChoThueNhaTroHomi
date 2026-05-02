import type { Metadata } from "next";
import Image from "next/image";
import {
  AlertTriangle,
  BadgeAlert,
  CameraOff,
  CircleDollarSign,
  FileX2,
  MessageSquareWarning,
  UserX,
} from "lucide-react";

import {
  ExploreArticle,
  ExploreInfoGrid,
  ExploreSection,
} from "@/components/explore/explore-article";

export const metadata: Metadata = {
  title: "Mẹo tránh lừa đảo khi thuê phòng | Homi",
  description:
    "Nhận biết dấu hiệu lừa đảo khi thuê phòng: giá quá rẻ, cọc trước khi xem phòng, ảnh không thật, thông tin mập mờ và không có hợp đồng.",
};

const scamSignals = [
  {
    title: "Giá rẻ bất thường",
    description:
      "Nếu giá thấp hơn mặt bằng khu vực quá nhiều nhưng phòng lại được mô tả quá tốt, cần kiểm tra kỹ nguồn tin và yêu cầu xem phòng trực tiếp.",
    icon: <CircleDollarSign className="size-5" />,
    tone: "warning" as const,
  },
  {
    title: "Yêu cầu cọc trước khi xem phòng",
    description:
      "Không chuyển tiền giữ chỗ khi chưa xác minh phòng, người cho thuê và điều kiện nhận phòng.",
    icon: <BadgeAlert className="size-5" />,
    tone: "warning" as const,
  },
  {
    title: "Ảnh không thật",
    description:
      "Ảnh quá đẹp, mờ nguồn gốc hoặc xuất hiện ở nhiều tin khác nhau có thể là ảnh lấy lại. Hãy yêu cầu ảnh/video mới hoặc xem trực tiếp.",
    icon: <CameraOff className="size-5" />,
  },
  {
    title: "Thông tin mập mờ",
    description:
      "Tin không ghi rõ địa chỉ, chi phí, diện tích, người liên hệ hoặc né tránh câu hỏi cụ thể là dấu hiệu cần thận trọng.",
    icon: <MessageSquareWarning className="size-5" />,
  },
  {
    title: "Không có hợp đồng",
    description:
      "Chỉ thỏa thuận miệng khiến bạn khó bảo vệ quyền lợi khi phát sinh tranh chấp tiền cọc, phí dịch vụ hoặc thời hạn thuê.",
    icon: <FileX2 className="size-5" />,
    tone: "muted" as const,
  },
  {
    title: "Né tránh gặp trực tiếp",
    description:
      "Người cho thuê liên tục trì hoãn xem phòng, chỉ nhắn tin và thúc ép chuyển tiền thường không đáng tin.",
    icon: <UserX className="size-5" />,
    tone: "warning" as const,
  },
];

export default function AntiScamTipsPage() {
  return (
    <ExploreArticle
      eyebrow="An toàn"
      title="Nhận biết rủi ro trước khi chuyển tiền hoặc đặt cọc."
      description="Lừa đảo thuê phòng thường đánh vào tâm lý sợ mất phòng đẹp, giá rẻ. Hãy chậm lại, kiểm tra nguồn tin và chỉ đặt cọc khi mọi thông tin đủ rõ."
    >
      <ExploreSection title="Những dấu hiệu cần cảnh giác">
        <ExploreInfoGrid items={scamSignals} />
      </ExploreSection>

      <ExploreSection
        title="Minh họa cách kiểm tra tin đăng"
        description="Nếu chưa có ảnh xác thực từ chủ trọ, hãy xem ảnh như dữ liệu tham khảo, không dùng ảnh đẹp làm căn cứ duy nhất để chuyển tiền."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="motion-panel overflow-hidden rounded-[24px] bg-[var(--color-surface)] shadow-sm hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
            <div className="relative aspect-[16/9]">
              <Image
                src="/og-image.png"
                alt="Minh họa kiểm tra ảnh bài đăng phòng trọ"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[var(--color-text-strong)]">
                Đừng tin ảnh một chiều
              </h3>
              <p className="mt-1 text-sm leading-7 text-[var(--color-text-muted)]">
                Hãy yêu cầu ảnh/video mới, ảnh khu vực chung, lối vào, nhà vệ sinh và vị trí cửa sổ.
              </p>
            </div>
          </div>
          <div className="motion-panel rounded-[24px] bg-[var(--color-surface)] p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)]">
              <AlertTriangle className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-strong)]">
              Cẩn thận khi bị thúc ép
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
              Các câu như &quot;nhiều người đang hỏi&quot;, &quot;chuyển ngay để giữ phòng&quot; hoặc &quot;không cần xem phòng đâu&quot; thường được dùng để tạo áp lực. Một chủ trọ minh bạch sẽ cho bạn thời gian kiểm tra.
            </p>
          </div>
        </div>
      </ExploreSection>

      <ExploreSection title="Cách xử lý khi thấy tin đáng ngờ">
        <p>Không chuyển tiền, không gửi giấy tờ cá nhân và không bấm vào đường link lạ.</p>
        <p>Chụp lại tin đăng, số điện thoại, nội dung trao đổi và gửi báo cáo cho Homi để đội ngũ quản trị kiểm tra.</p>
      </ExploreSection>
    </ExploreArticle>
  );
}
