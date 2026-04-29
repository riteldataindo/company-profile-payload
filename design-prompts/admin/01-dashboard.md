# Design Prompt — Admin Dashboard (Custom Home View)

> Paste `admin/00-admin-context.md` di atas prompt ini.

---

## Goal
Custom dashboard view sebagai halaman pertama saat admin login. Menggantikan Payload default dashboard dengan overview yang lebih useful: stats ringkas, konten terbaru, form submissions terbaru.

## Payload Config
```typescript
// payload.config.ts
export default buildConfig({
  admin: {
    components: {
      views: {
        Dashboard: {
          Component: './src/admin/views/Dashboard',
        }
      },
      graphics: {
        Logo: './src/admin/components/Logo',
        Icon: './src/admin/components/Icon',
      }
    }
  }
})
```

## Dashboard Layout (`src/admin/views/Dashboard.tsx`)

### Header
- Logo SmartCounter + "Admin Panel" text
- "Back to Website →" link ke `smartcounter.id` (buka tab baru)

### Stats Row (4 cards)
Fetch dari Payload Local API:
- Total blog posts (published vs draft)
- Total features (visible)
- Total form submissions (new/unread count — badge merah)
- Last content update (relative time: "2 hours ago")

### 2 Column Layout

**Kiri — Recent Content**
- Last 5 blog posts: title + status badge + date
- Link ke `/admin/collections/blog-posts/[id]`
- "View All Posts →"

**Kanan — Recent Form Submissions**
- Last 5 submissions: formType badge + email + time
- Unread submissions: row highlighted subtle
- "View All Submissions →"

### Quick Actions
- Row of action buttons:
  - "New Blog Post" → `/admin/collections/blog-posts/create`
  - "Edit Site Settings" → `/admin/globals/site-settings`
  - "View Homepage Config" → `/admin/globals/homepage`

## TypeScript

```typescript
// Dashboard.tsx — 'use client' atau server (tergantung Payload version)
// Fetch data via Payload Local API atau REST API
// Display stats, recent items, quick actions
```

## Output
1. `src/admin/views/Dashboard.tsx` — custom dashboard view
2. `src/admin/components/Logo.tsx` — SmartCounter logo untuk admin
3. `src/admin/components/Icon.tsx` — favicon untuk admin browser tab
