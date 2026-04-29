# Architecture

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router, Turbopack) | 16.2.4 |
| CMS | Payload CMS | 3.84.1 |
| Database | PostgreSQL | 18.3 |
| Language | TypeScript (strict) | 6.0 |
| Styling | Tailwind CSS | 4.2 |
| Components | shadcn/ui + @base-ui/react | latest |
| Animation | Framer Motion | 12.38 |
| Maps | Leaflet + react-leaflet | 1.9.4 / 5.0 |
| Icons | Lucide React | 1.11 |
| Rich Text | Lexical (via Payload) | built-in |
| Image Processing | Sharp | 0.34 |
| Fonts | Fira Sans (body) + Fira Code (mono) | Google Fonts |
| Translation | google-translate-api-x | free, no API key |
| Package Manager | pnpm | 10.33 |

## Directory Structure

```
smartcounter-web/
├── src/
│   ├── app/
│   │   ├── (frontend)/
│   │   │   ├── layout.tsx              ← Frontend root layout (<html>, fonts, SEO meta)
│   │   │   └── [locale]/
│   │   │       ├── layout.tsx          ← Navbar, Footer, ThemeProvider, WhatsAppFloat
│   │   │       ├── page.tsx            ← Homepage
│   │   │       ├── features/
│   │   │       │   ├── page.tsx        ← Features listing
│   │   │       │   └── [slug]/page.tsx ← Feature detail (12 pages)
│   │   │       ├── use-cases/          ← Use Cases listing + detail
│   │   │       ├── packages/page.tsx   ← Pricing tiers
│   │   │       ├── faq/page.tsx        ← FAQ with search + filter
│   │   │       ├── blog/              ← Blog listing + detail
│   │   │       ├── contact/page.tsx    ← Contact form + WhatsApp
│   │   │       └── demo/page.tsx       ← Demo request form
│   │   ├── (payload)/
│   │   │   ├── layout.tsx              ← Payload root layout (RootLayout + CSS imports)
│   │   │   └── admin/
│   │   │       ├── importMap.js        ← Payload component resolution
│   │   │       └── [[...segments]]/
│   │   │           └── page.tsx        ← Payload admin catch-all
│   │   ├── api/
│   │   │   ├── [...slug]/route.ts      ← Payload REST API catch-all
│   │   │   └── export-submissions/     ← CSV export endpoint
│   │   └── globals.css                 ← Design tokens, theme variables, Leaflet overrides
│   ├── admin/
│   │   ├── custom.css                  ← SC red theme overrides (@layer payload)
│   │   ├── components/
│   │   │   ├── Logo.tsx                ← SMARTCounter ADMIN branding
│   │   │   ├── Icon.tsx                ← SC favicon icon
│   │   │   └── DashboardOverview.tsx   ← Custom dashboard with stats + quick actions
│   │   └── views/                      ← (reserved for future custom views)
│   ├── collections/                    ← 13 Payload collection configs
│   │   ├── Features.ts
│   │   ├── UseCases.ts
│   │   ├── PricingTiers.ts
│   │   ├── FaqItems.ts
│   │   ├── BlogPosts.ts
│   │   ├── BlogCategories.ts
│   │   ├── Pages.ts
│   │   ├── ClientLogos.ts
│   │   ├── Testimonials.ts
│   │   ├── FormSubmissions.ts
│   │   ├── DeploymentLocations.ts
│   │   ├── Media.ts
│   │   └── Users.ts
│   ├── globals/                        ← 3 Payload global configs
│   │   ├── SiteSettings.ts
│   │   ├── Navigation.ts
│   │   └── Homepage.ts
│   ├── components/
│   │   ├── layout/                     ← Navbar, Footer, ThemeProvider, ThemeToggle,
│   │   │                                  WhatsAppFloat, LocaleSwitcher
│   │   ├── sections/                   ← Hero, PainPoints, FeaturesGrid, DeploymentMap,
│   │   │                                  UseCasesShowcase, PackagesTeaser, FaqAccordion,
│   │   │                                  HeatmapBenefit, CtaBanner, FeatureMockup, ScrollReveal
│   │   └── ui/                         ← shadcn primitives
│   ├── lib/
│   │   ├── i18n/
│   │   │   ├── config.ts              ← Locale list + validation
│   │   │   ├── getDictionary.ts       ← Auto-translate integration
│   │   │   └── dictionaries/en.json   ← Source of truth (all content)
│   │   ├── translate.ts               ← Batch translate utility + cache
│   │   └── utils.ts                   ← Tailwind merge (cn())
│   ├── middleware.ts                   ← Locale detection & routing
│   └── payload.config.ts              ← CMS configuration entry point
├── public/
│   ├── fonts/, images/, og/
│   └── indonesia.json                 ← GeoJSON (legacy, unused — Leaflet tiles now)
├── design-prototypes/admin/           ← 13 HTML mockups (visual reference)
├── docs/blueprint/                    ← This documentation
└── next.config.ts                     ← withPayload() wrapper
```

## Route Group Architecture

Next.js route groups separate the frontend and admin into independent layouts:

```
(frontend)/           (payload)/
    │                     │
    ├── layout.tsx        ├── layout.tsx
    │   <html>            │   Payload RootLayout
    │   <body>            │   renders its own <html>/<body>
    │   Google Fonts      │   imports @payloadcms/next/css
    │   SEO metadata      │   imports @/admin/custom.css
    │                     │
    └── [locale]/         └── admin/[[...segments]]/
        layout.tsx            page.tsx (Payload catch-all)
        ThemeProvider
        Navbar + Footer
```

**Why separate root layouts?** Payload's `RootLayout` component renders its own `<html data-theme="dark" dir="LTR">` document. A shared root layout would create nested `<html>` tags, breaking hydration and CSS loading. Each route group has its own `<html>/<body>` — this is the Next.js "multiple root layouts" pattern.

**API routes** (`src/app/api/`) sit outside both route groups. They don't use layouts (route handlers never render HTML), so they work without a root layout.

## Config Files

| File | Purpose |
|------|---------|
| `next.config.ts` | `withPayload(nextConfig)` — configures SCSS, Turbopack, server externals |
| `payload.config.ts` | Collections, globals, plugins, admin components, DB adapter |
| `tailwind.config.ts` | (Tailwind v4 uses CSS-based config in globals.css) |
| `tsconfig.json` | `@/` path alias → `src/`, strict mode |
| `middleware.ts` | Locale detection (cookie → Accept-Language → default EN) |
