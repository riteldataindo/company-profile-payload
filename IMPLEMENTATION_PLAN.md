# Implementation Plan — smartcounter.id

> Tanggal: 2026-04-24
> Project: smartcounter-web
> Stack: Next.js 16.2 + Payload CMS 3.81+ + PostgreSQL + TypeScript

---

## 1. Tech Stack & Versions

| Layer | Teknologi | Versi | Catatan |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.2.4+ | Turbopack default |
| CMS | Payload CMS | 3.81+ | Minimum 3.73.0 untuk Next.js 16 support |
| Language | TypeScript | 5.x | Strict mode |
| Database | PostgreSQL | 16 | DB terpisah dari smartcounter-api |
| ORM | Drizzle (via Payload) | Built-in | Payload adapter: @payloadcms/db-postgres |
| Styling | Tailwind CSS | 4.x | |
| UI Components | shadcn/ui | Latest | Konsisten dengan smartcounter-admin |
| Rich Text | Lexical Editor | Built-in Payload | |
| Package Manager | pnpm | Latest | |
| Dev Bundler | Turbopack | Built-in Next.js 16 | Dev script: `next dev --no-server-fast-refresh` |

### Known Quirks

- **Dev script** harus pakai `--no-server-fast-refresh` untuk Payload + Next.js 16.2
- **Production build** gunakan `next build` standar (Turbopack prod sudah supported di Payload 3.81+)
- Payload `withPayload()` wrapper di `next.config.ts` sudah handle Turbopack config otomatis sejak 3.73.0

---

## 2. Project Structure

```
smartcounter-web/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (frontend)/               # Route group: halaman publik
│   │   │   ├── [locale]/             # i18n dynamic segment
│   │   │   │   ├── page.tsx          # Homepage
│   │   │   │   ├── about/
│   │   │   │   ├── features/
│   │   │   │   │   └── [slug]/       # Feature detail
│   │   │   │   ├── use-cases/
│   │   │   │   │   └── [slug]/       # Use case detail
│   │   │   │   ├── pricing/
│   │   │   │   ├── faq/
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx      # Blog listing
│   │   │   │   │   └── [slug]/       # Blog post detail
│   │   │   │   ├── contact/
│   │   │   │   └── demo/
│   │   │   ├── layout.tsx            # Public layout (navbar, footer)
│   │   │   └── not-found.tsx
│   │   ├── (payload)/                # Route group: admin panel (auto by Payload)
│   │   │   └── admin/
│   │   │       └── [[...segments]]/
│   │   ├── api/                      # API routes
│   │   │   └── [...payload]/         # Payload REST API
│   │   ├── sitemap.ts                # Auto-generated sitemap
│   │   ├── robots.ts                 # Robots.txt
│   │   ├── feed.xml/
│   │   │   └── route.ts             # RSS feed
│   │   └── layout.tsx               # Root layout
│   │
│   ├── collections/                  # Payload collection configs
│   │   ├── Pages.ts
│   │   ├── BlogPosts.ts
│   │   ├── BlogCategories.ts
│   │   ├── Features.ts
│   │   ├── UseCases.ts
│   │   ├── PricingTiers.ts
│   │   ├── FaqItems.ts
│   │   ├── ClientLogos.ts
│   │   ├── Testimonials.ts
│   │   ├── FormSubmissions.ts
│   │   ├── Media.ts
│   │   └── Users.ts
│   │
│   ├── globals/                      # Payload globals (singleton data)
│   │   ├── SiteSettings.ts           # Logo, contact info, social links
│   │   ├── Navigation.ts             # Menu structure
│   │   └── Homepage.ts               # Homepage section config (hero, CTA texts)
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── sections/                 # Homepage sections
│   │   │   ├── Hero.tsx
│   │   │   ├── FeaturesGrid.tsx
│   │   │   ├── UseCasesShowcase.tsx
│   │   │   ├── PricingTable.tsx
│   │   │   ├── FaqAccordion.tsx
│   │   │   ├── ClientLogos.tsx
│   │   │   └── CtaBanner.tsx
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx
│   │   │   ├── BlogList.tsx
│   │   │   ├── TableOfContents.tsx
│   │   │   └── RelatedPosts.tsx
│   │   └── seo/
│   │       ├── JsonLd.tsx            # Organization, Article, FAQPage, etc.
│   │       └── Breadcrumbs.tsx
│   │
│   ├── lib/
│   │   ├── payload.ts               # Payload client helper
│   │   ├── i18n/
│   │   │   ├── config.ts            # Locale definitions
│   │   │   ├── dictionaries/        # UI string translations
│   │   │   │   ├── en.json
│   │   │   │   ├── id.json
│   │   │   │   ├── ko.json
│   │   │   │   ├── ja.json
│   │   │   │   └── zh.json
│   │   │   └── getDictionary.ts
│   │   ├── seo/
│   │   │   ├── metadata.ts          # generateMetadata helpers
│   │   │   └── jsonld.ts            # JSON-LD generators
│   │   └── utils.ts
│   │
│   ├── middleware.ts                 # i18n locale detection & redirect
│   └── payload.config.ts            # Payload main config
│
├── public/
│   ├── images/
│   │   └── logo/
│   ├── fonts/
│   └── og/                          # Default OG images per locale
│
├── docker/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── docker-compose.yml
│
├── scripts/
│   ├── migrate-wp-content.ts        # WordPress content migration script
│   └── seed.ts                      # Initial data seeding
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
└── package.json
```

