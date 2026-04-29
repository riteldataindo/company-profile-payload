# Design Prompt — Use Cases Collection Config

> Paste `admin/00-admin-context.md` di atas prompt ini.

---

## Goal
Collection config untuk use cases per industri. Mirip dengan Features tapi lebih fokus ke industri dengan gambar yang lebih dominan.

## File
`src/collections/UseCases.ts`

## Fields

- `industryName` — text, required, localized (nama industri: "Retail Store", "Shopping Mall", dll)
- `slug` — text, unique, auto dari industryName
- `icon` — text (Lucide icon name), admin: "Icon untuk card kecil. Contoh: ShoppingBag, Building2, Shirt"
- `shortDescription` — textarea, localized, admin: "Deskripsi singkat untuk card di homepage (max 80 karakter)"
- `longDescription` — richText (Lexical), localized, admin: "Konten lengkap halaman /use-cases/[slug]"
- `image` — upload Media, required, admin: "Gambar industri. Rekomendasi 1200×600px, landscape. Tampil sebagai hero di halaman detail."
- `sortOrder` — number, admin: "Urutan tampil. 0 = pertama"
- `isVisible` — checkbox, default: true

## Admin UI
- List view: industryName, isVisible, sortOrder
- Default sort: sortOrder asc
- Preview image di list view (thumbnail)

## Hooks
- `afterChange`: revalidate homepage + /use-cases

## Output
Full `UseCases.ts` collection config.
