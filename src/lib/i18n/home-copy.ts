export type HomeLocale = 'en' | 'id'

export type HomeCopy = {
  hero: {
    eyebrow: string
    title: string
    description: string
    primaryCta: string
    secondaryCta: string
    visualLabel: string
    visualAlt: string
    visualCaption: string
    pathNote: string
  }
  howItWorks: {
    eyebrow: string
    title: string
    description: string
    steps: Array<{ title: string; description: string }>
    caption: string
    cta: string
  }
  gateway: {
    eyebrow: string
    title: string
    description: string
    retail: {
      label: string
      title: string
      description: string
      contextLabel: string
      context: string
      cta: string
    }
    mall: {
      label: string
      title: string
      description: string
      contextLabel: string
      context: string
      cta: string
    }
  }
  decisions: {
    eyebrow: string
    title: string
    description: string
    availability: string
    cta: string
    groups: Array<{
      label: string
      title: string
      description: string
      items: string[]
    }>
  }
  evidence: {
    eyebrow: string
    title: string
    description: string
    sampleLabel: string
    sampleTitle: string
    visualAlt: string
    sampleCaption: string
    trustItems: Array<{ label: string; description: string }>
    faqCta: string
    privacyCta: string
  }
  demo: {
    eyebrow: string
    title: string
    description: string
    steps: Array<{ title: string; description: string }>
    primaryCta: string
    secondaryCta: string
    footnote: string
  }
  faq: {
    eyebrow: string
    title: string
    items: Array<{ question: string; answer: string }>
    footerLead: string
    footerCta: string
  }
}

