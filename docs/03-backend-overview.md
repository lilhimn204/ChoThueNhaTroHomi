# Rental Room Website - Step 3 Backend Overview

## Backend stack

- Spring Boot 3.5.x
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- Springdoc OpenAPI / Swagger UI
- TwelveMonkeys ImageIO WebP plugin
- MySQL
- Maven Wrapper

## Project structure

- `controller`
  - REST API endpoints
- `service`
  - business logic
- `repository`
  - JPA data access
- `entity`
  - database entities and enums
- `dto`
  - request/response models
- `config`
  - app properties and security config
- `security`
  - JWT filter, user principal, auth handlers
- `exception`
  - global error handling
- `util`
  - helper utilities such as slug generation

## Main modules completed

- Auth
  - register
  - login
- Public room APIs
  - room listing with search, filter, sort, pagination
  - featured rooms
  - room detail
- Lookup APIs
  - districts
  - amenities
- User APIs
  - view own profile
  - update own profile
  - change own password
- Saved room APIs
  - save / unsave a room
  - list saved rooms
  - check saved status
- Contact request APIs
  - create request
  - view own request history
- Room report APIs
  - create report for a listing
  - admin search and status update
- Notification APIs
  - list notifications
  - unread count
  - mark read / read all
  - optional async email notification when SMTP is configured
- Host APIs
  - dashboard
  - manage own rooms
  - manage contact requests for own rooms
  - update host profile
- Admin APIs
  - dashboard summary
  - room management
  - user management
  - contact request management

## API documentation

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- OpenAPI YAML: `http://localhost:8080/v3/api-docs.yaml`
- Authenticated endpoints are documented with the `homiCookieAuth` cookie security scheme.
- For local demo, call `POST /api/v1/auth/login` from Swagger UI first; the backend will set the HttpOnly `homi_token` cookie for later authenticated calls on the same backend origin.

## Endpoint summary

### Public

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/districts`
- `GET /api/v1/amenities`
- `GET /api/v1/rooms`
- `GET /api/v1/rooms/featured`
- `GET /api/v1/rooms/{slug}`

### Authenticated user

- `GET /api/v1/users/me`
- `PUT /api/v1/users/me`
- `PUT /api/v1/users/me/password`
- `POST /api/v1/contact-requests`
- `GET /api/v1/contact-requests/me`
- `POST /api/v1/room-reports`
- `POST /api/v1/saved-rooms/{roomId}`
- `GET /api/v1/saved-rooms`
- `GET /api/v1/saved-rooms/{roomId}/status`
- `GET /api/v1/saved-rooms/batch`
- `GET /api/v1/notifications`
- `GET /api/v1/notifications/unread-count`
- `PATCH /api/v1/notifications/{id}/read`
- `PATCH /api/v1/notifications/read-all`
- `POST /api/v1/uploads/rooms`
- `POST /api/v1/uploads/avatars`

### Host

- `GET /api/v1/host/dashboard`
- `GET /api/v1/host/rooms`
- `GET /api/v1/host/rooms/{roomId}`
- `POST /api/v1/host/rooms`
- `PUT /api/v1/host/rooms/{roomId}`
- `PATCH /api/v1/host/rooms/{roomId}/status`
- `DELETE /api/v1/host/rooms/{roomId}`
- `GET /api/v1/host/contact-requests`
- `PATCH /api/v1/host/contact-requests/{requestId}/status`
- `GET /api/v1/host/profile`
- `PUT /api/v1/host/profile`

### Admin

- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/rooms`
- `GET /api/v1/admin/rooms/{roomId}`
- `POST /api/v1/admin/rooms`
- `PUT /api/v1/admin/rooms/{roomId}`
- `PATCH /api/v1/admin/rooms/{roomId}/status`
- `DELETE /api/v1/admin/rooms/{roomId}`
- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/{userId}/status`
- `GET /api/v1/admin/contact-requests`
- `PATCH /api/v1/admin/contact-requests/{requestId}/status`
- `GET /api/v1/admin/room-reports`
- `PATCH /api/v1/admin/room-reports/{reportId}/status`

## Current notes

- Backend uses `JWT` with `USER` and `ADMIN` roles.
- JWT access token and opaque refresh token are stored in separate HttpOnly cookies. `COOKIE_SECURE=false` is used for local HTTP; production should run with `SPRING_PROFILES_ACTIVE=prod` and `COOKIE_SECURE=true` over HTTPS.
- Refresh tokens are stored in the database as SHA-256 hashes, rotated on refresh, and revoked on logout.
- Normal `USER` accounts can use the host area; ownership is enforced by `createdById`.
- CORS is configurable by environment variable.
- `application.yml` is set for local MySQL by default. `application-prod.yml` switches JPA schema handling to `validate` so production depends on SQL migrations instead of `ddl-auto: update`.
- Notifications for a new contact request query admin users by role directly instead of loading all users and filtering in memory.
- Lookup endpoints for districts and amenities use Spring cache because the data changes rarely.
- Tests currently run with `H2` in memory so build verification does not depend on a local MySQL instance.
- Room/avatar uploads are normalized to JPEG output. PNG transparency is flattened onto a white background, and WEBP input is supported through the ImageIO WebP plugin.

## Current frontend status

The frontend is now integrated with these APIs through:

- direct public API calls
- Next.js auth/proxy routes for authenticated calls
- HttpOnly access + refresh cookie auth
