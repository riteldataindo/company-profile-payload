import { capabilityGroups } from './metricData'

// Offline copy of the company-smartcounter packages, guides, FAQ, and metrics.
export type ProfileLocale = 'en' | 'id'

export type ProfilePackage = {
  name: string
  label: string
  body: string
  items: string[]
  status: 'deployment' | 'assessment' | 'scope'
}

export type ProfileCapability = {
  group: string
  question: string
  name: string
  definition: string
  unit: string
  decision: string
  prerequisite: string
  limitation: string
  status: string
}

export type ProfileGuide = {
  slug: string
  title: string
  description: string
}

export type ProfileFaqGroup = {
  title: string
  items: Array<{ question: string; answer: string }>
}

type LocalText = { en: string; id: string }

type PackageSource = {
  name: string
  label: LocalText
  body: LocalText
  items: LocalText[]
  status: ProfilePackage['status']
}

type GuideSource = {
  slug: string
  title: LocalText
  description: LocalText
}

type FaqSource = {
  title: LocalText
  items: Array<{ question: LocalText; answer: LocalText }>
}

type CapabilitySource = {
  title: LocalText
  question: LocalText
  metrics: Array<{
    name: LocalText
    definition: LocalText
    unit: LocalText
    status: ProfilePackage['status']
  }>
}

const pick = (value: LocalText, locale: ProfileLocale) => value[locale]

const packageSource: PackageSource[] = [
  {
    name: 'Core Platform',
    label: {
      en: 'Core',
      id: 'Core',
    },
    body: {
      en: 'Defined traffic and reporting foundations for an approved Retail or Mall scope.',
      id: 'Fondasi traffic dan reporting untuk scope Retail atau Mall disetujui.',
    },
    items: [
      {
        en: 'In / Out and period traffic',
        id: 'Traffic In / Out dan periode',
      },
      {
        en: 'Scoped Retail or Mall dashboard',
        id: 'Dashboard Retail atau Mall ter-scope',
      },
      {
        en: 'Standard reporting and export',
        id: 'Reporting dan export standard',
      },
      {
        en: 'Local implementation and support',
        id: 'Implementasi dan support lokal',
      },
    ],
    status: 'scope',
  },
  {
    name: 'Advanced Analytics',
    label: {
      en: 'Most common',
      id: 'Paling umum',
    },
    body: {
      en: 'Optional modules assessed on top of Core.',
      id: 'Optional module yang dinilai di atas Core.',
    },
    items: [
      {
        en: 'Dwell time and heatmap',
        id: 'Dwell time dan heatmap',
      },
      {
        en: 'Passers-by and Entering Rate',
        id: 'Passers-by dan Entering Rate',
      },
      {
        en: 'Journey and zone analytics',
        id: 'Journey dan zone analytics',
      },
      {
        en: 'Staff exclusion or demographics when supported',
        id: 'Staff exclusion atau demographics bila didukung',
      },
    ],
    status: 'assessment',
  },
  {
    name: 'Enterprise',
    label: {
      en: 'Complex rollout',
      id: 'Rollout kompleks',
    },
    body: {
      en: 'Governed multi-location or multi-property scope.',
      id: 'Scope multi-location atau multi-property yang governed.',
    },
    items: [
      {
        en: 'Selected Core and advanced modules',
        id: 'Selected Core dan advanced module',
      },
      {
        en: 'Multi-location / property hierarchy',
        id: 'Hierarchy multi-location / property',
      },
      {
        en: 'Assessed reporting and integration',
        id: 'Reporting dan integration berdasarkan assessment',
      },
      {
        en: 'Contract-specific support and SLA options',
        id: 'Support dan SLA option sesuai kontrak',
      },
    ],
    status: 'assessment',
  },
]

