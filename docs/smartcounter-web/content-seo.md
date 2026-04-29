# Content & SEO

## Dictionary Structure

Single source of truth: `src/lib/i18n/dictionaries/en.json`

```
en.json
├── nav          — Navigation labels
├── hero         — Homepage hero (badge, title, subtitle, CTAs)
├── common       — Shared strings (contactUs, learnMore, copyright)
├── painPoints   — 3 pain point cards (title + desc)
├── features     — 12 feature cards (name + desc)
├── heatmap      — Heatmap section (badge, title, desc, bullets)
├── useCases     — 6 use case cards (name + desc + stat)
├── coverage     — Map section labels
├── packages     — 3 pricing tiers (name + desc + features array)
├── faqItems     — 6 FAQ items (q + a)
├── waFloat      — WhatsApp widget (title, status, intro, suggestions, placeholder)
├── cta          — CTA banner text
└── footer       — Footer labels
```

## Auto-Translation System

**Library:** `google-translate-api-x` (free, no API key needed)

**Flow:**
1. Admin writes EN content only (in `en.json` or Payload CMS)
2. `getDictionary(locale)` called on page render
3. If locale !== 'en': flatten all strings → single batch API call → translate
4. Cache in `Map<string, Record<string, any>>` (persists for server lifetime)
5. First request per locale ~2-3s, all subsequent requests instant

**Implementation:** `src/lib/translate.ts` + `src/lib/i18n/getDictionary.ts`

**Components updated:** PainPoints, FeaturesGrid, UseCasesShowcase, PackagesTeaser, FaqAccordion, HeatmapBenefit, WhatsAppFloat — all read from `dict` prop.

## i18n Routing

| Locale | Language | Source |
|--------|----------|--------|
| `en` | English | `en.json` (source of truth) |
| `id` | Indonesian | Auto-translated |
| `ko` | Korean | Auto-translated |
| `ja` | Japanese | Auto-translated |
| `zh` | Chinese (Simplified) | Auto-translated |

**Middleware** (`src/middleware.ts`):
1. Read `preferred-locale` cookie
2. Fallback to `Accept-Language` header
3. Default to `en`
4. Redirect to `/[locale]/...` path

**Language Switcher** (`LocaleSwitcher.tsx`):
- Globe icon + locale code (EN/ID/KO/JA/ZH)
- Sets `preferred-locale` cookie
- Full page redirect via `window.location.href`

## SEO Strategy

### Per-Route Metadata

Every page uses `generateMetadata()` with:
- Title template: `%s | SmartCounter`
- Default: `People Counting & Visitor Analytics Indonesia | SmartCounter`
- Description tailored per page
- Keywords: "people counting", "CCTV AI", "visitor analytics", "foot traffic counter"

### JSON-LD Schemas

| Schema | Route |
|--------|-------|
| Organization | Homepage |
| WebSite | Homepage |
| SoftwareApplication | Homepage |
| FAQPage | FAQ page |
| BlogPosting | Blog detail |
| Service | Feature detail |
| BreadcrumbList | All pages |

### hreflang

5 locale variants + `x-default` (→ `/en`):
```html
<link rel="alternate" hreflang="en" href="https://smartcounter.id/en/..." />
<link rel="alternate" hreflang="id" href="https://smartcounter.id/id/..." />
<link rel="alternate" hreflang="ko" href="https://smartcounter.id/ko/..." />
<link rel="alternate" hreflang="ja" href="https://smartcounter.id/ja/..." />
<link rel="alternate" hreflang="zh" href="https://smartcounter.id/zh/..." />
<link rel="alternate" hreflang="x-default" href="https://smartcounter.id/en/..." />
```

### Payload SEO Plugin

`@payloadcms/plugin-seo` configured for: pages, blog-posts, features, use-cases.

Auto-generates:
- Title (from doc.title)
- Description (from doc.excerpt or doc.shortDescription)
- Meta image (from uploads collection)

### Content from smartcounter.id

All public-facing text aligned with live smartcounter.id:
- Hero: "#1 People Counting Platform Indonesia"
- 12 feature names matching live site
- 6 use cases with conversion stats (+35%, +50%, etc.)
- FAQ: 6 questions from live site
- Contact: info@riteldata.id, WA +62 882-1001-9165, Sunter Agung Jakarta Utara

### Remaining SEO Tasks

- [ ] `sitemap.ts` — dynamic sitemap generation
- [ ] `robots.ts` — allow/disallow rules
- [ ] 301 redirects from WordPress URLs
- [ ] Lighthouse audit
- [ ] Google Search Console setup
- [ ] Google Analytics integration
