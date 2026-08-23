export type DemoWalkthroughBeat = {
  time: string
  title: string
  body: string
}

export type DemoWalkthroughCopy = {
  eyebrow: string
  title: string
  description: string
  stillAlt: string
  stillCaption: string
  stillSrc: string
  transcriptLabel: string
  transcriptHint: string
  beats: DemoWalkthroughBeat[]
}

const en: DemoWalkthroughCopy = {
  eyebrow: 'What a walkthrough covers',
  title: 'A short, documented site-fit sequence.',
  description: 'There is no automatically playing product film on this page. The still and transcript show the order of a representative conversation: context, entrance geometry, a configured zone, then limits.',
  stillAlt: 'Unbranded retail entrance used as a conceptual still for the site-fit walkthrough. No live counts or customer site.',
  stillCaption: 'Walkthrough still · Conceptual venue plate, not a recorded dashboard or customer deployment.',
  stillSrc: '/editorial/home-device-coverage-v4.webp',
  transcriptLabel: 'Walkthrough transcript',
  transcriptHint: 'Timed as a 20–30 second document, not as a live recording.',
  beats: [
    {
      time: '00:00',
      title: 'Start from the operating question',
      body: 'Retail or Mall, the camera or site constraint, and the decision to review. The form on this page captures that context.',
    },
    {
      time: '00:08',
      title: 'Read the entrance or gate line',
      body: 'A compatible view can show a configured crossing. The overlay is a sample of geometry, not a live count.',
    },
    {
      time: '00:16',
      title: 'Compare one configured zone',
      body: 'If a zone is in scope, the walkthrough stays on its definition, unit, and reporting window.',
    },
    {
      time: '00:24',
      title: 'Leave with limits and a next step',
      body: 'Prerequisites, data boundary, and whether the next step is assessment, a configured pilot, or more evidence.',
    },
  ],
}

const id: DemoWalkthroughCopy = {
  eyebrow: 'Cakupan walkthrough',
  title: 'Urutan site-fit yang terdokumentasi, singkat.',
  description: 'Tidak ada film produk yang diputar otomatis di halaman ini. Still dan transkrip menunjukkan urutan percakapan representatif: konteks, geometri entrance, satu zona terkonfigurasi, lalu batasannya.',
  stillAlt: 'Entrance retail tanpa merek sebagai still konseptual untuk walkthrough site-fit. Bukan hitungan live atau lokasi pelanggan.',
  stillCaption: 'Still walkthrough · Plat venue konseptual, bukan rekaman dashboard atau deployment pelanggan.',
  stillSrc: '/editorial/home-device-coverage-v4.webp',
  transcriptLabel: 'Transkrip walkthrough',
  transcriptHint: 'Dijadwalkan sebagai dokumen 20–30 detik, bukan rekaman live.',
  beats: [
    {
      time: '00:00',
      title: 'Mulai dari pertanyaan operasional',
      body: 'Retail atau Mall, batasan kamera atau lokasi, dan keputusan yang ingin ditinjau. Form di halaman ini mencatat konteks tersebut.',
    },
    {
      time: '00:08',
      title: 'Baca garis entrance atau gate',
      body: 'Tampilan yang kompatibel dapat menunjukkan perlintasan yang dikonfigurasi. Overlay adalah sampel geometri, bukan hitungan live.',
    },
    {
      time: '00:16',
      title: 'Bandingkan satu zona terkonfigurasi',
      body: 'Jika zona masuk cakupan, walkthrough tetap pada definisi, unit, dan jendela pelaporannya.',
    },
    {
      time: '00:24',
      title: 'Akhiri dengan batasan dan langkah berikutnya',
      body: 'Prasyarat, batas data, dan apakah langkah berikutnya asesmen, pilot terkonfigurasi, atau bukti tambahan.',
    },
  ],
}

export function getDemoWalkthroughCopy(locale: string): DemoWalkthroughCopy {
  return locale === 'id' ? id : en
}
