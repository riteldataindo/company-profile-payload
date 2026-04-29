# Design Prompt — Features Collection Config + Reorder UI

> Paste `admin/00-admin-context.md` di atas prompt ini.

---

## Goal
Collection config untuk fitur produk SmartCounter. Editor harus bisa CRUD fitur, mengatur urutan (drag & drop), dan toggle visibility. Urutan fitur menentukan tampilan di homepage dan halaman features.

## File
`src/collections/Features.ts`

## Collection Config Requirements

### Fields

**Main**
- `name` — text, required, localized
- `slug` — text, unique, auto dari name
- `icon` — text, admin: { description: "Nama icon dari Lucide React. Contoh: Users, BarChart2, Map. Cek lucide.dev untuk daftar lengkap.", placeholder: "BarChart2" }
- `shortDescription` — textarea, localized, max 100 chars, admin: "Ditampilkan di card di homepage dan listing features"
- `longDescription` — richText (Lexical), localized, admin: "Konten detail untuk halaman feature/[slug]"
- `image` — upload ke Media, optional, admin: "Screenshot atau ilustrasi fitur ini"

**Display Settings**
- `sortOrder` — number, admin: "Angka lebih kecil = tampil lebih awal. 0 = pertama."
- `isVisible` — checkbox, default: true, admin: "Uncheck untuk sembunyikan dari website tanpa delete"

### Admin UI
- List view columns: icon (preview), name, isVisible (toggle), sortOrder
- Default sort: sortOrder asc
- **Custom reorder**: tambah drag-handle di list view (Payload sort field built-in)
- Filter: isVisible toggle di sidebar

### Hooks
- `afterChange`: revalidate ISR untuk homepage + /features

### Access
```typescript
access: {
  read: ({ data }) => data?.isVisible === true,  // public
  create: isEditor,
  update: isEditor,
  delete: isSuperAdmin,
}
```

## Output
Full `Features.ts` collection config dengan semua fields, admin UI, hooks, dan access control.
