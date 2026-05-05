'use client'

import React, { useState, useEffect } from 'react'

interface Sub {
  id: string
  email: string
  formType: string
  status: string
  createdAt: string
  data?: { name?: string; phone?: string; company?: string; message?: string }
}

function Tag({ label, variant }: { label: string; variant: string }) {
  const map: Record<string, { c: string; bg: string }> = {
    green: { c: '#059669', bg: 'rgba(5,150,105,0.1)' },
    red: { c: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
    blue: { c: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
    muted: { c: 'var(--sc-text-muted)', bg: 'var(--sc-surface-2)' },
  }
  const s = map[variant] || map.muted
  return <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.c, background: s.bg, borderRadius: 20, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{label}</span>
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function initials(name?: string, email?: string) {
  if (name) return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  if (email) return email[0].toUpperCase()
  return '?'
}

export default function InboxView() {
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Sub | null>(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/form-submissions?limit=50&sort=-createdAt&depth=0')
      .then(r => r.json())
      .then(d => { setSubs(d.docs || []); if (d.docs?.length) setSelected(d.docs[0]) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = subs.filter(s => filter === 'all' || s.status === filter)
  const panelStyle: React.CSSProperties = { borderRadius: 16, border: '1px solid var(--sc-border)', background: 'var(--sc-surface)', boxShadow: 'var(--sc-shadow)', overflow: 'hidden' }

  if (loading) return (
    <div style={{ padding: '80px 0', textAlign: 'center' }}>
      <div style={{ width: 28, height: 28, border: '2.5px solid var(--sc-border)', borderTopColor: '#dc2626', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.6s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4px 0 48px' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>Submissions</h1>
        <p style={{ fontSize: 14, color: 'var(--sc-text-secondary)', marginTop: 4, margin: '4px 0 0' }}>Contact and demo request submissions</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['all', 'new', 'read', 'replied'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, textTransform: 'capitalize', border: '1px solid', borderColor: filter === f ? 'var(--sc-text)' : 'var(--sc-border)', background: filter === f ? 'var(--sc-text)' : 'var(--sc-surface)', color: filter === f ? 'var(--sc-bg)' : 'var(--sc-text-muted)', cursor: 'pointer', transition: 'all 150ms ease' }}>
            {f === 'all' ? `All (${subs.length})` : f === 'new' ? `New (${subs.filter(s => s.status === 'new').length})` : f}
          </button>
        ))}
      </div>

      {subs.length === 0 ? (
        <div style={{ ...panelStyle, padding: 48, textAlign: 'center', color: 'var(--sc-text-muted)', fontSize: 14 }}>No submissions yet</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 14, minHeight: 500 }}>
          <div style={{ ...panelStyle, overflow: 'auto' }}>
            {filtered.map(sub => {
              const name = sub.data?.name || sub.email
              return (
                <div key={sub.id} onClick={() => setSelected(sub)} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--sc-border)', cursor: 'pointer', transition: 'all 180ms ease', background: selected?.id === sub.id ? 'var(--sc-surface-hover)' : sub.status === 'new' ? 'rgba(220,38,38,0.04)' : 'transparent', borderLeft: selected?.id === sub.id ? '3px solid var(--sc-red)' : '3px solid transparent' }}
                  onMouseEnter={e => { if (selected?.id !== sub.id) e.currentTarget.style.background = 'var(--sc-surface-2)' }}
                  onMouseLeave={e => { if (selected?.id !== sub.id) e.currentTarget.style.background = sub.status === 'new' ? 'rgba(220,38,38,0.04)' : 'transparent' }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: sub.status === 'new' ? 'var(--sc-red)' : 'var(--sc-surface-2)', color: sub.status === 'new' ? '#fff' : 'var(--sc-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{initials(sub.data?.name, sub.email)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: sub.status === 'new' ? 700 : 500 }}>{name}</span>
                      <span style={{ fontSize: 11, color: 'var(--sc-text-muted)', fontFamily: 'var(--font-mono)' }}>{formatDate(sub.createdAt)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--sc-text-muted)', marginBottom: 4 }}>{sub.formType === 'demo' ? 'Demo Request' : 'Contact'}</div>
                    <div style={{ fontSize: 13, color: 'var(--sc-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.data?.message || sub.email}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ ...panelStyle, display: 'flex', flexDirection: 'column' }}>
            {selected ? (
              <>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--sc-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{selected.data?.name || selected.email}</div>
                    <div style={{ fontSize: 13, color: 'var(--sc-text-muted)', fontFamily: 'var(--font-mono)' }}>{selected.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Tag label={selected.formType === 'demo' ? 'Demo' : 'Contact'} variant="blue" />
                    <Tag label={selected.status} variant={selected.status === 'new' ? 'red' : selected.status === 'replied' ? 'green' : 'muted'} />
                  </div>
                </div>
                <div style={{ flex: 1, padding: '20px 24px' }}>
                  <div style={{ fontSize: 12, color: 'var(--sc-text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>{formatDate(selected.createdAt)}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--sc-text-secondary)' }}>{selected.data?.message || 'No message content'}</div>
                  {selected.data?.phone && <div style={{ marginTop: 16, fontSize: 13, color: 'var(--sc-text-muted)' }}>Phone: {selected.data.phone}</div>}
                  {selected.data?.company && <div style={{ marginTop: 4, fontSize: 13, color: 'var(--sc-text-muted)' }}>Company: {selected.data.company}</div>}
                </div>
                <div style={{ padding: '14px 24px', borderTop: '1px solid var(--sc-border)', display: 'flex', gap: 8 }}>
                  <a href={`/admin/collections/form-submissions/${selected.id}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: 'var(--sc-red)', color: '#fff', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 14px rgba(220,38,38,0.25)', textDecoration: 'none' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </a>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sc-text-muted)', fontSize: 14 }}>Select a submission to view</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