const guideSource: GuideSource[] = [
  {
    slug: 'what-is-a-people-counting-system',
    title: {
      en: 'What Is a People Counting System?',
      id: 'Apa Itu People Counting System?',
    },
    description: {
      en: 'A practical introduction to boundaries, units, periods, validation, and the decisions a count can support.',
      id: 'Pengantar praktis mengenai boundary, unit, periode, validasi, dan keputusan yang dapat didukung suatu hitungan.',
    },
  },
  {
    slug: 'why-in-out-counts-differ',
    title: {
      en: 'Why Can IN and OUT Counts Be Different?',
      id: 'Kenapa Hitungan IN dan OUT Bisa Berbeda?',
    },
    description: {
      en: 'A structured way to inspect boundary, direction, period, scene, operations, and data handling before drawing conclusions.',
      id: 'Cara terstruktur untuk meninjau boundary, arah, periode, scene, operasi, dan data handling sebelum menarik kesimpulan.',
    },
  },
  {
    slug: 'validation-and-accuracy',
    title: {
      en: 'How People Counting Validation and Accuracy Work',
      id: 'Cara Kerja Validasi dan Akurasi People Counting',
    },
    description: {
      en: 'Why validation needs a metric definition, reference, representative sample, acceptance rule, limitation, and revalidation trigger.',
      id: 'Mengapa validasi membutuhkan definisi metric, reference, sample representatif, acceptance rule, limitation, dan trigger revalidation.',
    },
  },
  {
    slug: 'existing-cctv-people-counting',
    title: {
      en: 'Can Existing CCTV Be Used for People Counting?',
      id: 'Apakah CCTV Existing Bisa Digunakan untuk People Counting?',
    },
    description: {
      en: 'What a site assessment should review before confirming whether an existing camera or video input fits the intended measurement.',
      id: 'Yang perlu ditinjau saat site assessment sebelum mengonfirmasi apakah input kamera atau video existing cocok untuk measurement yang dituju.',
    },
  },
]

const faqSource: FaqSource[] = [
  {
    title: {
      en: 'Product and measurement',
      id: 'Produk dan measurement',
    },
    items: [
      {
        question: {
          en: 'What does SmartCounter measure?',
          id: 'Apa yang diukur SmartCounter?',
        },
        answer: {
          en: 'Configured aggregate traffic and spatial signals within an approved boundary, period, definition, and deployment scope.',
          id: 'Traffic dan sinyal spasial agregat terkonfigurasi dalam boundary, periode, definisi, dan scope deployment disetujui.',
        },
      },
      {
        question: {
          en: 'Is Entering Rate sales conversion?',
          id: 'Apakah Entering Rate adalah sales conversion?',
        },
        answer: {
          en: 'No. Entering Rate uses compatible entries and passer-by observations. Sales conversion requires an approved POS or sales integration and denominator.',
          id: 'Tidak. Entering Rate memakai entry dan observasi passer-by kompatibel. Sales conversion membutuhkan integrasi POS/sales dan denominator disetujui.',
        },
      },
      {
        question: {
          en: 'Is demographics identity data?',
          id: 'Apakah demographics adalah identity data?',
        },
        answer: {
          en: 'Public wording treats supported demographic output as aggregate estimates, not identity records. Availability requires assessment and privacy review.',
          id: 'Public wording memperlakukan output demographic yang didukung sebagai estimasi agregat, bukan identity record. Ketersediaan memerlukan assessment dan privacy review.',
        },
      },
    ],
  },
  {
    title: {
      en: 'Validation and availability',
      id: 'Validasi dan ketersediaan',
    },
    items: [
      {
        question: {
          en: 'What accuracy does SmartCounter guarantee?',
          id: 'Berapa akurasi yang dijamin SmartCounter?',
        },
        answer: {
          en: 'The public site does not state one universal percentage. Performance is evaluated for the named metric, scene, boundary, period, reference, and validation plan.',
          id: 'Website tidak menyebutkan satu persentase universal. Performance dievaluasi untuk metric, scene, boundary, periode, reference, dan validation plan yang disebutkan.',
        },
      },
      {
        question: {
          en: 'Is every feature available everywhere?',
          id: 'Apakah semua fitur tersedia di semua tempat?',
        },
        answer: {
          en: 'No. Capability status depends on the approved site, topology, input, processing, package, entitlement, and validation scope.',
          id: 'Tidak. Status capability bergantung pada site, topology, input, processing, package, entitlement, dan validation scope disetujui.',
        },
      },
      {
        question: {
          en: 'Is the data real-time?',
          id: 'Apakah datanya real-time?',
        },
        answer: {
          en: 'Freshness must be defined for the deployment. The public site does not use an unscoped universal real-time claim.',
          id: 'Freshness harus didefinisikan untuk deployment. Website tidak memakai klaim real-time universal tanpa scope.',
        },
      },
    ],
  },
  {
    title: {
      en: 'Deployment and commercial scope',
      id: 'Deployment dan scope komersial',
    },
    items: [
      {
        question: {
          en: 'Does SmartCounter work with every CCTV?',
          id: 'Apakah SmartCounter bekerja dengan semua CCTV?',
        },
        answer: {
          en: 'No universal compatibility is promised. Existing input can be assessed from the scene, stream, boundary, performance, privacy, and intended measurement.',
          id: 'Tidak ada kompatibilitas universal. Input existing dapat dinilai dari scene, stream, boundary, performance, privacy, dan measurement yang dituju.',
        },
      },
      {
        question: {
          en: 'Why is there no public fixed price?',
          id: 'Kenapa tidak ada fixed public price?',
        },
        answer: {
          en: 'Scope can vary by location, boundary, camera/input fit, analytics, validation, integration, reporting, support, and commercial responsibility.',
          id: 'Scope dapat berubah berdasarkan lokasi, boundary, kecocokan input, analytics, validation, integration, reporting, support, dan responsibility komersial.',
        },
      },
      {
        question: {
          en: 'What happens after contact?',
          id: 'Apa yang terjadi setelah contact?',
        },
        answer: {
          en: 'A site discussion reviews the operating question, context, expected output, and the assessment needed. The current implementation does not yet send the form.',
          id: 'Site discussion meninjau operating question, konteks, output yang diharapkan, dan assessment yang dibutuhkan. Implementasi saat ini belum mengirim form.',
        },
      },
    ],
  },
]

