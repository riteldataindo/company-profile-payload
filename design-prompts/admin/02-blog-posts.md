# Design Prompt — Blog Posts Collection Config

> Paste `admin/00-admin-context.md` di atas prompt ini.

---

## Goal
Collection config untuk blog posts yang memudahkan editor menulis artikel. Harus ada rich text editor yang lengkap, SEO fields, scheduling, dan preview.

## File
`src/collections/BlogPosts.ts`

## Collection Config Requirements

### Fields (urutan di form editor)

**Tab: Content**
- `title` — text, required, localized (5 locales), admin: description "Judul artikel (maks 60 karakter untuk SEO optimal)"
- `slug` — text, unique, auto-generated dari title (kebab-case), tidak localized
- `excerpt` — textarea, localized, admin: description "Ringkasan singkat 1-2 kalimat. Ditampilkan di listing blog dan meta description"
- `featuredImage` — upload (relationship ke Media), required
- `content` — richText (Lexical), localized, dengan semua features enabled:
  - Headings (H2, H3, H4)
  - Bold, italic, underline, strikethrough
  - Ordered + unordered list
  - Link (internal + external)
  - Upload (image embed)
  - Code block
  - Blockquote
  - Horizontal rule

**Tab: Meta**
- `category` — relationship ke BlogCategories, required
- `tags` — array of text
- `author` — relationship ke Users
- `publishedAt` — date, admin: "Tanggal publish. Kosongkan untuk draft."
- `status` — select: draft | published | scheduled, default: draft
  - Ketika status = "scheduled": publishedAt wajib diisi

**Tab: SEO**
- SEO plugin fields: `meta.title`, `meta.description`, `meta.image`
- admin description: "Kosongkan untuk auto-generate dari judul + excerpt"

### Admin UI Customization
- List view columns: title, status (badge), category, publishedAt, updatedAt
- Status badges: draft (gray) | published (green) | scheduled (yellow)
- Default sort: publishedAt desc
- Default filter: tampilkan semua (termasuk draft)

### Hooks
- `beforeChange`: auto-calculate `readingTime` dari content word count
- `afterChange`: revalidate ISR untuk halaman blog listing + blog post

### Access Control
```typescript
access: {
  read: () => true,          // public baca yang published
  create: isEditor,
  update: isEditor,
  delete: isSuperAdmin,
}
```

## Output
Full `BlogPosts.ts` collection config dengan semua fields, hooks, access control, dan admin UI customization.
