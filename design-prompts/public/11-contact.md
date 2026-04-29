# Design Prompt — Contact Page

> Paste `_context.md` di atas prompt ini sebelum dikirim ke Claude.

---

## Goal
Halaman kontak yang accessible dan meyakinkan. Harus ada multiple cara menghubungi (form, WhatsApp, email, alamat) dan form yang mudah diisi.

## Page Route
`src/app/[locale]/contact/page.tsx`

## Layout Structure

### Page Header
- Background: `bg-base`
- Title: "Get in Touch" (h1)
- Subtitle: "We usually respond within 24 hours"

### Main Content (2 Column Layout)

**Kiri — Contact Info (40%)**
- Background: glass morphism card
- Items dengan icon:
  - `Mail`: info@smartcounter.id
  - `Phone`: nomor telepon
  - `MapPin`: alamat kantor
  - `Clock`: jam operasional
- WhatsApp button besar: `MessageCircle` icon + "Chat on WhatsApp" (bg-green-600)
- Social links row: LinkedIn, Instagram, YouTube

**Kanan — Contact Form (60%)**
```
┌─────────────────────────────────────┐
│ Nama Lengkap *                      │
│ [                              ]    │
│                                     │
│ Email *                             │
│ [                              ]    │
│                                     │
│ Nomor Telepon                       │
│ [                              ]    │
│                                     │
│ Perusahaan                          │
│ [                              ]    │
│                                     │
│ Pesan *                             │
│ [                              ]    │
│ [                              ]    │
│ [                              ]    │
│                                     │
│ [Send Message →]                   │
└─────────────────────────────────────┘
```
- shadcn Form + react-hook-form + Zod validation
- Error messages di bawah setiap field (merah)
- Submit button: primary-600, loading spinner saat submit
- Success state: checkmark + "Thank you! We'll be in touch soon."
- Error state: "Something went wrong. Please try again."

### Map Section (optional)
- Embedded map atau illustrated static map
- Jika pakai Google Maps embed: lazy load

## TypeScript

```typescript
// Form schema (Zod)
const contactSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Pesan minimal 10 karakter')
})

type ContactFormData = z.infer<typeof contactSchema>

// Server Action
async function submitContact(data: ContactFormData): Promise<{ success: boolean; error?: string }>
```

## Validation & UX
- Real-time validation (onBlur per field)
- Rate limiting: handled di server action
- CSRF: Next.js server action sudah handle
- Semua error messages localized (dari dict)

## Output
1. `page.tsx` — server component (contact info dari SiteSettings)
2. `ContactForm.tsx` — client component (form + validation + submission)
