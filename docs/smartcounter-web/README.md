# SmartCounter Web — System Blueprint

Company profile website untuk **smartcounter.id** — rebuild dari WordPress ke Next.js 16 + Payload CMS 3.84.

| | |
|---|---|
| **Repo** | `git@github.com:riteldataindo/demo-compro.git` |
| **Dev** | `http://localhost:3000` (public) / `http://localhost:3000/admin` (CMS) |
| **Production** | TBD (VPS Docker deploy) |
| **Status** | Developing — admin styled, CMS seeded, frontend live |

## Documentation Index

| Doc | Description |
|-----|-------------|
| [Architecture](./architecture.md) | Tech stack, directory structure, route groups, layout system |
| [Admin Panel](./admin-panel.md) | Payload CMS config, collections, globals, custom theming, dashboard |
| [Frontend](./frontend.md) | Public routes, homepage sections, i18n, design system |
| [Content & SEO](./content-seo.md) | Dictionary structure, auto-translation, SEO strategy, deployment map |
| [Deployment](./deployment.md) | Environment variables, Docker setup, production checklist |
| [Known Issues & Workarounds](./known-issues.md) | Payload 3.84 + Next.js 16 CSS fix, pnpm quirks |

## Quick Start

```bash
cd smartcounter-web
pnpm install
cp .env.example .env  # configure DATABASE_URI + PAYLOAD_SECRET
pnpm dev --turbopack
```

- Public site: http://localhost:3000/en
- Admin panel: http://localhost:3000/admin
- API: http://localhost:3000/api

## What's Done

- 12 public routes (homepage, features, use-cases, packages, FAQ, blog, contact, demo, 404)
- 13 Payload collections + 3 globals
- i18n 5 locales (EN/ID/KO/JA/ZH) with auto-translation
- Dark/Light/Auto theme toggle
- Leaflet deployment map (20 Indonesian cities, theme-aware tiles)
- Admin panel fully styled (SC red theme, custom dashboard with stats)
- CMS seeded: 12 features + mockup images, 6 use cases, 3 pricing tiers, 6 FAQs, 20 deployment locations
- 12 unique inline SVG dashboard mockups per feature
- WhatsApp float widget with suggestions + text input
- Language switcher dropdown

## What's Remaining

- Connect frontend to Payload CMS API (replace hardcoded content)
- WordPress content migration (4 posts + ~10 pages)
- Docker Compose deployment
- SEO validation (Lighthouse, JSON-LD)
- Production deploy ke VPS
- SSO bridge ke Sanctum (post-launch)
- Google Analytics, contact form email, blog pagination
- Sitemap.ts + robots.ts + 301 redirects
- Chatbot (Gemini 2.5 Flash Lite — researched, deferred)
