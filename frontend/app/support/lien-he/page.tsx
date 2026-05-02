import type { Metadata } from "next";

import { ContactHomiForm } from "@/components/support/support-ticket-forms";
import { ArticleSection, SupportArticle } from "@/components/support/support-article";

export const metadata: Metadata = {
  title: "Liên hệ Homi | Homi",
  description: "Gửi câu hỏi, góp ý hoặc yêu cầu hỗ trợ tới đội ngũ quản trị Homi.",
};

export default function ContactHomiPage() {
  return (
    <SupportArticle
      eyebrow="Liên hệ"
      title="Gửi yêu cầu hỗ trợ tới Homi."
      description="Dùng biểu mẫu này cho các câu hỏi về tài khoản, thao tác tìm phòng, đăng tin hoặc góp ý cải thiện website."
    >
      <ContactHomiForm />
      <ArticleSection title="Thông tin xử lý">
        <p>Yêu cầu sẽ được chuyển tới khu Admin để đội ngũ Homi theo dõi, phân loại và cập nhật trạng thái xử lý.</p>
        <p>Hãy nhập email và số điện thoại chính xác để Homi có thể phản hồi khi cần thêm thông tin.</p>
      </ArticleSection>
    </SupportArticle>
  );
}
