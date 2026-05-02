import type { RoomType } from "@/types";

export const siteConfig = {
  name: "Homi",
  description:
    "Nền tảng tìm kiếm và quản lý phòng trọ tại Hà Nội, rõ ràng và dễ thao tác cho sinh viên và người đi làm.",
};

export interface NavigationLink {
  label: string;
  href: string;
  description?: string;
  isPlaceholder?: boolean;
}

export interface HeaderNavigationItem extends NavigationLink {
  children?: NavigationLink[];
}

export const roomTypeOptions: Array<{ label: string; value: RoomType }> = [
  { label: "Cho thuê căn hộ chung cư", value: "apartment" },
  { label: "Cho thuê chung cư mini, căn hộ dịch vụ", value: "mini-apartment" },
  { label: "Cho thuê nhà riêng", value: "private-house" },
  { label: "Cho thuê nhà trọ, phòng trọ", value: "boarding-room" },
];

export const roomTypeLabelByValue: Record<RoomType, string> = {
  apartment: "Cho thuê căn hộ chung cư",
  "mini-apartment": "Cho thuê chung cư mini, căn hộ dịch vụ",
  "private-house": "Cho thuê nhà riêng",
  "boarding-room": "Cho thuê nhà trọ, phòng trọ",
};

const roomTypeDescriptions: Record<RoomType, string> = {
  apartment: "Lọc các tin thuộc nhóm căn hộ chung cư.",
  "mini-apartment": "Không gian riêng tư, phù hợp người đi làm hoặc cặp đôi.",
  "private-house": "Nhà thuê riêng cho nhóm bạn hoặc gia đình nhỏ.",
  "boarding-room": "Danh sách phòng trọ phù hợp nhu cầu thuê dài hạn.",
};

export const publicNavigation = [
  { label: "Trang chủ", href: "/" },
  { label: "Tìm phòng", href: "/rooms" },
  { label: "Phòng đã lưu", href: "/saved-rooms" },
  { label: "Lịch sử liên hệ", href: "/contact-history" },
];

export const roomSearchNavigation: NavigationLink[] = [
  {
    label: "Tất cả phòng",
    href: "/rooms",
    description: "Xem toàn bộ phòng đang hiển thị trên Homi.",
  },
  ...roomTypeOptions.map((option) => ({
    label: option.label,
    href: `/rooms?type=${option.value}`,
    description: roomTypeDescriptions[option.value],
  })),
  {
    label: "Phòng đã lưu",
    href: "/saved-rooms",
    description: "Quay lại các phòng bạn đã lưu để so sánh và liên hệ sau.",
  },
  {
    label: "Lịch sử liên hệ",
    href: "/contact-history",
    description: "Theo dõi các yêu cầu liên hệ và lịch hẹn xem phòng đã gửi.",
  },
];

export const exploreNavigation: NavigationLink[] = [
  {
    label: "Kinh nghiệm thuê phòng",
    href: "/explore/kinh-nghiem-thue-phong",
    description: "Các bước chọn phòng, xem phòng, đọc hợp đồng và đặt cọc an toàn.",
  },
  {
    label: "Mẹo tránh lừa đảo",
    href: "/explore/meo-tranh-lua-dao",
    description: "Nhận biết tin bất thường, ảnh không thật và yêu cầu cọc rủi ro.",
  },
  {
    label: "Khu vực thuê phòng phổ biến",
    href: "/explore/khu-vuc-pho-bien",
    description: "So sánh Cầu Giấy, Đống Đa, Hai Bà Trưng, Thanh Xuân và Nam Từ Liêm.",
  },
  {
    label: "Cẩm nang cho sinh viên, người đi làm",
    href: "/explore/cam-nang-sinh-vien-nguoi-di-lam",
    description: "Gợi ý ưu tiên khác nhau cho sinh viên mới thuê và người đi làm.",
  },
  {
    label: "Checklist trước khi thuê phòng",
    href: "/explore/checklist-truoc-khi-thue",
    description: "Danh sách kiểm tra phòng, chi phí, hợp đồng, gửi xe và quy định trả phòng.",
  },
];

