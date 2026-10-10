import type { LocalText } from './types'
import type { Availability } from './types'

const l = (en: string, id: string): LocalText => ({ en, id })

export type Package = { name: string; label: LocalText; body: LocalText; items: LocalText[]; status: Availability }
export const packages: Package[] = [
  {
    name: 'Core Platform',
    label: l('Core', 'Core'),
    body: l('Defined traffic and reporting foundations for an approved Retail or Mall scope.', 'Fondasi traffic dan reporting untuk scope Retail atau Mall disetujui.'),
    items: [l('In / Out and period traffic', 'Traffic In / Out dan periode'), l('Scoped Retail or Mall dashboard', 'Dashboard Retail atau Mall ter-scope'), l('Standard reporting and export', 'Reporting dan export standard'), l('Local implementation and support', 'Implementasi dan support lokal')],
    status: 'scope',
  },
  {
    name: 'Advanced Analytics',
    label: l('Most common', 'Paling umum'),
    body: l('Optional modules assessed on top of Core.', 'Optional module yang dinilai di atas Core.'),
    items: [l('Dwell time and heatmap', 'Dwell time dan heatmap'), l('Passers-by and Entering Rate', 'Passers-by dan Entering Rate'), l('Journey and zone analytics', 'Journey dan zone analytics'), l('Staff exclusion or demographics when supported', 'Staff exclusion atau demographics bila didukung')],
    status: 'assessment',
  },
  {
    name: 'Enterprise',
    label: l('Complex rollout', 'Rollout kompleks'),
    body: l('Governed multi-location or multi-property scope.', 'Scope multi-location atau multi-property yang governed.'),
    items: [l('Selected Core and advanced modules', 'Selected Core dan advanced module'), l('Multi-location / property hierarchy', 'Hierarchy multi-location / property'), l('Assessed reporting and integration', 'Reporting dan integration berdasarkan assessment'), l('Contract-specific support and SLA options', 'Support dan SLA option sesuai kontrak')],
    status: 'assessment',
  },
]

export type LandingData = {
  slug: string
  eyebrow: LocalText
  title: LocalText
  description: LocalText
  context: LocalText
  sections: Array<{ title: LocalText; body: LocalText; points: LocalText[] }>
  assetTitle: LocalText
}