---

## 3. Payload Collections & Globals

### 3.1 Collections (10 + 2 system)

#### A. Pages
```
Fields:
  - title*            (text, localized)
  - slug*             (text, unique, auto from title)
  - content           (richText/lexical, localized)
  - meta.title        (text, localized)       ← SEO plugin
  - meta.description  (textarea, localized)   ← SEO plugin
  - meta.image        (upload → Media)        ← SEO plugin
  - status            (draft | published)

Access: public read, admin write
```

#### B. BlogPosts
```
Fields:
  - title*            (text, localized)
  - slug*             (text, unique)
  - content*          (richText/lexical, localized)
  - excerpt           (textarea, localized)
  - featuredImage     (upload → Media)
  - category          (relationship → BlogCategories)
  - tags              (array of text)
  - author            (relationship → Users)
  - publishedAt       (date)
  - readingTime       (number, auto-calculated)
  - meta.*            (SEO plugin fields, localized)
  - status            (draft | published | scheduled)

Access: public read, editor+ write
Hooks: auto-calculate readingTime on save
```

#### C. BlogCategories
```
Fields:
  - name*             (text, localized)
  - slug*             (text, unique)
  - description       (textarea, localized)
  - meta.*            (SEO plugin, localized)

Access: public read, editor+ write
```

#### D. Features
```
Fields:
  - name*             (text, localized)
  - slug*             (text, unique)
  - icon              (text — Lucide icon name)
  - shortDescription* (textarea, localized)
  - longDescription   (richText/lexical, localized)
  - image             (upload → Media)
  - sortOrder         (number)
  - isVisible         (checkbox, default true)

Access: public read (where isVisible=true), admin write
```

#### E. UseCases
```
Fields:
  - industryName*     (text, localized)
  - slug*             (text, unique)
  - icon              (text — Lucide icon name)
  - shortDescription* (textarea, localized)
  - longDescription   (richText/lexical, localized)
  - image             (upload → Media)
  - sortOrder         (number)
  - isVisible         (checkbox, default true)

Access: public read (where isVisible=true), admin write
```

#### F. PricingTiers
```
Fields:
  - name*             (text, localized)
  - slug*             (text, unique)
  - priceLabel*       (text, localized)       ← "Rp 2.5jt/bln" atau "Contact Us"
  - description       (textarea, localized)
  - features          (array)
      - featureText   (text, localized)
      - included      (checkbox)
  - isFeatured        (checkbox)              ← highlight tier ini
  - ctaText           (text, localized)
  - ctaLink           (text)
  - sortOrder         (number)

Access: public read, admin write
```

#### G. FaqItems
```
Fields:
  - question*         (text, localized)
  - answer*           (richText/lexical, localized)
  - category          (text, localized)       ← optional grouping
  - sortOrder         (number)
  - isVisible         (checkbox, default true)

Access: public read, admin write
```

