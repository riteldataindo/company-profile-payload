# Design Prompt — Demo Request Page

> Paste `_context.md` di atas prompt ini sebelum dikirim ke Claude.

---

## Goal
Halaman untuk request free demo SmartCounter. Ini adalah conversion point paling penting di website. Form harus singkat, jelas, dan tidak intimidating. Juga ada link ke smartcounter-demo untuk coba langsung.

## Page Route
`src/app/[locale]/demo/page.tsx`

## Layout Structure

### Page Hero
- Background: `bg-base` + glow besar merah di belakang
- Badge: "Free, No Commitment"
- Title: "See SmartCounter in Action" (h1)
- Subtitle: "Get a personalized demo for your store — takes only 30 minutes"
- 3 quick points: ✓ No credit card required ✓ Setup in minutes ✓ Free support

### 2 Column Layout

**Kiri — Benefits (40%)**
- "What you'll get in the demo:"
- Bullet list dengan icon `CheckCircle` merah:
  - Live product walkthrough
  - Setup untuk store Anda
  - Q&A dengan tim ahli
  - Pricing yang sesuai
- Social proof: "Joined by 500+ stores"
- Testimonial mini: 1 quote dari klien

**Kanan — Demo Form (60%)**
```
┌─────────────────────────────────────┐
│ Nama Lengkap *                      │
│ [                              ]    │
│                                     │
│ Email Bisnis *                      │
│ [                              ]    │
│                                     │
│ Nomor WhatsApp *                    │
│ [                              ]    │
│                                     │
│ Nama Perusahaan *                   │
│ [                              ]    │
│                                     │
│ Jumlah Toko                         │
│ [ 1-5 ▾ ]  (select dropdown)       │
│                                     │
│ Ada pertanyaan spesifik?            │
│ [                              ]    │
│                                     │
│ [Request Free Demo →]              │
│                                     │
│ Atau coba demo sendiri:            │
│ [Try Live Demo →]                  │
└─────────────────────────────────────┘
```

### "Or Try Live Demo" Section
- Setelah form, section terpisah
- "Prefer to explore on your own?"
- Card besar dengan preview screenshot dashboard
- Button: "Try Live Demo" → link ke smartcounter-demo
- Label: "No registration needed for the demo"

## TypeScript

```typescript
const demoSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8, 'Nomor WhatsApp tidak valid'),
  company: z.string().min(2),
  storeCount: z.enum(['1-5', '6-20', '21-50', '50+']),
  message: z.string().optional()
})
```

## UX Details
- Submit → Success page dengan next steps: "Tim kami akan menghubungi dalam 24 jam"
- Urgency: "Limited slots this week" badge (optional, manual dari admin)
- Phone field: auto-format Indonesian format (+62)

## Output
1. `page.tsx` — server component
2. `DemoRequestForm.tsx` — client component (form, validasi, submit)
3. `LiveDemoCard.tsx` — card link ke smartcounter-demo
