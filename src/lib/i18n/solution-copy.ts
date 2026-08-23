export type SolutionKind = 'retail' | 'mall'

export type CapabilityStatus = 'available' | 'deployment-dependent' | 'assessment-required'

export type Capability = {
  id: string
  name: string
  definition: string
  unit: string
  decision: string
  prerequisite: string
  limitation: string
  status: CapabilityStatus
  sampleSlug: string
  contextNote?: string
}

export type FeatureGroup = {
  id: 'traffic' | 'flow-zones' | 'operations'
  title: string
  question: string
  capabilities: Capability[]
}

export type SolutionMetric = {
  label: string
  definition: string
  unit: string
  decision: string
  prerequisite: string
  limitation: string
  status: CapabilityStatus
}

export type SolutionCopy = {
  kind: SolutionKind
  eyebrow: string
  title: string
  lead: string
  audienceTitle: string
  audienceText: string
  jobTitle: string
  jobText: string
  workflowTitle: string
  workflow: Array<{ title: string; text: string }>
  metricsTitle: string
  metrics: SolutionMetric[]
  requirementsTitle: string
  requirements: string[]
  limitationsTitle: string
  limitations: string[]
  deploymentTitle: string
  deploymentText: string
  privacyTitle: string
  privacyText: string
  evidenceTitle: string
  evidenceText: string
  ctaLabel: string
  ctaNote: string
  secondaryLabel: string
}

const capabilityGroups: Record<SolutionKind, FeatureGroup[]> = {
  retail: [
    {
      id: 'traffic',
      title: 'Traffic',
      question: 'How many people approach, enter, or exit, and when?',
      capabilities: [
        {
          id: 'visitor-traffic',
          name: 'Visitor traffic',
          definition: 'Aggregate people detected across a configured entrance and reporting period.',
          unit: 'People per entrance and time window',
          decision: 'Review traffic patterns before staffing, layout, or campaign decisions.',
          prerequisite: 'Compatible camera view, stable stream, and a reviewed entrance line.',
          limitation: 'Counts depend on camera angle, occlusion, lighting, and representative validation.',
          status: 'deployment-dependent',
          sampleSlug: 'visitor-traffic',
          contextNote: 'Retail scope starts with the store entrance and its configured reporting period.',
        },
        {
          id: 'in-out-traffic',
          name: 'In / out traffic',
          definition: 'Separate aggregate entry and exit observations for configured boundaries.',
          unit: 'Entries and exits per boundary and period',
          decision: 'Compare arrival and departure patterns during operating reviews.',
          prerequisite: 'A clearly defined boundary with camera placement that sees the crossing.',
          limitation: 'An internal doorway is not automatically a store visit boundary.',
          status: 'deployment-dependent',
          sampleSlug: 'in-out-traffic',
        },
        {
          id: 'passers-by',
          name: 'Passers-by',
          definition: 'Aggregate people observed passing a configured storefront or approach line.',
          unit: 'People per approach line and period',
          decision: 'Review storefront exposure alongside entry counts.',
          prerequisite: 'A camera view that separates approach traffic from the store boundary.',
          limitation: 'Passer-by and visitor denominators require the same period and compatible views.',
          status: 'assessment-required',
          sampleSlug: 'passers-by',
        },
        {
          id: 'entering-rate',
          name: 'Entering rate',
          definition: 'A ratio of configured entries to compatible passers-by observations.',
          unit: 'Entries divided by passers-by, expressed as a percentage',
          decision: 'Review changes in storefront capture without implying sales conversion.',
          prerequisite: 'Approved passer-by and entry boundaries with aligned time windows.',
          limitation: 'This is not a POS conversion rate; a denominator and integration review are required.',
          status: 'assessment-required',
          sampleSlug: 'entering-rate',
        },
        {
          id: 'staff-exclusion',
          name: 'Staff exclusion',
          definition: 'Optional configured handling for known staff paths or schedules.',
          unit: 'Aggregate count with an agreed inclusion rule',
          decision: 'Keep visitor review separate from staff movement where the scene supports it.',
          prerequisite: 'A documented staff path, schedule, or signal that can be validated.',
          limitation: 'No universal staff classification is assumed; exceptions need site review.',
          status: 'assessment-required',
          sampleSlug: 'visitor-traffic',
        },
      ],
    },
    {
      id: 'flow-zones',
      title: 'Flow & Zones',
      question: 'Where do visitors move and spend time?',
      capabilities: [
        {
          id: 'dwell-time',
          name: 'Dwell time',
          definition: 'Time associated with an aggregate visit or configured zone observation.',
          unit: 'Minutes per visit or zone observation',
          decision: 'Review which configured areas hold attention over a selected period.',
          prerequisite: 'Stable zone geometry, sufficient scene coverage, and calibration.',
          limitation: 'Occlusion, re-entry, and short paths can change the measured interval.',
          status: 'deployment-dependent',
          sampleSlug: 'dwell-time',
        },
        {
          id: 'heatmap',
          name: 'Heatmap',
          definition: 'An aggregate density or movement layer over an approved floor or camera view.',
          unit: 'Relative density by zone and time window',
          decision: 'Review busy and underused areas before layout changes.',
          prerequisite: 'Approved floor plan or scene geometry and a calibrated camera view.',
          limitation: 'A heatmap is not a person-level replay and is not proof of a business outcome.',
          status: 'deployment-dependent',
          sampleSlug: 'heatmap',
        },
        {
          id: 'zones',
          name: 'Zone analytics',
          definition: 'Aggregate counts or time measures scoped to configured store areas.',
          unit: 'People or minutes per configured zone and period',
          decision: 'Compare areas using the same configuration and reporting window.',
          prerequisite: 'A reviewed zone map, camera coverage, and naming convention.',
          limitation: 'Zone comparisons are not valid when geometry or camera setup changes without review.',
          status: 'deployment-dependent',
          sampleSlug: 'heatmap',
        },
        {
          id: 'routes-journey',
          name: 'Routes / journey',
          definition: 'Aggregate transitions between configured areas in a supported scene.',
          unit: 'Transitions between zones per period',
          decision: 'Review common movement sequences and path changes.',
          prerequisite: 'Overlapping coverage, stable calibration, and approved zone topology.',
          limitation: 'Route output is not an identity trail; unsupported occlusion can reduce coverage.',
          status: 'assessment-required',
          sampleSlug: 'in-store-routes',
        },
        {
          id: 'group-behavior',
          name: 'Group behavior',
          definition: 'Optional aggregate grouping signal for compatible scenes.',
          unit: 'Group observations and estimated group size per period',
          decision: 'Review whether space and service patterns differ for groups.',
          prerequisite: 'Scene-specific validation and an approved aggregate definition.',
          limitation: 'Grouping is an estimate and must not be treated as an identity or demographic record.',
          status: 'assessment-required',
          sampleSlug: 'group-rate',
        },
      ],
    },
    {
      id: 'operations',
      title: 'Operations',
      question: 'Where is capacity or service pressure changing?',
      capabilities: [
        {
          id: 'occupancy',
          name: 'Occupancy',
          definition: 'Aggregate people present within a configured store or zone boundary.',
          unit: 'People present per boundary and timestamp',
          decision: 'Review density and capacity pressure in operating periods.',
          prerequisite: 'Defined boundaries, entry/exit handling, and validated camera coverage.',
          limitation: 'Occupancy is not a safety certification or a universal real-time guarantee.',
          status: 'deployment-dependent',
          sampleSlug: 'occupancy',
        },
        {
          id: 'queue-wait',
          name: 'Queue / wait',
          definition: 'Aggregate queue length or estimated wait in a configured service area.',
          unit: 'People in queue and estimated minutes',
          decision: 'Review service pressure and when an operational response may be needed.',
          prerequisite: 'A visible queue shape, service boundary, and agreed threshold.',
          limitation: 'Wait estimates are scene-dependent and require representative validation.',
          status: 'assessment-required',
          sampleSlug: 'queuing',
        },
        {
          id: 'service-efficiency',
          name: 'Service review',
          definition: 'A configured comparison of visitor demand and service activity signals.',
          unit: 'Configured ratio or interval per service period',
          decision: 'Review staffing or service windows without promising savings.',
          prerequisite: 'Approved service signal, scope, and any staff or POS integration boundary.',
          limitation: 'No staffing recommendation or efficiency score is universal without site data.',
          status: 'assessment-required',
          sampleSlug: 'service-efficiency',
        },
        {
          id: 'alerts',
          name: 'Alerts',
          definition: 'A notification rule tied to a configured metric, threshold, and recipient.',
          unit: 'Rule event per configured threshold and period',
          decision: 'Bring an agreed exception into an operator review workflow.',
          prerequisite: 'A named metric, threshold owner, delivery path, and escalation rule.',
          limitation: 'Alerts do not replace an operational response plan or guarantee delivery timing.',
          status: 'assessment-required',
          sampleSlug: 'occupancy',
        },
      ],
    },
  ],
  mall: [],
}

