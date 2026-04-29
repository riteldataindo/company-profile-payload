# Design Prompt — Feature Detail Page

> Paste `_context.md` di atas prompt ini sebelum dikirim ke Claude.

---

## Goal
Halaman detail untuk satu fitur spesifik (misal: "Heatmap Analytics", "People Counting", "Demographics"). Harus meyakinkan user bahwa fitur ini powerful dan mudah digunakan.

## Page Route
`src/app/[locale]/features/[slug]/page.tsx`

## Layout Structure

### Hero Section (Feature)
- Background: `bg-base` + radial glow merah subtle
- Breadcrumb: Home → Features → [Feature Name]
- Icon besar: `w-16 h-16` dalam `bg-primary-500/10 rounded-2xl`, icon merah
- Title: nama fitur (h1)
- Subtitle: short description
- Optional: screenshot/preview image feature dengan glow effect

### Content Section
- Background: `bg-surface`
- Rich text content dari Payload (Lexical → HTML)
- Styling untuk rich text:
  - `h2`: text-2xl font-bold text-primary dengan left border merah
  - `h3`: text-xl font-semibold
  - `p`: text-secondary leading-relaxed
  - `ul/ol`: dengan custom bullet (dot merah atau checkmark)
  - `blockquote`: border-l-4 border-primary-600 bg-card px-6 py-4
  - `code`: font-mono bg-card px-2 py-1 rounded text-primary-400
  - `img`: rounded-xl full-width dengan caption

### Related Features Section
- Background: `bg-base`
- Title: "Related Features"
- 3 feature cards horizontal (data dari features collection, filtered by related)
- Reuse `FeatureCard` component dari features listing

### CTA Section
- "Ready to see [Feature Name] in action?"
- 2 buttons: "Get Free Demo" + "View All Features"

## TypeScript Props

```typescript
interface FeatureDetailPageProps {
  params: { locale: string; slug: string }
  feature: {
    id: string
    name: string
    icon: string
    shortDescription: string
    longDescription: any   // Lexical JSON → rendered as HTML
    image?: { url: string; alt: string; width: number; height: number }
    slug: string
  }
  relatedFeatures: Array<{
    id: string; name: string; icon: string
    shortDescription: string; slug: string
  }>
  dict: Record<string, string>
}
```

## SEO
- `generateMetadata()` dengan title: "[Feature Name] | SmartCounter"
- JSON-LD: BreadcrumbList + Service schema

## Output
1. `page.tsx` — server component + generateMetadata + generateStaticParams
2. `RichTextRenderer.tsx` — component untuk render Lexical content dengan styling
3. `RelatedFeatures.tsx` — section related features
