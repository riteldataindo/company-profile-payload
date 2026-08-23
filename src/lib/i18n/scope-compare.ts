export type ScopeCompareRowId = 'entrance' | 'zone' | 'floor'

export type ScopeCompareRow = {
  id: ScopeCompareRowId
  label: string
  coverage: string
  prerequisite: string
  output: string
  limitation: string
}

export type ScopeCompareCopy = {
  eyebrow: string
  title: string
  description: string
  caption: string
  columns: {
    coverage: string
    prerequisite: string
    output: string
    limitation: string
  }
  rows: ScopeCompareRow[]
}

const en: ScopeCompareCopy = {
  eyebrow: 'Measurement scope',
  title: 'Entrance, zone, and floor are different questions.',
  description: 'The same camera context can support more than one aggregate view. Each row stays valid only when its boundary, inputs, and reporting window are agreed.',
  caption: 'Conceptual comparison · Availability and performance are confirmed during site assessment. This table is not a package list or a proof of coverage.',
  columns: {
    coverage: 'Coverage',
    prerequisite: 'Prerequisite',
    output: 'Output',
    limitation: 'Limitation',
  },
  rows: [
    {
      id: 'entrance',
      label: 'Entrance',
      coverage: 'A configured store threshold or classified mall gate visible in a compatible camera view.',
      prerequisite: 'A reviewed crossing line, stable stream, and lighting that keeps the boundary readable.',
      output: 'Aggregate entries and exits for that boundary and reporting period.',
      limitation: 'An internal doorway is not automatically a visit. Validation is representative for the agreed scene.',
    },
    {
      id: 'zone',
      label: 'Zone',
      coverage: 'A named area inside a store or mall with approved geometry.',
      prerequisite: 'A floor or zone map, calibrated view, and consistent naming for the period being compared.',
      output: 'Aggregate counts, dwell, or density scoped to the zone and time window.',
      limitation: 'Zone comparisons are invalid when geometry, ownership, or inputs change without review.',
    },
    {
      id: 'floor',
      label: 'Floor',
      coverage: 'A mall floor or equivalent vertical slice of a property, not every tenant interior.',
      prerequisite: 'Approved topology, overlapping compatible coverage, and a documented floor boundary.',
      output: 'Floor-level movement or occupancy summaries when those views are configured.',
      limitation: 'A floor total is not unique visitors, tenant performance, or a new mall visit count.',
    },
  ],
}

const id: ScopeCompareCopy = {
  eyebrow: 'Cakupan pengukuran',
  title: 'Entrance, zona, dan lantai adalah pertanyaan yang berbeda.',
  description: 'Konteks kamera yang sama dapat mendukung lebih dari satu tampilan agregat. Setiap baris hanya valid jika batas, input, dan periode pelaporannya disepakati.',
  caption: 'Perbandingan konseptual · Ketersediaan dan performa dikonfirmasi saat asesmen lokasi. Tabel ini bukan daftar paket atau bukti coverage.',
  columns: {
    coverage: 'Cakupan',
    prerequisite: 'Prasyarat',
    output: 'Output',
    limitation: 'Batasan',
  },
  rows: [
    {
      id: 'entrance',
      label: 'Entrance',
      coverage: 'Ambang toko yang dikonfigurasi atau gate mall yang diklasifikasikan dan terlihat pada tampilan kamera yang kompatibel.',
      prerequisite: 'Garis perlintasan yang ditinjau, stream stabil, dan pencahayaan yang menjaga batas tetap terbaca.',
      output: 'Entri dan keluar agregat untuk batas dan periode pelaporan tersebut.',
      limitation: 'Pintu internal tidak otomatis menjadi kunjungan. Validasi bersifat representatif untuk scene yang disepakati.',
    },
    {
      id: 'zone',
      label: 'Zona',
      coverage: 'Area bernama di dalam toko atau mall dengan geometri yang disetujui.',
      prerequisite: 'Peta lantai atau zona, tampilan terkalibrasi, dan penamaan yang konsisten untuk periode yang dibandingkan.',
      output: 'Hitungan, dwell, atau kepadatan agregat pada zona dan jendela waktu tersebut.',
      limitation: 'Perbandingan zona tidak valid jika geometri, kepemilikan, atau input berubah tanpa tinjauan.',
    },
    {
      id: 'floor',
      label: 'Lantai',
      coverage: 'Satu lantai mall atau potongan vertikal setara pada properti, bukan setiap interior tenant.',
      prerequisite: 'Topologi yang disetujui, cakupan kompatibel yang tumpang tindih, dan batas lantai yang terdokumentasi.',
      output: 'Ringkasan pergerakan atau occupancy tingkat lantai ketika tampilan tersebut dikonfigurasi.',
      limitation: 'Total lantai bukan unique visitor, performa tenant, atau hitungan kunjungan mall baru.',
    },
  ],
}

export function getScopeCompareCopy(locale: string): ScopeCompareCopy {
  return locale === 'id' ? id : en
}
