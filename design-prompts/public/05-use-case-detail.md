# Design Prompt — Use Case Detail Page

> Paste `_context.md` di atas prompt ini sebelum dikirim ke Claude.

---

## Goal
Detail halaman untuk satu industri spesifik. Harus meyakinkan pemilik bisnis di industri tersebut bahwa SmartCounter adalah solusi tepat. Gunakan bahasa yang relatable untuk industri itu.

## Page Route
`src/app/[locale]/use-cases/[slug]/page.tsx`

## Layout Structure

### Hero Section
- Full-width image (16:9) industri dengan dark overlay gradient (bottom → full opacity)
- Di atas image: breadcrumb + badge industri
- Di tengah/bawah image: industry name (h1 besar, putih) + short description
- CTA: "Get Demo for [Industry Name]"

### Why SmartCounter Section
- Background: `bg-surface`
- Split: kiri metrics/stats yang relevan untuk industri ini, kanan teks
- 3-4 stats dalam angka besar (Fira Code): misal "40% Increase in Sales" dengan context
- Bullets manfaat spesifik industri ini

### Content Section (Rich Text)
- Background: `bg-base`
- Long description dari Payload (Lexical content)
- Sama seperti feature detail: styled h2, h3, bullets, blockquote

### Relevant Features Section
- Background: `bg-surface`
- "Features perfect for [Industry Name]"
- 4-6 feature cards yang relevan (data dari relasi di Payload)

### Social Proof (jika ada)
- Testimonial dari klien di industri ini (dari Testimonials collection)
- Quote card: foto + nama + role + company + quote
- Background: `bg-base`

### CTA
- "Start tracking your [industry] visitors today"
- Primary: "Get Free Demo" | Secondary: "View All Use Cases"

## TypeScript Props

```typescript
interface UseCaseDetailPageProps {
  params: { locale: string; slug: string }
  useCase: {
    id: string
    industryName: string
    icon: string
    shortDescription: string
    longDescription: any   // Lexical JSON
    image?: { url: string; alt: string; width: number; height: number }
    slug: string
  }
  relatedFeatures: Array<{
    id: string; name: string; icon: string; shortDescription: string; slug: string
  }>
  testimonials: Array<{
    id: string; name: string; role: string; company: string; quote: string
    avatar?: { url: string; alt: string }
  }>
  dict: Record<string, string>
}
```

## Output
1. `page.tsx` — server + generateMetadata + generateStaticParams
2. `UseCaseHero.tsx` — full-width image hero dengan overlay
3. `TestimonialCard.tsx` — quote card component (reusable)
