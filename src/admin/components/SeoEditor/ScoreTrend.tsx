'use client'

import React from 'react'

interface Snapshot {
  score: number
  timestamp: string
  breakdown?: { technical: number; ctr: number; geo: number; info: number }
}

function Sparkline({ points, width = 100, height = 24 }: { points: number[]; width?: number; height?: number }) {
  if (points.length < 2) return null
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const step = width / (points.length - 1)

  const pathData = points.map((p, i) => {
    const x = i * step
    const y = height - ((p - min) / range) * (height - 4) - 2
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  const lastScore = points[points.length - 1]
  const prevScore = points[points.length - 2]
  const color = lastScore >= prevScore ? '#059669' : '#dc2626'

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={pathData} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => {
        const x = i * step
        const y = height - ((p - min) / range) * (height - 4) - 2
        return <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 2.5 : 1.5} fill={i === points.length - 1 ? color : '#52525b'} />
      })}
    </svg>
  )
}

export function SparklineInline({ snapshots }: { snapshots: Snapshot[] }) {
  if (snapshots.length < 2) return null
  const points = snapshots.slice(-10).map(s => s.score)
  const last = points[points.length - 1]
  const prev = points[points.length - 2]
  const diff = last - prev
  const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '→'
  const color = diff > 0 ? '#059669' : diff < 0 ? '#dc2626' : '#71717a'

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Sparkline points={points} width={60} height={18} />
      <span style={{ fontSize: 10, color, fontWeight: 600 }}>{arrow}{Math.abs(diff)}</span>
    </div>
  )
}

export function ScoreTrendDetail({ snapshots }: { snapshots: Snapshot[] }) {
  if (snapshots.length === 0) {
    return (
      <div style={{ padding: 16, borderRadius: 10, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', fontSize: 13, color: '#a1a1aa' }}>
        No history yet. Click "Snapshot Scores" to start tracking.
      </div>
    )
  }

  const recent = snapshots.slice(-10)
  const points = recent.map(s => s.score)
  const first = points[0]
  const last = points[points.length - 1]
  const change = last - first
  const changeColor = change > 0 ? '#059669' : change < 0 ? '#dc2626' : '#71717a'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Score History
        </span>
        <span style={{ fontSize: 12, color: changeColor, fontWeight: 600 }}>
          {change > 0 ? '+' : ''}{change} pts ({snapshots.length} snapshots)
        </span>
      </div>

      <div style={{ padding: '12px 8px', background: 'rgba(39,39,42,0.5)', borderRadius: 8 }}>
        <Sparkline points={points} width={280} height={48} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 140, overflowY: 'auto' }}>
        {[...recent].reverse().map((s, i) => {
          const date = new Date(s.timestamp)
          const prevScore = i < recent.length - 1 ? [...recent].reverse()[i + 1]?.score : null
          const diff = prevScore !== null ? s.score - prevScore : 0
          return (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '4px 8px', fontSize: 11, borderRadius: 4,
              background: i === 0 ? 'rgba(59,130,246,0.06)' : 'transparent',
            }}>
              <span style={{ color: '#71717a' }}>
                {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {s.breakdown && (
                  <span style={{ fontSize: 9, color: '#52525b' }}>
                    T:{s.breakdown.technical} C:{s.breakdown.ctr} G:{s.breakdown.geo} I:{s.breakdown.info}
                  </span>
                )}
                <span style={{ fontWeight: 600, color: '#fafafa' }}>{s.score}%</span>
                {diff !== 0 && (
                  <span style={{ fontSize: 10, color: diff > 0 ? '#059669' : '#dc2626', fontWeight: 600 }}>
                    {diff > 0 ? '+' : ''}{diff}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
