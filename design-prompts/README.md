# SmartCounter — Design Prompts

Kumpulan prompt per-feature untuk Claude Design. Setiap file adalah prompt mandiri yang bisa langsung digunakan.

## Cara Pakai

1. Buka file prompt yang diinginkan
2. Copy isi `_context.md` (untuk public pages) atau `admin/00-admin-context.md` (untuk admin)
3. Paste context di atas isi prompt tersebut
4. Kirim ke Claude

---

## Public Pages (13 prompts)

| # | File | Halaman | Route |
|---|---|---|---|
| 01 | `public/01-homepage.md` | Homepage lengkap (semua sections) | `/[locale]/` |
| 02 | `public/02-features-listing.md` | Daftar semua fitur produk | `/[locale]/features` |
| 03 | `public/03-feature-detail.md` | Detail satu fitur | `/[locale]/features/[slug]` |
| 04 | `public/04-use-cases-listing.md` | Daftar use case per industri | `/[locale]/use-cases` |
| 05 | `public/05-use-case-detail.md` | Detail satu industri | `/[locale]/use-cases/[slug]` |
| 06 | `public/06-pricing.md` | Halaman pricing + comparison table | `/[locale]/pricing` |
| 07 | `public/07-faq.md` | FAQ dengan search + filter | `/[locale]/faq` |
| 08 | `public/08-blog-listing.md` | Blog listing + category filter | `/[locale]/blog` |
| 09 | `public/09-blog-post-detail.md` | Detail artikel blog + TOC | `/[locale]/blog/[slug]` |
| 10 | `public/10-about.md` | Tentang perusahaan | `/[locale]/about` |
| 11 | `public/11-contact.md` | Kontak + form | `/[locale]/contact` |
| 12 | `public/12-demo-request.md` | Request demo + live demo link | `/[locale]/demo` |
| 13 | `public/13-404.md` | Halaman 404 custom | `not-found.tsx` |

---

## Admin Panel (14 prompts)

| # | File | Feature | Type |
|---|---|---|---|
| 00 | `admin/00-admin-context.md` | **Context file** — paste di awal admin prompts | — |
| 01 | `admin/01-dashboard.md` | Custom admin dashboard (stats + recent items) | Custom View |
| 02 | `admin/02-blog-posts.md` | Blog post editor (rich text, SEO, scheduling) | Collection |
| 03 | `admin/03-features-management.md` | Kelola fitur produk + reorder | Collection |
| 04 | `admin/04-use-cases-management.md` | Kelola use case industri + image | Collection |
| 05 | `admin/05-pricing-management.md` | Kelola pricing tiers + features list | Collection |
| 06 | `admin/06-faq-management.md` | Kelola FAQ + kategorisasi | Collection |
| 07 | `admin/07-client-logos.md` | Kelola logo klien + reorder | Collection |
| 08 | `admin/08-form-submissions.md` | Lihat & kelola form submissions + export CSV | Collection + Custom View |
| 09 | `admin/09-media-library.md` | Media upload + auto resize + alt text | Collection |
| 10 | `admin/10-site-settings.md` | Logo, kontak, social media, GA ID | Global |
| 11 | `admin/11-navigation.md` | Menu navbar + footer menus | Global |
| 12 | `admin/12-homepage-config.md` | Hero text, stats, urutan sections | Global |
| 13 | `admin/13-users-roles.md` | User management + 3 roles + SSO-ready | Collection |
| 14 | `admin/14-layout-components.md` | Navbar, Footer, Language Switcher, Mobile Menu, WhatsApp | Components |

---

## Design System Reference
- Lihat `_context.md` untuk color tokens, typography, animation patterns, dan tech stack
- Primary accent: `#EF4444` (red-500) / `#DC2626` (red-600)
- Background: `#09090B` (zinc-950) / `#18181B` (zinc-900)
- Font: Fira Sans + Fira Code
- Logo: pure red `#FF0000` — tidak diubah

## Tech Stack Context
- Framework: Next.js 16.2 App Router + TypeScript strict
- CMS: Payload CMS 3.81+
- UI: shadcn/ui + Tailwind CSS 4.x
- Animation: Framer Motion
- i18n: 5 locales (en default, id, ko, ja, zh)
