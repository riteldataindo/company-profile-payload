import type { LocalText } from '../i18n'

// Homepage copy, written for store and mall teams. Caveats sit next to the
// thing they qualify; no accuracy figures, customer names, or uplift claims.

const t = (en: string, id: string): LocalText => ({ en, id })

export type Availability = 'included' | 'addon'

export type SceneQuestion = { question: LocalText; answer: LocalText; availability: Availability }

export const heroCopy = {
  titleA: t('Know your busiest hours.', 'Ketahui jam tersibuk Anda.'),
  titleB: t('See where visitors go.', 'Lihat ke mana pengunjung pergi.'),
  lead: t(
    'SmartCounter counts the people who walk into your stores and malls, and shows your team when traffic peaks, which entrances bring people in, and how each location compares.',
    'SmartCounter menghitung orang yang masuk ke toko dan mall Anda, lalu menunjukkan kapan traffic memuncak, entrance mana yang paling banyak mendatangkan pengunjung, dan bagaimana perbandingan tiap lokasi.',
  ),
  whatsapp: t('Chat on WhatsApp', 'Chat via WhatsApp'),
  support: t('Implementation and support by our team in Jakarta.', 'Implementasi dan dukungan oleh tim kami di Jakarta.'),
  whatsappMessage: t(
    'Hi SmartCounter, I would like to talk about people counting for our stores or mall.',
    'Halo SmartCounter, saya ingin berdiskusi tentang people counting untuk toko atau mall kami.',
  ),
}

export const simCopy = {
  title: t('How counting works', 'Cara penghitungan'),
  sceneGroup: t('Choose a store or a mall', 'Pilih toko atau mall'),
  play: t('Play the illustration', 'Putar ilustrasi'),
  pause: t('Pause the illustration', 'Jeda ilustrasi'),
  replay: t('Replay the illustration', 'Putar ulang ilustrasi'),
  timeline: t('Illustration time', 'Waktu ilustrasi'),
  window: t('Simulated 10:00–10:15', 'Simulasi 10:00–10:15'),
  caption: t(
    'An illustration of how SmartCounter counts, not live data from a customer site.',
    'Ilustrasi cara SmartCounter menghitung, bukan data langsung dari lokasi pelanggan.',
  ),
  retail: {
    name: t('Store', 'Toko'),
    description: t(
      'Illustrated store plan. People walk past the storefront; some cross the entry line and spend time in two zones. The counts below update as they move.',
      'Denah toko ilustrasi. Orang berjalan melewati storefront; sebagian melintasi garis masuk dan menghabiskan waktu di dua zone. Hitungan di bawah diperbarui saat mereka bergerak.',
    ),
    entries: t('Entries', 'Entry'),
    passersBy: t('Passers-by', 'Passers-by'),
    rate: t('Entering rate', 'Entering rate'),
    formula: t(
      'Entering rate = people who came in ÷ people who walked past. It isn’t sales conversion.',
      'Entering rate = orang yang masuk ÷ orang yang lewat. Ini bukan konversi penjualan.',
    ),
    labels: {
      entry: t('Entry line', 'Garis masuk'),
      approach: t('Passer-by zone', 'Area passer-by'),
      lane: t('Storefront', 'Depan toko'),
      zoneA: t('Zone A', 'Zone A'),
      zoneB: t('Zone B', 'Zone B'),
    },
  },
  mall: {
    name: t('Mall', 'Mall'),
    description: t(
      'Illustrated mall floor. People enter through two outer gates, pass the atrium, and some cross an internal gate. Crossing inside the mall is not counted as a new visit.',
      'Denah lantai mall ilustrasi. Orang masuk lewat dua outer gate, melewati atrium, dan sebagian melintasi internal gate. Berpindah di dalam mall tidak dihitung sebagai kunjungan baru.',
    ),
    visits: t('Mall visits', 'Kunjungan mall'),
    internal: t('Internal moves', 'Pindah area'),
    occupancy: t('In the atrium', 'Di atrium'),
    formula: t(
      'Mall visits are counted at the outer gates only. Walking between areas inside isn’t a new visit.',
      'Kunjungan mall hanya dihitung di outer gate. Berpindah area di dalam mall bukan kunjungan baru.',
    ),
    labels: {
      gateWest: t('Outer gate 1', 'Outer gate 1'),
      gateSouth: t('Outer gate 2', 'Outer gate 2'),
      internal: t('Internal gate', 'Internal gate'),
      atrium: t('Atrium', 'Atrium'),
      east: t('East wing', 'Sayap timur'),
      corridor: t('Corridor, level 1', 'Koridor lantai 1'),
      tenant: t('Tenant', 'Tenant'),
    },
  },
}

export const screensCopy = {
  title: t('Inside the SmartCounter dashboard', 'Di dalam dashboard SmartCounter'),
  lead: t('Real screens from the product, shown with demo data.', 'Tampilan asli produk, dengan data demo.'),
}

