# SmartCounter Design System Context
> Paste bagian ini di awal setiap prompt sebelum instruksi spesifik.

---

## Brand
- **Product**: SmartCounter — AI-powered visitor analytics & people counting untuk retail Indonesia
- **Tagline**: "Stop Guessing, Start Using Data"
- **Logo**: Wordmark merah pure red `#FF0000` (digital display style untuk "SMART" + script untuk "Counter") dengan ikon orang berjalan. Logo TIDAK diubah warnanya untuk UI.

## Design Direction
- **Theme**: Dark ambient dengan red glow accent — bukan light mode
- **Mood**: Modern, data-driven, professional B2B tapi tidak kaku
- **Inspirasi**: Vercel dashboard, Linear, Stripe — dark + clean + red accent
- **TIDAK seperti**: WordPress lama, neon-heavy cyberpunk, terlalu gelap tanpa aksen

## Color Tokens (Tailwind)

```
Primary Red (accent, CTA, interactive):
  primary-50:   #FEF2F2
  primary-100:  #FEE2E2
  primary-400:  #F87171
  primary-500:  #EF4444   ← primary accent (icon, border, badge)
  primary-600:  #DC2626   ← CTA button, hover state
  primary-700:  #B91C1C   ← pressed state
  primary-900:  #7F1D1D

Background (dark ambient):
  bg-base:      #09090B   ← zinc-950 — hero, footer, deepest
  bg-surface:   #18181B   ← zinc-900 — main page background
  bg-card:      #27272A   ← zinc-800 — card, panel background
  bg-elevated:  #3F3F46   ← zinc-700 — hover state, input bg

Text:
  text-primary:   #FAFAFA   ← white on dark
  text-secondary: #A1A1AA   ← zinc-400 — muted, caption
  text-muted:     #71717A   ← zinc-500 — placeholder

Border:
  border-subtle:  #27272A   ← zinc-800
  border-default: #3F3F46   ← zinc-700

Red Glow Effects (CSS):
  glow-sm:  box-shadow: 0 0 20px rgba(239,68,68,0.15)
  glow-md:  box-shadow: 0 0 40px rgba(239,68,68,0.25)
  glow-lg:  box-shadow: 0 0 80px rgba(239,68,68,0.40)
  glow-xl:  box-shadow: 0 0 120px rgba(239,68,68,0.50)

Glass Morphism (card):
  background: rgba(39,39,42,0.60)
  backdrop-filter: blur(12px)
  border: 1px solid rgba(255,255,255,0.06)
```

## Typography
```
Heading font:  Fira Sans — Bold (700) / SemiBold (600)
Body font:     Fira Sans — Regular (400) / Medium (500)
Mono/Numbers:  Fira Code — tabular-nums untuk KPI, statistik
CJK fallback:  Noto Sans JP, Noto Sans KR, Noto Sans SC

Scale:
  h1: text-5xl md:text-7xl font-bold tracking-tight
  h2: text-3xl md:text-4xl font-bold
  h3: text-xl md:text-2xl font-semibold
  body: text-base (16px) leading-relaxed
  caption: text-sm text-secondary
  mono/stat: font-mono tabular-nums
```

## Tech Stack (untuk output code)
```
Framework:    Next.js 16.2 App Router, TypeScript strict
UI Library:   shadcn/ui + Radix UI primitives
Styling:      Tailwind CSS 4.x
Animation:    Framer Motion (scroll reveal, hover, transitions)
Icons:        Lucide React
CMS Data:     Props dari Payload CMS (server component, typed)
i18n:         5 locales — en (default), id, ko, ja, zh
              Dictionary: t('key') dari getDictionary(locale)
              URL: /[locale]/page-path
Images:       next/image dengan blur placeholder
```

## Component Rules
```
- Semua cards pakai glass morphism style (bg rgba + backdrop-blur + subtle border)
- Hover: card lift (translateY -4px) + glow intensify
- Buttons primary: bg-primary-600 hover:bg-primary-700 + glow-sm on hover
- Buttons outline: border-primary-600 text-primary-500 hover:bg-primary-600/10
- Section padding: py-20 md:py-32 px-4 md:px-8
- Max container: max-w-7xl mx-auto
- Grid: 1 col mobile → 2 col tablet → 3/4 col desktop
- Animasi: prefers-reduced-motion harus di-respect
- Semua teks harus i18n-ready (t('key'))
```

## Animation Pattern (Framer Motion)
```tsx
// Scroll reveal (gunakan ini untuk semua section)
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
}

// Stagger children
const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
}

// Always wrap dengan: whileInView, viewport={{ once: true }}
```

## Output Format yang Diharapkan
Setiap prompt meminta output berupa **React/Next.js Server atau Client Component** dalam TypeScript, siap di-paste ke `src/components/` atau `src/app/[locale]/`. Include:
- Full TypeScript interface untuk props
- Tailwind classes (tidak ada inline style)
- Framer Motion untuk animasi
- shadcn/ui components (import dari `@/components/ui/`)
- Placeholder data jika perlu (untuk preview)
- Comment singkat untuk bagian non-obvious
