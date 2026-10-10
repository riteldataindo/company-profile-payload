export interface TrustItem {
  label: string
  body: string
  status?: string
}

export interface TrustSection {
  title: string
  intro?: string
  items: TrustItem[]
}

export interface TrustDiagramStep {
  title: string
  body: string
}

export interface TrustPageCopy {
  breadcrumb: string
  eyebrow: string
  title: string
  intro: string
  primaryCta: string
  primaryHref: '/demo'
  secondaryCta: string
  secondaryHref: '/deployment' | '/privacy'
  statusLabel: string
  statusBody: string
  diagram: {
    title: string
    caption: string
    steps: TrustDiagramStep[]
  }
  sections: TrustSection[]
  unknownsTitle: string
  unknownsBody: string
}

export interface TrustFaqItem {
  category: string
  question: string
  answer: string
}

const enDeployment: TrustPageCopy = {
  breadcrumb: 'Deployment',
  eyebrow: 'Deployment guide',
  title: 'Deployment is scoped to the site',
  intro: 'SmartCounter starts with a site-fit assessment of camera streams, space, network, and the operating question. The agreed design determines which aggregate signals can be validated and reported.',
  primaryCta: 'Request a site-fit demo',
  primaryHref: '/demo',
  secondaryCta: 'Review Privacy',
  secondaryHref: '/privacy',
  statusLabel: 'Assessment-dependent',
  statusBody: 'The public page explains the method. A deployment record, enabled metric list, timeline, and support scope are confirmed for each site.',
  diagram: {
    title: 'From site context to an agreed operating view',
    caption: 'Conceptual flow — explanation, not proof. The actual topology and enabled outputs are confirmed during assessment.',
    steps: [
      {
        title: 'Assess the scene',
        body: 'Review entrances, floors, zones, camera views, lighting, network path, and the decision to support.',
      },
      {
        title: 'Design the measurement',
        body: 'Define the counting boundary, metric units, time window, and any approved floor-plan or integration input.',
      },
      {
        title: 'Calibrate and validate',
        body: 'Configure the agreed views and compare representative output with a manual sample before handover.',
      },
      {
        title: 'Operate and review',
        body: 'Document the enabled scope, access, refresh behavior, and support path for the deployment.',
      },
    ],
  },
  sections: [
    {
      title: 'What the team needs to confirm',
      intro: 'These inputs help determine fit. They are not a universal installation checklist or a promise that every camera system is compatible.',
      items: [
        {
          label: 'Camera and scene',
          body: 'Stable, usable streams; camera placement; entrance or zone boundaries; lighting and likely occlusion.',
          status: 'Reviewed per site',
        },
        {
          label: 'Network and topology',
          body: 'The agreed path for processing, dashboard access, and recovery behavior when connectivity or equipment changes.',
          status: 'Confirmed in technical design',
        },
        {
          label: 'Measurement scope',
          body: 'The metric definition, unit, time window, enabled entrances or zones, and the operator who will use the result.',
          status: 'Documented before handover',
        },
        {
          label: 'Validation sample',
          body: 'A representative manual comparison window and the exceptions or scene changes that should be reviewed with it.',
          status: 'Agreed before sign-off',
        },
      ],
    },
    {
      title: 'What is deployment-specific',
      intro: 'Do not infer these details from the conceptual flow. They belong in the assessment, proposal, or service agreement.',
      items: [
        {
          label: 'Enabled metrics and freshness',
          body: 'The available signals, update interval, and reporting window depend on the selected analytic and architecture.',
          status: 'Unknown until assessed',
        },
        {
          label: 'Processing and data handling',
          body: 'Processing location, retained fields, access roles, export, and deletion behavior must be confirmed for the deployment.',
          status: 'See Privacy',
        },
        {
          label: 'Installation timeline',
          body: 'Readiness, access, camera work, network changes, and calibration determine the delivery sequence.',
          status: 'Provided after assessment',
        },
        {
          label: 'Support and commercial scope',
          body: 'Training, support ownership, integrations, and ongoing service terms follow the agreed proposal and service terms.',
          status: 'Proposal-specific',
        },
      ],
    },
  ],
  unknownsTitle: 'No public footprint claim is made here',
  unknownsBody: 'A city count, customer map, installation promise, or performance figure is shown only when a verified record, owner, review date, and permission are available. Until then, ask for the evidence relevant to your site.',
}

