# Admin Panel

**URL:** `/admin`
**Auth:** Email + password (Payload built-in)
**First user:** super@smartcounter.id (Super Admin)
**Future:** SSO bridge ke Sanctum — see Company Profile SSO Merge Plan in wiki

## Collections (13)

| Collection | Slug | Key Fields | Localized |
|-----------|------|-----------|-----------| 
| Users | `users` | name, role (super_admin/editor/viewer) | — |
| Media | `media` | alt, caption, sizes (thumbnail/card/hero/og) | alt, caption |
| Pages | `pages` | title, slug, content (richtext), status | title, content |
| Blog Posts | `blog-posts` | title, slug, content, excerpt, featuredImage, category, tags, author, publishedAt, readingTime, status | title, content, excerpt |
| Blog Categories | `blog-categories` | name, slug, description | name, description |
| Features | `features` | name, slug, icon (Lucide name), shortDescription, longDescription, image, sortOrder, isVisible | name, descriptions |
| Use Cases | `use-cases` | industryName, slug, icon, shortDescription, longDescription, image, relatedFeatures, sortOrder, isVisible | industryName, descriptions |
| Pricing Tiers | `pricing-tiers` | name, slug, description, features (array of featureText+included), isFeatured, ctaText, ctaLink, sortOrder | name, description, features |
| FAQ Items | `faq-items` | question, answer (richtext), category, sortOrder, isVisible | question, answer |
| Client Logos | `client-logos` | companyName, logo (upload), websiteUrl, sortOrder, isVisible | — |
| Testimonials | `testimonials` | name, role, company, quote, avatar, sortOrder, isVisible | role, quote |
| Form Submissions | `form-submissions` | formType (contact/demo), data (JSON), email, status (new/read/replied) | — |
| Deployment Locations | `deployment-locations` | cityName, longitude, latitude, isMajor, isVisible, sortOrder | — |

### Relationships

- Features → Media (image)
- Use Cases → Media (image) + Features (relatedFeatures, hasMany)
- Blog Posts → Media (featuredImage) + Blog Categories (category) + Users (author)
- Client Logos → Media (logo)
- Testimonials → Media (avatar)

### Media Sizes

| Size | Dimensions | Crop |
|------|-----------|------|
| thumbnail | 400x300 | center |
| card | 800x600 | center |
| hero | 1920x1080 | center |
| og | 1200x630 | center |

Accepts: images (png, jpg, webp, svg, gif), video (mp4), PDF.

## Globals (3)

| Global | Slug | Fields |
|--------|------|--------|
| Site Settings | `site-settings` | siteName, siteDescription, logo, favicon, contactEmail, contactPhone, contactAddress, whatsappNumber, socialLinks, googleAnalyticsId, defaultOgImage |
| Navigation | `navigation` | mainMenu (label+link array), footerMenu (product+resources arrays) |
| Homepage | `homepage` | hero (title, subtitle, CTAs), statsBar (value+label array) |

## Plugins

- **@payloadcms/plugin-seo** — auto-generated meta for: pages, blog-posts, features, use-cases

## Localization

5 locales supported: `en` (default), `id`, `ko`, `ja`, `zh`. All fields marked `localized: true` store content per locale.

## Admin Theming

### Custom CSS

File: `src/admin/custom.css` — loaded via `import '@/admin/custom.css'` in `(payload)/layout.tsx`.

All overrides inside `@layer payload` (takes precedence over `@layer payload-default`):

```css
@layer payload {
  /* Darker base colors */
  html[data-theme='dark'] {
    --color-base-950: rgb(12, 12, 12);   /* bg-0: #0c0c0c */
    --color-base-900: rgb(20, 20, 20);   /* bg-1: #141414 */
    --color-base-850: rgb(30, 30, 30);   /* bg-2: #1e1e1e */
    --theme-elevation-0: var(--color-base-950);
  }

  /* Primary buttons → SC red #DC2626 */
  .btn.btn--style-primary { background: #DC2626; }

  /* Hide default dashboard grid (uses inline display:flex) */
  .modular-dashboard { display: none !important; }
}
```

### Custom Components

| Component | Path | Registration |
|-----------|------|-------------|
| Logo | `/admin/components/Logo` | `admin.components.graphics.Logo` |
| Icon | `/admin/components/Icon` | `admin.components.graphics.Icon` |
| Dashboard Overview | `/admin/components/DashboardOverview` | `admin.components.beforeDashboard` |

### Logo Component

Renders `SMARTCounter` with red `SMART` + white `Counter` + grey `Admin` tag badge.

### Dashboard Overview Component

Client component (`'use client'`) that fetches live data from Payload REST API:

```
GET /api/blog-posts?limit=5&sort=-createdAt
GET /api/features?limit=0
GET /api/form-submissions?limit=5&sort=-createdAt
```

Renders:
- 4 stat cards (Blog Posts count, Features count, Form Submissions count + unread, Last Update timeago)
- Recent Blog Posts list with Published/Draft status badges
- Recent Form Submissions list with New/Read/Replied badges + form type (contact/demo)
- Quick Actions: New Blog Post (red), Edit Site Settings, Homepage Config, Manage Features, Deployment Map

Badge colors:
- Published/Replied: green (`rgba(34, 197, 94, 0.12)` bg, `#22c55e` text)
- Draft/Read: grey (theme elevation variables)
- New: red (`rgba(220, 38, 38, 0.12)` bg, `#DC2626` text)

## Seeded Data

All collections populated with content matching the public-facing website:

| Collection | Count | Notes |
|-----------|-------|-------|
| Features | 12 | Each with mockup image from Media |
| Use Cases | 6 | With Lucide icon names |
| Pricing Tiers | 3 | Basic, Add-On (featured), Premium |
| FAQ Items | 6 | Richtext answers, categorized |
| Deployment Locations | 20 | 6 major + 14 minor Indonesian cities |
| Media | 12 | Dashboard mockup screenshots (1365x903 PNG) |
| Site Settings | 1 | Site name + contact info |
| Users | 1 | super@smartcounter.id (super_admin) |

### The 12 Features

| # | Name | Slug | Icon |
|---|------|------|------|
| 1 | Visitor Traffic | visitor-traffic | users |
| 2 | In-Out Traffic | in-out-traffic | arrow-right-left |
| 3 | Dwell Time | dwell-time | timer |
| 4 | Passers-by | passers-by | route |
| 5 | Entering Rate | entering-rate | percent |
| 6 | Group Rate | group-rate | layout-grid |
| 7 | Demographic | demographic | scan-face |
| 8 | Occupancy | occupancy | gauge |
| 9 | Service Efficiency | service-efficiency | user-cog |
| 10 | Heatmap | heatmap | flame |
| 11 | Queuing | queuing | list-ordered |
| 12 | In-Store Routes | in-store-routes | download |

### The 20 Deployment Locations

Major (larger dot + permanent label): Jakarta, Surabaya, Bandung, Medan, Semarang, Makassar

Minor: Yogyakarta, Denpasar, Palembang, Balikpapan, Manado, Padang, Malang, Pekanbaru, Banjarmasin, Solo, Batam, Pontianak, Jayapura, Lampung