export const supportNavigation: NavigationLink[] = [
  {
    label: "Hướng dẫn tìm phòng",
    href: "/support/huong-dan-tim-phong",
    description: "Các bước tìm kiếm, lọc, lưu phòng và gửi yêu cầu xem phòng.",
  },
  {
    label: "Câu hỏi thường gặp",
    href: "/support/faq",
    description: "Giải đáp nhanh những tình huống phổ biến khi dùng Homi.",
  },
  {
    label: "Báo cáo tin sai",
    href: "/support/bao-cao-tin-sai",
    description: "Gửi mã tin hoặc link bài đăng để đội ngũ Homi kiểm tra.",
  },
  {
    label: "Liên hệ Homi",
    href: "/support/lien-he",
    description: "Gửi câu hỏi hoặc góp ý trực tiếp tới đội ngũ quản trị.",
  },
  {
    label: "Chính sách bảo mật",
    href: "/support/chinh-sach-bao-mat",
    description: "Cách Homi thu thập, sử dụng và bảo vệ dữ liệu người dùng.",
  },
  {
    label: "Điều khoản sử dụng",
    href: "/support/dieu-khoan-su-dung",
    description: "Quy định khi tìm phòng, đăng tin và sử dụng dịch vụ Homi.",
  },
];

export const newsCategoryOptions = [
  "Hướng dẫn thuê phòng",
  "Kinh nghiệm",
  "Thị trường",
  "Thông báo Homi",
];

export const headerNavigation: HeaderNavigationItem[] = [
  { label: "Trang chủ", href: "/" },
  {
    label: "Tìm phòng",
    href: "/rooms",
    description: "Tìm phòng theo loại hình, tiện nghi và ngân sách.",
    children: roomSearchNavigation,
  },
  {
    label: "Khám phá",
    href: "/explore/kinh-nghiem-thue-phong",
    description: "Kinh nghiệm thuê phòng, cảnh báo rủi ro và checklist trước khi chốt phòng.",
    children: exploreNavigation,
  },
  {
    label: "Tin tức",
    href: "/news",
    description: "Cập nhật kinh nghiệm thuê phòng, thị trường và thông báo từ Homi.",
  },
  {
    label: "Hỗ trợ",
    href: "#",
    description: "Hướng dẫn, liên hệ và thông tin an toàn khi thuê phòng.",
    isPlaceholder: true,
    children: supportNavigation,
  },
];

export const accountNavigation = [
  { label: "Đăng nhập", href: "/login" },
  { label: "Đăng ký", href: "/register" },
];

export const adminNavigation = [
  { label: "Tổng quan", href: "/admin" },
  { label: "Quản lý phòng", href: "/admin/rooms" },
  { label: "Quản lý tin tức", href: "/admin/news" },
  { label: "Yêu cầu liên hệ", href: "/admin/contact-requests" },
  { label: "Báo cáo tin đăng", href: "/admin/room-reports" },
  { label: "Hỗ trợ Homi", href: "/admin/support-tickets" },
  { label: "Quản lý người dùng", href: "/admin/users" },
];

export const cmsNavigation = [
  {
    label: "Tổng quan",
    href: "/cms",
    description: "Số liệu nhanh về nội dung Homi.",
  },
  {
    label: "Bài viết",
    href: "/cms/articles",
    description: "Quản lý tin tức, bài viết và bản nháp.",
  },
  {
    label: "Danh mục",
    href: "/cms/categories",
    description: "Tổ chức chủ đề và thứ tự hiển thị.",
  },
  {
    label: "Media",
    href: "/cms/media",
    description: "Quản lý ảnh đại diện và tài nguyên bài viết.",
  },
  {
    label: "Cài đặt",
    href: "/cms/settings",
    description: "Thiết lập quy trình xuất bản nội dung.",
  },
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
