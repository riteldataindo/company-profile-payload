# Analisis Kebutuhan — smartcounter.id (WordPress → Next.js)

> Tanggal: 2026-04-24
> Scope: Rebuild website company profile smartcounter.id dari WordPress ke Next.js + TypeScript dengan admin panel sendiri

---

## 1. Ringkasan & Tujuan

**Kondisi saat ini:**
- Website smartcounter.id berjalan di **WordPress** sebagai company profile / product information
- Tampilan statis, tidak interaktif, desain membosankan
- SEO dikelola oleh **Yoast SEO** (sitemap otomatis, tapi meta per halaman belum optimal)
- Blog baru 4 artikel, kategori masih "Uncategorized"
- Tidak ada kode lokal — semua di hosting WordPress

**Tujuan:**
- Website modern, interaktif, performa tinggi dengan Next.js + TypeScript
- Admin panel sendiri untuk mengelola konten tanpa coding (seperti WordPress tapi milik sendiri)
- SEO harus **minimal sama atau lebih baik** dari kondisi WordPress saat ini
- Blog yang fungsional dan SEO-friendly
- Konten dinamis yang bisa dikonfigurasi dari admin (fitur, use case, pricing, FAQ, dll)

---

## 2. Inventarisasi Konten Saat Ini

### 2.1 Halaman yang Ada

| Halaman | URL | Tipe Konten |
|---|---|---|
| Homepage | `/` | Landing page — hero, features, pain points, social proof, use cases, pricing, FAQ |
| About | `/about/` | Informasi perusahaan |
| Contact | `/contact/` | Form kontak / informasi kontak |
| Demo | `/demo/` | Request demo |
| Fitur | `/fitur/` | Detail fitur produk |
| Use Case | `/use-case/` | Kasus penggunaan per industri |
| Paket | `/paket/` | Harga & paket layanan |
| FAQ | `/faq/` | Pertanyaan yang sering ditanyakan |
| Blog | `/blog/` | Daftar artikel |
| News | `/news-2/` | Halaman berita |

### 2.2 Blog Posts (4 artikel)

| Judul | URL (flat, tanpa /blog/ prefix) |
|---|---|
| Apa itu People Counting System? | `/apa-itu-people-counting-system/` |
| Cara Kerja People Counting Berbasis AI | `/cara-kerja-people-counting-cctv-ai/` |
| 7 Manfaat Visitor Counter untuk Toko Retail | `/manfaat-visitor-counter-toko-retail/` |
| CCTV AI: Teknologi di Balik People Counting | `/cctv-ai-people-counting-visitor-analytics/` |

### 2.3 Konten Terstruktur di Homepage

| Jenis Konten | Jumlah | Keterangan |
|---|---|---|
| Features | 12+ item | Nama fitur, deskripsi, ikon |
| Use Cases | 6 vertikal | Retail, mall, fashion, pharmacy, supermarket, luxury |
| Pricing Tiers | 3 paket | Basic, Add-On, Premium — masing-masing dengan daftar fitur |
| FAQ Items | 6 pasang | Pertanyaan + jawaban |
| Client Logos | 18+ | Logo perusahaan klien |
| CTA Buttons | 5+ | "Get Free Demo", "Contact Us", "Free Consultation" |

---

## 3. Kebutuhan Fungsional

### 3.1 Halaman Publik (Frontend)

| Halaman | Konten dari Admin? | Keterangan |
|---|---|---|
| **Homepage** | Ya — semua section | Hero text, features list, use cases, pricing, FAQ, client logos |
| **About** | Ya | Profil perusahaan, tim, visi misi |
| **Features** | Ya | Detail 12+ fitur — masing-masing bisa punya halaman sendiri |
| **Use Cases** | Ya | Per industri, bisa punya halaman detail |
| **Pricing / Paket** | Ya | Tier, harga, daftar fitur per tier |
| **Blog** | Ya | Daftar artikel + halaman detail artikel |
| **Blog Post** | Ya | Konten artikel lengkap dengan rich text |
| **FAQ** | Ya | Pasangan pertanyaan-jawaban, bisa di-group per kategori |
| **Contact** | Sebagian | Form kontak — field bisa dikonfigurasi, tujuan email fix |
| **Demo Request** | Sebagian | Form request demo |