const idDeployment: TrustPageCopy = {
  breadcrumb: 'Deployment',
  eyebrow: 'Panduan deployment',
  title: 'Deployment ditentukan oleh kondisi lokasi',
  intro: 'SmartCounter dimulai dengan asesmen kesesuaian lokasi yang mencakup stream kamera, ruang, jaringan, dan kebutuhan operasional. Desain yang disepakati menentukan sinyal agregat yang dapat divalidasi dan dilaporkan.',
  primaryCta: 'Minta demo site-fit',
  primaryHref: '/demo',
  secondaryCta: 'Tinjau Privasi',
  secondaryHref: '/privacy',
  statusLabel: 'Bergantung pada asesmen',
  statusBody: 'Halaman ini menjelaskan metodenya. Catatan deployment, daftar metrik aktif, jadwal, dan cakupan dukungan dikonfirmasi untuk setiap lokasi.',
  diagram: {
    title: 'Dari konteks lokasi menuju tampilan operasional yang disepakati',
    caption: 'Alur konseptual — penjelasan, bukan bukti. Topologi dan output aktif dikonfirmasi saat asesmen.',
    steps: [
      {
        title: 'Asesmen kondisi',
        body: 'Tinjau pintu masuk, lantai, zona, sudut kamera, pencahayaan, jalur jaringan, dan keputusan yang ingin didukung.',
      },
      {
        title: 'Rancang pengukuran',
        body: 'Tentukan batas penghitungan, satuan metrik, jendela waktu, serta input denah atau integrasi yang disetujui.',
      },
      {
        title: 'Kalibrasi dan validasi',
        body: 'Konfigurasikan tampilan yang disepakati dan bandingkan output representatif dengan sampel manual sebelum serah terima.',
      },
      {
        title: 'Operasikan dan tinjau',
        body: 'Dokumentasikan cakupan aktif, akses, perilaku pembaruan, dan jalur dukungan untuk deployment tersebut.',
      },
    ],
  },
  sections: [
    {
      title: 'Hal yang perlu dikonfirmasi',
      intro: 'Input berikut membantu menentukan kesesuaian. Ini bukan checklist instalasi universal atau janji bahwa setiap sistem kamera kompatibel.',
      items: [
        {
          label: 'Kamera dan kondisi scene',
          body: 'Stream yang stabil dan dapat digunakan; penempatan kamera; batas pintu masuk atau zona; pencahayaan dan potensi occlusion.',
          status: 'Ditinjau per lokasi',
        },
        {
          label: 'Jaringan dan topologi',
          body: 'Jalur yang disepakati untuk pemrosesan, akses dashboard, dan perilaku pemulihan saat koneksi atau perangkat berubah.',
          status: 'Dikonfirmasi dalam desain teknis',
        },
        {
          label: 'Cakupan pengukuran',
          body: 'Definisi metrik, satuan, jendela waktu, pintu masuk atau zona yang aktif, dan operator pengguna hasilnya.',
          status: 'Didokumentasikan sebelum serah terima',
        },
        {
          label: 'Sampel validasi',
          body: 'Jendela perbandingan manual yang representatif serta pengecualian atau perubahan scene yang perlu ditinjau.',
          status: 'Disepakati sebelum sign-off',
        },
      ],
    },
    {
      title: 'Hal yang spesifik untuk setiap deployment',
      intro: 'Jangan menyimpulkan detail ini dari alur konseptual. Detail tersebut berada di asesmen, proposal, atau perjanjian layanan.',
      items: [
        {
          label: 'Metrik aktif dan kesegaran data',
          body: 'Sinyal yang tersedia, interval pembaruan, dan jendela laporan bergantung pada analitik dan arsitektur yang dipilih.',
          status: 'Belum diketahui sebelum asesmen',
        },
        {
          label: 'Pemrosesan dan penanganan data',
          body: 'Lokasi pemrosesan, field yang disimpan, peran akses, ekspor, dan penghapusan harus dikonfirmasi untuk deployment tersebut.',
          status: 'Lihat Privasi',
        },
        {
          label: 'Jadwal instalasi',
          body: 'Kesiapan lokasi, akses, pekerjaan kamera, perubahan jaringan, dan kalibrasi menentukan urutan pengerjaan.',
          status: 'Diberikan setelah asesmen',
        },
        {
          label: 'Dukungan dan cakupan komersial',
          body: 'Pelatihan, pemilik dukungan, integrasi, dan ketentuan layanan mengikuti proposal serta syarat layanan yang disepakati.',
          status: 'Spesifik proposal',
        },
      ],
    },
  ],
  unknownsTitle: 'Tidak ada klaim footprint publik di sini',
  unknownsBody: 'Jumlah kota, peta pelanggan, janji instalasi, atau angka performa hanya ditampilkan jika catatan terverifikasi, pemilik, tanggal review, dan izin tersedia. Sampai saat itu, mintalah bukti yang relevan untuk lokasi Anda.',
}

