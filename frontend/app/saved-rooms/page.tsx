import type { Metadata } from "next";

import { SavedRoomsPageClient } from "@/components/rooms/saved-rooms-page-client";

export const metadata: Metadata = {
  title: "Phòng đã lưu",
  description: "Xem lại danh sách phòng trọ bạn đã lưu để so sánh và liên hệ xem phòng.",
};

export default function SavedRoomsPage() {
  return <SavedRoomsPageClient />;
}