### 3.2 Content Types yang Perlu Dimodelkan

Ini adalah data yang harus bisa dikelola lewat admin panel — **bukan hardcode di kode**:

#### A. Pages (Halaman Statis)
```
- title
- slug
- content (rich text / block editor)
- meta_title
- meta_description
- og_image
- status (draft / published)
- created_at, updated_at
```

#### B. Blog Posts
```
- title
- slug
- content (rich text / block editor)
- excerpt (ringkasan)
- featured_image
- category (relasi ke BlogCategory)
- tags[]
- author
- meta_title
- meta_description
- og_image
- status (draft / published / scheduled)
- published_at
- created_at, updated_at
```

#### C. Blog Categories
```
- name
- slug
- description
- meta_title
- meta_description
```

#### D. Features (Fitur Produk)
```
- name
- slug
- icon
- short_description (untuk card di homepage)
- long_description (untuk halaman detail, rich text)
- image / screenshot
- sort_order
- is_visible (tampil/sembunyikan)
```

#### E. Use Cases (Kasus Penggunaan)
```
- industry_name
- slug
- icon
- short_description
- long_description (rich text)
- image
- sort_order
- is_visible
```

#### F. Pricing Tiers (Paket Harga)
```
- name (Basic / Add-On / Premium)
- slug
- price_label (text, bukan angka — karena bisa "Hubungi Kami")
- description
- features[] (daftar fitur yang termasuk)
- is_featured (highlight tier ini)
- cta_text
- cta_link
- sort_order
```

#### G. FAQ Items
```
- question
- answer (rich text)
- category (opsional, untuk grouping)
- sort_order
- is_visible
```

#### H. Client Logos (Social Proof)
```
- company_name
- logo_image
- website_url (opsional)
- sort_order
- is_visible
```

#### I. Testimonials (belum ada di WP, tapi sebaiknya disiapkan)
```
- name
- role
- company
- quote
- avatar (opsional)
- sort_order
- is_visible
```

#### J. Site Settings (Konfigurasi Global)
```
- site_title
- site_description
- logo
- favicon
- contact_email
- contact_phone
- contact_address
- social_links { facebook, instagram, linkedin, youtube, whatsapp }
- google_analytics_id
- whatsapp_number (untuk floating button)
- default_og_image
```

### 3.3 Form Submissions

| Form | Fields | Aksi |
|---|---|---|
| **Contact** | Nama, email, telepon, pesan | Simpan ke DB + kirim email notifikasi |
| **Demo Request** | Nama, email, telepon, perusahaan, jumlah toko | Simpan ke DB + kirim email notifikasi |
| **Newsletter** (opsional) | Email | Simpan ke DB / integrasi Mailchimp |

### 3.4 Media Management

- Upload gambar (blog featured image, feature screenshots, logos, dll)
- Image optimization otomatis (resize, WebP conversion)
- Media library — lihat semua file yang sudah di-upload
- Folder/kategori untuk organisasi media (opsional)

---

## 4. Kebutuhan Admin Panel

### 4.1 Fitur Utama

| Fitur | Keterangan |
|---|---|
| **Dashboard** | Ringkasan: jumlah post, page, form submission terbaru |
| **Blog Management** | CRUD posts, categories, tags — dengan rich text editor |
| **Page Management** | CRUD halaman statis dengan editor |
| **Feature Management** | CRUD fitur produk + reorder (drag & drop) |
| **Use Case Management** | CRUD use case + reorder |
| **Pricing Management** | CRUD pricing tiers + atur fitur per tier |
| **FAQ Management** | CRUD FAQ items + reorder |
| **Client Logo Management** | CRUD logos + reorder |
| **Testimonial Management** | CRUD testimonials + reorder |
| **Media Library** | Upload, browse, delete gambar |
| **Form Submissions** | Lihat & export (CSV) data contact / demo request |
| **Site Settings** | Edit konfigurasi global (logo, contact info, social links, dll) |
| **SEO per Entity** | Setiap content type punya field meta_title, meta_description, og_image |
| **Preview** | Preview konten sebelum publish |
| **Draft / Publish** | Status management untuk blog & halaman |

### 4.2 User Roles (Minimal)

| Role | Akses |
|---|---|
| **Super Admin** | Semua fitur + user management |
| **Editor** | Blog, page, features, FAQ — tidak bisa ubah settings |
| **Viewer** | Read-only — lihat form submissions & analytics |

