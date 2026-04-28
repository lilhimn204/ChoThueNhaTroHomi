import type {
  ContactRequestStatus,
  ContactRequestType,
  RoomReportReason,
  RoomReportStatus,
  RoomStatus,
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
  WRONG_INFO: "Thong tin sai",
  DUPLICATE: "Tin trung lap",
  SCAM: "Nghi ngo lua dao",
  UNAVAILABLE: "Phong khong con trong",
  INAPPROPRIATE: "Noi dung khong phu hop",
  OTHER: "Ly do khac",
};

export const roomReportStatusMeta: Record<
  RoomReportStatus,
  { label: string; tone: "brand" | "success" | "warning" | "danger" }
> = {
  NEW: { label: "Moi gui", tone: "warning" },
  REVIEWING: { label: "Dang xem xet", tone: "brand" },
  RESOLVED: { label: "Da xu ly", tone: "success" },
  DISMISSED: { label: "Bo qua", tone: "danger" },
};

export const userStatusMeta: Record<
  UserStatus,
  { label: string; tone: "success" | "warning" | "danger" }
> = {
  ACTIVE: { label: "Hoạt động", tone: "success" },
  INACTIVE: { label: "Không hoạt động", tone: "warning" },
  LOCKED: { label: "Đã khóa", tone: "danger" },
};
