# Production security setup

The application fails closed for HTTPS origins and malware scanning in production. Complete every section before deploying.

## 1. Apply database migrations

Set the production `DATABASE_URL`, then run from `backend`:

```bash
pnpm prisma migrate deploy
pnpm prisma generate
```

The migrations add password-reset tokens, email-verification tokens and the email verification timestamp. Existing users are marked verified; new users must verify their email.

## 2. Configure transactional email

Create a sending-only Resend API key and verify the sender domain. Configure:

```dotenv
RESEND_API_KEY=re_replace_me
EMAIL_FROM=Memory Nest <hello@example.com>
FRONTEND_URL=https://app.example.com
```

`FRONTEND_URL` is used in password-reset and verification links. Never expose the Resend key through a `NEXT_PUBLIC_*` variable.

## 3. Configure browser origins and cookies

Use exact HTTPS origins without paths:

```dotenv
NODE_ENV=production
FRONTEND_URL=https://app.example.com
FRONTEND_URLS=https://app.example.com
TRUST_PROXY=1
SESSION_COOKIE_SAME_SITE=lax
```

Use `SESSION_COOKIE_SAME_SITE=none` only when the frontend and API are on different sites. It requires HTTPS. `SESSION_COOKIE_DOMAIN=.example.com` is optional and only needed when the cookie must be shared by trusted subdomains.

Do not use wildcard CORS origins with credentialed requests. Add the exact staging origin to `FRONTEND_URLS` when needed.

## 4. Configure rate limits

Defaults are suitable for a single backend instance:

```dotenv
AUTH_LOGIN_RATE_LIMIT=10
AUTH_REGISTER_RATE_LIMIT=5
AUTH_RECOVERY_RATE_LIMIT=5
UPLOAD_RATE_LIMIT=30
```

The built-in limiter is process-local. Before horizontally scaling the backend, replace its in-memory store with a shared Redis or PostgreSQL-backed store so all instances enforce one limit.

## 5. Deploy ClamAV

Run a private ClamAV daemon in the same private network as the backend and expose TCP port 3310 only to the backend. Configure ClamAV `StreamMaxLength` above 250 MB and keep signatures updated.

```dotenv
CLAMAV_HOST=clamav.internal
CLAMAV_PORT=3310
CLAMAV_TIMEOUT_MS=120000
CLAMAV_REQUIRED=true
```

Production refuses to finalize media when ClamAV is missing or unavailable. Development may omit `CLAMAV_HOST`; files still receive size, MIME and magic-byte validation.

## 6. Update S3 permissions

Keep the bucket private and grant the backend only:

- `s3:GetObject`
- `s3:PutObject`
- `s3:PutObjectTagging`
- `s3:DeleteObject`

Redeploy `infra/aws/s3-media.yaml` with the real frontend origin or update the existing bucket CORS rule. Uploaded objects remain tagged `scan-status=pending` until validation and malware scanning complete.

## 7. Run cleanup and health checks

Expired sessions and auth tokens are cleaned on backend startup and hourly. The interval is configurable:

```dotenv
SESSION_CLEANUP_INTERVAL_MS=3600000
```

You can also schedule `pnpm auth:cleanup`. Continue scheduling `pnpm media:cleanup` daily for abandoned uploads. Monitor `/api/health/live` and `/api/health/ready`.
