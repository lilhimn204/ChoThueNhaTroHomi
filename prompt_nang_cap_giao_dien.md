# Prompt Nâng Cấp Giao Diện Website Homi

> Bạn có thể copy từng phần prompt bên dưới và paste vào Antigravity khi đã mở folder `frontend` làm workspace.
> Nên thực hiện **từng phần một** để dễ kiểm soát thay đổi.

---

## Prompt 1: Nâng cấp Trang Chủ (Homepage)

```
Hãy nâng cấp giao diện trang chủ (app/page.tsx và components liên quan) của website Homi - website cho thuê phòng trọ Hà Nội. 

Yêu cầu nâng cấp:

1. **Hero Section** (components/rooms/hero-search-section.tsx):
   - Thêm animated gradient background di chuyển nhẹ (CSS animation, không dùng JS nặng)
   - Thêm floating decorative elements (hình tròn blur, dots pattern) tạo chiều sâu
   - Thêm counter animation cho số phòng đang hiển thị (đếm từ 0 lên)
   - Search panel cần có hiệu ứng glow/shine nhẹ khi hover
   - Thêm typing animation cho tagline hoặc subtitle

2. **Featured Rooms Section** (components/rooms/featured-rooms-section.tsx):
   - Thêm hiệu ứng scroll reveal (fade-in khi cuộn đến)
   - Cải thiện section heading với decorative line hoặc icon accent

3. **Phần "Vì sao chọn Homi"** (trong app/page.tsx):
   - Thêm icon animation khi hover (bounce hoặc rotate nhẹ)
   - Thêm số thứ tự hoặc decorative element cho mỗi reason card
   - Cải thiện visual hierarchy với gradient text hoặc highlighted keywords

4. **Phần "Quy trình tìm phòng"**:
   - Thêm connecting line/timeline giữa các bước
   - Thêm progress indicator visual
   - Mỗi bước có icon minh hoạ thay vì chỉ số

5. **Thêm sections mới**:
   - Testimonial section: 2-3 đánh giá mẫu từ người dùng với avatar, tên, nội dung
   - Statistics bar: Số phòng, số quận, số người dùng (animated counters)
   - CTA section cuối trang: Banner kêu gọi đăng ký/tìm phòng

Giữ nguyên design system hiện tại (CSS variables trong globals.css), dark mode phải hoạt động đúng. Dùng Tailwind CSS v4 và lucide-react cho icons. Không thêm thư viện mới.
```

---

## Prompt 2: Nâng cấp Room Card

```
Hãy nâng cấp component RoomCard (components/rooms/room-card.tsx) của website Homi.

Yêu cầu:

1. **Image area**:
   - Thêm image carousel/slider đơn giản (nếu phòng có nhiều ảnh) với dots indicator
   - Thêm gradient overlay đẹp hơn ở phía dưới ảnh
   - Giá hiển thị trực tiếp trên ảnh với badge nổi bật (thay vì trong content area)
   - Thêm hover zoom effect mượt hơn cho ảnh

2. **Content area**:
   - Cải thiện layout thông tin: icon + text xếp gọn hơn, dùng grid 2 cột
   - Amenities hiển thị dạng icon chips thay vì chỉ text badge
   - Thêm "quick info bar" hiển thị: giá | diện tích | quận — nổi bật ngay dưới title

3. **Interactions**:
   - Hover effect: card nâng lên với shadow đẹp hơn, border có glow nhẹ
   - Save button có animation heart khi click
   - Thêm subtle shine/shimmer effect khi hover

4. **Mobile**:
   - Card hiển thị dạng horizontal trên mobile (ảnh bên trái, info bên phải)
   - Hoặc giữ vertical nhưng compact hơn

Giữ nguyên props interface và logic hiện tại. Dùng CSS variables từ globals.css, hỗ trợ dark mode.
```

---

## Prompt 3: Nâng cấp Header & Navigation

