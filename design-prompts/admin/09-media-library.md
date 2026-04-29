# Design Prompt — Media Collection Config

> Paste `admin/00-admin-context.md` di atas prompt ini.

---

## Goal
Media collection yang menghasilkan multiple image sizes otomatis, memastikan semua gambar punya alt text (wajib untuk SEO), dan upload experience yang smooth.

## File
`src/collections/Media.ts`

## Collection Config

### Upload Config
```typescript
upload: {
  staticDir: path.resolve(dirname, '../../public/media'),
  staticURL: '/media',
  imageSizes: [
    { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
    { name: 'card', width: 800, height: 600, position: 'centre' },
    { name: 'hero', width: 1920, height: undefined, position: 'centre' },
    { name: 'og', width: 1200, height: 630, position: 'centre' },
  ],
  adminThumbnail: 'thumbnail',
  mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
  formatOptions: {
    format: 'webp',      // auto-convert ke WebP
    quality: 85,
  },
}
```

### Fields
- `alt` — text, required, localized
  - admin: { description: "WAJIB DIISI. Deskripsi gambar untuk accessibility dan SEO. Contoh: 'Dashboard SmartCounter menampilkan traffic pengunjung'" }
- `caption` — text, optional, localized
  - admin: { description: "Caption opsional yang tampil di bawah gambar artikel" }

### Admin UI
- List view: thumbnail, filename, alt (preview), createdAt
- Warning jika alt kosong

## Output
Full `Media.ts` collection config dengan imageSizes, format options, dan alt field yang required.
