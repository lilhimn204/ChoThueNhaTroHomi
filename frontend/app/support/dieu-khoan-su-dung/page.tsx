import type { Metadata } from "next";

import { ArticleSection, SupportArticle } from "@/components/support/support-article";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng | Homi",
  description: "Điều khoản sử dụng website Homi cho người tìm phòng và chủ trọ.",
};

export default function TermsPage() {
  return (
    <SupportArticle
      eyebrow="Điều khoản"
      title="Điều khoản sử dụng Homi."
      description="Khi sử dụng Homi, người tìm phòng và chủ trọ cần tuân thủ các quy định dưới đây để giữ môi trường thông tin rõ ràng, an toàn và hữu ích."
    >
      <ArticleSection title="Trách nhiệm người dùng">
        <p>Người dùng cần cung cấp thông tin liên hệ chính xác, sử dụng website đúng mục đích và không gửi nội dung gây hiểu nhầm, quấy rối hoặc vi phạm pháp luật.</p>
      </ArticleSection>
      <ArticleSection title="Trách nhiệm chủ trọ">
        <p>Chủ trọ cần đăng tin trung thực về giá, diện tích, địa chỉ, trạng thái còn phòng, tiện ích và hình ảnh. Tin không còn phù hợp nên được cập nhật hoặc ẩn kịp thời.</p>
      </ArticleSection>
      <ArticleSection title="Quy định đăng tin">
        <p>Bài đăng không được chứa nội dung giả mạo, lừa đảo, xúc phạm, quảng cáo không liên quan hoặc thông tin không thể kiểm chứng.</p>
      </ArticleSection>
      <ArticleSection title="Báo cáo vi phạm">
        <p>Homi có thể tiếp nhận báo cáo tin sai từ người dùng, kiểm tra nội dung và cập nhật trạng thái xử lý trong khu Admin.</p>
      </ArticleSection>
      <ArticleSection title="Giới hạn trách nhiệm">
        <p>Homi hỗ trợ hiển thị, tìm kiếm và quản lý thông tin phòng trọ. Người dùng vẫn cần tự xác minh thông tin trước khi ký hợp đồng hoặc giao dịch tài chính.</p>
      </ArticleSection>
      <ArticleSection title="Thay đổi điều khoản">
        <p>Homi có thể cập nhật điều khoản để phù hợp với tính năng mới hoặc yêu cầu vận hành. Nội dung mới sẽ được công bố trên trang này.</p>
      </ArticleSection>
    </SupportArticle>
  );
}