const mallCapabilityIds: Record<FeatureGroup['id'], Set<string>> = {
  traffic: new Set(['visitor-traffic', 'in-out-traffic']),
  'flow-zones': new Set(['dwell-time', 'heatmap', 'zones', 'routes-journey']),
  operations: new Set(['occupancy', 'queue-wait', 'alerts']),
}

const mallCapabilityOverrides: Record<string, Partial<Capability>> = {
  'visitor-traffic': {
    name: 'Mall entry traffic',
    definition: 'Aggregate people crossing a configured outer mall entry gate during a reporting period.',
    unit: 'People per outer gate, direction, and period',
    decision: 'Review arrival patterns across classified mall entrances.',
    prerequisite: 'Approved outer-gate classification, compatible coverage, and representative validation.',
    limitation: 'Internal floor or tenant movement must not become a new mall visit.',
    contextNote: 'Mall traffic begins at classified outer entry gates, not every internal crossing.',
  },
  'in-out-traffic': {
    name: 'Gate direction',
    definition: 'Separate aggregate entry and exit observations at an approved outer or internal gate.',
    unit: 'Entries and exits per classified gate and period',
    decision: 'Compare directional pressure while retaining the gate type.',
    prerequisite: 'A documented gate class, crossing line, camera view, and aligned period.',
    limitation: 'Outer entry gates and internal gates use different visit semantics.',
    contextNote: 'Outer entry gates and internal gates stay separate; internal movement is not a new mall visit.',
  },
  'dwell-time': {
    definition: 'Aggregate time associated with an approved floor, common-area, or tenant-zone observation.',
    unit: 'Minutes per configured zone observation',
    decision: 'Review how attention changes across comparable mall areas.',
    prerequisite: 'Approved topology, stable coverage, zone ownership, and calibration.',
    limitation: 'Dwell is not total footfall, occupancy, or a person-level identity trail.',
    contextNote: 'Floor, common-area, and tenant-zone dwell require an approved topology and reporting scope.',
  },
  heatmap: {
    definition: 'An aggregate density or movement layer over an approved mall floor or zone view.',
    unit: 'Relative density per floor or zone and period',
    decision: 'Review busy and underused common areas before operational changes.',
    prerequisite: 'Approved floor plan, zone boundaries, camera geometry, and calibration.',
    limitation: 'A heatmap is not a visitor replay or evidence of tenant performance.',
    contextNote: 'Floor, common-area, and tenant-zone output requires an approved topology and reporting scope.',
  },
  zones: {
    definition: 'Aggregate counts or time scoped to approved floor, common-area, or tenant-zone boundaries.',
    unit: 'People or minutes per configured zone and period',
    decision: 'Compare areas that share compatible configuration and reporting windows.',
    prerequisite: 'Named zone ownership, floor plan, coverage, and consistent geometry.',
    limitation: 'Tenant or floor comparisons are invalid when their boundaries or inputs are not comparable.',
    contextNote: 'Zone ownership and comparison rules are confirmed for each property.',
  },
  'routes-journey': {
    definition: 'Aggregate transitions between configured gates, floors, or zones where coverage supports them.',
    unit: 'Transitions between approved boundaries per period',
    decision: 'Review common movement sequences across the property.',
    prerequisite: 'Approved topology, overlapping coverage, calibration, and entitlement.',
    limitation: 'Route output is not an identity trail, and gaps in coverage reduce continuity.',
    contextNote: 'Journey scope depends on approved topology and continuous compatible coverage.',
  },
  occupancy: {
    definition: 'Aggregate people present within a configured floor, common-area, or tenant boundary.',
    unit: 'People present per boundary and timestamp',
    decision: 'Review capacity pressure and operating windows.',
    prerequisite: 'Configured entry/exit handling, topology, and validated coverage.',
    limitation: 'Occupancy, total footfall, dwell, and unique visitors remain different measurements.',
    contextNote: 'Occupancy, total footfall, dwell, and unique visitors use different denominators.',
  },
  'queue-wait': {
    definition: 'Aggregate queue length or estimated wait in an approved mall service or entry area.',
    unit: 'People in queue and estimated minutes',
    decision: 'Review pressure at a named service point or access area.',
    prerequisite: 'Visible queue geometry, service boundary, threshold, and representative validation.',
    limitation: 'Wait estimates are scene-dependent and do not guarantee service outcomes.',
    contextNote: 'Queue scope is tied to a named service point and its operating workflow.',
  },
  alerts: {
    definition: 'A notification rule tied to a configured mall metric, threshold, recipient, and escalation path.',
    unit: 'Rule event per configured threshold and period',
    decision: 'Bring an agreed exception into a property operations workflow.',
    prerequisite: 'A named metric owner, threshold, delivery path, and response rule.',
    limitation: 'Alerts do not replace an operating response plan or guarantee delivery timing.',
    contextNote: 'Alert availability and delivery behavior are confirmed during assessment.',
  },
}