export const scenesCopy = {
  title: t('Stores and malls ask different questions', 'Toko dan mall punya pertanyaan berbeda'),
  lead: t(
    'So SmartCounter counts them differently. Start with the one that sounds like you.',
    'Karena itu SmartCounter menghitungnya dengan cara berbeda. Mulai dari yang paling sesuai dengan Anda.',
  ),
  availability: {
    included: t('Included', 'Termasuk'),
    addon: t('Add-on', 'Tambahan'),
  },
  legend: t(
    'Included means part of the Core Platform. Add-ons are confirmed after a site check.',
    'Termasuk berarti bagian dari Core Platform. Tambahan dipastikan setelah cek lokasi.',
  ),
  photoNote: t('Illustration, not a customer site', 'Ilustrasi, bukan lokasi pelanggan'),
  retail: {
    title: t('For retail stores', 'Untuk toko retail'),
    intro: t(
      'For teams running one store or many, comparing entrances, hours, and locations.',
      'Untuk tim yang mengelola satu atau banyak toko, membandingkan entrance, jam, dan lokasi.',
    ),
    questions: [
      { question: t('When do we get busy?', 'Kapan toko ramai?'), answer: t('Visitor counts by hour, day, and week.', 'Jumlah pengunjung per jam, hari, dan minggu.'), availability: 'included' },
      { question: t('Which entrance brings people in?', 'Entrance mana yang paling banyak dilalui?'), answer: t('Counts for each entrance, side by side.', 'Hitungan tiap entrance, berdampingan.'), availability: 'included' },
      { question: t('How many passers-by walk in?', 'Berapa banyak orang lewat yang masuk?'), answer: t('Entering rate, from people passing the storefront.', 'Entering rate, dari orang yang lewat di depan toko.'), availability: 'addon' },
      { question: t('Where do shoppers spend time?', 'Di mana pembeli menghabiskan waktu?'), answer: t('Time spent and heatmaps for the zones you choose.', 'Waktu kunjungan dan heatmap untuk zone pilihan Anda.'), availability: 'addon' },
    ] satisfies SceneQuestion[],
    link: t('Explore SmartCounter for retail', 'Jelajahi SmartCounter untuk retail'),
    alt: t(
      'Illustrated store entrance with the entry line, a zone around the front table, and a walking path marked.',
      'Entrance toko ilustrasi dengan tanda garis masuk, zone di sekitar meja depan, dan jalur pengunjung.',
    ),
    marks: { entry: t('Entry line', 'Garis masuk'), zone: t('Zone', 'Zone'), path: t('Path', 'Jalur') },
  },
  mall: {
    title: t('For malls', 'Untuk mall'),
    intro: t(
      'For property teams tracking gates, floors, and common areas across the building.',
      'Untuk tim property yang memantau gate, lantai, dan area umum di seluruh gedung.',
    ),
    questions: [
      { question: t('How many people visit, and when?', 'Berapa banyak pengunjung, dan kapan?'), answer: t('Visits counted at the outer gates, by hour and day.', 'Kunjungan dihitung di outer gate, per jam dan hari.'), availability: 'included' },
      { question: t('Which gates are busiest?', 'Gate mana yang paling ramai?'), answer: t('Every gate compared over the same period.', 'Semua gate dibandingkan pada periode yang sama.'), availability: 'included' },
      { question: t('How crowded are floors and zones?', 'Seberapa padat lantai dan zone?'), answer: t('Occupancy for the areas you choose.', 'Occupancy untuk area pilihan Anda.'), availability: 'addon' },
      { question: t('How do visitors move between areas?', 'Bagaimana pengunjung berpindah antar area?'), answer: t('Movement between floors and zones, kept apart from new visits.', 'Pergerakan antar lantai dan zone, dipisahkan dari kunjungan baru.'), availability: 'addon' },
    ] satisfies SceneQuestion[],
    link: t('Explore SmartCounter for malls', 'Jelajahi SmartCounter untuk mall'),
    alt: t(
      'Illustrated mall atrium with the level 1 corridor, an internal gate, and the upper floor marked.',
      'Atrium mall ilustrasi dengan tanda koridor lantai 1, internal gate, dan lantai atas.',
    ),
    marks: { corridor: t('Corridor zone', 'Zone koridor'), internal: t('Internal gate', 'Internal gate'), floor: t('Upper floor', 'Lantai atas') },
  },
}

