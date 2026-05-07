'use client'

export function ComparisonTable({ slug }: { slug: string }) {
  const tables: Record<string, { title: string; headers: string[]; rows: string[][] }> = {
    'apa-itu-people-counting-system': {
      title: 'People Counting Technology Comparison',
      headers: ['Feature', 'Infrared Beam', 'Thermal Sensor', 'CCTV AI (SmartCounter)'],
      rows: [
        ['Accuracy', '85-90%', '92-95%', '99.9%'],
        ['Bidirectional Counting', 'No', 'Limited', 'Yes'],
        ['Demographics', 'No', 'No', 'Yes (age, gender)'],
        ['Heatmap', 'No', 'No', 'Yes'],
        ['Queue Detection', 'No', 'No', 'Yes'],
        ['Uses Existing CCTV', 'No', 'No', 'Yes'],
        ['Multi-Entrance Support', 'Per-door only', 'Per-door only', 'Aggregated'],
        ['Cost', 'Low', 'High', 'Medium (no new hardware)'],
      ],
    },
    'cara-kerja-people-counting-cctv-ai': {
      title: 'AI Processing Pipeline — 4 Stages',
      headers: ['Stage', 'Technology', 'Function', 'Output'],
      rows: [
        ['1. Detection', 'YOLO v8', 'Identify humans in frame', 'Bounding boxes + confidence'],
        ['2. Tracking', 'DeepSORT', 'Assign unique ID per person', 'Trajectory per individual'],
        ['3. Counting', 'Virtual Line', 'Determine entry/exit direction', 'IN/OUT count per entrance'],
        ['4. Analytics', 'Custom ML', 'Demographics, dwell, heatmap', 'Business insights dashboard'],
      ],
    },
    'manfaat-visitor-counter-toko-retail': {
      title: 'Visitor Counter Impact — Before vs After',
      headers: ['Metric', 'Without Counter', 'With SmartCounter', 'Improvement'],
      rows: [
        ['Conversion Rate', 'Unknown', 'Measured (avg 5-12%)', 'Visible + actionable'],
        ['Staff Scheduling', 'Intuition-based', 'Data-driven per hour', '15-20% cost savings'],
        ['Promo ROI', '"Seemed busy"', '34% traffic lift measured', '3.2x ROI proven'],
        ['Layout Decisions', 'Gut feeling', 'Heatmap-based', '15-20% category uplift'],
        ['Branch Comparison', 'Sales only', 'Traffic + conversion', 'Fair benchmarking'],
        ['Overall Sales', 'Baseline', '+25-40% year 1', 'Data-driven growth'],
      ],
    },
    'cctv-ai-people-counting-visitor-analytics': {
      title: 'SmartCounter Feature Overview',
      headers: ['Feature', 'What It Does', 'Business Impact'],
      rows: [
        ['People Counting', '99.9% accurate entry/exit counting', 'Conversion rate measurement'],
        ['Heatmap', 'Visualize movement patterns by zone', '15-20% layout optimization uplift'],
        ['Demographics', 'Age & gender estimation (no face data)', 'Targeted merchandising'],
        ['Queue Detection', 'Real-time queue length + wait time', '30-40% wait time reduction'],
        ['Dwell Time', 'Time spent per zone', 'Engagement measurement'],
        ['Occupancy', 'Real-time capacity monitoring', 'Safety compliance'],
      ],
    },
  }

  const table = tables[slug]
  if (!table) return null

  return (
    <div className="my-8 overflow-x-auto">
      <h3 className="text-lg font-semibold text-text-primary mb-3">{table.title}</h3>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            {table.headers.map((h, i) => (
              <th key={i} className="text-left py-3 px-4 text-text-muted font-semibold text-xs uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
              {row.map((cell, j) => (
                <td key={j} className={`py-2.5 px-4 ${j === 0 ? 'font-medium text-text-primary' : 'text-text-secondary'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function VideoEmbed() {
  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold text-text-primary mb-3">See SmartCounter in Action</h3>
      <div className="aspect-video rounded-2xl overflow-hidden bg-bg-card border border-white/[0.06]">
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="SmartCounter Demo — AI People Counting"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
        />
      </div>
      <p className="text-xs text-text-muted mt-2">SmartCounter AI people counting demonstration — real-time visitor analytics dashboard</p>
    </div>
  )
}

export function InlineImage({ slug, position }: { slug: string; position: 'mid' | 'end' }) {
  const images: Record<string, { mid: { src: string; alt: string }; end: { src: string; alt: string } }> = {
    'apa-itu-people-counting-system': {
      mid: { src: '/og/generated/blog-apa-itu-people-counting.png', alt: 'People counting system entrance visualization — showing IN/OUT counters with 99.9% accuracy badge' },
      end: { src: '/media/visitor-traffic.png', alt: 'SmartCounter visitor traffic dashboard showing real-time hourly analytics' },
    },
    'cara-kerja-people-counting-cctv-ai': {
      mid: { src: '/og/generated/blog-cara-kerja-cctv-ai.png', alt: 'CCTV AI processing pipeline — camera to AI engine to detect, track, count, analyze stages' },
      end: { src: '/media/heatmap.png', alt: 'SmartCounter heatmap visualization showing store visitor movement patterns' },
    },
    'manfaat-visitor-counter-toko-retail': {
      mid: { src: '/og/generated/blog-manfaat-visitor-counter.png', alt: 'SmartCounter dashboard showing conversion rate 12.4%, 1247 daily visitors, and hourly traffic chart' },
      end: { src: '/media/entering-rate.png', alt: 'SmartCounter entering rate analytics for retail store optimization' },
    },
    'cctv-ai-people-counting-visitor-analytics': {
      mid: { src: '/og/generated/blog-cctv-ai-visitor-analytics.png', alt: 'CCTV AI analytics dashboard with heatmap, demographics, queue monitor, and occupancy tracking' },
      end: { src: '/media/occupancy.png', alt: 'SmartCounter real-time occupancy monitoring dashboard for safety compliance' },
    },
  }

  const img = images[slug]?.[position]
  if (!img) return null

  return (
    <figure className="my-8">
      <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
        <img
          src={img.src}
          alt={img.alt}
          width={1200}
          height={630}
          loading="lazy"
          decoding="async"
          className="w-full h-auto"
        />
      </div>
      <figcaption className="text-xs text-text-muted mt-2 text-center">{img.alt}</figcaption>
    </figure>
  )
}
