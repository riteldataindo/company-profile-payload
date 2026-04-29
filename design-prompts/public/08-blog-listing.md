# Design Prompt — Blog Listing Page

> Paste `_context.md` di atas prompt ini sebelum dikirim ke Claude.

---

## Goal
Halaman listing blog yang profesional dan mudah di-browse. Harus mendorong user untuk baca artikel dan meningkatkan SEO organik SmartCounter.

## Page Route
`src/app/[locale]/blog/page.tsx`
`src/app/[locale]/blog/category/[slug]/page.tsx` (reuse layout yang sama)

## Layout Structure

### Page Header
- Background: `bg-base`
- Title: "SmartCounter Blog" (h1)
- Subtitle: "Insights, tips, dan berita seputar retail analytics"

### Category Filter Pills
- Background: `bg-surface`
- Horizontal scrollable pills: "All" | "People Counting" | "Retail Analytics" | "Tips & Tricks" | dll
- Active: bg-primary-600 text-white
- Link ke `/[locale]/blog/category/[slug]`

### Featured Post (1 post terbesar)
- Background: `bg-base`
- Layout landscape (desktop): image kiri 60% + content kanan 40%
- Image: featured image full-height, rounded-xl, dengan gradient overlay
- Content: category badge + title (h2 besar) + excerpt + author + date + reading time
- CTA: "Read Article →"

### Posts Grid
- Background: `bg-surface`
- Grid 3 kolom (desktop) / 2 (tablet) / 1 (mobile)
- Setiap card:
  ```
  ┌─────────────────────────┐
  │ [Featured Image]        │
  │                         │
  │ [Category Badge]        │
  │ Article Title Here      │
  │                         │
  │ Excerpt text...         │
  │                         │
  │ [Avatar] Name · 5 min   │
  │ Apr 17, 2026            │
  └─────────────────────────┘
  ```
- Image: aspect-video, object-cover, rounded-t-xl
- Category badge: bg-primary-500/10 text-primary-500 text-xs px-2 py-1 rounded-full
- Hover: card lift + image zoom subtle

### Pagination
- shadcn Pagination component
- Current page highlighted dengan primary-600
- Previous / Next buttons

## TypeScript Props

```typescript
interface BlogListingPageProps {
  params: { locale: string }
  posts: Array<{
    id: string
    title: string
    slug: string
    excerpt: string
    featuredImage?: { url: string; alt: string }
    category?: { name: string; slug: string }
    author?: { name: string; avatar?: { url: string } }
    publishedAt: string
    readingTime: number
  }>
  featuredPost: BlogPost | null
  categories: Array<{ id: string; name: string; slug: string }>
  currentCategory?: string
  totalPosts: number
  currentPage: number
  totalPages: number
  dict: Record<string, string>
}
```

## Output
1. `page.tsx` — server component
2. `BlogCard.tsx` — reusable card (standard variant)
3. `FeaturedPostCard.tsx` — landscape featured card
4. `CategoryFilter.tsx` — filter pills (client component untuk active state)