#### H. ClientLogos
```
Fields:
  - companyName*      (text)
  - logo*             (upload → Media)
  - websiteUrl        (text, optional)
  - sortOrder         (number)
  - isVisible         (checkbox, default true)

Access: public read, admin write
```

#### I. Testimonials
```
Fields:
  - name*             (text)
  - role              (text, localized)
  - company           (text)
  - quote*            (textarea, localized)
  - avatar            (upload → Media)
  - sortOrder         (number)
  - isVisible         (checkbox, default true)

Access: public read, admin write
```

#### J. FormSubmissions
```
Fields:
  - formType*         (select: contact | demo | newsletter)
  - data              (json)                  ← flexible field data
  - email             (email, indexed)
  - status            (select: new | read | replied)
  - createdAt         (auto)

Access: admin read only, no public write (submissions via API route)
```

#### K. Media (system)
```
Fields:
  - alt               (text, localized)       ← WAJIB untuk SEO
  - caption           (text, localized)

Upload config:
  - imageSizes: thumbnail (400x300), card (800x600), hero (1920x1080), og (1200x630)
  - mimeTypes: image/*, video/mp4, application/pdf
  - staticDir: ./public/media
```

#### L. Users (system)
```
Fields:
  - name              (text)
  - role              (select: super_admin | editor | viewer)

Auth: email + password (Payload built-in)
```

### 3.2 Globals (3 singletons)

#### SiteSettings
```
Fields:
  - siteName          (text, localized)
  - siteDescription   (textarea, localized)
  - logo              (upload → Media)
  - logoDark          (upload → Media)
  - favicon           (upload → Media)
  - contactEmail      (email)
  - contactPhone      (text)
  - contactAddress    (textarea, localized)
  - whatsappNumber    (text)
  - socialLinks
      - facebook      (text)
      - instagram     (text)
      - linkedin      (text)
      - youtube       (text)
      - tiktok        (text)
  - googleAnalyticsId (text)
  - defaultOgImage    (upload → Media)
```

#### Navigation
```
Fields:
  - mainMenu          (array)
      - label         (text, localized)
      - link          (text)
      - children      (array, nested)
  - footerMenu        (array)
      - label         (text, localized)
      - link          (text)
```

#### Homepage
```
Fields:
  - hero
      - title         (text, localized)
      - subtitle      (text, localized)
      - ctaPrimary    (group: text + link, localized)
      - ctaSecondary  (group: text + link, localized)
      - backgroundImage (upload → Media)
  - statsBar          (array)
      - value         (text)          ← "99.9%", "12+", "500+"
      - label         (text, localized)
  - sectionsOrder     (array of select) ← kontrol urutan section di homepage
```

---

## 4. Internationalization (i18n)

### 4.1 Locale Config

```
Locales: ['en', 'id', 'ko', 'ja', 'zh']
Default: 'en'
Fallback: 'en' (jika konten belum diterjemahkan)
```

### 4.2 Routing

```
/ → redirect ke /en/
/en/                    ← Homepage English
/id/                    ← Homepage Indonesia
/ko/blog/article-slug   ← Blog Korea
/zh/features/heatmap    ← Feature detail Chinese
```

### 4.3 Middleware Logic

```
1. Cek apakah path sudah punya locale prefix
2. Jika tidak → detect dari Accept-Language header atau cookie
3. Redirect ke /{detected-locale}/...
4. Simpan preference di cookie 'preferred-locale'
```

### 4.4 Translation Layers

| Layer | Mekanisme | Contoh |
|---|---|---|
| **CMS Content** | Payload localized fields | Blog title EN: "What is..." / ID: "Apa itu..." |
| **UI Strings** | JSON dictionary files | Button "Read More" / "Baca Selengkapnya" |
| **URL Slugs** | Shared (tidak ditranslasi) | `/en/blog/people-counting` = `/id/blog/people-counting` |
| **SEO Meta** | Payload localized meta fields | Meta description per locale |

### 4.5 Hreflang Tags (Auto)

