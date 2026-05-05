'use client'

import React, { useState, useEffect } from 'react'

interface Feature { id: string; name: string; slug: string; icon?: string; shortDescription?: string; isVisible?: boolean; sortOrder?: number }

function HoverActions({ editHref }: { editHref: string }) {
  return (
    <div className="sc-act-hide" style={{ display: 'flex', gap: 2 }}>
      <a href={editHref} onClick={e => e.stopPropagation()} title="Edit" style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sc-text-muted)', textDecoration: 'none', transition: 'all 150ms ease' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--sc-surface-2)'; e.currentTarget.style.color = 'var(--sc-text)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sc-text-muted)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </a>
      <button onClick={e => { e.stopPropagation(); e.preventDefault() }} title="Delete" style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sc-text-muted)', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'all 150ms ease' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; e.currentTarget.style.color = '#dc2626' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sc-text-muted)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>
  )
}

const ICON_PATHS: Record<string, string> = {
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0-8 0 4 4 0 0 0 8 0',
  layout: 'M3 3h18v18H3zM3 9h18M9 21V9',
  eye: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
  list: 'M8 6h13M8 12h13M8 18h13',
  'bar-chart': 'M12 20V10M18 20V4M6 20v-4',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  package: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.3 7l8.7 5 8.7-5M12 22V12',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z',
  globe: 'M12 12m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0M2 12h20',
  zap: 'M13 2 3 14h9l-1 10 10-12h-9l1-10z',
}

export default function FeaturesView() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/features?limit=50&sort=sortOrder&depth=0')
      .then(r => r.json())
      .then(d => setFeatures(d.docs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: '80px 0', textAlign: 'center' }}><div style={{ width: 28, height: 28, border: '2.5px solid var(--sc-border)', borderTopColor: '#dc2626', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.6s linear infinite' }} /></div>

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4px 0 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>Features</h1>
          <p style={{ fontSize: 14, color: 'var(--sc-text-secondary)', margin: '4px 0 0' }}>Product features displayed on the website</p>
        </div>
        <a href="/admin/collections/features/create" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: 'var(--sc-red)', color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 14px rgba(220,38,38,0.25)', textDecoration: 'none' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Add feature
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {features.map(f => (
          <div key={f.id} onClick={() => window.location.href = `/admin/collections/features/${f.id}`} style={{ borderRadius: 16, border: '1px solid var(--sc-border)', background: 'var(--sc-surface)', overflow: 'hidden', boxShadow: 'var(--sc-shadow)', cursor: 'pointer', color: 'inherit', transition: 'all 180ms ease', opacity: f.isVisible === false ? 0.5 : 1 }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--sc-border-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--sc-border)' }}
          >
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(220,38,38,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={ICON_PATHS[f.icon || 'zap'] || ICON_PATHS.zap} /></svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: f.isVisible !== false ? '#059669' : 'var(--sc-text-muted)', background: f.isVisible !== false ? 'rgba(5,150,105,0.1)' : 'var(--sc-surface-2)', borderRadius: 20, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.isVisible !== false ? 'visible' : 'hidden'}</span>
                  <HoverActions editHref={`/admin/collections/features/${f.id}`} />
                </div>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, margin: '0 0 4px' }}>{f.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--sc-text-secondary)', lineHeight: 1.4, margin: 0 }}>{f.shortDescription || ''}</p>
              <div style={{ fontSize: 11, color: 'var(--sc-text-muted)', fontFamily: 'var(--font-mono)', marginTop: 10 }}>Sort: {f.sortOrder ?? f.id}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