### 4.3 Rich Text Editor

Editor harus support minimal:
- Heading (H2-H4)
- Bold, italic, underline, strikethrough
- Ordered & unordered list
- Link (internal & external)
- Image embed (dari media library)
- Code block
- Blockquote
- Table
- Embed video (YouTube)

---

## 5. Kebutuhan SEO

Ini constraint paling ketat — SEO harus **tidak boleh turun** setelah migrasi.

### 5.1 URL Preservation

**KRITIS:** Blog posts saat ini punya URL **flat** (tanpa prefix `/blog/`):

```
WordPress (sekarang):          Next.js (harus sama):
/apa-itu-people-counting-system/  →  /apa-itu-people-counting-system/
/cara-kerja-people-counting-cctv-ai/  →  /cara-kerja-people-counting-cctv-ai/
```

Jika URL berubah (misal ditambah `/blog/` prefix), semua ranking di Google **hilang** kecuali ada 301 redirect. Strategi yang perlu dipilih:

| Opsi | URL Pattern | Risiko |
|---|---|---|
| **A. Pertahankan flat URL** | `/[slug]/` | Routing lebih kompleks (harus bedakan post vs page) |
| **B. Pindah ke /blog/[slug]/ + 301 redirect** | `/blog/[slug]/` | Butuh redirect map, SEO juice transfer 90-95% |
| **C. Hybrid** | Post baru pakai `/blog/[slug]/`, post lama redirect | Kompleksitas tinggi |

### 5.2 Redirect Map

Semua URL WordPress yang sudah terindex harus dipetakan:
- Halaman yang URL-nya berubah → 301 redirect
- Halaman yang dihapus → redirect ke halaman relevan terdekat
- `/sample-page/` → redirect ke `/` atau hapus dari index
- `/news-2/` → redirect ke `/blog/` atau halaman news baru

### 5.3 Metadata per Halaman

Setiap halaman & blog post harus punya:

```
- <title> — custom atau auto-generate dari judul
- <meta name="description"> — custom atau auto-generate dari excerpt
- <meta property="og:title">
- <meta property="og:description">
- <meta property="og:image">
- <meta property="og:url">
- <meta property="og:type"> (website / article)
- <link rel="canonical">
- Twitter Card metadata
```

Implementasi via Next.js `generateMetadata()` per route.

### 5.4 Structured Data (JSON-LD)

| Schema Type | Di Mana |
|---|---|
| **Organization** | Semua halaman (footer-level) |
| **WebSite** | Homepage |
| **Article** / **BlogPosting** | Setiap blog post |
| **FAQPage** | Halaman FAQ |
| **BreadcrumbList** | Semua halaman (kecuali homepage) |
| **Product** / **Service** | Halaman fitur & pricing (opsional) |
| **LocalBusiness** | Jika relevan — alamat kantor |

### 5.5 Technical SEO

| Kebutuhan | Implementasi |
|---|---|
| **Sitemap** | Auto-generated via `app/sitemap.ts` — include semua halaman & blog posts |
| **Robots.txt** | Via `app/robots.ts` — block admin panel, allow semua public pages |
| **RSS Feed** | `/feed.xml` — untuk blog syndication |
| **Canonical URLs** | Otomatis per halaman |
| **Heading hierarchy** | H1 hanya 1 per halaman, proper H2-H4 nesting |
| **Image alt text** | Wajib untuk semua gambar (field di admin) |
| **Internal linking** | Blog posts bisa link ke features, use cases |
| **Mobile responsive** | Wajib — Google mobile-first indexing |
| **Core Web Vitals** | LCP < 2.5s, FID < 100ms, CLS < 0.1 |
| **Hreflang** | Jika ada rencana multi-bahasa (EN + ID) |

### 5.6 Blog SEO Spesifik

- URL slug editable dari admin
- Auto-generate excerpt jika kosong
- Reading time estimation
- Related posts (based on category/tags)
- Social share buttons
- Author bio (opsional)
- Table of contents otomatis (untuk artikel panjang)

---

## 6. Kebutuhan Non-Fungsional

### 6.1 Performance