const capabilitySource: CapabilitySource[] = [
  {
    title: {
      en: 'Traffic',
      id: 'Traffic',
    },
    question: {
      en: 'How much movement is arriving?',
      id: 'Seberapa banyak movement yang datang?',
    },
    metrics: [
      {
        name: {
          en: 'Visitor traffic',
          id: 'Visitor traffic',
        },
        definition: {
          en: 'Aggregate people observations across a configured entrance and reporting period.',
          id: 'Observasi orang secara agregat pada entrance dan periode terkonfigurasi.',
        },
        unit: {
          en: 'People per boundary and period',
          id: 'Orang per boundary dan periode',
        },
        status: 'deployment',
      },
      {
        name: {
          en: 'In / Out traffic',
          id: 'In / Out traffic',
        },
        definition: {
          en: 'Separate aggregate entry and exit observations at a configured boundary.',
          id: 'Observasi entry dan exit agregat pada boundary terkonfigurasi.',
        },
        unit: {
          en: 'Entries and exits per period',
          id: 'Entry dan exit per periode',
        },
        status: 'deployment',
      },
      {
        name: {
          en: 'Passers-by',
          id: 'Passers-by',
        },
        definition: {
          en: 'Aggregate people observations passing an approved storefront or approach line.',
          id: 'Observasi orang agregat yang melintasi storefront atau approach line disetujui.',
        },
        unit: {
          en: 'People per approach boundary and period',
          id: 'Orang per approach boundary dan periode',
        },
        status: 'assessment',
      },
      {
        name: {
          en: 'Entering Rate',
          id: 'Entering Rate',
        },
        definition: {
          en: 'Configured entries divided by compatible passer-by observations in the same period.',
          id: 'Entry terkonfigurasi dibagi observasi passer-by kompatibel pada periode sama.',
        },
        unit: {
          en: 'Percentage with a named denominator',
          id: 'Persentase dengan denominator disebutkan',
        },
        status: 'assessment',
      },
      {
        name: {
          en: 'Outer gate traffic',
          id: 'Outer gate traffic',
        },
        definition: {
          en: 'Aggregate entries and exits at a classified outer Mall gate.',
          id: 'Entry dan exit agregat pada outer gate Mall terklasifikasi.',
        },
        unit: {
          en: 'People per outer gate, direction, and period',
          id: 'Orang per outer gate, arah, dan periode',
        },
        status: 'deployment',
      },
      {
        name: {
          en: 'Internal gate movement',
          id: 'Internal gate movement',
        },
        definition: {
          en: 'Aggregate movement across an approved internal boundary.',
          id: 'Movement agregat pada boundary internal disetujui.',
        },
        unit: {
          en: 'People per internal boundary and period',
          id: 'Orang per boundary internal dan periode',
        },
        status: 'deployment',
      },
    ],
  },
  {
    title: {
      en: 'Flow & Zones',
      id: 'Flow & Zone',
    },
    question: {
      en: 'Where does movement happen?',
      id: 'Di mana movement terjadi?',
    },
    metrics: [
      {
        name: {
          en: 'Dwell time',
          id: 'Dwell time',
        },
        definition: {
          en: 'Time associated with an aggregate visit or configured zone observation.',
          id: 'Durasi terkait visit agregat atau observasi zone terkonfigurasi.',
        },
        unit: {
          en: 'Minutes per visit or zone observation',
          id: 'Menit per visit atau observasi zone',
        },
        status: 'assessment',
      },
      {
        name: {
          en: 'Heatmap',
          id: 'Heatmap',
        },
        definition: {
          en: 'Aggregate density or movement context over an approved scene or floor reference.',
          id: 'Konteks kepadatan atau movement agregat pada scene atau floor reference disetujui.',
        },
        unit: {
          en: 'Relative density by area and period',
          id: 'Kepadatan relatif per area dan periode',
        },
        status: 'assessment',
      },
      {
        name: {
          en: 'Journey',
          id: 'Journey',
        },
        definition: {
          en: 'Aggregate transitions between approved areas within supported coverage.',
          id: 'Transisi agregat antar-area disetujui dalam coverage yang didukung.',
        },
        unit: {
          en: 'Transitions between zones per period',
          id: 'Transisi antar-zone per periode',
        },
        status: 'assessment',
      },
      {
        name: {
          en: 'Floor & zone flow',
          id: 'Floor & zone flow',
        },
        definition: {
          en: 'Aggregate movement, transitions, or density within approved floor and zone topology.',
          id: 'Movement, transisi, atau density agregat dalam topology floor dan zone disetujui.',
        },
        unit: {
          en: 'People, transitions, or relative density by area and period',
          id: 'Orang, transisi, atau density relatif per area dan periode',
        },
        status: 'assessment',
      },
      {
        name: {
          en: 'Dwell by area',
          id: 'Dwell by area',
        },
        definition: {
          en: 'Time associated with approved aggregate observations in a Mall area.',
          id: 'Durasi terkait observasi agregat yang disetujui pada area Mall.',
        },
        unit: {
          en: 'Minutes per area observation and period',
          id: 'Menit per observasi area dan periode',
        },
        status: 'assessment',
      },
      {
        name: {
          en: 'Tenant / area comparison',
          id: 'Tenant / area comparison',
        },
        definition: {
          en: 'Scoped comparison of approved tenant-area or common-area signals.',
          id: 'Perbandingan ter-scope atas sinyal tenant area atau common area disetujui.',
        },
        unit: {
          en: 'Named metric per area and aligned period',
          id: 'Metric disebutkan per area dan periode selaras',
        },
        status: 'assessment',
      },
    ],
  },
  {
    title: {
      en: 'Operations',
      id: 'Operasional',
    },
    question: {
      en: 'What should an operator review next?',
      id: 'Apa yang perlu ditinjau operator berikutnya?',
    },
    metrics: [
      {
        name: {
          en: 'Staff exclusion',
          id: 'Staff exclusion',
        },
        definition: {
          en: 'Optional configured handling for approved staff paths, schedules, or signals.',
          id: 'Penanganan opsional untuk path, jadwal, atau sinyal staff yang disetujui.',
        },
        unit: {
          en: 'Aggregate count under an agreed inclusion rule',
          id: 'Hitungan agregat dengan inclusion rule disepakati',
        },
        status: 'assessment',
      },
      {
        name: {
          en: 'Occupancy',
          id: 'Occupancy',
        },
        definition: {
          en: 'Aggregate people present within an approved floor, common-area, or tenant boundary.',
          id: 'Orang agregat yang berada dalam boundary floor, common area, atau tenant disetujui.',
        },
        unit: {
          en: 'People present per boundary and timestamp',
          id: 'Orang hadir per boundary dan timestamp',
        },
        status: 'assessment',
      },
    ],
  },
]

