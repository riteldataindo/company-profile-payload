# Design Prompt — Users Collection + Role-Based Access

> Paste `admin/00-admin-context.md` di atas prompt ini.

---

## Goal
Sistem user management yang aman dengan 3 role levels. SSO-ready: auth strategy modular agar bisa di-swap ke Sanctum bridge nanti.

## File
`src/collections/Users.ts`

## Collection Config

### Fields
- `name` — text, required
- `email` — email, required, unique (dipakai untuk SSO bridge lookup)
- `role` — select, required, default: editor
  - Options:
    - `super_admin` — akses penuh
    - `editor` — bisa CRUD konten, tidak bisa ubah Users/Settings
    - `viewer` — read-only, bisa lihat form submissions

### Auth Config
```typescript
auth: {
  tokenExpiration: 7200,      // 2 jam
  verify: false,
  maxLoginAttempts: 5,
  lockTime: 600 * 1000,       // 10 menit lockout setelah 5 gagal
}
```

### Access Control (helper functions)
```typescript
// src/lib/access.ts
export const isSuperAdmin = ({ req }) =>
  req.user?.role === 'super_admin'

export const isEditor = ({ req }) =>
  ['super_admin', 'editor'].includes(req.user?.role)

export const isViewer = ({ req }) =>
  !!req.user   // semua yang login

export const isPublic = () => true
```

### Collection-Level Access Matrix
| Collection | Read (public) | Create | Update | Delete |
|---|---|---|---|---|
| Pages | true | editor | editor | super_admin |
| BlogPosts | published only | editor | editor | super_admin |
| Features | visible only | editor | editor | super_admin |
| UseCases | visible only | editor | editor | super_admin |
| PricingTiers | true | editor | editor | super_admin |
| FaqItems | visible only | editor | editor | super_admin |
| ClientLogos | visible only | editor | editor | super_admin |
| Testimonials | visible only | editor | editor | super_admin |
| FormSubmissions | false | via API | editor (status only) | super_admin |
| Media | true | editor | editor | super_admin |
| Users | isViewer | super_admin | self or super_admin | super_admin |
| SiteSettings | true | — | super_admin | — |
| Navigation | true | — | editor | — |
| Homepage | true | — | editor | — |

### SSO-Ready Auth Strategy
```typescript
// Pluggable untuk nanti di-swap ke Sanctum bridge
// src/lib/auth/strategy.ts
export const defaultAuthStrategy = {
  // Standard Payload email/password
  // Nanti tinggal tambah SSOAuthStrategy yang verify Sanctum token
}
```

### Admin UI
- List view: name, email, role (badge colored), createdAt
- Role badges: super_admin (red) | editor (blue) | viewer (gray)
- Super admin hanya bisa dibuat oleh super admin lain

## Output
1. `Users.ts` — collection config dengan auth, fields, dan access
2. `src/lib/access.ts` — shared access control helper functions
