import { NextResponse } from 'next/server'
import { authorizeAdminRequest } from '@/lib/admin-auth'

function lexical(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map(p => ({
        type: 'paragraph',
        children: [{ type: 'text', text: p, version: 1 }],
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

// ============================================================
// English translations for the 4 Indonesian blog posts (id=10-13)
// ============================================================
const ID_BLOGS_EN_TRANSLATIONS: Record<number, { title: string; excerpt: string; content: string[]; metaTitle: string; metaDesc: string }> = {
  10: {
    title: 'What Is a People Counting System? Complete Guide for Retail',
    excerpt: 'A people counting system is AI technology that automatically counts visitors using CCTV cameras. Learn how it works, its benefits, and why Indonesian retail businesses need it.',
    content: [
      'A people counting system is an AI-based technology that automatically counts the number of people entering and leaving a location. It uses the CCTV cameras already installed in your store — no additional sensors or new hardware required.',
      'Unlike manual counting with clickers or rough estimates, a people counting system provides 99.9% accurate data in real-time. This data is immediately available on a dashboard accessible from anywhere.',
      'How Does It Work?',
      'SmartCounter uses computer vision and deep learning to detect and track every person in a CCTV video frame. The AI algorithm distinguishes between people entering, exiting, and those just passing by the storefront. All of this happens in real-time without storing facial data or personal information — 100% privacy compliant.',
      'Why Do Retail Businesses Need People Counting?',
      'Without visitor traffic data, retail business decisions are based on guesswork. You cannot tell whether a sales decline is due to fewer visitors or a low conversion rate. People counting provides definitive answers.',
      'Key Data You Get:',
      'Visitor counts by hour, day, week, and month. Peak hours for optimal staff scheduling. Conversion rate — the ratio of visitors to buyers. Campaign effectiveness — how much traffic marketing promotions actually drive. Performance comparison across store locations.',
      'Who Uses People Counting?',
      'Retail stores of all sizes — from small boutiques to chains with 50+ locations. Shopping malls for tenant benchmarking and zone optimization. Pharmacies for prescription counter queue monitoring. Supermarkets for checkout flow analysis. Fashion retail for fitting room tracking.',
      'ROI of People Counting',
      'Retailers who implement people counting report 15-25% sales increases within the first 6 months. The main ROI comes from: optimizing store layout based on heatmap data, aligning staff schedules with actual traffic patterns, accurately measuring marketing campaign ROI, and identifying wasted hours from overstaffing.',
      'SmartCounter is Indonesia\'s #1 people counting platform, serving 300+ stores nationwide with 99.9% accuracy and real-time dashboards.',
    ],
    metaTitle: 'What Is People Counting? — AI People Counting & CCTV Analytics',
    metaDesc: 'A people counting system uses AI to automatically count visitors via CCTV. Learn how it works, its benefits, and ROI for retail businesses in Indonesia.',
  },
  11: {
    title: 'How People Counting Works with CCTV AI: The Technology Behind 99.9% Accuracy',
    excerpt: 'Learn how AI and computer vision technology transform ordinary CCTV cameras into a visitor counting system with 99.9% accuracy. No additional sensors needed.',
    content: [
      'How can a CCTV camera count people with 99.9% accuracy? The answer lies in computer vision and deep learning technology that has advanced dramatically in the past 5 years.',
      'System Architecture',
      'SmartCounter consists of three main components: the CCTV camera (already installed in your store), an edge computing device that processes video locally, and a cloud dashboard for data visualization. Video is never sent to the cloud — only statistical data (visitor numbers) is transmitted.',
      'Stage 1: Object Detection',
      'Using a deep learning model trained on millions of images, the system detects every person in each video frame. The model can distinguish people from other objects like shopping carts, mannequins, or shadows. Detection accuracy reaches 99.9% even in low-light conditions or crowded stores.',
      'Stage 2: Multi-Object Tracking',
      'Once detected, each person is assigned a temporary unique ID and their movement is tracked frame by frame. This ensures one person is never counted twice, even if they stop, turn around, or are briefly occluded by another object.',
      'Stage 3: Direction Classification',
      'The system determines whether someone is entering or exiting based on a virtual line configured at the entrance. This provides accurate net traffic data — not just total movements.',
      'Stage 4: Advanced Analytics',
      'Beyond basic counting, the AI can also analyze: age and gender estimation (without storing facial data), dwell time per zone, movement patterns (heatmap), and queue detection.',
      'Privacy and Data Security',
      'SmartCounter is designed with a privacy-first principle. No facial recognition, no image storage, and no personal data collected. Only statistical data is stored: number of people, direction of movement, aggregate demographic estimates. The system is 100% compliant with data privacy regulations.',
      'Advantages vs Traditional Sensors',
      'Compared to infrared sensors or beam counters, CCTV AI offers: much higher accuracy (99.9% vs 85-90%), ability to distinguish entry/exit direction, support for additional analytics (demographics, heatmaps), and leveraging existing CCTV infrastructure — no new hardware investment needed.',
    ],
    metaTitle: 'How CCTV AI People Counting Works — AI People Counting & CCTV Analytics',
    metaDesc: 'Computer vision and deep learning transform ordinary CCTV into 99.9% accurate visitor counters. Learn the system architecture and advantages over traditional sensors.',
  },
  12: {
    title: 'Benefits of Visitor Counter for Retail Stores: Boost Sales by Up to 40%',
    excerpt: 'Visitor counters help retail stores optimize staffing, layout, and promotions based on real-time visitor data. Learn 7 key benefits that can increase sales by up to 40%.',
    content: [
      'Retail managers who rely on gut feeling without visitor data are like driving blindfolded. A visitor counter gives you full visibility into what happens in your store — and the results can increase sales by up to 40%.',
      '1. Measure True Conversion Rate',
      'Sales dropped this month — is it because fewer visitors came or because conversion was low? Without a visitor counter, you cannot answer this most fundamental question. With traffic data, you can calculate conversion rate (buyers / visitors) and take the right action.',
      '2. Optimize Staff Scheduling',
      'Visitor counter data shows peak hours with precision. Many stores overstaff during quiet hours and understaff during peak times. By aligning staff schedules with actual traffic patterns, retailers save 15-20% on labor costs while improving service during busy hours.',
      '3. Accurately Measure Promotion ROI',
      'Before visitor counter: "Yesterday\'s promo seemed busy, it probably worked." After visitor counter: "The promotion increased foot traffic by 34% and conversion rose 12% — positive ROI of 3.2x." Data proves which promotions are effective and which are wasting budget.',
      '4. Data-Driven Store Layout',
      'Heatmaps from visitor counters show which zones are busiest and which are dead zones. Retailers who moved bestsellers to high-traffic zones reported 15-20% uplift in those categories.',
      '5. Cross-Location Benchmarking',
      'For retail chains, visitor counters enable fair performance comparison. Store A might have lower sales than Store B, but a higher conversion rate — meaning Store A\'s problem is traffic, not service.',
      '6. Prediction and Planning',
      'With historical traffic data, you can predict seasonal visitor patterns, plan inventory for busy periods, and anticipate staffing needs for events or holiday seasons.',
      '7. Capacity Compliance and Safety',
      'Real-time occupancy monitoring ensures your store never exceeds maximum capacity. Important for safety regulation compliance and providing a comfortable shopping experience for visitors.',
      'Conclusion',
      'Visitor counters are no longer a luxury technology — they are a basic necessity for modern retail. Stores that adopt people counting report average sales increases of 25-40% in the first year. SmartCounter provides AI-powered visitor counter solutions for retail stores across Indonesia.',
    ],
    metaTitle: 'Visitor Counter Benefits for Retail — AI People Counting & CCTV Analytics',
    metaDesc: 'Visitor counters boost retail sales by up to 40%. Learn 7 key benefits: conversion tracking, staff optimization, promo ROI, heatmap layout, and cross-location benchmarking.',
  },
  13: {
    title: 'CCTV AI for People Counting and Visitor Analytics: Complete Retail Solution',
    excerpt: 'CCTV AI transforms security cameras into powerful visitor analytics tools. Learn the full feature set: people counting, heatmaps, demographics, queuing, and real-time dashboard integration.',
    content: [
      'CCTV cameras originally installed just for security can now become your most valuable source of business data. With AI technology, ordinary CCTV cameras transform into a complete visitor analytics platform.',
      'What Is CCTV AI People Counting?',
      'CCTV AI people counting applies artificial intelligence to CCTV video to automatically count, track, and analyze visitors. Unlike traditional CCTV that only records, CCTV AI extracts business insights from every video frame.',
      'Key SmartCounter Features',
      'People Counting: Counts visitors entering and exiting with 99.9% accuracy. Data is available in real-time on a dashboard accessible from your smartphone. Supports multi-entrance counting and per-location aggregation.',
      'Visitor Heatmap: Visualizes store zones by visitor density. Red indicates the busiest areas, blue the quietest. This data helps optimize product placement and store layout.',
      'Demographic Analysis: Estimates visitor age and gender without storing personal data. Knowing your customer demographic profile helps tailor product assortment and marketing strategy.',
      'Queue Monitoring: Detects checkout queue length in real-time. The system sends alerts when queues exceed defined thresholds, helping managers open additional registers just in time.',
      'Dwell Time Analysis: Measures how long visitors spend in specific zones. Extended time in a product area indicates high interest.',
      'Advantages for the Indonesian Market',
      'SmartCounter is designed specifically for Indonesian retail conditions: supports stores with multiple entrances (common in Indonesian retail), works optimally in varying lighting conditions, dashboard available in Bahasa Indonesia, and local support team based in Jakarta.',
      'Integration and Dashboard',
      'The SmartCounter dashboard displays all data in one screen: daily traffic, weekly trends, period comparisons, and automatic alerts. Data can be exported to Excel or integrated via API with your existing POS system.',
      'Easy Implementation',
      'No need to replace your CCTV cameras — SmartCounter works with existing IP cameras. Installation takes 1-2 days per location. Once installed, the system is immediately active and starts collecting data.',
      'SmartCounter serves 300+ stores across Indonesia, from small retail shops to large shopping malls. Contact us for a free demo and see how CCTV AI can transform the way you manage your store.',
    ],
    metaTitle: 'CCTV AI People Counting & Visitor Analytics — Complete Retail Solution',
    metaDesc: 'CCTV AI transforms security cameras into visitor analytics tools: 99.9% people counting, heatmaps, demographics, queuing. Complete solution for Indonesian retail.',
  },
}

// ============================================================
// Indonesian translations for the 7 existing English blog posts (id=1-6,9)
// ============================================================
const EN_BLOGS_ID_TRANSLATIONS: Record<number, { title: string; excerpt: string; content: string[]; metaTitle: string; metaDesc: string }> = {
  1: {
    title: 'Bagaimana People Counting Meningkatkan Penjualan Retail hingga 25%+',
    excerpt: 'Analitik pengunjung real-time membantu retailer mengoptimalkan layout, staf, dan ROI marketing. Lihat hasilnya berbasis data.',
    content: [
      'Sebagian besar manajer retail memeriksa angka penjualan setiap hari tetapi melewatkan metrik traffic yang menjelaskan mengapa penjualan naik atau turun.',
      'Angka penjualan memberi tahu apa yang terjadi. People counting memberi tahu mengapa. Ketika Anda tahu berapa banyak pengunjung yang memasuki toko, Anda bisa menghitung tingkat konversi, mengidentifikasi jam sibuk, dan menemukan tren musiman yang mendorong pendapatan.',
      '1. Metrik Dasar: Tetapkan jumlah pengunjung saat ini, nilai transaksi rata-rata, dan tingkat konversi. Ini menjadi benchmark untuk mengukur peningkatan.',
      '2. Optimasi Layout: Gunakan data heatmap untuk mengidentifikasi zona ramai dan zona mati. Retailer yang memindahkan produk bestseller ke area ramai melihat peningkatan 15-20% pada kategori tersebut.',
      '3. Penjadwalan Staf: Sesuaikan staf lantai dengan pola traffic pengunjung. Data menunjukkan kapan Anda butuh lebih banyak orang, bukan kapan Anda pikir butuh.',
      '4. ROI Marketing: Lacak dampak promosi dengan membandingkan traffic dan penjualan sebelum dan sesudah kampanye. Penghitungan berbasis AI menghilangkan tebakan.',
      '5. Benchmarking Kompetitif: Di pusat perbelanjaan, bandingkan performa tenant Anda dengan toko-toko sekitar. Insight berbasis data memicu perbaikan di tingkat zona.',
      'Retailer yang melihat peningkatan 25%+ adalah mereka yang memperlakukan people counting sebagai feedback loop berkelanjutan: ukur → analisis → optimasi → ulangi. Tanpa angka, Anda terbang buta.',
    ],
    metaTitle: 'People Counting Tingkatkan Penjualan 25%+ — People Counting & Analitik Pengunjung',
    metaDesc: 'Analitik pengunjung real-time bantu retailer optimasi layout, staf, dan ROI marketing. Lihat cara people counting tingkatkan penjualan retail 25% lebih.',
  },
  2: {
    title: 'Benchmarking Tenant Mall: CCTV AI untuk Alokasi Traffic yang Adil',
    excerpt: 'Bagaimana pusat perbelanjaan menggunakan SmartCounter untuk mengukur traffic tenant secara objektif dan menyelesaikan sengketa okupansi.',
    content: [
      'Sengketa tentang traffic pengunjung di mall sangat umum. Anchor tenant mengklaim mereka yang mendatangkan traffic. Tenant menengah tidak setuju. Tanpa data, argumen ini berdasarkan perasaan, bukan realita.',
      'People counting berbasis CCTV menghilangkan subjektivitas. Setiap pengunjung dihitung, setiap lintasan dicatat, dan setiap zona memiliki metrik.',
      '1. Pengukuran Traffic Objektif: Deploy SmartCounter di pintu masuk, koridor, dan zona tenant. Dapatkan laporan traffic per jam, harian, dan mingguan untuk setiap area.',
      '2. Revenue Sharing yang Adil: Alih-alih berdebat soal tingkat okupansi, gunakan traffic aktual. Tenant di zona sepi membayar lebih rendah dari yang di lokasi premium.',
      '3. Benchmarking Performa Tenant: Bandingkan rasio traffic-terhadap-penjualan antar tenant. Identifikasi mana yang overperform dan underperform relatif terhadap traffic mereka.',
      '4. Penyelesaian Sengketa: Ketika tenant mempermasalahkan biaya sewa, tunjukkan data traffic. Angka tidak bisa diperdebatkan.',
    ],
    metaTitle: 'Benchmarking Tenant Mall dengan CCTV AI — People Counting & Analitik Pengunjung',
    metaDesc: 'Pusat perbelanjaan gunakan CCTV AI untuk mengukur traffic tenant secara objektif. Solusi untuk alokasi traffic adil dan penyelesaian sengketa okupansi.',
  },
  3: {
    title: 'Fashion Retail: Tracking Konversi Fitting Room dengan AI',
    excerpt: 'Bagaimana analitik berbasis AI melacak tingkat konversi dari browsing ke fitting room hingga pembelian di retail fashion.',
    content: [
      'Dalam fashion retail, fitting room adalah titik konversi paling kritis. Pelanggan yang mencoba pakaian memiliki kemungkinan membeli 67% lebih tinggi. Namun kebanyakan toko fashion tidak punya data tentang alur ini.',
      'SmartCounter melacak seluruh customer journey: browsing → fitting room → pembelian. Dengan data ini, manajer toko bisa mengoptimalkan setiap tahap.',
      '1. Performa Koleksi: Lacak koleksi mana yang menarik traffic paling banyak. Jika koleksi baru mendapat banyak kunjungan tapi sedikit yang masuk fitting room, mungkin harganya perlu direvisi.',
      '2. Bottleneck Fitting Room: Monitor berapa lama pelanggan menunggu fitting room. Antrian panjang = kehilangan penjualan. Data membantu menentukan apakah perlu menambah fitting room.',
      '3. Rasio Browsing-to-Try: Ukur persentase pengunjung yang mencoba pakaian. Rasio rendah bisa mengindikasikan masalah display, pencahayaan, atau ukuran yang tersedia.',
      '4. Pola Pengunjung Berulang: Identifikasi pengunjung yang datang berulang kali sebelum membeli. Fashion retail sering memiliki siklus keputusan lebih panjang.',
    ],
    metaTitle: 'Konversi Fitting Room Fashion Retail — People Counting & Analitik Pengunjung',
    metaDesc: 'AI lacak konversi dari browsing ke fitting room hingga pembelian di fashion retail. Optimasi koleksi, kurangi antrian, tingkatkan rasio try-on.',
  },
  4: {
    title: 'Insight Demografi Privacy-First: Apa yang CCTV AI Bisa Sampaikan tentang Pelanggan',
    excerpt: 'Bagaimana CCTV AI memberikan data demografi berharga — usia, gender, ukuran grup — tanpa menyimpan informasi pribadi.',
    content: [
      'Retailer ingin tahu: Siapa yang masuk ke toko saya? Tanpa CCTV AI, Anda terjebak dengan survei riset pasar yang mahal dan sudah ketinggalan zaman.',
      'SmartCounter memberikan insight demografi real-time — estimasi usia, distribusi gender, ukuran grup — semua tanpa menyimpan data wajah atau informasi yang bisa mengidentifikasi seseorang.',
      '1. Demografi Usia: Segmentasi pengunjung ke dalam 6 kelompok usia. Ketahui apakah toko Anda menarik generasi muda atau pelanggan yang lebih dewasa.',
      '2. Komposisi Keluarga: Deteksi grup keluarga vs pasangan vs individu. Data ini mempengaruhi layout toko dan strategi produk.',
      '3. Pola Berbasis Waktu: Demografi berubah sepanjang hari. Pagi mungkin ibu rumah tangga, sore mahasiswa, malam pasangan. Sesuaikan staf dan musik sesuai profil.',
      '4. Afinitas Zona: Demografi berbeda cenderung mengunjungi zona toko yang berbeda. Gunakan data ini untuk penempatan produk yang ditargetkan.',
      '5. Jaminan Privasi: Tidak ada pengenalan wajah, tidak ada penyimpanan gambar. Hanya statistik agregat. 100% sesuai regulasi privasi data Indonesia dan internasional.',
    ],
    metaTitle: 'Demografi Pengunjung Privacy-First — People Counting & Analitik Pengunjung',
    metaDesc: 'CCTV AI berikan data demografi berharga — usia, gender, ukuran grup — tanpa simpan data pribadi. 100% sesuai regulasi privasi data.',
  },
  5: {
    title: 'Kurangi Waktu Tunggu Kasir: Manajemen Antrian Real-Time',
    excerpt: 'Deteksi antrian berbasis AI bisa memotong waktu tunggu kasir 40-60% dengan monitoring real-time dan alert staf otomatis.',
    content: [
      'Antrian panjang di kasir adalah pembunuh penjualan nomor satu di retail. 73% pembeli mengatakan mereka akan meninggalkan toko jika antriannya terlalu lama. Dengan manajemen antrian berbasis AI, Anda bisa memotong waktu tunggu hingga 60%.',
      '1. Deteksi Panjang Antrian: SmartCounter mendeteksi berapa orang yang mengantri di setiap kasir secara real-time. Tidak perlu sensor tambahan — cukup kamera CCTV yang sudah ada.',
      '2. Estimasi Waktu Tunggu: Berdasarkan panjang antrian dan kecepatan pelayanan historis, sistem memperkirakan waktu tunggu. Jika melebihi threshold, alert dikirim ke manajer.',
      '3. Penjadwalan Staf Jam Sibuk: Data historis menunjukkan kapan antrian biasanya terbentuk. Jadwalkan kasir tambahan sebelum jam sibuk, bukan setelah antrian sudah panjang.',
      '4. Pencegahan Cart Abandonment: Pengunjung yang melihat antrian panjang sering meninggalkan keranjang belanja mereka. Dengan manajemen antrian proaktif, Anda mengurangi lost sales secara signifikan.',
    ],
    metaTitle: 'Manajemen Antrian Kasir Real-Time — People Counting & Analitik Pengunjung',
    metaDesc: 'Deteksi antrian AI potong waktu tunggu kasir 40-60%. Monitoring real-time, alert otomatis, dan penjadwalan staf berbasis data traffic.',
  },
  6: {
    title: 'Monitoring Okupansi untuk Keamanan & Kepatuhan: Lebih dari Hitung Manual',
    excerpt: 'Monitoring okupansi real-time memastikan kepatuhan keselamatan, ketaatan kode kebakaran, dan manajemen kerumunan dengan akurasi AI.',
    content: [
      'Penghitungan okupansi manual sudah tidak memadai untuk retail modern. Regulasi semakin ketat, dan risiko hukum dari overcrowding semakin nyata. Monitoring okupansi berbasis AI memberikan kepastian yang tidak bisa ditandingi cara manual.',
      '1. Tracking Okupansi Real-Time: SmartCounter melacak berapa orang yang ada di toko atau zona tertentu setiap saat. Data diperbarui setiap detik, bukan setiap jam.',
      '2. Threshold dan Alert Otomatis: Tetapkan batas kapasitas per zona. Ketika mendekati batas, sistem mengirim peringatan visual dan notifikasi ke smartphone manajer.',
      '3. Tren dan Pola Historis: Data okupansi historis membantu merencanakan event, mengantisipasi periode ramai, dan menyiapkan prosedur darurat.',
      '4. Laporan Kepatuhan: Generate laporan okupansi untuk audit keselamatan, inspeksi dinas pemadam, dan kepatuhan regulasi. Data digital jauh lebih reliable dari catatan manual.',
      '5. Manajemen Alur Kerumunan: Identifikasi bottleneck di toko dan buat strategi pengalihan alur pengunjung untuk mencegah kepadatan berlebih di satu area.',
    ],
    metaTitle: 'Monitoring Okupansi Keamanan & Kepatuhan — People Counting & Analitik Pengunjung',
    metaDesc: 'Monitoring okupansi AI untuk kepatuhan keselamatan dan manajemen kerumunan. Real-time tracking, alert otomatis, dan laporan audit digital.',
  },
  9: {
    title: 'Memahami Tingkat Konversi di Retail Fisik',
    excerpt: 'Apa arti tingkat konversi untuk toko fisik, cara mengukurnya, dan strategi terbukti untuk meningkatkannya.',
    content: [
      'Dalam e-commerce, conversion rate adalah metrik paling penting. Di retail fisik, metrik ini sama pentingnya — tapi jarang diukur. Mengapa? Karena tanpa people counting, Anda tidak tahu berapa total pengunjung toko.',
      'Apa Itu Conversion Rate Retail?',
      'Conversion rate retail = jumlah transaksi ÷ jumlah pengunjung × 100%. Jika 100 orang masuk dan 25 membeli, conversion rate Anda 25%. Rata-rata industri retail adalah 20-30%, tapi bervariasi per kategori.',
      'Cara Mengukurnya',
      'Langkah 1: Install people counting system untuk menghitung pengunjung. Langkah 2: Hubungkan dengan data POS untuk jumlah transaksi. Langkah 3: Hitung rasio harian, mingguan, dan bulanan. Langkah 4: Segmentasi per jam, per hari dalam seminggu, dan per lokasi.',
      'Strategi Meningkatkan Conversion Rate',
      'Optimasi approach staf — greeting dalam 30 detik pertama meningkatkan konversi 20-30%. Perbaiki layout berdasarkan heatmap — pastikan produk populer mudah ditemukan. Kurangi waktu tunggu kasir — antrian panjang menurunkan konversi 15-25%. Pelatihan staf berbasis data — fokuskan coaching pada jam dengan konversi terendah.',
      'Benchmark dan Target',
      'Tetapkan target konversi realistis berdasarkan kategori toko Anda. Fashion: 15-25%, Grocery: 40-60%, Electronics: 10-20%, Home improvement: 20-35%. Gunakan data people counting untuk tracking progres menuju target.',
    ],
    metaTitle: 'Tingkat Konversi Retail Fisik — People Counting & Analitik Pengunjung',
    metaDesc: 'Pelajari arti conversion rate untuk toko fisik, cara mengukur dengan people counting, dan strategi terbukti untuk meningkatkannya.',
  },
}

export async function POST(request: Request) {
  try {
    const authorization = await authorizeAdminRequest(request, 'write')
    if (!authorization.ok) return authorization.response
    const { payload } = authorization
    const results = { enTranslated: 0, idTranslated: 0, errors: [] as string[] }

    // Add EN translations to the 4 Indonesian blog posts
    for (const [idStr, trans] of Object.entries(ID_BLOGS_EN_TRANSLATIONS)) {
      const blogId = parseInt(idStr, 10)
      try {
        await payload.update({
          collection: 'blog-posts',
          id: blogId,
          locale: 'en',
          data: {
            title: trans.title,
            slug: (await payload.findByID({ collection: 'blog-posts', id: blogId, locale: 'en' }))?.slug || '',
            content: lexical(trans.content),
            excerpt: trans.excerpt,
            meta: { title: trans.metaTitle, description: trans.metaDesc },
          },
        })
        results.enTranslated++
      } catch (err) {
        results.errors.push(`EN for blog ${blogId}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    // Add ID translations to the 7 existing English blog posts
    for (const [idStr, trans] of Object.entries(EN_BLOGS_ID_TRANSLATIONS)) {
      const blogId = parseInt(idStr, 10)
      try {
        const existing = await payload.findByID({ collection: 'blog-posts', id: blogId, locale: 'id' })
        await payload.update({
          collection: 'blog-posts',
          id: blogId,
          locale: 'id',
          data: {
            title: trans.title,
            slug: existing?.slug || '',
            content: lexical(trans.content),
            excerpt: trans.excerpt,
            meta: { title: trans.metaTitle, description: trans.metaDesc },
          },
        })
        results.idTranslated++
      } catch (err) {
        results.errors.push(`ID for blog ${blogId}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    return NextResponse.json({
      message: `Translated ${results.enTranslated} ID→EN, ${results.idTranslated} EN→ID`,
      ...results,
    })
  } catch (error) {
    console.error('Translate blogs error:', error)
    return NextResponse.json(
      { error: 'Failed', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
