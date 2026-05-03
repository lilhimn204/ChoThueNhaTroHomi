export type AmenityCategory = "ROOM" | "BUILDING" | "SERVICE";
export type RoomStatus = "AVAILABLE" | "FULL" | "HIDDEN";
export type UserRole = "USER" | "ADMIN";
export type AuthProvider = "LOCAL" | "GOOGLE";
export type RoomType =
  | "apartment"
  | "mini-apartment"
  | "private-house"
  | "boarding-room";
export type UserStatus = "ACTIVE" | "INACTIVE" | "LOCKED";
export type ContactRequestStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CANCELLED";
export type ContactRequestType = "CONTACT" | "VIEWING";
export type RoomReportReason =
  | "WRONG_INFO"
  | "DUPLICATE"
  | "SCAM"
  | "UNAVAILABLE"
  | "INAPPROPRIATE"
  | "OTHER";
export type RoomReportStatus = "NEW" | "REVIEWING" | "RESOLVED" | "DISMISSED";
export type SupportTicketType = "ROOM_REPORT" | "CONTACT";
export type SupportTicketStatus = "NEW" | "REVIEWING" | "RESOLVED" | "DISMISSED";
export type NewsArticleStatus = "DRAFT" | "PUBLISHED";

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl?: string | null;
  address?: string | null;
  hostBio?: string | null;
  emailVerified: boolean;
  authProvider: AuthProvider;
  status: UserStatus;
  enabled: boolean;
  lockReason?: string | null;
  lockedAt?: string | null;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface District {
  id: number;
  name: string;
  slug: string;
  cityName: string;
}

export interface Amenity {
  id: number;
  name: string;
  slug: string;
  category: AmenityCategory;
  iconKey: string;
}

export interface RoomImage {
  id: number;
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isThumbnail: boolean;
}

export interface RoomSummary {
  id: number;
  listingCode: string;
  slug: string;
  title: string;
  districtName: string;
  address: string;
  price: number;
  area: number;
  roomType: RoomType;
  status: RoomStatus;
  thumbnail: string;
  featured: boolean;
  postedAt: string;
  highlightAmenities: string[];
}

export interface RoomStats {
  visibleRooms: number;
  availableRooms: number;
  availableRate: number;
}

export interface Room {
  id: number;
  ownerId?: number | null;
  listingCode: string;
  slug: string;
  title: string;
  description: string;
  address: string;
  districtId: number;
  districtName: string;
  cityName: string;
  price: number;
  area: number;
  roomType: RoomType;
  contactName: string;
  contactPhone: string;
  status: RoomStatus;
  thumbnail: string;
  featured: boolean;
  amenities: Amenity[];
  images: RoomImage[];
  postedAt: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactRequest {
  id: number;
  roomId: number;
  roomTitle: string;
  roomSlug: string;
  requesterName: string;
  email: string;
  phone: string;
  message: string;
  preferredViewingTime: string;
  requestType: ContactRequestType;
  status: ContactRequestStatus;
  adminNote?: string;
  handledAt?: string;
  createdAt: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  authProvider: AuthProvider;
  passwordConfigured: boolean;
  roles: string[];
  status: "ACTIVE" | "INACTIVE" | "LOCKED";
  enabled?: boolean;
  createdAt?: string;
}

export interface AdminStat {
  label: string;
  value: string;
  change: string;
  tone: "brand" | "success" | "warning" | "neutral";
}

export interface AdminRoomListItem {
  id: number;
  listingCode: string;
  title: string;
  slug: string;
  districtName: string;
  price: number;
  area: number;
  roomType: RoomType;
  status: RoomStatus;
  featured: boolean;
  contactName: string;
  postedAt: string;
  createdAt: string;
}

export interface AdminRoom extends Room {
  districtId: number;
}

export interface AdminContactRequest {
  id: number;
  roomId: number;
  roomTitle: string;
  roomSlug: string;
  userId: number | null;
  requesterName: string;
  email: string;
  phone: string;
  requestType: ContactRequestType;
  message: string;
  preferredViewingTime: string;
  status: ContactRequestStatus;
  adminNote?: string;
  handledByName?: string;
  handledAt?: string;
  createdAt: string;
}

export interface RoomReport {
  id: number;
  roomId: number;
  roomTitle: string;
  roomSlug: string;
  reporterId: number;
  reporterName: string;
  reporterEmail: string;
  reason: RoomReportReason;
  details?: string;
  status: RoomReportStatus;
  adminNote?: string;
  handledByName?: string;
  handledAt?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: number;
  type: SupportTicketType;
  listingReference?: string | null;
  reason?: string | null;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  adminNote?: string | null;
  handledByName?: string | null;
  handledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  summary: string;
  content: string;
  thumbnailUrl?: string | null;
  featured: boolean;
  category: string;
  status: NewsArticleStatus;
  publishedAt?: string | null;
  authorName: string;
  createdByName?: string | null;
  updatedByName?: string | null;
  lastEditedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  displayOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HostContactRequest {
  id: number;
  roomId: number;
  roomTitle: string;
  roomSlug: string;
  requesterName: string;
  email: string;
  phone: string;
  requestType: ContactRequestType;
  message: string;
  preferredViewingTime: string;
  status: ContactRequestStatus;
  note?: string;
  handledByName?: string;
  handledAt?: string;
  createdAt: string;
}

export interface HostDashboard {
  userId: number;
  fullName: string;
  totalPosts: number;
  availablePosts: number;
  closedOrHiddenPosts: number;
  hiddenPosts: number;
  totalContactRequests: number;
  recentContactRequests: HostContactRequest[];
}

export interface HostRoomListItem {
  id: number;
  listingCode: string;
  title: string;
  slug: string;
  districtName: string;
  price: number;
  area: number;
  roomType: RoomType;
  status: RoomStatus;
  thumbnail: string;
  contactRequestCount: number;
  postedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface HostRoom {
  id: number;
  listingCode: string;
  title: string;
  slug: string;
  description: string;
  address: string;
  districtId: number;
  districtName: string;
  price: number;
  area: number;
  roomType: RoomType;
  contactName: string;
  contactPhone: string;
  status: RoomStatus;
  thumbnail: string;
  amenities: Amenity[];
  images: RoomImage[];
  postedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface HostProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  address: string;
  hostBio: string;
  createdAt: string;
}

export interface DashboardRecentRoom {
  id: number;
  listingCode?: string;
  title: string;
  slug: string;
  districtName: string;
  price: number;
  status: RoomStatus;
  postedAt?: string;
  createdAt: string;
}

export interface DashboardRecentContactRequest {
  id: number;
  requesterName: string;
  roomTitle: string;
  status: ContactRequestStatus;
  createdAt: string;
}

export interface DashboardSummary {
  totalRooms: number;
  availableRooms: number;
  totalUsers: number;
  pendingRequests: number;
  totalContactRequests: number;
  recentRooms: DashboardRecentRoom[];
  recentRequests: DashboardRecentContactRequest[];
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMinutes: number;
  refreshExpiresInMinutes: number;
  user: UserProfile;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ChartItem {
  name: string;
  value: number;
}

export interface DashboardCharts {
  roomsByDistrict: ChartItem[];
  requestsByStatus: ChartItem[];
  roomsByStatus: ChartItem[];
}

export interface AppNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  targetUrl: string;
  read: boolean;
  createdAt: string;
}

export interface ApiErrorResponse {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  fieldErrors?: ApiFieldError[];
}