```
Hãy nâng cấp SiteHeader (components/layout/site-header.tsx) của website Homi.

Yêu cầu:

1. **Desktop Header**:
   - Thêm hiệu ứng header shrink khi scroll xuống (giảm height, tăng blur)
   - Active link có animated underline (slide-in từ trái sang)
   - Dropdown menu có animation mượt hơn với stagger effect cho các items
   - Thêm search icon/button trên header để quick search

2. **Mobile Menu**:
   - Cải thiện animation: slide từ phải vào thay vì dropdown
   - Thêm user avatar/info ở đầu menu nếu đã đăng nhập
   - Thêm backdrop blur khi menu mở
   - Bottom action buttons (Đăng nhập / Đăng ký) cố định ở cuối menu

3. **Logo area**:
   - Logo có subtle glow/shadow animation
   - Tagline "Tìm phòng Hà Nội" có typing effect hoặc fade cycle

Giữ nguyên logic navigation, auth, và responsive breakpoints. Dùng CSS/Tailwind animations, không thêm thư viện mới.
```

---

## Prompt 4: Nâng cấp Footer

```
Hãy nâng cấp SiteFooter (components/layout/site-footer.tsx) của website Homi. Footer hiện tại quá đơn giản.

Yêu cầu:

1. **Layout**: Chia footer thành 3-4 cột:
   - Cột 1: Logo + mô tả ngắn + địa chỉ
   - Cột 2: Links nhanh (Trang chủ, Tìm phòng, Phòng đã lưu, Tin tức)
   - Cột 3: Hỗ trợ (FAQ, Liên hệ, Chính sách bảo mật, Điều khoản)
   - Cột 4: Liên hệ (email, phone) + social media icons (placeholder)

2. **Design**:
   - Background gradient nhẹ hoặc pattern subtle
   - Decorative top border (gradient line)
   - Hover effects cho links
   - Newsletter signup form nhỏ (chỉ UI, không cần logic)

3. **Bottom bar**:
   - Copyright + "Made with ❤️ by Đào Công Minh"
   - Back to top button

Dùng navigation data từ constants/site.ts. Hỗ trợ dark mode. Responsive: stack thành 2 cột trên tablet, 1 cột trên mobile.
```

---

## Prompt 5: Nâng cấp Trang Đăng Nhập / Đăng Ký

```
Hãy nâng cấp giao diện trang đăng nhập (app/login/page.tsx) và form đăng nhập (components/forms/auth-panel.tsx).

Yêu cầu:

1. **Layout**:
   - Panel trái: Animated illustration hoặc decorative graphics thay vì chỉ text
   - Thêm animated background particles hoặc floating shapes (CSS only)
   - Statistics hiển thị đẹp hơn với animated counters

2. **Form (AuthPanel)**:
   - Input fields có floating labels (label di chuyển lên trên khi focus)
   - Password field có show/hide toggle
   - Submit button có loading state animation (spinner + text thay đổi)
   - Thêm divider "hoặc" đẹp giữa form và Google login
   - Google login button theo Material Design

3. **Interactions**:
   - Form validation hiển thị inline, đẹp mắt
   - Success animation khi đăng nhập thành công
   - Smooth transition giữa Login ↔ Register mode

Giữ nguyên auth logic. Hỗ trợ dark mode.
```

---

## Prompt 6: Nâng cấp Trang Danh Sách Phòng

