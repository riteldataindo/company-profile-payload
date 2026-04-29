# Design Prompt — Features Listing Page

> Paste `_context.md` di atas prompt ini sebelum dikirim ke Claude.

---

## Goal
Halaman yang menampilkan semua fitur analitik SmartCounter dalam grid yang bersih dan informatif. User datang dari navbar "Features" atau dari homepage. Tujuan: showcase semua 12+ fitur, buat user penasaran untuk klik ke detail masing-masing.

## Page Route
`src/app/[locale]/features/page.tsx`

## Layout Structure

### Page Header
- Background: `bg-base` dengan subtle red glow di atas
- Breadcrumb: Home → Features (BreadcrumbList schema)
- Title: "All Features" (h1, besar)
- Subtitle: "12+ analytics capabilities powered by AI and computer vision"
- Badge: "AI-Powered" dengan icon `Sparkles`

### Features Grid
- Background: `bg-surface`
- Grid: 3 kolom (desktop) / 2 kolom (tablet) / 1 kolom (mobile)
- Setiap feature card:
  ```
  ┌─────────────────────────────┐
  │ [Icon]  Feature Name        │
  │                             │
  │ Short description text      │
  │ yang menjelaskan fitur ini  │
  │                             │
  │ Learn More →                │
  └─────────────────────────────┘
  ```
- Card style: glass morphism, border subtle, hover: lift + border-primary-500 + glow-sm
- Icon: Lucide icon, warna `primary-500`, size 24px, dalam kotak `bg-primary-500/10 rounded-lg p-2`
- "Learn More →" muncul on hover dengan slide-in animation

### Bottom CTA
- "Tidak menemukan yang kamu cari?"
- Link ke halaman Contact

## TypeScript Props

```typescript
interface FeaturesPageProps {
  params: { locale: string }
  features: Array<{
    id: string
    name: string
    icon: string        // nama Lucide icon
    shortDescription: string
    slug: string
    isVisible: boolean
  }>
  dict: Record<string, string>
}
```

## Animasi
- Cards: staggered fade-up saat halaman load (delay 0.1s per card)
- Hover: translateY(-4px) + glow-sm

## Output
1. `page.tsx` — server component
2. `FeatureCard.tsx` — reusable card component dengan hover animation