export const landingPages: LandingData[] = [
  {
    slug: 'people-counting-system-indonesia',
    eyebrow: l('People Counting System Indonesia', 'People Counting System Indonesia'),
    title: l('Defined Retail and Mall measurement with local implementation support.', 'Measurement Retail dan Mall terdefinisi dengan dukungan implementasi lokal.'),
    description: l('SmartCounter connects operating questions, approved boundaries, representative validation, and reviewable outputs for Indonesian Retail and Mall teams.', 'SmartCounter menghubungkan operating question, boundary disetujui, validasi representatif, dan output yang dapat ditinjau untuk tim Retail dan Mall Indonesia.'),
    context: l('This page describes an assessment path, not one universal device, accuracy, package, or deployment architecture.', 'Halaman ini menjelaskan jalur assessment, bukan satu device, akurasi, package, atau architecture deployment universal.'),
    sections: [
      { title: l('Retail scope', 'Scope Retail'), body: l('Start from stores, entrances, zones, and aligned periods.', 'Mulai dari store, entrance, zone, dan periode selaras.'), points: [l('Multi-location traffic review', 'Tinjauan traffic multi-location'), l('Dwell, heatmap, and journey by assessment', 'Dwell, heatmap, dan journey berdasarkan assessment')] },
      { title: l('Mall scope', 'Scope Mall'), body: l('Keep outer gates, internal movement, floors, zones, and tenant context distinct.', 'Pisahkan outer gate, movement internal, floor, zone, dan tenant context.'), points: [l('Outer-gate traffic', 'Traffic outer gate'), l('Floor, zone, occupancy, and tenant context by scope', 'Floor, zone, occupancy, dan tenant context sesuai scope')] },
    ],
    assetTitle: l('Indonesia Retail and Mall product evidence', 'Bukti produk Retail dan Mall Indonesia'),
  },
  {
    slug: 'cctv-people-counting',
    eyebrow: l('CCTV People Counting', 'CCTV People Counting'),
    title: l('Assess compatible camera or video inputs without universal support claims.', 'Nilai input kamera atau video kompatibel tanpa klaim dukungan universal.'),
    description: l('Review scene, stream access, boundary, topology, performance need, privacy, and intended measurement before confirming fit.', 'Tinjau scene, stream access, boundary, topology, kebutuhan performance, privacy, dan measurement sebelum mengonfirmasi fit.'),
    context: l('The public product identity remains the SmartCounter platform—not one device or manufacturer.', 'Identitas publik tetap platform SmartCounter—bukan satu device atau manufacturer.'),
    sections: [
      { title: l('What is assessed', 'Yang dinilai'), body: l('Compatibility is a site decision.', 'Kompatibilitas adalah keputusan site.'), points: [l('Scene and boundary visibility', 'Visibilitas scene dan boundary'), l('Stream access and stability', 'Akses dan stabilitas stream'), l('Measurement and validation scope', 'Scope measurement dan validation')] },
      { title: l('What is not promised', 'Yang tidak dijanjikan'), body: l('Device-neutral presentation is not universal compatibility.', 'Presentasi device-neutral bukan kompatibilitas universal.'), points: [l('Works with every CCTV', 'Bekerja dengan semua CCTV'), l('No hardware changes required', 'Tidak perlu perubahan hardware')] },
    ],
    assetTitle: l('Device-neutral assessment context', 'Konteks assessment device-neutral'),
  },
  {
    slug: 'visitor-analytics-platform',
    eyebrow: l('Visitor Analytics Platform', 'Visitor Analytics Platform'),
    title: l('Move beyond a count while keeping every metric inspectable.', 'Bergerak melampaui hitungan sambil menjaga setiap metric dapat ditinjau.'),
    description: l('Traffic, dwell, heatmap, journey, occupancy, and related signals need visible scope, unit, prerequisite, limitation, and validation.', 'Traffic, dwell, heatmap, journey, occupancy, dan sinyal terkait membutuhkan scope, unit, prerequisite, limitation, dan validation yang terlihat.'),
    context: l('Visitor analytics supports operational review; it does not guarantee commercial outcomes.', 'Visitor analytics mendukung operational review; bukan jaminan outcome komersial.'),
    sections: [
      { title: l('Defined signals', 'Sinyal terdefinisi'), body: l('Each signal starts from an approved operating question.', 'Setiap sinyal dimulai dari operating question disetujui.'), points: [l('Traffic and period comparison', 'Traffic dan period comparison'), l('Flow, zones, dwell, and journey', 'Flow, zone, dwell, dan journey')] },
      { title: l('Reviewable outputs', 'Output dapat ditinjau'), body: l('Show where the number came from and what it does not mean.', 'Tunjukkan dari mana angka berasal dan apa yang tidak dimaksud.'), points: [l('Boundary and denominator', 'Boundary dan denominator'), l('Timeframe, freshness, validation, and limits', 'Timeframe, freshness, validation, dan limit')] },
    ],
    assetTitle: l('Visitor analytics product interface', 'Interface produk visitor analytics'),
  },
  {
    slug: 'heatmap-dwell-journey-analytics',
    eyebrow: l('Heatmap, Dwell Time & Journey Analytics', 'Heatmap, Dwell Time & Journey Analytics'),
    title: l('Review where movement happens and how long it remains in scope.', 'Tinjau di mana movement terjadi dan berapa lama berada dalam scope.'),
    description: l('Advanced spatial analytics require approved geometry, coverage, topology, calibration, and careful interpretation.', 'Advanced spatial analytics membutuhkan geometri, coverage, topology, kalibrasi, dan interpretasi disetujui.'),
    context: l('Heatmap is not person-level replay, dwell is not attention quality, and journey is not an identity trail.', 'Heatmap bukan replay per orang, dwell bukan kualitas attention, dan journey bukan identity trail.'),
    sections: [
      { title: l('Heatmap', 'Heatmap'), body: l('Aggregate density or movement context over an approved reference.', 'Konteks density atau movement agregat pada reference disetujui.'), points: [l('Relative density by area and period', 'Density relatif per area dan periode'), l('Does not prove business outcome', 'Tidak membuktikan outcome bisnis')] },
      { title: l('Dwell & Journey', 'Dwell & Journey'), body: l('Time and transitions are meaningful only within named zones and topology.', 'Durasi dan transisi bermakna hanya dalam zone dan topology disebutkan.'), points: [l('Dwell interval by approved observation', 'Interval dwell per observasi disetujui'), l('Aggregate zone transitions', 'Transisi zone agregat')] },
    ],
    assetTitle: l('Heatmap, dwell, and journey product evidence', 'Bukti produk heatmap, dwell, dan journey'),
  },
]
