# Design Prompt — Pricing Page

> Paste `_context.md` di atas prompt ini sebelum dikirim ke Claude.

---

## Goal
Halaman pricing yang transparan dan meyakinkan. User harus bisa dengan mudah membandingkan 3 paket dan memilih yang sesuai. Highlighted tier harus langsung menarik perhatian.

## Page Route
`src/app/[locale]/pricing/page.tsx`

## Layout Structure

### Page Header
- Background: `bg-base`
- Title: "Simple, Transparent Pricing" (h1)
- Subtitle: "No hidden fees. Scale as you grow."
- Toggle switch (optional): Monthly / Annual (jika ada diskon tahunan, otherwise skip)

### Pricing Cards
- Background: `bg-surface`
- 3 cards dalam row (desktop) / stack (mobile)
- Layout cards:

**Standard card:**
```
┌──────────────────────────┐
│ BASIC                    │
│ Rp 2.5jt / bulan         │
│                          │
│ Perfect for small stores │
│                          │
│ ✓ Feature 1              │
│ ✓ Feature 2              │
│ ✓ Feature 3              │
│ ✗ Feature 4 (Premium)    │
│ ✗ Feature 5 (Premium)    │
│                          │
│ [Get Started]            │
└──────────────────────────┘
```

**Featured/highlighted card** (isFeatured = true):
- Scale slightly larger (scale-105) atau border glow-md
- Badge "Most Popular" di atas card
- Background: `bg-primary-600/10` + border-primary-600
- Glow-md merah di sekitar card
- Button: filled primary-600

### Comparison Table (di bawah cards)
- Detailed feature comparison table untuk semua 3 tiers
- Shadcn Table component
- Rows: setiap feature, Columns: Basic | Add-On | Premium
- Nilai: ✓ (CheckCircle merah) / ✗ (X abu-abu) / angka limit
- Sticky header kolom saat scroll

### FAQ Pricing Section
- 4-5 pertanyaan spesifik tentang pricing
- "Apakah ada kontrak?" / "Bisakah upgrade/downgrade?" / dll
- shadcn Accordion

### Enterprise CTA
- "Need a custom plan for 50+ locations?"
- Contact Us button

## TypeScript Props

```typescript
interface PricingPageProps {
  params: { locale: string }
  pricingTiers: Array<{
    id: string
    name: string
    priceLabel: string    // "Rp 2.5jt/bln" atau "Hubungi Kami"
    description: string
    features: Array<{
      featureText: string
      included: boolean
    }>
    isFeatured: boolean
    ctaText: string
    ctaLink: string
    sortOrder: number
  }>
  faqItems: Array<{ question: string; answer: string }>
  dict: Record<string, string>
}
```

## Animasi
- Cards: fade-up saat load
- Featured card: subtle pulse glow animation (CSS, bukan JS)
- Hover card non-featured: lift + subtle glow

## Output
1. `page.tsx` — server component
2. `PricingCard.tsx` — individual pricing card (featured vs standard variant)
3. `PricingComparisonTable.tsx` — comparison table
4. `PricingFaq.tsx` — accordion FAQ section
