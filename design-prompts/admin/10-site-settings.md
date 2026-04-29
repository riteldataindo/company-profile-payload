# Design Prompt — Site Settings Global Config

> Paste `admin/00-admin-context.md` di atas prompt ini.

---

## Goal
Global singleton untuk konfigurasi seluruh website. Editor cukup ubah di sini — logo, kontak, social media, GA ID — tanpa perlu deploy ulang.

## File
`src/globals/SiteSettings.ts`

## Global Config Fields

### Tab: Branding
- `siteName` — text, localized, admin: "Nama website. Default: SmartCounter"
- `siteDescription` — textarea, localized, admin: "Deskripsi singkat website untuk SEO default"
- `logo` — upload Media, admin: "Logo untuk header (dark background). Rekomendasi SVG atau PNG transparan."
- `logoDark` — upload Media, admin: "Logo untuk background terang (jika ada)"
- `favicon` — upload Media, admin: "Favicon .ico atau .png 32×32px"
- `defaultOgImage` — upload Media, admin: "Gambar default untuk social media sharing (1200×630px)"

### Tab: Contact
- `contactEmail` — email, admin: "Email utama. Tampil di footer dan halaman contact."
- `contactPhone` — text, admin: "Nomor telepon. Format: +62-xxx-xxx-xxxx"
- `contactAddress` — textarea, localized, admin: "Alamat kantor lengkap"
- `whatsappNumber` — text, admin: "Nomor WhatsApp tanpa tanda + atau spasi. Contoh: 6281234567890"

### Tab: Social Media
- `socialLinks` — group:
  - `facebook` — text, admin: "URL Facebook page. Contoh: https://facebook.com/smartcounter"
  - `instagram` — text
  - `linkedin` — text
  - `youtube` — text
  - `tiktok` — text

### Tab: Analytics
- `googleAnalyticsId` — text, admin: "GA4 Measurement ID. Format: G-XXXXXXXXXX"
- `googleTagManagerId` — text, optional, admin: "GTM Container ID. Format: GTM-XXXXXXX"

## Hooks
- `afterChange`: revalidate semua halaman (karena SiteSettings tampil di navbar + footer)

## Output
Full `SiteSettings.ts` global config dengan semua fields dalam tabs yang terorganisir.
