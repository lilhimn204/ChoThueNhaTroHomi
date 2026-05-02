import type { Metadata } from "next";

import { ReportWrongListingForm } from "@/components/support/support-ticket-forms";
import { ArticleSection, SupportArticle } from "@/components/support/support-article";

export const metadata: Metadata = {
  title: "Báo cáo tin sai | Homi",
  description: "Gửi báo cáo tin sai, tin đã hết phòng hoặc tin có dấu hiệu không phù hợp trên Homi.",
};

export default function ReportWrongListingPage() {
  return (
    <SupportArticle
      eyebrow="Báo cáo"
      title="Báo cáo bài đăng có thông tin chưa chính xác."
      description="Gửi mã tin hoặc link bài đăng để đội ngũ Homi kiểm tra. Thông tin của bạn giúp danh sách phòng rõ ràng và đáng tin cậy hơn."
    >
      <ReportWrongListingForm />
      <ArticleSection title="Khi nào nên báo cáo?">
        <p>Bạn nên báo cáo khi giá, diện tích, địa chỉ, trạng thái còn phòng hoặc hình ảnh không khớp với thực tế.</p>
        <p>Các báo cáo nghi ngờ lừa đảo, yêu cầu đặt cọc bất thường hoặc nội dung không phù hợp sẽ được ưu tiên kiểm tra.</p>
      </ArticleSection>
    </SupportArticle>
  );
}