Setiap halaman otomatis generate:
```html
<link rel="alternate" hreflang="en" href="https://smartcounter.id/en/blog/slug" />
<link rel="alternate" hreflang="id" href="https://smartcounter.id/id/blog/slug" />
<link rel="alternate" hreflang="ko" href="https://smartcounter.id/ko/blog/slug" />
<link rel="alternate" hreflang="ja" href="https://smartcounter.id/ja/blog/slug" />
<link rel="alternate" hreflang="zh" href="https://smartcounter.id/zh/blog/slug" />
<link rel="alternate" hreflang="x-default" href="https://smartcounter.id/en/blog/slug" />
```

---

## 5. SEO Implementation

### 5.1 Metadata (generateMetadata per route)

Setiap page/route punya `generateMetadata()` yang:
1. Fetch data dari Payload (title, meta.description, meta.image)
2. Fallback ke auto-generate jika kosong
3. Include hreflang alternate URLs untuk 5 locales
4. Include canonical URL
5. Include OG + Twitter Card tags

### 5.2 JSON-LD Structured Data

| Page | Schema |
|---|---|
| Semua halaman | Organization + BreadcrumbList |
| Homepage | WebSite + searchAction |
| Blog post | Article (headline, author, datePublished, image) |
| FAQ | FAQPage (mainEntity → Question + acceptedAnswer) |
| Pricing | Service / Product (opsional) |

### 5.3 Sitemap (app/sitemap.ts)

Auto-generated, include:
- Semua halaman statis × 5 locales
- Semua blog posts × 5 locales (hanya yang published)
- Semua feature detail pages × 5 locales
- Semua use case detail pages × 5 locales
- lastmod dari updatedAt Payload

### 5.4 RSS Feed (app/feed.xml/route.ts)

- Per locale: `/en/feed.xml`, `/id/feed.xml`, dll
- Include 20 latest published blog posts

### 5.5 URL Redirects (next.config.ts)

301 redirects dari URL WordPress lama:
```
/apa-itu-people-counting-system/             → /en/blog/apa-itu-people-counting-system
/cara-kerja-people-counting-cctv-ai/         → /en/blog/cara-kerja-people-counting-cctv-ai
/manfaat-visitor-counter-toko-retail/         → /en/blog/manfaat-visitor-counter-toko-retail
/cctv-ai-people-counting-visitor-analytics/  → /en/blog/cctv-ai-people-counting-visitor-analytics
/news-2/                                     → /en/blog
/sample-page/                                → /en
/fitur/                                      → /id/features
/paket/                                      → /id/pricing
/use-case/                                   → /en/use-cases
/faq/                                        → /en/faq
```

### 5.6 Rendering Strategy

| Halaman | Strategy | Revalidate |
|---|---|---|
| Homepage | ISR | 60 detik |
| Blog listing | ISR | 60 detik |
| Blog post | SSG + ISR | 3600 detik (1 jam) |
| Features, Use Cases | ISR | 3600 detik |
| Pricing, FAQ | ISR | 3600 detik |
| About | ISR | 86400 detik (1 hari) |
| Contact, Demo | SSG + client form | - |
| Admin panel | CSR | - (no SEO needed) |

---

## 6. Design System — Red Ambient Dark Theme

### 6.1 Color Palette

Logo SmartCounter: pure red #FF0000 — digunakan HANYA untuk logo.
UI menggunakan tuned reds yang lebih kaya dan accessible.

```
# Primary Red (brand accent)
primary-50:   #FEF2F2
primary-100:  #FEE2E2
primary-200:  #FECACA
primary-300:  #FCA5A5
primary-400:  #F87171
primary-500:  #EF4444    ← primary accent
primary-600:  #DC2626    ← primary hover / CTA
primary-700:  #B91C1C
primary-800:  #991B1B
primary-900:  #7F1D1D
primary-950:  #450A0A

# Background (dark ambient base)
bg-950:       #09090B    ← deepest (hero, footer)
bg-900:       #18181B    ← main background
bg-800:       #27272A    ← card background
bg-700:       #3F3F46    ← elevated elements

# Surface (light mode alternative)
surface-50:   #FAFAFA
surface-100:  #F4F4F5
surface-200:  #E4E4E7

# Text
text-primary:   #FAFAFA    ← on dark bg
text-secondary: #A1A1AA    ← muted on dark bg
text-on-light:  #18181B    ← on light bg

# Accent glow (untuk ambient effects)
glow-red:     rgba(239, 68, 68, 0.15)    ← subtle red glow behind hero
glow-red-md:  rgba(239, 68, 68, 0.25)    ← medium glow for hover states
glow-red-lg:  rgba(239, 68, 68, 0.40)    ← strong glow for CTA buttons
```

