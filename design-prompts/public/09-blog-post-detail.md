# Design Prompt — Blog Post Detail Page

> Paste `_context.md` di atas prompt ini sebelum dikirim ke Claude.

---

## Goal
Reading experience yang nyaman dan SEO-optimal. Pembaca harus fokus pada konten, dengan helper seperti Table of Contents dan Related Posts untuk navigasi lebih lanjut.

## Page Route
`src/app/[locale]/blog/[slug]/page.tsx`

## Layout Structure

### Reading Progress Bar
- Fixed top: thin bar (2-3px) yang mengisi dari kiri ke kanan sesuai scroll position
- Warna: `bg-primary-600`
- Client component

### Article Header
- Background: `bg-base`
- Category badge + date + reading time (misal "5 min read")
- Title: h1 besar (text-4xl md:text-5xl font-bold)
- Subtitle/excerpt jika ada
- Author row: avatar circular (40px) + nama author + tanggal publish
- Featured image: full-width, max-height 500px, object-cover, rounded-xl di bawah header

### Article Layout (2 Column Desktop)
```
┌──────────────────────────────────┬──────────────┐
│                                  │              │
│   Article Content (rich text)    │ [TOC Sticky] │
│                                  │              │
│   60-70% width                   │  30-40%      │
│                                  │              │
└──────────────────────────────────┴──────────────┘
```
- Mobile: single column, TOC collapsible di atas content

### Table of Contents (Sticky Sidebar)
- Extract H2 dan H3 dari artikel
- Active heading highlighted saat scroll (Intersection Observer)
- Active: text-primary-500 + border-l-2 border-primary-500
- Max height dengan overflow-y-auto
- Title: "On This Page"

### Article Content Styling (Rich Text)
- `h2`: text-2xl font-bold mt-10 mb-4 dengan border-l-4 border-primary-600 pl-4
- `h3`: text-xl font-semibold mt-8 mb-3
- `p`: text-secondary leading-relaxed mb-6
- `ul/ol`: dengan custom styling, indented
- `blockquote`: glass morphism card, border-l-4 primary, italic
- `code inline`: font-mono bg-card text-primary-400 px-2 py-0.5 rounded
- `pre code block`: bg-zinc-900 rounded-xl p-6 overflow-x-auto dengan syntax highlight
- `img`: rounded-xl full-width + caption bawah
- `a`: text-primary-500 underline hover:text-primary-400
- `strong`: text-white font-semibold
- `hr`: border-subtle

### Social Share (setelah content)
- Title: "Share this article"
- Buttons: Twitter/X, LinkedIn, Facebook, WhatsApp, Copy Link
- Buttons: icon + label, outline style

### Author Bio Card
- Background: glass morphism card
- Avatar (80px) + nama + bio singkat
- Border-l-4 primary-600

### Related Posts
- Background: `bg-surface`
- Title: "You Might Also Like"
- 3 BlogCard components
- Data: posts dari kategori yang sama

### Comment/Engagement
- "Was this article helpful?" dengan thumbs up/down (optional, client component)

## TypeScript Props

```typescript
interface BlogPostDetailPageProps {
  params: { locale: string; slug: string }
  post: {
    id: string
    title: string
    slug: string
    content: any        // Lexical JSON
    excerpt: string
    featuredImage?: { url: string; alt: string; width: number; height: number }
    category?: { name: string; slug: string }
    tags: string[]
    author?: {
      name: string
      avatar?: { url: string }
      bio?: string
    }
    publishedAt: string
    updatedAt: string
    readingTime: number
    meta: { title?: string; description?: string }
  }
  relatedPosts: BlogPost[]
  dict: Record<string, string>
}
```

## SEO
- `generateMetadata()`: title dari post.meta.title
- JSON-LD: Article/BlogPosting schema lengkap

## Output
1. `page.tsx` — server + generateMetadata + generateStaticParams
2. `ReadingProgressBar.tsx` — client, fixed top
3. `TableOfContents.tsx` — client, sticky sidebar, intersection observer
4. `ArticleContent.tsx` — render Lexical JSON as styled HTML
5. `SocialShare.tsx` — client, share buttons + copy link
6. `AuthorBio.tsx` — author card
