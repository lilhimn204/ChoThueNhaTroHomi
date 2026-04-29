# Homi Auth: Google Login and Gmail OTP

## Environment variables

Backend:

```env
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
APP_MAIL_ENABLED=true
APP_MAIL_FROM=your-gmail-address@gmail.com
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-gmail-address@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS=true
OTP_EXPIRATION_MINUTES=10
OTP_MAX_ATTEMPTS=5
OTP_MAX_RESEND_COUNT=3
OTP_RESEND_COOLDOWN_SECONDS=60
```

Frontend:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Use the same Google OAuth client ID for `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

## Google OAuth setup

1. Open Google Cloud Console and create or select a project.
2. Configure OAuth consent screen.
3. Create an OAuth Client ID with type `Web application`.
4. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - production domain, for example `https://thuenhahomi.id.vn`
5. Copy the client ID into backend and frontend env variables.

The backend verifies the Google ID token against Google token info and rejects tokens with the wrong audience, missing Google user id, unverified email, or expired token.

## Gmail SMTP setup

1. Use a Gmail account with 2-Step Verification enabled.
2. Create an App Password for Mail.
3. Set `MAIL_PASSWORD` to that App Password, not the normal Gmail password.
4. Set `APP_MAIL_ENABLED=true`; otherwise OTP emails are skipped.

For local tests without sending real mail, leave `APP_MAIL_ENABLED=false`. The backend still creates OTP data, but users will not receive email.

## Database migration

Fresh Docker databases pick up the new auth columns from `database/mysql/01_schema.sql`.

Existing MySQL databases must run:

```sql
source database/mysql/09_auth_identity_verification.sql;
```

When using `docker compose up`, the `mysql-migrate` service runs migration scripts `04` through `09` before backend starts. Run the migration manually only when starting backend outside Docker Compose.

Run migrations before starting backend with `SPRING_PROFILES_ACTIVE=prod`, because production uses `ddl-auto=validate`.

## Docker Compose ports

Default ports:

```env
MYSQL_PORT=3307
BACKEND_PORT=8080
FRONTEND_PORT=3000
```

If port `3000` is already used, start Compose with another frontend port:

```powershell
$env:FRONTEND_PORT="3001"
docker compose up --build
```

## Auth flows

Email/password register:

1. `POST /api/v1/auth/register` creates an inactive local account and sends OTP.
2. `POST /api/v1/auth/verify-otp` activates the account and returns tokens.
3. `POST /api/v1/auth/login` rejects local accounts with `emailVerified=false`.

Google login:

1. Frontend gets a Google ID token from Google Identity Services.
2. BFF `POST /api/auth/google` forwards the token to backend.
3. Backend creates a user when email is new, or links/logs in the existing email.
4. Google accounts are marked `emailVerified=true`, `enabled=true`, `status=ACTIVE`, with default role `USER` if no role exists.

## Manual test checklist

Email OTP:

1. Register with a new Gmail address.
2. Confirm the UI switches to the OTP form.
3. Login before OTP verification; it should be rejected.
4. Enter a wrong OTP; it should show a clear error and keep the account unverified.
5. Click resend OTP after cooldown; it should send a new code.
6. Enter the valid OTP; the user should be logged in and redirected.
7. Try an expired OTP by lowering `OTP_EXPIRATION_MINUTES` temporarily or editing `otp_expires_at` in DB.

Google:

1. Click Google on login/register page with a new Google email.
2. Confirm the account is created with name, email, avatar, `USER` role.
3. Log out, then login with Google again; it should reuse the same account.
4. Register a local account but do not verify OTP, then use Google with the same email; it should link and activate the account.
5. Confirm existing admin account roles are not replaced when linked.

Regression:

1. Existing verified local users can still login with password.
2. Wrong password still returns unauthorized.
3. Admin routes still require `ADMIN`.
4. Host/user pages still work with existing roles.