capabilityGroups.mall = capabilityGroups.retail.map((group) => ({
  ...group,
  capabilities: group.capabilities
    .filter((capability) => mallCapabilityIds[group.id].has(capability.id))
    .map((capability) => ({
    ...capability,
    ...mallCapabilityOverrides[capability.id],
  })),
}))

const copy: Record<'en' | 'id', Record<SolutionKind, SolutionCopy>> = {
  en: {
    retail: {
      kind: 'retail',
      eyebrow: 'Retail Intelligence',
      title: 'Make store traffic and movement easier to review.',
      lead: 'SmartCounter turns compatible camera or video inputs into defined aggregate signals for retail operations. Start with the entrance, then review configured zones and operating periods with the limits visible.',
      audienceTitle: 'For retail operations teams',
      audienceText: 'Store managers, operations leads, merchandising, marketing, and BI teams can use a shared measurement vocabulary without turning a sample into a promise.',
      jobTitle: 'The retail operating question',
      jobText: 'Which entrances and zones are attracting visits, and what should the team review next about layout, service windows, or campaign timing?',
      workflowTitle: 'A store workflow, from input to review',
      workflow: [
        { title: 'Entrance and traffic', text: 'Count configured entries and exits against a named boundary and reporting period.' },
        { title: 'Flow and zones', text: 'Review dwell, density, or movement across approved store areas.' },
        { title: 'Operational review', text: 'Bring occupancy, queue, or service signals into a review workflow when the deployment supports them.' },
      ],
      metricsTitle: 'What the measurement means',
      metrics: [
        {
          label: 'Traffic',
          definition: 'Aggregate entries, exits, or approach observations at a configured boundary.',
          unit: 'People per boundary and period',
          decision: 'Review demand by opening hours, day, or location.',
          prerequisite: 'Camera placement, stream stability, and a reviewed boundary.',
          limitation: 'Not a sales, revenue, or universal conversion measure.',
          status: 'deployment-dependent',
        },
        {
          label: 'Flow and dwell',
          definition: 'Aggregate movement or time within configured store zones.',
          unit: 'Transitions or minutes per zone and period',
          decision: 'Review layout and product-area attention.',
          prerequisite: 'Floor/zone geometry and calibration.',
          limitation: 'Occlusion and scene changes affect coverage.',
          status: 'deployment-dependent',
        },
        {
          label: 'Entering rate',
          definition: 'Entries divided by compatible passer-by observations.',
          unit: 'Percentage with a named denominator',
          decision: 'Review storefront capture, not checkout conversion.',
          prerequisite: 'Aligned approach and entrance views.',
          limitation: 'POS or sales linkage is a separate, assessment-dependent integration.',
          status: 'assessment-required',
        },
      ],
      requirementsTitle: 'What a site-fit assessment checks',
      requirements: [
        'Compatible CCTV/video stream, camera view, lighting, and mounting context.',
        'A representative manual comparison plan for the selected entrance or zone.',
        'Network, power, processing, calibration, and handover responsibilities.',
        'Optional POS or sales integration only after denominator, ownership, and entitlement review.',
      ],
      limitationsTitle: 'Boundaries to keep visible',
      limitations: [
        'Metrics depend on camera angle, occlusion, lighting, scene changes, and calibration.',
        'Multi-location comparison requires consistent configuration and an approved scope.',
        'Aggregate analytics does not identify people or infer revenue, staffing improvement, or campaign lift.',
        'There is no universal accuracy figure; validation is representative and deployment-specific.',
      ],
      deploymentTitle: 'Deployment summary',
      deploymentText: 'The assessment covers camera and stream fit, scene design, calibration, a representative manual validation, rollout, and handover. Exact topology and processing responsibilities are confirmed per deployment.',
      privacyTitle: 'Privacy summary',
      privacyText: 'The public contract is aggregate analytics from approved inputs. Processing location, fields retained, access, retention, and deletion are deployment-specific and must be confirmed before production use.',
      evidenceTitle: 'Evidence status',
      evidenceText: 'No permissioned retail case or real product screenshot is published in this build. Any interface shown on this page is an Illustrative sample, not customer or live deployment evidence.',
      ctaLabel: 'Request a site-fit demo',
      ctaNote: 'Bring a representative store layout, camera context, and the decision you want to review.',
      secondaryLabel: 'Explore capabilities',
    },
    mall: {
      kind: 'mall',
      eyebrow: 'Mall Intelligence',
      title: 'Give mall teams a shared view of gates, floors, and zones.',
      lead: 'SmartCounter helps mall teams frame entrances, internal movement, and occupancy as separate aggregate measurements. The useful next step is a topology and site-fit review—not a promise that every gate or tenant view is already enabled.',
      audienceTitle: 'For mall operations and commercial review',
      audienceText: 'Mall GMs, operations, leasing, tenant relations, marketing, and BI teams can review a common spatial vocabulary while keeping ownership and denominators explicit.',
      jobTitle: 'The mall operating question',
      jobText: 'Which gates and zones are busy, how does movement change by floor, and what should operations or tenant teams review next?',
      workflowTitle: 'A mall workflow, from topology to review',
      workflow: [
        { title: 'Classify entry gates', text: 'Separate outer entry gates from internal floor or tenant gates so internal movement does not become a new mall visit.' },
        { title: 'Map floors and zones', text: 'Review approved common-area, floor, and tenant-area boundaries with the required camera and floor-plan context.' },
        { title: 'Review operations', text: 'Use occupancy, dwell, flow, or queue signals as inputs to operational and leasing conversations—not as promised outcomes.' },
      ],
      metricsTitle: 'Mall measurements stay distinct',
      metrics: [
        {
          label: 'Gate traffic',
          definition: 'Aggregate entries and exits at a classified outer gate or internal boundary.',
          unit: 'People per gate, direction, and period',
          decision: 'Review arrival patterns and gate operations.',
          prerequisite: 'Approved gate classification and a camera view of each boundary.',
          limitation: 'An internal gate crossing must not be counted as a new mall visit.',
          status: 'deployment-dependent',
        },
        {
          label: 'Floor and zone flow',
          definition: 'Aggregate movement, dwell, or density within approved floor and zone topology.',
          unit: 'People, transitions, or minutes per zone and period',
          decision: 'Review common-area and tenant-area movement.',
          prerequisite: 'Floor plans, zone ownership, calibration, and consistent coverage.',
          limitation: 'Total footfall, occupancy, dwell, and unique visitors are different measurements.',
          status: 'deployment-dependent',
        },
        {
          label: 'Occupancy',
          definition: 'Aggregate people present within a configured floor, common-area, or tenant boundary.',
          unit: 'People present per boundary and timestamp',
          decision: 'Review capacity pressure and operating windows.',
          prerequisite: 'Configured entry/exit handling and validated coverage.',
          limitation: 'Basic gate/floor counts and GPU-dependent behavior analytics have different prerequisites.',
          status: 'assessment-required',
        },
      ],
      requirementsTitle: 'What a mall site-fit assessment checks',
      requirements: [
        'Outer and internal gate classification, floor plans, zone ownership, and tenant/common-area scope.',
        'Camera, sensor, network, processing/GPU, lighting, and calibration requirements by workflow.',
        'A representative manual validation for gate, floor, and selected zone measurements.',
        'Rollout, data access, freshness, retention, support, and entitlement boundaries for each property.',
      ],
      limitationsTitle: 'Boundaries to keep visible',
      limitations: [
        'Internal floor movement must not become a second mall visit; denominators remain explicit.',
        'Multi-floor or tenant reporting requires approved topology, configuration, and entitlement.',
        'Occupancy, campaign, leasing, and tenant language describes review inputs—not guaranteed outcomes.',
        'There is no universal compatibility or accuracy claim; scene validation is required.',
      ],
      deploymentTitle: 'Deployment summary',
      deploymentText: 'The assessment maps gates, floors, zones, camera and network fit, processing/GPU needs, calibration, representative validation, rollout, freshness, and handover. The resulting topology is specific to each property.',
      privacyTitle: 'Privacy summary',
      privacyText: 'The public contract is aggregate output from approved camera/video inputs. Property scope, processing location, retention, access, and deletion are confirmed with the deployment and privacy owners.',
      evidenceTitle: 'Evidence status',
      evidenceText: 'No permissioned mall case or real floor/zone screenshot is published in this build. Any interface shown on this page is an Illustrative sample, not customer or live property evidence.',
      ctaLabel: 'Request a site-fit demo',
      ctaNote: 'Bring a property topology, gate/floor context, current camera setup, and the operating question to review.',
      secondaryLabel: 'Explore capabilities',
    },
  },
  id: {
    retail: {
      kind: 'retail',
      eyebrow: 'Retail Intelligence',
      title: 'Buat lalu lintas dan pergerakan toko lebih mudah ditinjau.',
      lead: 'SmartCounter mengubah input kamera atau video yang kompatibel menjadi sinyal agregat terdefinisi untuk operasional retail. Mulai dari pintu masuk, lalu tinjau zona dan periode operasi dengan batasan yang terlihat.',
      audienceTitle: 'Untuk tim operasional retail',
      audienceText: 'Manajer toko, pimpinan operasional, merchandising, marketing, dan BI dapat memakai kosakata pengukuran yang sama tanpa mengubah sampel menjadi janji.',
      jobTitle: 'Pertanyaan operasional retail',
      jobText: 'Pintu masuk dan zona mana yang menarik kunjungan, lalu apa yang perlu ditinjau terkait tata letak, jam layanan, atau waktu kampanye?',
      workflowTitle: 'Alur toko, dari input ke tinjauan',
      workflow: [
        { title: 'Pintu masuk dan lalu lintas', text: 'Hitung entri dan keluar pada batas serta periode pelaporan yang ditentukan.' },
        { title: 'Alur dan zona', text: 'Tinjau dwell, kepadatan, atau pergerakan di area toko yang disetujui.' },
        { title: 'Tinjauan operasional', text: 'Gunakan sinyal okupansi, antrean, atau layanan bila deployment mendukungnya.' },
      ],
      metricsTitle: 'Arti setiap pengukuran',
      metrics: [
        { label: 'Lalu lintas', definition: 'Observasi agregat entri, keluar, atau orang yang melintas pada batas terkonfigurasi.', unit: 'Orang per batas dan periode', decision: 'Meninjau pola permintaan per jam, hari, atau lokasi.', prerequisite: 'Posisi kamera, kestabilan stream, dan batas yang ditinjau.', limitation: 'Bukan ukuran penjualan, pendapatan, atau konversi universal.', status: 'deployment-dependent' },
        { label: 'Alur dan dwell', definition: 'Pergerakan atau waktu agregat di zona toko terkonfigurasi.', unit: 'Transisi atau menit per zona dan periode', decision: 'Meninjau tata letak dan perhatian area produk.', prerequisite: 'Geometri lantai/zona dan kalibrasi.', limitation: 'Occlusion dan perubahan scene memengaruhi cakupan.', status: 'deployment-dependent' },
        { label: 'Entering rate', definition: 'Entri dibagi observasi orang yang melintas dengan denominator terdefinisi.', unit: 'Persentase dengan denominator yang disebutkan', decision: 'Meninjau daya tangkap storefront, bukan konversi kasir.', prerequisite: 'Tampilan pendekatan dan pintu masuk yang selaras.', limitation: 'Koneksi POS atau penjualan adalah integrasi terpisah yang perlu assessment.', status: 'assessment-required' },
      ],
      requirementsTitle: 'Yang dicek saat assessment site-fit',
      requirements: ['Stream CCTV/video kompatibel, tampilan kamera, pencahayaan, dan konteks pemasangan.', 'Rencana perbandingan manual yang representatif untuk pintu masuk atau zona.', 'Network, daya, pemrosesan, kalibrasi, dan tanggung jawab serah terima.', 'Integrasi POS/penjualan hanya setelah denominator, kepemilikan data, dan entitlement ditinjau.'],
      limitationsTitle: 'Batasan yang harus terlihat',
      limitations: ['Metrik bergantung pada sudut kamera, occlusion, pencahayaan, perubahan scene, dan kalibrasi.', 'Perbandingan multi-lokasi memerlukan konfigurasi yang konsisten dan scope yang disetujui.', 'Analitik agregat tidak mengidentifikasi orang atau menyimpulkan pendapatan, perbaikan staffing, maupun dampak kampanye.', 'Tidak ada angka akurasi universal; validasi bersifat representatif dan spesifik deployment.'],
      deploymentTitle: 'Ringkasan deployment',
      deploymentText: 'Assessment mencakup kecocokan kamera dan stream, desain scene, kalibrasi, validasi manual representatif, rollout, dan serah terima. Topologi serta tanggung jawab pemrosesan dikonfirmasi per deployment.',
      privacyTitle: 'Ringkasan privasi',
      privacyText: 'Kontrak publiknya adalah analitik agregat dari input yang disetujui. Lokasi pemrosesan, field yang disimpan, akses, retensi, dan penghapusan bersifat spesifik deployment dan harus dikonfirmasi sebelum produksi.',
      evidenceTitle: 'Status bukti',
      evidenceText: 'Belum ada kasus retail berizin atau screenshot produk nyata yang dipublikasikan di build ini. Antarmuka di halaman ini adalah Illustrative sample, bukan bukti pelanggan atau deployment live.',
      ctaLabel: 'Minta demo site-fit',
      ctaNote: 'Bawa layout toko, konteks kamera, dan keputusan yang ingin ditinjau.',
      secondaryLabel: 'Lihat kapabilitas',
    },
    mall: {
      kind: 'mall',
      eyebrow: 'Mall Intelligence',
      title: 'Beri tim mall pandangan bersama atas gate, lantai, dan zona.',
      lead: 'SmartCounter membantu tim mall memisahkan pintu masuk, pergerakan internal, dan okupansi sebagai pengukuran agregat. Langkah berikutnya adalah tinjauan topologi dan site-fit—bukan janji bahwa setiap gate atau tenant sudah aktif.',
      audienceTitle: 'Untuk operasional mall dan tinjauan komersial',
      audienceText: 'GM mall, operasional, leasing, tenant relation, marketing, dan BI dapat meninjau kosakata ruang yang sama dengan kepemilikan dan denominator yang eksplisit.',
      jobTitle: 'Pertanyaan operasional mall',
      jobText: 'Gate dan zona mana yang ramai, bagaimana pergerakan berubah antar-lantai, lalu apa yang perlu ditinjau oleh operasional atau tenant?',
      workflowTitle: 'Alur mall, dari topologi ke tinjauan',
      workflow: [
        { title: 'Klasifikasikan gate masuk', text: 'Pisahkan gate luar dari gate lantai atau tenant agar pergerakan internal tidak menjadi kunjungan mall baru.' },
        { title: 'Petakan lantai dan zona', text: 'Tinjau batas common area, lantai, dan tenant yang disetujui dengan konteks kamera dan floor plan.' },
        { title: 'Tinjauan operasional', text: 'Gunakan sinyal okupansi, dwell, alur, atau antrean sebagai input diskusi—bukan outcome yang dijanjikan.' },
      ],
      metricsTitle: 'Pengukuran mall tetap terpisah',
      metrics: [
        { label: 'Lalu lintas gate', definition: 'Entri dan keluar agregat pada gate luar atau batas internal yang diklasifikasikan.', unit: 'Orang per gate, arah, dan periode', decision: 'Meninjau pola kedatangan dan operasi gate.', prerequisite: 'Klasifikasi gate dan tampilan kamera pada setiap batas.', limitation: 'Perlintasan gate internal tidak boleh dihitung sebagai kunjungan mall baru.', status: 'deployment-dependent' },
        { label: 'Alur lantai dan zona', definition: 'Pergerakan, dwell, atau kepadatan agregat dalam topologi lantai/zona yang disetujui.', unit: 'Orang, transisi, atau menit per zona dan periode', decision: 'Meninjau pergerakan common area dan tenant.', prerequisite: 'Floor plan, pemilik zona, kalibrasi, dan cakupan konsisten.', limitation: 'Total footfall, occupancy, dwell, dan unique visitor adalah pengukuran berbeda.', status: 'deployment-dependent' },
        { label: 'Occupancy', definition: 'Orang agregat yang berada dalam batas lantai, common area, atau tenant.', unit: 'Orang yang hadir per batas dan timestamp', decision: 'Meninjau tekanan kapasitas dan jam operasi.', prerequisite: 'Penanganan entri/keluar dan cakupan tervalidasi.', limitation: 'Hitungan gate/lantai dasar dan analitik perilaku yang bergantung GPU memiliki prasyarat berbeda.', status: 'assessment-required' },
      ],
      requirementsTitle: 'Yang dicek saat assessment site-fit mall',
      requirements: ['Klasifikasi gate luar/internal, floor plan, kepemilikan zona, serta scope tenant/common area.', 'Kebutuhan kamera, sensor, network, pemrosesan/GPU, pencahayaan, dan kalibrasi per alur.', 'Validasi manual representatif untuk gate, lantai, dan zona terpilih.', 'Rollout, akses data, freshness, retensi, dukungan, dan entitlement tiap properti.'],
      limitationsTitle: 'Batasan yang harus terlihat',
      limitations: ['Pergerakan internal antar-lantai tidak boleh menjadi kunjungan mall kedua; denominator harus eksplisit.', 'Pelaporan multi-lantai atau tenant memerlukan topologi, konfigurasi, dan entitlement yang disetujui.', 'Bahasa occupancy, kampanye, leasing, dan tenant adalah input tinjauan—bukan outcome yang dijamin.', 'Tidak ada klaim kompatibilitas atau akurasi universal; validasi scene tetap diperlukan.'],
      deploymentTitle: 'Ringkasan deployment',
      deploymentText: 'Assessment memetakan gate, lantai, zona, kecocokan kamera/network, kebutuhan pemrosesan/GPU, kalibrasi, validasi representatif, rollout, freshness, dan serah terima. Topologi dihasilkan spesifik untuk tiap properti.',
      privacyTitle: 'Ringkasan privasi',
      privacyText: 'Kontrak publiknya adalah output agregat dari input kamera/video yang disetujui. Scope properti, lokasi pemrosesan, retensi, akses, dan penghapusan dikonfirmasi bersama owner deployment dan privasi.',
      evidenceTitle: 'Status bukti',
      evidenceText: 'Belum ada kasus mall berizin atau screenshot lantai/zona nyata yang dipublikasikan di build ini. Antarmuka di halaman ini adalah Illustrative sample, bukan bukti pelanggan atau properti live.',
      ctaLabel: 'Minta demo site-fit',
      ctaNote: 'Bawa topologi properti, konteks gate/lantai, setup kamera, dan pertanyaan operasional yang ingin ditinjau.',
      secondaryLabel: 'Lihat kapabilitas',
    },
  },
}

