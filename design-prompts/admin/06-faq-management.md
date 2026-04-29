# Design Prompt — FAQ Items Collection Config

> Paste `admin/00-admin-context.md` di atas prompt ini.

---

## Goal
FAQ items yang mudah dikelola — tambah, edit, reorder, dan kategorikan. Editor harus bisa kelola tanpa bantuan developer.

## File
`src/collections/FaqItems.ts`

## Fields

- `question` — text, required, localized
- `answer` — richText (Lexical sederhana — hanya bold, italic, link, list), localized
  - admin: "Jawaban bisa mengandung format sederhana dan link. Tidak perlu heading."
- `category` — text, localized, admin: { description: "Kategori untuk filter di website. Contoh: 'Installation', 'Pricing', 'Technical', 'General'", placeholder: "General" }
- `sortOrder` — number
- `isVisible` — checkbox, default: true

## Admin UI
- List view: question (truncated), category, isVisible, sortOrder
- Group by category di list view (optional)
- Default sort: sortOrder asc

## Hooks
- `afterChange`: revalidate /faq

## Output
Full `FaqItems.ts` collection config.
