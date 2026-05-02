"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "Làm sao để tìm phòng phù hợp?",
    answer:
      "Bạn có thể bắt đầu từ trang Tìm phòng, nhập khu vực hoặc từ khóa, sau đó lọc theo giá, diện tích, trạng thái, tiện ích và loại phòng. Danh sách sẽ tự cập nhật theo bộ lọc đang chọn.",
  },
  {
    question: "Làm sao để gửi yêu cầu xem phòng?",
    answer:
      "Mở trang chi tiết phòng, kiểm tra thông tin giá và tiện ích, sau đó dùng form liên hệ nhanh để gửi yêu cầu xem phòng. Homi sẽ lưu lịch sử để bạn theo dõi trạng thái xử lý.",
  },
  {
    question: "Tôi có thể lưu phòng yêu thích không?",
    answer:
      "Có. Khi đã đăng nhập, bạn có thể bấm nút lưu trên thẻ phòng hoặc trang chi tiết. Các phòng đã lưu nằm trong mục Phòng đã lưu để so sánh lại sau.",
  },
  {
    question: "Chủ trọ đăng tin như thế nào?",
    answer:
      "Chủ trọ đăng nhập, bấm Đăng tin, điền thông tin phòng, loại phòng, giá, diện tích, tiện ích và ảnh. Sau khi lưu, bài đăng xuất hiện trong khu quản lý của chủ trọ.",
  },
  {
    question: "Làm sao để báo cáo tin sai?",
    answer:
      "Bạn có thể dùng form Báo cáo tin sai trong menu Hỗ trợ bằng mã tin hoặc link bài đăng. Nếu đang ở trang chi tiết phòng, bạn cũng có thể gửi báo cáo trực tiếp tại khối báo cáo của bài đăng.",
  },
  {
    question: "Homi có thu phí người tìm phòng không?",
    answer:
      "Homi không thu phí người tìm phòng cho các thao tác tìm kiếm, lọc, lưu phòng và gửi yêu cầu liên hệ trên website.",
  },
];

export function FaqPageClient() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {faqItems.map((item, index) => {
        const open = openIndex === index;

        return (
          <section
            key={item.question}
            className="motion-panel overflow-hidden rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface)] shadow-sm"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? -1 : index)}
            >
              <span className="text-base font-semibold text-[var(--color-text-strong)]">
                {item.question}
              </span>
              <ChevronDown
                className={cn("motion-soft size-5 shrink-0 text-[var(--color-text-muted)]", open && "rotate-180")}
              />
            </button>
            {open ? (
              <div className="animate-slide-up border-t border-[var(--color-border-soft)] px-4 py-4 text-sm leading-7 text-[var(--color-text-muted)] sm:px-5">
                {item.answer}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
