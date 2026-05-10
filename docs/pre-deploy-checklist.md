# Homi Pre-deploy Checklist

Ngay cap nhat: 2026-05-10

## QA completed in this pass

- [x] Backend tests pass: `cd backend && .\mvnw.cmd test`.
- [x] Frontend lint pass: `cd frontend && npm run lint`.
- [x] Frontend unit tests pass: `cd frontend && npm run test`.
- [x] Frontend production build pass: `cd frontend && npm run build`.
- [x] Smoke routes pass: `cd frontend && npm run test:smoke`.
- [x] Core auth E2E pass: login/logout/session/me/role denial.
- [x] User API flow pass: search/filter, room detail, save room, contact request, self-contact block.
- [x] Host API flow pass: create/edit/status/delete room, dashboard/customers.
- [x] Admin/CMS API flow pass: dashboard, users, support tickets, news categories.
- [x] Public content route smoke pass: news, FAQ/support/static policy/explore pages.
- [x] API authorization checked directly for unauth admin/host backend and BFF endpoints.
- [x] SEO runtime smoke checked: sitemap, robots, dynamic room title for existing slug.

## Required fixes before production

- [x] Fix `H-01`: validate login/register `redirect` to internal paths only.
- [x] Fix `H-02`: make frontend auth cookie secure flag environment-aware, not only `NODE_ENV`.
- [x] Fix `H-03`: remove JWT placeholder fallback for production and fail-fast on known placeholder values.
- [ ] Fix or accept with documented risk `M-01`: require room images or safe placeholder fallback.
- [ ] Fix `M-02`: make sitemap server fetch use `BACKEND_URL`.
- [ ] Fix `M-03`: include migration 21 or auto-run all migrations in order.
- [ ] Fix `M-04`: set `UPLOAD_PUBLIC_BASE_URL` or return stable public upload paths.
- [ ] Fix/protect `M-05`: disable or restrict Swagger/OpenAPI in production.
- [ ] Fix/accept `L-01`: show save-room API/session failure to user.
- [ ] Fix/accept `L-02`: return real 404 for missing dynamic room slug.

## Not yet fully tested

- [ ] Google login tested if `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` are configured.
- [ ] SMTP/OTP tested if `APP_MAIL_ENABLED=true`.
- [ ] Register OTP and forgot/reset password tested end-to-end with real email delivery.
- [ ] UI responsive checked manually or with browser automation on mobile/tablet/desktop.
- [ ] Dark mode checked visually for contrast, buttons, cards, forms, modals/dropdowns.
- [ ] Upload invalid file type/oversize checked via browser/API E2E.
- [ ] Lighthouse/Web Vitals or equivalent performance pass.

## Production environment

- [ ] `JWT_SECRET` is strong, unique, and not a placeholder.
- [ ] HTTPS is enabled.
- [ ] Auth cookie secure config matches HTTPS production.
- [ ] `CORS_ALLOWED_ORIGINS` only includes trusted frontend origins.
- [ ] `NEXT_PUBLIC_SITE_URL` is the production domain.
- [ ] `BACKEND_URL` is reachable by Next server runtime.
- [ ] `NEXT_PUBLIC_API_URL` is reachable by browsers.
- [ ] `UPLOAD_PUBLIC_BASE_URL` points to the public production domain or uploads return stable public paths.
- [ ] MySQL backup exists before deploy.
- [ ] All DB migrations through the latest file are applied.
- [ ] Logs do not expose OTP, JWT, passwords, or secrets.
- [ ] Swagger/OpenAPI is disabled or access-controlled in production.
