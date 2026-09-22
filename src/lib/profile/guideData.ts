import type { LocalText } from './types'

const l = (en: string, id: string): LocalText => ({ en, id })

export type GuideSection = { title: LocalText; paragraphs: LocalText[]; points?: LocalText[] }
export type Guide = { slug: string; title: LocalText; description: LocalText; updated: string; sections: GuideSection[] }

export const guides: Guide[] = [
  {
    slug: 'what-is-a-people-counting-system',
    title: l('What Is a People Counting System?', 'Apa Itu People Counting System?'),
    description: l('A practical introduction to boundaries, units, periods, validation, and the decisions a count can support.', 'Pengantar praktis mengenai boundary, unit, periode, validasi, dan keputusan yang dapat didukung suatu hitungan.'),
    updated: '2026-08-27',
    sections: [
      {
        title: l('Start with the boundary', 'Mulai dari boundary'),
        paragraphs: [l('A people-counting metric begins with a named physical boundary and reporting period. “Visitor traffic” without an entrance, direction, timeframe, and unit is incomplete.', 'Metric people counting dimulai dari boundary fisik dan periode pelaporan yang disebutkan. “Visitor traffic” tanpa entrance, arah, timeframe, dan unit masih tidak lengkap.')],
        points: [l('Entrance or gate', 'Entrance atau gate'), l('Direction: IN, OUT, or both', 'Arah: IN, OUT, atau keduanya'), l('Named reporting period', 'Periode pelaporan disebutkan'), l('Unit and aggregation rule', 'Unit dan aggregation rule')],
      },
      {
        title: l('A count is not every business outcome', 'Hitungan bukan setiap outcome bisnis'),
        paragraphs: [l('Traffic can support staffing, layout, campaign, and operating reviews, but it does not by itself prove sales, conversion, revenue, or campaign lift.', 'Traffic dapat mendukung staffing, layout, campaign, dan operational review, tetapi tidak membuktikan sales, conversion, revenue, atau campaign lift dengan sendirinya.')],
      },
      {
        title: l('Validation is part of the system', 'Validasi adalah bagian dari sistem'),
        paragraphs: [l('Representative comparison should be planned around the scene, metric definition, boundary, direction, and period. One universal website accuracy percentage cannot replace that process.', 'Representative comparison harus direncanakan berdasarkan scene, definisi metric, boundary, arah, dan periode. Satu persentase akurasi universal di website tidak dapat menggantikan proses tersebut.')],
      },
    ],
  },
  {
    slug: 'why-in-out-counts-differ',
    title: l('Why Can IN and OUT Counts Be Different?', 'Kenapa Hitungan IN dan OUT Bisa Berbeda?'),
    description: l('A structured way to inspect boundary, direction, period, scene, operations, and data handling before drawing conclusions.', 'Cara terstruktur untuk meninjau boundary, arah, periode, scene, operasi, dan data handling sebelum menarik kesimpulan.'),
    updated: '2026-08-27',
    sections: [
      {
        title: l('First verify the comparison', 'Verifikasi perbandingan lebih dulu'),
        paragraphs: [l('IN and OUT are comparable only when they use the same physical boundary, reporting window, timezone, filters, and inclusion rules.', 'IN dan OUT hanya dapat dibandingkan bila memakai boundary fisik, reporting window, timezone, filter, dan inclusion rule yang sama.')],
        points: [l('Same gate and direction configuration', 'Gate dan konfigurasi arah sama'), l('Same date, timezone, and operating window', 'Tanggal, timezone, dan operating window sama'), l('Same staff and data filters', 'Filter staff dan data sama')],
      },
      {
        title: l('Operational and scene causes', 'Penyebab operasional dan scene'),
        paragraphs: [l('People may enter before the selected window and leave inside it, use a different exit, cross together, reverse direction, or be occluded. Scene changes can also alter the observation.', 'Orang dapat masuk sebelum window lalu keluar di dalam window, memakai exit berbeda, crossing bersama, berbalik arah, atau mengalami occlusion. Perubahan scene juga dapat mengubah observasi.')],
      },
      {
        title: l('System and publication causes', 'Penyebab sistem dan publikasi'),
        paragraphs: [l('Check stream continuity, timestamp handling, data freshness, late arrival, duplicate handling, routing, and whether the dashboard is reading the same approved source.', 'Periksa kontinuitas stream, timestamp handling, data freshness, late arrival, duplicate handling, routing, dan apakah dashboard membaca source disetujui yang sama.')],
      },
    ],
  },
  {
    slug: 'validation-and-accuracy',
    title: l('How People Counting Validation and Accuracy Work', 'Cara Kerja Validasi dan Akurasi People Counting'),
    description: l('Why validation needs a metric definition, reference, representative sample, acceptance rule, limitation, and revalidation trigger.', 'Mengapa validasi membutuhkan definisi metric, reference, sample representatif, acceptance rule, limitation, dan trigger revalidation.'),
    updated: '2026-08-27',
    sections: [
      {
        title: l('Define what is being compared', 'Definisikan yang dibandingkan'),
        paragraphs: [l('An accuracy statement is incomplete without the metric, boundary, direction, period, source of truth, and comparison method. Traffic, occupancy, dwell, journey, and demographic estimates require different evidence.', 'Pernyataan akurasi tidak lengkap tanpa metric, boundary, arah, periode, source of truth, dan metode perbandingan. Traffic, occupancy, dwell, journey, dan estimasi demographic membutuhkan evidence berbeda.')],
      },
      {
        title: l('Use a representative comparison', 'Gunakan representative comparison'),
        paragraphs: [l('The sample should cover the relevant traffic pattern, operating period, scene condition, and expected edge cases—not only the easiest interval.', 'Sample harus mencakup traffic pattern, operating period, scene condition, dan edge case relevan—bukan hanya interval termudah.')],
        points: [l('Named reference and reviewer', 'Reference dan reviewer disebutkan'), l('Documented sample window', 'Sample window terdokumentasi'), l('Acceptance criteria', 'Acceptance criteria'), l('Known limitations', 'Known limitation')],
      },
      {
        title: l('Revalidate when the context changes', 'Lakukan revalidation saat konteks berubah'),
        paragraphs: [l('Scene, boundary, lighting, topology, operating behavior, configuration, and processing changes can affect the result. The public site therefore does not use a universal accuracy promise.', 'Perubahan scene, boundary, pencahayaan, topology, operating behavior, konfigurasi, dan processing dapat memengaruhi hasil. Karena itu website tidak memakai janji akurasi universal.')],
      },
    ],
  },
  {
    slug: 'existing-cctv-people-counting',
    title: l('Can Existing CCTV Be Used for People Counting?', 'Apakah CCTV Existing Bisa Digunakan untuk People Counting?'),
    description: l('What a site assessment should review before confirming whether an existing camera or video input fits the intended measurement.', 'Yang perlu ditinjau saat site assessment sebelum mengonfirmasi apakah input kamera atau video existing cocok untuk measurement yang dituju.'),
    updated: '2026-08-27',
    sections: [
      {
        title: l('Compatibility is scene-specific', 'Kompatibilitas bersifat spesifik scene'),
        paragraphs: [l('A known brand or stream format is not enough. The assessment needs to review boundary visibility, angle, height, occlusion, lighting, traffic pattern, stream access, stability, and the intended metric.', 'Brand atau format stream saja tidak cukup. Assessment perlu meninjau visibilitas boundary, angle, height, occlusion, pencahayaan, traffic pattern, stream access, stability, dan metric yang dituju.')],
      },
      {
        title: l('A different input may be recommended', 'Input berbeda dapat direkomendasikan'),
        paragraphs: [l('When the existing scene cannot support the approved measurement or validation plan, another input or site change may be recommended. The website does not promise “no hardware changes required”.', 'Bila scene existing tidak dapat mendukung measurement atau validation plan yang disetujui, input lain atau perubahan site dapat direkomendasikan. Website tidak menjanjikan “tidak perlu perubahan hardware”.')],
      },
      {
        title: l('Device-neutral does not mean universal', 'Device-neutral bukan berarti universal'),
        paragraphs: [l('SmartCounter is not presented around one device brand or model because deployment choices may evolve. That strategy must not become “works with all CCTV”.', 'SmartCounter tidak dipresentasikan berdasarkan satu brand atau model device karena pilihan deployment dapat berkembang. Strategi ini tidak boleh menjadi “works with all CCTV”.')],
      },
    ],
  },
]