const enPrivacy: TrustPageCopy = {
  breadcrumb: 'Privacy',
  eyebrow: 'Privacy & data boundary',
  title: 'Understand the data boundary before deployment',
  intro: 'The product is designed to turn compatible camera streams into aggregate operational signals. Exact inputs, processing location, retained fields, access, and deletion rules must be confirmed for each deployment.',
  primaryCta: 'Request a site-fit demo',
  primaryHref: '/demo',
  secondaryCta: 'Review Deployment',
  secondaryHref: '/deployment',
  statusLabel: 'Deployment-specific',
  statusBody: 'This page separates the intended aggregate output from facts that require an approved technical and privacy review.',
  diagram: {
    title: 'A boundary to review with IT and privacy teams',
    caption: 'Conceptual flow — explanation, not proof. It does not establish a deployed architecture, retention period, or certification.',
    steps: [
      {
        title: 'Camera or video source',
        body: 'The input context and permitted stream are agreed for the site and use case.',
      },
      {
        title: 'Configured processing',
        body: 'The processing topology and controls are confirmed in the technical assessment.',
      },
      {
        title: 'Aggregate metrics',
        body: 'Enabled outputs, units, time granularity, and limitations are documented for the deployment.',
      },
      {
        title: 'Dashboard or report',
        body: 'Access, sharing, export, and support responsibilities follow the agreed scope.',
      },
    ],
  },
  sections: [
    {
      title: 'What to define in the review',
      intro: 'Use these questions to make the product data boundary inspectable before a rollout is approved.',
      items: [
        {
          label: 'Purpose and input',
          body: 'What operating question is being measured, which camera or stream is in scope, and which site or zone boundary applies?',
          status: 'Agreed per deployment',
        },
        {
          label: 'Output and time window',
          body: 'Which aggregate signals are enabled, what unit and time granularity they use, and which limitations accompany them?',
          status: 'Documented before handover',
        },
        {
          label: 'Access and sharing',
          body: 'Which roles can view, export, or share results, and how tenant or site boundaries are represented.',
          status: 'Confirmed in technical scope',
        },
        {
          label: 'Review and validation',
          body: 'How representative samples, scene changes, exceptions, and calibration updates are reviewed with the operating team.',
          status: 'Discussed during assessment',
        },
      ],
    },
    {
      title: 'Facts that remain deployment-specific',
      intro: 'The public page does not substitute for an approved data-processing or service agreement.',
      items: [
        {
          label: 'Processing location and topology',
          body: 'Whether processing is local, remote, or another agreed arrangement is confirmed for the selected architecture.',
          status: 'Unknown until assessed',
        },
        {
          label: 'Image or video handling',
          body: 'Retention, deletion, intermediate fields, and operational access are reviewed with the deployment owner.',
          status: 'Requires written confirmation',
        },
        {
          label: 'Integration and export',
          body: 'POS, reporting, API, or other sharing paths are included only when the technical and commercial scope supports them.',
          status: 'Scope-specific',
        },
        {
          label: 'Responsibilities and contact',
          body: 'The agreement identifies the relevant operator, support owner, review path, and deletion or change request process.',
          status: 'Recorded for the deployment',
        },
      ],
    },
  ],
  unknownsTitle: 'No universal compliance claim is made',
  unknownsBody: 'Hosting, retention, encryption, certification, and legal obligations must be reviewed against the actual architecture, contract, and applicable requirements. Ask for the documentation relevant to your use case.',
}

