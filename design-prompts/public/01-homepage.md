# Design Prompt — Homepage (Full Page)

> Paste `_context.md` di atas prompt ini sebelum dikirim ke Claude.

---

## Goal
Buat halaman homepage SmartCounter yang lengkap — interaktif, modern, dan meyakinkan. Homepage adalah halaman paling penting: harus langsung komunikasikan value proposition dalam 3 detik pertama. Data semua diambil dari Payload CMS (props dari server component).

## Page Route
`src/app/[locale]/page.tsx`

## Sections (urutan dari atas ke bawah)

### 1. Hero Section
- Background: `bg-base` (#09090B) dengan red ambient glow radial di tengah (`rgba(239,68,68,0.15)` blur 200px)
- Headline besar: `h1` — "Stop Guessing, Start Using Data" (dari Homepage global, localized)
- Subheadline: `text-xl text-secondary` — 1-2 kalimat value proposition
- 2 CTA buttons: Primary "Get Free Demo" (bg-primary-600) + Secondary "See How It Works" (outline)
- Stats bar di bawah CTA: 3 angka besar — "99.9% Accuracy", "12+ Analytics", "500+ Stores" dengan label kecil di bawahnya. Angka pakai Fira Code, count-up animation saat visible
- Optional: floating dashboard preview screenshot dengan glow effect

### 2. Pain Points Section
- Background: `bg-surface`
- Title: "Still Counting Visitors Manually?"
- 3 pain points dalam card grid (3 col desktop): icon + judul + deskripsi singkat
- Icons: Lucide — misalnya `AlertCircle`, `Clock`, `TrendingDown`
- Masing-masing card: glass morphism, border merah subtle, hover lift

### 3. Features Grid Section
- Background: `bg-base`
- Section title: "12+ Analytics Features" dengan badge "AI-Powered"
- Grid 3×4 (desktop) / 2×6 (tablet) / 1×12 (mobile)
- Setiap feature card: icon (Lucide, warna primary-500) + nama + short description
- Hover: card glow-sm + border-primary-600
- Data: `features: Feature[]` dari props (dari Payload Features collection)

### 4. Heatmap Benefit Section
- Background: `bg-surface`
- Split layout: kiri teks, kanan ilustrasi/screenshot heatmap
- Teks: judul + paragraf + 3 bullet points dengan checkmark icon merah
- Visual: image dengan rounded-xl + glow-md di sekitarnya
- Animasi: image masuk dari kanan saat scroll

### 5. Use Cases Showcase Section
- Background: `bg-base`
- Section title: "Built for Every Retail Format"
- 6 industry cards dalam grid (3 col desktop): icon + nama industri + deskripsi singkat
- Data: `useCases: UseCase[]` dari props
- Card style: glass morphism, hover menampilkan "Learn More →" link

### 6. Client Logos Section
- Background: `bg-surface`
- Title: "Trusted by 500+ Stores Across Indonesia"
- Logo grid/carousel: 18+ client logos dalam 2 baris, auto-scroll
- Logos: grayscale default, full color on hover
- Data: `clientLogos: ClientLogo[]` dari props

### 7. Pricing Teaser Section
- Background: `bg-base`
- Section title: "Simple, Transparent Pricing"
- 3 pricing cards (Basic, Add-On, Premium) — isFeatured card lebih besar/highlighted
- Setiap card: nama, harga label, top 3-4 features, CTA button
- Featured card: border-primary-600 + glow-md
- Data: `pricingTiers: PricingTier[]` dari props

### 8. FAQ Section
- Background: `bg-surface`
- Section title: "Frequently Asked Questions"
- Accordion list (shadcn Accordion component)
- 6 Q&A dari props
- Data: `faqItems: FaqItem[]` dari props

### 9. Final CTA Banner
- Background: dark gradient + red glow-xl di belakang
- Text besar: "Ready to Transform Your Retail Insights?"
- 2 buttons: "Get Free Demo" + "Contact Us"
- Animasi: pulsing glow background

## TypeScript Props Interface

```typescript
interface HomepageProps {
  params: { locale: string }
  heroData: {
    title: string
    subtitle: string
    ctaPrimary: { text: string; href: string }
    ctaSecondary: { text: string; href: string }
    stats: Array<{ value: string; label: string }>
  }
  features: Array<{
    id: string
    name: string
    icon: string
    shortDescription: string
    slug: string
  }>
  useCases: Array<{
    id: string
    industryName: string
    icon: string
    shortDescription: string
    slug: string
    image?: { url: string; alt: string }
  }>
  pricingTiers: Array<{
    id: string
    name: string
    priceLabel: string
    features: Array<{ featureText: string; included: boolean }>
    isFeatured: boolean
    ctaText: string
    ctaLink: string
  }>
  faqItems: Array<{ id: string; question: string; answer: string }>
  clientLogos: Array<{ id: string; companyName: string; logo: { url: string } }>
  dict: Record<string, string>
}
```

## Animasi yang Diharapkan
- Hero headline: fade in + slight scale up saat load
- Stats: count-up animation saat masuk viewport
- Semua section cards: staggered fade-up saat scroll
- Client logos: continuous auto-scroll (CSS animation, bukan JS)
- CTA banner: pulsing radial glow
- `prefers-reduced-motion`: semua animasi dimatikan

## Output yang Diharapkan
Full Next.js Server Component untuk `page.tsx` yang mengambil data dari Payload dan pass ke Client Components untuk animasi. Pisahkan menjadi:
1. `page.tsx` — server component, fetch data, pass props
2. `HeroSection.tsx` — client component (animasi count-up)
3. `FeaturesGrid.tsx` — client component (hover + scroll reveal)
4. `PricingTable.tsx` — client component (hover states)
5. Sections lain boleh digabung atau dipisah sesuai kebutuhan
