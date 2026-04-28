import type { Metadata } from "next";

import { ContactHistoryPageClient } from "@/components/contact/contact-history-page-client";

export const metadata: Metadata = {
  title: "Lịch sử yêu cầu liên hệ",
  description: "Xem lại danh sách yêu cầu xem phòng và liên hệ đã gửi. Theo dõi trạng thái xử lý từ chủ trọ và admin.",
};

export default function ContactHistoryPage() {
  return <ContactHistoryPageClient />;
}
