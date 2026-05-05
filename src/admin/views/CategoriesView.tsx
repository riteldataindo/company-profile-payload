'use client'

import React, { useState, useEffect } from 'react'

interface Category { id: string; name: string; slug: string }

const COLORS = ['#2563eb', '#d97706', '#059669', '#7c3aed', '#dc2626', '#0891b2', '#be185d']

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

export default function CategoriesView() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog-categories?limit=50&sort=name&depth=0')
      .then(r => r.json())
      .then(d => setCats(d.docs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: '80px 0', textAlign: 'center' }}><div style={{ width: 28, height: 28, border: '2.5px solid var(--sc-border)', borderTopColor: '#dc2626', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.6s linear infinite' }} /></div>

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4px 0 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>Categories</h1>
          <p style={{ fontSize: 14, color: 'var(--sc-text-secondary)', margin: '4px 0 0' }}>Blog post categories</p>
        </div>
        <a href="/admin/collections/blog-categories/create" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: 'var(--sc-red)', color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 14px rgba(220,38,38,0.25)', textDecoration: 'none' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Add category
        </a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 14 }}>
        {cats.map((c, i) => (
          <div key={c.id} onClick={() => window.location.href = `/admin/collections/blog-categories/${c.id}`} style={{ borderRadius: 16, border: '1px solid var(--sc-border)', background: 'var(--sc-surface)', overflow: 'hidden', boxShadow: 'var(--sc-shadow)', cursor: 'pointer', color: 'inherit', transition: 'all 180ms ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--sc-border-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--sc-border)' }}
          >
            <div style={{ height: 3, background: COLORS[i % COLORS.length], borderRadius: '16px 16px 0 0' }} />
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: 'var(--sc-text-muted)', fontFamily: 'var(--font-mono)' }}>/{c.slug}</div>
              </div>
              <HoverActions editHref={`/admin/collections/blog-categories/${c.id}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