const idPrivacy: TrustPageCopy = {
  breadcrumb: 'Privasi',
  eyebrow: 'Batas privasi dan data',
  title: 'Pahami batas data sebelum deployment',
  intro: 'Produk ini dirancang untuk mengubah stream kamera yang kompatibel menjadi sinyal operasional agregat. Input, lokasi pemrosesan, field yang disimpan, akses, dan aturan penghapusan harus dikonfirmasi untuk setiap deployment.',
  primaryCta: 'Minta demo site-fit',
  primaryHref: '/demo',
  secondaryCta: 'Tinjau Deployment',
  secondaryHref: '/deployment',
  statusLabel: 'Spesifik deployment',
  statusBody: 'Halaman ini memisahkan output agregat yang dituju dari fakta yang memerlukan review teknis dan privasi yang disetujui.',
  diagram: {
    title: 'Batas data untuk ditinjau bersama tim IT dan privasi',
    caption: 'Alur konseptual — penjelasan, bukan bukti. Alur ini tidak menetapkan arsitektur aktif, masa retensi, atau sertifikasi.',
    steps: [
      {
        title: 'Sumber kamera atau video',
        body: 'Konteks input dan stream yang diizinkan disepakati untuk lokasi serta kebutuhan tersebut.',
      },
      {
        title: 'Pemrosesan terkonfigurasi',
        body: 'Topologi pemrosesan dan kontrolnya dikonfirmasi dalam asesmen teknis.',
      },
      {
        title: 'Metrik agregat',
        body: 'Output aktif, satuan, granularitas waktu, dan batasan didokumentasikan untuk deployment.',
      },
      {
        title: 'Dashboard atau laporan',
        body: 'Akses, berbagi, ekspor, dan tanggung jawab dukungan mengikuti cakupan yang disepakati.',
      },
    ],
  },
  sections: [
    {
      title: 'Hal yang perlu didefinisikan dalam review',
      intro: 'Gunakan pertanyaan ini agar batas data produk dapat ditinjau sebelum rollout disetujui.',
      items: [
        {
          label: 'Tujuan dan input',
          body: 'Keputusan operasional apa yang diukur, kamera atau stream mana yang termasuk, serta batas lokasi atau zona yang berlaku?',
          status: 'Disepakati per deployment',
        },
        {
          label: 'Output dan jendela waktu',
          body: 'Sinyal agregat apa yang aktif, satuan dan granularitas waktunya, serta batasan apa yang menyertainya?',
          status: 'Didokumentasikan sebelum serah terima',
        },
        {
          label: 'Akses dan berbagi',
          body: 'Peran mana yang dapat melihat, mengekspor, atau membagikan hasil, serta bagaimana batas tenant atau lokasi direpresentasikan.',
          status: 'Dikonfirmasi dalam cakupan teknis',
        },
        {
          label: 'Review dan validasi',
          body: 'Bagaimana sampel representatif, perubahan scene, pengecualian, dan pembaruan kalibrasi ditinjau bersama tim operasional.',
          status: 'Dibahas saat asesmen',
        },
      ],
    },
    {
      title: 'Fakta yang tetap spesifik untuk deployment',
      intro: 'Halaman publik ini tidak menggantikan perjanjian pemrosesan data atau layanan yang telah disetujui.',
      items: [
        {
          label: 'Lokasi dan topologi pemrosesan',
          body: 'Pemrosesan lokal, jarak jauh, atau pengaturan lain yang disepakati dikonfirmasi untuk arsitektur yang dipilih.',
          status: 'Belum diketahui sebelum asesmen',
        },
        {
          label: 'Penanganan gambar atau video',
          body: 'Retensi, penghapusan, field perantara, dan akses operasional ditinjau bersama pemilik deployment.',
          status: 'Memerlukan konfirmasi tertulis',
        },
        {
          label: 'Integrasi dan ekspor',
          body: 'POS, laporan, API, atau jalur berbagi lain hanya termasuk jika didukung cakupan teknis dan komersial.',
          status: 'Spesifik cakupan',
        },
        {
          label: 'Tanggung jawab dan kontak',
          body: 'Perjanjian mengidentifikasi operator terkait, pemilik dukungan, jalur review, serta proses permintaan penghapusan atau perubahan.',
          status: 'Dicatat untuk deployment',
        },
      ],
    },
  ],
  unknownsTitle: 'Tidak ada klaim kepatuhan universal',
  unknownsBody: 'Hosting, retensi, enkripsi, sertifikasi, dan kewajiban hukum harus ditinjau berdasarkan arsitektur, kontrak, dan persyaratan yang berlaku. Mintalah dokumentasi yang relevan dengan kebutuhan Anda.',
}

