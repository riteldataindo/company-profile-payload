# Design Prompt — Pricing Tiers Collection Config

> Paste `admin/00-admin-context.md` di atas prompt ini.

---

## Goal
Pricing tiers yang mudah dikelola oleh editor non-teknis. Harga bisa berupa teks bebas (bukan angka) karena sering "Hubungi Kami". Features per tier berupa list yang bisa di-toggle included/excluded.

## File
`src/collections/PricingTiers.ts`

## Fields

- `name` — text, required, localized (Basic, Add-On, Premium)
- `slug` — text, unique
- `priceLabel` — text, localized, admin: "Teks harga bebas. Contoh: 'Rp 2.5jt/bln', 'Hubungi Kami', 'Mulai dari Rp 5jt'"
- `description` — textarea, localized, admin: "Deskripsi singkat tier ini. Contoh: 'Cocok untuk toko single-outlet'"
- `features` — array, setiap item:
  - `featureText` — text, localized
  - `included` — checkbox (✓ atau ✗ di pricing table)
  - admin: "Tambahkan fitur. Centang 'included' jika fitur ini termasuk dalam tier ini."
- `isFeatured` — checkbox, admin: "Centang untuk highlight tier ini sebagai 'Most Popular'. Hanya satu tier yang boleh di-featured."
- `ctaText` — text, localized, default: "Get Started"
- `ctaLink` — text, admin: "URL tombol CTA. Contoh: /contact, /demo, https://wa.me/62..."
- `sortOrder` — number

## Admin UI
- List view: name, isFeatured (badge), sortOrder
- Warning jika lebih dari 1 tier di-featured: tampilkan message di admin

## Hooks
- `afterChange`: revalidate homepage + /pricing

## Output
Full `PricingTiers.ts` collection config dengan array features yang bisa dikelola editor.
