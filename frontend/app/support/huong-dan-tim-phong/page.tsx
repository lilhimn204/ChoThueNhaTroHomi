import type { Metadata } from "next";

import { ArticleSection, SupportArticle } from "@/components/support/support-article";

export const metadata: Metadata = {
  title: "Hướng dẫn tìm phòng | Homi",
  description: "Các bước tìm kiếm, lọc phòng, lưu phòng và gửi yêu cầu xem phòng trên Homi.",
};

const steps = [
  ["Tìm kiếm", "Nhập khu vực, tên đường, mã tin hoặc nhu cầu của bạn tại ô tìm kiếm trên trang Tìm phòng."],
  ["Lọc phòng", "Dùng bộ lọc giá, diện tích, trạng thái, tiện ích và loại phòng để thu hẹp danh sách."],
  ["Xem chi tiết", "Mở bài đăng để kiểm tra ảnh, mô tả, địa chỉ, giá thuê, diện tích và thông tin liên hệ."],
  ["Lưu phòng", "Đăng nhập và lưu các phòng đáng chú ý để quay lại so sánh khi cần."],
  ["Gửi yêu cầu xem phòng", "Dùng form liên hệ trong trang chi tiết để gửi lịch hẹn hoặc câu hỏi cho chủ trọ."],
  ["Theo dõi liên hệ", "Vào Lịch sử liên hệ để xem trạng thái phản hồi và quản lý các yêu cầu đã gửi."],
];

export default function RoomSearchGuidePage() {
  return (
    <SupportArticle
      eyebrow="Hướng dẫn"
      title="Tìm phòng trên Homi theo một quy trình rõ ràng."
      description="Homi được thiết kế để bạn lọc nhanh các phòng phù hợp, kiểm tra thông tin trước khi liên hệ và giữ lại những lựa chọn đáng quan tâm."
    >
      <ArticleSection title="Quy trình đề xuất">
        <div className="grid gap-3">
          {steps.map(([title, description], index) => (
            <div
              key={title}
              className="grid gap-3 rounded-[20px] bg-[var(--color-surface)] p-4 sm:grid-cols-[3rem_minmax(0,1fr)]"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--badge-brand-bg)] font-semibold text-[var(--badge-brand-text)]">
                {index + 1}
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text-strong)]">{title}</h2>
                <p className="mt-1 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection title="Mẹo chọn phòng an toàn">
        <p>Ưu tiên bài đăng có ảnh rõ, mô tả cụ thể, địa chỉ đủ chi tiết và thông tin liên hệ nhất quán.</p>
        <p>Không chuyển khoản giữ chỗ khi chưa xác minh phòng, chủ trọ và điều kiện thuê. Nếu thấy thông tin bất thường, hãy dùng mục Báo cáo tin sai để Homi kiểm tra.</p>
      </ArticleSection>
    </SupportArticle>
  );
}