export function getSolutionCopy(locale: string, kind: SolutionKind): SolutionCopy {
  return copy[locale === 'id' ? 'id' : 'en'][kind]
}

export function getFeatureGroups(locale: string, kind: SolutionKind): FeatureGroup[] {
  const isId = locale === 'id'
  return capabilityGroups[kind].map((group) => ({
    ...group,
    title: isId
      ? ({ traffic: 'Lalu Lintas', 'flow-zones': 'Alur & Zona', operations: 'Operasional' }[group.id] || group.title)
      : group.title,
    question: (
      kind === 'mall'
        ? isId
          ? {
              traffic: 'Berapa banyak orang yang melintasi gate mall yang diklasifikasikan, dan kapan?',
              'flow-zones': 'Bagaimana pergerakan berubah antar-lantai dan zona?',
              operations: 'Di mana occupancy atau tekanan layanan berubah di properti?',
            }
          : {
              traffic: 'How many people cross classified mall gates, and when?',
              'flow-zones': 'How does movement change across floors and zones?',
              operations: 'Where is occupancy or service pressure changing on the property?',
            }
        : isId
          ? {
              traffic: 'Berapa banyak orang yang mendekat, masuk, atau keluar, dan kapan?',
              'flow-zones': 'Di mana pengunjung bergerak dan menghabiskan waktu?',
              operations: 'Di mana tekanan kapasitas atau layanan berubah?',
            }
          : {
              traffic: 'How many people approach, enter, or exit, and when?',
              'flow-zones': 'Where do visitors move and spend time?',
              operations: 'Where is capacity or service pressure changing?',
            }
    )[group.id] || group.question,
    capabilities: group.capabilities.map((capability) => ({
      ...capability,
      ...(isId
        ? kind === 'mall'
          ? translatedMallDetails[capability.id]
          : {
              name: translateCapabilityName(capability.id),
              definition: translateCapabilityDefinition(capability.id),
              decision: translateCapabilityDecision(capability.id),
              prerequisite: translateCapabilityPrerequisite(capability.id),
              limitation: translateCapabilityLimitation(capability.id),
              unit: translateCapabilityUnit(capability.id),
              contextNote: translateCapabilityContext(capability.contextNote),
            }
        : {}),
    })),
  }))
}

