import Image from 'next/image'
import type { SolutionKind } from '@/lib/i18n/solution-copy'

type SolutionMeasuredStageProps = {
  locale: string
  kind: SolutionKind
}

const copy = {
  en: {
    stamp: 'Conceptual sample',
    retailAlt: 'Unbranded retail interior with anonymous visitors. Measured overlay marks the entrance line and configured zones.',
    mallAlt: 'Unbranded mall atrium with anonymous visitors. Measured overlay marks a gate line and floor zones.',
    caption: 'Conceptual overlay · Zone IDs and colors are samples, not customer or measured deployment data.',
    legend: {
      entry: 'Entry line',
      flow: 'Flow',
      dwell: 'Dwell',
      occupancy: 'Occupancy',
    },
  },
  id: {
    stamp: 'Sampel konseptual',
    retailAlt: 'Interior retail tanpa merek dengan pengunjung anonim. Overlay terukur menandai garis entrance dan zona terkonfigurasi.',
    mallAlt: 'Atrium mall tanpa merek dengan pengunjung anonim. Overlay terukur menandai garis gate dan zona lantai.',
    caption: 'Overlay konseptual · ID zona dan warna adalah sampel, bukan data pelanggan atau hasil deployment.',
    legend: {
      entry: 'Garis masuk',
      flow: 'Flow',
      dwell: 'Dwell',
      occupancy: 'Occupancy',
    },
  },
} as const

export function SolutionMeasuredStage({ locale, kind }: SolutionMeasuredStageProps) {
  const isMall = kind === 'mall'
  const labels = locale === 'id' ? copy.id : copy.en

  return (
    <figure className="space-y-4">
      <div className="solution-stage editorial-media">
        <Image
          src={isMall ? '/editorial/mall-flow-zones-v4.webp' : '/editorial/retail-path-zones-v4.webp'}
          alt={isMall ? labels.mallAlt : labels.retailAlt}
          width={1536}
          height={1024}
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
        />
        <svg
          className="solution-stage__overlay"
          viewBox="0 0 150 100"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {isMall ? (
            <>
              <path d="M18 78 H132" fill="none" stroke="#14B8A6" strokeWidth="1.6" strokeDasharray="6 4" />
              <rect x="22" y="52" width="28" height="22" fill="#14B8A6" fillOpacity="0.18" stroke="#14B8A6" strokeWidth="1.1" />
              <rect x="62" y="58" width="34" height="18" fill="#F59E0B" fillOpacity="0.18" stroke="#F59E0B" strokeWidth="1.1" />
              <rect x="108" y="50" width="24" height="26" fill="#8B5CF6" fillOpacity="0.18" stroke="#8B5CF6" strokeWidth="1.1" />
              <text x="26" y="64" fill="#FAFAFA" fontFamily="ui-monospace, monospace" fontSize="4" fontWeight="700">Z1</text>
              <text x="66" y="70" fill="#FAFAFA" fontFamily="ui-monospace, monospace" fontSize="4" fontWeight="700">Z2</text>
              <text x="112" y="64" fill="#FAFAFA" fontFamily="ui-monospace, monospace" fontSize="4" fontWeight="700">Z3</text>
              <text x="20" y="76" fill="#FAFAFA" fontFamily="ui-monospace, monospace" fontSize="4" fontWeight="700">G1</text>
            </>
          ) : (
            <>
              <path d="M48 88 H108" fill="none" stroke="#14B8A6" strokeWidth="1.6" strokeDasharray="6 4" />
              <path d="M78 88 C78 72 70 64 62 56 S52 40 52 28" fill="none" stroke="#14B8A6" strokeWidth="1.5" />
              <rect x="18" y="30" width="26" height="40" fill="#14B8A6" fillOpacity="0.18" stroke="#14B8A6" strokeWidth="1.1" />
              <rect x="62" y="34" width="28" height="30" fill="#F59E0B" fillOpacity="0.18" stroke="#F59E0B" strokeWidth="1.1" />
              <rect x="108" y="32" width="24" height="36" fill="#8B5CF6" fillOpacity="0.18" stroke="#8B5CF6" strokeWidth="1.1" />
              <text x="22" y="42" fill="#FAFAFA" fontFamily="ui-monospace, monospace" fontSize="4" fontWeight="700">Z1</text>
              <text x="66" y="46" fill="#FAFAFA" fontFamily="ui-monospace, monospace" fontSize="4" fontWeight="700">Z2</text>
              <text x="112" y="44" fill="#FAFAFA" fontFamily="ui-monospace, monospace" fontSize="4" fontWeight="700">Z3</text>
            </>
          )}
        </svg>
        <span className="solution-stage__stamp">{labels.stamp}</span>
        <ul className="solution-stage__legend">
          <li data-swatch="entry">{labels.legend.entry}</li>
          <li data-swatch="flow">{labels.legend.flow}</li>
          <li data-swatch="dwell">{labels.legend.dwell}</li>
          <li data-swatch="occupancy">{labels.legend.occupancy}</li>
        </ul>
      </div>
      <figcaption>
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          {labels.stamp}
        </span>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{labels.caption}</p>
      </figcaption>
    </figure>
  )
}