### 6.2 Typography

```
Heading:  Inter (sans-serif) — Bold/Semibold
Body:     Inter (sans-serif) — Regular/Medium
Code:     JetBrains Mono (monospace)

CJK fallback: Noto Sans JP, Noto Sans KR, Noto Sans SC
```

### 6.3 Design Direction

- **Dark-first**: background gelap (zinc-950) dengan konten terang
- **Red ambient glow**: efek blur merah di belakang hero section, CTA, dan section transitions
- **Glass morphism**: card dengan background semi-transparan + backdrop blur
- **Subtle animations**: framer-motion untuk scroll reveal, hover states
- **Logo pure red**: logo tetap #FF0000 di atas background gelap — kontras tinggi
- **CTA buttons**: gradient red (primary-600 → primary-500) dengan glow effect
- **Section alternation**: dark sections diselingi dengan slightly lighter sections

### 6.4 Responsive Breakpoints

```
sm:   640px    (mobile landscape)
md:   768px    (tablet)
lg:   1024px   (desktop)
xl:   1280px   (wide desktop)
2xl:  1536px   (ultra wide)
```

---

## 7. WordPress Content Migration

### 7.1 Extraction Script (`scripts/migrate-wp-content.ts`)

```
Step 1: Fetch semua posts via WP REST API
        GET https://smartcounter.id/wp-json/wp/v2/posts?per_page=100
Step 2: Fetch semua pages
        GET https://smartcounter.id/wp-json/wp/v2/pages?per_page=100
Step 3: Fetch semua media
        GET https://smartcounter.id/wp-json/wp/v2/media?per_page=100
Step 4: Download media files ke local
Step 5: Convert HTML content → Lexical JSON (Payload format)
Step 6: Upload media ke Payload via API
Step 7: Create posts/pages di Payload via API dengan relasi media
Step 8: Log mapping: WP ID → Payload ID untuk verification
```

### 7.2 Manual Content

Konten terstruktur yang ada di homepage WordPress (features, use cases, pricing, FAQ) kemungkinan di-hardcode di page builder, bukan database. Ini harus di-input manual ke Payload admin:

| Konten | Jumlah | Metode |
|---|---|---|
| Features | 12+ items | Manual input ke admin |
| Use Cases | 6 items | Manual input ke admin |
| Pricing Tiers | 3 items | Manual input ke admin |
| FAQ Items | 6 items | Manual input ke admin |
| Client Logos | 18+ items | Scrape image + manual input |

---

## 8. Docker Deployment

### 8.1 Docker Compose Services

```
services:
  app:          # Next.js + Payload (single container)
    - Port 3000
    - NODE_ENV=production
    - Volumes: ./public/media (persistent media uploads)

  postgres:     # Database
    - Port 5432
    - Volume: pgdata (persistent)
    - DB name: smartcounter_web (TERPISAH dari smartcounter-api)

  nginx:        # Reverse proxy + SSL
    - Port 80, 443
    - SSL via certbot/let's encrypt
    - Proxy pass ke app:3000
    - Serve static files directly
    - Gzip compression
    - Cache headers untuk static assets
```

### 8.2 Environment Variables

```
# App
NEXT_PUBLIC_SITE_URL=https://smartcounter.id
PAYLOAD_SECRET=<random-secret-32-chars>
DATABASE_URI=postgresql://user:pass@postgres:5432/smartcounter_web

# SMTP (email notifikasi form)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@smartcounter.id

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Upload
PAYLOAD_PUBLIC_SERVER_URL=https://smartcounter.id
MAX_UPLOAD_SIZE=5242880   # 5MB
```

---

## 9. Milestones & Timeline

### Minggu 1: Foundation

| Task | Deliverable |
|---|---|
| Project bootstrap | Next.js 16.2 + Payload 3.81 + PostgreSQL running |
| Payload config | Semua 12 collections + 3 globals defined |
| i18n setup | 5 locales configured, middleware routing working |
| Auth | Admin login functional |
| Design system | Tailwind config dengan red ambient palette, shadcn/ui installed |

