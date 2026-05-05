'use client'

import React, { useState, useEffect } from 'react'

interface PricingTier { id: string; name: string; slug: string; description?: string; features?: { feature: string }[]; isFeatured?: boolean; sortOrder?: number }

export default function PricingView() {
  const [tiers, setTiers] = useState<PricingTier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pricing-tiers?limit=10&sort=sortOrder&depth=0')
      .then(r => r.json())
      .then(d => setTiers(d.docs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: '80px 0', textAlign: 'center' }}><div style={{ width: 28, height: 28, border: '2.5px solid var(--sc-border)', borderTopColor: '#dc2626', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.6s linear infinite' }} /></div>

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4px 0 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>Packages</h1>
          <p style={{ fontSize: 14, color: 'var(--sc-text-secondary)', margin: '4px 0 0' }}>Pricing tiers and feature matrix</p>
        </div>
        <a href="/admin/collections/pricing-tiers/create" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: 'var(--sc-red)', color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 14px rgba(220,38,38,0.25)', textDecoration: 'none' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Add package
        </a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {tiers.map(p => (
          <div key={p.id} onClick={() => window.location.href = `/admin/collections/pricing-tiers/${p.id}`} style={{ borderRadius: 16, border: p.isFeatured ? '2px solid var(--sc-red)' : '1px solid var(--sc-border)', background: 'var(--sc-surface)', overflow: 'hidden', boxShadow: 'var(--sc-shadow)', textDecoration: 'none', color: 'inherit', transition: 'all 180ms ease', position: 'relative' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
          >
            {p.isFeatured && <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: 'var(--sc-red)', color: '#fff', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', padding: '2px 12px', borderRadius: '0 0 8px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Popular</div>}
            <div style={{ padding: '24px 20px', textAlign: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--sc-text-secondary)', margin: '0 0 16px' }}>{p.description || ''}</p>
              <div style={{ textAlign: 'left' }}>
                {(p.features || []).map((f, fi) => (
                  <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 13, color: 'var(--sc-text-secondary)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 6 9 17l-5-5" /></svg>
                    {f.feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
