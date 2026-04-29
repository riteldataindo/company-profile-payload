# Design Prompt — Navbar + Footer + Language Switcher

> Paste `_context.md` (public context, bukan admin) di atas prompt ini.

---

## Goal
Layout components yang dipakai di seluruh halaman publik. Harus: sticky navbar dengan glass morphism, footer informatif, language switcher untuk 5 bahasa, dan WhatsApp floating button.

## Files
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/LanguageSwitcher.tsx`
- `src/components/layout/MobileMenu.tsx`
- `src/components/layout/WhatsAppButton.tsx`

## Navbar Requirements

### Desktop (≥ 1024px)
```
[Logo]  [Home] [Features] [Use Cases] [Pricing] [Blog]    [Language ▾]  [Get Demo]
```
- Background: `transparent` → `bg-zinc-950/80 backdrop-blur-md` saat scroll > 50px
- Border bottom: muncul saat scroll (border-zinc-800)
- Logo: `next/image`, height 32px
- Menu items: text-secondary hover:text-white transition
- Dropdown untuk menu item yang punya children
- Language switcher: custom dropdown (flag emoji + nama bahasa)
- "Get Demo" button: bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md

### Mobile (< 1024px)
- Sembunyikan menu, tampilkan hamburger button
- Hamburger: `Menu` icon → `X` icon saat open
- Mobile menu: sheet/drawer dari kanan (shadcn Sheet)
- Di dalam sheet: full menu vertikal + language switcher + CTA button

### Scroll Behavior
- Sticky (`position: fixed, top: 0`)
- Transition background: smooth 300ms
- Hide saat scroll down > 200px, show saat scroll up (optional)

## Footer Requirements

```
[Logo]              [Quick Links]    [Products]       [Contact]
[Tagline]           Home             Features         📧 Email
                    About            Pricing          📞 Phone
[Social Icons]      Blog             Use Cases        📍 Address
                    Contact          Demo
                    FAQ

─────────────────────────────────────────────────────────────────
© 2026 PT Ritel Data Indonesia · Privacy Policy · Terms of Service
```

- Background: `bg-zinc-950`
- Top border: 1px border-zinc-800
- Data dari SiteSettings global + Navigation global
- Social icons: Lucide icons, hover: text-primary-500

## Language Switcher

```tsx
// Dropdown dengan 5 pilihan:
// 🇺🇸 English
// 🇮🇩 Indonesia
// 🇰🇷 한국어
// 🇯🇵 日本語
// 🇨🇳 中文

// Active locale: checkmark ✓
// Klik → update URL locale, set cookie 'preferred-locale'
// shadcn DropdownMenu
```

## WhatsApp Floating Button
- Fixed: `bottom-6 right-6` z-50
- Circle button: bg-green-500 hover:bg-green-600 p-4 rounded-full shadow-lg
- Icon: `MessageCircle` (Lucide) atau custom WhatsApp SVG
- Tooltip: "Chat dengan kami"
- nomor dari SiteSettings.whatsappNumber
- Link: `https://wa.me/${whatsappNumber}`

## TypeScript Props

```typescript
// Navbar props — server component ambil dari Navigation global
interface NavbarProps {
  mainMenu: NavigationItem[]
  locale: string
  dict: Record<string, string>
}

// Footer props
interface FooterProps {
  footerColumns: FooterColumn[]
  siteSettings: SiteSettings
  locale: string
  dict: Record<string, string>
}
```

## Output
5 component files sesuai daftar di atas, lengkap dengan TypeScript + Tailwind + Framer Motion untuk mobile menu animation.
