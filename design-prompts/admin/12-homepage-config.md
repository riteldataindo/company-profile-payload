# Design Prompt — Homepage Global Config

> Paste `admin/00-admin-context.md` di atas prompt ini.

---

## Goal
Global untuk konfigurasi konten dan urutan section di homepage — semua tanpa coding. Editor bisa ubah hero text, stats, dan bahkan urutan section.

## File
`src/globals/Homepage.ts`

## Global Config Fields

### Tab: Hero
- `heroTitle` — text, required, localized, admin: "Headline utama. Contoh: 'Stop Guessing, Start Using Data'"
- `heroSubtitle` — textarea, localized, admin: "Subheadline 1-2 kalimat di bawah judul utama"
- `ctaPrimary` — group:
  - `text` — text, localized, default: "Get Free Demo"
  - `link` — text, default: "/demo"
- `ctaSecondary` — group:
  - `text` — text, localized, default: "See How It Works"
  - `link` — text, default: "#features"
- `backgroundImage` — upload Media, optional, admin: "Gambar background hero. Jika kosong, pakai dark background default."

### Tab: Stats Bar
- `stats` — array (max 4), setiap item:
  - `value` — text, admin: "Angka atau teks besar. Contoh: '99.9%', '12+', '500+'"
  - `label` — text, localized, admin: "Label di bawah angka. Contoh: 'Accuracy', 'Analytics Features'"
  - admin description: "Stats bar tampil di bawah CTA di hero section"

### Tab: Sections
- `sectionsOrder` — array of select, setiap item adalah section name:
  - Options: pain_points | features | heatmap | use_cases | clients | pricing | faq | testimonials
  - Default order: pain_points → features → heatmap → use_cases → clients → pricing → faq
  - admin: "Atur urutan section di homepage dengan drag & drop. Tidak perlu semua diisi."

## Hooks
- `afterChange`: revalidate homepage (/)

## Output
Full `Homepage.ts` global config dengan hero, stats, dan sections order control.