export const stepsCopy = {
  title: t('From first call to live dashboard', 'Dari obrolan pertama sampai dashboard berjalan'),
  lead: t(
    'We look at your entrances and any cameras you already have, then tell you plainly what we can measure.',
    'Kami melihat entrance dan kamera yang sudah Anda miliki, lalu menjelaskan dengan jelas apa yang bisa kami ukur.',
  ),
  steps: [
    { title: t('Tell us what you want to know', 'Ceritakan yang ingin Anda ketahui'), body: t('A short call about your stores or mall, the questions you need answered, and your timeline.', 'Obrolan singkat tentang toko atau mall Anda, pertanyaan yang perlu dijawab, dan timeline Anda.') },
    { title: t('We check your site', 'Kami cek lokasi Anda'), body: t('We review entrances, layout, and existing cameras, and confirm what can be counted.', 'Kami meninjau entrance, layout, dan kamera yang ada, lalu memastikan apa saja yang bisa dihitung.') },
    { title: t('We set up and check the counts', 'Kami setup dan cek hitungan'), body: t('We place the counting lines and zones, then compare our counts with a reference count before handover.', 'Kami memasang garis hitung dan zone, lalu membandingkan hitungan kami dengan hitungan referensi sebelum serah terima.') },
    { title: t('Your team goes live', 'Tim Anda mulai memakai'), body: t('You get the dashboard, training for your team, and support from Jakarta.', 'Anda mendapat dashboard, training untuk tim, dan dukungan dari Jakarta.') },
  ],
  note: t(
    'We don’t quote one accuracy number for every site. We agree how counts are checked for yours and show you the result.',
    'Kami tidak memberi satu angka akurasi untuk semua lokasi. Kami menyepakati cara pengecekan untuk lokasi Anda dan menunjukkan hasilnya.',
  ),
  validationLink: t('How we check counts', 'Cara kami mengecek hitungan'),
  deploymentLink: t('Setup and support', 'Setup dan dukungan'),
}

export const faqCopy = {
  title: t('Questions buyers ask us', 'Pertanyaan yang sering diajukan'),
  lead: t('Didn’t find yours? Email us or send a WhatsApp message.', 'Pertanyaan Anda belum terjawab? Kirim email atau pesan WhatsApp.'),
  all: t('See all questions', 'Lihat semua pertanyaan'),
  items: [
    {
      question: t('Can you use the cameras we already have?', 'Bisakah memakai kamera yang sudah kami punya?'),
      answer: t(
        'Sometimes. During the site check we look at where each camera points, the video quality, and how we can access it, then tell you which entrances can be counted with it. We don’t promise that every camera will work.',
        'Terkadang bisa. Saat cek lokasi kami melihat arah tiap kamera, kualitas video, dan cara aksesnya, lalu memberi tahu entrance mana yang bisa dihitung. Kami tidak menjanjikan semua kamera pasti bisa dipakai.',
      ),
    },
    {
      question: t('How accurate are the counts?', 'Seberapa akurat hitungannya?'),
      answer: t(
        'It depends on each entrance, so we don’t quote one number for every site. Before handover we compare SmartCounter’s counts with a reference count for an agreed period and share the result with you.',
        'Tergantung kondisi tiap entrance, jadi kami tidak memberi satu angka untuk semua lokasi. Sebelum serah terima, kami membandingkan hitungan SmartCounter dengan hitungan referensi selama periode yang disepakati dan membagikan hasilnya kepada Anda.',
      ),
    },
    {
      question: t('Is entering rate the same as sales conversion?', 'Apakah entering rate sama dengan konversi penjualan?'),
      answer: t(
        'No. Entering rate compares the people who came in with the people who walked past. Sales conversion also needs your sales (POS) data, through an integration we would plan with you.',
        'Bukan. Entering rate membandingkan orang yang masuk dengan orang yang lewat. Konversi penjualan juga membutuhkan data penjualan (POS) Anda, lewat integrasi yang kami rencanakan bersama.',
      ),
    },
    {
      question: t('Do you identify individual visitors?', 'Apakah SmartCounter mengenali pengunjung satu per satu?'),
      answer: t(
        'No. Reports show totals: how many people came, when, and where they went, not who they are. How video is processed and stored is agreed for each site before we start.',
        'Tidak. Laporan menampilkan total: berapa banyak orang datang, kapan, dan ke mana, bukan siapa mereka. Cara video diproses dan disimpan disepakati untuk setiap lokasi sebelum kami mulai.',
      ),
    },
    {
      question: t('How much does it cost?', 'Berapa biayanya?'),
      answer: t(
        'It depends on how many entrances and locations you have and which add-ons you need, so we quote after a short call. Every setup starts with the Core Platform.',
        'Tergantung jumlah entrance dan lokasi serta tambahan yang Anda butuhkan, jadi penawaran kami buat setelah obrolan singkat. Setiap setup dimulai dari Core Platform.',
      ),
    },
  ],
}

export const finalCopy = {
  title: t(
    'Bring one store or mall. We’ll show you what SmartCounter would count there.',
    'Bawa satu toko atau mall. Kami tunjukkan apa yang bisa dihitung SmartCounter di sana.',
  ),
  body: t(
    'Book a demo with our team in Jakarta, or message us on WhatsApp.',
    'Jadwalkan demo dengan tim kami di Jakarta, atau kirim pesan lewat WhatsApp.',
  ),
}
