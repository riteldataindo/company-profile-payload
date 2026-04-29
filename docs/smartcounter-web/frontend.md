# Frontend

## Public Routes (12 pages)

| Route | Page | Type |
|-------|------|------|
| `/[locale]` | Homepage | 9 server+client sections |
| `/[locale]/features` | Features listing | 12 AI feature cards |
| `/[locale]/features/[slug]` | Feature detail | 12 pages with SVG mockups |
| `/[locale]/use-cases` | Use Cases listing | 6 industry cards |
| `/[locale]/use-cases/[slug]` | Use Case detail | Per-industry page |
| `/[locale]/packages` | Packages | 3 tier cards + comparison table |
| `/[locale]/faq` | FAQ | Search + category filter + accordion |
| `/[locale]/blog` | Blog listing | Featured + grid + pagination |
| `/[locale]/blog/[slug]` | Blog detail | Article + TOC + share |
| `/[locale]/contact` | Contact | Form + WhatsApp link |
| `/[locale]/demo` | Demo request | Form + live demo link |
| `not-found` | 404 | Quick links grid |

## Homepage Section Order

| # | Section | Component | Background |
|---|---------|-----------|------------|
| 1 | Hero | `Hero.tsx` | base |
| 2 | Pain Points | `PainPoints.tsx` | surface |
| 3 | Deployment Map + Client Logos | `DeploymentMap.tsx` + `ClientLogos.tsx` | base |
| 4 | Features Grid | `FeaturesGrid.tsx` | surface |
| 5 | Heatmap Benefit | `HeatmapBenefit.tsx` | base |
| 6 | Use Cases | `UseCasesShowcase.tsx` | surface |
| 7 | Packages Teaser | `PackagesTeaser.tsx` | base |
| 8 | FAQ | `FaqAccordion.tsx` | surface |
| 9 | CTA Banner | `CtaBanner.tsx` | base |

All sections are dict-driven — content comes from `getDictionary(locale)`, not hardcoded.

## Feature Detail Pages

12 pages at `/[locale]/features/[slug]` with:
- Hero section (icon, title, subtitle, description)
- Inline SVG dashboard mockup (unique per feature — see `FeatureMockup.tsx`)
- Benefits list (6-7 items per feature)
- Use cases list (4 items per feature)
- Related features (3 per feature)
- CTA banner

### SVG Dashboard Mockups

Component: `src/components/sections/FeatureMockup.tsx`

Each feature has a unique hand-crafted SVG visualization rendered inside a `DashboardFrame` wrapper:

| Feature | Visualization |
|---------|--------------|
| Visitor Traffic | Hourly bar chart (14 bars, color-coded by intensity) |
| In-Out Traffic | Dual bar chart (red entries vs blue exits) |
| Dwell Time | Horizontal bar per zone (New Arrivals 6.8m → Checkout 1.8m) |
| Passers-by | Funnel diagram (2,340 → 890 → 412 with capture rate %) |
| Entering Rate | Area/line weekly trend (Mon-Sun with peak highlight) |
| Group Rate | Split panel — Individual 64% vs Groups 36% with people dots |
| Demographic | Donut chart (Male/Female) + age group horizontal bars |
| Occupancy | Floor plan with 5 zones, capacity bars (red/amber/green/blue) |
| Service Efficiency | Overlay: visitor bars + staff count line per hour |
| Heatmap | Floor plan with heat blobs (red/amber/blue gradients) + legend |
| Queuing | Live counter status rows with queue dots + ALERT badge |
| In-Store Routes | Node-flow diagram (Entrance→Zones→Checkout with % arrows) |

## Design System

### Theme Toggle (3 modes)

| Mode | Icon | Behavior |
|------|------|----------|
| Auto | SunMoon | Follows system `prefers-color-scheme` |
| Light | Sun | Forces light mode |
| Dark | Moon | Forces dark mode |

Saved in `localStorage('theme')`. Inline `<script>` in `<head>` prevents flash of wrong theme.

### Color Tokens

| Token | Dark | Light |
|-------|------|-------|
| `bg-base` | #09090B | #FFFFFF |
| `bg-surface` | #18181B | #F4F4F5 |
| `bg-card` | #27272A | #FAFAFA |
| `bg-elevated` | #3F3F46 | #E4E4E7 |
| `text-primary` | #FAFAFA | #09090B |
| `text-secondary` | #A1A1AA | #52525B |
| `text-muted` | #71717A | #A1A1AA |
| `border-subtle` | #27272A | #E4E4E7 |
| `border-default` | #3F3F46 | #D4D4D8 |

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `logo-red` | #FF0000 | Logo only |
| `primary-500` | #EF4444 | UI accent |
| `primary-600` | #DC2626 | Buttons, CTA |
| `primary-700` | #B91C1C | Hover states |

### Typography

- **Body:** Fira Sans (400/500/600/700)
- **Mono:** Fira Code (400/500) — KPI numbers, code blocks
- **tabular-nums** on stat cards for alignment

## Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| Navbar | `layout/Navbar.tsx` | Logo, nav links, LocaleSwitcher, ThemeToggle, Get Demo CTA |
| Footer | `layout/Footer.tsx` | Contact info, nav columns, copyright |
| ThemeProvider | `layout/ThemeProvider.tsx` | Dark/light/auto context + localStorage |
| ThemeToggle | `layout/ThemeToggle.tsx` | Cycle button (SunMoon→Sun→Moon) |
| WhatsAppFloat | `layout/WhatsAppFloat.tsx` | Floating WA button with popup + suggestions + text input |
| LocaleSwitcher | `layout/LocaleSwitcher.tsx` | Globe + locale dropdown (EN/ID/KO/JA/ZH) |
| ScrollReveal | `sections/ScrollReveal.tsx` | Intersection observer fade-in animation wrapper |

## WhatsApp Float Widget

Floating button (bottom-right) with popup:
- 5 suggested questions with Lucide icons (HelpCircle, CreditCard, Wrench, CalendarCheck, Sparkles)
- Clicking a suggestion fills the text input (not directly opens WA)
- User can edit or write custom message
- Enter/send button opens `wa.me` with the message
- Fully localized (follows selected language)
- Theme-aware (CSS variables)

## Deployment Map (Leaflet)

| Setting | Value |
|---------|-------|
| Tile Provider | CartoDB (`dark_all` / `light_all`) |
| Center | [-2.5, 117], zoom 5 |
| Data Source | `DeploymentLocations` Payload collection (20 cities) |
| Major cities | Larger dot + permanent label |
| Theme | Auto-switches tiles with dark/light mode |

SSR fix: Dynamic `import('leaflet')` inside `useEffect`. Tailwind conflict fix: `.leaflet-container img.leaflet-tile { max-width: none !important }`.
