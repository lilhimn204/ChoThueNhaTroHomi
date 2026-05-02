import type {
  ContactRequestStatus,
  ContactRequestType,
  NewsArticleStatus,
  RoomReportReason,
  RoomReportStatus,
  RoomStatus,
  SupportTicketStatus,
  SupportTicketType,
  UserStatus,
} from "@/types";

export const roomStatusMeta: Record<
  RoomStatus,
  { label: string; tone: "success" | "warning" | "muted" }
> = {
  AVAILABLE: { label: "Còn phòng", tone: "success" },
  FULL: { label: "Tạm hết phòng", tone: "warning" },
  HIDDEN: { label: "Đang ẩn", tone: "muted" },
};

export const contactRequestStatusMeta: Record<
  ContactRequestStatus,
  { label: string; tone: "brand" | "success" | "warning" | "danger" }
> = {
  PENDING: { label: "Đang chờ xử lý", tone: "warning" },
  IN_PROGRESS: { label: "Đang liên hệ", tone: "brand" },
  RESOLVED: { label: "Đã xử lý", tone: "success" },
  CANCELLED: { label: "Đã hủy", tone: "danger" },
};

export const contactRequestTypeLabel: Record<ContactRequestType, string> = {
  CONTACT: "Yêu cầu liên hệ",
  VIEWING: "Yêu cầu xem phòng",
};

export const roomReportReasonLabel: Record<RoomReportReason, string> = {
  WRONG_INFO: "Thông tin sai",
  DUPLICATE: "Tin trùng lặp",
  SCAM: "Nghi ngờ lừa đảo",
  UNAVAILABLE: "Phòng không còn trống",
  INAPPROPRIATE: "Nội dung không phù hợp",
  OTHER: "Lý do khác",
};

export const roomReportStatusMeta: Record<
  RoomReportStatus,
  { label: string; tone: "brand" | "success" | "warning" | "danger" }
> = {
  NEW: { label: "Mới gửi", tone: "warning" },
  REVIEWING: { label: "Đang xem xét", tone: "brand" },
  RESOLVED: { label: "Đã xử lý", tone: "success" },
  DISMISSED: { label: "Bỏ qua", tone: "danger" },
};

export const supportTicketTypeLabel: Record<SupportTicketType, string> = {
  ROOM_REPORT: "Báo cáo tin sai",
  CONTACT: "Liên hệ Homi",
};

export const supportTicketStatusMeta: Record<
  SupportTicketStatus,
  { label: string; tone: "brand" | "success" | "warning" | "danger" }
> = {
  NEW: { label: "Mới gửi", tone: "warning" },
  REVIEWING: { label: "Đang xử lý", tone: "brand" },
  RESOLVED: { label: "Đã xử lý", tone: "success" },
  DISMISSED: { label: "Bỏ qua", tone: "danger" },
};

export const newsArticleStatusMeta: Record<
  NewsArticleStatus,
  { label: string; tone: "brand" | "warning" }
> = {
  DRAFT: { label: "Bản nháp", tone: "warning" },
  PUBLISHED: { label: "Đã xuất bản", tone: "brand" },
};

export const userStatusMeta: Record<
  UserStatus,
  { label: string; tone: "success" | "warning" | "danger" }
> = {
  ACTIVE: { label: "Hoạt động", tone: "success" },
  INACTIVE: { label: "Không hoạt động", tone: "warning" },
  LOCKED: { label: "Đã khóa", tone: "danger" },
};