const en: HomeCopy = {
  hero: {
    eyebrow: 'Visitor analytics for physical spaces',
    title: 'People counting and visitor analytics for retail and mall.',
    description: 'SmartCounter turns compatible camera streams into aggregate traffic and spatial signals for retail stores and malls. Metrics, performance, and availability are confirmed for each deployment.',
    primaryCta: 'Request a site-fit demo',
    secondaryCta: 'Compare Retail and Mall',
    visualLabel: 'Conceptual device coverage',
    visualAlt: 'Unbranded retail entrance with anonymous visitors crossing beneath a ceiling sensor.',
    visualCaption: 'Illustrative venue scenario · The coverage field explains camera context; it is not customer or measured deployment data.',
    pathNote: 'Retail and Mall paths are one choice away.',
  },
  howItWorks: {
    eyebrow: 'How it works',
    title: 'From a camera context to a useful operating signal.',
    description: 'A site-fit conversation keeps the measurement, boundary, and next decision explicit.',
    steps: [
      { title: 'Assess the site', description: 'Review camera placement, lighting, network, and the operating question.' },
      { title: 'Validate the setup', description: 'Agree what can be measured and how representative checks will be handled.' },
      { title: 'Aggregate the signal', description: 'Translate compatible inputs into defined traffic, flow, or zone summaries.' },
      { title: 'Review the decision', description: 'Use the agreed view to compare periods, places, or operating actions.' },
    ],
    caption: 'Conceptual flow · Exact processing, retention, and update interval depend on deployment assessment.',
    cta: 'Read the technical FAQ',
  },
  gateway: {
    eyebrow: 'Retail or Mall',
    title: 'Start with the operating context.',
    description: 'Retail and Mall teams ask different questions of the same physical space. Choose the story closest to your decision.',
    retail: {
      label: 'Retail',
      title: 'Review store traffic and configured zones.',
      description: 'Support entrance, movement, and day-to-day operating reviews across a store or portfolio.',
      contextLabel: 'Useful context',
      context: 'Store format, camera view, and the decision to review.',
      cta: 'Explore Retail',
    },
    mall: {
      label: 'Mall',
      title: 'Compare movement across floors and zones.',
      description: 'Support entrance, floor, zone, and occupancy conversations when those views are configured for the site.',
      contextLabel: 'Useful context',
      context: 'Venue layout, floors or zones, and the operating question.',
      cta: 'Explore Mall',
    },
  },
  decisions: {
    eyebrow: 'Decision groups',
    title: 'Three operating questions to review first.',
    description: 'Home shows the three questions most buyers bring to a site-fit conversation. The full capability set belongs on Features.',
    availability: 'Capability availability and performance are confirmed during assessment and may depend on package and deployment configuration.',
    cta: 'Explore Features',
    groups: [
      {
        label: 'Traffic',
        title: 'How much movement is arriving?',
        description: 'Review configured entrance or period signals with a clear scope and definition.',
        items: ['Traffic by period', 'Entrance comparison', 'Configured counts'],
      },
      {
        label: 'Flow & Zones',
        title: 'Where does movement happen?',
        description: 'Compare paths and zones defined for the deployment, without treating a sample as proof.',
        items: ['Zone comparison', 'Flow direction', 'Dwell context'],
      },
      {
        label: 'Operations',
        title: 'What should an operator review next?',
        description: 'Bring the agreed signals into staffing, layout, or venue review conversations.',
        items: ['Operating review', 'Exception context', 'Next action'],
      },
    ],
  },
  evidence: {
    eyebrow: 'Evidence and limits',
    title: 'What an operator can actually review.',
    description: 'Labeled sample diagrams can explain traffic, flow, and operations without pretending to be a customer result or product screenshot.',
    sampleLabel: 'Conceptual review diagrams',
    sampleTitle: 'Traffic, flow, and operations as labeled samples',
    visualAlt: 'Three conceptual diagrams for entrance traffic, zone comparison, and operating review, each stamped as a sample.',
    sampleCaption: 'Illustrative sample · Diagram geometry only; no production values or customer sites.',
    trustItems: [
      { label: 'Validation', description: 'Representative checks are agreed with the deployment team.' },
      { label: 'Data boundary', description: 'Inputs, processing, retention, and access are confirmed for the approved setup.' },
      { label: 'Capability status', description: 'Configured per deployment; availability is not inferred from a visual.' },
      { label: 'Proof gate', description: 'Customer, deployment, and performance claims appear only with approved evidence.' },
    ],
    faqCta: 'Review the FAQ',
    privacyCta: 'Read privacy guidance',
  },
  demo: {
    eyebrow: 'Site-fit demo',
    title: 'Make the demo answer a real question.',
    description: 'Share the venue context and the decision you need to review. The conversation stays grounded in fit, prerequisites, and evidence.',
    steps: [
      { title: 'Bring', description: 'A store or mall context, camera/site constraints, and the operational question.' },
      { title: 'Review', description: 'A representative workflow, available signals, and the limits that matter for your setup.' },
      { title: 'Decide', description: 'Whether the next step is a site assessment, a configured pilot, or more evidence.' },
    ],
    primaryCta: 'Request a site-fit demo',
    secondaryCta: 'Contact the team',
    footnote: 'The demo form is the source of truth for the context you want to discuss.',
  },
  faq: {
    eyebrow: 'Buyer FAQ',
    title: 'Questions buyers ask first.',
    items: [
      { question: 'Which camera or video inputs can SmartCounter use?', answer: 'Compatibility depends on the camera view, stream access, site conditions, and the agreed deployment setup. Share those details for a site-fit review.' },
      { question: 'How do you validate a metric?', answer: 'The measurement and validation approach is agreed for the venue, metric definition, timeframe, and representative checks. Performance is not assumed from a sample visual.' },
      { question: 'What data is processed and retained?', answer: 'The approved data boundary, processing path, retention, and access rules are confirmed for the deployment. See the Privacy page for the published policy.' },
      { question: 'What will a demo show?', answer: 'We use your operating context to walk through the relevant workflow, prerequisites, available signals, and next-step fit. The form captures what you want to evaluate.' },
    ],
    footerLead: 'Need a deeper answer?',
    footerCta: 'Contact SmartCounter',
  },
}

