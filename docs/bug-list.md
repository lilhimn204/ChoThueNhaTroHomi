# Homi Bug List

Ngay cap nhat: 2026-05-10

| ID | Severity | Trang thai | Khu vuc | Tom tat |
| --- | --- | --- | --- | --- |
| H-01 | High | Fixed | Auth frontend | Redirect sau login/register nhan query `redirect` khong validate. |
| H-02 | High | Fixed | Auth cookie / Docker | Next BFF dat cookie `Secure` theo `NODE_ENV=production`, lam local Docker HTTP khong giu session. |
| H-03 | High | Fixed | JWT/security config | JWT secret co fallback/hardcode placeholder, production co the chay voi secret biet truoc neu env sai. |
| M-01 | Medium | Open | Rooms UI | Bai dang khong co anh/thumbnail co the lam loi room card/detail. |
| M-02 | Medium | Open | SEO | Sitemap runtime dung `NEXT_PUBLIC_API_URL`, sai trong frontend Docker container. |
| M-03 | Medium | Open | Database migration | `mysql-migrate` bo sot `21_support_ticket_notifications.sql`. |
| M-04 | Medium | Open | Upload / SEO | Upload URL co the luu internal backend origin neu thieu `UPLOAD_PUBLIC_BASE_URL`. |
| M-05 | Medium | Open | Backend security | OpenAPI/Swagger public va chua tat trong profile production. |
| L-01 | Low | Open | Saved rooms UX | Save room fail im lang khi API/session loi. |
| L-02 | Low | Open | SEO / dynamic route | Missing room slug tra HTTP 200 thay vi 404, tao soft-404. |

## Chi tiet reproduce va goi y fix

Chi tiet reproduce, anh huong va goi y fix nam trong `docs/testing-report.md`.

## Fix update 2026-05-10

- `H-01`: Da them safe internal redirect helper va unit test.
- `H-02`: Da them `AUTH_COOKIE_SECURE` cho Next BFF cookie va Docker local default `false`.
- `H-03`: Da fail-fast JWT placeholder khi active profile la `prod`/`production`, va Docker Compose bat buoc truyen `JWT_SECRET`.
