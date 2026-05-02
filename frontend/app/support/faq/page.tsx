import type { Metadata } from "next";

import { FaqPageClient } from "@/components/support/faq-page-client";
import { SupportArticle } from "@/components/support/support-article";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp | Homi",
  description: "FAQ về cách tìm phòng, lưu phòng, gửi yêu cầu xem phòng và báo cáo tin sai trên Homi.",
};

export default function FaqPage() {
  return (
    <SupportArticle
      eyebrow="FAQ"
      title="Câu hỏi thường gặp khi sử dụng Homi."
      description="Các câu trả lời ngắn gọn cho những tình huống phổ biến khi tìm phòng, liên hệ chủ trọ hoặc quản lý bài đăng."
    >
      <FaqPageClient />
    </SupportArticle>
  );
}
