'use client'

import React, { useState, useEffect } from 'react'

interface Location { id: string; cityName: string; longitude: number; latitude: number; isMajor?: boolean; isVisible?: boolean; sortOrder?: number }

export default function LocationsView() {
  const [locs, setLocs] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/deployment-locations?limit=50&sort=sortOrder&depth=0')
      .then(r => r.json())
      .then(d => setLocs(d.docs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: '80px 0', textAlign: 'center' }}><div style={{ width: 28, height: 28, border: '2.5px solid var(--sc-border)', borderTopColor: '#dc2626', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.6s linear infinite' }} /></div>

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4px 0 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>Locations</h1>
          <p style={{ fontSize: 14, color: 'var(--sc-text-secondary)', margin: '4px 0 0' }}>Deployment locations on the Indonesia map</p>
        </div>
        <a href="/admin/collections/deployment-locations/create" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: 'var(--sc-red)', color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 14px rgba(220,38,38,0.25)', textDecoration: 'none' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Add location
        </a>
      </div>
      <div style={{ borderRadius: 16, border: '1px solid var(--sc-border)', background: 'var(--sc-surface)', overflow: 'hidden', boxShadow: 'var(--sc-shadow)' }}>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 70px', padding: '12px 20px', borderBottom: '1px solid var(--sc-border)', gap: 12, minWidth: 480 }}>
            {['City', 'Coordinates', 'Major', ''].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--sc-text-muted)' }}>{h}</span>
            ))}
          </div>
          {locs.map((loc, i) => (
            <a key={loc.id} href={`/admin/collections/deployment-locations/${loc.id}`} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 70px', padding: '10px 20px', borderBottom: i < locs.length - 1 ? '1px solid var(--sc-border)' : 'none', gap: 12, alignItems: 'center', transition: 'all 180ms ease', minWidth: 480, textDecoration: 'none', color: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--sc-surface-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={loc.isMajor ? '#dc2626' : 'var(--sc-text-muted)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{loc.cityName}</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--sc-text-muted)', fontFamily: 'var(--font-mono)' }}>{loc.latitude?.toFixed(2)}, {loc.longitude?.toFixed(2)}</span>
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: loc.isMajor ? '#059669' : 'var(--sc-text-muted)', background: loc.isMajor ? 'rgba(5,150,105,0.1)' : 'var(--sc-surface-2)', borderRadius: 20, padding: '3px 10px', textTransform: 'uppercase', textAlign: 'center' }}>{loc.isMajor ? 'major' : 'minor'}</span>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--sc-text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