const enFaq: TrustFaqItem[] = [
  {
    category: 'Validation',
    question: 'How is counting performance evaluated?',
    answer: 'Performance depends on the camera view, scene, lighting, entrances, and operating conditions. A representative manual comparison and the relevant exceptions are agreed during assessment; there is no single public accuracy figure for every deployment.',
  },
  {
    category: 'Compatibility',
    question: 'Will my existing CCTV system work?',
    answer: 'It may, if the stream, placement, resolution, network path, and scene support the agreed measurement. Compatibility is checked before a deployment design is confirmed.',
  },
  {
    category: 'Deployment',
    question: 'What happens during deployment?',
    answer: 'The team reviews the site, defines the measurement boundary, configures the agreed views, validates a representative sample, and documents the enabled scope and support path. Timing and installation work depend on site readiness.',
  },
  {
    category: 'Privacy',
    question: 'Where is data processed and how long is it retained?',
    answer: 'Processing topology, retained fields, access, and deletion are deployment-specific. Review the Privacy page and request the written data boundary for the architecture under consideration.',
  },
  {
    category: 'Integration',
    question: 'Can SmartCounter integrate with POS or reporting tools?',
    answer: 'Integration, export, and scheduled reporting depend on the technical and commercial scope. Bring the required system, fields, and reporting workflow to the site-fit discussion so they can be assessed.',
  },
  {
    category: 'Support',
    question: 'What support and commercial scope should I expect?',
    answer: 'Training, support ownership, integrations, hardware or installation work, and service terms are confirmed in the proposal and service agreement for the deployment.',
  },
]

const idFaq: TrustFaqItem[] = [
  {
    category: 'Validasi',
    question: 'Bagaimana performa penghitungan dievaluasi?',
    answer: 'Performa bergantung pada tampilan kamera, scene, pencahayaan, pintu masuk, dan kondisi operasional. Perbandingan manual yang representatif serta pengecualian terkait disepakati saat asesmen; tidak ada satu angka akurasi publik untuk semua deployment.',
  },
  {
    category: 'Kompatibilitas',
    question: 'Apakah sistem CCTV yang sudah ada dapat digunakan?',
    answer: 'Bisa saja, jika stream, penempatan, resolusi, jalur jaringan, dan scene mendukung pengukuran yang disepakati. Kompatibilitas diperiksa sebelum desain deployment dikonfirmasi.',
  },
  {
    category: 'Deployment',
    question: 'Apa yang terjadi selama deployment?',
    answer: 'Tim meninjau lokasi, menentukan batas pengukuran, mengonfigurasi tampilan yang disepakati, memvalidasi sampel representatif, lalu mendokumentasikan cakupan aktif dan jalur dukungan. Waktu dan pekerjaan instalasi bergantung pada kesiapan lokasi.',
  },
  {
    category: 'Privasi',
    question: 'Di mana data diproses dan berapa lama disimpan?',
    answer: 'Topologi pemrosesan, field yang disimpan, akses, dan penghapusan bersifat spesifik deployment. Tinjau halaman Privasi dan minta batas data tertulis untuk arsitektur yang dipertimbangkan.',
  },
  {
    category: 'Integrasi',
    question: 'Apakah SmartCounter dapat terintegrasi dengan POS atau alat laporan?',
    answer: 'Integrasi, ekspor, dan laporan terjadwal bergantung pada cakupan teknis dan komersial. Bawa sistem, field, dan alur laporan yang dibutuhkan ke diskusi site-fit agar dapat dinilai.',
  },
  {
    category: 'Dukungan',
    question: 'Dukungan dan cakupan komersial apa yang perlu saya harapkan?',
    answer: 'Pelatihan, pemilik dukungan, integrasi, pekerjaan perangkat keras atau instalasi, serta ketentuan layanan dikonfirmasi dalam proposal dan perjanjian layanan deployment.',
  },
]

export function getDeploymentCopy(locale: string): TrustPageCopy {
  return locale === 'id' ? idDeployment : enDeployment
}

export function getPrivacyCopy(locale: string): TrustPageCopy {
  return locale === 'id' ? idPrivacy : enPrivacy
}

export function getTrustFaq(locale: string): TrustFaqItem[] {
  return locale === 'id' ? idFaq : enFaq
}