**Checkpoint**: Admin panel bisa diakses, semua collection CRUD works, login di `/admin`

### Minggu 2: Frontend — Homepage & Core Pages

| Task | Deliverable |
|---|---|
| Layout | Navbar + Footer + Language Switcher + Mobile Menu |
| Homepage | Hero, Features Grid, Use Cases, Pricing, FAQ, Client Logos, CTA |
| About page | Company profile |
| Features page | Listing + detail page per feature |
| Use Cases page | Listing + detail page per use case |
| Animations | Scroll reveal, hover effects, red glow ambient |

**Checkpoint**: Homepage fully rendered dari Payload data, responsive, dark theme

### Minggu 3: Blog & SEO

| Task | Deliverable |
|---|---|
| Blog listing | Paginated, filterable by category, search |
| Blog post | Full article view + TOC + related posts + share buttons |
| SEO metadata | generateMetadata untuk semua routes + hreflang |
| JSON-LD | Organization, Article, FAQPage, BreadcrumbList, WebSite |
| Sitemap | Auto-generated sitemap.ts |
| Robots.txt | robots.ts (block /admin) |
| RSS Feed | /[locale]/feed.xml |
| Redirects | WordPress URL → new URL (301 map) |
| OG Images | Default OG per locale + per-post OG |

**Checkpoint**: Blog functional, SEO audit score > 90, semua structured data valid

### Minggu 4: Forms, Migration & Polish

| Task | Deliverable |
|---|---|
| Contact form | With validation, rate limiting, email notification |
| Demo request form | With validation, email notification |
| WP Migration script | Content extracted, imported ke Payload |
| Content seeding | Features, use cases, pricing, FAQ, logos di-input (EN + ID) |
| UI dictionaries | UI strings untuk EN + ID (ko, ja, zh bisa menyusul) |
| Performance | Image optimization, lazy loading, Core Web Vitals tuning |
| Error pages | Custom 404, 500 |

**Checkpoint**: Semua konten migrated, forms working, Lighthouse > 90

### Minggu 5: Deployment & Launch

| Task | Deliverable |
|---|---|
| Docker setup | Dockerfile + docker-compose.yml + nginx.conf |
| SSL | Let's Encrypt via certbot |
| VPS deployment | App running di VPS |
| DNS switch | smartcounter.id → VPS IP |
| Google Search Console | Submit sitemap, verify ownership |
| GA4 setup | Tracking active |
| Monitoring | Basic uptime check |
| Final QA | Cross-browser, mobile, all locales |

**Checkpoint**: Website live di smartcounter.id, WordPress decommissioned

### Post-Launch (Minggu 6+)

| Task | Keterangan |
|---|---|
| Terjemahan KO, JA, ZH | Konten CMS diterjemahkan ke 3 bahasa tersisa |
| Blog content strategy | Jadwal posting 2-4 artikel/bulan |
| SEO monitoring | Track ranking, impressions, CTR di Search Console |
| Iterate | Performance tuning, A/B testing CTA |

---

## 10. Catatan Penting

### Tentang Terjemahan 5 Bahasa

Infrastruktur i18n (routing, Payload localized fields, hreflang) akan **siap dari minggu 1**. Namun konten diterjemahkan bertahap:

| Bahasa | Kapan |
|---|---|
| English (en) | Minggu 1-4 (konten utama) |
| Indonesia (id) | Minggu 4 (bersamaan EN, karena sumber asli) |
| Korean (ko) | Post-launch, perlu translator |
| Japanese (ja) | Post-launch, perlu translator |
| Chinese (zh) | Post-launch, perlu translator |

UI strings (tombol, label, navigasi) untuk 5 bahasa bisa disiapkan lebih awal karena jumlahnya terbatas (~50-100 string).

### Tentang smartcounter-demo

Demo app (`smartcounter-demo`) tetap berdiri sendiri. Link "Get Free Demo" di website publik akan mengarah ke demo app atau halaman `/demo` dengan form request.

### Tentang Database

Database `smartcounter_web` **terpisah** dari `smartcounter-api`. Tidak ada shared tables. Jika di kemudian hari butuh integrasi (misal: lead dari form masuk ke CRM), bisa lewat webhook atau API call.
