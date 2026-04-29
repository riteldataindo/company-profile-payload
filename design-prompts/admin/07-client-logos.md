# Design Prompt — Client Logos Collection Config

> Paste `admin/00-admin-context.md` di atas prompt ini.

---

## Goal
Kelola daftar logo klien yang tampil di homepage dan halaman lain sebagai social proof. Simple CRUD + reorder.

## File
`src/collections/ClientLogos.ts`

## Fields

- `companyName` — text, required, admin: "Nama perusahaan klien (untuk alt text dan tooltip)"
- `logo` — upload Media, required, admin: "Logo perusahaan. Rekomendasi: PNG transparan, minimal 200×80px. Akan ditampilkan dalam grayscale."
- `websiteUrl` — text, optional, admin: "URL website klien jika ingin logo bisa diklik"
- `sortOrder` — number, admin: "Urutan tampil di carousel. 0 = pertama"
- `isVisible` — checkbox, default: true

## Admin UI
- List view: logo thumbnail, companyName, isVisible, sortOrder
- Grid view option (untuk preview logo berdampingan)

## Hooks
- `afterChange`: revalidate homepage

## Output
Full `ClientLogos.ts` collection config dengan image preview di list view.