export function fallbackPackages(locale: ProfileLocale): ProfilePackage[] {
  return packageSource.map((item) => ({
    name: item.name,
    label: pick(item.label, locale),
    body: pick(item.body, locale),
    items: item.items.map((line) => pick(line, locale)),
    status: item.status,
  }))
}

export function fallbackGuides(locale: ProfileLocale): ProfileGuide[] {
  return guideSource.map((item) => ({
    slug: item.slug,
    title: pick(item.title, locale),
    description: pick(item.description, locale),
  }))
}

export function fallbackFaq(locale: ProfileLocale): ProfileFaqGroup[] {
  return faqSource.map((group) => ({
    title: pick(group.title, locale),
    items: group.items.map((item) => ({
      question: pick(item.question, locale),
      answer: pick(item.answer, locale),
    })),
  }))
}

export function fallbackCapabilities(locale: ProfileLocale): ProfileCapability[] {
  return capabilityGroups.flatMap((group) => group.metrics.map((metric) => ({
    group: pick(group.title, locale),
    question: pick(group.question, locale),
    name: pick(metric.name, locale),
    definition: pick(metric.definition, locale),
    unit: pick(metric.unit, locale),
    decision: pick(metric.decision, locale),
    prerequisite: pick(metric.prerequisite, locale),
    limitation: pick(metric.limitation, locale),
    status: metric.status,
  })))
}
