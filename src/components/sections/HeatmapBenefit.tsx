'use client'

import { Flame, Check } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

function HeatmapMockup() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-[0_0_40px_rgba(239,68,68,0.2)]">
      {/* Dashboard chrome */}
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg-base/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-primary-500" />
          <span className="text-xs font-semibold text-text-secondary">Heatmap — Pondok Indah Mall</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-text-muted">
          <span className="rounded bg-bg-card px-2 py-0.5">Today</span>
          <span>10:00 — 18:00</span>
        </div>
      </div>

      {/* Floor plan with heatmap overlay */}
      <div className="relative aspect-[3/2] bg-[#1a1a1f] p-3">
        <svg viewBox="0 0 600 400" className="h-full w-full">
          {/* Store outline */}
          <rect x="20" y="20" width="560" height="360" fill="none" stroke="#3F3F46" strokeWidth="2" rx="4" />

          {/* Zones */}
          <rect x="30" y="30" width="160" height="170" fill="#3F3F46" stroke="#52525B" strokeWidth="0.5" rx="2" />
          <rect x="200" y="30" width="180" height="120" fill="#3F3F46" stroke="#52525B" strokeWidth="0.5" rx="2" />
          <rect x="390" y="30" width="180" height="170" fill="#3F3F46" stroke="#52525B" strokeWidth="0.5" rx="2" />
          <rect x="30" y="210" width="250" height="160" fill="#3F3F46" stroke="#52525B" strokeWidth="0.5" rx="2" />
          <rect x="290" y="210" width="140" height="160" fill="#3F3F46" stroke="#52525B" strokeWidth="0.5" rx="2" />
          <rect x="440" y="210" width="130" height="160" fill="#3F3F46" stroke="#52525B" strokeWidth="0.5" rx="2" />

          {/* Shelving lines */}
          <line x1="60" y1="60" x2="160" y2="60" stroke="#52525B" strokeWidth="1" />
          <line x1="60" y1="90" x2="160" y2="90" stroke="#52525B" strokeWidth="1" />
          <line x1="60" y1="120" x2="160" y2="120" stroke="#52525B" strokeWidth="1" />
          <rect x="220" y="50" width="60" height="30" fill="none" stroke="#52525B" strokeWidth="0.8" rx="2" />
          <rect x="300" y="50" width="60" height="30" fill="none" stroke="#52525B" strokeWidth="0.8" rx="2" />
          <rect x="410" y="50" width="140" height="12" fill="none" stroke="#52525B" strokeWidth="0.8" rx="1" />
          <rect x="410" y="80" width="140" height="12" fill="none" stroke="#52525B" strokeWidth="0.8" rx="1" />
          <rect x="410" y="110" width="140" height="12" fill="none" stroke="#52525B" strokeWidth="0.8" rx="1" />

          {/* Heatmap blobs */}
          <defs>
            <radialGradient id="hot"><stop offset="0%" stopColor="#DC2626" stopOpacity="0.7"/><stop offset="60%" stopColor="#EF4444" stopOpacity="0.3"/><stop offset="100%" stopColor="#EF4444" stopOpacity="0"/></radialGradient>
            <radialGradient id="warm"><stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5"/><stop offset="60%" stopColor="#F59E0B" stopOpacity="0.2"/><stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/></radialGradient>
            <radialGradient id="cool"><stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35"/><stop offset="60%" stopColor="#3B82F6" stopOpacity="0.12"/><stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/></radialGradient>
          </defs>

          {/* Hot zone: entrance area */}
          <ellipse cx="300" cy="370" rx="120" ry="50" fill="url(#hot)" />
          {/* Hot zone: new arrivals display */}
          <ellipse cx="280" cy="90" rx="80" ry="50" fill="url(#hot)" />
          {/* Warm zone: fitting rooms */}
          <ellipse cx="110" cy="120" rx="60" ry="55" fill="url(#warm)" />
          {/* Warm zone: checkout */}
          <ellipse cx="500" cy="300" rx="55" ry="60" fill="url(#warm)" />
          {/* Cool zone: back wall */}
          <ellipse cx="480" cy="90" rx="70" ry="50" fill="url(#cool)" />
          {/* Cool zone: side area */}
          <ellipse cx="80" cy="300" rx="60" ry="50" fill="url(#cool)" />
          {/* Medium zone */}
          <ellipse cx="350" cy="280" rx="60" ry="45" fill="url(#warm)" />

          {/* Zone labels */}
          <text x="110" y="195" fill="#A1A1AA" fontSize="8" textAnchor="middle" fontFamily="Fira Sans">MEN&apos;S</text>
          <text x="290" y="145" fill="#A1A1AA" fontSize="8" textAnchor="middle" fontFamily="Fira Sans">NEW ARRIVALS</text>
          <text x="480" y="195" fill="#A1A1AA" fontSize="8" textAnchor="middle" fontFamily="Fira Sans">WOMEN&apos;S</text>
          <text x="150" y="350" fill="#A1A1AA" fontSize="8" textAnchor="middle" fontFamily="Fira Sans">ACCESSORIES</text>
          <text x="360" y="350" fill="#A1A1AA" fontSize="8" textAnchor="middle" fontFamily="Fira Sans">FITTING</text>
          <text x="500" y="350" fill="#A1A1AA" fontSize="8" textAnchor="middle" fontFamily="Fira Sans">CHECKOUT</text>

          {/* Entrance arrow */}
          <text x="300" y="395" fill="#71717A" fontSize="7" textAnchor="middle" fontFamily="Fira Sans">ENTRANCE</text>
        </svg>

        {/* Mini stats overlay */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <div className="rounded-md bg-bg-base/80 px-2.5 py-1.5 backdrop-blur-sm">
            <div className="font-mono text-sm font-bold text-primary-400">847</div>
            <div className="text-[9px] text-text-muted">Visitors Today</div>
          </div>
          <div className="rounded-md bg-bg-base/80 px-2.5 py-1.5 backdrop-blur-sm">
            <div className="font-mono text-sm font-bold text-amber-400">4.2m</div>
            <div className="text-[9px] text-text-muted">Avg Dwell</div>
          </div>
          <div className="rounded-md bg-bg-base/80 px-2.5 py-1.5 backdrop-blur-sm">
            <div className="font-mono text-sm font-bold text-blue-400">6</div>
            <div className="text-[9px] text-text-muted">Zones</div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute right-3 bottom-3 flex items-center gap-3 rounded-md bg-bg-base/80 px-2.5 py-1.5 backdrop-blur-sm">
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /><span className="text-[9px] text-text-muted">High</span></div>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /><span className="text-[9px] text-text-muted">Medium</span></div>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /><span className="text-[9px] text-text-muted">Low</span></div>
        </div>
      </div>
    </div>
  )
}

export function HeatmapBenefit({ dict }: { dict: Record<string, any> }) {
  const hm = dict.heatmap || {}
  return (
    <section className="px-4 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <ScrollReveal>
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-400">
                <Flame size={14} />
                {hm.badge || 'CCTV AI Heatmaps'}
              </p>
              <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{hm.title || 'See Where Your Customers Go'}</h2>
              <p className="mb-6 text-base leading-relaxed text-text-secondary">
                {hm.desc}
              </p>
              <ul className="flex flex-col gap-3">
                {(hm.bullets || []).map((text: string) => (
                  <li key={text} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <Check size={18} className="mt-0.5 shrink-0 text-primary-500" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <HeatmapMockup />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