| Target | Nilai |
|---|---|
| Lighthouse Score | > 90 (semua kategori) |
| LCP | < 2.5 detik |
| FID | < 100 milidetik |
| CLS | < 0.1 |
| TTFB | < 600ms |
| Image optimization | WebP/AVIF otomatis, lazy loading, responsive sizes |

### 6.2 Rendering Strategy

| Halaman | Strategy | Alasan |
|---|---|---|
| Homepage | **ISR** (Incremental Static Regeneration) | Konten jarang berubah, perlu cepat |
| Blog listing | **ISR** (revalidate: 60s) | Update saat ada post baru |
| Blog post | **SSG** (Static Site Generation) | Konten fix setelah publish, SEO optimal |
| About, Features, Use Cases | **ISR** | Jarang berubah |
| Contact / Demo form | **SSR** atau **SSG + client** | Form butuh client-side |
| Admin panel | **CSR** (Client-side) | Tidak perlu SEO, behind auth |

### 6.3 Analytics & Tracking

- Google Analytics 4 (GA4) — atau alternatif privacy-friendly (Plausible, Umami)
- Google Search Console integration
- Facebook Pixel (opsional)
- Event tracking: CTA clicks, form submissions, scroll depth

### 6.4 Internationalization (i18n)

**Keputusan terbuka:** Apakah website perlu multi-bahasa?
- Saat ini ada halaman Bahasa Indonesia (`/fitur/`, `/paket/`) dan English (`/features/`, `/use-case/`)
- Jika ya: butuh i18n routing (`/en/...`, `/id/...`) + hreflang tags
- Jika tidak: pick satu bahasa utama

### 6.5 Security

- Admin panel behind authentication
- CSRF protection pada form
- Rate limiting pada form submission & API
- Sanitasi input (XSS prevention)
- HTTPS enforced
- Content Security Policy headers

### 6.6 Hosting & Deployment

- CI/CD pipeline untuk auto-deploy saat push
- Preview deployment untuk branch/PR
- CDN untuk static assets & images
- Opsi: Vercel, Docker self-hosted, atau VPS

---

## 7. Strategi Migrasi Konten dari WordPress

### 7.1 Ekstraksi Konten

Karena tidak ada kode WordPress di lokal, ada beberapa cara mengambil konten:

| Metode | Cara | Keterangan |
|---|---|---|
| **WP REST API** | `GET smartcounter.id/wp-json/wp/v2/posts` | Biasanya public, bisa ambil semua posts & pages |
| **WP REST API** | `GET smartcounter.id/wp-json/wp/v2/pages` | Ambil semua halaman |
| **WP REST API** | `GET smartcounter.id/wp-json/wp/v2/media` | Ambil semua media/gambar |
| **XML Export** | WordPress Admin → Tools → Export | Butuh akses WP admin |
| **Web Scraping** | Fetch setiap halaman, extract content | Fallback jika API dimatikan |

### 7.2 Yang Perlu Dimigrasi

| Konten | Jumlah | Prioritas |
|---|---|---|
| Blog posts + featured images | 4 artikel | Tinggi |
| Page content (about, contact, dll) | ~10 halaman | Tinggi |
| Media/gambar | ~30+ file | Tinggi |
| SEO metadata (title, description per page) | Semua halaman | Tinggi |
| Client logos | 18+ gambar | Sedang |
| FAQ content | 6 item | Sedang |
| Feature descriptions | 12+ item | Sedang |

### 7.3 URL Redirect Map (Wajib)

```
# Redirect dari URL lama yang mungkin berubah
/news-2/         → /blog/          (301)
/sample-page/    → /               (301)

# Jika blog URL pattern berubah ke /blog/[slug]:
/apa-itu-people-counting-system/              → /blog/apa-itu-people-counting-system/    (301)
/cara-kerja-people-counting-cctv-ai/          → /blog/cara-kerja-people-counting-cctv-ai/ (301)
/manfaat-visitor-counter-toko-retail/          → /blog/manfaat-visitor-counter-toko-retail/ (301)
/cctv-ai-people-counting-visitor-analytics/   → /blog/cctv-ai-people-counting-visitor-analytics/ (301)
```

---

## 8. Keputusan Terbuka (Perlu Dijawab Sebelum Implementasi)

### Keputusan 1: Build Admin Sendiri vs Pakai Headless CMS?

