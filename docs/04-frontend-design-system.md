# Frontend Design System Notes

Frontend Homi dùng Next.js App Router, React, TypeScript và Tailwind CSS. Giao diện hướng tới sản phẩm tìm phòng: rõ ràng, dễ quét thông tin, hỗ trợ light/dark mode và responsive.

## 1. Nguyên tắc UI

- Form có label, validate, loading, success/error.
- Button có hover/focus/active state.
- Card phòng ưu tiên ảnh, giá, khu vực, trạng thái và CTA.
- Admin/CMS ưu tiên bảng, filter, action rõ.
- Mobile menu phải hiển thị đầy đủ các dropdown: Tìm phòng, Khám phá, Tin tức, Hỗ trợ.
- Không đặt text quá lớn trong panel nhỏ.

## 2. Navigation

Nguồn dữ liệu điều hướng nằm ở `frontend/constants/site.ts`:

- `headerNavigation`
- `roomSearchNavigation`
- `exploreNavigation`
- `supportNavigation`
- `adminNavigation`
- `cmsNavigation`
- `hostNavigation`

Khi sửa menu, ưu tiên sửa constant chung thay vì hard-code trong component.

## 3. Room type UI

Các option tìm phòng:

- Tất cả phòng.
- Cho thuê căn hộ chung cư.
- Cho thuê chung cư mini, căn hộ dịch vụ.
- Cho thuê nhà riêng.
- Cho thuê nhà trọ, phòng trọ.
- Phòng đã lưu.
- Lịch sử liên hệ.

Frontend query dùng:

- `apartment`
- `mini-apartment`
- `private-house`
- `boarding-room`

## 4. Auth UI

- Login/register có nút Google thống nhất.
- Register local chuyển sang bước nhập OTP.
- Forgot password có bước gửi OTP và reset password.
- Profile có 2 tab: chỉnh sửa thông tin và cài đặt tài khoản.

## 5. Admin/CMS UI

- Admin sidebar có các mục quản lý chính.
- Admin có nút mở CMS cho role admin.
- CMS có layout riêng cho bài viết, danh mục, media, settings.

## 6. Kiểm tra UI

Khi sửa UI nên kiểm tra:

- Desktop 1440px.
- Tablet.
- Mobile.
- Light/dark mode.
- Empty state.
- Loading/error state.
