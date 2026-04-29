# Design Prompt — FAQ Page

> Paste `_context.md` di atas prompt ini sebelum dikirim ke Claude.

---

## Goal
Halaman FAQ lengkap yang membantu user menemukan jawaban sebelum menghubungi tim. Harus mudah di-scan dan punya search/filter.

## Page Route
`src/app/[locale]/faq/page.tsx`

## Layout Structure

### Page Header
- Background: `bg-base`
- Title: "Frequently Asked Questions" (h1)
- Search bar: input dengan icon `Search`, placeholder "Search questions..."
  - Filter real-time saat user mengetik (client component)
  - Tidak perlu backend search

### Category Filter
- Tab pills horizontal: "All" | "Installation" | "Analytics" | "Pricing" | "Technical" | dll
- shadcn Tabs atau custom pill buttons
- Active tab: bg-primary-600 text-white
- Filter accordion list sesuai kategori yang dipilih

### FAQ Accordion List
- shadcn Accordion (type="multiple" — bisa buka banyak sekaligus)
- Setiap item:
  ```
  ▾ Apakah SmartCounter perlu internet?          [+]
    ─────────────────────────────────────────────────
    Jawaban detail di sini. Bisa mengandung formatting
    seperti bold, list, atau link.
  ```
- Divider antar items: border subtle
- Open indicator: chevron rotate 180° (smooth transition)
- Answer: rendered sebagai HTML (support bold, list, link)

### "Still Have Questions?" Section
- Bottom CTA
- 2 cards: "Chat with Us" (WhatsApp icon) + "Send Email" (Mail icon)
- Background: glass morphism

## TypeScript Props

```typescript
interface FaqPageProps {
  params: { locale: string }
  faqItems: Array<{
    id: string
    question: string
    answer: string       // HTML string atau plain text
    category: string     // untuk grouping/filter
    sortOrder: number
  }>
  dict: Record<string, string>
}
```

## Client Component (Search + Filter)
```typescript
// FaqClient.tsx — 'use client'
// Props: faqItems[]
// State: searchQuery, activeCategory
// Filter: faqItems.filter(item => 
//   item.question.toLowerCase().includes(searchQuery) &&
//   (activeCategory === 'all' || item.category === activeCategory)
// )
```

## SEO
- `generateMetadata()`: "FAQ | SmartCounter"
- JSON-LD: FAQPage schema dengan semua Q&A pairs

## Output
1. `page.tsx` — server component
2. `FaqClient.tsx` — client component (search + filter + accordion)