| Opsi | Kelebihan | Kekurangan | Effort |
|---|---|---|---|
| **A. Custom Admin dari Nol** | Kontrol 100%, bisa disesuaikan persis | Harus bangun editor, media library, auth, CRUD — effort besar | 8-12 minggu |
| **B. Payload CMS** (self-hosted, TypeScript-native) | Admin UI sudah jadi, TypeScript-first, integrasi Next.js bawaan, data milik sendiri, editor & media library siap pakai | Perlu belajar Payload API, less custom | 3-5 minggu |
| **C. Strapi** (self-hosted, JS/TS) | Populer, banyak plugin, komunitas besar | Bukan TypeScript-first, perpisahan FE dan CMS | 4-6 minggu |
| **D. Directus** (self-hosted, DB-first) | Bisa pakai DB yang sudah ada, REST + GraphQL | Kurang integrasi Next.js dibanding Payload | 4-6 minggu |

**Rekomendasi pertanyaan:** Seberapa custom admin panel yang diinginkan? Apakah yang penting bisa kelola konten (blog, features, FAQ) dengan mudah, atau butuh admin panel yang sangat spesifik?

### Keputusan 2: Integrasi dengan Ekosistem SmartCounter yang Ada?

| Pertanyaan | Opsi |
|---|---|
| Form "Get Free Demo" terhubung ke `smartcounter-api`? | Ya (kirim lead ke DB yang sama) / Tidak (berdiri sendiri) |
| Admin website share auth dengan `smartcounter-admin`? | Ya (single sign-on) / Tidak (login terpisah) |
| Masuk ke monorepo (Turborepo) yang direncanakan? | Ya (sebagai `apps/web`) / Tidak (repo terpisah `smartcounter-web`) |

### Keputusan 3: URL Strategy untuk Blog

| Opsi | Pattern | Konsekuensi |
|---|---|---|
| **A. Flat (sama seperti WP)** | `/[slug]/` | Perlu logic routing untuk bedakan blog post vs page |
| **B. Prefixed + redirect** | `/blog/[slug]/` + 301 dari URL lama | Lebih clean, tapi SEO perlu waktu untuk transfer |

### Keputusan 4: Bahasa

| Opsi | Keterangan |
|---|---|
| **A. Bahasa Indonesia saja** | Lebih sederhana, target market lokal |
| **B. Dual (ID + EN)** | Butuh i18n framework, konten ditulis 2x |
| **C. ID utama, EN nanti** | Mulai single-language, siapkan arsitektur untuk i18n |

### Keputusan 5: Hosting

| Opsi | Keterangan |
|---|---|
| **A. Vercel** | Paling mudah untuk Next.js, auto-preview, CDN global |
| **B. Docker self-hosted** | Kontrol penuh, cocok jika sudah punya infra (sesuai rencana di `05_DOCKER_SETUP.md`) |
| **C. VPS (Nginx + PM2)** | Sederhana, murah, tapi manual scaling |

---

## 9. Ringkasan Scope

```
TOTAL CONTENT TYPES:     10 (Pages, Blog Posts, Categories, Features,
                             Use Cases, Pricing, FAQ, Client Logos,
                             Testimonials, Site Settings)

TOTAL HALAMAN PUBLIK:    ~15+ halaman (termasuk dynamic blog posts)

FORM:                    2-3 (Contact, Demo Request, Newsletter)

ADMIN FEATURES:          12+ modul (CRUD per content type + media +
                             settings + form submissions + SEO fields)

MIGRASI KONTEN:          4 blog posts, ~10 pages, 30+ media files,
                             semua SEO metadata

REDIRECT MAP:            10-15 URL yang harus di-301

SEO DELIVERABLES:        generateMetadata, sitemap.ts, robots.ts,
                             JSON-LD (6 schema types), RSS feed,
                             canonical URLs, OG tags
```

---

## Langkah Selanjutnya

Setelah keputusan di Section 8 dijawab, bisa lanjut ke:
1. **Pemilihan tech stack final** (berdasarkan keputusan admin panel)
2. **Database schema design** (berdasarkan content types di Section 3.2)
3. **Wireframe / sitemap visual** (struktur navigasi final)
4. **Implementation plan** (timeline, milestone, prioritas)
5. **Migrasi konten** (eksekusi ekstraksi dari WordPress)