const translatedNames: Record<string, string> = {
  'visitor-traffic': 'Lalu lintas pengunjung',
  'in-out-traffic': 'Lalu lintas masuk/keluar',
  'passers-by': 'Orang yang melintas',
  'entering-rate': 'Entering rate',
  'staff-exclusion': 'Pengecualian staf',
  'dwell-time': 'Dwell time',
  heatmap: 'Heatmap',
  zones: 'Analitik zona',
  'routes-journey': 'Rute / journey',
  'group-behavior': 'Perilaku grup',
  occupancy: 'Occupancy',
  'queue-wait': 'Antrean / waktu tunggu',
  'service-efficiency': 'Tinjauan layanan',
  alerts: 'Alert',
}

const translatedDetails: Record<string, Partial<Pick<Capability, 'definition' | 'decision' | 'prerequisite' | 'limitation' | 'unit'>>> = {
  'visitor-traffic': { definition: 'Orang agregat yang terdeteksi pada pintu masuk dan periode pelaporan yang dikonfigurasi.', unit: 'Orang per pintu dan periode', decision: 'Meninjau pola lalu lintas sebelum keputusan staffing, layout, atau kampanye.', prerequisite: 'Tampilan kamera kompatibel, stream stabil, dan garis pintu masuk yang ditinjau.', limitation: 'Hitungan dipengaruhi sudut kamera, occlusion, pencahayaan, dan validasi representatif.' },
  'in-out-traffic': { definition: 'Observasi entri dan keluar agregat pada batas yang dikonfigurasi.', unit: 'Entri dan keluar per batas dan periode', decision: 'Membandingkan pola kedatangan dan kepulangan saat tinjauan operasi.', prerequisite: 'Batas yang jelas dengan kamera yang melihat perlintasan.', limitation: 'Pintu internal tidak otomatis menjadi batas kunjungan toko.' },
  'passers-by': { definition: 'Orang agregat yang teramati melintas pada garis pendekatan atau storefront.', unit: 'Orang per garis pendekatan dan periode', decision: 'Meninjau exposure storefront bersama hitungan entri.', prerequisite: 'Tampilan kamera yang memisahkan pendekatan dari batas toko.', limitation: 'Denominator passer-by dan visitor harus memakai periode dan view yang kompatibel.' },
  'entering-rate': { definition: 'Rasio entri terhadap observasi passer-by yang kompatibel.', unit: 'Entri dibagi passer-by, dalam persentase', decision: 'Meninjau perubahan daya tangkap storefront tanpa menyimpulkan konversi penjualan.', prerequisite: 'Batas pendekatan dan pintu masuk dengan time window selaras.', limitation: 'Bukan rasio POS; denominator dan integrasi perlu ditinjau.' },
  'staff-exclusion': { definition: 'Penanganan opsional untuk jalur atau jadwal staf yang diketahui.', unit: 'Hitungan agregat dengan aturan inklusi yang disepakati', decision: 'Memisahkan tinjauan pengunjung dari pergerakan staf jika scene mendukung.', prerequisite: 'Jalur, jadwal, atau sinyal staf yang terdokumentasi dan tervalidasi.', limitation: 'Tidak ada klasifikasi staf universal; pengecualian perlu review site.' },
  'dwell-time': { definition: 'Waktu yang terkait dengan kunjungan agregat atau observasi zona.', unit: 'Menit per kunjungan atau observasi zona', decision: 'Meninjau area yang menahan perhatian selama periode terpilih.', prerequisite: 'Geometri zona stabil, cakupan cukup, dan kalibrasi.', limitation: 'Occlusion, re-entry, dan jalur pendek dapat mengubah interval.' },
  heatmap: { definition: 'Lapisan kepadatan atau pergerakan agregat di atas floor plan atau view kamera.', unit: 'Kepadatan relatif per zona dan periode', decision: 'Meninjau area ramai dan kurang terpakai sebelum perubahan layout.', prerequisite: 'Floor plan/geometri scene dan kamera yang terkalibrasi.', limitation: 'Heatmap bukan replay level orang dan bukan bukti outcome bisnis.' },
  zones: { definition: 'Hitungan atau waktu agregat yang dibatasi area toko terkonfigurasi.', unit: 'Orang atau menit per zona dan periode', decision: 'Membandingkan area dengan konfigurasi dan window yang sama.', prerequisite: 'Peta zona, cakupan kamera, dan konvensi penamaan yang ditinjau.', limitation: 'Perbandingan tidak valid jika geometri atau setup berubah tanpa review.' },
  'routes-journey': { definition: 'Transisi agregat antarzona pada scene yang didukung.', unit: 'Transisi antarzona per periode', decision: 'Meninjau urutan pergerakan umum dan perubahan jalur.', prerequisite: 'Coverage tumpang tindih, kalibrasi stabil, dan topologi zona disetujui.', limitation: 'Output rute bukan jejak identitas; occlusion dapat mengurangi cakupan.' },
  'group-behavior': { definition: 'Sinyal grouping agregat opsional pada scene yang kompatibel.', unit: 'Observasi grup dan estimasi ukuran grup per periode', decision: 'Meninjau apakah pola ruang dan layanan berbeda untuk grup.', prerequisite: 'Validasi spesifik scene dan definisi agregat yang disetujui.', limitation: 'Grouping adalah estimasi, bukan catatan identitas atau demografi.' },
  occupancy: { definition: 'Orang agregat yang berada di dalam batas toko atau zona.', unit: 'Orang yang hadir per batas dan timestamp', decision: 'Meninjau kepadatan dan tekanan kapasitas.', prerequisite: 'Batas, penanganan masuk/keluar, dan cakupan kamera tervalidasi.', limitation: 'Occupancy bukan sertifikasi keselamatan atau jaminan real-time universal.' },
  'queue-wait': { definition: 'Panjang antrean agregat atau estimasi tunggu di area layanan.', unit: 'Orang dalam antrean dan estimasi menit', decision: 'Meninjau tekanan layanan dan kapan respons operasi mungkin diperlukan.', prerequisite: 'Bentuk antrean terlihat, batas layanan, dan threshold yang disepakati.', limitation: 'Estimasi tunggu bergantung scene dan perlu validasi representatif.' },
  'service-efficiency': { definition: 'Perbandingan terkonfigurasi antara demand pengunjung dan sinyal aktivitas layanan.', unit: 'Rasio atau interval terkonfigurasi per periode layanan', decision: 'Meninjau staffing atau jam layanan tanpa menjanjikan penghematan.', prerequisite: 'Sinyal layanan, scope, dan batas integrasi staf/POS disetujui.', limitation: 'Rekomendasi staffing atau skor efisiensi tidak universal tanpa data site.' },
  alerts: { definition: 'Aturan notifikasi yang terkait metrik, threshold, dan penerima yang dikonfigurasi.', unit: 'Event aturan per threshold dan periode', decision: 'Membawa pengecualian ke alur tinjauan operator.', prerequisite: 'Metrik, owner threshold, jalur delivery, dan eskalasi.', limitation: 'Alert tidak menggantikan rencana respons atau menjamin waktu delivery.' },
}