```
Hãy nâng cấp trang danh sách phòng (app/rooms/page.tsx, components/rooms/rooms-page-client.tsx, components/rooms/filter-sidebar.tsx).

Yêu cầu:

1. **Filter Sidebar**:
   - Thêm range slider cho giá thuê và diện tích (CSS custom slider)
   - Filter chips có animation khi thêm/xoá
   - Active filters hiển thị dạng removable chips ở trên danh sách
   - Collapse/expand animation cho các nhóm filter

2. **Rooms Grid**:
   - Toggle giữa Grid view (hiện tại) và List view
   - Thêm sort dropdown đẹp hơn với custom styled select
   - Skeleton loading animation khi đang tải
   - Empty state illustration khi không tìm thấy phòng
   - Results count: "Tìm thấy X phòng" với highlight animation

3. **Pagination**:
   - Cải thiện pagination UI đẹp hơn
   - Smooth scroll to top khi chuyển trang

4. **Map integration** (nếu có thời gian):
   - Toggle giữa danh sách và bản đồ
   - Map pins hiển thị giá phòng

Giữ nguyên data fetching logic. Dùng CSS variables và Tailwind. Hỗ trợ dark mode và responsive.
```

---

## Prompt 7: Thêm Scroll Animations toàn trang

```
Hãy thêm scroll-triggered animations cho toàn bộ website Homi bằng Intersection Observer API (không thêm thư viện).

Yêu cầu:

1. Tạo custom hook `useScrollReveal` hoặc component `<ScrollReveal>`:
   - Fade in + slide up khi element vào viewport
   - Configurable: direction (up/left/right), delay, duration
   - Trigger một lần (không repeat khi scroll lại)

2. Áp dụng cho:
   - Tất cả section headings
   - Cards trong danh sách (stagger effect: card 1 trước, card 2 sau 50ms...)
   - Statistics/counters
   - Testimonials
   - Footer sections

3. CSS classes cần thêm vào globals.css:
   - `.reveal` — state trước khi hiện (opacity: 0, translateY: 20px)
   - `.reveal.visible` — state hiện (opacity: 1, translateY: 0)
   - `.reveal-left`, `.reveal-right` — slide từ trái/phải

4. Tôn trọng `prefers-reduced-motion`: tắt animation nếu user chọn giảm motion.

Đặt hook trong folder hooks/. Không dùng thư viện bên ngoài như framer-motion hay AOS.
```

---

## Prompt 8: Nâng cấp Chi Tiết Phòng

```
Hãy nâng cấp trang chi tiết phòng (components/rooms/room-detail-client.tsx).

Yêu cầu:

1. **Image Gallery**:
   - Lightbox khi click vào ảnh (fullscreen overlay với next/prev)
   - Thumbnail strip bên dưới ảnh chính
   - Image counter "1/5" overlay
   - Swipe gesture trên mobile

2. **Room Info Layout**:
   - Sticky sidebar bên phải chứa: giá, nút liên hệ, thông tin chủ trọ
   - Content bên trái: mô tả, tiện ích, vị trí
   - Breadcrumb navigation ở trên

3. **Amenities**:
   - Hiển thị dạng icon grid đẹp thay vì list text
   - Mỗi amenity có icon riêng (wifi, điều hoà, máy giặt...)
   - Hover tooltip hiển thị mô tả chi tiết

4. **Contact section**:
   - Form liên hệ trong card nổi bật
   - Hiển thị số điện thoại với click-to-call
   - Nút "Lưu phòng" với heart animation

5. **Related rooms**:
   - Section "Phòng tương tự" ở cuối trang
   - Horizontal scroll carousel

Giữ nguyên data fetching. Không thêm thư viện mới. Hỗ trợ dark mode.
```

---

## ⚡ Tips khi dùng prompt

1. **Paste từng prompt một** — không paste tất cả cùng lúc
2. **Kiểm tra sau mỗi prompt** — chạy `npm install && npm run dev` để xem kết quả
3. **Nếu có lỗi** — copy lỗi và paste vào Antigravity để sửa
4. **Thứ tự khuyến nghị**: Prompt 7 (scroll animations) → Prompt 1 (trang chủ) → Prompt 2 (room card) → Prompt 3 (header) → Prompt 4 (footer) → Prompt 6 (trang phòng) → Prompt 5 (đăng nhập) → Prompt 8 (chi tiết phòng)
5. **Trước khi bắt đầu**: Nhớ chạy `npm install` trong folder frontend để có lại node_modules