const id: HomeCopy = {
  hero: {
    eyebrow: 'Analitik pengunjung untuk ruang fisik',
    title: 'People counting dan analitik pengunjung untuk retail dan mall.',
    description: 'SmartCounter mengubah stream kamera yang kompatibel menjadi sinyal traffic dan spasial agregat untuk toko retail dan mall. Metrik, performa, dan ketersediaan dikonfirmasi untuk setiap deployment.',
    primaryCta: 'Minta demo site-fit',
    secondaryCta: 'Bandingkan Retail dan Mall',
    visualLabel: 'Coverage perangkat konseptual',
    visualAlt: 'Entrance retail tanpa merek dengan pengunjung anonim melintas di bawah sensor plafon dan bidang coverage transparan.',
    visualCaption: 'Skenario venue ilustratif · Bidang coverage menjelaskan konteks kamera; bukan data pelanggan atau hasil pengukuran deployment.',
    pathNote: 'Jalur Retail dan Mall tersedia dalam satu pilihan.',
  },
  howItWorks: {
    eyebrow: 'Cara kerja',
    title: 'Dari konteks kamera menjadi sinyal operasional yang berguna.',
    description: 'Percakapan site-fit membuat pengukuran, batas data, dan keputusan berikutnya tetap jelas.',
    steps: [
      { title: 'Tinjau lokasi', description: 'Tinjau posisi kamera, pencahayaan, jaringan, dan pertanyaan operasional.' },
      { title: 'Validasi setup', description: 'Sepakati apa yang dapat diukur dan bagaimana pemeriksaan yang representatif dilakukan.' },
      { title: 'Agregasikan sinyal', description: 'Ubah input yang kompatibel menjadi ringkasan traffic, flow, atau zona yang terdefinisi.' },
      { title: 'Tinjau keputusan', description: 'Gunakan tampilan yang disepakati untuk membandingkan periode, area, atau tindakan operasional.' },
    ],
    caption: 'Alur konseptual · Pemrosesan, retensi, dan interval pembaruan ditentukan melalui asesmen deployment.',
    cta: 'Baca FAQ teknis',
  },
  gateway: {
    eyebrow: 'Retail atau Mall',
    title: 'Mulai dari konteks operasional.',
    description: 'Tim Retail dan Mall memiliki pertanyaan berbeda atas ruang fisik yang sama. Pilih cerita yang paling dekat dengan keputusan Anda.',
    retail: {
      label: 'Retail',
      title: 'Tinjau traffic toko dan zona yang dikonfigurasi.',
      description: 'Dukung tinjauan pintu masuk, pergerakan, dan operasional harian di satu toko atau portofolio.',
      contextLabel: 'Konteks yang berguna',
      context: 'Format toko, tampilan kamera, dan keputusan yang ingin ditinjau.',
      cta: 'Jelajahi Retail',
    },
    mall: {
      label: 'Mall',
      title: 'Bandingkan pergerakan antar-lantai dan zona.',
      description: 'Dukung percakapan entrance, lantai, zona, dan occupancy ketika tampilan tersebut dikonfigurasi untuk lokasi.',
      contextLabel: 'Konteks yang berguna',
      context: 'Layout venue, lantai atau zona, dan pertanyaan operasional.',
      cta: 'Jelajahi Mall',
    },
  },
  decisions: {
    eyebrow: 'Kelompok keputusan',
    title: 'Tiga pertanyaan operasional yang ditinjau lebih dulu.',
    description: 'Home menampilkan tiga pertanyaan yang paling sering dibawa ke percakapan site-fit. Kumpulan kapabilitas lengkap ada di halaman Features.',
    availability: 'Ketersediaan dan performa kapabilitas dikonfirmasi saat asesmen dan dapat bergantung pada paket serta konfigurasi deployment.',
    cta: 'Jelajahi Features',
    groups: [
      {
        label: 'Traffic',
        title: 'Seberapa banyak pergerakan yang datang?',
        description: 'Tinjau sinyal entrance atau periode yang dikonfigurasi dengan cakupan dan definisi yang jelas.',
        items: ['Traffic per periode', 'Perbandingan entrance', 'Hitungan terkonfigurasi'],
      },
      {
        label: 'Flow & Zona',
        title: 'Di mana pergerakan terjadi?',
        description: 'Bandingkan jalur dan zona yang didefinisikan untuk deployment tanpa menganggap sampel sebagai bukti.',
        items: ['Perbandingan zona', 'Arah flow', 'Konteks dwell'],
      },
      {
        label: 'Operasional',
        title: 'Apa yang perlu ditinjau operator selanjutnya?',
        description: 'Bawa sinyal yang disepakati ke dalam percakapan staffing, layout, atau tinjauan venue.',
        items: ['Tinjauan operasional', 'Konteks pengecualian', 'Tindakan berikutnya'],
      },
    ],
  },
  evidence: {
    eyebrow: 'Bukti dan batasan',
    title: 'Apa yang dapat ditinjau operator.',
    description: 'Diagram sampel berlabel dapat menjelaskan traffic, flow, dan operasional tanpa berpura-pura menjadi hasil pelanggan atau screenshot produk.',
    sampleLabel: 'Diagram tinjauan konseptual',
    sampleTitle: 'Traffic, flow, dan operasional sebagai sampel berlabel',
    visualAlt: 'Tiga diagram konseptual untuk traffic entrance, perbandingan zona, dan tinjauan operasional, masing-masing berstempel sampel.',
    sampleCaption: 'Sampel ilustratif · Hanya geometri diagram; tanpa nilai produksi atau lokasi pelanggan.',
    trustItems: [
      { label: 'Validasi', description: 'Pemeriksaan yang representatif disepakati bersama tim deployment.' },
      { label: 'Batas data', description: 'Input, pemrosesan, retensi, dan akses dikonfirmasi untuk setup yang disetujui.' },
      { label: 'Status kapabilitas', description: 'Dikonfigurasi per deployment; ketersediaan tidak disimpulkan dari visual.' },
      { label: 'Gerbang bukti', description: 'Klaim pelanggan, deployment, dan performa hanya ditampilkan dengan bukti yang disetujui.' },
    ],
    faqCta: 'Tinjau FAQ',
    privacyCta: 'Baca panduan privasi',
  },
  demo: {
    eyebrow: 'Demo site-fit',
    title: 'Buat demo menjawab pertanyaan nyata.',
    description: 'Bagikan konteks venue dan keputusan yang ingin ditinjau. Percakapan tetap berangkat dari kecocokan, prasyarat, dan bukti.',
    steps: [
      { title: 'Bawa', description: 'Konteks toko atau mall, batasan kamera/lokasi, dan pertanyaan operasional.' },
      { title: 'Tinjau', description: 'Alur representatif, sinyal yang tersedia, dan batasan yang relevan untuk setup Anda.' },
      { title: 'Tentukan', description: 'Apakah langkah berikutnya asesmen lokasi, pilot terkonfigurasi, atau bukti tambahan.' },
    ],
    primaryCta: 'Minta demo site-fit',
    secondaryCta: 'Hubungi tim',
    footnote: 'Form demo menjadi sumber kebenaran untuk konteks yang ingin Anda diskusikan.',
  },
  faq: {
    eyebrow: 'FAQ pembeli',
    title: 'Pertanyaan pertama dari pembeli.',
    items: [
      { question: 'Input kamera atau video apa yang dapat digunakan SmartCounter?', answer: 'Kompatibilitas bergantung pada tampilan kamera, akses stream, kondisi lokasi, dan setup deployment yang disepakati. Bagikan detail tersebut untuk tinjauan site-fit.' },
      { question: 'Bagaimana metrik divalidasi?', answer: 'Pendekatan pengukuran dan validasi disepakati untuk venue, definisi metrik, periode, dan pemeriksaan yang representatif. Performa tidak diasumsikan dari visual sampel.' },
      { question: 'Data apa yang diproses dan disimpan?', answer: 'Batas data, jalur pemrosesan, retensi, dan aturan akses yang disetujui dikonfirmasi untuk deployment. Lihat halaman Privacy untuk kebijakan yang dipublikasikan.' },
      { question: 'Apa yang akan ditunjukkan dalam demo?', answer: 'Kami menggunakan konteks operasional Anda untuk membahas alur, prasyarat, sinyal yang tersedia, dan kecocokan langkah berikutnya. Form mencatat hal yang ingin Anda evaluasi.' },
    ],
    footerLead: 'Butuh jawaban lebih dalam?',
    footerCta: 'Hubungi SmartCounter',
  },
}

export function getHomeCopy(locale: string): HomeCopy {
  return locale === 'id' ? id : en
}