const translatedMallDetails: Record<string, Partial<Capability>> = {
  'visitor-traffic': { name: 'Lalu lintas masuk mall', definition: 'Orang agregat yang melintasi gate luar mall terkonfigurasi selama periode pelaporan.', unit: 'Orang per gate luar, arah, dan periode', decision: 'Meninjau pola kedatangan pada pintu masuk mall yang diklasifikasikan.', prerequisite: 'Klasifikasi gate luar, cakupan kompatibel, dan validasi representatif.', limitation: 'Pergerakan internal lantai atau tenant tidak boleh menjadi kunjungan mall baru.', contextNote: 'Lalu lintas mall dimulai dari gate luar yang diklasifikasikan, bukan setiap perlintasan internal.' },
  'in-out-traffic': { name: 'Arah gate', definition: 'Observasi agregat masuk dan keluar pada gate luar atau internal yang disetujui.', unit: 'Entri dan keluar per gate terklasifikasi dan periode', decision: 'Membandingkan tekanan arah sambil mempertahankan tipe gate.', prerequisite: 'Kelas gate, garis lintasan, tampilan kamera, dan periode yang terdokumentasi.', limitation: 'Gate luar dan gate internal memiliki semantik kunjungan berbeda.', contextNote: 'Gate luar dan internal tetap terpisah; pergerakan internal bukan kunjungan mall baru.' },
  'dwell-time': { name: 'Dwell time', definition: 'Waktu agregat yang terkait dengan observasi lantai, common area, atau zona tenant yang disetujui.', unit: 'Menit per observasi zona terkonfigurasi', decision: 'Meninjau perubahan perhatian pada area mall yang dapat dibandingkan.', prerequisite: 'Topologi, cakupan stabil, pemilik zona, dan kalibrasi yang disetujui.', limitation: 'Dwell bukan total footfall, occupancy, atau jejak identitas.', contextNote: 'Dwell lantai, common area, dan zona tenant memerlukan topologi serta scope pelaporan yang disetujui.' },
  heatmap: { name: 'Heatmap', definition: 'Lapisan kepadatan atau pergerakan agregat di atas lantai atau zona mall yang disetujui.', unit: 'Kepadatan relatif per lantai atau zona dan periode', decision: 'Meninjau common area yang ramai dan kurang terpakai sebelum perubahan operasional.', prerequisite: 'Floor plan, batas zona, geometri kamera, dan kalibrasi yang disetujui.', limitation: 'Heatmap bukan replay pengunjung atau bukti performa tenant.', contextNote: 'Output lantai, common area, dan zona tenant memerlukan topologi serta scope pelaporan yang disetujui.' },
  zones: { name: 'Analitik zona', definition: 'Hitungan atau waktu agregat pada batas lantai, common area, atau zona tenant yang disetujui.', unit: 'Orang atau menit per zona terkonfigurasi dan periode', decision: 'Membandingkan area dengan konfigurasi dan periode yang kompatibel.', prerequisite: 'Pemilik zona, floor plan, cakupan, dan geometri konsisten.', limitation: 'Perbandingan tenant atau lantai tidak valid bila batas atau inputnya tidak sebanding.', contextNote: 'Kepemilikan zona dan aturan perbandingan dikonfirmasi untuk tiap properti.' },
  'routes-journey': { name: 'Rute / journey', definition: 'Transisi agregat antara gate, lantai, atau zona terkonfigurasi bila cakupan mendukung.', unit: 'Transisi antar-batas yang disetujui per periode', decision: 'Meninjau urutan pergerakan umum di dalam properti.', prerequisite: 'Topologi, cakupan tumpang tindih, kalibrasi, dan entitlement yang disetujui.', limitation: 'Output rute bukan jejak identitas; gap cakupan mengurangi kontinuitas.', contextNote: 'Scope journey bergantung pada topologi dan cakupan kompatibel yang berkesinambungan.' },
  occupancy: { name: 'Occupancy', definition: 'Orang agregat yang hadir di dalam batas lantai, common area, atau tenant.', unit: 'Orang yang hadir per batas dan timestamp', decision: 'Meninjau tekanan kapasitas dan jam operasi.', prerequisite: 'Penanganan entri/keluar, topologi, dan cakupan tervalidasi.', limitation: 'Occupancy, total footfall, dwell, dan unique visitor tetap merupakan pengukuran berbeda.', contextNote: 'Occupancy, total footfall, dwell, dan unique visitor memakai denominator berbeda.' },
  'queue-wait': { name: 'Antrean / waktu tunggu', definition: 'Panjang antrean agregat atau estimasi tunggu di area layanan atau akses mall yang disetujui.', unit: 'Orang dalam antrean dan estimasi menit', decision: 'Meninjau tekanan pada titik layanan atau akses tertentu.', prerequisite: 'Geometri antrean, batas layanan, threshold, dan validasi representatif.', limitation: 'Estimasi tunggu bergantung scene dan tidak menjamin outcome layanan.', contextNote: 'Scope antrean terkait titik layanan dan alur operasional yang disebutkan.' },
  alerts: { name: 'Alert', definition: 'Aturan notifikasi untuk metrik mall, threshold, penerima, dan jalur eskalasi yang dikonfigurasi.', unit: 'Event aturan per threshold dan periode', decision: 'Membawa pengecualian yang disepakati ke alur operasional properti.', prerequisite: 'Owner metrik, threshold, jalur pengiriman, dan aturan respons.', limitation: 'Alert tidak menggantikan rencana respons atau menjamin waktu pengiriman.', contextNote: 'Ketersediaan dan perilaku pengiriman alert dikonfirmasi saat assessment.' },
}

function translateCapabilityName(id: string) { return translatedNames[id] || id }
function translateCapabilityDefinition(id: string) { return translatedDetails[id]?.definition || '' }
function translateCapabilityDecision(id: string) { return translatedDetails[id]?.decision || '' }
function translateCapabilityPrerequisite(id: string) { return translatedDetails[id]?.prerequisite || '' }
function translateCapabilityLimitation(id: string) { return translatedDetails[id]?.limitation || '' }
function translateCapabilityUnit(id: string) { return translatedDetails[id]?.unit || '' }
function translateCapabilityContext(context?: string) {
  if (!context) return context
  if (context.startsWith('Retail scope')) return 'Scope retail dimulai dari pintu masuk toko dan periode pelaporan yang dikonfigurasi.'
  if (context.startsWith('Outer entry')) return 'Gate luar dan gate internal harus diklasifikasikan terpisah; pergerakan internal bukan kunjungan mall baru.'
  if (context.startsWith('Occupancy')) return 'Occupancy, total footfall, dwell, dan unique visitor adalah pengukuran dengan denominator berbeda.'
  if (context.startsWith('Floor')) return 'Output lantai, common area, dan zona tenant memerlukan topologi dan scope pelaporan yang disetujui.'
  return context
}
