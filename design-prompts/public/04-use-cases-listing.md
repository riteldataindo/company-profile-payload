# Design Prompt — Use Cases Listing Page

> Paste `_context.md` di atas prompt ini sebelum dikirim ke Claude.

---

## Goal
Showcase 6 industri retail yang menggunakan SmartCounter. User yang datang dari "Use Cases" di navbar ingin tahu apakah SmartCounter relevan untuk bisnis mereka. Halaman harus visual dan langsung terasa relatable.

## Page Route
`src/app/[locale]/use-cases/page.tsx`

## Layout Structure

### Page Header
- Background: `bg-base` dengan glow merah
- Title: "SmartCounter for Every Retail Format" (h1)
- Subtitle: "From boutique fashion to large shopping malls, we have the solution"

### Industries Grid
- Background: `bg-surface`
- 6 cards dalam grid 3×2 (desktop) / 2×3 (tablet) / 1×6 (mobile)
- Setiap card lebih besar dari feature cards — lebih visual:
  ```
  ┌──────────────────────────────────┐
  │ [Image/Illustration]            │
  │                                  │
  │ 🏪 Retail Store                  │
  │ Short description tentang       │
  │ bagaimana SmartCounter membantu │
  │ industri ini                    │
  │                                  │
  │ [Explore Use Case →]            │
  └──────────────────────────────────┘
  ```
- Image: gambar industri atau ilustrasi, aspect ratio 16:9, `object-cover rounded-t-xl`
- Card body: glass morphism, padding dalam
- Hover: image zoom subtle (scale 1.05) + card lift + border merah

### Industries (6 cards):
1. Retail Store (Toko Retail) — `ShoppingBag`
2. Shopping Mall (Mall) — `Building2`
3. Fashion Store (Fashion) — `Shirt`
4. Pharmacy (Apotek) — `Pill`
5. Supermarket — `ShoppingCart`
6. Luxury Store (Luxury Retail) — `Crown`

### Bottom Section
- Tidak punya industri yang sesuai? → "Contact us for custom solutions"

## TypeScript Props

```typescript
interface UseCasesPageProps {
  params: { locale: string }
  useCases: Array<{
    id: string
    industryName: string
    icon: string
    shortDescription: string
    slug: string
    image?: { url: string; alt: string }
    isVisible: boolean
  }>
  dict: Record<string, string>
}
```

## Animasi
- Cards: stagger fade-up
- Image hover: scale(1.05) dengan `overflow-hidden` di card

## Output
1. `page.tsx` — server component
2. `UseCaseCard.tsx` — card dengan image + hover effects
