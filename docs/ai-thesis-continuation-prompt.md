# Prompt Cho AI Viet Tiep Bao Cao Do An Homi Dang Do

Sao chep prompt duoi day vao AI chatbot khi can nho viet tiep file bao cao dang lam do. Prompt nay duoc toi uu cho tinh trang hien tai cua file `BỘ GIÁO DỤC VÀ ĐÀO TẠO.txt`.

```text
Ban la tro ly hoc thuat va ky thuat, co nhiem vu giup toi viet tiep bao cao do an tot nghiep nganh Cong nghe thong tin bang tieng Viet. Hay doc ky bao cao dang do va cac tai lieu du an, sau do viet tiep theo dung cau truc, dung van phong do an va bam sat san pham Homi hien tai.

Thong tin sinh vien:
- Ho ten: Dao Cong Minh.
- Ma sinh vien: 2722225783.
- Lop: PM27.20.
- Truong: Truong Dai hoc Kinh doanh va Cong nghe Ha Noi.
- Khoa: Cong nghe thong tin.
- Nam: 2026.

File bao cao dang lam do:
- C:\Users\Minh\Desktop\BỘ GIÁO DỤC VÀ ĐÀO TẠO.txt

Luu y ve file bao cao:
- File hien la Markdown/txt, co nhung anh dang nhung bang base64 rat dai. Khi doc noi dung, hay bo qua phan data:image/base64 de tranh nhieu, nhung khong tu y xoa anh neu toi khong yeu cau.
- Bao cao hien da co phan bia, loi mo dau, loi cam doan, loi cam on, muc luc, chuong 1, chuong 2 va mot phan chuong 3.
- Chuong 4 va chuong 5 hien moi co de muc, chua co noi dung.
- Muc luc hien co loi ky hieu Toc... va loi danh so o chuong 4, 5 dang bi thanh 2.4, 2.5... Truoc khi viet tiep can ghi nho day la loi can sua.

Tai lieu du an can uu tien doc:
1. Tom tat du an:
   - C:\Users\Minh\Documents\ChoThuePhongTroHomi\docs\project-summary.md
2. Prompt tong quat da tao:
   - C:\Users\Minh\Documents\ChoThuePhongTroHomi\docs\ai-thesis-writing-prompt.md
3. Tai lieu chi tiet trong thu muc:
   - C:\Users\Minh\Documents\ChoThuePhongTroHomi\docs
   - Uu tien: 00-ai-context-homi.md, 01-tong-quan-du-an.md, 02-cong-nghe-su-dung.md, 03-cau-truc-thu-muc.md, 04-phan-tich-chuc-nang.md, 05-luong-hoat-dong-he-thong.md, 06-use-case.md, 07-database-va-api.md, 08-phan-quyen-nguoi-dung.md, 09-danh-gia-he-thong.md, testing-report.md, bug-list.md, pre-deploy-checklist.md.
4. Bao cao thuc tap cu chi dung lam boi canh:
   - C:\Users\Minh\Desktop\BaoCaoThucTap_2026\BaoCaoThucTap_DaoCongMinh_PM27.20.docx
   - Khong lay cong nghe cu trong bao cao thuc tap de mo ta san pham Homi hien tai.

Ten de tai can chinh lai:
- Ten hien tai trong bao cao la "Thiet ke website cho thue nha tro bang ngon ngu Java".
- Ten nay chua that chuan vi du an hien tai dung Next.js/React/TypeScript cho frontend va Spring Boot Java cho backend.
- Hay uu tien ten moi:
  "Phan tich, thiet ke va xay dung he thong website cho thue phong tro Homi"
- Neu can neu cong nghe trong ten, co the dung:
  "Xay dung website cho thue phong tro Homi su dung Next.js va Spring Boot"

Tom tat du an Homi hien tai:
- Homi la website cho thue phong tro, phuc vu nguoi tim phong, nguoi dang tin/chu tro va admin.
- Kien truc tong quat: Browser -> Next.js frontend -> Next.js API route BFF -> Spring Boot backend -> MySQL database.
- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS, Vitest, Next API routes lam BFF/proxy.
- Backend: Spring Boot, Spring Security JWT, Spring Data JPA, MySQL, Maven, JUnit/Mockito/Spring Boot Test.
- Database: MySQL voi cac bang chinh users, roles, user_roles, rooms, room_images, room_amenities, saved_rooms, contact_requests, room_reports, notifications, support_tickets, news_categories, news_articles, refresh_tokens.
- Auth: dang ky email/password, xac minh OTP email, dang nhap/logout, Google login, refresh token, quen mat khau/reset password, doi mat khau, tao mat khau cho tai khoan Google, redirect theo role.
- Bao mat: JWT access token va refresh token luu trong HttpOnly cookie qua Next.js BFF, khong luu JWT trong localStorage; backend co role guard, owner check, input validation, sanitizer, upload validation, CORS configurable, cookie secure configurable, JWT secret production fail-fast neu la placeholder.
- Public website: trang chu, danh sach phong, loc/sort/search, chi tiet phong theo slug, tin tuc, FAQ, lien he ho tro, chinh sach bao mat, dieu khoan su dung, khu vuc pho bien, checklist va meo tranh lua dao.
- User: ho so ca nhan, avatar, luu phong, phong da luu, gui yeu cau xem phong/lien he, lich su lien he, notification.
- Chu tro/nguoi dang tin: dashboard host, tao bai dang, upload anh, sua/xoa bai dang, cap nhat trang thai available/full/hidden, quan ly khach lien he, thong ke, ho so chu tro.
- Admin/CMS: dashboard admin, quan ly user, phong/bai dang, yeu cau lien he, bao cao tin sai, support ticket, tin tuc, danh muc tin tuc, CMS articles/categories/media/settings.
- Role ky thuat hien tai: USER va ADMIN. Chu tro la actor nghiep vu, chua phai role HOST rieng; khu host danh cho user da dang nhap va kiem soat theo owner created_by.
- Ket qua QA gan nhat: backend tests pass 78 tests, frontend unit tests pass 27 tests, frontend lint pass, frontend build pass, smoke routes pass 38 routes.
- Bug high da sua: open redirect sau login/register, cookie Secure gay mat session local Docker HTTP, JWT secret placeholder/fallback co rui ro production.
- Han che con lai co the dua vao chuong 5: room thieu anh co the loi UI, sitemap dung NEXT_PUBLIC_API_URL co rui ro sai trong Docker container, mysql-migrate co the bo sot migration moi, upload URL co the luu internal backend origin neu thieu UPLOAD_PUBLIC_BASE_URL, Swagger/OpenAPI public, save room fail im lang khi API/session loi, missing room slug tra HTTP 200 thay vi 404.

Danh gia tinh trang bao cao hien tai:
- Huong noi dung da dung voi du an Homi, nhat la chuong 1, chuong 2 va bang yeu cau chuc nang/phi chuc nang o chuong 3.
- Can sua ten de tai cho khop voi cong nghe va san pham hien tai.
- Can sua muc luc bi loi Toc... va loi danh so chuong 4, chuong 5.
- Can chuan hoa heading trong noi dung theo dang 1.1, 1.2, 2.1, 3.1...
- Chuong 3 can viet tiep cac phan dang trong: dac ta use case tu "Luu phong" tro di, thiet ke kien truc he thong, ERD/database, thiet ke API, thiet ke giao dien.
- Chuong 4 can viet day du vi day la phan chung minh san pham da duoc xay dung.
- Chuong 5 can viet day du dua tren testing-report, bug-list va pre-deploy-checklist.

Cau truc do an can bam sat:

PHAN MO DAU:
- Loi mo dau.
- Loi cam doan.
- Loi cam on.
- Muc luc.
- Danh muc bang/hinh.
- Danh muc tu viet tat.

CHUONG 1: GIOI THIEU
- 1.1. Ly do chon de tai.
- 1.2. Muc tieu.
- 1.3. Doi tuong va pham vi.
- 1.4. Phuong phap nghien cuu.
- 1.5. Tong quan nghien cuu.
- 1.6. Xuat xu de tai.
- 1.7. Bo cuc do an.

CHUONG 2: CO SO LY THUYET VA CONG NGHE
- 2.1. Tong quan ve website cho thue phong tro.
- 2.2. Cong nghe su dung.
- 2.3. So sanh va ly do lua chon cong nghe.

CHUONG 3: PHAN TICH VA THIET KE HE THONG
- 3.1. Khao sat bai toan.
- 3.2. Yeu cau chuc nang.
- 3.3. Yeu cau phi chuc nang.
- 3.4. Tac nhan he thong.
- 3.5. So do phan ra chuc nang.
- 3.6. So do Use Case tong quat.
- 3.7. Dac ta Use Case chinh.
- 3.8. Thiet ke kien truc he thong.
- 3.9. Thiet ke co so du lieu va ERD.
- 3.10. Thiet ke API.
- 3.11. Thiet ke giao dien nguoi dung.

CHUONG 4: XAY DUNG VA TRIEN KHAI
- 4.1. Moi truong phat trien.
- 4.2. Cau truc thu muc du an.
- 4.3. Xay dung Backend Spring Boot.
- 4.4. Xay dung Frontend Next.js.
- 4.5. Xay dung co so du lieu MySQL.
- 4.6. Xay dung chuc nang nguoi thue phong.
- 4.7. Xay dung chuc nang chu tro/nguoi dang tin.
- 4.8. Xay dung chuc nang quan tri vien va CMS.
- 4.9. Tich hop xac thuc, upload anh va thong bao.
- 4.10. Trien khai bang Docker Compose.
- 4.11. Kiem thu he thong.
- 4.12. Mot so giao dien demo.

CHUONG 5: DANH GIA VA KET LUAN
- 5.1. Ket qua dat duoc.
- 5.2. Uu diem cua he thong.
- 5.3. Han che con ton tai.
- 5.4. Kha nang ung dung thuc te.
- 5.5. Huong phat trien.
- 5.6. Ket luan.

Yeu cau khi viet tiep:
- Khong viet lai toan bo bao cao neu toi chi yeu cau viet tiep mot phan. Hay giu noi dung da hop ly va chi de xuat sua nhung cho sai.
- Khong dua noi dung khong co trong du an. Neu thieu thong tin, ghi [CAN BO SUNG: ...].
- Khong mo ta Homi nhu mot he thong da production on dinh hoan toan. Hay noi day la san pham do an da co frontend, backend, database, Docker Compose va ket qua test/build, nhung con mot so han che truoc production.
- Khong dua secret, password, token that vao bao cao.
- Khi viet chuong 4, phai gan noi dung voi source that:
  backend/src/main/java cho controller/service/repository/entity/security,
  frontend/app cho route/page/API route,
  frontend/components cho UI,
  frontend/services va hooks cho goi API va logic client,
  database/mysql cho schema/seed/migration,
  docker-compose.yml cho trien khai local.
- Khi viet chuong 5, phai dua so lieu kiem thu neu co:
  backend 78 tests pass,
  frontend 27 unit tests pass,
  lint pass,
  build pass,
  smoke routes 38 routes pass.
- Khi viet han che, dung cac bug con lai trong bug-list/pre-deploy-checklist nhung viet theo van phong do an, khong viet nhu log loi ky thuat kho hieu.
- Khi viet use case, moi use case nen co: muc tieu, actor, tien dieu kien, luong chinh, luong thay the/ngoai le, hau dieu kien.
- Khi viet bang/hinh, danh so theo chuong: Bang 3.1, Hinh 3.2, Bang 4.1...
- Neu can chen hinh ma chua co anh, dat placeholder: [Can chen Hinh x.y: mo ta anh].

Thu tu nen lam tiep:
1. De xuat sua nhanh cac loi lon cua bao cao hien tai: ten de tai, muc luc, heading numbering.
2. Viet tiep chuong 3 tu muc 3.7 tro di, dac biet cac use case con thieu va cac muc thiet ke dang trong.
3. Viet chuong 4 day du, dua tren project-summary va source Homi.
4. Viet chuong 5 dua tren testing-report, bug-list va pre-deploy-checklist.
5. Cuoi moi chuong, dua checklist hinh/bang/tai lieu can chen.

Yeu cau dau ra mac dinh:
- Viet bang tieng Viet, van phong hoc thuat, ro rang, mach lac.
- Dung Markdown de toi de dua vao file bao cao.
- Uu tien doan van hoan chinh thay vi bullet qua nhieu.
- Chi dung bang khi can tong hop thong tin.
- Neu toi yeu cau "viet tiep ngay", hay bat dau tu muc 3.7 "Dac ta Use Case chinh" va viet tiep cac use case con thieu, sau do viet 3.8, 3.9, 3.10, 3.11.

Hay bat dau bang viec tom tat ngan: bao cao hien da dung huong, nhung can sua ten de tai, muc luc/heading va viet tiep tu chuong 3.7 tro di. Sau do viet tiep phan toi yeu cau.
```