export const faqGroups = [
  {
    title: l('Product and measurement', 'Produk dan measurement'),
    items: [
      [l('What does SmartCounter measure?', 'Apa yang diukur SmartCounter?'), l('Configured aggregate traffic and spatial signals within an approved boundary, period, definition, and deployment scope.', 'Traffic dan sinyal spasial agregat terkonfigurasi dalam boundary, periode, definisi, dan scope deployment disetujui.')],
      [l('Is Entering Rate sales conversion?', 'Apakah Entering Rate adalah sales conversion?'), l('No. Entering Rate uses compatible entries and passer-by observations. Sales conversion requires an approved POS or sales integration and denominator.', 'Tidak. Entering Rate memakai entry dan observasi passer-by kompatibel. Sales conversion membutuhkan integrasi POS/sales dan denominator disetujui.')],
      [l('Is demographics identity data?', 'Apakah demographics adalah identity data?'), l('Public wording treats supported demographic output as aggregate estimates, not identity records. Availability requires assessment and privacy review.', 'Public wording memperlakukan output demographic yang didukung sebagai estimasi agregat, bukan identity record. Ketersediaan memerlukan assessment dan privacy review.')],
    ],
  },
  {
    title: l('Validation and availability', 'Validasi dan ketersediaan'),
    items: [
      [l('What accuracy does SmartCounter guarantee?', 'Berapa akurasi yang dijamin SmartCounter?'), l('The public site does not state one universal percentage. Performance is evaluated for the named metric, scene, boundary, period, reference, and validation plan.', 'Website tidak menyebutkan satu persentase universal. Performance dievaluasi untuk metric, scene, boundary, periode, reference, dan validation plan yang disebutkan.')],
      [l('Is every feature available everywhere?', 'Apakah semua fitur tersedia di semua tempat?'), l('No. Capability status depends on the approved site, topology, input, processing, package, entitlement, and validation scope.', 'Tidak. Status capability bergantung pada site, topology, input, processing, package, entitlement, dan validation scope disetujui.')],
      [l('Is the data real-time?', 'Apakah datanya real-time?'), l('Freshness must be defined for the deployment. The public site does not use an unscoped universal real-time claim.', 'Freshness harus didefinisikan untuk deployment. Website tidak memakai klaim real-time universal tanpa scope.')],
    ],
  },
  {
    title: l('Deployment and commercial scope', 'Deployment dan scope komersial'),
    items: [
      [l('Does SmartCounter work with every CCTV?', 'Apakah SmartCounter bekerja dengan semua CCTV?'), l('No universal compatibility is promised. Existing input can be assessed from the scene, stream, boundary, performance, privacy, and intended measurement.', 'Tidak ada kompatibilitas universal. Input existing dapat dinilai dari scene, stream, boundary, performance, privacy, dan measurement yang dituju.')],
      [l('Why is there no public fixed price?', 'Kenapa tidak ada fixed public price?'), l('Scope can vary by location, boundary, camera/input fit, analytics, validation, integration, reporting, support, and commercial responsibility.', 'Scope dapat berubah berdasarkan lokasi, boundary, kecocokan input, analytics, validation, integration, reporting, support, dan responsibility komersial.')],
      [l('What happens after contact?', 'Apa yang terjadi setelah contact?'), l('A site discussion reviews the operating question, context, expected output, and the assessment needed. The current implementation does not yet send the form.', 'Site discussion meninjau operating question, konteks, output yang diharapkan, dan assessment yang dibutuhkan. Implementasi saat ini belum mengirim form.')],
    ],
  },
] as const
