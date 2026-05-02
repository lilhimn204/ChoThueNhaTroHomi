import type { Metadata } from "next";

import { ArticleSection, SupportArticle } from "@/components/support/support-article";

export const metadata: Metadata = {
  title: "Chính sách bảo mật | Homi",
  description: "Chính sách bảo mật dữ liệu người dùng của website Homi.",
};

export default function PrivacyPolicyPage() {
  return (
    <SupportArticle
      eyebrow="Bảo mật"
      title="Chính sách bảo mật dữ liệu người dùng."
      description="Chính sách này giải thích cách Homi thu thập, sử dụng và bảo vệ thông tin trong quá trình bạn tìm phòng, lưu phòng, liên hệ hoặc đăng tin."
    >
      <ArticleSection title="Thông tin Homi thu thập">
        <p>Homi có thể thu thập họ tên, email, số điện thoại, ảnh đại diện, thông tin tài khoản, lịch sử lưu phòng, yêu cầu liên hệ và nội dung bạn gửi qua các biểu mẫu hỗ trợ.</p>
      </ArticleSection>
      <ArticleSection title="Mục đích sử dụng">
        <p>Dữ liệu được dùng để xác thực tài khoản, hiển thị hồ sơ, gửi yêu cầu xem phòng, hỗ trợ người dùng, quản lý bài đăng và cải thiện chất lượng tìm kiếm.</p>
      </ArticleSection>
      <ArticleSection title="Bảo vệ dữ liệu">
        <p>Homi giới hạn quyền truy cập dữ liệu theo vai trò người dùng, dùng cơ chế xác thực và không công khai thông tin nhạy cảm ngoài các khu vực cần thiết cho giao dịch thuê phòng.</p>
      </ArticleSection>
      <ArticleSection title="Quyền của người dùng">
        <p>Bạn có thể cập nhật hồ sơ, đổi mật khẩu, yêu cầu hỗ trợ hoặc liên hệ Homi nếu cần kiểm tra thông tin cá nhân đang được lưu trong hệ thống.</p>
      </ArticleSection>
      <ArticleSection title="Liên hệ hỗ trợ">
        <p>Nếu có câu hỏi về quyền riêng tư hoặc dữ liệu cá nhân, hãy gửi yêu cầu tại trang Liên hệ Homi trong menu Hỗ trợ.</p>
      </ArticleSection>
    </SupportArticle>
  );
}
