# Design Prompt — Navigation Global Config

> Paste `admin/00-admin-context.md` di atas prompt ini.

---

## Goal
Global untuk mengelola menu navigasi utama (navbar) dan footer. Editor harus bisa tambah/hapus/reorder menu items tanpa koding. Mendukung nested menu (submenu dropdown).

## File
`src/globals/Navigation.ts`

## Global Config Fields

### Main Menu
- `mainMenu` — array, setiap item:
  - `label` — text, required, localized
  - `link` — text, required, admin: "URL relatif atau absolut. Contoh: /features, /en/pricing, https://..."
  - `openInNewTab` — checkbox, default: false
  - `children` — array (nested, sama struktur tanpa children), untuk dropdown
    - Max 1 level nesting (dropdown, bukan mega menu)

### Footer Menu
- `footerColumns` — array, setiap kolom:
  - `columnTitle` — text, localized, admin: "Judul kolom footer. Contoh: 'Quick Links', 'Products'"
  - `links` — array:
    - `label` — text, localized
    - `link` — text
    - `openInNewTab` — checkbox

## Admin UI
- Array fields dengan drag-handle untuk reorder
- Preview link URL saat hover
- admin description: "Ubah main menu atau footer menu di sini. Perubahan langsung tampil tanpa deploy."

## Hooks
- `afterChange`: revalidate semua halaman (navbar + footer ada di setiap halaman)

## Output
Full `Navigation.ts` global config dengan nested array untuk main menu dan footer columns.
