# Deployment

## Environment Variables

```env
# Database (required)
DATABASE_URI=postgresql://user:password@localhost:5432/smartcounter_web

# Payload (required)
PAYLOAD_SECRET=your-random-secret-min-32-chars

# App
NEXT_PUBLIC_SITE_URL=https://smartcounter.id
NODE_ENV=production
```

## Development

```bash
pnpm install
pnpm dev --turbopack
```

- Public site: http://localhost:3000/en
- Admin panel: http://localhost:3000/admin
- API: http://localhost:3000/api

First run creates database schema automatically (46 tables via Payload + Drizzle).

## Production Build

```bash
pnpm build
pnpm start
```

## Docker Compose (Planned)

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URI=postgresql://postgres:password@db:5432/smartcounter_web
      - PAYLOAD_SECRET=${PAYLOAD_SECRET}
      - NEXT_PUBLIC_SITE_URL=https://smartcounter.id
    depends_on:
      - db

  db:
    image: postgres:18
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=smartcounter_web
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - app

volumes:
  pgdata:
```

## Production Checklist

- [ ] Set strong `PAYLOAD_SECRET` (min 32 characters)
- [ ] Configure `NEXT_PUBLIC_SITE_URL` to actual domain
- [ ] Set up SSL (Let's Encrypt via certbot)
- [ ] Configure nginx reverse proxy
- [ ] Set up database backups
- [ ] Configure `pm2` or Docker restart policy
- [ ] Set up monitoring (uptime check)
- [ ] Verify all API endpoints return 200
- [ ] Test admin login
- [ ] Verify i18n works on all 5 locales
- [ ] Run Lighthouse audit
- [ ] Submit sitemap to Google Search Console
- [ ] Set up 301 redirects from old WordPress URLs
- [ ] Configure Google Analytics

## Database

- **Engine:** PostgreSQL 18.3
- **Database name:** `smartcounter_web`
- **ORM:** Drizzle (via `@payloadcms/db-postgres`)
- **Tables:** 46 (auto-created by Payload on first boot)
- **Separate from** Super App databases (smartcounter, mall)

## SSO Integration (Post-Launch)

Planned integration with Super App (Laravel Sanctum):
1. Super App: Admin gateway picker screen + `POST /auth/sso-token` endpoint
2. Payload: Custom `AuthStrategy` at `GET /admin/sso?token=`
3. Shared HMAC-SHA256 secret, 60s token TTL
4. Direct email/password login preserved as fallback

See Company Profile SSO Merge Plan in wiki for full details.
