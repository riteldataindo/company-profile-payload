# Design Prompt — Form Submissions Custom View

> Paste `admin/00-admin-context.md` di atas prompt ini.

---

## Goal
Tempat admin melihat dan mengelola semua form submissions (contact + demo request). Harus terlihat jelas mana yang belum dibaca, dan ada cara untuk export CSV.

## File
`src/collections/FormSubmissions.ts` + `src/admin/views/FormSubmissions.tsx`

## Collection Config Fields

- `formType` — select: contact | demo | newsletter, required
- `data` — json, admin: read-only, display sebagai formatted key-value pairs
- `email` — email, indexed (untuk search cepat)
- `status` — select: new | read | replied, default: new
- `createdAt` — auto timestamp

## Admin UI Customization

### List View
- Columns: formType (badge colored), email, status (badge), createdAt
- Status badges:
  - `new`: bg-primary-600 (merah) — urgent
  - `read`: bg-zinc-600 (gray)
  - `replied`: bg-green-600 (hijau)
- Default sort: createdAt desc (terbaru di atas)
- Filter: by formType, by status
- **New submissions count badge** di nav sidebar SmartCounter Admin

### Detail View (read submission)
- Data JSON ditampilkan sebagai kartu info:
  ```
  Nama: John Doe
  Email: john@example.com
  Telepon: +62812345678
  Perusahaan: PT Maju Jaya
  Pesan: "Kami tertarik dengan..."
  ```
- Status selector (dropdown: new → read → replied)
- Timestamp: "Diterima 2 jam yang lalu"

### Custom Action: Export CSV
- Tombol "Export CSV" di list view header
- Export semua submissions yang terfilter ke CSV
- Server action: fetch dari DB, generate CSV, download

### Custom Admin Component: Badge di Sidebar
```typescript
// Tampilkan jumlah unread submissions sebagai badge merah di nav
// src/admin/components/FormSubmissionsBadge.tsx
```

## Access
```typescript
access: {
  read: isSuperAdmin || isEditor,
  create: () => false,   // hanya via API (public submit)
  update: isSuperAdmin || isEditor,  // untuk ubah status
  delete: isSuperAdmin,
}
```

## Output
1. `FormSubmissions.ts` — collection config
2. `src/admin/components/FormSubmissionsBadge.tsx` — badge sidebar
3. Export CSV server action
