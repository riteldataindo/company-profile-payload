# Design Prompt — About Page

> Paste `_context.md` di atas prompt ini sebelum dikirim ke Claude.

---

## Goal
Memperkenalkan PT Ritel Data Indonesia — siapa mereka, mengapa SmartCounter lahir, misi, dan tim. Harus membangun kepercayaan dan menunjukkan bahwa ini bukan startup sembarangan.

## Page Route
`src/app/[locale]/about/page.tsx`

## Layout Structure

### Hero Section
- Background: `bg-base` + glow merah
- Title: "About SmartCounter" atau "Empowering Retail with Data" (h1)
- Subtitle: 1-2 kalimat company tagline
- 3 highlight stats: Founded Year, Stores Served, Countries (jika ada)

### Story Section
- Background: `bg-surface`
- Split: teks kiri, gambar/ilustrasi kanan
- "Our Story" — narasi singkat mengapa SmartCounter dibangun
- Rich text dari Payload (Pages collection untuk About)

### Mission & Vision
- Background: `bg-base`
- 2 cards besar: Mission | Vision
- Glass morphism, icon large di atas text

### Why Us / Differentiators
- Background: `bg-surface`
- 4 differentiator cards dalam 2×2 grid:
  - "99.9% Accuracy" — AI-powered, bukan manual
  - "Real-time Data" — live dashboard
  - "Easy Integration" — plug and play
  - "Local Support" — tim Indonesia
- Setiap card: large icon merah + judul + deskripsi

### Team Section (optional, jika ada data)
- Background: `bg-base`
- "Our Team" title
- Cards: foto (avatar circular 80px) + nama + role
- Jika tidak ada data → skip section

### Contact CTA
- Background: `bg-surface`
- "Want to learn more? Let's talk."
- Buttons: "Contact Us" + "Get Demo"

## TypeScript Props

```typescript
interface AboutPageProps {
  params: { locale: string }
  pageContent: {
    title: string
    content: any        // Lexical JSON
  } | null
  dict: Record<string, string>
}
```

## Output
1. `page.tsx` — server component
2. Sections sebagai sub-components di dalam page (tidak perlu file terpisah karena sederhana)
