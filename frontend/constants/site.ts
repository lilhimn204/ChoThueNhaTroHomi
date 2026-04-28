export const siteConfig = {
  name: "Homi",
  description:
    "Nền tảng tìm kiếm và quản lý phòng trọ tại Hà Nội, rõ ràng và dễ thao tác cho sinh viên và người đi làm.",
};

export const publicNavigation = [
  { label: "Trang chủ", href: "/" },
  { label: "Tìm phòng", href: "/rooms" },
  { label: "Phòng đã lưu", href: "/saved-rooms" },
  { label: "Lịch sử liên hệ", href: "/contact-history" },
];

export const accountNavigation = [
  { label: "Đăng nhập", href: "/login" },
  { label: "Đăng ký", href: "/register" },
];

export const adminNavigation = [
  { label: "Tổng quan", href: "/admin" },
  { label: "Quản lý phòng", href: "/admin/rooms" },
  { label: "Yêu cầu liên hệ", href: "/admin/contact-requests" },
  { label: "Báo cáo tin đăng", href: "/admin/room-reports" },
  { label: "Quản lý người dùng", href: "/admin/users" },
];

export const hostNavigation = [
  { label: "Tổng quan", href: "/host/dashboard" },
  { label: "Bài đăng của tôi", href: "/host/posts" },
  { label: "Khách liên hệ", href: "/host/customers" },
  { label: "Hồ sơ cho thuê", href: "/host/profile" },
];

export const roomSortOptions = [
  { label: "Mới đăng", value: "newest" },
  { label: "Giá thấp đến cao", value: "price_asc" },
  { label: "Giá cao đến thấp", value: "price_desc" },
  { label: "Diện tích nhỏ đến lớn", value: "area_asc" },
  { label: "Diện tích lớn đến nhỏ", value: "area_desc" },
];

export const roomStatusOptions = [
  { label: "Còn phòng", value: "AVAILABLE" },
  { label: "Đã hết phòng", value: "FULL" },
];
