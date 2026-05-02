import { Settings } from "lucide-react";

import { CmsPlaceholderPage } from "@/components/cms/cms-placeholder-page";

export default function CmsSettingsPage() {
  return (
    <CmsPlaceholderPage
      eyebrow="Cài đặt"
      title="Thiết lập CMS"
      description="Khu vực cấu hình quy trình xuất bản, SEO mặc định và quyền biên tập cho các giai đoạn sau."
      icon={Settings}
      nextSteps={[
        "Giữ quyền truy cập CMS cho ADMIN trong giai đoạn đầu.",
        "Sau này có thể thêm role EDITOR nếu cần phân quyền biên tập.",
        "Bổ sung SEO mặc định cho trang tin tức và bài viết.",
        "Thiết lập quy trình duyệt bài nếu CMS có nhiều người dùng.",
      ]}
    />
  );
}
