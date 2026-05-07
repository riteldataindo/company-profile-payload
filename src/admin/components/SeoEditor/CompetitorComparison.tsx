'use client'

import React, { useState } from 'react'

interface PageMetrics {
  url: string
  domain: string
  title: string
  titleLength: number
  description: string
  descLength: number
  wordCount: number
  hasSchema: boolean
  schemaTypes: string[]
  imageCount: number
  h1: string
  h2Count: number
  fetchedAt: string
}

interface AnalysisResult {
  your: PageMetrics | null
  competitors: PageMetrics[]
  averages: { titleLength: number; descLength: number; wordCount: number; h2Count: number; schemaRate: number }
  insights: string[]
}

interface CompetitorDef {
  id: string
  name: string
  domain: string
  urls: { topic: string; url: string }[]
}

function MetricCell({ value, avg, unit = '' }: { value: number; avg: number; unit?: string }) {
  const ratio = avg > 0 ? value / avg : 1
  const color = ratio >= 0.9 ? '#059669' : ratio >= 0.7 ? '#d97706' : '#dc2626'
  return <span style={{ color, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{value}{unit}</span>
}

export function CompetitorComparison({ yourUrl, siteUrl }: { yourUrl?: string; siteUrl?: string }) {
  const [competitors, setCompetitors] = useState<CompetitorDef[]>([])
  const [selectedTopic, setSelectedTopic] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [configLoaded, setConfigLoaded] = useState(false)

  const loadConfig = async () => {
    if (configLoaded) return
    try {
      const resp = await fetch('/api/seo-competitors')
      const data = await resp.json()
      setCompetitors(data.competitors || [])
      setConfigLoaded(true)
    } catch { /* ignore */ }
  }

  const analyze = async () => {
    if (!selectedTopic) return
    setLoading(true)
    try {
      const urls = competitors.flatMap(c => c.urls.filter(u => u.topic === selectedTopic).map(u => u.url))
      const pageUrl = yourUrl || siteUrl || ''
      const resp = await fetch('/api/seo-competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yourUrl: pageUrl, competitorUrls: urls }),
      })
      setResult(await resp.json())
    } catch { /* ignore */ }
    setLoading(false)
  }

  if (!configLoaded) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Competitor Comparison
        </div>
        <button onClick={loadConfig} style={{
          padding: '8px 16px', borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
          color: '#f59e0b', fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>
          Load Competitors
        </button>
      </div>
    )
  }

  const topics = [...new Set(competitors.flatMap(c => c.urls.map(u => u.topic)))]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Competitor Comparison
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select
          value={selectedTopic}
          onChange={e => setSelectedTopic(e.target.value)}
          style={{
            flex: 1, padding: '6px 10px', borderRadius: 6, background: '#27272a', border: '1px solid #3f3f46',
            color: '#fafafa', fontSize: 12,
          }}
        >
          <option value="">Select topic...</option>
          {topics.map(t => <option key={t} value={t}>{t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
        </select>
        <button
          onClick={analyze}
          disabled={loading || !selectedTopic}
          style={{
            padding: '6px 14px', borderRadius: 6, background: loading ? '#3f3f46' : '#f59e0b',
            color: loading ? '#71717a' : '#000', fontSize: 12, fontWeight: 600, border: 'none', cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {result && (
        <>
          {/* Insights */}
          {result.insights.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {result.insights.map((insight, i) => (
                <div key={i} style={{
                  padding: '6px 10px', borderRadius: 6, fontSize: 11,
                  background: insight.includes('competitive') ? 'rgba(5,150,105,0.08)' : 'rgba(245,158,11,0.08)',
                  border: `1px solid ${insight.includes('competitive') ? 'rgba(5,150,105,0.2)' : 'rgba(245,158,11,0.2)'}`,
                  color: '#a1a1aa',
                }}>
                  {insight}
                </div>
              ))}
            </div>
          )}

          {/* Comparison Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #3f3f46' }}>
                  <th style={{ textAlign: 'left', padding: '6px 8px', color: '#71717a', fontWeight: 600 }}>Metric</th>
                  {result.your && <th style={{ textAlign: 'right', padding: '6px 8px', color: '#059669', fontWeight: 700 }}>You</th>}
                  {result.competitors.map((c, i) => (
                    <th key={i} style={{ textAlign: 'right', padding: '6px 8px', color: '#71717a', fontWeight: 600 }}>
                      {c.domain.replace('www.', '').split('.')[0]}
                    </th>
                  ))}
                  <th style={{ textAlign: 'right', padding: '6px 8px', color: '#d97706', fontWeight: 600 }}>AVG</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Title Length', key: 'titleLength', avg: result.averages.titleLength, unit: 'ch' },
                  { label: 'Desc Length', key: 'descLength', avg: result.averages.descLength, unit: 'ch' },
                  { label: 'Word Count', key: 'wordCount', avg: result.averages.wordCount, unit: '' },
                  { label: 'H2 Headings', key: 'h2Count', avg: result.averages.h2Count, unit: '' },
                  { label: 'Images', key: 'imageCount', avg: 0, unit: '' },
                ].map(({ label, key, avg, unit }) => (
                  <tr key={key} style={{ borderBottom: '1px solid rgba(63,63,70,0.5)' }}>
                    <td style={{ padding: '5px 8px', color: '#a1a1aa' }}>{label}</td>
                    {result!.your && (
                      <td style={{ textAlign: 'right', padding: '5px 8px' }}>
                        <MetricCell value={(result!.your as any)[key]} avg={avg} unit={unit} />
                      </td>
                    )}
                    {result!.competitors.map((c, i) => (
                      <td key={i} style={{ textAlign: 'right', padding: '5px 8px', color: '#71717a' }}>
                        {(c as any)[key]}{unit}
                      </td>
                    ))}
                    <td style={{ textAlign: 'right', padding: '5px 8px', color: '#d97706', fontWeight: 600 }}>
                      {avg}{unit}
                    </td>
                  </tr>
                ))}
                <tr style={{ borderBottom: '1px solid rgba(63,63,70,0.5)' }}>
                  <td style={{ padding: '5px 8px', color: '#a1a1aa' }}>Schema</td>
                  {result.your && (
                    <td style={{ textAlign: 'right', padding: '5px 8px', color: result.your.hasSchema ? '#059669' : '#dc2626', fontWeight: 600 }}>
                      {result.your.hasSchema ? `Yes (${result.your.schemaTypes.length})` : 'No'}
                    </td>
                  )}
                  {result.competitors.map((c, i) => (
                    <td key={i} style={{ textAlign: 'right', padding: '5px 8px', color: c.hasSchema ? '#059669' : '#71717a' }}>
                      {c.hasSchema ? `Yes (${c.schemaTypes.length})` : 'No'}
                    </td>
                  ))}
                  <td style={{ textAlign: 'right', padding: '5px 8px', color: '#d97706', fontWeight: 600 }}>
                    {result.averages.schemaRate}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: 9, color: '#52525b', marginTop: 2 }}>
            Data cached 24h. Competitors: {competitors.map(c => c.name).join(', ')}.
          </div>
        </>
      )}
    </div>
  )
}
