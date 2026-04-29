# Admin Panel Context
> Paste bagian ini di awal setiap admin prompt, GANTIKAN `_context.md` publik.

---

Admin panel SmartCounter menggunakan **Payload CMS 3.81+ built-in admin UI**. Tidak perlu design dari nol — Payload sudah provide UI dasar. Yang perlu di-design adalah:

1. **Custom admin components** — komponen React yang di-inject ke Payload admin (via `admin.components`)
2. **Custom views** — halaman tambahan di dalam admin (misal: dashboard analytics, form submissions viewer)
3. **Collection config UI** — pengaturan tampilan field, grouping, descriptions di admin panel

## Payload Admin Design System

Payload admin menggunakan design system sendiri (dark, clean). Kita dapat **extend** dengan:
- `admin.components.Nav` — custom sidebar nav items
- `admin.components.graphics.Logo` — logo SmartCounter
- `admin.components.graphics.Icon` — favicon
- Custom views via `admin.components.views`
- Custom fields via `admin.components.Field`

## Color untuk Admin Components
Karena admin Payload punya design system sendiri, custom components harus **blend in**:
```css
/* Payload admin CSS variables (sudah ada) */
--color-base-0: #fff;
--color-base-1000: #000;
--color-base-850: #1b1b1b;  /* dark bg */

/* Gunakan Payload's own CSS variables untuk konsistensi */
/* Custom accent: tetap pakai primary-600 (#DC2626) untuk brand elements */
```

## Output Format Admin Prompts
Setiap prompt admin meminta:
1. **Payload Collection Config** — TypeScript config file (`src/collections/X.ts`)
2. **Custom Admin Component** (jika perlu) — React component yang di-inject ke Payload
3. **Field descriptions & UI hints** — agar editor tahu cara pakai admin panel

## Yang TIDAK Perlu Di-design
- Login page admin (Payload handle sendiri)
- Navigation sidebar dasar (Payload handle sendiri)
- List view tabel (Payload handle sendiri, kecuali custom columns)
- Edit form basic (Payload generate dari collection config)
