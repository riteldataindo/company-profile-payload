type DiagramKind = 'traffic' | 'flow-zones' | 'operations'

interface SignalDiagramProps {
  kind: DiagramKind
  locale: string
  caption?: string
}

export const signalDiagramCopy = {
  en: {
    stamp: 'Conceptual sample',
    traffic: 'Entrance traffic',
    flow: 'Zone comparison',
    operations: 'Operating review',
  },
  id: {
    stamp: 'Sampel konseptual',
    traffic: 'Lalu lintas pintu masuk',
    flow: 'Perbandingan zona',
    operations: 'Tinjauan operasional',
  },
} as const

export function SignalDiagram({ kind, locale, caption }: SignalDiagramProps) {
  const labels = locale === 'id' ? signalDiagramCopy.id : signalDiagramCopy.en
  const title = kind === 'traffic' ? labels.traffic : kind === 'flow-zones' ? labels.flow : labels.operations

  return (
    <figure className="signal-diagram" data-kind={kind}>
      <div className="signal-diagram__stage" role="img" aria-label={caption || title}>
        <span className="signal-diagram__stamp">{labels.stamp}</span>
        <svg viewBox="0 0 320 180" className="signal-diagram__svg" aria-hidden="true">
          <rect x="16" y="20" width="288" height="140" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.22" />
          {kind === 'traffic' && (
            <>
              <path d="M48 148 L160 36 L272 148" fill="rgba(59,130,246,0.12)" stroke="#3B82F6" strokeWidth="1.5" />
              <line x1="64" y1="126" x2="256" y2="126" stroke="#14B8A6" strokeWidth="2" strokeDasharray="6 5" />
              <text x="24" y="38" className="signal-diagram__tick">ENT</text>
              <text x="248" y="168" className="signal-diagram__tick">T</text>
            </>
          )}
          {kind === 'flow-zones' && (
            <>
              <rect x="36" y="40" width="92" height="100" fill="rgba(20,184,166,0.10)" stroke="#14B8A6" />
              <rect x="140" y="56" width="80" height="84" fill="rgba(245,158,11,0.12)" stroke="#F59E0B" />
              <rect x="232" y="48" width="56" height="92" fill="rgba(139,92,246,0.12)" stroke="#8B5CF6" />
              <path d="M50 130 C90 110 130 90 170 86 S230 92 270 70" fill="none" stroke="#14B8A6" strokeWidth="1.5" />
              <text x="48" y="56" className="signal-diagram__tick">Z1</text>
              <text x="152" y="72" className="signal-diagram__tick">Z2</text>
              <text x="242" y="64" className="signal-diagram__tick">Z3</text>
            </>
          )}
          {kind === 'operations' && (
            <>
              <line x1="40" y1="132" x2="280" y2="132" stroke="currentColor" strokeOpacity="0.25" />
              <polyline points="40,110 88,104 130,90 176,98 220,72 280,78" fill="none" stroke="#3B82F6" strokeWidth="1.75" />
              <circle cx="220" cy="72" r="4" fill="#DC2626" />
              <text x="228" y="68" className="signal-diagram__tick">EXC</text>
              <text x="40" y="148" className="signal-diagram__tick">09:00</text>
              <text x="236" y="148" className="signal-diagram__tick">17:00</text>
            </>
          )}
        </svg>
      </div>
      {caption && <figcaption className="signal-diagram__caption">{caption}</figcaption>}
    </figure>
  )
}
